---
title: Develop Simple Input Method
description: A step-by-step guide to writing Fcitx 5 input methods, covering addon structure, CMake build system, and implementation details.
---

This is a step-by-step guide to writing Fcitx 5 input methods. The same steps can also be used to develop other types of addons, except that input method engines are the most complex.

# Develop Simple Input Method

## Understanding Fcitx Shared Library Addon File Structure
Fcitx 5 provides an extensible framework for adding new addon types, but shared library support is built-in and is the foundation for all other addon types. So we will only introduce shared library addons in this document.

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

This is the file structure for input method addons. For other addon types, files under <code>inputmethod/</code> are not needed. The filename of <code>[addon name].conf</code> is important and will be used to uniquely reference this specific addon. Fcitx also follows XDG directory standards, so files under XDG_DATA_DIR/fcitx5 will also be checked. Similarly, the filename of configuration files under <code>inputmethod/</code> is important and will be the unique name of a certain input method.

<code>[addon name].conf</code> example

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

<code>[InputMethod name].conf</code> example

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

This file uses an ini-like format with certain fcitx-specific extensions and rules. It also supports XDG desktop file style i18n for translations.

# Using CMake Build System
In theory, you are free to choose any build system as long as it can generate the correct files. However, Fcitx 5 has extensive support for CMake, so using CMake will be the most convenient way to build Fcitx projects. In this document, we will only introduce using CMake as the build system.

# Quick Start: Quwei Code
[Quwei Code](https://en.wikipedia.org/wiki/Zone_bitmap) is an input method that allows you to simply input numbers from GB2312 and produce Chinese characters matching that code. It was once supported by Fcitx 4 but is no longer included in Fcitx 5. Although it is difficult to use, it can serve as a good example to illustrate how to implement a simple input method for Fcitx 5.

## Project Framework
So let's start with the framework of this project.

 <nowrap>
├── CMakeLists.txt
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

You may need to look at some CMake tutorials to understand some basic CMake usage.

CMakeLists.txt in the root directory looks for dependencies.

 <nowrap>
cmake_minimum_required(VERSION 3.21)
project(fcitx5-quwei)

find_package(Fcitx5Core REQUIRED)
# Setup some compiler option that is generally useful and compatible with Fcitx 5 (C++17)
include("${FCITX_INSTALL_CMAKECONFIG_DIR}/Fcitx5Utils/Fcitx5CompilerSettings.cmake")

add_subdirectory(src)</nowrap>

src/CMakeLists.txt example:

 <nowrap>
# Make sure it produce quwei.so instead of libquwei.so
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

quwei.conf.in example:

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

This file will be loaded as an [InputMethodEntry](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputMethodEntry.html) object.

quwei-addon.conf.in example:
 
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
 

This file will be loaded as an [AddonInfo](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonInfo.html) object.

## Basic Implementation of InputMethodEngine
You can refer to the code in the [first commit](https://github.com/fcitx/fcitx5-quwei/commit/02c32b07e47e0e75db4f248dbb33c31137d8df74) on github.

Version 1 of quwei.h
 <nowrap>
 * SPDX-FileCopyrightText: 2021~2021 CSSlayer &lt;wengxt@gmail.com&gt;
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

Version 1 of quwei.cpp

 <nowrap>
 * SPDX-FileCopyrightText: 2021~2021 CSSlayer &lt;wengxt@gmail.com&gt;
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

When implementing Fcitx addons, they should be subclasses of [AddonInstance](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonInstance.html). Instantiation of AddonInstance is done through [AddonFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1AddonFactory.html). [InputMethodEngineV2](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputMethodEngineV2.html) is a subclass of AddonInstance. This class needs to be used when implementing input method addons.

A minimal implementation of an input method engine only requires implementing the keyEvent function.

Here, we use iostream-like macro <code>FCITX_INFO()</code> to write each key we press to the log.

Here it is assumed your fcitx install prefix is /usr. The command to build this project is:

 <nowrap>
mkdir -p build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug # use Debug for easy debugging with gdb
make # or ninja, depending on your system
sudo make install # or sudo ninja install</nowrap>

If everything is correct, the install command should print something like:

 <nowrap>
-- Install configuration: "Debug"
-- Installing: /usr/lib/fcitx5/quwei.so
-- Installing: /usr/share/fcitx5/addon/quwei.conf
-- Installing: /usr/share/fcitx5/inputmethod/quwei.conf</nowrap>

Now you can restart fcitx5 with <code>fcitx5 -rd</code> and use [Configuration Tool (Fcitx 5)](../Users/ConfigureFcitx5) to add Quwei to your configuration.

After switching to the Quwei input method, key presses in the application will make Fcitx 5 print something like:

 <nowrap>
I2021-11-16 12:29:32.352702 quwei.cpp:12] Key(f states=0) isRelease=1
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

From here you can know that your input method engine is now working properly.

# Implementing Input Method Logic
The basic logic of Quwei code is to type a 4-digit Quwei code. Quwei code can be seen as zone code xx and position code yy. The mapping from Quwei code to GB2312 is (0xA0 + zone code, 0xA0 + position code). When the user types a 3-digit Quwei code, the input method will display a candidate list containing 10 possible characters with the given zone code as prefix.

You can refer to the code in the [second commit](https://github.com/fcitx/fcitx5-quwei/commit/b9b047abb46fa0f9c42a0be82941b65b35b277eb) on github.

## Storing States for Different Input Contexts
Fcitx allows different input contexts to maintain different states. States usually refer to partially typed text and all other associated data structures. In this Quwei example, the state is the numbers the user has already typed. To represent this, Fcitx provides a convenient class [InputBuffer](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputBuffer.html) that input method engines can use to easily edit this internal state. To automatically construct states when constructing input contexts, Fcitx provides a framework called InputContextProperty. To use it, you first need to register a factory class with [InputContextManager](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputContextManager.html) via registerProperty. Each property needs a globally unique name. The name can be something human-readable. In this Quwei example, I use "quweiState". The benefit of using a better name is that in case you are developing some cross-addon (another addon needs to access some internal state of this addon), you can use this common name to load it into different addons. If you don't need external access, then the name doesn't matter.

The factory class comes with a convenient C++ template, [FactoryFor](https://codedocs.xyz/fcitx/fcitx5/group__FcitxCore.html#ga9e60042d1f671a6fa31ea04bb4961ec9). This is actually a type alias for [LambdaInputContextPropertyFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1LambdaInputContextPropertyFactory.html). This class only accepts lambda functions as factory implementation. This can save you from creating your own [InputContextPropertyFactory](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1InputContextPropertyFactory.html) subclass.

To get the state object from an input context, you can simply use the factory object like this:

 <nowrap>
auto *state = ic->propertyFor(&factory_);
 </nowrap>

In some cases, you can also unregister and re-register the factory to "refresh" all internal states.

## Candidate List
In Fcitx 5, the candidate list is part of the InputPanel class, stored as shared_ptr to avoid lifetime issues when selecting candidates that trigger UI updates. The candidate list provides different functionality through certain interfaces. The helper class [CommonCandidateList](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1CommonCandidateList.html) provides the most commonly used features for candidate lists. It implements the BulkCandidateList interface, which is why it's not suitable for decentralized cases. Because we want a curved semi-infinite candidate list.

In Quwei, QuweiCandidateList will implement a PageableCandidate interface, which allows displaying previous/next page buttons in the input method panel.

## Preedit
Preedit can refer to two different UI elements. One is preedit embedded in the application, usually called "client preedit" in Fcitx. The other is displayed in the input method panel window. Usually, input method engines will only use one of them, because only one form of preedit needs to be displayed. You can check whether the input context supports it through the capabilityFlags property.

When using client preedit, there are some things you may also need to consider. Due to different implementations in toolkits, the toolkit may choose to immediately commit the client preedit when the application loses focus. For some input methods, it may be designed as an input method that doesn't require additional confirmation, for example, word completion mode in the keyboard engine. In this case, even if preedit is used, the user still expects to commit the text, even if it's still in preedit mode. In this sense, preedit text should be exactly the same as the text committed after confirmation.

In some versions of iOS, the way its Pinyin input method uses client preedit may cause confusion: the user types "nihao", and the client preedit is displayed as segmented Pinyin "ni hao". When the text box loses focus, "ni hao" (with extra space) will be committed to the application, and this result would never happen in regular Pinyin usage.

Another thing to consider is where to put the cursor. Although it may be natural to display the cursor in its actual position in the preedit, the input panel window will also be displayed at the client preedit cursor position. That is, as the user types normally, when the cursor moves, the candidate window will also move with it. In some cases, this is undesirable because it causes the candidate window to move frequently while the user types. Another approach is to always set the client cursor to 0. If you need to support displaying the actual cursor position, you can use highlight styles. For example, when you have "ABCD" in preedit and the cursor is between B and C, you can set the client cursor to 0, making "AB" displayed in highlight to indicate the cursor position.

## Key Event Handling
The most common use case is to call filterAndAccept() for all key events you intend to handle. Additionally, for most input methods, key release is not relevant and should be passed to the application. To enable the input method engine to handle any user input, be sure to consider all possible key events the user might type. For example, a common mistake is forgetting to mask some irrelevant key in compose mode and leaking the key to the application. Also, note key events with modifiers, you may want to pass such keys so that application-specific hotkeys remain accessible even while the user is composing.

Additionally, a key event has 3 different forms of Key objects. Usually, input method engines may only want to consider the key() property. The origKey() and rawKey() properties are less used. The key property is the normalized form of the key event. This removes the "Shift" modifier in some cases, making it easier for input method engines to handle. For example, the uppercase letter A generated by Shift+A and Capslocked A will be the same after normalization. You can refer to the implementation to understand how this normalization works.

# Reusing Features of Other Addons
You can refer to the code in the [third commit](https://github.com/fcitx/fcitx5-quwei/commit/b01bf8c4344b50b496593b4d9cf8be49cd1ce9c2) on github.

Fcitx provides a mechanism to call features of other addons without directly linking to them. There are also some easy-to-use CMake macros to find addon dependencies.

 <nowrap>find_package(Fcitx5Module REQUIRED COMPONENTS Punctuation QuickPhrase)</nowrap>

We added find_package line above to find dependencies for Punctuation and QuickPhrase modules.

If you want to implement such a module, you can use the CMake macro below

 <nowrap>fcitx5_export_module(QuickPhrase TARGET quickphrase BUILD_INCLUDE_DIRECTORIES "${CMAKE_CURRENT_SOURCE_DIR}" HEADERS quickphrase_public.h INSTALL)</nowrap>

It will automatically generate the required CMake configuration for your addon.

When using other addons in code, there is a convenient macro <code>FCITX_ADDON_DEPENDENCY_LOADER</code> that can handle addon loading at runtime. The dependent addon will be automatically loaded the first time it is called. Here we defined four different dependencies in the code:

 <nowrap>
    FCITX_ADDON_DEPENDENCY_LOADER(quickphrase, instance_->addonManager());
    FCITX_ADDON_DEPENDENCY_LOADER(punctuation, instance_->addonManager());

private:
    FCITX_ADDON_DEPENDENCY_LOADER(chttrans, instance_->addonManager());
    FCITX_ADDON_DEPENDENCY_LOADER(fullwidth, instance_->addonManager());</nowrap>

The first argument should be the same as the addon name, and the second argument is an expression to get the AddonManager object.

This mechanism makes it easy to reuse features implemented by other addons and share code. For example, classicui queries X11/wayland connections from xcb addon and wayland addon.

# Configuration
Although Quwei doesn't really need this feature, since it's a very common use case, it will be introduced in this section. The addon has several different configuration-related interfaces, such as getConfig, setConfig, getConfigForInputMethod, setConfigForInputMethod, reloadConfig. The getter functions need to return a [Configuration](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1Configuration.html) object, while setConfig accepts a [RawConfig](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1RawConfig.html) object. reloadConfig will be called to reload the configuration from disk, and you may also want to call reloadConfig() in the constructor of the addon.

If the Configurable field is set to True in the addon registration file, such methods will be called to retrieve information, and Configtool will generate a UI for it.

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

Usually, you will use the FCITX_CONFIGURATION macro to define a subclass of Configuration. The first argument is the class name, then you just add [Option](https://codedocs.xyz/fcitx/fcitx5/classfcitx_1_1Option.html) as members. Here is a common implementation of setConfig/getConfig/reloadConfig.

 <nowrap>
    static constexpr char configFile[] = "conf/clipboard.conf";
    void reloadConfig() override { readAsIni(config_, configFile); }

    const Configuration *getConfig() const override { return &config_; }
    void setConfig(const RawConfig &config) override {
        config_.load(config, true);
        safeSaveAsIni(config_, configFile);
    }</nowrap>

readAsIni and safeSaveAsIni are helper functions to read/save configuration objects from/to Fcitx ini format. The file is saved under $XDG_CONFIG_HOME.
