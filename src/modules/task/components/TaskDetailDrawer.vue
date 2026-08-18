<script setup lang="ts">
import { computed } from 'vue'

type Priority = 'high' | 'medium' | 'low'
type Status = 'pending' | 'ready' | 'running' | 'paused' | 'completed' | 'archived'
type EventItem = { title: string; time: string; content: string }
type Task = {
  id: string
  name: string
  target: string
  area: string
  startTime: string
  endTime: string
  priority: Priority
  owner: string
  status: Status
  createdAt: string
  resultRequirement: string
  constraints: string
  remark: string
  lifecycle: EventItem[]
  logs: EventItem[]
}

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 文案配置
const text = {
  title: '任务详情',
  empty: '暂无任务详情',
  basic: '基础信息',
  name: '任务名称',
  id: '任务编号',
  target: '监测对象',
  area: '任务区域',
  start: '开始时间',
  end: '结束时间',
  priority: '优先级',
  owner: '负责人',
  status: '状态',
  created: '创建时间',
  result: '成果要求',
  constraints: '约束条件',
  lifecycle: '生命周期',
  logs: '操作日志'
}

// 状态标签映射
const statusLabels: Record<Status, string> = {
  pending: '待审核',
  ready: '待执行',
  running: '执行中',
  paused: '暂停',
  completed: '已完成',
  archived: '已归档'
}

// 优先级标签映射
const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低'
}
</script>

<template>
  <el-drawer v-model="visible" :title="text.title" size="520px">
    <!-- 空状态 -->
    <el-empty v-if="!task" :description="text.empty" />

    <!-- 详情内容 -->
    <div v-else class="detail">
      <!-- 基础信息 -->
      <section>
        <h3>{{ text.basic }}</h3>
        <dl>
          <dt>{{ text.name }}</dt>
          <dd>{{ task.name }}</dd>

          <dt>{{ text.id }}</dt>
          <dd>{{ task.id }}</dd>

          <dt>{{ text.target }}</dt>
          <dd>{{ task.target }}</dd>

          <dt>{{ text.area }}</dt>
          <dd>{{ task.area }}</dd>

          <dt>{{ text.start }}</dt>
          <dd>{{ task.startTime }}</dd>

          <dt>{{ text.end }}</dt>
          <dd>{{ task.endTime }}</dd>

          <dt>{{ text.priority }}</dt>
          <dd>{{ priorityLabels[task.priority] }}</dd>

          <dt>{{ text.owner }}</dt>
          <dd>{{ task.owner }}</dd>

          <dt>{{ text.status }}</dt>
          <dd>{{ statusLabels[task.status] }}</dd>

          <dt>{{ text.created }}</dt>
          <dd>{{ task.createdAt }}</dd>
        </dl>
      </section>

      <!-- 成果要求 -->
      <section>
        <h3>{{ text.result }}</h3>
        <p>{{ task.resultRequirement }}</p>
      </section>

      <!-- 约束条件 -->
      <section>
        <h3>{{ text.constraints }}</h3>
        <p>{{ task.constraints }}</p>
      </section>

      <!-- 生命周期 -->
      <section>
        <h3>{{ text.lifecycle }}</h3>
        <el-timeline>
          <el-timeline-item v-for="item in task.lifecycle" :key="item.title + item.time" :timestamp="item.time">
            <strong>{{ item.title }}</strong>
            <p>{{ item.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </section>

      <!-- 操作日志 -->
      <section>
        <h3>{{ text.logs }}</h3>
        <el-timeline>
          <el-timeline-item v-for="item in task.logs" :key="item.title + item.time" :timestamp="item.time">
            <strong>{{ item.title }}</strong>
            <p>{{ item.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </section>
    </div>
  </el-drawer>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.detail section {
  border-bottom: 1px solid #eef2f7;
  padding-bottom: 18px;
}

.detail section:last-child {
  border-bottom: none;
}

.detail h3 {
  margin: 0 0 12px;
  color: #1e3a5f;
  font-size: 16px;
  font-weight: 600;
}

.detail p {
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

/* 网格布局显示键值对 */
dl {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 10px 12px;
  margin: 0;
}

dt {
  color: #64748b;
  font-weight: 500;
}

dd {
  margin: 0;
  color: #1f2937;
}

/* 时间线样式优化 */
:deep(.el-timeline-item__timestamp) {
  color: #64748b;
  font-size: 13px;
}

:deep(.el-timeline-item__content) {
  color: #1f2937;
}

:deep(.el-timeline-item__content strong) {
  color: #1e3a5f;
  display: block;
  margin-bottom: 4px;
}

:deep(.el-timeline-item__content p) {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}
</style>