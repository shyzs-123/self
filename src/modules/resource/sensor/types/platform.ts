// ============================================================
// 文件：src/modules/resource/sensor/types/platform.ts
// 说明：8类观测平台 + 七元组完整类型定义
// ============================================================

// ============================================================
// 1. 基础类型枚举
// ============================================================

/** 8类观测平台类型 */
export type PlatformType =
  | 'satellite' // 卫星
  | 'uav' // 无人机
  | 'groundStation' // 地面站
  | 'robot' // 机器人
  | 'surveyVehicle' // 测量车
  | 'rfidMesh' // RFID微网
  | 'smartphone' // 智能手机
  | 'videoOptical' // 视频与光场

/** 运行状态 */
export type PlatformStatus = 'online' | 'offline' | 'maintenance' | 'disabled'

/** 共享约束等级 */
export type ConstraintLevel = 'public' | 'restricted' | 'confidential' | 'secret'

/** 供电方式 */
export type PowerSource = 'mains' | 'solar' | 'battery' | 'hybrid'

/** 移动方式（机器人） */
export type MovementType = 'wheeled' | 'tracked' | 'legged' | 'aerial' | 'aquatic'

// ============================================================
// 2. 通用信息 (General)
// ============================================================

export interface PlatformGeneral {
  platformId: string
  platformName: string
  platformCode: string
  platformType: PlatformType
  manufacturer: string
  model: string
  status: PlatformStatus
  deploymentDate: string
  location: string
  organization: string
  owner: string
}

// ============================================================
// 3. 约束信息 (Constraint)
// ============================================================

export interface PlatformConstraint {
  effectiveTimeStart: string
  effectiveTimeEnd: string
  constraintLevel: ConstraintLevel
  securityLevel?: string
  legalLevel?: string
}

// ============================================================
// 4. 联系信息 (Contact)
// ============================================================

export interface PlatformContact {
  organizationName: string
  individualName: string
  positionName: string
  phone: string
  email: string
  address: string
}

// ============================================================
// 5. 地理位置信息 (GeoPosition)
// ============================================================

export interface PlatformGeoPosition {
  longitude: number
  latitude: number
  altitude: number
  spatialReference: string
  temporalReference?: string
}

// ============================================================
// 6. 接口信息 (Interface)
// ============================================================

export interface PlatformInterface {
  serviceAddress: string
  protocolType: string
  accessMethod?: string
  authType?: string
}

// ============================================================
// 7. 存档信息 (Archive)
// ============================================================

export interface ArchiveDocument {
  documentName: string
  documentLink: string
  documentType?: string
}

export interface HistoryEvent {
  eventDate: string
  eventDescription: string
  eventType?: string
}

export interface PlatformArchive {
  documents: ArchiveDocument[]
  historyEvents: HistoryEvent[]
}

// ============================================================
// 8. 八类平台能力接口
// ============================================================

// -------- 8.1 卫星能力 --------
export interface SatelliteCapability {
  // 轨道参数
  orbitHeight: string
  orbitPeriod: string
  inclination: string
  eccentricity?: string
  noradId?: string
  // 载荷能力
  payloadName: string
  payloadType: string
  // 观测能力
  spatialResolution: string
  swath: string
  revisitTime: string
  coverageCapability: string
  // 频谱能力
  wavelengthRange: string
  spectrumNumber: number
  spectrumCategory: string
}

// -------- 8.2 无人机能力 --------
export interface UavCapability {
  flightAltitude: string
  flightSpeed: string
  endurance: string
  takeoffLandingPoint: string
  payloadName: string
  payloadWeight?: string
  fov: string
  operationRange: string
  maxRadius?: string
  communicationType: string
  controlFrequency?: string
}

// -------- 8.3 地面站能力 --------
export interface GroundStationCapability {
  stationName: string
  coordinateX: string
  coordinateY: string
  coordinateZ?: string
  monitoringRadius: string
  sensorType: string
  frequency: string
  measurementAccuracy: string
  onlineStatus: 'online' | 'offline' | 'maintenance'
  lastHeartbeat?: string
}

// -------- 8.4 机器人能力 --------
export interface RobotCapability {
  currentPosition: string
  locationAccuracy: string
  movementType: MovementType
  maxSpeed: string
  endurance: string
  climbingAngle?: string
  payloadName: string
  payloadCapacity?: string
  taskTypes: string[]
  dataTypes: string[]
}

// -------- 8.5 测量车能力 --------
export interface SurveyVehicleCapability {
  positioningSystem: string
  positioningAccuracy: string
  trajectoryRecord?: string
  payloadName: string
  payloadType: string
  sampleFrequency: string
  measurementParameters: string[]
  operationRange: string
  typicalSpeed?: string
}

// -------- 8.6 RFID微网能力 --------
export interface RfidMeshCapability {
  gatewayId: string
  gatewayType: string
  topologyType: 'star' | 'tree' | 'mesh'
  nodeCount: number
  maxHopCount?: number
  coverageRadius: string
  coverageArea?: string
  tagTypes: string[]
  maxTagCount?: number
  sampleFrequency: string
  readRange: string
}

// -------- 8.7 智能手机能力 --------
export interface SmartphoneCapability {
  terminalModel: string
  anonymousId: string
  osVersion: string
  positioningType: string
  positioningAccuracy: string
  sensorTypes: string[]
  collectFrequency: string
  dataTypes: string[]
  crowdsourcingEnabled: boolean
  permissionLevel: string
  dataSharingScope: string
}

// -------- 8.8 视频与光场能力 --------
export interface VideoOpticalCapability {
  videoCodec: string
  resolution: string
  frameRate: string
  bitrate?: string
  streamUrl: string
  protocolType: string
  fov: string
  focalLength?: string
  sensorSize?: string
  installLocation: string
  deviceStatus: 'online' | 'offline' | 'maintenance'
  dataFormat: string
}

// ============================================================
// 9. 能力联合类型
// ============================================================

export type PlatformCapability =
  | { type: 'satellite'; data: SatelliteCapability }
  | { type: 'uav'; data: UavCapability }
  | { type: 'groundStation'; data: GroundStationCapability }
  | { type: 'robot'; data: RobotCapability }
  | { type: 'surveyVehicle'; data: SurveyVehicleCapability }
  | { type: 'rfidMesh'; data: RfidMeshCapability }
  | { type: 'smartphone'; data: SmartphoneCapability }
  | { type: 'videoOptical'; data: VideoOpticalCapability }

// ============================================================
// 10. 完整七元组结构
// ============================================================

export interface PlatformMetadata {
  // 七元组
  general: PlatformGeneral
  constraint: PlatformConstraint
  property: PlatformCapability
  contact: PlatformContact
  geoPosition: PlatformGeoPosition
  interface: PlatformInterface
  archive?: PlatformArchive

  // 系统字段
  createdAt?: string
  updatedAt?: string

  // ═══════════════════════════════════════════════
  // 以下为兼容旧代码的字段（过渡期保留）
  // ═══════════════════════════════════════════════
  /** @deprecated 使用 general.platformName 替代 */
  name?: string
  /** @deprecated 使用 general.platformCode 替代 */
  code?: string
  /** @deprecated 使用 general.platformType 替代 */
  type?: PlatformType
  /** @deprecated 使用 general.location 替代 */
  location?: string
  /** @deprecated 使用 general.organization 替代 */
  organization?: string
  /** @deprecated 使用 general.status 替代 */
  status?: PlatformStatus
  /** @deprecated 使用 general.owner 替代 */
  owner?: string
  /** @deprecated 使用 interface.serviceAddress 替代 */
  interfaceAddress?: string
  /** @deprecated 使用 general.deploymentDate 替代 */
  description?: string
  remark?: string
  /** @deprecated 旧能力列表 */
  capabilityList?: any[]
}

// ============================================================
// 11. 视图类型
// ============================================================

/** 列表页展示项 */
export interface PlatformListItem {
  platformId: string
  platformName: string
  platformCode: string
  platformType: PlatformType
  status: PlatformStatus
  location: string
  organization: string
  owner: string
  primaryMetric: { label: string; value: string }
  secondaryMetric: { label: string; value: string }
  deploymentDate: string
  constraintLevel: ConstraintLevel
}

/** 表单数据 */
export interface PlatformFormData {
  // 通用信息
  platformId: string
  platformName: string
  platformCode: string
  platformType: PlatformType
  manufacturer: string
  model: string
  status: PlatformStatus
  deploymentDate: string
  location: string
  organization: string
  owner: string
  // 约束信息
  effectiveTimeStart: string
  effectiveTimeEnd: string
  constraintLevel: ConstraintLevel
  securityLevel?: string
  legalLevel?: string
  // 联系信息
  organizationName: string
  individualName: string
  positionName: string
  phone: string
  email: string
  address: string
  // 地理位置
  longitude: number
  latitude: number
  altitude: number
  spatialReference: string
  temporalReference?: string
  // 接口信息
  serviceAddress: string
  protocolType: string
  accessMethod?: string
  authType?: string
  // 能力信息
  capability: PlatformCapability | null
  // 存档信息
  archive?: PlatformArchive
}

// ============================================================
// 12. 工具函数
// ============================================================

export function createDefaultCapability(type: PlatformType): PlatformCapability {
  switch (type) {
    case 'satellite':
      return {
        type: 'satellite',
        data: {
          orbitHeight: '',
          orbitPeriod: '',
          inclination: '',
          payloadName: '',
          payloadType: '',
          spatialResolution: '',
          swath: '',
          revisitTime: '',
          coverageCapability: '',
          wavelengthRange: '',
          spectrumNumber: 1,
          spectrumCategory: '',
        },
      }
    case 'uav':
      return {
        type: 'uav',
        data: {
          flightAltitude: '',
          flightSpeed: '',
          endurance: '',
          takeoffLandingPoint: '',
          payloadName: '',
          fov: '',
          operationRange: '',
          communicationType: '',
        },
      }
    case 'groundStation':
      return {
        type: 'groundStation',
        data: {
          stationName: '',
          coordinateX: '',
          coordinateY: '',
          monitoringRadius: '',
          sensorType: '',
          frequency: '',
          measurementAccuracy: '',
          onlineStatus: 'online',
        },
      }
    case 'robot':
      return {
        type: 'robot',
        data: {
          currentPosition: '',
          locationAccuracy: '',
          movementType: 'wheeled',
          maxSpeed: '',
          endurance: '',
          payloadName: '',
          taskTypes: [],
          dataTypes: [],
        },
      }
    case 'surveyVehicle':
      return {
        type: 'surveyVehicle',
        data: {
          positioningSystem: '',
          positioningAccuracy: '',
          payloadName: '',
          payloadType: '',
          sampleFrequency: '',
          measurementParameters: [],
          operationRange: '',
        },
      }
    case 'rfidMesh':
      return {
        type: 'rfidMesh',
        data: {
          gatewayId: '',
          gatewayType: '',
          topologyType: 'star',
          nodeCount: 0,
          coverageRadius: '',
          tagTypes: [],
          sampleFrequency: '',
          readRange: '',
        },
      }
    case 'smartphone':
      return {
        type: 'smartphone',
        data: {
          terminalModel: '',
          anonymousId: '',
          osVersion: '',
          positioningType: '',
          positioningAccuracy: '',
          sensorTypes: [],
          collectFrequency: '',
          dataTypes: [],
          crowdsourcingEnabled: false,
          permissionLevel: '',
          dataSharingScope: '',
        },
      }
    case 'videoOptical':
      return {
        type: 'videoOptical',
        data: {
          videoCodec: '',
          resolution: '',
          frameRate: '',
          streamUrl: '',
          protocolType: '',
          fov: '',
          installLocation: '',
          deviceStatus: 'online',
          dataFormat: '',
        },
      }
    default:
      throw new Error(`Unknown platform type: ${type}`)
  }
}

export function isSatellite(cap: PlatformCapability): cap is { type: 'satellite'; data: SatelliteCapability } {
  return cap.type === 'satellite'
}

export function isUav(cap: PlatformCapability): cap is { type: 'uav'; data: UavCapability } {
  return cap.type === 'uav'
}

export function isGroundStation(cap: PlatformCapability): cap is { type: 'groundStation'; data: GroundStationCapability } {
  return cap.type === 'groundStation'
}

export function isRobot(cap: PlatformCapability): cap is { type: 'robot'; data: RobotCapability } {
  return cap.type === 'robot'
}

export function isSurveyVehicle(cap: PlatformCapability): cap is { type: 'surveyVehicle'; data: SurveyVehicleCapability } {
  return cap.type === 'surveyVehicle'
}

export function isRfidMesh(cap: PlatformCapability): cap is { type: 'rfidMesh'; data: RfidMeshCapability } {
  return cap.type === 'rfidMesh'
}

export function isSmartphone(cap: PlatformCapability): cap is { type: 'smartphone'; data: SmartphoneCapability } {
  return cap.type === 'smartphone'
}

export function isVideoOptical(cap: PlatformCapability): cap is { type: 'videoOptical'; data: VideoOpticalCapability } {
  return cap.type === 'videoOptical'
}