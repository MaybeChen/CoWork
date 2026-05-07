# CoWork 仓库阅读理解（2026-05-07）

本文档用于在本地回退后，快速恢复对仓库结构、运行方式与关键模块职责的整体理解。

## 1. 仓库定位

该仓库是一个 **npm workspaces monorepo**，包含：

- `packages/coworkUI`：可复用的 Vue UI 渲染库（A2UI runtime + 组件注册 + 主题）。
- `examples/demo`：演示如何在业务侧接入 `coworkUI` 的完整示例应用。

根目录脚本主要用于转发执行 example 的 dev/build。

## 2. 顶层目录与职责

- `README.md`
  - 描述 monorepo 的双目录结构与启动步骤。
- `package.json`
  - 定义 workspaces（`packages/*`、`examples/*`）。
  - 仅保留 `dev:example`、`build:example` 两个入口脚本。

## 3. `packages/coworkUI`（库）理解

### 3.1 对外能力

从 `packages/coworkUI/README.md` 和 `src/index.js` 可知，对外核心是插件化接入：

- `createCoworkUI(options)`：创建插件实例并可运行时切换主题。
- 导出渲染器：`A2UIRenderer`、`A2UIComponentRenderer`。
- 导出 registry/theme 工具：`defaultRegistry`、`createComponentRegistry`、`defaultTheme`。

### 3.2 架构分层

`src/` 大体分两层：

1. **插件层**（`src/index.js`、`src/components/A2UIRenderer.vue`、`src/theme/index.js`）
   - 提供 Vue 插件安装入口。
   - 管理主题注入/切换。
2. **a2ui-runtime 层**（`src/a2ui-runtime/**`）
   - 组件运行时渲染。
   - 默认组件注册表（内容类、布局类、交互类）。
   - 运行时样式与指令（如安全 HTML 指令）。

### 3.3 组件组织方式

默认组件按语义分为三类目录：

- `components/content/*`：文本、图像、图表、拓扑、Mermaid 等展示组件。
- `components/layout/*`：行列、卡片、Tabs、弹窗、时间线等结构组件。
- `components/interactive/*`：按钮、输入框、复选、滑块、日期、选择等交互组件。

说明该库的目标不是“单个业务组件”，而是“可由数据模型驱动的界面渲染运行时”。

### 3.4 主题能力

- `a2ui-runtime/style/light.css` 与 `dark.css` 负责内置主题。
- `theme/defaultTheme.js` 和 `theme/index.js` 提供主题对象/管理能力。
- README 明确了可通过 `coworkUI.setTheme('light'|'dark')` 动态切换，并在接入 sweetBase 时联动主题。

### 3.5 构建与发布

- `scripts/build.mjs` 执行库构建流程。
- `package.json` 通过 `prepublishOnly` 强制发布前先 build。
- `files` 仅发布 `dist`，表示源码不直接发布到 npm。

## 4. `examples/demo`（示例工程）理解

### 4.1 角色

示例工程用于验证与展示 `coworkUI` 的完整接入路径，依赖：

- `coworkUI`（本地 file 依赖，指向 `../../packages/coworkUI`）
- `vue-router`
- `@hw-seq/sweet-ui-base`

### 4.2 关键模块

- `src/main.js`：应用启动与插件安装。
- `src/App.vue`、`src/Chat.vue`：主界面与聊天/渲染组合。
- `src/router.js`：路由入口。
- `src/components/FlowNodeGraph.vue`：流程节点相关可视化。
- `src/theme/*` + `ThemePicker.vue`：示例侧主题切换与演示。

### 4.3 网络与消息处理链路

在 `src/modules` 下分层明显：

- `network/*`：流式请求、WS 流处理、模型配置。
- `message/*`：协议归一化、模型编解码、渐进调度、消息应用。
- `flow/*`：节点输入建模。
- `ui/*`：如自动滚动等 UI 行为封装。

这意味着 demo 并非纯静态展示，而是包含“消息协议 -> 渲染数据”转换逻辑。

## 5. 运行与调试建议

1. 安装依赖：`npm install`
2. 启动 demo：`npm run dev:example`
3. 构建 demo：`npm run build:example`
4. 单独构建库：`npm run build -w packages/coworkUI`

当出现“回退后行为异常”，优先排查：

- `examples/demo` 是否仍指向本地 `file:../../packages/coworkUI`。
- `packages/coworkUI/dist` 是否由最新源码重建。
- 主题切换链路是否同时影响 `coworkUI` 与 sweetBase。

## 6. 一句话总结

这是一个“**可复用渲染库 + 可运行示例工程**”的标准 monorepo：

- `packages/coworkUI` 负责能力沉淀；
- `examples/demo` 负责真实接入与交互链路验证。
