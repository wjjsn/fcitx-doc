---
title: Theme Customization
description: 介绍Fcitx5的主题引擎，包括经典UI选项、Kimpanel以及不同桌面环境的集成。
---

# Theme Customization

Fcitx5 has a simple theme engine based on custom ini-style config files and images. It works for both server-side input method UI and fcitx5's new client-side input method UI. On X11, the input method window is rendered by fcitx's server program. But on Wayland, it may be rendered by client programs like Qt or Gtk. They share similar logic and most features. However, Qt is an exception - because the window in Qt is rendered by the local Qt library API, it does not support the "render text with input method language" option.

## Classic UI Options

- Vertical candidate list. When enabled, if the input method engine doesn't specify otherwise, the candidate list will be displayed vertically by default. However, the input method engine logic may also override this display direction.
- Use per-screen DPI. Use the DPI scaling of the screen where the input window is located to render text. This option will mostly only affect X11. On X11, Fcitx reads the configured Xft.dpi value and uses this value as the DPI for your primary screen. If you have a dual-screen setup where the primary screen has a physical DPI of 120 and the secondary screen has 280. If Xft.dpi is set to 96, then fcitx will use 96 DPI on your primary screen, while the other screen will use 280/120*96=224 DPI for rendering text proportionally.
- Use mouse wheel to flip pages
- Render text with input method language. Special characters may be represented by the same Unicode codepoint in different language contexts. This option allows text to be displayed using the input method language's locale settings. For example, when using Chinese input methods like Pinyin, it will display Chinese variant characters, and Japanese variants will display as Japanese variants when using Japanese input methods. Using this option requires fonts that support different locale settings.

## Kimpanel
This is a DBus interface-based UI that is common across input method frameworks. There are multiple implementations available for different desktop environments.
- Kimpanel plasmoid, included in the plasma-desktop package of KDE Plasma 5 desktop environment.
- GNOME extension, can be found at [extensions.gnome.org](https://extensions.gnome.org/extension/261/kimpanel/). Maintained by (User:Weng Xuetian) on [github](https://github.com/wengxt/gnome-shell-extension-kimpanel/issues).
- Kimtoy, a third-party standalone program.

Due to the complex issues between Wayland and input methods, Kimpanel may not be usable with native wayland programs for Gtk/Qt when using Fcitx's input method module in non-GNOME environments. This is mainly because Kimpanel, as a GNOME extension, can get window information and freely move windows. The same situation does not apply to other Kimpanel implementations. Placing the window in the correct position is much more important than appearance, so Kimpanel cannot be used in such environments - instead, the client input panel is used.
