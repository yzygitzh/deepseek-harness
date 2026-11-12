---
description: "Client 代码界面与 Host read 卡片共享的唯一「扩展名 → 语法高亮语言」表。"
kind: "package-library"
---

# dsh-util-code-language

[English](README.md) | 中文

## 概述

本仓库唯一的「文件名 → 语法高亮语言」表，供 Client 的文档 Code 预览、diff 审阅与 Host read 工具持久化的 `lang` 提示共同使用。`languageForPath` 以大小写不敏感的方式把文件名或路径映射为规范化 grammar id，并在扩展名之前优先匹配已登记的整体文件名；`CODE_HIGHLIGHT_EXTENSIONS` 列出预览注册可以声明的全部后缀，`CODE_HIGHLIGHT_FILENAMES` 列出可以声明的全部整体文件名。`readLangHintForPath` 在同一张表上把 read 卡片的短 id 投影出来：已录制的会话已经持有该后缀的值时保持该持久化值不变，其余后缀取该语言的短名。该包可在浏览器使用，不提供 Cordis service，也不持有运行时状态；真正的分词仍由 Client 高亮器负责。

## 目录

- [语言选择](#language-selection)
- [已知限制与暂缓事项](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="language-selection"></a>
## 语言选择

表位于 [`src/index.ts`](src/index.ts)。每个键是规范化语言 id——即 Client 高亮器解析的 grammar id；每个值是选中它的、不含点的小写扩展名。`languageForPath(path)` 取路径最后一段的最后一个点之后的文本、转小写后在 `Map` 中查找；使用 `Map` 可避免 `foo.constructor` 这类文件名解析到 `Object.prototype` 成员。未列入表的 dotfile（`.gitignore`）、无扩展名、结尾点、未知后缀都返回 `undefined`，各消费方一律按纯文本渲染；前导点仍算分隔符，因此 `.env` 解析为 `dotenv`。`/` 与 `\` 都算路径分隔符，因此 Windows 路径与 POSIX 路径解析一致。

第二张表 [`LANGUAGE_FILENAMES`](src/index.ts) 登记的是不靠扩展名也能表明语言的整体文件名：`Makefile`、`GNUmakefile`、`Dockerfile`、`Containerfile`、`CMakeLists.txt`、`Gemfile`、`Rakefile`、`Jenkinsfile`、`Snakefile`、`SConstruct`、`PKGBUILD`、`APKBUILD`，以及 shell 点文件（`.bashrc`、`.bash_profile`、`.bash_aliases`、`.zshrc`、`.zprofile`）。匹配时把路径最后一段转小写后与完整名称比较，命中即优先于扩展名，因此 `CMakeLists.txt` 解析为 `cmake`，而不会在 `txt` 上落空；名称只按整体匹配，所以 `notes.cmakelists.txt` 仍不登记。`CODE_HIGHLIGHT_FILENAMES` 把这些名称列出给预览注册表，使其与后缀一起声明，这类文件因此仍能提供 Code 视图。

该集合按常见源码、配置、脚本、数据与标记扩展名精选，并非完整语言登记表。没有对应 grammar 的扩展名映射到最接近的 grammar（`properties` 映射到 `ini`，该 grammar 自带 `properties` alias）；证书与锁文件扩展名（`pem`、`crt`、`key`、`cer`、`lock`）不列入表。CSV 映射为 `csv`；预览注册表将专用查看器排在 Code 之前，因此 Spreadsheet 仍是它的默认预览。`readLangHintForPath` 在同一张表上做投影：已录制的会话已经持有该后缀的值时返回该持久化短 id，其余后缀返回该语言的短名（`powershell`→`ps1`），无法识别的后缀返回 `undefined`——持久化字段因此只有一种风格，即短名；对 `kotlin`、`swift`、`yaml`、`json` 等语言，短名与 grammar id 相同；而 `tsx`、`tf`、`tfvars`、`gradle` 这些后缀本身的名字更准确，保留其自身名字。消费方若希望 Client 高亮器真正分词，仍取决于该 grammar 已在其中注册——没有加载 grammar 的 id 会按纯文本渲染，而不是报错。

-----

## 已知限制与暂缓事项

<a id="known-limitations-and-deferred-work"></a>

- **只认登记过的名称**——只有 [`LANGUAGE_FILENAMES`](src/index.ts) 登记的整体文件名才会解析，因此别处按约定识别的名称（`.gitignore`、`.editorconfig`、`Justfile`）在补入该表之前仍按纯文本处理。
- **不做内容嗅探**——扩展名缺失或未知时，即使字节含义明确也按纯文本处理；本表从不读取内容。
- **精选而非穷举**——本表小于 Shiki 的 grammar 目录与 GitHub linguist；新增语言意味着同时添加扩展名条目与 Client grammar 注册。


<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
