<template>
  <aside
    v-if="windowStore.isOpen"
    ref="workspaceRef"
    class="workspace"
    :class="{ 'workspace--maximized': windowStore.isMaximized }"
    :style="workspaceStyle"
  >
    <div
      v-if="!windowStore.isMaximized"
      class="workspace-resize-handle"
      @mousedown.prevent="startResize"
    />

    <header class="workspace-header">
      <strong>{{ panelTitle }}</strong>
      <div class="workspace-actions">
        <!-- 刷新按钮：⟳ -->
        <button type="button" title="Refresh" @click="windowStore.refresh">⟳</button>
        
        <!-- 最大化/还原按钮：□ 或 ❐ -->
        <button type="button" title="Maximize or restore" @click="windowStore.toggleMaximized">
          {{ windowStore.isMaximized ? '❐' : '□' }}
        </button>
        
        <!-- 关闭按钮：× -->
        <button type="button" title="Close" @click="windowStore.close">×</button>
      </div>
    </header>

    <div class="workspace-body">
      <component :is="activePanelComponent" :key="windowStore.currentPanel" />
    </div>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, onMounted } from 'vue'
import { useWindowStore } from '@/store/windowStore.js'
import TaskPanel from '@/modules/Taskcenter/TaskPanel.vue'
import ResourcePanel from '@/modules/Resourcecenter/ResourcePanel.vue'
import ApplicationPanel from '@/modules/Applicationcenter/ApplicationPanel.vue'
import BusinessPanel from '@/modules/Businesscenter/BusinessPanel.vue'

const windowStore = useWindowStore()
const panelComponents = {
  task: TaskPanel,
  resource: ResourcePanel,
  application: ApplicationPanel,
  business: BusinessPanel
}
const panelTitles = {
  task: 'Task Center',
  resource: 'Resource Center',
  application: 'Application Center',
  business: 'Business Center'
}
const activePanelComponent = computed(() => panelComponents[windowStore.currentPanel] ?? TaskPanel)
const panelTitle = computed(() => panelTitles[windowStore.currentPanel] ?? panelTitles.task)

const workspaceWidth = ref(480)
const minWidth = 320
const workspaceRef = ref(null)
let startX = 0
let startWidth = 0

// 获取最大宽度（最大化时的宽度）
const getMaxWidth = () => {
  if (!workspaceRef.value) return 900
  // 获取父容器宽度
  const parent = workspaceRef.value.parentElement
  if (!parent) return 900
  const parentRect = parent.getBoundingClientRect()
  // 最大化时的宽度 = 父容器宽度 - 32px（左右各16px边距）
  return parentRect.width - 32
}

const workspaceStyle = computed(() => {
  if (windowStore.isMaximized) return undefined
  return { width: `${workspaceWidth.value}px` }
})

const resizeWorkspace = (event) => {
  const maxAllowedWidth = getMaxWidth()
  const nextWidth = startWidth + startX - event.clientX
  workspaceWidth.value = Math.min(Math.max(nextWidth, minWidth), maxAllowedWidth)
}

const stopResize = () => {
  document.removeEventListener('mousemove', resizeWorkspace)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.userSelect = ''
}

const startResize = (event) => {
  if (windowStore.isMaximized) return
  startX = event.clientX
  startWidth = workspaceWidth.value
  document.addEventListener('mousemove', resizeWorkspace)
  document.addEventListener('mouseup', stopResize)
  document.body.style.userSelect = 'none'
}

// 窗口尺寸变化时重新计算宽度
const handleWindowResize = () => {
  const maxAllowedWidth = getMaxWidth()
  if (workspaceWidth.value > maxAllowedWidth) {
    workspaceWidth.value = maxAllowedWidth
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

onBeforeUnmount(() => {
  stopResize()
  window.removeEventListener('resize', handleWindowResize)
})
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

.workspace-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  width: 8px;
  cursor: ew-resize;
}

.workspace-resize-handle:hover {
  background: rgba(22, 119, 255, 0.16);
}

.workspace-header {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #1e3a5f;
}

.workspace-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.workspace-actions button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
  transition: all 0.2s;
}

.workspace-actions button:hover {
  color: #1677ff;
  background: #eaf2ff;
}

/* 关闭按钮悬停时红色 */
.workspace-actions button:last-child:hover {
  color: #fff;
  background: #ff4d4f;
}

.workspace-body {
  min-height: 0;
  flex: 1;
}
</style>