<script setup lang="ts">
// ============================================================
// 1. 导入依赖
// ============================================================
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TaskFormDialog from '@/modules/Taskcenter/Hooks/TaskFormDialog.vue'
import TaskDetailDrawer from '@/modules/Taskcenter/Hooks/TaskDetailDrawer.vue'

// ============================================================
// 2. 类型定义 - 定义任务相关的数据结构
// ============================================================

/**
 * 任务状态枚举
 * - pending: 待审核（初始状态）
 * - ready: 待执行（审核通过，等待启动）
 * - running: 执行中
 * - paused: 暂停（可恢复）
 * - completed: 已完成
 * - archived: 已归档（历史数据）
 */
type Status = 'pending' | 'ready' | 'running' | 'paused' | 'completed' | 'archived'

/** 优先级枚举：高/中/低 */
type Priority = 'high' | 'medium' | 'low'

/** 事件项：用于记录生命周期和日志 */
type EventItem = { title: string; time: string; content: string }

/**
 * 任务核心数据结构
 * 包含任务的基本信息、状态、时间线等
 */
export type Task = {
  id: string                // 任务唯一标识
  name: string              // 任务名称
  target: string            // 监测对象（如：视频流、传感器等）
  area: string              // 任务覆盖区域
  startTime: string         // 计划开始时间
  endTime: string           // 计划结束时间
  priority: Priority        // 优先级
  owner: string             // 负责人
  status: Status            // 当前状态
  createdAt: string         // 创建时间
  resultRequirement: string // 结果要求说明
  constraints: string       // 约束条件
  remark: string            // 备注信息
  lifecycle: EventItem[]    // 生命周期事件列表（按时间顺序）
  logs: EventItem[]         // 操作日志（最新的在前）
}


// 3. 文案配置 - 集中管理所有显示文本，便于国际化和维护


/** 界面通用文案 */
const text = {
  title: '任务管理',
  search: '搜索任务名称、监测对象、负责人',
  status: '状态筛选',
  priority: '优先级筛选',
  owner: '负责人筛选',
  refresh: '刷新',
  create: '新建任务',
  view: '查看',
  edit: '编辑',
  remove: '删除',
  empty: '暂无匹配任务',
  refreshed: '任务列表已刷新',
  created: '任务已创建',
  saved: '任务已保存',
  deleted: '任务已删除',
  deleteTitle: '删除确认',
  deleteMessage: '确认删除该任务？',
  deleteConfirm: '删除',
  cancel: '取消',
  name: '任务名称',
  target: '监测对象',
  area: '任务区域',
  time: '执行时间',
  priorityColumn: '优先级',
  ownerColumn: '负责人',
  statusColumn: '状态',
  createdAt: '创建时间',
  actions: '操作',
  until: '至'
}

/** 状态和优先级的显示标签映射 */
const labels = {
  status: {
    pending: '待审核',
    ready: '待执行',
    running: '执行中',
    paused: '暂停',
    completed: '已完成',
    archived: '已归档'
  },
  priority: {
    high: '高',
    medium: '中',
    low: '低'
  }
}

// ============================================================
// 4. 响应式数据 - 管理任务列表和UI状态
// ============================================================

/** 任务列表数据（模拟数据） */
const tasks = ref<Task[]>([
  makeTask('TASK-001', '重点区域巡检', '视频流 / 传感器', '东区', '2026-08-12 09:00', '2026-08-12 12:00', 'high', '张明', 'running'),
  makeTask('TASK-002', '设施异常检测', '传感器', '南区', '2026-08-13 10:00', '2026-08-13 18:00', 'medium', '李娜', 'ready'),
])

const loading = ref(false)           // 加载状态
const keyword = ref('')              // 搜索关键词
const statusFilter = ref<Status | ''>('')    // 状态筛选
const priorityFilter = ref<Priority | ''>('') // 优先级筛选
const ownerFilter = ref('')          // 负责人筛选
const currentPage = ref(1)           // 当前页码
const pageSize = ref(8)              // 每页显示数量
const sort = ref<{ prop: keyof Task | ''; order: 'ascending' | 'descending' | null }>({
  prop: '',                          // 排序字段
  order: null                        // 排序方向
})

// 表单弹窗状态
const formVisible = ref(false)       // 弹窗显示控制
const formMode = ref<'create' | 'edit'>('create') // 创建/编辑模式
const editingTask = ref<Task | null>(null) // 当前编辑的任务

// 详情抽屉状态
const drawerVisible = ref(false)     // 抽屉显示控制
const selectedTask = ref<Task | null>(null) // 当前查看的任务

// ============================================================
// 5. 计算属性 - 处理筛选、排序和分页逻辑
// ============================================================

/** 状态选项列表（用于下拉选择器） */
const statusOptions = Object.keys(labels.status) as Status[]

/** 优先级选项列表（用于下拉选择器） */
const priorityOptions = Object.keys(labels.priority) as Priority[]

/**
 * 负责人选项列表（从任务列表中动态提取）
 * 使用 Set 去重，确保下拉选项不重复
 */
const ownerOptions = computed(() => {
  return [...new Set(tasks.value.map((task) => task.owner))]
})

/**
 * 筛选后的任务列表
 * 根据关键词、状态、优先级、负责人四个维度进行过滤
 */
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {

    const query = keyword.value.trim().toLowerCase()//去掉空格转为小写
    const matchedQuery = !query || [task.name, task.target, task.owner].some((value) => {
      return value.toLowerCase().includes(query)//转小写，判断关键字（query）是否在value中）
    })

    // 组合所有筛选条件
    return matchedQuery &&
      (!statusFilter.value || task.status === statusFilter.value) &&
      (!priorityFilter.value || task.priority === priorityFilter.value) &&
      (!ownerFilter.value || task.owner === ownerFilter.value)
  })
})

/**
 * 显示在当前页的任务列表
 * 先排序，再进行分页切片
 */
const displayedTasks = computed(() => {
  const list = [...filteredTasks.value]

  // 排序
  if (sort.value.prop && sort.value.order) {
    const prop = sort.value.prop
    list.sort((a, b) => {
      const result = String(a[prop]).localeCompare(String(b[prop]))
      return sort.value.order === 'ascending' ? result : -result
    })
  }

  // 分页切割
  const start = (currentPage.value - 1) * pageSize.value
  const end = currentPage.value * pageSize.value
  return list.slice(start, end)
})

// ============================================================
// 6. 工具函数
// ============================================================

/**
 * 创建任务对象的工厂函数
 * 生成包含默认值的完整任务对象
 */
function makeTask(
  id: string,
  name: string,
  target: string,
  area: string,
  startTime: string,
  endTime: string,
  priority: Priority,
  owner: string,
  status: Status
): Task {
  const createdAt = '2026-08-10 10:00'
  return {
    id,
    name,
    target,
    area,
    startTime,
    endTime,
    priority,
    owner,
    status,
    createdAt,
    resultRequirement: '输出任务结果、证据与处置建议。',
    constraints: '不得影响核心监测链路。',
    remark: '按计划执行。',
    lifecycle: [{ title: '创建', time: createdAt, content: '任务已创建' }],
    logs: [{ title: '任务创建', time: createdAt, content: '写入模拟任务数据' }]
  }
}

/** 重置分页到第一页（筛选条件变化时调用） */
function resetPage() {
  currentPage.value = 1
}


/** 刷新任务列表（模拟异步请求） */
function refresh() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    ElMessage.success(text.refreshed)
  }, 400)
}

/** 处理表格排序变化 */
function handleSort({ prop, order }: { prop: string | null; order: 'ascending' | 'descending' | null }) {
  sort.value = {
    prop: (prop ?? '') as keyof Task | '',
    order
  }
}

/** 打开创建任务弹窗 */
function openCreate() {
  formMode.value = 'create'
  editingTask.value = null
  formVisible.value = true
}

/** 打开编辑任务弹窗 */
function openEdit(task: Task) {
  formMode.value = 'edit'
  editingTask.value = task
  formVisible.value = true
}

/** 打开任务详情抽屉 */
function openDetail(task: Task) {
  selectedTask.value = task
  drawerVisible.value = true
}

/**
 * 保存任务（创建或更新）
 * @param task - 要保存的任务对象
 */
function saveTask(task: Task) {
  if (formMode.value === 'create') {
    // 创建模式：添加到列表最前面
    tasks.value.unshift(task)
  } else {
    // 编辑模式：替换原有任务
    const index = tasks.value.findIndex((item) => item.id === task.id)
    if (index >= 0) {
      tasks.value[index] = task
    }
  }
  resetPage()
  ElMessage.success(formMode.value === 'create' ? text.created : text.saved)
}

/**
 * 删除任务（带确认对话框）
 */
async function removeTask(task: Task) {
  await ElMessageBox.confirm(
    text.deleteMessage,
    text.deleteTitle,
    {
      type: 'warning',
      confirmButtonText: text.deleteConfirm,
      cancelButtonText: text.cancel
    }
  )
  tasks.value = tasks.value.filter((item) => item.id !== task.id)
  ElMessage.success(text.deleted)
}

// ============================================================
// 8. 显示辅助函数 - 用于渲染UI标签
// ============================================================

/** 获取优先级的显示文本 */
function priorityLabel(priority: Priority) {
  return labels.priority[priority]
}

/** 获取状态的显示文本 */
function statusLabel(status: Status) {
  return labels.status[status]
}

/** 获取优先级的Element Plus标签类型（颜色） */
function priorityType(priority: Priority) {
  return priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'info'
}

/** 获取状态的Element Plus标签类型（颜色） */
function statusType(status: Status) {
  return status === 'running' || status === 'completed' ? 'success'
    : status === 'paused' ? 'warning'
      : status === 'ready' ? 'primary'
        : 'info'
}
</script>

<template>
  <section class="task-management">
    <!-- ============================================ -->
    <!-- 工具栏区域：标题 + 搜索 + 筛选 + 操作按钮 -->
    <!-- ============================================ -->
    <div class="task-management__toolbar">
    

      <div class="task-management__filters">
        <!-- 关键词搜索框 -->
        <el-input v-model="keyword" clearable :placeholder="text.search" @input="resetPage" />

        <!-- 状态筛选下拉 -->
        <el-select v-model="statusFilter" clearable :placeholder="text.status" @change="resetPage">
          <el-option v-for="status in statusOptions" :key="status" :label="labels.status[status]" :value="status" />
        </el-select>

        <!-- 优先级筛选下拉 -->
        <el-select v-model="priorityFilter" clearable :placeholder="text.priority" @change="resetPage">
          <el-option v-for="priority in priorityOptions" :key="priority" :label="labels.priority[priority]"
            :value="priority" />
        </el-select>

        <!-- 负责人筛选下拉 -->
        <el-select v-model="ownerFilter" clearable :placeholder="text.owner" @change="resetPage">
          <el-option v-for="owner in ownerOptions" :key="owner" :label="owner" :value="owner" />
        </el-select>

        <!-- 操作按钮 -->
        <el-button :loading="loading" @click="refresh">
          {{ text.refresh }}
        </el-button>

        <el-button type="primary" @click="openCreate">
          {{ text.create }}
        </el-button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 任务列表表格 -->
    <!-- ============================================ -->
    <el-table v-loading="loading" :data="displayedTasks" class="task-management__table" height="100%"
      @sort-change="handleSort">
      <!-- 任务名称列 -->
      <el-table-column prop="name" :label="text.name" min-width="150" sortable="custom" />

      <!-- 监测对象列 -->
      <el-table-column prop="target" :label="text.target" min-width="140" sortable="custom" />

      <!-- 任务区域列 -->
      <el-table-column prop="area" :label="text.area" width="110" sortable="custom" />

      <!-- 执行时间列：显示开始时间 ~ 结束时间 -->
      <el-table-column prop="startTime" :label="text.time" min-width="170" sortable="custom">
        <template #default="{ row }">
          <span>{{ row.startTime }}</span>
          <small>{{ text.until }} {{ row.endTime }}</small>
        </template>
      </el-table-column>

      <!-- 优先级列：使用标签显示 -->
      <el-table-column prop="priority" :label="text.priorityColumn" width="90" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="priorityType(row.priority)">
            {{ priorityLabel(row.priority) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 负责人列 -->
      <el-table-column prop="owner" :label="text.ownerColumn" width="100" sortable="custom" />

      <!-- 状态列：使用标签显示 -->
      <el-table-column prop="status" :label="text.statusColumn" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 创建时间列 -->
      <el-table-column prop="createdAt" :label="text.createdAt" min-width="150" sortable="custom" />

      <!-- 操作列：固定在右侧 -->
      <el-table-column :label="text.actions" width="200" fixed="right">
        <template #default="{ row }">
          <div class="task-management__actions">
            <!-- 查看详情 -->
            <el-button link type="primary" @click="openDetail(row)">
              {{ text.view }}
            </el-button>

            <!-- 编辑 -->
            <el-button link type="primary" @click="openEdit(row)">
              {{ text.edit }}
            </el-button>

            <!-- 删除 -->
            <el-button link type="danger" @click="removeTask(row)">
              {{ text.remove }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <el-empty :description="text.empty" />
      </template>
    </el-table>

    <!-- ============================================ -->
    <!-- 分页组件 -->
    <!-- ============================================ -->
    <div class="task-management__pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="filteredTasks.length"
        :page-sizes="[5, 8, 12]" layout="total, sizes, prev, pager, next" />
    </div>

    <!-- ============================================ -->
    <!-- 弹窗和抽屉组件 -->
    <!-- ============================================ -->
    <!-- 创建/编辑任务弹窗 -->
    <TaskFormDialog v-model="formVisible" :mode="formMode" :task="editingTask" @save="saveTask" />

    <!-- 任务详情抽屉 -->
    <TaskDetailDrawer v-model="drawerVisible" :task="selectedTask" />
  </section>
</template>

<style scoped>
/* ============================================ */
/* 样式布局 - 使用Flex实现高度自适应 */
/* ============================================ */

.task-management {
  display: flex;
  height: 100%;
  /* 撑满父容器 */
  min-height: 0;
  /* 防止flex溢出 */
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

/* 工具栏：标题在左，筛选在右 */
.task-management__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.task-management__toolbar h1 {
  margin: 0;
  color: #1e3a5f;
  font-size: 26px;
  font-weight: 700;
}

/* 筛选器网格布局 */
.task-management__filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.6fr) repeat(3, minmax(120px, .8fr)) auto auto;
  gap: 10px;
  width: min(100%, 980px);
}

/* 表格区域：flex:1 自动撑满剩余高度 */
.task-management__table {
  flex: 1;
  min-height: 360px;
}

/* 时间列的小字提示 */
small {
  display: block;
  margin-top: 2px;
  color: #64748b;
}

/* 操作按钮组：支持换行 */
.task-management__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
}

/* 分页靠右对齐 */
.task-management__pagination {
  display: flex;
  justify-content: flex-end;
}

/* ============================================ */
/* 响应式适配 */
/* ============================================ */

@media (max-width: 1100px) {

  /* 小屏幕下筛选器变为两列 */
  .task-management__filters {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>