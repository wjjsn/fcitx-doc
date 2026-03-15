# Build Fcitx 5

Although fcitx5 is packaged in many GNU/Linux distributions, some of them (like Gentoo) did not officially provide it before May 2020. This article aims to provide general instructions on how to build and install fcitx5 in your GNU/Linux system.

### Dependencies

- C compiler
- C++ compiler
- [CMake](https://en.wikipedia.org/wiki/CMake)
- ECM (Extra CMake Modules)
- GNU Make
- XCB (C language bindings for X protocols)
- [Expat](https://libexpat.github.io/)
- [PkgConfig](https://www.freedesktop.org/wiki/Software/pkg-config/)
- [json-c](https://github.com/json-c/json-c/wiki)
- dbus
- [fmt](https://fmt.dev)
- cldr-emoji-annotation*

Note that most of these packages are usually provided by many distributions. cldr-emoji-annotation is a special case and will be introduced in the next section.

### Build Process

#### xcb-imdkit

After installing all dependencies, the first thing is to install xcb-imdkit, which is the implementation of X input method in XCB. Clone the [GitHub repository](https://github.com/fcitx/xcb-imdkit):
 git clone https://github.com/fcitx/xcb-imdkit.git
<code>cd</code> into the Git directory and run cmake:
 cmake .
To install to a custom directory, set the <code>CMAKE_INSTALL_PREFIX</code> flag:
 cmake -DCMAKE_INSTALL_PREFIX=/your/install/path .
Then simply run <code>make</code> and <code>make install</code>.
Note that installing to non-standard paths is not recommended.

Please check the cmake output to see if there are any missing dependencies. If you encounter problems at runtime, make sure to add the library installation path to PKG_CONFIG_PATH, and add the binary installation path to PATH (if they are not in standard locations).

Additionally, you may need to set some environment variables to point to your custom installation path, for example for dbus:

  export DBUS_DATADIR=/your/install/path/share/dbus-1

#### fcitx5

Now let's build fcitx5. Clone the [GitHub repository](https://github.com/fcitx/fcitx5):

```
git clone https://github.com/fcitx/fcitx5.git
```

Now run cmake:

```
cd fcitx5
cmake .
make -j$(nproc)
sudo make install
```

Similarly, you can set CMAKE_INSTALL_PREFIX and other options.
