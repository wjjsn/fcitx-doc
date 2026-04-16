---
title: Configure Fcitx 5
description: 介绍如何配置Fcitx 5，包括开机自启动、环境变量设置、DBus配置等。
---

# Configure Fcitx 5

### Auto-start on Boot

#### Distribution-specific Tools

Some distributions may provide tools for auto-starting Fcitx, and these tools usually also set environment variables.

##### im-config (Debian/Debian-based/Ubuntu)

This is a tool for Debian and Debian-based distributions. After logging into the GUI, run <code>im-config</code> from the command line, which should bring up a wizard where you can select fcitx5.

##### imsettings (Fedora)

This is a program similar to im-config, which also provides a GUI to select the input method framework to use. imsettings should be installed by default, but if not, you can install it manually. imsettings can set environment variables and start the corresponding input method. It also provides a graphical frontend for modifying configuration. All you need to do is simply run <code>im-chooser</code>, log out and log in again.

[Instructions for Fedora 36 KDE](https://www.youtube.com/watch?v=FwqTtGEN4vQ). These instructions should work for any XDG-compatible desktop other than GNOME.

##### fcitx5-autostart (Fedora)

This is a [fedora package] that packages a /etc/profile.d script for setting environment variables and XDG autostart file, which can be used for auto-start.

##### XDG Autostart

Some distributions may not provide this file. If not provided, you can directly copy <code>/usr/share/applications/org.fcitx.Fcitx5.desktop</code> to <code>~/.config/autostart</code>

 <nowrap>mkdir -p ~/.config/autostart && cp /usr/share/applications/org.fcitx.Fcitx5.desktop ~/.config/autostart</nowrap>

##### KWin Wayland 5.24+

If you only use Gtk/Qt/Xwayland applications, you don't need the operations here. If you want to use native wayland applications that support text-input-v3, you need to let KWin start the input method as a special client.

Open systemsettings, go to the "Virtual Keyboard" section, and change the input method from "None" to "Fcitx 5"

##### Non-XDG Compatible Window Managers/Wayland Compositors

In cases where XDG Autostart is not supported, please check your window manager's manual for how to automatically run applications at system startup.

###### Weston

Weston is a reference implementation of a wayland compositor, not a normal configuration for regular users.

If you want to use weston's zwp_input_method_v1 implementation, you need to ensure the following exists in ~/.config/weston.ini file (modify if the path is not /usr/bin/fcitx5).

 <nowrap>[input-method]
path=/usr/bin/fcitx5</nowrap>

If you are already running fcitx5 in the same session, there are specific issues when trying to use weston in nested mode for debugging.

If you are only running weston in X11 for debugging purposes, the simplest method is to exit fcitx5 before starting weston.

Also note that weston has a bug where it doesn't correctly set DISPLAY to the input method on first run. You may need to kill fcitx5 once to get it to correctly set DISPLAY, or use the OpenX11Connection dbus call to connect fcitx.

### Environment Variables

Since many things are in transition, there is no perfect solution that works for everyone. Please choose the solution that works for you based on your environment. Basically, what you want to do is set the following environment variables for your desktop session.
  <nowrap>
 XMODIFIERS=@im=fcitx
 GTK_IM_MODULE=fcitx
 QT_IM_MODULE=fcitx</nowrap>
 Although it looks like a valid shell script, please *note* that the code snippet above is just to demonstrate what these values are. Please check the following sections for the specific syntax of different methods.

#### Login Shell Configuration File

If you are using Bash as your login shell, <code>~/.bash_profile</code> is the most reliable user-level location. It is widely supported by different DMs, and it also works if you start graphics from TTY.

- Supports major display managers including GDM/SDDM/LightDM
- TTY login

If you don't use bash, you may need to carefully check whether your shell configuration file can be used to set environment variables, especially if you are using some uncommon login shell.

The code snippet you need to add to <code>~/.bash_profile</code> is:
 <nowrap>
export XMODIFIERS=@im=fcitx
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx</nowrap>

Some people may think <code>~/.profile</code> is a shell-independent solution, but this is wrong. Although GDM always retrieves this file, SDDM/Bash will not retrieve this file if <code>~/.bash_profile</code> exists. This makes <code>~/.bash_profile</code> a better solution since bash is quite widely used. But check your login shell before proceeding, as some distributions may not use bash as the default shell.

This [video](https://youtu.be/8XDmLr6wb4M) demonstrates how to manually set environment variables on Archlinux

#### /etc/profile

If you don't mind modifying files with root, this is the best option. This file is generally supported by all distributions. The code snippet you need to append to <code>/etc/profile</code> is the same as the [login shell configuration file](#login-shell-configuration-file).

#### ~/.xprofile

If you use X11 and a display manager, this is an ancient but perfect option. However, Wayland has no corresponding environment variable, so it is not ideal if you want to set environment variables for Wayland. The code to add is the same as the [login shell configuration file](#login-shell-configuration-file).

#### environment.d

This is a new configuration introduced by systemd, but it is not widely supported by desktop environments or display managers. It is essentially the environment configuration for systemd user units. Currently, only GDM or Plasma 5.22+ supports this. As GDM, this means any session logged in with GDM will work. As for Plasma, it means it works with Plasma regardless of which DM you use.

This configuration will be applied on your first user session login and will persist afterward unless you manually stop the systemd user. Therefore, the easiest way to make this configuration take effect after modification is to restart your system.

The syntax is similar to shell but does not require <code>export</code>. For example, you can create a file <code>~/.config/environment.d/im.conf</code> with the following content:
 <nowrap>
XMODIFIERS=@im=fcitx
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx</nowrap>

#### pam_env.so

This is an outdated solution for the following reasons:
 * pam deprecated user-level configuration <code>~/.pam_environment</code> since 1.5.0.
 * Some distributions don't enable pam_env in their pam configuration.

If you know it works for your system, you can add the following code snippet to your <code>~/.pam_environment</code>.
 <nowrap>XMODIFIERS DEFAULT=\@im=fcitx
GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE DEFAULT=fcitx</nowrap>.

Please **note** that its syntax is different from shell scripts.

#### ~/.config/plasma-workspace/env/*.sh

This is only applicable to Plasma desktop's env script location, you need to create your own .sh file, for example <code>~/.config/plasma-workspace/env/im.sh</code> and add the same code snippet as the [login shell configuration file](#login-shell-configuration-file).

##### Other Less Common Settings

There are some other variables that may be useful for certain applications.

##### SDL_IM_MODULE

Set the value to fcitx. Only SDL2 needs this. SDL1 uses XIM.

##### GLFW_IM_MODULE

This is a variable used only by some applications, like the [kitty](https://github.com/kovidgoyal/kitty/kitty) terminal emulator. You need to set it to "GLFW_IM_MODULE=ibus".

### DBus

On most distributions that come with systemd, this should no longer be a problem. However, if you use some so-called "systemd"-free distribution, you may need to start DBus yourself and set the related environment variables. Usually, this can be done by adding a line like the following to your startup script. For example, if you are using X11, it's ~/.xprofile. Also, make sure this syntax works for your login shell.
 
`eval dbus-launch --sh-syntax --exit-with-session`

### Configure Fcitx 5

Refer to [Configuration Tool (Fcitx 5)](ConfigureFcitx5).
