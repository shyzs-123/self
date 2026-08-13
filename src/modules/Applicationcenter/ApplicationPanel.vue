<script setup>
import { computed, ref } from 'vue'
import Situation from './components/situation.vue'
import Progress from './components/progess.vue'
import Analysis from './components/analysis.vue'

const applicationTabs = [
  { id: 'situation', label: '态势展示', component: Situation },
  { id: 'progress', label: '任务进程与成果', component: Progress },
  { id: 'analysis', label: '综合分析', component: Analysis },
]

const activeTab = ref(applicationTabs[0].id)
const activeComponent = computed(
  () => applicationTabs.find((tab) => tab.id === activeTab.value)?.component ?? Situation
)
</script>

<template>
  <section class="application-panel">
    <div class="application-tabs" role="tablist" aria-label="应用中心分类">
      <button
        v-for="tab in applicationTabs"
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

    <div class="application-content" role="tabpanel">
      <component :is="activeComponent" />
    </div>
  </section>
</template>

<style scoped>
.application-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.application-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.application-tabs button {
  padding: 10px 12px;
  border: 0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.application-tabs button.active {
  background: #ffffff;
  color: #1677ff;
  border-bottom: 2px solid #1677ff;
}

.application-content {
  flex: 1;
  overflow: auto;
}
</style>
