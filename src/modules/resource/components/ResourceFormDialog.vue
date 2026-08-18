<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// ============================================================
// 导入新类型和配置
// ============================================================
import type {
  PlatformType,
  PlatformStatus,
  PlatformFormData,
  PlatformMetadata,
  PlatformCapability,
  ConstraintLevel,
} from '@/modules/resource/sensor/types/platform'
import {
  createDefaultCapability,
  isSatellite,
  isUav,
  isGroundStation,
  isRobot,
  isSurveyVehicle,
  isRfidMesh,
  isSmartphone,
  isVideoOptical,
} from '@/modules/resource/sensor/types/platform'
import {
  platformOptions,
  statusOptions,
  constraintOptions,
  getPlatformLabel,
  getStatusLabel,
  getConstraintLabel,
} from '@/modules/resource/sensor/config/platformConfig'

// 导入能力面板组件
import {
  SatellitePanel,
  UavPanel,
  GroundStationPanel,
  RobotPanel,
  SurveyVehiclePanel,
  RfidMeshPanel,
  SmartphonePanel,
  VideoOpticalPanel,
} from '@/modules/resource/sensor/components/capability'

// ============================================================
// Props & Emits
// ============================================================

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  resource: PlatformMetadata | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', resource: PlatformMetadata): void
}>()

// ============================================================
// 文案配置
// ============================================================

const text = {
  create: '新增观测资源',
  edit: '编辑观测资源',
  save: '保存',
  cancel: '取消',

  // 基础信息
  platformName: '资源名称',
  platformCode: '资源编码',
  platformType: '资源类型',
  manufacturer: '厂商',
  model: '型号',
  status: '运行状态',
  deploymentDate: '部署日期',
  location: '部署位置',
  organization: '所属单位',
  owner: '责任人',

  // 约束信息
  constraint: '约束信息',
  effectiveTimeStart: '有效起始时间',
  effectiveTimeEnd: '有效终止时间',
  constraintLevel: '共享约束等级',

  // 联系信息
  contact: '联系信息',
  organizationName: '管理单位',
  individualName: '负责人',
  positionName: '职位',
  phone: '联系电话',
  email: '电子邮箱',
  address: '联系地址',

  // 地理位置
  geoPosition: '地理位置',
  longitude: '经度',
  latitude: '纬度',
  altitude: '高度（米）',
  spatialReference: '空间参考框架',

  // 接口信息
  interfaceInfo: '接口信息',
  serviceAddress: '服务地址',
  protocolType: '协议类型',

  // 能力信息
  capability: '能力配置',

  select: '请选择',
  input: '请输入',
}
// ============================================================
// 响应式数据
// ============================================================

const formRef = ref<FormInstance>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const title = computed(() => (props.mode === 'create' ? text.create : text.edit))

// ============================================================
// 表单数据
// ============================================================

const defaultFormData = (): PlatformFormData => ({
  // 通用信息
  platformId: '',
  platformName: '',
  platformCode: '',
  platformType: 'satellite',
  manufacturer: '',
  model: '',
  status: 'online',
  deploymentDate: '',
  location: '',
  organization: '',
  owner: '',
  // 约束信息
  effectiveTimeStart: '',
  effectiveTimeEnd: '',
  constraintLevel: 'public',
  securityLevel: '',
  legalLevel: '',
  // 联系信息
  organizationName: '',
  individualName: '',
  positionName: '',
  phone: '',
  email: '',
  address: '',
  // 地理位置
  longitude: 0,
  latitude: 0,
  altitude: 0,
  spatialReference: 'WGS84',
  temporalReference: 'UTC',
  // 接口信息
  serviceAddress: '',
  protocolType: 'RESTful',
  accessMethod: '',
  authType: '',
  // 能力信息
  capability: createDefaultCapability('satellite'),
})

const form = reactive<PlatformFormData>(defaultFormData())

// ============================================================
// 表单验证规则
// ============================================================

const rules: FormRules<PlatformFormData> = {
  platformName: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  platformCode: [{ required: true, message: '请输入资源编码', trigger: 'blur' }],
  platformType: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入部署位置', trigger: 'blur' }],
  organization: [{ required: true, message: '请输入所属单位', trigger: 'blur' }],
  status: [{ required: true, message: '请选择运行状态', trigger: 'change' }],
  serviceAddress: [{ required: true, message: '请输入服务地址', trigger: 'blur' }],
  organizationName: [{ required: true, message: '请输入管理单位', trigger: 'blur' }],
  individualName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  constraintLevel: [{ required: true, message: '请选择共享约束等级', trigger: 'change' }],
  effectiveTimeStart: [{ required: true, message: '请选择有效起始时间', trigger: 'change' }],
  effectiveTimeEnd: [{ required: true, message: '请选择有效终止时间', trigger: 'change' }],
}

// ============================================================
// 核心逻辑
// ============================================================

// 监听平台类型变化，切换能力配置
watch(
  () => form.platformType,
  (newType, oldType) => {
    if (!newType) return
    // 如果类型变化，重置能力配置
    if (newType !== oldType) {
      form.capability = createDefaultCapability(newType)
      // 清空旧类型的数据
    }
  }
)

// ============================================================
// 方法
// ============================================================

function resetForm() {
  const defaults = defaultFormData()
  Object.keys(defaults).forEach((key) => {
    ;(form as any)[key] = (defaults as any)[key]
  })
  // 确保 capability 是正确类型
  form.capability = createDefaultCapability(form.platformType)
}

function loadResource(resource: PlatformMetadata) {
  // 通用信息
  form.platformId = resource.general.platformId
  form.platformName = resource.general.platformName
  form.platformCode = resource.general.platformCode
  form.platformType = resource.general.platformType
  form.manufacturer = resource.general.manufacturer || ''
  form.model = resource.general.model || ''
  form.status = resource.general.status
  form.deploymentDate = resource.general.deploymentDate || ''
  form.location = resource.general.location || ''
  form.organization = resource.general.organization || ''
  form.owner = resource.general.owner || ''

  // 约束信息
  form.effectiveTimeStart = resource.constraint.effectiveTimeStart || ''
  form.effectiveTimeEnd = resource.constraint.effectiveTimeEnd || ''
  form.constraintLevel = resource.constraint.constraintLevel || 'public'
  form.securityLevel = resource.constraint.securityLevel || ''
  form.legalLevel = resource.constraint.legalLevel || ''

  // 联系信息
  form.organizationName = resource.contact.organizationName || ''
  form.individualName = resource.contact.individualName || ''
  form.positionName = resource.contact.positionName || ''
  form.phone = resource.contact.phone || ''
  form.email = resource.contact.email || ''
  form.address = resource.contact.address || ''

  // 地理位置
  form.longitude = resource.geoPosition.longitude || 0
  form.latitude = resource.geoPosition.latitude || 0
  form.altitude = resource.geoPosition.altitude || 0
  form.spatialReference = resource.geoPosition.spatialReference || 'WGS84'
  form.temporalReference = resource.geoPosition.temporalReference || 'UTC'

  // 接口信息
  form.serviceAddress = resource.interface.serviceAddress || ''
  form.protocolType = resource.interface.protocolType || 'RESTful'
  form.accessMethod = resource.interface.accessMethod || ''
  form.authType = resource.interface.authType || ''

  // 能力信息
  if (resource.property) {
    form.capability = resource.property
  } else {
    form.capability = createDefaultCapability(form.platformType)
  }
}

function close() {
  visible.value = false
}

function typeLabel(type: PlatformType) {
  return getPlatformLabel(type)
}

function statusLabel(status: PlatformStatus) {
  return getStatusLabel(status)
}

function constraintLabel(level: ConstraintLevel) {
  return getConstraintLabel(level)
}

// ============================================================
// 监听弹窗打开
// ============================================================

watch(
  () => props.modelValue,
  (opened) => {
    if (!opened) return
    resetForm()
    if (props.mode === 'edit' && props.resource) {
      loadResource(props.resource)
    }
    setTimeout(() => formRef.value?.clearValidate(), 0)
  }
)

// ============================================================
// 保存
// ============================================================

async function save() {
  if (!formRef.value) return
  await formRef.value.validate()

  const now = new Date().toISOString().slice(0, 10)
  const previous = props.resource

  // 组装 PlatformMetadata
  const metadata: PlatformMetadata = {
    general: {
      platformId: form.platformId || `R-${Date.now()}`,
      platformName: form.platformName,
      platformCode: form.platformCode,
      platformType: form.platformType,
      manufacturer: form.manufacturer,
      model: form.model,
      status: form.status,
      deploymentDate: form.deploymentDate || now,
      location: form.location,
      organization: form.organization,
      owner: form.owner,
    },
    constraint: {
      effectiveTimeStart: form.effectiveTimeStart,
      effectiveTimeEnd: form.effectiveTimeEnd,
      constraintLevel: form.constraintLevel,
      securityLevel: form.securityLevel,
      legalLevel: form.legalLevel,
    },
    contact: {
      organizationName: form.organizationName,
      individualName: form.individualName,
      positionName: form.positionName,
      phone: form.phone,
      email: form.email,
      address: form.address,
    },
    geoPosition: {
      longitude: form.longitude,
      latitude: form.latitude,
      altitude: form.altitude,
      spatialReference: form.spatialReference,
      temporalReference: form.temporalReference,
    },
    interface: {
      serviceAddress: form.serviceAddress,
      protocolType: form.protocolType,
      accessMethod: form.accessMethod,
      authType: form.authType,
    },
    property: form.capability!,
    // 兼容旧字段
    name: form.platformName,
    code: form.platformCode,
    type: form.platformType,
    location: form.location,
    organization: form.organization,
    status: form.status,
    owner: form.owner,
    interfaceAddress: form.serviceAddress,
    createdAt: previous?.createdAt || now,
    description: '观测资源',
    remark: '',
  }

  emit('save', metadata)
  close()
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="860px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="left">
      <!-- ============================================================ -->
      <!-- 基础信息 -->
      <!-- ============================================================ -->
      <div class="section-title">基础信息</div>

      <el-form-item :label="text.platformName" prop="platformName">
        <el-input v-model="form.platformName" :placeholder="text.input" />
      </el-form-item>

      <el-form-item :label="text.platformCode" prop="platformCode">
        <el-input v-model="form.platformCode" :placeholder="text.input" />
      </el-form-item>

      <div class="grid">
        <el-form-item :label="text.platformType" prop="platformType">
          <el-select v-model="form.platformType" :placeholder="text.select">
            <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value" />
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

      <div class="grid">
        <el-form-item :label="text.manufacturer">
          <el-input v-model="form.manufacturer" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.model">
          <el-input v-model="form.model" :placeholder="text.input" />
        </el-form-item>
      </div>

      <el-form-item :label="text.deploymentDate">
        <el-date-picker
          v-model="form.deploymentDate"
          type="date"
          placeholder="选择部署日期"
          value-format="YYYY-MM-DD"
          style="width:100%"
        />
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 能力配置（按类型动态切换） -->
      <!-- ============================================================ -->
      <div class="section-title">
        {{ text.capability }}
        <span class="type-badge">{{ typeLabel(form.platformType) }}</span>
      </div>

      <div class="capability-wrapper">
        <!-- 卫星 -->
        <template v-if="form.capability && isSatellite(form.capability)">
          <SatellitePanel v-model="form.capability.data" />
        </template>

        <!-- 无人机 -->
        <template v-else-if="form.capability && isUav(form.capability)">
          <UavPanel v-model="form.capability.data" />
        </template>

        <!-- 地面站 -->
        <template v-else-if="form.capability && isGroundStation(form.capability)">
          <GroundStationPanel v-model="form.capability.data" />
        </template>

        <!-- 机器人 -->
        <template v-else-if="form.capability && isRobot(form.capability)">
          <RobotPanel v-model="form.capability.data" />
        </template>

        <!-- 测量车 -->
        <template v-else-if="form.capability && isSurveyVehicle(form.capability)">
          <SurveyVehiclePanel v-model="form.capability.data" />
        </template>

        <!-- RFID微网 -->
        <template v-else-if="form.capability && isRfidMesh(form.capability)">
          <RfidMeshPanel v-model="form.capability.data" />
        </template>

        <!-- 智能手机 -->
        <template v-else-if="form.capability && isSmartphone(form.capability)">
          <SmartphonePanel v-model="form.capability.data" />
        </template>

        <!-- 视频与光场 -->
        <template v-else-if="form.capability && isVideoOptical(form.capability)">
          <VideoOpticalPanel v-model="form.capability.data" />
        </template>

        <!-- 未匹配类型 -->
        <div v-else class="empty-tip">请选择资源类型</div>
      </div>

      <!-- ============================================================ -->
      <!-- 约束信息 -->
      <!-- ============================================================ -->
      <div class="section-title">约束信息</div>

      <div class="grid">
        <el-form-item :label="text.effectiveTimeStart" prop="effectiveTimeStart">
          <el-date-picker
            v-model="form.effectiveTimeStart"
            type="date"
            placeholder="选择起始时间"
            value-format="YYYY-MM-DD"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item :label="text.effectiveTimeEnd" prop="effectiveTimeEnd">
          <el-date-picker
            v-model="form.effectiveTimeEnd"
            type="date"
            placeholder="选择终止时间"
            value-format="YYYY-MM-DD"
            style="width:100%"
          />
        </el-form-item>
      </div>

      <el-form-item :label="text.constraintLevel" prop="constraintLevel">
        <el-select v-model="form.constraintLevel" :placeholder="text.select" style="width:100%">
          <el-option v-for="item in constraintOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- ============================================================ -->
      <!-- 联系信息 -->
      <!-- ============================================================ -->
      <div class="section-title">联系信息</div>

      <div class="grid">
        <el-form-item :label="text.organizationName" prop="organizationName">
          <el-input v-model="form.organizationName" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.individualName" prop="individualName">
          <el-input v-model="form.individualName" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.positionName">
          <el-input v-model="form.positionName" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.phone">
          <el-input v-model="form.phone" :placeholder="text.input" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.email">
          <el-input v-model="form.email" :placeholder="text.input" />
        </el-form-item>

        <el-form-item :label="text.address">
          <el-input v-model="form.address" :placeholder="text.input" />
        </el-form-item>
      </div>

      <!-- ============================================================ -->
      <!-- 地理位置 -->
      <!-- ============================================================ -->
      <div class="section-title">地理位置</div>

      <div class="grid">
        <el-form-item :label="text.longitude">
          <el-input-number v-model="form.longitude" :precision="6" :step="0.1" style="width:100%" />
        </el-form-item>

        <el-form-item :label="text.latitude">
          <el-input-number v-model="form.latitude" :precision="6" :step="0.1" style="width:100%" />
        </el-form-item>
      </div>

      <div class="grid">
        <el-form-item :label="text.altitude">
          <el-input-number v-model="form.altitude" :precision="1" :step="1" style="width:100%" />
        </el-form-item>

        <el-form-item :label="text.spatialReference">
          <el-select v-model="form.spatialReference" style="width:100%">
            <el-option value="WGS84" label="WGS84" />
            <el-option value="CGCS2000" label="CGCS2000" />
            <el-option value="GCJ02" label="GCJ02" />
            <el-option value="BD09" label="BD09" />
          </el-select>
        </el-form-item>
      </div>

      <!-- ============================================================ -->
      <!-- 接口信息 -->
      <!-- ============================================================ -->
      <div class="section-title">接口信息</div>

      <el-form-item :label="text.serviceAddress" prop="serviceAddress">
        <el-input v-model="form.serviceAddress" :placeholder="text.input" />
      </el-form-item>

      <el-form-item :label="text.protocolType">
        <el-select v-model="form.protocolType" style="width:100%">
          <el-option value="RESTful" label="RESTful API" />
          <el-option value="OGC WMS" label="OGC WMS" />
          <el-option value="OGC WFS" label="OGC WFS" />
          <el-option value="MQTT" label="MQTT" />
          <el-option value="WebSocket" label="WebSocket" />
          <el-option value="RTSP" label="RTSP" />
        </el-select>
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

.section-title .type-badge {
  margin-left: 12px;
  padding: 2px 12px;
  font-size: 12px;
  font-weight: 400;
  color: #1677ff;
  background: #e6f0ff;
  border-radius: 12px;
}

.capability-wrapper {
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  background-color: #fafbfc;
}

.empty-tip {
  padding: 20px 0;
  color: #a8abb2;
  text-align: center;
  font-size: 14px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-date-editor) {
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