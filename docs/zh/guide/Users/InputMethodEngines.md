---
title: 输入法引擎
description: 介绍Fcitx 5支持的各种语言的输入法引擎及其安装配置方法
---

# 输入法引擎

## 配置

安装新的输入法包后，从命令或托盘菜单启动配置工具 [fcitx5-configtool](ConfigureFcitx5)。应该有一个带有按钮的消息，允许重新加载或重新启动 Fcitx 5 以使新的输入法引擎准备好使用。  这仅适用于非 flatpak Fcitx 5。

对于旧的 flatpak 版本，则需要手动重启。基于 Flatpak 的 fcitx 5 中的重启功能不会重新加载沙箱，因此新的扩展包仍然不可见。必须完全退出 Fcitx 并启动一个新实例以使其加载新的 flatpak 扩展包。 

从 5.0.16 开始，"重启"将能够启动一个新的更新的 flatpak 版本，就像普通版本一样。

## 中文

- [fcitx5-chinese-addons](https://pkgs.org/search/?q=fcitx5-chinese-addons)。它包括简体中文最常用的输入法，包括拼音和码表（五笔等）引擎。
- [fcitx5-table-extra](https://pkgs.org/search/?q=fcitx5-table-extra)。附加中文表
- [fcitx5-chewing](https://pkgs.org/search/?q=fcitx5-chewing)。基于libchewing的咀嚼引擎。
- [fcitx5-zhuyin](https://pkgs.org/search/?q=fcitx5-zhuyin)。基于lib注音的注音输入法引擎。
- [fcitx5-rime](https://pkgs.org/search/?q=fcitx5-rime)。一种可自定义的输入法，但默认情况下其默认配置为拼音。

## 日语

- [fcitx5-anthy](https://pkgs.org/search/?q=fcitx5-anthy)
- [fcitx5-kkc](https://pkgs.org/search/?q=fcitx5-kkc)
- [fcitx5-mozc](https://pkgs.org/search/?q=fcitx5-mozc)
- [fcitx5-skk](https://pkgs.org/search/?q=fcitx5-skk)

## 韩文

- [fcitx5-hangul](https://pkgs.org/search/?q=fcitx5-hangul)

## 越南语

- [fcitx5-unikey](https://pkgs.org/search/?q=fcitx5-unikey)

## 泰语

- [fcitx5-libthai](https://pkgs.org/search/?q=fcitx5-libthai)

## 僧伽罗语

- [fcitx5-sayura](https://pkgs.org/search/?q=fcitx5-sayura)

## 多语言（如果上面没有列出，这可能是您需要的）

- [fcitx5-m17n](https://pkgs.org/search/?q=fcitx5-m17n)
- [fcitx5-keyman](https://pkgs.org/search/?q=fcitx5-keyman)
- [fcitx5-table-other](https://pkgs.org/search/?q=fcitx5-table-other)，它提供了许多其他表格，但如果适合您，建议您更喜欢 fcitx5-m17n。
- 内置基于键盘布局的引擎。这允许使用传统的键盘布局。
