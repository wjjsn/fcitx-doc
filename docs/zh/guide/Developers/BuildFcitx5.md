# 编译 Fcitx 5

虽然 fcitx5 在许多 GNU/Linux 发行版中都有包，但其中一些（如 Gentoo）在 2020 年 5 月之前没有正式提供它。本文旨在提供关于如何在您的 GNU/Linux 系统中编译和安装 fcitx5 的一般说明。

### 依赖项

- C 编译器
- C++ 编译器
- [CMake](https://en.wikipedia.org/wiki/CMake)
- ECM（额外的 CMake 模块）
- GNU Make
- XCB（X 协议的 C 语言绑定）
- [Expat](https://libexpat.github.io/)
- [PkgConfig](https://www.freedesktop.org/wiki/Software/pkg-config/)
- [json-c](https://github.com/json-c/json-c/wiki)
- dbus
- [fmt](https://fmt.dev)
- cldr-emoji-annotation*

请注意，这些包中的大多数通常由许多发行版提供。cldr-emoji-annotation 是一个特殊情况，将在下一节中介绍。

### 构建过程

#### xcb-imdkit

安装所有依赖项后，第一件事是安装 xcb-imdkit，它是 XCB 中 X 输入法的实现。克隆 [GitHub 仓库](https://github.com/fcitx/xcb-imdkit)：
 git clone https://github.com/fcitx/xcb-imdkit.git
<code>cd</code> 进入 Git 目录并运行 cmake：
 cmake .
要安装到自定义目录，请设置 <code>CMAKE_INSTALL_PREFIX</code> 标志：
 cmake -DCMAKE_INSTALL_PREFIX=/your/install/path .
然后简单地运行 <code>make</code> 和 <code>make install</code>。
请注意，不建议安装到非标准路径。

请检查 cmake 输出以查看是否有任何缺失的依赖项。如果您在运行时遇到问题，请确保将库安装路径添加到 PKG_CONFIG_PATH，以及将二进制文件安装路径添加到 PATH（如果它们不在标准位置）。

此外，您可能需要设置一些环境变量以指向您的自定义安装路径，例如对于 dbus：

  export DBUS_DATADIR=/your/install/path/share/dbus-1

#### fcitx5

现在让我们构建 fcitx5。克隆 [GitHub 仓库](https://github.com/fcitx/fcitx5)：

```
git clone https://github.com/fcitx/fcitx5.git
```

现在运行 cmake：

```
cd fcitx5
cmake .
make -j$(nproc)
sudo make install
```

同样，您可以设置 CMAKE_INSTALL_PREFIX 和其他选项。
