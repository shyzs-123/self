// ============================================================
// 文件：src/modules/resource/sensor/config/platformConfig.ts
// 说明：8类观测平台配置（标签、颜色、图标、字段映射等）
// ============================================================

import type { PlatformType, PlatformStatus, ConstraintLevel } from '../types/platform'

// ============================================================
// 1. 平台标签映射
// ============================================================

export const platformLabels: Record<PlatformType, string> = {
  satellite: '卫星',
  uav: '无人机',
  groundStation: '地面站',
  robot: '机器人',
  surveyVehicle: '测量车',
  rfidMesh: 'RFID微网',
  smartphone: '智能手机',
  videoOptical: '视频与光场',
}

// ============================================================
// 2. 平台图标映射（Element Plus 图标名）
// ============================================================

export const platformIcons: Record<PlatformType, string> = {
  satellite: 'Iphone', // 用火箭图标代替
  uav: 'Iphone',
  groundStation: 'Iphone',
  robot: 'Iphone',
  surveyVehicle: 'Iphone',
  rfidMesh: 'Iphone',
  smartphone: 'Iphone',
  videoOptical: 'Iphone',
}

// ============================================================
// 3. 平台标签颜色（Element Plus Tag 类型）
// ============================================================

export const platformTagTypes: Record<PlatformType, string> = {
  satellite: 'primary',
  uav: 'success',
  groundStation: 'warning',
  robot: 'danger',
  surveyVehicle: 'info',
  rfidMesh: 'primary',
  smartphone: 'success',
  videoOptical: 'warning',
}

// ============================================================
// 4. 状态标签映射
// ============================================================

export const statusLabels: Record<PlatformStatus, string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
  disabled: '已停用',
}

export const statusTagTypes: Record<PlatformStatus, string> = {
  online: 'success',
  offline: 'danger',
  maintenance: 'warning',
  disabled: 'info',
}

// ============================================================
// 5. 约束等级标签
// ============================================================

export const constraintLabels: Record<ConstraintLevel, string> = {
  public: '公开',
  restricted: '受限',
  confidential: '保密',
  secret: '机密',
}

export const constraintTagTypes: Record<ConstraintLevel, string> = {
  public: 'success',
  restricted: 'warning',
  confidential: 'danger',
  secret: 'danger',
}

// ============================================================
// 6. 平台选项列表（用于下拉选择）
// ============================================================

export const platformOptions = Object.entries(platformLabels).map(([value, label]) => ({
  value: value as PlatformType,
  label,
}))

export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value: value as PlatformStatus,
  label,
}))

export const constraintOptions = Object.entries(constraintLabels).map(([value, label]) => ({
  value: value as ConstraintLevel,
  label,
}))

// ============================================================
// 7. 列表页关键指标配置
// ============================================================

export interface MetricConfig {
  primary: { label: string; getValue: (data: any) => string }
  secondary: { label: string; getValue: (data: any) => string }
}

export const listMetrics: Record<PlatformType, MetricConfig> = {
  satellite: {
    primary: { label: '空间分辨率', getValue: (d) => d.property?.data?.spatialResolution || '-' },
    secondary: { label: '重访周期', getValue: (d) => d.property?.data?.revisitTime || '-' },
  },
  uav: {
    primary: { label: '航高', getValue: (d) => d.property?.data?.flightAltitude || '-' },
    secondary: { label: '续航', getValue: (d) => d.property?.data?.endurance || '-' },
  },
  groundStation: {
    primary: { label: '监测半径', getValue: (d) => d.property?.data?.monitoringRadius || '-' },
    secondary: { label: '监测参数', getValue: (d) => d.property?.data?.sensorType || '-' },
  },
  robot: {
    primary: { label: '移动方式', getValue: (d) => d.property?.data?.movementType || '-' },
    secondary: { label: '任务类型', getValue: (d) => d.property?.data?.taskTypes?.join(', ') || '-' },
  },
  surveyVehicle: {
    primary: { label: '定位精度', getValue: (d) => d.property?.data?.positioningAccuracy || '-' },
    secondary: { label: '采样频率', getValue: (d) => d.property?.data?.sampleFrequency || '-' },
  },
  rfidMesh: {
    primary: { label: '拓扑类型', getValue: (d) => d.property?.data?.topologyType || '-' },
    secondary: { label: '覆盖半径', getValue: (d) => d.property?.data?.coverageRadius || '-' },
  },
  smartphone: {
    primary: { label: '定位精度', getValue: (d) => d.property?.data?.positioningAccuracy || '-' },
    secondary: { label: '采集频率', getValue: (d) => d.property?.data?.collectFrequency || '-' },
  },
  videoOptical: {
    primary: { label: '分辨率', getValue: (d) => d.property?.data?.resolution || '-' },
    secondary: { label: '帧率', getValue: (d) => d.property?.data?.frameRate || '-' },
  },
}

// ============================================================
// 8. 能力面板字段配置（用于详情展示，可选）
// ============================================================

export interface FieldGroup {
  groupName: string
  fields: { key: string; label: string }[]
}

export const capabilityFieldGroups: Record<PlatformType, FieldGroup[]> = {
  satellite: [
    {
      groupName: '轨道参数',
      fields: [
        { key: 'orbitHeight', label: '轨道高度' },
        { key: 'orbitPeriod', label: '轨道周期' },
        { key: 'inclination', label: '轨道倾角' },
        { key: 'eccentricity', label: '偏心率' },
        { key: 'noradId', label: 'NORAD编号' },
      ],
    },
    {
      groupName: '载荷能力',
      fields: [
        { key: 'payloadName', label: '载荷名称' },
        { key: 'payloadType', label: '载荷类型' },
      ],
    },
    {
      groupName: '观测能力',
      fields: [
        { key: 'spatialResolution', label: '空间分辨率' },
        { key: 'swath', label: '观测幅宽' },
        { key: 'revisitTime', label: '重访周期' },
        { key: 'coverageCapability', label: '覆盖能力' },
      ],
    },
    {
      groupName: '频谱能力',
      fields: [
        { key: 'wavelengthRange', label: '波长范围' },
        { key: 'spectrumNumber', label: '波段数量' },
        { key: 'spectrumCategory', label: '波段类型' },
      ],
    },
  ],
  uav: [
    {
      groupName: '飞行性能',
      fields: [
        { key: 'flightAltitude', label: '航高' },
        { key: 'flightSpeed', label: '航速' },
        { key: 'endurance', label: '续航时间' },
        { key: 'takeoffLandingPoint', label: '起降点' },
      ],
    },
    {
      groupName: '载荷能力',
      fields: [
        { key: 'payloadName', label: '载荷名称' },
        { key: 'payloadWeight', label: '载荷重量' },
        { key: 'fov', label: '视场角' },
      ],
    },
    {
      groupName: '作业范围',
      fields: [
        { key: 'operationRange', label: '作业范围' },
        { key: 'maxRadius', label: '最大作业半径' },
      ],
    },
    {
      groupName: '通信能力',
      fields: [
        { key: 'communicationType', label: '通信类型' },
        { key: 'controlFrequency', label: '控制频率' },
      ],
    },
  ],
  groundStation: [
    {
      groupName: '站点信息',
      fields: [
        { key: 'stationName', label: '站点名称' },
        { key: 'coordinateX', label: '坐标X' },
        { key: 'coordinateY', label: '坐标Y' },
        { key: 'coordinateZ', label: '坐标Z' },
      ],
    },
    {
      groupName: '监测能力',
      fields: [
        { key: 'monitoringRadius', label: '监测半径' },
        { key: 'sensorType', label: '传感器类型' },
        { key: 'frequency', label: '工作频率' },
        { key: 'measurementAccuracy', label: '测量精度' },
      ],
    },
    {
      groupName: '在线状态',
      fields: [
        { key: 'onlineStatus', label: '在线状态' },
        { key: 'lastHeartbeat', label: '最后心跳时间' },
      ],
    },
  ],
  robot: [
    {
      groupName: '位置信息',
      fields: [
        { key: 'currentPosition', label: '当前位置' },
        { key: 'locationAccuracy', label: '定位精度' },
      ],
    },
    {
      groupName: '移动能力',
      fields: [
        { key: 'movementType', label: '移动方式' },
        { key: 'maxSpeed', label: '最大速度' },
        { key: 'endurance', label: '续航能力' },
        { key: 'climbingAngle', label: '爬坡角度' },
      ],
    },
    {
      groupName: '载荷与任务',
      fields: [
        { key: 'payloadName', label: '载荷名称' },
        { key: 'payloadCapacity', label: '载荷容量' },
        { key: 'taskTypes', label: '任务类型' },
        { key: 'dataTypes', label: '数据类型' },
      ],
    },
  ],
  surveyVehicle: [
    {
      groupName: '定位能力',
      fields: [
        { key: 'positioningSystem', label: '定位系统' },
        { key: 'positioningAccuracy', label: '定位精度' },
        { key: 'trajectoryRecord', label: '轨迹记录' },
      ],
    },
    {
      groupName: '载荷能力',
      fields: [
        { key: 'payloadName', label: '载荷名称' },
        { key: 'payloadType', label: '载荷类型' },
      ],
    },
    {
      groupName: '采样能力',
      fields: [
        { key: 'sampleFrequency', label: '采样频率' },
        { key: 'measurementParameters', label: '测量参数' },
      ],
    },
    {
      groupName: '作业范围',
      fields: [
        { key: 'operationRange', label: '作业范围' },
        { key: 'typicalSpeed', label: '典型车速' },
      ],
    },
  ],
  rfidMesh: [
    {
      groupName: '网关信息',
      fields: [
        { key: 'gatewayId', label: '网关标识' },
        { key: 'gatewayType', label: '网关类型' },
      ],
    },
    {
      groupName: '网络拓扑',
      fields: [
        { key: 'topologyType', label: '拓扑类型' },
        { key: 'nodeCount', label: '节点数量' },
        { key: 'maxHopCount', label: '最大跳数' },
      ],
    },
    {
      groupName: '覆盖区域',
      fields: [
        { key: 'coverageRadius', label: '覆盖半径' },
        { key: 'coverageArea', label: '覆盖面积' },
      ],
    },
    {
      groupName: '标签配置',
      fields: [
        { key: 'tagTypes', label: '标签类型' },
        { key: 'maxTagCount', label: '最大标签数' },
      ],
    },
    {
      groupName: '采样参数',
      fields: [
        { key: 'sampleFrequency', label: '采样频率' },
        { key: 'readRange', label: '读取距离' },
      ],
    },
  ],
  smartphone: [
    {
      groupName: '终端信息',
      fields: [
        { key: 'terminalModel', label: '终端型号' },
        { key: 'anonymousId', label: '匿名标识' },
        { key: 'osVersion', label: '操作系统版本' },
      ],
    },
    {
      groupName: '定位能力',
      fields: [
        { key: 'positioningType', label: '定位方式' },
        { key: 'positioningAccuracy', label: '定位精度' },
      ],
    },
    {
      groupName: '采集能力',
      fields: [
        { key: 'sensorTypes', label: '传感器类型' },
        { key: 'collectFrequency', label: '采集频率' },
        { key: 'dataTypes', label: '数据类型' },
      ],
    },
    {
      groupName: '众包权限',
      fields: [
        { key: 'crowdsourcingEnabled', label: '众包启用' },
        { key: 'permissionLevel', label: '权限级别' },
        { key: 'dataSharingScope', label: '数据共享范围' },
      ],
    },
  ],
  videoOptical: [
    {
      groupName: '视频参数',
      fields: [
        { key: 'videoCodec', label: '编码格式' },
        { key: 'resolution', label: '视频分辨率' },
        { key: 'frameRate', label: '帧率' },
        { key: 'bitrate', label: '码率' },
      ],
    },
    {
      groupName: '流地址',
      fields: [
        { key: 'streamUrl', label: '流媒体地址' },
        { key: 'protocolType', label: '协议类型' },
      ],
    },
    {
      groupName: '视场参数',
      fields: [
        { key: 'fov', label: '视场角' },
        { key: 'focalLength', label: '焦距' },
        { key: 'sensorSize', label: '传感器尺寸' },
      ],
    },
    {
      groupName: '位置状态',
      fields: [
        { key: 'installLocation', label: '安装位置' },
        { key: 'deviceStatus', label: '设备状态' },
        { key: 'dataFormat', label: '数据格式' },
      ],
    },
  ],
}

// ============================================================
// 9. 工具函数：获取平台标签
// ============================================================

export function getPlatformLabel(type: PlatformType): string {
  return platformLabels[type] || type
}

export function getStatusLabel(status: PlatformStatus): string {
  return statusLabels[status] || status
}

export function getConstraintLabel(level: ConstraintLevel): string {
  return constraintLabels[level] || level
}

export function getPlatformTagType(type: PlatformType): string {
  return platformTagTypes[type] || 'info'
}

export function getStatusTagType(status: PlatformStatus): string {
  return statusTagTypes[status] || 'info'
}

export function getConstraintTagType(level: ConstraintLevel): string {
  return constraintTagTypes[level] || 'info'
}