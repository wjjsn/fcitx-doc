# 设置 Fcitx 5

### 开机自启动

#### 特定发行版中的工具

特定的发行版可能会提供一些用于自动启动 Fcitx 的工具，并且这些工具通常也会设置环境变量。

##### im-config (Debian/Debian-based/Ubuntu)

这是一个用于 Debian 和 Debian-based 发行版的工具。在登录到 GUI 之后，从命令行执行 <code>im-config</code>，应该会弹出一个向导程序，在其中选择 fcitx5 即可。

##### imsettings (Fedora)

这是一个与 im-config 类似的程序，它也提供了 GUI 来选择要使用的输入法框架。imsettings 应该是被默认安装的，如果没有，你可以手动安装它。imsettings 可以设置环境变量并且启动相应的输入法，它还提供了一个图形化的前端用于修改配置。你需要做的就是简单地执行<code>im-chooser</code>，log-out 然后再次 log-in。

[针对 Fedora 36 KDE 的操作说明](https://www.youtube.com/watch?v=FwqTtGEN4vQ)。 这个操作说明应该适用于除 GNOME 外的 XDG 兼容桌面。

##### fcitx5-autostart (Fedora)

这是一个 [fedora package]，打包了一个用于设置环境变量和 XDG autostart file 的 /etc/profile.d 脚本，可用于自启动。

##### XDG Autostart

特定的发行版可能没有提供这个文件，如未提供，你可以直接复制 <code>/usr/share/applications/org.fcitx.Fcitx5.desktop</code> 到 <code>~/.config/autostart</code>

 <nowrap>mkdir -p ~/.config/autostart && cp /usr/share/applications/org.fcitx.Fcitx5.desktop ~/.config/autostart</nowrap>

##### KWin Wayland 5.24+

如果你只使用 Gtk/Qt/Xwayland 应用，那么你不需要这里的操作。如果你希望使用支持 text-input-v3 的原生 wayland 应用，则需要让 KWin 将输入法作为一个特殊的客户端启动。

打开 systemsettings，转到 "Virtual Keyboard"  部分，将输入法从 "None" 改为 "Fcitx 5"

##### 非 XDG 兼容的窗口管理器/Wayland Compoistor

在不支持 XDG Autostart 的场景中，请检查你的窗口管理器的手册中关于如何在系统启动时自动运行应用程序的方法。

###### Weston

Weston 是一个 wayland compositor 的参考实现，并不是普通用户的常规配置。

如果你希望使用 westons zwp_input_method_v1 实现，你需要确保以下内容存在 ~/.config/weston.ini 文件中（如果路径不是  /usr/bin/fcitx5 请做相应修改）。

 <nowrap>[input-method]
path=/usr/bin/fcitx5</nowrap>

如果你已经在同一个会话中运行 fcitx5，当你为了调试和 fcitx5 尝试在 nested mode 中使用 weston 时，会存在特定的问题。

如果你出于调试目的只在 X11 中运行 weston，最简单的方法是在启动 weston 前退出 fcitx5.

另请注意，weston 有一个 bug，在首次运行时不会正确设置 DISPLAY 为输入法。您可能需要终止 fcitx5 一次才能使其正确设置 DISPLAY，或使用 OpenX11Connection dbus 调用来连接 fcitx。

### 环境变量

由于许多地方都处于过渡阶段，因此没有适合所有人的完美解决方案。请根据您的环境选择适合您的解决方案。基本上，您想要做的是为桌面会话设置以下环境变量。 
  <nowrap>
 XMODIFIERS=@im=fcitx
 GTK_IM_MODULE=fcitx
 QT_IM_MODULE=fcitx</nowrap>
 虽然它看起来像有效的 shell 脚本，但请 *注意* 上面的代码片段只是为了演示这些值是什么。请检查以下部分以了解不同方法的具体语法。

#### 登录 shell 配置文件

如果您正在使用Bash作为您的登录shell，<code>~/.bash_profile</code> 是您可以信赖的最好的用户级东西。它受到不同 DM 的广泛支持，如果您从 TTY 启动图形，它也可以工作。

- 支持主流显示管理器，包括GDM/SDDM/LightDM
- TTY 登录

如果您不使用 bash，您可能需要仔细检查您的 shell 配置文件是否可以用作设置环境变量的位置，尤其是当您正在使用一些不常见的登录 shell时。 

您需要添加到 <code>~/.bash_profile</code> 的代码片段如下：
 <nowrap>
export XMODIFIERS=@im=fcitx
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx</nowrap>

有些人可能会认为 <code>~/.profile</code> 是一个与 shell 无关的解决方案，这是错误的。虽然 GDM 始终获取此文件，但如果 <code>~/.bash_profile</code> 存在，SDDM/Bash 将不会获取此文件。这使得 <code>~/.bash_profile</code> 成为更好的解决方案，因为 bash 的使用相当广泛。但在继续之前请检查您的登录 shell，某些发行版可能不使用 bash 作为默认 shell。

此[视频](https://youtu.be/8XDmLr6wb4M)演示了如何在 Archlinux 上手动设置环境变量

#### /etc/profile

如果您不关心使用 root 修改文件，这是最好的选择。所有发行版通常都支持此文件。您需要附加到 <code>/etc/profile</code> 末尾的代码片段与 [登录shell配置文件](#登录-shell-配置文件) 相同。

#### ~/.xprofile

如果您使用 X11 和显示管理器，这是一个古老的完美选择。但 Wayland 没有对应的环境变量，因此如果要为 Wayland 设置环境变量并不理想。您要添加的代码与[登录shell配置文件](#登录-shell-配置文件) 相同。

#### environment.d

这是 system.d 引入的新配置，但并未得到桌面环境或显示管理器支持的广泛使用。它基本上是 systemd 用户单元的环境配置。目前，仅 GDM 或 Plasma 5.22+ 支持。作为 GDM，这意味着使用 GDM 登录的任何会话都可以工作。至于 Plasma，这意味着无论您使用什么 DM，它都适用于 Plasma。

此配置将在您首次用户会话登录时应用，并在之后持续存在，除非您手动停止 systemd 用户。因此，修改此配置后，使其生效的最简单方法是重新启动系统。

语法与 shell 类似，但不需要 <code>export</code>。例如，您可以创建一个包含以下内容的文件 <code>~/.config/environment.d/im.conf</code>：
 <nowrap>
XMODIFIERS=@im=fcitx
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx</nowrap>

#### pam_env.so

由于以下原因，这是一个过时的解决方案：
 * pam 自 1.5.0 起弃用用户级别配置 <code>~/.pam_environment</code>。
 * 某些发行版未在其 pam 配置中启用 pam_env。

如果您知道它适用于您的系统，您可以将以下代码片段添加到您的 <code>~/.pam_environment</code> 中。
 <nowrap>XMODIFIERS DEFAULT=\@im=fcitx
GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE DEFAULT=fcitx</nowrap>.

请**注意**，其语法与 shell 脚本不同。

#### ~/.config/plasma-workspace/env/*.sh

仅适用于 Plasma 桌面的 env 脚本位置，您需要创建自己的 .sh 文件，例如 <code>~/.config/plasma-workspace/env/im.sh</code> 并将代码片段与[登录shell配置文件](#登录-shell-配置文件)相同。

##### 其他不太常见的设置

还有一些其他变量可能对某些应用程序有用。

##### SDL_IM_MODULE

将值设置为 fcitx。只有 SDL2 需要这个。SDL1 使用 XIM。

##### GLFW_IM_MODULE

这是仅由某些应用程序使用的变量，比如 [kitty](https://github.com/kovidgoyal/kitty/kitty) 终端模拟器。您需要将其设置为"GLFW_IM_MODULE=ibus"。

### DBus

在大多数附带 systemd 的发行版上，这应该不再是问题。但是如果您使用一些所谓的"systemd"free 的发行版，您可能需要自己启动DBus并设置相关的环境变量。通常，这可以通过在启动脚本中添加如下行来完成。例如，如果您使用的是 X11，则为 ~/.xprofile。此外，您还需要确保此语法适用于您的登录 shell。
 
`eval dbus-launch --sh-syntax --exit-with-session`

### 配置 Fcitx 5

参考 [配置工具(Fcitx 5)](./ConfigureFcitx5)。
