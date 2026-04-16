---
title: Using Fcitx5 on Wayland
description: 介绍在Wayland上使用Fcitx 5的方法，包括不同桌面环境的配置和已知问题。
---

# Using Fcitx5 on Wayland

## Using Fcitx 5 on Wayland

[Wayland](https://wayland.freedesktop.org/) is the next-generation display server protocol. Although the initial version of the protocol was released in 2008, support for input methods is not ideal.

Using input methods on different Wayland compositors may require different configurations, and some Fcitx features available on X11 have not yet been supported on Wayland.

This article tries to cover all relevant information currently available. The [Fcitx 5 Configuration Guide](ConfigureFcitx5) is still valuable for reference.

## Applications
### TL;DR: Do I still need to set XMODIFIERS, GTK_IM_MODULE and QT_IM_MODULE?

XMODIFIERS is indeed still needed, because there is basically no difference between pure X11 and X11 programs running under XWayland.

#### GTK_IM_MODULE
Ideally, you should use im-module for GTK programs running under X11, and use GTK's text-input-v3 support for pure Wayland programs. The method is:

1. Don't set the GTK_IM_MODULE environment variable!

2. For Gtk2, add the following to ~/.gtkrc-2.0:

 <nowrap>gtk-im-module="fcitx"</nowrap>
3. For Gtk3, add the following to ~/.config/gtk-3.0/settings.ini:

 <nowrap>[Settings]
gtk-im-module=fcitx</nowrap>

4. For Gtk4, add the following to ~/.config/gtk-4.0/settings.ini:

 <nowrap>[Settings]
gtk-im-module=fcitx</nowrap>

5. If you are using GNOME 3 and above, you also need to run the following command:

 <nowrap>gsettings set org.gnome.settings-daemon.plugins.xsettings overrides {"Gtk/IMModule":<'fcitx'>}</nowrap>

Regarding the GTK_IM_MODULE environment variable, modern Gtk3/4 applications should be able to use the text-input-v3 protocol (which is supported by most compositors except Weston). When GTK_IM_MODULE is not set, Gtk3/Gtk4 will automatically enable the built-in Wayland input method module. Although you can also explicitly specify GTK_IM_MODULE=wayland, Gtk2 programs also read this environment variable, causing compatibility issues. Setting GTK_IM_MODULE=fcitx still works, and if your compositor is not compatible with the Wayland input method protocol, this is your only choice.

You can force a certain IM Module in Gtk's config file, so even if you don't set the GTK_IM_MODULE environment variable, you can still use different IM Modules.

According to Gtk's implementation (valid as of version 3.24.41), the priority order is:

- X11
** GTK_IM_MODULE in environment variable
** Gtk/IMModule value in XSettings
** Value in config file
** Auto-selection based on locale
- Wayland
** GTK_IM_MODULE in environment variable
** "wayland"

#### QT_IM_MODULE
For QT_IM_MODULE, currently Qt can only use its own text-input-v{2,4}, which is only supported by KWin. This means on KDE you should unset it, but in other desktop environments you need to set it to QT_IM_MODULE=fcitx. Some proprietary Qt applications make the situation more complicated. Some don't work on Wayland, some don't bundle/provide Qt wayland. Most of them don't bundle the fcitx input method module because fcitx is just a third-party application for Qt, but I also noticed some bundle it but don't bundle all required libraries. Although fcitx 5 supports the ibus protocol, some applications don't even bundle the ibus input method module. For those proprietary Qt applications (WPS, Anki, DaVinci Resolve, Mathematica, etc...), you can try a few different environment variables.

 <nowrap>QT_IM_MODULE=fcitx # For those that bundle qt im module, like WPS, Anki, you should find a .so file with fcitx in the filename
QT_IM_MODULE=ibus # For those that bundle Qt's built-in ibus im module, you should find libibusplatforminputcontextplugin.so in the package
QT_QPA_PLATFORM=xcb QT_IM_MODULE=ibus # Force it to run on X11/XWayland and use ibus im module
 </nowrap>

In Qt 6.7, there is a new environment variable called "QT_IM_MODULES" that allows you to specify the fallback order of input method modules. You can set it to

 <nowrap>QT_IM_MODULES="wayland;fcitx;ibus"</nowrap>

This way, even for applications that don't bundle fcitx/wayland, it can choose the most available one. Remember, you may still need to set (or unset) QT_IM_MODULE (not "QT_IM_MODULES") to handle Qt 4/5 applications.

### Traditional X11 Applications Running Under XWayland
In short, XWayland has as good input method support as a regular X11 display server. As long as you set the same environment variables, using Xwayland should not be a problem. These applications include:

- Xlib-based (and Xlib-based toolkits like tk, SDL1, etc.), such as xterm, rxvt. Make sure XMODIFIERS is set correctly.
- Gtk2-based applications, similar to Xlib, but can use fcitx input method module. Setting GTK_IM_MODULE to fcitx will give the best experience.
- SDL2 applications that don't use wayland by default. Set SDL_IM_MODULE to fcitx.
- Electron, chromium, these still use X11 by default, similar to Gtk2's situation.
- For Qt4 applications, Qt4 can only use X11. You need to set QT_IM_MODULE to fcitx. The same applies to Qt5+ using XCB (can be overridden with QT_QPA_PLATFORM=xcb).

### Gtk3 / Gtk4
Gtk3 and Gtk4 natively support text-input-v3. At the same time, fcitx input method modules can also be used on wayland. So both GTK_IM_MODULE=wayland or GTK_IM_MODULE=fcitx will work. There are some differences between these two. text-input-v3

### Qt5 / Qt6
If your Qt application runs natively on Wayland, you can unset QT_IM_MODULE to let it use text-input-v2, or set QT_IM_MODULE=fcitx to let it use the fcitx input method module.

text-input-v2 has not been upstreamed to wayland-protocols, which is probably why only kwin supports it. This means in non-kwin environments, you need to use QT_IM_MODULE=fcitx to make Qt applications work.

On Qt6, if your Qt version includes this https://codereview.qt-project.org/c/qt/qtwayland/+/416862, you can also use QT_IM_MODULE=(empty) or QT_IM_MODULE=wayland.

### Native wayland applications (winit)
Most likely uses text-input-v3.

### Chromium / Electron
> **Warning**: The information in this section may not be the latest to reflect upstream changes, especially regarding default behavior when no options are changed.

In short, if you run Chromium or Electron applications using XWayland, just install the Gtk input method module and set GTK_IM_MODULE=fcitx just like on X11.

If you choose to run chromium natively on Wayland, you need to use

 # If your compositor supports text-input-v1 protocol. Please check the compositor section below.
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime

 # If your compositor and chromium support text-input-v3 protocol, you can also use
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3 
  
 # However, due to different understanding of text-input-v3 protocol, there are some issues when used with KWin.
 # If you use kwin, it's better to use text-input-v1.
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=1

Or

 # You will get wrong position for input method popup window unless you use GNOME shell + kimpanel extension.
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --gtk-version=4 

For electron, only the first option is available (electron doesn't support running internal chromium with gtk4), for example vscode

 # If your compositor supports text-input-v1 protocol. Please check the compositor section below.
 code --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime

By default, it should run under Xwayland (as of 2023/02/25 on Archlinux/Chromium 110.0.5481.177), but some users also reported that even when "Preferred Ozone Platform" is "default", it's also using wayland. So to check if it's really running with wayland, you can use xeyes or xwininfo. With xeyes, if it's an X11 window, the "eyes" will follow the mouse, otherwise it's wayland. With xwininfo, if the mouse cursor becomes a "+" shape and clicking the window shows window info, it's an X11 window.

You can force it to run with Wayland or X11 using the <code>--ozone-platform=wayland</code> and <code>--ozone-platform=x11</code> flags. You can permanently save this by changing the "Preferred Ozone Platform" option in chrome://flags. It has four values: "default", "X11", "Wayland", "auto".

If it runs with Gtk4 (currently only supported by chromium/chrome, electron doesn't support it), you can also make it use GTK_IM_MODULE by passing <code>--gtk-version=4</code>.

You can also make it use text-input-v1 by passing <code>--enable-wayland-ime</code> on top of the above flags.

Chromium's support for text-input-v1 is not very stable, you may encounter some random crashes. For example, in the past, version 112 had a crash bug: https://bugs.chromium.org/p/chromium/issues/detail?id=1431532, which was fixed in version 115. In the bug comment, Chromium developers claimed that this text-input-v1 should only be used internally and support is not great, so use it at your own risk, although it is currently the only out-of-the-box option.

You should only use one of <code>--enable-wayland-ime</code> or <code>--gtk-version=4</code>, depending on whether you want to use text-input-v1 or gtk4 input method module. text-input-v1 works with kwin 5.27 and Weston. Gtk4 input method module works for all environments, but only GNOME with Kimpanel extension can show popup windows at the correct position.

## Wayland Compositor Support

Even if you only use native wayland applications, it is recommended to enable Xwayland for the following reasons. If the client input panel in the input method module doesn't work, fcitx will fall back to X11 windows instead of wayland windows. The reason is that wayland windows cannot be freely placed on the screen. Instead, even if the input method module can only pass coordinates relative to the application window to fcitx, making the coordinate position not very meaningful, if your application window is "maximized", treating it as global coordinates may be exactly "correct". This makes X11 windows a better choice than randomly placed wayland windows.

### KDE Plasma
Best setup:
- KDE Plasma 5.27 or higher
- Environment variables:
** Set <code>XMODIFIERS=@im=fcitx</code> for XWayland applications
** Start fcitx5 by going to "System Settings" -> "Virtual Keyboard" -> Select Fcitx 5
** Don't set <code>GTK_IM_MODULE</code> & <code>QT_IM_MODULE</code> & <code>SDL_IM_MODULE</code>. You can unset <code>GTK_IM_MODULE</code> & <code>QT_IM_MODULE</code> by running <code>im-config</code> and then selecting <code>Do not set any input method from im-config, use desktop default</code>
** Run chromium/electron applications with <code>--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime</code>
- Notes:
** Some Gtk/Qt applications that only work under X11 may still need <code>GTK_IM_MODULE</code> or <code>QT_IM_MODULE</code> set separately for them
** If you globally set <code>GTK_IM_MODULE/QT_IM_MODULE</code>, you will encounter this issue [Candidate window flashing when using Fcitx 5 on Wayland](FAQ#candidate-window-flashing-when-using-fcitx-5-on-wayland)

Support information:
- App/compositor supports text-input-v2 and text-input-v3.
- Compositor/application uses zwp_input_method_v1.
- 5.27 additionally supports text-input-v1.
- 5.24 can use zwp_input_method_v1 and fcitx5. There were many problems before 5.24, always use fcitx input method module.
- Start fcitx5 using the "Virtual Keyboard" KCM. This is necessary for using the text-input protocol. If you start fcitx this way, make sure not to use "Restart" from the tray menu, because the socket passed from KWin cannot be reused with the newly restarted fcitx.

### GNOME
Best setup:
- Environment variables:
** Set <code>XMODIFIERS=@im=fcitx</code> for XWayland applications
** Set <code>QT_IM_MODULE=fcitx</code> for Qt, because Qt5 uses XWayland by default
** Run chrome with XWayland and <code>GTK_IM_MODULE=fcitx</code>

Support information:
- Application/compositor uses text-input-v3
- Compositor/input method uses ibus dbus protocol, so need to use ibus frontend.
- Add Fcitx 5 to autostart, it will replace any existing ibus-daemon at startup, so it can work directly.
- Popup candidate window cannot display above gnome-shell UI. The only solution is to use [Kimpanel](ThemeCustomization), [extension link](https://extensions.gnome.org/extension/261/kimpanel/).
- Qt needs QT_IM_MODULE=fcitx because there is no text-input-v2 support.

### Sway
- Application/compositor uses text-input-v3
- Compositor/application uses zwp_input_method_v2, but it's only partially implemented. You need [this pull request](https://github.com/swaywm/sway/pull/7226) to make it show popup candidate windows for text-input-v3 clients.
- fcitx input method module also works.
- Qt needs QT_IM_MODULE=fcitx because there is no text-input-v2 support.

### Weston
- Application/compositor uses text-input-v1
- Compositor/application uses zwp_input_method_v1.
- Since there is no more commonly used text-input-v3, input method modules are the only solution for Gtk/Qt, requiring setting GTK_IM_MODULE=fcitx and QT_IM_MODULE=fcitx.
- Add the following to ~/.config/weston.ini to make it start fcitx 5. (Even on wayland, the xwayland section is recommended to be enabled to make fcitx work best)

```ini
[core]
xwayland=true

[input-method]
path=/usr/bin/fcitx5
```

### Other Compositors
Please check their upstream for more information. For wlroots-based compositors, they may also support it in the same way as Sway, or zwp_input_method may also not be supported.

## Known Issues
### Fcitx-managed XKB Layouts
Unlike X11, there is no common way to set XKB layouts to the compositor, which means it can only be implemented separately for each desktop. Currently, Fcitx-managed layouts only work with KDE Plasma and GNOME.

For other desktops, to make this "half" work, you need to ensure the following:

- The XKB layout of the input method group should be the same as the actual xkb layout configured for the compositor. Fcitx will "think" the layout is the same and bypass the key conversion logic.
- If you need other layouts to input text (e.g., Arabic), just add them to Fcitx. As long as keys are forwarded to fcitx, it should work.

### Popup Candidate Window
Wayland doesn't have a global coordinate system for regular clients, so for native wayland clients, it's impossible for Fcitx to place a wayland surface at a certain position. To make popups appear at the correct position, the following situations apply:
- Xwayland has no problem, it should work like X11.
- If the zwp_input_method protocol can be used, it has a surface role that allows the compositor to place popup windows for input methods. This only works when the client uses the text-input protocol.
- For GNOME, the kimpanel extension can read window coordinates because it runs within the compositor. As long as the input method module can report relative coordinates, the kimpanel extension can show popup windows at the correct position. A similar approach for Plasma kimpanel is planned but not yet implemented.
- For Gtk/Qt, fcitx's input method module implements a method to render popups in the client process. This has some limitations because the implementation of xdg_popup in Gtk3/Qt5 doesn't support repositioning windows. So it uses show/hide tricks to mitigate this problem, which may cause window flashing. If possible, Fcitx tries not to move windows. If you use KWin, you can also disable popup animations to help reduce flashing.

### Per-window Input Method State
When using zwp_input_method, there is essentially only one input context visible to fcitx, and fcitx cannot distinguish which application is being used. This means the "activate"/"deactivate" state of the input method is now "global".

Fcitx now supports two protocols to get the focused window and the corresponding application name, including wlr-foreign-toplevel-management (used by wlroots-based compositors) and plasma-window-management (used by kwin).
