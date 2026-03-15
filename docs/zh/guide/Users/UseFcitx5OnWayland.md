# Wayland下使用Fcitx5

## 在 Wayland 下使用 Fcitx 5

[Wayland](https://wayland.freedesktop.org/) 是下一代显示服务器协议。虽然协议的最初版本发布于 2008 年，但对输入法的支持并不理想。

在不同的 Wayland 合成器上使用输入法可能需要不同的配置，且某些在 X11 下可用的 Fcitx 功能尚未被 Wayland 支持。

本文尽量涵盖目前所有的相关信息，[Fcitx 5 配置指南](ConfigureFcitx5)亦仍具有参考价值。

## 应用程序
### TL;DR：还需要设置 XMODIFIERS、GTK_IM_MODULE 和 QT_IM_MODULE 吗？

XMODIFIERS 确实还需要设置，因为纯 X11 和 XWayland 下运行的 X11 程序基本没什么区别。

#### GTK_IM_MODULE
在理想的情况下，你应该在 X11 下运行的 GTK 程序用 im-module，而在纯 Wayland 程序中用 GTK 的 text-input-v3 支持。其方法是：

1. 不要设置 GTK_IM_MODULE 环境变量！

2. 对于 Gtk2，向 ~/.gtkrc-2.0 添加如下内容：

 <nowrap>gtk-im-module="fcitx"</nowrap>
3. 对于 Gtk3，向 ~/.config/gtk-3.0/settings.ini 添加如下内容：

 <nowrap>[Settings]
gtk-im-module=fcitx</nowrap>

4. 对于 Gtk4，向 ~/.config/gtk-4.0/settings.ini 添加如下内容：

 <nowrap>[Settings]
gtk-im-module=fcitx</nowrap>

5. 如果你在用 GNOME 3 和以上版本，你还需要运行以下命令：

 <nowrap>gsettings set org.gnome.settings-daemon.plugins.xsettings overrides {"Gtk/IMModule":<'fcitx'>}</nowrap>

关于 GTK_IM_MODULE 环境变量，目前现代 Gtk3/4 应用程序应当能够使用 text-input-v3 协议（该协议已被绝大多数合成器支持，Weston 除外）。不设置 GTK_IM_MODULE 的时候，Gtk3/Gtk4 就会自动启用内置的 Wayland 输入法模块。虽然你也可以显式指定 GTK_IM_MODULE=wayland，但是 Gtk2 程序也会读取这个环境变量，导致兼容问题。设置 GTK_IM_MODULE=fcitx 依然是可以工作的，而且如果你使用的合成器不兼容 Wayland 输入法协议，这也是你的唯一选择。

你可以在 Gtk 的配置文件里强制使用某个 IM Module，所以就算你不设置 GTK_IM_MODULE 环境变量也仍然是可以用不同的 IM Module 的。

根据 Gtk 的实现（截至 3.24.41 版本仍有效），优先级顺序如下：

- X11
** 环境变量中的 GTK_IM_MODULE
** XSettings 中 Gtk/IMModule 的值
** 配置文件中的值
** 基于区域设置的自动选择
- Wayland
** 环境变量中的 GTK_IM_MODULE
** "wayland"

#### QT_IM_MODULE
对于 QT_IM_MODULE，目前 Qt 只能使用自己的 text-input-v{2,4}，而这仅被 KWin 支持。这意味着，在 KDE 下你应该取消设置它，但在其他桌面环境下，你需要将其设置为 QT_IM_MODULE=fcitx。还有一些专有的 Qt 应用程序使情况变得复杂。有些在 Wayland 上不工作，有些没有捆绑/提供 Qt wayland。它们中的大多数没有捆绑 fcitx 输入法模块，因为 fcitx 只是 Qt 的第三方应用程序，但我也注意到有些捆绑了但没有捆绑所有需要的库。虽然 fcitx 5 支持 ibus 协议，但有些应用程序甚至没有捆绑 ibus 输入法模块。对于那些专有 Qt 应用程序（WPS、Anki、DaVinci Resolve、Mathematica 等...），你可以尝试几个不同的环境变量。

 <nowrap>QT_IM_MODULE=fcitx # 对于那些捆绑了 qt im 模块的，如 WPS、Anki，你应该找一个文件名中包含 fcitx 的 .so 文件
QT_IM_MODULE=ibus # 对于那些捆绑了 Qt 自带 ibus im 模块的，你应该在包中找到 libibusplatforminputcontextplugin.so
QT_QPA_PLATFORM=xcb QT_IM_MODULE=ibus # 强制它在 X11/XWayland 上运行并使用 ibus im 模块
</nowrap>

在 Qt 6.7 中，有一个名为 "QT_IM_MODULES" 的新环境变量，允许你指定输入法模块的回退顺序。你可以将其设置为

 <nowrap>QT_IM_MODULES="wayland;fcitx;ibus"</nowrap>

这样即使对于没有捆绑 fcitx/wayland 的应用程序，它也能选择最可用的一个。请记住，你可能仍然需要设置（或取消设置）QT_IM_MODULE（不是 "QT_IM_MODULES"）来处理 Qt 4/5 应用程序。

### 在 XWayland 下运行的传统 X11 应用程序
简而言之，XWayland 对输入法的支持和普通的 X11 显示服务器一样好。只要你设置同样的环境变量，使用 Xwayland 就不应该有问题。这类应用程序包括：

- 基于 Xlib 的（以及基于 Xlib 的其他工具包，如 tk、SDL1 等），例如 xterm、rxvt。请确保正确设置了 XMODIFIERS。
- 基于 Gtk2 的应用程序，类似于 Xlib，但可以使用 fcitx 输入法模块。将 GTK_IM_MODULE 设置为 fcitx 将获得最佳体验。
- 默认不使用 wayland 的 SDL2 应用程序。将 SDL_IM_MODULE 设置为 fcitx。
- electron、chromium，这些仍然默认使用 X11，类似于 Gtk2 的情况。
- 对于 Qt4 应用程序，Qt 4 只能使用 X11。你需要将 QT_IM_MODULE 设置为 fcitx。同样的情况也适用于使用 XCB 的 Qt5+（可以用 QT_QPA_PLATFORM=xcb 覆盖）。

### Gtk3 / Gtk4
Gtk3 和 Gtk4 原生支持 text-input-v3。与此同时，也可以在 wayland 下使用 fcitx 输入法模块。所以，GTK_IM_MODULE=wayland 或 GTK_IM_MODULE=fcitx 都可以工作。这两者有一些区别。text-input-v3

### Qt5 / Qt6
如果你的 Qt 应用程序原生运行在 Wayland 上，你可以取消设置 QT_IM_MODULE 来让它使用 text-input-v2，或者设置 QT_IM_MODULE=fcitx 来让它使用 fcitx 输入法模块。

text-input-v2 没有上游到 wayland-protocols，这可能就是为什么只有 kwin 支持它。这意味着在非 kwin 环境下，你需要使用 QT_IM_MODULE=fcitx 来让 Qt 应用程序工作。

在 Qt6 上，如果你的 Qt 版本包含这个 https://codereview.qt-project.org/c/qt/qtwayland/+/416862，你也可以使用 QT_IM_MODULE=（空）或 QT_IM_MODULE=wayland。

### 原生 wayland 应用程序 (winit)
最可能使用的是 text-input-v3。

### Chromium / Electron
> **警告**：此部分的信息可能不是最新的，以反映上游的变化，特别是当没有更改选项时的默认行为。

简而言之，如果你使用 XWayland 运行 Chromium 或 Electron 应用程序，只需安装 Gtk 输入法模块，并像在 X11 中一样设置 GTK_IM_MODULE=fcitx。

如果你选择在 Wayland 上原生运行 chromium，你需要使用

 # 如果你的合成器支持 text-input-v1 协议。请查看下面的合成器部分。
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime

 # 如果你的合成器和 chromium 支持 text-input-v3 协议，你也可以使用
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3 
 
 # 但是，由于对 text-input-v3 协议的理解不同，在与 KWin 一起使用时会有一些问题。
 # 如果你使用 kwin，最好使用 text-input-v1。
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=1

或者

 # 你会得到输入法弹出窗口的错误位置，除非你使用 GNOME shell + kimpanel 扩展。
 chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --gtk-version=4 

对于 electron，只有第一个选项可用（electron 不支持用 gtk4 运行内部 chromium），例如 vscode

 # 如果你的合成器支持 text-input-v1 协议。请查看下面的合成器部分。
 code --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime

默认情况下，它应该在 Xwayland 下运行（截至 2023/02/25 在 Archlinux/Chromium 110.0.5481.177 上），但一些用户也报告说即使"首选 Ozone 平台"是"默认"，它也在使用 wayland。所以要检查它是否真的用 wayland 运行，你可以使用 xeyes 或 xwininfo。用 xeyes，如果是 X11 窗口，"眼睛"会随鼠标移动，否则就是 wayland。用 xwininfo，如果鼠标光标变成 "+" 形状，点击窗口显示窗口信息，那就是 X11 窗口。

你可以用 <code>--ozone-platform=wayland</code> 和 <code>--ozone-platform=x11</code> 标志强制它用 Wayland 或 X11 运行。你可以通过在 chrome://flags 中更改"首选 Ozone 平台"选项来永久保存它。它有四个值，"默认"、"X11"、"Wayland"、"自动"。

如果它用 Gtk4 运行（目前只有 chromium/chrome 支持，electron 不支持），也可以让它使用 GTK_IM_MODULE，方法是传递 <code>--gtk-version=4</code>。

也可以通过在上述标志的基础上传递 <code>--enable-wayland-ime</code> 来让它使用 text-input-v1。

Chromium 对 text-input-v1 的支持不是很稳定，你可能会遇到一些随机崩溃。例如在过去，版本 112 有一个崩溃 bug：https://bugs.chromium.org/p/chromium/issues/detail?id=1431532 ，该 bug 在版本 115 中已修复。在 bug 评论中，Chromium 开发者声称这个 text-input-v1 只应该内部使用，支持不太好，所以使用它需要自担风险，尽管它目前是唯一的开箱即用选项。

你应该只使用 <code>--enable-wayland-ime</code> 或 <code>--gtk-version=4</code> 之一，取决于你想使用 text-input-v1 还是 gtk4 输入法模块。text-input-v1 适用于 kwin 5.27 和 weston。Gtk4 输入法模块适用于所有环境，但只有带 Kimpanel 扩展的 GNOME 才能在正确的位置显示弹出窗口。

## Wayland 合成器支持

即使你只使用原生 wayland 应用程序，也建议启用 Xwayland，原因如下。如果输入法模块中的客户端输入面板不工作，fcitx 会回退到 X11 窗口，而不是 wayland 窗口。原因是 wayland 窗口不能自由放置在屏幕上。相反，即使输入法模块只能传递相对于应用程序窗口的坐标给 fcitx，使坐标位置没有太大意义，如果你的应用程序窗口是"最大化"的，作为全局坐标处理可能恰恰是"正确"的。这使得 X11 窗口比随机放置的 wayland 窗口是更好的选择。

### KDE Plasma
最佳设置：
- KDE Plasma 5.27 或更高版本
- 环境变量：
** 为 XWayland 应用程序设置 <code>XMODIFIERS=@im=fcitx</code>
** 通过转到"系统设置" -> "虚拟键盘" -> 选择 Fcitx 5 来启动 fcitx5
** 不要设置 <code>GTK_IM_MODULE</code> & <code>QT_IM_MODULE</code> & <code>SDL_IM_MODULE</code>。你可以通过运行 <code>im-config</code> 然后选择 <code>不要从 im-config 设置任何输入法，使用桌面默认</code> 来取消设置 <code>GTK_IM_MODULE</code> & <code>QT_IM_MODULE</code>
** 用 <code>--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime</code> 运行 chromium/electron 应用程序
- 注意事项：
** 某些仅在 X11 下工作的 Gtk/Qt 应用程序可能仍然需要分别为它们设置 <code>GTK_IM_MODULE</code> 或 <code>QT_IM_MODULE</code>
** 如果你全局设置 <code>GTK_IM_MODULE/QT_IM_MODULE</code>，你将遇到这个问题 [在 wayland 下使用 Fcitx 5 时候选窗口闪烁](FAQ#在-wayland-下使用-fcitx-5-时选词窗口闪烁)

支持信息：
- App/合成器支持 text-input-v2 和 text-input-v3。
- 合成器/应用程序使用 zwp_input_method_v1。
- 5.27 额外地支持 text-input-v1。
- 5.24 可以使用 zwp_input_method_v1 和 fcitx5。5.24 之前有很多问题，始终使用 fcitx 输入法模块。
- 使用"虚拟键盘"KCM 启动 fcitx5。这是使用 text-input 协议所必需的。如果你用这种方式启动 fcitx，请确保不要使用托盘菜单中的"重启"，因为从 KWin 传递的 socket 无法与新重启的 fcitx 复用。

### GNOME
最佳设置：
- 环境变量：
** 为 XWayland 应用程序设置 <code>XMODIFIERS=@im=fcitx</code>
** 为 Qt 设置 <code>QT_IM_MODULE=fcitx</code>，因为 Qt5 默认使用 XWayland
** 用 XWayland 和 <code>GTK_IM_MODULE=fcitx</code> 运行 chrome

支持信息：
- 应用程序/合成器使用 text-input-v3
- 合成器/输入法使用 ibus dbus 协议，所以需要使用 ibus 前端。
- 将 Fcitx 5 添加到自启动，它将在启动时替换任何现有的 ibus-daemon，因此它可以直接工作。
- 弹出候选窗口无法在 gnome-shell UI 上方显示。唯一的解决方案是使用 [Kimpanel](ThemeCustomization)，[扩展链接](https://extensions.gnome.org/extension/261/kimpanel/)。
- Qt 需要使用 QT_IM_MODULE=fcitx，因为没有 text-input-v2 支持。

### Sway
- 应用程序/合成器使用 text-input-v3
- 合成器/应用程序使用 zwp_input_method_v2，但只是部分实现。你需要 [这个 pull request](https://github.com/swaywm/sway/pull/7226) 才能让它为 text-input-v3 客户端显示弹出候选窗口。
- fcitx 输入法模块也可以工作。
- Qt 需要使用 QT_IM_MODULE=fcitx，因为没有 text-input-v2 支持。

### Weston
- 应用程序/合成器使用 text-input-v1
- 合成器/应用程序使用 zwp_input_method_v1。
- 由于没有更常用的 text-input-v3，输入法模块是 Gtk/Qt 的唯一解决方案，需要设置 GTK_IM_MODULE=fcitx 和 QT_IM_MODULE=fcitx。
- 将以下内容添加到 ~/.config/weston.ini 以使其启动 fcitx 5。（即使在 wayland 下，xwayland 部分也是推荐启用以使 fcitx 最佳工作）

```ini
[core]
xwayland=true

[input-method]
path=/usr/bin/fcitx5
```

### 其他合成器
请查看他们的上游以获取更多信息。对于基于 wlroots 的合成器，它们可能也以与 Sway 相同的方式支持，或者 zwp_input_method 也可能不支持。

## 已知问题
### Fcitx 管理的 XKB 布局
与 X11 不同，没有通用的方法将 XKB 布局设置到合成器，这意味着只能为每个桌面单独实现。目前，Fcitx 管理的布局仅适用于 KDE Plasma 和 GNOME。

对于其他桌面，为了使这个"半"工作，你需要确保以下事项：

- 输入法组的 XKB 布局应该与为合成器配置的实际 xkb 布局相同。Fcitx 会"认为"布局相同并绕过键转换逻辑。
- 如果你需要其他布局来输入文本（例如阿拉伯语），只需将它们添加到 Fcitx。只要键被转发到 fcitx，它就应该工作。

### 弹出候选窗口
Wayland 没有针对常规客户端的全局坐标系统，因此对于原生 wayland 客户端，Fcitx 不可能将 wayland surface 放置在某个位置。为了使弹出窗口放在正确的位置，有以下几种情况：
- Xwayland 没有问题，它应该像 X11 一样工作。
- 如果可以使用 zwp_input_method 协议，它有一个 surface 角色允许合成器为输入法放置弹出窗口。这只有在客户端使用 text-input 协议时才能工作。
- 对于 GNOME，kimpanel 扩展可以读取窗口坐标，因为它在合成器内运行。只要输入法模块能报告相对坐标，kimpanel 扩展就可以在正确的位置显示弹出窗口。Plasma kimpanel 的类似方法计划中，但尚未实现。
- 对于 Gtk/Qt，fcitx 的输入法模块实现了一种在客户端进程中渲染弹出的方法。这有一些限制，因为 Gtk3/Qt5 中 xdg_popup 的实现不支持重新定位窗口。所以使用显示/隐藏技巧来缓解这个问题，但这可能导致窗口闪烁。如果可能的话，Fcitx 尝试不移动窗口。如果你使用 KWin，你也可以禁用弹出动画来帮助减少闪烁。

### 每个窗口的输入法状态
当使用 zwp_input_method 时，从本质上只有一个输入上下文对 fcitx 可见，fcitx 无法区分正在使用哪个应用程序。这意味着输入法的"激活"/"停用"状态现在是"全局"的。

现在 fcitx 支持两种协议来获取焦点窗口和相应的应用程序名称，包括 wlr-foreign-toplevel-management（由基于 wlroots 的合成器使用）和 plasma-window-management（由 kwin 使用）。
