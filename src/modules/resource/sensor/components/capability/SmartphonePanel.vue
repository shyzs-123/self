<script setup lang="ts">
import { computed } from 'vue'
import type { SmartphoneCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: SmartphoneCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: SmartphoneCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: SmartphoneCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 终端信息 -->
    <div class="sub-section">终端信息</div>
    <div class="grid">
      <el-form-item label="终端型号">
        <el-input v-model="data.terminalModel" :disabled="readonly" placeholder="如: iPhone 15" />
      </el-form-item>
      <el-form-item label="匿名标识">
        <el-input v-model="data.anonymousId" :disabled="readonly" placeholder="如: ANON-001" />
      </el-form-item>
    </div>
    <el-form-item label="操作系统版本">
      <el-input v-model="data.osVersion" :disabled="readonly" placeholder="如: iOS 17.0" />
    </el-form-item>

    <!-- 定位能力 -->
    <div class="sub-section">定位能力</div>
    <div class="grid">
      <el-form-item label="定位方式">
        <el-input v-model="data.positioningType" :disabled="readonly" placeholder="如: GPS+基站+WiFi" />
      </el-form-item>
      <el-form-item label="定位精度">
        <el-input v-model="data.positioningAccuracy" :disabled="readonly" placeholder="如: ±5m" />
      </el-form-item>
    </div>

    <!-- 采集能力 -->
    <div class="sub-section">采集能力</div>
    <el-form-item label="传感器类型">
      <el-select v-model="data.sensorTypes" multiple :disabled="readonly" placeholder="选择传感器类型">
        <el-option value="陀螺仪" label="陀螺仪" />
        <el-option value="加速度计" label="加速度计" />
        <el-option value="磁力计" label="磁力计" />
        <el-option value="气压计" label="气压计" />
        <el-option value="光传感器" label="光传感器" />
        <el-option value="麦克风" label="麦克风" />
        <el-option value="摄像头" label="摄像头" />
      </el-select>
    </el-form-item>
    <div class="grid">
      <el-form-item label="采集频率">
        <el-input v-model="data.collectFrequency" :disabled="readonly" placeholder="如: 10Hz" />
      </el-form-item>
      <el-form-item label="数据类型">
        <el-select v-model="data.dataTypes" multiple :disabled="readonly" placeholder="选择数据类型">
          <el-option value="位置" label="位置" />
          <el-option value="加速度" label="加速度" />
          <el-option value="影像" label="影像" />
          <el-option value="音频" label="音频" />
          <el-option value="环境数据" label="环境数据" />
        </el-select>
      </el-form-item>
    </div>

    <!-- 众包权限 -->
    <div class="sub-section">众包权限</div>
    <div class="grid">
      <el-form-item label="众包启用">
        <el-switch v-model="data.crowdsourcingEnabled" :disabled="readonly" />
      </el-form-item>
      <el-form-item label="权限级别">
        <el-input v-model="data.permissionLevel" :disabled="readonly" placeholder="如: 基础/高级" />
      </el-form-item>
    </div>
    <el-form-item label="数据共享范围">
      <el-input v-model="data.dataSharingScope" :disabled="readonly" placeholder="如: 公共/团队/私有" />
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
:deep(.el-select) {
  width: 100%;
}
:deep(.el-input-number) {
  width: 100%;
}
</style>