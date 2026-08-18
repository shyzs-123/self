<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

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
  capabilityList?: CapabilityItem[]  // 能力列表
}

// 表单数据类型
type FormData = Omit<Resource, 'id' | 'createdAt'> & {
  capabilityList: CapabilityItem[]
}

// ==================== Props & Emits ====================

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  resource: Resource | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', resource: Resource): void
}>()

// ==================== 文案配置 ====================

const text = {
  create: '新增资源',
  edit: '编辑资源',
  save: '保存',
  cancel: '取消',
  // 基础信息
  name: '资源名称',
  code: '资源编码',
  type: '资源类型',
  location: '部署位置',
  organization: '所属单位',
  status: '运行状态',
  description: '描述信息',
  capabilities: '能力参数',
  interfaceAddress: '接口地址',
  remark: '备注',
  // 能力信息
  capability: '能力信息',
  capabilityIndex: '能力',
  addCapability: '新增能力',
  observableTarget: '可观测对象',
  observationElements: '观测要素',
  observationPrecision: '观测精度',
  spatialResolution: '空间分辨率',
  temporalResolution: '时间分辨率',
  coverageRange: '覆盖范围',
  monitoringFrequency: '监测频次',
  workHours: '工作时段',
  environmentalLimits: '环境限制',
  availableTime: '可用时间',
  select: '请选择',
  input: '请输入',
  delete: '删除'
}

// ==================== 常量数据 ====================

const typeOptions = [
  { value: 'satellite' as const, label: '卫星' },
  { value: 'platform' as const, label: '平台' },
  { value: 'sensor' as const, label: '传感器' },
  { value: 'ground' as const, label: '地面站' }
]

const statusOptions = [
  { value: 'online' as const, label: '运行中' },
  { value: 'offline' as const, label: '离线' },
  { value: 'maintenance' as const, label: '维护中' },
  { value: 'disabled' as const, label: '已停用' }
]

// ==================== 响应式数据 ====================

let capabilityIdCounter = 0

const formRef = ref<FormInstance>()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => props.mode === 'create' ? text.create : text.edit)

// 创建空能力项
function createEmptyCapability(): CapabilityItem {
  return {
    id: ++capabilityIdCounter,
    observableTarget: '',
    observationElements: '',
    observationPrecision: '',
    spatialResolution: '',
    temporalResolution: '',
    coverageRange: '',
    monitoringFrequency: '',
    workHours: '',
    environmentalLimits: '',
    availableTime: ''
  }
}

const form = reactive<FormData>({
  name: '',
  code: '',
  type: 'satellite',
  location: '',
  organization: '',
  status: 'online',
  description: '',
  capabilities: '',
  interfaceAddress: '',
  remark: '',
  capabilityList: [createEmptyCapability()]
})

// ==================== 表单验证规则 ====================

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入资源编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入部署位置', trigger: 'blur' }],
  organization: [{ required: true, message: '请输入所属单位', trigger: 'blur' }],
  status: [{ required: true, message: '请选择运行状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
  capabilities: [{ required: true, message: '请输入能力参数', trigger: 'blur' }],
  interfaceAddress: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

// ==================== 方法 ====================

function reset() {
  capabilityIdCounter = 0
  Object.assign(form, {
    name: '',
    code: '',
    type: 'satellite',
    location: '',
    organization: '',
    status: 'online',
    description: '',
    capabilities: '',
    interfaceAddress: '',
    remark: '',
    capabilityList: [createEmptyCapability()]
  })
}

watch(() => props.modelValue, (opened) => {
  if (!opened) return
  reset()
  if (props.mode === 'edit' && props.resource) {
    // 复制基础信息
    const { capabilityList, ...baseInfo } = props.resource
    Object.assign(form, baseInfo)
    // 复制能力列表
    if (props.resource.capabilityList && props.resource.capabilityList.length > 0) {
      form.capabilityList = props.resource.capabilityList.map((item) => ({
        ...item,
        id: ++capabilityIdCounter
      }))
    } else {
      form.capabilityList = [createEmptyCapability()]
    }
  }
  setTimeout(() => formRef.value?.clearValidate(), 0)
})

function close() {
  visible.value = false
}

// 新增能力
function addCapability() {
  form.capabilityList.push(createEmptyCapability())
}

// 删除能力
function removeCapability(index: number) {
  if (form.capabilityList.length <= 1) {
    // 至少保留一个空的能力项
    form.capabilityList = [createEmptyCapability()]
    return
  }
  form.capabilityList.splice(index, 1)
}

async function save() {
  if (!formRef.value) return
  await formRef.value.validate()

  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  const previous = props.resource

  // 过滤掉空的能力项（所有字段都为空）
  const validCapabilityList = form.capabilityList.filter((item) =>
    Object.values(item).some((val) => val && val.toString().trim() !== '')
  )

  emit('save', {
    id: previous?.id ?? `R-${Date.now()}`,
    ...form,
    capabilityList: validCapabilityList.length > 0 ? validCapabilityList : undefined,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now
  })

  close()
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="780px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
      <!-- ============================================================ -->
      <!-- 基础信息 -->
      <!-- ============================================================ -->
      <div class="section-title">基础信息</div>

      <el-form-item :label="text.name" prop="name">
        <el-input v-model="form.name" :placeholder="text.input" />
        
      </el-form-item>

      <el-form-item :label="text.code" prop="code">
        <el-input v-model="form.code" :placeholder="text.input" />
      </el-form-item>

      <div class="grid">
        <el-form-item :label="text.type" prop="type">
          <el-select v-model="form.type" :placeholder="text.select">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="text.organization" prop="organization">
          <el-input v-model="form.organization" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.location" prop="location">
          <el-input v-model="form.location" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.status" prop="status">
          <el-select v-model="form.status" :placeholder="text.select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item :label="text.interfaceAddress" prop="interfaceAddress">
        <el-input v-model="form.interfaceAddress" :placeholder="text.input" />
      </el-form-item>

      <el-form-item :label="text.description" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" :placeholder="text.input" />
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 能力信息（动态列表） -->
      <!-- ============================================================ -->
      <div class="section-title">
        <span>{{ text.capability }}</span>
        <el-button type="primary" size="small" plain @click="addCapability" style="margin-left: 12px">
          + {{ text.addCapability }}
        </el-button>
      </div>

      <div
        v-for="(capability, index) in form.capabilityList"
        :key="capability.id"
        class="capability-card"
      >
        <div class="capability-header">
          <span class="capability-title">{{ text.capabilityIndex }} {{ index + 1 }}</span>
          <el-button
            type="danger"
            size="small"
            link
            @click="removeCapability(index)"
          >
            {{ text.delete }}
          </el-button>
        </div>

        <div class="grid">
          <el-form-item :label="text.observableTarget">
            <el-input v-model="capability.observableTarget" :placeholder="text.input" />
          </el-form-item>

          <el-form-item :label="text.observationElements">
            <el-input v-model="capability.observationElements" :placeholder="text.input" />
          </el-form-item>
        </div>

        <div class="grid">
          <el-form-item :label="text.observationPrecision">
            <el-input v-model="capability.observationPrecision" :placeholder="text.input" />
          </el-form-item>

          <el-form-item :label="text.spatialResolution">
            <el-input v-model="capability.spatialResolution" :placeholder="text.input" />
          </el-form-item>
        </div>

        <div class="grid">
          <el-form-item :label="text.temporalResolution">
            <el-input v-model="capability.temporalResolution" :placeholder="text.input" />
          </el-form-item>

          <el-form-item :label="text.coverageRange">
            <el-input v-model="capability.coverageRange" :placeholder="text.input" />
          </el-form-item>
        </div>

        <div class="grid">
          <el-form-item :label="text.monitoringFrequency">
            <el-input v-model="capability.monitoringFrequency" :placeholder="text.input" />
          </el-form-item>

          <el-form-item :label="text.workHours">
            <el-input v-model="capability.workHours" :placeholder="text.input" />
          </el-form-item>
        </div>

        <div class="grid">
          <el-form-item :label="text.environmentalLimits">
            <el-input v-model="capability.environmentalLimits" :placeholder="text.input" />
          </el-form-item>

          <el-form-item :label="text.availableTime">
            <el-input v-model="capability.availableTime" :placeholder="text.input" />
          </el-form-item>
        </div>
      </div>

      <!-- 能力参数 -->
      <el-form-item :label="text.capabilities" prop="capabilities">
        <el-input v-model="form.capabilities" type="textarea" :rows="2" :placeholder="text.input" />
      </el-form-item>

      <!-- 备注 -->
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

.capability-card {
  padding: 16px 16px 8px 16px;
  margin-bottom: 12px;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  background-color: #fafbfc;
}

.capability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.capability-title {
  color: #1e3a5f;
  font-weight: 600;
  font-size: 14px;
}

.capability-card .grid {
  margin-bottom: 4px;
}

.capability-card .grid:last-child {
  margin-bottom: 0;
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