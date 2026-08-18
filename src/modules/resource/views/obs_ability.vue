<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ResourceFormDialog from '@/modules/resource/components/ResourceFormDialog.vue'
import ResourceDetailDrawer from '@/modules/resource/components/ResourceDetailDrawer.vue'

// ==================== 新类型导入 ====================
import type { PlatformType, PlatformStatus, PlatformListItem, PlatformMetadata } from '@/modules/resource/sensor/types/platform'
import {
  getPlatformLabel,
  getStatusLabel,
  getPlatformTagType,
  getStatusTagType,
  platformOptions,
  statusOptions,
  listMetrics,
} from '@/modules/resource/sensor/config/platformConfig.ts'
import { createDefaultCapability } from '@/modules/resource/sensor/types/platform'

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
  createdAt: '部署时间',
  actions: '操作',
  primaryMetric: '主要指标',
  secondaryMetric: '次要指标',
}

// ==================== 响应式数据 ====================

// 使用新类型存储数据（同时保留旧字段兼容）
const resources = ref<PlatformMetadata[]>([
  makeResource('R-001', '高分一号卫星', 'GF-1', 'satellite', '太阳同步轨道', '中国空间技术研究院', 'online'),
  makeResource('R-002', '地面接收站', 'GRS-01', 'groundStation', '北京', '国家卫星气象中心', 'online'),
  makeResource('R-003', '光学传感器', 'OPT-01', 'satellite', '卫星平台', '中科院光电所', 'maintenance'),
])

const loading = ref(false)
const keyword = ref('')
const typeFilter = ref<PlatformType | ''>('')
const statusFilter = ref<PlatformStatus | ''>('')
const organizationFilter = ref('')

const currentPage = ref(1)
const pageSize = ref(8)
const sort = ref<{ prop: keyof PlatformListItem | ''; order: 'ascending' | 'descending' | null }>({
  prop: '',
  order: null,
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingResource = ref<PlatformMetadata | null>(null)
const drawerVisible = ref(false)
const selectedResource = ref<PlatformMetadata | null>(null)

// ============================================================
// 辅助函数：创建示例资源（兼容新旧格式）
// ============================================================

function makeResource(
  id: string,
  name: string,
  code: string,
  type: PlatformType,
  location: string,
  organization: string,
  status: PlatformStatus
): PlatformMetadata {
  const now = '2026-08-18'
  const capability = createDefaultCapability(type)

  // 针对不同预设部分数据
  if (type === 'satellite') {
    ;(capability.data as any).spatialResolution = '16m'
    ;(capability.data as any).revisitTime = '2天'
    ;(capability.data as any).swath = '800km'
    ;(capability.data as any).orbitHeight = '645km'
  }

  const metadata: PlatformMetadata = {
    general: {
      platformId: id,
      platformName: name,
      platformCode: code,
      platformType: type,
      manufacturer: '示例厂商',
      model: 'Model-X',
      status,
      deploymentDate: now,
      location,
      organization,
      owner: '责任人',
    },
    constraint: {
      effectiveTimeStart: '2024-01-01',
      effectiveTimeEnd: '2026-12-31',
      constraintLevel: 'public',
    },
    contact: {
      organizationName: organization,
      individualName: '张工',
      positionName: '主任',
      phone: '010-12345678',
      email: 'contact@example.com',
      address: '北京市海淀区',
    },
    geoPosition: {
      longitude: 116.5,
      latitude: 39.9,
      altitude: 645,
      spatialReference: 'WGS84',
    },
    interface: {
      serviceAddress: 'https://api.example.com',
      protocolType: 'RESTful',
    },
    property: capability,
    // 兼容旧字段
    name,
    code,
    type,
    location,
    organization,
    status,
    interfaceAddress: 'https://api.example.com',
    description: '观测资源描述信息',
    remark: '正常运行中',
    createdAt: now,
    capabilityList: [],
  }
  return metadata
}

// ============================================================
// 列表展示转换
// ============================================================

const listItems = computed<PlatformListItem[]>(() => {
  return resources.value.map((r) => {
    const metric = listMetrics[r.general.platformType] || listMetrics.satellite
    return {
      platformId: r.general.platformId,
      platformName: r.general.platformName,
      platformCode: r.general.platformCode,
      platformType: r.general.platformType,
      status: r.general.status,
      location: r.general.location,
      organization: r.general.organization,
      owner: r.general.owner,
      primaryMetric: {
        label: metric.primary.label,
        value: metric.primary.getValue(r),
      },
      secondaryMetric: {
        label: metric.secondary.label,
        value: metric.secondary.getValue(r),
      },
      deploymentDate: r.general.deploymentDate,
      constraintLevel: r.constraint.constraintLevel,
    }
  })
})

// ============================================================
// 筛选与分页
// ============================================================

const typeOptions = platformOptions
const statusOpts = statusOptions

const organizationOptions = computed(() =>
  [...new Set(resources.value.map((r) => r.general.organization))]
)

const filteredResources = computed(() =>
  listItems.value.filter((resource) => {
    const query = keyword.value.trim().toLowerCase()
    const matchedQuery =
      !query ||
      [resource.platformName, resource.platformCode, resource.location].some((v) =>
        v.toLowerCase().includes(query)
      )
    return (
      matchedQuery &&
      (!typeFilter.value || resource.platformType === typeFilter.value) &&
      (!statusFilter.value || resource.status === statusFilter.value) &&
      (!organizationFilter.value || resource.organization === organizationFilter.value)
    )
  })
)

const displayedResources = computed(() => {
  const list = [...filteredResources.value]
  if (sort.value.prop && sort.value.order) {
    const prop = sort.value.prop
    list.sort((a, b) => {
      const aVal = String((a as any)[prop] ?? '')
      const bVal = String((b as any)[prop] ?? '')
      const result = aVal.localeCompare(bVal)
      return sort.value.order === 'ascending' ? result : -result
    })
  }
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

// ============================================================
// 方法
// ============================================================

function resetPage() {
  currentPage.value = 1
}

function refresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(text.refreshed)
  }, 400)
}

function handleSort({ prop, order }: { prop: string | null; order: 'ascending' | 'descending' | null }) {
  sort.value = { prop: (prop ?? '') as keyof PlatformListItem | '', order }
}

function openCreate() {
  formMode.value = 'create'
  editingResource.value = null
  formVisible.value = true
}

function openEdit(resource: PlatformListItem) {
  formMode.value = 'edit'
  // 从list数据找到完整的metadata
  const full = resources.value.find((r) => r.general.platformId === resource.platformId)
  if (full) {
    editingResource.value = { ...full }
    formVisible.value = true
  }
}

function openDetail(resource: PlatformListItem) {
  const full = resources.value.find((r) => r.general.platformId === resource.platformId)
  if (full) {
    selectedResource.value = { ...full }
    drawerVisible.value = true
  }
}

function saveResource(resource: PlatformMetadata) {
  if (formMode.value === 'create') {
    resources.value.unshift(resource)
  } else {
    const index = resources.value.findIndex((item) => item.general.platformId === resource.general.platformId)
    if (index >= 0) resources.value[index] = resource
  }
  resetPage()
  ElMessage.success(formMode.value === 'create' ? text.created : text.saved)
}

async function removeResource(resource: PlatformListItem) {
  await ElMessageBox.confirm(text.deleteMessage, text.deleteTitle, {
    type: 'warning',
    confirmButtonText: text.deleteConfirm,
    cancelButtonText: text.cancel,
  })
  resources.value = resources.value.filter((item) => item.general.platformId !== resource.platformId)
  ElMessage.success(text.deleted)
}

function typeLabel(type: PlatformType) {
  return getPlatformLabel(type)
}
function statusLabel(status: PlatformStatus) {
  return getStatusLabel(status)
}
function typeTagType(type: PlatformType) {
  return getPlatformTagType(type)
}
function statusType(status: PlatformStatus) {
  return getStatusTagType(status)
}
</script>

<template>
  <section class="resource-management">
    <!-- 工具栏 -->
    <div class="resource-management__toolbar">
      <div class="resource-management__filters">
        <el-input v-model="keyword" clearable :placeholder="text.search" @input="resetPage" />

        <el-select v-model="typeFilter" clearable :placeholder="text.type" @change="resetPage">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="statusFilter" clearable :placeholder="text.status" @change="resetPage">
          <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column prop="platformName" :label="text.name" min-width="150" sortable="custom" />
      <el-table-column prop="platformCode" :label="text.code" min-width="140" sortable="custom" />
      <el-table-column prop="platformType" :label="text.typeColumn" width="110" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="typeTagType(row.platformType)">{{ typeLabel(row.platformType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" :label="text.location" min-width="140" sortable="custom" />
      <el-table-column prop="organization" :label="text.organizationColumn" min-width="130" sortable="custom" />
      <el-table-column prop="status" :label="text.statusColumn" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="primaryMetric" :label="text.primaryMetric" min-width="120" sortable="custom">
        <template #default="{ row }">
          <span>{{ row.primaryMetric.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="secondaryMetric" :label="text.secondaryMetric" min-width="120" sortable="custom">
        <template #default="{ row }">
          <span>{{ row.secondaryMetric.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deploymentDate" :label="text.createdAt" min-width="150" sortable="custom" />
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
    <ResourceFormDialog
      v-model="formVisible"
      :mode="formMode"
      :resource="editingResource"
      @save="saveResource"
    />
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