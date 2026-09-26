# -*- coding: utf-8 -*-
"""路路通时刻表离线库 routes.dat 的解析器（只作构建期探针，不入库、不上前端）。

routes.dat 两层数据，全部多字节整数为大端，字符串为 [u8 字节数] + UTF-8：

① 线路拓扑：[u32 条数] + 每条 [u32 序号][u8 名长]线路名[u32 站数]
   + 每站 [u8 名长]站名[u8 略号长]略号[i32 保留(实测恒 -1)][i32 站索引]
   第 0 条是列名行（线路名 / 车站名 / 略号），跳过它但校验它确实还在；
   它一旦变样，说明格式改版，后面所有读数都不可信。

② 车次经由：[u32 条数] + 每条 [u8 长]train_no[u8 长]终点站[u32 点数]
   + 每点 [u8 名长]站名[u32 站索引]
   点列是"运行线决策点"（换线点、线路所），不是办客站序列：普通中间站
   被跳过，全程不换线的车次只有一两个点。终点站另存一个字段，末点常是
   进站前的接近站（K146 的点列止于 灞桥，西安 在终点站字段里）。

私有格式无文档且改版过（PC 6.2 改过一次），所以任何读数都做硬校验：
消费字节数必须等于文件长度、声明条数必须与实读条数相等、字符串必须严格
UTF-8。不符即抛 LltFormatDrift 并报到具体偏移，绝不静默截断或替换。

数据版权属路路通工作室：解析结果只用于本地构建与核对，原始字节与线路
有序站序列一律不进提交产物（见 tools/llt_feasibility.py 的输出约定）。
"""

import argparse
import hashlib
import json
import os
import re
import struct
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rail_network.build import norm_name  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE_DIR = os.path.join(ROOT, "build-cache")
# 手工解包出来的库优先走 llt/db，早期探测目录 llt_probe/db 作为兼容兜底。
CANDIDATE_PATHS = [
    os.path.join(CACHE_DIR, "llt", "db", "routes.dat"),
    os.path.join(CACHE_DIR, "llt_probe", "db", "routes.dat"),
]
VER_PATHS = [
    os.path.join(CACHE_DIR, "llt", "db", "ver.txt"),
    os.path.join(CACHE_DIR, "llt_probe", "db", "ver.txt"),
]

MAX_NAME_BYTES = 60
# 列名行的预期内容：用于确认没改版。
HEADER_LINE_NAME = "线路名"
HEADER_STATION_NAME = "车站名"
HEADER_TELECODE = "略号"

AMBIGUOUS = "AMBIGUOUS"


class LltFormatDrift(Exception):
    """routes.dat 与本解析器的假设不一致（改版或读到坏字节）。"""


def routes_dat_path(explicit=None):
    """定位 routes.dat；都不存在时给出可执行的下一步，不猜路径。"""
    if explicit:
        if not os.path.exists(explicit):
            raise SystemExit("指定的 routes.dat 不存在：%s" % explicit)
        return explicit
    for p in CANDIDATE_PATHS:
        if os.path.exists(p):
            return p
    raise SystemExit(
        "缺少 routes.dat（尝试过：%s）。先运行 python tools/fetch_llt_db.py "
        "下载 an.db 并解包。" % "、".join(CANDIDATE_PATHS))


def data_version():
    for p in VER_PATHS:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                return f.read().strip()
    return None


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def train_code(train_no):
    """12 位 train_no 里的车次号：第 5~9 位是左补零到 5 宽的车次。

    例：4e000G143503 → G1435；2400000D4907 → D49；390000K14602 → K146。
    """
    if len(train_no) < 10:
        raise LltFormatDrift("train_no 长度异常：%r" % train_no)
    return train_no[5:10].lstrip("0")


class _Reader(object):
    """顺序读游标；任何越界或解码失败都带偏移报错，不返回 None 蒙混。"""

    def __init__(self, data):
        self.data = data
        self.pos = 0

    def u8(self):
        if self.pos >= len(self.data):
            raise LltFormatDrift("读 u8 越界 @%d" % self.pos)
        v = self.data[self.pos]
        self.pos += 1
        return v

    def u32(self):
        if self.pos + 4 > len(self.data):
            raise LltFormatDrift("读 u32 越界 @%d" % self.pos)
        v = struct.unpack_from(">I", self.data, self.pos)[0]
        self.pos += 4
        return v

    def i32(self):
        if self.pos + 4 > len(self.data):
            raise LltFormatDrift("读 i32 越界 @%d" % self.pos)
        v = struct.unpack_from(">i", self.data, self.pos)[0]
        self.pos += 4
        return v

    def name(self):
        n = self.u8()
        if not 1 <= n <= MAX_NAME_BYTES:
            raise LltFormatDrift(
                "名字长度异常 %d @%d（前后字节 %s）" % (
                    n, self.pos, self.data[max(0, self.pos - 4):self.pos + 16].hex()))
        raw = self.data[self.pos:self.pos + n]
        if len(raw) != n:
            raise LltFormatDrift("名字越界 @%d" % self.pos)
        try:
            s = raw.decode("utf-8")  # 严格：坏字节即报错，不用 errors='replace' 掩盖
        except UnicodeDecodeError as e:
            raise LltFormatDrift("名字非 UTF-8 @%d：%s" % (self.pos, e))
        self.pos += n
        if not s.strip():
            raise LltFormatDrift("读到空白名字 @%d" % self.pos)
        return s

    def skip(self, n):
        if self.pos + n > len(self.data):
            raise LltFormatDrift("跳 %d 字节越界 @%d" % (n, self.pos))
        self.pos += n


def _parse_lines(r):
    count = r.u32()
    if not 300 <= count <= 3000:
        raise LltFormatDrift("①层条数 %d 不在可信区间 300~3000" % count)
    lines = []
    reserved = {}
    for i in range(count):
        seq = r.u32()
        name = r.name()
        n_st = r.u32()
        if not 0 <= n_st <= 600:
            raise LltFormatDrift("线路 %r 站数 %d 不合理 @%d" % (name, n_st, r.pos))
        stations = []
        for _ in range(n_st):
            sname = r.name()
            tc = r.name()
            res = r.i32()
            idx = r.i32()
            reserved[res] = reserved.get(res, 0) + 1
            stations.append({"name": sname, "telecode": tc, "reserved": res,
                             "station_index": idx})
        lines.append({"seq": seq, "name": name, "stations": stations})
    # 第 0 条必须是列名行，否则说明改版。
    head = lines[0]
    if head["name"] != HEADER_LINE_NAME or len(head["stations"]) != 1:
        raise LltFormatDrift("①层列名行不符：名称 %r、子项数 %d" % (
            head["name"], len(head["stations"])))
    h0 = head["stations"][0]
    if h0["name"] != HEADER_STATION_NAME or h0["telecode"] != HEADER_TELECODE:
        raise LltFormatDrift("①层列名行子项不符：%r / %r" % (h0["name"], h0["telecode"]))
    body = lines[1:]
    return body, reserved


def _parse_train_routes(r):
    count = r.u32()
    if not 10000 <= count <= 40000:
        raise LltFormatDrift("②层条数 %d 不在可信区间 10000~40000" % count)
    out = []
    for _ in range(count):
        no = r.name()
        if len(no) != 12:
            raise LltFormatDrift("train_no 长度 %d（应为 12）：%r @%d" % (len(no), no, r.pos))
        term = r.name()
        n_pts = r.u32()
        if not 0 <= n_pts <= 60:
            raise LltFormatDrift("%s 决策点数 %d 不合理 @%d" % (no, n_pts, r.pos))
        pts = []
        for _ in range(n_pts):
            sname = r.name()
            idx = r.i32()
            pts.append({"name": sname, "station_index": idx})
        out.append({"train_no": no, "code": train_code(no),
                    "terminal": term, "points": pts})
    return out


def parse(data):
    """解析 routes.dat 字节，返回两层数据 + 哨兵统计。"""
    r = _Reader(data)
    lines, reserved = _parse_lines(r)
    train_routes = _parse_train_routes(r)
    if r.pos != len(data):
        raise LltFormatDrift("消费 %d 字节 ≠ 文件 %d 字节，尾部剩 %d 字节未对齐" % (
            r.pos, len(data), len(data) - r.pos))
    return {
        "lines": lines,
        "train_routes": train_routes,
        "reserved_histogram": reserved,
        "consumed": r.pos,
        "total": len(data),
    }


class Llt(object):
    """routes.dat 的只读索引：逐段线路名、车次记录检索、站序展开。"""

    def __init__(self, parsed, path=None, sha256=None, version=None):
        self.path = path
        self.sha256 = sha256
        self.data_version = version
        self.lines = parsed["lines"]
        self.train_routes = parsed["train_routes"]
        self.reserved_histogram = parsed["reserved_histogram"]
        self.consumed = parsed["consumed"]
        self.total = parsed["total"]
        self.by_name = {}
        self.pos_index = {}  # 规范化站名 → [(线路名, 站位)]
        dup = []
        for line in self.lines:
            if line["name"] in self.by_name:
                # 下游按线路名唯一索引，重复会静默丢一条线，宁可报错。
                dup.append(line["name"])
            self.by_name[line["name"]] = line
            for i, st in enumerate(line["stations"]):
                self.pos_index.setdefault(norm_name(st["name"]), []).append((line["name"], i))
        if dup:
            raise LltFormatDrift("①层线路名重复：%s" % "、".join(sorted(set(dup))[:10]))
        self.by_code = {}
        for rec in self.train_routes:
            self.by_code.setdefault(rec["code"], []).append(rec)
        self.by_train_no = {}
        for rec in self.train_routes:
            self.by_train_no.setdefault(rec["train_no"], []).append(rec)

    # ---- ①层：逐段线路名 -----------------------------------------------

    def leg_entry(self, a, b):
        """相邻决策点 a→b 所经的①层线路条目。

        双向包含：经由点序列按行车顺序给，而线路条目的站序可能是反着的
        （京广线 武昌→汉西 在站序里是递减下标）。只查正向会把 4/11 段
        误判成"无法解释"，是实测踩过的坑。
        取站序跨度最小者；跨度并列多条返回 AMBIGUOUS，不挑第一条。
        并列且中间站完全相同的那类是共线（陇海/宁西 共线进西安），
        用 leg_is_shared 区分——共线不是分岔，任取一条都对。
        """
        cand = self.leg_candidates(a, b)
        if not cand:
            return None
        if len(cand) > 1:
            return AMBIGUOUS
        return cand[0]

    def leg_candidates(self, a, b):
        """a→b 的全部最小跨度解释：[(线路名, ia, ib)]，按线路名排序。"""
        cand = []
        for name, ia in self.pos_index.get(norm_name(a), []):
            for name2, ib in self.pos_index.get(norm_name(b), []):
                if name == name2 and ia != ib:
                    cand.append((name, ia, ib, abs(ia - ib)))
        if not cand:
            return []
        span = min(c[3] for c in cand)
        best = sorted(set((c[0], c[1], c[2]) for c in cand if c[3] == span))
        return best

    def leg_is_shared(self, a, b):
        """多解但中间站一模一样 → 共线/并股，不是真正的分岔歧义。"""
        cand = self.leg_candidates(a, b)
        if len(cand) < 2:
            return False
        stretches = {tuple(self.stations_between(n, ia, ib)) for n, ia, ib in cand}
        return len(stretches) == 1

    def stations_between(self, name, ia, ib):
        """线路条目里 ia→ib 的有序站（含两端），按行车方向排。"""
        sts = self.by_name[name]["stations"]
        step = 1 if ib > ia else -1
        return [sts[i]["name"] for i in range(ia, ib + step, step)]

    # ---- ②层：车次检索与站序展开 ---------------------------------------

    def routes_for_code(self, code):
        return self.by_code.get(code, [])

    def routes_for_train_no(self, train_no):
        return self.by_train_no.get(train_no, [])

    def sequence(self, rec):
        """一条经由记录的完整点列：决策点 + 末位的终点站。

        终点站是独立字段、不在点列里，接上才能覆盖全程（否则末段无约束）。
        去重相邻同名点（D2256 的 合川 出现两次）。
        """
        pts = [p["name"] for p in rec["points"]]
        if rec["terminal"] and (not pts or pts[-1] != rec["terminal"]):
            pts.append(rec["terminal"])
        out = []
        for p in pts:
            if not out or out[-1] != p:
                out.append(p)
        return out

    def spine(self, rec):
        """把稀疏决策点展开成有序站序：逐段用①层站序补齐中间站。

        返回 [{"name":站名, "decision":bool, "line":线路名}]。decision=True
        表示该点来自②层（真换线决策点），False 是从①层站序补进来的中间站。
        段无解释记 line=None、多解记 line=AMBIGUOUS，调用方不能当连续处理。
        """
        pts = self.sequence(rec)
        rows = []
        for i in range(len(pts) - 1):
            cand = self.leg_candidates(pts[i], pts[i + 1])
            if not cand:
                rows.append({"name": pts[i], "decision": True, "line": None})
                continue
            if len(cand) > 1 and not self.leg_is_shared(pts[i], pts[i + 1]):
                rows.append({"name": pts[i], "decision": True, "line": AMBIGUOUS})
                continue
            # 共线时取排序后的第一条，保证同输入同输出
            name, ia, ib = cand[0]
            # 含 a 不含 b：b 由下一段负责，末点在循环外补
            stretch = self.stations_between(name, ia, ib)
            for j, s in enumerate(stretch[:-1]):
                rows.append({"name": s, "decision": j == 0, "line": name})
        ahead = None
        for r in reversed(rows):
            if r["line"] not in (None, AMBIGUOUS):
                ahead = r["line"]
                break
        rows.append({"name": pts[-1], "decision": True, "line": ahead})
        return rows

    # ---- 汇总 ----------------------------------------------------------

    def stats(self):
        codes = {r["code"] for r in self.train_routes}
        return {
            "path": self.path,
            "sha256": self.sha256,
            "data_version": self.data_version,
            "consumed": self.consumed,
            "total": self.total,
            "line_entries": len(self.lines),
            "station_slots": sum(len(l["stations"]) for l in self.lines),
            "distinct_stations": len({s["name"] for l in self.lines for s in l["stations"]}),
            "distinct_telecodes": len({s["telecode"] for l in self.lines
                                       for s in l["stations"] if "telecode" in s}),
            "train_records": len(self.train_routes),
            "distinct_codes": len(codes),
            "reserved_histogram": self.reserved_histogram,
        }


def load(path=None):
    p = routes_dat_path(path)
    with open(p, "rb") as f:
        data = f.read()
    parsed = parse(data)
    return Llt(parsed, path=p, sha256=sha256_of(p), version=data_version())


def record_codes(root=None):
    """js/data.js 里出现过的车次（决定 --dump-via 的导出范围）。"""
    p = os.path.join(root or ROOT, "js", "data.js")
    with open(p, "r", encoding="utf-8") as f:
        text = f.read()
    m = re.search(r"window\.TRAIN_DATA\s*=\s*(\{.*?\});\s*$", text, re.S)
    if not m:
        raise SystemExit("js/data.js 里没有 window.TRAIN_DATA 赋值")
    data = json.loads(m.group(1))
    return sorted({r["train"] for r in data.get("records", [])})


def export_via(llt, codes):
    """导出本项目的车次 → 经由点列（含逐段线路名）。只写本地缓存。"""
    out = {}
    for c in codes:
        recs = llt.routes_for_code(c)
        if not recs:
            out[c] = {"found": False, "records": []}
            continue
        items = []
        for rec in recs:
            seq = llt.sequence(rec)
            legs = []
            for a, b in zip(seq, seq[1:]):
                got = llt.leg_entry(a, b)
                legs.append({"from": a, "to": b,
                             "line": None if got is None else
                             (AMBIGUOUS if got == AMBIGUOUS else got[0])})
            items.append({"train_no": rec["train_no"], "terminal": rec["terminal"],
                          "sequence": seq, "legs": legs})
        out[c] = {"found": True, "records": items}
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description="routes.dat 解析与自检")
    ap.add_argument("--path", help="routes.dat 路径（默认查 build-cache/llt*/db/）")
    ap.add_argument("--stats", action="store_true", help="打印两层规模与哨兵值")
    ap.add_argument("--dump-via", metavar="OUT.json",
                    help="导出本项目车次的经由点列（建议写 build-cache/，不入库）")
    args = ap.parse_args(argv)

    llt = load(args.path)
    if args.stats or not args.dump_via:
        for k, v in sorted(llt.stats().items()):
            if k == "reserved_histogram":
                v = ", ".join("%r:%d" % (kk, vv) for kk, vv in sorted(
                    v.items(), key=lambda x: str(x[0])))
            print("%-20s %s" % (k, v))
    if args.dump_via:
        payload = {
            "provenance": {"path": llt.path, "sha256": llt.sha256,
                           "data_version": llt.data_version},
            "trains": export_via(llt, record_codes()),
        }
        outdir = os.path.dirname(os.path.abspath(args.dump_via))
        if not os.path.isdir(outdir):
            os.makedirs(outdir)
        fd, tmp = tempfile.mkstemp(dir=outdir, suffix=".tmp")
        os.close(fd)
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=1, sort_keys=True)
        os.replace(tmp, args.dump_via)
        print("已导出 %s（%d 个车次）" % (args.dump_via, len(payload["trains"])))
    return 0



if __name__ == "__main__":
    sys.exit(main())
