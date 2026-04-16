---
title: 从 Fcitx 4 升级
description: 从 Fcitx 4 升级到 Fcitx 5 的指南，包括数据迁移路径和软件包对应关系。
---

## 我的数据在哪里？
几乎所有 Fcitx 4 的数据都存储在 <code>~/.config/fcitx</code> 下。

对于 Fcitx 5，路径更遵循 XDG 标准，分别是 <code>~/.local/share/fcitx5</code> 和 <code>~/.config/fcitx5</code>。

具体来说，Rime 数据在 Fcitx 4 中位于 <code>~/.config/fcitx/rime</code>，而在 Fcitx 5 中是 <code>~/.local/share/fcitx5/rime</code>。

## 我需要安装什么包？
发行版可能有自己的拆分包的方式，我只会谈谈源码包它们是如何映射的。

| Fcitx 4 | Fcitx 5 |
|---------|---------|
| fcitx | fcitx5, fcitx5-gtk (Gtk 输入法模块), fcitx5-qt (Qt 输入法模块), fcitx5-chinese-addons (拼音和码表) |
| fcitx-qt5 | fcitx5-qt |
| fcitx-configtool | fcitx5-configtool |
| kcm-fcitx | fcitx5-configtool |
| fcitx-anthy | fcitx5-anthy |
| fcitx-chewing | fcitx5-chewing |
| fcitx-cloudpinyin | fcitx5-chinese-addons |
| fcitx-fbterm | fcitx5-fbterm |
| fcitx-hangul | fcitx5-hangul |
| fcitx-kkc | fcitx5-kkc |
| fcitx-libpinyin | 请改用 fcitx5-chinese-addons 拼音。 |
| fcitx-m17n | fcitx5-m17n |
| fcitx-rime | fcitx5-rime |
| fcitx-sayura | fcitx5-sayura |
| fcitx-skk | fcitx5-skk |
| fcitx-sunpinyin | 请改用 fcitx5-chinese-addons 拼音。 |
| fcitx-table-extra | fcitx5-table-extra |
| fcitx-table-other | fcitx5-table-other |
| fcitx-unikey | fcitx5-unikey |
| fcitx-zhuyin | fcitx5-zhuyin |

## 我可以保留我的旧数据吗？
您需要重新配置输入法列表，不支持迁移配置文件。

某些引擎不会将数据存储在 fcitx 的路径中，因此可以直接重用，例如 Mozc、Anthy。

某些数据可以迁移。fcitx5-configtool 中的 fcitx5-migrator 将帮助您完成此操作。支持的引擎包括拼音、Rime、码表、SKK、KKC。
