---
title: 技巧和窍门
description: 介绍Fcitx 5中输入特殊字符、Emoji和Unicode的各种技巧和窍门
---

# 技巧和窍门

## 输入特殊字符

### 快速短语

快速短语是一个内置插件，允许你输入一些内容来搜索并匹配通常需要更多操作才能输入的文本。

它可以通过默认热键 <code>Meta + `</code> 全局触发。

它有一些内置的表格，你可以在 [Github](https://github.com/fcitx/fcitx5/tree/master/src/modules/quickphrase/quickphrase.d) 上浏览，或者使用快速短语编辑器 GUI（在配置工具的快速短语设置中启动）本地浏览。

内置表格包含：
1. LaTeX，允许你用 LaTeX 语法输入数学或其他符号。例如 "\alpha" 会产生 "α"。
2. Emoji ASCII 码，允许你输入以 ":" 开头的 Unicode emoji 字符，这在即时通讯软件中很常见。例如，":smile:" 会产生 😄。
3. Emoji，包含一系列"颜文字"风格的短语，例如 "smile" 对应 "(・∀・)"。

快速短语也可以用 Lua 或 C++ 扩展。

### 用 Unicode 输入

Fcitx 5 还提供了一个 Unicode 插件，允许你用十六进制数字输入 Unicode，或用描述搜索。

<code>Ctrl + Shift + U</code> 可以给你一个类似 Gtk 内置 Unicode 功能的体验，你只需输入十六进制数字然后按空格。例如，输入 
<code>Ctrl + Shift + U, 2, 6, 3, a, space</code> 会给你 Unicode 字符 ☺。

或者使用 <code>Ctrl + Shift + Alt + U</code>，你将能够用描述搜索。如果你只是按 <code>Ctrl + Shift + Alt + U</code>，它会显示你剪贴板中字符串的 Unicode 和当前选中的内容。

如果你想用描述搜索，只需输入描述，例如，你可以搜索 eggplant 来找到 Unicode 字符 🍆。

### 用组合键输入

这是传统的 X11 功能，但也适用于 Fcitx 支持的任何地方。你可以在 [xkbcommon 文档](https://xkbcommon.org/doc/current/group__compose.html) 中找到一些文件语法的描述。

它允许你将一串按键转换为任何字符串。但请注意，这个功能是全局的，你不能轻易禁用它。

### 在键盘引擎中使用长按

当在键盘引擎中启用长按选项时，你可以获得一个候选文本列表，映射到你按下的键。这个映射是完全可定制的，并允许你在某些应用程序中禁用它。

### 输入 Emoji

如果你使用布局引擎（输入法名为"键盘 - 布局名称"），你可以用快速短语搜索 Unicode CLDR 注解。例如，使用"键盘 - 英语(美国)"允许你搜索 apple 得到 🍎 和 🍏。可用于搜索的语言与布局语言关联。

你也可以使用其他方法，如快速短语内置表格方法，或上面描述的 Unicode 插件，或组合键。
