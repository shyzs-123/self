<script setup lang="ts">
import { computed } from 'vue'
import type { UavCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: UavCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: UavCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: UavCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 飞行性能 -->
    <div class="sub-section">飞行性能</div>
    <div class="grid">
      <el-form-item label="航高">
        <el-input v-model="data.flightAltitude" :disabled="readonly" placeholder="如: 500m" />
      </el-form-item>
      <el-form-item label="航速">
        <el-input v-model="data.flightSpeed" :disabled="readonly" placeholder="如: 20m/s" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="续航时间">
        <el-input v-model="data.endurance" :disabled="readonly" placeholder="如: 45min" />
      </el-form-item>
      <el-form-item label="起降点">
        <el-input v-model="data.takeoffLandingPoint" :disabled="readonly" placeholder="如: 北京延庆" />
      </el-form-item>
    </div>

    <!-- 载荷能力 -->
    <div class="sub-section">载荷能力</div>
    <div class="grid">
      <el-form-item label="载荷名称">
        <el-input v-model="data.payloadName" :disabled="readonly" placeholder="如: 多光谱相机" />
      </el-form-item>
      <el-form-item label="载荷重量">
        <el-input v-model="data.payloadWeight" :disabled="readonly" placeholder="如: 2.5kg" />
      </el-form-item>
    </div>
    <el-form-item label="视场角">
      <el-input v-model="data.fov" :disabled="readonly" placeholder="如: 60°" />
    </el-form-item>

    <!-- 作业范围 -->
    <div class="sub-section">作业范围</div>
    <div class="grid">
      <el-form-item label="作业范围">
        <el-input v-model="data.operationRange" :disabled="readonly" placeholder="如: 50km²" />
      </el-form-item>
      <el-form-item label="最大作业半径">
        <el-input v-model="data.maxRadius" :disabled="readonly" placeholder="如: 10km" />
      </el-form-item>
    </div>

    <!-- 通信能力 -->
    <div class="sub-section">通信能力</div>
    <div class="grid">
      <el-form-item label="通信类型">
        <el-input v-model="data.communicationType" :disabled="readonly" placeholder="如: 4G" />
      </el-form-item>
      <el-form-item label="控制频率">
        <el-input v-model="data.controlFrequency" :disabled="readonly" placeholder="如: 2.4GHz" />
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
:deep(.el-input-number) {
  width: 100%;
}
</style>