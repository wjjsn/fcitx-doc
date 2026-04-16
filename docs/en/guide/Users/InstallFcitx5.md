---
title: Install Fcitx5
description: 介绍如何安装Fcitx 5，包括从Linux发行版安装、Flatpak安装和源码编译。
---

# Install Fcitx5

## Installing Fcitx 5

The Fcitx package typically consists of two parts: the main program, which serves as the input method module for applications, and plugins (which are usually input method engines).

### Installing Fcitx 5 from Linux Distributions

You need to search for the Fcitx package in your distribution's package list. The Fcitx 5 package name typically contains "fcitx5".

As of today, except for some rolling release distributions, fcitx5 is not yet widely available in distribution repositories.

Here are some examples of searching for Fcitx5 packages in your distribution. You can also use the GUI software center provided by your desktop, such as gnome-software (GNOME) or Plasma-discover (KDE).

```sh
yum search fcitx5 # CentOS
dnf search fcitx5 # Fedora
pacman -Ss fcitx5 # Archlinux
zypper search fcitx5 # OpenSUSE
apt-cache search fcitx5 # Debian/Ubuntu
```

Alternatively, [pkgs.org](https://pkgs.org/search/?q=fcitx5) provides an easy way to search for packages across different distributions. Note that there may be some packages with versions like 0.0～git, which are quite old versions older than the oldest Fcitx5 stable release. Using such versions of Fcitx5 is generally not recommended.

pkgs.org also provides specific installation commands for different distributions.

A basic fcitx5 installation includes:
- [fcitx5](https://pkgs.org/search/?q=fcitx5), the main program
- [fcitx5-gtk](https://pkgs.org/search/?q=fcitx5-gtk), [fcitx5-qt](https://pkgs.org/search/?q=fcitx5-qt), input method modules for the most popular UI toolkits.
- [fcitx5-configtool](https://pkgs.org/search/?q=fcitx5-configtool), GUI configuration tool.
- There are many input method engines for different languages
** See [Input Method Engines](./InputMethodEngines)

Some additional plugins and theme support:
- [fcitx5-lua](https://pkgs.org/search/?q=fcitx5-lua), provides lua script support
- [fcitx5-material-color](https://pkgs.org/search/?q=fcitx5-material-color), a collection of beautiful themes for Fcitx5

### Installing Fcitx5 from Flatpak

[Flatpak](https://flatpak.org/) is a software distribution and package management tool for Linux systems. There are two flatpak repositories that provide fcitx5 packages: one is [flathub](https://flathub.org), and the other is fcitx's own unstable repository.

As of today, we are still pushing fcitx5 packages to flathub. Currently on flathub, there is only the fcitx5 main program, Chinese input method, Zhuyin input method, and Mozc input method.

You need to configure the flatpak repository first, either by executing the commands below or through the graphical software interface.
```sh
# Add flathub repository, fcitx5-unstable also depends on some runtime packages from this repository.
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
# Optional: If you want to use the unstable version of fcitx5, you can also add the fcitx5 unstable repository.
flatpak remote-add --user --if-not-exists fcitx5-unstable https://flatpak.fcitx-im.org/unstable-repo/fcitx5-unstable.flatpakrepo
```

Install fcitx from flatpak:
```sh
# If you are using an old version of flatpak, you need to explicitly specify the repository name during installation: flatpak install flathub org.fcitx.Fcitx5
flatpak install org.fcitx.Fcitx5
# Install fcitx5 input method engines, e.g. fcitx5-chinese-addons, or mozc
flatpak install org.fcitx.Fcitx5.Addon.ChineseAddons
flatpak install org.fcitx.Fcitx5.Addon.Mozc
```

Flatpak cannot provide the input method module libraries needed in your runtime environment, so you still need to manually install them in your system. If your distribution doesn't provide fcitx5 packages, you can also use fcitx5's input method modules as a replacement (requires version 4.2.9.7 or later), or you can even use ibus input method modules.

### Building Fcitx5 from Source

- [Build Fcitx5](../Developers/BuildFcitx5)

Please read [Configure Fcitx5](./ConfigureFcitx5) before starting to use Fcitx5.
