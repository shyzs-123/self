<script setup>
import { computed, ref } from 'vue'
import TaskProcessing from './components/task_processing.vue'
import ResourceMatch from './components/resource_match.vue'
import ResourceConfig from './components/resource_config.vue'
import Scheme from './components/scheme.vue'

const businessTabs = [
  { id: 'task-processing', label: '任务处理', component: TaskProcessing },
  { id: 'resource-match', label: '资源匹配与评估', component: ResourceMatch },
  { id: 'resource-config', label: '资源配置', component: ResourceConfig },
  { id: 'scheme', label: '方案管理', component: Scheme },
]

const activeTab = ref(businessTabs[0].id)
const activeComponent = computed(
  () => businessTabs.find((tab) => tab.id === activeTab.value)?.component ?? TaskProcessing
)
</script>

<template>
  <section class="business-panel">
    <div class="business-tabs" role="tablist" aria-label="业务中心分类">
      <button
        v-for="tab in businessTabs"
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

    <div class="business-content" role="tabpanel">
      <component :is="activeComponent" />
    </div>
  </section>
</template>

<style scoped>
.business-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.business-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.business-tabs button {
  padding: 10px 12px;
  border: 0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.business-tabs button.active {
  background: #ffffff;
  color: #1677ff;
  border-bottom: 2px solid #1677ff;
}

.business-content {
  flex: 1;
  overflow: auto;
}
</style>
