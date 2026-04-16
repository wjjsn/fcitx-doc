---
title: 开发简单输入法
description: 提供开发Fcitx 5输入法的分步说明，以区位码输入法为例介绍插件结构、CMake构建系统和输入法逻辑实现
---

这是编写 Fcitx 5 输入法的分步说明。同样的步骤也可以用于开发其他类型的插件，只是输入法引擎是最复杂的。

# 开发简单输入法

## 了解 Fcitx 共享库插件的文件结构
Fcitx 5 提供了一个用于添加新插件类型的可扩展框架，但共享库支持是内置的，并且是所有其他插件类型的基础。所以我们只会在本文档中介绍共享库插件。

 <nowrap>
[fcitx install prefix]
|
|- share/fcitx5
|  |
|  |- addon/[addon name].conf
|  |- inputmethod/[input method name 1].conf
|  |  ...
|  |- inputmethod/[input method name n].conf
|
|- lib/fcitx5
   |
   |- [library name].so
</nowrap>

以上是输入法插件的文件结构。对于其他类型的插件，不需要 <code>inputmethod/</code> 下的文件。<code>[addon name].conf</code> 的文件名很重要，将用于唯一引用此特定插件。Fcitx 也遵循 XDG 目录标准，所以 XDG_DATA_DIR/fcitx5 下的文件也会被检查。同样，<code>inputmethod/</code>下的配置文件的文件名也很重要，将是某个输入法的唯一名称。

<code>[addon name].conf</code> 示例

 <nowrap>[Addon]
Name[ca]=Pinyin
Name[da]=Pinyin
Name[de]=Pinyin
Name[he]=פיניין:
Name[ko]=병음
Name[ru]=Пиньинь
Name[zh_CN]=拼音
Name=Pinyin
Category=InputMethod
Version=5.0.8
Library=pinyin
Type=SharedLibrary
OnDemand=True
Configurable=True

[Addon/Dependencies]
0=punctuation

[Addon/OptionalDependencies]
0=fullwidth
1=quickphrase
2=cloudpinyin
3=notifications
4=spell
5=pinyinhelper
6=chttrans
7=imeapi
</nowrap>

<code>[输入法名称].conf</code>示例

 <nowrap>[InputMethod]
Name[ca]=Pinyin
Name[da]=Pinyin
Name[de]=Pinyin
Name[he]=פיניין:
Name[ko]=병음
Name[ru]=Пиньинь
Name[zh_CN]=拼音
Name=Pinyin
Icon=fcitx-pinyin
Label=拼
LangCode=zh_CN
Addon=pinyin
Configurable=True
</nowrap>

该文件采用类似 ini 的格式，具有某些 fcitx 特定的扩展名和规则。它还支持 XDG 桌面文件样式 i18n 进行翻译。

# 使用 CMake 构建系统
理论上只要能生成正确的文件，就可以自由选择要使用的构建系统。但是Fcitx 5 对 CMake 提供了大量支持，因此使用 CMake 将是构建 Fcitx 项目的最便捷方式。在本文档中，我们将仅介绍使用 CMake 作为构建系统。

# 快速入门：区位码
[区位码](https://zh.wikipedia.org/wiki/区位码) 输入法是一种输入法，允许您简单的输入GB2312的数字并产生与该代码匹配的汉字。它曾经被 Fcitx 4 支持，但不再被 Fcitx 5 包含。虽然它很难使用，但它可以作为一个很好的例子来说明如何为 Fcitx 5 实现一个简单的输入法。

## 项目框架
因此，让我们从这个项目的框架开始。

 <nowrap>├── CMakeLists.txt
├── LICENSES
│   └── BSD-3-Clause.txt        # License for this project
├── po                          # Optional I18n
│   ├── CMakeLists.txt
│   ├── fcitx5-quwei.pot
│   ├── LINGUAS
│   └── zh_CN.po
└── src
    ├── CMakeLists.txt
    ├── quwei-addon.conf.in.in  # Addon registration file
    ├── quwei.conf.in           # Input method registration file
    ├── quwei.cpp               # Engine implementation
    └── quwei.h                 # Engine implementation
</nowrap>

您也许需要查看一些 CMake 教程以了解一些基本的 CMake 用法。

CMakeLists.txt 在根目录查找依赖项。

 <nowrap>
cmake_minimum_required(VERSION 3.21)
project(fcitx5-quwei)

find_package(Fcitx5Core REQUIRED)
# Setup some compiler option that is generally useful and compatible with Fcitx 5 (C++17)
include("${FCITX_INSTALL_CMAKECONFIG_DIR}/Fcitx5Utils/Fcitx5CompilerSettings.cmake")

add_subdirectory(src)</nowrap>

src/CMakeLists.txt 示例如下：

 <nowrap># Make sure it produce quwei.so instead of libquwei.so
add_library(quwei SHARED quwei.cpp)
target_link_libraries(quwei PRIVATE Fcitx5::Core)
set_target_properties(quwei PROPERTIES PREFIX "")
install(TARGETS quwei DESTINATION "${FCITX_INSTALL_LIBDIR}/fcitx5")

# Addon config file
# We need additional layer of conversion because we want PROJECT_VERSION in it.
configure_file(quwei-addon.conf.in quwei-addon.conf)
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/quwei-addon.conf" RENAME quwei.conf DESTINATION "${FCITX_INSTALL_PKGDATADIR}/addon")

# Input Method registration file
install(FILES "quwei.conf" DESTINATION "${FCITX_INSTALL_PKGDATADIR}/inputmethod")</nowrap>

quwei.conf.in 示例：

 <nowrap>[InputMethod]
# Translatable name of the input method
Name=Quwei
# Icon name
Icon=fcitx-quwei
# A short label that present the name of input method
Label=区
# ISO 639 language code
LangCode=zh_CN
# Match addon name
Addon=quwei
# Whether this input method support customization
# Configurable=True</nowrap>

此文件将作为 [InputMethodEntry](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputMethodEntry.html) 对象进行加载。

quwei-addon.conf.in 示例： 
 
 <nowrap>[Addon]
Name=Quwei
Category=InputMethod
Version=@PROJECT_VERSION@
Library=quwei
Type=SharedLibrary
OnDemand=True
Configurable=True

[Addon/Dependencies]
0=punctuation

[Addon/OptionalDependencies]
0=fullwidth
1=quickphrase
2=chttrans</nowrap>
 

此文件将作为 [AddonInfo](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonInfo.html) 对象加载。

## InputMethodEngine 的基本实现
您可以参考github中[第一笔提交](https://github.com/fcitx/fcitx5-quwei/commit/02c32b07e47e0e75db4f248dbb33c31137d8df74)的代码。

版本 1 的 quwei.h
 <nowrap>/*
 * SPDX-FileCopyrightText: 2021~2021 CSSlayer <wengxt@gmail.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 */
#ifndef _FCITX5_QUWEI_QUWEI_H_
#define _FCITX5_QUWEI_QUWEI_H_

#include <fcitx/inputmethodengine.h>
#include <fcitx/addonfactory.h>

class QuweiEngine : public fcitx::InputMethodEngineV2 {
    void keyEvent(const fcitx::InputMethodEntry & entry, fcitx::KeyEvent & keyEvent) override;
};

class QuweiEngineFactory : public fcitx::AddonFactory {
    fcitx::AddonInstance * create(fcitx::AddonManager * manager) override {
        FCITX_UNUSED(manager);
        return new QuweiEngine;
    }
};

#endif // _FCITX5_QUWEI_QUWEI_H_</nowrap>

版本 1 的 quwei.cpp

 <nowrap>/*
 * SPDX-FileCopyrightText: 2021~2021 CSSlayer <wengxt@gmail.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 */
#include "quwei.h"

void QuweiEngine::keyEvent(const fcitx::InputMethodEntry& entry, fcitx::KeyEvent& keyEvent)
{
    FCITX_UNUSED(entry);
    FCITX_INFO() << keyEvent.key() << " isRelease=" << keyEvent.isRelease();
}

FCITX_ADDON_FACTORY(QuweiEngineFactory);</nowrap>

当实现 Fcitx 插件时，它应该是 [AddonInstance](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonInstance.html) 的子类。AddonInstance 的实例化是通过 [AddonFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonFactory.html) ​​完成的。  [InputMethodEngineV2](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputMethodEngineV2.html) 是 AddonInstance 的子类。实现输入法插件时需要使用该类。

一个输入法引擎的最小植入只需要包含keyEvent函数的实现。

在这里，我们使用类似于宏 <code>FCITX_INFO()</code> 的 iostream 将我们按下的每个键写入日志。

这里假设您的 fcitx 安装前缀是 /usr。构建这个项目的命令是：

 <nowrap>
mkdir -p build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug # use Debug for easy debugging with gdb
make # or ninja, depending on your system
sudo make install # or sudo ninja install</nowrap>

如果一切正常，安装命令应该打印出如下内容：

 <nowrap>-- Install configuration: "Debug"
-- Installing: /usr/lib/fcitx5/quwei.so
-- Installing: /usr/share/fcitx5/addon/quwei.conf
-- Installing: /usr/share/fcitx5/inputmethod/quwei.conf</nowrap>

现在您可以使用 <code>fcitx5 -rd</code> 重新启动 fcitx5，并使用 [配置工具（Fcitx 5）](../Users/ConfigureFcitx5) 将 Quwei 添加到您的配置中。

切换到区位码输入法后，应用程序中的按键将使 Fcitx 5 打印出如下内容：

 <nowrap>I2021-11-16 12:29:32.352702 quwei.cpp:12] Key(f states=0) isRelease=1
I2021-11-16 12:29:32.389935 quwei.cpp:12] Key(s states=0) isRelease=0
I2021-11-16 12:29:32.413689 quwei.cpp:12] Key(d states=0) isRelease=0
I2021-11-16 12:29:32.497661 quwei.cpp:12] Key(s states=0) isRelease=1
I2021-11-16 12:29:32.498021 quwei.cpp:12] Key(f states=0) isRelease=0
I2021-11-16 12:29:32.523816 quwei.cpp:12] Key(a states=0) isRelease=1
I2021-11-16 12:29:32.524051 quwei.cpp:12] Key(d states=0) isRelease=1
I2021-11-16 12:29:32.704919 quwei.cpp:12] Key(f states=0) isRelease=1
I2021-11-16 12:29:32.705006 quwei.cpp:12] Key(d states=0) isRelease=0
I2021-11-16 12:29:32.833024 quwei.cpp:12] Key(d states=0) isRelease=1
I2021-11-16 12:29:34.633936 quwei.cpp:12] Key(Control_L states=0) isRelease=0
I2021-11-16 12:29:35.053817 quwei.cpp:12] Key(Control+C states=4) isRelease=0
I2021-11-16 12:29:35.165617 quwei.cpp:12] Key(Control+C states=4) isRelease=1
I2021-11-16 12:29:35.348654 quwei.cpp:12] Key(Control+Control_L states=4) isRelease=1</nowrap>

从这里可以知道您的输入法引擎现在可以正常工作了。

# 实现输入法逻辑
区位码的基本逻辑是键入 4 位数的区位代码。区位码可以看成区码 xx 和位码 yy。区位码到GB2312的映射是(0xA0 + 区码, 0xA0 + 位码)。当用户键入 3 个数字的区位码时，输入法将显示一个包含 10 个可能带有给定区码为前缀的字符的候选列表。

可以参考 github 中 [第二笔提交](https://github.com/fcitx/fcitx5-quwei/commit/b9b047abb46fa0f9c42a0be82941b65b35b277eb) 的代码。

## 存储不同输入上下文的状态
Fcitx 允许不同的输入上下文保持不同的状态。状态通常是指部分类型化的文本和所有其他关联的数据结构。在这个区位码的例子里面，状态是用户已经输入的数字。为了表示这一点，Fcitx 提供了一个方便的类 [InputBuffer](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputBuffer.html) 让输入法引擎可以便捷地使用这个类来编辑内部状态。为了在构造输入上下文时自动构造状态，Fcitx 提供了一个名为 InputContextProperty 的框架。为了使用它，您首先需要通过 registerProperty 向 [InputContextManager](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputContextManager.html) 注册一个工厂类。每个属性都需要有一个全局唯一的名称。  名称可以是人类可以理解的东西。在这个区位码的例子里面，我使用的是"quweiState"。使用更好的名称的好处是，以防万一您正在开发一些交叉插件（另一个插件需要访问该插件的某些内部状态），您可以使用这个通用名称将其加载到不同的插件中。如果您不需要从外部访问，那么名称并不重要。

工厂类带有一个方便的 C++ 模板，[FactoryFor](https://codedocs.xyz/fcitx/fcitx5/group__FcitxCore.html#ga9e60042d1f671a6fa31ea04bb4961ec9)。这实际上是 [LambdaInputContextPropertyFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1LambdaInputContextPropertyFactory.html) ​​的类型别名。该类仅接受 lambda 函数作为工厂实现。这可以节省您创建自己的 [InputContextPropertyFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputContextPropertyFactory.html) ​​子类的时间。

为了从输入上下文中获取状态对象，您可以像这样简单地使用工厂对象：

 <nowrap>
auto *state = ic->propertyFor(&factory_);
</nowrap>

在某些情况下，也可以注销工厂并重新注册以"刷新"所有内部状态。

## 候选词列表
在 Fcitx 5 中，候选列表是 InputPanel 类的一部分，存储为 shared_ptr 以避免选择候选触发用户界面更新时的生命周期问题。候选列表通过某些接口提供了不同的功能。辅助类 [CommonCandidateList](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1CommonCandidateList.html) 将为候选列表提供最常用的功能。它实现了 BulkCandidateList 接口，这就是为什么它不适合去中心化的情况。因为我们要有一个曲尾的半无限候选列表。

区位码中，QuweiCandidateList 将实现一个 PageableCandidate 接口，该接口允许在输入法面板中显示上一页/下一页按钮。

## 预编辑
预编辑可以指代两种不同的用户界面元素，一种是嵌入在应用程序中的预编辑，在 Fcitx 中通常称为"客户端预编辑"。另一个显示在输入法面板窗口中。通常，输入法引擎只会使用其中一种，因为只有一种形式的预编辑需要显示。可以通过 capabilityFlags 属性检查输入上下文是否支持它。

在使用客户端预编辑时，您可能还需要考虑一些事项。由于 toolkit 中的实现不同，toolkit 可能会选择在应用程序失去焦点时立即提交客户端预编辑。对于某些输入法，它可能被设计成不需要额外确认的输入方式，例如，键盘引擎中的单词完成模式。在这种情况下，即使使用了预编辑，用户仍希望提交文本，即使它仍处于预编辑模式。从这个意义上说，预编辑文本应该与确认后提交的文本完全相同。

在某些版本的 iOS 中，其拼音输入法使用其客户端预编辑的方式可能会导致混淆：用户键入"nihao"，而客户端预编辑显示为分段拼音"ni hao"。当文本框失去焦点时，"ni hao"（多余的空格）将被提交到应用程序中，而这种结果在拼音的常规使用中永远不会发生。

另一件需要考虑的事情是把光标放在哪里。虽然在预编辑中将光标显示在其实际位置可能很自然，但输入面板窗口也会显示在客户端预编辑光标位置。也就是说，随着用户正常打字，当光标移动时，候选窗口也会随之移动。在某些情况下，这是不可取的，因为它会导致候选窗口在用户键入时频繁移动。另一种处理方法是将客户端光标始终设置为 0。如果需要支持显示实际光标的位置，则可以使用高亮样式。例如，当你在预编辑中有"ABCD"，光标在B和C之间时，你可以将客户端光标设置为0，使"AB"以高亮方式显示，以指示光标的位置。

## 按键事件处理
最常见的用例是为您打算处理的所有按键事件调用 filterAndAccept()。此外，对于大多数输入法，按键释放是不相关的，应该传递给应用程序。要使输入法引擎能够处理任何用户输入，请务必考虑用户可能键入的所有可能的按键事件。例如，一个常见的错误是在组合模式中忘记屏蔽某个不相关的密钥，并将密钥泄露到应用程序中。另外，请注意带有修饰符的键事件，您可能希望传递此类键以使应用程序特定的热键即使在用户正在编写时仍然可以访问。

此外，一个按键事件有 3 种不同形式的 Key 对象。通常输入法引擎可能只想考虑 key() 属性。origKey() 和 rawKey() 属性使用较少。键属性是键事件的规范化形式。这删除了某些情况下的"Shift"修饰符，这使得输入法引擎更容易处理。例如，通过 Shift+A 和 Capslocked A 生成的大写字母 A 在归一化后将相同。您可以参考实现以了解此规范化的工作原理。

# 重用其他插件的功能
你可以参考 github 中 [第三次提交](https://github.com/fcitx/fcitx5-quwei/commit/b01bf8c4344b50b496593b4d9cf8be49cd1ce9c2) 的代码。

Fcitx 提供了一种机制来调用其他插件的功能，而无需直接链接到它们。还有一些易于使用的 CMake 宏来查找插件依赖项。

 <nowrap>find_package(Fcitx5Module REQUIRED COMPONENTS Punctuation QuickPhrase)</nowrap>

我们在上面添加 find_package 行以查找 Punctuation 和 QuickPhrase 模块的依赖项。

如果你想实现这样的模块，你可以使用下面的CMake宏

 <nowrap>fcitx5_export_module(QuickPhrase TARGET quickphrase BUILD_INCLUDE_DIRECTORIES "${CMAKE_CURRENT_SOURCE_DIR}" HEADERS quickphrase_public.h INSTALL)</nowrap>

它会自动为您的插件生成所需的 CMake 配置。

当在代码中使用其他插件时，有一个方便的宏 <code>FCITX_ADDON_DEPENDENCY_LOADER</code> 可以在运行时处理插件的加载。第一次调用它时，依赖的插件将自动加载。这里我们在代码中定义了四个不同的依赖：

 <nowrap>    FCITX_ADDON_DEPENDENCY_LOADER(quickphrase, instance_->addonManager());
    FCITX_ADDON_DEPENDENCY_LOADER(punctuation, instance_->addonManager());

private:
    FCITX_ADDON_DEPENDENCY_LOADER(chttrans, instance_->addonManager());
    FCITX_ADDON_DEPENDENCY_LOADER(fullwidth, instance_->addonManager());</nowrap>

第一个参数应与插件名称相同，第二个参数是获取 AddonManager 对象的表达式。

这种机制使得重用其他插件实现的功能和共享代码变得容易。比如 classicui 从 xcb addon 和 wayland addon 查询 X11/wayland 连接。

# 配置
虽然区位码并不真正需要这个功能，因为它是一个非常常见的用例，所以它会在本节中介绍。该插件有几个与配置相关的不同接口，例如 getConfig、setConfig、getConfigForInputMethod、setConfigForInputMethod、reloadConfig。getter 函数需要返回一个 [Configuration](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1Configuration.html) 对象，而 setConfig 接受一个 [RawConfig](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1RawConfig.html)目的。reloadConfig 将被调用以从磁盘重新加载配置，您可能也想在插件的构造函数中调用 reloadConfig()。

如果在插件注册文件中将 Configurable 字段设置为 True，则会调用此类方法来检索信息，Configtool 会为其生成 UI。

 <nowrap>FCITX_CONFIGURATION(
    ClipboardConfig, KeyListOption triggerKey{this,
                                              "TriggerKey",
                                              _("Trigger Key"),
                                              {Key("Control+semicolon")},
                                              KeyListConstrain()};
    KeyListOption pastePrimaryKey{
        this, "PastePrimaryKey", _("Paste Primary"), {}, KeyListConstrain()};
    Option<int, IntConstrain> numOfEntries{this, "Number of entries",
                                           _("Number of entries"), 5,
                                           IntConstrain(3, 30)};);</nowrap>

通常，您将使用 FCITX_CONFIGURATION 宏定义 Configuration 的子类。第一个参数是类的名称，然后您只需添加 [Option](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1Option.html) 作为成员。以下是 setConfig/getConfig/reloadConfig 的常见实现。

 <nowrap>    static constexpr char configFile[] = "conf/clipboard.conf";
    void reloadConfig() override { readAsIni(config_, configFile); }

    const Configuration *getConfig() const override { return &config_; }
    void setConfig(const RawConfig &config) override {
        config_.load(config, true);
        safeSaveAsIni(config_, configFile);
    }</nowrap>

readAsIni 和 safeSaveAsIni 是辅助函数，用于从 Fcitx ini 格式读取/保存配置对象。该文件保存在 $XDG_CONFIG_HOME 下。