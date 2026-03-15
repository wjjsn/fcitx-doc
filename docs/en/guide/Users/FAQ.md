# FAQ

Please read this page before complaining that the input method doesn't work.

Starting from 4.2.7, Fcitx provides a command fcitx-diagnose that can detect some common problems and give suggestions.

## Cannot Activate Fcitx Using Ctrl + Space

Check the application where you are trying to input text.

### Wayland

Refer to [Using fcitx5 on Wayland](./UseFcitx5OnWayland).

### Is this the only program with the problem?
- The most likely cause is that some hotkey occupies Ctrl Space. Please change to another hotkey and try again. This is common in editors, as many IDEs use Ctrl+Space as the default shortcut for completion.

### Are all Gtk programs having problems?
- Please open a traditional Gtk program (by traditional, meaning it should not be Firefox, Libreoffice or similar programs that only use Gtk styling for their interface). Gedit is a good choice. Right-click on the input box, and a menu "Input Method" will appear. Please confirm that "Fcitx" is selected.

- If Fcitx is indeed in the menu but still doesn't work, please try restarting Fcitx first. If it works this time, then please check your DBus settings, or extend Fcitx's startup time. If you use a custom startup script, you can refer to [Configuration (Other)](./ConfigureFcitx5).

- If Fcitx is not selected by default, please try selecting it first and then try to input immediately. If that doesn't work, please refer to the item above. To permanently fix this problem (selecting Fcitx by default), please read the configuration section in [Installation and Configuration](./ConfigureFcitx5).

- If there is no Fcitx option, please first check your installation. The package names you need should include fcitx and gtk. If you [built Fcitx from source](../Developers/BuildFcitx5), please confirm that you enabled the GTK2 and GTK3 input method module options. If you confirm this, please read the section about how to update Gtk's cache files in [Input Method Related Environment Variables](./ConfigureFcitx5).

- If you are using Ubuntu and just upgraded to 12.04, or something bad happened (due to packager negligence or a problematic package manager that couldn't update packages in the correct order, like pacman), you may notice that gtk.immodules related files were not generated correctly during the upgrade. Try uninstalling fcitx-frontend-gtk2, fcitx-frontend-gtk3 or the corresponding packages for your distribution, then reinstall these two packages to trigger the file generation. Then recheck if "Fcitx" is in the input method menu.

### Are all Qt programs having problems?
- Run qtconfig (name may vary depending on your distribution, it could be qtconfig-qt4), select the third tab, and confirm that fcitx is in the default input method combo box. If not, please check your installation.
- The above solution can also solve XIM problems similarly, but we strongly recommend using input method modules. See [Input Method Related Environment Variables](./ConfigureFcitx5).

### Telegram Desktop
Some distributions' Telegram Desktop uses qt6. Make sure the Qt6 input method module is installed on the system. (For fcitx4, on archlinux you need to install the fcitx-qt6 package)

### Chromium or any Chromium-based browser (e.g., Microsoft Edge)
For Chromium running under X11, if the GUI is started with startx without setting the DBUS_SESSION_BUS_ADDRESS option, you may encounter [this problem](https://gitlab.freedesktop.org/xorg/app/xinit/-/issues/9), which causes Chromium-based browsers to not correctly use dbus. To solve this situation:

1. Export DBUS_SESSION_BUS_ADDRESS yourself in ~/.xinitrc (or change to use ~/.xsession if you are using a debian-based system).

2. Or use a display manager like sddm, gdm, lightdm instead of startx.

For Chromium running natively on Wayland, the only supported native Wayland input method protocol is text-input-v1, which only Weston supports. Alternatively, you can use Gtk4's im module, requiring the following flags (---enable-features=UseOzonePlatform --ozone-platform=wayland --gtk-version=4) to enable it, but unless using kimpanel + GNOME, the candidate window popup at cursor position is completely broken.

### Is it Java, Xterm, Wine or some other non-Gtk/Qt application?
There are some very rare cases where the X server may be missing some locale files when using embedded Linux or mini-linux distributions while having to use XIM. This file usually needs to be placed in the /usr/share/X11/locale/ directory.

And when you have to use XIM, please make sure your locale **cannot** be set to C or POSIX, and needs to be set to a usable locale (language doesn't matter), and if you are using glibc, you need to generate the corresponding locale file (locale-gen). When using im module, there is no such restriction.

### Is it a Qt application that bundles its own Qt library?
Bundled Qt libraries usually use their own plugin directory, which is different from the system Qt. Usually, they also use a different Qt than the system Qt. If you just copy the system's fcitx-qt files, this will also make it incompatible. But anyway, you can start by checking if it loads your copied files using the following environment variables. Depending on how XIM applications are written, it may need to find specific fonts to make it work. On Archlinux, xorg-mkfontscale is needed to generate the correct font directory files. After installation, you need to restart the X Server to make it work.

 QT_DEBUG_PLUGINS=1 QT_LOGGING_RULES="*.debug=true"

When trying to resolve all incompatibility errors. Usually, ubuntu's fcitx-frontend-qt5 and libfcitxqt5-1 are good sources for building fcitx-qt5 for specific Qt versions. For example, DraftSight 2017S0 [may work with fcitx-qt5 for xenial.

### Emacs
Try

 LC_CTYPE=zh_CN.UTF-8 emacs

Don't forget to check that your locale -a actually contains the locale, see [Input method related environment variables](https://groups.google.com/forum/#!topic/fcitx/9e4TI39_4sk]).

Emacs will use `-*-*-*-r-normal--<some font size>-*-*-*-*-*-*-*' as the base font (in src/xfns.c). If you don't have a matching font, the input method related code will not run. Installing some font packages may help (for the required fonts, xorg-fonts-misc may be the correct package, but you can also try other xorg-fonts-* packages).

### Non-Gtk/Qt Wayland Applications (Alacritty, kitty, etc.)
It is possible that the software you are using doesn't support input methods at all, because they need to have relevant code to implement it. Even if this software has relevant code implementations, the compositor is very likely to not support input methods. Only GNOME Shell and KWin have complete text-input-v3 support. As of 2022/05/07, sway still doesn't have complete zwp_input_method_v2 support for input method UI (input surface). For KWin, Plasma 5.24+ and Fcitx 5.0.14+ are required, and have KWin start Fcitx 5. And users need to go to the virtual keyboard KCM and select Fcitx 5 in the KCM.

## Candidate Window Flashing When Using Fcitx 5 on Wayland
This is mainly due to the overall poor state of Wayland input methods. The existing Wayland input method protocols are not widely supported by compositors. Although fcitx 5 supports these protocols, poor support from applications and compositors makes them unusable. Not to mention some design flaws in the protocols themselves.

To make input methods work with "current" available and widely adopted technologies, Fcitx 5 implements a mechanism called "Client Input Panel", where the basic logic is to require the client application to draw the input window UI. This is done through gtk/Qt's dbus and IM modules. The implementation needs to use the underlying wayland protocol xdg_popup to show the window. Unfortunately, only newer versions of the xdg_popup protocol support "moving" visible popup windows, and this part is "not" implemented in Gtk3 and Qt5. To make matters worse, both Gtk3 and Qt5 have reached end of life (EOL), which means it will be impossible to get this new protocol support in Gtk3/Qt5. The problem is that input methods may need to show on windows that resize and move very frequently. To mitigate this problem, Fcitx 5 IM module implements a hack where it first hides the window and then shows it again when we need to move the window. Unfortunately, this causes some degree of flashing. This hack may look very bad in some hardware and compositor combinations.

There are some possible workarounds.

1. Use kimpanel under GNOME shell, which makes the candidate window render with a completely different mechanism without flashing.

2. Disable fade effects under KWin. KWin seems to tolerate this flashing better than some other compositors.

## Problems with Google Docs in Firefox

You can temporarily turn off preedit text. The default shortcut is Ctrl+Alt+P.

## Cannot Use Fcitx in Flash

Please use an input method module.

## After Updating to a Version Newer Than 4.2.4, Cannot Input English

Please confirm that you have added "[Keyboard](../Developers/BasicConcepts)" to the input method list. You can use the [configuration tool](./ConfigureFcitx5) to modify and view this.

And you may want to move "Keyboard" to the first item.

## Unexpected Keyboard Layout Changes

Use the [configuration tool](./ConfigureFcitx5) to bind specific keyboard layouts to specific input methods.

## xmodmap Settings Being Overridden

Fcitx now controls the keyboard layout, and when switching keyboard layouts, xmodmap settings will be overridden. Therefore fcitx-xkb provides an option to specify the location of the xmodmap script and lets fcitx load this configuration when the keyboard layout changes. Disabling fcitx-xkb directly is also an option, or if your needs are simple, for example just swapping Caps Lock and Esc positions, some options can be provided by xkb options, which you can configure through your desktop's keyboard configuration tool (Both Gnome and KDE support such configurations).

The detailed explanation of specific options is as follows: xmodmap is a very low-level tool that doesn't understand keyboard layout settings. For X11, keyboard layout is built on a set of preset files. When preset files are loaded, all configurations loaded through xmodmap will be overridden. This is not unique to fcitx - this is how all tools that set keyboard layouts work. Xkb options are a set of options that can modify keyboard layout according to predefined settings, covering almost all the settings that most people want to do with xmodmap, such as dead key positions, swapping Caps Lock and Esc, etc. Unless you have special needs, it is recommended to use xkb layouts and xkb options.

Since 4.2.7, if ~/.Xmodmap exists, Fcitx will try to load it automatically.

## Configure UI, Font, Vertical List

Use the [configuration tool](./ConfigureFcitx5), Addon Configuration -> Classic UI.

If your [Gtk configuration tool](./ConfigureFcitx5) is newer than 0.4.5, or [Kcm](./ConfigureFcitx5) is newer than 0.4.1, you can configure the UI directly on the top-level tab.

## Possible Issues with GNOME 3.6

## Classic UI is Not Transparent

- This issue has been resolved by detecting the compositor manager in a different way and no longer exists in versions after 4.2.6. Please restart Fcitx first. If the problem is resolved at this point, it may be a bug in your window manager. Gnome-Shell and xcompmgr are known to have such bugs. You can try delaying the startup to work around this problem.
- If restarting Fcitx doesn't solve this problem, please check whether your window manager supports compositing and whether compositing is enabled.
### Kwin

Enable desktop effects.
### Metacity before GNOME3

gconftool-2 -s --type bool /apps/metacity/general/compositing_manager true
### Xfce

Supports compositing but needs to be manually enabled.
### Compiz

The 0.9 series can disable compositing, you can use ccsm to configure.
### Other Window Managers

You can use xcompmgr or cairo-compmgr as the compositor.

## Minecraft

Vanilla Minecraft does not support input on Linux. Worse, XIM also conflicts with its key event handling. A workaround is to intentionally set a wrong environment variable and then start it. You can use the following script:

```sh
#!/bin/sh
# set a wrong one
export XMODIFIERS="@im=null"
# start minecraft, this might change depends on you're mod, but simply its what you ARE using to start minecraft.
java -Xmx1024M -Xms512M -cp minecraft.jar net.minecraft.LauncherFrame
```

This method can also be used when you don't want to use fcitx under some XIM programs.

There is a mod called [NihongoMOD](https://forum.minecraftuser.jp/viewtopic.php?t=6279) that can support input on Linux. Version 1.2.2 and minecraft 1.5.2 have been tested and Fcitx can input without needing the hack.

## Running Root Permission Programs Under a Regular User's X

Programs running as Root always have problems under a regular user's X session (in general terms, not just for fcitx). This is because dbus is a user-session-only process. The only way to use fcitx in root programs is through XIM. You need to set GTK_IM_MODULE=xim and QT_IM_MODULE=xim before starting the program.

## Cursor Following Issues
A common misconception is that cursor following doesn't work due to the input method, but that's wrong. The principle of cursor following is: the program sends the cursor position to the input method, and the input method moves the input window. So if the program doesn't send the position, the position will be wrong. This behavior is controlled by the program, not the input method. Therefore, when you encounter any problems, please ask the program to fix this problem, don't ask the input method to do anything. In fact, the input method cannot do anything extra.

Although there may be some ways to work around specific problems, the bugs are in the programs, not the input method.

- Opera, enable on the spot in [XIM](../Developers/BasicConcepts).
- Firefox, enable preedit text.
