---
description: "dsh Web 客户端的主题包：四套内置配色、侧边栏画笔入口，以及导入并保存 JSON 主题包的主题工作室。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-themes

[English](README.md) | 中文

## 摘要

`dsh-client-ui-themes` 用可选主题包重绘整个 Web 工作台，并把控制入口放在侧边栏底部。内置四套主题包：Call of Duty 战术暗色、Solo Leveling 暗影紫、GTA 6 霓虹落日，以及 Attack on Titan 侦察兵羊皮纸。Settings 上方的一行画笔打开主题工作室，列出全部主题包，可从 JSON 文件导入新主题包，将其保存在浏览器存储中，并在刷新后恢复选择。每个主题包都是叠加在浅色或深色基础配色之上的一层别名 token，因此侧边栏、对话、输入框和状态条会一起改变。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

### 切换主题包

主题入口位于侧边栏底部，紧邻 Settings 行与已登录账号行的上方。点击它会打开主题工作室，其中以卡片形式列出 Default 卡片、四套内置主题包以及每个已导入主题包，每张卡片带一条三色预览条。点击卡片会立即应用该主题包；Default 卡片把工作台交还给在 Settings → General → Appearance 中选择的浅色、深色或跟随系统外观。

### 加载主题包文件

工作室的 **加载主题文件** 操作接受一个 JSON 文件，其中可以是单个主题包，也可以是包含最多八个主题包的 `{"themes": [...]}` 列表。每个主题包自带名称，声明其绘制所依据的基础配色，并提供 `--dsw-*` token 值：

```json
{
  "name": "Harbor dusk",
  "description": "Slate surfaces with a copper signal color.",
  "colorScheme": "dark",
  "tokens": {
    "--dsw-alias-bg-base": "#101820",
    "--dsw-alias-label-primary": "#e6eef5",
    "--dsw-alias-brand-primary": "#c8763c"
  }
}
```

名称最长 48 个字符，描述最长 160 个字符，一个主题包最多携带 256 个 token，其名称必须以 `--dsw-` 开头，值最长 240 个字符。不是 JSON、缺少名称、配色或 token，或者超出上述限制的文件会被拒绝，并在工作室中显示一行错误。导入成功后会选中第一个导入的主题包。已导入的主题包和当前选择通过 `localStorage` 在刷新后保留；存储被拒绝或不可读时，它们只会存活到当前页面结束。

### 入口所在位置

该行占据侧边栏的 `sidebar.footer.action` 席位，外壳在两种侧边栏宽度下都把它渲染在 Settings 席位上方。展开的列以与 Settings 行相同的几何尺寸显示画笔和“主题”标签；折叠的窄条显示一个 36×36 的圆形按钮。工作室是一个挂载到 body 的模态框，因此不会被侧边栏列裁切。

### 主题包改变了什么

主题包不只是调色板。每套内置主题包还带有一层**外观皮肤**：在主题包生效期间注入、并限定在 `body[data-ds-theme-pack="<id>"]` 下的样式表。皮肤设置界面与标题字体、绘制页面背景（战术网格、星空星云、落日棕榈、羊皮纸）、为侧边栏、内容栏、输入框、对话框与菜单加上边框，并重新绘制导航行、标题栏标签页、消息卡片、发送按钮和状态栏。选择“默认”卡片会同时移除 token 覆盖层与皮肤，恢复原版外壳。

皮肤规则依据稳定的 `data-slot` 席位（`sidebar`、`conversation.header`、`conversation.composer`、`conversation.chat.node`、`shell.bottom`）、ARIA 角色和元素种类编写，而不依赖 CSS Module 类名，因此构建重新生成哈希后依然有效。导入的主题包只携带 token。

-----

<a id="understand-the-implementation"></a>
## 理解实现

主题包通过 `ctx.theme.overrideTokens` 应用为一层覆盖，层来源是包 id，并配合 `ctx.theme.setTheme(pack.colorScheme)`。每个主题包 token 都写成 `{ light, dark }` 对且两种模式取同一个值，因为该层同时保存两种模式，而展示端只读取当前生效的一种。该层叠加在内置配色之上，因此四套内置主题包和导入主题包共用同一套机制，主题包可以覆盖外壳绘制所用的任意别名 token 或 `--dsw-specific-*` token。

主题包的配色被写为持久的主题偏好，而不是注册一个自定义主题 id。设置作用域在每次写入和重连后都会重新采纳其存储的配置段，自定义 id 会被这次采纳重置；写入主题包自身的配色意味着被采纳的偏好已经与之相符，因此该层得以保留。在 Appearance 中选择其他配色会改变偏好，并以 `theme/change` 事件到达，此时偏好不再等于已应用主题包的配色，这就是插件丢弃该层并清除选择的唯一信号。`system` 被排除在外：设置作用域在每次写入后都会重新采纳它，若把它当作漂移，浅色主题包会在深色桌面上刚恢复就被丢弃，因此只有明确选择浅色或深色才会清除主题包。应用主题包期间会抑制该监听器，覆盖它自己的两次写入。

画笔行通过 `ctx.slots.inject` 注册到 `sidebar.footer.action`，因此它会等待侧边栏声明，在声明撤销时消失，并随插件 fiber 一同退出。主题包状态是一个 `createPackStore` 句柄，通过 inject 的 `hooks` 分区发布给工作室；工作室用 `usePacks` 读取它，自身从不订阅。fiber 的清理函数会移除覆盖层，因此卸载插件后即恢复朴素配色。

-----

<a id="further-exploration"></a>
## 进一步探索

- [ui-theme](../ui-theme/README.zh.md)——本包所叠加的主题注册表、内置配色与覆盖层。
- [ui-sidebar](../ui-sidebar/README.zh.md)——声明入口所填充的 `sidebar.footer.action` 席位。
- [Web 样式](../../../docs/web-styling.zh.md)——工作室样式所遵循的 token 与 CSS Module 规则。

-----

<a id="model-experience"></a>
## 模型体验

无。该包是浏览器端 UI 插件层，不注册任何面向模型的内容。

#### KV Cache 影响

无；该包既不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

这些限制是当前包约束，而非待清理事项。

- **导入的主题包不做完整性校验**——工作室只检查名称、配色和 token 语法；只覆盖少量 token 的主题包会继承基础配色的其余部分，因此可能有些界面保持不变。
- **主题包状态保存在浏览器存储中**——已导入的主题包和当前选择不会跨浏览器或设备同步，清除站点数据即会移除它们。
- **主题包无法替换产品图标**——主题服务上存在 `ThemeDefinition.icons`，但本包不注册主题定义，也不附带任何图稿。
- **只有当前生效的配色有意义**——每个 token 都以同一个值保存到两种模式，因此主题包无法绘制不同的浅色与深色调色板。
- **皮肤是对概念稿的手工还原，而不是概念稿的构建产物**——背景图形由 CSS 渐变和内联 SVG 绘制，字体取自操作系统，任何主题包都不附带自绘插画或图标集。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

新增一套内置主题包意味着在 `src/client/themes.ts` 中增加一个冻结的 `ThemePack`、在 `BUILTIN_PACKS` 中增加一个条目，并在 `src/client/locales.ts` 的全部八个字典中加入 `pack.*` 名称与描述键。token 列表应与外壳读取的别名保持同步；ui-theme 的 `src/styles/design-platform.css` 是 token 名称的权威来源。

</details>
