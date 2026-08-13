<script setup>
import { computed, ref } from 'vue'
import Taskmanagement from './components/Taskmanagement.vue'
import IndicatorSystem from './components/Indicator_system.vue'
import VersionManagement from './components/version_management.vue'

const taskTabs = [
  { id: 'task', label: '任务管理', component: Taskmanagement },
  { id: 'indicator', label: '指标体系', component: IndicatorSystem },
  { id: 'version', label: '版本管理', component: VersionManagement },
]

const activeTab = ref(taskTabs[0].id)
const activeComponent = computed(
  () => taskTabs.find((tab) => tab.id === activeTab.value)?.component ?? Taskmanagement
)
</script>

<template>
  <section class="task-panel">
    <div class="task-tabs" role="tablist" aria-label="任务中心分类">
      <button
        v-for="tab in taskTabs"
        :key="tab.id"
        type="button"
        :class="{ active: activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        role="tab"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="task-content" role="tabpanel">
      <component :is="activeComponent" />
    </div>
  </section>
</template>

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
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.task-tabs button.active {
  background: #ffffff;
  color: #1677ff;
  border-bottom: 2px solid #1677ff;
}

.task-content {
  flex: 1;
  overflow: auto;
}
</style>
