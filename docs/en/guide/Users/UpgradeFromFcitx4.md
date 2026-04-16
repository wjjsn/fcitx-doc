---
title: Upgrade from Fcitx4
description: 从Fcitx 4升级到Fcitx 5的指南，包括数据迁移、包名称对照和配置方法。
---

# Upgrade from Fcitx4

## Where is my data?
Almost all Fcitx 4 data is stored under <code>~/.config/fcitx</code>.

For Fcitx 5, the path follows XDG standards more closely, namely <code>~/.local/share/fcitx5</code> and <code>~/.config/fcitx5</code>.

Specifically, Rime data is in <code>~/.config/fcitx/rime</code> in Fcitx 4, while in Fcitx 5 it is <code>~/.local/share/fcitx5/rime</code>.

## What packages do I need to install?
Distributions may have their own way of splitting packages. I will only talk about how the source packages map.

| Fcitx 4 | Fcitx 5 |
|---------|---------|
| fcitx | fcitx5, fcitx5-gtk (Gtk input method module), fcitx5-qt (Qt input method module), fcitx5-chinese-addons (Pinyin and table) |
| fcitx-qt5 | fcitx5-qt |
| fcitx-configtool | fcitx5-configtool |
| kcm-fcitx | fcitx5-configtool |
| fcitx-anthy | fcitx5-anthy |
| fcitx-chewing | fcitx5-chewing |
| fcitx-cloudpinyin | fcitx5-chinese-addons |
| fcitx-fbterm | fcitx5-fbterm |
| fcitx-hangul | fcitx5-hangul |
| fcitx-kkc | fcitx5-kkc |
| fcitx-libpinyin | Please use fcitx5-chinese-addons Pinyin instead. |
| fcitx-m17n | fcitx5-m17n |
| fcitx-rime | fcitx5-rime |
| fcitx-sayura | fcitx5-sayura |
| fcitx-skk | fcitx5-skk |
| fcitx-sunpinyin | Please use fcitx5-chinese-addons Pinyin instead. |
| fcitx-table-extra | fcitx5-table-extra |
| fcitx-table-other | fcitx5-table-other |
| fcitx-unikey | fcitx5-unikey |
| fcitx-zhuyin | fcitx5-zhuyin |

## Can I keep my old data?
You need to reconfigure the input method list. Migrating configuration files is not supported.

Some engines don't store data in fcitx's paths, so they can be reused directly, such as Mozc and Anthy.

Some data can be migrated. The fcitx5-migrator in fcitx5-configtool will help you with this. Supported engines include Pinyin, Rime, table, SKK, and KKC.
