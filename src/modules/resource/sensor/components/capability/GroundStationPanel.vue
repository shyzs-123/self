<script setup lang="ts">
import { computed } from 'vue'
import type { GroundStationCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: GroundStationCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: GroundStationCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: GroundStationCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 站点信息 -->
    <div class="sub-section">站点信息</div>
    <el-form-item label="站点名称">
      <el-input v-model="data.stationName" :disabled="readonly" placeholder="如: 北京站" />
    </el-form-item>
    <div class="grid">
      <el-form-item label="坐标X">
        <el-input v-model="data.coordinateX" :disabled="readonly" placeholder="如: 116.5" />
      </el-form-item>
      <el-form-item label="坐标Y">
        <el-input v-model="data.coordinateY" :disabled="readonly" placeholder="如: 39.9" />
      </el-form-item>
    </div>
    <el-form-item label="坐标Z">
      <el-input v-model="data.coordinateZ" :disabled="readonly" placeholder="如: 50" />
    </el-form-item>

    <!-- 监测能力 -->
    <div class="sub-section">监测能力</div>
    <div class="grid">
      <el-form-item label="监测半径">
        <el-input v-model="data.monitoringRadius" :disabled="readonly" placeholder="如: 50km" />
      </el-form-item>
      <el-form-item label="传感器类型">
        <el-input v-model="data.sensorType" :disabled="readonly" placeholder="如: 气象传感器" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="工作频率">
        <el-input v-model="data.frequency" :disabled="readonly" placeholder="如: 433MHz" />
      </el-form-item>
      <el-form-item label="测量精度">
        <el-input v-model="data.measurementAccuracy" :disabled="readonly" placeholder="如: ±0.5°C" />
      </el-form-item>
    </div>

    <!-- 在线状态 -->
    <div class="sub-section">在线状态</div>
    <div class="grid">
      <el-form-item label="在线状态">
        <el-select v-model="data.onlineStatus" :disabled="readonly" placeholder="请选择状态">
          <el-option value="online" label="在线" />
          <el-option value="offline" label="离线" />
          <el-option value="maintenance" label="维护中" />
        </el-select>
      </el-form-item>
      <el-form-item label="最后心跳时间">
        <el-input v-model="data.lastHeartbeat" :disabled="readonly" placeholder="如: 2026-08-18 10:00" />
      </el-form-item>
    </div>
  </div>
</template>

<style scoped>
.capability-panel {
  padding: 8px 0;
}
.sub-section {
  margin: 14px 0 10px 0;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #1e3a5f;
  border-left: 2px solid #1677ff;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
:deep(.el-form-item) {
  margin-bottom: 16px;
}
:deep(.el-form-item__label) {
  font-size: 13px;
  color: #475569;
}
:deep(.el-select) {
  width: 100%;
}
</style>