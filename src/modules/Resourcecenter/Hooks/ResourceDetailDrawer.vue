<script setup lang="ts">
import { computed } from 'vue'

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

type Resource = {
  id: string
  name: string
  code: string
  type: Type
  location: string
  organization: string
  status: Status
  createdAt: string
  description: string
  capabilities: string
  interfaceAddress: string
  remark: string
  updatedAt?: string
  capabilityList?: CapabilityItem[]
}

// ==================== Props & Emits ====================

const props = defineProps<{
  modelValue: boolean
  resource: Resource | null
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
  title: '资源详情',
  empty: '暂无资源详情',
  basic: '基础信息',
  interfaceInfo: '接口信息',
  capabilityInfo: '能力信息',
  name: '资源名称',
  code: '资源编码',
  type: '资源类型',
  location: '部署位置',
  organization: '所属单位',
  status: '运行状态',
  createdAt: '创建时间',
  interfaceAddress: '接口地址',
  remark: '备注',
  // 能力字段
  capabilityIndex: '能力',
  observableTarget: '可观测对象',
  observationElements: '观测要素',
  observationPrecision: '观测精度',
  spatialResolution: '空间分辨率',
  temporalResolution: '时间分辨率',
  coverageRange: '覆盖范围',
  monitoringFrequency: '监测频次',
  workHours: '工作时段',
  environmentalLimits: '环境限制',
  availableTime: '可用时间'
}

// ==================== 标签映射 ====================

const typeLabels: Record<Type, string> = {
  satellite: '卫星遥感',
  platform: '平台',
  sensor: '传感器',
  ground: '地面站'
}

const statusLabels: Record<Status, string> = {
  online: '运行中',
  offline: '离线',
  maintenance: '维护中',
  disabled: '已停用'
}

function typeLabel(type: Type): string {
  return typeLabels[type] || type
}

function statusLabel(status: Status): string {
  return statusLabels[status] || status
}

function statusTagType(status: Status): string {
  const map: Record<Status, string> = {
    online: 'success',
    offline: 'danger',
    maintenance: 'warning',
    disabled: 'info'
  }
  return map[status] || 'info'
}

// ==================== 基础信息表格数据（每行两个字段） ====================

const basicRows = computed(() => {
  if (!props.resource) return []
  const r = props.resource
  return [
    { leftLabel: text.name, leftValue: r.name, rightLabel: text.code, rightValue: r.code },
    { leftLabel: text.type, leftValue: typeLabel(r.type), rightLabel: text.organization, rightValue: r.organization },
    { leftLabel: text.location, leftValue: r.location, rightLabel: text.status, rightValue: statusLabel(r.status) },
    { leftLabel: text.createdAt, leftValue: r.createdAt, rightLabel: '', rightValue: '' }
  ]
})

// ==================== 接口信息数据 ====================

const interfaceRows = computed(() => {
  if (!props.resource) return []
  const r = props.resource
  return [
    { leftLabel: text.interfaceAddress, leftValue: r.interfaceAddress || '暂无接口地址', rightLabel: '', rightValue: '' },
    { leftLabel: text.remark, leftValue: r.remark || '暂无备注', rightLabel: '', rightValue: '' }
  ]
})

// ==================== 能力信息数据 ====================

const capabilityList = computed(() => {
  if (!props.resource) return []
  return props.resource.capabilityList || []
})

// 能力字段配置（用于循环渲染）
const capabilityFields = [
  { key: 'observableTarget', label: '可观测对象' },
  { key: 'observationElements', label: '观测要素' },
  { key: 'observationPrecision', label: '观测精度' },
  { key: 'spatialResolution', label: '空间分辨率' },
  { key: 'temporalResolution', label: '时间分辨率' },
  { key: 'coverageRange', label: '覆盖范围' },
  { key: 'monitoringFrequency', label: '监测频次' },
  { key: 'workHours', label: '工作时段' },
  { key: 'environmentalLimits', label: '环境限制' },
  { key: 'availableTime', label: '可用时间' }
]
</script>

<template>
  <el-drawer v-model="visible" :title="text.title" size="620px" destroy-on-close>
    <el-empty v-if="!resource" :description="text.empty" />

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
              <el-tag v-if="row.leftLabel === text.status" :type="statusTagType(resource.status)">
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

      <!-- ===== 接口信息 ===== -->
      <section>
        <h3>{{ text.interfaceInfo }}</h3>
        <el-table :data="interfaceRows" border style="width: 100%">
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
    
        </el-table>
      </section>

      <!-- ===== 能力信息 ===== -->
      <section>
        <h3>{{ text.capabilityInfo }}</h3>
        <div v-if="capabilityList.length === 0" class="empty-tip">
          暂无能力信息
        </div>
        <div v-else>
          <div
            v-for="(capability, index) in capabilityList"
            :key="capability.id"
            class="capability-card"
          >
            <div class="capability-header">
              <span class="capability-title">{{ text.capabilityIndex }} {{ index + 1 }}</span>
            </div>
            <el-table :data="capabilityFields" border style="width: 100%">
              <el-table-column prop="label" label="字段" width="110">
                <template #default="{ row }">
                  <span class="label-cell">{{ row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="key" label="值">
                <template #default="{ row }">
                  <span>{{ capability[row.key as keyof CapabilityItem] || '-' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
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

.empty-tip {
  padding: 20px 0;
  color: #a8abb2;
  text-align: center;
  font-size: 14px;
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

/* 运行状态标签 */
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

/* 能力卡片 */
.capability-card {
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.capability-card:last-child {
  margin-bottom: 0;
}

.capability-header {
  padding: 10px 16px;
  background-color: #fafbfc;
  border-bottom: 1px solid #ebeef5;
}

.capability-title {
  color: #1e3a5f;
  font-weight: 600;
  font-size: 14px;
}

.capability-card :deep(.el-table) {
  border: none;
  border-radius: 0;
}

.capability-card :deep(.el-table__body tr:last-child) {
  border-bottom: none;
}
</style>