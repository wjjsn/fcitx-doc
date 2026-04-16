---
title: Debug Fcitx5
description: A guide to debugging Fcitx5, covering log printing, GDB usage, test addons, and various debugging techniques.
---

# Debug fcitx5

## Printing Logs

This is a common method for debugging, you can attach to above. <code>FCITX_INFO()</code> is a convenient macro for printing information. It is a lightweight wrapper around std::ostream. It not only supports all types supported by <code>std::ostream</code>, but also supports common standard C++ containers and Fcitx's own types like <code>fcitx::RawConfig</code>, <code>fcitx::Color</code>, <code>fcitx::Key</code>, etc.

Logs in Fcitx also provide log categories, so you can explicitly enable only certain logs when you want to debug.

## GDB or Other Debuggers

Debugging Fcitx is no different from debugging other C/C++ programs. The only thing that makes it special is that Fcitx is an input method, and you need keyboard input for runtime debugging like gdb.

So either you run gdb in an application that has input methods disabled, or you want to disable some plugins that communicate with your terminal.

### Start a Terminal with Input Method Disabled

1. Start a terminal with XMODIFIERS set to a random value, <code>XMODIFIERS=@im=none xterm</code> (or other terminal that uses XIM)
2. In xterm, start Fcitx with the correct XMODIFIERS. Fcitx reads XMODIFIERS from environment variables to set its own value, but currently xterm has <code>XMODIFIERS=@im=none</code>, so you need to override it again so that it doesn't match xterm's XMODIFIERS value. This will make xterm unable to connect to the Fcitx XIM server.

### Disable Some Frontends to Start Fcitx

If your environment is set up correctly and you are using a Gtk/Qt-based terminal like konsole/gnome-terminal, you can also disable dbusfrontend to start Fcitx so it doesn't communicate with Gtk/Qt input method modules. <code>gdb --args fcitx5 --disable=dbusfrontend -r</code>

You can still use XIM applications to test, for example xterm.

### Start Fcitx in a Nested X Server

This special procedure is useful when you want to debug problems that require typing a string of keys. This is because when you switch to a different window, the input method receives a focus lost event, which usually resets the input method's state. In this case, it may prevent you from reproducing problems that require a series of interactions.

Using a nested X server like Xephyr will prevent generating focus lost events.

 <nowrap>
Xephyr :1 &
DISPLAY=:1 openbox & # Start a window manager
DISPLAY=:1 xterm & # Start an XIM application
DISPLAY=:1 gdb --args fcitx --disable dbusfrontend -r # Disable dbus frontend to start Fcitx</nowrap>

## Using fcitx Test Addon to Reproduce Problems or Write New Test Cases

By default, Fcitx comes with some test addons designed to generate synthetic user interactions. [fcitx::setupTestingEnvironment](https://codedocs.xyz/fcitx/fcitx5/group__FcitxUtils.html#ga81328a61b82a27934eea82d9f494a53d) provides an easy way to set up environment variables needed to run a fcitx instance that is only used for testing.

Usually, you need to create an [EventDispatcher](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1EventDispatcher.html) to execute some code after Fcitx initializes. You can refer to [testunicode](https://github.com/fcitx/fcitx5/blob/master/test/testunicode.cpp).

You may also just want to explicitly enable only the addons needed to limit the scope of testing.
