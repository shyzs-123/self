<script setup lang="ts">
import { computed } from 'vue'
import type { SurveyVehicleCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: SurveyVehicleCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: SurveyVehicleCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: SurveyVehicleCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 定位能力 -->
    <div class="sub-section">定位能力</div>
    <div class="grid">
      <el-form-item label="定位系统">
        <el-input v-model="data.positioningSystem" :disabled="readonly" placeholder="如: GPS+北斗" />
      </el-form-item>
      <el-form-item label="定位精度">
        <el-input v-model="data.positioningAccuracy" :disabled="readonly" placeholder="如: ±0.1m" />
      </el-form-item>
    </div>
    <el-form-item label="轨迹记录">
      <el-input v-model="data.trajectoryRecord" :disabled="readonly" placeholder="轨迹文件路径或描述" />
    </el-form-item>

    <!-- 载荷能力 -->
    <div class="sub-section">载荷能力</div>
    <div class="grid">
      <el-form-item label="载荷名称">
        <el-input v-model="data.payloadName" :disabled="readonly" placeholder="如: 探地雷达" />
      </el-form-item>
      <el-form-item label="载荷类型">
        <el-input v-model="data.payloadType" :disabled="readonly" placeholder="如: 雷达" />
      </el-form-item>
    </div>

    <!-- 采样能力 -->
    <div class="sub-section">采样能力</div>
    <div class="grid">
      <el-form-item label="采样频率">
        <el-input v-model="data.sampleFrequency" :disabled="readonly" placeholder="如: 100Hz" />
      </el-form-item>
    </div>
    <el-form-item label="测量参数">
      <el-select v-model="data.measurementParameters" multiple :disabled="readonly" placeholder="选择测量参数">
        <el-option value="温度" label="温度" />
        <el-option value="湿度" label="湿度" />
        <el-option value="气压" label="气压" />
        <el-option value="风速" label="风速" />
        <el-option value="辐射" label="辐射" />
        <el-option value="光谱" label="光谱" />
      </el-select>
    </el-form-item>

    <!-- 作业范围 -->
    <div class="sub-section">作业范围</div>
    <div class="grid">
      <el-form-item label="作业范围">
        <el-input v-model="data.operationRange" :disabled="readonly" placeholder="如: 100km²" />
      </el-form-item>
      <el-form-item label="典型车速">
        <el-input v-model="data.typicalSpeed" :disabled="readonly" placeholder="如: 30km/h" />
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