# CoWork Monorepo

本仓库已拆分为三部分：

- `packages/coworkUI`：A2UI Vue 三方库源码。
- `examples/demo`：完整示例工程，复刻当前主工程效果。
- `playground`：语法粘贴渲染实验场（可直接粘贴 JSON 做实时渲染）。

## 目录结构

```text
.
├─ packages/
│  └─ coworkUI/
├─ examples/
│  └─ demo/
├─ playground/
└─ README.md
```

## 运行步骤

> 需 Node.js 18+

### 1) 安装依赖

```bash
npm install
```

### 2) 启动 example demo

```bash
npm run dev:example
```

### 3) 构建 example demo

```bash
npm run build:example
```

### 4) 启动 playground

```bash
npm run dev:playground
```

### 5) 构建 playground

```bash
npm run build:playground
```

## 说明

- `examples/demo` 侧重“如何使用 coworkUI”。
- `playground` 侧重“粘贴数据即时查看渲染效果”。
- `packages/coworkUI/README.md` 包含组件列表、接入与主题切换细节。
