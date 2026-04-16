---
title: 安装 Fcitx 5
description: 在 Linux 系统上安装 Fcitx 5 的详细指南，包括从发行版仓库、Flatpak 和源码编译三种方式。
---

## 安装 Fcitx 5

Fcitx 软件包通常包括两部分部分：主程序，作为应用程序的输入法模块和插件（通常它们都是输入法引擎）。

### 从Linux发行版安装Fcitx 5

您需要从自己的软件包列表中搜索指定的Fcitx包。Fcitx 5软件包的名称中通常包含"fcitx5"。

截至今天，除了一些滚动发行版，fcitx5尚未在发行版存储库中普遍可用。

下面是一些在您使用的发行版中搜索 Fcitx5 软件包的示例。 您还可以使用桌面提供的 GUI 软件中心，例如 gnome-software（GNOME）或Plasma-discover（KDE）发现。

```sh
yum search fcitx5 # CentOS
dnf search fcitx5 # Fedora
pacman -Ss fcitx5 # Archlinux
zypper search fcitx5 # OpenSUSE
apt-cache search fcitx5 # Debian/Ubuntu
```

或者 [pkgs.org](https://pkgs.org/search/?q=fcitx5) 提供一个在不同发行版中搜索软件包的简单方法。 请注意可能有一些版本为0.0～git这样的包，这种版本是一些相当老的版本，比最老的Fcitx5稳定发布版本还要老。通常不建议使用这种版本的Fcitx5.

pkgs.org 也会提供针对不同发行版的特定安装命令。

一个基本的fcitx5安装包括：
- [fcitx5](https://pkgs.org/search/?q=fcitx5), 主程序
- [fcitx5-gtk](https://pkgs.org/search/?q=fcitx5-gtk), [fcitx5-qt](https://pkgs.org/search/?q=fcitx5-qt), 针对最受欢迎的几种UI开发工具包的输入法模块。
- [fcitx5-configtool](https://pkgs.org/search/?q=fcitx5-configtool), GUI配置程序。
- 对于不同语言，有许多的输入法引擎
**[参见 输入法引擎](./InputMethodEngines)**

一些额外的插件和主题支持：
- [fcitx5-lua](https://pkgs.org/search/?q=fcitx5-lua), 提供lua脚本支持
- [fcitx5-material-color](https://pkgs.org/search/?q=fcitx5-material-color), 一个Fcitx5漂亮主题的合集

### 从Flatpak安装Fcitx5

[Flatpak](https://flatpak.org/) 是一个用于Linux系统的软件分发和包管理工具软件。有两个flatpak仓库提供了fcitx5软件包，一个是[flathub](https://flathub.org)，另一个是fcitx本身的不稳定仓库。

截止今日，我们仍然在向flathub推送fcitx5软件包。flathub上现在仅仅只有fcitx5主程序，中文输入法，注音输入法，以及Mozc输入法。

您需要先对flatpak的软件仓库进行配置，可以通过执行下面的命令，或者在图形界面软件上操作完成。
```sh
# 添加 flatub 仓库, fcitx5-unstable 也会依赖一些这个仓库中的运行时软件包。
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
# 可选部分: 如果你想要使用不稳定版本的fcitx5，也可以添加 fcitx5 非稳定仓库。
flatpak remote-add --user --if-not-exists fcitx5-unstable https://flatpak.fcitx-im.org/unstable-repo/fcitx5-unstable.flatpakrepo
```

从flatpak安装fcitx
```sh
# 如果您使用的是旧版flatpak，在安装的时候会需要显示的指定软件仓库名字: flatpak install flathub org.fcitx.Fcitx5
flatpak install org.fcitx.Fcitx5
# 安装 fcitx5 输入法引擎, 例如fcitx5-chinese-addons, or mozc
flatpak install org.fcitx.Fcitx5.Addon.ChineseAddons
flatpak install org.fcitx.Fcitx5.Addon.Mozc
```

Flatpak 并不能提供在您运行环境中需要的输入法模块程序库，因此您还是需要手动在系统中安装它们。如果您的发行版没有提供fcitx5软件包，您也可以使用fcitx5的输入法模块作为替代（需要4.2.9.7之后的版本），或者甚至您也可以使用ibus的输入法模块。

### 从源码安装Fcitx5

- [编译Fcitx5](../Developers/BuildFcitx5)

请您在开始使用Fcitx5之前先阅读 [配置Fcitx5](./ConfigureFcitx5).
