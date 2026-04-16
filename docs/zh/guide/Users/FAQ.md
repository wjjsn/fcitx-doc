---
title: 常见问题
description: Fcitx 使用过程中常见问题的解决方案，包括 Ctrl+Space 无法激活、Wayland 支持、选词窗口闪烁等问题。
---

当你抱怨输入法无法正常工作前，请先阅读这个页面。

从 4.2.7 开始，Fcitx 提供了一个 fcitx-diagnose 的命令，它可以检测一些常见的问题并且给出一些建议。

## 使用 Ctrl + Space 时无法激活 Fcitx

检查你要输入文字的应用程序。

### Wayland 

参考 [在 Wayland 上使用 fcitx5](./UseFcitx5OnWayland)。

### 这是唯一一个有问题的程序吗？
- 最可能的原因是某个快捷键占用了 Ctrl Space，请修改另一个快捷键并重试。这常见于编辑器中，因为很多集成开发环境默认使用 Ctrl+Space 作为补全的快捷键。

### 所有 Gtk 程序都有问题？ 
- 请打开一个传统意义上的Gtk程序（所谓传统，就是它不应该是Firefox，Libreoffice这种仅仅是是使用Gtk样式作为界面的程序）。Gedit是一个不错的选择。右键点击输入框，将会弹出一个"输入法"菜单，请确认"Fcitx"被选中。

- 如果菜单中确实有Fcitx，但是还是无法正常工作，请先尝试重新启动Fcitx，如果这次就可以工作了，那么请检查你的DBus设置，或者延长Fcitx的启动时间。如果你使用自定义的启动脚本，你可以参考[配置 (其他)](./ConfigureFcitx5)

- 如果Fcitx没有默认选中，那么请先尝试选中它，并且立刻试试可否输入。如果不行，请参见上面一条。为了永久性的修复这个问题（默认选中 Fcitx ），请阅读[安装和配置](./ConfigureFcitx5)中的配置部分。

- 如果没有 Fcitx这项，那么请首先检查你的安装，你所需要的包名包含了fcitx和gtk。如果你是[从源码编译的Fcitx](../Developers/BuildFcitx5)，请确认你启用了GTK2，GTK3的输入法模块选项。如果你确认这点的话，请阅读[输入法相关的环境变量](./ConfigureFcitx5)中的如何更新Gtk的缓存文件。

- 如果你正在使用 Ubuntu，并且刚刚升级到 12.04，或者发生了什么不好的事情 (由于打包者的疏忽，或者有问题的包管理器无法按照正确顺序更新包，例如 pacman) 你可能会注意到 gtk.immodules 相关的文件并未在升级时正确生成。试试卸载fcitx-frontend-gtk2, fcitx-frontend-gtk3 或者你发行版对应的包，然后重新安装这两个包来触发文件的生成。然后重新检查输入法菜单里面是否有"Fcitx"。

### 所有Qt程序都有问题？
- 运行qtconfig (名称可能根据你的发行版有所不同，他可能是 qtconfig-qt4 )，选择第三个标签，确认fcitx是在默认输入法组合框中。如果没有，请检查你的安装。
- 以上解决方案也可以类似解决XIM的问题，但我们强烈建议你使用输入法模块。参见 [输入法相关环境变量](./ConfigureFcitx5)。

### Telegram Desktop
一些发行版的telegram desktop使用了qt6。这时候要确保系统上安装了Qt6的输入法模块。（对于fcitx4而言，在archlinux上要安装fcitx-qt6软件包）

### Chromium或者任何基于chromium的浏览器（例如，Microsoft Edge）
对于在 X11 下运行的 Chromium，如果使用没有设置 DBUS_SESSION_BUS_ADDRESS 选项的 startx 启动图形用户界面，可能会遇到 [这个问题](https://gitlab.freedesktop.org/xorg/app/xinit/-/issues/9)，它会导致基于 Chromium 的浏览器无法正确使用 dbus。为了解决这种情况，可以这么做：

1. 在 ~/.xinitrc 中自己导出 DBUS_SESSION_BUS_ADDRESS（或者如果您使用的是基于 debian 的系统，则更改为使用 ~/.xsession）。

2. 或者使用像sddm、gdm、lightdm这样的显示管理器替代startx。

对于在 wayland 下原生运行的 Chromium，唯一支持的原生 wayland 输入法协议是text-input-v1，只有 weston 支持。或者，也可以使用 Gtk4 的 im 模块，需要使用以下标志 (---enable-features=UseOzonePlatform --ozone-platform=wayland --gtk-version=4) 来使其启用 Gtk im 模块，但是除非使用 kimpanel + GNOME，否则在光标位置弹出候选词窗口的功能就完全坏掉了。

### 是 Java、Xterm、wine 还是其他一些非 Gtk/Qt 应用程序？
还有一些非常罕见的情况，在使用嵌入式 linux 或 mini-linux 发行版，而又必须在其中使用 XIM 时，X 服务器可能会丢失一些语言环境（locale）文件。该文件通常需要被放在 /usr/share/X11/locale/ 目录下。

并且当你必须使用 XIM 的时候，请确认你的 locale **不能**被设置为 C 或者 POSIX，并且需要被设置为一个可用的 locale （语言无所谓），并且如果你使用的是 glibc，你需要生成对应的locale的文件(locale-gen)。当你使用 im module 的时候，并无这个限制。

### 是捆绑了自己的 Qt 库的 Qt 应用程序吗？
捆绑的 Qt 库通常使用自己的插件目录，这与系统的 Qt 不同。通常，他们也使用与系统 Qt 不同的 Qt，如果您只是复制系统的 fcitx-qt 文件，这也会使其不兼容。但无论如何，您可以开始检查它是否使用以下环境变量加载您复制的文件。 根据 XIM 应用程序的编写方式，它可能需要找到特定的字体才能使其工作。 在 Archlinux 上，需要 xorg-mkfontscale 来生成正确的字体目录文件。 安装后，您需要重新启动 X Server 才能使其工作。

 QT_DEBUG_PLUGINS=1 QT_LOGGING_RULES="*.debug=true"

在尝试解决所有不兼容错误的时候。通常，ubuntu 的 fcitx-frontend-qt5 和 libfcitxqt5-1 是针对特定 qt 版本构建 fcitx-qt5 的良好来源。例如，DraftSight 2017S0 [可能适用于 xenial 的 fcitx-qt5。

### Emacs
试试

 LC_CTYPE=zh_CN.UTF-8 emacs

别忘记检查你的 locale -a 确实包含了locale，参见 [输入法相关环境变量](https://groups.google.com/forum/#!topic/fcitx/9e4TI39_4sk])(Input method related environment variables)。

Emacs 将使用 `-*-*-*-r-normal--<some font size>-*-*-*-*-*-*-*' 作为基础字体 (在 src/xfns.c 中)，如果你没有匹配的字体，和输入法相关的代码将不会运行。安装某些字体包可能有帮助（对于需要的字体，xorg-fonts-misc 可能是正确的那个包，但你也可以试试别的 xorg-fonts-* 包。）。 

### 非 Gtk/Qt Wayland 应用程序（Alacritty、kitty 等）
有可能您使用的软件根本不支持输入法，因为它们需要有相关的代码来实现。即使这些软件有相关代码实现，合成器（compositer）也有很大可能不支持输入法。只有 GNOME Shell 和 KWin 具有完整的 text-input-v3 支持。截至 2022/05/07，sway 仍然没有完整的zwp_input_method_v2 支持来支持输入法界面（input surface）。对于 KWin，需要 Plasma 5.24+ 和 Fcitx 5.0.14+，并让 KWin 启动 Fcitx 5。并且需要用户转到虚拟键盘 KCM 并在 KCM 中选择 Fcitx 5。

## 在 wayland 下使用 Fcitx 5 时选词窗口闪烁
这主要是由于wayland输入法整体状态不佳。现有的 wayland 输入法协议并没有得到 compositor 的广泛支持。尽管 fcitx 5 支持这些协议，但应用程序和合成器的糟糕支持使它们无法使用。更不用说协议中的某些设计缺陷了。

为了使输入法可以与"当前"可用且广泛采用的技术一起使用，Fcitx 5 实现了一种称为"客户端输入面板"的机制，基本逻辑是要求客户端应用程序绘制输入窗口界面。这是通过 gtk/Qt 的 dbus 和 IM 模块来完成的。该实现需要使用底层 wayland 协议 xdg_popup 来显示窗口。不幸的是，只有新版本的 xdg_popup 协议支持"移动"可见的弹出窗口，而这部分在 Gtk3 和 Qt5 中并"没有"实现。更糟糕的是，Gtk3 和 Qt5 都将停止开发了（end of life, 缩写EOL），这意味着在 Gtk3/Qt5 中将不可能获得这种新的协议支持。问题是输入法可能需要在调整大小和移动非常频繁的窗口上显示。为了缓解这个问题，Fcitx 5 IM 模块实现了一个 hack，当我们需要移动窗口时，它会先隐藏窗口，然后再显示窗口。不幸的是，这会导致一定程度的闪烁。这种hack可能会导致在某些硬件和合成器组合中看起来非常糟糕。

有一些可能的解决方法。

1、在GNOME shell下使用kimpanel，使候选窗口以完全不同的机制呈现，不会出现闪烁。 

2.在KWin下禁用淡入淡出效果。KWin 似乎比某些合成器更能容忍这种闪烁。

## Firefox 中的 Google Docs 有问题

可以暂时关掉预编辑文本，默认快捷键为Ctrl+Alt+P。

## 无法在 Flash 中使用 Fcitx

请使用输入法模块。

## 更新至新于 4.2.4 的版本之后，无法输入英文

请确认你将"[键盘](../Developers/BasicConcepts)"加入了输入法列表。你可以使用[配置工具](./ConfigureFcitx5)来修改和查看。

并且你可能希望将"键盘"移至第一项。

## 非预期的键盘布局变化

用[配置工具](./ConfigureFcitx5)来为特定的输入法绑定特定的键盘布局。

## xmodmap 的设置被覆盖

Fcitx 现在可以控制键盘布局，并且在键盘布局切换时，xmodmap的设置将被覆盖。因此 fcitx-xkb 提供了一个选项来指定xmodmap脚本的位置，并且可以让fcitx来在键盘布局变化时加载这个配置。直接禁用 fcitx-xkb 也是一种选择，或者如果您的需求很简单，例如只是想交换 Caps Lock 和 Esc 的位置，部分选项可以由xkb选项来提供，您可以通过您桌面的键盘配置工具来设置这些选项 (Gnome 和 KDE 都支持这类配置)。

选项具体的细节解释如下，xmodmap是一个非常底层的工具，并不了解键盘布局的设置，对X11来说，键盘布局是建立在一组预设文件上，当预设文件加载时，所有通过xmodmap加载的配置都将被覆盖，这并不是只针对fcitx而言如此，所有进行键盘布局设置的工具都是如此。Xkb 选项是一组可以按照预定义设置来修改键盘布局的选项，涵盖了绝大多数一般人想用xmodmap进行的设置，例如死键的位置，交换 Caps Lock 和 Esc 等等。除非您有特殊需求，推荐使用 xkb 布局和 xkb 选项。

自 4.2.7 起，如果 ~/.Xmodmap 存在，Fcitx 将会尝试自动加载。

## 配置用户界面，字体，纵向列表

使用[配置工具](./ConfigureFcitx5)，附加组件配置 -> 经典界面。

如果您使用的 [Gtk 配置工具](./ConfigureFcitx5) 新于 0.4.5，或者 [Kcm](./ConfigureFcitx5) 新于 0.4.1，您可以直接在顶层标签配置界面。

## GNOME 3.6 可能的问题

## 经典界面不透明

- 这个问题已经通过用不同的方式检测混成管理器而不在 4.2.6 之后的版本中存在了。 请先重启 Fcitx，如果这时没问题了，那么可能是你的窗口管理器的Bug。Gnome-Shell，xcompmgr 已知存在这样的Bug。你可以尝试延迟启动来绕过这个问题。
- 如果重启Fcitx没有解决这个问题，请检查你的窗口管理器是否支持混成，以及是否启用了混成。
### Kwin

启用桌面特效。

### Metacity before GNOME3

gconftool-2 -s --type bool /apps/metacity/general/compositing_manager true
### Xfce

支持混成，但需要手动启用。
### Compiz

0.9 系列可以禁用混成，你可以用ccsm来配置。
### 其他窗口管理器

你可以用 xcompmgr， cairo-compmgr 来作为混成管理器。

## Minecraft

原版 Minecraft 在 Linux 下不支持输入，更糟的是，XIM 还和它的按键事件处理冲突，一个绕过的办法是，故意设置一个错误的环境变量然后启动它。你可以使用下面的脚本：

```sh
#!/bin/sh
# set a wrong one
export XMODIFIERS="@im=null"
# start minecraft, this might change depends on you're mod, but simply its what you ARE using to start minecraft.
java -Xmx1024M -Xms512M -cp minecraft.jar net.minecraft.LauncherFrame
```

这个方法也可以不想在一些 XIM 的程序下面用 fcitx 的时候使用。

有一个名为 [NihongoMOD](https://forum.minecraftuser.jp/viewtopic.php?t=6279) 的 mod 可以在 Linux 下支持输入，1.2.2 和 minecraft 1.5.2 测试和 Fcitx 不需要 hack 就可以输入。

## 在一般用户的 X 下 运行 Root 权限的程序
以 Root 运行的程序在一般用户的 X 会话下总是有问题的（一般意义上，并不只针对 fcitx），这是因为 dbus 是一个仅限用户会话的进程。唯一在root程序中的办法使用 fcitx 的办法是通过 XIM，需要启动程序前设置 GTK_IM_MODULE=xim 和 QT_IM_MODULE=xim。

## 光标跟随问题
一个常见的误解是由于输入法的问题导致无法光标跟随，但这是错的。光标跟随的原理是：程序将光标位置发送给输入法，输入法移动输入框。因此如果程序不发送位置的话，位置就会是错误的。这个行为是由程序控制的，而不是输入法。因此当你遇见任何问题的时候，请要求程序来修复这个问题，不要要求输入法做任何事。实际上，输入法做不了任何额外的事情。

尽管可能存在一些能够绕过特定问题的办法，但是bug还是在程序而不是输入法中。

- Opera，在 [XIM](../Developers/BasicConcepts) 中启用 on the spot 。
- Firefox，启用预编辑文本。
