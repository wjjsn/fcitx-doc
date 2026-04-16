---
title: Basic Concepts
description: Understanding Fcitx5 architecture including addons, input contexts, event handling, and key event lifecycle.
---

# Basic Concepts

## Addons

Fcitx is an input method framework that can be highly extended through addons. There are four different types of addons in Fcitx 5.

### Frontend

Frontend addons are plugins that communicate with applications. Their main task is to create input contexts and register them with the InputContextManager.

### Input Method Engine

Input method engines receive user input from input contexts. They translate user input (usually key events) into text. Each input method engine may provide multiple different input methods.

### User Interface

User interface is a type of plugin that displays user interface and information from other plugins. Fcitx itself comes with two different implementations. In general, you should not implement your own user interface addon unless there is a special need. See also [Custom Themes](../Users/ThemeCustomization) to learn about the two built-in user interface addons.

### Module

This is a type of addon that doesn't belong to any other category.

- Some of them provide sub-input modes, for example, using their Unicode input characters.
- Some of them provide integration with the desktop, such as tray icon notifications based on status notifier.
- Some of them manage low-level connections with the display server, such as xcb/wayland.
- Some of them can even provide integration with other languages, such as luaaddonloader.

## Input Context

An input context represents a client of the Fcitx server. Usually, an input context can be mapped to an application, a window of an application, or a global context of the display server. When an input context has focus, it means this particular client is actively being used by the user, and the window of the input context should also have focus.

Based on different display servers, input contexts may belong to different focus groups. Each focus group is mapped to a display connection, such as X11 or Wayland. Each focus group contains a set of input contexts, and at most one of them will have focus in the group. An input context may also not have a focus group.

## Event Handling

An event has 5 event handling phases, with only 3 phases exposed to users: Default, PreInputMethod, and PostInputMethod. There are also ReservedFirst and ReservedLast used internally by Fcitx. The order of these phases is ReservedFirst, PreInputMethod, Default, PostInputMethod, ReservedLast. The active input method engine receives events at the default phase. PreInputMethod is one of the most commonly used methods for implementing sub-input methods. For example, an addon can define a trigger key. When the user presses the trigger key, it sets a flag and processes all future key events in the PreInputMethod phase until it ends its input mode.

As for event types, there are input context-specific events and global events. Input context-specific events are always associated with an input context.

## Key Event Lifecycle

The following steps may be taken from the actual physical keyboard press to Fcitx receiving the key event.

### Reaching Fcitx Frontend

Depending on the protocol between Fcitx and the application, several different paths can be used.

Fcitx frontend is where Fcitx receives key events from applications and the display server.

#### XIM

After the application receives KeyEvent from the X Server, it needs to forward it to the XIM server using the XIM protocol. Key events only contain modifier state and key code. The actual key symbols come from the X server's keymap.

#### DBus Frontend/IBus Frontend/Fcitx4 Frontend

These frontends are similar, just using different dbus interfaces. When the application receives key events from the toolkit (e.g., Gtk/Qt/SDL), it forwards the key events to Fcitx through some dbus interfaces. The key symbols come from translation within the application, but key code and modifier state are also available.

#### Wayland IM

There are zwp_input_method_v1 and zwp_input_method_v2. In V1, key events come from the application and go through a code path similar to DBus. In V2, the Input method needs to create keyboard grab events, and the compositor will forward all keys to the input method. Key symbol translation with key code is done on the Fcitx side, using the keymap from the compositor.

### From Frontend to Fcitx Event Pipeline and Input Method Engine

Inside Fcitx, Key events will be wrapped as [KeyEvent objects](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1KeyEvent.html) and processed by Fcitx's event pipeline. Before being sent to the pipeline, if the layout to be used is different from the system layout, Fcitx will apply its own XKB translation and store the translated key object in the rawKey field. The key() field will be updated accordingly to the normalized rawKey form.

Then it goes through multiple stages and may be filtered in the middle of the pipeline to block all processes that haven't occurred yet.
