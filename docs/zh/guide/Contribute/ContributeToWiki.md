---
title: 为本Wiki做贡献
description: 欢迎！此文档项目为 Fcitx 5 用户、开发者和其他贡献者提供文档支持。我们非常欢迎您为此项目做贡献！
---

# 为本Wiki做贡献

## 为本项目做贡献

欢迎！此文档项目为 Fcitx 5 用户、开发者和其他贡献者提供文档支持。我们非常欢迎您为此项目做贡献！

您可以通过提交 Issue 或 Pull Request 来参与贡献。

## 提交 Issue

如果您发现文档中有错误、遗漏或需要更新内容，欢迎提交 Issue。请确保 Issue 标题清晰描述问题，并在正文中提供详细信息。

## 提交 Pull Request

### Fork 仓库

点击 GitHub 页面上的 Fork 按钮，将仓库复制到您的 GitHub 账户。

### 克隆仓库

```bash
git clone https://github.com/wjjsn/fcitx-doc.git
cd fcitx-doc
```

### 创建分支

```bash
git checkout -b your-branch-name
```

### 安装依赖

```bash
npm install
```

### 本地预览

```bash
npm run dev
```

### 提交更改

```bash
git add .
git commit -m "描述您的更改"
git push origin your-branch-name
```

### 创建 Pull Request

在 GitHub 上打开您的仓库，点击 Compare & pull request 按钮。填写 PR 描述，说明您做了哪些更改以及为什么。

## 文档格式

此项目使用 Rspress 构建，文档使用 Markdown 格式编写。您可以使用标准的 Markdown 语法。
