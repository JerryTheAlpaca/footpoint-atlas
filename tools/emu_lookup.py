#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按车次和日期查实际担当的动车组车号。

数据源：
    api.rail.re/train/{车次}  —— 车次最近若干次实际担当的车组号（date、emu_no）。
        上游只留最近 30 条记录，且只有动车组（G/D/C）；普速不在里面。它不发
        CORS 头，所以浏览器只能打本模块，由 serve.py 的 /api/emu-unit 转发。
    12306 leftTicket          —— 只在 rail.re 没有这天记录时才打，用余票行的
        内部车次码解出复车次：同一趟车跨线换号，rail.re 可能只记了另一个号。
        内部码里嵌的是始发那一段的号，例如 5l000G173603 在上海虹桥→南京南
        显示成 G1736，在南京南→武汉显示成 G1737。

对应关系拿不到就照实说查不到，绝不按"车次号 ±1"编配对。
"""

from __future__ import annotations

import http.cookiejar
import json
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta

RAILRE_BASE = "https://api.rail.re"
STATION_NAME_JS = "https://kyfw.12306.cn/otn/resources/js/framework/station_name.js"
LEFT_TICKET_INIT = "https://kyfw.12306.cn/otn/leftTicket/init"
LEFT_TICKET_QUERY = (
    "https://kyfw.12306.cn/otn/leftTicket/{suffix}"
    "?leftTicketDTO.train_date={date}&leftTicketDTO.from_station={ftc}"
    "&leftTicketDTO.to_station={ttc}&purpose_codes=ADULT"
)
# 12306 会轮换 leftTicket 的后缀，逐个试到通为止（与 fetch_train_stops.py 一致）。
QUERY_SUFFIXES = ("query", "queryG", "queryZ", "queryA", "queryO", "queryX",
                  "queryE", "queryU")
USER_AGENT = "footpoint-atlas/1.0 (personal train-ride log, read-only lookups)"
PRESELL_DAYS = 15          # 12306 预售期，超出就没有余票行可解复车次

RAILRE_TTL = 600.0
ALIAS_TTL = 3600.0
TELECODE_TTL = 86400.0
CACHE_MAX = 256
ALIAS_ATTEMPT_LIMIT = 2      # 复车次兜底最多试几个 leftTicket 后缀
ALIAS_BUDGET = 12.0          # 这条兜底路径的总时间预算，超了就按查不到处理
TIMEOUT = 6
# 12306 的站名表整份 200KB 左右，比单次余票查询慢。
TELECODE_TIMEOUT = 10
OFFICIAL_TIMEOUT = 5

MAX_VARIANTS = 4

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TRAIN_RE = re.compile(r"^[GDC]\d{1,4}$")
TRAIN_TOKEN_RE = re.compile(r"[GDC]?\d{1,4}")
UNIT_SERIAL_RE = re.compile(r"^(?P<type>[A-Z][A-Z0-9]*)(?P<serial>\d{4})$")

# 动车组型号族：同族的长名写在短名前面，先匹配到谁就按谁切；剩下的字母当作
# -A/-Z/-AS 这类子型号。上游存的号是去掉全部连字符的（CR400BFZ5267），这里还原成
# 手写习惯的 "CR400BF-Z-5267"，好和已有记录、车型排行、车号重逢对得上。
# 清单里是特例（如 CR200JS 的 S 属于型号名本身）；没见过的 CR 按通例切在 F 或 J 后面。
CR_FAMILY_RE = re.compile(r"^CR\d{3}[A-Z]?[FJ]")
EMU_FAMILIES = (
    "CRH380AL", "CRH380BL", "CRH380AM", "CRH380A", "CRH380B", "CRH380C",
    "CRH380D", "CRH1A", "CRH1B", "CRH1E", "CRH1G",
    "CRH2A", "CRH2B", "CRH2C", "CRH2D", "CRH2E", "CRH2G",
    "CRH3A", "CRH3C", "CRH3E", "CRH5A", "CRH5E", "CRH5G", "CRH5H",
    "CRH6A", "CRH6F", "CRH6G", "CR200JS", "CR200J", "CR300AF", "CR300BF",
    "CR400AF", "CR400BF", "CR450AF", "CR450BF",
)

_lock = threading.Lock()
_railre_cache: dict[str, tuple[float, list[dict]]] = {}
_alias_cache: dict[tuple[str, str, str, str], tuple[float, list[str]]] = {}
_telecode_cache: tuple[float, dict[str, str]] | None = None
_opener = None
_opener_built = False
_session_ready = False
_query_suffix: str | None = None


class UpstreamError(RuntimeError):
    """上游取不到数据（网络、超时、格式变了都算）。"""


def _prune(cache: dict, ttl: float) -> None:
    now = time.monotonic()
    for key in [k for k, (stamp, _) in cache.items() if now - stamp >= ttl]:
        cache.pop(key, None)
    while len(cache) > CACHE_MAX:
        cache.pop(next(iter(cache)))


def train_variants(text: object) -> list[str]:
    """车次写法 → 可上游查询的车次号列表。

    "G45/8" 这种复车次写法拆成 G45、G48（缩写的那半按首段前缀补全，与上游
    NormalizeTrainNo 同规则）；普速、纯数字一律判成非动车组，返回空。
    """
    raw = str(text or "").upper().replace("次", "").replace(" ", "")
    if not raw:
        return []
    results: list[str] = []
    initial = ""
    for index, part in enumerate(raw.split("/")):
        match = TRAIN_TOKEN_RE.search(part)
        if not match:
            return []
        token = match.group()
        if index == 0:
            if token[0].isdigit():
                return []
            initial = token
        elif len(token) < len(initial):
            token = initial[: len(initial) - len(token)] + token
        if TRAIN_RE.match(token) and token not in results:
            results.append(token)
        if len(results) >= MAX_VARIANTS:
            break
    return results


def format_unit_no(raw: object) -> str:
    """上游车组号 → "CR400BF-Z-5267"。认不出的号原样返回，不猜。"""
    text = re.sub(r"[^A-Z0-9]", "", str(raw or "").upper())
    match = UNIT_SERIAL_RE.match(text)
    if not match:
        return str(raw or "").strip()
    model, serial = match.group("type"), match.group("serial")
    # 清单先走（特例在内），没命中才按 CR 通例切在 F/J 后面
    family = next((name for name in EMU_FAMILIES if model.startswith(name)), "")
    if not family:
        cr_family = CR_FAMILY_RE.match(model)
        family = cr_family.group() if cr_family else ""
    if not family:
        return "%s-%s" % (model, serial)
    sub = model[len(family):]
    return "-".join([family, sub, serial] if sub else [family, serial])


def units_on_date(rows: list[dict], target: str) -> list[str]:
    """某天担当的车组号列表；两条即重联。"""
    units = {format_unit_no(row.get("emu_no")) for row in rows
             if str(row.get("date", ""))[:10] == target}
    return sorted(unit for unit in units if unit)


def logged_dates(rows: list[dict]) -> list[str]:
    return sorted({str(row.get("date", ""))[:10] for row in rows
                   if DATE_RE.match(str(row.get("date", ""))[:10])})


def _get(url: str, timeout: int = TIMEOUT) -> object:
    """上游取 JSON，网络类错误重试一次。

    api.rail.re 那台机器偶发把 TLS 连接直接掐掉（SSL UNEXPECTED_EOF，curl 同期
    却能通），一次请求失败就当查不到太容易被误判成"没记录"。
    """
    last_error: Exception | None = None
    for attempt in range(2):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                body = response.read().decode("utf-8-sig", "replace")
            return json.loads(body)
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            last_error = exc
            if attempt == 0:
                time.sleep(0.4)
        except ValueError:
            raise UpstreamError("%s 返回的不是 JSON" % url) from None
    raise UpstreamError("%s 取不到：%s" % (url, last_error))


def railre_rows(train: str) -> list[dict]:
    """api.rail.re/train/{车次}：最近若干条 (date, emu_no, train_no)。"""
    if not TRAIN_RE.match(train):
        return []
    with _lock:
        _prune(_railre_cache, RAILRE_TTL)
        hit = _railre_cache.get(train)
        if hit and time.monotonic() - hit[0] < RAILRE_TTL:
            return hit[1]
    payload = _get("%s/train/%s" % (RAILRE_BASE, urllib.parse.quote(train)))
    rows = [row for row in payload if isinstance(row, dict)] if isinstance(payload, list) else []
    with _lock:
        _railre_cache[train] = (time.monotonic(), rows)
    return rows


def _station_telecodes() -> dict[str, str]:
    """站名 → 电报码。整份表缓在内存里，一天刷新一次。"""
    global _telecode_cache
    with _lock:
        if _telecode_cache and time.monotonic() - _telecode_cache[0] < TELECODE_TTL:
            return _telecode_cache[1]
    try:
        request = urllib.request.Request(STATION_NAME_JS,
                                        headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=TELECODE_TIMEOUT) as response:
            body = response.read().decode("utf-8", "replace")
    except (urllib.error.URLError, OSError, TimeoutError) as exc:
        raise UpstreamError("12306 站名表取不到：%s" % exc) from exc
    tele = {}
    for chunk in body.split("@"):
        parts = chunk.split("|")
        if len(parts) > 2 and parts[1]:
            tele[parts[1]] = parts[2]
    if not tele:
        raise UpstreamError("12306 站名表解析为空，格式可能已变")
    with _lock:
        _telecode_cache = (time.monotonic(), tele)
    return tele


def _left_ticket_rows(ftc: str, ttc: str, target: str, deadline: float) -> list[str]:
    """12306 余票行（| 分隔的原字段串），带会话 Cookie，后缀试到通为止。

    这条路径只在填的号查不到这天时才走，界面在等结果，所以后缀最多试
    ALIAS_ATTEMPT_LIMIT 次、通了一个就记住，且不越过 deadline。
    """
    global _opener, _opener_built, _session_ready, _query_suffix
    with _lock:
        if not _opener_built:
            jar = http.cookiejar.CookieJar()
            _opener = urllib.request.build_opener(
                urllib.request.HTTPCookieProcessor(jar))
            _opener.addheaders = [("User-Agent", USER_AGENT),
                                  ("Referer", LEFT_TICKET_INIT)]
            _opener_built = True
        opener = _opener
    if not _session_ready and time.monotonic() < deadline:
        try:
            opener.open(LEFT_TICKET_INIT, timeout=OFFICIAL_TIMEOUT).read()
            _session_ready = True
        except (urllib.error.URLError, OSError, TimeoutError):
            pass    # 拿不到会话也让查询试一次，失败就按查不到处理
    with _lock:
        known = _query_suffix
    suffixes = ([known] if known else []) + [s for s in QUERY_SUFFIXES if s != known]
    last_error: Exception | None = None
    for suffix in suffixes[:ALIAS_ATTEMPT_LIMIT]:
        if time.monotonic() >= deadline:
            raise UpstreamError("复车次兜底超出时间预算")
        url = LEFT_TICKET_QUERY.format(suffix=suffix, date=target, ftc=ftc, ttc=ttc)
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT,
                                                           "Referer": LEFT_TICKET_INIT})
            with opener.open(request, timeout=OFFICIAL_TIMEOUT) as response:
                body = response.read().decode("utf-8-sig", "replace")
            payload = json.loads(body)
        except (urllib.error.URLError, OSError, TimeoutError, ValueError) as exc:
            last_error = exc
            continue
        rows = (payload.get("data") or {}).get("result") if isinstance(payload, dict) else None
        if rows:
            with _lock:
                _query_suffix = suffix
            return rows
        last_error = UpstreamError("该日无余票行")
    raise UpstreamError("12306 余票查不到：%s" % (last_error or "无响应"))


def inner_train_number(train_no: str) -> str:
    """内部车次码里嵌的车次号：5l000G173603 → G1736（与 fetch_train_aliases.py 同规则）。"""
    inner = str(train_no or "")[5:10].lstrip("0")
    return inner if re.match(r"^[A-Z]\d{1,4}$", inner) else ""


def alias_numbers(variants: list[str], target: str, from_station: str,
                  to_station: str) -> list[str]:
    """这趟车的复车次另一个号；解不出就空。"""
    key = (",".join(variants), target, from_station, to_station)
    with _lock:
        _prune(_alias_cache, ALIAS_TTL)
        hit = _alias_cache.get(key)
        if hit and time.monotonic() - hit[0] < ALIAS_TTL:
            return hit[1]
    found: list[str] = []
    deadline = time.monotonic() + ALIAS_BUDGET
    try:
        today = date.today()
        record_day = date.fromisoformat(target)
        queryable = today <= record_day <= today + timedelta(days=PRESELL_DAYS)
        tele = _station_telecodes() if (queryable and time.monotonic() < deadline) else {}
        if queryable and from_station in tele and to_station in tele:
            ftc, ttc = tele[from_station], tele[to_station]
            for row in _left_ticket_rows(ftc, ttc, target, deadline):
                fields = row.split("|")
                if len(fields) < 4 or fields[3].strip().upper() not in variants:
                    continue
                inner = inner_train_number(fields[2])
                if inner and inner not in variants and inner not in found:
                    found.append(inner)
    except (UpstreamError, ValueError):
        found = []
    with _lock:
        _alias_cache[key] = (time.monotonic(), found)
    return found


def _result(units: list[str], used: str, via_alias: bool, tried: list[str],
            window: list[str]) -> dict:
    reunion = len(units) > 1
    return {
        "matched": True,
        "value": "+".join(units) + ("重联" if reunion else ""),
        "units": units,
        "reunion": reunion,
        "usedTrain": used,
        "viaAlias": via_alias,
        "reason": None,
        "tried": tried,
        "window": {"from": window[0], "to": window[-1]} if window else None,
    }


def _miss(reason: str, tried: list[str], window: list[str]) -> dict:
    return {
        "matched": False,
        "value": None,
        "units": [],
        "reunion": False,
        "usedTrain": None,
        "viaAlias": False,
        "reason": reason,
        "tried": tried,
        "window": {"from": window[0], "to": window[-1]} if window else None,
    }


def lookup_vehicle(train: object, target: object, from_station: str = "",
                   to_station: str = "") -> dict:
    """车次 + 日期 → 车号。查不到时照实返回原因，由界面退回手工填写。"""
    if not DATE_RE.match(str(target or "")):
        return _miss("bad_date", [], [])
    target = str(target)
    variants = train_variants(train)
    if not variants:
        return _miss("not_emu", [], [])

    tried: list[str] = []
    window: list[str] = []
    failed = True
    for number in variants:
        tried.append(number)
        try:
            rows = railre_rows(number)
        except UpstreamError:
            continue
        failed = False
        units = units_on_date(rows, target)
        if units:
            return _result(units, number, False, tried, window)
        window = sorted(set(window) | set(logged_dates(rows)))
    if failed:
        return _miss("upstream", tried, window)

    # 这天在填的号下查不到：拿 12306 的内部车次码解复车次，另一个号可能记着这天。
    # 号上有没有别的日期的记录不作为条件——记在另一个号下时，本号也可能有旧记录。
    for alias in alias_numbers(variants, target, str(from_station or ""), str(to_station or "")):
        if alias in tried or not TRAIN_RE.match(alias):
            continue
        tried.append(alias)
        try:
            rows = railre_rows(alias)
        except UpstreamError:
            continue
        units = units_on_date(rows, target)
        if units:
            return _result(units, alias, True, tried, window)
        window = sorted(set(window) | set(logged_dates(rows)))
    return _miss("outside_window" if window else "no_log", tried, window)


def clear_caches() -> None:
    """测试用：清掉进程内缓存。"""
    global _telecode_cache, _opener, _opener_built, _session_ready, _query_suffix
    with _lock:
        _railre_cache.clear()
        _alias_cache.clear()
        _telecode_cache = None
        _opener = None
        _opener_built = False
        _session_ready = False
        _query_suffix = None
