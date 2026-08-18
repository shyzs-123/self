<script setup lang="ts">
import { computed, ref } from 'vue'

// ============================================================
// 导入新类型和配置
// ============================================================
import type { PlatformMetadata, PlatformType, PlatformStatus } from '@/modules/resource/sensor/types/platform'
import {
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
  getPlatformLabel,
  getStatusLabel,
  getPlatformTagType,
  getStatusTagType,
  getConstraintLabel,
  getConstraintTagType,
  capabilityFieldGroups,
} from '@/modules/resource/sensor/config/platformConfig'

// 导入能力面板组件（只读模式）
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
  resource: PlatformMetadata | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// ============================================================
// 文案配置
// ============================================================

const text = {
  title: '资源详情',
  empty: '暂无资源详情',
  // Tab 名称
  tabOverview: '概览',
  tabCapability: '能力详情',
  tabContact: '联系与管理',
  tabInterface: '接口与文档',
  // 概览
  basicInfo: '基本信息',
  keyMetrics: '关键能力指标',
  location: '位置信息',
  constraint: '约束信息',
  // 字段标签
  platformName: '资源名称',
  platformCode: '资源编码',
  platformType: '资源类型',
  locationLabel: '部署位置',
  organization: '所属单位',
  owner: '责任人',
  status: '运行状态',
  deploymentDate: '部署日期',
  constraintLevel: '共享约束等级',
  effectiveTime: '有效时间',
  longitude: '经度',
  latitude: '纬度',
  altitude: '高度',
  spatialReference: '空间参考框架',
  // 联系信息
  contactInfo: '联系信息',
  organizationName: '管理单位',
  individualName: '负责人',
  positionName: '职位',
  phone: '联系电话',
  email: '电子邮箱',
  address: '联系地址',
  // 接口信息
  interfaceInfo: '接口信息',
  serviceAddress: '服务地址',
  protocolType: '协议类型',
  // 存档
  archiveInfo: '存档信息',
  noArchive: '暂无存档信息',
}

// ============================================================
// 当前激活的 Tab
// ============================================================

const activeTab = ref('overview')

// ============================================================
// 辅助函数
// ============================================================

function typeLabel(type: PlatformType) {
  return getPlatformLabel(type)
}

function statusLabel(status: PlatformStatus) {
  return getStatusLabel(status)
}

function typeTagType(type: PlatformType) {
  return getPlatformTagType(type)
}

function statusTagType(status: PlatformStatus) {
  return getStatusTagType(status)
}

function constraintLabel(level: string) {
  return getConstraintLabel(level as any) || level
}

function constraintTagType(level: string) {
  return getConstraintTagType(level as any) || 'info'
}

function formatDate(date: string) {
  if (!date) return '-'
  return date
}

// ============================================================
// 获取能力数据用于展示
// ============================================================

const capabilityData = computed(() => {
  if (!props.resource) return null
  return props.resource.property
})

// ============================================================
// 获取关键能力指标（4个卡片）
// ============================================================

const keyMetrics = computed(() => {
  if (!props.resource || !capabilityData.value) return []

  const cap = capabilityData.value
  const type = props.resource.general.platformType
  const data = cap.data as any

  switch (type) {
    case 'satellite':
      return [
        { label: '空间分辨率', value: data.spatialResolution || '-' },
        { label: '观测幅宽', value: data.swath || '-' },
        { label: '重访周期', value: data.revisitTime || '-' },
        { label: '轨道高度', value: data.orbitHeight || '-' },
      ]
    case 'uav':
      return [
        { label: '航高', value: data.flightAltitude || '-' },
        { label: '航速', value: data.flightSpeed || '-' },
        { label: '续航时间', value: data.endurance || '-' },
        { label: '视场角', value: data.fov || '-' },
      ]
    case 'groundStation':
      return [
        { label: '监测半径', value: data.monitoringRadius || '-' },
        { label: '传感器类型', value: data.sensorType || '-' },
        { label: '测量精度', value: data.measurementAccuracy || '-' },
        { label: '在线状态', value: data.onlineStatus || '-' },
      ]
    case 'robot':
      return [
        { label: '移动方式', value: data.movementType || '-' },
        { label: '最大速度', value: data.maxSpeed || '-' },
        { label: '续航能力', value: data.endurance || '-' },
        { label: '载荷名称', value: data.payloadName || '-' },
      ]
    case 'surveyVehicle':
      return [
        { label: '定位系统', value: data.positioningSystem || '-' },
        { label: '定位精度', value: data.positioningAccuracy || '-' },
        { label: '采样频率', value: data.sampleFrequency || '-' },
        { label: '载荷名称', value: data.payloadName || '-' },
      ]
    case 'rfidMesh':
      return [
        { label: '拓扑类型', value: data.topologyType || '-' },
        { label: '节点数量', value: data.nodeCount || '-' },
        { label: '覆盖半径', value: data.coverageRadius || '-' },
        { label: '读取距离', value: data.readRange || '-' },
      ]
    case 'smartphone':
      return [
        { label: '定位精度', value: data.positioningAccuracy || '-' },
        { label: '采集频率', value: data.collectFrequency || '-' },
        { label: '众包启用', value: data.crowdsourcingEnabled ? '是' : '否' },
        { label: '权限级别', value: data.permissionLevel || '-' },
      ]
    case 'videoOptical':
      return [
        { label: '分辨率', value: data.resolution || '-' },
        { label: '帧率', value: data.frameRate || '-' },
        { label: '视场角', value: data.fov || '-' },
        { label: '设备状态', value: data.deviceStatus || '-' },
      ]
    default:
      return [
        { label: '暂无数据', value: '-' },
        { label: '暂无数据', value: '-' },
        { label: '暂无数据', value: '-' },
        { label: '暂无数据', value: '-' },
      ]
  }
})

// ============================================================
// 能力字段分组（用于详情展示）
// ============================================================

const fieldGroups = computed(() => {
  if (!props.resource) return []
  const type = props.resource.general.platformType
  return capabilityFieldGroups[type] || []
})

const getFieldValue = (key: string) => {
  if (!capabilityData.value) return '-'
  const data = capabilityData.value.data as any
  const value = data[key]
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '-'
  }
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  return value || '-'
}
</script>

<template>
  <el-drawer v-model="visible" :title="text.title" size="720px" destroy-on-close>
    <el-empty v-if="!resource" :description="text.empty" />

    <div v-else class="detail">
      <!-- ============================================================ -->
      <!-- 头部：名称 + 状态标签 -->
      <!-- ============================================================ -->
      <div class="detail-header">
        <div class="header-left">
          <span class="header-title">{{ resource.general.platformName }}</span>
          <el-tag :type="statusTagType(resource.general.status)" size="large">
            {{ statusLabel(resource.general.status) }}
          </el-tag>
          <el-tag :type="typeTagType(resource.general.platformType)" size="large">
            {{ typeLabel(resource.general.platformType) }}
          </el-tag>
        </div>
        <div class="header-right">
          <span class="header-code">{{ resource.general.platformCode }}</span>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- Tab 切换 -->
      <!-- ============================================================ -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- ========================================================== -->
        <!-- Tab1: 概览 -->
        <!-- ========================================================== -->
        <el-tab-pane :label="text.tabOverview" name="overview">
          <!-- 关键能力卡片 -->
          <div class="metric-cards">
            <div v-for="(metric, index) in keyMetrics" :key="index" class="metric-card">
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="info-section">
            <h4>{{ text.basicInfo }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.platformName }}</span>
                <span class="info-value">{{ resource.general.platformName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.platformCode }}</span>
                <span class="info-value">{{ resource.general.platformCode }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.platformType }}</span>
                <span class="info-value">{{ typeLabel(resource.general.platformType) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.organization }}</span>
                <span class="info-value">{{ resource.general.organization || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.owner }}</span>
                <span class="info-value">{{ resource.general.owner || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.deploymentDate }}</span>
                <span class="info-value">{{ formatDate(resource.general.deploymentDate) }}</span>
              </div>
            </div>
          </div>

          <!-- 位置信息 -->
          <div class="info-section">
            <h4>{{ text.location }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.longitude }}</span>
                <span class="info-value">{{ resource.geoPosition.longitude || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.latitude }}</span>
                <span class="info-value">{{ resource.geoPosition.latitude || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.altitude }}</span>
                <span class="info-value">{{ resource.geoPosition.altitude || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.spatialReference }}</span>
                <span class="info-value">{{ resource.geoPosition.spatialReference || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 约束信息 -->
          <div class="info-section">
            <h4>{{ text.constraint }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.effectiveTime }}</span>
                <span class="info-value">
                  {{ formatDate(resource.constraint.effectiveTimeStart) }}
                  ~
                  {{ formatDate(resource.constraint.effectiveTimeEnd) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.constraintLevel }}</span>
                <span class="info-value">
                  <el-tag :type="constraintTagType(resource.constraint.constraintLevel)" size="small">
                    {{ constraintLabel(resource.constraint.constraintLevel) }}
                  </el-tag>
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- ========================================================== -->
        <!-- Tab2: 能力详情 -->
        <!-- ========================================================== -->
        <el-tab-pane :label="text.tabCapability" name="capability">
          <div v-if="!capabilityData" class="empty-tip">暂无能力数据</div>

          <!-- 使用能力面板组件（只读模式） -->
          <div v-else class="capability-display">
            <!-- 卫星 -->
            <template v-if="isSatellite(capabilityData)">
              <SatellitePanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 无人机 -->
            <template v-else-if="isUav(capabilityData)">
              <UavPanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 地面站 -->
            <template v-else-if="isGroundStation(capabilityData)">
              <GroundStationPanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 机器人 -->
            <template v-else-if="isRobot(capabilityData)">
              <RobotPanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 测量车 -->
            <template v-else-if="isSurveyVehicle(capabilityData)">
              <SurveyVehiclePanel v-model="capabilityData.data" readonly />
            </template>

            <!-- RFID微网 -->
            <template v-else-if="isRfidMesh(capabilityData)">
              <RfidMeshPanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 智能手机 -->
            <template v-else-if="isSmartphone(capabilityData)">
              <SmartphonePanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 视频与光场 -->
            <template v-else-if="isVideoOptical(capabilityData)">
              <VideoOpticalPanel v-model="capabilityData.data" readonly />
            </template>

            <!-- 兼容旧数据：使用字段分组展示 -->
            <template v-else>
              <div v-for="group in fieldGroups" :key="group.groupName" class="field-group">
                <div class="field-group-title">{{ group.groupName }}</div>
                <div class="info-grid">
                  <div v-for="field in group.fields" :key="field.key" class="info-item">
                    <span class="info-label">{{ field.label }}</span>
                    <span class="info-value">{{ getFieldValue(field.key) }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>

        <!-- ========================================================== -->
        <!-- Tab3: 联系与管理 -->
        <!-- ========================================================== -->
        <el-tab-pane :label="text.tabContact" name="contact">
          <div class="info-section">
            <h4>{{ text.contactInfo }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.organizationName }}</span>
                <span class="info-value">{{ resource.contact.organizationName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.individualName }}</span>
                <span class="info-value">{{ resource.contact.individualName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.positionName }}</span>
                <span class="info-value">{{ resource.contact.positionName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.phone }}</span>
                <span class="info-value">{{ resource.contact.phone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.email }}</span>
                <span class="info-value">{{ resource.contact.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.address }}</span>
                <span class="info-value">{{ resource.contact.address || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 约束信息（精简） -->
          <div class="info-section">
            <h4>{{ text.constraint }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.constraintLevel }}</span>
                <span class="info-value">
                  <el-tag :type="constraintTagType(resource.constraint.constraintLevel)" size="small">
                    {{ constraintLabel(resource.constraint.constraintLevel) }}
                  </el-tag>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.effectiveTime }}</span>
                <span class="info-value">
                  {{ formatDate(resource.constraint.effectiveTimeStart) }}
                  ~
                  {{ formatDate(resource.constraint.effectiveTimeEnd) }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- ========================================================== -->
        <!-- Tab4: 接口与文档 -->
        <!-- ========================================================== -->
        <el-tab-pane :label="text.tabInterface" name="interface">
          <div class="info-section">
            <h4>{{ text.interfaceInfo }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ text.serviceAddress }}</span>
                <span class="info-value">
                  <el-link v-if="resource.interface.serviceAddress" :href="resource.interface.serviceAddress" target="_blank" type="primary">
                    {{ resource.interface.serviceAddress }}
                  </el-link>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ text.protocolType }}</span>
                <span class="info-value">{{ resource.interface.protocolType || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 存档信息 -->
          <div class="info-section">
            <h4>{{ text.archiveInfo }}</h4>
            <div v-if="resource.archive && (resource.archive.documents?.length || resource.archive.historyEvents?.length)" class="info-grid">
              <div v-if="resource.archive.documents?.length" class="info-item full-width">
                <span class="info-label">文档列表</span>
                <div class="info-value">
                  <div v-for="(doc, idx) in resource.archive.documents" :key="idx" class="doc-item">
                    <el-link v-if="doc.documentLink" :href="doc.documentLink" target="_blank" type="primary">
                      {{ doc.documentName || '文档' }}
                    </el-link>
                    <span v-else>{{ doc.documentName || '文档' }}</span>
                    <span v-if="doc.documentType" class="doc-type">({{ doc.documentType }})</span>
                  </div>
                </div>
              </div>
              <div v-if="resource.archive.historyEvents?.length" class="info-item full-width">
                <span class="info-label">历史事件</span>
                <div class="info-value">
                  <div v-for="(event, idx) in resource.archive.historyEvents" :key="idx" class="event-item">
                    <span class="event-date">{{ formatDate(event.eventDate) }}</span>
                    <span class="event-desc">{{ event.eventDescription }}</span>
                    <span v-if="event.eventType" class="event-type">[{{ event.eventType }}]</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-tip">{{ text.noArchive }}</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

/* ========== 头部 ========== */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a5f;
}

.header-right {
  flex-shrink: 0;
}

.header-code {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

/* ========== Tabs ========== */
.detail-tabs {
  margin-top: 4px;
}

.detail-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.detail-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
}

/* ========== 关键能力卡片 ========== */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric-card {
  padding: 16px 12px;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
  color: #1677ff;
}

.metric-label {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

/* ========== 信息区块 ========== */
.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e3a5f;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.info-item {
  display: flex;
  padding: 8px 12px;
  background: #fafbfc;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-label {
  width: 90px;
  flex-shrink: 0;
  font-size: 13px;
  color: #94a3b8;
}

.info-value {
  flex: 1;
  font-size: 13px;
  color: #1f2937;
  word-break: break-all;
}

/* ========== 能力展示 ========== */
.capability-display {
  padding: 4px 0;
}

.field-group {
  margin-bottom: 16px;
}

.field-group-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e3a5f;
  padding: 6px 0 8px 0;
  border-bottom: 1px solid #e8ecf1;
  margin-bottom: 8px;
}

/* ========== 文档和事件 ========== */
.doc-item,
.event-item {
  padding: 4px 0;
  font-size: 13px;
}

.event-date {
  color: #94a3b8;
  margin-right: 8px;
}

.event-desc {
  color: #1f2937;
}

.event-type {
  color: #94a3b8;
  margin-left: 6px;
  font-size: 12px;
}

.doc-type {
  color: #94a3b8;
  margin-left: 6px;
  font-size: 12px;
}

/* ========== 通用 ========== */
.empty-tip {
  padding: 24px 0;
  color: #a8abb2;
  text-align: center;
  font-size: 14px;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item.full-width {
    grid-column: span 1;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* ========== 抽屉样式覆盖 ========== */
:deep(.el-drawer__header) {
  padding: 16px 20px;
  margin-bottom: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-drawer__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a5f;
}

:deep(.el-drawer__body) {
  padding: 16px 20px;
}

:deep(.el-tabs__content) {
  padding-top: 4px;
}
</style>