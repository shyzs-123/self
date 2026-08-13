# 任务中心悬浮页面手写教程

## 目标

你要把当前项目逐步改成类似 `E:\vuer\userrr` 的右侧工作空间效果，但本教程只完成一个页面：

> 点击左侧“任务中心”，地图右侧滑出一个任务中心悬浮面板。

最终页面需要具备：

- 右侧悬浮面板；
- “任务中心”标题；
- 关闭按钮；
- 刷新按钮；
- 最大化/还原按钮；
- “任务管理 / 指标体系 / 版本管理”三个页签；
- 一个任务列表；
- 面板打开、关闭和页签切换；
- `npm run build` 通过。

本教程不要求你一次性迁移 `userrr` 的所有模块。

## 开始前先理解两个项目

当前项目的结构比较简单：

```text
src/
├─ App.vue
├─ Layout/
│  ├─ Header.vue
│  ├─ Sidebar.vue
│  └─ Mapcontainer.vue
├─ components/
│  ├─ float.vue
│  └─ Drawer.vue
└─ store/
   └─ windowStore.js
```

参考项目的主要思路是：

```text
左侧菜单
    ↓
Pinia 保存当前模块和打开状态
    ↓
右侧 Workspace 悬浮容器
    ↓
TaskPanel 任务中心页面
```

你本次要手写的也是这条链路，不需要先复制参考项目的所有文件。

## 第 1 步：确认当前项目能构建

在项目目录 `E:\vuer\self` 打开终端：

```powershell
npm run build
```

如果看到构建成功，再开始修改。

如果构建失败，先处理当前错误。不要在已有构建错误的情况下继续增加页面，否则后面很难判断错误来自哪里。

开发时可以启动：

```powershell
npm run dev
```

然后打开终端中显示的本地地址。

## 第 2 步：先设计状态

打开：

```text
src/store/windowStore.js
```

当前 store 只有一个 `isVisible`。你需要把它扩展成至少保存下面几个状态：

```js
state: () => ({
  isOpen: false,
  currentPanel: 'task',
  isMaximized: false,
  refreshToken: 0,
})
```

然后增加这些操作：

```js
actions: {
  openTaskPanel() {
    this.currentPanel = 'task'
    this.isOpen = true
  },

  close() {
    this.isOpen = false
    this.isMaximized = false
  },

  toggleMaximized() {
    this.isMaximized = !this.isMaximized
    this.isOpen = true
  },

  refresh() {
    this.refreshToken += 1
  },
}
```

这里的重点是：组件不要互相直接操作显示状态，所有打开、关闭和刷新动作统一通过 store。

完成后先保存文件，再执行：

```powershell
npm run build
```

## 第 3 步：让侧边栏打开任务中心

打开：

```text
src/Layout/Sidebar.vue
```

在 `<script setup>` 中引入 store：

```js
import { useWindowStore } from '../store/windowStore'

const windowStore = useWindowStore()

const openTaskPanel = () => {
  windowStore.openTaskPanel()
}
```

在“任务中心”的菜单项上绑定：

```html
<li class="button" @click="openTaskPanel">任务中心</li>
```

这一步暂时只处理“任务中心”，其它菜单先不要接入。

你可以临时在模板中显示状态，确认点击是否生效：

```html
<span>{{ windowStore.isOpen }}</span>
```

确认点击后变成 `true` 后，再删除这个临时调试内容。

## 第 4 步：创建任务中心页面

新建文件：

```text
src/modules/Taskcenter/TaskPanel.vue
```

先写最简单的页面骨架：

```vue
<template>
  <section class="task-panel">
    <div class="task-tabs">
      <button
        :class="{ active: activeTab === 'task' }"
        @click="activeTab = 'task'"
      >
        任务管理
      </button>
      <button
        :class="{ active: activeTab === 'indicator' }"
        @click="activeTab = 'indicator'"
      >
        指标体系
      </button>
      <button
        :class="{ active: activeTab === 'version' }"
        @click="activeTab = 'version'"
      >
        版本管理
      </button>
    </div>

    <div class="task-content">
      <div v-if="activeTab === 'task'">
        <h2>任务管理</h2>
        <p>当前任务数量：12</p>
      </div>

      <div v-else-if="activeTab === 'indicator'">
        <h2>指标体系</h2>
        <p>这里先放指标体系占位内容。</p>
      </div>

      <div v-else>
        <h2>版本管理</h2>
        <p>这里先放版本管理占位内容。</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('task')
</script>

<style scoped>
.task-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.task-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.task-tabs button {
  padding: 10px 12px;
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.task-tabs button.active {
  color: #1677ff;
  border-bottom: 2px solid #1677ff;
}

.task-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
```

先只验证页签切换，不要马上做复杂表格。

## 第 5 步：给任务页面增加任务列表

在 `TaskPanel.vue` 的 `<script setup>` 中增加静态数据：

```js
const tasks = [
  { id: 1, name: '区域变化检测', status: '进行中', progress: 68 },
  { id: 2, name: '遥感数据处理', status: '待审核', progress: 35 },
  { id: 3, name: '资源能力评估', status: '已完成', progress: 100 },
]
```

在“任务管理”内容中增加：

```html
<div v-if="activeTab === 'task'">
  <h2>任务管理</h2>

  <div class="task-list">
    <article v-for="task in tasks" :key="task.id" class="task-item">
      <div class="task-item__top">
        <strong>{{ task.name }}</strong>
        <span>{{ task.status }}</span>
      </div>

      <div class="progress-track">
        <div
          class="progress-value"
          :style="{ width: `${task.progress}%` }"
        />
      </div>

      <small>完成度 {{ task.progress }}%</small>
    </article>
  </div>
</div>
```

然后补充样式：

```css
.task-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.task-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
}

.task-item__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.task-item__top span {
  color: #1677ff;
  font-size: 12px;
}

.progress-track {
  height: 6px;
  margin: 12px 0 6px;
  overflow: hidden;
  border-radius: 3px;
  background: #e5e7eb;
}

.progress-value {
  height: 100%;
  border-radius: inherit;
  background: #1677ff;
}
```

## 第 6 步：创建右侧悬浮工作区

新建文件：

```text
src/Layout/Workspace.vue
```

基本结构：

```vue
<template>
  <aside
    v-if="windowStore.isOpen"
    class="workspace"
    :class="{ 'workspace--maximized': windowStore.isMaximized }"
  >
    <header class="workspace-header">
      <strong>任务中心</strong>

      <div class="workspace-actions">
        <button title="刷新" @click="windowStore.refresh">↻</button>
        <button title="最大化/还原" @click="windowStore.toggleMaximized">
          □
        </button>
        <button title="关闭" @click="windowStore.close">×</button>
      </div>
    </header>

    <div class="workspace-body">
      <TaskPanel :key="windowStore.refreshToken" />
    </div>
  </aside>
</template>

<script setup>
import TaskPanel from '../modules/Taskcenter/TaskPanel.vue'
import { useWindowStore } from '../store/windowStore'

const windowStore = useWindowStore()
</script>

<style scoped>
.workspace {
  position: absolute;
  z-index: 20;
  top: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  width: 480px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22);
}

.workspace--maximized {
  width: calc(100% - 32px);
}

.workspace-header {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
}

.workspace-actions {
  display: flex;
  gap: 4px;
}

.workspace-actions button {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.workspace-actions button:hover {
  color: #1677ff;
  background: #eaf2ff;
}

.workspace-body {
  min-height: 0;
  flex: 1;
}
</style>
```

这里使用 `position: absolute`，所以它必须放在一个 `position: relative` 的地图容器里面。

## 第 7 步：把 Workspace 放进地图区域

打开：

```text
src/App.vue
```

引入：

```js
import Workspace from './Layout/Workspace.vue'
```

然后把地图区域改成类似结构：

```html
<div class="page-wrap">
  <Sidebar />

  <main class="map-stage">
    <Mapcontainer />
    <Workspace />
  </main>
</div>
```

补充样式：

```css
.map-stage {
  position: relative;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
```

注意：`Workspace` 必须和 `Mapcontainer` 放在同一个相对定位的父容器中，否则右侧定位可能相对于整个页面，而不是地图区域。

## 第 8 步：先完成四个交互验证

按以下顺序手动测试：

1. 点击左侧“任务中心”，右侧面板出现。
2. 点击 `×`，面板消失。
3. 再次点击“任务中心”，面板重新出现。
4. 点击刷新按钮，任务面板重新渲染。
5. 点击最大化按钮，面板变宽。
6. 再点击一次最大化按钮，面板恢复原宽度。
7. 点击三个页签，内容能够切换。
8. 缩小浏览器窗口，确认列表可以滚动，文字没有被截断。

## 第 9 步：每完成一步就构建

建议每完成一个阶段就执行：

```powershell
npm run build
```

推荐的检查节奏：

```text
改 store       -> build
改 Sidebar     -> build
加 TaskPanel   -> build
加 Workspace   -> build
接入 App       -> build
最终样式完成   -> build
```

如果构建失败，先解决当前错误，再继续下一步。

## 常见问题

### 1. 点击菜单没有反应

检查：

- `Sidebar.vue` 是否正确引入了 `useWindowStore`；
- 点击事件是否绑定到了“任务中心”；
- `windowStore.openTaskPanel()` 是否存在；
- `App.vue` 是否真的挂载了 `<Workspace />`。

### 2. 悬浮面板跑到页面外面

检查地图父容器是否有：

```css
position: relative;
```

并确认 `Workspace` 是这个容器的直接或间接子元素。

### 3. 面板出现了但内容被撑破

检查：

```css
.workspace-body {
  min-height: 0;
  flex: 1;
}
```

任务列表区域需要设置：

```css
overflow: auto;
```

### 4. Pinia 报错

检查 `src/main.ts` 的顺序必须是：

```ts
const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

不能先 `mount`，再 `use(pinia)`。

## 完成后的检查清单

- [ ] `npm run build` 通过。
- [ ] 左侧“任务中心”能打开面板。
- [ ] 关闭按钮有效。
- [ ] 刷新按钮有效。
- [ ] 最大化/还原有效。
- [ ] 三个页签能切换。
- [ ] 任务列表能显示。
- [ ] 面板不遮挡顶部栏和左侧菜单。
- [ ] 小窗口下内容能滚动。
- [ ] `progress.md` 已追加本轮记录。
