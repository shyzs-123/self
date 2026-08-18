<script setup lang="ts">
import { computed } from 'vue'

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

// ==================== Props & Emits ====================

const props = defineProps<{
  modelValue: boolean
  dataResource: DataResource | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// ==================== 文案配置 ====================

const text = {
  title: '数据资源详情',
  empty: '暂无数据资源详情',
  // 基础信息
  basic: '基础信息',
  name: '数据集名称',
  source: '数据来源',
  dataType: '数据类型',
  coverageArea: '覆盖区域',
  qualityStatus: '质量状态',
  timeRange: '时间范围',
  updatedAt: '更新时间',
  indicatorIds: '关联指标',
  // 元数据
  metadata: '元数据',
  productType: '产品类型',
  coordinateSystem: '坐标系统',
  spatialResolution: '空间分辨率',
  transportVolume: '运量',
  collectionTime: '采集时间',
  processingFlow: '处理流程',
  // 数据结构
  dataStructure: '数据结构',
  sceneId: '场景编号',
  coverageRange: '覆盖范围',
  qualityControl: '质量控制',
  // 时空属性
  spatialTemporal: '时空属性',
  startTime: '开始时间',
  endTime: '结束时间',
  timeGranularity: '时间粒度',
  // 质量规则
  qualityRules: '质量规则',
  // 通用
  remark: '备注',
  createdAt: '创建时间',
  createdBy: '创建人'
}

// ==================== 标签映射 ====================

const dataTypeLabels: Record<DataTypeEnum, string> = {
  '数值型': '数值型',
  '文本型': '文本型',
  '布尔型': '布尔型',
  '二进制': '二进制',
  '影像': '影像',
  '矢量': '矢量'
}

const qualityLabels: Record<QualityStatusEnum, string> = {
  '合格': '合格',
  '存疑': '存疑',
  '不合格': '不合格',
  '待检': '待检'
}

function dataTypeLabel(type: DataTypeEnum): string {
  return dataTypeLabels[type] || type
}

function qualityLabel(status: QualityStatusEnum): string {
  return qualityLabels[status] || status
}

function qualityTagType(status: QualityStatusEnum): string {
  const map: Record<QualityStatusEnum, string> = {
    '合格': 'success',
    '存疑': 'warning',
    '不合格': 'danger',
    '待检': 'info'
  }
  return map[status] || 'info'
}

// ==================== 基础信息表格数据（每行两个字段） ====================

const basicRows = computed(() => {
  if (!props.dataResource) return []
  const r = props.dataResource
  return [
    { leftLabel: text.name, leftValue: r.name, rightLabel: text.source, rightValue: r.source },
    { leftLabel: text.dataType, leftValue: dataTypeLabel(r.dataType), rightLabel: text.coverageArea, rightValue: r.coverageArea },
    { leftLabel: text.qualityStatus, leftValue: qualityLabel(r.qualityStatus), rightLabel: text.timeRange, rightValue: r.timeRange },
    { leftLabel: text.updatedAt, leftValue: r.updatedAt, rightLabel: text.createdAt, rightValue: r.createdAt }
  ]
})

// ==================== 元数据表格数据 ====================

const metadataRows = computed(() => {
  if (!props.dataResource) return []
  const m = props.dataResource.metadata
  return [
    { leftLabel: text.productType, leftValue: m.productType, rightLabel: text.coordinateSystem, rightValue: m.coordinateSystem },
    { leftLabel: text.spatialResolution, leftValue: m.spatialResolution, rightLabel: text.transportVolume, rightValue: m.transportVolume },
    { leftLabel: text.collectionTime, leftValue: m.collectionTime, rightLabel: text.processingFlow, rightValue: m.processingFlow }
  ]
})

// ==================== 数据结构表格数据 ====================

const structureRows = computed(() => {
  if (!props.dataResource) return []
  const s = props.dataResource.dataStructure
  return [
    { leftLabel: text.sceneId, leftValue: s.sceneId, rightLabel: text.collectionTime, rightValue: s.collectionTime },
    { leftLabel: text.coverageRange, leftValue: s.coverageRange, rightLabel: text.qualityControl, rightValue: s.qualityControl }
  ]
})

// ==================== 时空属性表格数据 ====================

const spatialRows = computed(() => {
  if (!props.dataResource) return []
  const st = props.dataResource.spatialTemporal
  return [
    { leftLabel: text.startTime, leftValue: st.startTime, rightLabel: text.endTime, rightValue: st.endTime },
    { leftLabel: text.coverageArea, leftValue: st.coverageArea, rightLabel: text.timeGranularity, rightValue: st.timeGranularity },
    { leftLabel: text.coordinateSystem, leftValue: st.coordinateSystem, rightLabel: '', rightValue: '' }
  ]
})
</script>

<template>
  <el-drawer v-model="visible" :title="text.title" size="620px" destroy-on-close>
    <el-empty v-if="!dataResource" :description="text.empty" />

    <div v-else class="detail">
      <!-- ===== 基础信息 ===== -->
      <section>
        <h3>{{ text.basic }}</h3>
        <el-table :data="basicRows" border style="width: 100%">
          <el-table-column prop="leftLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.leftLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leftValue" label="" min-width="150">
            <template #default="{ row }">
              <el-tag v-if="row.leftLabel === text.qualityStatus" :type="qualityTagType(dataResource.qualityStatus)">
                {{ row.leftValue }}
              </el-tag>
              <span v-else>{{ row.leftValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.rightLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.rightValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- ===== 元数据 ===== -->
      <section>
        <h3>{{ text.metadata }}</h3>
        <el-table :data="metadataRows" border style="width: 100%">
          <el-table-column prop="leftLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.leftLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leftValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.leftValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.rightLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.rightValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- ===== 数据结构 ===== -->
      <section>
        <h3>{{ text.dataStructure }}</h3>
        <el-table :data="structureRows" border style="width: 100%">
          <el-table-column prop="leftLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.leftLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leftValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.leftValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.rightLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.rightValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- ===== 时空属性 ===== -->
      <section>
        <h3>{{ text.spatialTemporal }}</h3>
        <el-table :data="spatialRows" border style="width: 100%">
          <el-table-column prop="leftLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.leftLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leftValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.leftValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightLabel" label="" width="100">
            <template #default="{ row }">
              <span class="label-cell">{{ row.rightLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rightValue" label="" min-width="150">
            <template #default="{ row }">
              <span>{{ row.rightValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- ===== 质量规则 ===== -->
      <section>
        <h3>{{ text.qualityRules }}</h3>
        <div class="quality-rules-content">
          {{ dataResource.qualityRules || '暂无质量规则' }}
        </div>
      </section>

      <!-- ===== 备注 ===== -->
      <section>
        <h3>{{ text.remark }}</h3>
        <div class="remark-content">
          {{ dataResource.remark || '暂无备注' }}
        </div>
      </section>
    </div>
  </el-drawer>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 4px 0;
}

.detail section {
  padding-bottom: 4px;
}

.detail h3 {
  margin: 0 0 12px;
  color: #1e3a5f;
  font-size: 15px;
  font-weight: 600;
}

/* 表格样式 */
:deep(.el-table) {
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #ebeef5;
}

:deep(.el-table th) {
  display: none;
}

:deep(.el-table td) {
  padding: 0;
}

:deep(.el-table .cell) {
  padding: 10px 14px;
  line-height: 1.4;
}

/* 字段名列样式 - 背景色深一些 */
.label-cell {
  display: block;
  background-color: #f5f7fa;
  color: #475569;
  font-weight: 600;
  padding: 10px 14px;
  margin: -10px -14px;
}

/* 值列样式 */
:deep(.el-table td:not(:first-child) .cell) {
  color: #1f2937;
}

/* 质量状态标签 */
:deep(.el-table .cell .el-tag) {
  font-size: 13px;
}

/* 去掉表格底部边框线 */
:deep(.el-table__inner-wrapper::before) {
  display: none;
}

/* 每行边框 */
:deep(.el-table__body tr) {
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__body tr:last-child) {
  border-bottom: none;
}

/* 质量规则和备注内容 */
.quality-rules-content,
.remark-content {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  color: #1f2937;
  line-height: 1.7;
  font-size: 14px;
  border: 1px solid #ebeef5;
}
</style>