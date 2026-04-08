# coworkUI

`coworkUI` 是 A2UI 的 Vue 三方库版本，包含渲染引擎、默认组件集、主题能力和可选的 sweetBase 联动能力。

## 安装

```bash
npm i coworkUI vue
```

> 如需使用 sweet 组件（`sweet-table`、`sweet-timeline`、`sweet-line-chart` 等），请在宿主项目安装并注册 `@hw-seq/sweet-ui-base`。

## 快速使用

```js
import { createApp } from 'vue'
import App from './App.vue'
import { createCoworkUI } from 'coworkUI'
import sweetBase from '@hw-seq/sweet-ui-base'
import '@hw-seq/sweet-ui-base/dist/sweet-ui-base.css'

const app = createApp(App)
const coworkUI = createCoworkUI({
  sweetBase,
  locale: 'zh_CN',
  themeName: 'dark',
  installSweetBase: true,
})

app.use(coworkUI)
app.mount('#app')
```

## 核心导出

- `A2UIRenderer`
- `A2UIComponentRenderer`
- `defaultRegistry`
- `createComponentRegistry`
- `defaultTheme`
- `createCoworkUI(options)`

## 默认组件清单

### 内容类
- Text
- Image
- Icon
- Divider
- Video
- AudioPlayer
- FlowDiagram
- Mermaid
- Table
- LineChart
- PieChart

### 布局类
- Row
- Column
- List
- Card
- Tabs
- Modal
- Timeline
- TimelineItem

### 交互类
- Button
- TextField
- CheckBox
- Slider
- DateTimeInput
- MultipleChoice

## 主题切换（含 sweetBase 同步）

### 1) 创建插件实例并保留引用

```js
const coworkUI = createCoworkUI({ sweetBase, themeName: 'dark', installSweetBase: true })
app.use(coworkUI)
```

### 2) 运行时切换主题

```js
coworkUI.setTheme('light')
```

当传入了 `sweetBase` 时，`setTheme` 会同步调用 `sweetBase.setTheme(themeName)`。

### 3) 自定义 A2UI 主题对象

`A2UIRenderer` 支持通过 `theme` 属性注入你自己的主题对象：

```vue
<A2UIRenderer :surface="surface" :data-model="dataModel" :theme="myTheme" />
```

## 自定义组件注册

可基于 `createComponentRegistry` 与 `defaultRegistry` 做扩展或替换。

## 注意事项

1. Mermaid 渲染依赖 SVG，请避免全局 reset 覆盖 `svg`/`foreignObject`。
2. 如果宿主已经安装了 sweetBase，请避免重复 `app.use`。
3. `A2UIRenderer` 需要传入 `surface.root` 和 `surface.componentsById`。
