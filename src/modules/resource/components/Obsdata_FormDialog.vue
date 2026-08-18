<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

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
  updatedAt?: string
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

// 表单数据类型（排除 id 和 createdAt）
type FormData = Omit<DataResource, 'id' | 'createdAt'>

// ==================== Props & Emits ====================

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  dataResource: DataResource | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', dataResource: DataResource): void
}>()

// ==================== 文案配置 ====================

const text = {
  // 弹窗标题
  create: '新增数据集',
  edit: '编辑数据集',
  save: '保存',
  cancel: '取消',
  // 分组标题
  basicInfo: '基础信息',
  metadataInfo: '元数据',
  dataStructureInfo: '数据结构',
  spatialTemporalInfo: '时空属性',
  qualityRulesInfo: '质量规则',
  // 基础信息
  name: '数据集名称',
  source: '数据来源',
  dataType: '数据类型',
  coverageArea: '覆盖区域',
  qualityStatus: '质量状态',
  timeRange: '时间范围',
  indicatorIds: '关联指标',
  // 元数据
  productType: '产品类型',
  coordinateSystem: '坐标系统',
  spatialResolution: '空间分辨率',
  transportVolume: '运量',
  collectionTime: '采集时间',
  processingFlow: '处理流程',
  // 数据结构
  sceneId: '场景编号',
  coverageRange: '覆盖范围',
  qualityControl: '质量控制',
  // 时空属性
  startTime: '开始时间',
  endTime: '结束时间',
  timeGranularity: '时间粒度',
  // 质量规则
  qualityRules: '质量规则',
  // 通用
  remark: '备注',
  select: '请选择',
  input: '请输入'
}

// ==================== 常量数据 ====================

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

const coordinateSystemOptions = [
  { value: 'WGS84' as const, label: 'WGS84' },
  { value: 'CGCS2000' as const, label: 'CGCS2000' },
  { value: 'UTM' as const, label: 'UTM' },
  { value: '其他' as const, label: '其他' }
]

// ==================== 响应式数据 ====================

const formRef = ref<FormInstance>()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => props.mode === 'create' ? text.create : text.edit)

// 默认元数据
const defaultMetadata = (): Metadata => ({
  productType: '',
  coordinateSystem: 'WGS84',
  spatialResolution: '',
  transportVolume: '',
  collectionTime: '',
  processingFlow: ''
})

// 默认数据结构
const defaultDataStructure = (): DataStructure => ({
  sceneId: '',
  collectionTime: '',
  coverageRange: '',
  qualityControl: ''
})

// 默认时空属性
const defaultSpatialTemporal = (): SpatialTemporal => ({
  startTime: '',
  endTime: '',
  coverageArea: '',
  coordinateSystem: 'WGS84',
  timeGranularity: ''
})

const form = reactive<FormData>({
  // 基础信息
  name: '',
  source: '',
  dataType: '数值型',
  coverageArea: '',
  qualityStatus: '待检',
  timeRange: '',
  indicatorIds: [],
  // 元数据
  metadata: defaultMetadata(),
  // 数据结构
  dataStructure: defaultDataStructure(),
  // 时空属性
  spatialTemporal: defaultSpatialTemporal(),
  // 质量规则
  qualityRules: '',
  // 通用
  remark: '',
  createdBy: ''
})

// ==================== 表单验证规则 ====================

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入数据集名称', trigger: 'blur' }],
  source: [{ required: true, message: '请输入数据来源', trigger: 'blur' }],
  dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
  coverageArea: [{ required: true, message: '请输入覆盖区域', trigger: 'blur' }],
  qualityStatus: [{ required: true, message: '请选择质量状态', trigger: 'change' }],
  timeRange: [{ required: true, message: '请输入时间范围', trigger: 'blur' }],
  'metadata.productType': [{ required: true, message: '请输入产品类型', trigger: 'blur' }],
  'dataStructure.sceneId': [{ required: true, message: '请输入场景编号', trigger: 'blur' }],
  'spatialTemporal.startTime': [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
  'spatialTemporal.endTime': [{ required: true, message: '请输入结束时间', trigger: 'blur' }]
}

// ==================== 方法 ====================

function reset() {
  Object.assign(form, {
    name: '',
    source: '',
    dataType: '数值型',
    coverageArea: '',
    qualityStatus: '待检',
    timeRange: '',
    indicatorIds: [],
    metadata: defaultMetadata(),
    dataStructure: defaultDataStructure(),
    spatialTemporal: defaultSpatialTemporal(),
    qualityRules: '',
    remark: '',
    createdBy: ''
  })
}

watch(() => props.modelValue, (opened) => {
  if (!opened) return
  reset()
  if (props.mode === 'edit' && props.dataResource) {
    const { id, createdAt, ...rest } = props.dataResource
    Object.assign(form, rest)
  }
  setTimeout(() => formRef.value?.clearValidate(), 0)
})

function close() {
  visible.value = false
}

async function save() {
  if (!formRef.value) return
  await formRef.value.validate()

  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  const previous = props.dataResource

  emit('save', {
    id: previous?.id ?? `DR-${Date.now()}`,
    ...form,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now
  })

  close()
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="780px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="left">
      <!-- ============================================================ -->
      <!-- 基础信息 -->
      <!-- ============================================================ -->
      <div class="section-title">{{ text.basicInfo }}</div>

      <div class="grid">
        <el-form-item :label="text.name" prop="name">
          <el-input v-model="form.name" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.source" prop="source">
          <el-input v-model="form.source" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.dataType" prop="dataType">
          <el-select v-model="form.dataType" :placeholder="text.select">
            <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="text.coverageArea" prop="coverageArea">
          <el-input v-model="form.coverageArea" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.qualityStatus" prop="qualityStatus">
          <el-select v-model="form.qualityStatus" :placeholder="text.select">
            <el-option v-for="item in qualityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="text.timeRange" prop="timeRange">
          <el-input v-model="form.timeRange" :placeholder="text.input" />
        </el-form-item>
      </div>

      <el-form-item :label="text.indicatorIds" prop="indicatorIds">
        <el-input v-model="form.indicatorIds" :placeholder="'请输入关联指标ID，用逗号分隔'" />
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 元数据 -->
      <!-- ============================================================ -->
      <div class="section-title">{{ text.metadataInfo }}</div>

      <div class="grid">
        <el-form-item :label="text.productType" prop="metadata.productType">
          <el-input v-model="form.metadata.productType" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.coordinateSystem" prop="metadata.coordinateSystem">
          <el-select v-model="form.metadata.coordinateSystem" :placeholder="text.select">
            <el-option v-for="item in coordinateSystemOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.spatialResolution" prop="metadata.spatialResolution">
          <el-input v-model="form.metadata.spatialResolution" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.transportVolume" prop="metadata.transportVolume">
          <el-input v-model="form.metadata.transportVolume" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.collectionTime" prop="metadata.collectionTime">
          <el-input v-model="form.metadata.collectionTime" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.processingFlow" prop="metadata.processingFlow">
          <el-input v-model="form.metadata.processingFlow" :placeholder="text.input" />
        </el-form-item>
      </div>

      <!-- ============================================================ -->
      <!-- 数据结构 -->
      <!-- ============================================================ -->
      <div class="section-title">{{ text.dataStructureInfo }}</div>

      <div class="grid">
        <el-form-item :label="text.sceneId" prop="dataStructure.sceneId">
          <el-input v-model="form.dataStructure.sceneId" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.collectionTime" prop="dataStructure.collectionTime">
          <el-input v-model="form.dataStructure.collectionTime" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.coverageRange" prop="dataStructure.coverageRange">
          <el-input v-model="form.dataStructure.coverageRange" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.qualityControl" prop="dataStructure.qualityControl">
          <el-input v-model="form.dataStructure.qualityControl" :placeholder="text.input" />
        </el-form-item>
      </div>

      <!-- ============================================================ -->
      <!-- 时空属性 -->
      <!-- ============================================================ -->
      <div class="section-title">{{ text.spatialTemporalInfo }}</div>

      <div class="grid">
        <el-form-item :label="text.startTime" prop="spatialTemporal.startTime">
          <el-input v-model="form.spatialTemporal.startTime" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.endTime" prop="spatialTemporal.endTime">
          <el-input v-model="form.spatialTemporal.endTime" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.coverageArea" prop="spatialTemporal.coverageArea">
          <el-input v-model="form.spatialTemporal.coverageArea" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.timeGranularity" prop="spatialTemporal.timeGranularity">
          <el-input v-model="form.spatialTemporal.timeGranularity" :placeholder="text.input" />
        </el-form-item>
      </div>

      <el-form-item :label="text.coordinateSystem" prop="spatialTemporal.coordinateSystem">
        <el-select v-model="form.spatialTemporal.coordinateSystem" :placeholder="text.select">
          <el-option v-for="item in coordinateSystemOptions" :key="item.value" :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 质量规则 -->
      <!-- ============================================================ -->
      <div class="section-title">{{ text.qualityRulesInfo }}</div>

      <el-form-item :label="text.qualityRules" prop="qualityRules">
        <el-input v-model="form.qualityRules" type="textarea" :rows="3" :placeholder="'请输入质量规则，如：缺失值率 ≤ 5%'" />
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 备注 -->
      <!-- ============================================================ -->
      <el-form-item :label="text.remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="text.input" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">{{ text.cancel }}</el-button>
      <el-button type="primary" @click="save">{{ text.save }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  margin: 16px 0 12px 0;
  padding-left: 10px;
  color: #1e3a5f;
  font-size: 15px;
  font-weight: 600;
  border-left: 3px solid #1677ff;
  line-height: 1.4;
}

.section-title:first-of-type {
  margin-top: 0;
}

:deep(.el-select) {
  width: 100%;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a5f;
}

:deep(.el-dialog__body) {
  padding: 24px;
  max-height: 65vh;
  overflow-y: auto;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #334155;
}

:deep(.el-textarea__inner) {
  resize: none;
}
</style>