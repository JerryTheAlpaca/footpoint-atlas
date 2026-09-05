// 由 tools/build_rail_route_data.py 生成，请勿手工编辑。
// 全国高铁真实径路网络：线路/节点/物理区段/状态日期/覆盖。
// 坐标约定：[lon, lat]，与 data.js stations 一致。
(function (root) {
  'use strict';
  var RAIL_ROUTE_DATA = {
 "source": {
  "provider": "OpenStreetMap",
  "snapshotDate": "2026-09-04",
  "sha256": "dbb271dcb44095df7fc97502cbaae2bb100bfe0dec7f2119483379ed2ad94360",
  "attribution": "铁路几何 © OpenStreetMap contributors · ODbL",
  "extract": "Geofabrik China OSM PBF 铁路 way 提取；宁蓉试点区段自提交 8740690 等价迁移",
  "buildVersion": 2,
  "skippedLines": [
   {
    "id": "xiongshang-hsr",
    "name": "雄商高速铁路",
    "reason": "线路 xiongshang-hsr：2 站无法定位\n  肃宁东（上一站参考 [116.021259, 38.702937]）；参考点附近站：任丘西[116.021259, 38.702937]; 任丘[116.138535, 38.693431]; 河间西[115.949859, 38.504097]; 河间[116.055924, 38.453486]\n  饶阳东（上一站参考 [116.021259, 38.702937]）；参考点附近站：任丘西[116.021259, 38.702937]; 任丘[116.138535, 38.693431]; 河间西[115.949859, 38.504097]; 河间[116.055924, 38.453486]"
   }
  ]
 },
 "lines": [
  {
   "id": "huning-int",
   "name": "沪宁城际铁路",
   "batch": "A",
   "from": "shang-hai",
   "to": "nan-jing",
   "serviceDate": "2010-07-01"
  },
  {
   "id": "jingha-hsr",
   "name": "京哈高速铁路",
   "batch": "A",
   "from": "bei-jing-zhao-yang",
   "to": "ha-er-bin-xi",
   "serviceDate": "2021-01-22"
  },
  {
   "id": "jinghu-hsr",
   "name": "京沪高速铁路",
   "batch": "A",
   "from": "bei-jing-nan",
   "to": "shang-hai-hong-qiao",
   "serviceDate": "2011-06-30"
  },
  {
   "id": "ninghang-hsr",
   "name": "宁杭高速铁路",
   "batch": "A",
   "from": "nanjing-south",
   "to": "hang-zhou-dong",
   "serviceDate": "2013-07-01"
  },
  {
   "id": "guangshengang-hsr",
   "name": "广深港高速铁路",
   "batch": "B",
   "from": "guang-zhou-nan",
   "to": "xiang-gang-xi-jiu-long",
   "serviceDate": "2011-12-26"
  },
  {
   "id": "jingguang-hsr",
   "name": "京广高速铁路",
   "batch": "B",
   "from": "bei-jing-xi",
   "to": "guang-zhou-nan",
   "serviceDate": "2012-12-26"
  },
  {
   "id": "hukun-hsr",
   "name": "沪昆高速铁路",
   "batch": "C",
   "from": "shang-hai-hong-qiao",
   "to": "kun-ming-nan",
   "serviceDate": "2016-12-28"
  },
  {
   "id": "lanxin-hsr",
   "name": "兰新高速铁路",
   "batch": "C",
   "from": "lan-zhou-xi",
   "to": "wu-lu-mu-qi",
   "serviceDate": "2014-12-26"
  },
  {
   "id": "ningrong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "batch": "C",
   "from": "nanjing-south",
   "to": "cheng-du-dong",
   "serviceDate": "2009-04-01"
  },
  {
   "id": "xicheng-hsr",
   "name": "西成高速铁路",
   "batch": "C",
   "from": "xi-an-bei",
   "to": "cheng-du-dong",
   "serviceDate": "2017-12-06"
  },
  {
   "id": "xulan-hsr",
   "name": "徐兰高速铁路",
   "batch": "C",
   "from": "xu-zhou-dong",
   "to": "lan-zhou-xi",
   "serviceDate": "2017-07-09"
  },
  {
   "id": "anjiu-hsr",
   "name": "安九高速铁路",
   "batch": "D",
   "from": "an-qing",
   "to": "lu-shan",
   "serviceDate": "2021-12-30"
  },
  {
   "id": "changgan-hsr",
   "name": "昌赣高速铁路",
   "batch": "D",
   "from": "nan-chang",
   "to": "gan-zhou-xi",
   "serviceDate": "2019-12-26"
  },
  {
   "id": "changjiu-int",
   "name": "昌九城际铁路",
   "batch": "D",
   "from": "jiu-jiang",
   "to": "nan-chang",
   "serviceDate": "2010-09-20"
  },
  {
   "id": "ganshen-hsr",
   "name": "赣深高速铁路",
   "batch": "D",
   "from": "gan-zhou-xi",
   "to": "shen-zhen-bei",
   "serviceDate": "2021-12-10"
  },
  {
   "id": "hean-hsr",
   "name": "合安高速铁路",
   "batch": "D",
   "from": "hefei-south",
   "to": "an-qing",
   "serviceDate": "2020-12-22"
  },
  {
   "id": "jingxiong-int",
   "name": "京雄城际铁路",
   "batch": "D",
   "from": "bei-jing-xi",
   "to": "xiong-an",
   "serviceDate": "2020-12-27"
  },
  {
   "id": "shanghehang-north",
   "name": "商合杭高速铁路（北段）",
   "batch": "D",
   "from": "shang-qiu",
   "to": "hefei-south",
   "serviceDate": "2019-12-01"
  },
  {
   "id": "shanghehang-south",
   "name": "商合杭高速铁路（南段）",
   "batch": "D",
   "from": "hefei-south",
   "to": "hu-zhou",
   "serviceDate": "2020-06-28"
  },
  {
   "id": "chihuang-hsr",
   "name": "池黄高速铁路",
   "batch": "E",
   "from": "chi-zhou",
   "to": "huang-shan-bei",
   "serviceDate": "2024-04-26"
  },
  {
   "id": "hanghuang-hsr",
   "name": "杭黄高速铁路",
   "batch": "E",
   "from": "hang-zhou-dong",
   "to": "huang-shan-bei",
   "serviceDate": "2018-12-25"
  },
  {
   "id": "huanghuang-hsr",
   "name": "黄黄高速铁路",
   "batch": "E",
   "from": "huang-gang-dong",
   "to": "huang-mei-nan",
   "serviceDate": "2022-04-22"
  },
  {
   "id": "huzhou-hangzhou",
   "name": "湖杭高速铁路",
   "batch": "E",
   "from": "hu-zhou",
   "to": "hang-zhou-xi",
   "serviceDate": "2022-09-22"
  },
  {
   "id": "nanjing-link",
   "name": "沪宁城际南京联络线",
   "batch": "E",
   "from": "nan-jing",
   "to": "nanjing-south",
   "serviceDate": "2010-07-01"
  },
  {
   "id": "ningan-int",
   "name": "宁安城际铁路",
   "batch": "E",
   "from": "nanjing-south",
   "to": "an-qing",
   "serviceDate": "2015-12-06"
  },
  {
   "id": "shanghai-hangzhou",
   "name": "沪杭高速铁路",
   "batch": "E",
   "from": "shang-hai-hong-qiao",
   "to": "hang-zhou-dong",
   "serviceDate": "2010-10-26"
  },
  {
   "id": "wugang-int",
   "name": "武冈城际铁路",
   "batch": "E",
   "from": "wuhan",
   "to": "huang-gang-dong",
   "serviceDate": "2014-06-18"
  },
  {
   "id": "wuxiao-int",
   "name": "武孝城际铁路",
   "batch": "E",
   "from": "hankou",
   "to": "xiao-gan-dong",
   "serviceDate": "2016-12-01"
  }
 ],
 "nodes": [
  {
   "id": "nanjing-south",
   "name": "南京南",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    118.81,
    31.97
   ]
  },
  {
   "id": "quanjiao",
   "name": "全椒",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.2774,
    32.0623
   ]
  },
  {
   "id": "feidong",
   "name": "肥东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.4804,
    31.8614
   ]
  },
  {
   "id": "hefei-south",
   "name": "合肥南",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    117.29,
    31.8
   ]
  },
  {
   "id": "hefei-west",
   "name": "合肥西",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    117.21,
    31.86
   ]
  },
  {
   "id": "changanji",
   "name": "长安集",
   "aliases": [],
   "kind": "junction",
   "source": "osm",
   "coord": [
    117.1241,
    31.7891
   ]
  },
  {
   "id": "leimadian",
   "name": "雷麻店",
   "aliases": [],
   "kind": "junction",
   "source": "osm",
   "coord": [
    117.0316,
    31.7729
   ]
  },
  {
   "id": "luan",
   "name": "六安",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    116.49729,
    31.71769
   ]
  },
  {
   "id": "jinzhai",
   "name": "金寨",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.9702,
    31.628
   ]
  },
  {
   "id": "macheng-north",
   "name": "麻城北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.9793,
    31.1893
   ]
  },
  {
   "id": "honganxi",
   "name": "红安西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.6264,
    31.0062
   ]
  },
  {
   "id": "hengdian-east",
   "name": "横店东",
   "aliases": [],
   "kind": "junction",
   "source": "osm",
   "coord": [
    114.3283,
    30.8009
   ]
  },
  {
   "id": "hankou",
   "name": "汉口",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    114.26,
    30.62
   ]
  },
  {
   "id": "jg-junction",
   "name": "京广高铁接入点",
   "aliases": [],
   "kind": "junction",
   "source": "osm",
   "coord": [
    114.3328,
    30.793
   ]
  },
  {
   "id": "wuhan",
   "name": "武汉",
   "aliases": [],
   "kind": "station",
   "source": "data",
   "coord": [
    114.42,
    30.61
   ]
  },
  {
   "id": "hh-junction",
   "name": "黄黄高铁接入点",
   "aliases": [],
   "kind": "junction",
   "source": "osm",
   "coord": [
    115.96096,
    30.0571
   ]
  },
  {
   "id": "bei-jing-nan",
   "name": "北京南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.3724,
    39.86348
   ]
  },
  {
   "id": "lang-fang",
   "name": "廊坊",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.70296,
    39.5084
   ]
  },
  {
   "id": "tian-jin-nan",
   "name": "天津南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.0545,
    39.05605
   ]
  },
  {
   "id": "cang-zhou-xi",
   "name": "沧州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.76196,
    38.30628
   ]
  },
  {
   "id": "de-zhou-dong",
   "name": "德州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.45608,
    37.40876
   ]
  },
  {
   "id": "ji-nan-xi",
   "name": "济南西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.886,
    36.6688
   ]
  },
  {
   "id": "tai-an",
   "name": "泰安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.02925,
    36.17195
   ]
  },
  {
   "id": "qu-fu-dong",
   "name": "曲阜东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.06434,
    35.55655
   ]
  },
  {
   "id": "teng-zhou-dong",
   "name": "滕州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.25195,
    35.09096
   ]
  },
  {
   "id": "zao-zhuang",
   "name": "枣庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.30037,
    34.78188
   ]
  },
  {
   "id": "xu-zhou-dong",
   "name": "徐州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.30021,
    34.26916
   ]
  },
  {
   "id": "su-zhou-dong",
   "name": "宿州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.24583,
    33.67724
   ]
  },
  {
   "id": "beng-bu-nan",
   "name": "蚌埠南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.43679,
    32.90369
   ]
  },
  {
   "id": "ding-yuan",
   "name": "定远",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.83691,
    32.57746
   ]
  },
  {
   "id": "chu-zhou",
   "name": "滁州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.31494,
    32.19998
   ]
  },
  {
   "id": "zhen-jiang-nan",
   "name": "镇江南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.41864,
    32.15444
   ]
  },
  {
   "id": "dan-yang-bei",
   "name": "丹阳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.66622,
    32.0168
   ]
  },
  {
   "id": "chang-zhou-bei",
   "name": "常州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.95072,
    31.85611
   ]
  },
  {
   "id": "wu-xi-dong",
   "name": "无锡东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.45549,
    31.59881
   ]
  },
  {
   "id": "su-zhou-bei",
   "name": "苏州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.63893,
    31.42372
   ]
  },
  {
   "id": "kun-shan-nan",
   "name": "昆山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.94647,
    31.35515
   ]
  },
  {
   "id": "shang-hai-hong-qiao",
   "name": "上海虹桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.3162,
    31.19598
   ]
  },
  {
   "id": "cao-zhuang",
   "name": "曹庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.05515,
    39.15104
   ]
  },
  {
   "id": "an-ting-bei",
   "name": "安亭北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.15078,
    31.31739
   ]
  },
  {
   "id": "huang-cun",
   "name": "黄村",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.32342,
    39.71925
   ]
  },
  {
   "id": "feng-bang",
   "name": "封浜",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.28353,
    31.25921
   ]
  },
  {
   "id": "ping-yuan-dong",
   "name": "平原东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.57402,
    37.2183
   ]
  },
  {
   "id": "hua-qiao",
   "name": "花桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.0417,
    31.33773
   ]
  },
  {
   "id": "huang-du",
   "name": "黄渡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.2368,
    31.29895
   ]
  },
  {
   "id": "dang-jia-zhuang",
   "name": "党家庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.88976,
    36.57782
   ]
  },
  {
   "id": "qi-he",
   "name": "齐河",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.8543,
    36.8377
   ]
  },
  {
   "id": "bei-jing-da-xing",
   "name": "北京大兴",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.32342,
    39.71925
   ]
  },
  {
   "id": "pu-kou-nan",
   "name": "浦口南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.53169,
    32.01736
   ]
  },
  {
   "id": "qing-yang",
   "name": "青杨",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.91674,
    36.39238
   ]
  },
  {
   "id": "an-ting-xi",
   "name": "安亭西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.15078,
    31.31739
   ]
  },
  {
   "id": "nan-yi",
   "name": "南驿",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.09787,
    35.85744
   ]
  },
  {
   "id": "wei-shan-zhuang",
   "name": "魏善庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.4014,
    39.66447
   ]
  },
  {
   "id": "liu-bai-du",
   "name": "六摆渡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.35724,
    32.17245
   ]
  },
  {
   "id": "an-ting",
   "name": "安亭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.17361,
    31.3115
   ]
  },
  {
   "id": "an-ding",
   "name": "安定",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.4864,
    39.61336
   ]
  },
  {
   "id": "wan-zhuang",
   "name": "万庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.58626,
    39.57338
   ]
  },
  {
   "id": "zhang-xia",
   "name": "张夏",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.90686,
    36.45405
   ]
  },
  {
   "id": "wan-de",
   "name": "万德",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.92212,
    36.33687
   ]
  },
  {
   "id": "jie-shou",
   "name": "界首",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.98685,
    36.24694
   ]
  },
  {
   "id": "yang-cheng-hu",
   "name": "阳澄湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.85707,
    31.38337
   ]
  },
  {
   "id": "ning-yang-dong",
   "name": "宁阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.10278,
    35.872
   ]
  },
  {
   "id": "zou-cheng-dong",
   "name": "邹城东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.07627,
    35.40129
   ]
  },
  {
   "id": "lu-jia-bang",
   "name": "陆家浜",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.07696,
    31.34115
   ]
  },
  {
   "id": "bei-jing-zhao-yang",
   "name": "北京朝阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.50242,
    39.94332
   ]
  },
  {
   "id": "shun-yi-xi",
   "name": "顺义西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.48534,
    40.1788
   ]
  },
  {
   "id": "huai-rou-nan",
   "name": "怀柔南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.69887,
    40.27719
   ]
  },
  {
   "id": "mi-yun",
   "name": "密云",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.84513,
    40.35101
   ]
  },
  {
   "id": "xing-long-xian-xi",
   "name": "兴隆县西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.47563,
    40.41268
   ]
  },
  {
   "id": "cheng-de-nan",
   "name": "承德南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.95831,
    40.88278
   ]
  },
  {
   "id": "ping-quan",
   "name": "平泉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.69425,
    40.99767
   ]
  },
  {
   "id": "niu-he-liang",
   "name": "牛河梁",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.39279,
    41.19407
   ]
  },
  {
   "id": "ka-zuo",
   "name": "喀左",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.80008,
    41.22218
   ]
  },
  {
   "id": "zhao-yang",
   "name": "朝阳",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    120.41819,
    41.60594
   ]
  },
  {
   "id": "fu-xin",
   "name": "阜新",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.65421,
    42.05589
   ]
  },
  {
   "id": "hei-shan-bei",
   "name": "黑山北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    122.29463,
    42.04358
   ]
  },
  {
   "id": "shen-yang-bei",
   "name": "沈阳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.42943,
    41.81733
   ]
  },
  {
   "id": "tie-ling-xi",
   "name": "铁岭西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.66639,
    42.23103
   ]
  },
  {
   "id": "kai-yuan-xi",
   "name": "开原西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.91279,
    42.54738
   ]
  },
  {
   "id": "chang-tu-xi",
   "name": "昌图西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    124.06058,
    42.77551
   ]
  },
  {
   "id": "si-ping-dong",
   "name": "四平东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    124.4329,
    43.13584
   ]
  },
  {
   "id": "gong-zhu-ling-nan",
   "name": "公主岭南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    124.80973,
    43.47088
   ]
  },
  {
   "id": "chang-chun-xi",
   "name": "长春西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    125.1939,
    43.87494
   ]
  },
  {
   "id": "de-hui-xi",
   "name": "德惠西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    125.67032,
    44.54363
   ]
  },
  {
   "id": "shuang-cheng-bei",
   "name": "双城北",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    126.23704,
    45.38165
   ]
  },
  {
   "id": "ha-er-bin-xi",
   "name": "哈尔滨西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    126.57232,
    45.70514
   ]
  },
  {
   "id": "da-cheng",
   "name": "大成",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.34001,
    41.82814
   ]
  },
  {
   "id": "xiao-dong",
   "name": "小东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    122.32355,
    42.03872
   ]
  },
  {
   "id": "xing-long-dian",
   "name": "兴隆店",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.04947,
    41.98093
   ]
  },
  {
   "id": "da-ping-fang",
   "name": "大平房",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.14532,
    41.43735
   ]
  },
  {
   "id": "shui-quan",
   "name": "水泉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.15992,
    41.10678
   ]
  },
  {
   "id": "wang-gang",
   "name": "王岗",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    126.54424,
    45.67407
   ]
  },
  {
   "id": "gao-ge-zhuang",
   "name": "高各庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.62571,
    40.25983
   ]
  },
  {
   "id": "cheng-de-xi",
   "name": "承德西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.71861,
    40.75647
   ]
  },
  {
   "id": "xing-long-xian",
   "name": "兴隆县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.50515,
    40.43822
   ]
  },
  {
   "id": "ping-quan-bei",
   "name": "平泉北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.70186,
    41.03599
   ]
  },
  {
   "id": "an-jiang",
   "name": "安匠",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.72637,
    40.76581
   ]
  },
  {
   "id": "cheng-de-xian-bei",
   "name": "承德县北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.27658,
    40.93246
   ]
  },
  {
   "id": "nai-lin-gao",
   "name": "奈林皋",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.05988,
    41.39855
   ]
  },
  {
   "id": "bei-piao",
   "name": "北票",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.78113,
    41.76537
   ]
  },
  {
   "id": "liao-ning-zhao-yang",
   "name": "辽宁朝阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.40375,
    41.59813
   ]
  },
  {
   "id": "wu-lan-mu-tu",
   "name": "乌兰木图",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.28017,
    41.96118
   ]
  },
  {
   "id": "xin-min-bei",
   "name": "新民北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    122.79278,
    42.02294
   ]
  },
  {
   "id": "shen-yang-xi",
   "name": "沈阳西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.23361,
    41.91352
   ]
  },
  {
   "id": "gao-tai-shan",
   "name": "高台山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    122.87304,
    42.01996
   ]
  },
  {
   "id": "fu-yu-bei",
   "name": "扶余北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    125.99613,
    45.00317
   ]
  },
  {
   "id": "wen-guan-tun",
   "name": "文官屯",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    123.47186,
    41.87885
   ]
  },
  {
   "id": "xia-jia",
   "name": "夏家",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    126.55247,
    45.68324
   ]
  },
  {
   "id": "dong-san-jia",
   "name": "东三家",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.43211,
    41.61405
   ]
  },
  {
   "id": "shang-hai",
   "name": "上海",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.45117,
    31.25156
   ]
  },
  {
   "id": "shang-hai-xi",
   "name": "上海西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.39816,
    31.2646
   ]
  },
  {
   "id": "nan-xiang-bei",
   "name": "南翔北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.30482,
    31.28349
   ]
  },
  {
   "id": "su-zhou-yuan-qu",
   "name": "苏州园区",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.7066,
    31.34265
   ]
  },
  {
   "id": "su-zhou",
   "name": "苏州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.60668,
    31.33188
   ]
  },
  {
   "id": "su-zhou-xin-qu",
   "name": "苏州新区",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.52058,
    31.37394
   ]
  },
  {
   "id": "wu-xi-xin-qu",
   "name": "无锡新区",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.3875,
    31.4996
   ]
  },
  {
   "id": "wu-xi",
   "name": "无锡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.30181,
    31.58981
   ]
  },
  {
   "id": "hui-shan",
   "name": "惠山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.19637,
    31.6716
   ]
  },
  {
   "id": "chang-zhou",
   "name": "常州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.9682,
    31.78668
   ]
  },
  {
   "id": "dan-yang",
   "name": "丹阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.58852,
    32.00399
   ]
  },
  {
   "id": "dan-tu",
   "name": "丹徒",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.51319,
    32.1193
   ]
  },
  {
   "id": "zhen-jiang",
   "name": "镇江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.42699,
    32.19966
   ]
  },
  {
   "id": "bao-hua-shan",
   "name": "宝华山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.05016,
    32.15157
   ]
  },
  {
   "id": "xian-lin",
   "name": "仙林",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.90757,
    32.12488
   ]
  },
  {
   "id": "nan-jing",
   "name": "南京",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.79175,
    32.08872
   ]
  },
  {
   "id": "xing-wei-cun",
   "name": "兴卫村",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.8509,
    32.10474
   ]
  },
  {
   "id": "xia-shu",
   "name": "下蜀",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.163,
    32.16356
   ]
  },
  {
   "id": "xu-shu-guan",
   "name": "浒墅关",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.50557,
    31.38751
   ]
  },
  {
   "id": "wei-ting",
   "name": "唯亭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.78368,
    31.36281
   ]
  },
  {
   "id": "nan-xiang",
   "name": "南翔",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.3231,
    31.27966
   ]
  },
  {
   "id": "lv-cheng",
   "name": "吕城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.74087,
    31.90883
   ]
  },
  {
   "id": "xin-zha-zhen",
   "name": "新闸镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.88427,
    31.82648
   ]
  },
  {
   "id": "ben-niu",
   "name": "奔牛",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.81185,
    31.8651
   ]
  },
  {
   "id": "jiang-qiao-zhen",
   "name": "江桥镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.36523,
    31.27129
   ]
  },
  {
   "id": "su-zhou-xi",
   "name": "苏州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.54495,
    31.3504
   ]
  },
  {
   "id": "shuo-fang",
   "name": "硕放",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.41098,
    31.47725
   ]
  },
  {
   "id": "zhen-jiang-dong",
   "name": "镇江东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.45753,
    32.18897
   ]
  },
  {
   "id": "dan-yang-dong",
   "name": "丹阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.64196,
    31.9606
   ]
  },
  {
   "id": "qi-shu-yan",
   "name": "戚墅堰",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.06071,
    31.72563
   ]
  },
  {
   "id": "wu-xi-bei",
   "name": "无锡北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.24695,
    31.63665
   ]
  },
  {
   "id": "wu-xi-nan",
   "name": "无锡南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.33742,
    31.54889
   ]
  },
  {
   "id": "shi-liu-yuan",
   "name": "石榴园",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.10076,
    32.15762
   ]
  },
  {
   "id": "jiang-ning",
   "name": "江宁",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.89392,
    31.9387
   ]
  },
  {
   "id": "ju-rong-xi",
   "name": "句容西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.97471,
    31.83472
   ]
  },
  {
   "id": "li-shui",
   "name": "溧水",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.09096,
    31.68134
   ]
  },
  {
   "id": "wa-wu-shan",
   "name": "瓦屋山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.26923,
    31.56099
   ]
  },
  {
   "id": "li-yang",
   "name": "溧阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.49768,
    31.38796
   ]
  },
  {
   "id": "yi-xing",
   "name": "宜兴",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.80872,
    31.31387
   ]
  },
  {
   "id": "chang-xing",
   "name": "长兴",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.97061,
    31.044
   ]
  },
  {
   "id": "hu-zhou",
   "name": "湖州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.01758,
    30.86509
   ]
  },
  {
   "id": "de-qing",
   "name": "德清",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.05682,
    30.54703
   ]
  },
  {
   "id": "hang-zhou-dong",
   "name": "杭州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.2082,
    30.29355
   ]
  },
  {
   "id": "hang-zhou-bei",
   "name": "杭州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.15943,
    30.3435
   ]
  },
  {
   "id": "miao-xi",
   "name": "妙西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.01553,
    30.78926
   ]
  },
  {
   "id": "hong-qiao-zhen",
   "name": "洪桥镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.00177,
    30.9792
   ]
  },
  {
   "id": "bei-jing-xi",
   "name": "北京西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.3151,
    39.89367
   ]
  },
  {
   "id": "zhuo-zhou-dong",
   "name": "涿州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.04739,
    39.45864
   ]
  },
  {
   "id": "gao-bei-dian-dong",
   "name": "高碑店东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.94067,
    39.28786
   ]
  },
  {
   "id": "bao-ding-dong",
   "name": "保定东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.59573,
    38.86346
   ]
  },
  {
   "id": "ding-zhou-dong",
   "name": "定州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.06906,
    38.50776
   ]
  },
  {
   "id": "zheng-ding-ji-chang",
   "name": "正定机场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.70333,
    38.25131
   ]
  },
  {
   "id": "shi-jia-zhuang",
   "name": "石家庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.47813,
    38.0095
   ]
  },
  {
   "id": "xing-tai-dong",
   "name": "邢台东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.58595,
    37.09143
   ]
  },
  {
   "id": "han-dan-dong",
   "name": "邯郸东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.55316,
    36.61981
   ]
  },
  {
   "id": "an-yang-dong",
   "name": "安阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.44796,
    36.08415
   ]
  },
  {
   "id": "he-bi-dong",
   "name": "鹤壁东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.29439,
    35.70605
   ]
  },
  {
   "id": "xin-xiang-dong",
   "name": "新乡东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.97293,
    35.31471
   ]
  },
  {
   "id": "zheng-zhou-dong",
   "name": "郑州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.77325,
    34.76019
   ]
  },
  {
   "id": "xu-chang-dong",
   "name": "许昌东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.88202,
    34.05
   ]
  },
  {
   "id": "ta-he-xi",
   "name": "漯河西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.9576,
    33.57437
   ]
  },
  {
   "id": "zhu-ma-dian-xi",
   "name": "驻马店西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.97264,
    33.00256
   ]
  },
  {
   "id": "ming-gang-dong",
   "name": "明港东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.05888,
    32.48895
   ]
  },
  {
   "id": "xin-yang-dong",
   "name": "信阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.15439,
    32.14592
   ]
  },
  {
   "id": "xiao-gan-bei",
   "name": "孝感北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.21599,
    31.58819
   ]
  },
  {
   "id": "xian-ning-bei",
   "name": "咸宁北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.29585,
    29.90161
   ]
  },
  {
   "id": "chi-bi-bei",
   "name": "赤壁北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.89479,
    29.73935
   ]
  },
  {
   "id": "yue-yang-dong",
   "name": "岳阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.20232,
    29.36896
   ]
  },
  {
   "id": "mi-luo-dong",
   "name": "汨罗东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.13822,
    28.74864
   ]
  },
  {
   "id": "chang-sha-nan",
   "name": "长沙南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.05988,
    28.15008
   ]
  },
  {
   "id": "zhu-zhou-xi",
   "name": "株洲西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.06284,
    27.79395
   ]
  },
  {
   "id": "heng-shan-xi",
   "name": "衡山西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.78379,
    27.2511
   ]
  },
  {
   "id": "heng-yang-dong",
   "name": "衡阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.70449,
    26.8997
   ]
  },
  {
   "id": "chen-zhou-xi",
   "name": "郴州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.96453,
    25.73913
   ]
  },
  {
   "id": "le-chang-dong",
   "name": "乐昌东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.3907,
    25.11624
   ]
  },
  {
   "id": "shao-guan",
   "name": "韶关",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.50896,
    24.75351
   ]
  },
  {
   "id": "ying-de-xi",
   "name": "英德西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.34489,
    24.16251
   ]
  },
  {
   "id": "qing-yuan",
   "name": "清远",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.12946,
    23.69628
   ]
  },
  {
   "id": "guang-zhou-bei",
   "name": "广州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.19843,
    23.37945
   ]
  },
  {
   "id": "guang-zhou-nan",
   "name": "广州南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.26404,
    22.99141
   ]
  },
  {
   "id": "he-sheng-qiao-dong",
   "name": "贺胜桥东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.37145,
    30.01852
   ]
  },
  {
   "id": "wu-chang-dong",
   "name": "武昌东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.44318,
    30.55347
   ]
  },
  {
   "id": "gao-yi-xi",
   "name": "高邑西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.52506,
    37.62518
   ]
  },
  {
   "id": "cha-shan-ao",
   "name": "茶山坳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.70578,
    26.9286
   ]
  },
  {
   "id": "liu-xin-zhuang",
   "name": "柳辛庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.50426,
    38.0995
   ]
  },
  {
   "id": "shan-po-dong",
   "name": "山坡东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.36384,
    30.0911
   ]
  },
  {
   "id": "nan-cao",
   "name": "南曹",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.7832,
    34.67913
   ]
  },
  {
   "id": "xu-shui-dong",
   "name": "徐水东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.75218,
    39.04269
   ]
  },
  {
   "id": "jiang-cun",
   "name": "江村",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.20818,
    23.30729
   ]
  },
  {
   "id": "zhang-xin-dian",
   "name": "长辛店",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.20851,
    39.8278
   ]
  },
  {
   "id": "jiang-gao-zhen",
   "name": "江高镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.21572,
    23.28502
   ]
  },
  {
   "id": "guo-tang",
   "name": "郭塘",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.20391,
    23.33071
   ]
  },
  {
   "id": "yin-zhan-ao",
   "name": "银盏坳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.13745,
    23.57151
   ]
  },
  {
   "id": "heng-gou-qiao",
   "name": "横沟桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.34901,
    29.93503
   ]
  },
  {
   "id": "wei-hui",
   "name": "卫辉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.05768,
    35.42572
   ]
  },
  {
   "id": "lei-yang-xi",
   "name": "耒阳西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.78259,
    26.4176
   ]
  },
  {
   "id": "wu-long-quan-dong",
   "name": "乌龙泉东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.3568,
    30.20392
   ]
  },
  {
   "id": "jiang-gao",
   "name": "江高",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.21613,
    23.2798
   ]
  },
  {
   "id": "ya-men-kou-dong",
   "name": "衙门口东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.2146,
    39.89417
   ]
  },
  {
   "id": "wu-gang",
   "name": "武钢",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.44478,
    30.55106
   ]
  },
  {
   "id": "shen-shan",
   "name": "神山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.20393,
    23.33211
   ]
  },
  {
   "id": "da-shui-dong",
   "name": "大水洞",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.96181,
    25.77523
   ]
  },
  {
   "id": "qing-sheng",
   "name": "庆盛",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    113.5999,
    22.86195
   ]
  },
  {
   "id": "hu-men",
   "name": "虎门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.66829,
    22.86323
   ]
  },
  {
   "id": "guang-ming-cheng",
   "name": "光明城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.9499,
    22.73558
   ]
  },
  {
   "id": "shen-zhen-bei",
   "name": "深圳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.02395,
    22.61204
   ]
  },
  {
   "id": "fu-tian",
   "name": "福田",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.05118,
    22.54132
   ]
  },
  {
   "id": "xiang-gang-xi-jiu-long",
   "name": "香港西九龙",
   "aliases": [],
   "kind": "station",
   "source": "data-snap",
   "coord": [
    114.1663,
    22.3017
   ]
  },
  {
   "id": "nan-sha-bei",
   "name": "南沙北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.48501,
    22.8687
   ]
  },
  {
   "id": "han-chuan",
   "name": "汉川",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.80725,
    30.5442
   ]
  },
  {
   "id": "tian-men-nan",
   "name": "天门南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.45035,
    30.43038
   ]
  },
  {
   "id": "qian-jiang",
   "name": "潜江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.93368,
    30.39206
   ]
  },
  {
   "id": "jing-zhou",
   "name": "荆州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.20744,
    30.37257
   ]
  },
  {
   "id": "zhi-jiang-bei",
   "name": "枝江北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.76662,
    30.47962
   ]
  },
  {
   "id": "yi-chang-dong",
   "name": "宜昌东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.36488,
    30.66041
   ]
  },
  {
   "id": "ba-dong",
   "name": "巴东",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    110.36953,
    30.67242
   ]
  },
  {
   "id": "jian-shi",
   "name": "建始",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.72345,
    30.56982
   ]
  },
  {
   "id": "en-shi",
   "name": "恩施",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.47988,
    30.35128
   ]
  },
  {
   "id": "li-chuan",
   "name": "利川",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.93597,
    30.28118
   ]
  },
  {
   "id": "shi-zhu-xian",
   "name": "石柱县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.0932,
    29.96742
   ]
  },
  {
   "id": "fu-ling-bei",
   "name": "涪陵北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.27312,
    29.77309
   ]
  },
  {
   "id": "chang-shou-bei",
   "name": "长寿北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.07008,
    29.88323
   ]
  },
  {
   "id": "chong-qing-bei",
   "name": "重庆北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.54727,
    29.61232
   ]
  },
  {
   "id": "he-chuan",
   "name": "合川",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.27457,
    29.96157
   ]
  },
  {
   "id": "sui-ning",
   "name": "遂宁",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.53903,
    30.5456
   ]
  },
  {
   "id": "cheng-du-dong",
   "name": "成都东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.13892,
    30.6313
   ]
  },
  {
   "id": "jing-zhou-bei",
   "name": "荆州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.23228,
    30.3725
   ]
  },
  {
   "id": "da-ying",
   "name": "大英",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.25004,
    30.57338
   ]
  },
  {
   "id": "xian-tao-xi",
   "name": "仙桃西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.13905,
    30.42765
   ]
  },
  {
   "id": "shi-ban-tan",
   "name": "石板滩",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.26485,
    30.7252
   ]
  },
  {
   "id": "da-ying-dong",
   "name": "大英东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.2725,
    30.57053
   ]
  },
  {
   "id": "yi-chang-nan",
   "name": "宜昌南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.21933,
    30.68212
   ]
  },
  {
   "id": "ye-san-guan",
   "name": "野三关",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.36175,
    30.66966
   ]
  },
  {
   "id": "zhang-yang",
   "name": "长阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.84484,
    30.62257
   ]
  },
  {
   "id": "luo-shui-dong-yu-liu",
   "name": "落水洞 (预留)",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.94617,
    30.5812
   ]
  },
  {
   "id": "bai-yang-ping-yu-liu",
   "name": "白杨坪 (预留)",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.62285,
    30.48051
   ]
  },
  {
   "id": "liang-wu",
   "name": "凉雾",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.81401,
    30.263
   ]
  },
  {
   "id": "feng-dou",
   "name": "丰都",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.68342,
    29.84706
   ]
  },
  {
   "id": "san-xi-kou",
   "name": "三溪口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.44683,
    29.73398
   ]
  },
  {
   "id": "jing-kou",
   "name": "井口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.454,
    29.65591
   ]
  },
  {
   "id": "fu-sheng",
   "name": "复盛",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.79632,
    29.65666
   ]
  },
  {
   "id": "shuang-xi",
   "name": "双溪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.73776,
    29.65263
   ]
  },
  {
   "id": "huang-shui",
   "name": "黄水",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.49283,
    30.09812
   ]
  },
  {
   "id": "wu-jia-shan",
   "name": "吴家山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.06835,
    30.61305
   ]
  },
  {
   "id": "tong-nan",
   "name": "潼南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.87365,
    30.22317
   ]
  },
  {
   "id": "huai-kou",
   "name": "淮口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.57071,
    30.73613
   ]
  },
  {
   "id": "luo-qi",
   "name": "洛碛",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.91255,
    29.72997
   ]
  },
  {
   "id": "yan-jia",
   "name": "晏家",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.96148,
    29.82992
   ]
  },
  {
   "id": "shi-zi-shan",
   "name": "石子山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.44398,
    29.86252
   ]
  },
  {
   "id": "xin-dun",
   "name": "新墩",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.19617,
    30.61975
   ]
  },
  {
   "id": "duo-luo-kou",
   "name": "舵落口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.11866,
    30.60525
   ]
  },
  {
   "id": "da-fu",
   "name": "大福",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.56999,
    30.44662
   ]
  },
  {
   "id": "san-xing",
   "name": "三星",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.71855,
    30.36014
   ]
  },
  {
   "id": "xia-tai-he",
   "name": "下太和",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.05134,
    30.11046
   ]
  },
  {
   "id": "wei-tuo",
   "name": "渭沱",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.17704,
    30.02878
   ]
  },
  {
   "id": "huai-kou-nan",
   "name": "淮口南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.57606,
    30.73417
   ]
  },
  {
   "id": "ji-jin-nan",
   "name": "积金南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.86862,
    30.68911
   ]
  },
  {
   "id": "sui-ning-nan",
   "name": "遂宁南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.5687,
    30.47939
   ]
  },
  {
   "id": "sui-ning-xi",
   "name": "遂宁西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.4444,
    30.55131
   ]
  },
  {
   "id": "xing-guang",
   "name": "星光",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.35093,
    30.57155
   ]
  },
  {
   "id": "yu-feng",
   "name": "玉峰",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.16155,
    30.59391
   ]
  },
  {
   "id": "ji-jin",
   "name": "积金",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.86862,
    30.68911
   ]
  },
  {
   "id": "zhuan-long",
   "name": "转龙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.79144,
    30.69506
   ]
  },
  {
   "id": "long-sheng",
   "name": "隆盛",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.699,
    30.69939
   ]
  },
  {
   "id": "gao-ban",
   "name": "高板",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.63312,
    30.72168
   ]
  },
  {
   "id": "qi-long",
   "name": "骑龙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.10175,
    30.59946
   ]
  },
  {
   "id": "gao-ping",
   "name": "高坪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.08465,
    30.66677
   ]
  },
  {
   "id": "che-xi-yu-liu",
   "name": "车溪 (预留)",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.01443,
    30.69104
   ]
  },
  {
   "id": "bai-guo",
   "name": "白果",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.31984,
    30.21953
   ]
  },
  {
   "id": "jia-xing-nan",
   "name": "嘉兴南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.79391,
    30.69579
   ]
  },
  {
   "id": "tong-xiang",
   "name": "桐乡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.56364,
    30.53959
   ]
  },
  {
   "id": "hai-ning-xi",
   "name": "海宁西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.38738,
    30.44095
   ]
  },
  {
   "id": "zhu-ji",
   "name": "诸暨",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.18054,
    29.72966
   ]
  },
  {
   "id": "yi-wu",
   "name": "义乌",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.0387,
    29.38084
   ]
  },
  {
   "id": "jin-hua",
   "name": "金华",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.63122,
    29.11428
   ]
  },
  {
   "id": "long-you",
   "name": "龙游",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.16011,
    29.00584
   ]
  },
  {
   "id": "qu-zhou",
   "name": "衢州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.87612,
    28.92702
   ]
  },
  {
   "id": "jiang-shan",
   "name": "江山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.63895,
    28.77569
   ]
  },
  {
   "id": "yu-shan-nan",
   "name": "玉山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.28811,
    28.65008
   ]
  },
  {
   "id": "shang-rao",
   "name": "上饶",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.00308,
    28.49412
   ]
  },
  {
   "id": "yi-yang",
   "name": "弋阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.43972,
    28.41425
   ]
  },
  {
   "id": "ying-tan-bei",
   "name": "鹰潭北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.03387,
    28.30876
   ]
  },
  {
   "id": "fu-zhou-dong",
   "name": "抚州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.61188,
    28.26394
   ]
  },
  {
   "id": "jin-xian-nan",
   "name": "进贤南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.22965,
    28.34073
   ]
  },
  {
   "id": "nan-chang-xi",
   "name": "南昌西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.78771,
    28.62573
   ]
  },
  {
   "id": "gao-an",
   "name": "高安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.37981,
    28.47415
   ]
  },
  {
   "id": "xin-yu-bei",
   "name": "新余北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.89133,
    27.91523
   ]
  },
  {
   "id": "yi-chun",
   "name": "宜春",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.43154,
    27.79155
   ]
  },
  {
   "id": "ping-xiang-bei",
   "name": "萍乡北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.8423,
    27.68745
   ]
  },
  {
   "id": "li-ling-dong",
   "name": "醴陵东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.5726,
    27.7185
   ]
  },
  {
   "id": "xiang-tan-bei",
   "name": "湘潭北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.93713,
    27.96827
   ]
  },
  {
   "id": "shao-shan-nan",
   "name": "韶山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.54237,
    27.8917
   ]
  },
  {
   "id": "lou-di-nan",
   "name": "娄底南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.00847,
    27.66626
   ]
  },
  {
   "id": "shao-yang-bei",
   "name": "邵阳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.49898,
    27.57756
   ]
  },
  {
   "id": "xin-hua-nan",
   "name": "新化南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.15505,
    27.65861
   ]
  },
  {
   "id": "xu-pu-nan",
   "name": "溆浦南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.58809,
    27.60852
   ]
  },
  {
   "id": "huai-hua-nan",
   "name": "怀化南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.98876,
    27.51552
   ]
  },
  {
   "id": "zhi-jiang",
   "name": "芷江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.65543,
    27.45862
   ]
  },
  {
   "id": "xin-huang-xi",
   "name": "新晃西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.12148,
    27.38343
   ]
  },
  {
   "id": "tong-ren-nan",
   "name": "铜仁南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.97131,
    27.28245
   ]
  },
  {
   "id": "san-sui",
   "name": "三穗",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.6473,
    26.96838
   ]
  },
  {
   "id": "kai-li-nan",
   "name": "凯里南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.8838,
    26.51765
   ]
  },
  {
   "id": "gui-ding-bei",
   "name": "贵定北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.22866,
    26.59594
   ]
  },
  {
   "id": "gui-yang-bei",
   "name": "贵阳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.67245,
    26.62283
   ]
  },
  {
   "id": "ping-ba-nan",
   "name": "平坝南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.25342,
    26.38725
   ]
  },
  {
   "id": "an-shun-xi",
   "name": "安顺西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.87234,
    26.20213
   ]
  },
  {
   "id": "guan-ling",
   "name": "关岭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.52492,
    25.96826
   ]
  },
  {
   "id": "pu-an-xian",
   "name": "普安县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.86743,
    25.8058
   ]
  },
  {
   "id": "pan-zhou",
   "name": "盘州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.56572,
    25.79541
   ]
  },
  {
   "id": "fu-yuan-bei",
   "name": "富源北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.26855,
    25.7167
   ]
  },
  {
   "id": "qu-jing-bei",
   "name": "曲靖北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.78126,
    25.59249
   ]
  },
  {
   "id": "song-ming",
   "name": "嵩明",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.13567,
    25.24257
   ]
  },
  {
   "id": "kun-ming-nan",
   "name": "昆明南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.86038,
    24.87336
   ]
  },
  {
   "id": "ying-ning",
   "name": "盈宁",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.26663,
    30.22794
   ]
  },
  {
   "id": "ya-qian",
   "name": "衙前",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.43165,
    28.28813
   ]
  },
  {
   "id": "bin-jiang",
   "name": "彬江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.54976,
    27.78991
   ]
  },
  {
   "id": "bai-shui-zhen",
   "name": "白水镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.00143,
    25.66532
   ]
  },
  {
   "id": "xiao-xin-jie",
   "name": "小新街",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.22594,
    25.30353
   ]
  },
  {
   "id": "wen-jia-zhen",
   "name": "温家圳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.11246,
    28.36741
   ]
  },
  {
   "id": "che-zhuan-wan",
   "name": "车转湾",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.15166,
    25.7026
   ]
  },
  {
   "id": "gao-feng",
   "name": "高峰",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.34047,
    26.38647
   ]
  },
  {
   "id": "ma-chang",
   "name": "马场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.41498,
    26.40517
   ]
  },
  {
   "id": "jian-qiao",
   "name": "笕桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.20995,
    30.336
   ]
  },
  {
   "id": "jin-shan-bei",
   "name": "金山北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.08669,
    30.89764
   ]
  },
  {
   "id": "jin-hua-dong",
   "name": "金华东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.66219,
    29.11883
   ]
  },
  {
   "id": "dong-xiao",
   "name": "东孝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.70732,
    29.12916
   ]
  },
  {
   "id": "tang-ya",
   "name": "塘雅",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.79886,
    29.16082
   ]
  },
  {
   "id": "li-jia-tang",
   "name": "李家塘",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.35641,
    31.11347
   ]
  },
  {
   "id": "qi-bao",
   "name": "七宝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.32394,
    31.16106
   ]
  },
  {
   "id": "gui-yang-dong",
   "name": "贵阳东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.74563,
    26.66665
   ]
  },
  {
   "id": "qiao-si",
   "name": "乔司",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.26524,
    30.37057
   ]
  },
  {
   "id": "yi-chun-xi",
   "name": "宜春西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.38289,
    27.78786
   ]
  },
  {
   "id": "jin-hua-zhen",
   "name": "金华镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.54726,
    26.55647
   ]
  },
  {
   "id": "he-tan-bu",
   "name": "河潭埠",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.34187,
    28.39922
   ]
  },
  {
   "id": "qu-zhou-dong",
   "name": "衢州东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.96546,
    28.96898
   ]
  },
  {
   "id": "guan-chao",
   "name": "观巢",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.81266,
    27.87818
   ]
  },
  {
   "id": "hang-zhou-nan",
   "name": "杭州南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.29108,
    30.17358
   ]
  },
  {
   "id": "yi-wu-xi",
   "name": "义乌西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.96869,
    29.31378
   ]
  },
  {
   "id": "gui-an",
   "name": "贵安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.48261,
    26.47303
   ]
  },
  {
   "id": "lin-ping-nan",
   "name": "临平南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.28961,
    30.38186
   ]
  },
  {
   "id": "jia-shan-nan",
   "name": "嘉善南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.9301,
    30.78878
   ]
  },
  {
   "id": "shang-hai-song-jiang",
   "name": "上海松江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.22413,
    30.98356
   ]
  },
  {
   "id": "da-zong-ping",
   "name": "大宗坪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.05839,
    27.35216
   ]
  },
  {
   "id": "chun-shen",
   "name": "春申",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.35091,
    31.07995
   ]
  },
  {
   "id": "hua-xi-xi",
   "name": "花溪西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.5129,
    26.52129
   ]
  },
  {
   "id": "zhan-yi",
   "name": "沾益",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.80153,
    25.61021
   ]
  },
  {
   "id": "ma-long",
   "name": "马龙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.62046,
    25.49078
   ]
  },
  {
   "id": "xin-qiao",
   "name": "新桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    121.31976,
    31.05957
   ]
  },
  {
   "id": "huai-hua-xi",
   "name": "怀化西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.94447,
    27.50294
   ]
  },
  {
   "id": "ban-bian-jie",
   "name": "半边街",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.28954,
    26.58511
   ]
  },
  {
   "id": "tian-long",
   "name": "天龙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.17055,
    26.36969
   ]
  },
  {
   "id": "yao-pu",
   "name": "幺铺",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.8374,
    26.18119
   ]
  },
  {
   "id": "ding-qiao-you-ku-xie-you",
   "name": "丁桥油库卸油站",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.22085,
    30.34137
   ]
  },
  {
   "id": "zheng-jia-wu",
   "name": "郑家坞",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.09745,
    29.50424
   ]
  },
  {
   "id": "zhu-ji-dong",
   "name": "诸暨东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.19196,
    29.77104
   ]
  },
  {
   "id": "jin-yi",
   "name": "金义",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.8898,
    29.19345
   ]
  },
  {
   "id": "ping-ba",
   "name": "平坝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.29594,
    26.38622
   ]
  },
  {
   "id": "ji-tou-cun",
   "name": "鸡头村",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.60356,
    25.48548
   ]
  },
  {
   "id": "xiao-xian-bei",
   "name": "萧县北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.93624,
    34.23786
   ]
  },
  {
   "id": "yong-cheng-bei",
   "name": "永城北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.51511,
    34.2178
   ]
  },
  {
   "id": "dang-shan-nan",
   "name": "砀山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.29787,
    34.38736
   ]
  },
  {
   "id": "shang-qiu",
   "name": "商丘",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.65186,
    34.44606
   ]
  },
  {
   "id": "min-quan-bei",
   "name": "民权北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.17451,
    34.66119
   ]
  },
  {
   "id": "lan-kao-nan",
   "name": "兰考南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.8183,
    34.77202
   ]
  },
  {
   "id": "kai-feng-bei",
   "name": "开封北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.25605,
    34.84064
   ]
  },
  {
   "id": "gong-yi-nan",
   "name": "巩义南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.91056,
    34.67169
   ]
  },
  {
   "id": "luo-yang-long-men",
   "name": "洛阳龙门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.45269,
    34.59428
   ]
  },
  {
   "id": "san-men-xia-nan",
   "name": "三门峡南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.15422,
    34.74959
   ]
  },
  {
   "id": "hua-shan-bei",
   "name": "华山北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.09303,
    34.5832
   ]
  },
  {
   "id": "xi-an-bei",
   "name": "西安北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.93403,
    34.37767
   ]
  },
  {
   "id": "yang-ling-nan",
   "name": "杨陵南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.04832,
    34.2556
   ]
  },
  {
   "id": "qi-shan",
   "name": "岐山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.60833,
    34.27568
   ]
  },
  {
   "id": "bao-ji-nan",
   "name": "宝鸡南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.22787,
    34.33564
   ]
  },
  {
   "id": "tian-shui-nan",
   "name": "天水南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.85232,
    34.55102
   ]
  },
  {
   "id": "qin-an",
   "name": "秦安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.65518,
    34.84719
   ]
  },
  {
   "id": "tong-wei",
   "name": "通渭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.25938,
    35.19626
   ]
  },
  {
   "id": "ding-xi-bei",
   "name": "定西北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.58343,
    35.60681
   ]
  },
  {
   "id": "lan-zhou-xi",
   "name": "兰州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.74928,
    36.06758
   ]
  },
  {
   "id": "mian-chi-nan",
   "name": "渑池南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.77756,
    34.68459
   ]
  },
  {
   "id": "zheng-zhou-xi",
   "name": "郑州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.41629,
    34.74472
   ]
  },
  {
   "id": "xian-yang",
   "name": "咸阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.73051,
    34.34725
   ]
  },
  {
   "id": "li-tun",
   "name": "李屯",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    112.40964,
    34.58185
   ]
  },
  {
   "id": "xian-yang-xi",
   "name": "咸阳西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.66694,
    34.33379
   ]
  },
  {
   "id": "xin-feng-zhen",
   "name": "新丰镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.27255,
    34.44247
   ]
  },
  {
   "id": "he-jia-zhuang",
   "name": "贺家庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.20713,
    34.74746
   ]
  },
  {
   "id": "she-tang",
   "name": "社棠",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.98859,
    34.55143
   ]
  },
  {
   "id": "ren-jia-wan",
   "name": "任家湾",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.10017,
    34.34137
   ]
  },
  {
   "id": "mao-ling",
   "name": "茂陵",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.60748,
    34.31667
   ]
  },
  {
   "id": "jiao-kou",
   "name": "交口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    111.26658,
    34.71725
   ]
  },
  {
   "id": "xing-zhe",
   "name": "行者",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.18721,
    34.40917
   ]
  },
  {
   "id": "lin-tong-dong",
   "name": "临潼东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.25378,
    34.43507
   ]
  },
  {
   "id": "dong-kou",
   "name": "东口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.69367,
    34.36477
   ]
  },
  {
   "id": "yang-tun",
   "name": "杨屯",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.15514,
    34.33731
   ]
  },
  {
   "id": "nan-gang",
   "name": "南岗",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.12471,
    34.31815
   ]
  },
  {
   "id": "nan-he-chuan",
   "name": "南河川",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.75988,
    34.62164
   ]
  },
  {
   "id": "gong-zhuang",
   "name": "公庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.20298,
    34.60224
   ]
  },
  {
   "id": "wei-nan-bei",
   "name": "渭南北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.4759,
    34.53717
   ]
  },
  {
   "id": "dong-cha",
   "name": "东岔",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.5394,
    34.4421
   ]
  },
  {
   "id": "liu-zhi",
   "name": "柳枝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.89082,
    34.53693
   ]
  },
  {
   "id": "luo-wang",
   "name": "罗王",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.68219,
    34.80302
   ]
  },
  {
   "id": "ling-bao-xi",
   "name": "灵宝西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    110.68379,
    34.57765
   ]
  },
  {
   "id": "yu-zhong",
   "name": "榆中",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.16592,
    35.8541
   ]
  },
  {
   "id": "xia-xiao-cha",
   "name": "下小岔",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.93821,
    35.3645
   ]
  },
  {
   "id": "zhou-zhai-zi",
   "name": "周宅子",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.22396,
    34.35461
   ]
  },
  {
   "id": "bei-dong-zha",
   "name": "北东闸",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.70768,
    34.42791
   ]
  },
  {
   "id": "san-yi-cun",
   "name": "三义村",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    109.09157,
    34.40607
   ]
  },
  {
   "id": "hai-dong-xi",
   "name": "海东西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.05352,
    36.50948
   ]
  },
  {
   "id": "xi-ning",
   "name": "西宁",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.81304,
    36.62076
   ]
  },
  {
   "id": "da-tong-xi",
   "name": "大通西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.67176,
    36.966
   ]
  },
  {
   "id": "men-yuan",
   "name": "门源",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.52625,
    37.42653
   ]
  },
  {
   "id": "min-yue",
   "name": "民乐",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    100.83741,
    38.4736
   ]
  },
  {
   "id": "zhang-ye-xi",
   "name": "张掖西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    100.42655,
    38.9225
   ]
  },
  {
   "id": "lin-ze-nan",
   "name": "临泽南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    100.12299,
    39.13319
   ]
  },
  {
   "id": "jiu-quan-nan",
   "name": "酒泉南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    98.53507,
    39.70063
   ]
  },
  {
   "id": "jia-yu-guan-nan",
   "name": "嘉峪关南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    98.30925,
    39.71671
   ]
  },
  {
   "id": "yu-men",
   "name": "玉门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    97.0439,
    40.27159
   ]
  },
  {
   "id": "liu-yuan-nan",
   "name": "柳园南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    95.47079,
    41.1006
   ]
  },
  {
   "id": "ha-mi",
   "name": "哈密",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    93.50465,
    42.84844
   ]
  },
  {
   "id": "shan-shan-bei",
   "name": "鄯善北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    90.19371,
    42.91725
   ]
  },
  {
   "id": "tu-ha",
   "name": "吐哈",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    90.52991,
    43.05916
   ]
  },
  {
   "id": "tu-lu-fan-bei",
   "name": "吐鲁番北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    89.10797,
    43.02136
   ]
  },
  {
   "id": "wu-lu-mu-qi",
   "name": "乌鲁木齐",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.52621,
    43.83941
   ]
  },
  {
   "id": "wu-lu-mu-qi-nan",
   "name": "乌鲁木齐南 ئۇرۇمچى جەنۇبى",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.58286,
    43.77506
   ]
  },
  {
   "id": "di-wo-pu",
   "name": "低窝铺",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    97.24214,
    40.14557
   ]
  },
  {
   "id": "da-quan",
   "name": "大泉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    95.18354,
    41.28461
   ]
  },
  {
   "id": "min-he-nan",
   "name": "民和南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.8507,
    36.30521
   ]
  },
  {
   "id": "hai-dong",
   "name": "海东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.38577,
    36.46743
   ]
  },
  {
   "id": "gao-tai-nan",
   "name": "高台南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    99.7724,
    39.29268
   ]
  },
  {
   "id": "qing-shui-bei",
   "name": "清水北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    99.09962,
    39.37334
   ]
  },
  {
   "id": "qing-quan-nan",
   "name": "清泉南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    97.56996,
    39.97883
   ]
  },
  {
   "id": "hong-liu-he-nan",
   "name": "红柳河南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    94.68613,
    41.53037
   ]
  },
  {
   "id": "liu-shu-quan-nan",
   "name": "柳树泉南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    92.7524,
    43.0273
   ]
  },
  {
   "id": "hong-ceng-nan",
   "name": "红层南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    91.64303,
    43.11703
   ]
  },
  {
   "id": "da-he-yan",
   "name": "大河沿 داخىيەن",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    88.78974,
    43.13202
   ]
  },
  {
   "id": "yan-hu-xi",
   "name": "盐湖西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    88.09266,
    43.43781
   ]
  },
  {
   "id": "ping-an-yi",
   "name": "平安驿",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.10796,
    36.50723
   ]
  },
  {
   "id": "shan-dan-ma-chang",
   "name": "山丹马场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.20653,
    38.09084
   ]
  },
  {
   "id": "shi-ban-dun-nan",
   "name": "石板墩南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    95.91681,
    40.88524
   ]
  },
  {
   "id": "liu-gou-nan",
   "name": "柳沟南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    96.422,
    40.64221
   ]
  },
  {
   "id": "yan-dun-dong",
   "name": "烟墩东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    94.09338,
    42.16312
   ]
  },
  {
   "id": "xi-ning-bei",
   "name": "西宁北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.77592,
    36.66537
   ]
  },
  {
   "id": "da-xia",
   "name": "大峡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    102.21704,
    36.47378
   ]
  },
  {
   "id": "chen-jia-wan-xi",
   "name": "陈家湾西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.20348,
    36.1638
   ]
  },
  {
   "id": "shi-er-zhong",
   "name": "十二中",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.58066,
    43.76403
   ]
  },
  {
   "id": "qing-feng-lu",
   "name": "青峰路",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.57752,
    43.75595
   ]
  },
  {
   "id": "zhu-jiang-lu",
   "name": "珠江路",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.58461,
    43.76991
   ]
  },
  {
   "id": "ping-chuan-lu",
   "name": "平川路",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.54178,
    43.8091
   ]
  },
  {
   "id": "jiu-jia-wan",
   "name": "九家湾",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    87.54016,
    43.83158
   ]
  },
  {
   "id": "sheng-jin-bei",
   "name": "胜金北 شىمالىي سىڭگىم",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    89.66004,
    43.01649
   ]
  },
  {
   "id": "da-quan-nan",
   "name": "大泉南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    95.14661,
    41.29353
   ]
  },
  {
   "id": "si-tian-nan",
   "name": "思甜南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    94.23457,
    41.94072
   ]
  },
  {
   "id": "yan-quan-bei",
   "name": "盐泉北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    93.85031,
    42.50206
   ]
  },
  {
   "id": "le-dun-bei",
   "name": "了墩北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    92.17879,
    43.11224
   ]
  },
  {
   "id": "xiao-cao-hu-xi",
   "name": "小草湖西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    91.06351,
    43.11009
   ]
  },
  {
   "id": "hao-men",
   "name": "浩门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.43907,
    37.5734
   ]
  },
  {
   "id": "hua-zhuang",
   "name": "花庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    103.16053,
    36.18793
   ]
  },
  {
   "id": "xiao-qiao",
   "name": "小桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.79129,
    36.64234
   ]
  },
  {
   "id": "xi-ning-dong",
   "name": "西宁东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    101.88461,
    36.57833
   ]
  },
  {
   "id": "da-ban-cheng",
   "name": "达坂城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    88.29492,
    43.34681
   ]
  },
  {
   "id": "yan-hu",
   "name": "盐湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    88.11035,
    43.42402
   ]
  },
  {
   "id": "tian-shan",
   "name": "天山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    88.53322,
    43.20402
   ]
  },
  {
   "id": "jing-xia",
   "name": "景峡",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    94.27821,
    41.86848
   ]
  },
  {
   "id": "jun-ken",
   "name": "军垦",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    96.95964,
    40.32797
   ]
  },
  {
   "id": "yao-quan-zi",
   "name": "腰泉子",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    97.67283,
    39.94521
   ]
  },
  {
   "id": "tun-sheng",
   "name": "屯升",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    99.21041,
    39.35094
   ]
  },
  {
   "id": "xu-san-wan",
   "name": "许三湾",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    99.41089,
    39.31809
   ]
  },
  {
   "id": "xin-hua-zhuang",
   "name": "新华庄",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    100.02817,
    39.1806
   ]
  },
  {
   "id": "hu-yi",
   "name": "鄠邑",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.67572,
    34.08098
   ]
  },
  {
   "id": "yang-xian-xi",
   "name": "洋县西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.51856,
    33.22871
   ]
  },
  {
   "id": "cheng-gu-bei",
   "name": "城固北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.30145,
    33.18598
   ]
  },
  {
   "id": "han-zhong",
   "name": "汉中",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.02552,
    33.09293
   ]
  },
  {
   "id": "ning-qiang-nan",
   "name": "宁强南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.28507,
    32.82383
   ]
  },
  {
   "id": "guang-yuan",
   "name": "广元",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.81797,
    32.45266
   ]
  },
  {
   "id": "jian-men-guan",
   "name": "剑门关",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.48106,
    32.28367
   ]
  },
  {
   "id": "jiang-you-bei",
   "name": "江油北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.07226,
    31.98537
   ]
  },
  {
   "id": "jiang-you",
   "name": "江油",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.76754,
    31.78344
   ]
  },
  {
   "id": "mian-yang",
   "name": "绵阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.71463,
    31.46213
   ]
  },
  {
   "id": "de-yang",
   "name": "德阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.38641,
    31.16835
   ]
  },
  {
   "id": "guang-han-bei",
   "name": "广汉北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.27307,
    31.0117
   ]
  },
  {
   "id": "sha-xi-ba",
   "name": "沙溪坝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.5048,
    32.29324
   ]
  },
  {
   "id": "guang-han",
   "name": "广汉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.25827,
    30.9862
   ]
  },
  {
   "id": "wang-jia-kan",
   "name": "王家坎",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.1099,
    33.10784
   ]
  },
  {
   "id": "xin-chang-jie",
   "name": "新场街",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.33801,
    33.74599
   ]
  },
  {
   "id": "luo-jiang-dong",
   "name": "罗江东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.52891,
    31.30226
   ]
  },
  {
   "id": "xin-dou-dong",
   "name": "新都东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.19472,
    30.80558
   ]
  },
  {
   "id": "xi-an-xi",
   "name": "西安西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    108.74688,
    34.26749
   ]
  },
  {
   "id": "qing-chuan",
   "name": "青川",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    105.32621,
    32.18707
   ]
  },
  {
   "id": "chao-tian",
   "name": "朝天",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.06718,
    32.70557
   ]
  },
  {
   "id": "xin-ji",
   "name": "新集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    106.80149,
    33.02604
   ]
  },
  {
   "id": "qing-lian",
   "name": "青莲",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.69948,
    31.67501
   ]
  },
  {
   "id": "jing-yang",
   "name": "旌阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.33978,
    31.09644
   ]
  },
  {
   "id": "shuang-he-kou",
   "name": "双河口",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.8735,
    31.86683
   ]
  },
  {
   "id": "mian-yang-bei",
   "name": "绵阳北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.71657,
    31.55947
   ]
  },
  {
   "id": "san-he-chang",
   "name": "三合场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.74281,
    31.73347
   ]
  },
  {
   "id": "qing-bai-jiang-dong",
   "name": "青白江东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.22444,
    30.90109
   ]
  },
  {
   "id": "fu-ping",
   "name": "佛坪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    107.97627,
    33.49945
   ]
  },
  {
   "id": "zao-jiao-pu",
   "name": "皂角铺",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    104.65795,
    31.44032
   ]
  },
  {
   "id": "da-xing-ji-chang",
   "name": "大兴机场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.41056,
    39.51336
   ]
  },
  {
   "id": "gu-an-dong",
   "name": "固安东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.39832,
    39.37106
   ]
  },
  {
   "id": "ba-zhou-bei",
   "name": "霸州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.32097,
    39.18495
   ]
  },
  {
   "id": "xiong-an",
   "name": "雄安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.15414,
    39.05558
   ]
  },
  {
   "id": "guang-an-men",
   "name": "广安门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.33827,
    39.88271
   ]
  },
  {
   "id": "bo-zhou-nan",
   "name": "亳州南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.79309,
    33.79624
   ]
  },
  {
   "id": "gu-cheng-dong",
   "name": "古城东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.80622,
    33.52806
   ]
  },
  {
   "id": "fu-yang-xi",
   "name": "阜阳西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.74763,
    32.88494
   ]
  },
  {
   "id": "ying-shang-bei",
   "name": "颍上北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.20589,
    32.68115
   ]
  },
  {
   "id": "feng-tai-nan",
   "name": "凤台南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.61728,
    32.63857
   ]
  },
  {
   "id": "shou-xian",
   "name": "寿县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.80055,
    32.59508
   ]
  },
  {
   "id": "huai-nan-nan",
   "name": "淮南南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.03592,
    32.54425
   ]
  },
  {
   "id": "shui-jia-hu",
   "name": "水家湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.16409,
    32.48536
   ]
  },
  {
   "id": "he-fei-bei-cheng",
   "name": "合肥北城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.2467,
    32.06535
   ]
  },
  {
   "id": "shang-qiu-nan",
   "name": "商丘南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.70303,
    34.41014
   ]
  },
  {
   "id": "tai-he-dong",
   "name": "太和东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.72274,
    33.15919
   ]
  },
  {
   "id": "dai-ji",
   "name": "戴集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.18144,
    32.39789
   ]
  },
  {
   "id": "shu-shan-dong",
   "name": "蜀山东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.21015,
    31.83083
   ]
  },
  {
   "id": "wang-lou",
   "name": "王楼",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.78594,
    34.00587
   ]
  },
  {
   "id": "bo-zhou",
   "name": "亳州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.79335,
    33.85096
   ]
  },
  {
   "id": "you-he-ji",
   "name": "油河集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.8007,
    33.64702
   ]
  },
  {
   "id": "yi-yin",
   "name": "伊尹",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.73909,
    34.27335
   ]
  },
  {
   "id": "mu-lan",
   "name": "木兰",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.76352,
    34.14032
   ]
  },
  {
   "id": "shang-qiu-dong",
   "name": "商丘东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.72704,
    34.32969
   ]
  },
  {
   "id": "xia-tang-ji",
   "name": "下塘集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.21156,
    32.19722
   ]
  },
  {
   "id": "he-fei-bei",
   "name": "合肥北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.28527,
    31.91934
   ]
  },
  {
   "id": "shuang-dun-ji",
   "name": "双墩集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.25463,
    32.0105
   ]
  },
  {
   "id": "lu-miao",
   "name": "芦庙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.78,
    34.0412
   ]
  },
  {
   "id": "tao-hua-dian",
   "name": "桃花店",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.25673,
    31.89837
   ]
  },
  {
   "id": "gu-cheng-ji",
   "name": "古城集",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.8047,
    33.54628
   ]
  },
  {
   "id": "fei-xi",
   "name": "肥西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.13728,
    31.71838
   ]
  },
  {
   "id": "shu-cheng-dong",
   "name": "舒城东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.04204,
    31.487
   ]
  },
  {
   "id": "lu-jiang-xi",
   "name": "庐江西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.21245,
    31.26981
   ]
  },
  {
   "id": "tong-cheng-dong",
   "name": "桐城东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.0344,
    31.02767
   ]
  },
  {
   "id": "huai-ning",
   "name": "怀宁",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    116.84513,
    30.6713
   ]
  },
  {
   "id": "an-qing",
   "name": "安庆",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.06005,
    30.5515
   ]
  },
  {
   "id": "an-qing-bei",
   "name": "安庆北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.0018,
    30.56678
   ]
  },
  {
   "id": "tong-cheng-nan",
   "name": "桐城南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.95999,
    30.88087
   ]
  },
  {
   "id": "zhu-xi",
   "name": "竹溪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.18037,
    31.79058
   ]
  },
  {
   "id": "qian-shan",
   "name": "潜山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.61205,
    30.57631
   ]
  },
  {
   "id": "tai-hu-nan",
   "name": "太湖南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.35793,
    30.41078
   ]
  },
  {
   "id": "su-song-dong",
   "name": "宿松东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.1703,
    30.15334
   ]
  },
  {
   "id": "huang-mei-nan",
   "name": "黄梅南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.8979,
    29.94343
   ]
  },
  {
   "id": "lu-shan",
   "name": "庐山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.87434,
    29.59964
   ]
  },
  {
   "id": "an-qing-xi",
   "name": "安庆西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.85422,
    30.67347
   ]
  },
  {
   "id": "huang-mei-dong",
   "name": "黄梅东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.97196,
    30.06677
   ]
  },
  {
   "id": "jiu-jiang",
   "name": "九江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    116.00167,
    29.7066
   ]
  },
  {
   "id": "de-an",
   "name": "德安",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.76189,
    29.31178
   ]
  },
  {
   "id": "gong-qing-cheng",
   "name": "共青城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.76975,
    29.24566
   ]
  },
  {
   "id": "yong-xiu",
   "name": "永修",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.8109,
    29.02289
   ]
  },
  {
   "id": "nan-chang",
   "name": "南昌",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.91482,
    28.66529
   ]
  },
  {
   "id": "xin-qi-zhou",
   "name": "新祺周",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.82361,
    28.9489
   ]
  },
  {
   "id": "le-hua",
   "name": "乐化",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.86704,
    28.81867
   ]
  },
  {
   "id": "nan-chang-bei",
   "name": "南昌北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.86038,
    28.74161
   ]
  },
  {
   "id": "jiu-jiang-xi",
   "name": "九江西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.89433,
    29.63935
   ]
  },
  {
   "id": "jiu-jiang-nan",
   "name": "九江南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.96693,
    29.68154
   ]
  },
  {
   "id": "lian-tang",
   "name": "莲塘",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.94166,
    28.55227
   ]
  },
  {
   "id": "feng-cheng-dong",
   "name": "丰城东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.80587,
    28.16871
   ]
  },
  {
   "id": "zhang-shu-dong",
   "name": "樟树东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.5957,
    27.96821
   ]
  },
  {
   "id": "xin-gan-dong",
   "name": "新干东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.42177,
    27.74695
   ]
  },
  {
   "id": "xia-jiang",
   "name": "峡江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.33078,
    27.60227
   ]
  },
  {
   "id": "ji-shui-xi",
   "name": "吉水西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.08566,
    27.28138
   ]
  },
  {
   "id": "ji-an-xi",
   "name": "吉安西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.92839,
    27.13947
   ]
  },
  {
   "id": "tai-he",
   "name": "泰和",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.94434,
    26.83558
   ]
  },
  {
   "id": "wan-an-xian",
   "name": "万安县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.83863,
    26.52861
   ]
  },
  {
   "id": "gan-zhou-xi",
   "name": "赣州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.81156,
    25.82303
   ]
  },
  {
   "id": "qing-yun-pu",
   "name": "青云谱",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.92243,
    28.59932
   ]
  },
  {
   "id": "gan-xian",
   "name": "赣县",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.11605,
    25.96544
   ]
  },
  {
   "id": "mao-dian",
   "name": "茅店",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.08247,
    25.94402
   ]
  },
  {
   "id": "xing-guo-xi",
   "name": "兴国西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.27445,
    26.31891
   ]
  },
  {
   "id": "gan-xian-bei",
   "name": "赣县北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.15042,
    26.01038
   ]
  },
  {
   "id": "xin-feng-xi",
   "name": "信丰西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.89545,
    25.35348
   ]
  },
  {
   "id": "long-nan-dong",
   "name": "龙南东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.86365,
    24.90799
   ]
  },
  {
   "id": "ding-nan-nan",
   "name": "定南南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.02559,
    24.74625
   ]
  },
  {
   "id": "he-ping-bei",
   "name": "和平北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.95493,
    24.47549
   ]
  },
  {
   "id": "long-chuan-xi",
   "name": "龙川西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.17529,
    24.08043
   ]
  },
  {
   "id": "he-yuan-dong",
   "name": "河源东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.73276,
    23.68613
   ]
  },
  {
   "id": "bo-luo-bei",
   "name": "博罗北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.55719,
    23.4804
   ]
  },
  {
   "id": "hui-zhou-bei",
   "name": "惠州北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.37526,
    23.18287
   ]
  },
  {
   "id": "dong-guan-nan",
   "name": "东莞南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.06354,
    22.84806
   ]
  },
  {
   "id": "xin-feng",
   "name": "信丰",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.89557,
    25.39505
   ]
  },
  {
   "id": "ding-nan",
   "name": "定南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.99814,
    24.7748
   ]
  },
  {
   "id": "guan-xi-zhen",
   "name": "关西镇",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.92074,
    24.83585
   ]
  },
  {
   "id": "he-yuan-bei",
   "name": "河源北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.00177,
    23.88624
   ]
  },
  {
   "id": "zhong-kai",
   "name": "仲恺",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.26026,
    23.0263
   ]
  },
  {
   "id": "hang-zhou-xi",
   "name": "杭州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.98214,
    30.30076
   ]
  },
  {
   "id": "song-jiang-nan",
   "name": "松江南",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    121.22413,
    30.98356
   ]
  },
  {
   "id": "fu-yang",
   "name": "富阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.988,
    30.00328
   ]
  },
  {
   "id": "tong-lu",
   "name": "桐庐",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.72729,
    29.79166
   ]
  },
  {
   "id": "jian-de",
   "name": "建德",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.42268,
    29.57528
   ]
  },
  {
   "id": "qian-dao-hu",
   "name": "千岛湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.18686,
    29.73772
   ]
  },
  {
   "id": "san-yang",
   "name": "三阳",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.80188,
    30.02949
   ]
  },
  {
   "id": "ji-xi-bei",
   "name": "绩溪北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.56669,
    30.07378
   ]
  },
  {
   "id": "she-xian-bei",
   "name": "歙县北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.40518,
    29.92435
   ]
  },
  {
   "id": "huang-shan-bei",
   "name": "黄山北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.26734,
    29.81834
   ]
  },
  {
   "id": "lang-jia-xi",
   "name": "郎家溪",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.59831,
    30.09967
   ]
  },
  {
   "id": "tian-he-ji-chang",
   "name": "天河机场",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.21143,
    30.77275
   ]
  },
  {
   "id": "xiao-gan-dong",
   "name": "孝感东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.94249,
    30.93577
   ]
  },
  {
   "id": "tian-he-jie",
   "name": "天河街",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.20587,
    30.82467
   ]
  },
  {
   "id": "huai-yin",
   "name": "槐荫",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.96023,
    30.89951
   ]
  },
  {
   "id": "jin-yin-tan",
   "name": "金银潭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.25999,
    30.66073
   ]
  },
  {
   "id": "mao-chen",
   "name": "毛陈",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    113.985,
    30.8676
   ]
  },
  {
   "id": "pan-long-cheng",
   "name": "盘龙城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.21207,
    30.71807
   ]
  },
  {
   "id": "hou-hu",
   "name": "后湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.26909,
    30.63863
   ]
  },
  {
   "id": "ge-dian-nan",
   "name": "葛店南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.65509,
    30.49262
   ]
  },
  {
   "id": "hua-rong-dong",
   "name": "华容东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.78145,
    30.53426
   ]
  },
  {
   "id": "huang-gang-xi",
   "name": "黄冈西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.88343,
    30.50689
   ]
  },
  {
   "id": "huang-gang-dong",
   "name": "黄冈东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.98118,
    30.50921
   ]
  },
  {
   "id": "he-liu",
   "name": "何刘",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.49399,
    30.53115
   ]
  },
  {
   "id": "xin-dian",
   "name": "新店",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.59006,
    30.51016
   ]
  },
  {
   "id": "zuo-ling",
   "name": "左岭",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.6061,
    30.50203
   ]
  },
  {
   "id": "hua-shan-nan",
   "name": "花山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.50307,
    30.53106
   ]
  },
  {
   "id": "hua-rong",
   "name": "华容",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.74175,
    30.51604
   ]
  },
  {
   "id": "huang-gang",
   "name": "黄冈",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    114.94032,
    30.48839
   ]
  },
  {
   "id": "xi-shui-nan",
   "name": "浠水南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.23542,
    30.41367
   ]
  },
  {
   "id": "qi-chun-nan",
   "name": "蕲春南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.40219,
    30.20557
   ]
  },
  {
   "id": "wu-xue-bei",
   "name": "武穴北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.68167,
    30.00553
   ]
  },
  {
   "id": "zhuo-gang",
   "name": "濯港",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    115.89467,
    30.02603
   ]
  },
  {
   "id": "chi-zhou",
   "name": "池州",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.51702,
    30.62188
   ]
  },
  {
   "id": "jiu-hua-shan",
   "name": "九华山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.85137,
    30.59817
   ]
  },
  {
   "id": "huang-shan-xi",
   "name": "黄山西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.08466,
    30.27973
   ]
  },
  {
   "id": "yi-xian-dong",
   "name": "黟县东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.0429,
    29.88733
   ]
  },
  {
   "id": "jiang-ning-xi",
   "name": "江宁西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.59068,
    31.82572
   ]
  },
  {
   "id": "ma-an-shan-dong",
   "name": "马鞍山东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.53606,
    31.69458
   ]
  },
  {
   "id": "dang-tu-dong",
   "name": "当涂东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.52121,
    31.56352
   ]
  },
  {
   "id": "wu-hu",
   "name": "芜湖",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.386,
    31.34978
   ]
  },
  {
   "id": "yi-jiang",
   "name": "弋江",
   "aliases": [],
   "kind": "station",
   "source": "hint-snap",
   "coord": [
    118.37445,
    31.25131
   ]
  },
  {
   "id": "fan-chang-xi",
   "name": "繁昌西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.15304,
    31.07336
   ]
  },
  {
   "id": "tong-ling",
   "name": "铜陵",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.85645,
    30.9212
   ]
  },
  {
   "id": "tong-jing",
   "name": "铜井",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.56615,
    31.8016
   ]
  },
  {
   "id": "an-jiang-2",
   "name": "安江",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.5296,
    31.75548
   ]
  },
  {
   "id": "fan-chang",
   "name": "繁昌",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.19581,
    31.11276
   ]
  },
  {
   "id": "ma-ya",
   "name": "马衙",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.65701,
    30.65539
   ]
  },
  {
   "id": "wu-hu-dong",
   "name": "芜湖东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.40482,
    31.4143
   ]
  },
  {
   "id": "feng-xiang-dun",
   "name": "枫香墩",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.13628,
    31.05576
   ]
  },
  {
   "id": "e-qiao",
   "name": "峨桥",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.26983,
    31.16523
   ]
  },
  {
   "id": "tong-ling-nan",
   "name": "铜陵南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.81711,
    30.86202
   ]
  },
  {
   "id": "nan-jing-dong",
   "name": "南京东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.90218,
    32.12216
   ]
  },
  {
   "id": "zi-jin-shan-dong",
   "name": "紫金山东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.90051,
    32.07296
   ]
  },
  {
   "id": "zi-jin-shan",
   "name": "紫金山",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.89391,
    32.08663
   ]
  },
  {
   "id": "cang-bo-men",
   "name": "沧波门",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.8777,
    32.03247
   ]
  },
  {
   "id": "zhe-gao",
   "name": "柘皋",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.7186,
    31.74814
   ]
  },
  {
   "id": "chao-hu-dong",
   "name": "巢湖东",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    117.92046,
    31.62021
   ]
  },
  {
   "id": "han-shan-nan",
   "name": "含山南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.08639,
    31.47998
   ]
  },
  {
   "id": "wan-zhi-nan",
   "name": "湾沚南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.57999,
    31.09492
   ]
  },
  {
   "id": "xuan-cheng",
   "name": "宣城",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.76931,
    30.9497
   ]
  },
  {
   "id": "lang-xi-nan",
   "name": "郎溪南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.15143,
    30.94026
   ]
  },
  {
   "id": "guang-de-nan",
   "name": "广德南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.4126,
    30.857
   ]
  },
  {
   "id": "shi-zi-pu",
   "name": "十字铺",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.12665,
    30.94361
   ]
  },
  {
   "id": "er-ba",
   "name": "二坝",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.32959,
    31.3539
   ]
  },
  {
   "id": "wu-hu-bei",
   "name": "芜湖北",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.25522,
    31.35697
   ]
  },
  {
   "id": "hu-zhou-xi",
   "name": "湖州西",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    120.00133,
    30.89658
   ]
  },
  {
   "id": "wu-hu-nan",
   "name": "芜湖南",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    118.37445,
    31.25131
   ]
  },
  {
   "id": "an-ji",
   "name": "安吉",
   "aliases": [],
   "kind": "station",
   "source": "osm",
   "coord": [
    119.6097,
    30.81868
   ]
  }
 ],
 "segments": [
  {
   "id": "hengdian-east-jg-junction",
   "name": "沪蓉下行转京广下行联络线",
   "from": "hengdian-east",
   "to": "jg-junction",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 0.99,
   "polyline": [
    [
     114.3283,
     30.8009
    ],
    [
     114.3328,
     30.793
    ]
   ]
  },
  {
   "id": "hefei-west-changanji",
   "name": "合武绕行线",
   "from": "hefei-west",
   "to": "changanji",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 14.14,
   "polyline": [
    [
     117.21,
     31.86
    ],
    [
     117.2142,
     31.85614
    ],
    [
     117.21155,
     31.8513
    ],
    [
     117.20933,
     31.82533
    ],
    [
     117.18617,
     31.79478
    ],
    [
     117.18106,
     31.79178
    ],
    [
     117.17544,
     31.79058
    ],
    [
     117.1241,
     31.7891
    ]
   ]
  },
  {
   "id": "bei-jing-nan-bei-jing-da-xing",
   "name": "京沪高速铁路",
   "from": "bei-jing-nan",
   "to": "bei-jing-da-xing",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 19.04,
   "polyline": [
    [
     116.3724,
     39.86348
    ],
    [
     116.36564,
     39.85645
    ],
    [
     116.34124,
     39.85114
    ],
    [
     116.33696,
     39.84854
    ],
    [
     116.32666,
     39.82738
    ],
    [
     116.3196,
     39.80311
    ],
    [
     116.30262,
     39.7613
    ],
    [
     116.30127,
     39.74996
    ],
    [
     116.30409,
     39.73974
    ],
    [
     116.30949,
     39.73178
    ],
    [
     116.32342,
     39.71925
    ]
   ]
  },
  {
   "id": "bei-jing-da-xing-wei-shan-zhuang",
   "name": "京沪高速铁路",
   "from": "bei-jing-da-xing",
   "to": "wei-shan-zhuang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 9.09,
   "polyline": [
    [
     116.32342,
     39.71925
    ],
    [
     116.36781,
     39.6827
    ],
    [
     116.38145,
     39.67414
    ],
    [
     116.4014,
     39.66447
    ]
   ]
  },
  {
   "id": "wei-shan-zhuang-an-ding",
   "name": "京沪高速铁路",
   "from": "wei-shan-zhuang",
   "to": "an-ding",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 9.25,
   "polyline": [
    [
     116.4014,
     39.66447
    ],
    [
     116.42439,
     39.65285
    ],
    [
     116.4864,
     39.61336
    ]
   ]
  },
  {
   "id": "an-ding-wan-zhuang",
   "name": "京沪高速铁路",
   "from": "an-ding",
   "to": "wan-zhuang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 9.69,
   "polyline": [
    [
     116.4864,
     39.61336
    ],
    [
     116.50586,
     39.60401
    ],
    [
     116.54858,
     39.59128
    ],
    [
     116.58626,
     39.57338
    ]
   ]
  },
  {
   "id": "wan-zhuang-lang-fang",
   "name": "京沪高速铁路",
   "from": "wan-zhuang",
   "to": "lang-fang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 12.36,
   "polyline": [
    [
     116.58626,
     39.57338
    ],
    [
     116.60357,
     39.5657
    ],
    [
     116.63649,
     39.54804
    ],
    [
     116.67242,
     39.52798
    ],
    [
     116.70296,
     39.5084
    ]
   ]
  },
  {
   "id": "lang-fang-cao-zhuang",
   "name": "京沪高速铁路",
   "from": "lang-fang",
   "to": "cao-zhuang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 52.03,
   "polyline": [
    [
     116.70296,
     39.5084
    ],
    [
     116.75556,
     39.48111
    ],
    [
     116.80884,
     39.44972
    ],
    [
     116.82444,
     39.43717
    ],
    [
     116.83992,
     39.41986
    ],
    [
     116.84935,
     39.41142
    ],
    [
     116.91003,
     39.37057
    ],
    [
     116.92133,
     39.35942
    ],
    [
     116.9419,
     39.33501
    ],
    [
     116.97724,
     39.30487
    ],
    [
     117.01894,
     39.2722
    ],
    [
     117.02719,
     39.26222
    ],
    [
     117.03387,
     39.24821
    ],
    [
     117.05515,
     39.15104
    ]
   ]
  },
  {
   "id": "cao-zhuang-tian-jin-nan",
   "name": "京沪高速铁路",
   "from": "cao-zhuang",
   "to": "tian-jin-nan",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 10.59,
   "polyline": [
    [
     117.05515,
     39.15104
    ],
    [
     117.05824,
     39.12681
    ],
    [
     117.05727,
     39.07603
    ],
    [
     117.0545,
     39.05605
    ]
   ]
  },
  {
   "id": "tian-jin-nan-cang-zhou-xi",
   "name": "京沪高速铁路",
   "from": "tian-jin-nan",
   "to": "cang-zhou-xi",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 88.95,
   "polyline": [
    [
     117.0545,
     39.05605
    ],
    [
     117.05011,
     39.02939
    ],
    [
     117.0293,
     38.9824
    ],
    [
     117.00762,
     38.89175
    ],
    [
     116.98524,
     38.83992
    ],
    [
     116.98281,
     38.82858
    ],
    [
     116.97572,
     38.76401
    ],
    [
     116.97042,
     38.73493
    ],
    [
     116.94001,
     38.65442
    ],
    [
     116.92279,
     38.62019
    ],
    [
     116.90358,
     38.57393
    ],
    [
     116.87993,
     38.53715
    ],
    [
     116.87414,
     38.52555
    ],
    [
     116.86316,
     38.50027
    ],
    [
     116.8505,
     38.45673
    ],
    [
     116.84516,
     38.44364
    ],
    [
     116.8376,
     38.43172
    ],
    [
     116.81207,
     38.39979
    ],
    [
     116.78094,
     38.35474
    ],
    [
     116.77531,
     38.34344
    ],
    [
     116.76196,
     38.30628
    ]
   ]
  },
  {
   "id": "cang-zhou-xi-de-zhou-dong",
   "name": "京沪高速铁路",
   "from": "cang-zhou-xi",
   "to": "de-zhou-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 104.07,
   "polyline": [
    [
     116.76196,
     38.30628
    ],
    [
     116.75021,
     38.27682
    ],
    [
     116.73437,
     38.24447
    ],
    [
     116.70141,
     38.12408
    ],
    [
     116.68216,
     38.0895
    ],
    [
     116.65138,
     38.00431
    ],
    [
     116.59343,
     37.89147
    ],
    [
     116.56225,
     37.81936
    ],
    [
     116.55113,
     37.78752
    ],
    [
     116.53657,
     37.75617
    ],
    [
     116.51399,
     37.69902
    ],
    [
     116.50023,
     37.67231
    ],
    [
     116.48895,
     37.641
    ],
    [
     116.48656,
     37.63051
    ],
    [
     116.48329,
     37.5996
    ],
    [
     116.46413,
     37.53609
    ],
    [
     116.45228,
     37.45643
    ],
    [
     116.45202,
     37.44274
    ],
    [
     116.45608,
     37.40876
    ]
   ]
  },
  {
   "id": "de-zhou-dong-ping-yuan-dong",
   "name": "京沪高速铁路",
   "from": "de-zhou-dong",
   "to": "ping-yuan-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 23.91,
   "polyline": [
    [
     116.45608,
     37.40876
    ],
    [
     116.46214,
     37.37395
    ],
    [
     116.46878,
     37.35819
    ],
    [
     116.51602,
     37.29209
    ],
    [
     116.53971,
     37.26576
    ],
    [
     116.57402,
     37.2183
    ]
   ]
  },
  {
   "id": "ping-yuan-dong-qi-he",
   "name": "京沪高速铁路",
   "from": "ping-yuan-dong",
   "to": "qi-he",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 49.19,
   "polyline": [
    [
     116.57402,
     37.2183
    ],
    [
     116.59183,
     37.19735
    ],
    [
     116.61652,
     37.15667
    ],
    [
     116.64962,
     37.11342
    ],
    [
     116.66942,
     37.08295
    ],
    [
     116.69772,
     37.04499
    ],
    [
     116.73489,
     36.98823
    ],
    [
     116.77754,
     36.93739
    ],
    [
     116.80566,
     36.89437
    ],
    [
     116.8543,
     36.8377
    ]
   ]
  },
  {
   "id": "qi-he-ji-nan-xi",
   "name": "京沪高速铁路",
   "from": "qi-he",
   "to": "ji-nan-xi",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 19.24,
   "polyline": [
    [
     116.8543,
     36.8377
    ],
    [
     116.86641,
     36.82098
    ],
    [
     116.87256,
     36.80357
    ],
    [
     116.87884,
     36.75533
    ],
    [
     116.88508,
     36.72774
    ],
    [
     116.886,
     36.6688
    ]
   ]
  },
  {
   "id": "ji-nan-xi-dang-jia-zhuang",
   "name": "京沪高速铁路",
   "from": "ji-nan-xi",
   "to": "dang-jia-zhuang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 10.19,
   "polyline": [
    [
     116.886,
     36.6688
    ],
    [
     116.88412,
     36.60587
    ],
    [
     116.88976,
     36.57782
    ]
   ]
  },
  {
   "id": "dang-jia-zhuang-zhang-xia",
   "name": "京沪高速铁路",
   "from": "dang-jia-zhuang",
   "to": "zhang-xia",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 14.52,
   "polyline": [
    [
     116.88976,
     36.57782
    ],
    [
     116.88978,
     36.56292
    ],
    [
     116.87807,
     36.51699
    ],
    [
     116.87823,
     36.50449
    ],
    [
     116.8811,
     36.49288
    ],
    [
     116.88482,
     36.48527
    ],
    [
     116.90686,
     36.45405
    ]
   ]
  },
  {
   "id": "zhang-xia-qing-yang",
   "name": "京沪高速铁路",
   "from": "zhang-xia",
   "to": "qing-yang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 6.96,
   "polyline": [
    [
     116.90686,
     36.45405
    ],
    [
     116.91165,
     36.44253
    ],
    [
     116.91513,
     36.42346
    ],
    [
     116.91674,
     36.39238
    ]
   ]
  },
  {
   "id": "qing-yang-wan-de",
   "name": "京沪高速铁路",
   "from": "qing-yang",
   "to": "wan-de",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 6.21,
   "polyline": [
    [
     116.91674,
     36.39238
    ],
    [
     116.91698,
     36.36364
    ],
    [
     116.92212,
     36.33687
    ]
   ]
  },
  {
   "id": "wan-de-jie-shou",
   "name": "京沪高速铁路",
   "from": "wan-de",
   "to": "jie-shou",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 11.69,
   "polyline": [
    [
     116.92212,
     36.33687
    ],
    [
     116.9251,
     36.32773
    ],
    [
     116.93099,
     36.31717
    ],
    [
     116.96977,
     36.27452
    ],
    [
     116.98242,
     36.25699
    ],
    [
     116.98685,
     36.24694
    ]
   ]
  },
  {
   "id": "jie-shou-tai-an",
   "name": "京沪高速铁路",
   "from": "jie-shou",
   "to": "tai-an",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 9.29,
   "polyline": [
    [
     116.98685,
     36.24694
    ],
    [
     116.99146,
     36.22787
    ],
    [
     116.99511,
     36.21865
    ],
    [
     117.02925,
     36.17195
    ]
   ]
  },
  {
   "id": "tai-an-ning-yang-dong",
   "name": "京沪高速铁路",
   "from": "tai-an",
   "to": "ning-yang-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 35.0,
   "polyline": [
    [
     117.02925,
     36.17195
    ],
    [
     117.04033,
     36.15476
    ],
    [
     117.05131,
     36.14299
    ],
    [
     117.0648,
     36.12161
    ],
    [
     117.0868,
     36.07892
    ],
    [
     117.09076,
     36.06803
    ],
    [
     117.10429,
     35.97949
    ],
    [
     117.1128,
     35.9436
    ],
    [
     117.11467,
     35.92156
    ],
    [
     117.11329,
     35.90162
    ],
    [
     117.10278,
     35.872
    ]
   ]
  },
  {
   "id": "ning-yang-dong-nan-yi",
   "name": "京沪高速铁路",
   "from": "ning-yang-dong",
   "to": "nan-yi",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 1.68,
   "polyline": [
    [
     117.10278,
     35.872
    ],
    [
     117.09787,
     35.85744
    ]
   ]
  },
  {
   "id": "nan-yi-qu-fu-dong",
   "name": "京沪高速铁路",
   "from": "nan-yi",
   "to": "qu-fu-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 35.19,
   "polyline": [
    [
     117.09787,
     35.85744
    ],
    [
     117.09227,
     35.83293
    ],
    [
     117.08086,
     35.80026
    ],
    [
     117.07791,
     35.78766
    ],
    [
     117.07771,
     35.73569
    ],
    [
     117.07354,
     35.69902
    ],
    [
     117.05714,
     35.61978
    ],
    [
     117.05713,
     35.60727
    ],
    [
     117.06434,
     35.55655
    ]
   ]
  },
  {
   "id": "qu-fu-dong-zou-cheng-dong",
   "name": "京沪高速铁路",
   "from": "qu-fu-dong",
   "to": "zou-cheng-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 17.46,
   "polyline": [
    [
     117.06434,
     35.55655
    ],
    [
     117.06852,
     35.51347
    ],
    [
     117.06319,
     35.48106
    ],
    [
     117.0625,
     35.4588
    ],
    [
     117.06538,
     35.44353
    ],
    [
     117.07343,
     35.41723
    ],
    [
     117.07627,
     35.40129
    ]
   ]
  },
  {
   "id": "zou-cheng-dong-teng-zhou-dong",
   "name": "京沪高速铁路",
   "from": "zou-cheng-dong",
   "to": "teng-zhou-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 38.63,
   "polyline": [
    [
     117.07627,
     35.40129
    ],
    [
     117.08018,
     35.37834
    ],
    [
     117.08875,
     35.35963
    ],
    [
     117.09686,
     35.34965
    ],
    [
     117.14674,
     35.30162
    ],
    [
     117.16961,
     35.26715
    ],
    [
     117.18494,
     35.21945
    ],
    [
     117.22539,
     35.15709
    ],
    [
     117.23693,
     35.12414
    ],
    [
     117.25195,
     35.09096
    ]
   ]
  },
  {
   "id": "teng-zhou-dong-zao-zhuang",
   "name": "京沪高速铁路",
   "from": "teng-zhou-dong",
   "to": "zao-zhuang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 36.19,
   "polyline": [
    [
     117.25195,
     35.09096
    ],
    [
     117.27333,
     35.03995
    ],
    [
     117.29046,
     35.01291
    ],
    [
     117.29613,
     35.00015
    ],
    [
     117.301,
     34.98329
    ],
    [
     117.30138,
     34.96999
    ],
    [
     117.29637,
     34.94952
    ],
    [
     117.29238,
     34.93925
    ],
    [
     117.27543,
     34.90986
    ],
    [
     117.27044,
     34.89402
    ],
    [
     117.26951,
     34.88408
    ],
    [
     117.27132,
     34.86359
    ],
    [
     117.2757,
     34.84333
    ],
    [
     117.29051,
     34.81121
    ],
    [
     117.30037,
     34.78188
    ]
   ]
  },
  {
   "id": "zao-zhuang-xu-zhou-dong",
   "name": "京沪高速铁路",
   "from": "zao-zhuang",
   "to": "xu-zhou-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 65.99,
   "polyline": [
    [
     117.30037,
     34.78188
    ],
    [
     117.30649,
     34.75995
    ],
    [
     117.31434,
     34.74666
    ],
    [
     117.342,
     34.71875
    ],
    [
     117.37847,
     34.67585
    ],
    [
     117.41348,
     34.6249
    ],
    [
     117.42288,
     34.60442
    ],
    [
     117.42543,
     34.57298
    ],
    [
     117.42419,
     34.51783
    ],
    [
     117.42128,
     34.50512
    ],
    [
     117.4149,
     34.49107
    ],
    [
     117.4023,
     34.47631
    ],
    [
     117.3872,
     34.4653
    ],
    [
     117.37333,
     34.45873
    ],
    [
     117.34561,
     34.44892
    ],
    [
     117.33313,
     34.44157
    ],
    [
     117.32412,
     34.43382
    ],
    [
     117.31754,
     34.42588
    ],
    [
     117.30322,
     34.40355
    ],
    [
     117.29879,
     34.38843
    ],
    [
     117.29079,
     34.30597
    ],
    [
     117.29243,
     34.29166
    ],
    [
     117.30021,
     34.26916
    ]
   ]
  },
  {
   "id": "xu-zhou-dong-su-zhou-dong",
   "name": "京沪高速铁路",
   "from": "xu-zhou-dong",
   "to": "su-zhou-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 67.4,
   "polyline": [
    [
     117.30021,
     34.26916
    ],
    [
     117.31494,
     34.21928
    ],
    [
     117.31678,
     34.20448
    ],
    [
     117.31566,
     34.19138
    ],
    [
     117.31235,
     34.1795
    ],
    [
     117.25085,
     34.03513
    ],
    [
     117.21975,
     33.85933
    ],
    [
     117.22043,
     33.84351
    ],
    [
     117.23421,
     33.76987
    ],
    [
     117.24583,
     33.67724
    ]
   ]
  },
  {
   "id": "su-zhou-dong-beng-bu-nan",
   "name": "京沪高速铁路",
   "from": "su-zhou-dong",
   "to": "beng-bu-nan",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 89.17,
   "polyline": [
    [
     117.24583,
     33.67724
    ],
    [
     117.26307,
     33.55225
    ],
    [
     117.28183,
     33.46263
    ],
    [
     117.33707,
     33.33312
    ],
    [
     117.33988,
     33.32042
    ],
    [
     117.35546,
     33.20393
    ],
    [
     117.37484,
     33.13043
    ],
    [
     117.42343,
     32.9839
    ],
    [
     117.43069,
     32.92732
    ],
    [
     117.43679,
     32.90369
    ]
   ]
  },
  {
   "id": "beng-bu-nan-ding-yuan",
   "name": "京沪高速铁路",
   "from": "beng-bu-nan",
   "to": "ding-yuan",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 57.23,
   "polyline": [
    [
     117.43679,
     32.90369
    ],
    [
     117.44677,
     32.86836
    ],
    [
     117.46565,
     32.82713
    ],
    [
     117.47696,
     32.81024
    ],
    [
     117.48836,
     32.79984
    ],
    [
     117.5048,
     32.78925
    ],
    [
     117.73608,
     32.67725
    ],
    [
     117.81153,
     32.6149
    ],
    [
     117.8228,
     32.60177
    ],
    [
     117.83691,
     32.57746
    ]
   ]
  },
  {
   "id": "ding-yuan-chu-zhou",
   "name": "京沪高速铁路",
   "from": "ding-yuan",
   "to": "chu-zhou",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 62.1,
   "polyline": [
    [
     117.83691,
     32.57746
    ],
    [
     117.84979,
     32.55702
    ],
    [
     117.89587,
     32.50314
    ],
    [
     117.9635,
     32.44246
    ],
    [
     118.11471,
     32.33054
    ],
    [
     118.17309,
     32.27722
    ],
    [
     118.31494,
     32.19998
    ]
   ]
  },
  {
   "id": "chu-zhou-pu-kou-nan",
   "name": "京沪高速铁路",
   "from": "chu-zhou",
   "to": "pu-kou-nan",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 29.89,
   "polyline": [
    [
     118.31494,
     32.19998
    ],
    [
     118.3688,
     32.17003
    ],
    [
     118.38731,
     32.15701
    ],
    [
     118.49696,
     32.03848
    ],
    [
     118.51164,
     32.0275
    ],
    [
     118.53169,
     32.01736
    ]
   ]
  },
  {
   "id": "pu-kou-nan-nanjing-south",
   "name": "京沪高速铁路",
   "from": "pu-kou-nan",
   "to": "nanjing-south",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 32.43,
   "polyline": [
    [
     118.53169,
     32.01736
    ],
    [
     118.6002,
     31.9837
    ],
    [
     118.66398,
     31.93353
    ],
    [
     118.67659,
     31.92721
    ],
    [
     118.68891,
     31.92401
    ],
    [
     118.70524,
     31.92331
    ],
    [
     118.72462,
     31.92794
    ],
    [
     118.73755,
     31.93509
    ],
    [
     118.7575,
     31.95268
    ],
    [
     118.77345,
     31.96259
    ],
    [
     118.80762,
     31.97836
    ],
    [
     118.81,
     31.97
    ]
   ]
  },
  {
   "id": "nanjing-south-liu-bai-du",
   "name": "京沪高速铁路",
   "from": "nanjing-south",
   "to": "liu-bai-du",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 58.44,
   "polyline": [
    [
     118.81,
     31.97
    ],
    [
     118.81069,
     31.97988
    ],
    [
     118.89565,
     32.01613
    ],
    [
     118.91446,
     32.02909
    ],
    [
     118.94563,
     32.0591
    ],
    [
     118.95725,
     32.0661
    ],
    [
     118.99251,
     32.08254
    ],
    [
     119.00553,
     32.08646
    ],
    [
     119.07444,
     32.10043
    ],
    [
     119.14991,
     32.12418
    ],
    [
     119.1649,
     32.13109
    ],
    [
     119.1947,
     32.15034
    ],
    [
     119.21831,
     32.15923
    ],
    [
     119.23895,
     32.16233
    ],
    [
     119.2948,
     32.16295
    ],
    [
     119.33928,
     32.17187
    ],
    [
     119.35724,
     32.17245
    ]
   ]
  },
  {
   "id": "liu-bai-du-zhen-jiang-nan",
   "name": "京沪高速铁路",
   "from": "liu-bai-du",
   "to": "zhen-jiang-nan",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 6.14,
   "polyline": [
    [
     119.35724,
     32.17245
    ],
    [
     119.3755,
     32.16913
    ],
    [
     119.41864,
     32.15444
    ]
   ]
  },
  {
   "id": "zhen-jiang-nan-dan-yang-bei",
   "name": "京沪高速铁路",
   "from": "zhen-jiang-nan",
   "to": "dan-yang-bei",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 29.53,
   "polyline": [
    [
     119.41864,
     32.15444
    ],
    [
     119.45498,
     32.1426
    ],
    [
     119.51274,
     32.13089
    ],
    [
     119.53413,
     32.12236
    ],
    [
     119.54909,
     32.11247
    ],
    [
     119.60806,
     32.06284
    ],
    [
     119.63694,
     32.04209
    ],
    [
     119.66622,
     32.0168
    ]
   ]
  },
  {
   "id": "dan-yang-bei-chang-zhou-bei",
   "name": "京沪高速铁路",
   "from": "dan-yang-bei",
   "to": "chang-zhou-bei",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 32.38,
   "polyline": [
    [
     119.66622,
     32.0168
    ],
    [
     119.6936,
     31.99578
    ],
    [
     119.88826,
     31.88078
    ],
    [
     119.9041,
     31.87332
    ],
    [
     119.95072,
     31.85611
    ]
   ]
  },
  {
   "id": "chang-zhou-bei-wu-xi-dong",
   "name": "京沪高速铁路",
   "from": "chang-zhou-bei",
   "to": "wu-xi-dong",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 57.41,
   "polyline": [
    [
     119.95072,
     31.85611
    ],
    [
     120.05389,
     31.8183
    ],
    [
     120.0982,
     31.80687
    ],
    [
     120.13507,
     31.80176
    ],
    [
     120.15405,
     31.79469
    ],
    [
     120.16768,
     31.78547
    ],
    [
     120.22058,
     31.73703
    ],
    [
     120.23456,
     31.72774
    ],
    [
     120.27177,
     31.71226
    ],
    [
     120.32763,
     31.70088
    ],
    [
     120.35401,
     31.69018
    ],
    [
     120.36851,
     31.68231
    ],
    [
     120.39918,
     31.65718
    ],
    [
     120.43259,
     31.61804
    ],
    [
     120.45549,
     31.59881
    ]
   ]
  },
  {
   "id": "wu-xi-dong-su-zhou-bei",
   "name": "京沪高速铁路",
   "from": "wu-xi-dong",
   "to": "su-zhou-bei",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 27.29,
   "polyline": [
    [
     120.45549,
     31.59881
    ],
    [
     120.48122,
     31.57824
    ],
    [
     120.49262,
     31.56581
    ],
    [
     120.53733,
     31.49026
    ],
    [
     120.54992,
     31.47496
    ],
    [
     120.56737,
     31.46191
    ],
    [
     120.63893,
     31.42372
    ]
   ]
  },
  {
   "id": "su-zhou-bei-yang-cheng-hu",
   "name": "京沪高速铁路",
   "from": "su-zhou-bei",
   "to": "yang-cheng-hu",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 23.27,
   "polyline": [
    [
     120.63893,
     31.42372
    ],
    [
     120.70817,
     31.38747
    ],
    [
     120.72441,
     31.38199
    ],
    [
     120.75354,
     31.3758
    ],
    [
     120.79302,
     31.37306
    ],
    [
     120.82743,
     31.3799
    ],
    [
     120.85707,
     31.38337
    ]
   ]
  },
  {
   "id": "yang-cheng-hu-kun-shan-nan",
   "name": "京沪高速铁路",
   "from": "yang-cheng-hu",
   "to": "kun-shan-nan",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 9.22,
   "polyline": [
    [
     120.85707,
     31.38337
    ],
    [
     120.87177,
     31.38293
    ],
    [
     120.88668,
     31.37972
    ],
    [
     120.94647,
     31.35515
    ]
   ]
  },
  {
   "id": "kun-shan-nan-hua-qiao",
   "name": "京沪高速铁路",
   "from": "kun-shan-nan",
   "to": "hua-qiao",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 9.58,
   "polyline": [
    [
     120.94647,
     31.35515
    ],
    [
     120.98493,
     31.33949
    ],
    [
     121.00142,
     31.335
    ],
    [
     121.02181,
     31.33407
    ],
    [
     121.0417,
     31.33773
    ]
   ]
  },
  {
   "id": "hua-qiao-lu-jia-bang",
   "name": "京沪高速铁路",
   "from": "hua-qiao",
   "to": "lu-jia-bang",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.4,
   "polyline": [
    [
     121.0417,
     31.33773
    ],
    [
     121.06016,
     31.34126
    ],
    [
     121.07696,
     31.34115
    ]
   ]
  },
  {
   "id": "lu-jia-bang-an-ting-bei",
   "name": "京沪高速铁路",
   "from": "lu-jia-bang",
   "to": "an-ting-bei",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.53,
   "polyline": [
    [
     121.07696,
     31.34115
    ],
    [
     121.09388,
     31.33757
    ],
    [
     121.15078,
     31.31739
    ]
   ]
  },
  {
   "id": "an-ting-bei-an-ting",
   "name": "京沪高速铁路",
   "from": "an-ting-bei",
   "to": "an-ting",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 2.27,
   "polyline": [
    [
     121.15078,
     31.31739
    ],
    [
     121.17361,
     31.3115
    ]
   ]
  },
  {
   "id": "an-ting-huang-du",
   "name": "京沪高速铁路",
   "from": "an-ting",
   "to": "huang-du",
   "lineIds": [
    "jinghu-hsr",
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 6.17,
   "polyline": [
    [
     121.17361,
     31.3115
    ],
    [
     121.2368,
     31.29895
    ]
   ]
  },
  {
   "id": "huang-du-feng-bang",
   "name": "京沪高速铁路",
   "from": "huang-du",
   "to": "feng-bang",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 6.63,
   "polyline": [
    [
     121.2368,
     31.29895
    ],
    [
     121.25419,
     31.29354
    ],
    [
     121.26757,
     31.2848
    ],
    [
     121.27763,
     31.27287
    ],
    [
     121.28353,
     31.25921
    ]
   ]
  },
  {
   "id": "feng-bang-shang-hai-hong-qiao",
   "name": "京沪高速铁路",
   "from": "feng-bang",
   "to": "shang-hai-hong-qiao",
   "lineIds": [
    "jinghu-hsr"
   ],
   "serviceDate": "2011-06-30",
   "estLengthKm": 8.08,
   "polyline": [
    [
     121.28353,
     31.25921
    ],
    [
     121.29167,
     31.24263
    ],
    [
     121.31345,
     31.22112
    ],
    [
     121.31581,
     31.21451
    ],
    [
     121.3162,
     31.19598
    ]
   ]
  },
  {
   "id": "bei-jing-zhao-yang-shun-yi-xi",
   "name": "京哈高速铁路",
   "from": "bei-jing-zhao-yang",
   "to": "shun-yi-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 27.13,
   "polyline": [
    [
     116.50242,
     39.94332
    ],
    [
     116.50405,
     39.99999
    ],
    [
     116.49427,
     40.03712
    ],
    [
     116.48093,
     40.05697
    ],
    [
     116.47797,
     40.06575
    ],
    [
     116.47693,
     40.08861
    ],
    [
     116.48014,
     40.10884
    ],
    [
     116.47828,
     40.1382
    ],
    [
     116.48534,
     40.1788
    ]
   ]
  },
  {
   "id": "shun-yi-xi-gao-ge-zhuang",
   "name": "京哈高速铁路",
   "from": "shun-yi-xi",
   "to": "gao-ge-zhuang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 16.13,
   "polyline": [
    [
     116.48534,
     40.1788
    ],
    [
     116.48822,
     40.19274
    ],
    [
     116.49421,
     40.20398
    ],
    [
     116.50352,
     40.21699
    ],
    [
     116.51578,
     40.22654
    ],
    [
     116.53055,
     40.23274
    ],
    [
     116.62571,
     40.25983
    ]
   ]
  },
  {
   "id": "gao-ge-zhuang-huai-rou-nan",
   "name": "京哈高速铁路",
   "from": "gao-ge-zhuang",
   "to": "huai-rou-nan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 7.77,
   "polyline": [
    [
     116.62571,
     40.25983
    ],
    [
     116.69887,
     40.27719
    ]
   ]
  },
  {
   "id": "huai-rou-nan-mi-yun",
   "name": "京哈高速铁路",
   "from": "huai-rou-nan",
   "to": "mi-yun",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 16.57,
   "polyline": [
    [
     116.69887,
     40.27719
    ],
    [
     116.74681,
     40.28874
    ],
    [
     116.76378,
     40.29532
    ],
    [
     116.77787,
     40.30439
    ],
    [
     116.80857,
     40.33212
    ],
    [
     116.82534,
     40.34205
    ],
    [
     116.84513,
     40.35101
    ]
   ]
  },
  {
   "id": "mi-yun-xing-long-xian-xi",
   "name": "京哈高速铁路",
   "from": "mi-yun",
   "to": "xing-long-xian-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 55.78,
   "polyline": [
    [
     116.84513,
     40.35101
    ],
    [
     116.87194,
     40.36278
    ],
    [
     116.88357,
     40.36613
    ],
    [
     116.90112,
     40.3687
    ],
    [
     116.91255,
     40.36888
    ],
    [
     116.933,
     40.36635
    ],
    [
     116.97832,
     40.35462
    ],
    [
     117.00404,
     40.35091
    ],
    [
     117.06401,
     40.35359
    ],
    [
     117.1342,
     40.37132
    ],
    [
     117.15054,
     40.3737
    ],
    [
     117.1702,
     40.37406
    ],
    [
     117.27526,
     40.36436
    ],
    [
     117.28975,
     40.36431
    ],
    [
     117.34675,
     40.37605
    ],
    [
     117.39129,
     40.38082
    ],
    [
     117.40759,
     40.38419
    ],
    [
     117.44866,
     40.39528
    ],
    [
     117.47563,
     40.41268
    ]
   ]
  },
  {
   "id": "xing-long-xian-xi-xing-long-xian",
   "name": "京哈高速铁路",
   "from": "xing-long-xian-xi",
   "to": "xing-long-xian",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 4.18,
   "polyline": [
    [
     117.47563,
     40.41268
    ],
    [
     117.49347,
     40.42596
    ],
    [
     117.50515,
     40.43822
    ]
   ]
  },
  {
   "id": "xing-long-xian-cheng-de-xi",
   "name": "京哈高速铁路",
   "from": "xing-long-xian",
   "to": "cheng-de-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 39.79,
   "polyline": [
    [
     117.50515,
     40.43822
    ],
    [
     117.54826,
     40.50269
    ],
    [
     117.5886,
     40.55134
    ],
    [
     117.6171,
     40.58948
    ],
    [
     117.63067,
     40.60981
    ],
    [
     117.66378,
     40.671
    ],
    [
     117.71861,
     40.75647
    ]
   ]
  },
  {
   "id": "cheng-de-xi-an-jiang",
   "name": "京哈高速铁路",
   "from": "cheng-de-xi",
   "to": "an-jiang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 1.23,
   "polyline": [
    [
     117.71861,
     40.75647
    ],
    [
     117.72637,
     40.76581
    ]
   ]
  },
  {
   "id": "an-jiang-cheng-de-nan",
   "name": "京哈高速铁路",
   "from": "an-jiang",
   "to": "cheng-de-nan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 26.64,
   "polyline": [
    [
     117.72637,
     40.76581
    ],
    [
     117.73981,
     40.78176
    ],
    [
     117.83626,
     40.86816
    ],
    [
     117.87122,
     40.88611
    ],
    [
     117.89107,
     40.89062
    ],
    [
     117.91559,
     40.89117
    ],
    [
     117.95831,
     40.88278
    ]
   ]
  },
  {
   "id": "cheng-de-nan-cheng-de-xian-bei",
   "name": "京哈高速铁路",
   "from": "cheng-de-nan",
   "to": "cheng-de-xian-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 28.02,
   "polyline": [
    [
     117.95831,
     40.88278
    ],
    [
     117.98065,
     40.87648
    ],
    [
     117.99728,
     40.87354
    ],
    [
     118.05789,
     40.87913
    ],
    [
     118.18023,
     40.9058
    ],
    [
     118.21475,
     40.91103
    ],
    [
     118.27658,
     40.93246
    ]
   ]
  },
  {
   "id": "cheng-de-xian-bei-ping-quan",
   "name": "京哈高速铁路",
   "from": "cheng-de-xian-bei",
   "to": "ping-quan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 39.92,
   "polyline": [
    [
     118.27658,
     40.93246
    ],
    [
     118.3164,
     40.94318
    ],
    [
     118.44623,
     40.9733
    ],
    [
     118.50203,
     40.9886
    ],
    [
     118.6867,
     41.03065
    ],
    [
     118.69425,
     40.99767
    ]
   ]
  },
  {
   "id": "ping-quan-ping-quan-bei",
   "name": "京哈高速铁路",
   "from": "ping-quan",
   "to": "ping-quan-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 5.13,
   "polyline": [
    [
     118.69425,
     40.99767
    ],
    [
     118.68672,
     41.03061
    ],
    [
     118.70186,
     41.03599
    ]
   ]
  },
  {
   "id": "ping-quan-bei-shui-quan",
   "name": "京哈高速铁路",
   "from": "ping-quan-bei",
   "to": "shui-quan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 39.41,
   "polyline": [
    [
     118.70186,
     41.03599
    ],
    [
     118.73392,
     41.04717
    ],
    [
     118.75171,
     41.05101
    ],
    [
     119.08521,
     41.09226
    ],
    [
     119.15992,
     41.10678
    ]
   ]
  },
  {
   "id": "shui-quan-niu-he-liang",
   "name": "京哈高速铁路",
   "from": "shui-quan",
   "to": "niu-he-liang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 22.07,
   "polyline": [
    [
     119.15992,
     41.10678
    ],
    [
     119.24816,
     41.12394
    ],
    [
     119.26056,
     41.12784
    ],
    [
     119.39279,
     41.19407
    ]
   ]
  },
  {
   "id": "niu-he-liang-ka-zuo",
   "name": "京哈高速铁路",
   "from": "niu-he-liang",
   "to": "ka-zuo",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 36.74,
   "polyline": [
    [
     119.39279,
     41.19407
    ],
    [
     119.42097,
     41.20796
    ],
    [
     119.43346,
     41.21193
    ],
    [
     119.44516,
     41.21385
    ],
    [
     119.54169,
     41.21896
    ],
    [
     119.63147,
     41.22003
    ],
    [
     119.72001,
     41.21408
    ],
    [
     119.75328,
     41.21353
    ],
    [
     119.8107,
     41.22509
    ],
    [
     119.80008,
     41.22218
    ]
   ]
  },
  {
   "id": "ka-zuo-nai-lin-gao",
   "name": "京哈高速铁路",
   "from": "ka-zuo",
   "to": "nai-lin-gao",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 29.95,
   "polyline": [
    [
     119.80008,
     41.22218
    ],
    [
     119.84057,
     41.23235
    ],
    [
     119.85911,
     41.24056
    ],
    [
     119.86716,
     41.24569
    ],
    [
     119.87729,
     41.25401
    ],
    [
     119.93217,
     41.31703
    ],
    [
     119.94155,
     41.32562
    ],
    [
     120.00866,
     41.36573
    ],
    [
     120.05988,
     41.39855
    ]
   ]
  },
  {
   "id": "nai-lin-gao-da-ping-fang",
   "name": "京哈高速铁路",
   "from": "nai-lin-gao",
   "to": "da-ping-fang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 8.46,
   "polyline": [
    [
     120.05988,
     41.39855
    ],
    [
     120.10283,
     41.42494
    ],
    [
     120.12163,
     41.43156
    ],
    [
     120.14532,
     41.43735
    ]
   ]
  },
  {
   "id": "da-ping-fang-liao-ning-zhao-yang",
   "name": "京哈高速铁路",
   "from": "da-ping-fang",
   "to": "liao-ning-zhao-yang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 28.33,
   "polyline": [
    [
     120.14532,
     41.43735
    ],
    [
     120.1648,
     41.44348
    ],
    [
     120.24371,
     41.48445
    ],
    [
     120.25788,
     41.4948
    ],
    [
     120.29761,
     41.52855
    ],
    [
     120.33039,
     41.559
    ],
    [
     120.40375,
     41.59813
    ]
   ]
  },
  {
   "id": "liao-ning-zhao-yang-zhao-yang",
   "name": "京哈高速铁路",
   "from": "liao-ning-zhao-yang",
   "to": "zhao-yang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 1.49,
   "polyline": [
    [
     120.40375,
     41.59813
    ],
    [
     120.41819,
     41.60594
    ]
   ]
  },
  {
   "id": "zhao-yang-dong-san-jia",
   "name": "京哈高速铁路",
   "from": "zhao-yang",
   "to": "dong-san-jia",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 1.47,
   "polyline": [
    [
     120.41819,
     41.60594
    ],
    [
     120.43211,
     41.61405
    ]
   ]
  },
  {
   "id": "dong-san-jia-bei-piao",
   "name": "京哈高速铁路",
   "from": "dong-san-jia",
   "to": "bei-piao",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 34.13,
   "polyline": [
    [
     120.43211,
     41.61405
    ],
    [
     120.48812,
     41.65781
    ],
    [
     120.5057,
     41.66779
    ],
    [
     120.73608,
     41.73978
    ],
    [
     120.75468,
     41.7478
    ],
    [
     120.78113,
     41.76537
    ]
   ]
  },
  {
   "id": "bei-piao-wu-lan-mu-tu",
   "name": "京哈高速铁路",
   "from": "bei-piao",
   "to": "wu-lan-mu-tu",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 47.97,
   "polyline": [
    [
     120.78113,
     41.76537
    ],
    [
     120.95493,
     41.88365
    ],
    [
     120.975,
     41.89345
    ],
    [
     120.98563,
     41.8971
    ],
    [
     121.0497,
     41.91213
    ],
    [
     121.12412,
     41.92507
    ],
    [
     121.28017,
     41.96118
    ]
   ]
  },
  {
   "id": "wu-lan-mu-tu-fu-xin",
   "name": "京哈高速铁路",
   "from": "wu-lan-mu-tu",
   "to": "fu-xin",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 32.83,
   "polyline": [
    [
     121.28017,
     41.96118
    ],
    [
     121.39816,
     41.98824
    ],
    [
     121.46858,
     41.9972
    ],
    [
     121.48502,
     42.00082
    ],
    [
     121.5517,
     42.02514
    ],
    [
     121.65421,
     42.05589
    ]
   ]
  },
  {
   "id": "fu-xin-hei-shan-bei",
   "name": "京哈高速铁路",
   "from": "fu-xin",
   "to": "hei-shan-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 57.29,
   "polyline": [
    [
     121.65421,
     42.05589
    ],
    [
     121.69085,
     42.06821
    ],
    [
     121.7223,
     42.08839
    ],
    [
     121.743,
     42.09785
    ],
    [
     121.81112,
     42.1128
    ],
    [
     121.83496,
     42.11455
    ],
    [
     121.9302,
     42.10477
    ],
    [
     122.00503,
     42.10661
    ],
    [
     122.02452,
     42.10489
    ],
    [
     122.04502,
     42.1
    ],
    [
     122.10598,
     42.07818
    ],
    [
     122.29463,
     42.04358
    ]
   ]
  },
  {
   "id": "hei-shan-bei-xiao-dong",
   "name": "京哈高速铁路",
   "from": "hei-shan-bei",
   "to": "xiao-dong",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 2.46,
   "polyline": [
    [
     122.29463,
     42.04358
    ],
    [
     122.32355,
     42.03872
    ]
   ]
  },
  {
   "id": "xiao-dong-xin-min-bei",
   "name": "京哈高速铁路",
   "from": "xiao-dong",
   "to": "xin-min-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 38.87,
   "polyline": [
    [
     122.32355,
     42.03872
    ],
    [
     122.36207,
     42.0329
    ],
    [
     122.51109,
     42.02587
    ],
    [
     122.79278,
     42.02294
    ]
   ]
  },
  {
   "id": "xin-min-bei-gao-tai-shan",
   "name": "京哈高速铁路",
   "from": "xin-min-bei",
   "to": "gao-tai-shan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 6.67,
   "polyline": [
    [
     122.79278,
     42.02294
    ],
    [
     122.85888,
     42.02194
    ],
    [
     122.87304,
     42.01996
    ]
   ]
  },
  {
   "id": "gao-tai-shan-xing-long-dian",
   "name": "京哈高速铁路",
   "from": "gao-tai-shan",
   "to": "xing-long-dian",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 15.26,
   "polyline": [
    [
     122.87304,
     42.01996
    ],
    [
     122.92345,
     42.0072
    ],
    [
     123.00119,
     41.99445
    ],
    [
     123.03303,
     41.98433
    ],
    [
     123.04947,
     41.98093
    ]
   ]
  },
  {
   "id": "xing-long-dian-shen-yang-xi",
   "name": "京哈高速铁路",
   "from": "xing-long-dian",
   "to": "shen-yang-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 17.55,
   "polyline": [
    [
     123.04947,
     41.98093
    ],
    [
     123.10698,
     41.97661
    ],
    [
     123.13538,
     41.97013
    ],
    [
     123.15117,
     41.96329
    ],
    [
     123.20612,
     41.93232
    ],
    [
     123.23361,
     41.91352
    ]
   ]
  },
  {
   "id": "shen-yang-xi-da-cheng",
   "name": "京哈高速铁路",
   "from": "shen-yang-xi",
   "to": "da-cheng",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 13.29,
   "polyline": [
    [
     123.23361,
     41.91352
    ],
    [
     123.26304,
     41.89318
    ],
    [
     123.30925,
     41.86677
    ],
    [
     123.31285,
     41.86243
    ],
    [
     123.32285,
     41.84059
    ],
    [
     123.32784,
     41.83574
    ],
    [
     123.34001,
     41.82814
    ]
   ]
  },
  {
   "id": "da-cheng-shen-yang-bei",
   "name": "京哈高速铁路",
   "from": "da-cheng",
   "to": "shen-yang-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 7.86,
   "polyline": [
    [
     123.34001,
     41.82814
    ],
    [
     123.35237,
     41.82085
    ],
    [
     123.38177,
     41.8135
    ],
    [
     123.42943,
     41.81733
    ]
   ]
  },
  {
   "id": "shen-yang-bei-wen-guan-tun",
   "name": "京哈高速铁路",
   "from": "shen-yang-bei",
   "to": "wen-guan-tun",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 8.4,
   "polyline": [
    [
     123.42943,
     41.81733
    ],
    [
     123.45112,
     41.82461
    ],
    [
     123.46027,
     41.83286
    ],
    [
     123.46838,
     41.85683
    ],
    [
     123.47186,
     41.87885
    ]
   ]
  },
  {
   "id": "wen-guan-tun-tie-ling-xi",
   "name": "京哈高速铁路",
   "from": "wen-guan-tun",
   "to": "tie-ling-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 45.13,
   "polyline": [
    [
     123.47186,
     41.87885
    ],
    [
     123.47336,
     41.89133
    ],
    [
     123.47222,
     41.9075
    ],
    [
     123.46482,
     41.93572
    ],
    [
     123.46341,
     41.94799
    ],
    [
     123.46527,
     42.02714
    ],
    [
     123.46782,
     42.03966
    ],
    [
     123.47231,
     42.04976
    ],
    [
     123.48094,
     42.06199
    ],
    [
     123.49083,
     42.07144
    ],
    [
     123.59101,
     42.14216
    ],
    [
     123.66639,
     42.23103
    ]
   ]
  },
  {
   "id": "tie-ling-xi-kai-yuan-xi",
   "name": "京哈高速铁路",
   "from": "tie-ling-xi",
   "to": "kai-yuan-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 43.45,
   "polyline": [
    [
     123.66639,
     42.23103
    ],
    [
     123.76159,
     42.34687
    ],
    [
     123.84972,
     42.44302
    ],
    [
     123.91279,
     42.54738
    ]
   ]
  },
  {
   "id": "kai-yuan-xi-chang-tu-xi",
   "name": "京哈高速铁路",
   "from": "kai-yuan-xi",
   "to": "chang-tu-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 28.78,
   "polyline": [
    [
     123.91279,
     42.54738
    ],
    [
     123.94721,
     42.60695
    ],
    [
     123.99075,
     42.6925
    ],
    [
     124.06058,
     42.77551
    ]
   ]
  },
  {
   "id": "chang-tu-xi-si-ping-dong",
   "name": "京哈高速铁路",
   "from": "chang-tu-xi",
   "to": "si-ping-dong",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 50.47,
   "polyline": [
    [
     124.06058,
     42.77551
    ],
    [
     124.09532,
     42.81745
    ],
    [
     124.14065,
     42.85221
    ],
    [
     124.41343,
     43.10627
    ],
    [
     124.42382,
     43.11831
    ],
    [
     124.4329,
     43.13584
    ]
   ]
  },
  {
   "id": "si-ping-dong-gong-zhu-ling-nan",
   "name": "京哈高速铁路",
   "from": "si-ping-dong",
   "to": "gong-zhu-ling-nan",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 48.4,
   "polyline": [
    [
     124.4329,
     43.13584
    ],
    [
     124.44803,
     43.16072
    ],
    [
     124.45848,
     43.17378
    ],
    [
     124.55939,
     43.27427
    ],
    [
     124.76749,
     43.43956
    ],
    [
     124.80973,
     43.47088
    ]
   ]
  },
  {
   "id": "gong-zhu-ling-nan-chang-chun-xi",
   "name": "京哈高速铁路",
   "from": "gong-zhu-ling-nan",
   "to": "chang-chun-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 56.86,
   "polyline": [
    [
     124.80973,
     43.47088
    ],
    [
     124.84113,
     43.49232
    ],
    [
     124.88325,
     43.53133
    ],
    [
     124.89743,
     43.55454
    ],
    [
     124.90962,
     43.58428
    ],
    [
     124.91771,
     43.59732
    ],
    [
     125.01487,
     43.71743
    ],
    [
     125.04858,
     43.75031
    ],
    [
     125.10858,
     43.82306
    ],
    [
     125.12628,
     43.83761
    ],
    [
     125.1939,
     43.87494
    ]
   ]
  },
  {
   "id": "chang-chun-xi-de-hui-xi",
   "name": "京哈高速铁路",
   "from": "chang-chun-xi",
   "to": "de-hui-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 86.71,
   "polyline": [
    [
     125.1939,
     43.87494
    ],
    [
     125.22246,
     43.89255
    ],
    [
     125.23527,
     43.90463
    ],
    [
     125.24232,
     43.9156
    ],
    [
     125.25516,
     43.94602
    ],
    [
     125.26516,
     43.95963
    ],
    [
     125.27641,
     43.96919
    ],
    [
     125.35143,
     44.02273
    ],
    [
     125.36112,
     44.03232
    ],
    [
     125.39328,
     44.07285
    ],
    [
     125.44186,
     44.14659
    ],
    [
     125.47235,
     44.20248
    ],
    [
     125.49612,
     44.24018
    ],
    [
     125.51739,
     44.28692
    ],
    [
     125.55836,
     44.34736
    ],
    [
     125.57742,
     44.3858
    ],
    [
     125.62499,
     44.44894
    ],
    [
     125.65453,
     44.51859
    ],
    [
     125.67349,
     44.55056
    ],
    [
     125.67032,
     44.54363
    ]
   ]
  },
  {
   "id": "de-hui-xi-fu-yu-bei",
   "name": "京哈高速铁路",
   "from": "de-hui-xi",
   "to": "fu-yu-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 57.74,
   "polyline": [
    [
     125.67032,
     44.54363
    ],
    [
     125.69437,
     44.58373
    ],
    [
     125.72441,
     44.61723
    ],
    [
     125.73275,
     44.63006
    ],
    [
     125.73795,
     44.64711
    ],
    [
     125.73926,
     44.67651
    ],
    [
     125.74658,
     44.69318
    ],
    [
     125.96844,
     44.96037
    ],
    [
     125.99613,
     45.00317
    ]
   ]
  },
  {
   "id": "fu-yu-bei-shuang-cheng-bei",
   "name": "京哈高速铁路",
   "from": "fu-yu-bei",
   "to": "shuang-cheng-bei",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 46.19,
   "polyline": [
    [
     125.99613,
     45.00317
    ],
    [
     126.05408,
     45.09616
    ],
    [
     126.09385,
     45.1517
    ],
    [
     126.11957,
     45.19773
    ],
    [
     126.18391,
     45.28618
    ],
    [
     126.23704,
     45.38165
    ]
   ]
  },
  {
   "id": "shuang-cheng-bei-wang-gang",
   "name": "京哈高速铁路",
   "from": "shuang-cheng-bei",
   "to": "wang-gang",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 41.0,
   "polyline": [
    [
     126.23704,
     45.38165
    ],
    [
     126.25585,
     45.41365
    ],
    [
     126.35599,
     45.53682
    ],
    [
     126.36895,
     45.54755
    ],
    [
     126.41724,
     45.58096
    ],
    [
     126.49612,
     45.62371
    ],
    [
     126.52245,
     45.64743
    ],
    [
     126.54424,
     45.67407
    ]
   ]
  },
  {
   "id": "wang-gang-xia-jia",
   "name": "京哈高速铁路",
   "from": "wang-gang",
   "to": "xia-jia",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 1.2,
   "polyline": [
    [
     126.54424,
     45.67407
    ],
    [
     126.55247,
     45.68324
    ]
   ]
  },
  {
   "id": "xia-jia-ha-er-bin-xi",
   "name": "京哈高速铁路",
   "from": "xia-jia",
   "to": "ha-er-bin-xi",
   "lineIds": [
    "jingha-hsr"
   ],
   "serviceDate": "2021-01-22",
   "estLengthKm": 2.89,
   "polyline": [
    [
     126.55247,
     45.68324
    ],
    [
     126.57232,
     45.70514
    ]
   ]
  },
  {
   "id": "shang-hai-shang-hai-xi",
   "name": "沪宁城际铁路",
   "from": "shang-hai",
   "to": "shang-hai-xi",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.79,
   "polyline": [
    [
     121.45117,
     31.25156
    ],
    [
     121.43733,
     31.2575
    ],
    [
     121.39816,
     31.2646
    ]
   ]
  },
  {
   "id": "shang-hai-xi-jiang-qiao-zhen",
   "name": "沪宁城际铁路",
   "from": "shang-hai-xi",
   "to": "jiang-qiao-zhen",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.22,
   "polyline": [
    [
     121.39816,
     31.2646
    ],
    [
     121.36523,
     31.27129
    ]
   ]
  },
  {
   "id": "jiang-qiao-zhen-nan-xiang",
   "name": "沪宁城际铁路",
   "from": "jiang-qiao-zhen",
   "to": "nan-xiang",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 4.11,
   "polyline": [
    [
     121.36523,
     31.27129
    ],
    [
     121.3231,
     31.27966
    ]
   ]
  },
  {
   "id": "nan-xiang-nan-xiang-bei",
   "name": "沪宁城际铁路",
   "from": "nan-xiang",
   "to": "nan-xiang-bei",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 1.79,
   "polyline": [
    [
     121.3231,
     31.27966
    ],
    [
     121.30482,
     31.28349
    ]
   ]
  },
  {
   "id": "nan-xiang-bei-huang-du",
   "name": "沪宁城际铁路",
   "from": "nan-xiang-bei",
   "to": "huang-du",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.56,
   "polyline": [
    [
     121.30482,
     31.28349
    ],
    [
     121.24471,
     31.29571
    ],
    [
     121.23655,
     31.29783
    ],
    [
     121.2368,
     31.29895
    ]
   ]
  },
  {
   "id": "yang-cheng-hu-wei-ting",
   "name": "沪宁城际铁路",
   "from": "yang-cheng-hu",
   "to": "wei-ting",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 8.24,
   "polyline": [
    [
     120.85707,
     31.38337
    ],
    [
     120.86176,
     31.3822
    ],
    [
     120.83918,
     31.37991
    ],
    [
     120.78368,
     31.36281
    ]
   ]
  },
  {
   "id": "wei-ting-su-zhou-yuan-qu",
   "name": "沪宁城际铁路",
   "from": "wei-ting",
   "to": "su-zhou-yuan-qu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.68,
   "polyline": [
    [
     120.78368,
     31.36281
    ],
    [
     120.75972,
     31.3569
    ],
    [
     120.7434,
     31.35088
    ],
    [
     120.7066,
     31.34265
    ]
   ]
  },
  {
   "id": "su-zhou-yuan-qu-su-zhou",
   "name": "沪宁城际铁路",
   "from": "su-zhou-yuan-qu",
   "to": "su-zhou",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 9.64,
   "polyline": [
    [
     120.7066,
     31.34265
    ],
    [
     120.68568,
     31.33864
    ],
    [
     120.64111,
     31.33817
    ],
    [
     120.60668,
     31.33188
    ]
   ]
  },
  {
   "id": "su-zhou-su-zhou-xi",
   "name": "沪宁城际铁路",
   "from": "su-zhou",
   "to": "su-zhou-xi",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 6.95,
   "polyline": [
    [
     120.60668,
     31.33188
    ],
    [
     120.58394,
     31.32728
    ],
    [
     120.57122,
     31.32875
    ],
    [
     120.56445,
     31.33221
    ],
    [
     120.54495,
     31.3504
    ]
   ]
  },
  {
   "id": "su-zhou-xi-su-zhou-xin-qu",
   "name": "沪宁城际铁路",
   "from": "su-zhou-xi",
   "to": "su-zhou-xin-qu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.49,
   "polyline": [
    [
     120.54495,
     31.3504
    ],
    [
     120.52058,
     31.37394
    ]
   ]
  },
  {
   "id": "su-zhou-xin-qu-xu-shu-guan",
   "name": "沪宁城际铁路",
   "from": "su-zhou-xin-qu",
   "to": "xu-shu-guan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.53,
   "polyline": [
    [
     120.52058,
     31.37394
    ],
    [
     120.50557,
     31.38751
    ]
   ]
  },
  {
   "id": "xu-shu-guan-shuo-fang",
   "name": "沪宁城际铁路",
   "from": "xu-shu-guan",
   "to": "shuo-fang",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 13.42,
   "polyline": [
    [
     120.50557,
     31.38751
    ],
    [
     120.41098,
     31.47725
    ]
   ]
  },
  {
   "id": "shuo-fang-wu-xi-xin-qu",
   "name": "沪宁城际铁路",
   "from": "shuo-fang",
   "to": "wu-xi-xin-qu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.34,
   "polyline": [
    [
     120.41098,
     31.47725
    ],
    [
     120.3875,
     31.4996
    ]
   ]
  },
  {
   "id": "wu-xi-xin-qu-wu-xi-nan",
   "name": "沪宁城际铁路",
   "from": "wu-xi-xin-qu",
   "to": "wu-xi-nan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.27,
   "polyline": [
    [
     120.3875,
     31.4996
    ],
    [
     120.34917,
     31.53466
    ],
    [
     120.33742,
     31.54889
    ]
   ]
  },
  {
   "id": "wu-xi-nan-wu-xi",
   "name": "沪宁城际铁路",
   "from": "wu-xi-nan",
   "to": "wu-xi",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.72,
   "polyline": [
    [
     120.33742,
     31.54889
    ],
    [
     120.31534,
     31.579
    ],
    [
     120.30181,
     31.58981
    ]
   ]
  },
  {
   "id": "wu-xi-wu-xi-bei",
   "name": "沪宁城际铁路",
   "from": "wu-xi",
   "to": "wu-xi-bei",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.39,
   "polyline": [
    [
     120.30181,
     31.58981
    ],
    [
     120.29213,
     31.59598
    ],
    [
     120.27246,
     31.61552
    ],
    [
     120.25562,
     31.62787
    ],
    [
     120.24695,
     31.63665
    ]
   ]
  },
  {
   "id": "wu-xi-bei-hui-shan",
   "name": "沪宁城际铁路",
   "from": "wu-xi-bei",
   "to": "hui-shan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 6.27,
   "polyline": [
    [
     120.24695,
     31.63665
    ],
    [
     120.23623,
     31.64903
    ],
    [
     120.22737,
     31.65634
    ],
    [
     120.19637,
     31.6716
    ]
   ]
  },
  {
   "id": "hui-shan-qi-shu-yan",
   "name": "沪宁城际铁路",
   "from": "hui-shan",
   "to": "qi-shu-yan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 14.52,
   "polyline": [
    [
     120.19637,
     31.6716
    ],
    [
     120.1695,
     31.68147
    ],
    [
     120.14101,
     31.68281
    ],
    [
     120.12736,
     31.68646
    ],
    [
     120.10785,
     31.69672
    ],
    [
     120.06071,
     31.72563
    ]
   ]
  },
  {
   "id": "qi-shu-yan-chang-zhou",
   "name": "沪宁城际铁路",
   "from": "qi-shu-yan",
   "to": "chang-zhou",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 11.12,
   "polyline": [
    [
     120.06071,
     31.72563
    ],
    [
     119.97813,
     31.77691
    ],
    [
     119.9682,
     31.78668
    ]
   ]
  },
  {
   "id": "chang-zhou-xin-zha-zhen",
   "name": "沪宁城际铁路",
   "from": "chang-zhou",
   "to": "xin-zha-zhen",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 9.3,
   "polyline": [
    [
     119.9682,
     31.78668
    ],
    [
     119.96018,
     31.7969
    ],
    [
     119.95569,
     31.80026
    ],
    [
     119.88427,
     31.82648
    ]
   ]
  },
  {
   "id": "xin-zha-zhen-ben-niu",
   "name": "沪宁城际铁路",
   "from": "xin-zha-zhen",
   "to": "ben-niu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 8.1,
   "polyline": [
    [
     119.88427,
     31.82648
    ],
    [
     119.84114,
     31.84662
    ],
    [
     119.81185,
     31.8651
    ]
   ]
  },
  {
   "id": "ben-niu-lv-cheng",
   "name": "沪宁城际铁路",
   "from": "ben-niu",
   "to": "lv-cheng",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 8.28,
   "polyline": [
    [
     119.81185,
     31.8651
    ],
    [
     119.74087,
     31.90883
    ]
   ]
  },
  {
   "id": "lv-cheng-dan-yang-dong",
   "name": "沪宁城际铁路",
   "from": "lv-cheng",
   "to": "dan-yang-dong",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 10.97,
   "polyline": [
    [
     119.74087,
     31.90883
    ],
    [
     119.72373,
     31.91898
    ],
    [
     119.64196,
     31.9606
    ]
   ]
  },
  {
   "id": "dan-yang-dong-dan-yang",
   "name": "沪宁城际铁路",
   "from": "dan-yang-dong",
   "to": "dan-yang",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.42,
   "polyline": [
    [
     119.64196,
     31.9606
    ],
    [
     119.59656,
     31.9842
    ],
    [
     119.59057,
     31.99208
    ],
    [
     119.58852,
     32.00399
    ]
   ]
  },
  {
   "id": "dan-yang-dan-tu",
   "name": "沪宁城际铁路",
   "from": "dan-yang",
   "to": "dan-tu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 15.25,
   "polyline": [
    [
     119.58852,
     32.00399
    ],
    [
     119.57882,
     32.0526
    ],
    [
     119.57492,
     32.06118
    ],
    [
     119.56773,
     32.06889
    ],
    [
     119.54542,
     32.08559
    ],
    [
     119.51319,
     32.1193
    ]
   ]
  },
  {
   "id": "dan-tu-zhen-jiang-dong",
   "name": "沪宁城际铁路",
   "from": "dan-tu",
   "to": "zhen-jiang-dong",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 9.43,
   "polyline": [
    [
     119.51319,
     32.1193
    ],
    [
     119.50018,
     32.13563
    ],
    [
     119.49028,
     32.15335
    ],
    [
     119.47368,
     32.17464
    ],
    [
     119.46671,
     32.18237
    ],
    [
     119.45753,
     32.18897
    ]
   ]
  },
  {
   "id": "zhen-jiang-dong-zhen-jiang",
   "name": "沪宁城际铁路",
   "from": "zhen-jiang-dong",
   "to": "zhen-jiang",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 3.79,
   "polyline": [
    [
     119.45753,
     32.18897
    ],
    [
     119.44089,
     32.19994
    ],
    [
     119.42699,
     32.19966
    ]
   ]
  },
  {
   "id": "zhen-jiang-liu-bai-du",
   "name": "沪宁城际铁路",
   "from": "zhen-jiang",
   "to": "liu-bai-du",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 7.73,
   "polyline": [
    [
     119.42699,
     32.19966
    ],
    [
     119.41112,
     32.19484
    ],
    [
     119.39471,
     32.1928
    ],
    [
     119.37204,
     32.18442
    ],
    [
     119.36022,
     32.18196
    ],
    [
     119.35724,
     32.17245
    ]
   ]
  },
  {
   "id": "liu-bai-du-xia-shu",
   "name": "沪宁城际铁路",
   "from": "liu-bai-du",
   "to": "xia-shu",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 19.6,
   "polyline": [
    [
     119.35724,
     32.17245
    ],
    [
     119.35609,
     32.18115
    ],
    [
     119.32878,
     32.1703
    ],
    [
     119.29184,
     32.16279
    ],
    [
     119.224,
     32.16152
    ],
    [
     119.163,
     32.16356
    ]
   ]
  },
  {
   "id": "xia-shu-shi-liu-yuan",
   "name": "沪宁城际铁路",
   "from": "xia-shu",
   "to": "shi-liu-yuan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.96,
   "polyline": [
    [
     119.163,
     32.16356
    ],
    [
     119.12705,
     32.16356
    ],
    [
     119.10076,
     32.15762
    ]
   ]
  },
  {
   "id": "shi-liu-yuan-bao-hua-shan",
   "name": "沪宁城际铁路",
   "from": "shi-liu-yuan",
   "to": "bao-hua-shan",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 4.88,
   "polyline": [
    [
     119.10076,
     32.15762
    ],
    [
     119.07598,
     32.1515
    ],
    [
     119.05016,
     32.15157
    ]
   ]
  },
  {
   "id": "bao-hua-shan-xian-lin",
   "name": "沪宁城际铁路",
   "from": "bao-hua-shan",
   "to": "xian-lin",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 14.03,
   "polyline": [
    [
     119.05016,
     32.15157
    ],
    [
     119.01424,
     32.1515
    ],
    [
     118.96707,
     32.14052
    ],
    [
     118.93347,
     32.13737
    ],
    [
     118.92217,
     32.13352
    ],
    [
     118.90757,
     32.12488
    ]
   ]
  },
  {
   "id": "xian-lin-xing-wei-cun",
   "name": "沪宁城际铁路",
   "from": "xian-lin",
   "to": "xing-wei-cun",
   "lineIds": [
    "huning-int"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.91,
   "polyline": [
    [
     118.90757,
     32.12488
    ],
    [
     118.87878,
     32.10955
    ],
    [
     118.86657,
     32.10641
    ],
    [
     118.8509,
     32.10474
    ]
   ]
  },
  {
   "id": "xing-wei-cun-nan-jing",
   "name": "沪宁城际铁路",
   "from": "xing-wei-cun",
   "to": "nan-jing",
   "lineIds": [
    "huning-int",
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 6.65,
   "polyline": [
    [
     118.8509,
     32.10474
    ],
    [
     118.83852,
     32.10163
    ],
    [
     118.82271,
     32.09147
    ],
    [
     118.80624,
     32.08463
    ],
    [
     118.80114,
     32.0855
    ],
    [
     118.79088,
     32.09038
    ],
    [
     118.79175,
     32.08872
    ]
   ]
  },
  {
   "id": "nanjing-south-jiang-ning",
   "name": "宁杭高速铁路",
   "from": "nanjing-south",
   "to": "jiang-ning",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 11.38,
   "polyline": [
    [
     118.81,
     31.97
    ],
    [
     118.80854,
     31.97847
    ],
    [
     118.81472,
     31.98095
    ],
    [
     118.83724,
     31.98405
    ],
    [
     118.84843,
     31.98259
    ],
    [
     118.85739,
     31.97695
    ],
    [
     118.89392,
     31.9387
    ]
   ]
  },
  {
   "id": "jiang-ning-ju-rong-xi",
   "name": "宁杭高速铁路",
   "from": "jiang-ning",
   "to": "ju-rong-xi",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 15.38,
   "polyline": [
    [
     118.89392,
     31.9387
    ],
    [
     118.9049,
     31.92824
    ],
    [
     118.92586,
     31.90284
    ],
    [
     118.94552,
     31.87156
    ],
    [
     118.97471,
     31.83472
    ]
   ]
  },
  {
   "id": "ju-rong-xi-li-shui",
   "name": "宁杭高速铁路",
   "from": "ju-rong-xi",
   "to": "li-shui",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 20.91,
   "polyline": [
    [
     118.97471,
     31.83472
    ],
    [
     118.98314,
     31.82349
    ],
    [
     119.00683,
     31.78329
    ],
    [
     119.01444,
     31.7748
    ],
    [
     119.04215,
     31.75233
    ],
    [
     119.05032,
     31.74376
    ],
    [
     119.09096,
     31.68134
    ]
   ]
  },
  {
   "id": "li-shui-wa-wu-shan",
   "name": "宁杭高速铁路",
   "from": "li-shui",
   "to": "wa-wu-shan",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 22.82,
   "polyline": [
    [
     119.09096,
     31.68134
    ],
    [
     119.10341,
     31.66392
    ],
    [
     119.11798,
     31.65236
    ],
    [
     119.13141,
     31.64481
    ],
    [
     119.18375,
     31.6247
    ],
    [
     119.196,
     31.6182
    ],
    [
     119.26923,
     31.56099
    ]
   ]
  },
  {
   "id": "wa-wu-shan-li-yang",
   "name": "宁杭高速铁路",
   "from": "wa-wu-shan",
   "to": "li-yang",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 30.72,
   "polyline": [
    [
     119.26923,
     31.56099
    ],
    [
     119.34318,
     31.50248
    ],
    [
     119.3946,
     31.44913
    ],
    [
     119.41108,
     31.42953
    ],
    [
     119.44159,
     31.40487
    ],
    [
     119.45547,
     31.39651
    ],
    [
     119.46698,
     31.39228
    ],
    [
     119.47705,
     31.38989
    ],
    [
     119.49768,
     31.38796
    ]
   ]
  },
  {
   "id": "li-yang-yi-xing",
   "name": "宁杭高速铁路",
   "from": "li-yang",
   "to": "yi-xing",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 31.07,
   "polyline": [
    [
     119.49768,
     31.38796
    ],
    [
     119.64441,
     31.37047
    ],
    [
     119.68404,
     31.35487
    ],
    [
     119.72083,
     31.34933
    ],
    [
     119.75215,
     31.33995
    ],
    [
     119.78136,
     31.32417
    ],
    [
     119.80872,
     31.31387
    ]
   ]
  },
  {
   "id": "yi-xing-chang-xing",
   "name": "宁杭高速铁路",
   "from": "yi-xing",
   "to": "chang-xing",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 36.31,
   "polyline": [
    [
     119.80872,
     31.31387
    ],
    [
     119.82702,
     31.30879
    ],
    [
     119.83834,
     31.30373
    ],
    [
     119.85067,
     31.29426
    ],
    [
     119.85842,
     31.28395
    ],
    [
     119.86228,
     31.27473
    ],
    [
     119.86398,
     31.26561
    ],
    [
     119.86095,
     31.23241
    ],
    [
     119.86219,
     31.22141
    ],
    [
     119.86507,
     31.21235
    ],
    [
     119.88329,
     31.17588
    ],
    [
     119.90688,
     31.14117
    ],
    [
     119.92243,
     31.10942
    ],
    [
     119.92868,
     31.10104
    ],
    [
     119.94568,
     31.08533
    ],
    [
     119.95422,
     31.07546
    ],
    [
     119.96072,
     31.06498
    ],
    [
     119.97061,
     31.044
    ]
   ]
  },
  {
   "id": "chang-xing-hong-qiao-zhen",
   "name": "宁杭高速铁路",
   "from": "chang-xing",
   "to": "hong-qiao-zhen",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 7.81,
   "polyline": [
    [
     119.97061,
     31.044
    ],
    [
     119.97625,
     31.02983
    ],
    [
     119.99232,
     31.00057
    ],
    [
     120.00177,
     30.9792
    ]
   ]
  },
  {
   "id": "hong-qiao-zhen-hu-zhou",
   "name": "宁杭高速铁路",
   "from": "hong-qiao-zhen",
   "to": "hu-zhou",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 13.05,
   "polyline": [
    [
     120.00177,
     30.9792
    ],
    [
     120.02055,
     30.93192
    ],
    [
     120.02192,
     30.9235
    ],
    [
     120.0182,
     30.88807
    ],
    [
     120.01758,
     30.86509
    ]
   ]
  },
  {
   "id": "hu-zhou-miao-xi",
   "name": "宁杭高速铁路",
   "from": "hu-zhou",
   "to": "miao-xi",
   "lineIds": [
    "ninghang-hsr",
    "huzhou-hangzhou"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 8.45,
   "polyline": [
    [
     120.01758,
     30.86509
    ],
    [
     120.01721,
     30.80633
    ],
    [
     120.01553,
     30.78926
    ]
   ]
  },
  {
   "id": "miao-xi-de-qing",
   "name": "宁杭高速铁路",
   "from": "miao-xi",
   "to": "de-qing",
   "lineIds": [
    "ninghang-hsr",
    "huzhou-hangzhou"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 28.2,
   "polyline": [
    [
     120.01553,
     30.78926
    ],
    [
     120.01187,
     30.75495
    ],
    [
     120.01364,
     30.72999
    ],
    [
     120.02617,
     30.67253
    ],
    [
     120.03405,
     30.62757
    ],
    [
     120.04542,
     30.59822
    ],
    [
     120.05682,
     30.54703
    ]
   ]
  },
  {
   "id": "de-qing-hang-zhou-bei",
   "name": "宁杭高速铁路",
   "from": "de-qing",
   "to": "hang-zhou-bei",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 25.08,
   "polyline": [
    [
     120.05682,
     30.54703
    ],
    [
     120.0643,
     30.51909
    ],
    [
     120.07965,
     30.49112
    ],
    [
     120.09266,
     30.45317
    ],
    [
     120.11596,
     30.40675
    ],
    [
     120.12409,
     30.39573
    ],
    [
     120.14283,
     30.37823
    ],
    [
     120.14753,
     30.36756
    ],
    [
     120.15156,
     30.35156
    ],
    [
     120.15943,
     30.3435
    ]
   ]
  },
  {
   "id": "hang-zhou-bei-hang-zhou-dong",
   "name": "宁杭高速铁路",
   "from": "hang-zhou-bei",
   "to": "hang-zhou-dong",
   "lineIds": [
    "ninghang-hsr"
   ],
   "serviceDate": "2013-07-01",
   "estLengthKm": 7.83,
   "polyline": [
    [
     120.15943,
     30.3435
    ],
    [
     120.19107,
     30.32696
    ],
    [
     120.19505,
     30.32036
    ],
    [
     120.19581,
     30.31092
    ],
    [
     120.19777,
     30.30518
    ],
    [
     120.2082,
     30.29355
    ]
   ]
  },
  {
   "id": "bei-jing-xi-ya-men-kou-dong",
   "name": "京广高速铁路",
   "from": "bei-jing-xi",
   "to": "ya-men-kou-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 8.78,
   "polyline": [
    [
     116.3151,
     39.89367
    ],
    [
     116.30428,
     39.89397
    ],
    [
     116.2932,
     39.89061
    ],
    [
     116.28081,
     39.89472
    ],
    [
     116.2146,
     39.89417
    ]
   ]
  },
  {
   "id": "ya-men-kou-dong-zhang-xin-dian",
   "name": "京广高速铁路",
   "from": "ya-men-kou-dong",
   "to": "zhang-xin-dian",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 8.56,
   "polyline": [
    [
     116.2146,
     39.89417
    ],
    [
     116.20724,
     39.89197
    ],
    [
     116.19883,
     39.8867
    ],
    [
     116.19387,
     39.88129
    ],
    [
     116.19193,
     39.87635
    ],
    [
     116.19275,
     39.86847
    ],
    [
     116.2062,
     39.8427
    ],
    [
     116.20851,
     39.8278
    ]
   ]
  },
  {
   "id": "zhang-xin-dian-zhuo-zhou-dong",
   "name": "京广高速铁路",
   "from": "zhang-xin-dian",
   "to": "zhuo-zhou-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 45.11,
   "polyline": [
    [
     116.20851,
     39.8278
    ],
    [
     116.20759,
     39.81893
    ],
    [
     116.20012,
     39.80768
    ],
    [
     116.19775,
     39.80138
    ],
    [
     116.19704,
     39.78391
    ],
    [
     116.19362,
     39.76006
    ],
    [
     116.19399,
     39.74432
    ],
    [
     116.19982,
     39.71066
    ],
    [
     116.19882,
     39.69908
    ],
    [
     116.19562,
     39.68904
    ],
    [
     116.18763,
     39.67584
    ],
    [
     116.16302,
     39.64809
    ],
    [
     116.09527,
     39.55401
    ],
    [
     116.06041,
     39.47965
    ],
    [
     116.04739,
     39.45864
    ]
   ]
  },
  {
   "id": "zhuo-zhou-dong-gao-bei-dian-dong",
   "name": "京广高速铁路",
   "from": "zhuo-zhou-dong",
   "to": "gao-bei-dian-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 22.03,
   "polyline": [
    [
     116.04739,
     39.45864
    ],
    [
     116.00753,
     39.39361
    ],
    [
     115.984,
     39.36158
    ],
    [
     115.95463,
     39.30609
    ],
    [
     115.94067,
     39.28786
    ]
   ]
  },
  {
   "id": "gao-bei-dian-dong-xu-shui-dong",
   "name": "京广高速铁路",
   "from": "gao-bei-dian-dong",
   "to": "xu-shui-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 31.86,
   "polyline": [
    [
     115.94067,
     39.28786
    ],
    [
     115.89869,
     39.23475
    ],
    [
     115.86146,
     39.19588
    ],
    [
     115.80435,
     39.10146
    ],
    [
     115.75218,
     39.04269
    ]
   ]
  },
  {
   "id": "xu-shui-dong-bao-ding-dong",
   "name": "京广高速铁路",
   "from": "xu-shui-dong",
   "to": "bao-ding-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 25.25,
   "polyline": [
    [
     115.75218,
     39.04269
    ],
    [
     115.71564,
     39.00194
    ],
    [
     115.68558,
     38.97467
    ],
    [
     115.62788,
     38.90659
    ],
    [
     115.59573,
     38.86346
    ]
   ]
  },
  {
   "id": "bao-ding-dong-ding-zhou-dong",
   "name": "京广高速铁路",
   "from": "bao-ding-dong",
   "to": "ding-zhou-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 61.43,
   "polyline": [
    [
     115.59573,
     38.86346
    ],
    [
     115.5438,
     38.79124
    ],
    [
     115.50719,
     38.75413
    ],
    [
     115.49164,
     38.74164
    ],
    [
     115.47877,
     38.73389
    ],
    [
     115.42155,
     38.70796
    ],
    [
     115.18079,
     38.58035
    ],
    [
     115.06906,
     38.50776
    ]
   ]
  },
  {
   "id": "ding-zhou-dong-zheng-ding-ji-chang",
   "name": "京广高速铁路",
   "from": "ding-zhou-dong",
   "to": "zheng-ding-ji-chang",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 44.46,
   "polyline": [
    [
     115.06906,
     38.50776
    ],
    [
     115.0487,
     38.49357
    ],
    [
     114.99237,
     38.45002
    ],
    [
     114.9769,
     38.44014
    ],
    [
     114.88029,
     38.3954
    ],
    [
     114.86085,
     38.38411
    ],
    [
     114.84283,
     38.36829
    ],
    [
     114.77217,
     38.28737
    ],
    [
     114.76254,
     38.27799
    ],
    [
     114.75298,
     38.27067
    ],
    [
     114.73592,
     38.26126
    ],
    [
     114.71623,
     38.25411
    ],
    [
     114.70333,
     38.25131
    ]
   ]
  },
  {
   "id": "zheng-ding-ji-chang-liu-xin-zhuang",
   "name": "京广高速铁路",
   "from": "zheng-ding-ji-chang",
   "to": "liu-xin-zhuang",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 26.85,
   "polyline": [
    [
     114.70333,
     38.25131
    ],
    [
     114.6672,
     38.24175
    ],
    [
     114.62635,
     38.23623
    ],
    [
     114.60875,
     38.23148
    ],
    [
     114.59041,
     38.22323
    ],
    [
     114.54782,
     38.19438
    ],
    [
     114.53622,
     38.18382
    ],
    [
     114.5278,
     38.17318
    ],
    [
     114.51141,
     38.14442
    ],
    [
     114.50747,
     38.13188
    ],
    [
     114.50621,
     38.10926
    ],
    [
     114.50426,
     38.0995
    ]
   ]
  },
  {
   "id": "liu-xin-zhuang-shi-jia-zhuang",
   "name": "京广高速铁路",
   "from": "liu-xin-zhuang",
   "to": "shi-jia-zhuang",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 10.32,
   "polyline": [
    [
     114.50426,
     38.0995
    ],
    [
     114.49306,
     38.07236
    ],
    [
     114.47813,
     38.0095
    ]
   ]
  },
  {
   "id": "shi-jia-zhuang-gao-yi-xi",
   "name": "京广高速铁路",
   "from": "shi-jia-zhuang",
   "to": "gao-yi-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 43.53,
   "polyline": [
    [
     114.47813,
     38.0095
    ],
    [
     114.47078,
     37.97767
    ],
    [
     114.46886,
     37.93632
    ],
    [
     114.47161,
     37.907
    ],
    [
     114.46866,
     37.86659
    ],
    [
     114.47402,
     37.83018
    ],
    [
     114.47075,
     37.7901
    ],
    [
     114.47125,
     37.77899
    ],
    [
     114.47451,
     37.76549
    ],
    [
     114.52506,
     37.62518
    ]
   ]
  },
  {
   "id": "gao-yi-xi-xing-tai-dong",
   "name": "京广高速铁路",
   "from": "gao-yi-xi",
   "to": "xing-tai-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 60.78,
   "polyline": [
    [
     114.52506,
     37.62518
    ],
    [
     114.53138,
     37.60551
    ],
    [
     114.54098,
     37.55248
    ],
    [
     114.5581,
     37.50575
    ],
    [
     114.57324,
     37.40711
    ],
    [
     114.58156,
     37.37045
    ],
    [
     114.58114,
     37.29452
    ],
    [
     114.57201,
     37.23282
    ],
    [
     114.57324,
     37.22154
    ],
    [
     114.58179,
     37.19718
    ],
    [
     114.58369,
     37.18765
    ],
    [
     114.58627,
     37.1209
    ],
    [
     114.58595,
     37.09143
    ]
   ]
  },
  {
   "id": "xing-tai-dong-han-dan-dong",
   "name": "京广高速铁路",
   "from": "xing-tai-dong",
   "to": "han-dan-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 52.92,
   "polyline": [
    [
     114.58595,
     37.09143
    ],
    [
     114.57965,
     37.01902
    ],
    [
     114.56732,
     36.97237
    ],
    [
     114.55528,
     36.94647
    ],
    [
     114.55143,
     36.93514
    ],
    [
     114.54779,
     36.90758
    ],
    [
     114.55079,
     36.87035
    ],
    [
     114.55229,
     36.7909
    ],
    [
     114.55057,
     36.76556
    ],
    [
     114.55211,
     36.74032
    ],
    [
     114.5489,
     36.71648
    ],
    [
     114.54774,
     36.69
    ],
    [
     114.55166,
     36.65228
    ],
    [
     114.55316,
     36.61981
    ]
   ]
  },
  {
   "id": "han-dan-dong-an-yang-dong",
   "name": "京广高速铁路",
   "from": "han-dan-dong",
   "to": "an-yang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 60.37,
   "polyline": [
    [
     114.55316,
     36.61981
    ],
    [
     114.55116,
     36.5856
    ],
    [
     114.52419,
     36.47895
    ],
    [
     114.45437,
     36.10724
    ],
    [
     114.44796,
     36.08415
    ]
   ]
  },
  {
   "id": "an-yang-dong-he-bi-dong",
   "name": "京广高速铁路",
   "from": "an-yang-dong",
   "to": "he-bi-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 47.11,
   "polyline": [
    [
     114.44796,
     36.08415
    ],
    [
     114.43603,
     36.02472
    ],
    [
     114.42851,
     35.97189
    ],
    [
     114.41083,
     35.90357
    ],
    [
     114.40489,
     35.89251
    ],
    [
     114.3961,
     35.88224
    ],
    [
     114.38518,
     35.87385
    ],
    [
     114.35215,
     35.85553
    ],
    [
     114.34275,
     35.84699
    ],
    [
     114.33461,
     35.83586
    ],
    [
     114.32824,
     35.81867
    ],
    [
     114.31343,
     35.73669
    ],
    [
     114.30651,
     35.72144
    ],
    [
     114.29439,
     35.70605
    ]
   ]
  },
  {
   "id": "he-bi-dong-wei-hui",
   "name": "京广高速铁路",
   "from": "he-bi-dong",
   "to": "wei-hui",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 38.56,
   "polyline": [
    [
     114.29439,
     35.70605
    ],
    [
     114.27476,
     35.67911
    ],
    [
     114.24211,
     35.64567
    ],
    [
     114.21274,
     35.60204
    ],
    [
     114.19989,
     35.59028
    ],
    [
     114.16575,
     35.56759
    ],
    [
     114.15093,
     35.55274
    ],
    [
     114.14289,
     35.54
    ],
    [
     114.10859,
     35.46833
    ],
    [
     114.0996,
     35.45449
    ],
    [
     114.08414,
     35.44036
    ],
    [
     114.05768,
     35.42572
    ]
   ]
  },
  {
   "id": "wei-hui-xin-xiang-dong",
   "name": "京广高速铁路",
   "from": "wei-hui",
   "to": "xin-xiang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 15.92,
   "polyline": [
    [
     114.05768,
     35.42572
    ],
    [
     114.04557,
     35.41733
    ],
    [
     114.03334,
     35.40435
    ],
    [
     114.00207,
     35.3543
    ],
    [
     113.97033,
     35.30941
    ],
    [
     113.97293,
     35.31471
    ]
   ]
  },
  {
   "id": "xin-xiang-dong-zheng-zhou-dong",
   "name": "京广高速铁路",
   "from": "xin-xiang-dong",
   "to": "zheng-zhou-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 67.47,
   "polyline": [
    [
     113.97293,
     35.31471
    ],
    [
     113.95596,
     35.28894
    ],
    [
     113.94912,
     35.27547
    ],
    [
     113.94591,
     35.26434
    ],
    [
     113.93838,
     35.21646
    ],
    [
     113.9337,
     35.20361
    ],
    [
     113.92825,
     35.19377
    ],
    [
     113.92047,
     35.1834
    ],
    [
     113.81832,
     35.0745
    ],
    [
     113.78551,
     35.03059
    ],
    [
     113.76885,
     34.99935
    ],
    [
     113.75082,
     34.93968
    ],
    [
     113.74876,
     34.89825
    ],
    [
     113.75235,
     34.88157
    ],
    [
     113.76273,
     34.85919
    ],
    [
     113.76549,
     34.84929
    ],
    [
     113.77207,
     34.76216
    ],
    [
     113.77325,
     34.76019
    ]
   ]
  },
  {
   "id": "zheng-zhou-dong-nan-cao",
   "name": "京广高速铁路",
   "from": "zheng-zhou-dong",
   "to": "nan-cao",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 9.13,
   "polyline": [
    [
     113.77325,
     34.76019
    ],
    [
     113.77244,
     34.75819
    ],
    [
     113.77471,
     34.73302
    ],
    [
     113.78374,
     34.69501
    ],
    [
     113.7832,
     34.67913
    ]
   ]
  },
  {
   "id": "nan-cao-xu-chang-dong",
   "name": "京广高速铁路",
   "from": "nan-cao",
   "to": "xu-chang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 73.55,
   "polyline": [
    [
     113.7832,
     34.67913
    ],
    [
     113.77809,
     34.65444
    ],
    [
     113.77807,
     34.64032
    ],
    [
     113.78375,
     34.61345
    ],
    [
     113.78511,
     34.57516
    ],
    [
     113.80391,
     34.48643
    ],
    [
     113.80606,
     34.45535
    ],
    [
     113.79561,
     34.3794
    ],
    [
     113.79808,
     34.34977
    ],
    [
     113.79052,
     34.30694
    ],
    [
     113.79002,
     34.29213
    ],
    [
     113.792,
     34.28281
    ],
    [
     113.79729,
     34.27
    ],
    [
     113.8152,
     34.2366
    ],
    [
     113.82634,
     34.20381
    ],
    [
     113.82929,
     34.19167
    ],
    [
     113.83283,
     34.15849
    ],
    [
     113.83613,
     34.1467
    ],
    [
     113.87355,
     34.08609
    ],
    [
     113.87907,
     34.07181
    ],
    [
     113.88419,
     34.04301
    ],
    [
     113.88202,
     34.05
    ]
   ]
  },
  {
   "id": "xu-chang-dong-ta-he-xi",
   "name": "京广高速铁路",
   "from": "xu-chang-dong",
   "to": "ta-he-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 54.49,
   "polyline": [
    [
     113.88202,
     34.05
    ],
    [
     113.88716,
     34.02541
    ],
    [
     113.8878,
     34.01097
    ],
    [
     113.88513,
     33.99439
    ],
    [
     113.87079,
     33.95024
    ],
    [
     113.87246,
     33.88055
    ],
    [
     113.87696,
     33.86531
    ],
    [
     113.90529,
     33.79821
    ],
    [
     113.92479,
     33.76047
    ],
    [
     113.94404,
     33.71429
    ],
    [
     113.96146,
     33.64365
    ],
    [
     113.9576,
     33.57437
    ]
   ]
  },
  {
   "id": "ta-he-xi-zhu-ma-dian-xi",
   "name": "京广高速铁路",
   "from": "ta-he-xi",
   "to": "zhu-ma-dian-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 63.91,
   "polyline": [
    [
     113.9576,
     33.57437
    ],
    [
     113.95005,
     33.51417
    ],
    [
     113.95115,
     33.44514
    ],
    [
     113.95336,
     33.41509
    ],
    [
     113.95246,
     33.39351
    ],
    [
     113.94927,
     33.36722
    ],
    [
     113.95066,
     33.33151
    ],
    [
     113.94629,
     33.27028
    ],
    [
     113.94632,
     33.19379
    ],
    [
     113.94829,
     33.15654
    ],
    [
     113.96008,
     33.11484
    ],
    [
     113.97165,
     33.05309
    ],
    [
     113.97264,
     33.00256
    ]
   ]
  },
  {
   "id": "zhu-ma-dian-xi-ming-gang-dong",
   "name": "京广高速铁路",
   "from": "zhu-ma-dian-xi",
   "to": "ming-gang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 58.26,
   "polyline": [
    [
     113.97264,
     33.00256
    ],
    [
     113.97287,
     32.96243
    ],
    [
     113.98404,
     32.91786
    ],
    [
     113.98777,
     32.89395
    ],
    [
     113.99254,
     32.83672
    ],
    [
     113.99244,
     32.80437
    ],
    [
     113.99546,
     32.78154
    ],
    [
     113.99915,
     32.71917
    ],
    [
     114.00813,
     32.66495
    ],
    [
     114.01229,
     32.61697
    ],
    [
     114.01975,
     32.56855
    ],
    [
     114.03397,
     32.52727
    ],
    [
     114.04839,
     32.50301
    ],
    [
     114.05888,
     32.48895
    ]
   ]
  },
  {
   "id": "ming-gang-dong-xin-yang-dong",
   "name": "京广高速铁路",
   "from": "ming-gang-dong",
   "to": "xin-yang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 39.73,
   "polyline": [
    [
     114.05888,
     32.48895
    ],
    [
     114.09705,
     32.42929
    ],
    [
     114.12179,
     32.36599
    ],
    [
     114.12421,
     32.35131
    ],
    [
     114.12416,
     32.32585
    ],
    [
     114.15439,
     32.14592
    ]
   ]
  },
  {
   "id": "xin-yang-dong-xiao-gan-bei",
   "name": "京广高速铁路",
   "from": "xin-yang-dong",
   "to": "xiao-gan-bei",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 63.35,
   "polyline": [
    [
     114.15439,
     32.14592
    ],
    [
     114.16075,
     32.11271
    ],
    [
     114.15975,
     32.07942
    ],
    [
     114.15599,
     32.06207
    ],
    [
     114.13743,
     32.01369
    ],
    [
     114.13563,
     32.00099
    ],
    [
     114.13606,
     31.96547
    ],
    [
     114.16021,
     31.8819
    ],
    [
     114.16724,
     31.81162
    ],
    [
     114.1787,
     31.74841
    ],
    [
     114.18089,
     31.72969
    ],
    [
     114.19269,
     31.68478
    ],
    [
     114.2036,
     31.66049
    ],
    [
     114.20736,
     31.64855
    ],
    [
     114.21599,
     31.58819
    ]
   ]
  },
  {
   "id": "xiao-gan-bei-jg-junction",
   "name": "京广高速铁路",
   "from": "xiao-gan-bei",
   "to": "jg-junction",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 90.31,
   "polyline": [
    [
     114.21599,
     31.58819
    ],
    [
     114.24421,
     31.4945
    ],
    [
     114.25398,
     31.42104
    ],
    [
     114.25512,
     31.38414
    ],
    [
     114.26058,
     31.30656
    ],
    [
     114.25494,
     31.15341
    ],
    [
     114.25903,
     31.12677
    ],
    [
     114.27608,
     31.0789
    ],
    [
     114.27495,
     31.04599
    ],
    [
     114.27787,
     30.9862
    ],
    [
     114.29767,
     30.86729
    ],
    [
     114.30599,
     30.84423
    ],
    [
     114.3328,
     30.793
    ]
   ]
  },
  {
   "id": "jg-junction-wuhan",
   "name": "京广高速铁路",
   "from": "jg-junction",
   "to": "wuhan",
   "lineIds": [
    "jingguang-hsr",
    "ningrong"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 22.42,
   "polyline": [
    [
     114.3328,
     30.793
    ],
    [
     114.35217,
     30.75448
    ],
    [
     114.35468,
     30.74389
    ],
    [
     114.35631,
     30.72468
    ],
    [
     114.3588,
     30.71726
    ],
    [
     114.39418,
     30.66889
    ],
    [
     114.4058,
     30.64652
    ],
    [
     114.41868,
     30.60944
    ],
    [
     114.42,
     30.61
    ]
   ]
  },
  {
   "id": "wuhan-wu-chang-dong",
   "name": "京广高速铁路",
   "from": "wuhan",
   "to": "wu-chang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 6.77,
   "polyline": [
    [
     114.42,
     30.61
    ],
    [
     114.41927,
     30.60755
    ],
    [
     114.43126,
     30.57272
    ],
    [
     114.4353,
     30.56448
    ],
    [
     114.44318,
     30.55347
    ]
   ]
  },
  {
   "id": "wu-chang-dong-wu-gang",
   "name": "京广高速铁路",
   "from": "wu-chang-dong",
   "to": "wu-gang",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 0.31,
   "polyline": [
    [
     114.44318,
     30.55347
    ],
    [
     114.44478,
     30.55106
    ]
   ]
  },
  {
   "id": "wu-gang-wu-long-quan-dong",
   "name": "京广高速铁路",
   "from": "wu-gang",
   "to": "wu-long-quan-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 40.85,
   "polyline": [
    [
     114.44478,
     30.55106
    ],
    [
     114.45198,
     30.53599
    ],
    [
     114.4546,
     30.51984
    ],
    [
     114.45321,
     30.43937
    ],
    [
     114.45122,
     30.42595
    ],
    [
     114.44152,
     30.39098
    ],
    [
     114.43569,
     30.37722
    ],
    [
     114.4019,
     30.32742
    ],
    [
     114.36319,
     30.25814
    ],
    [
     114.35755,
     30.24041
    ],
    [
     114.35628,
     30.226
    ],
    [
     114.3568,
     30.20392
    ]
   ]
  },
  {
   "id": "wu-long-quan-dong-shan-po-dong",
   "name": "京广高速铁路",
   "from": "wu-long-quan-dong",
   "to": "shan-po-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 12.59,
   "polyline": [
    [
     114.3568,
     30.20392
    ],
    [
     114.35778,
     30.17213
    ],
    [
     114.3629,
     30.13615
    ],
    [
     114.36384,
     30.0911
    ]
   ]
  },
  {
   "id": "shan-po-dong-he-sheng-qiao-dong",
   "name": "京广高速铁路",
   "from": "shan-po-dong",
   "to": "he-sheng-qiao-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 8.11,
   "polyline": [
    [
     114.36384,
     30.0911
    ],
    [
     114.37145,
     30.01852
    ]
   ]
  },
  {
   "id": "he-sheng-qiao-dong-heng-gou-qiao",
   "name": "京广高速铁路",
   "from": "he-sheng-qiao-dong",
   "to": "heng-gou-qiao",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 9.82,
   "polyline": [
    [
     114.37145,
     30.01852
    ],
    [
     114.37355,
     29.99339
    ],
    [
     114.37007,
     29.97224
    ],
    [
     114.36399,
     29.95802
    ],
    [
     114.34901,
     29.93503
    ]
   ]
  },
  {
   "id": "heng-gou-qiao-xian-ning-bei",
   "name": "京广高速铁路",
   "from": "heng-gou-qiao",
   "to": "xian-ning-bei",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 7.73,
   "polyline": [
    [
     114.34901,
     29.93503
    ],
    [
     114.33879,
     29.9251
    ],
    [
     114.32958,
     29.91843
    ],
    [
     114.29585,
     29.90161
    ]
   ]
  },
  {
   "id": "xian-ning-bei-chi-bi-bei",
   "name": "京广高速铁路",
   "from": "xian-ning-bei",
   "to": "chi-bi-bei",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 43.03,
   "polyline": [
    [
     114.29585,
     29.90161
    ],
    [
     114.26994,
     29.89015
    ],
    [
     114.22961,
     29.86694
    ],
    [
     114.21415,
     29.86055
    ],
    [
     114.00417,
     29.79806
    ],
    [
     113.99181,
     29.79206
    ],
    [
     113.92245,
     29.75144
    ],
    [
     113.89479,
     29.73935
    ]
   ]
  },
  {
   "id": "chi-bi-bei-yue-yang-dong",
   "name": "京广高速铁路",
   "from": "chi-bi-bei",
   "to": "yue-yang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 81.92,
   "polyline": [
    [
     113.89479,
     29.73935
    ],
    [
     113.87549,
     29.73201
    ],
    [
     113.83085,
     29.70861
    ],
    [
     113.8134,
     29.69652
    ],
    [
     113.76706,
     29.65488
    ],
    [
     113.70986,
     29.58004
    ],
    [
     113.67619,
     29.55284
    ],
    [
     113.65833,
     29.54145
    ],
    [
     113.63549,
     29.53168
    ],
    [
     113.62168,
     29.52755
    ],
    [
     113.52784,
     29.51778
    ],
    [
     113.44099,
     29.49736
    ],
    [
     113.41213,
     29.48885
    ],
    [
     113.34199,
     29.45469
    ],
    [
     113.26602,
     29.42587
    ],
    [
     113.25023,
     29.41834
    ],
    [
     113.23606,
     29.40868
    ],
    [
     113.22473,
     29.39815
    ],
    [
     113.20232,
     29.36896
    ]
   ]
  },
  {
   "id": "yue-yang-dong-mi-luo-dong",
   "name": "京广高速铁路",
   "from": "yue-yang-dong",
   "to": "mi-luo-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 72.02,
   "polyline": [
    [
     113.20232,
     29.36896
    ],
    [
     113.20676,
     29.37394
    ],
    [
     113.17904,
     29.33384
    ],
    [
     113.17199,
     29.3207
    ],
    [
     113.14215,
     29.23146
    ],
    [
     113.13895,
     29.21479
    ],
    [
     113.14086,
     29.16095
    ],
    [
     113.13955,
     29.13637
    ],
    [
     113.14208,
     28.91852
    ],
    [
     113.1303,
     28.79172
    ],
    [
     113.13185,
     28.77626
    ],
    [
     113.13822,
     28.74864
    ]
   ]
  },
  {
   "id": "mi-luo-dong-chang-sha-nan",
   "name": "京广高速铁路",
   "from": "mi-luo-dong",
   "to": "chang-sha-nan",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 68.2,
   "polyline": [
    [
     113.13822,
     28.74864
    ],
    [
     113.14432,
     28.7103
    ],
    [
     113.14554,
     28.61402
    ],
    [
     113.14463,
     28.60408
    ],
    [
     113.13873,
     28.58232
    ],
    [
     113.08056,
     28.45228
    ],
    [
     113.07559,
     28.43657
    ],
    [
     113.07404,
     28.419
    ],
    [
     113.07276,
     28.30261
    ],
    [
     113.06604,
     28.26917
    ],
    [
     113.06451,
     28.23668
    ],
    [
     113.05763,
     28.18319
    ],
    [
     113.05745,
     28.16973
    ],
    [
     113.05988,
     28.15008
    ]
   ]
  },
  {
   "id": "chang-sha-nan-zhu-zhou-xi",
   "name": "京广高速铁路",
   "from": "chang-sha-nan",
   "to": "zhu-zhou-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 40.0,
   "polyline": [
    [
     113.05988,
     28.15008
    ],
    [
     113.06105,
     28.11584
    ],
    [
     113.0466,
     28.04511
    ],
    [
     113.04202,
     27.95286
    ],
    [
     113.0494,
     27.90435
    ],
    [
     113.05072,
     27.875
    ],
    [
     113.05802,
     27.83707
    ],
    [
     113.06284,
     27.79395
    ]
   ]
  },
  {
   "id": "zhu-zhou-xi-heng-shan-xi",
   "name": "京广高速铁路",
   "from": "zhu-zhou-xi",
   "to": "heng-shan-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 67.75,
   "polyline": [
    [
     113.06284,
     27.79395
    ],
    [
     113.06541,
     27.74115
    ],
    [
     113.05567,
     27.69355
    ],
    [
     113.0507,
     27.67991
    ],
    [
     113.04262,
     27.66624
    ],
    [
     112.98533,
     27.58764
    ],
    [
     112.96771,
     27.55677
    ],
    [
     112.96188,
     27.54895
    ],
    [
     112.92642,
     27.51091
    ],
    [
     112.91499,
     27.49626
    ],
    [
     112.88722,
     27.43229
    ],
    [
     112.86587,
     27.39333
    ],
    [
     112.85174,
     27.36103
    ],
    [
     112.8255,
     27.31151
    ],
    [
     112.78379,
     27.2511
    ]
   ]
  },
  {
   "id": "heng-shan-xi-cha-shan-ao",
   "name": "京广高速铁路",
   "from": "heng-shan-xi",
   "to": "cha-shan-ao",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 38.2,
   "polyline": [
    [
     112.78379,
     27.2511
    ],
    [
     112.72859,
     27.17406
    ],
    [
     112.72005,
     27.15751
    ],
    [
     112.716,
     27.14434
    ],
    [
     112.71408,
     27.13285
    ],
    [
     112.71397,
     27.11797
    ],
    [
     112.72086,
     27.05803
    ],
    [
     112.7272,
     27.02069
    ],
    [
     112.72769,
     27.00676
    ],
    [
     112.72568,
     26.99372
    ],
    [
     112.70825,
     26.94046
    ],
    [
     112.70578,
     26.9286
    ]
   ]
  },
  {
   "id": "cha-shan-ao-heng-yang-dong",
   "name": "京广高速铁路",
   "from": "cha-shan-ao",
   "to": "heng-yang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 3.22,
   "polyline": [
    [
     112.70578,
     26.9286
    ],
    [
     112.70449,
     26.8997
    ]
   ]
  },
  {
   "id": "heng-yang-dong-lei-yang-xi",
   "name": "京广高速铁路",
   "from": "heng-yang-dong",
   "to": "lei-yang-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 54.87,
   "polyline": [
    [
     112.70449,
     26.8997
    ],
    [
     112.70599,
     26.86042
    ],
    [
     112.69789,
     26.81678
    ],
    [
     112.70184,
     26.71236
    ],
    [
     112.70552,
     26.69783
    ],
    [
     112.7493,
     26.57058
    ],
    [
     112.77782,
     26.45642
    ],
    [
     112.78259,
     26.4176
    ]
   ]
  },
  {
   "id": "lei-yang-xi-da-shui-dong",
   "name": "京广高速铁路",
   "from": "lei-yang-xi",
   "to": "da-shui-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 74.24,
   "polyline": [
    [
     112.78259,
     26.4176
    ],
    [
     112.78632,
     26.38923
    ],
    [
     112.8189,
     26.26489
    ],
    [
     112.83478,
     26.21916
    ],
    [
     112.84983,
     26.17
    ],
    [
     112.856,
     26.1439
    ],
    [
     112.85967,
     26.08523
    ],
    [
     112.86193,
     26.07295
    ],
    [
     112.87339,
     26.04703
    ],
    [
     112.87974,
     26.02791
    ],
    [
     112.90616,
     25.97951
    ],
    [
     112.91976,
     25.93614
    ],
    [
     112.92332,
     25.91227
    ],
    [
     112.92924,
     25.88648
    ],
    [
     112.96181,
     25.77523
    ]
   ]
  },
  {
   "id": "da-shui-dong-chen-zhou-xi",
   "name": "京广高速铁路",
   "from": "da-shui-dong",
   "to": "chen-zhou-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 4.06,
   "polyline": [
    [
     112.96181,
     25.77523
    ],
    [
     112.96368,
     25.76525
    ],
    [
     112.96453,
     25.73913
    ]
   ]
  },
  {
   "id": "chen-zhou-xi-le-chang-dong",
   "name": "京广高速铁路",
   "from": "chen-zhou-xi",
   "to": "le-chang-dong",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 84.79,
   "polyline": [
    [
     112.96453,
     25.73913
    ],
    [
     112.96331,
     25.70595
    ],
    [
     112.96685,
     25.68472
    ],
    [
     112.98073,
     25.65263
    ],
    [
     113.03641,
     25.49958
    ],
    [
     113.04512,
     25.4797
    ],
    [
     113.05644,
     25.46573
    ],
    [
     113.06884,
     25.45537
    ],
    [
     113.11069,
     25.42917
    ],
    [
     113.17478,
     25.38174
    ],
    [
     113.25638,
     25.31174
    ],
    [
     113.29687,
     25.26942
    ],
    [
     113.35833,
     25.19309
    ],
    [
     113.3793,
     25.14805
    ],
    [
     113.3907,
     25.11624
    ]
   ]
  },
  {
   "id": "le-chang-dong-shao-guan",
   "name": "京广高速铁路",
   "from": "le-chang-dong",
   "to": "shao-guan",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 44.28,
   "polyline": [
    [
     113.3907,
     25.11624
    ],
    [
     113.43738,
     25.00593
    ],
    [
     113.47191,
     24.90664
    ],
    [
     113.48403,
     24.88804
    ],
    [
     113.51727,
     24.85123
    ],
    [
     113.52436,
     24.84033
    ],
    [
     113.52863,
     24.83014
    ],
    [
     113.53208,
     24.81468
    ],
    [
     113.53019,
     24.79359
    ],
    [
     113.5252,
     24.7798
    ],
    [
     113.50896,
     24.75351
    ]
   ]
  },
  {
   "id": "shao-guan-ying-de-xi",
   "name": "京广高速铁路",
   "from": "shao-guan",
   "to": "ying-de-xi",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 71.33,
   "polyline": [
    [
     113.50896,
     24.75351
    ],
    [
     113.48974,
     24.72469
    ],
    [
     113.48453,
     24.71128
    ],
    [
     113.48157,
     24.69566
    ],
    [
     113.4819,
     24.66415
    ],
    [
     113.48337,
     24.64967
    ],
    [
     113.48808,
     24.63364
    ],
    [
     113.50232,
     24.59919
    ],
    [
     113.50589,
     24.56866
    ],
    [
     113.5033,
     24.54845
    ],
    [
     113.48988,
     24.5137
    ],
    [
     113.4857,
     24.49724
    ],
    [
     113.48334,
     24.43597
    ],
    [
     113.47837,
     24.42335
    ],
    [
     113.47088,
     24.41105
    ],
    [
     113.39784,
     24.31697
    ],
    [
     113.38904,
     24.3029
    ],
    [
     113.38289,
     24.28655
    ],
    [
     113.37512,
     24.25061
    ],
    [
     113.35936,
     24.21201
    ],
    [
     113.34489,
     24.16251
    ]
   ]
  },
  {
   "id": "ying-de-xi-qing-yuan",
   "name": "京广高速铁路",
   "from": "ying-de-xi",
   "to": "qing-yuan",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 56.64,
   "polyline": [
    [
     113.34489,
     24.16251
    ],
    [
     113.33586,
     24.13652
    ],
    [
     113.30609,
     24.07434
    ],
    [
     113.25903,
     23.99734
    ],
    [
     113.23406,
     23.91809
    ],
    [
     113.21226,
     23.86031
    ],
    [
     113.20426,
     23.84435
    ],
    [
     113.18516,
     23.81589
    ],
    [
     113.17201,
     23.78503
    ],
    [
     113.16052,
     23.76447
    ],
    [
     113.14943,
     23.7382
    ],
    [
     113.13626,
     23.71397
    ],
    [
     113.12946,
     23.69628
    ]
   ]
  },
  {
   "id": "qing-yuan-yin-zhan-ao",
   "name": "京广高速铁路",
   "from": "qing-yuan",
   "to": "yin-zhan-ao",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 14.27,
   "polyline": [
    [
     113.12946,
     23.69628
    ],
    [
     113.12112,
     23.67194
    ],
    [
     113.11942,
     23.65299
    ],
    [
     113.12234,
     23.63535
    ],
    [
     113.13325,
     23.60295
    ],
    [
     113.13745,
     23.57151
    ]
   ]
  },
  {
   "id": "yin-zhan-ao-guang-zhou-bei",
   "name": "京广高速铁路",
   "from": "yin-zhan-ao",
   "to": "guang-zhou-bei",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 22.43,
   "polyline": [
    [
     113.13745,
     23.57151
    ],
    [
     113.14025,
     23.55126
    ],
    [
     113.14412,
     23.53762
    ],
    [
     113.17408,
     23.47769
    ],
    [
     113.19087,
     23.40288
    ],
    [
     113.19843,
     23.37945
    ]
   ]
  },
  {
   "id": "guang-zhou-bei-shen-shan",
   "name": "京广高速铁路",
   "from": "guang-zhou-bei",
   "to": "shen-shan",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 6.52,
   "polyline": [
    [
     113.19843,
     23.37945
    ],
    [
     113.20461,
     23.35456
    ],
    [
     113.20393,
     23.33211
    ]
   ]
  },
  {
   "id": "shen-shan-jiang-cun",
   "name": "京广高速铁路",
   "from": "shen-shan",
   "to": "jiang-cun",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 2.81,
   "polyline": [
    [
     113.20393,
     23.33211
    ],
    [
     113.20499,
     23.31885
    ],
    [
     113.20818,
     23.30729
    ]
   ]
  },
  {
   "id": "jiang-cun-jiang-gao-zhen",
   "name": "京广高速铁路",
   "from": "jiang-cun",
   "to": "jiang-gao-zhen",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 2.6,
   "polyline": [
    [
     113.20818,
     23.30729
    ],
    [
     113.21572,
     23.28502
    ]
   ]
  },
  {
   "id": "jiang-gao-zhen-jiang-gao",
   "name": "京广高速铁路",
   "from": "jiang-gao-zhen",
   "to": "jiang-gao",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 0.58,
   "polyline": [
    [
     113.21572,
     23.28502
    ],
    [
     113.21613,
     23.2798
    ]
   ]
  },
  {
   "id": "jiang-gao-guang-zhou-nan",
   "name": "京广高速铁路",
   "from": "jiang-gao",
   "to": "guang-zhou-nan",
   "lineIds": [
    "jingguang-hsr"
   ],
   "serviceDate": "2012-12-26",
   "estLengthKm": 34.81,
   "polyline": [
    [
     113.21613,
     23.2798
    ],
    [
     113.21443,
     23.26649
    ],
    [
     113.19908,
     23.2244
    ],
    [
     113.19496,
     23.19799
    ],
    [
     113.19343,
     23.1155
    ],
    [
     113.20457,
     23.06956
    ],
    [
     113.21278,
     23.05379
    ],
    [
     113.21947,
     23.03615
    ],
    [
     113.22644,
     23.02874
    ],
    [
     113.24383,
     23.01908
    ],
    [
     113.26404,
     22.99141
    ]
   ]
  },
  {
   "id": "guang-zhou-nan-nan-sha-bei",
   "name": "广深港高速铁路",
   "from": "guang-zhou-nan",
   "to": "nan-sha-bei",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 30.93,
   "polyline": [
    [
     113.26404,
     22.99141
    ],
    [
     113.27518,
     22.97671
    ],
    [
     113.27901,
     22.96302
    ],
    [
     113.29162,
     22.94418
    ],
    [
     113.31396,
     22.89474
    ],
    [
     113.32542,
     22.88133
    ],
    [
     113.33781,
     22.87249
    ],
    [
     113.35839,
     22.86502
    ],
    [
     113.41195,
     22.85772
    ],
    [
     113.42486,
     22.8583
    ],
    [
     113.48501,
     22.8687
    ]
   ]
  },
  {
   "id": "nan-sha-bei-qing-sheng",
   "name": "广深港高速铁路",
   "from": "nan-sha-bei",
   "to": "qing-sheng",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 11.86,
   "polyline": [
    [
     113.48501,
     22.8687
    ],
    [
     113.50841,
     22.87159
    ],
    [
     113.5999,
     22.86195
    ]
   ]
  },
  {
   "id": "qing-sheng-hu-men",
   "name": "广深港高速铁路",
   "from": "qing-sheng",
   "to": "hu-men",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 7.03,
   "polyline": [
    [
     113.5999,
     22.86195
    ],
    [
     113.64388,
     22.86075
    ],
    [
     113.66829,
     22.86323
    ]
   ]
  },
  {
   "id": "hu-men-guang-ming-cheng",
   "name": "广深港高速铁路",
   "from": "hu-men",
   "to": "guang-ming-cheng",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 36.22,
   "polyline": [
    [
     113.66829,
     22.86323
    ],
    [
     113.70717,
     22.86798
    ],
    [
     113.72885,
     22.86624
    ],
    [
     113.81324,
     22.83948
    ],
    [
     113.85171,
     22.83328
    ],
    [
     113.91306,
     22.81323
    ],
    [
     113.93064,
     22.80137
    ],
    [
     113.93682,
     22.79487
    ],
    [
     113.94437,
     22.78291
    ],
    [
     113.94995,
     22.76445
    ],
    [
     113.9499,
     22.73558
    ]
   ]
  },
  {
   "id": "guang-ming-cheng-shen-zhen-bei",
   "name": "广深港高速铁路",
   "from": "guang-ming-cheng",
   "to": "shen-zhen-bei",
   "lineIds": [
    "guangshengang-hsr",
    "ganshen-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 16.43,
   "polyline": [
    [
     113.9499,
     22.73558
    ],
    [
     113.94964,
     22.70683
    ],
    [
     113.95349,
     22.69349
    ],
    [
     113.95786,
     22.68514
    ],
    [
     113.98872,
     22.6457
    ],
    [
     114.02395,
     22.61204
    ]
   ]
  },
  {
   "id": "shen-zhen-bei-fu-tian",
   "name": "广深港高速铁路",
   "from": "shen-zhen-bei",
   "to": "fu-tian",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 9.67,
   "polyline": [
    [
     114.02395,
     22.61204
    ],
    [
     114.04801,
     22.58621
    ],
    [
     114.05118,
     22.54132
    ]
   ]
  },
  {
   "id": "fu-tian-xiang-gang-xi-jiu-long",
   "name": "广深港高速铁路",
   "from": "fu-tian",
   "to": "xiang-gang-xi-jiu-long",
   "lineIds": [
    "guangshengang-hsr"
   ],
   "serviceDate": "2011-12-26",
   "estLengthKm": 30.15,
   "polyline": [
    [
     114.05118,
     22.54132
    ],
    [
     114.05107,
     22.5137
    ],
    [
     114.05635,
     22.49411
    ],
    [
     114.06501,
     22.4733
    ],
    [
     114.07581,
     22.45448
    ],
    [
     114.09437,
     22.42884
    ],
    [
     114.12672,
     22.39271
    ],
    [
     114.12971,
     22.38622
    ],
    [
     114.14249,
     22.33909
    ],
    [
     114.1458,
     22.3339
    ],
    [
     114.16154,
     22.32058
    ],
    [
     114.16376,
     22.31635
    ],
    [
     114.16368,
     22.31111
    ],
    [
     114.1663,
     22.3017
    ]
   ]
  },
  {
   "id": "njnj-quanjiao",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "nanjing-south",
   "to": "quanjiao",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 57.13,
   "polyline": [
    [
     118.81,
     31.97
    ],
    [
     118.79083,
     31.96958
    ],
    [
     118.77373,
     31.96255
    ],
    [
     118.7577,
     31.95248
    ],
    [
     118.73712,
     31.93452
    ],
    [
     118.7242,
     31.92757
    ],
    [
     118.70762,
     31.92293
    ],
    [
     118.69091,
     31.92349
    ],
    [
     118.6777,
     31.92663
    ],
    [
     118.66492,
     31.93273
    ],
    [
     118.61032,
     31.97666
    ],
    [
     118.59498,
     31.98651
    ],
    [
     118.50214,
     32.03001
    ],
    [
     118.46508,
     32.04283
    ],
    [
     118.42574,
     32.06595
    ],
    [
     118.41552,
     32.0704
    ],
    [
     118.39768,
     32.07288
    ],
    [
     118.31217,
     32.0681
    ],
    [
     118.2774,
     32.0623
    ]
   ]
  },
  {
   "id": "quanjiao-feidong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "quanjiao",
   "to": "feidong",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 81.57,
   "polyline": [
    [
     118.2774,
     32.0623
    ],
    [
     118.16969,
     32.03889
    ],
    [
     118.10353,
     32.03173
    ],
    [
     118.07895,
     32.02329
    ],
    [
     118.02931,
     32.00938
    ],
    [
     117.95348,
     32.00736
    ],
    [
     117.91158,
     31.99465
    ],
    [
     117.86831,
     31.98961
    ],
    [
     117.81828,
     31.97517
    ],
    [
     117.7665,
     31.96689
    ],
    [
     117.73882,
     31.96459
    ],
    [
     117.72754,
     31.96057
    ],
    [
     117.70492,
     31.94828
    ],
    [
     117.66084,
     31.93429
    ],
    [
     117.56443,
     31.89655
    ],
    [
     117.53867,
     31.88837
    ],
    [
     117.48378,
     31.86514
    ],
    [
     117.4804,
     31.8614
    ]
   ]
  },
  {
   "id": "feidong-hefei-south",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "feidong",
   "to": "hefei-south",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 21.12,
   "polyline": [
    [
     117.4804,
     31.8614
    ],
    [
     117.4738,
     31.86098
    ],
    [
     117.45782,
     31.85434
    ],
    [
     117.45009,
     31.84954
    ],
    [
     117.44258,
     31.84178
    ],
    [
     117.42744,
     31.81688
    ],
    [
     117.41956,
     31.81025
    ],
    [
     117.41059,
     31.80616
    ],
    [
     117.39544,
     31.80427
    ],
    [
     117.36289,
     31.80936
    ],
    [
     117.35151,
     31.80976
    ],
    [
     117.31483,
     31.80236
    ],
    [
     117.29123,
     31.80108
    ],
    [
     117.29,
     31.8
    ]
   ]
  },
  {
   "id": "hefei-south-changanji",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "hefei-south",
   "to": "changanji",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 15.84,
   "polyline": [
    [
     117.29,
     31.8
    ],
    [
     117.28851,
     31.80089
    ],
    [
     117.26479,
     31.79941
    ],
    [
     117.21441,
     31.79092
    ],
    [
     117.1241,
     31.7891
    ]
   ]
  },
  {
   "id": "changanji-leimadian",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "changanji",
   "to": "leimadian",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 9.07,
   "polyline": [
    [
     117.1241,
     31.7891
    ],
    [
     117.07841,
     31.78714
    ],
    [
     117.0316,
     31.7729
    ]
   ]
  },
  {
   "id": "leimadian-luan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "leimadian",
   "to": "luan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 51.59,
   "polyline": [
    [
     117.0316,
     31.7729
    ],
    [
     116.98771,
     31.77087
    ],
    [
     116.95118,
     31.76484
    ],
    [
     116.92906,
     31.76269
    ],
    [
     116.85015,
     31.75793
    ],
    [
     116.77889,
     31.74801
    ],
    [
     116.75266,
     31.74774
    ],
    [
     116.70283,
     31.75176
    ],
    [
     116.55696,
     31.74501
    ],
    [
     116.53628,
     31.73929
    ],
    [
     116.51128,
     31.72435
    ],
    [
     116.49729,
     31.71769
    ]
   ]
  },
  {
   "id": "luan-jinzhai",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "luan",
   "to": "jinzhai",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 51.76,
   "polyline": [
    [
     116.49729,
     31.71769
    ],
    [
     116.45852,
     31.69964
    ],
    [
     116.43789,
     31.69336
    ],
    [
     116.31621,
     31.68457
    ],
    [
     116.2653,
     31.67824
    ],
    [
     116.23607,
     31.67253
    ],
    [
     116.20293,
     31.6693
    ],
    [
     116.16692,
     31.65858
    ],
    [
     116.15408,
     31.65619
    ],
    [
     116.13775,
     31.65691
    ],
    [
     116.10847,
     31.66413
    ],
    [
     116.08797,
     31.66409
    ],
    [
     116.07552,
     31.66078
    ],
    [
     116.05685,
     31.65323
    ],
    [
     115.9702,
     31.628
    ]
   ]
  },
  {
   "id": "jinzhai-macheng-north",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "jinzhai",
   "to": "macheng-north",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 109.16,
   "polyline": [
    [
     115.9702,
     31.628
    ],
    [
     115.94179,
     31.61712
    ],
    [
     115.85906,
     31.56666
    ],
    [
     115.82521,
     31.53791
    ],
    [
     115.79556,
     31.50405
    ],
    [
     115.78158,
     31.49309
    ],
    [
     115.75883,
     31.48139
    ],
    [
     115.70254,
     31.4449
    ],
    [
     115.62132,
     31.40339
    ],
    [
     115.56361,
     31.37833
    ],
    [
     115.5381,
     31.35593
    ],
    [
     115.49328,
     31.32716
    ],
    [
     115.4736,
     31.31151
    ],
    [
     115.46039,
     31.30422
    ],
    [
     115.44646,
     31.29945
    ],
    [
     115.43556,
     31.29739
    ],
    [
     115.28756,
     31.28441
    ],
    [
     115.26615,
     31.27997
    ],
    [
     115.23751,
     31.27833
    ],
    [
     115.18185,
     31.26649
    ],
    [
     115.13384,
     31.25895
    ],
    [
     115.11971,
     31.25442
    ],
    [
     115.07897,
     31.23505
    ],
    [
     115.02562,
     31.20419
    ],
    [
     114.9793,
     31.1893
    ]
   ]
  },
  {
   "id": "macheng-north-honganxi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "macheng-north",
   "to": "honganxi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 41.15,
   "polyline": [
    [
     114.9793,
     31.1893
    ],
    [
     114.94258,
     31.17852
    ],
    [
     114.93118,
     31.17367
    ],
    [
     114.87446,
     31.14311
    ],
    [
     114.84235,
     31.12374
    ],
    [
     114.81997,
     31.10828
    ],
    [
     114.7221,
     31.05595
    ],
    [
     114.65056,
     31.02211
    ],
    [
     114.6264,
     31.0062
    ]
   ]
  },
  {
   "id": "honganxi-hengdian-east",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "honganxi",
   "to": "hengdian-east",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 44.53,
   "polyline": [
    [
     114.6264,
     31.0062
    ],
    [
     114.60694,
     30.99348
    ],
    [
     114.581,
     30.98492
    ],
    [
     114.50636,
     30.95014
    ],
    [
     114.45847,
     30.93655
    ],
    [
     114.42073,
     30.91953
    ],
    [
     114.40251,
     30.91553
    ],
    [
     114.34971,
     30.91084
    ],
    [
     114.33743,
     30.90709
    ],
    [
     114.32733,
     30.90167
    ],
    [
     114.31093,
     30.88784
    ],
    [
     114.30435,
     30.8803
    ],
    [
     114.29972,
     30.87067
    ],
    [
     114.29808,
     30.8597
    ],
    [
     114.30185,
     30.84418
    ],
    [
     114.31533,
     30.82577
    ],
    [
     114.3283,
     30.8009
    ]
   ]
  },
  {
   "id": "hengdian-east-hankou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "hengdian-east",
   "to": "hankou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 26.2,
   "polyline": [
    [
     114.3283,
     30.8009
    ],
    [
     114.34842,
     30.76267
    ],
    [
     114.35105,
     30.75358
    ],
    [
     114.34968,
     30.74151
    ],
    [
     114.33979,
     30.72382
    ],
    [
     114.33771,
     30.71565
    ],
    [
     114.33825,
     30.70677
    ],
    [
     114.34563,
     30.68102
    ],
    [
     114.34484,
     30.67255
    ],
    [
     114.34146,
     30.66259
    ],
    [
     114.33268,
     30.64722
    ],
    [
     114.32533,
     30.64121
    ],
    [
     114.29703,
     30.63243
    ],
    [
     114.25934,
     30.62403
    ],
    [
     114.26,
     30.62
    ]
   ]
  },
  {
   "id": "hankou-xin-dun",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "hankou",
   "to": "xin-dun",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 7.01,
   "polyline": [
    [
     114.26,
     30.62
    ],
    [
     114.2582,
     30.6237
    ],
    [
     114.24125,
     30.61883
    ],
    [
     114.22292,
     30.61055
    ],
    [
     114.20759,
     30.61894
    ],
    [
     114.19617,
     30.61975
    ]
   ]
  },
  {
   "id": "xin-dun-duo-luo-kou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "xin-dun",
   "to": "duo-luo-kou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 7.72,
   "polyline": [
    [
     114.19617,
     30.61975
    ],
    [
     114.17004,
     30.61917
    ],
    [
     114.15466,
     30.61162
    ],
    [
     114.11866,
     30.60525
    ]
   ]
  },
  {
   "id": "duo-luo-kou-wu-jia-shan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "duo-luo-kou",
   "to": "wu-jia-shan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 4.99,
   "polyline": [
    [
     114.11866,
     30.60525
    ],
    [
     114.10717,
     30.60413
    ],
    [
     114.09437,
     30.60501
    ],
    [
     114.06835,
     30.61305
    ]
   ]
  },
  {
   "id": "wu-jia-shan-han-chuan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "wu-jia-shan",
   "to": "han-chuan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 27.81,
   "polyline": [
    [
     114.06835,
     30.61305
    ],
    [
     114.02291,
     30.63079
    ],
    [
     114.01418,
     30.63184
    ],
    [
     114.00389,
     30.63033
    ],
    [
     113.97241,
     30.61327
    ],
    [
     113.93345,
     30.59897
    ],
    [
     113.83496,
     30.55472
    ],
    [
     113.80725,
     30.5442
    ]
   ]
  },
  {
   "id": "han-chuan-da-fu",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "han-chuan",
   "to": "da-fu",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 26.81,
   "polyline": [
    [
     113.80725,
     30.5442
    ],
    [
     113.68107,
     30.49425
    ],
    [
     113.63864,
     30.47906
    ],
    [
     113.56999,
     30.44662
    ]
   ]
  },
  {
   "id": "da-fu-tian-men-nan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "da-fu",
   "to": "tian-men-nan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 11.7,
   "polyline": [
    [
     113.56999,
     30.44662
    ],
    [
     113.54926,
     30.4399
    ],
    [
     113.49842,
     30.437
    ],
    [
     113.45035,
     30.43038
    ]
   ]
  },
  {
   "id": "tian-men-nan-xian-tao-xi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "tian-men-nan",
   "to": "xian-tao-xi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 31.1,
   "polyline": [
    [
     113.45035,
     30.43038
    ],
    [
     113.41709,
     30.42652
    ],
    [
     113.40421,
     30.42649
    ],
    [
     113.35328,
     30.43561
    ],
    [
     113.268,
     30.44392
    ],
    [
     113.22602,
     30.44216
    ],
    [
     113.16401,
     30.42918
    ],
    [
     113.13905,
     30.42765
    ]
   ]
  },
  {
   "id": "xian-tao-xi-qian-jiang",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "xian-tao-xi",
   "to": "qian-jiang",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 20.54,
   "polyline": [
    [
     113.13905,
     30.42765
    ],
    [
     113.06255,
     30.42879
    ],
    [
     113.04398,
     30.42743
    ],
    [
     113.02499,
     30.42212
    ],
    [
     112.9721,
     30.398
    ],
    [
     112.93368,
     30.39206
    ]
   ]
  },
  {
   "id": "qian-jiang-jing-zhou-bei",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "qian-jiang",
   "to": "jing-zhou-bei",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 68.95,
   "polyline": [
    [
     112.93368,
     30.39206
    ],
    [
     112.88485,
     30.38531
    ],
    [
     112.81397,
     30.38668
    ],
    [
     112.74108,
     30.38085
    ],
    [
     112.66415,
     30.36752
    ],
    [
     112.51821,
     30.37377
    ],
    [
     112.33674,
     30.36911
    ],
    [
     112.23228,
     30.3725
    ]
   ]
  },
  {
   "id": "jing-zhou-bei-jing-zhou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "jing-zhou-bei",
   "to": "jing-zhou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 3.9,
   "polyline": [
    [
     112.23228,
     30.3725
    ],
    [
     112.1996,
     30.37357
    ],
    [
     112.20744,
     30.37257
    ]
   ]
  },
  {
   "id": "jing-zhou-zhi-jiang-bei",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "jing-zhou",
   "to": "zhi-jiang-bei",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 44.86,
   "polyline": [
    [
     112.20744,
     30.37257
    ],
    [
     112.16211,
     30.376
    ],
    [
     112.12084,
     30.388
    ],
    [
     112.02451,
     30.40906
    ],
    [
     111.99111,
     30.41807
    ],
    [
     111.94859,
     30.42373
    ],
    [
     111.93242,
     30.42901
    ],
    [
     111.87334,
     30.45567
    ],
    [
     111.83986,
     30.46684
    ],
    [
     111.76662,
     30.47962
    ]
   ]
  },
  {
   "id": "zhi-jiang-bei-yi-chang-dong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "zhi-jiang-bei",
   "to": "yi-chang-dong",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 44.77,
   "polyline": [
    [
     111.76662,
     30.47962
    ],
    [
     111.65878,
     30.49797
    ],
    [
     111.64133,
     30.50351
    ],
    [
     111.62612,
     30.5126
    ],
    [
     111.59371,
     30.54108
    ],
    [
     111.54619,
     30.56878
    ],
    [
     111.50436,
     30.58767
    ],
    [
     111.47593,
     30.59523
    ],
    [
     111.46133,
     30.60245
    ],
    [
     111.45182,
     30.61078
    ],
    [
     111.4357,
     30.63136
    ],
    [
     111.42688,
     30.63802
    ],
    [
     111.38398,
     30.6558
    ],
    [
     111.36488,
     30.66041
    ]
   ]
  },
  {
   "id": "yi-chang-dong-yi-chang-nan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "yi-chang-dong",
   "to": "yi-chang-nan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 16.03,
   "polyline": [
    [
     111.36488,
     30.66041
    ],
    [
     111.35314,
     30.66424
    ],
    [
     111.34435,
     30.66461
    ],
    [
     111.33353,
     30.66145
    ],
    [
     111.31187,
     30.64647
    ],
    [
     111.30296,
     30.6443
    ],
    [
     111.29599,
     30.64447
    ],
    [
     111.25076,
     30.65849
    ],
    [
     111.23202,
     30.66891
    ],
    [
     111.21933,
     30.68212
    ]
   ]
  },
  {
   "id": "yi-chang-nan-che-xi-yu-liu",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "yi-chang-nan",
   "to": "che-xi-yu-liu",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 21.56,
   "polyline": [
    [
     111.21933,
     30.68212
    ],
    [
     111.19623,
     30.7051
    ],
    [
     111.18269,
     30.70936
    ],
    [
     111.17389,
     30.70856
    ],
    [
     111.15006,
     30.70121
    ],
    [
     111.13298,
     30.70251
    ],
    [
     111.12519,
     30.70167
    ],
    [
     111.11906,
     30.69952
    ],
    [
     111.10426,
     30.69071
    ],
    [
     111.09811,
     30.68907
    ],
    [
     111.06967,
     30.6922
    ],
    [
     111.04036,
     30.68885
    ],
    [
     111.02331,
     30.68927
    ],
    [
     111.01443,
     30.69104
    ]
   ]
  },
  {
   "id": "che-xi-yu-liu-zhang-yang",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "che-xi-yu-liu",
   "to": "zhang-yang",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 23.17,
   "polyline": [
    [
     111.01443,
     30.69104
    ],
    [
     111.00649,
     30.69118
    ],
    [
     111.0009,
     30.6896
    ],
    [
     110.94564,
     30.66652
    ],
    [
     110.93735,
     30.66101
    ],
    [
     110.93395,
     30.65606
    ],
    [
     110.93376,
     30.65234
    ],
    [
     110.94141,
     30.63391
    ],
    [
     110.94135,
     30.62364
    ],
    [
     110.93562,
     30.61511
    ],
    [
     110.92258,
     30.60832
    ],
    [
     110.91418,
     30.60635
    ],
    [
     110.90686,
     30.60727
    ],
    [
     110.88324,
     30.62046
    ],
    [
     110.8769,
     30.62255
    ],
    [
     110.84484,
     30.62257
    ]
   ]
  },
  {
   "id": "zhang-yang-ye-san-guan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "zhang-yang",
   "to": "ye-san-guan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 50.12,
   "polyline": [
    [
     110.84484,
     30.62257
    ],
    [
     110.82478,
     30.62236
    ],
    [
     110.8064,
     30.61281
    ],
    [
     110.79908,
     30.61088
    ],
    [
     110.78866,
     30.61061
    ],
    [
     110.77279,
     30.61329
    ],
    [
     110.75441,
     30.62338
    ],
    [
     110.7467,
     30.62612
    ],
    [
     110.6763,
     30.6316
    ],
    [
     110.65074,
     30.6245
    ],
    [
     110.63246,
     30.62545
    ],
    [
     110.60478,
     30.62246
    ],
    [
     110.57634,
     30.62462
    ],
    [
     110.5104,
     30.60932
    ],
    [
     110.47581,
     30.6087
    ],
    [
     110.46225,
     30.61156
    ],
    [
     110.44518,
     30.61848
    ],
    [
     110.40501,
     30.64595
    ],
    [
     110.37945,
     30.67024
    ],
    [
     110.36953,
     30.67242
    ],
    [
     110.36175,
     30.66966
    ]
   ]
  },
  {
   "id": "ye-san-guan-ba-dong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "ye-san-guan",
   "to": "ba-dong",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 0.81,
   "polyline": [
    [
     110.36175,
     30.66966
    ],
    [
     110.36953,
     30.67242
    ]
   ]
  },
  {
   "id": "ba-dong-gao-ping",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "ba-dong",
   "to": "gao-ping",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 28.57,
   "polyline": [
    [
     110.36953,
     30.67242
    ],
    [
     110.35393,
     30.66519
    ],
    [
     110.34204,
     30.65557
    ],
    [
     110.33224,
     30.65316
    ],
    [
     110.20276,
     30.66999
    ],
    [
     110.10796,
     30.67797
    ],
    [
     110.09744,
     30.67611
    ],
    [
     110.08465,
     30.66677
    ]
   ]
  },
  {
   "id": "gao-ping-luo-shui-dong-yu-liu",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "gao-ping",
   "to": "luo-shui-dong-yu-liu",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 16.7,
   "polyline": [
    [
     110.08465,
     30.66677
    ],
    [
     110.07175,
     30.64831
    ],
    [
     110.02864,
     30.61736
    ],
    [
     109.99293,
     30.59948
    ],
    [
     109.97538,
     30.59442
    ],
    [
     109.94617,
     30.5812
    ]
   ]
  },
  {
   "id": "luo-shui-dong-yu-liu-jian-shi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "luo-shui-dong-yu-liu",
   "to": "jian-shi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 23.31,
   "polyline": [
    [
     109.94617,
     30.5812
    ],
    [
     109.93081,
     30.57467
    ],
    [
     109.89065,
     30.5709
    ],
    [
     109.86925,
     30.56197
    ],
    [
     109.85539,
     30.55858
    ],
    [
     109.82809,
     30.56095
    ],
    [
     109.80669,
     30.55626
    ],
    [
     109.77582,
     30.55717
    ],
    [
     109.7694,
     30.5585
    ],
    [
     109.74611,
     30.56978
    ],
    [
     109.72345,
     30.56982
    ]
   ]
  },
  {
   "id": "jian-shi-bai-yang-ping-yu-liu",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "jian-shi",
   "to": "bai-yang-ping-yu-liu",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 14.52,
   "polyline": [
    [
     109.72345,
     30.56982
    ],
    [
     109.70961,
     30.56798
    ],
    [
     109.70206,
     30.56501
    ],
    [
     109.69092,
     30.5583
    ],
    [
     109.67406,
     30.54417
    ],
    [
     109.66943,
     30.53851
    ],
    [
     109.64531,
     30.49735
    ],
    [
     109.63931,
     30.49103
    ],
    [
     109.62285,
     30.48051
    ]
   ]
  },
  {
   "id": "bai-yang-ping-yu-liu-en-shi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "bai-yang-ping-yu-liu",
   "to": "en-shi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 20.81,
   "polyline": [
    [
     109.62285,
     30.48051
    ],
    [
     109.61119,
     30.47278
    ],
    [
     109.60676,
     30.46767
    ],
    [
     109.60414,
     30.4615
    ],
    [
     109.60186,
     30.44406
    ],
    [
     109.59601,
     30.43569
    ],
    [
     109.54156,
     30.40649
    ],
    [
     109.52622,
     30.39963
    ],
    [
     109.52243,
     30.39638
    ],
    [
     109.4992,
     30.36533
    ],
    [
     109.47988,
     30.35128
    ]
   ]
  },
  {
   "id": "en-shi-bai-guo",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "en-shi",
   "to": "bai-guo",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 24.3,
   "polyline": [
    [
     109.47988,
     30.35128
    ],
    [
     109.45566,
     30.33553
    ],
    [
     109.44086,
     30.31696
    ],
    [
     109.42841,
     30.29728
    ],
    [
     109.41679,
     30.287
    ],
    [
     109.41402,
     30.28212
    ],
    [
     109.40636,
     30.25804
    ],
    [
     109.40179,
     30.25172
    ],
    [
     109.39618,
     30.24836
    ],
    [
     109.37406,
     30.24074
    ],
    [
     109.35643,
     30.22488
    ],
    [
     109.34731,
     30.21912
    ],
    [
     109.33623,
     30.21725
    ],
    [
     109.31984,
     30.21953
    ]
   ]
  },
  {
   "id": "bai-guo-li-chuan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "bai-guo",
   "to": "li-chuan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 39.34,
   "polyline": [
    [
     109.31984,
     30.21953
    ],
    [
     109.22195,
     30.23143
    ],
    [
     109.14128,
     30.26561
    ],
    [
     109.10729,
     30.27582
    ],
    [
     109.08036,
     30.27432
    ],
    [
     108.98926,
     30.27693
    ],
    [
     108.95543,
     30.28075
    ],
    [
     108.9297,
     30.28052
    ],
    [
     108.93597,
     30.28118
    ]
   ]
  },
  {
   "id": "li-chuan-liang-wu",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "li-chuan",
   "to": "liang-wu",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 12.07,
   "polyline": [
    [
     108.93597,
     30.28118
    ],
    [
     108.86624,
     30.27954
    ],
    [
     108.81401,
     30.263
    ]
   ]
  },
  {
   "id": "liang-wu-huang-shui",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "liang-wu",
   "to": "huang-shui",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 39.78,
   "polyline": [
    [
     108.81401,
     30.263
    ],
    [
     108.79366,
     30.25858
    ],
    [
     108.772,
     30.25903
    ],
    [
     108.76146,
     30.25726
    ],
    [
     108.75154,
     30.25271
    ],
    [
     108.73364,
     30.23949
    ],
    [
     108.7209,
     30.23535
    ],
    [
     108.71001,
     30.23516
    ],
    [
     108.68618,
     30.23909
    ],
    [
     108.67009,
     30.23741
    ],
    [
     108.66228,
     30.23411
    ],
    [
     108.61903,
     30.20666
    ],
    [
     108.60917,
     30.20189
    ],
    [
     108.555,
     30.19083
    ],
    [
     108.54412,
     30.18699
    ],
    [
     108.53357,
     30.17914
    ],
    [
     108.52708,
     30.16958
    ],
    [
     108.51574,
     30.12546
    ],
    [
     108.5125,
     30.1176
    ],
    [
     108.50675,
     30.11018
    ],
    [
     108.49283,
     30.09812
    ]
   ]
  },
  {
   "id": "huang-shui-shi-zhu-xian",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "huang-shui",
   "to": "shi-zhu-xian",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 42.49,
   "polyline": [
    [
     108.49283,
     30.09812
    ],
    [
     108.47585,
     30.08197
    ],
    [
     108.45856,
     30.06925
    ],
    [
     108.43026,
     30.04981
    ],
    [
     108.40798,
     30.0393
    ],
    [
     108.38926,
     30.03464
    ],
    [
     108.29768,
     30.02498
    ],
    [
     108.15124,
     29.9898
    ],
    [
     108.12098,
     29.98792
    ],
    [
     108.10733,
     29.98157
    ],
    [
     108.0932,
     29.96742
    ]
   ]
  },
  {
   "id": "shi-zhu-xian-feng-dou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "shi-zhu-xian",
   "to": "feng-dou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 48.81,
   "polyline": [
    [
     108.0932,
     29.96742
    ],
    [
     108.08035,
     29.95231
    ],
    [
     108.06825,
     29.93346
    ],
    [
     108.0606,
     29.92639
    ],
    [
     108.05113,
     29.92062
    ],
    [
     108.03143,
     29.91403
    ],
    [
     107.91243,
     29.84949
    ],
    [
     107.89677,
     29.83643
    ],
    [
     107.88046,
     29.81148
    ],
    [
     107.87404,
     29.80523
    ],
    [
     107.85991,
     29.79947
    ],
    [
     107.84269,
     29.79867
    ],
    [
     107.83077,
     29.80222
    ],
    [
     107.81745,
     29.8087
    ],
    [
     107.78357,
     29.83043
    ],
    [
     107.75668,
     29.84014
    ],
    [
     107.73657,
     29.85107
    ],
    [
     107.72393,
     29.853
    ],
    [
     107.7091,
     29.85315
    ],
    [
     107.68342,
     29.84706
    ]
   ]
  },
  {
   "id": "feng-dou-fu-ling-bei",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "feng-dou",
   "to": "fu-ling-bei",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 42.95,
   "polyline": [
    [
     107.68342,
     29.84706
    ],
    [
     107.57761,
     29.8153
    ],
    [
     107.46723,
     29.76379
    ],
    [
     107.45528,
     29.76
    ],
    [
     107.44427,
     29.75916
    ],
    [
     107.4341,
     29.76045
    ],
    [
     107.40528,
     29.77244
    ],
    [
     107.3931,
     29.77489
    ],
    [
     107.37725,
     29.77372
    ],
    [
     107.35157,
     29.76462
    ],
    [
     107.34002,
     29.76309
    ],
    [
     107.30458,
     29.76565
    ],
    [
     107.27312,
     29.77309
    ]
   ]
  },
  {
   "id": "fu-ling-bei-chang-shou-bei",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "fu-ling-bei",
   "to": "chang-shou-bei",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 23.88,
   "polyline": [
    [
     107.27312,
     29.77309
    ],
    [
     107.23193,
     29.78559
    ],
    [
     107.1788,
     29.81201
    ],
    [
     107.14818,
     29.83304
    ],
    [
     107.11858,
     29.86742
    ],
    [
     107.10759,
     29.87603
    ],
    [
     107.09197,
     29.88164
    ],
    [
     107.07008,
     29.88323
    ]
   ]
  },
  {
   "id": "chang-shou-bei-yan-jia",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "chang-shou-bei",
   "to": "yan-jia",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 14.28,
   "polyline": [
    [
     107.07008,
     29.88323
    ],
    [
     107.04945,
     29.88524
    ],
    [
     107.03795,
     29.88459
    ],
    [
     106.99908,
     29.87197
    ],
    [
     106.98708,
     29.86452
    ],
    [
     106.97932,
     29.85743
    ],
    [
     106.96148,
     29.82992
    ]
   ]
  },
  {
   "id": "yan-jia-luo-qi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "yan-jia",
   "to": "luo-qi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 12.16,
   "polyline": [
    [
     106.96148,
     29.82992
    ],
    [
     106.94452,
     29.80564
    ],
    [
     106.93648,
     29.78294
    ],
    [
     106.92341,
     29.7567
    ],
    [
     106.91255,
     29.72997
    ]
   ]
  },
  {
   "id": "luo-qi-fu-sheng",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "luo-qi",
   "to": "fu-sheng",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 14.59,
   "polyline": [
    [
     106.91255,
     29.72997
    ],
    [
     106.892,
     29.69853
    ],
    [
     106.87788,
     29.68498
    ],
    [
     106.85775,
     29.67564
    ],
    [
     106.79632,
     29.65666
    ]
   ]
  },
  {
   "id": "fu-sheng-shuang-xi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "fu-sheng",
   "to": "shuang-xi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 5.76,
   "polyline": [
    [
     106.79632,
     29.65666
    ],
    [
     106.77569,
     29.65191
    ],
    [
     106.7534,
     29.65351
    ],
    [
     106.73776,
     29.65263
    ]
   ]
  },
  {
   "id": "shuang-xi-chong-qing-bei",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "shuang-xi",
   "to": "chong-qing-bei",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 19.88,
   "polyline": [
    [
     106.73776,
     29.65263
    ],
    [
     106.72284,
     29.65131
    ],
    [
     106.67494,
     29.64231
    ],
    [
     106.66549,
     29.64235
    ],
    [
     106.64245,
     29.64564
    ],
    [
     106.62851,
     29.64474
    ],
    [
     106.60093,
     29.63809
    ],
    [
     106.58267,
     29.6319
    ],
    [
     106.55973,
     29.61214
    ],
    [
     106.54727,
     29.61232
    ]
   ]
  },
  {
   "id": "chong-qing-bei-jing-kou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "chong-qing-bei",
   "to": "jing-kou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 10.43,
   "polyline": [
    [
     106.54727,
     29.61232
    ],
    [
     106.53058,
     29.61466
    ],
    [
     106.51511,
     29.62517
    ],
    [
     106.49963,
     29.63219
    ],
    [
     106.4765,
     29.6476
    ],
    [
     106.454,
     29.65591
    ]
   ]
  },
  {
   "id": "jing-kou-san-xi-kou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "jing-kou",
   "to": "san-xi-kou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 9.95,
   "polyline": [
    [
     106.454,
     29.65591
    ],
    [
     106.43699,
     29.6664
    ],
    [
     106.43359,
     29.67097
    ],
    [
     106.43056,
     29.67971
    ],
    [
     106.43113,
     29.68828
    ],
    [
     106.44042,
     29.71024
    ],
    [
     106.44683,
     29.73398
    ]
   ]
  },
  {
   "id": "san-xi-kou-shi-zi-shan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "san-xi-kou",
   "to": "shi-zi-shan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 14.94,
   "polyline": [
    [
     106.44683,
     29.73398
    ],
    [
     106.45253,
     29.76847
    ],
    [
     106.45169,
     29.80663
    ],
    [
     106.45843,
     29.82622
    ],
    [
     106.45954,
     29.8353
    ],
    [
     106.45547,
     29.84977
    ],
    [
     106.44906,
     29.85837
    ],
    [
     106.44398,
     29.86252
    ]
   ]
  },
  {
   "id": "shi-zi-shan-he-chuan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "shi-zi-shan",
   "to": "he-chuan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 20.36,
   "polyline": [
    [
     106.44398,
     29.86252
    ],
    [
     106.43463,
     29.86746
    ],
    [
     106.41064,
     29.87537
    ],
    [
     106.40271,
     29.87995
    ],
    [
     106.38177,
     29.90053
    ],
    [
     106.37008,
     29.91824
    ],
    [
     106.35731,
     29.92843
    ],
    [
     106.32712,
     29.94225
    ],
    [
     106.29042,
     29.9524
    ],
    [
     106.27457,
     29.96157
    ]
   ]
  },
  {
   "id": "he-chuan-wei-tuo",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "he-chuan",
   "to": "wei-tuo",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 12.83,
   "polyline": [
    [
     106.27457,
     29.96157
    ],
    [
     106.25286,
     29.97559
    ],
    [
     106.23202,
     29.98478
    ],
    [
     106.20388,
     30.00277
    ],
    [
     106.18922,
     30.01513
    ],
    [
     106.17704,
     30.02878
    ]
   ]
  },
  {
   "id": "wei-tuo-xia-tai-he",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "wei-tuo",
   "to": "xia-tai-he",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 15.59,
   "polyline": [
    [
     106.17704,
     30.02878
    ],
    [
     106.1672,
     30.04194
    ],
    [
     106.16164,
     30.04677
    ],
    [
     106.14104,
     30.05362
    ],
    [
     106.12962,
     30.06242
    ],
    [
     106.10283,
     30.07713
    ],
    [
     106.08623,
     30.08183
    ],
    [
     106.07076,
     30.08991
    ],
    [
     106.05134,
     30.11046
    ]
   ]
  },
  {
   "id": "xia-tai-he-tong-nan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "xia-tai-he",
   "to": "tong-nan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 21.94,
   "polyline": [
    [
     106.05134,
     30.11046
    ],
    [
     106.04312,
     30.11881
    ],
    [
     106.03446,
     30.13377
    ],
    [
     106.01905,
     30.14817
    ],
    [
     105.99999,
     30.16224
    ],
    [
     105.98328,
     30.17949
    ],
    [
     105.9768,
     30.18325
    ],
    [
     105.957,
     30.19065
    ],
    [
     105.92503,
     30.19964
    ],
    [
     105.90709,
     30.20817
    ],
    [
     105.89177,
     30.21358
    ],
    [
     105.87365,
     30.22317
    ]
   ]
  },
  {
   "id": "tong-nan-san-xing",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "tong-nan",
   "to": "san-xing",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 22.03,
   "polyline": [
    [
     105.87365,
     30.22317
    ],
    [
     105.86034,
     30.23244
    ],
    [
     105.84633,
     30.25619
    ],
    [
     105.82191,
     30.28216
    ],
    [
     105.81336,
     30.29425
    ],
    [
     105.79254,
     30.30965
    ],
    [
     105.77654,
     30.33169
    ],
    [
     105.77158,
     30.33518
    ],
    [
     105.75587,
     30.34121
    ],
    [
     105.73714,
     30.35576
    ],
    [
     105.71855,
     30.36014
    ]
   ]
  },
  {
   "id": "san-xing-sui-ning-nan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "san-xing",
   "to": "sui-ning-nan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 20.06,
   "polyline": [
    [
     105.71855,
     30.36014
    ],
    [
     105.70264,
     30.36568
    ],
    [
     105.69069,
     30.37596
    ],
    [
     105.6785,
     30.38304
    ],
    [
     105.66786,
     30.39327
    ],
    [
     105.61689,
     30.42309
    ],
    [
     105.60911,
     30.43073
    ],
    [
     105.60046,
     30.443
    ],
    [
     105.58717,
     30.45398
    ],
    [
     105.58032,
     30.46723
    ],
    [
     105.5687,
     30.47939
    ]
   ]
  },
  {
   "id": "sui-ning-nan-sui-ning",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "sui-ning-nan",
   "to": "sui-ning",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 8.96,
   "polyline": [
    [
     105.5687,
     30.47939
    ],
    [
     105.54859,
     30.51049
    ],
    [
     105.54066,
     30.51712
    ],
    [
     105.52967,
     30.52259
    ],
    [
     105.53903,
     30.5456
    ]
   ]
  },
  {
   "id": "sui-ning-sui-ning-xi",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "sui-ning",
   "to": "sui-ning-xi",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 11.13,
   "polyline": [
    [
     105.53903,
     30.5456
    ],
    [
     105.52502,
     30.524
    ],
    [
     105.50037,
     30.52869
    ],
    [
     105.4444,
     30.55131
    ]
   ]
  },
  {
   "id": "sui-ning-xi-xing-guang",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "sui-ning-xi",
   "to": "xing-guang",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 9.35,
   "polyline": [
    [
     105.4444,
     30.55131
    ],
    [
     105.42925,
     30.55857
    ],
    [
     105.41716,
     30.56183
    ],
    [
     105.37481,
     30.5702
    ],
    [
     105.35093,
     30.57155
    ]
   ]
  },
  {
   "id": "xing-guang-da-ying-dong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "xing-guang",
   "to": "da-ying-dong",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 7.59,
   "polyline": [
    [
     105.35093,
     30.57155
    ],
    [
     105.33624,
     30.57172
    ],
    [
     105.29834,
     30.56825
    ],
    [
     105.2725,
     30.57053
    ]
   ]
  },
  {
   "id": "da-ying-dong-da-ying",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "da-ying-dong",
   "to": "da-ying",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 2.17,
   "polyline": [
    [
     105.2725,
     30.57053
    ],
    [
     105.25004,
     30.57338
    ]
   ]
  },
  {
   "id": "da-ying-yu-feng",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "da-ying",
   "to": "yu-feng",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 8.88,
   "polyline": [
    [
     105.25004,
     30.57338
    ],
    [
     105.20075,
     30.58194
    ],
    [
     105.16155,
     30.59391
    ]
   ]
  },
  {
   "id": "yu-feng-qi-long",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "yu-feng",
   "to": "qi-long",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 5.83,
   "polyline": [
    [
     105.16155,
     30.59391
    ],
    [
     105.12795,
     30.59431
    ],
    [
     105.10175,
     30.59946
    ]
   ]
  },
  {
   "id": "qi-long-ji-jin",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "qi-long",
   "to": "ji-jin",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 24.95,
   "polyline": [
    [
     105.10175,
     30.59946
    ],
    [
     105.07968,
     30.60632
    ],
    [
     105.03279,
     30.6343
    ],
    [
     104.99665,
     30.65092
    ],
    [
     104.96833,
     30.66784
    ],
    [
     104.95966,
     30.67144
    ],
    [
     104.92038,
     30.68114
    ],
    [
     104.89149,
     30.68425
    ],
    [
     104.86862,
     30.68911
    ]
   ]
  },
  {
   "id": "ji-jin-zhuan-long",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "ji-jin",
   "to": "zhuan-long",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 7.55,
   "polyline": [
    [
     104.86862,
     30.68911
    ],
    [
     104.82739,
     30.69786
    ],
    [
     104.79144,
     30.69506
    ]
   ]
  },
  {
   "id": "zhuan-long-long-sheng",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "zhuan-long",
   "to": "long-sheng",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 8.94,
   "polyline": [
    [
     104.79144,
     30.69506
    ],
    [
     104.77143,
     30.69419
    ],
    [
     104.73547,
     30.70047
    ],
    [
     104.699,
     30.69939
    ]
   ]
  },
  {
   "id": "long-sheng-gao-ban",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "long-sheng",
   "to": "gao-ban",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 6.86,
   "polyline": [
    [
     104.699,
     30.69939
    ],
    [
     104.67874,
     30.7023
    ],
    [
     104.66264,
     30.70862
    ],
    [
     104.64642,
     30.71718
    ],
    [
     104.63312,
     30.72168
    ]
   ]
  },
  {
   "id": "gao-ban-huai-kou-nan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "gao-ban",
   "to": "huai-kou-nan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 5.66,
   "polyline": [
    [
     104.63312,
     30.72168
    ],
    [
     104.61938,
     30.72523
    ],
    [
     104.59551,
     30.72792
    ],
    [
     104.57606,
     30.73417
    ]
   ]
  },
  {
   "id": "huai-kou-nan-huai-kou",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "huai-kou-nan",
   "to": "huai-kou",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 0.56,
   "polyline": [
    [
     104.57606,
     30.73417
    ],
    [
     104.57071,
     30.73613
    ]
   ]
  },
  {
   "id": "huai-kou-shi-ban-tan",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "huai-kou",
   "to": "shi-ban-tan",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 30.16,
   "polyline": [
    [
     104.57071,
     30.73613
    ],
    [
     104.55196,
     30.7426
    ],
    [
     104.518,
     30.74939
    ],
    [
     104.41694,
     30.75994
    ],
    [
     104.4018,
     30.76039
    ],
    [
     104.36534,
     30.75436
    ],
    [
     104.26485,
     30.7252
    ]
   ]
  },
  {
   "id": "shi-ban-tan-cheng-du-dong",
   "name": "宁蓉铁路（沪汉蓉通道）",
   "from": "shi-ban-tan",
   "to": "cheng-du-dong",
   "lineIds": [
    "ningrong"
   ],
   "serviceDate": "2009-04-01",
   "estLengthKm": 17.73,
   "polyline": [
    [
     104.26485,
     30.7252
    ],
    [
     104.24137,
     30.72005
    ],
    [
     104.23292,
     30.7163
    ],
    [
     104.21128,
     30.69401
    ],
    [
     104.2024,
     30.68783
    ],
    [
     104.1936,
     30.68503
    ],
    [
     104.16686,
     30.68299
    ],
    [
     104.15981,
     30.68067
    ],
    [
     104.15584,
     30.67615
    ],
    [
     104.13892,
     30.6313
    ]
   ]
  },
  {
   "id": "shang-hai-hong-qiao-qi-bao",
   "name": "沪昆高速铁路",
   "from": "shang-hai-hong-qiao",
   "to": "qi-bao",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 4.02,
   "polyline": [
    [
     121.3162,
     31.19598
    ],
    [
     121.31874,
     31.17074
    ],
    [
     121.32394,
     31.16106
    ]
   ]
  },
  {
   "id": "qi-bao-li-jia-tang",
   "name": "沪昆高速铁路",
   "from": "qi-bao",
   "to": "li-jia-tang",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 6.13,
   "polyline": [
    [
     121.32394,
     31.16106
    ],
    [
     121.33652,
     31.14078
    ],
    [
     121.35641,
     31.11347
    ]
   ]
  },
  {
   "id": "li-jia-tang-chun-shen",
   "name": "沪昆高速铁路",
   "from": "li-jia-tang",
   "to": "chun-shen",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 4.18,
   "polyline": [
    [
     121.35641,
     31.11347
    ],
    [
     121.36157,
     31.10162
    ],
    [
     121.36227,
     31.09521
    ],
    [
     121.35947,
     31.08825
    ],
    [
     121.35091,
     31.07995
    ]
   ]
  },
  {
   "id": "chun-shen-xin-qiao",
   "name": "沪昆高速铁路",
   "from": "chun-shen",
   "to": "xin-qiao",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 3.75,
   "polyline": [
    [
     121.35091,
     31.07995
    ],
    [
     121.33908,
     31.07052
    ],
    [
     121.31976,
     31.05957
    ]
   ]
  },
  {
   "id": "xin-qiao-shang-hai-song-jiang",
   "name": "沪昆高速铁路",
   "from": "xin-qiao",
   "to": "shang-hai-song-jiang",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 12.54,
   "polyline": [
    [
     121.31976,
     31.05957
    ],
    [
     121.30238,
     31.04958
    ],
    [
     121.29446,
     31.04346
    ],
    [
     121.26974,
     31.02097
    ],
    [
     121.24831,
     30.99798
    ],
    [
     121.22413,
     30.98356
    ]
   ]
  },
  {
   "id": "shang-hai-song-jiang-jin-shan-bei",
   "name": "沪昆高速铁路",
   "from": "shang-hai-song-jiang",
   "to": "jin-shan-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 16.49,
   "polyline": [
    [
     121.22413,
     30.98356
    ],
    [
     121.20081,
     30.9697
    ],
    [
     121.17602,
     30.94294
    ],
    [
     121.16456,
     30.93402
    ],
    [
     121.15406,
     30.92854
    ],
    [
     121.11076,
     30.91097
    ],
    [
     121.08669,
     30.89764
    ]
   ]
  },
  {
   "id": "jin-shan-bei-jia-shan-nan",
   "name": "沪昆高速铁路",
   "from": "jin-shan-bei",
   "to": "jia-shan-nan",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 19.5,
   "polyline": [
    [
     121.08669,
     30.89764
    ],
    [
     121.05453,
     30.87966
    ],
    [
     121.01216,
     30.86049
    ],
    [
     121.00106,
     30.85402
    ],
    [
     120.97271,
     30.8314
    ],
    [
     120.95053,
     30.80531
    ],
    [
     120.9301,
     30.78878
    ]
   ]
  },
  {
   "id": "jia-shan-nan-jia-xing-nan",
   "name": "沪昆高速铁路",
   "from": "jia-shan-nan",
   "to": "jia-xing-nan",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 18.02,
   "polyline": [
    [
     120.9301,
     30.78878
    ],
    [
     120.91769,
     30.77967
    ],
    [
     120.89187,
     30.76459
    ],
    [
     120.85937,
     30.73919
    ],
    [
     120.83867,
     30.71714
    ],
    [
     120.82895,
     30.70891
    ],
    [
     120.81796,
     30.70258
    ],
    [
     120.79104,
     30.69061
    ],
    [
     120.79391,
     30.69579
    ]
   ]
  },
  {
   "id": "jia-xing-nan-tong-xiang",
   "name": "沪昆高速铁路",
   "from": "jia-xing-nan",
   "to": "tong-xiang",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 28.63,
   "polyline": [
    [
     120.79391,
     30.69579
    ],
    [
     120.78937,
     30.68988
    ],
    [
     120.76882,
     30.68039
    ],
    [
     120.72899,
     30.65525
    ],
    [
     120.67297,
     30.62572
    ],
    [
     120.64267,
     30.59845
    ],
    [
     120.62429,
     30.57294
    ],
    [
     120.6067,
     30.55707
    ],
    [
     120.58845,
     30.54668
    ],
    [
     120.56364,
     30.53959
    ]
   ]
  },
  {
   "id": "tong-xiang-hai-ning-xi",
   "name": "沪昆高速铁路",
   "from": "tong-xiang",
   "to": "hai-ning-xi",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 20.42,
   "polyline": [
    [
     120.56364,
     30.53959
    ],
    [
     120.52548,
     30.52726
    ],
    [
     120.50083,
     30.51119
    ],
    [
     120.47486,
     30.49656
    ],
    [
     120.44283,
     30.48267
    ],
    [
     120.41185,
     30.4637
    ],
    [
     120.38738,
     30.44095
    ]
   ]
  },
  {
   "id": "hai-ning-xi-lin-ping-nan",
   "name": "沪昆高速铁路",
   "from": "hai-ning-xi",
   "to": "lin-ping-nan",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 11.58,
   "polyline": [
    [
     120.38738,
     30.44095
    ],
    [
     120.3713,
     30.42575
    ],
    [
     120.33477,
     30.40127
    ],
    [
     120.28961,
     30.38186
    ]
   ]
  },
  {
   "id": "lin-ping-nan-qiao-si",
   "name": "沪昆高速铁路",
   "from": "lin-ping-nan",
   "to": "qiao-si",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 2.65,
   "polyline": [
    [
     120.28961,
     30.38186
    ],
    [
     120.26524,
     30.37057
    ]
   ]
  },
  {
   "id": "qiao-si-ding-qiao-you-ku-xie-you",
   "name": "沪昆高速铁路",
   "from": "qiao-si",
   "to": "ding-qiao-you-ku-xie-you",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 5.38,
   "polyline": [
    [
     120.26524,
     30.37057
    ],
    [
     120.23956,
     30.35129
    ],
    [
     120.22085,
     30.34137
    ]
   ]
  },
  {
   "id": "ding-qiao-you-ku-xie-you-jian-qiao",
   "name": "沪昆高速铁路",
   "from": "ding-qiao-you-ku-xie-you",
   "to": "jian-qiao",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 1.2,
   "polyline": [
    [
     120.22085,
     30.34137
    ],
    [
     120.20995,
     30.336
    ]
   ]
  },
  {
   "id": "jian-qiao-hang-zhou-dong",
   "name": "沪昆高速铁路",
   "from": "jian-qiao",
   "to": "hang-zhou-dong",
   "lineIds": [
    "hukun-hsr",
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 5.64,
   "polyline": [
    [
     120.20995,
     30.336
    ],
    [
     120.19943,
     30.32742
    ],
    [
     120.1959,
     30.31727
    ],
    [
     120.19759,
     30.3061
    ],
    [
     120.2082,
     30.29355
    ]
   ]
  },
  {
   "id": "hang-zhou-dong-ying-ning",
   "name": "沪昆高速铁路",
   "from": "hang-zhou-dong",
   "to": "ying-ning",
   "lineIds": [
    "hukun-hsr",
    "hanghuang-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 9.62,
   "polyline": [
    [
     120.2082,
     30.29355
    ],
    [
     120.21765,
     30.28207
    ],
    [
     120.24925,
     30.2637
    ],
    [
     120.25422,
     30.25918
    ],
    [
     120.26663,
     30.22794
    ]
   ]
  },
  {
   "id": "ying-ning-hang-zhou-nan",
   "name": "沪昆高速铁路",
   "from": "ying-ning",
   "to": "hang-zhou-nan",
   "lineIds": [
    "hukun-hsr",
    "hanghuang-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 6.61,
   "polyline": [
    [
     120.26663,
     30.22794
    ],
    [
     120.27608,
     30.20894
    ],
    [
     120.2864,
     30.19655
    ],
    [
     120.29108,
     30.17358
    ]
   ]
  },
  {
   "id": "hang-zhou-nan-zhu-ji-dong",
   "name": "沪昆高速铁路",
   "from": "hang-zhou-nan",
   "to": "zhu-ji-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 47.9,
   "polyline": [
    [
     120.29108,
     30.17358
    ],
    [
     120.29409,
     30.1578
    ],
    [
     120.30419,
     30.14107
    ],
    [
     120.30983,
     30.12345
    ],
    [
     120.30536,
     30.09338
    ],
    [
     120.30548,
     30.07493
    ],
    [
     120.30208,
     30.03552
    ],
    [
     120.2973,
     30.00449
    ],
    [
     120.29219,
     29.99012
    ],
    [
     120.27802,
     29.96703
    ],
    [
     120.27109,
     29.95012
    ],
    [
     120.26445,
     29.90553
    ],
    [
     120.2632,
     29.87597
    ],
    [
     120.25855,
     29.86008
    ],
    [
     120.24487,
     29.83784
    ],
    [
     120.23097,
     29.82172
    ],
    [
     120.21048,
     29.80147
    ],
    [
     120.19784,
     29.78342
    ],
    [
     120.19196,
     29.77104
    ]
   ]
  },
  {
   "id": "zhu-ji-dong-zhu-ji",
   "name": "沪昆高速铁路",
   "from": "zhu-ji-dong",
   "to": "zhu-ji",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.75,
   "polyline": [
    [
     120.19196,
     29.77104
    ],
    [
     120.18435,
     29.74766
    ],
    [
     120.18054,
     29.72966
    ]
   ]
  },
  {
   "id": "zhu-ji-zheng-jia-wu",
   "name": "沪昆高速铁路",
   "from": "zhu-ji",
   "to": "zheng-jia-wu",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 27.8,
   "polyline": [
    [
     120.18054,
     29.72966
    ],
    [
     120.1789,
     29.72762
    ],
    [
     120.17486,
     29.71239
    ],
    [
     120.1731,
     29.69871
    ],
    [
     120.17102,
     29.65019
    ],
    [
     120.17678,
     29.61467
    ],
    [
     120.17627,
     29.60312
    ],
    [
     120.17334,
     29.59142
    ],
    [
     120.16867,
     29.58174
    ],
    [
     120.16287,
     29.57376
    ],
    [
     120.09745,
     29.50424
    ]
   ]
  },
  {
   "id": "zheng-jia-wu-yi-wu",
   "name": "沪昆高速铁路",
   "from": "zheng-jia-wu",
   "to": "yi-wu",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 15.17,
   "polyline": [
    [
     120.09745,
     29.50424
    ],
    [
     120.08905,
     29.49205
    ],
    [
     120.08422,
     29.48122
    ],
    [
     120.08167,
     29.47092
    ],
    [
     120.07935,
     29.44448
    ],
    [
     120.07233,
     29.42723
    ],
    [
     120.05987,
     29.40727
    ],
    [
     120.0427,
     29.38736
    ],
    [
     120.0387,
     29.38084
    ]
   ]
  },
  {
   "id": "yi-wu-yi-wu-xi",
   "name": "沪昆高速铁路",
   "from": "yi-wu",
   "to": "yi-wu-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 11.73,
   "polyline": [
    [
     120.0387,
     29.38084
    ],
    [
     120.0427,
     29.38736
    ],
    [
     120.02276,
     29.36623
    ],
    [
     119.98927,
     29.33693
    ],
    [
     119.96869,
     29.31378
    ]
   ]
  },
  {
   "id": "yi-wu-xi-jin-yi",
   "name": "沪昆高速铁路",
   "from": "yi-wu-xi",
   "to": "jin-yi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 15.6,
   "polyline": [
    [
     119.96869,
     29.31378
    ],
    [
     119.9558,
     29.29729
    ],
    [
     119.9354,
     29.251
    ],
    [
     119.91197,
     29.21474
    ],
    [
     119.90125,
     29.20197
    ],
    [
     119.8898,
     29.19345
    ]
   ]
  },
  {
   "id": "jin-yi-tang-ya",
   "name": "沪昆高速铁路",
   "from": "jin-yi",
   "to": "tang-ya",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 9.58,
   "polyline": [
    [
     119.8898,
     29.19345
    ],
    [
     119.85697,
     29.17926
    ],
    [
     119.81516,
     29.16455
    ],
    [
     119.79886,
     29.16082
    ]
   ]
  },
  {
   "id": "tang-ya-dong-xiao",
   "name": "沪昆高速铁路",
   "from": "tang-ya",
   "to": "dong-xiao",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 9.61,
   "polyline": [
    [
     119.79886,
     29.16082
    ],
    [
     119.7836,
     29.15758
    ],
    [
     119.7437,
     29.14572
    ],
    [
     119.70732,
     29.12916
    ]
   ]
  },
  {
   "id": "dong-xiao-jin-hua-dong",
   "name": "沪昆高速铁路",
   "from": "dong-xiao",
   "to": "jin-hua-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.56,
   "polyline": [
    [
     119.70732,
     29.12916
    ],
    [
     119.69187,
     29.12369
    ],
    [
     119.66219,
     29.11883
    ]
   ]
  },
  {
   "id": "jin-hua-dong-jin-hua",
   "name": "沪昆高速铁路",
   "from": "jin-hua-dong",
   "to": "jin-hua",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 3.07,
   "polyline": [
    [
     119.66219,
     29.11883
    ],
    [
     119.64754,
     29.11774
    ],
    [
     119.63122,
     29.11428
    ]
   ]
  },
  {
   "id": "jin-hua-long-you",
   "name": "沪昆高速铁路",
   "from": "jin-hua",
   "to": "long-you",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 50.34,
   "polyline": [
    [
     119.63122,
     29.11428
    ],
    [
     119.54939,
     29.09831
    ],
    [
     119.53324,
     29.09818
    ],
    [
     119.5024,
     29.10119
    ],
    [
     119.38897,
     29.0926
    ],
    [
     119.36484,
     29.08409
    ],
    [
     119.23167,
     29.01508
    ],
    [
     119.2057,
     29.0084
    ],
    [
     119.15527,
     29.00459
    ],
    [
     119.16011,
     29.00584
    ]
   ]
  },
  {
   "id": "long-you-qu-zhou-dong",
   "name": "沪昆高速铁路",
   "from": "long-you",
   "to": "qu-zhou-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 19.67,
   "polyline": [
    [
     119.16011,
     29.00584
    ],
    [
     119.09056,
     28.99925
    ],
    [
     119.07313,
     28.99436
    ],
    [
     119.04949,
     28.98265
    ],
    [
     119.03382,
     28.97708
    ],
    [
     119.01582,
     28.97436
    ],
    [
     118.98514,
     28.97385
    ],
    [
     118.96546,
     28.96898
    ]
   ]
  },
  {
   "id": "qu-zhou-dong-qu-zhou",
   "name": "沪昆高速铁路",
   "from": "qu-zhou-dong",
   "to": "qu-zhou",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 11.37,
   "polyline": [
    [
     118.96546,
     28.96898
    ],
    [
     118.93786,
     28.95632
    ],
    [
     118.90546,
     28.93738
    ],
    [
     118.87026,
     28.92266
    ],
    [
     118.87612,
     28.92702
    ]
   ]
  },
  {
   "id": "qu-zhou-jiang-shan",
   "name": "沪昆高速铁路",
   "from": "qu-zhou",
   "to": "jiang-shan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 30.01,
   "polyline": [
    [
     118.87612,
     28.92702
    ],
    [
     118.87161,
     28.92327
    ],
    [
     118.83188,
     28.90555
    ],
    [
     118.82019,
     28.90183
    ],
    [
     118.78708,
     28.89562
    ],
    [
     118.76932,
     28.88763
    ],
    [
     118.7592,
     28.88068
    ],
    [
     118.71805,
     28.84365
    ],
    [
     118.6931,
     28.81363
    ],
    [
     118.67751,
     28.79781
    ],
    [
     118.63895,
     28.77569
    ]
   ]
  },
  {
   "id": "jiang-shan-yu-shan-nan",
   "name": "沪昆高速铁路",
   "from": "jiang-shan",
   "to": "yu-shan-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 38.31,
   "polyline": [
    [
     118.63895,
     28.77569
    ],
    [
     118.59118,
     28.7529
    ],
    [
     118.55936,
     28.72559
    ],
    [
     118.54865,
     28.71868
    ],
    [
     118.53588,
     28.71288
    ],
    [
     118.45831,
     28.69384
    ],
    [
     118.41737,
     28.67782
    ],
    [
     118.40621,
     28.6747
    ],
    [
     118.37487,
     28.66957
    ],
    [
     118.34007,
     28.66788
    ],
    [
     118.32388,
     28.66516
    ],
    [
     118.30718,
     28.65922
    ],
    [
     118.28811,
     28.65008
    ]
   ]
  },
  {
   "id": "yu-shan-nan-shang-rao",
   "name": "沪昆高速铁路",
   "from": "yu-shan-nan",
   "to": "shang-rao",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 34.66,
   "polyline": [
    [
     118.28811,
     28.65008
    ],
    [
     118.26643,
     28.63886
    ],
    [
     118.24263,
     28.62158
    ],
    [
     118.21166,
     28.6084
    ],
    [
     118.19889,
     28.60083
    ],
    [
     118.18593,
     28.58925
    ],
    [
     118.16801,
     28.56577
    ],
    [
     118.1458,
     28.54628
    ],
    [
     118.12681,
     28.52538
    ],
    [
     118.09893,
     28.50318
    ],
    [
     118.07879,
     28.49558
    ],
    [
     118.06638,
     28.49367
    ],
    [
     118.02598,
     28.49592
    ],
    [
     118.00308,
     28.49412
    ]
   ]
  },
  {
   "id": "shang-rao-yi-yang",
   "name": "沪昆高速铁路",
   "from": "shang-rao",
   "to": "yi-yang",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 59.3,
   "polyline": [
    [
     118.00308,
     28.49412
    ],
    [
     117.95345,
     28.49107
    ],
    [
     117.90665,
     28.49782
    ],
    [
     117.88541,
     28.49645
    ],
    [
     117.87174,
     28.49382
    ],
    [
     117.8591,
     28.48889
    ],
    [
     117.84979,
     28.48352
    ],
    [
     117.82593,
     28.46577
    ],
    [
     117.80122,
     28.4498
    ],
    [
     117.77866,
     28.43038
    ],
    [
     117.76016,
     28.41989
    ],
    [
     117.74194,
     28.41413
    ],
    [
     117.61248,
     28.38726
    ],
    [
     117.59566,
     28.38661
    ],
    [
     117.5757,
     28.38917
    ],
    [
     117.49342,
     28.41712
    ],
    [
     117.47331,
     28.41837
    ],
    [
     117.43972,
     28.41425
    ]
   ]
  },
  {
   "id": "yi-yang-he-tan-bu",
   "name": "沪昆高速铁路",
   "from": "yi-yang",
   "to": "he-tan-bu",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 9.75,
   "polyline": [
    [
     117.43972,
     28.41425
    ],
    [
     117.39564,
     28.41071
    ],
    [
     117.36428,
     28.40532
    ],
    [
     117.34187,
     28.39922
    ]
   ]
  },
  {
   "id": "he-tan-bu-ying-tan-bei",
   "name": "沪昆高速铁路",
   "from": "he-tan-bu",
   "to": "ying-tan-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 33.22,
   "polyline": [
    [
     117.34187,
     28.39922
    ],
    [
     117.28363,
     28.38563
    ],
    [
     117.23705,
     28.37996
    ],
    [
     117.22183,
     28.3768
    ],
    [
     117.20626,
     28.37004
    ],
    [
     117.18649,
     28.35655
    ],
    [
     117.16741,
     28.3478
    ],
    [
     117.06728,
     28.32233
    ],
    [
     117.03387,
     28.30876
    ]
   ]
  },
  {
   "id": "ying-tan-bei-fu-zhou-dong",
   "name": "沪昆高速铁路",
   "from": "ying-tan-bei",
   "to": "fu-zhou-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 43.07,
   "polyline": [
    [
     117.03387,
     28.30876
    ],
    [
     116.99,
     28.29235
    ],
    [
     116.94061,
     28.27922
    ],
    [
     116.92682,
     28.27693
    ],
    [
     116.83676,
     28.27423
    ],
    [
     116.80936,
     28.27686
    ],
    [
     116.74155,
     28.27906
    ],
    [
     116.72856,
     28.27754
    ],
    [
     116.70349,
     28.27158
    ],
    [
     116.67407,
     28.26881
    ],
    [
     116.64843,
     28.26419
    ],
    [
     116.61188,
     28.26394
    ]
   ]
  },
  {
   "id": "fu-zhou-dong-ya-qian",
   "name": "沪昆高速铁路",
   "from": "fu-zhou-dong",
   "to": "ya-qian",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 18.22,
   "polyline": [
    [
     116.61188,
     28.26394
    ],
    [
     116.57583,
     28.26555
    ],
    [
     116.53866,
     28.26144
    ],
    [
     116.52046,
     28.26187
    ],
    [
     116.50339,
     28.26618
    ],
    [
     116.46912,
     28.2801
    ],
    [
     116.43165,
     28.28813
    ]
   ]
  },
  {
   "id": "ya-qian-jin-xian-nan",
   "name": "沪昆高速铁路",
   "from": "ya-qian",
   "to": "jin-xian-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 21.18,
   "polyline": [
    [
     116.43165,
     28.28813
    ],
    [
     116.41392,
     28.29286
    ],
    [
     116.38572,
     28.30385
    ],
    [
     116.27997,
     28.33128
    ],
    [
     116.22965,
     28.34073
    ]
   ]
  },
  {
   "id": "jin-xian-nan-wen-jia-zhen",
   "name": "沪昆高速铁路",
   "from": "jin-xian-nan",
   "to": "wen-jia-zhen",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 12.06,
   "polyline": [
    [
     116.22965,
     28.34073
    ],
    [
     116.19566,
     28.34616
    ],
    [
     116.17011,
     28.34721
    ],
    [
     116.15414,
     28.34971
    ],
    [
     116.13,
     28.35705
    ],
    [
     116.11246,
     28.36741
    ]
   ]
  },
  {
   "id": "wen-jia-zhen-nan-chang-xi",
   "name": "沪昆高速铁路",
   "from": "wen-jia-zhen",
   "to": "nan-chang-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 47.15,
   "polyline": [
    [
     116.11246,
     28.36741
    ],
    [
     116.09886,
     28.37976
    ],
    [
     116.07673,
     28.40623
    ],
    [
     116.0468,
     28.43265
    ],
    [
     116.03669,
     28.43978
    ],
    [
     116.00141,
     28.45683
    ],
    [
     115.93346,
     28.47691
    ],
    [
     115.89388,
     28.5014
    ],
    [
     115.85653,
     28.5205
    ],
    [
     115.84785,
     28.53011
    ],
    [
     115.84398,
     28.54166
    ],
    [
     115.84498,
     28.55238
    ],
    [
     115.85316,
     28.57431
    ],
    [
     115.85275,
     28.58365
    ],
    [
     115.84843,
     28.59372
    ],
    [
     115.8431,
     28.59987
    ],
    [
     115.83581,
     28.60488
    ],
    [
     115.78771,
     28.62573
    ]
   ]
  },
  {
   "id": "nan-chang-xi-gao-an",
   "name": "沪昆高速铁路",
   "from": "nan-chang-xi",
   "to": "gao-an",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 47.12,
   "polyline": [
    [
     115.78771,
     28.62573
    ],
    [
     115.75837,
     28.63786
    ],
    [
     115.73362,
     28.65137
    ],
    [
     115.7194,
     28.65621
    ],
    [
     115.69749,
     28.65819
    ],
    [
     115.67465,
     28.6538
    ],
    [
     115.65819,
     28.6457
    ],
    [
     115.54286,
     28.56953
    ],
    [
     115.39508,
     28.48503
    ],
    [
     115.37981,
     28.47415
    ]
   ]
  },
  {
   "id": "gao-an-xin-yu-bei",
   "name": "沪昆高速铁路",
   "from": "gao-an",
   "to": "xin-yu-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 79.93,
   "polyline": [
    [
     115.37981,
     28.47415
    ],
    [
     115.35416,
     28.45694
    ],
    [
     115.31794,
     28.42899
    ],
    [
     115.29623,
     28.41517
    ],
    [
     115.27954,
     28.40009
    ],
    [
     115.24937,
     28.3553
    ],
    [
     115.21827,
     28.3243
    ],
    [
     115.20188,
     28.29673
    ],
    [
     115.19392,
     28.28668
    ],
    [
     115.15575,
     28.25689
    ],
    [
     115.14481,
     28.24491
    ],
    [
     115.09119,
     28.15631
    ],
    [
     115.04471,
     28.10228
    ],
    [
     115.02497,
     28.07545
    ],
    [
     115.00974,
     28.04892
    ],
    [
     114.99406,
     28.006
    ],
    [
     114.97833,
     27.98353
    ],
    [
     114.96876,
     27.97325
    ],
    [
     114.93285,
     27.94193
    ],
    [
     114.89133,
     27.91523
    ]
   ]
  },
  {
   "id": "xin-yu-bei-guan-chao",
   "name": "沪昆高速铁路",
   "from": "xin-yu-bei",
   "to": "guan-chao",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 8.8,
   "polyline": [
    [
     114.89133,
     27.91523
    ],
    [
     114.85613,
     27.89498
    ],
    [
     114.81266,
     27.87818
    ]
   ]
  },
  {
   "id": "guan-chao-bin-jiang",
   "name": "沪昆高速铁路",
   "from": "guan-chao",
   "to": "bin-jiang",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 28.66,
   "polyline": [
    [
     114.81266,
     27.87818
    ],
    [
     114.79049,
     27.87002
    ],
    [
     114.77454,
     27.86625
    ],
    [
     114.73895,
     27.86369
    ],
    [
     114.68686,
     27.85492
    ],
    [
     114.64338,
     27.85016
    ],
    [
     114.63024,
     27.84694
    ],
    [
     114.61961,
     27.84243
    ],
    [
     114.60733,
     27.83447
    ],
    [
     114.57179,
     27.80086
    ],
    [
     114.56286,
     27.79532
    ],
    [
     114.54976,
     27.78991
    ]
   ]
  },
  {
   "id": "bin-jiang-yi-chun",
   "name": "沪昆高速铁路",
   "from": "bin-jiang",
   "to": "yi-chun",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 12.07,
   "polyline": [
    [
     114.54976,
     27.78991
    ],
    [
     114.5363,
     27.7871
    ],
    [
     114.52357,
     27.78661
    ],
    [
     114.46017,
     27.79373
    ],
    [
     114.43154,
     27.79155
    ]
   ]
  },
  {
   "id": "yi-chun-yi-chun-xi",
   "name": "沪昆高速铁路",
   "from": "yi-chun",
   "to": "yi-chun-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.83,
   "polyline": [
    [
     114.43154,
     27.79155
    ],
    [
     114.41354,
     27.78873
    ],
    [
     114.38289,
     27.78786
    ]
   ]
  },
  {
   "id": "yi-chun-xi-ping-xiang-bei",
   "name": "沪昆高速铁路",
   "from": "yi-chun-xi",
   "to": "ping-xiang-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 56.22,
   "polyline": [
    [
     114.38289,
     27.78786
    ],
    [
     114.37057,
     27.78495
    ],
    [
     114.34472,
     27.77482
    ],
    [
     114.33445,
     27.7722
    ],
    [
     114.30364,
     27.76848
    ],
    [
     114.28974,
     27.76504
    ],
    [
     114.27872,
     27.76018
    ],
    [
     114.22289,
     27.72915
    ],
    [
     114.17325,
     27.70726
    ],
    [
     114.08931,
     27.68144
    ],
    [
     114.0695,
     27.68014
    ],
    [
     114.03552,
     27.68413
    ],
    [
     113.93805,
     27.6762
    ],
    [
     113.87761,
     27.68952
    ],
    [
     113.86139,
     27.68968
    ],
    [
     113.8423,
     27.68745
    ]
   ]
  },
  {
   "id": "ping-xiang-bei-li-ling-dong",
   "name": "沪昆高速铁路",
   "from": "ping-xiang-bei",
   "to": "li-ling-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 28.57,
   "polyline": [
    [
     113.8423,
     27.68745
    ],
    [
     113.78226,
     27.68248
    ],
    [
     113.73067,
     27.68215
    ],
    [
     113.67683,
     27.67047
    ],
    [
     113.65415,
     27.67051
    ],
    [
     113.63951,
     27.67409
    ],
    [
     113.62656,
     27.68004
    ],
    [
     113.59222,
     27.70821
    ],
    [
     113.5726,
     27.7185
    ]
   ]
  },
  {
   "id": "li-ling-dong-chang-sha-nan",
   "name": "沪昆高速铁路",
   "from": "li-ling-dong",
   "to": "chang-sha-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 77.39,
   "polyline": [
    [
     113.5726,
     27.7185
    ],
    [
     113.52888,
     27.74205
    ],
    [
     113.50923,
     27.75926
    ],
    [
     113.39857,
     27.84731
    ],
    [
     113.37669,
     27.87327
    ],
    [
     113.30541,
     27.9688
    ],
    [
     113.25133,
     28.0549
    ],
    [
     113.17409,
     28.1374
    ],
    [
     113.12421,
     28.16855
    ],
    [
     113.11574,
     28.17144
    ],
    [
     113.09374,
     28.17547
    ],
    [
     113.08477,
     28.17512
    ],
    [
     113.06172,
     28.16973
    ],
    [
     113.05842,
     28.16452
    ],
    [
     113.05988,
     28.15008
    ]
   ]
  },
  {
   "id": "chang-sha-nan-xiang-tan-bei",
   "name": "沪昆高速铁路",
   "from": "chang-sha-nan",
   "to": "xiang-tan-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 25.72,
   "polyline": [
    [
     113.05988,
     28.15008
    ],
    [
     113.06246,
     28.11811
    ],
    [
     113.05675,
     28.09015
    ],
    [
     113.05428,
     28.06341
    ],
    [
     113.0518,
     28.05573
    ],
    [
     113.04711,
     28.04752
    ],
    [
     113.03889,
     28.03884
    ],
    [
     112.99472,
     28.00549
    ],
    [
     112.9686,
     27.98393
    ],
    [
     112.95818,
     27.97759
    ],
    [
     112.93713,
     27.96827
    ]
   ]
  },
  {
   "id": "xiang-tan-bei-shao-shan-nan",
   "name": "沪昆高速铁路",
   "from": "xiang-tan-bei",
   "to": "shao-shan-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 41.9,
   "polyline": [
    [
     112.93713,
     27.96827
    ],
    [
     112.89716,
     27.95355
    ],
    [
     112.88076,
     27.94993
    ],
    [
     112.71558,
     27.93725
    ],
    [
     112.5782,
     27.90624
    ],
    [
     112.54237,
     27.8917
    ]
   ]
  },
  {
   "id": "shao-shan-nan-lou-di-nan",
   "name": "沪昆高速铁路",
   "from": "shao-shan-nan",
   "to": "lou-di-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 59.58,
   "polyline": [
    [
     112.54237,
     27.8917
    ],
    [
     112.5032,
     27.87351
    ],
    [
     112.47818,
     27.85738
    ],
    [
     112.43155,
     27.83297
    ],
    [
     112.29213,
     27.77966
    ],
    [
     112.28403,
     27.77762
    ],
    [
     112.18757,
     27.76606
    ],
    [
     112.17235,
     27.76228
    ],
    [
     112.14181,
     27.75042
    ],
    [
     112.1256,
     27.74135
    ],
    [
     112.0614,
     27.696
    ],
    [
     112.00847,
     27.66626
    ]
   ]
  },
  {
   "id": "lou-di-nan-shao-yang-bei",
   "name": "沪昆高速铁路",
   "from": "lou-di-nan",
   "to": "shao-yang-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 52.19,
   "polyline": [
    [
     112.00847,
     27.66626
    ],
    [
     111.96734,
     27.64248
    ],
    [
     111.89906,
     27.61841
    ],
    [
     111.88199,
     27.61388
    ],
    [
     111.8207,
     27.6045
    ],
    [
     111.75728,
     27.60599
    ],
    [
     111.74346,
     27.60507
    ],
    [
     111.70263,
     27.59494
    ],
    [
     111.67698,
     27.5916
    ],
    [
     111.62002,
     27.58064
    ],
    [
     111.54142,
     27.57586
    ],
    [
     111.49898,
     27.57756
    ]
   ]
  },
  {
   "id": "shao-yang-bei-xin-hua-nan",
   "name": "沪昆高速铁路",
   "from": "shao-yang-bei",
   "to": "xin-hua-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 36.56,
   "polyline": [
    [
     111.49898,
     27.57756
    ],
    [
     111.45736,
     27.5814
    ],
    [
     111.44196,
     27.5845
    ],
    [
     111.41183,
     27.60112
    ],
    [
     111.38877,
     27.61871
    ],
    [
     111.37264,
     27.62577
    ],
    [
     111.35155,
     27.62975
    ],
    [
     111.31483,
     27.62908
    ],
    [
     111.29176,
     27.63242
    ],
    [
     111.27608,
     27.63803
    ],
    [
     111.23432,
     27.65921
    ],
    [
     111.21882,
     27.66453
    ],
    [
     111.207,
     27.66665
    ],
    [
     111.18673,
     27.66652
    ],
    [
     111.15505,
     27.65861
    ]
   ]
  },
  {
   "id": "xin-hua-nan-xu-pu-nan",
   "name": "沪昆高速铁路",
   "from": "xin-hua-nan",
   "to": "xu-pu-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 57.44,
   "polyline": [
    [
     111.15505,
     27.65861
    ],
    [
     110.98063,
     27.60765
    ],
    [
     110.91405,
     27.59226
    ],
    [
     110.90035,
     27.59025
    ],
    [
     110.88114,
     27.59032
    ],
    [
     110.83043,
     27.598
    ],
    [
     110.78903,
     27.60734
    ],
    [
     110.68611,
     27.61711
    ],
    [
     110.63198,
     27.61707
    ],
    [
     110.58809,
     27.60852
    ]
   ]
  },
  {
   "id": "xu-pu-nan-huai-hua-nan",
   "name": "沪昆高速铁路",
   "from": "xu-pu-nan",
   "to": "huai-hua-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 61.73,
   "polyline": [
    [
     110.58809,
     27.60852
    ],
    [
     110.52709,
     27.59621
    ],
    [
     110.44113,
     27.58895
    ],
    [
     110.29797,
     27.5701
    ],
    [
     110.27207,
     27.56404
    ],
    [
     110.19385,
     27.53258
    ],
    [
     110.15309,
     27.52454
    ],
    [
     110.10886,
     27.52084
    ],
    [
     110.02851,
     27.52318
    ],
    [
     110.01382,
     27.5214
    ],
    [
     109.98341,
     27.51341
    ],
    [
     109.98876,
     27.51552
    ]
   ]
  },
  {
   "id": "huai-hua-nan-huai-hua-xi",
   "name": "沪昆高速铁路",
   "from": "huai-hua-nan",
   "to": "huai-hua-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.6,
   "polyline": [
    [
     109.98876,
     27.51552
    ],
    [
     109.94447,
     27.50294
    ]
   ]
  },
  {
   "id": "huai-hua-xi-zhi-jiang",
   "name": "沪昆高速铁路",
   "from": "huai-hua-xi",
   "to": "zhi-jiang",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 29.35,
   "polyline": [
    [
     109.94447,
     27.50294
    ],
    [
     109.92299,
     27.49989
    ],
    [
     109.88838,
     27.49956
    ],
    [
     109.83228,
     27.48973
    ],
    [
     109.76343,
     27.48467
    ],
    [
     109.72518,
     27.48391
    ],
    [
     109.70255,
     27.47803
    ],
    [
     109.65543,
     27.45862
    ]
   ]
  },
  {
   "id": "zhi-jiang-xin-huang-xi",
   "name": "沪昆高速铁路",
   "from": "zhi-jiang",
   "to": "xin-huang-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 55.18,
   "polyline": [
    [
     109.65543,
     27.45862
    ],
    [
     109.62198,
     27.44643
    ],
    [
     109.60213,
     27.44342
    ],
    [
     109.5514,
     27.44682
    ],
    [
     109.48238,
     27.43633
    ],
    [
     109.3928,
     27.44162
    ],
    [
     109.37832,
     27.44107
    ],
    [
     109.33041,
     27.42885
    ],
    [
     109.2771,
     27.4183
    ],
    [
     109.22634,
     27.40409
    ],
    [
     109.18913,
     27.39659
    ],
    [
     109.15158,
     27.3923
    ],
    [
     109.12148,
     27.38343
    ]
   ]
  },
  {
   "id": "xin-huang-xi-da-zong-ping",
   "name": "沪昆高速铁路",
   "from": "xin-huang-xi",
   "to": "da-zong-ping",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 7.22,
   "polyline": [
    [
     109.12148,
     27.38343
    ],
    [
     109.09011,
     27.37309
    ],
    [
     109.05839,
     27.35216
    ]
   ]
  },
  {
   "id": "da-zong-ping-tong-ren-nan",
   "name": "沪昆高速铁路",
   "from": "da-zong-ping",
   "to": "tong-ren-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 11.79,
   "polyline": [
    [
     109.05839,
     27.35216
    ],
    [
     109.03772,
     27.33779
    ],
    [
     108.99678,
     27.31352
    ],
    [
     108.98568,
     27.30283
    ],
    [
     108.97131,
     27.28245
    ]
   ]
  },
  {
   "id": "tong-ren-nan-san-sui",
   "name": "沪昆高速铁路",
   "from": "tong-ren-nan",
   "to": "san-sui",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 47.67,
   "polyline": [
    [
     108.97131,
     27.28245
    ],
    [
     108.94751,
     27.24693
    ],
    [
     108.93997,
     27.23853
    ],
    [
     108.90992,
     27.21653
    ],
    [
     108.85869,
     27.16872
    ],
    [
     108.81137,
     27.12913
    ],
    [
     108.70918,
     27.02282
    ],
    [
     108.68065,
     26.99971
    ],
    [
     108.6473,
     26.96838
    ]
   ]
  },
  {
   "id": "san-sui-kai-li-nan",
   "name": "沪昆高速铁路",
   "from": "san-sui",
   "to": "kai-li-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 93.91,
   "polyline": [
    [
     108.6473,
     26.96838
    ],
    [
     108.62892,
     26.95298
    ],
    [
     108.61403,
     26.9443
    ],
    [
     108.53006,
     26.90823
    ],
    [
     108.43943,
     26.87658
    ],
    [
     108.38221,
     26.84499
    ],
    [
     108.34146,
     26.81441
    ],
    [
     108.30029,
     26.79317
    ],
    [
     108.23063,
     26.74784
    ],
    [
     108.20846,
     26.73652
    ],
    [
     108.17464,
     26.71452
    ],
    [
     108.1593,
     26.69968
    ],
    [
     108.12029,
     26.65042
    ],
    [
     108.10856,
     26.63781
    ],
    [
     108.0389,
     26.59362
    ],
    [
     107.99734,
     26.56074
    ],
    [
     107.97338,
     26.54711
    ],
    [
     107.93853,
     26.53727
    ],
    [
     107.8838,
     26.51765
    ]
   ]
  },
  {
   "id": "kai-li-nan-ban-bian-jie",
   "name": "沪昆高速铁路",
   "from": "kai-li-nan",
   "to": "ban-bian-jie",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 61.26,
   "polyline": [
    [
     107.8838,
     26.51765
    ],
    [
     107.86136,
     26.50853
    ],
    [
     107.84341,
     26.50364
    ],
    [
     107.82898,
     26.50232
    ],
    [
     107.81161,
     26.50331
    ],
    [
     107.73928,
     26.51257
    ],
    [
     107.64319,
     26.53261
    ],
    [
     107.55032,
     26.56869
    ],
    [
     107.51744,
     26.57585
    ],
    [
     107.49492,
     26.57909
    ],
    [
     107.47188,
     26.58056
    ],
    [
     107.45039,
     26.57976
    ],
    [
     107.41006,
     26.57044
    ],
    [
     107.37338,
     26.56846
    ],
    [
     107.30633,
     26.58008
    ],
    [
     107.28954,
     26.58511
    ]
   ]
  },
  {
   "id": "ban-bian-jie-gui-ding-bei",
   "name": "沪昆高速铁路",
   "from": "ban-bian-jie",
   "to": "gui-ding-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 6.65,
   "polyline": [
    [
     107.28954,
     26.58511
    ],
    [
     107.27456,
     26.59107
    ],
    [
     107.26112,
     26.59456
    ],
    [
     107.22866,
     26.59594
    ]
   ]
  },
  {
   "id": "gui-ding-bei-gui-yang-dong",
   "name": "沪昆高速铁路",
   "from": "gui-ding-bei",
   "to": "gui-yang-dong",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 49.06,
   "polyline": [
    [
     107.22866,
     26.59594
    ],
    [
     107.19722,
     26.59658
    ],
    [
     107.14931,
     26.60611
    ],
    [
     107.09276,
     26.60663
    ],
    [
     107.06588,
     26.60974
    ],
    [
     107.00365,
     26.6119
    ],
    [
     106.9572,
     26.61744
    ],
    [
     106.89207,
     26.62834
    ],
    [
     106.80199,
     26.65485
    ],
    [
     106.74563,
     26.66665
    ]
   ]
  },
  {
   "id": "gui-yang-dong-gui-yang-bei",
   "name": "沪昆高速铁路",
   "from": "gui-yang-dong",
   "to": "gui-yang-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 10.44,
   "polyline": [
    [
     106.74563,
     26.66665
    ],
    [
     106.71646,
     26.67216
    ],
    [
     106.70947,
     26.67156
    ],
    [
     106.70152,
     26.66842
    ],
    [
     106.6943,
     26.66137
    ],
    [
     106.68211,
     26.64309
    ],
    [
     106.67245,
     26.62283
    ]
   ]
  },
  {
   "id": "gui-yang-bei-jin-hua-zhen",
   "name": "沪昆高速铁路",
   "from": "gui-yang-bei",
   "to": "jin-hua-zhen",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 17.15,
   "polyline": [
    [
     106.67245,
     26.62283
    ],
    [
     106.67073,
     26.60622
    ],
    [
     106.66449,
     26.59602
    ],
    [
     106.66135,
     26.58667
    ],
    [
     106.65515,
     26.58047
    ],
    [
     106.6461,
     26.57636
    ],
    [
     106.63686,
     26.57522
    ],
    [
     106.61468,
     26.57897
    ],
    [
     106.60197,
     26.58315
    ],
    [
     106.59192,
     26.58335
    ],
    [
     106.58417,
     26.5804
    ],
    [
     106.56921,
     26.56898
    ],
    [
     106.54726,
     26.55647
    ]
   ]
  },
  {
   "id": "jin-hua-zhen-hua-xi-xi",
   "name": "沪昆高速铁路",
   "from": "jin-hua-zhen",
   "to": "hua-xi-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 5.27,
   "polyline": [
    [
     106.54726,
     26.55647
    ],
    [
     106.52907,
     26.54294
    ],
    [
     106.5129,
     26.52129
    ]
   ]
  },
  {
   "id": "hua-xi-xi-gui-an",
   "name": "沪昆高速铁路",
   "from": "hua-xi-xi",
   "to": "gui-an",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 6.19,
   "polyline": [
    [
     106.5129,
     26.52129
    ],
    [
     106.49405,
     26.49425
    ],
    [
     106.48261,
     26.47303
    ]
   ]
  },
  {
   "id": "gui-an-ma-chang",
   "name": "沪昆高速铁路",
   "from": "gui-an",
   "to": "ma-chang",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 10.44,
   "polyline": [
    [
     106.48261,
     26.47303
    ],
    [
     106.46719,
     26.44453
    ],
    [
     106.4562,
     26.43118
    ],
    [
     106.4419,
     26.4195
    ],
    [
     106.41498,
     26.40517
    ]
   ]
  },
  {
   "id": "ma-chang-gao-feng",
   "name": "沪昆高速铁路",
   "from": "ma-chang",
   "to": "gao-feng",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 7.83,
   "polyline": [
    [
     106.41498,
     26.40517
    ],
    [
     106.39772,
     26.39673
    ],
    [
     106.38046,
     26.39097
    ],
    [
     106.36353,
     26.38811
    ],
    [
     106.34047,
     26.38647
    ]
   ]
  },
  {
   "id": "gao-feng-ping-ba",
   "name": "沪昆高速铁路",
   "from": "gao-feng",
   "to": "ping-ba",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.46,
   "polyline": [
    [
     106.34047,
     26.38647
    ],
    [
     106.31653,
     26.38522
    ],
    [
     106.29594,
     26.38622
    ]
   ]
  },
  {
   "id": "ping-ba-ping-ba-nan",
   "name": "沪昆高速铁路",
   "from": "ping-ba",
   "to": "ping-ba-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 4.46,
   "polyline": [
    [
     106.29594,
     26.38622
    ],
    [
     106.25342,
     26.38725
    ]
   ]
  },
  {
   "id": "ping-ba-nan-tian-long",
   "name": "沪昆高速铁路",
   "from": "ping-ba-nan",
   "to": "tian-long",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 8.72,
   "polyline": [
    [
     106.25342,
     26.38725
    ],
    [
     106.22437,
     26.38743
    ],
    [
     106.20648,
     26.38514
    ],
    [
     106.18725,
     26.379
    ],
    [
     106.17055,
     26.36969
    ]
   ]
  },
  {
   "id": "tian-long-an-shun-xi",
   "name": "沪昆高速铁路",
   "from": "tian-long",
   "to": "an-shun-xi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 36.6,
   "polyline": [
    [
     106.17055,
     26.36969
    ],
    [
     106.14288,
     26.35024
    ],
    [
     106.1016,
     26.33371
    ],
    [
     106.08145,
     26.32141
    ],
    [
     106.06708,
     26.30674
    ],
    [
     106.03927,
     26.26473
    ],
    [
     106.02992,
     26.25591
    ],
    [
     106.0187,
     26.24838
    ],
    [
     105.98207,
     26.22942
    ],
    [
     105.96966,
     26.22465
    ],
    [
     105.95395,
     26.22105
    ],
    [
     105.90667,
     26.21514
    ],
    [
     105.89362,
     26.21123
    ],
    [
     105.87234,
     26.20213
    ]
   ]
  },
  {
   "id": "an-shun-xi-yao-pu",
   "name": "沪昆高速铁路",
   "from": "an-shun-xi",
   "to": "yao-pu",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 5.21,
   "polyline": [
    [
     105.87234,
     26.20213
    ],
    [
     105.84975,
     26.18999
    ],
    [
     105.8374,
     26.18119
    ]
   ]
  },
  {
   "id": "yao-pu-guan-ling",
   "name": "沪昆高速铁路",
   "from": "yao-pu",
   "to": "guan-ling",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 42.9,
   "polyline": [
    [
     105.8374,
     26.18119
    ],
    [
     105.80682,
     26.15044
    ],
    [
     105.7912,
     26.13934
    ],
    [
     105.77641,
     26.13164
    ],
    [
     105.75856,
     26.12416
    ],
    [
     105.73535,
     26.11671
    ],
    [
     105.69657,
     26.10012
    ],
    [
     105.66651,
     26.08278
    ],
    [
     105.65357,
     26.07738
    ],
    [
     105.63506,
     26.07306
    ],
    [
     105.60679,
     26.07036
    ],
    [
     105.59357,
     26.06617
    ],
    [
     105.58224,
     26.06015
    ],
    [
     105.57097,
     26.05136
    ],
    [
     105.5647,
     26.04393
    ],
    [
     105.55191,
     26.02194
    ],
    [
     105.52492,
     25.96826
    ]
   ]
  },
  {
   "id": "guan-ling-pu-an-xian",
   "name": "沪昆高速铁路",
   "from": "guan-ling",
   "to": "pu-an-xian",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 74.08,
   "polyline": [
    [
     105.52492,
     25.96826
    ],
    [
     105.51181,
     25.94672
    ],
    [
     105.49853,
     25.9335
    ],
    [
     105.4798,
     25.92403
    ],
    [
     105.46006,
     25.92068
    ],
    [
     105.43824,
     25.92352
    ],
    [
     105.40424,
     25.93838
    ],
    [
     105.32716,
     25.96202
    ],
    [
     105.3047,
     25.96428
    ],
    [
     105.28123,
     25.96118
    ],
    [
     105.26489,
     25.9554
    ],
    [
     105.21797,
     25.93218
    ],
    [
     105.17306,
     25.91895
    ],
    [
     105.15249,
     25.90868
    ],
    [
     105.13915,
     25.89738
    ],
    [
     105.11295,
     25.86274
    ],
    [
     105.10321,
     25.85527
    ],
    [
     105.09111,
     25.84898
    ],
    [
     105.05313,
     25.84079
    ],
    [
     104.89523,
     25.81392
    ],
    [
     104.86743,
     25.8058
    ]
   ]
  },
  {
   "id": "pu-an-xian-pan-zhou",
   "name": "沪昆高速铁路",
   "from": "pu-an-xian",
   "to": "pan-zhou",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 32.69,
   "polyline": [
    [
     104.86743,
     25.8058
    ],
    [
     104.84022,
     25.79791
    ],
    [
     104.80915,
     25.79431
    ],
    [
     104.79405,
     25.79591
    ],
    [
     104.74925,
     25.80563
    ],
    [
     104.69849,
     25.80878
    ],
    [
     104.6417,
     25.81745
    ],
    [
     104.62838,
     25.81805
    ],
    [
     104.61676,
     25.81679
    ],
    [
     104.60347,
     25.81293
    ],
    [
     104.55967,
     25.79154
    ],
    [
     104.56572,
     25.79541
    ]
   ]
  },
  {
   "id": "pan-zhou-fu-yuan-bei",
   "name": "沪昆高速铁路",
   "from": "pan-zhou",
   "to": "fu-yuan-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 31.96,
   "polyline": [
    [
     104.56572,
     25.79541
    ],
    [
     104.53242,
     25.77817
    ],
    [
     104.49844,
     25.76441
    ],
    [
     104.47825,
     25.7584
    ],
    [
     104.45902,
     25.75579
    ],
    [
     104.41298,
     25.75965
    ],
    [
     104.39102,
     25.75899
    ],
    [
     104.37319,
     25.75391
    ],
    [
     104.29483,
     25.72259
    ],
    [
     104.26855,
     25.7167
    ]
   ]
  },
  {
   "id": "fu-yuan-bei-che-zhuan-wan",
   "name": "沪昆高速铁路",
   "from": "fu-yuan-bei",
   "to": "che-zhuan-wan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 11.93,
   "polyline": [
    [
     104.26855,
     25.7167
    ],
    [
     104.24475,
     25.7134
    ],
    [
     104.19836,
     25.70291
    ],
    [
     104.15166,
     25.7026
    ]
   ]
  },
  {
   "id": "che-zhuan-wan-bai-shui-zhen",
   "name": "沪昆高速铁路",
   "from": "che-zhuan-wan",
   "to": "bai-shui-zhen",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 15.68,
   "polyline": [
    [
     104.15166,
     25.7026
    ],
    [
     104.13199,
     25.70032
    ],
    [
     104.08916,
     25.69038
    ],
    [
     104.04326,
     25.67556
    ],
    [
     104.00143,
     25.66532
    ]
   ]
  },
  {
   "id": "bai-shui-zhen-zhan-yi",
   "name": "沪昆高速铁路",
   "from": "bai-shui-zhen",
   "to": "zhan-yi",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 21.09,
   "polyline": [
    [
     104.00143,
     25.66532
    ],
    [
     103.90141,
     25.64376
    ],
    [
     103.86217,
     25.63041
    ],
    [
     103.8392,
     25.62575
    ],
    [
     103.82209,
     25.62063
    ],
    [
     103.80153,
     25.61021
    ]
   ]
  },
  {
   "id": "zhan-yi-qu-jing-bei",
   "name": "沪昆高速铁路",
   "from": "zhan-yi",
   "to": "qu-jing-bei",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 2.84,
   "polyline": [
    [
     103.80153,
     25.61021
    ],
    [
     103.78126,
     25.59249
    ]
   ]
  },
  {
   "id": "qu-jing-bei-ma-long",
   "name": "沪昆高速铁路",
   "from": "qu-jing-bei",
   "to": "ma-long",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 20.73,
   "polyline": [
    [
     103.78126,
     25.59249
    ],
    [
     103.74523,
     25.56382
    ],
    [
     103.71025,
     25.54688
    ],
    [
     103.64423,
     25.50166
    ],
    [
     103.63318,
     25.49555
    ],
    [
     103.62046,
     25.49078
    ]
   ]
  },
  {
   "id": "ma-long-ji-tou-cun",
   "name": "沪昆高速铁路",
   "from": "ma-long",
   "to": "ji-tou-cun",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 1.8,
   "polyline": [
    [
     103.62046,
     25.49078
    ],
    [
     103.60356,
     25.48548
    ]
   ]
  },
  {
   "id": "ji-tou-cun-xiao-xin-jie",
   "name": "沪昆高速铁路",
   "from": "ji-tou-cun",
   "to": "xiao-xin-jie",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 43.37,
   "polyline": [
    [
     103.60356,
     25.48548
    ],
    [
     103.57086,
     25.46942
    ],
    [
     103.54052,
     25.45708
    ],
    [
     103.48713,
     25.42107
    ],
    [
     103.43995,
     25.40105
    ],
    [
     103.39925,
     25.39176
    ],
    [
     103.37309,
     25.38233
    ],
    [
     103.31251,
     25.34531
    ],
    [
     103.22594,
     25.30353
    ]
   ]
  },
  {
   "id": "xiao-xin-jie-song-ming",
   "name": "沪昆高速铁路",
   "from": "xiao-xin-jie",
   "to": "song-ming",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 11.64,
   "polyline": [
    [
     103.22594,
     25.30353
    ],
    [
     103.19093,
     25.29049
    ],
    [
     103.17208,
     25.28028
    ],
    [
     103.15699,
     25.26752
    ],
    [
     103.13567,
     25.24257
    ]
   ]
  },
  {
   "id": "song-ming-kun-ming-nan",
   "name": "沪昆高速铁路",
   "from": "song-ming",
   "to": "kun-ming-nan",
   "lineIds": [
    "hukun-hsr"
   ],
   "serviceDate": "2016-12-28",
   "estLengthKm": 53.28,
   "polyline": [
    [
     103.13567,
     25.24257
    ],
    [
     103.05746,
     25.1541
    ],
    [
     103.04749,
     25.14599
    ],
    [
     102.98537,
     25.10449
    ],
    [
     102.90886,
     25.02423
    ],
    [
     102.89866,
     25.00577
    ],
    [
     102.88721,
     24.96856
    ],
    [
     102.86114,
     24.92779
    ],
    [
     102.85783,
     24.91998
    ],
    [
     102.85447,
     24.88842
    ],
    [
     102.86002,
     24.87109
    ],
    [
     102.86038,
     24.87336
    ]
   ]
  },
  {
   "id": "xu-zhou-dong-zhou-zhai-zi",
   "name": "徐兰高速铁路",
   "from": "xu-zhou-dong",
   "to": "zhou-zhai-zi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 13.12,
   "polyline": [
    [
     117.30021,
     34.26916
    ],
    [
     117.29248,
     34.2936
    ],
    [
     117.28815,
     34.3206
    ],
    [
     117.28236,
     34.33019
    ],
    [
     117.27274,
     34.33669
    ],
    [
     117.22396,
     34.35461
    ]
   ]
  },
  {
   "id": "zhou-zhai-zi-yang-tun",
   "name": "徐兰高速铁路",
   "from": "zhou-zhai-zi",
   "to": "yang-tun",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 6.97,
   "polyline": [
    [
     117.22396,
     34.35461
    ],
    [
     117.20727,
     34.35746
    ],
    [
     117.19093,
     34.35545
    ],
    [
     117.16902,
     34.34627
    ],
    [
     117.15514,
     34.33731
    ]
   ]
  },
  {
   "id": "yang-tun-nan-gang",
   "name": "徐兰高速铁路",
   "from": "yang-tun",
   "to": "nan-gang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 3.52,
   "polyline": [
    [
     117.15514,
     34.33731
    ],
    [
     117.13918,
     34.32612
    ],
    [
     117.12471,
     34.31815
    ]
   ]
  },
  {
   "id": "nan-gang-xiao-xian-bei",
   "name": "徐兰高速铁路",
   "from": "nan-gang",
   "to": "xiao-xian-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 21.42,
   "polyline": [
    [
     117.12471,
     34.31815
    ],
    [
     117.09763,
     34.3041
    ],
    [
     117.07112,
     34.28662
    ],
    [
     117.02863,
     34.26408
    ],
    [
     116.97726,
     34.2441
    ],
    [
     116.95839,
     34.24022
    ],
    [
     116.92722,
     34.23779
    ],
    [
     116.93624,
     34.23786
    ]
   ]
  },
  {
   "id": "xiao-xian-bei-yong-cheng-bei",
   "name": "徐兰高速铁路",
   "from": "xiao-xian-bei",
   "to": "yong-cheng-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 39.14,
   "polyline": [
    [
     116.93624,
     34.23786
    ],
    [
     116.88858,
     34.2346
    ],
    [
     116.80045,
     34.21845
    ],
    [
     116.57798,
     34.20743
    ],
    [
     116.55224,
     34.20894
    ],
    [
     116.51511,
     34.2178
    ]
   ]
  },
  {
   "id": "yong-cheng-bei-dang-shan-nan",
   "name": "徐兰高速铁路",
   "from": "yong-cheng-bei",
   "to": "dang-shan-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 28.36,
   "polyline": [
    [
     116.51511,
     34.2178
    ],
    [
     116.48327,
     34.22836
    ],
    [
     116.46817,
     34.23738
    ],
    [
     116.34547,
     34.35067
    ],
    [
     116.29787,
     34.38736
    ]
   ]
  },
  {
   "id": "dang-shan-nan-bei-dong-zha",
   "name": "徐兰高速铁路",
   "from": "dang-shan-nan",
   "to": "bei-dong-zha",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 56.58,
   "polyline": [
    [
     116.29787,
     34.38736
    ],
    [
     116.26646,
     34.41062
    ],
    [
     116.24273,
     34.42211
    ],
    [
     116.21461,
     34.42847
    ],
    [
     116.14947,
     34.43912
    ],
    [
     115.98128,
     34.43059
    ],
    [
     115.79856,
     34.43007
    ],
    [
     115.7288,
     34.42647
    ],
    [
     115.70768,
     34.42791
    ]
   ]
  },
  {
   "id": "bei-dong-zha-shang-qiu",
   "name": "徐兰高速铁路",
   "from": "bei-dong-zha",
   "to": "shang-qiu",
   "lineIds": [
    "xulan-hsr",
    "shanghehang-north"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 5.52,
   "polyline": [
    [
     115.70768,
     34.42791
    ],
    [
     115.67714,
     34.43645
    ],
    [
     115.65186,
     34.44606
    ]
   ]
  },
  {
   "id": "shang-qiu-min-quan-bei",
   "name": "徐兰高速铁路",
   "from": "shang-qiu",
   "to": "min-quan-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 52.53,
   "polyline": [
    [
     115.65186,
     34.44606
    ],
    [
     115.52131,
     34.50132
    ],
    [
     115.48838,
     34.51308
    ],
    [
     115.3321,
     34.57887
    ],
    [
     115.25676,
     34.61686
    ],
    [
     115.20517,
     34.64908
    ],
    [
     115.17451,
     34.66119
    ]
   ]
  },
  {
   "id": "min-quan-bei-lan-kao-nan",
   "name": "徐兰高速铁路",
   "from": "min-quan-bei",
   "to": "lan-kao-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 35.61,
   "polyline": [
    [
     115.17451,
     34.66119
    ],
    [
     115.10501,
     34.68924
    ],
    [
     115.02562,
     34.70735
    ],
    [
     114.86171,
     34.75565
    ],
    [
     114.8183,
     34.77202
    ]
   ]
  },
  {
   "id": "lan-kao-nan-luo-wang",
   "name": "徐兰高速铁路",
   "from": "lan-kao-nan",
   "to": "luo-wang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 13.4,
   "polyline": [
    [
     114.8183,
     34.77202
    ],
    [
     114.79123,
     34.78147
    ],
    [
     114.76095,
     34.79773
    ],
    [
     114.74666,
     34.80325
    ],
    [
     114.72179,
     34.80686
    ],
    [
     114.68219,
     34.80302
    ]
   ]
  },
  {
   "id": "luo-wang-kai-feng-bei",
   "name": "徐兰高速铁路",
   "from": "luo-wang",
   "to": "kai-feng-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 39.54,
   "polyline": [
    [
     114.68219,
     34.80302
    ],
    [
     114.64971,
     34.7993
    ],
    [
     114.63228,
     34.79927
    ],
    [
     114.56921,
     34.80757
    ],
    [
     114.47164,
     34.82171
    ],
    [
     114.43755,
     34.82889
    ],
    [
     114.39664,
     34.84118
    ],
    [
     114.37998,
     34.84389
    ],
    [
     114.30041,
     34.84429
    ],
    [
     114.25605,
     34.84064
    ]
   ]
  },
  {
   "id": "kai-feng-bei-zheng-zhou-dong",
   "name": "徐兰高速铁路",
   "from": "kai-feng-bei",
   "to": "zheng-zhou-dong",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 52.24,
   "polyline": [
    [
     114.25605,
     34.84064
    ],
    [
     114.17884,
     34.83501
    ],
    [
     114.05132,
     34.81974
    ],
    [
     114.02548,
     34.82296
    ],
    [
     113.98324,
     34.84129
    ],
    [
     113.96174,
     34.84526
    ],
    [
     113.81861,
     34.83563
    ],
    [
     113.78525,
     34.82912
    ],
    [
     113.77686,
     34.82419
    ],
    [
     113.77169,
     34.81798
    ],
    [
     113.76921,
     34.80845
    ],
    [
     113.77325,
     34.76019
    ]
   ]
  },
  {
   "id": "zheng-zhou-dong-zheng-zhou-xi",
   "name": "徐兰高速铁路",
   "from": "zheng-zhou-dong",
   "to": "zheng-zhou-xi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 42.23,
   "polyline": [
    [
     113.77325,
     34.76019
    ],
    [
     113.77469,
     34.73506
    ],
    [
     113.77918,
     34.71568
    ],
    [
     113.77728,
     34.70857
    ],
    [
     113.76737,
     34.69208
    ],
    [
     113.76008,
     34.68686
    ],
    [
     113.74558,
     34.68144
    ],
    [
     113.69534,
     34.67056
    ],
    [
     113.66743,
     34.67034
    ],
    [
     113.64965,
     34.67373
    ],
    [
     113.60051,
     34.69698
    ],
    [
     113.54988,
     34.71023
    ],
    [
     113.47932,
     34.73733
    ],
    [
     113.45931,
     34.74119
    ],
    [
     113.41629,
     34.74472
    ]
   ]
  },
  {
   "id": "zheng-zhou-xi-gong-yi-nan",
   "name": "徐兰高速铁路",
   "from": "zheng-zhou-xi",
   "to": "gong-yi-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 50.15,
   "polyline": [
    [
     113.41629,
     34.74472
    ],
    [
     113.36504,
     34.74882
    ],
    [
     113.31701,
     34.7577
    ],
    [
     113.21428,
     34.76198
    ],
    [
     113.1939,
     34.76426
    ],
    [
     113.15354,
     34.77282
    ],
    [
     113.1167,
     34.77571
    ],
    [
     113.10433,
     34.77508
    ],
    [
     113.08639,
     34.77087
    ],
    [
     113.06892,
     34.76338
    ],
    [
     113.00359,
     34.71577
    ],
    [
     112.99111,
     34.70873
    ],
    [
     112.91056,
     34.67169
    ]
   ]
  },
  {
   "id": "gong-yi-nan-luo-yang-long-men",
   "name": "徐兰高速铁路",
   "from": "gong-yi-nan",
   "to": "luo-yang-long-men",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 44.63,
   "polyline": [
    [
     112.91056,
     34.67169
    ],
    [
     112.87657,
     34.65542
    ],
    [
     112.85223,
     34.64863
    ],
    [
     112.8368,
     34.64716
    ],
    [
     112.72806,
     34.64641
    ],
    [
     112.70707,
     34.64175
    ],
    [
     112.676,
     34.62871
    ],
    [
     112.65949,
     34.62416
    ],
    [
     112.5984,
     34.61686
    ],
    [
     112.53437,
     34.61261
    ],
    [
     112.45269,
     34.59428
    ]
   ]
  },
  {
   "id": "luo-yang-long-men-li-tun",
   "name": "徐兰高速铁路",
   "from": "luo-yang-long-men",
   "to": "li-tun",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 5.09,
   "polyline": [
    [
     112.45269,
     34.59428
    ],
    [
     112.42334,
     34.58707
    ],
    [
     112.40964,
     34.58185
    ]
   ]
  },
  {
   "id": "li-tun-mian-chi-nan",
   "name": "徐兰高速铁路",
   "from": "li-tun",
   "to": "mian-chi-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 60.12,
   "polyline": [
    [
     112.40964,
     34.58185
    ],
    [
     112.39273,
     34.57501
    ],
    [
     112.37955,
     34.57206
    ],
    [
     112.3634,
     34.57115
    ],
    [
     112.35047,
     34.57247
    ],
    [
     112.31084,
     34.58285
    ],
    [
     112.14421,
     34.61235
    ],
    [
     112.09458,
     34.62932
    ],
    [
     112.06619,
     34.64136
    ],
    [
     111.98972,
     34.66424
    ],
    [
     111.97059,
     34.6664
    ],
    [
     111.90227,
     34.66453
    ],
    [
     111.88782,
     34.66537
    ],
    [
     111.82606,
     34.6773
    ],
    [
     111.77756,
     34.68459
    ]
   ]
  },
  {
   "id": "mian-chi-nan-jiao-kou",
   "name": "徐兰高速铁路",
   "from": "mian-chi-nan",
   "to": "jiao-kou",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 47.35,
   "polyline": [
    [
     111.77756,
     34.68459
    ],
    [
     111.7455,
     34.68932
    ],
    [
     111.73122,
     34.69002
    ],
    [
     111.62547,
     34.6843
    ],
    [
     111.60996,
     34.68608
    ],
    [
     111.55376,
     34.69931
    ],
    [
     111.51666,
     34.70207
    ],
    [
     111.4604,
     34.70949
    ],
    [
     111.31754,
     34.70692
    ],
    [
     111.2865,
     34.71095
    ],
    [
     111.26658,
     34.71725
    ]
   ]
  },
  {
   "id": "jiao-kou-he-jia-zhuang",
   "name": "徐兰高速铁路",
   "from": "jiao-kou",
   "to": "he-jia-zhuang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 6.41,
   "polyline": [
    [
     111.26658,
     34.71725
    ],
    [
     111.25235,
     34.72316
    ],
    [
     111.22185,
     34.7412
    ],
    [
     111.20713,
     34.74746
    ]
   ]
  },
  {
   "id": "he-jia-zhuang-san-men-xia-nan",
   "name": "徐兰高速铁路",
   "from": "he-jia-zhuang",
   "to": "san-men-xia-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 4.94,
   "polyline": [
    [
     111.20713,
     34.74746
    ],
    [
     111.1923,
     34.75067
    ],
    [
     111.18,
     34.75166
    ],
    [
     111.15422,
     34.74959
    ]
   ]
  },
  {
   "id": "san-men-xia-nan-ling-bao-xi",
   "name": "徐兰高速铁路",
   "from": "san-men-xia-nan",
   "to": "ling-bao-xi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 48.17,
   "polyline": [
    [
     111.15422,
     34.74959
    ],
    [
     111.12083,
     34.74466
    ],
    [
     111.05812,
     34.73186
    ],
    [
     111.04096,
     34.72818
    ],
    [
     111.02165,
     34.72141
    ],
    [
     111.0012,
     34.7089
    ],
    [
     110.96284,
     34.67654
    ],
    [
     110.92792,
     34.65517
    ],
    [
     110.86037,
     34.61967
    ],
    [
     110.78194,
     34.59329
    ],
    [
     110.68379,
     34.57765
    ]
   ]
  },
  {
   "id": "ling-bao-xi-gong-zhuang",
   "name": "徐兰高速铁路",
   "from": "ling-bao-xi",
   "to": "gong-zhuang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 44.75,
   "polyline": [
    [
     110.68379,
     34.57765
    ],
    [
     110.65004,
     34.57351
    ],
    [
     110.59635,
     34.57808
    ],
    [
     110.54376,
     34.57469
    ],
    [
     110.50458,
     34.57542
    ],
    [
     110.4479,
     34.56855
    ],
    [
     110.40206,
     34.57224
    ],
    [
     110.35346,
     34.5729
    ],
    [
     110.33287,
     34.57648
    ],
    [
     110.27877,
     34.59195
    ],
    [
     110.2401,
     34.6013
    ],
    [
     110.22367,
     34.60339
    ],
    [
     110.20298,
     34.60224
    ]
   ]
  },
  {
   "id": "gong-zhuang-hua-shan-bei",
   "name": "徐兰高速铁路",
   "from": "gong-zhuang",
   "to": "hua-shan-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 10.39,
   "polyline": [
    [
     110.20298,
     34.60224
    ],
    [
     110.14786,
     34.59365
    ],
    [
     110.11943,
     34.5864
    ],
    [
     110.09303,
     34.5832
    ]
   ]
  },
  {
   "id": "hua-shan-bei-liu-zhi",
   "name": "徐兰高速铁路",
   "from": "hua-shan-bei",
   "to": "liu-zhi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 19.43,
   "polyline": [
    [
     110.09303,
     34.5832
    ],
    [
     110.06157,
     34.58019
    ],
    [
     110.04535,
     34.57501
    ],
    [
     110.00865,
     34.55933
    ],
    [
     109.99403,
     34.55495
    ],
    [
     109.94805,
     34.54765
    ],
    [
     109.91263,
     34.53805
    ],
    [
     109.89082,
     34.53693
    ]
   ]
  },
  {
   "id": "liu-zhi-wei-nan-bei",
   "name": "徐兰高速铁路",
   "from": "liu-zhi",
   "to": "wei-nan-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 38.6,
   "polyline": [
    [
     109.89082,
     34.53693
    ],
    [
     109.86644,
     34.53723
    ],
    [
     109.80032,
     34.52809
    ],
    [
     109.72194,
     34.52298
    ],
    [
     109.70604,
     34.52412
    ],
    [
     109.56152,
     34.54975
    ],
    [
     109.53456,
     34.54912
    ],
    [
     109.4759,
     34.53717
    ]
   ]
  },
  {
   "id": "wei-nan-bei-xin-feng-zhen",
   "name": "徐兰高速铁路",
   "from": "wei-nan-bei",
   "to": "xin-feng-zhen",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 22.07,
   "polyline": [
    [
     109.4759,
     34.53717
    ],
    [
     109.38368,
     34.5176
    ],
    [
     109.36278,
     34.5101
    ],
    [
     109.34368,
     34.49822
    ],
    [
     109.29379,
     34.45465
    ],
    [
     109.27255,
     34.44247
    ]
   ]
  },
  {
   "id": "xin-feng-zhen-lin-tong-dong",
   "name": "徐兰高速铁路",
   "from": "xin-feng-zhen",
   "to": "lin-tong-dong",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 1.91,
   "polyline": [
    [
     109.27255,
     34.44247
    ],
    [
     109.25378,
     34.43507
    ]
   ]
  },
  {
   "id": "lin-tong-dong-xing-zhe",
   "name": "徐兰高速铁路",
   "from": "lin-tong-dong",
   "to": "xing-zhe",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 6.76,
   "polyline": [
    [
     109.25378,
     34.43507
    ],
    [
     109.18721,
     34.40917
    ]
   ]
  },
  {
   "id": "xing-zhe-san-yi-cun",
   "name": "徐兰高速铁路",
   "from": "xing-zhe",
   "to": "san-yi-cun",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 8.92,
   "polyline": [
    [
     109.18721,
     34.40917
    ],
    [
     109.16968,
     34.40425
    ],
    [
     109.15154,
     34.40215
    ],
    [
     109.10568,
     34.40609
    ],
    [
     109.09157,
     34.40607
    ]
   ]
  },
  {
   "id": "san-yi-cun-xi-an-bei",
   "name": "徐兰高速铁路",
   "from": "san-yi-cun",
   "to": "xi-an-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 14.91,
   "polyline": [
    [
     109.09157,
     34.40607
    ],
    [
     108.98311,
     34.3891
    ],
    [
     108.93403,
     34.37767
    ]
   ]
  },
  {
   "id": "xi-an-bei-xian-yang",
   "name": "徐兰高速铁路",
   "from": "xi-an-bei",
   "to": "xian-yang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 19.31,
   "polyline": [
    [
     108.93403,
     34.37767
    ],
    [
     108.82962,
     34.3508
    ],
    [
     108.7568,
     34.34215
    ],
    [
     108.74734,
     34.34287
    ],
    [
     108.73051,
     34.34725
    ]
   ]
  },
  {
   "id": "xian-yang-xian-yang-xi",
   "name": "徐兰高速铁路",
   "from": "xian-yang",
   "to": "xian-yang-xi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 6.1,
   "polyline": [
    [
     108.73051,
     34.34725
    ],
    [
     108.71271,
     34.34686
    ],
    [
     108.66694,
     34.33379
    ]
   ]
  },
  {
   "id": "xian-yang-xi-mao-ling",
   "name": "徐兰高速铁路",
   "from": "xian-yang-xi",
   "to": "mao-ling",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 5.79,
   "polyline": [
    [
     108.66694,
     34.33379
    ],
    [
     108.60748,
     34.31667
    ]
   ]
  },
  {
   "id": "mao-ling-yang-ling-nan",
   "name": "徐兰高速铁路",
   "from": "mao-ling",
   "to": "yang-ling-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 54.13,
   "polyline": [
    [
     108.60748,
     34.31667
    ],
    [
     108.58871,
     34.31143
    ],
    [
     108.55897,
     34.3073
    ],
    [
     108.54406,
     34.30251
    ],
    [
     108.52672,
     34.29233
    ],
    [
     108.50323,
     34.26857
    ],
    [
     108.48843,
     34.25889
    ],
    [
     108.44788,
     34.24491
    ],
    [
     108.42696,
     34.24034
    ],
    [
     108.22658,
     34.24126
    ],
    [
     108.13666,
     34.2468
    ],
    [
     108.07004,
     34.25476
    ],
    [
     108.04832,
     34.2556
    ]
   ]
  },
  {
   "id": "yang-ling-nan-qi-shan",
   "name": "徐兰高速铁路",
   "from": "yang-ling-nan",
   "to": "qi-shan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 40.98,
   "polyline": [
    [
     108.04832,
     34.2556
    ],
    [
     107.99657,
     34.25885
    ],
    [
     107.93308,
     34.25641
    ],
    [
     107.91473,
     34.2591
    ],
    [
     107.88804,
     34.26584
    ],
    [
     107.86807,
     34.26752
    ],
    [
     107.85481,
     34.26648
    ],
    [
     107.78478,
     34.25493
    ],
    [
     107.76816,
     34.25454
    ],
    [
     107.67925,
     34.2679
    ],
    [
     107.62803,
     34.27189
    ],
    [
     107.60833,
     34.27568
    ]
   ]
  },
  {
   "id": "qi-shan-bao-ji-nan",
   "name": "徐兰高速铁路",
   "from": "qi-shan",
   "to": "bao-ji-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 36.76,
   "polyline": [
    [
     107.60833,
     34.27568
    ],
    [
     107.52717,
     34.29172
    ],
    [
     107.47391,
     34.29633
    ],
    [
     107.4612,
     34.29866
    ],
    [
     107.44488,
     34.30478
    ],
    [
     107.41018,
     34.3248
    ],
    [
     107.38839,
     34.33078
    ],
    [
     107.3462,
     34.33171
    ],
    [
     107.30882,
     34.33631
    ],
    [
     107.27536,
     34.33403
    ],
    [
     107.22787,
     34.33564
    ]
   ]
  },
  {
   "id": "bao-ji-nan-ren-jia-wan",
   "name": "徐兰高速铁路",
   "from": "bao-ji-nan",
   "to": "ren-jia-wan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 11.94,
   "polyline": [
    [
     107.22787,
     34.33564
    ],
    [
     107.1888,
     34.33528
    ],
    [
     107.1497,
     34.3314
    ],
    [
     107.13228,
     34.33335
    ],
    [
     107.10017,
     34.34137
    ]
   ]
  },
  {
   "id": "ren-jia-wan-dong-kou",
   "name": "徐兰高速铁路",
   "from": "ren-jia-wan",
   "to": "dong-kou",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 37.47,
   "polyline": [
    [
     107.10017,
     34.34137
    ],
    [
     107.08008,
     34.34383
    ],
    [
     106.94347,
     34.34566
    ],
    [
     106.85938,
     34.34891
    ],
    [
     106.8002,
     34.35273
    ],
    [
     106.69367,
     34.36477
    ]
   ]
  },
  {
   "id": "dong-kou-dong-cha",
   "name": "徐兰高速铁路",
   "from": "dong-kou",
   "to": "dong-cha",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 16.74,
   "polyline": [
    [
     106.69367,
     34.36477
    ],
    [
     106.66556,
     34.37478
    ],
    [
     106.61157,
     34.40337
    ],
    [
     106.5779,
     34.42877
    ],
    [
     106.5394,
     34.4421
    ]
   ]
  },
  {
   "id": "dong-cha-she-tang",
   "name": "徐兰高速铁路",
   "from": "dong-cha",
   "to": "she-tang",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 52.51,
   "polyline": [
    [
     106.5394,
     34.4421
    ],
    [
     106.51765,
     34.44754
    ],
    [
     106.4988,
     34.4496
    ],
    [
     106.3984,
     34.44948
    ],
    [
     106.35956,
     34.45401
    ],
    [
     106.18167,
     34.50061
    ],
    [
     106.15168,
     34.50994
    ],
    [
     106.08599,
     34.53379
    ],
    [
     106.01229,
     34.55152
    ],
    [
     105.98859,
     34.55143
    ]
   ]
  },
  {
   "id": "she-tang-tian-shui-nan",
   "name": "徐兰高速铁路",
   "from": "she-tang",
   "to": "tian-shui-nan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 13.18,
   "polyline": [
    [
     105.98859,
     34.55143
    ],
    [
     105.91259,
     34.54206
    ],
    [
     105.896,
     34.54126
    ],
    [
     105.87811,
     34.54353
    ],
    [
     105.85232,
     34.55102
    ]
   ]
  },
  {
   "id": "tian-shui-nan-nan-he-chuan",
   "name": "徐兰高速铁路",
   "from": "tian-shui-nan",
   "to": "nan-he-chuan",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 12.22,
   "polyline": [
    [
     105.85232,
     34.55102
    ],
    [
     105.81789,
     34.56048
    ],
    [
     105.79846,
     34.57051
    ],
    [
     105.78432,
     34.58273
    ],
    [
     105.75988,
     34.62164
    ]
   ]
  },
  {
   "id": "nan-he-chuan-qin-an",
   "name": "徐兰高速铁路",
   "from": "nan-he-chuan",
   "to": "qin-an",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 28.11,
   "polyline": [
    [
     105.75988,
     34.62164
    ],
    [
     105.7524,
     34.62997
    ],
    [
     105.73473,
     34.64469
    ],
    [
     105.68904,
     34.68806
    ],
    [
     105.68108,
     34.69781
    ],
    [
     105.67539,
     34.70799
    ],
    [
     105.67,
     34.72785
    ],
    [
     105.66263,
     34.78946
    ],
    [
     105.65396,
     34.8174
    ],
    [
     105.65313,
     34.83258
    ],
    [
     105.65518,
     34.84719
    ]
   ]
  },
  {
   "id": "qin-an-tong-wei",
   "name": "徐兰高速铁路",
   "from": "qin-an",
   "to": "tong-wei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 55.91,
   "polyline": [
    [
     105.65518,
     34.84719
    ],
    [
     105.65689,
     34.87167
    ],
    [
     105.65534,
     34.88488
    ],
    [
     105.64695,
     34.90651
    ],
    [
     105.63528,
     34.92047
    ],
    [
     105.61756,
     34.93373
    ],
    [
     105.57605,
     34.95341
    ],
    [
     105.56029,
     34.96477
    ],
    [
     105.52296,
     35.00286
    ],
    [
     105.50274,
     35.03042
    ],
    [
     105.394,
     35.11751
    ],
    [
     105.38781,
     35.12416
    ],
    [
     105.36778,
     35.15313
    ],
    [
     105.35375,
     35.16598
    ],
    [
     105.33438,
     35.17663
    ],
    [
     105.29557,
     35.19069
    ],
    [
     105.28129,
     35.19403
    ],
    [
     105.25938,
     35.19626
    ]
   ]
  },
  {
   "id": "tong-wei-xia-xiao-cha",
   "name": "徐兰高速铁路",
   "from": "tong-wei",
   "to": "xia-xiao-cha",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 36.55,
   "polyline": [
    [
     105.25938,
     35.19626
    ],
    [
     105.23565,
     35.19734
    ],
    [
     105.21456,
     35.20154
    ],
    [
     105.14713,
     35.22577
    ],
    [
     105.12283,
     35.23614
    ],
    [
     105.11019,
     35.24517
    ],
    [
     105.08813,
     35.26732
    ],
    [
     105.04922,
     35.29442
    ],
    [
     105.01718,
     35.3196
    ],
    [
     104.93821,
     35.3645
    ]
   ]
  },
  {
   "id": "xia-xiao-cha-ding-xi-bei",
   "name": "徐兰高速铁路",
   "from": "xia-xiao-cha",
   "to": "ding-xi-bei",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 44.52,
   "polyline": [
    [
     104.93821,
     35.3645
    ],
    [
     104.80434,
     35.43959
    ],
    [
     104.79182,
     35.44462
    ],
    [
     104.76606,
     35.45099
    ],
    [
     104.70887,
     35.46991
    ],
    [
     104.6353,
     35.5142
    ],
    [
     104.61926,
     35.52741
    ],
    [
     104.60724,
     35.54207
    ],
    [
     104.60132,
     35.55429
    ],
    [
     104.59331,
     35.58456
    ],
    [
     104.58343,
     35.60681
    ]
   ]
  },
  {
   "id": "ding-xi-bei-yu-zhong",
   "name": "徐兰高速铁路",
   "from": "ding-xi-bei",
   "to": "yu-zhong",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 47.26,
   "polyline": [
    [
     104.58343,
     35.60681
    ],
    [
     104.5661,
     35.63334
    ],
    [
     104.55735,
     35.64195
    ],
    [
     104.5479,
     35.64853
    ],
    [
     104.53595,
     35.65466
    ],
    [
     104.48201,
     35.67583
    ],
    [
     104.45282,
     35.68956
    ],
    [
     104.28599,
     35.77457
    ],
    [
     104.22005,
     35.818
    ],
    [
     104.19523,
     35.83227
    ],
    [
     104.16592,
     35.8541
    ]
   ]
  },
  {
   "id": "yu-zhong-lan-zhou-xi",
   "name": "徐兰高速铁路",
   "from": "yu-zhong",
   "to": "lan-zhou-xi",
   "lineIds": [
    "xulan-hsr"
   ],
   "serviceDate": "2017-07-09",
   "estLengthKm": 46.78,
   "polyline": [
    [
     104.16592,
     35.8541
    ],
    [
     104.14623,
     35.86828
    ],
    [
     104.0667,
     35.91477
    ],
    [
     104.05244,
     35.92
    ],
    [
     104.01458,
     35.9283
    ],
    [
     103.99812,
     35.93398
    ],
    [
     103.85003,
     36.00101
    ],
    [
     103.83419,
     36.00541
    ],
    [
     103.80656,
     36.00858
    ],
    [
     103.79704,
     36.01188
    ],
    [
     103.78888,
     36.01809
    ],
    [
     103.78433,
     36.02592
    ],
    [
     103.78002,
     36.0419
    ],
    [
     103.7809,
     36.05222
    ],
    [
     103.77958,
     36.05819
    ],
    [
     103.77219,
     36.06356
    ],
    [
     103.74928,
     36.06758
    ]
   ]
  },
  {
   "id": "lan-zhou-xi-chen-jia-wan-xi",
   "name": "兰新高速铁路",
   "from": "lan-zhou-xi",
   "to": "chen-jia-wan-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 50.83,
   "polyline": [
    [
     103.74928,
     36.06758
    ],
    [
     103.70411,
     36.07044
    ],
    [
     103.6756,
     36.06902
    ],
    [
     103.63821,
     36.06926
    ],
    [
     103.62503,
     36.07151
    ],
    [
     103.59874,
     36.08056
    ],
    [
     103.58727,
     36.08307
    ],
    [
     103.49691,
     36.09526
    ],
    [
     103.36252,
     36.11064
    ],
    [
     103.23136,
     36.14978
    ],
    [
     103.20348,
     36.1638
    ]
   ]
  },
  {
   "id": "chen-jia-wan-xi-hua-zhuang",
   "name": "兰新高速铁路",
   "from": "chen-jia-wan-xi",
   "to": "hua-zhuang",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 4.71,
   "polyline": [
    [
     103.20348,
     36.1638
    ],
    [
     103.16053,
     36.18793
    ]
   ]
  },
  {
   "id": "hua-zhuang-min-he-nan",
   "name": "兰新高速铁路",
   "from": "hua-zhuang",
   "to": "min-he-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 30.92,
   "polyline": [
    [
     103.16053,
     36.18793
    ],
    [
     103.13611,
     36.19758
    ],
    [
     103.11312,
     36.20318
    ],
    [
     103.08265,
     36.21359
    ],
    [
     103.01169,
     36.24505
    ],
    [
     102.9644,
     36.25945
    ],
    [
     102.91961,
     36.28454
    ],
    [
     102.90245,
     36.29234
    ],
    [
     102.8507,
     36.30521
    ]
   ]
  },
  {
   "id": "min-he-nan-hai-dong",
   "name": "兰新高速铁路",
   "from": "min-he-nan",
   "to": "hai-dong",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 46.05,
   "polyline": [
    [
     102.8507,
     36.30521
    ],
    [
     102.80689,
     36.31735
    ],
    [
     102.76873,
     36.32346
    ],
    [
     102.74739,
     36.32941
    ],
    [
     102.72814,
     36.33694
    ],
    [
     102.70029,
     36.3523
    ],
    [
     102.55383,
     36.41733
    ],
    [
     102.54274,
     36.42052
    ],
    [
     102.52832,
     36.41963
    ],
    [
     102.51929,
     36.42067
    ],
    [
     102.50111,
     36.43306
    ],
    [
     102.45787,
     36.44863
    ],
    [
     102.42569,
     36.4619
    ],
    [
     102.41222,
     36.46504
    ],
    [
     102.38577,
     36.46743
    ]
   ]
  },
  {
   "id": "hai-dong-da-xia",
   "name": "兰新高速铁路",
   "from": "hai-dong",
   "to": "da-xia",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 15.18,
   "polyline": [
    [
     102.38577,
     36.46743
    ],
    [
     102.339,
     36.4714
    ],
    [
     102.31039,
     36.47103
    ],
    [
     102.27588,
     36.47512
    ],
    [
     102.21704,
     36.47378
    ]
   ]
  },
  {
   "id": "da-xia-ping-an-yi",
   "name": "兰新高速铁路",
   "from": "da-xia",
   "to": "ping-an-yi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 10.5,
   "polyline": [
    [
     102.21704,
     36.47378
    ],
    [
     102.19241,
     36.4785
    ],
    [
     102.15494,
     36.49407
    ],
    [
     102.10796,
     36.50723
    ]
   ]
  },
  {
   "id": "ping-an-yi-hai-dong-xi",
   "name": "兰新高速铁路",
   "from": "ping-an-yi",
   "to": "hai-dong-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 4.9,
   "polyline": [
    [
     102.10796,
     36.50723
    ],
    [
     102.08833,
     36.5095
    ],
    [
     102.05352,
     36.50948
    ]
   ]
  },
  {
   "id": "hai-dong-xi-xi-ning-dong",
   "name": "兰新高速铁路",
   "from": "hai-dong-xi",
   "to": "xi-ning-dong",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 18.33,
   "polyline": [
    [
     102.05352,
     36.50948
    ],
    [
     102.01894,
     36.51211
    ],
    [
     101.98228,
     36.52306
    ],
    [
     101.94171,
     36.54559
    ],
    [
     101.92001,
     36.55608
    ],
    [
     101.89566,
     36.57247
    ],
    [
     101.88461,
     36.57833
    ]
   ]
  },
  {
   "id": "xi-ning-dong-xi-ning",
   "name": "兰新高速铁路",
   "from": "xi-ning-dong",
   "to": "xi-ning",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 8.11,
   "polyline": [
    [
     101.88461,
     36.57833
    ],
    [
     101.84428,
     36.59397
    ],
    [
     101.83292,
     36.60213
    ],
    [
     101.81304,
     36.62076
    ]
   ]
  },
  {
   "id": "xi-ning-xiao-qiao",
   "name": "兰新高速铁路",
   "from": "xi-ning",
   "to": "xiao-qiao",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 3.64,
   "polyline": [
    [
     101.81304,
     36.62076
    ],
    [
     101.79129,
     36.64234
    ]
   ]
  },
  {
   "id": "xiao-qiao-xi-ning-bei",
   "name": "兰新高速铁路",
   "from": "xiao-qiao",
   "to": "xi-ning-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 2.92,
   "polyline": [
    [
     101.79129,
     36.64234
    ],
    [
     101.78152,
     36.65482
    ],
    [
     101.77592,
     36.66537
    ]
   ]
  },
  {
   "id": "xi-ning-bei-da-tong-xi",
   "name": "兰新高速铁路",
   "from": "xi-ning-bei",
   "to": "da-tong-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 36.29,
   "polyline": [
    [
     101.77592,
     36.66537
    ],
    [
     101.77009,
     36.68024
    ],
    [
     101.76842,
     36.6904
    ],
    [
     101.77009,
     36.71344
    ],
    [
     101.76834,
     36.73869
    ],
    [
     101.77355,
     36.7653
    ],
    [
     101.7746,
     36.78235
    ],
    [
     101.77326,
     36.80856
    ],
    [
     101.76187,
     36.8582
    ],
    [
     101.74726,
     36.88427
    ],
    [
     101.73737,
     36.89838
    ],
    [
     101.71911,
     36.91503
    ],
    [
     101.70739,
     36.92787
    ],
    [
     101.69339,
     36.94842
    ],
    [
     101.67176,
     36.966
    ]
   ]
  },
  {
   "id": "da-tong-xi-men-yuan",
   "name": "兰新高速铁路",
   "from": "da-tong-xi",
   "to": "men-yuan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 56.16,
   "polyline": [
    [
     101.67176,
     36.966
    ],
    [
     101.65665,
     36.97765
    ],
    [
     101.64631,
     36.9878
    ],
    [
     101.63866,
     36.99874
    ],
    [
     101.63026,
     37.01596
    ],
    [
     101.62053,
     37.05093
    ],
    [
     101.61815,
     37.06887
    ],
    [
     101.60673,
     37.12309
    ],
    [
     101.58712,
     37.18102
    ],
    [
     101.58607,
     37.19561
    ],
    [
     101.58841,
     37.21686
    ],
    [
     101.59362,
     37.23837
    ],
    [
     101.60611,
     37.27233
    ],
    [
     101.60888,
     37.28758
    ],
    [
     101.60922,
     37.30177
    ],
    [
     101.60665,
     37.31446
    ],
    [
     101.59969,
     37.3302
    ],
    [
     101.55976,
     37.39932
    ],
    [
     101.55053,
     37.41016
    ],
    [
     101.52625,
     37.42653
    ]
   ]
  },
  {
   "id": "men-yuan-hao-men",
   "name": "兰新高速铁路",
   "from": "men-yuan",
   "to": "hao-men",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 19.39,
   "polyline": [
    [
     101.52625,
     37.42653
    ],
    [
     101.50883,
     37.43828
    ],
    [
     101.49597,
     37.45077
    ],
    [
     101.4651,
     37.5008
    ],
    [
     101.45201,
     37.52312
    ],
    [
     101.44765,
     37.53388
    ],
    [
     101.43907,
     37.5734
    ]
   ]
  },
  {
   "id": "hao-men-shan-dan-ma-chang",
   "name": "兰新高速铁路",
   "from": "hao-men",
   "to": "shan-dan-ma-chang",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 62.62,
   "polyline": [
    [
     101.43907,
     37.5734
    ],
    [
     101.43187,
     37.60515
    ],
    [
     101.42356,
     37.62144
    ],
    [
     101.39843,
     37.64689
    ],
    [
     101.36617,
     37.66917
    ],
    [
     101.35229,
     37.68155
    ],
    [
     101.34287,
     37.69412
    ],
    [
     101.32066,
     37.73062
    ],
    [
     101.31675,
     37.74276
    ],
    [
     101.30701,
     37.80308
    ],
    [
     101.30431,
     37.81219
    ],
    [
     101.28184,
     37.87426
    ],
    [
     101.25996,
     37.91342
    ],
    [
     101.24563,
     37.95171
    ],
    [
     101.24086,
     37.99052
    ],
    [
     101.24004,
     38.02084
    ],
    [
     101.23551,
     38.04176
    ],
    [
     101.2276,
     38.05783
    ],
    [
     101.20653,
     38.09084
    ]
   ]
  },
  {
   "id": "shan-dan-ma-chang-min-yue",
   "name": "兰新高速铁路",
   "from": "shan-dan-ma-chang",
   "to": "min-yue",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 54.58,
   "polyline": [
    [
     101.20653,
     38.09084
    ],
    [
     101.11918,
     38.22744
    ],
    [
     101.10863,
     38.24041
    ],
    [
     101.09395,
     38.25243
    ],
    [
     101.03342,
     38.28735
    ],
    [
     101.01938,
     38.29767
    ],
    [
     100.94497,
     38.37394
    ],
    [
     100.90123,
     38.43715
    ],
    [
     100.88806,
     38.45114
    ],
    [
     100.86772,
     38.46377
    ],
    [
     100.83741,
     38.4736
    ]
   ]
  },
  {
   "id": "min-yue-zhang-ye-xi",
   "name": "兰新高速铁路",
   "from": "min-yue",
   "to": "zhang-ye-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 63.22,
   "polyline": [
    [
     100.83741,
     38.4736
    ],
    [
     100.81326,
     38.48121
    ],
    [
     100.7973,
     38.48886
    ],
    [
     100.78101,
     38.50144
    ],
    [
     100.77303,
     38.51047
    ],
    [
     100.76703,
     38.52079
    ],
    [
     100.7421,
     38.59502
    ],
    [
     100.73488,
     38.60899
    ],
    [
     100.59952,
     38.78871
    ],
    [
     100.58373,
     38.8138
    ],
    [
     100.57375,
     38.82676
    ],
    [
     100.55964,
     38.83938
    ],
    [
     100.47857,
     38.88743
    ],
    [
     100.42655,
     38.9225
    ]
   ]
  },
  {
   "id": "zhang-ye-xi-lin-ze-nan",
   "name": "兰新高速铁路",
   "from": "zhang-ye-xi",
   "to": "lin-ze-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 36.81,
   "polyline": [
    [
     100.42655,
     38.9225
    ],
    [
     100.43279,
     38.91741
    ],
    [
     100.40031,
     38.93868
    ],
    [
     100.2943,
     39.00131
    ],
    [
     100.12299,
     39.13319
    ]
   ]
  },
  {
   "id": "lin-ze-nan-xin-hua-zhuang",
   "name": "兰新高速铁路",
   "from": "lin-ze-nan",
   "to": "xin-hua-zhuang",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 10.01,
   "polyline": [
    [
     100.12299,
     39.13319
    ],
    [
     100.08371,
     39.16264
    ],
    [
     100.07186,
     39.16952
    ],
    [
     100.05033,
     39.17736
    ],
    [
     100.02817,
     39.1806
    ]
   ]
  },
  {
   "id": "xin-hua-zhuang-gao-tai-nan",
   "name": "兰新高速铁路",
   "from": "xin-hua-zhuang",
   "to": "gao-tai-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 25.85,
   "polyline": [
    [
     100.02817,
     39.1806
    ],
    [
     99.99763,
     39.18309
    ],
    [
     99.9717,
     39.19134
    ],
    [
     99.88363,
     39.23382
    ],
    [
     99.83256,
     39.27103
    ],
    [
     99.81988,
     39.27863
    ],
    [
     99.80427,
     39.28485
    ],
    [
     99.7724,
     39.29268
    ]
   ]
  },
  {
   "id": "gao-tai-nan-xu-san-wan",
   "name": "兰新高速铁路",
   "from": "gao-tai-nan",
   "to": "xu-san-wan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 31.51,
   "polyline": [
    [
     99.7724,
     39.29268
    ],
    [
     99.73983,
     39.30022
    ],
    [
     99.72043,
     39.30223
    ],
    [
     99.58557,
     39.30535
    ],
    [
     99.54671,
     39.302
    ],
    [
     99.5145,
     39.302
    ],
    [
     99.45858,
     39.30743
    ],
    [
     99.41089,
     39.31809
    ]
   ]
  },
  {
   "id": "xu-san-wan-tun-sheng",
   "name": "兰新高速铁路",
   "from": "xu-san-wan",
   "to": "tun-sheng",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 17.72,
   "polyline": [
    [
     99.41089,
     39.31809
    ],
    [
     99.39087,
     39.32117
    ],
    [
     99.35504,
     39.32196
    ],
    [
     99.3347,
     39.32419
    ],
    [
     99.27313,
     39.33819
    ],
    [
     99.23871,
     39.34391
    ],
    [
     99.21041,
     39.35094
    ]
   ]
  },
  {
   "id": "tun-sheng-qing-shui-bei",
   "name": "兰新高速铁路",
   "from": "tun-sheng",
   "to": "qing-shui-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 9.87,
   "polyline": [
    [
     99.21041,
     39.35094
    ],
    [
     99.17664,
     39.35913
    ],
    [
     99.09962,
     39.37334
    ]
   ]
  },
  {
   "id": "qing-shui-bei-jiu-quan-nan",
   "name": "兰新高速铁路",
   "from": "qing-shui-bei",
   "to": "jiu-quan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 61.39,
   "polyline": [
    [
     99.09962,
     39.37334
    ],
    [
     99.06343,
     39.38074
    ],
    [
     99.04049,
     39.39036
    ],
    [
     99.00072,
     39.41717
    ],
    [
     98.93569,
     39.47704
    ],
    [
     98.83799,
     39.53939
    ],
    [
     98.73113,
     39.585
    ],
    [
     98.63529,
     39.65336
    ],
    [
     98.58305,
     39.68298
    ],
    [
     98.53507,
     39.70063
    ]
   ]
  },
  {
   "id": "jiu-quan-nan-jia-yu-guan-nan",
   "name": "兰新高速铁路",
   "from": "jiu-quan-nan",
   "to": "jia-yu-guan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 20.99,
   "polyline": [
    [
     98.53507,
     39.70063
    ],
    [
     98.50019,
     39.7105
    ],
    [
     98.47246,
     39.71253
    ],
    [
     98.45088,
     39.70976
    ],
    [
     98.39989,
     39.69669
    ],
    [
     98.38652,
     39.69501
    ],
    [
     98.37035,
     39.69504
    ],
    [
     98.35702,
     39.69673
    ],
    [
     98.34176,
     39.70066
    ],
    [
     98.32612,
     39.7073
    ],
    [
     98.30925,
     39.71671
    ]
   ]
  },
  {
   "id": "jia-yu-guan-nan-yao-quan-zi",
   "name": "兰新高速铁路",
   "from": "jia-yu-guan-nan",
   "to": "yao-quan-zi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 60.45,
   "polyline": [
    [
     98.30925,
     39.71671
    ],
    [
     98.25635,
     39.74236
    ],
    [
     98.04564,
     39.82051
    ],
    [
     98.02022,
     39.82775
    ],
    [
     97.94839,
     39.83979
    ],
    [
     97.85,
     39.86945
    ],
    [
     97.80054,
     39.89096
    ],
    [
     97.77066,
     39.90994
    ],
    [
     97.75619,
     39.91732
    ],
    [
     97.67283,
     39.94521
    ]
   ]
  },
  {
   "id": "yao-quan-zi-qing-quan-nan",
   "name": "兰新高速铁路",
   "from": "yao-quan-zi",
   "to": "qing-quan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 9.53,
   "polyline": [
    [
     97.67283,
     39.94521
    ],
    [
     97.56996,
     39.97883
    ]
   ]
  },
  {
   "id": "qing-quan-nan-di-wo-pu",
   "name": "兰新高速铁路",
   "from": "qing-quan-nan",
   "to": "di-wo-pu",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 34.06,
   "polyline": [
    [
     97.56996,
     39.97883
    ],
    [
     97.52878,
     39.99226
    ],
    [
     97.44237,
     40.0259
    ],
    [
     97.38662,
     40.04503
    ],
    [
     97.3726,
     40.05147
    ],
    [
     97.28883,
     40.10079
    ],
    [
     97.28024,
     40.1071
    ],
    [
     97.25431,
     40.1352
    ],
    [
     97.24214,
     40.14557
    ]
   ]
  },
  {
   "id": "di-wo-pu-yu-men",
   "name": "兰新高速铁路",
   "from": "di-wo-pu",
   "to": "yu-men",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 22.11,
   "polyline": [
    [
     97.24214,
     40.14557
    ],
    [
     97.23076,
     40.15379
    ],
    [
     97.16493,
     40.19251
    ],
    [
     97.12883,
     40.20638
    ],
    [
     97.10925,
     40.21711
    ],
    [
     97.05723,
     40.25892
    ],
    [
     97.0439,
     40.27159
    ]
   ]
  },
  {
   "id": "yu-men-jun-ken",
   "name": "兰新高速铁路",
   "from": "yu-men",
   "to": "jun-ken",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 9.61,
   "polyline": [
    [
     97.0439,
     40.27159
    ],
    [
     97.01323,
     40.29825
    ],
    [
     97.0037,
     40.30412
    ],
    [
     96.97262,
     40.31875
    ],
    [
     96.95964,
     40.32797
    ]
   ]
  },
  {
   "id": "jun-ken-liu-gou-nan",
   "name": "兰新高速铁路",
   "from": "jun-ken",
   "to": "liu-gou-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 57.42,
   "polyline": [
    [
     96.95964,
     40.32797
    ],
    [
     96.93008,
     40.34917
    ],
    [
     96.63962,
     40.51004
    ],
    [
     96.44752,
     40.6298
    ],
    [
     96.422,
     40.64221
    ]
   ]
  },
  {
   "id": "liu-gou-nan-shi-ban-dun-nan",
   "name": "兰新高速铁路",
   "from": "liu-gou-nan",
   "to": "shi-ban-dun-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 50.93,
   "polyline": [
    [
     96.422,
     40.64221
    ],
    [
     96.37928,
     40.66036
    ],
    [
     96.36308,
     40.66958
    ],
    [
     96.27599,
     40.7395
    ],
    [
     96.25657,
     40.75161
    ],
    [
     95.97794,
     40.85502
    ],
    [
     95.91681,
     40.88524
    ]
   ]
  },
  {
   "id": "shi-ban-dun-nan-liu-yuan-nan",
   "name": "兰新高速铁路",
   "from": "shi-ban-dun-nan",
   "to": "liu-yuan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 45.31,
   "polyline": [
    [
     95.91681,
     40.88524
    ],
    [
     95.65983,
     41.0125
    ],
    [
     95.5152,
     41.07327
    ],
    [
     95.47079,
     41.1006
    ]
   ]
  },
  {
   "id": "liu-yuan-nan-da-quan",
   "name": "兰新高速铁路",
   "from": "liu-yuan-nan",
   "to": "da-quan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 31.67,
   "polyline": [
    [
     95.47079,
     41.1006
    ],
    [
     95.36787,
     41.16424
    ],
    [
     95.22197,
     41.26758
    ],
    [
     95.20628,
     41.27635
    ],
    [
     95.18354,
     41.28461
    ]
   ]
  },
  {
   "id": "da-quan-da-quan-nan",
   "name": "兰新高速铁路",
   "from": "da-quan",
   "to": "da-quan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 3.24,
   "polyline": [
    [
     95.18354,
     41.28461
    ],
    [
     95.14661,
     41.29353
    ]
   ]
  },
  {
   "id": "da-quan-nan-hong-liu-he-nan",
   "name": "兰新高速铁路",
   "from": "da-quan-nan",
   "to": "hong-liu-he-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 46.92,
   "polyline": [
    [
     95.14661,
     41.29353
    ],
    [
     95.10027,
     41.30477
    ],
    [
     95.02833,
     41.33048
    ],
    [
     94.68613,
     41.53037
    ]
   ]
  },
  {
   "id": "hong-liu-he-nan-jing-xia",
   "name": "兰新高速铁路",
   "from": "hong-liu-he-nan",
   "to": "jing-xia",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 51.83,
   "polyline": [
    [
     94.68613,
     41.53037
    ],
    [
     94.50999,
     41.63264
    ],
    [
     94.47426,
     41.65666
    ],
    [
     94.42781,
     41.68294
    ],
    [
     94.4136,
     41.69275
    ],
    [
     94.34606,
     41.7513
    ],
    [
     94.33513,
     41.76313
    ],
    [
     94.32812,
     41.77395
    ],
    [
     94.30766,
     41.81803
    ],
    [
     94.27821,
     41.86848
    ]
   ]
  },
  {
   "id": "jing-xia-si-tian-nan",
   "name": "兰新高速铁路",
   "from": "jing-xia",
   "to": "si-tian-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 8.81,
   "polyline": [
    [
     94.27821,
     41.86848
    ],
    [
     94.23457,
     41.94072
    ]
   ]
  },
  {
   "id": "si-tian-nan-yan-dun-dong",
   "name": "兰新高速铁路",
   "from": "si-tian-nan",
   "to": "yan-dun-dong",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 27.38,
   "polyline": [
    [
     94.23457,
     41.94072
    ],
    [
     94.16138,
     42.04847
    ],
    [
     94.09338,
     42.16312
    ]
   ]
  },
  {
   "id": "yan-dun-dong-yan-quan-bei",
   "name": "兰新高速铁路",
   "from": "yan-dun-dong",
   "to": "yan-quan-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 42.91,
   "polyline": [
    [
     94.09338,
     42.16312
    ],
    [
     94.05156,
     42.2336
    ],
    [
     94.03545,
     42.27742
    ],
    [
     94.02755,
     42.29177
    ],
    [
     93.85031,
     42.50206
    ]
   ]
  },
  {
   "id": "yan-quan-bei-ha-mi",
   "name": "兰新高速铁路",
   "from": "yan-quan-bei",
   "to": "ha-mi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 48.06,
   "polyline": [
    [
     93.85031,
     42.50206
    ],
    [
     93.66159,
     42.72329
    ],
    [
     93.58965,
     42.78812
    ],
    [
     93.55639,
     42.81077
    ],
    [
     93.52784,
     42.83593
    ],
    [
     93.50465,
     42.84844
    ]
   ]
  },
  {
   "id": "ha-mi-liu-shu-quan-nan",
   "name": "兰新高速铁路",
   "from": "ha-mi",
   "to": "liu-shu-quan-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 65.63,
   "polyline": [
    [
     93.50465,
     42.84844
    ],
    [
     93.48254,
     42.86063
    ],
    [
     93.43146,
     42.88341
    ],
    [
     93.33983,
     42.90605
    ],
    [
     93.24708,
     42.92399
    ],
    [
     93.17717,
     42.94223
    ],
    [
     93.11005,
     42.95419
    ],
    [
     92.83695,
     43.02473
    ],
    [
     92.80865,
     43.02817
    ],
    [
     92.7524,
     43.0273
    ]
   ]
  },
  {
   "id": "liu-shu-quan-nan-le-dun-bei",
   "name": "兰新高速铁路",
   "from": "liu-shu-quan-nan",
   "to": "le-dun-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 47.72,
   "polyline": [
    [
     92.7524,
     43.0273
    ],
    [
     92.71631,
     43.02668
    ],
    [
     92.69845,
     43.02806
    ],
    [
     92.43185,
     43.06604
    ],
    [
     92.41695,
     43.06891
    ],
    [
     92.3729,
     43.08116
    ],
    [
     92.17879,
     43.11224
    ]
   ]
  },
  {
   "id": "le-dun-bei-hong-ceng-nan",
   "name": "兰新高速铁路",
   "from": "le-dun-bei",
   "to": "hong-ceng-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 43.76,
   "polyline": [
    [
     92.17879,
     43.11224
    ],
    [
     92.11436,
     43.12274
    ],
    [
     92.09911,
     43.12393
    ],
    [
     91.88338,
     43.12339
    ],
    [
     91.75002,
     43.12821
    ],
    [
     91.64303,
     43.11703
    ]
   ]
  },
  {
   "id": "hong-ceng-nan-xiao-cao-hu-xi",
   "name": "兰新高速铁路",
   "from": "hong-ceng-nan",
   "to": "xiao-cao-hu-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 47.21,
   "polyline": [
    [
     91.64303,
     43.11703
    ],
    [
     91.50744,
     43.10234
    ],
    [
     91.06351,
     43.11009
    ]
   ]
  },
  {
   "id": "xiao-cao-hu-xi-shan-shan-bei",
   "name": "兰新高速铁路",
   "from": "xiao-cao-hu-xi",
   "to": "shan-shan-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 77.19,
   "polyline": [
    [
     91.06351,
     43.11009
    ],
    [
     90.6913,
     43.11523
    ],
    [
     90.6721,
     43.11439
    ],
    [
     90.6527,
     43.11126
    ],
    [
     90.63111,
     43.10474
    ],
    [
     90.56185,
     43.07106
    ],
    [
     90.5036,
     43.04841
    ],
    [
     90.48586,
     43.03754
    ],
    [
     90.46628,
     43.02032
    ],
    [
     90.44616,
     43.0082
    ],
    [
     90.4332,
     43.00346
    ],
    [
     90.34669,
     42.98141
    ],
    [
     90.32689,
     42.97281
    ],
    [
     90.25034,
     42.93019
    ],
    [
     90.22648,
     42.92229
    ],
    [
     90.19371,
     42.91725
    ]
   ]
  },
  {
   "id": "shan-shan-bei-tu-ha",
   "name": "兰新高速铁路",
   "from": "shan-shan-bei",
   "to": "tu-ha",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 32.18,
   "polyline": [
    [
     90.19371,
     42.91725
    ],
    [
     90.22648,
     42.92229
    ],
    [
     90.25034,
     42.93019
    ],
    [
     90.32689,
     42.97281
    ],
    [
     90.34669,
     42.98141
    ],
    [
     90.4332,
     43.00346
    ],
    [
     90.44616,
     43.0082
    ],
    [
     90.46628,
     43.02032
    ],
    [
     90.48586,
     43.03754
    ],
    [
     90.49729,
     43.04515
    ],
    [
     90.52991,
     43.05916
    ]
   ]
  },
  {
   "id": "tu-ha-sheng-jin-bei",
   "name": "兰新高速铁路",
   "from": "tu-ha",
   "to": "sheng-jin-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 78.34,
   "polyline": [
    [
     90.52991,
     43.05916
    ],
    [
     90.49729,
     43.04515
    ],
    [
     90.48586,
     43.03754
    ],
    [
     90.46628,
     43.02032
    ],
    [
     90.44616,
     43.0082
    ],
    [
     90.4332,
     43.00346
    ],
    [
     90.3517,
     42.98304
    ],
    [
     90.3384,
     42.97833
    ],
    [
     90.25726,
     42.93361
    ],
    [
     90.24289,
     42.92723
    ],
    [
     90.22114,
     42.92108
    ],
    [
     90.15763,
     42.91401
    ],
    [
     90.1339,
     42.91474
    ],
    [
     90.10598,
     42.9207
    ],
    [
     89.99361,
     42.96189
    ],
    [
     89.77949,
     43.00456
    ],
    [
     89.66004,
     43.01649
    ]
   ]
  },
  {
   "id": "sheng-jin-bei-tu-lu-fan-bei",
   "name": "兰新高速铁路",
   "from": "sheng-jin-bei",
   "to": "tu-lu-fan-bei",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 45.58,
   "polyline": [
    [
     89.66004,
     43.01649
    ],
    [
     89.42551,
     43.03875
    ],
    [
     89.25172,
     43.04657
    ],
    [
     89.23133,
     43.04563
    ],
    [
     89.21412,
     43.04284
    ],
    [
     89.16529,
     43.02798
    ],
    [
     89.14959,
     43.02454
    ],
    [
     89.10797,
     43.02136
    ]
   ]
  },
  {
   "id": "tu-lu-fan-bei-da-he-yan",
   "name": "兰新高速铁路",
   "from": "tu-lu-fan-bei",
   "to": "da-he-yan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 30.59,
   "polyline": [
    [
     89.10797,
     43.02136
    ],
    [
     89.11509,
     43.02235
    ],
    [
     89.06854,
     43.02267
    ],
    [
     89.03799,
     43.03003
    ],
    [
     89.01621,
     43.04034
    ],
    [
     88.98097,
     43.06639
    ],
    [
     88.96277,
     43.0761
    ],
    [
     88.93808,
     43.08382
    ],
    [
     88.87349,
     43.09576
    ],
    [
     88.85696,
     43.10009
    ],
    [
     88.8409,
     43.10638
    ],
    [
     88.78974,
     43.13202
    ]
   ]
  },
  {
   "id": "da-he-yan-tian-shan",
   "name": "兰新高速铁路",
   "from": "da-he-yan",
   "to": "tian-shan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 22.78,
   "polyline": [
    [
     88.78974,
     43.13202
    ],
    [
     88.72902,
     43.16251
    ],
    [
     88.70438,
     43.17146
    ],
    [
     88.65639,
     43.18147
    ],
    [
     88.61362,
     43.18177
    ],
    [
     88.5957,
     43.1839
    ],
    [
     88.57656,
     43.18907
    ],
    [
     88.53322,
     43.20402
    ]
   ]
  },
  {
   "id": "tian-shan-da-ban-cheng",
   "name": "兰新高速铁路",
   "from": "tian-shan",
   "to": "da-ban-cheng",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 25.79,
   "polyline": [
    [
     88.53322,
     43.20402
    ],
    [
     88.52078,
     43.21009
    ],
    [
     88.4915,
     43.22927
    ],
    [
     88.47532,
     43.23687
    ],
    [
     88.4586,
     43.24211
    ],
    [
     88.413,
     43.25181
    ],
    [
     88.38637,
     43.26275
    ],
    [
     88.36454,
     43.27952
    ],
    [
     88.31569,
     43.33203
    ],
    [
     88.29492,
     43.34681
    ]
   ]
  },
  {
   "id": "da-ban-cheng-yan-hu",
   "name": "兰新高速铁路",
   "from": "da-ban-cheng",
   "to": "yan-hu",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 17.44,
   "polyline": [
    [
     88.29492,
     43.34681
    ],
    [
     88.2515,
     43.37405
    ],
    [
     88.2381,
     43.38075
    ],
    [
     88.14621,
     43.40674
    ],
    [
     88.12961,
     43.41315
    ],
    [
     88.11035,
     43.42402
    ]
   ]
  },
  {
   "id": "yan-hu-yan-hu-xi",
   "name": "兰新高速铁路",
   "from": "yan-hu",
   "to": "yan-hu-xi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 2.1,
   "polyline": [
    [
     88.11035,
     43.42402
    ],
    [
     88.09266,
     43.43781
    ]
   ]
  },
  {
   "id": "yan-hu-xi-qing-feng-lu",
   "name": "兰新高速铁路",
   "from": "yan-hu-xi",
   "to": "qing-feng-lu",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 56.88,
   "polyline": [
    [
     88.09266,
     43.43781
    ],
    [
     87.96546,
     43.541
    ],
    [
     87.94811,
     43.55172
    ],
    [
     87.8194,
     43.60345
    ],
    [
     87.71591,
     43.62997
    ],
    [
     87.66991,
     43.65052
    ],
    [
     87.65664,
     43.65775
    ],
    [
     87.63818,
     43.67191
    ],
    [
     87.58491,
     43.71887
    ],
    [
     87.58015,
     43.72787
    ],
    [
     87.57695,
     43.75099
    ],
    [
     87.57752,
     43.75595
    ]
   ]
  },
  {
   "id": "qing-feng-lu-shi-er-zhong",
   "name": "兰新高速铁路",
   "from": "qing-feng-lu",
   "to": "shi-er-zhong",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 0.94,
   "polyline": [
    [
     87.57752,
     43.75595
    ],
    [
     87.58066,
     43.76403
    ]
   ]
  },
  {
   "id": "shi-er-zhong-zhu-jiang-lu",
   "name": "兰新高速铁路",
   "from": "shi-er-zhong",
   "to": "zhu-jiang-lu",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 0.74,
   "polyline": [
    [
     87.58066,
     43.76403
    ],
    [
     87.58461,
     43.76991
    ]
   ]
  },
  {
   "id": "zhu-jiang-lu-wu-lu-mu-qi-nan",
   "name": "兰新高速铁路",
   "from": "zhu-jiang-lu",
   "to": "wu-lu-mu-qi-nan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 0.59,
   "polyline": [
    [
     87.58461,
     43.76991
    ],
    [
     87.58286,
     43.77506
    ]
   ]
  },
  {
   "id": "wu-lu-mu-qi-nan-ping-chuan-lu",
   "name": "兰新高速铁路",
   "from": "wu-lu-mu-qi-nan",
   "to": "ping-chuan-lu",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 5.36,
   "polyline": [
    [
     87.58286,
     43.77506
    ],
    [
     87.5774,
     43.78782
    ],
    [
     87.57219,
     43.79377
    ],
    [
     87.56647,
     43.79717
    ],
    [
     87.54975,
     43.80163
    ],
    [
     87.54178,
     43.8091
    ]
   ]
  },
  {
   "id": "ping-chuan-lu-jiu-jia-wan",
   "name": "兰新高速铁路",
   "from": "ping-chuan-lu",
   "to": "jiu-jia-wan",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 2.57,
   "polyline": [
    [
     87.54178,
     43.8091
    ],
    [
     87.53975,
     43.8131
    ],
    [
     87.54183,
     43.82826
    ],
    [
     87.54016,
     43.83158
    ]
   ]
  },
  {
   "id": "jiu-jia-wan-wu-lu-mu-qi",
   "name": "兰新高速铁路",
   "from": "jiu-jia-wan",
   "to": "wu-lu-mu-qi",
   "lineIds": [
    "lanxin-hsr"
   ],
   "serviceDate": "2014-12-26",
   "estLengthKm": 1.91,
   "polyline": [
    [
     87.54016,
     43.83158
    ],
    [
     87.52621,
     43.83941
    ]
   ]
  },
  {
   "id": "xi-an-bei-xi-an-xi",
   "name": "西成高速铁路",
   "from": "xi-an-bei",
   "to": "xi-an-xi",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 22.17,
   "polyline": [
    [
     108.93403,
     34.37767
    ],
    [
     108.8398,
     34.35397
    ],
    [
     108.82806,
     34.34931
    ],
    [
     108.81221,
     34.34067
    ],
    [
     108.79596,
     34.32716
    ],
    [
     108.77708,
     34.29943
    ],
    [
     108.74688,
     34.26749
    ]
   ]
  },
  {
   "id": "xi-an-xi-hu-yi",
   "name": "西成高速铁路",
   "from": "xi-an-xi",
   "to": "hu-yi",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 24.1,
   "polyline": [
    [
     108.74688,
     34.26749
    ],
    [
     108.73151,
     34.25175
    ],
    [
     108.6945,
     34.22003
    ],
    [
     108.68629,
     34.20875
    ],
    [
     108.68133,
     34.19812
    ],
    [
     108.67801,
     34.18433
    ],
    [
     108.6762,
     34.14935
    ],
    [
     108.67532,
     34.12853
    ],
    [
     108.67787,
     34.10398
    ],
    [
     108.67572,
     34.08098
    ]
   ]
  },
  {
   "id": "hu-yi-xin-chang-jie",
   "name": "西成高速铁路",
   "from": "hu-yi",
   "to": "xin-chang-jie",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 51.42,
   "polyline": [
    [
     108.67572,
     34.08098
    ],
    [
     108.67284,
     34.05634
    ],
    [
     108.66997,
     34.0461
    ],
    [
     108.66303,
     34.03272
    ],
    [
     108.65263,
     34.02034
    ],
    [
     108.63963,
     34.01046
    ],
    [
     108.62539,
     34.00323
    ],
    [
     108.59005,
     33.99448
    ],
    [
     108.57469,
     33.98873
    ],
    [
     108.55941,
     33.97929
    ],
    [
     108.54495,
     33.96492
    ],
    [
     108.53584,
     33.94875
    ],
    [
     108.51386,
     33.88065
    ],
    [
     108.50719,
     33.86894
    ],
    [
     108.49842,
     33.85867
    ],
    [
     108.48593,
     33.8499
    ],
    [
     108.45697,
     33.83743
    ],
    [
     108.43952,
     33.82702
    ],
    [
     108.34975,
     33.75691
    ],
    [
     108.33801,
     33.74599
    ]
   ]
  },
  {
   "id": "xin-chang-jie-fu-ping",
   "name": "西成高速铁路",
   "from": "xin-chang-jie",
   "to": "fu-ping",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 43.59,
   "polyline": [
    [
     108.33801,
     33.74599
    ],
    [
     108.29923,
     33.70357
    ],
    [
     108.2768,
     33.68435
    ],
    [
     108.15583,
     33.60987
    ],
    [
     108.12937,
     33.59814
    ],
    [
     108.11183,
     33.58777
    ],
    [
     107.97627,
     33.49945
    ]
   ]
  },
  {
   "id": "fu-ping-yang-xian-xi",
   "name": "西成高速铁路",
   "from": "fu-ping",
   "to": "yang-xian-xi",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 52.53,
   "polyline": [
    [
     107.97627,
     33.49945
    ],
    [
     107.86106,
     33.42549
    ],
    [
     107.7642,
     33.36745
    ],
    [
     107.72084,
     33.34412
    ],
    [
     107.6361,
     33.29413
    ],
    [
     107.62523,
     33.28618
    ],
    [
     107.59681,
     33.2596
    ],
    [
     107.58075,
     33.24863
    ],
    [
     107.55709,
     33.23769
    ],
    [
     107.51856,
     33.22871
    ]
   ]
  },
  {
   "id": "yang-xian-xi-cheng-gu-bei",
   "name": "西成高速铁路",
   "from": "yang-xian-xi",
   "to": "cheng-gu-bei",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 22.38,
   "polyline": [
    [
     107.51856,
     33.22871
    ],
    [
     107.49183,
     33.22366
    ],
    [
     107.43475,
     33.20633
    ],
    [
     107.30145,
     33.18598
    ]
   ]
  },
  {
   "id": "cheng-gu-bei-wang-jia-kan",
   "name": "西成高速铁路",
   "from": "cheng-gu-bei",
   "to": "wang-jia-kan",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 20.35,
   "polyline": [
    [
     107.30145,
     33.18598
    ],
    [
     107.23049,
     33.17562
    ],
    [
     107.20778,
     33.16955
    ],
    [
     107.1921,
     33.16192
    ],
    [
     107.1099,
     33.10784
    ]
   ]
  },
  {
   "id": "wang-jia-kan-han-zhong",
   "name": "西成高速铁路",
   "from": "wang-jia-kan",
   "to": "han-zhong",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 8.67,
   "polyline": [
    [
     107.1099,
     33.10784
    ],
    [
     107.0944,
     33.09971
    ],
    [
     107.08066,
     33.09605
    ],
    [
     107.04631,
     33.09294
    ],
    [
     107.02552,
     33.09293
    ]
   ]
  },
  {
   "id": "han-zhong-xin-ji",
   "name": "西成高速铁路",
   "from": "han-zhong",
   "to": "xin-ji",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 22.36,
   "polyline": [
    [
     107.02552,
     33.09293
    ],
    [
     106.99415,
     33.09185
    ],
    [
     106.97486,
     33.08792
    ],
    [
     106.93047,
     33.0693
    ],
    [
     106.80149,
     33.02604
    ]
   ]
  },
  {
   "id": "xin-ji-ning-qiang-nan",
   "name": "西成高速铁路",
   "from": "xin-ji",
   "to": "ning-qiang-nan",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 54.52,
   "polyline": [
    [
     106.80149,
     33.02604
    ],
    [
     106.78084,
     33.01857
    ],
    [
     106.70681,
     32.98172
    ],
    [
     106.69022,
     32.97725
    ],
    [
     106.63312,
     32.96683
    ],
    [
     106.61366,
     32.96131
    ],
    [
     106.53871,
     32.92056
    ],
    [
     106.35887,
     32.85805
    ],
    [
     106.3222,
     32.83983
    ],
    [
     106.28507,
     32.82383
    ]
   ]
  },
  {
   "id": "ning-qiang-nan-chao-tian",
   "name": "西成高速铁路",
   "from": "ning-qiang-nan",
   "to": "chao-tian",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 24.32,
   "polyline": [
    [
     106.28507,
     32.82383
    ],
    [
     106.11602,
     32.74016
    ],
    [
     106.09998,
     32.73034
    ],
    [
     106.06718,
     32.70557
    ]
   ]
  },
  {
   "id": "chao-tian-guang-yuan",
   "name": "西成高速铁路",
   "from": "chao-tian",
   "to": "guang-yuan",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 38.75,
   "polyline": [
    [
     106.06718,
     32.70557
    ],
    [
     106.05585,
     32.69808
    ],
    [
     106.00643,
     32.67281
    ],
    [
     105.9893,
     32.66034
    ],
    [
     105.97411,
     32.64514
    ],
    [
     105.94339,
     32.60139
    ],
    [
     105.93108,
     32.58711
    ],
    [
     105.917,
     32.57504
    ],
    [
     105.8793,
     32.55009
    ],
    [
     105.86813,
     32.54097
    ],
    [
     105.85925,
     32.53006
    ],
    [
     105.85384,
     32.51872
    ],
    [
     105.84623,
     32.48788
    ],
    [
     105.84215,
     32.47797
    ],
    [
     105.83463,
     32.4678
    ],
    [
     105.81797,
     32.45266
    ]
   ]
  },
  {
   "id": "guang-yuan-sha-xi-ba",
   "name": "西成高速铁路",
   "from": "guang-yuan",
   "to": "sha-xi-ba",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 35.19,
   "polyline": [
    [
     105.81797,
     32.45266
    ],
    [
     105.79392,
     32.43532
    ],
    [
     105.75965,
     32.42341
    ],
    [
     105.7469,
     32.41672
    ],
    [
     105.73577,
     32.40774
    ],
    [
     105.71965,
     32.39099
    ],
    [
     105.68739,
     32.36946
    ],
    [
     105.67356,
     32.36383
    ],
    [
     105.62878,
     32.35295
    ],
    [
     105.6148,
     32.34778
    ],
    [
     105.60121,
     32.33939
    ],
    [
     105.57143,
     32.31336
    ],
    [
     105.55303,
     32.30373
    ],
    [
     105.5048,
     32.29324
    ]
   ]
  },
  {
   "id": "sha-xi-ba-jian-men-guan",
   "name": "西成高速铁路",
   "from": "sha-xi-ba",
   "to": "jian-men-guan",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 2.47,
   "polyline": [
    [
     105.5048,
     32.29324
    ],
    [
     105.48106,
     32.28367
    ]
   ]
  },
  {
   "id": "jian-men-guan-qing-chuan",
   "name": "西成高速铁路",
   "from": "jian-men-guan",
   "to": "qing-chuan",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 18.16,
   "polyline": [
    [
     105.48106,
     32.28367
    ],
    [
     105.46052,
     32.27579
    ],
    [
     105.44838,
     32.2692
    ],
    [
     105.32621,
     32.18707
    ]
   ]
  },
  {
   "id": "qing-chuan-jiang-you-bei",
   "name": "西成高速铁路",
   "from": "qing-chuan",
   "to": "jiang-you-bei",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 33.71,
   "polyline": [
    [
     105.32621,
     32.18707
    ],
    [
     105.2749,
     32.152
    ],
    [
     105.14435,
     32.04248
    ],
    [
     105.12174,
     32.02765
    ],
    [
     105.07226,
     31.98537
    ]
   ]
  },
  {
   "id": "jiang-you-bei-shuang-he-kou",
   "name": "西成高速铁路",
   "from": "jiang-you-bei",
   "to": "shuang-he-kou",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 23.55,
   "polyline": [
    [
     105.07226,
     31.98537
    ],
    [
     105.05821,
     31.97329
    ],
    [
     105.03008,
     31.93813
    ],
    [
     105.01318,
     31.92473
    ],
    [
     104.96091,
     31.89759
    ],
    [
     104.9129,
     31.88325
    ],
    [
     104.8735,
     31.86683
    ]
   ]
  },
  {
   "id": "shuang-he-kou-jiang-you",
   "name": "西成高速铁路",
   "from": "shuang-he-kou",
   "to": "jiang-you",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 15.61,
   "polyline": [
    [
     104.8735,
     31.86683
    ],
    [
     104.79333,
     31.8181
    ],
    [
     104.78323,
     31.80661
    ],
    [
     104.76385,
     31.77634
    ],
    [
     104.76754,
     31.78344
    ]
   ]
  },
  {
   "id": "jiang-you-san-he-chang",
   "name": "西成高速铁路",
   "from": "jiang-you",
   "to": "san-he-chang",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 6.08,
   "polyline": [
    [
     104.76754,
     31.78344
    ],
    [
     104.74888,
     31.75376
    ],
    [
     104.74281,
     31.73347
    ]
   ]
  },
  {
   "id": "san-he-chang-qing-lian",
   "name": "西成高速铁路",
   "from": "san-he-chang",
   "to": "qing-lian",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 8.08,
   "polyline": [
    [
     104.74281,
     31.73347
    ],
    [
     104.73927,
     31.72483
    ],
    [
     104.73434,
     31.71859
    ],
    [
     104.71342,
     31.7049
    ],
    [
     104.70623,
     31.69829
    ],
    [
     104.70098,
     31.6883
    ],
    [
     104.69948,
     31.67501
    ]
   ]
  },
  {
   "id": "qing-lian-mian-yang-bei",
   "name": "西成高速铁路",
   "from": "qing-lian",
   "to": "mian-yang-bei",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 13.02,
   "polyline": [
    [
     104.69948,
     31.67501
    ],
    [
     104.69877,
     31.65306
    ],
    [
     104.70509,
     31.62945
    ],
    [
     104.7078,
     31.59474
    ],
    [
     104.71657,
     31.55947
    ]
   ]
  },
  {
   "id": "mian-yang-bei-mian-yang",
   "name": "西成高速铁路",
   "from": "mian-yang-bei",
   "to": "mian-yang",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 11.94,
   "polyline": [
    [
     104.71657,
     31.55947
    ],
    [
     104.71489,
     31.51756
    ],
    [
     104.72904,
     31.48745
    ],
    [
     104.73001,
     31.48272
    ],
    [
     104.7285,
     31.46903
    ],
    [
     104.72294,
     31.46403
    ],
    [
     104.71463,
     31.46213
    ]
   ]
  },
  {
   "id": "mian-yang-zao-jiao-pu",
   "name": "西成高速铁路",
   "from": "mian-yang",
   "to": "zao-jiao-pu",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 6.22,
   "polyline": [
    [
     104.71463,
     31.46213
    ],
    [
     104.6943,
     31.46199
    ],
    [
     104.68662,
     31.46041
    ],
    [
     104.65795,
     31.44032
    ]
   ]
  },
  {
   "id": "zao-jiao-pu-luo-jiang-dong",
   "name": "西成高速铁路",
   "from": "zao-jiao-pu",
   "to": "luo-jiang-dong",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 19.88,
   "polyline": [
    [
     104.65795,
     31.44032
    ],
    [
     104.63376,
     31.42605
    ],
    [
     104.62455,
     31.41829
    ],
    [
     104.60657,
     31.39839
    ],
    [
     104.58384,
     31.36968
    ],
    [
     104.55378,
     31.34046
    ],
    [
     104.53991,
     31.31604
    ],
    [
     104.52891,
     31.30226
    ]
   ]
  },
  {
   "id": "luo-jiang-dong-de-yang",
   "name": "西成高速铁路",
   "from": "luo-jiang-dong",
   "to": "de-yang",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 23.11,
   "polyline": [
    [
     104.52891,
     31.30226
    ],
    [
     104.51861,
     31.29086
    ],
    [
     104.49912,
     31.27659
    ],
    [
     104.48516,
     31.26144
    ],
    [
     104.47493,
     31.25514
    ],
    [
     104.45368,
     31.24627
    ],
    [
     104.42968,
     31.22935
    ],
    [
     104.39591,
     31.19281
    ],
    [
     104.39042,
     31.1823
    ],
    [
     104.38367,
     31.15762
    ],
    [
     104.38641,
     31.16835
    ]
   ]
  },
  {
   "id": "de-yang-jing-yang",
   "name": "西成高速铁路",
   "from": "de-yang",
   "to": "jing-yang",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 9.25,
   "polyline": [
    [
     104.38641,
     31.16835
    ],
    [
     104.38245,
     31.15358
    ],
    [
     104.379,
     31.14628
    ],
    [
     104.33978,
     31.09644
    ]
   ]
  },
  {
   "id": "jing-yang-guang-han-bei",
   "name": "西成高速铁路",
   "from": "jing-yang",
   "to": "guang-han-bei",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 11.48,
   "polyline": [
    [
     104.33978,
     31.09644
    ],
    [
     104.30844,
     31.06291
    ],
    [
     104.29123,
     31.0356
    ],
    [
     104.27307,
     31.0117
    ]
   ]
  },
  {
   "id": "guang-han-bei-guang-han",
   "name": "西成高速铁路",
   "from": "guang-han-bei",
   "to": "guang-han",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 3.19,
   "polyline": [
    [
     104.27307,
     31.0117
    ],
    [
     104.26201,
     30.99629
    ],
    [
     104.25827,
     30.9862
    ]
   ]
  },
  {
   "id": "guang-han-qing-bai-jiang-dong",
   "name": "西成高速铁路",
   "from": "guang-han",
   "to": "qing-bai-jiang-dong",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 10.05,
   "polyline": [
    [
     104.25827,
     30.9862
    ],
    [
     104.25187,
     30.96265
    ],
    [
     104.2287,
     30.91718
    ],
    [
     104.22444,
     30.90109
    ]
   ]
  },
  {
   "id": "qing-bai-jiang-dong-xin-dou-dong",
   "name": "西成高速铁路",
   "from": "qing-bai-jiang-dong",
   "to": "xin-dou-dong",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 11.11,
   "polyline": [
    [
     104.22444,
     30.90109
    ],
    [
     104.21874,
     30.87654
    ],
    [
     104.2078,
     30.853
    ],
    [
     104.20326,
     30.8205
    ],
    [
     104.19472,
     30.80558
    ]
   ]
  },
  {
   "id": "xin-dou-dong-cheng-du-dong",
   "name": "西成高速铁路",
   "from": "xin-dou-dong",
   "to": "cheng-du-dong",
   "lineIds": [
    "xicheng-hsr"
   ],
   "serviceDate": "2017-12-06",
   "estLengthKm": 20.99,
   "polyline": [
    [
     104.19472,
     30.80558
    ],
    [
     104.17851,
     30.78258
    ],
    [
     104.16229,
     30.75597
    ],
    [
     104.14729,
     30.72729
    ],
    [
     104.14621,
     30.70652
    ],
    [
     104.15381,
     30.6883
    ],
    [
     104.15455,
     30.67398
    ],
    [
     104.14833,
     30.6517
    ],
    [
     104.13892,
     30.6313
    ]
   ]
  },
  {
   "id": "bei-jing-xi-guang-an-men",
   "name": "京雄城际铁路",
   "from": "bei-jing-xi",
   "to": "guang-an-men",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 3.06,
   "polyline": [
    [
     116.3151,
     39.89367
    ],
    [
     116.31802,
     39.89287
    ],
    [
     116.32661,
     39.8951
    ],
    [
     116.335,
     39.89381
    ],
    [
     116.33827,
     39.88271
    ]
   ]
  },
  {
   "id": "guang-an-men-bei-jing-da-xing",
   "name": "京雄城际铁路",
   "from": "guang-an-men",
   "to": "bei-jing-da-xing",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 19.5,
   "polyline": [
    [
     116.33827,
     39.88271
    ],
    [
     116.33719,
     39.85092
    ],
    [
     116.32701,
     39.82886
    ],
    [
     116.318,
     39.80141
    ],
    [
     116.29711,
     39.7472
    ],
    [
     116.29892,
     39.7426
    ],
    [
     116.3113,
     39.72916
    ],
    [
     116.32342,
     39.71925
    ]
   ]
  },
  {
   "id": "bei-jing-da-xing-da-xing-ji-chang",
   "name": "京雄城际铁路",
   "from": "bei-jing-da-xing",
   "to": "da-xing-ji-chang",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 24.7,
   "polyline": [
    [
     116.32342,
     39.71925
    ],
    [
     116.35297,
     39.69249
    ],
    [
     116.36304,
     39.67714
    ],
    [
     116.37686,
     39.6357
    ],
    [
     116.3782,
     39.60896
    ],
    [
     116.38012,
     39.60006
    ],
    [
     116.38497,
     39.59023
    ],
    [
     116.39674,
     39.57448
    ],
    [
     116.40116,
     39.56439
    ],
    [
     116.4091,
     39.51557
    ],
    [
     116.41056,
     39.51336
    ]
   ]
  },
  {
   "id": "da-xing-ji-chang-gu-an-dong",
   "name": "京雄城际铁路",
   "from": "da-xing-ji-chang",
   "to": "gu-an-dong",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 18.64,
   "polyline": [
    [
     116.41056,
     39.51336
    ],
    [
     116.40857,
     39.51888
    ],
    [
     116.41171,
     39.49833
    ],
    [
     116.41146,
     39.48872
    ],
    [
     116.404,
     39.46645
    ],
    [
     116.40173,
     39.45431
    ],
    [
     116.39832,
     39.37106
    ]
   ]
  },
  {
   "id": "gu-an-dong-ba-zhou-bei",
   "name": "京雄城际铁路",
   "from": "gu-an-dong",
   "to": "ba-zhou-bei",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 22.71,
   "polyline": [
    [
     116.39832,
     39.37106
    ],
    [
     116.39775,
     39.34247
    ],
    [
     116.38083,
     39.25075
    ],
    [
     116.37629,
     39.23647
    ],
    [
     116.36881,
     39.22343
    ],
    [
     116.3589,
     39.21187
    ],
    [
     116.35017,
     39.20448
    ],
    [
     116.32097,
     39.18495
    ]
   ]
  },
  {
   "id": "ba-zhou-bei-xiong-an",
   "name": "京雄城际铁路",
   "from": "ba-zhou-bei",
   "to": "xiong-an",
   "lineIds": [
    "jingxiong-int"
   ],
   "serviceDate": "2020-12-27",
   "estLengthKm": 20.71,
   "polyline": [
    [
     116.32097,
     39.18495
    ],
    [
     116.25915,
     39.14603
    ],
    [
     116.20193,
     39.11335
    ],
    [
     116.17801,
     39.09226
    ],
    [
     116.15414,
     39.05558
    ]
   ]
  },
  {
   "id": "bei-dong-zha-shang-qiu-nan",
   "name": "商合杭高速铁路（北段）",
   "from": "bei-dong-zha",
   "to": "shang-qiu-nan",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 2.12,
   "polyline": [
    [
     115.70768,
     34.42791
    ],
    [
     115.7024,
     34.42108
    ],
    [
     115.70303,
     34.41014
    ]
   ]
  },
  {
   "id": "shang-qiu-nan-shang-qiu-dong",
   "name": "商合杭高速铁路（北段）",
   "from": "shang-qiu-nan",
   "to": "shang-qiu-dong",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 9.29,
   "polyline": [
    [
     115.70303,
     34.41014
    ],
    [
     115.70579,
     34.39804
    ],
    [
     115.72029,
     34.36724
    ],
    [
     115.72704,
     34.32969
    ]
   ]
  },
  {
   "id": "shang-qiu-dong-yi-yin",
   "name": "商合杭高速铁路（北段）",
   "from": "shang-qiu-dong",
   "to": "yi-yin",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 6.38,
   "polyline": [
    [
     115.72704,
     34.32969
    ],
    [
     115.73058,
     34.3022
    ],
    [
     115.73909,
     34.27335
    ]
   ]
  },
  {
   "id": "yi-yin-mu-lan",
   "name": "商合杭高速铁路（北段）",
   "from": "yi-yin",
   "to": "mu-lan",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 14.97,
   "polyline": [
    [
     115.73909,
     34.27335
    ],
    [
     115.74122,
     34.2544
    ],
    [
     115.75813,
     34.1747
    ],
    [
     115.76352,
     34.14032
    ]
   ]
  },
  {
   "id": "mu-lan-lu-miao",
   "name": "商合杭高速铁路（北段）",
   "from": "mu-lan",
   "to": "lu-miao",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 11.14,
   "polyline": [
    [
     115.76352,
     34.14032
    ],
    [
     115.77249,
     34.09337
    ],
    [
     115.78,
     34.0412
    ]
   ]
  },
  {
   "id": "lu-miao-wang-lou",
   "name": "商合杭高速铁路（北段）",
   "from": "lu-miao",
   "to": "wang-lou",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 3.97,
   "polyline": [
    [
     115.78,
     34.0412
    ],
    [
     115.78594,
     34.00587
    ]
   ]
  },
  {
   "id": "wang-lou-bo-zhou",
   "name": "商合杭高速铁路（北段）",
   "from": "wang-lou",
   "to": "bo-zhou",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 17.51,
   "polyline": [
    [
     115.78594,
     34.00587
    ],
    [
     115.79057,
     33.96873
    ],
    [
     115.80352,
     33.91628
    ],
    [
     115.80513,
     33.90447
    ],
    [
     115.80392,
     33.89232
    ],
    [
     115.79545,
     33.86697
    ],
    [
     115.79335,
     33.85096
    ]
   ]
  },
  {
   "id": "bo-zhou-bo-zhou-nan",
   "name": "商合杭高速铁路（北段）",
   "from": "bo-zhou",
   "to": "bo-zhou-nan",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 7.05,
   "polyline": [
    [
     115.79335,
     33.85096
    ],
    [
     115.79073,
     33.81812
    ],
    [
     115.79229,
     33.79202
    ],
    [
     115.79309,
     33.79624
    ]
   ]
  },
  {
   "id": "bo-zhou-nan-you-he-ji",
   "name": "商合杭高速铁路（北段）",
   "from": "bo-zhou-nan",
   "to": "you-he-ji",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 16.63,
   "polyline": [
    [
     115.79309,
     33.79624
    ],
    [
     115.79219,
     33.79162
    ],
    [
     115.79536,
     33.74229
    ],
    [
     115.79547,
     33.71704
    ],
    [
     115.8007,
     33.64702
    ]
   ]
  },
  {
   "id": "you-he-ji-gu-cheng-ji",
   "name": "商合杭高速铁路（北段）",
   "from": "you-he-ji",
   "to": "gu-cheng-ji",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 11.21,
   "polyline": [
    [
     115.8007,
     33.64702
    ],
    [
     115.8047,
     33.54628
    ]
   ]
  },
  {
   "id": "gu-cheng-ji-gu-cheng-dong",
   "name": "商合杭高速铁路（北段）",
   "from": "gu-cheng-ji",
   "to": "gu-cheng-dong",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 2.04,
   "polyline": [
    [
     115.8047,
     33.54628
    ],
    [
     115.80622,
     33.52806
    ]
   ]
  },
  {
   "id": "gu-cheng-dong-tai-he-dong",
   "name": "商合杭高速铁路（北段）",
   "from": "gu-cheng-dong",
   "to": "tai-he-dong",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 42.8,
   "polyline": [
    [
     115.80622,
     33.52806
    ],
    [
     115.80705,
     33.46876
    ],
    [
     115.81337,
     33.43754
    ],
    [
     115.81221,
     33.42026
    ],
    [
     115.80917,
     33.41125
    ],
    [
     115.80239,
     33.3993
    ],
    [
     115.78208,
     33.37627
    ],
    [
     115.77079,
     33.35868
    ],
    [
     115.74847,
     33.31032
    ],
    [
     115.72834,
     33.24627
    ],
    [
     115.72274,
     33.15919
    ]
   ]
  },
  {
   "id": "tai-he-dong-fu-yang-xi",
   "name": "商合杭高速铁路（北段）",
   "from": "tai-he-dong",
   "to": "fu-yang-xi",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 31.22,
   "polyline": [
    [
     115.72274,
     33.15919
    ],
    [
     115.72081,
     33.11865
    ],
    [
     115.73581,
     33.03234
    ],
    [
     115.76042,
     32.97688
    ],
    [
     115.76388,
     32.96142
    ],
    [
     115.76269,
     32.94581
    ],
    [
     115.74763,
     32.88494
    ]
   ]
  },
  {
   "id": "fu-yang-xi-ying-shang-bei",
   "name": "商合杭高速铁路（北段）",
   "from": "fu-yang-xi",
   "to": "ying-shang-bei",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 57.1,
   "polyline": [
    [
     115.74763,
     32.88494
    ],
    [
     115.73653,
     32.84262
    ],
    [
     115.73664,
     32.82826
    ],
    [
     115.74021,
     32.81575
    ],
    [
     115.74781,
     32.80244
    ],
    [
     115.75768,
     32.79199
    ],
    [
     115.7723,
     32.78217
    ],
    [
     115.792,
     32.77249
    ],
    [
     115.82906,
     32.7589
    ],
    [
     115.92231,
     32.73998
    ],
    [
     115.96062,
     32.72879
    ],
    [
     116.05154,
     32.71108
    ],
    [
     116.07671,
     32.70402
    ],
    [
     116.10991,
     32.69714
    ],
    [
     116.15814,
     32.69202
    ],
    [
     116.20589,
     32.68115
    ]
   ]
  },
  {
   "id": "ying-shang-bei-feng-tai-nan",
   "name": "商合杭高速铁路（北段）",
   "from": "ying-shang-bei",
   "to": "feng-tai-nan",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 39.58,
   "polyline": [
    [
     116.20589,
     32.68115
    ],
    [
     116.26677,
     32.66852
    ],
    [
     116.3047,
     32.66411
    ],
    [
     116.33172,
     32.65647
    ],
    [
     116.37725,
     32.64867
    ],
    [
     116.40994,
     32.64073
    ],
    [
     116.49818,
     32.63508
    ],
    [
     116.51693,
     32.63802
    ],
    [
     116.54512,
     32.64761
    ],
    [
     116.56522,
     32.65009
    ],
    [
     116.58482,
     32.64799
    ],
    [
     116.61728,
     32.63857
    ]
   ]
  },
  {
   "id": "feng-tai-nan-shou-xian",
   "name": "商合杭高速铁路（北段）",
   "from": "feng-tai-nan",
   "to": "shou-xian",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 22.9,
   "polyline": [
    [
     116.61728,
     32.63857
    ],
    [
     116.64202,
     32.63093
    ],
    [
     116.66023,
     32.6271
    ],
    [
     116.69798,
     32.62637
    ],
    [
     116.70806,
     32.625
    ],
    [
     116.7216,
     32.61939
    ],
    [
     116.73894,
     32.6065
    ],
    [
     116.74764,
     32.60223
    ],
    [
     116.75715,
     32.59992
    ],
    [
     116.78721,
     32.5972
    ],
    [
     116.81695,
     32.59138
    ],
    [
     116.80055,
     32.59508
    ]
   ]
  },
  {
   "id": "shou-xian-huai-nan-nan",
   "name": "商合杭高速铁路（北段）",
   "from": "shou-xian",
   "to": "huai-nan-nan",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 23.76,
   "polyline": [
    [
     116.80055,
     32.59508
    ],
    [
     116.8272,
     32.58833
    ],
    [
     116.85488,
     32.57601
    ],
    [
     116.89862,
     32.56198
    ],
    [
     116.94431,
     32.55775
    ],
    [
     116.97762,
     32.54825
    ],
    [
     116.9937,
     32.54512
    ],
    [
     117.03592,
     32.54425
    ]
   ]
  },
  {
   "id": "huai-nan-nan-shui-jia-hu",
   "name": "商合杭高速铁路（北段）",
   "from": "huai-nan-nan",
   "to": "shui-jia-hu",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 15.72,
   "polyline": [
    [
     117.03592,
     32.54425
    ],
    [
     117.08086,
     32.54373
    ],
    [
     117.09606,
     32.54043
    ],
    [
     117.11676,
     32.53301
    ],
    [
     117.13284,
     32.5238
    ],
    [
     117.14454,
     32.51343
    ],
    [
     117.16409,
     32.48536
    ]
   ]
  },
  {
   "id": "shui-jia-hu-dai-ji",
   "name": "商合杭高速铁路（北段）",
   "from": "shui-jia-hu",
   "to": "dai-ji",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 10.08,
   "polyline": [
    [
     117.16409,
     32.48536
    ],
    [
     117.17671,
     32.46305
    ],
    [
     117.18217,
     32.44698
    ],
    [
     117.18331,
     32.43529
    ],
    [
     117.18144,
     32.39789
    ]
   ]
  },
  {
   "id": "dai-ji-xia-tang-ji",
   "name": "商合杭高速铁路（北段）",
   "from": "dai-ji",
   "to": "xia-tang-ji",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 22.65,
   "polyline": [
    [
     117.18144,
     32.39789
    ],
    [
     117.18252,
     32.38479
    ],
    [
     117.20111,
     32.2977
    ],
    [
     117.20359,
     32.2595
    ],
    [
     117.20087,
     32.23554
    ],
    [
     117.2016,
     32.22486
    ],
    [
     117.2042,
     32.21498
    ],
    [
     117.21156,
     32.19722
    ]
   ]
  },
  {
   "id": "xia-tang-ji-he-fei-bei-cheng",
   "name": "商合杭高速铁路（北段）",
   "from": "xia-tang-ji",
   "to": "he-fei-bei-cheng",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 15.12,
   "polyline": [
    [
     117.21156,
     32.19722
    ],
    [
     117.2164,
     32.18366
    ],
    [
     117.22609,
     32.14392
    ],
    [
     117.22987,
     32.11826
    ],
    [
     117.24106,
     32.09278
    ],
    [
     117.2467,
     32.06535
    ]
   ]
  },
  {
   "id": "he-fei-bei-cheng-shuang-dun-ji",
   "name": "商合杭高速铁路（北段）",
   "from": "he-fei-bei-cheng",
   "to": "shuang-dun-ji",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 6.15,
   "polyline": [
    [
     117.2467,
     32.06535
    ],
    [
     117.25297,
     32.02855
    ],
    [
     117.25463,
     32.0105
    ]
   ]
  },
  {
   "id": "shuang-dun-ji-he-fei-bei",
   "name": "商合杭高速铁路（北段）",
   "from": "shuang-dun-ji",
   "to": "he-fei-bei",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 10.78,
   "polyline": [
    [
     117.25463,
     32.0105
    ],
    [
     117.25603,
     32.00085
    ],
    [
     117.26065,
     31.98839
    ],
    [
     117.2626,
     31.97562
    ],
    [
     117.27985,
     31.95372
    ],
    [
     117.28527,
     31.91934
    ]
   ]
  },
  {
   "id": "he-fei-bei-tao-hua-dian",
   "name": "商合杭高速铁路（北段）",
   "from": "he-fei-bei",
   "to": "tao-hua-dian",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 3.79,
   "polyline": [
    [
     117.28527,
     31.91934
    ],
    [
     117.2831,
     31.91456
    ],
    [
     117.28041,
     31.91236
    ],
    [
     117.26564,
     31.90825
    ],
    [
     117.25673,
     31.89837
    ]
   ]
  },
  {
   "id": "tao-hua-dian-shu-shan-dong",
   "name": "商合杭高速铁路（北段）",
   "from": "tao-hua-dian",
   "to": "shu-shan-dong",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 9.12,
   "polyline": [
    [
     117.25673,
     31.89837
    ],
    [
     117.23313,
     31.87958
    ],
    [
     117.2127,
     31.85394
    ],
    [
     117.21015,
     31.83083
    ]
   ]
  },
  {
   "id": "shu-shan-dong-hefei-south",
   "name": "商合杭高速铁路（北段）",
   "from": "shu-shan-dong",
   "to": "hefei-south",
   "lineIds": [
    "shanghehang-north"
   ],
   "serviceDate": "2019-12-01",
   "estLengthKm": 12.33,
   "polyline": [
    [
     117.21015,
     31.83083
    ],
    [
     117.20916,
     31.82465
    ],
    [
     117.19767,
     31.80847
    ],
    [
     117.20204,
     31.80276
    ],
    [
     117.21471,
     31.79604
    ],
    [
     117.23014,
     31.79257
    ],
    [
     117.25648,
     31.79779
    ],
    [
     117.2613,
     31.79633
    ],
    [
     117.27138,
     31.79885
    ],
    [
     117.29,
     31.8
    ]
   ]
  },
  {
   "id": "hefei-south-zhu-xi",
   "name": "合安高速铁路",
   "from": "hefei-south",
   "to": "zhu-xi",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 10.49,
   "polyline": [
    [
     117.29,
     31.8
    ],
    [
     117.26479,
     31.79941
    ],
    [
     117.21525,
     31.79098
    ],
    [
     117.18037,
     31.79058
    ]
   ]
  },
  {
   "id": "zhu-xi-fei-xi",
   "name": "合安高速铁路",
   "from": "zhu-xi",
   "to": "fei-xi",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 10.61,
   "polyline": [
    [
     117.18037,
     31.79058
    ],
    [
     117.15782,
     31.78815
    ],
    [
     117.15169,
     31.78456
    ],
    [
     117.14946,
     31.78165
    ],
    [
     117.14811,
     31.77174
    ],
    [
     117.1504,
     31.74463
    ],
    [
     117.14713,
     31.73402
    ],
    [
     117.13728,
     31.71838
    ]
   ]
  },
  {
   "id": "fei-xi-shu-cheng-dong",
   "name": "合安高速铁路",
   "from": "fei-xi",
   "to": "shu-cheng-dong",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 31.93,
   "polyline": [
    [
     117.13728,
     31.71838
    ],
    [
     117.14048,
     31.72435
    ],
    [
     117.12512,
     31.70294
    ],
    [
     117.11365,
     31.69219
    ],
    [
     117.10249,
     31.68534
    ],
    [
     117.07187,
     31.67272
    ],
    [
     117.05585,
     31.66248
    ],
    [
     117.04232,
     31.64832
    ],
    [
     117.0343,
     31.63412
    ],
    [
     117.03004,
     31.61898
    ],
    [
     117.02701,
     31.54481
    ],
    [
     117.02906,
     31.53192
    ],
    [
     117.04204,
     31.487
    ]
   ]
  },
  {
   "id": "shu-cheng-dong-lu-jiang-xi",
   "name": "合安高速铁路",
   "from": "shu-cheng-dong",
   "to": "lu-jiang-xi",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 31.77,
   "polyline": [
    [
     117.04204,
     31.487
    ],
    [
     117.0482,
     31.46777
    ],
    [
     117.0536,
     31.4561
    ],
    [
     117.06319,
     31.44262
    ],
    [
     117.07431,
     31.43201
    ],
    [
     117.08436,
     31.42501
    ],
    [
     117.18227,
     31.3713
    ],
    [
     117.1934,
     31.36302
    ],
    [
     117.20556,
     31.3499
    ],
    [
     117.21632,
     31.33003
    ],
    [
     117.2204,
     31.31059
    ],
    [
     117.21899,
     31.29146
    ],
    [
     117.21245,
     31.26981
    ]
   ]
  },
  {
   "id": "lu-jiang-xi-tong-cheng-dong",
   "name": "合安高速铁路",
   "from": "lu-jiang-xi",
   "to": "tong-cheng-dong",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 32.25,
   "polyline": [
    [
     117.21245,
     31.26981
    ],
    [
     117.18891,
     31.20657
    ],
    [
     117.18222,
     31.19506
    ],
    [
     117.14064,
     31.14719
    ],
    [
     117.05848,
     31.06622
    ],
    [
     117.0344,
     31.02767
    ]
   ]
  },
  {
   "id": "tong-cheng-dong-tong-cheng-nan",
   "name": "合安高速铁路",
   "from": "tong-cheng-dong",
   "to": "tong-cheng-nan",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 18.29,
   "polyline": [
    [
     117.0344,
     31.02767
    ],
    [
     117.01333,
     30.99096
    ],
    [
     116.98072,
     30.95634
    ],
    [
     116.97028,
     30.94097
    ],
    [
     116.96586,
     30.93079
    ],
    [
     116.96308,
     30.91979
    ],
    [
     116.95999,
     30.88087
    ]
   ]
  },
  {
   "id": "tong-cheng-nan-huai-ning",
   "name": "合安高速铁路",
   "from": "tong-cheng-nan",
   "to": "huai-ning",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 30.12,
   "polyline": [
    [
     116.95999,
     30.88087
    ],
    [
     116.95897,
     30.84998
    ],
    [
     116.9704,
     30.80834
    ],
    [
     116.97404,
     30.77482
    ],
    [
     116.9728,
     30.75994
    ],
    [
     116.96748,
     30.7456
    ],
    [
     116.95452,
     30.72889
    ],
    [
     116.92158,
     30.70098
    ],
    [
     116.90785,
     30.69115
    ],
    [
     116.8868,
     30.68164
    ],
    [
     116.84513,
     30.6713
    ]
   ]
  },
  {
   "id": "huai-ning-an-qing-bei",
   "name": "合安高速铁路",
   "from": "huai-ning",
   "to": "an-qing-bei",
   "lineIds": [
    "hean-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 25.34,
   "polyline": [
    [
     116.84513,
     30.6713
    ],
    [
     116.90507,
     30.68569
    ],
    [
     116.91566,
     30.68376
    ],
    [
     116.93291,
     30.67464
    ],
    [
     116.95815,
     30.65354
    ],
    [
     116.96276,
     30.64764
    ],
    [
     116.96352,
     30.63895
    ],
    [
     116.95787,
     30.62203
    ],
    [
     116.95785,
     30.61632
    ],
    [
     116.96267,
     30.60592
    ],
    [
     116.97244,
     30.59475
    ],
    [
     116.97949,
     30.57849
    ],
    [
     116.98661,
     30.57207
    ],
    [
     117.0018,
     30.56678
    ]
   ]
  },
  {
   "id": "an-qing-bei-an-qing",
   "name": "合安高速铁路",
   "from": "an-qing-bei",
   "to": "an-qing",
   "lineIds": [
    "hean-hsr",
    "anjiu-hsr"
   ],
   "serviceDate": "2020-12-22",
   "estLengthKm": 5.93,
   "polyline": [
    [
     117.0018,
     30.56678
    ],
    [
     117.0158,
     30.56141
    ],
    [
     117.03867,
     30.55792
    ],
    [
     117.06005,
     30.5515
    ]
   ]
  },
  {
   "id": "an-qing-bei-an-qing-xi",
   "name": "安九高速铁路",
   "from": "an-qing-bei",
   "to": "an-qing-xi",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 23.11,
   "polyline": [
    [
     117.0018,
     30.56678
    ],
    [
     116.98754,
     30.57161
    ],
    [
     116.97989,
     30.57786
    ],
    [
     116.97329,
     30.59336
    ],
    [
     116.96267,
     30.60592
    ],
    [
     116.95785,
     30.61632
    ],
    [
     116.95787,
     30.62203
    ],
    [
     116.96363,
     30.63969
    ],
    [
     116.96264,
     30.64789
    ],
    [
     116.95815,
     30.65354
    ],
    [
     116.93489,
     30.67325
    ],
    [
     116.916,
     30.68361
    ],
    [
     116.90507,
     30.68569
    ],
    [
     116.85422,
     30.67347
    ]
   ]
  },
  {
   "id": "an-qing-xi-qian-shan",
   "name": "安九高速铁路",
   "from": "an-qing-xi",
   "to": "qian-shan",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 30.86,
   "polyline": [
    [
     116.85422,
     30.67347
    ],
    [
     116.8203,
     30.66488
    ],
    [
     116.72418,
     30.63123
    ],
    [
     116.7108,
     30.6248
    ],
    [
     116.64991,
     30.58964
    ],
    [
     116.61205,
     30.57631
    ]
   ]
  },
  {
   "id": "qian-shan-tai-hu-nan",
   "name": "安九高速铁路",
   "from": "qian-shan",
   "to": "tai-hu-nan",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 33.32,
   "polyline": [
    [
     116.61205,
     30.57631
    ],
    [
     116.57677,
     30.56308
    ],
    [
     116.51025,
     30.52654
    ],
    [
     116.41435,
     30.45624
    ],
    [
     116.38069,
     30.43396
    ],
    [
     116.35793,
     30.41078
    ]
   ]
  },
  {
   "id": "tai-hu-nan-su-song-dong",
   "name": "安九高速铁路",
   "from": "tai-hu-nan",
   "to": "su-song-dong",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 35.1,
   "polyline": [
    [
     116.35793,
     30.41078
    ],
    [
     116.27345,
     30.31427
    ],
    [
     116.26633,
     30.30387
    ],
    [
     116.22023,
     30.21927
    ],
    [
     116.1974,
     30.19064
    ],
    [
     116.1703,
     30.15334
    ]
   ]
  },
  {
   "id": "su-song-dong-huang-mei-dong",
   "name": "安九高速铁路",
   "from": "su-song-dong",
   "to": "huang-mei-dong",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 22.91,
   "polyline": [
    [
     116.1703,
     30.15334
    ],
    [
     116.15367,
     30.13123
    ],
    [
     116.14477,
     30.12355
    ],
    [
     116.1299,
     30.11485
    ],
    [
     116.11559,
     30.10972
    ],
    [
     116.09854,
     30.10673
    ],
    [
     116.08404,
     30.1067
    ],
    [
     116.05301,
     30.10948
    ],
    [
     116.02718,
     30.10531
    ],
    [
     116.0151,
     30.10054
    ],
    [
     115.99953,
     30.09093
    ],
    [
     115.97196,
     30.06677
    ]
   ]
  },
  {
   "id": "huang-mei-dong-hh-junction",
   "name": "安九高速铁路",
   "from": "huang-mei-dong",
   "to": "hh-junction",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 1.51,
   "polyline": [
    [
     115.97196,
     30.06677
    ],
    [
     115.96096,
     30.0571
    ]
   ]
  },
  {
   "id": "hh-junction-huang-mei-nan",
   "name": "安九高速铁路",
   "from": "hh-junction",
   "to": "huang-mei-nan",
   "lineIds": [
    "anjiu-hsr",
    "huanghuang-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 16.54,
   "polyline": [
    [
     115.96096,
     30.0571
    ],
    [
     115.94412,
     30.04165
    ],
    [
     115.93228,
     30.02519
    ],
    [
     115.90496,
     29.9686
    ],
    [
     115.8979,
     29.94343
    ]
   ]
  },
  {
   "id": "huang-mei-nan-lu-shan",
   "name": "安九高速铁路",
   "from": "huang-mei-nan",
   "to": "lu-shan",
   "lineIds": [
    "anjiu-hsr"
   ],
   "serviceDate": "2021-12-30",
   "estLengthKm": 39.3,
   "polyline": [
    [
     115.8979,
     29.94343
    ],
    [
     115.88806,
     29.90461
    ],
    [
     115.87051,
     29.76872
    ],
    [
     115.86643,
     29.7557
    ],
    [
     115.84904,
     29.71969
    ],
    [
     115.84574,
     29.70604
    ],
    [
     115.84726,
     29.68881
    ],
    [
     115.86258,
     29.65545
    ],
    [
     115.87143,
     29.6253
    ],
    [
     115.87434,
     29.59964
    ]
   ]
  },
  {
   "id": "jiu-jiang-jiu-jiang-nan",
   "name": "昌九城际铁路",
   "from": "jiu-jiang",
   "to": "jiu-jiang-nan",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 4.39,
   "polyline": [
    [
     116.00167,
     29.7066
    ],
    [
     115.97876,
     29.68787
    ],
    [
     115.96693,
     29.68154
    ]
   ]
  },
  {
   "id": "jiu-jiang-nan-jiu-jiang-xi",
   "name": "昌九城际铁路",
   "from": "jiu-jiang-nan",
   "to": "jiu-jiang-xi",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 8.94,
   "polyline": [
    [
     115.96693,
     29.68154
    ],
    [
     115.95067,
     29.67366
    ],
    [
     115.93072,
     29.67224
    ],
    [
     115.92206,
     29.66918
    ],
    [
     115.91564,
     29.66362
    ],
    [
     115.89433,
     29.63935
    ]
   ]
  },
  {
   "id": "jiu-jiang-xi-lu-shan",
   "name": "昌九城际铁路",
   "from": "jiu-jiang-xi",
   "to": "lu-shan",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 5.05,
   "polyline": [
    [
     115.89433,
     29.63935
    ],
    [
     115.88373,
     29.6307
    ],
    [
     115.87958,
     29.62485
    ],
    [
     115.87434,
     29.59964
    ]
   ]
  },
  {
   "id": "lu-shan-de-an",
   "name": "昌九城际铁路",
   "from": "lu-shan",
   "to": "de-an",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 35.43,
   "polyline": [
    [
     115.87434,
     29.59964
    ],
    [
     115.87612,
     29.60383
    ],
    [
     115.87848,
     29.58302
    ],
    [
     115.8756,
     29.56616
    ],
    [
     115.83104,
     29.48996
    ],
    [
     115.79362,
     29.38984
    ],
    [
     115.78873,
     29.35944
    ],
    [
     115.78454,
     29.34439
    ],
    [
     115.77943,
     29.33554
    ],
    [
     115.76856,
     29.32434
    ],
    [
     115.76189,
     29.31178
    ]
   ]
  },
  {
   "id": "de-an-gong-qing-cheng",
   "name": "昌九城际铁路",
   "from": "de-an",
   "to": "gong-qing-cheng",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 10.8,
   "polyline": [
    [
     115.76189,
     29.31178
    ],
    [
     115.7539,
     29.29398
    ],
    [
     115.7546,
     29.27709
    ],
    [
     115.7585,
     29.26432
    ],
    [
     115.76975,
     29.24566
    ]
   ]
  },
  {
   "id": "gong-qing-cheng-yong-xiu",
   "name": "昌九城际铁路",
   "from": "gong-qing-cheng",
   "to": "yong-xiu",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 25.28,
   "polyline": [
    [
     115.76975,
     29.24566
    ],
    [
     115.77804,
     29.22742
    ],
    [
     115.79839,
     29.14342
    ],
    [
     115.80589,
     29.11839
    ],
    [
     115.80797,
     29.04797
    ],
    [
     115.8109,
     29.02289
    ]
   ]
  },
  {
   "id": "yong-xiu-xin-qi-zhou",
   "name": "昌九城际铁路",
   "from": "yong-xiu",
   "to": "xin-qi-zhou",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 9.2,
   "polyline": [
    [
     115.8109,
     29.02289
    ],
    [
     115.81373,
     29.00866
    ],
    [
     115.81519,
     28.97893
    ],
    [
     115.82361,
     28.9489
    ]
   ]
  },
  {
   "id": "xin-qi-zhou-le-hua",
   "name": "昌九城际铁路",
   "from": "xin-qi-zhou",
   "to": "le-hua",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 15.57,
   "polyline": [
    [
     115.82361,
     28.9489
    ],
    [
     115.83341,
     28.92355
    ],
    [
     115.84976,
     28.8977
    ],
    [
     115.85247,
     28.88158
    ],
    [
     115.87017,
     28.84181
    ],
    [
     115.87285,
     28.8321
    ],
    [
     115.86704,
     28.81867
    ]
   ]
  },
  {
   "id": "le-hua-nan-chang-bei",
   "name": "昌九城际铁路",
   "from": "le-hua",
   "to": "nan-chang-bei",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 9.23,
   "polyline": [
    [
     115.86704,
     28.81867
    ],
    [
     115.85502,
     28.80288
    ],
    [
     115.8491,
     28.78984
    ],
    [
     115.8483,
     28.78348
    ],
    [
     115.84981,
     28.77572
    ],
    [
     115.85832,
     28.75623
    ],
    [
     115.86038,
     28.74161
    ]
   ]
  },
  {
   "id": "nan-chang-bei-nan-chang",
   "name": "昌九城际铁路",
   "from": "nan-chang-bei",
   "to": "nan-chang",
   "lineIds": [
    "changjiu-int"
   ],
   "serviceDate": "2010-09-20",
   "estLengthKm": 12.98,
   "polyline": [
    [
     115.86038,
     28.74161
    ],
    [
     115.862,
     28.7305
    ],
    [
     115.86452,
     28.72778
    ],
    [
     115.87108,
     28.72557
    ],
    [
     115.8983,
     28.72576
    ],
    [
     115.91548,
     28.70699
    ],
    [
     115.91482,
     28.66529
    ]
   ]
  },
  {
   "id": "nan-chang-qing-yun-pu",
   "name": "昌赣高速铁路",
   "from": "nan-chang",
   "to": "qing-yun-pu",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 7.64,
   "polyline": [
    [
     115.91482,
     28.66529
    ],
    [
     115.91361,
     28.65406
    ],
    [
     115.9089,
     28.63615
    ],
    [
     115.91525,
     28.61209
    ],
    [
     115.92243,
     28.59932
    ]
   ]
  },
  {
   "id": "qing-yun-pu-lian-tang",
   "name": "昌赣高速铁路",
   "from": "qing-yun-pu",
   "to": "lian-tang",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 6.63,
   "polyline": [
    [
     115.92243,
     28.59932
    ],
    [
     115.94084,
     28.56128
    ],
    [
     115.94166,
     28.55227
    ]
   ]
  },
  {
   "id": "lian-tang-feng-cheng-dong",
   "name": "昌赣高速铁路",
   "from": "lian-tang",
   "to": "feng-cheng-dong",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 61.33,
   "polyline": [
    [
     115.94166,
     28.55227
    ],
    [
     115.94552,
     28.52985
    ],
    [
     115.96806,
     28.55937
    ],
    [
     115.98961,
     28.57336
    ],
    [
     115.99074,
     28.57167
    ],
    [
     115.98014,
     28.5527
    ],
    [
     115.97592,
     28.53426
    ],
    [
     115.97673,
     28.50874
    ],
    [
     115.9841,
     28.47807
    ],
    [
     115.98297,
     28.44144
    ],
    [
     115.98678,
     28.40556
    ],
    [
     115.98482,
     28.38985
    ],
    [
     115.97606,
     28.36202
    ],
    [
     115.96372,
     28.33962
    ],
    [
     115.93229,
     28.29025
    ],
    [
     115.916,
     28.27642
    ],
    [
     115.89012,
     28.26367
    ],
    [
     115.87497,
     28.25201
    ],
    [
     115.83694,
     28.20301
    ],
    [
     115.80587,
     28.16871
    ]
   ]
  },
  {
   "id": "feng-cheng-dong-zhang-shu-dong",
   "name": "昌赣高速铁路",
   "from": "feng-cheng-dong",
   "to": "zhang-shu-dong",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 31.02,
   "polyline": [
    [
     115.80587,
     28.16871
    ],
    [
     115.79079,
     28.14769
    ],
    [
     115.76187,
     28.10077
    ],
    [
     115.7534,
     28.09018
    ],
    [
     115.74449,
     28.08248
    ],
    [
     115.72138,
     28.06758
    ],
    [
     115.68724,
     28.04061
    ],
    [
     115.64932,
     27.99935
    ],
    [
     115.63691,
     27.9884
    ],
    [
     115.60816,
     27.97293
    ],
    [
     115.5957,
     27.96821
    ]
   ]
  },
  {
   "id": "zhang-shu-dong-xin-gan-dong",
   "name": "昌赣高速铁路",
   "from": "zhang-shu-dong",
   "to": "xin-gan-dong",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 31.73,
   "polyline": [
    [
     115.5957,
     27.96821
    ],
    [
     115.5738,
     27.95359
    ],
    [
     115.52828,
     27.91578
    ],
    [
     115.4936,
     27.88071
    ],
    [
     115.48375,
     27.86552
    ],
    [
     115.47577,
     27.84087
    ],
    [
     115.47158,
     27.8322
    ],
    [
     115.45055,
     27.79335
    ],
    [
     115.43161,
     27.76597
    ],
    [
     115.42177,
     27.74695
    ]
   ]
  },
  {
   "id": "xin-gan-dong-xia-jiang",
   "name": "昌赣高速铁路",
   "from": "xin-gan-dong",
   "to": "xia-jiang",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 19.44,
   "polyline": [
    [
     115.42177,
     27.74695
    ],
    [
     115.41567,
     27.73292
    ],
    [
     115.40332,
     27.71322
    ],
    [
     115.39334,
     27.68598
    ],
    [
     115.3883,
     27.67653
    ],
    [
     115.38005,
     27.6662
    ],
    [
     115.36136,
     27.65033
    ],
    [
     115.35245,
     27.64057
    ],
    [
     115.33928,
     27.62004
    ],
    [
     115.33078,
     27.60227
    ]
   ]
  },
  {
   "id": "xia-jiang-ji-shui-xi",
   "name": "昌赣高速铁路",
   "from": "xia-jiang",
   "to": "ji-shui-xi",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 45.88,
   "polyline": [
    [
     115.33078,
     27.60227
    ],
    [
     115.32295,
     27.57938
    ],
    [
     115.32122,
     27.55192
    ],
    [
     115.31888,
     27.54075
    ],
    [
     115.30776,
     27.51489
    ],
    [
     115.30003,
     27.50176
    ],
    [
     115.28982,
     27.49116
    ],
    [
     115.27076,
     27.47783
    ],
    [
     115.26273,
     27.47017
    ],
    [
     115.24573,
     27.45169
    ],
    [
     115.22134,
     27.41747
    ],
    [
     115.2003,
     27.39756
    ],
    [
     115.18412,
     27.37685
    ],
    [
     115.15596,
     27.35317
    ],
    [
     115.13297,
     27.32382
    ],
    [
     115.10468,
     27.30159
    ],
    [
     115.08566,
     27.28138
    ]
   ]
  },
  {
   "id": "ji-shui-xi-ji-an-xi",
   "name": "昌赣高速铁路",
   "from": "ji-shui-xi",
   "to": "ji-an-xi",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 23.85,
   "polyline": [
    [
     115.08566,
     27.28138
    ],
    [
     115.06516,
     27.26255
    ],
    [
     115.00165,
     27.2223
    ],
    [
     114.97651,
     27.20232
    ],
    [
     114.96854,
     27.19414
    ],
    [
     114.92839,
     27.13947
    ]
   ]
  },
  {
   "id": "ji-an-xi-tai-he",
   "name": "昌赣高速铁路",
   "from": "ji-an-xi",
   "to": "tai-he",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 36.26,
   "polyline": [
    [
     114.92839,
     27.13947
    ],
    [
     114.89947,
     27.10539
    ],
    [
     114.88621,
     27.07981
    ],
    [
     114.8835,
     27.06364
    ],
    [
     114.88454,
     27.00256
    ],
    [
     114.88858,
     26.98241
    ],
    [
     114.9138,
     26.92364
    ],
    [
     114.92908,
     26.89986
    ],
    [
     114.93941,
     26.87601
    ],
    [
     114.94395,
     26.85805
    ],
    [
     114.94434,
     26.83558
    ]
   ]
  },
  {
   "id": "tai-he-wan-an-xian",
   "name": "昌赣高速铁路",
   "from": "tai-he",
   "to": "wan-an-xian",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 37.95,
   "polyline": [
    [
     114.94434,
     26.83558
    ],
    [
     114.94486,
     26.824
    ],
    [
     114.94227,
     26.80673
    ],
    [
     114.94137,
     26.78346
    ],
    [
     114.93669,
     26.76546
    ],
    [
     114.91537,
     26.72311
    ],
    [
     114.88237,
     26.66693
    ],
    [
     114.86169,
     26.62134
    ],
    [
     114.83685,
     26.58676
    ],
    [
     114.83124,
     26.57618
    ],
    [
     114.82866,
     26.5652
    ],
    [
     114.82888,
     26.55375
    ],
    [
     114.83156,
     26.54376
    ],
    [
     114.83863,
     26.52861
    ]
   ]
  },
  {
   "id": "wan-an-xian-xing-guo-xi",
   "name": "昌赣高速铁路",
   "from": "wan-an-xian",
   "to": "xing-guo-xi",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 52.81,
   "polyline": [
    [
     114.83863,
     26.52861
    ],
    [
     114.84789,
     26.5123
    ],
    [
     114.85443,
     26.5042
    ],
    [
     114.86226,
     26.49761
    ],
    [
     114.87414,
     26.49153
    ],
    [
     115.03039,
     26.43194
    ],
    [
     115.05481,
     26.42377
    ],
    [
     115.13283,
     26.40662
    ],
    [
     115.24511,
     26.37006
    ],
    [
     115.25652,
     26.362
    ],
    [
     115.2677,
     26.34887
    ],
    [
     115.2731,
     26.33437
    ],
    [
     115.27445,
     26.31891
    ]
   ]
  },
  {
   "id": "xing-guo-xi-gan-xian-bei",
   "name": "昌赣高速铁路",
   "from": "xing-guo-xi",
   "to": "gan-xian-bei",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 36.83,
   "polyline": [
    [
     115.27445,
     26.31891
    ],
    [
     115.27436,
     26.29196
    ],
    [
     115.2567,
     26.24463
    ],
    [
     115.24891,
     26.22585
    ],
    [
     115.22053,
     26.16866
    ],
    [
     115.21229,
     26.1466
    ],
    [
     115.1861,
     26.08772
    ],
    [
     115.17389,
     26.04773
    ],
    [
     115.15042,
     26.01038
    ]
   ]
  },
  {
   "id": "gan-xian-bei-gan-xian",
   "name": "昌赣高速铁路",
   "from": "gan-xian-bei",
   "to": "gan-xian",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 6.09,
   "polyline": [
    [
     115.15042,
     26.01038
    ],
    [
     115.13237,
     25.98366
    ],
    [
     115.11605,
     25.96544
    ]
   ]
  },
  {
   "id": "gan-xian-mao-dian",
   "name": "昌赣高速铁路",
   "from": "gan-xian",
   "to": "mao-dian",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 4.15,
   "polyline": [
    [
     115.11605,
     25.96544
    ],
    [
     115.10187,
     25.95463
    ],
    [
     115.08247,
     25.94402
    ]
   ]
  },
  {
   "id": "mao-dian-gan-zhou-xi",
   "name": "昌赣高速铁路",
   "from": "mao-dian",
   "to": "gan-zhou-xi",
   "lineIds": [
    "changgan-hsr"
   ],
   "serviceDate": "2019-12-26",
   "estLengthKm": 32.73,
   "polyline": [
    [
     115.08247,
     25.94402
    ],
    [
     115.06374,
     25.93496
    ],
    [
     115.0164,
     25.92056
    ],
    [
     115.00373,
     25.91399
    ],
    [
     114.98501,
     25.9013
    ],
    [
     114.96951,
     25.89517
    ],
    [
     114.94698,
     25.8923
    ],
    [
     114.92546,
     25.89224
    ],
    [
     114.88811,
     25.89461
    ],
    [
     114.87389,
     25.89252
    ],
    [
     114.86099,
     25.8881
    ],
    [
     114.84623,
     25.87924
    ],
    [
     114.83503,
     25.86806
    ],
    [
     114.82741,
     25.85584
    ],
    [
     114.81156,
     25.82303
    ]
   ]
  },
  {
   "id": "gan-zhou-xi-xin-feng",
   "name": "赣深高速铁路",
   "from": "gan-zhou-xi",
   "to": "xin-feng",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 50.15,
   "polyline": [
    [
     114.81156,
     25.82303
    ],
    [
     114.80185,
     25.80535
    ],
    [
     114.79856,
     25.79529
    ],
    [
     114.79642,
     25.78201
    ],
    [
     114.79712,
     25.76747
    ],
    [
     114.80007,
     25.75527
    ],
    [
     114.80631,
     25.74169
    ],
    [
     114.81487,
     25.73001
    ],
    [
     114.84111,
     25.70287
    ],
    [
     114.8499,
     25.68756
    ],
    [
     114.85734,
     25.66706
    ],
    [
     114.86221,
     25.64781
    ],
    [
     114.8643,
     25.63264
    ],
    [
     114.86254,
     25.58176
    ],
    [
     114.86926,
     25.53176
    ],
    [
     114.8733,
     25.45659
    ],
    [
     114.87589,
     25.4461
    ],
    [
     114.89557,
     25.39505
    ]
   ]
  },
  {
   "id": "xin-feng-xin-feng-xi",
   "name": "赣深高速铁路",
   "from": "xin-feng",
   "to": "xin-feng-xi",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 5.84,
   "polyline": [
    [
     114.89557,
     25.39505
    ],
    [
     114.89784,
     25.37741
    ],
    [
     114.89545,
     25.35348
    ]
   ]
  },
  {
   "id": "xin-feng-xi-long-nan-dong",
   "name": "赣深高速铁路",
   "from": "xin-feng-xi",
   "to": "long-nan-dong",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 51.64,
   "polyline": [
    [
     114.89545,
     25.35348
    ],
    [
     114.8911,
     25.33029
    ],
    [
     114.88063,
     25.28909
    ],
    [
     114.86358,
     25.25599
    ],
    [
     114.85929,
     25.24256
    ],
    [
     114.85794,
     25.22931
    ],
    [
     114.8595,
     25.16177
    ],
    [
     114.84783,
     25.10442
    ],
    [
     114.8449,
     25.07815
    ],
    [
     114.82678,
     24.96999
    ],
    [
     114.82796,
     24.95667
    ],
    [
     114.83173,
     24.94395
    ],
    [
     114.83511,
     24.93758
    ],
    [
     114.86365,
     24.90799
    ]
   ]
  },
  {
   "id": "long-nan-dong-guan-xi-zhen",
   "name": "赣深高速铁路",
   "from": "long-nan-dong",
   "to": "guan-xi-zhen",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 9.91,
   "polyline": [
    [
     114.86365,
     24.90799
    ],
    [
     114.87616,
     24.89689
    ],
    [
     114.92074,
     24.83585
    ]
   ]
  },
  {
   "id": "guan-xi-zhen-ding-nan",
   "name": "赣深高速铁路",
   "from": "guan-xi-zhen",
   "to": "ding-nan",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 10.5,
   "polyline": [
    [
     114.92074,
     24.83585
    ],
    [
     114.93591,
     24.81613
    ],
    [
     114.94626,
     24.80609
    ],
    [
     114.99814,
     24.7748
    ]
   ]
  },
  {
   "id": "ding-nan-ding-nan-nan",
   "name": "赣深高速铁路",
   "from": "ding-nan",
   "to": "ding-nan-nan",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 4.78,
   "polyline": [
    [
     114.99814,
     24.7748
    ],
    [
     115.00869,
     24.76612
    ],
    [
     115.02559,
     24.74625
    ]
   ]
  },
  {
   "id": "ding-nan-nan-he-ping-bei",
   "name": "赣深高速铁路",
   "from": "ding-nan-nan",
   "to": "he-ping-bei",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 32.8,
   "polyline": [
    [
     115.02559,
     24.74625
    ],
    [
     115.03836,
     24.72717
    ],
    [
     115.04521,
     24.71036
    ],
    [
     115.04877,
     24.68504
    ],
    [
     115.04741,
     24.67152
    ],
    [
     115.02969,
     24.61425
    ],
    [
     115.0256,
     24.60507
    ],
    [
     115.01701,
     24.58976
    ],
    [
     114.96712,
     24.51591
    ],
    [
     114.96048,
     24.50045
    ],
    [
     114.95493,
     24.47549
    ]
   ]
  },
  {
   "id": "he-ping-bei-long-chuan-xi",
   "name": "赣深高速铁路",
   "from": "he-ping-bei",
   "to": "long-chuan-xi",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 55.92,
   "polyline": [
    [
     114.95493,
     24.47549
    ],
    [
     114.9511,
     24.44854
    ],
    [
     114.95424,
     24.41273
    ],
    [
     114.95601,
     24.40616
    ],
    [
     114.96163,
     24.39373
    ],
    [
     114.97095,
     24.3796
    ],
    [
     114.98547,
     24.35866
    ],
    [
     115.00772,
     24.33106
    ],
    [
     115.03509,
     24.28981
    ],
    [
     115.04493,
     24.28066
    ],
    [
     115.06671,
     24.26601
    ],
    [
     115.08798,
     24.25698
    ],
    [
     115.11547,
     24.23937
    ],
    [
     115.17051,
     24.2095
    ],
    [
     115.18968,
     24.19473
    ],
    [
     115.19867,
     24.18235
    ],
    [
     115.2036,
     24.17012
    ],
    [
     115.20549,
     24.15879
    ],
    [
     115.20527,
     24.14649
    ],
    [
     115.20215,
     24.12855
    ],
    [
     115.19551,
     24.11115
    ],
    [
     115.17529,
     24.08043
    ]
   ]
  },
  {
   "id": "long-chuan-xi-he-yuan-bei",
   "name": "赣深高速铁路",
   "from": "long-chuan-xi",
   "to": "he-yuan-bei",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 29.19,
   "polyline": [
    [
     115.17529,
     24.08043
    ],
    [
     115.16052,
     24.0587
    ],
    [
     115.13573,
     24.03008
    ],
    [
     115.12723,
     24.01768
    ],
    [
     115.1206,
     24.00074
    ],
    [
     115.117,
     23.97808
    ],
    [
     115.11345,
     23.96575
    ],
    [
     115.10391,
     23.94986
    ],
    [
     115.09358,
     23.9399
    ],
    [
     115.07708,
     23.92763
    ],
    [
     115.02177,
     23.89966
    ],
    [
     115.00177,
     23.88624
    ]
   ]
  },
  {
   "id": "he-yuan-bei-he-yuan-dong",
   "name": "赣深高速铁路",
   "from": "he-yuan-bei",
   "to": "he-yuan-dong",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 35.57,
   "polyline": [
    [
     115.00177,
     23.88624
    ],
    [
     114.92758,
     23.83498
    ],
    [
     114.91253,
     23.82265
    ],
    [
     114.87188,
     23.80158
    ],
    [
     114.79573,
     23.75301
    ],
    [
     114.77731,
     23.73638
    ],
    [
     114.74577,
     23.70282
    ],
    [
     114.73276,
     23.68613
    ]
   ]
  },
  {
   "id": "he-yuan-dong-bo-luo-bei",
   "name": "赣深高速铁路",
   "from": "he-yuan-dong",
   "to": "bo-luo-bei",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 30.43,
   "polyline": [
    [
     114.73276,
     23.68613
    ],
    [
     114.71483,
     23.65943
    ],
    [
     114.69186,
     23.60118
    ],
    [
     114.683,
     23.58849
    ],
    [
     114.66569,
     23.57037
    ],
    [
     114.61767,
     23.53973
    ],
    [
     114.58058,
     23.50477
    ],
    [
     114.55719,
     23.4804
    ]
   ]
  },
  {
   "id": "bo-luo-bei-hui-zhou-bei",
   "name": "赣深高速铁路",
   "from": "bo-luo-bei",
   "to": "hui-zhou-bei",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 41.46,
   "polyline": [
    [
     114.55719,
     23.4804
    ],
    [
     114.54598,
     23.46761
    ],
    [
     114.53542,
     23.44965
    ],
    [
     114.51948,
     23.40226
    ],
    [
     114.49845,
     23.35904
    ],
    [
     114.49542,
     23.34903
    ],
    [
     114.49012,
     23.31554
    ],
    [
     114.48596,
     23.30406
    ],
    [
     114.48055,
     23.29452
    ],
    [
     114.46479,
     23.27543
    ],
    [
     114.43541,
     23.23293
    ],
    [
     114.42613,
     23.22243
    ],
    [
     114.39543,
     23.20077
    ],
    [
     114.37526,
     23.18287
    ]
   ]
  },
  {
   "id": "hui-zhou-bei-zhong-kai",
   "name": "赣深高速铁路",
   "from": "hui-zhou-bei",
   "to": "zhong-kai",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 21.57,
   "polyline": [
    [
     114.37526,
     23.18287
    ],
    [
     114.35185,
     23.16307
    ],
    [
     114.32357,
     23.12951
    ],
    [
     114.29505,
     23.10554
    ],
    [
     114.28605,
     23.09507
    ],
    [
     114.27634,
     23.07792
    ],
    [
     114.26026,
     23.0263
    ]
   ]
  },
  {
   "id": "zhong-kai-dong-guan-nan",
   "name": "赣深高速铁路",
   "from": "zhong-kai",
   "to": "dong-guan-nan",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 30.24,
   "polyline": [
    [
     114.26026,
     23.0263
    ],
    [
     114.24748,
     22.98561
    ],
    [
     114.23888,
     22.97095
    ],
    [
     114.22983,
     22.96105
    ],
    [
     114.21373,
     22.94965
    ],
    [
     114.1837,
     22.93632
    ],
    [
     114.14208,
     22.90295
    ],
    [
     114.11361,
     22.87566
    ],
    [
     114.10362,
     22.86777
    ],
    [
     114.06354,
     22.84806
    ]
   ]
  },
  {
   "id": "dong-guan-nan-guang-ming-cheng",
   "name": "赣深高速铁路",
   "from": "dong-guan-nan",
   "to": "guang-ming-cheng",
   "lineIds": [
    "ganshen-hsr"
   ],
   "serviceDate": "2021-12-10",
   "estLengthKm": 18.93,
   "polyline": [
    [
     114.06354,
     22.84806
    ],
    [
     114.02011,
     22.829
    ],
    [
     113.98924,
     22.81795
    ],
    [
     113.97195,
     22.80522
    ],
    [
     113.96213,
     22.79332
    ],
    [
     113.95428,
     22.77679
    ],
    [
     113.95144,
     22.76302
    ],
    [
     113.9499,
     22.73558
    ]
   ]
  },
  {
   "id": "de-qing-hang-zhou-xi",
   "name": "湖杭高速铁路",
   "from": "de-qing",
   "to": "hang-zhou-xi",
   "lineIds": [
    "huzhou-hangzhou"
   ],
   "serviceDate": "2022-09-22",
   "estLengthKm": 34.14,
   "polyline": [
    [
     120.05682,
     30.54703
    ],
    [
     120.06619,
     30.51531
    ],
    [
     120.09132,
     30.47539
    ],
    [
     120.09742,
     30.46054
    ],
    [
     120.09966,
     30.4478
    ],
    [
     120.09974,
     30.42964
    ],
    [
     120.0969,
     30.41028
    ],
    [
     120.0921,
     30.39801
    ],
    [
     120.08112,
     30.37945
    ],
    [
     120.05748,
     30.35555
    ],
    [
     120.04578,
     30.32469
    ],
    [
     120.03751,
     30.31335
    ],
    [
     120.02887,
     30.30723
    ],
    [
     120.01779,
     30.30314
    ],
    [
     119.98214,
     30.30076
    ]
   ]
  },
  {
   "id": "xin-qiao-song-jiang-nan",
   "name": "沪杭高速铁路",
   "from": "xin-qiao",
   "to": "song-jiang-nan",
   "lineIds": [
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 12.9,
   "polyline": [
    [
     121.31976,
     31.05957
    ],
    [
     121.30238,
     31.04958
    ],
    [
     121.29446,
     31.04346
    ],
    [
     121.26974,
     31.02097
    ],
    [
     121.24831,
     30.99798
    ],
    [
     121.22413,
     30.98356
    ]
   ]
  },
  {
   "id": "song-jiang-nan-jin-shan-bei",
   "name": "沪杭高速铁路",
   "from": "song-jiang-nan",
   "to": "jin-shan-bei",
   "lineIds": [
    "shanghai-hangzhou"
   ],
   "serviceDate": "2010-10-26",
   "estLengthKm": 16.49,
   "polyline": [
    [
     121.22413,
     30.98356
    ],
    [
     121.20081,
     30.9697
    ],
    [
     121.17602,
     30.94294
    ],
    [
     121.16456,
     30.93402
    ],
    [
     121.15406,
     30.92854
    ],
    [
     121.11076,
     30.91097
    ],
    [
     121.08669,
     30.89764
    ]
   ]
  },
  {
   "id": "hang-zhou-nan-fu-yang",
   "name": "杭黄高速铁路",
   "from": "hang-zhou-nan",
   "to": "fu-yang",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 45.02,
   "polyline": [
    [
     120.29108,
     30.17358
    ],
    [
     120.29409,
     30.1578
    ],
    [
     120.30419,
     30.14107
    ],
    [
     120.30873,
     30.12928
    ],
    [
     120.30985,
     30.12188
    ],
    [
     120.30553,
     30.09574
    ],
    [
     120.30316,
     30.06668
    ],
    [
     120.29706,
     30.0553
    ],
    [
     120.28706,
     30.04709
    ],
    [
     120.23593,
     30.02952
    ],
    [
     120.22333,
     30.02658
    ],
    [
     120.20524,
     30.02576
    ],
    [
     120.15227,
     30.02874
    ],
    [
     120.12079,
     30.0242
    ],
    [
     120.04043,
     29.99937
    ],
    [
     120.01215,
     29.99907
    ],
    [
     119.988,
     30.00328
    ]
   ]
  },
  {
   "id": "fu-yang-tong-lu",
   "name": "杭黄高速铁路",
   "from": "fu-yang",
   "to": "tong-lu",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 37.67,
   "polyline": [
    [
     119.988,
     30.00328
    ],
    [
     119.96979,
     30.00469
    ],
    [
     119.94762,
     30.00166
    ],
    [
     119.93419,
     29.99443
    ],
    [
     119.92264,
     29.9824
    ],
    [
     119.91513,
     29.9708
    ],
    [
     119.91239,
     29.96336
    ],
    [
     119.90834,
     29.93176
    ],
    [
     119.90497,
     29.92006
    ],
    [
     119.89408,
     29.89597
    ],
    [
     119.88164,
     29.88138
    ],
    [
     119.87048,
     29.87365
    ],
    [
     119.85922,
     29.86867
    ],
    [
     119.8266,
     29.86177
    ],
    [
     119.8099,
     29.8551
    ],
    [
     119.76412,
     29.82563
    ],
    [
     119.74214,
     29.80734
    ],
    [
     119.72729,
     29.79166
    ]
   ]
  },
  {
   "id": "tong-lu-jian-de",
   "name": "杭黄高速铁路",
   "from": "tong-lu",
   "to": "jian-de",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 40.14,
   "polyline": [
    [
     119.72729,
     29.79166
    ],
    [
     119.70608,
     29.76797
    ],
    [
     119.69698,
     29.76195
    ],
    [
     119.67997,
     29.75367
    ],
    [
     119.65629,
     29.73627
    ],
    [
     119.64388,
     29.73073
    ],
    [
     119.6156,
     29.72255
    ],
    [
     119.59725,
     29.71243
    ],
    [
     119.56997,
     29.68906
    ],
    [
     119.54954,
     29.6737
    ],
    [
     119.51731,
     29.63657
    ],
    [
     119.48487,
     29.60612
    ],
    [
     119.44795,
     29.58259
    ],
    [
     119.41595,
     29.57446
    ],
    [
     119.42268,
     29.57528
    ]
   ]
  },
  {
   "id": "jian-de-qian-dao-hu",
   "name": "杭黄高速铁路",
   "from": "jian-de",
   "to": "qian-dao-hu",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 31.99,
   "polyline": [
    [
     119.42268,
     29.57528
    ],
    [
     119.39503,
     29.57144
    ],
    [
     119.37191,
     29.57319
    ],
    [
     119.35894,
     29.57701
    ],
    [
     119.33186,
     29.59152
    ],
    [
     119.32691,
     29.59574
    ],
    [
     119.26861,
     29.66729
    ],
    [
     119.23651,
     29.70099
    ],
    [
     119.2119,
     29.72224
    ],
    [
     119.18686,
     29.73772
    ]
   ]
  },
  {
   "id": "qian-dao-hu-san-yang",
   "name": "杭黄高速铁路",
   "from": "qian-dao-hu",
   "to": "san-yang",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 50.5,
   "polyline": [
    [
     119.18686,
     29.73772
    ],
    [
     119.10858,
     29.79131
    ],
    [
     119.08564,
     29.80559
    ],
    [
     119.03467,
     29.84274
    ],
    [
     119.02337,
     29.85528
    ],
    [
     118.98626,
     29.90263
    ],
    [
     118.94048,
     29.95013
    ],
    [
     118.88454,
     29.98477
    ],
    [
     118.85649,
     30.00536
    ],
    [
     118.83307,
     30.01458
    ],
    [
     118.80188,
     30.02949
    ]
   ]
  },
  {
   "id": "san-yang-lang-jia-xi",
   "name": "杭黄高速铁路",
   "from": "san-yang",
   "to": "lang-jia-xi",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 23.53,
   "polyline": [
    [
     118.80188,
     30.02949
    ],
    [
     118.72985,
     30.07944
    ],
    [
     118.71728,
     30.09403
    ],
    [
     118.70807,
     30.10236
    ],
    [
     118.69706,
     30.10916
    ],
    [
     118.68152,
     30.11489
    ],
    [
     118.67253,
     30.11646
    ],
    [
     118.64006,
     30.11508
    ],
    [
     118.61241,
     30.10687
    ],
    [
     118.59831,
     30.09967
    ]
   ]
  },
  {
   "id": "lang-jia-xi-ji-xi-bei",
   "name": "杭黄高速铁路",
   "from": "lang-jia-xi",
   "to": "ji-xi-bei",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 4.2,
   "polyline": [
    [
     118.59831,
     30.09967
    ],
    [
     118.56669,
     30.07378
    ]
   ]
  },
  {
   "id": "ji-xi-bei-she-xian-bei",
   "name": "杭黄高速铁路",
   "from": "ji-xi-bei",
   "to": "she-xian-bei",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 25.5,
   "polyline": [
    [
     118.56669,
     30.07378
    ],
    [
     118.5716,
     30.07838
    ],
    [
     118.5357,
     30.05179
    ],
    [
     118.5078,
     30.03686
    ],
    [
     118.47816,
     30.02516
    ],
    [
     118.4639,
     30.01525
    ],
    [
     118.45534,
     30.00587
    ],
    [
     118.44895,
     29.99526
    ],
    [
     118.43577,
     29.96237
    ],
    [
     118.41427,
     29.9341
    ],
    [
     118.40518,
     29.92435
    ]
   ]
  },
  {
   "id": "she-xian-bei-huang-shan-bei",
   "name": "杭黄高速铁路",
   "from": "she-xian-bei",
   "to": "huang-shan-bei",
   "lineIds": [
    "hanghuang-hsr"
   ],
   "serviceDate": "2018-12-25",
   "estLengthKm": 17.8,
   "polyline": [
    [
     118.40518,
     29.92435
    ],
    [
     118.37125,
     29.89422
    ],
    [
     118.2987,
     29.83943
    ],
    [
     118.26734,
     29.81834
    ]
   ]
  },
  {
   "id": "hankou-hou-hu",
   "name": "武孝城际铁路",
   "from": "hankou",
   "to": "hou-hu",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 2.75,
   "polyline": [
    [
     114.26,
     30.62
    ],
    [
     114.25904,
     30.62421
    ],
    [
     114.2687,
     30.62773
    ],
    [
     114.27051,
     30.63475
    ],
    [
     114.26909,
     30.63863
    ]
   ]
  },
  {
   "id": "hou-hu-jin-yin-tan",
   "name": "武孝城际铁路",
   "from": "hou-hu",
   "to": "jin-yin-tan",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 2.62,
   "polyline": [
    [
     114.26909,
     30.63863
    ],
    [
     114.25999,
     30.66073
    ]
   ]
  },
  {
   "id": "jin-yin-tan-pan-long-cheng",
   "name": "武孝城际铁路",
   "from": "jin-yin-tan",
   "to": "pan-long-cheng",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 7.99,
   "polyline": [
    [
     114.25999,
     30.66073
    ],
    [
     114.25006,
     30.67598
    ],
    [
     114.22263,
     30.69871
    ],
    [
     114.21207,
     30.71807
    ]
   ]
  },
  {
   "id": "pan-long-cheng-tian-he-ji-chang",
   "name": "武孝城际铁路",
   "from": "pan-long-cheng",
   "to": "tian-he-ji-chang",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 6.87,
   "polyline": [
    [
     114.21207,
     30.71807
    ],
    [
     114.19789,
     30.74763
    ],
    [
     114.19656,
     30.75434
    ],
    [
     114.19952,
     30.76114
    ],
    [
     114.21143,
     30.77275
    ]
   ]
  },
  {
   "id": "tian-he-ji-chang-tian-he-jie",
   "name": "武孝城际铁路",
   "from": "tian-he-ji-chang",
   "to": "tian-he-jie",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 9.96,
   "polyline": [
    [
     114.21143,
     30.77275
    ],
    [
     114.23618,
     30.7977
    ],
    [
     114.23888,
     30.80704
    ],
    [
     114.23549,
     30.81591
    ],
    [
     114.22898,
     30.82121
    ],
    [
     114.22379,
     30.82301
    ],
    [
     114.20587,
     30.82467
    ]
   ]
  },
  {
   "id": "tian-he-jie-mao-chen",
   "name": "武孝城际铁路",
   "from": "tian-he-jie",
   "to": "mao-chen",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 22.77,
   "polyline": [
    [
     114.20587,
     30.82467
    ],
    [
     114.06158,
     30.82596
    ],
    [
     114.04784,
     30.82758
    ],
    [
     114.032,
     30.83305
    ],
    [
     114.00799,
     30.84506
    ],
    [
     113.99613,
     30.85408
    ],
    [
     113.985,
     30.8676
    ]
   ]
  },
  {
   "id": "mao-chen-huai-yin",
   "name": "武孝城际铁路",
   "from": "mao-chen",
   "to": "huai-yin",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 4.27,
   "polyline": [
    [
     113.985,
     30.8676
    ],
    [
     113.96023,
     30.89951
    ]
   ]
  },
  {
   "id": "huai-yin-xiao-gan-dong",
   "name": "武孝城际铁路",
   "from": "huai-yin",
   "to": "xiao-gan-dong",
   "lineIds": [
    "wuxiao-int"
   ],
   "serviceDate": "2016-12-01",
   "estLengthKm": 5.62,
   "polyline": [
    [
     113.96023,
     30.89951
    ],
    [
     113.94644,
     30.91828
    ],
    [
     113.94249,
     30.93577
    ]
   ]
  },
  {
   "id": "wuhan-wu-chang-dong-2",
   "name": "武冈城际铁路",
   "from": "wuhan",
   "to": "wu-chang-dong",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 8.69,
   "polyline": [
    [
     114.42,
     30.61
    ],
    [
     114.43764,
     30.61118
    ],
    [
     114.44042,
     30.60404
    ],
    [
     114.44559,
     30.59776
    ],
    [
     114.44139,
     30.57166
    ],
    [
     114.44742,
     30.55626
    ],
    [
     114.44318,
     30.55347
    ]
   ]
  },
  {
   "id": "wu-chang-dong-he-liu",
   "name": "武冈城际铁路",
   "from": "wu-chang-dong",
   "to": "he-liu",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 6.38,
   "polyline": [
    [
     114.44318,
     30.55347
    ],
    [
     114.44902,
     30.55379
    ],
    [
     114.45759,
     30.53675
    ],
    [
     114.46174,
     30.53253
    ],
    [
     114.46763,
     30.53122
    ],
    [
     114.49399,
     30.53115
    ]
   ]
  },
  {
   "id": "he-liu-hua-shan-nan",
   "name": "武冈城际铁路",
   "from": "he-liu",
   "to": "hua-shan-nan",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 0.89,
   "polyline": [
    [
     114.49399,
     30.53115
    ],
    [
     114.50307,
     30.53106
    ]
   ]
  },
  {
   "id": "hua-shan-nan-xin-dian",
   "name": "武冈城际铁路",
   "from": "hua-shan-nan",
   "to": "xin-dian",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 8.77,
   "polyline": [
    [
     114.50307,
     30.53106
    ],
    [
     114.56493,
     30.52118
    ],
    [
     114.59006,
     30.51016
    ]
   ]
  },
  {
   "id": "xin-dian-zuo-ling",
   "name": "武冈城际铁路",
   "from": "xin-dian",
   "to": "zuo-ling",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 1.78,
   "polyline": [
    [
     114.59006,
     30.51016
    ],
    [
     114.6061,
     30.50203
    ]
   ]
  },
  {
   "id": "zuo-ling-ge-dian-nan",
   "name": "武冈城际铁路",
   "from": "zuo-ling",
   "to": "ge-dian-nan",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 5.47,
   "polyline": [
    [
     114.6061,
     30.50203
    ],
    [
     114.61752,
     30.49686
    ],
    [
     114.62949,
     30.4936
    ],
    [
     114.65509,
     30.49262
    ]
   ]
  },
  {
   "id": "ge-dian-nan-hua-rong",
   "name": "武冈城际铁路",
   "from": "ge-dian-nan",
   "to": "hua-rong",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 9.4,
   "polyline": [
    [
     114.65509,
     30.49262
    ],
    [
     114.70641,
     30.4921
    ],
    [
     114.71444,
     30.49343
    ],
    [
     114.72459,
     30.49861
    ],
    [
     114.74175,
     30.51604
    ]
   ]
  },
  {
   "id": "hua-rong-hua-rong-dong",
   "name": "武冈城际铁路",
   "from": "hua-rong",
   "to": "hua-rong-dong",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 4.5,
   "polyline": [
    [
     114.74175,
     30.51604
    ],
    [
     114.75137,
     30.52542
    ],
    [
     114.75835,
     30.52965
    ],
    [
     114.76766,
     30.5326
    ],
    [
     114.78145,
     30.53426
    ]
   ]
  },
  {
   "id": "hua-rong-dong-huang-gang-xi",
   "name": "武冈城际铁路",
   "from": "hua-rong-dong",
   "to": "huang-gang-xi",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 11.12,
   "polyline": [
    [
     114.78145,
     30.53426
    ],
    [
     114.81656,
     30.53663
    ],
    [
     114.85437,
     30.53246
    ],
    [
     114.86173,
     30.52972
    ],
    [
     114.87002,
     30.52411
    ],
    [
     114.88343,
     30.50689
    ]
   ]
  },
  {
   "id": "huang-gang-xi-huang-gang",
   "name": "武冈城际铁路",
   "from": "huang-gang-xi",
   "to": "huang-gang",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 6.28,
   "polyline": [
    [
     114.88343,
     30.50689
    ],
    [
     114.89453,
     30.49518
    ],
    [
     114.90419,
     30.49
    ],
    [
     114.91637,
     30.48757
    ],
    [
     114.94032,
     30.48839
    ]
   ]
  },
  {
   "id": "huang-gang-huang-gang-dong",
   "name": "武冈城际铁路",
   "from": "huang-gang",
   "to": "huang-gang-dong",
   "lineIds": [
    "wugang-int"
   ],
   "serviceDate": "2014-06-18",
   "estLengthKm": 4.83,
   "polyline": [
    [
     114.94032,
     30.48839
    ],
    [
     114.95185,
     30.48957
    ],
    [
     114.96082,
     30.49287
    ],
    [
     114.98118,
     30.50921
    ]
   ]
  },
  {
   "id": "huang-gang-dong-xi-shui-nan",
   "name": "黄黄高速铁路",
   "from": "huang-gang-dong",
   "to": "xi-shui-nan",
   "lineIds": [
    "huanghuang-hsr"
   ],
   "serviceDate": "2022-04-22",
   "estLengthKm": 33.76,
   "polyline": [
    [
     114.98118,
     30.50921
    ],
    [
     115.00187,
     30.52656
    ],
    [
     115.02072,
     30.54948
    ],
    [
     115.03048,
     30.55428
    ],
    [
     115.04233,
     30.55361
    ],
    [
     115.07488,
     30.53543
    ],
    [
     115.13237,
     30.50896
    ],
    [
     115.15986,
     30.49287
    ],
    [
     115.22275,
     30.4289
    ],
    [
     115.23542,
     30.41367
    ]
   ]
  },
  {
   "id": "xi-shui-nan-qi-chun-nan",
   "name": "黄黄高速铁路",
   "from": "xi-shui-nan",
   "to": "qi-chun-nan",
   "lineIds": [
    "huanghuang-hsr"
   ],
   "serviceDate": "2022-04-22",
   "estLengthKm": 29.48,
   "polyline": [
    [
     115.23542,
     30.41367
    ],
    [
     115.26054,
     30.38338
    ],
    [
     115.27538,
     30.36895
    ],
    [
     115.28366,
     30.35875
    ],
    [
     115.30848,
     30.30578
    ],
    [
     115.33291,
     30.26626
    ],
    [
     115.34582,
     30.2511
    ],
    [
     115.37931,
     30.22036
    ],
    [
     115.40219,
     30.20557
    ]
   ]
  },
  {
   "id": "qi-chun-nan-wu-xue-bei",
   "name": "黄黄高速铁路",
   "from": "qi-chun-nan",
   "to": "wu-xue-bei",
   "lineIds": [
    "huanghuang-hsr"
   ],
   "serviceDate": "2022-04-22",
   "estLengthKm": 36.41,
   "polyline": [
    [
     115.40219,
     30.20557
    ],
    [
     115.44841,
     30.17499
    ],
    [
     115.48126,
     30.14952
    ],
    [
     115.53089,
     30.09736
    ],
    [
     115.56076,
     30.0608
    ],
    [
     115.58645,
     30.03578
    ],
    [
     115.60211,
     30.02625
    ],
    [
     115.61749,
     30.02004
    ],
    [
     115.68167,
     30.00553
    ]
   ]
  },
  {
   "id": "wu-xue-bei-zhuo-gang",
   "name": "黄黄高速铁路",
   "from": "wu-xue-bei",
   "to": "zhuo-gang",
   "lineIds": [
    "huanghuang-hsr"
   ],
   "serviceDate": "2022-04-22",
   "estLengthKm": 20.89,
   "polyline": [
    [
     115.68167,
     30.00553
    ],
    [
     115.70464,
     30.00074
    ],
    [
     115.72457,
     30.00001
    ],
    [
     115.74107,
     30.00241
    ],
    [
     115.81259,
     30.01892
    ],
    [
     115.86079,
     30.02177
    ],
    [
     115.89467,
     30.02603
    ]
   ]
  },
  {
   "id": "zhuo-gang-hh-junction",
   "name": "黄黄高速铁路",
   "from": "zhuo-gang",
   "to": "hh-junction",
   "lineIds": [
    "huanghuang-hsr"
   ],
   "serviceDate": "2022-04-22",
   "estLengthKm": 7.8,
   "polyline": [
    [
     115.89467,
     30.02603
    ],
    [
     115.9153,
     30.0256
    ],
    [
     115.92854,
     30.02853
    ],
    [
     115.93794,
     30.03447
    ],
    [
     115.96096,
     30.0571
    ]
   ]
  },
  {
   "id": "chi-zhou-jiu-hua-shan",
   "name": "池黄高速铁路",
   "from": "chi-zhou",
   "to": "jiu-hua-shan",
   "lineIds": [
    "chihuang-hsr"
   ],
   "serviceDate": "2024-04-26",
   "estLengthKm": 34.61,
   "polyline": [
    [
     117.51702,
     30.62188
    ],
    [
     117.54696,
     30.62719
    ],
    [
     117.56555,
     30.6248
    ],
    [
     117.57516,
     30.62523
    ],
    [
     117.62671,
     30.63668
    ],
    [
     117.67086,
     30.63652
    ],
    [
     117.74137,
     30.63316
    ],
    [
     117.7892,
     30.62443
    ],
    [
     117.82451,
     30.61168
    ],
    [
     117.85137,
     30.59817
    ]
   ]
  },
  {
   "id": "jiu-hua-shan-huang-shan-xi",
   "name": "池黄高速铁路",
   "from": "jiu-hua-shan",
   "to": "huang-shan-xi",
   "lineIds": [
    "chihuang-hsr"
   ],
   "serviceDate": "2024-04-26",
   "estLengthKm": 43.46,
   "polyline": [
    [
     117.85137,
     30.59817
    ],
    [
     117.87207,
     30.58626
    ],
    [
     117.88663,
     30.57455
    ],
    [
     117.90762,
     30.5518
    ],
    [
     117.93792,
     30.52392
    ],
    [
     118.01369,
     30.44664
    ],
    [
     118.04849,
     30.40631
    ],
    [
     118.0729,
     30.36122
    ],
    [
     118.08604,
     30.32742
    ],
    [
     118.08849,
     30.30649
    ],
    [
     118.08466,
     30.27973
    ]
   ]
  },
  {
   "id": "huang-shan-xi-yi-xian-dong",
   "name": "池黄高速铁路",
   "from": "huang-shan-xi",
   "to": "yi-xian-dong",
   "lineIds": [
    "chihuang-hsr"
   ],
   "serviceDate": "2024-04-26",
   "estLengthKm": 47.63,
   "polyline": [
    [
     118.08466,
     30.27973
    ],
    [
     118.07933,
     30.24385
    ],
    [
     118.0689,
     30.21662
    ],
    [
     118.06154,
     30.18181
    ],
    [
     118.06085,
     30.17068
    ],
    [
     118.06337,
     30.14399
    ],
    [
     118.04674,
     30.03705
    ],
    [
     118.00966,
     29.95297
    ],
    [
     118.00085,
     29.92555
    ],
    [
     118.00109,
     29.91601
    ],
    [
     118.00651,
     29.90451
    ],
    [
     118.01735,
     29.89606
    ],
    [
     118.0429,
     29.88733
    ]
   ]
  },
  {
   "id": "yi-xian-dong-huang-shan-bei",
   "name": "池黄高速铁路",
   "from": "yi-xian-dong",
   "to": "huang-shan-bei",
   "lineIds": [
    "chihuang-hsr"
   ],
   "serviceDate": "2024-04-26",
   "estLengthKm": 24.88,
   "polyline": [
    [
     118.0429,
     29.88733
    ],
    [
     118.04745,
     29.88704
    ],
    [
     118.07396,
     29.87822
    ],
    [
     118.14678,
     29.83445
    ],
    [
     118.19066,
     29.81324
    ],
    [
     118.21697,
     29.80328
    ],
    [
     118.2313,
     29.80159
    ],
    [
     118.24088,
     29.80338
    ],
    [
     118.26734,
     29.81834
    ]
   ]
  },
  {
   "id": "nanjing-south-jiang-ning-xi",
   "name": "宁安城际铁路",
   "from": "nanjing-south",
   "to": "jiang-ning-xi",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 26.77,
   "polyline": [
    [
     118.81,
     31.97
    ],
    [
     118.79137,
     31.9687
    ],
    [
     118.77366,
     31.9623
    ],
    [
     118.75997,
     31.95394
    ],
    [
     118.7392,
     31.93579
    ],
    [
     118.67627,
     31.89153
    ],
    [
     118.63615,
     31.8596
    ],
    [
     118.60854,
     31.84609
    ],
    [
     118.60099,
     31.83894
    ],
    [
     118.59068,
     31.82572
    ]
   ]
  },
  {
   "id": "jiang-ning-xi-tong-jing",
   "name": "宁安城际铁路",
   "from": "jiang-ning-xi",
   "to": "tong-jing",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 7.11,
   "polyline": [
    [
     118.59068,
     31.82572
    ],
    [
     118.5809,
     31.81287
    ],
    [
     118.56615,
     31.8016
    ]
   ]
  },
  {
   "id": "tong-jing-an-jiang-2",
   "name": "宁安城际铁路",
   "from": "tong-jing",
   "to": "an-jiang-2",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 6.25,
   "polyline": [
    [
     118.56615,
     31.8016
    ],
    [
     118.54946,
     31.78686
    ],
    [
     118.5296,
     31.75548
    ]
   ]
  },
  {
   "id": "an-jiang-2-ma-an-shan-dong",
   "name": "宁安城际铁路",
   "from": "an-jiang-2",
   "to": "ma-an-shan-dong",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 6.99,
   "polyline": [
    [
     118.5296,
     31.75548
    ],
    [
     118.52663,
     31.74676
    ],
    [
     118.52553,
     31.73332
    ],
    [
     118.52745,
     31.72486
    ],
    [
     118.53457,
     31.70929
    ],
    [
     118.53606,
     31.69458
    ]
   ]
  },
  {
   "id": "ma-an-shan-dong-dang-tu-dong",
   "name": "宁安城际铁路",
   "from": "ma-an-shan-dong",
   "to": "dang-tu-dong",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 17.14,
   "polyline": [
    [
     118.53606,
     31.69458
    ],
    [
     118.53814,
     31.68266
    ],
    [
     118.53741,
     31.67397
    ],
    [
     118.53062,
     31.64722
    ],
    [
     118.51988,
     31.62276
    ],
    [
     118.51747,
     31.61226
    ],
    [
     118.51734,
     31.60349
    ],
    [
     118.5211,
     31.58215
    ],
    [
     118.52121,
     31.56352
    ]
   ]
  },
  {
   "id": "dang-tu-dong-wu-hu-dong",
   "name": "宁安城际铁路",
   "from": "dang-tu-dong",
   "to": "wu-hu-dong",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 20.49,
   "polyline": [
    [
     118.52121,
     31.56352
    ],
    [
     118.52183,
     31.55357
    ],
    [
     118.5202,
     31.54323
    ],
    [
     118.51714,
     31.53513
    ],
    [
     118.51187,
     31.52689
    ],
    [
     118.49414,
     31.50946
    ],
    [
     118.47646,
     31.48581
    ],
    [
     118.41777,
     31.43419
    ],
    [
     118.40482,
     31.4143
    ]
   ]
  },
  {
   "id": "wu-hu-dong-wu-hu",
   "name": "宁安城际铁路",
   "from": "wu-hu-dong",
   "to": "wu-hu",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 8.53,
   "polyline": [
    [
     118.40482,
     31.4143
    ],
    [
     118.37739,
     31.36416
    ],
    [
     118.37777,
     31.35911
    ],
    [
     118.38432,
     31.35378
    ],
    [
     118.386,
     31.34978
    ]
   ]
  },
  {
   "id": "wu-hu-yi-jiang",
   "name": "宁安城际铁路",
   "from": "wu-hu",
   "to": "yi-jiang",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 12.83,
   "polyline": [
    [
     118.386,
     31.34978
    ],
    [
     118.38745,
     31.34746
    ],
    [
     118.38791,
     31.33887
    ],
    [
     118.38759,
     31.33575
    ],
    [
     118.3831,
     31.32737
    ],
    [
     118.38465,
     31.31846
    ],
    [
     118.38362,
     31.31176
    ],
    [
     118.3914,
     31.27695
    ],
    [
     118.39137,
     31.27231
    ],
    [
     118.38709,
     31.26273
    ],
    [
     118.37445,
     31.25131
    ]
   ]
  },
  {
   "id": "yi-jiang-e-qiao",
   "name": "宁安城际铁路",
   "from": "yi-jiang",
   "to": "e-qiao",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 14.03,
   "polyline": [
    [
     118.37445,
     31.25131
    ],
    [
     118.35863,
     31.23588
    ],
    [
     118.34016,
     31.21023
    ],
    [
     118.33313,
     31.20299
    ],
    [
     118.26983,
     31.16523
    ]
   ]
  },
  {
   "id": "e-qiao-fan-chang",
   "name": "宁安城际铁路",
   "from": "e-qiao",
   "to": "fan-chang",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 9.2,
   "polyline": [
    [
     118.26983,
     31.16523
    ],
    [
     118.24778,
     31.1526
    ],
    [
     118.22596,
     31.13318
    ],
    [
     118.19581,
     31.11276
    ]
   ]
  },
  {
   "id": "fan-chang-fan-chang-xi",
   "name": "宁安城际铁路",
   "from": "fan-chang",
   "to": "fan-chang-xi",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 6.0,
   "polyline": [
    [
     118.19581,
     31.11276
    ],
    [
     118.18649,
     31.10319
    ],
    [
     118.17135,
     31.0916
    ],
    [
     118.15304,
     31.07336
    ]
   ]
  },
  {
   "id": "fan-chang-xi-feng-xiang-dun",
   "name": "宁安城际铁路",
   "from": "fan-chang-xi",
   "to": "feng-xiang-dun",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 2.53,
   "polyline": [
    [
     118.15304,
     31.07336
    ],
    [
     118.13628,
     31.05576
    ]
   ]
  },
  {
   "id": "feng-xiang-dun-tong-ling",
   "name": "宁安城际铁路",
   "from": "feng-xiang-dun",
   "to": "tong-ling",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 31.95,
   "polyline": [
    [
     118.13628,
     31.05576
    ],
    [
     118.12842,
     31.04883
    ],
    [
     118.11978,
     31.04361
    ],
    [
     118.08199,
     31.02785
    ],
    [
     118.05722,
     31.01007
    ],
    [
     118.04346,
     31.00294
    ],
    [
     118.02132,
     30.99654
    ],
    [
     117.91267,
     30.97199
    ],
    [
     117.88718,
     30.9626
    ],
    [
     117.8752,
     30.95496
    ],
    [
     117.86741,
     30.94641
    ],
    [
     117.86293,
     30.9384
    ],
    [
     117.85645,
     30.9212
    ]
   ]
  },
  {
   "id": "tong-ling-tong-ling-nan",
   "name": "宁安城际铁路",
   "from": "tong-ling",
   "to": "tong-ling-nan",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 8.41,
   "polyline": [
    [
     117.85645,
     30.9212
    ],
    [
     117.85186,
     30.90513
    ],
    [
     117.83971,
     30.88419
    ],
    [
     117.83146,
     30.87414
    ],
    [
     117.81711,
     30.86202
    ]
   ]
  },
  {
   "id": "tong-ling-nan-ma-ya",
   "name": "宁安城际铁路",
   "from": "tong-ling-nan",
   "to": "ma-ya",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 28.57,
   "polyline": [
    [
     117.81711,
     30.86202
    ],
    [
     117.80517,
     30.8504
    ],
    [
     117.78587,
     30.8364
    ],
    [
     117.76422,
     30.81328
    ],
    [
     117.74784,
     30.77858
    ],
    [
     117.73014,
     30.75477
    ],
    [
     117.70969,
     30.72109
    ],
    [
     117.70592,
     30.71125
    ],
    [
     117.70174,
     30.69117
    ],
    [
     117.69414,
     30.67698
    ],
    [
     117.68658,
     30.66912
    ],
    [
     117.67931,
     30.66408
    ],
    [
     117.65701,
     30.65539
    ]
   ]
  },
  {
   "id": "ma-ya-chi-zhou",
   "name": "宁安城际铁路",
   "from": "ma-ya",
   "to": "chi-zhou",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 15.25,
   "polyline": [
    [
     117.65701,
     30.65539
    ],
    [
     117.63343,
     30.64833
    ],
    [
     117.56253,
     30.63414
    ],
    [
     117.51702,
     30.62188
    ]
   ]
  },
  {
   "id": "chi-zhou-an-qing",
   "name": "宁安城际铁路",
   "from": "chi-zhou",
   "to": "an-qing",
   "lineIds": [
    "ningan-int"
   ],
   "serviceDate": "2015-12-06",
   "estLengthKm": 45.69,
   "polyline": [
    [
     117.51702,
     30.62188
    ],
    [
     117.46859,
     30.60716
    ],
    [
     117.45668,
     30.60497
    ],
    [
     117.39801,
     30.60711
    ],
    [
     117.38132,
     30.60482
    ],
    [
     117.28179,
     30.57099
    ],
    [
     117.26377,
     30.57024
    ],
    [
     117.20182,
     30.5795
    ],
    [
     117.18896,
     30.57987
    ],
    [
     117.16931,
     30.57541
    ],
    [
     117.13088,
     30.55796
    ],
    [
     117.11712,
     30.55356
    ],
    [
     117.08889,
     30.54973
    ],
    [
     117.07188,
     30.54971
    ],
    [
     117.06005,
     30.5515
    ]
   ]
  },
  {
   "id": "xing-wei-cun-nan-jing-dong",
   "name": "沪宁城际南京联络线",
   "from": "xing-wei-cun",
   "to": "nan-jing-dong",
   "lineIds": [
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.31,
   "polyline": [
    [
     118.8509,
     32.10474
    ],
    [
     118.87646,
     32.10874
    ],
    [
     118.90218,
     32.12216
    ]
   ]
  },
  {
   "id": "nan-jing-dong-zi-jin-shan",
   "name": "沪宁城际南京联络线",
   "from": "nan-jing-dong",
   "to": "zi-jin-shan",
   "lineIds": [
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 4.96,
   "polyline": [
    [
     118.90218,
     32.12216
    ],
    [
     118.8866,
     32.1125
    ],
    [
     118.88402,
     32.1078
    ],
    [
     118.88537,
     32.10139
    ],
    [
     118.89391,
     32.08663
    ]
   ]
  },
  {
   "id": "zi-jin-shan-zi-jin-shan-dong",
   "name": "沪宁城际南京联络线",
   "from": "zi-jin-shan",
   "to": "zi-jin-shan-dong",
   "lineIds": [
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 1.66,
   "polyline": [
    [
     118.89391,
     32.08663
    ],
    [
     118.90051,
     32.07296
    ]
   ]
  },
  {
   "id": "zi-jin-shan-dong-cang-bo-men",
   "name": "沪宁城际南京联络线",
   "from": "zi-jin-shan-dong",
   "to": "cang-bo-men",
   "lineIds": [
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 5.27,
   "polyline": [
    [
     118.90051,
     32.07296
    ],
    [
     118.89531,
     32.04666
    ],
    [
     118.8777,
     32.03247
    ]
   ]
  },
  {
   "id": "cang-bo-men-nanjing-south",
   "name": "沪宁城际南京联络线",
   "from": "cang-bo-men",
   "to": "nanjing-south",
   "lineIds": [
    "nanjing-link"
   ],
   "serviceDate": "2010-07-01",
   "estLengthKm": 10.35,
   "polyline": [
    [
     118.8777,
     32.03247
    ],
    [
     118.86719,
     32.02412
    ],
    [
     118.84013,
     31.99279
    ],
    [
     118.80516,
     31.97672
    ],
    [
     118.81,
     31.97
    ]
   ]
  },
  {
   "id": "hefei-south-zhe-gao",
   "name": "商合杭高速铁路（南段）",
   "from": "hefei-south",
   "to": "zhe-gao",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 49.66,
   "polyline": [
    [
     117.29,
     31.8
    ],
    [
     117.31483,
     31.80236
    ],
    [
     117.35151,
     31.80976
    ],
    [
     117.36289,
     31.80936
    ],
    [
     117.39544,
     31.80427
    ],
    [
     117.41152,
     31.80646
    ],
    [
     117.4187,
     31.80973
    ],
    [
     117.4274,
     31.81691
    ],
    [
     117.44318,
     31.84252
    ],
    [
     117.4536,
     31.852
    ],
    [
     117.50914,
     31.87508
    ],
    [
     117.5197,
     31.87637
    ],
    [
     117.52959,
     31.87257
    ],
    [
     117.54351,
     31.8568
    ],
    [
     117.55521,
     31.84813
    ],
    [
     117.66452,
     31.78269
    ],
    [
     117.70151,
     31.7569
    ],
    [
     117.7186,
     31.74814
    ]
   ]
  },
  {
   "id": "zhe-gao-chao-hu-dong",
   "name": "商合杭高速铁路（南段）",
   "from": "zhe-gao",
   "to": "chao-hu-dong",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 24.33,
   "polyline": [
    [
     117.7186,
     31.74814
    ],
    [
     117.8095,
     31.69806
    ],
    [
     117.82165,
     31.69291
    ],
    [
     117.8508,
     31.68413
    ],
    [
     117.86366,
     31.67797
    ],
    [
     117.88451,
     31.66247
    ],
    [
     117.9005,
     31.64816
    ],
    [
     117.91124,
     31.6347
    ],
    [
     117.92046,
     31.62021
    ]
   ]
  },
  {
   "id": "chao-hu-dong-han-shan-nan",
   "name": "商合杭高速铁路（南段）",
   "from": "chao-hu-dong",
   "to": "han-shan-nan",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 24.69,
   "polyline": [
    [
     117.92046,
     31.62021
    ],
    [
     117.936,
     31.59951
    ],
    [
     117.97838,
     31.56537
    ],
    [
     118.01157,
     31.52952
    ],
    [
     118.02727,
     31.5195
    ],
    [
     118.06305,
     31.50211
    ],
    [
     118.07378,
     31.49344
    ],
    [
     118.08639,
     31.47998
    ]
   ]
  },
  {
   "id": "han-shan-nan-wu-hu-bei",
   "name": "商合杭高速铁路（南段）",
   "from": "han-shan-nan",
   "to": "wu-hu-bei",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 22.58,
   "polyline": [
    [
     118.08639,
     31.47998
    ],
    [
     118.11083,
     31.4457
    ],
    [
     118.13394,
     31.41994
    ],
    [
     118.15221,
     31.39155
    ],
    [
     118.16573,
     31.37884
    ],
    [
     118.18182,
     31.37009
    ],
    [
     118.20799,
     31.3621
    ],
    [
     118.25522,
     31.35697
    ]
   ]
  },
  {
   "id": "wu-hu-bei-er-ba",
   "name": "商合杭高速铁路（南段）",
   "from": "wu-hu-bei",
   "to": "er-ba",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 7.1,
   "polyline": [
    [
     118.25522,
     31.35697
    ],
    [
     118.30909,
     31.35242
    ],
    [
     118.32959,
     31.3539
    ]
   ]
  },
  {
   "id": "er-ba-wu-hu",
   "name": "商合杭高速铁路（南段）",
   "from": "er-ba",
   "to": "wu-hu",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 6.02,
   "polyline": [
    [
     118.32959,
     31.3539
    ],
    [
     118.37433,
     31.35908
    ],
    [
     118.38253,
     31.35441
    ],
    [
     118.386,
     31.34978
    ]
   ]
  },
  {
   "id": "wu-hu-wu-hu-nan",
   "name": "商合杭高速铁路（南段）",
   "from": "wu-hu",
   "to": "wu-hu-nan",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 11.67,
   "polyline": [
    [
     118.386,
     31.34978
    ],
    [
     118.38705,
     31.33787
    ],
    [
     118.38287,
     31.32735
    ],
    [
     118.38443,
     31.31842
    ],
    [
     118.38352,
     31.31144
    ],
    [
     118.38851,
     31.28943
    ],
    [
     118.39057,
     31.27056
    ],
    [
     118.38696,
     31.2627
    ],
    [
     118.37445,
     31.25131
    ]
   ]
  },
  {
   "id": "wu-hu-nan-wan-zhi-nan",
   "name": "商合杭高速铁路（南段）",
   "from": "wu-hu-nan",
   "to": "wan-zhi-nan",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 31.03,
   "polyline": [
    [
     118.37445,
     31.25131
    ],
    [
     118.35935,
     31.23615
    ],
    [
     118.35613,
     31.22918
    ],
    [
     118.35554,
     31.22058
    ],
    [
     118.35777,
     31.2099
    ],
    [
     118.36155,
     31.20069
    ],
    [
     118.38098,
     31.17213
    ],
    [
     118.38859,
     31.16427
    ],
    [
     118.39982,
     31.15723
    ],
    [
     118.44597,
     31.13979
    ],
    [
     118.4766,
     31.1253
    ],
    [
     118.57999,
     31.09492
    ]
   ]
  },
  {
   "id": "wan-zhi-nan-xuan-cheng",
   "name": "商合杭高速铁路（南段）",
   "from": "wan-zhi-nan",
   "to": "xuan-cheng",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 26.47,
   "polyline": [
    [
     118.57999,
     31.09492
    ],
    [
     118.6938,
     31.06033
    ],
    [
     118.71422,
     31.04942
    ],
    [
     118.7238,
     31.0407
    ],
    [
     118.73396,
     31.02538
    ],
    [
     118.74982,
     30.96796
    ],
    [
     118.75373,
     30.9627
    ],
    [
     118.76931,
     30.9497
    ]
   ]
  },
  {
   "id": "xuan-cheng-shi-zi-pu",
   "name": "商合杭高速铁路（南段）",
   "from": "xuan-cheng",
   "to": "shi-zi-pu",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 37.04,
   "polyline": [
    [
     118.76931,
     30.9497
    ],
    [
     118.79967,
     30.9253
    ],
    [
     118.81162,
     30.92093
    ],
    [
     118.82377,
     30.91986
    ],
    [
     118.86625,
     30.92294
    ],
    [
     118.90484,
     30.9236
    ],
    [
     118.9488,
     30.92731
    ],
    [
     119.00594,
     30.93344
    ],
    [
     119.05949,
     30.94293
    ],
    [
     119.0947,
     30.9421
    ],
    [
     119.12665,
     30.94361
    ]
   ]
  },
  {
   "id": "shi-zi-pu-lang-xi-nan",
   "name": "商合杭高速铁路（南段）",
   "from": "shi-zi-pu",
   "to": "lang-xi-nan",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 2.4,
   "polyline": [
    [
     119.12665,
     30.94361
    ],
    [
     119.15143,
     30.94026
    ]
   ]
  },
  {
   "id": "lang-xi-nan-guang-de-nan",
   "name": "商合杭高速铁路（南段）",
   "from": "lang-xi-nan",
   "to": "guang-de-nan",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 28.81,
   "polyline": [
    [
     119.15143,
     30.94026
    ],
    [
     119.17438,
     30.93547
    ],
    [
     119.21556,
     30.92152
    ],
    [
     119.2979,
     30.90503
    ],
    [
     119.31479,
     30.8974
    ],
    [
     119.37128,
     30.86403
    ],
    [
     119.39048,
     30.85842
    ],
    [
     119.4126,
     30.857
    ]
   ]
  },
  {
   "id": "guang-de-nan-an-ji",
   "name": "商合杭高速铁路（南段）",
   "from": "guang-de-nan",
   "to": "an-ji",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 20.12,
   "polyline": [
    [
     119.4126,
     30.857
    ],
    [
     119.43534,
     30.85569
    ],
    [
     119.47396,
     30.86035
    ],
    [
     119.49623,
     30.85834
    ],
    [
     119.51792,
     30.8509
    ],
    [
     119.54817,
     30.83047
    ],
    [
     119.56345,
     30.82343
    ],
    [
     119.58115,
     30.81961
    ],
    [
     119.6097,
     30.81868
    ]
   ]
  },
  {
   "id": "an-ji-hu-zhou-xi",
   "name": "商合杭高速铁路（南段）",
   "from": "an-ji",
   "to": "hu-zhou-xi",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 39.15,
   "polyline": [
    [
     119.6097,
     30.81868
    ],
    [
     119.66491,
     30.81782
    ],
    [
     119.7079,
     30.82176
    ],
    [
     119.72176,
     30.82508
    ],
    [
     119.76591,
     30.83967
    ],
    [
     119.80244,
     30.84903
    ],
    [
     119.88526,
     30.88562
    ],
    [
     119.89875,
     30.89013
    ],
    [
     119.91443,
     30.89236
    ],
    [
     119.95405,
     30.8926
    ],
    [
     119.99033,
     30.89841
    ],
    [
     120.00133,
     30.89658
    ]
   ]
  },
  {
   "id": "hu-zhou-xi-hu-zhou",
   "name": "商合杭高速铁路（南段）",
   "from": "hu-zhou-xi",
   "to": "hu-zhou",
   "lineIds": [
    "shanghehang-south"
   ],
   "serviceDate": "2020-06-28",
   "estLengthKm": 4.21,
   "polyline": [
    [
     120.00133,
     30.89658
    ],
    [
     120.01229,
     30.89007
    ],
    [
     120.01656,
     30.88533
    ],
    [
     120.01758,
     30.86509
    ]
   ]
  }
 ],
 "overrides": [
  {
   "from": "武汉",
   "to": "黄山西",
   "train": "G1435",
   "segments": [
    "wuhan-wu-chang-dong",
    "wu-chang-dong-he-liu",
    "he-liu-hua-shan-nan",
    "hua-shan-nan-xin-dian",
    "xin-dian-zuo-ling",
    "zuo-ling-ge-dian-nan",
    "ge-dian-nan-hua-rong",
    "hua-rong-hua-rong-dong",
    "hua-rong-dong-huang-gang-xi",
    "huang-gang-xi-huang-gang",
    "huang-gang-huang-gang-dong",
    "huang-gang-dong-xi-shui-nan",
    "xi-shui-nan-qi-chun-nan",
    "qi-chun-nan-wu-xue-bei",
    "wu-xue-bei-zhuo-gang",
    "zhuo-gang-hh-junction",
    "huang-mei-dong-hh-junction",
    "su-song-dong-huang-mei-dong",
    "tai-hu-nan-su-song-dong",
    "qian-shan-tai-hu-nan",
    "an-qing-xi-qian-shan",
    "an-qing-bei-an-qing-xi",
    "an-qing-bei-an-qing",
    "chi-zhou-an-qing",
    "chi-zhou-jiu-hua-shan",
    "jiu-hua-shan-huang-shan-xi"
   ]
  }
 ]
};
  root.RAIL_ROUTE_DATA = RAIL_ROUTE_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
