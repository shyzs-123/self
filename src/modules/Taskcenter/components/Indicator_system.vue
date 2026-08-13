 <script setup lang="ts">
import { ref } from 'vue'
import TaskDetailModal from '@/modules/Taskcenter/Hooks/task_view.vue'

const modalRef = ref<InstanceType<typeof TaskDetailModal>>()

const handleView = (Indicator: any) => {
  modalRef.value?.open(Indicator)
}

type IndicatorStatus = '进行中' | '待审核' | '已完成'

type IndicatorItem = {
  version:string,
  time: string,
  fuzeren: string,
  content: string,
  cite: Number,
  status: IndicatorStatus
}

const indicators: IndicatorItem[] = [
  {
    version:'1.2',
    time: '2026-08-12',
    fuzeren: 'wangling',
    content: 'wuhan',
    cite: 8,
    status: '进行中'
  }
]

const statusClassMap: Record<IndicatorStatus, string> = {
  进行中: 'status--running',
  待审核: 'status--pending',
  已完成: 'status--done',
}
</script>

<template>
  <section class="indicator-management">
    <h1 class="indicator-management__title">指标体系</h1>

    <div class="indicator-management__table-wrap">
      <table class="indicator-management__table">
        <thead>
          <tr>
            <th>版本号</th>
            <th>发布时间</th>
            <th>修改人</th>
            <th>修改内容</th>
            <th>引用任务数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="indicator in indicators" :key="indicator.version">
            <td>{{ indicator.version }}</td>
            <td>{{ indicator.time }}</td>
            <td>{{ indicator.fuzeren }}</td>
            <td>{{ indicator.content }}</td>
            <td>{{ indicator.cite }}</td>
            <td>
              <span class="status" :class="statusClassMap[indicator.status]">{{ indicator.status }}</span>
            </td>
            <td>
              <button type="button" @click="handleView(indicator)">查看</button>
              <button type="button">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <IndicatorDetailModal ref="modalRef" />
  </section>
</template>

<style scoped>
.indicator-management {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 16px;
}

.indicator-management__title {
  margin: 0 0 16px;
  color: #1e3a5f;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.indicator-management__table-wrap {
  overflow: auto;
}

.indicator-management__table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

.indicator-management__table th,
.indicator-management__table td {
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

.indicator-management__table th {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  background: #f8fbff;
}

.indicator-management__table td {
  color: #475569;
  font-size: 14px;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status--running {
  background: #eaf2ff;
  color: #2563eb;
}

.status--pending {
  background: #fff7e6;
  color: #b45309;
}

.status--done {
  background: #ecfdf3;
  color: #047857;
}

.indicator-management__table button {
  margin-right: 8px;
  border: 0;
  background: transparent;
  color: #1677ff;
  cursor: pointer;
}
</style> 