# Workspace Center Architecture Notes

## 业务目标

当前页面已经具备一个固定在地图右侧的浮动工作窗口。后续目标不是再做多个独立窗口，而是把它发展成统一的“工作窗口容器”：左侧主导航点击不同中心，右侧同一个窗口切换显示任务中心、资源中心、应用中心、业务中心。

这样做的好处是窗口行为只维护一份，包括打开、关闭、刷新、最大化、宽度拖拽；各中心只负责自己的菜单和内容，不重复实现窗口外壳。

## 当前已经实现的能力

### 1. 主侧边栏入口

`src/Layout/Sidebar.vue` 是页面左侧主导航。当前有四个入口：

- 任务中心
- 资源中心
- 应用中心
- 业务中心

现状是四个入口都调用 `openTaskPanel()`，所以实际都会打开任务中心。这里已经说明了扩展方向：后续需要把它改成 `openPanel('task')`、`openPanel('resource')`、`openPanel('application')`、`openPanel('business')` 这样的通用打开方式。

### 2. 窗口状态管理

`src/store/windowStore.js` 负责窗口级状态：

- `isOpen`：窗口是否打开。
- `currentPanel`：当前显示哪个中心，当前默认是 `task`。
- `isMaximized`：是否最大化。
- `refreshToken`：刷新当前内容时递增，用于触发组件重新渲染。

目前 `windowStore` 提供 `openPanel(panelName)`，它会把 `currentPanel` 设置为传入的面板名称并打开窗口。

### 3. 右侧浮动工作窗口

`src/Layout/WorkSpace.vue` 是右侧浮动窗口外壳。当前承担这些职责：

- 根据 `windowStore.isOpen` 控制显示和隐藏。
- 固定在地图右侧。
- 提供刷新、最大化/还原、关闭按钮。
- 在内容区渲染 `TaskPanel`。
- 提供左侧边界拖拽调整宽度。

这个组件应该继续作为“窗口外壳”存在，不建议在资源、应用、业务中心里重复做类似窗口。

### 4. 左边界拖拽宽度

窗口固定在右侧，所以拖动左边界时宽度计算逻辑是：

```text
新宽度 = 起始宽度 + 起始鼠标 X - 当前鼠标 X
```

鼠标向左移动，当前鼠标 X 变小，窗口变宽；鼠标向右移动，窗口变窄。

当前实现包含：

- `workspaceWidth` 保存当前宽度。
- `startResize()` 记录起始鼠标位置和起始宽度。
- `resizeWorkspace()` 根据鼠标移动计算新宽度。
- `stopResize()` 移除全局鼠标事件，恢复页面文本选择。
- `MIN_WIDTH = 320` 防止窗口过窄。
- `MAX_WIDTH = 900` 防止窗口过宽。
- 最大化状态下隐藏拖拽条，避免行为冲突。

## 四个中心的推荐结构

建议使用“一层窗口壳 + 一层中心切换 + 每个中心自己的内部侧边栏”的结构。

```text
Sidebar.vue
  -> windowStore.openPanel(panelName)

WorkSpace.vue
  -> 根据 windowStore.currentPanel 选择中心组件

TaskPanel.vue
ResourcePanel.vue
ApplicationPanel.vue
BusinessPanel.vue
  -> 各自维护自己的中心侧边栏和内容区
```

## 后续实现步骤

### 步骤 1：改造窗口 store

把 `openTaskPanel()` 扩展成通用打开方法：

```js
openPanel(panelName) {
  this.currentPanel = panelName
  this.isOpen = true
}
```

如果还想保留兼容入口，可以让 `openTaskPanel()` 调用 `openPanel('task')`。

成功标准：

- 点击任务中心仍然能打开窗口。
- `currentPanel` 能根据入口变成对应值。

### 步骤 2：改造主侧边栏

把四个入口从统一调用 `openTaskPanel()` 改成分别打开不同中心：

```text
任务中心 -> task
资源中心 -> resource
应用中心 -> application
业务中心 -> business
```

成功标准：

- 四个入口都能打开同一个右侧工作窗口。
- 当前选中的中心状态正确。

### 步骤 3：在 WorkSpace 中建立中心映射

`WorkSpace.vue` 不再硬编码 `TaskPanel`，而是根据 `currentPanel` 动态选择：

```text
task -> TaskPanel
resource -> ResourcePanel
application -> ApplicationPanel
business -> BusinessPanel
```

成功标准：

- 打开不同入口时，窗口内容能切换到对应中心组件。
- 刷新按钮仍然只刷新当前中心内容。
- 最大化、关闭、拖拽宽度不受影响。

### 步骤 4：补每个中心自己的侧边栏

每个中心内部可以使用相似布局：

```text
中心 Panel
  左侧：中心内部菜单
  右侧：当前菜单对应内容
```

例如：

- 资源中心：资源列表、资源分类、资源状态。
- 应用中心：应用列表、应用配置、应用监控。
- 业务中心：业务流程、业务数据、业务统计。

如果四个中心内部侧边栏结构很像，再考虑抽一个 `CenterShell.vue`。不要一开始就过度抽象，先让四个中心跑通，再根据真实重复度决定是否抽。

## 没有明确说到但需要注意的地方

### 1. 当前文件存在中文乱码

多个 Vue 文件里的中文已经出现乱码，包括按钮标题和注释。后续如果继续维护中文文案，建议统一处理文件编码，否则容易出现模板标签被破坏、按钮文本显示异常的问题。

这不是本次中心切换的核心功能，但会影响页面观感和后续编辑稳定性。

### 2. 最大化和拖拽宽度要保持互斥

最大化时不应该继续使用手动宽度，否则内联宽度会覆盖最大化样式。当前思路是最大化时 `workspaceStyle` 返回空，拖拽条也不显示。

后续修改时不要把这个逻辑拆散。

### 3. 刷新行为要作用于当前中心

现在 `refreshToken` 用作 `TaskPanel` 的 `key`。改成动态中心后，刷新按钮应该继续绑定到动态组件上，而不是只绑定任务中心。

建议写法是动态组件统一使用：

```vue
<component :is="activePanelComponent" :key="windowStore.refreshToken" />
```

### 4. 中心标题应来自配置

窗口顶部标题现在还没有真正按中心切换。后续建议在 `WorkSpace.vue` 中维护一个中心配置：

```text
task: 任务中心
resource: 资源中心
application: 应用中心
business: 业务中心
```

这样标题、组件和入口值可以保持一致。

### 5. 不建议四个中心各自控制窗口打开关闭

打开、关闭、最大化、刷新、宽度拖拽都是窗口行为，应集中在 `windowStore` 和 `WorkSpace.vue`。中心组件只处理自己的业务内容。

如果把窗口行为分散到四个中心，后续会出现每个中心表现不一致的问题。

### 6. 不建议现在做路由

当前需求是地图上的右侧浮动窗口，不是独立页面跳转。使用 Pinia 状态切换组件更轻量，符合现状。

只有当四个中心需要独立 URL、浏览器前进后退、权限路由守卫时，再考虑 Vue Router。

## 推荐的最小施工顺序

```text
1. 改 windowStore：新增 openPanel(panelName)
   verify: 四个 panelName 能正确写入 currentPanel

2. 改 Sidebar：四个入口分别传不同 panelName
   verify: 点击入口能打开窗口，并切换 currentPanel

3. 改 WorkSpace：动态渲染四个中心组件
   verify: 四个中心都能在右侧窗口显示

4. 给每个中心补内部侧边栏
   verify: 每个中心能在自己的内部菜单之间切换内容

5. 视重复度决定是否抽 CenterShell
   verify: 抽取前后四个中心功能不变
```

## 当前建议结论

下一次如果继续施工，最小动作应该是先打通“四个主入口切换四个中心组件”。不要先急着设计复杂的内部侧边栏，因为如果主窗口还只能显示任务中心，内部侧边栏做得再多也接不到正确入口。
