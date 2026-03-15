# Developer FAQ

This is a page answering some questions.
Some questions are frequently asked, others are some common pitfalls worth answering/mentioning.

## I don't like Fcitx's default UI and want to have my own UI for my engine.

This is a question often asked by third-party proprietary input method engine developers. From the perspective of Fcitx developers, the answer is **no**, don't do this. The reason behind this answer is due to the complexity of Linux display servers.

- X11, you can freely move windows.
- Wayland + Fcitx input method module, windows may be rendered by the client, you basically have no control. We can't make the Fcitx input method module have another addon system, which would bring too much complexity and could bring too much memory overhead to applications.
- Wayland + text-input + zwp-input-method, popup surfaces need to use special wayland protocols that random processes may not have access to. Only the input method server may have permission to show such input windows.

In summary, due to Wayland's limitations, if you choose to implement your own version, you may not be able to properly display the input window.

If you still want to do this, what you should realize is that you probably don't want to implement a new Kimpanel or new user interface addon. For Kimpanel, it is designed for desktop integration, and there can only be one Kimpanel service. If you want to implement Kimpanel, the desktop itself may already have a Kimpanel service running. There is no such mechanism to replace another Kimpanel and return the Kimpanel dbus name to the original one. When implementing a new Kimpanel or new user interface, it must be generic and support all other existing input methods. If you think this is not what you want, you better implement UI only for yourself. This means you should avoid using all built-in UI mechanisms in Fcitx, except for client preedit. Simply leave InputContext::inputPanel() in Fcitx empty and don't set anything. For your proprietary UI process, you may need to use inter-process communication mechanisms like DBus to send information. You can reuse dbus interfaces like Kimpanel, but make sure to only use your own DBus name, don't try to replace existing Kimpanel dbus service.

## Some options look like they can be reused from global configuration, should I use it?

For input method engines, some global configuration options like page up key and page down key may be used, but you may also want to use the one from your own configuration. It is not good that there is no such default value for each input method engine. This default option is intended for addons that don't want to provide their own page up and page down keys.

For example, many Pinyin users usually use the minus and equal keys for paging, but if you don't use US keyboard layout, such keys may not be a good choice. In global configuration, we only assign very generic keys that may apply to each keyboard layout, such as arrow keys.

## How do I test input methods?

Fcitx provides a small test framework that allows you to simulate key events. Please refer to <code>fcitx-utils/testing.h</code> for more details. Also see [testquickphrase.cpp](https://github.com/fcitx/fcitx5/blob/master/test/testquickphrase.cpp) as a good example of how to simulate key events and send them to a fake input context.

## Should I use the surrounding text feature?

There are many applications that will never use it. For example, xim-based clients don't work (xterm, wine, etc.), SDL applications. Terminal is also a good example if you think about it.

If they don't use system-built-in widgets in some applications, it may also have bugs, especially browsers. Also, if web page content is messy in displaying text (like Google Docs), it may also not work, and it's bad because we can't check the application version, even if we successfully fixed them in some cases. Some hacks can be done by checking application names, but application names may not be available in some cases, depending on what protocol is used. Also, embedded terminal windows (like konsolepart) are cases where application name detection workarounds fail.

It can be a good supplementary source of information, but I'd rather not rely on it for everything. For example,
- Japanese usually only uses it for "reconversion" (selecting a range of hiragana characters and restarting composition with selected text)
- Korean also only uses it for temporary Hanja mode, but it also provides an always-on Hanja mode that doesn't use surrounding text (similar to macro mode in unikey)
- In Chinese, Fcitx only uses it to detect context in some cases, not to modify surrounding text.

In summary, using information from surrounding text is more reliable than modifying surrounding text, and it would be better to have a simple way to fix it when it doesn't work (in the sense that users might find another way to input text).

## Should I use client preedit text? Can I use all supported text formats?

Please refer to [Preedit](DevelopSimpleInputMethod#preedit).

## Can I use multi-line text in user interface?

Yes and no. You can use multi-line text in candidates, but don't use them in preedit and auxiliary strings.

Here is an example from Mozc (multi-line candidates):
