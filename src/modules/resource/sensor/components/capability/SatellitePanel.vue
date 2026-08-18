<script setup lang="ts">
import { computed } from 'vue'
import type { SatelliteCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: SatelliteCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: SatelliteCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: SatelliteCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 轨道参数 -->
    <div class="sub-section">轨道参数</div>
    <div class="grid">
      <el-form-item label="轨道高度">
        <el-input v-model="data.orbitHeight" :disabled="readonly" placeholder="如: 645km" />
      </el-form-item>
      <el-form-item label="轨道周期">
        <el-input v-model="data.orbitPeriod" :disabled="readonly" placeholder="如: 96min" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="轨道倾角">
        <el-input v-model="data.inclination" :disabled="readonly" placeholder="如: 98.2°" />
      </el-form-item>
      <el-form-item label="偏心率">
        <el-input v-model="data.eccentricity" :disabled="readonly" placeholder="如: 0.001" />
      </el-form-item>
    </div>
    <el-form-item label="NORAD编号">
      <el-input v-model="data.noradId" :disabled="readonly" placeholder="如: 12345" />
    </el-form-item>

    <!-- 载荷能力 -->
    <div class="sub-section">载荷能力</div>
    <div class="grid">
      <el-form-item label="载荷名称">
        <el-input v-model="data.payloadName" :disabled="readonly" placeholder="如: 宽幅相机" />
      </el-form-item>
      <el-form-item label="载荷类型">
        <el-input v-model="data.payloadType" :disabled="readonly" placeholder="如: 光学" />
      </el-form-item>
    </div>

    <!-- 观测能力 -->
    <div class="sub-section">观测能力</div>
    <div class="grid">
      <el-form-item label="空间分辨率">
        <el-input v-model="data.spatialResolution" :disabled="readonly" placeholder="如: 16m" />
      </el-form-item>
      <el-form-item label="观测幅宽">
        <el-input v-model="data.swath" :disabled="readonly" placeholder="如: 800km" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="重访周期">
        <el-input v-model="data.revisitTime" :disabled="readonly" placeholder="如: 2天" />
      </el-form-item>
      <el-form-item label="覆盖能力">
        <el-input v-model="data.coverageCapability" :disabled="readonly" placeholder="如: 全球覆盖" />
      </el-form-item>
    </div>

    <!-- 频谱能力 -->
    <div class="sub-section">频谱能力</div>
    <div class="grid">
      <el-form-item label="波长范围">
        <el-input v-model="data.wavelengthRange" :disabled="readonly" placeholder="如: 450-900nm" />
      </el-form-item>
      <el-form-item label="波段数量">
        <el-input-number v-model="data.spectrumNumber" :disabled="readonly" :min="1" :max="255" />
      </el-form-item>
    </div>
    <el-form-item label="波段类型">
      <el-input v-model="data.spectrumCategory" :disabled="readonly" placeholder="如: 可见光-近红外" />
    </el-form-item>
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
:deep(.el-input-number) {
  width: 100%;
}
</style>