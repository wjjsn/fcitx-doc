---
title: Fcitx 历史
description: Fcitx 的发展历史，从 gWubi 项目衍生至今的完整版本发布记录。
---

Fcitx 是从Yuking创建的一个叫做gWubi的项目发展衍生而来的。Yuking本身是一个五笔输入法用户，所以最开始的fcitx仅仅只支持五笔输入法。

最开始，gWubi没有使用SCM进行源代码控制，所以早期的代码历史仅仅只能在旧的tarball压缩包中找到。ZhouShuqun仍然在维护一个所有fcitx的源代码tarball压缩包镜像，可以从[这里](https://mirrors.redv.com/pub/fcitx/)进行下载。

Zhoushuqun在Google Code的subversion上添加了初始fcitx 代码提交记录，这几乎是唯一的tarball来源。当Yuking重新开始Fcitx开发的时候，他也开始使用Google Code，因此[这个Google Code仓库](https://code.google.com/p/fcitx) 变成了真正的官方站点。

Fcitx的源码控制从最开始的Subversion，换到Mercurial，最后换到Git。自从Google Code不再是最好的Git托管站点，为了未来的Fcitx开发 [CSSlayer](https://github.com/csslayer) 决定使用[github.com](https://github.com/fcitx/)。

## Fcitx之名的故事

Fcitx 的旧全名是"Free Chinese Input Tool of X"的首字母缩写。这个概念并不适合Fcitx未来的发展，也可能会带来误解，因为中文不是Fcitx的唯一目标，所以[CSSlayer](https://github.com/csslayer) 在 fcitx-dev Google groups 上开一个[?fromgroups&hl=zh-CN#!topic/fcitx/mx04AnI9LZE 重命名讨论](https://groups.google.com/forum/)，保留 Fcitx 作为名称但使用不同的全名。

同时也有人抱怨Fcitx不能发音，所以决定用[ˈfaɪtɪks]作为官方发音，但"小企鹅输入法"还是官方中文名，虽然中文名在含义上与全名没有任何关系，仅仅是因为自企鹅标志。

所以 Fcitx 不会有一个单一的官方全称，但你可以取下面的任何名字，以反映 Fcitx 的方方面面。

- Flexible Context-aware Input Tool with eXtension的缩写
- FanCy Input Tool for *niX的缩写
- Forthcoming CJK Input Toy Xtreme的缩写
- Free Character Input Toy of *niX的缩写
- Fcitx Can Input Text in *niX的缩写

## 风波
Fcitx 的代码质量和编码风格受到了一些批评，这是 Yuking 停止 Fcitx 开发的前奏。Yuking从2008.10.8开始重新开始开发。

更多相关的详细信息，您可以查看本页末尾的链接。

## 发行历史
大多数日期来自源代码tarball压缩包，因此可能不是十分准确。

| Name | Version | Date |
|------|---------|------|
| gWubi | 0.1 | 2002.2.26 |
| gWubi | 0.2 | 2002.4.4 |
| gWubi | 0.3 | 2002.4.27 |
| gWubi | 1.0 | 2002.8.28 including Pinyin and QuWei support. |
| gWubi | 1.6 | 2002.11.19 |
| fcitx | 1.7 | 2003.1.16 |
| fcitx | 1.8.2 | 2003.3.14 |
| fcitx | 1.8.3 | 2003.4.11 |
| fcitx | 1.8.4 | 2003.4.17 |
| fcitx | 1.8.5 | 2003.5.19 |
| fcitx | 2.0.0pr1 | 2003.10.10 |
| fcitx | 2.0.0pr2 | 2003.11.14 |
| fcitx | 2.0.0pr3 | 2003.11.19 |
| fcitx | 2.0.0pr4 | 2003.12.16 |
| fcitx | 2.0.0pr5 | 2003.12.22 |
| fcitx | 2.0.0pr6 | 2003.12.23 |
| fcitx | 2.0.0pr7 | 2003.12.24 |
| fcitx | 2.0.0pr7.1 | 2003.12.26 |
| fcitx | 2.0.0pr8 | 2003.12.30 |
| fcitx | 2.0 | 2004.1.7 |
| fcitx | 2.0.1 | 2004.1.9 |
| fcitx | 2.0.2 | 2004.5.5 |
| fcitx | 2.1.0rc | 2004.5.21 |
| fcitx | 3.0.0 test1 | 2004.6.4 |
| fcitx | 3.0.0 test2 | 2004.6.18 |
| fcitx | 3.0.0 test3 | 2004.6.29 |
| fcitx | 3.0.0 test4 | 2004.7.1 |
| fcitx | 3.0.0 rc | 2004.7.8 |
| fcitx | 3.0.0 rc2 | 2004.7.15 |
| fcitx | 3.0.0 | 2004.9.6 |
| fcitx | 3.0.1 | 2004.9.19 |
| fcitx | 3.0.2 | 2004.10.20 |
| fcitx | 3.0.3 | 2004.12.10 |
| fcitx | 3.0.4 | 2005.1.27 |
| fcitx | 3.1 | 2005.2.26 |
| fcitx | 3.1.1 | 2005.3.24 |
| fcitx | 3.2 | 2006.6.7 |
| fcitx | 3.2.1 | 2006.6.23 |
| fcitx | 3.3 | 2006.8.18 |
| fcitx | 3.3.1 | 2006.8.31 |
| fcitx | 3.4 | 2006.9.21 |
| fcitx | 3.4.1 | 2006.11.2 |
| fcitx | 3.4.2 | 2006.12.2 |
| fcitx | 3.5 BlackFri | 2007.7.13 |
| fcitx | 3.6rc | 2009.1.6 |
| fcitx | 3.6 | 2009.7.5 |
| fcitx | 3.6.1 | 2009.9.14 |
| fcitx | 3.6.2 | 2009.10.8 |
| fcitx | 3.6.3 | 2010.2.12 |
| fcitx | 4.0rc1 | 2010.11.9 |
| fcitx | 3.6.4 | 2010.11.18 |
| fcitx | 4.0.0 | 2010.11.18 |
| fcitx | 4.0.1 | 2010.12.17 |
| fcitx | 4.1.0 | 2011.9.3 |
| fcitx | 4.1.1 | 2011.9.9 |
| fcitx | 4.1.2 | 2011.10.2 |
| fcitx | 4.2.0 | 2012.2.3 |
| fcitx | 4.2.1 | 2012.3.9 |
| fcitx | 4.2.2 | 2012.4.7 |
| fcitx | 4.2.3 | 2012.5.6 |
| fcitx | 4.2.4 | 2012.6.3 |
| fcitx | 4.2.5 | 2012.7.18 |
| fcitx | 4.2.6 | 2012.9.12 |
| fcitx | 4.2.7 | 2013.1.26 |
| fcitx | 4.2.8 | 2013.7.1 |
| fcitx | 4.2.9 | 2015.5.26 |

## 更多参考
以下链接来自网络存档。

[gWubi 0.1](https://web.archive.org/web/20040831184550/http://www.linuxforum.net:80/forum/showflat.php?Cat=&Board=chinese&Number=231441&page=12&view=collapsed&sb=1&o=&fpart=)

[Yuking's reaction](https://web.archive.org/web/20071127164414/http://www.fcitx.org/main/?q=node/123)

[explain for the distrubance](https://web.archive.org/web/20140914113003/http://www.sanfanling.cn/read.php?164)

[Fcitx restart development](https://web.archive.org/web/20110104224011/http://www.fcitx.org/main/?q=node/137)