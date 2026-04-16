---
title: Tips and Tricks
description: Fcitx 5使用技巧，包括快速短语、Unicode输入、Compose键和Emoji输入等。
---

# Tips and Tricks

## Input Special Characters

### Quick Phrase

Quick Phrase is a built-in plugin that allows you to input some content to search and match text that usually requires more operations to input.

It can be triggered globally with the default hotkey <code>Meta + `</code>.

It has some built-in tables that you can browse on [Github](https://github.com/fcitx/fcitx5/tree/master/src/modules/quickphrase/quickphrase.d), or browse locally using the Quick Phrase editor GUI (launched in the configuration tool's Quick Phrase settings).

Built-in tables include:
1. LaTeX, allows you to input math or other symbols using LaTeX syntax. For example, "\alpha" will produce "α".
2. Emoji ASCII art, allows you to input Unicode emoji characters starting with ":", which is common in instant messaging software. For example, ":smile:" will produce 😄.
3. Emoji, contains a series of "kaomoji" style phrases, for example "smile" corresponds to "(・∀・)".

Quick Phrase can also be extended with Lua or C++.

### Input Using Unicode

Fcitx 5 also provides a Unicode plugin that allows you to input Unicode with hexadecimal numbers or search by description.

<code>Ctrl + Shift + U</code> can give you an experience similar to Gtk's built-in Unicode feature. You just need to input hexadecimal numbers and then press space. For example, input 
<code>Ctrl + Shift + U, 2, 6, 3, a, space</code> will give you the Unicode character ☺.

Or using <code>Ctrl + Shift + Alt + U</code>, you will be able to search by description. If you just press <code>Ctrl + Shift + Alt + U</code>, it will show the Unicode of the string in your clipboard and the currently selected content.

If you want to search by description, just input the description, for example, you can search for eggplant to find the Unicode character 🍆.

### Input Using Compose Key

This is a traditional X11 feature, but it also works anywhere Fcitx supports. You can find some file syntax descriptions in the [xkbcommon documentation](https://xkbcommon.org/doc/current/group__compose.html).

It allows you to convert a string of key presses to any string. But note that this feature is global and cannot be easily disabled.

### Using Long Press in Keyboard Engine

When the long press option is enabled in the keyboard engine, you can get a list of candidate texts mapped to the key you pressed. This mapping is completely customizable and allows you to disable it in certain applications.

### Input Emoji

If you use the layout engine (input method name is "Keyboard - layout name"), you can search Unicode CLDR annotations using Quick Phrase. For example, using "Keyboard - English (US)" allows you to search for apple to get 🍎 and 🍏. The languages available for search are associated with the layout language.

You can also use other methods, such as the Quick Phrase built-in table method, or the Unicode plugin described above, or compose key.
