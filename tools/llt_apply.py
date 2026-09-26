#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把路路通 ①层的站序并进 lines.py 的骨架站序（阶段 1b）。

骨架优先：**已核对过的 stations 顺序为准**，路路通只负责把缺的中途站与线路所
插进来。两源顺序矛盾的点不自动改骨架，报出来交给人判；落不了位的站（既不在
OSM 命名站、也不在现产物节点/data.js/hints 里）也报出来，不让构建跑到一半才
抛"无法定位"。切换成功的线顺带打上 `no_auto_stations: True`，从此断点只来自
声明站序 + via_nodes。

用法：
    python tools/llt_apply.py --list                     # 可切换的线
    python tools/llt_apply.py --line handan-conventional  # 只看草稿
    python tools/llt_apply.py --all-admitted --write      # 写进 lines.py
改完必须跑：
    python tools/build_rail_route_data.py --out build-cache/stage1b.js
    node .workbuddy/freeze_check.js build-cache/rail-route-data.rebuild-baseline.js build-cache/stage1b.js
"""

import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import llt as llt_mod  # noqa: E402
from rail_network.build import norm_name  # noqa: E402
from rail_network.lines import LINES  # noqa: E402

CACHE_DIR = os.path.join(ROOT, "build-cache")
FEASIBILITY = os.path.join(CACHE_DIR, "llt-feasibility.json")
INVENTORY = os.path.join(CACHE_DIR, "osm-rail-inventory.json")
LINES_PY = os.path.join(ROOT, "tools", "rail_network", "lines.py")
# 骨架取自冻结基线（已核对的断点序列），不是当前 js/ 产物
BASELINE = os.path.join(CACHE_DIR, "rail-route-data.rebuild-baseline.js")
WIDTH = 70


def load_js_object(path, marker):
    text = open(path, encoding="utf-8").read()
    start = text.index("{", text.index(marker))
    return json.JSONDecoder().raw_decode(text[start:])[0]


def baseline_sequence(artifact, lid):
    """从基线产物按区段链还原：这条线在已核对网络里实际经过的节点顺序。

    必须先还原再关自动补站 —— 自动补站补出来的多是真站（汉丹线 平林、马坪、
    唐县镇、随阳店、兴隆集、琚湾 都在，路路通的 汉丹线 14 站反而没列全），
    直接换成 ①层站序等于把核对过的断点丢掉，实测就会挪动 K146/K148。

    返回 (站名顺序, 说明)；走不通返回 (None, 原因)。
    """
    line = next((l for l in artifact["lines"] if l["id"] == lid), None)
    if line is None:
        return None, "基线产物里没有这条线"
    adj = {}
    for s in artifact["segments"]:
        if lid in s["lineIds"]:
            adj.setdefault(s["from"], set()).add(s["to"])
            adj.setdefault(s["to"], set()).add(s["from"])
    a, b = line["from"], line["to"]
    name = {n["id"]: n["name"] for n in artifact["nodes"]}
    if a not in adj or b not in adj:
        return None, "端点没有本线区段"
    # 按"离终点的跳数"贪心走链：走廊基本线性，一步到位；遇分支也不会指数爆炸。
    # 走不通就返回原因，让这条线留在旧模式，不硬凑一个序列出来。
    hops = {b: 0}
    frontier = [b]
    while frontier:
        nxt = []
        for cur in frontier:
            for nb in adj.get(cur, ()):
                if nb not in hops:
                    hops[nb] = hops[cur] + 1
                    nxt.append(nb)
        frontier = nxt
    if a not in hops:
        return None, "%s 与 %s 在本线区段上不连通" % (name[a], name[b])
    path, seen, cur = [a], {a}, a
    while cur != b:
        cands = sorted(x for x in adj.get(cur, ())
                       if x not in seen and hops.get(x, 1 << 30) < hops[cur])
        if not cands:
            return None, "走链在 %s 处断掉（覆盖 %d/%d 节点）" % (name[cur], len(path), len(adj))
        cur = cands[0]
        seen.add(cur)
        path.append(cur)
    order = [name[i] for i in path]
    note = "" if len(path) == len(adj) else "链覆盖 %d/%d 节点" % (len(path), len(adj))
    return order, note


def patch_via_nodes(text, lid, keep, retired_names):
    """把已经作为站进 stations 声明的 via_nodes 条目退役掉。

    骨架是从基线区段链还原的，本来就把 接轨点/线路所 当节点走了一遍；再保留
    "插到相邻两站之间"的声明就会撞上 insert_via_stops 的相邻断言（实测
    handan-conventional、anjiu-hsr 就是这么失败的）。断点已经是站，声明到此为止。
    """
    start, end = entry_span(text, lid)
    block = text[start:end]
    got = _scan_list(block, r'^([ \t]*)"via_nodes":\s*\[')
    if not got:
        return text
    m, close, _open = got
    pad = m.group(1)
    if keep:
        body = "".join(
            '%s    {"id": "%s", "between": ["%s", "%s"]},\n' % (pad, v, a, b)
            for v, a, b in keep)
        new = '%s"via_nodes": [\n%s%s]' % (pad, body, pad)
    else:
        new = ("%s# 原 via_nodes（%s）已作为站写进下面的 stations 声明：断点即站，不再插入"
               % (pad, "、".join(retired_names)))
    return text[:start] + block[:m.start()] + new + block[close:] + text[end:]


def index_in(seq, name):
    tn = norm_name(name)
    for i, x in enumerate(seq):
        if norm_name(x) == tn:
            return i
    return -1


def placeable_pool(inventory, artifact_nodes, data_coords):
    """允许当断点的站名池（规范化后）。"""
    pool = {norm_name(s["name"]) for s in inventory["stations"]}
    pool |= {norm_name(n) for n in artifact_nodes}
    pool |= {norm_name(k) for k in data_coords}
    for line in LINES:
        pool |= {norm_name(k) for k in (line.get("station_hints") or {})}
    return pool


def align_direction(ours, theirs):
    """①层条目整体反向时先翻过来。

    线路是双向的，"路路通说 黟县东→黄山西、我们写 黄山西→黟县东" 不是矛盾
    （池黄高铁 3 处、宁西西合段 9 处、汉西联络线 1 处全是这个），不先归一
    就会把能用的线当成冲突拒掉。判据：两源共有的站在各自序列里的先后，
    一致对多还是相反对多。
    """
    pos_of = {}
    for i, n in enumerate(ours):
        pos_of.setdefault(norm_name(n), i)
    seq = [pos_of[norm_name(t)] for t in theirs if norm_name(t) in pos_of]
    asc = sum(1 for a, b in zip(seq, seq[1:]) if b > a)
    desc = sum(1 for a, b in zip(seq, seq[1:]) if b < a)
    return list(reversed(theirs)) if desc > asc else list(theirs)


def merge_stations(ours, theirs, pool):
    """把 theirs 里 ours 缺的站插进 ours 骨架。

    锚点 = theirs 中该段两侧都属于 ours 的站；插在"后一个锚点之前"，
    这样既保住我们的顺序，又按路路通的顺序补密。

    返回 (合并结果, 插入清单, 顺序矛盾, 未插入原因)。
    """
    theirs = align_direction(ours, theirs)
    pos_of = {}
    for i, n in enumerate(ours):
        pos_of.setdefault(norm_name(n), i)
    merged = list(ours)
    inserted, conflicts, dropped = [], [], []
    anchors = [(t, pos_of[norm_name(t)]) for t in theirs if norm_name(t) in pos_of]
    for (ta, ia), (tb, ib) in zip(anchors, anchors[1:]):
        if ib < ia:
            conflicts.append("%s→%s：路路通这个顺序与我们的站序相反" % (ta, tb))
    pending = []
    seen_anchor = 0
    for t in theirs:
        nt = norm_name(t)
        if nt in pos_of:
            seen_anchor += 1
            at = index_in(merged, t)
            if seen_anchor == 1:
                # 第一个锚点之前的点在本线范围之外：宁西线 的 蜀山东 就是这样
                # 被插到 长安集 前面，构建时报"蜀山东→长安集 寻径失败"，
                # 而这条线是 optional，整条线会被静默丢掉。范围外一律不插。
                for p in pending:
                    dropped.append("%s(超出本线端点)" % p)
            else:
                for p in pending:
                    if index_in(merged, p) >= 0:
                        continue
                    if norm_name(p) not in pool:
                        dropped.append("%s(无落位来源)" % p)
                        continue
                    merged.insert(at, p)
                    inserted.append(p)
                    at += 1
            pending = []
        else:
            pending.append(t)
    for p in pending:
        dropped.append("%s(超出本线端点)" % p)
    return merged, inserted, conflicts, dropped


def render_stations(names, indent):
    pad = " " * (indent + 4)
    lines, cur = [], []
    for n in names:
        piece = '"%s",' % n
        if cur and len(" ".join(cur + [piece])) > WIDTH:
            lines.append(pad + " ".join(cur))
            cur = [piece]
        else:
            cur.append(piece)
    if cur:
        lines.append(pad + " ".join(cur))
    body = "\n".join(lines).rstrip(",")
    return " " * indent + '"stations": [\n' + body + "\n" + " " * indent + "]"


def entry_span(text, lid):
    """返回该线路条目在文本中的 [起, 止) 区间。

    边界不能用下一个 '"id": '：via_nodes 里就有 {"id": "hh-junction", ...}，
    那样会把块截断在 stations 之前。条目本身是 LINES 列表里 4 空格缩进的
    `{`，嵌套字典缩进更深，所以拿 "\n    {" 当条目分隔是可靠的。
    """
    start = text.index('"id": "%s"' % lid)
    nxt = text.find("\n    {", start)
    end = text.find("\n]", start) if nxt < 0 else nxt
    if end < 0:
        raise SystemExit("找不到 lines.py 的 LINES 列表结尾")
    return start, end


def _scan_list(block, key_re):
    """定位 "key": [ ... ] 块，方括号配对（支持多行列表）。

    返回 (匹配对象, 列表右括号之后的位置, 左括号位置)；找不到返回 None。
    """
    m = re.search(key_re, block, re.S | re.M)
    if not m:
        return None
    open_i = block.index("[", m.start())
    depth = 0
    for i in range(open_i, len(block)):
        if block[i] == "[":
            depth += 1
        elif block[i] == "]":
            depth -= 1
            if depth == 0:
                return m, i + 1, open_i
    return None


def patch_entry(text, lid, names):
    start, end = entry_span(text, lid)
    block = text[start:end]
    got = _scan_list(block, r'^([ \t]*)"stations":\s*\[')
    if not got:
        raise SystemExit("线路 %s：条目里找不到 stations 块" % lid)
    m, close, _open = got
    indent = len(m.group(1))
    new_block = block[:m.start()] + render_stations(names, indent) + block[close:]
    if '"no_auto_stations"' not in new_block:
        anchor = re.search(r'^([ \t]*)"stations":', new_block, re.M)
        new_block = (new_block[:anchor.start()]
                     + anchor.group(1) + '"no_auto_stations": True,  # 断点全部来自声明站序\n'
                     + new_block[anchor.start():])
    return text[:start] + new_block + text[end:]


def targets(feas):
    """[(我们的线路 id, ①层线名)]，取可行性报告判 auto 且映射成功的。"""
    out = []
    for r in feas["lines"]:
        if r["verdict"] != "auto" or not r.get("ours"):
            continue
        out.append((r["ours"], r["line"]))
    return sorted(set(out))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--line", default="", help="只处理我们的某条线路 id")
    ap.add_argument("--exclude", default="",
                    help="逗号分隔的线路 id：本轮不切换（留在旧模式）。"
                         "用于 freeze_check 判为违例的线，逐条成交换。")
    ap.add_argument("--include", nargs="*", default=[],
                    help="单线模式下指定用哪些 ①层线名补密（默认取报告映射到该线的）")
    ap.add_argument("--all-admitted", action="store_true", help="处理全部判 auto 的线")
    ap.add_argument("--write", action="store_true", help="写进 lines.py（默认只出草稿）")
    ap.add_argument("--list", action="store_true", help="列出可切换的线")
    args = ap.parse_args()

    feas = json.load(open(FEASIBILITY, encoding="utf-8"))
    todo = targets(feas)
    excl = {x.strip() for x in args.exclude.split(",") if x.strip()}
    if excl:
        skipped = sorted({lid for lid, _ in todo} & excl)
        todo = [t for t in todo if t[0] not in excl]
        print("本轮不切换（留在旧模式）：%s" % "、".join(skipped))
    if args.list:
        print("判 auto 且映射到我们线路的（%d 项）：" % len(todo))
        for lid, ln in todo:
            print("  %-26s ← %-12s" % (lid, ln))
        return
    if not (args.line or args.all_admitted):
        raise SystemExit("要指定 --line / --all-admitted / --list 之一")

    llt_obj = llt_mod.load()
    inv = json.load(open(INVENTORY, encoding="utf-8"))
    artifact = load_js_object(BASELINE, "var RAIL_ROUTE_DATA")
    node_names = {n["id"]: n["name"] for n in artifact["nodes"]}
    pool = placeable_pool(inv, {n["name"] for n in artifact["nodes"]},
                          load_js_object(os.path.join(ROOT, "js", "data.js"),
                                         "window.TRAIN_DATA").get("stations", {}))

    # 单线模式允许用 --include 指名 ①层条目；默认取映射到该线的全部条目
    by_ours = {}
    for lid, ln in todo:
        by_ours.setdefault(lid, []).append(ln)
    if args.line:
        names = args.include or by_ours.get(args.line, [])
        if not names:
            raise SystemExit("没有映射到 %s 的 ①层条目（可行性报告判 auto 才算可切换）；"
                             "可用 --include 路路通线名 指定" % args.line)
        picked = [(args.line, names)]
    else:
        picked = [(lid, ns) for lid, ns in sorted(by_ours.items())]

    text = open(LINES_PY, encoding="utf-8").read()
    touched = 0
    for lid, llt_names in picked:
        entry = next((l for l in LINES if l["id"] == lid), None)
        if entry is None:
            raise SystemExit("lines.py 里没有线路 %s" % lid)
        base, note = baseline_sequence(artifact, lid)
        skeleton = base or list(entry["stations"])
        merged = list(skeleton)
        ins_all, conf_all, drop_all = [], [], []
        for name in llt_names:
            theirs = [s["name"] for s in llt_obj.by_name[name]["stations"]]
            merged, ins, conf, drop = merge_stations(merged, theirs, pool)
            ins_all += ins
            conf_all += conf
            drop_all += drop
        src = "基线区段链" if base else "lines.py声明"
        print("### %-26s 声明%2d → 骨架(%s)%2d → 合并%2d 站（插入 %d、矛盾 %d、未插入 %d）%s%s"
              % (lid, len(entry["stations"]), src, len(skeleton), len(merged),
                 len(ins_all), len(conf_all), len(drop_all),
                 (" ← " + "、".join(llt_names)) if llt_names else "",
                 ("  ⚠ " + note) if note else ""))
        for c in conf_all[:5]:
            print("    ! %s" % c)
        if drop_all:
            print("    未插入：%s" % "、".join(dict.fromkeys(drop_all))[:400])
        if args.write:
            text = patch_entry(text, lid, merged)
            via = entry.get("via_nodes") or []
            if via:
                nn = {norm_name(x) for x in merged}
                keep, retired = [], []
                for spec in via:
                    vname = node_names.get(spec["id"], spec["id"])
                    if norm_name(vname) in nn:
                        retired.append(vname)
                    else:
                        keep.append((spec["id"], spec["between"][0], spec["between"][1]))
                if retired:
                    text = patch_via_nodes(text, lid, keep, retired)
                    print("    via_nodes 退役成声明站：%s（保留 %d 条）"
                          % ("、".join(retired), len(keep)))
            touched += 1
    if args.write:
        if not touched:
            print("没有要写的线")
            return
        open(LINES_PY, "w", encoding="utf-8").write(text)
        print("已写 %s（%d 条线）；接下来重跑构建与 freeze_check" % (LINES_PY, touched))
    else:
        print("（草稿模式，未写文件；确认无误后加 --write）")


if __name__ == "__main__":
    main()
