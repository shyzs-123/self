<template>
  <section class="algorithm-management">
    <!-- 工具栏 -->
    <div class="algorithm-management__toolbar">
      <div class="algorithm-management__filters">
        <el-input v-model="keyword" clearable :placeholder="text.search" @input="resetPage" />

        <el-select v-model="typeFilter" clearable :placeholder="text.type" @change="resetPage">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="statusFilter" clearable :placeholder="text.status" @change="resetPage">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="serviceFilter" clearable :placeholder="text.serviceStatus" @change="resetPage">
          <el-option v-for="item in serviceOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-button :loading="loading" @click="refresh">{{ text.refresh }}</el-button>
        <el-button type="primary" @click="openCreate">{{ text.create }}</el-button>
      </div>
    </div>

    <!-- 算法列表 -->
    <el-table
      v-loading="loading"
      :data="displayedAlgorithms"
      class="algorithm-management__table"
      height="100%"
      @sort-change="handleSort"
    >
      <el-table-column prop="name" :label="text.name" min-width="140" sortable="custom" />
      <el-table-column prop="type" :label="text.typeColumn" width="110" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="typeTagType(row.type)">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="text.version" width="100" sortable="custom" />
      <el-table-column prop="status" :label="text.statusColumn" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service.serviceStatus" :label="text.serviceStatus" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="serviceStatusTagType(row.service.serviceStatus)">
            {{ serviceStatusLabel(row.service.serviceStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" :label="text.updatedAt" min-width="150" sortable="custom" />
      <el-table-column :label="text.actions" width="200" fixed="right">
        <template #default="{ row }">
          <div class="algorithm-management__actions">
            <el-button link type="primary" @click="openDetail(row)">{{ text.view }}</el-button>
            <el-button link type="primary" @click="openEdit(row)">{{ text.edit }}</el-button>
            <el-button link type="primary" @click="openExport(row)">{{ text.export }}</el-button>
            <el-button link type="danger" @click="removeAlgorithm(row)">{{ text.remove }}</el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="text.empty" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="algorithm-management__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredAlgorithms.length"
        :page-sizes="[5, 8, 12]"
        layout="total, sizes, prev, pager, next"
      />
    </div>

    <!-- 弹窗和抽屉 -->
    <Algorithm_FormDialog v-model="formVisible" :mode="formMode" :algorithm="editingAlgorithm" @save="saveAlgorithm" />
    <Algorithm_DetailDrawer v-model="drawerVisible" :algorithm="selectedAlgorithm" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Algorithm_FormDialog from '@/modules/resource/components/Algorithm_FormDialog.vue'
import Algorithm_DetailDrawer from '@/modules/resource/components/Algorithm_DetailDrawer.vue'

// ==================== 类型定义 ====================

type AlgorithmType = '数据处理' | '识别分析' | '预测预警' | '评价计算' | '规划优化'
type AlgorithmStatus = 'draft' | 'published' | 'deprecated' | 'archived'
type ServiceStatus = 'running' | 'stopped' | 'error' | 'pending'

type InputParam = {
  id: number
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

type OutputParam = {
  id: number
  name: string
  type: string
  description: string
}

type ParamTemplateItem = {
  id: number
  name: string
  description: string
  params: InputParam[]
}

type AlgorithmService = {
  runtimeEnv: string
  paramTemplates: ParamTemplateItem[]
  apiEndpoint: string
  computeResource: string
  serviceStatus: ServiceStatus
}

type Algorithm = {
  id: string
  name: string
  type: AlgorithmType
  version: string
  description: string
  inputs: InputParam[]
  outputs: OutputParam[]
  applicableIndicators: string[]
  applicableScenarios: string[]
  modelFile: string
  service: AlgorithmService
  status: AlgorithmStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  remark: string
}

// ==================== 文案配置 ====================

const text = {
  search: '搜索算法名称、类型、版本',
  type: '算法类型',
  status: '状态',
  serviceStatus: '服务状态',
  refresh: '刷新',
  create: '新增算法',
  view: '查看',
  edit: '编辑',
  remove: '删除',
  export: '导出',
  empty: '暂无匹配算法',
  refreshed: '算法列表已刷新',
  created: '算法已创建',
  saved: '算法已保存',
  deleted: '算法已删除',
  deleteTitle: '删除确认',
  deleteMessage: '确认删除该算法？',
  deleteConfirm: '删除',
  cancel: '取消',
  name: '算法名称',
  typeColumn: '算法类型',
  version: '版本',
  statusColumn: '状态',
  updatedAt: '更新时间',
  actions: '操作'
}

// ==================== 响应式数据 ====================

const algorithms = ref<Algorithm[]>([
  makeAlgorithm('ALG-001', 'LST地表温度反演算法', '数据处理', 'v2.1.0', 'published', 'running'),
  makeAlgorithm('ALG-002', '城市热岛识别算法', '识别分析', 'v1.0.0', 'published', 'running'),
  makeAlgorithm('ALG-003', '空气质量预测算法', '预测预警', 'v3.2.0', 'draft', 'stopped')
])

const loading = ref(false)
const keyword = ref('')
const typeFilter = ref<AlgorithmType | ''>('')
const statusFilter = ref<AlgorithmStatus | ''>('')
const serviceFilter = ref<ServiceStatus | ''>('')
const currentPage = ref(1)
const pageSize = ref(8)
const sort = ref<{ prop: keyof Algorithm | ''; order: 'ascending' | 'descending' | null }>({
  prop: '',
  order: null
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingAlgorithm = ref<Algorithm | null>(null)
const drawerVisible = ref(false)
const selectedAlgorithm = ref<Algorithm | null>(null)

// ==================== 常量选项 ====================

const typeOptions = [
  { value: '数据处理' as const, label: '数据处理' },
  { value: '识别分析' as const, label: '识别分析' },
  { value: '预测预警' as const, label: '预测预警' },
  { value: '评价计算' as const, label: '评价计算' },
  { value: '规划优化' as const, label: '规划优化' }
]

const statusOptions = [
  { value: 'draft' as const, label: '草稿' },
  { value: 'published' as const, label: '已发布' },
  { value: 'deprecated' as const, label: '已废弃' },
  { value: 'archived' as const, label: '已归档' }
]

const serviceOptions = [
  { value: 'running' as const, label: '运行中' },
  { value: 'stopped' as const, label: '已停止' },
  { value: 'error' as const, label: '异常' },
  { value: 'pending' as const, label: '待部署' }
]

// ==================== 计算属性 ====================

const filteredAlgorithms = computed(() =>
  algorithms.value.filter((algo) => {
    const query = keyword.value.trim().toLowerCase()
    const matchedQuery = !query ||
      [algo.name, algo.type, algo.version].some((v) => v.toLowerCase().includes(query))
    return matchedQuery &&
      (!typeFilter.value || algo.type === typeFilter.value) &&
      (!statusFilter.value || algo.status === statusFilter.value) &&
      (!serviceFilter.value || algo.service.serviceStatus === serviceFilter.value)
  })
)

const displayedAlgorithms = computed(() => {
  const list = [...filteredAlgorithms.value]
  if (sort.value.prop && sort.value.order) {
    const prop = sort.value.prop
    list.sort((a, b) => {
      const result = String(a[prop]).localeCompare(String(b[prop]))
      return sort.value.order === 'ascending' ? result : -result
    })
  }
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

// ==================== 方法 ====================

function makeAlgorithm(
  id: string,
  name: string,
  type: AlgorithmType,
  version: string,
  status: AlgorithmStatus,
  serviceStatus: ServiceStatus
): Algorithm {
  return {
    id,
    name,
    type,
    version,
    description: `${name}算法描述`,
    inputs: [
      { id: 1, name: 'input_data', type: 'file', required: true, description: '输入数据文件' },
      { id: 2, name: 'parameters', type: 'json', required: false, description: '参数字段', defaultValue: '{}' }
    ],
    outputs: [
      { id: 1, name: 'result', type: 'json', description: '处理结果' }
    ],
    applicableIndicators: ['IND-001', 'IND-002'],
    applicableScenarios: ['城市热岛', '地表温度监测'],
    modelFile: `models/${id}_v${version}.pkl`,
    service: {
      runtimeEnv: 'Python 3.8',
      paramTemplates: [
        {
          id: 1,
          name: '默认参数模板',
          description: '适用于常规场景',
          params: [
            { id: 1, name: 'threshold', type: 'number', required: true, description: '阈值', defaultValue: '0.5' },
            { id: 2, name: 'window_size', type: 'number', required: false, description: '窗口大小', defaultValue: '3' }
          ]
        }
      ],
      apiEndpoint: `https://api.example.com/algorithms/${id}`,
      computeResource: 'CPU: 4核, 内存: 8GB',
      serviceStatus
    },
    status,
    createdAt: '2026-08-10 10:00:00',
    updatedAt: '2026-08-17 14:30:00',
    createdBy: 'admin',
    remark: '正常运行中'
  }
}

function resetPage() { currentPage.value = 1 }

function refresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(text.refreshed)
  }, 400)
}

function handleSort({ prop, order }: { prop: string | null; order: 'ascending' | 'descending' | null }) {
  sort.value = { prop: (prop ?? '') as keyof Algorithm | '', order }
}

function openCreate() {
  formMode.value = 'create'
  editingAlgorithm.value = null
  formVisible.value = true
}

function openEdit(algorithm: Algorithm) {
  formMode.value = 'edit'
  editingAlgorithm.value = { ...algorithm }
  formVisible.value = true
}
function openExport(algorithm: Algorithm) {
  selectedAlgorithm.value = { ...algorithm }
  drawerVisible.value = true
}
function openDetail(algorithm: Algorithm) {
  selectedAlgorithm.value = { ...algorithm }
  drawerVisible.value = true
}

function saveAlgorithm(algorithm: Algorithm) {
  if (formMode.value === 'create') {
    algorithms.value.unshift(algorithm)
  } else {
    const index = algorithms.value.findIndex((item) => item.id === algorithm.id)
    if (index >= 0) algorithms.value[index] = algorithm
  }
  resetPage()
  ElMessage.success(formMode.value === 'create' ? text.created : text.saved)
}

async function removeAlgorithm(algorithm: Algorithm) {
  await ElMessageBox.confirm(text.deleteMessage, text.deleteTitle, {
    type: 'warning',
    confirmButtonText: text.deleteConfirm,
    cancelButtonText: text.cancel
  })
  algorithms.value = algorithms.value.filter((item) => item.id !== algorithm.id)
  ElMessage.success(text.deleted)
}

function typeTagType(type: AlgorithmType) {
  const map: Record<AlgorithmType, string> = {
    '数据处理': 'primary',
    '识别分析': 'success',
    '预测预警': 'warning',
    '评价计算': 'danger',
    '规划优化': 'info'
  }
  return map[type] || 'info'
}

function statusTagType(status: AlgorithmStatus) {
  const map: Record<AlgorithmStatus, string> = {
    'draft': 'info',
    'published': 'success',
    'deprecated': 'warning',
    'archived': 'danger'
  }
  return map[status] || 'info'
}

function statusLabel(status: AlgorithmStatus) {
  const map: Record<AlgorithmStatus, string> = {
    'draft': '草稿',
    'published': '已发布',
    'deprecated': '已废弃',
    'archived': '已归档'
  }
  return map[status] || status
}

function serviceStatusTagType(status: ServiceStatus) {
  const map: Record<ServiceStatus, string> = {
    'running': 'success',
    'stopped': 'info',
    'error': 'danger',
    'pending': 'warning'
  }
  return map[status] || 'info'
}

function serviceStatusLabel(status: ServiceStatus) {
  const map: Record<ServiceStatus, string> = {
    'running': '运行中',
    'stopped': '已停止',
    'error': '异常',
    'pending': '待部署'
  }
  return map[status] || status
}
</script>

<style scoped>
.algorithm-management {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

.algorithm-management__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.algorithm-management__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.algorithm-management__filters .el-input,
.algorithm-management__filters .el-select {
  width: 200px;
}

.algorithm-management__filters .el-button {
  flex-shrink: 0;
}

.algorithm-management__table {
  flex: 1;
  min-height: 360px;
}

.algorithm-management__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 1px;
}

.algorithm-management__pagination {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1100px) {
  .algorithm-management__filters {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>
