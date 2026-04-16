---
title: Input Method Engines
description: 介绍可用的Fcitx 5输入法引擎，包括中文、日文、韩文等多种语言的输入法。
---

# Input Method Engines

## Configuration

After installing a new input method package, start the configuration tool [fcitx5-configtool](ConfigureFcitx5) from the command or tray menu. There should be a message with a button that allows you to reload or restart Fcitx 5 to make the new input method engine ready to use. This only applies to non-flatpak Fcitx 5.

For old flatpak versions, you need to manually restart. The restart function in Flatpak-based fcitx 5 does not reload the sandbox, so new addon packages remain invisible. You must completely quit Fcitx and start a new instance to make it load the new flatpak addon packages.

Starting from 5.0.16, "restart" will be able to start a new updated flatpak version just like the normal version.

## Chinese

- [fcitx5-chinese-addons](https://pkgs.org/search/?q=fcitx5-chinese-addons). It includes the most commonly used input methods for Simplified Chinese, including Pinyin and table-based (Wubi, etc.) engines.
- [fcitx5-table-extra](https://pkgs.org/search/?q=fcitx5-table-extra). Additional Chinese tables
- [fcitx5-chewing](https://pkgs.org/search/?q=fcitx5-chewing). Chewing engine based on libchewing.
- [fcitx5-zhuyin](https://pkgs.org/search/?q=fcitx5-zhuyin). Zhuyin input method engine based on libzhuyin.
- [fcitx5-rime](https://pkgs.org/search/?q=fcitx5-rime). A customizable input method, but its default configuration is Pinyin.

## Japanese

- [fcitx5-anthy](https://pkgs.org/search/?q=fcitx5-anthy)
- [fcitx5-kkc](https://pkgs.org/search/?q=fcitx5-kkc)
- [fcitx5-mozc](https://pkgs.org/search/?q=fcitx5-mozc)
- [fcitx5-skk](https://pkgs.org/search/?q=fcitx5-skk)

## Korean

- [fcitx5-hangul](https://pkgs.org/search/?q=fcitx5-hangul)

## Vietnamese

- [fcitx5-unikey](https://pkgs.org/search/?q=fcitx5-unikey)

## Thai

- [fcitx5-libthai](https://pkgs.org/search/?q=fcitx5-libthai)

## Sinhalese

- [fcitx5-sayura](https://pkgs.org/search/?q=fcitx5-sayura)

## Multilingual (if not listed above, this might be what you need)

- [fcitx5-m17n](https://pkgs.org/search/?q=fcitx5-m17n)
- [fcitx5-keyman](https://pkgs.org/search/?q=fcitx5-keyman)
- [fcitx5-table-other](https://pkgs.org/search/?q=fcitx5-table-other), it provides many other tables, but if it suits you, fcitx5-m17n is preferred.
- Built-in keyboard layout-based engine. This allows using traditional keyboard layouts.
