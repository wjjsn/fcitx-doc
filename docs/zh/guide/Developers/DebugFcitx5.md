---
title: 调试 fcitx5
description: 介绍调试Fcitx5的各种方法，包括打印日志、使用GDB调试器和测试插件
---

# 调试 fcitx5

## 打印日志

这是调试常用方法，你可以附加到上面。<code>FCITX_INFO()</code> 是一个方便的宏，用于打印信息。它是 std::ostream 的轻量级包装器。它不仅支持 <code>std::ostream</code> 支持的所有类型，还支持常见的标准 C++ 容器和 Fcitx 自己的类型，如 <code>fcitx::RawConfig</code>、<code>fcitx::Color</code>、<code>fcitx::Key</code> 等。

Fcitx 中的日志还提供了日志类别，因此你可以在想要调试时明确只启用某些日志。

## GDB 或其他调试器

调试 Fcitx 与调试其他 C/C++ 程序没有什么不同。唯一使它特别的是 Fcitx 是一个输入法，你需要键盘输入才能进行像 gdb 这样的运行时调试。

因此，要么你在一个禁用了输入法的应用程序中运行 gdb，要么你想禁用与你的终端通信的某些插件。

### 启动一个禁用输入法的终端

1. 启动一个将 XMODIFIERS 设置为随机值的终端，<code>XMODIFIERS=@im=none xterm</code>（或其他使用 XIM 的终端）
2. 在 xterm 中，用正确的 XMODIFIERS 启动 Fcitx。Fcitx 会从环境变量中读取 XMODIFIERS 来设置自己的值，但目前 xterm 有 <code>XMODIFIERS=@im=none</code>，所以你需要再次覆盖它，使其与 xterm 的 XMODIFIERS 值不匹配。这将使 xterm 无法连接到 Fcitx XIM 服务器。

### 禁用某些前端来启动 Fcitx

如果你的环境设置正确，并且你使用的是基于 Gtk/Qt 的终端，如 konsole/gnome-terminal，你也可以禁用 dbusfrontend 来启动 Fcitx，这样它就不会与 Gtk/Qt 输入法模块通信。<code>gdb --args fcitx5 --disable=dbusfrontend -r</code>

你仍然可以使用 XIM 应用程序来测试，例如 xterm。

### 在嵌套 X 服务器中启动 Fcitx

当你想要调试需要输入一串密钥的问题时，这个特殊的过程很有用。这是因为当你切换到不同的窗口时，输入法会收到焦点丢失事件，这通常会重置输入法的状态。在这种情况下，它可能会阻止你重现需要一系列交互的问题。

使用嵌套 X 服务器，如 Xephyr，将阻止生成焦点丢失事件。

 <nowrap>Xephyr :1 &
DISPLAY=:1 openbox & # 启动一个窗口管理器
DISPLAY=:1 xterm & # 启动一个 XIM 应用程序
DISPLAY=:1 gdb --args fcitx --disable dbusfrontend -r # 禁用 dbus 前端启动 Fcitx</nowrap>

## 使用 fcitx 测试插件来重现问题或编写新的测试用例

默认情况下，Fcitx 附带了一些旨在生成合成用户交互的测试插件。[fcitx::setupTestingEnvironment](https://codedocs.xyz/fcitx/fcitx5/group__FcitxUtils.html#ga81328a61b82a27934eea82d9f494a53d) 提供了一种简单的方法来设置运行仅用于测试的 fcitx 实例所需的环境变量。

通常，你需要创建一个 [事件分发器](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1EventDispatcher.html) 在 Fcitx 初始化后执行一些代码。你可以参考 [testunicode](https://github.com/fcitx/fcitx5/blob/master/test/testunicode.cpp)。

你也可能只想明确启用所需的插件来限制测试范围。
