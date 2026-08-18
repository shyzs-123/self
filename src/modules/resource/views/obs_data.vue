<template>
  <section class="data-resource-management">
    <!-- 工具栏 -->
    <div class="data-resource-management__toolbar">
      <div class="data-resource-management__filters">
        <el-input v-model="keyword" clearable :placeholder="text.search" @input="resetPage" />

        <el-select v-model="dataTypeFilter" clearable :placeholder="text.dataType" @change="resetPage">
          <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="qualityFilter" clearable :placeholder="text.quality" @change="resetPage">
          <el-option v-for="item in qualityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="sourceFilter" clearable :placeholder="text.source" @change="resetPage">
          <el-option v-for="source in sourceOptions" :key="source" :label="source" :value="source" />
        </el-select>

        <el-button :loading="loading" @click="refresh">{{ text.refresh }}</el-button>
        <el-button type="primary" @click="openCreate">{{ text.create }}</el-button>
      </div>
    </div>

    <!-- 数据资源列表 -->
    <el-table v-loading="loading" :data="displayedDataResources" class="data-resource-management__table" height="100%"
      @sort-change="handleSort">
      <el-table-column prop="name" :label="text.name" min-width="150" sortable="custom" />
      <el-table-column prop="source" :label="text.source" min-width="140" sortable="custom" />
      <el-table-column prop="dataType" :label="text.dataTypeColumn" width="110" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="dataTypeTagType(row.dataType)">{{ row.dataType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="coverageArea" :label="text.coverageArea" min-width="140" sortable="custom" />
      <el-table-column prop="qualityStatus" :label="text.qualityColumn" width="105" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="qualityTagType(row.qualityStatus)">{{ row.qualityStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" :label="text.updatedAt" min-width="150" sortable="custom" />
      <el-table-column :label="text.actions" width="200" fixed="right">
        <template #default="{ row }">
          <div class="data-resource-management__actions">
            <el-button link type="primary" @click="openDetail(row)">{{ text.view }}</el-button>
            <el-button link type="primary" @click="openEdit(row)">{{ text.edit }}</el-button>
            <el-button link type="primary" @click="openExport(row)">{{ text.export }}</el-button>
            <el-button link type="danger" @click="removeDataResource(row)">{{ text.remove }}</el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="text.empty" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="data-resource-management__pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
        :total="filteredDataResources.length" :page-sizes="[5, 8, 12]" layout="total, sizes, prev, pager, next" />
    </div>

    <!-- 弹窗和抽屉 -->
    <Obsdata_FormDialog v-model="formVisible" :mode="formMode" :data-resource="editingDataResource"
      @save="saveDataResource" />
    <Obsdata_DetailDrawer v-model="drawerVisible" :data-resource="selectedDataResource" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Obsdata_FormDialog from '@/modules/resource/components/Obsdata_FormDialog.vue'
import Obsdata_DetailDrawer from '@/modules/resource/components/Obsdata_DetailDrawer.vue'

// ==================== 类型定义 ====================

/** 数据类型 */
type DataTypeEnum = '数值型' | '文本型' | '布尔型' | '二进制' | '影像' | '矢量'

/** 质量状态 */
type QualityStatusEnum = '合格' | '存疑' | '不合格' | '待检'

/** 坐标系统 */
type CoordinateSystemEnum = 'WGS84' | 'CGCS2000' | 'UTM' | '其他'

/** 元数据 */
type Metadata = {
  productType: string
  coordinateSystem: CoordinateSystemEnum
  spatialResolution: string
  transportVolume: string
  collectionTime: string
  processingFlow: string
}

/** 数据结构 */
type DataStructure = {
  sceneId: string
  collectionTime: string
  coverageRange: string
  qualityControl: string
}

/** 时空属性 */
type SpatialTemporal = {
  startTime: string
  endTime: string
  coverageArea: string
  coordinateSystem: CoordinateSystemEnum
  timeGranularity: string
}

/** 数据资源完整类型 */
type DataResource = {
  // ===== 基础信息 =====
  id: string
  name: string
  source: string
  timeRange: string
  coverageArea: string
  dataType: DataTypeEnum
  qualityStatus: QualityStatusEnum
  updatedAt: string
  remark: string
  indicatorIds: string[]

  // ===== 元数据 =====
  metadata: Metadata

  // ===== 数据结构 =====
  dataStructure: DataStructure

  // ===== 时空属性 =====
  spatialTemporal: SpatialTemporal

  // ===== 质量规则 =====
  qualityRules: string

  // ===== 通用 =====
  createdAt: string
  createdBy: string
}

// ==================== 文案配置 ====================

const text = {
  search: '搜索数据集名称、来源、区域',
  dataType: '数据类型',
  quality: '质量状态',
  source: '数据来源',
  refresh: '刷新',
  create: '新增数据集',
  view: '查看',
  edit: '编辑',
  remove: '删除',
  empty: '暂无匹配数据',
  refreshed: '数据列表已刷新',
  created: '数据集已创建',
  saved: '数据集已保存',
  deleted: '数据集已删除',
  deleteTitle: '删除确认',
  deleteMessage: '确认删除该数据集？',
  deleteConfirm: '删除',
  cancel: '取消',
  name: '数据集名称',
  dataTypeColumn: '数据类型',
  coverageArea: '覆盖区域',
  qualityColumn: '质量状态',
  updatedAt: '更新时间',
  actions: '操作',
  export: '导出'
}

// ==================== 响应式数据 ====================

const dataResources = ref<DataResource[]>([
  makeDataResource('DR-001', '华北地区地表温度数据集', '高分一号卫星', '数值型', '华北地区', '合格'),
  makeDataResource('DR-002', '全国植被覆盖指数数据集', 'MODIS卫星', '影像', '全国', '合格'),
  makeDataResource('DR-003', '长三角水质监测数据', '地面监测站', '数值型', '长三角地区', '存疑')
])

const loading = ref(false)
const keyword = ref('')
const dataTypeFilter = ref<DataTypeEnum | ''>('')
const qualityFilter = ref<QualityStatusEnum | ''>('')
const sourceFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const sort = ref<{ prop: keyof DataResource | ''; order: 'ascending' | 'descending' | null }>({
  prop: '',
  order: null
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingDataResource = ref<DataResource | null>(null)
const drawerVisible = ref(false)
const selectedDataResource = ref<DataResource | null>(null)

// ==================== 常量选项 ====================

const dataTypeOptions = [
  { value: '数值型' as const, label: '数值型' },
  { value: '文本型' as const, label: '文本型' },
  { value: '布尔型' as const, label: '布尔型' },
  { value: '二进制' as const, label: '二进制' },
  { value: '影像' as const, label: '影像' },
  { value: '矢量' as const, label: '矢量' }
]

const qualityOptions = [
  { value: '合格' as const, label: '合格' },
  { value: '存疑' as const, label: '存疑' },
  { value: '不合格' as const, label: '不合格' },
  { value: '待检' as const, label: '待检' }
]

// ==================== 计算属性 ====================

const sourceOptions = computed(() =>
  [...new Set(dataResources.value.map((r) => r.source))]
)

const filteredDataResources = computed(() =>
  dataResources.value.filter((resource) => {
    const query = keyword.value.trim().toLowerCase()
    const matchedQuery = !query ||
      [resource.name, resource.source, resource.coverageArea].some((v) => v.toLowerCase().includes(query))
    return matchedQuery &&
      (!dataTypeFilter.value || resource.dataType === dataTypeFilter.value) &&
      (!qualityFilter.value || resource.qualityStatus === qualityFilter.value) &&
      (!sourceFilter.value || resource.source === sourceFilter.value)
  })
)

const displayedDataResources = computed(() => {
  const list = [...filteredDataResources.value]
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

function makeDataResource(
  id: string,
  name: string,
  source: string,
  dataType: DataTypeEnum,
  coverageArea: string,
  qualityStatus: QualityStatusEnum
): DataResource {
  return {
    id,
    name,
    source,
    timeRange: '2026-01-01 ~ 2026-08-17',
    coverageArea,
    dataType,
    qualityStatus,
    updatedAt: '2026-08-17 14:30:00',
    remark: '用于城市热岛效应分析',
    indicatorIds: ['IND-001', 'IND-003'],
    metadata: {
      productType: 'LST 地表温度产品',
      coordinateSystem: 'WGS84',
      spatialResolution: '30m',
      transportVolume: '2.5GB',
      collectionTime: '2026-08-17 10:00:00',
      processingFlow: '辐射定标 → 大气校正 → 地表温度反演'
    },
    dataStructure: {
      sceneId: `SCENE-${id}-001`,
      collectionTime: '2026-08-17 10:00:00',
      coverageRange: '经度：113°E-120°E，纬度：35°N-42°N',
      qualityControl: '云量 < 10%，无异常值'
    },
    spatialTemporal: {
      startTime: '2026-01-01 00:00:00',
      endTime: '2026-08-17 23:59:59',
      coverageArea: '华北地区',
      coordinateSystem: 'WGS84',
      timeGranularity: '日'
    },
    qualityRules: '缺失值率 ≤ 5%；异常值占比 ≤ 1%；与地面站点数据偏差 ≤ 2°C',
    createdAt: '2026-01-15 09:00:00',
    createdBy: 'admin'
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
  sort.value = { prop: (prop ?? '') as keyof DataResource | '', order }
}

function openCreate() {
  formMode.value = 'create'
  editingDataResource.value = null
  formVisible.value = true
}

function openEdit(resource: DataResource) {
  formMode.value = 'edit'
  editingDataResource.value = { ...resource }
  formVisible.value = true
}
function openExport(resource: DataResource) {
  formMode.value = 'edit'
  editingDataResource.value = { ...resource }
  formVisible.value = true
}
function openDetail(resource: DataResource) {
  selectedDataResource.value = { ...resource }
  drawerVisible.value = true
}

function saveDataResource(resource: DataResource) {
  if (formMode.value === 'create') {
    dataResources.value.unshift(resource)
  } else {
    const index = dataResources.value.findIndex((item) => item.id === resource.id)
    if (index >= 0) dataResources.value[index] = resource
  }
  resetPage()
  ElMessage.success(formMode.value === 'create' ? text.created : text.saved)
}

async function removeDataResource(resource: DataResource) {
  await ElMessageBox.confirm(text.deleteMessage, text.deleteTitle, {
    type: 'warning',
    confirmButtonText: text.deleteConfirm,
    cancelButtonText: text.cancel
  })
  dataResources.value = dataResources.value.filter((item) => item.id !== resource.id)
  ElMessage.success(text.deleted)
}

function dataTypeTagType(type: DataTypeEnum) {
  const map: Record<DataTypeEnum, string> = {
    '数值型': 'primary',
    '文本型': 'success',
    '布尔型': 'warning',
    '二进制': 'info',
    '影像': 'danger',
    '矢量': 'success'
  }
  return map[type] || 'info'
}

function qualityTagType(status: QualityStatusEnum) {
  const map: Record<QualityStatusEnum, string> = {
    '合格': 'success',
    '存疑': 'warning',
    '不合格': 'danger',
    '待检': 'info'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.data-resource-management {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

.data-resource-management__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.data-resource-management__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.data-resource-management__filters .el-input,
.data-resource-management__filters .el-select {
  width: 200px;
}

.data-resource-management__filters .el-button {
  flex-shrink: 0;
}

.data-resource-management__table {
  flex: 1;
  min-height: 360px;
}

.data-resource-management__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 1px;
}

.data-resource-management__pagination {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1100px) {
  .data-resource-management__filters {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>
