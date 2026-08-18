<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ResourceFormDialog from '@/modules/resource/components/ResourceFormDialog.vue'
import ResourceDetailDrawer from '@/modules/resource/components/ResourceDetailDrawer.vue'

// ==================== 类型定义 ====================

type Type = 'satellite' | 'platform' | 'sensor' | 'ground'
type Status = 'online' | 'offline' | 'maintenance' | 'disabled'

// 单个能力项
type CapabilityItem = {
  id: number
  observableTarget: string
  observationElements: string
  observationPrecision: string
  spatialResolution: string
  temporalResolution: string
  coverageRange: string
  monitoringFrequency: string
  workHours: string
  environmentalLimits: string
  availableTime: string
}

/**
 * 资源完整信息
 */
type Resource = {
  // ===== 基础信息 =====
  id: string
  name: string
  code: string
  type: Type
  location: string
  organization: string
  status: Status
  createdAt: string

  // ===== 通用 =====
  description: string
  capabilities: string
  remark: string

  // ===== 扩展能力信息 =====
  interfaceAddress?: string
  updatedAt?: string

  // ===== 能力列表 =====
  capabilityList?: CapabilityItem[]
}

// ==================== 文案配置 ====================

const text = {
  search: '搜索资源名称、编码、位置',
  type: '资源类型',
  status: '状态筛选',
  organization: '所属单位',
  refresh: '刷新',
  create: '新增资源',
  view: '查看',
  edit: '编辑',
  remove: '删除',
  empty: '暂无匹配资源',
  refreshed: '资源列表已刷新',
  created: '资源已创建',
  saved: '资源已保存',
  deleted: '资源已删除',
  deleteTitle: '删除确认',
  deleteMessage: '确认删除该资源？',
  deleteConfirm: '删除',
  cancel: '取消',
  name: '资源名称',
  code: '资源编码',
  typeColumn: '资源类型',
  location: '位置',
  organizationColumn: '所属单位',
  statusColumn: '状态',
  createdAt: '创建时间',
  actions: '操作'
}

const labels = {
  type: {
    satellite: '卫星',
    platform: '平台',
    sensor: '传感器',
    ground: '地面站'
  },
  status: {
    online: '在线',
    offline: '离线',
    maintenance: '维护中',
    disabled: '停用'
  }
}

// ==================== 响应式数据 ====================

const resources = ref<Resource[]>([
  makeResource('R-001', '高分一号卫星', 'GF-1', 'satellite', '太阳同步轨道', '中国空间技术研究院', 'online'),
  makeResource('R-002', '地面接收站', 'GRS-01', 'ground', '北京', '国家卫星气象中心', 'online'),
  makeResource('R-003', '光学传感器', 'OPT-01', 'sensor', '卫星平台', '中科院光电所', 'maintenance')
])

const loading = ref(false)
//搜索能力
const keyword = ref('')
const typeFilter = ref<Type | ''>('')
const statusFilter = ref<Status | ''>('')
const organizationFilter = ref('')


const currentPage = ref(1)
const pageSize = ref(8)
const sort = ref<{ prop: keyof Resource | ''; order: 'ascending' | 'descending' | null }>({
  prop: '',
  order: null
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingResource = ref<Resource | null>(null)
const drawerVisible = ref(false)
const selectedResource = ref<Resource | null>(null)

//计算属性 

const typeOptions = Object.keys(labels.type) as Type[]
const statusOptions = Object.keys(labels.status) as Status[]

const organizationOptions = computed(() =>
  [...new Set(resources.value.map((r) => r.organization))]
)
//筛选
const filteredResources = computed(() =>
  resources.value.filter((resource) => {
    const query = keyword.value.trim().toLowerCase()
    const matchedQuery = !query ||
      [resource.name, resource.code, resource.location].some((v) => v.toLowerCase().includes(query))
    return matchedQuery &&
      (!typeFilter.value || resource.type === typeFilter.value) &&
      (!statusFilter.value || resource.status === statusFilter.value) &&
      (!organizationFilter.value || resource.organization === organizationFilter.value)
  })
)
//显示筛选结果
const displayedResources = computed(() => {
  const list = [...filteredResources.value]
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

function makeResource(
  id: string,
  name: string,
  code: string,
  type: Type,
  location: string,
  organization: string,
  status: Status
): Resource {
  return {
    id,
    name,
    code,
    type,
    location,
    organization,
    status,
    createdAt: '2026-08-10 10:00',
    description: '观测资源描述信息',
    capabilities: '具备数据采集与传输能力',
    remark: '正常运行中',
    interfaceAddress: 'https://api.example.com',
    updatedAt: '2026-08-10 10:00',
    // 示例能力列表
    capabilityList: [
      {
        id: 1,
        observableTarget: '城市交通、水体、植被',
        observationElements: '温度、湿度、光照',
        observationPrecision: '±0.5°C',
        spatialResolution: '10m',
        temporalResolution: '15分钟',
        coverageRange: '全球',
        monitoringFrequency: '每日4次',
        workHours: '08:00-20:00',
        environmentalLimits: '-20°C~50°C',
        availableTime: '2025-01-01至今'
      },
      {
        id: 2,
        observableTarget: '大气污染监测',
        observationElements: 'PM2.5、PM10、O3',
        observationPrecision: '±5%',
        spatialResolution: '1km',
        temporalResolution: '1小时',
        coverageRange: '华北地区',
        monitoringFrequency: '实时',
        workHours: '00:00-24:00',
        environmentalLimits: '-10°C~40°C',
        availableTime: '2025-06-01至今'
      }
    ]
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
  sort.value = { prop: (prop ?? '') as keyof Resource | '', order }
}

function openCreate() {
  formMode.value = 'create'
  editingResource.value = null
  formVisible.value = true
}

function openEdit(resource: Resource) {
  formMode.value = 'edit'
  editingResource.value = { ...resource }
  formVisible.value = true
}

function openDetail(resource: Resource) {
  selectedResource.value = { ...resource }
  drawerVisible.value = true
}

function saveResource(resource: Resource) {
  if (formMode.value === 'create') {
    resources.value.unshift(resource)
  } else {
    const index = resources.value.findIndex((item) => item.id === resource.id)
    if (index >= 0) resources.value[index] = resource
  }
  resetPage()
  ElMessage.success(formMode.value === 'create' ? text.created : text.saved)
}

async function removeResource(resource: Resource) {
  await ElMessageBox.confirm(text.deleteMessage, text.deleteTitle, {
    type: 'warning',
    confirmButtonText: text.deleteConfirm,
    cancelButtonText: text.cancel
  })
  resources.value = resources.value.filter((item) => item.id !== resource.id)
  ElMessage.success(text.deleted)
}

function typeLabel(type: Type) { return labels.type[type] }
function statusLabel(status: Status) { return labels.status[status] }

function typeTagType(type: Type) {
  return type === 'satellite' ? 'primary' : type === 'platform' ? 'success' : type === 'sensor' ? 'warning' : 'info'
}

function statusType(status: Status) {
  return status === 'online' ? 'success' : status === 'offline' ? 'danger' : status === 'maintenance' ? 'warning' : 'info'
}
</script>


<template>
  <section class="resource-management">
    <!-- 工具栏 -->
    <div class="resource-management__toolbar">
      <div class="resource-management__filters">
        <el-input v-model="keyword" clearable :placeholder="text.search" @input="resetPage" />

        <el-select v-model="typeFilter" clearable :placeholder="text.type" @change="resetPage">
          <el-option v-for="type in typeOptions" :key="type" :label="labels.type[type]" :value="type" />
        </el-select>

        <el-select v-model="statusFilter" clearable :placeholder="text.status" @change="resetPage">
          <el-option v-for="status in statusOptions" :key="status" :label="labels.status[status]" :value="status" />
        </el-select>

        <el-select v-model="organizationFilter" clearable :placeholder="text.organization" @change="resetPage">
          <el-option v-for="org in organizationOptions" :key="org" :label="org" :value="org" />
        </el-select>

        <el-button :loading="loading" @click="refresh">{{ text.refresh }}</el-button>
        <el-button type="primary" @click="openCreate">{{ text.create }}</el-button>
      </div>
    </div>

    <!-- 资源列表 -->
    <el-table
      v-loading="loading"
      :data="displayedResources"
      class="resource-management__table"
      height="100%"
      @sort-change="handleSort"
    >
      <el-table-column prop="name" :label="text.name" min-width="150" sortable="custom" />
      <el-table-column prop="code" :label="text.code" min-width="140" sortable="custom" />
      <el-table-column prop="type" :label="text.typeColumn" width="110" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="typeTagType(row.type)">{{ typeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" :label="text.location" min-width="140" sortable="custom" />
      <el-table-column prop="organization" :label="text.organizationColumn" min-width="130" sortable="custom" />
      <el-table-column prop="status" :label="text.statusColumn" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" :label="text.createdAt" min-width="150" sortable="custom" />
      <el-table-column :label="text.actions" width="200" fixed="right">
        <template #default="{ row }">
          <div class="resource-management__actions">
            <el-button link type="primary" @click="openDetail(row)">{{ text.view }}</el-button>
            <el-button link type="primary" @click="openEdit(row)">{{ text.edit }}</el-button>
            <el-button link type="danger" @click="removeResource(row)">{{ text.remove }}</el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="text.empty" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="resource-management__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredResources.length"
        :page-sizes="[5, 8, 12]"
        layout="total, sizes, prev, pager, next"
      />
    </div>

    <!-- 弹窗和抽屉 -->
    <ResourceFormDialog v-model="formVisible" :mode="formMode" :resource="editingResource" @save="saveResource" />
    <ResourceDetailDrawer v-model="drawerVisible" :resource="selectedResource" />
  </section>
</template>


<style scoped>
.resource-management {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

.resource-management__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.resource-management__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.resource-management__filters .el-input,
.resource-management__filters .el-select {
  width: 200px;
}

.resource-management__filters .el-button {
  flex-shrink: 0;
}

.resource-management__table {
  flex: 1;
  min-height: 360px;
}

.resource-management__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
}

.resource-management__pagination {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1100px) {
  .resource-management__filters {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>
