# CoWork Monorepo

本仓库已拆分为两部分：

- `packages/coworkUI`：A2UI Vue 三方库源码。
- `examples/demo`：完整示例工程，复刻当前主工程效果。

## 目录结构

```text
.
├─ packages/
│  └─ coworkUI/
├─ examples/
│  └─ demo/
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

## 说明

- `examples/demo` 侧重“如何使用 coworkUI”。
- `packages/coworkUI/README.md` 包含组件列表、接入与主题切换细节。
