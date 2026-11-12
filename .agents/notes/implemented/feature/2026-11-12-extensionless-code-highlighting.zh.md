# Agent Note: 无扩展名文件的高亮与按 tab 选择 grammar

Status: implemented

[English](2026-11-12-extensionless-code-highlighting.md) | 中文

## 问题

Sidebar 的 Code 渲染器只按路径决定 grammar，依据是 `languageForPath`。不带后缀的名字（`Makefile`、`Dockerfile`、`script`）解析不出语言，正文按纯文本渲染，查看器菜单也只有「纯文本」一项：读者没有任何办法要求高亮。靠文件名而非可读后缀表明语言的名称（`CMakeLists.txt` 在 `txt` 上落空，`.bashrc` 在 `bashrc` 上落空）以及点文件同样无法归类；而当 diff 的 `---`/`+++` 头指向这类文件时，行底色还在，行内的 token 颜色却丢了。

## 决定

更精确地归类三件事，并允许读者按 tab 覆盖结果。

### 整体文件名

`@deepseek-ai/dsh-util-code-language` 增加第二张表 [`LANGUAGE_FILENAMES`](../../../../packages/util/code-language/src/index.ts)：在考虑扩展名之前，先用小写化的路径末段与整份文件名匹配，并导出为 `CODE_HIGHLIGHT_FILENAMES`，让预览注册表能声明同一批名称。名称只按整体匹配，因此 `notes.cmakelists.txt` 仍不登记。Dockerfile 同时进入两张表：Shiki 模块把该 grammar 注册为 `docker`、以 `dockerfile` 为 alias，因此高亮器的 alias 表把语言 id 映射到那个已注册的 grammar。

### 无扩展名声明

`DocumentPreviewDefinition` 增加 `names`（整份文件名）与 `extensionless`（末段完全不含点）。注册表把命中的名称按同等长度的后缀参与排序，并仍然优先命中后缀，因此专用查看器照旧胜出。Code 渲染器同时声明已登记的每个后缀、每个已登记文件名，以及全部无扩展名名称——正是这一点让任何表都无法归类的文件仍能在查看器菜单里看到 Code。

### 按 tab 选择 grammar

Code 正文的工具栏标题改成一个 grammar 控件：它显示当前生效的 grammar，并打开一个列出 `HIGHLIGHT_LANGUAGES` 与「自动」的菜单；选「自动」即回到文件名决定的语言。预览 store 把选择存为 `TextTabState.language`，因此切换查看器或重新挂载正文都不会丢失。`CodeBlock` 为此新增 `languageControl`，把选项与其文案留在所属界面自己的 locale 里，而不是共享 primitive。

## 备选方案

- **内容嗅探**——否决：共享表已声明从不读取字节；在 Host 上做启发式判断会让语言取决于文件已读取了多少。
- **在 tab 地址上带语言参数**——否决：这是视图状态，不是内容身份。参数会分裂地址，割裂同一文件两个 tab 之间的元数据共享，并在每次重新打开时越过读者的意图继续生效。
- **无扩展名文件仍默认纯文本**——否决：`Makefile`、`Dockerfile` 与 shell 脚本才是常见的无扩展名情形，而 Code 正文是纯文本正文的超集（行号、复制、换行、滚动容器），因此让 Code 成为默认，纯文本只隔一次菜单选择。

## 后果

任何无扩展名文件现在都以带行号和 Code 标题栏的形态打开，而过去是纯文本；阅读 `LICENSE` 这类散文文件的读者要花一次菜单选择回到纯文本。共享表多了一种声明，只声明后缀的预览插件行为完全不变，而想要 Code 那样覆盖范围的插件必须两种声明都写。表能归类的文件，其 diff 行内保留语法颜色；无法归类的路径，diff 只剩行底色。

## 测试

- `packages/util/code-language/tests/code-language.spec.ts`——文件名优先级、整体名称匹配、点文件，以及两张表各自的持久化 read 提示。
- `packages/client/ui-sidebar-documentpreview/tests/document-registry.client.spec.ts` 与 `code-registration.client.spec.tsx`——名称排序、无扩展名声明，以及 Code 定义的元数据。
- `packages/client/ui-sidebar-documentpreview/tests/code-body.client.spec.tsx`——为无扩展名文件选择 grammar、回到「自动」、关闭菜单，以及渲染 `.diff` 行。
- `packages/client/ui-sidebar-documentpreview/tests/store.client.spec.ts`——按 tab 的选择及其清除。
- `packages/client/ui-primitives/tests/read-block.client.spec.tsx`——Dockerfile grammar 经 alias 惰性加载；`tests/diff-fence.client.spec.tsx`——`Makefile` 作为 diff 头时保留 token 颜色。
