<script setup>
import { computed, ref } from 'vue'
import ObsAbility from './components/obs_ability.vue'
import ObsData from './components/obs_data.vue'
import Algorithm from './components/algorithm.vue'
import Knowledge from './components/knowledge.vue'

const resourceTabs = [
  { id: 'obs-ability', label: '观测能力库', component: ObsAbility },
  { id: 'obs-data', label: '观测数据仓', component: ObsData },
  { id: 'algorithm', label: '算法模型库', component: Algorithm },
  { id: 'knowledge', label: '知识库', component: Knowledge },
]

const activeTab = ref(resourceTabs[0].id)
const activeComponent = computed(
  () => resourceTabs.find((tab) => tab.id === activeTab.value)?.component ?? ObsAbility
)
</script>

<template>
  <section class="resource-panel">
    <div class="resource-tabs" role="tablist" aria-label="资源中心分类">
      <button
        v-for="tab in resourceTabs"
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

    <div class="resource-content" role="tabpanel">
      <component :is="activeComponent" />
    </div>
  </section>
</template>

<style scoped>
.resource-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.resource-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.resource-tabs button {
  padding: 10px 12px;
  border: 0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.resource-tabs button.active {
  background: #ffffff;
  color: #1677ff;
  border-bottom: 2px solid #1677ff;
}

.resource-content {
  flex: 1;
  overflow: auto;
}
</style>
