#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把每条线的断点全部变成声明：站序从产物区段链还原，坐标写进清单。

自动补站的作用是把"OSM 里有、但站序没写"的客运站按折线投影断成区段端点。要彻底
关掉它，就得先把这些端点原样收进 lines.py，否则 汉丹线 平林/马坪 这类真站会凭空
消失（路路通 ①层 反而没列全它们）。还原的权威来源是**已核对过的产物区段链**，
不是 ①层，也不是重新按几何猜。

    python tools/declare_stations.py --survey        # 只看体检报告
    python tools/declare_stations.py --write         # 改 lines.py + 生成坐标清单

坐标清单 `tools/rail_network/node-coords.json` 只收"以前由构建器现算"的节点；
legacy 试点节点与 MANUAL_NODES 本来就是手工钉死的（带理由注释），不重复登记。
"""

import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network.build import norm_name  # noqa: E402
from rail_network.lines import LINES, MANUAL_NODES  # noqa: E402
import llt_apply  # noqa: E402  复用 entry_span/_scan_list/render_stations/patch_via_nodes

BASELINE = os.path.join(ROOT, "build-cache", "rail-route-data.merged-baseline.js")
OUT_JSON = os.path.join(ROOT, "tools", "rail_network", "node-coords.json")
LINES_PY = os.path.join(ROOT, "tools", "rail_network", "lines.py")


def load_artifact(path):
    text = open(path, encoding="utf-8").read()
    start = text.index("{", text.index("RAIL_ROUTE_DATA"))
    return json.JSONDecoder().raw_decode(text[start:])[0]


def chain_for(artifact, lid, name2id):
    """本线区段图上从 from 走到 to 的节点序列，以及没被链覆盖的节点。"""
    line = next((l for l in artifact["lines"] if l["id"] == lid), None)
    if line is None:
        return None, None, "产物里没有这条线（在建/提取失败被跳过）", []
    adj = {}
    touched = set()
    for s in artifact["segments"]:
        if lid in s["lineIds"]:
            adj.setdefault(s["from"], set()).add(s["to"])
            adj.setdefault(s["to"], set()).add(s["from"])
            touched.update((s["from"], s["to"]))
    order, note = llt_apply.baseline_sequence(artifact, lid)
    if order is None:
        return line, None, note, []
    covered = {name2id[n] for n in order}
    return line, order, note, sorted(touched - covered, key=lambda i: i)


def old_comments(block):
    """把旧 stations 块里"注释行 → 站名"的对应关系摘出来。

    回写站序时这些注释要跟着站名走：平泉北 那种"为什么写这个名不写那个"
    的理由就写在这里，删了等于把判据扔掉。
    """
    got = llt_apply._scan_list(block, r'^([ \t]*)"stations":\s*\[')
    if not got:
        return {}, None, None
    m, close, open_i = got
    body = block[open_i + 1:close - 1]
    out, pending = {}, []
    for raw in body.splitlines():
        s = raw.strip()
        if not s:
            continue
        if s.startswith("#"):
            pending.append(s)
            continue
        names = re.findall(r'"([^"]+)"', s)
        if not names:
            continue
        if pending:
            out.setdefault(names[0], []).extend(pending)
            pending = []
    return out, open_i, close


def render(names, comments, indent):
    """按链序回写 stations，宽度与注释沿用旧块风格。"""
    pad = " " * (indent + 4)
    rows, cur = [], []

    def flush():
        if cur:
            rows.append(pad + " ".join(cur))
            cur.clear()

    for n in names:
        for c in comments.get(n, []):
            flush()
            rows.append(pad + c)
        piece = '"%s",' % n
        if cur and len(" ".join(cur + [piece])) > llt_apply.WIDTH:
            flush()
        cur.append(piece)
    flush()
    body = "\n".join(rows).rstrip(",")
    return (" " * indent + '"stations": [\n' + body + "\n" + " " * indent + "]")


def write_lines(art, chains):
    """回写 lines.py 的 stations（链序），并退役已作为站进序列的 via_nodes。"""
    text = open(LINES_PY, encoding="utf-8").read()
    for lid, order in chains.items():
        start, end = llt_apply.entry_span(text, lid)
        block = text[start:end]
        comments, open_i, close = old_comments(block)
        if open_i is None:
            raise SystemExit("线路 %s 没有 stations 块" % lid)
        line_start = block.rfind("\n", 0, open_i)
        head = block[line_start + 1:open_i]
        indent = len(head) - len(head.lstrip())
        new = render(order, comments, indent)
        text = text[:start + line_start + 1] + new + block[close:] + text[end:]
        # via_nodes：断点已经作为站进序列的退役掉
        start, end = llt_apply.entry_span(text, lid)
        block = text[start:end]
        got = llt_apply._scan_list(block, r'^([ \t]*)"via_nodes":\s*\[')
        if not got:
            continue
        keep, retired = [], []
        for vid, a, b in _via_specs(block):
            name = _node_name(art, vid)
            if norm_name(name) in {norm_name(x) for x in chains[lid]}:
                retired.append(name)
            else:
                keep.append((vid, a, b))
        if retired:
            text = llt_apply.patch_via_nodes(text, lid, keep, retired)
    open(LINES_PY, "w", encoding="utf-8", newline="\n").write(text)


def _node_name(art, nid):
    return next(n["name"] for n in art["nodes"] if n["id"] == nid)


def _via_specs(block):
    out = []
    for m in re.finditer(r'\{"id": "([^"]+)", "between": \["([^"]+)", "([^"]+)"\]\}', block):
        out.append((m.group(1), m.group(2), m.group(3)))
    return out


def write_coords(art):
    """坐标清单：产物里的每个节点原样登记（id/name/kind/source/coord）。"""
    rows = [{"id": n["id"], "name": n["name"], "kind": n["kind"],
             "source": n["source"], "coord": [round(c, 5) for c in n["coord"]]}
            for n in art["nodes"]]
    with open(OUT_JSON, "w", encoding="utf-8", newline="\n") as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
        f.write("\n")
    return len(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--artifact", default=BASELINE)
    ap.add_argument("--survey", action="store_true", default=True)
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    art = load_artifact(args.artifact)
    by_id = {n["id"]: n for n in art["nodes"]}
    name2id, dup = {}, []
    for n in art["nodes"]:
        if n["name"] in name2id:
            dup.append(n["name"])
        else:
            name2id[n["name"]] = n["id"]
    if dup:
        print("!! 产物里有重名节点（同名必须共用一个节点，否则寻径会瞬移）：%s"
              % "、".join(sorted(set(dup))))

    print("线数 %d 节点 %d 区段 %d" % (len(art["lines"]), len(art["nodes"]),
                                       len(art["segments"])))
    bad, full, diffs, chains = [], 0, [], {}
    for ln in LINES:
        lid = ln["id"]
        line, order, note, uncovered = chain_for(art, lid, name2id)
        if order is None:
            bad.append((lid, note))
            continue
        declared = [norm_name(s) for s in ln["stations"]]
        got = [norm_name(s) for s in order]
        if uncovered:
            bad.append((lid, "链未覆盖 %d 个节点：%s"
                        % (len(uncovered), ", ".join(by_id[i]["name"] for i in uncovered))))
        elif len(got) != len(set(got)):
            bad.append((lid, "链上有重名节点（走链绕回了）"))
        else:
            full += 1
        extra = [d for d in declared if d not in got]
        added = [g for g in got if g not in declared]
        if extra or added:
            diffs.append((lid, len(declared), len(got), extra, added))
        if extra:
            raise SystemExit("线路 %s：声明站 %s 不在区段链上，回写会丢断点"
                             % (lid, "、".join(extra)))
        # 链外还有支线节点的线（宁蓉 试点）照样回写：主线序列只认链，
        # 支线区段的归属另判，见报告里的"链未覆盖"。
        chains[lid] = order

    print("\n== 可完整还原 %d/%d 条 ==" % (full, len(LINES)))
    if bad:
        print("\n== 还原失败/需人工判 %d 条 ==" % len(bad))
        for lid, why in bad:
            print("  ✗ %s：%s" % (lid, why))
    print("\n== 站序增量（声明 → 链还原）==")
    tot_add = 0
    for lid, ndecl, ngot, extra, added in diffs:
        tot_add += len(added)
        print("  %-26s %3d → %3d  +%s  -%s"
              % (lid, ndecl, ngot, ",".join(added) or "-", ",".join(extra) or "-"))
    print("合计新增声明站 %d" % tot_add)

    if not args.write:
        return
    write_lines(art, chains)
    print("\n已回写 %d 条线的 stations（%d 条留待人工判：%s）"
          % (len(chains), len(bad), ", ".join(l for l, _ in bad) or "-"))
    print("已生成坐标清单 %s（%d 节点）" % (os.path.relpath(OUT_JSON, ROOT),
                                          write_coords(art)))


if __name__ == "__main__":
    main()
