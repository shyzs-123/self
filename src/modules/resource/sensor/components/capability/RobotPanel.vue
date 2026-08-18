<script setup lang="ts">
import { computed } from 'vue'
import type { RobotCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: RobotCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: RobotCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: RobotCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 位置信息 -->
    <div class="sub-section">位置信息</div>
    <div class="grid">
      <el-form-item label="当前位置">
        <el-input v-model="data.currentPosition" :disabled="readonly" placeholder="如: 园区A区" />
      </el-form-item>
      <el-form-item label="定位精度">
        <el-input v-model="data.locationAccuracy" :disabled="readonly" placeholder="如: ±0.5m" />
      </el-form-item>
    </div>

    <!-- 移动能力 -->
    <div class="sub-section">移动能力</div>
    <div class="grid">
      <el-form-item label="移动方式">
        <el-select v-model="data.movementType" :disabled="readonly" placeholder="选择移动方式">
          <el-option value="wheeled" label="轮式" />
          <el-option value="tracked" label="履带式" />
          <el-option value="legged" label="足式" />
          <el-option value="aerial" label="飞行" />
          <el-option value="aquatic" label="水栖" />
        </el-select>
      </el-form-item>
      <el-form-item label="最大速度">
        <el-input v-model="data.maxSpeed" :disabled="readonly" placeholder="如: 5km/h" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="续航能力">
        <el-input v-model="data.endurance" :disabled="readonly" placeholder="如: 8h" />
      </el-form-item>
      <el-form-item label="爬坡角度">
        <el-input v-model="data.climbingAngle" :disabled="readonly" placeholder="如: 30°" />
      </el-form-item>
    </div>

    <!-- 载荷与任务 -->
    <div class="sub-section">载荷与任务</div>
    <div class="grid">
      <el-form-item label="载荷名称">
        <el-input v-model="data.payloadName" :disabled="readonly" placeholder="如: 机械臂" />
      </el-form-item>
      <el-form-item label="载荷容量">
        <el-input v-model="data.payloadCapacity" :disabled="readonly" placeholder="如: 10kg" />
      </el-form-item>
    </div>
    <el-form-item label="任务类型">
      <el-select v-model="data.taskTypes" multiple :disabled="readonly" placeholder="选择任务类型">
        <el-option value="巡检" label="巡检" />
        <el-option value="运输" label="运输" />
        <el-option value="抓取" label="抓取" />
        <el-option value="焊接" label="焊接" />
        <el-option value="喷涂" label="喷涂" />
        <el-option value="救援" label="救援" />
        <el-option value="勘探" label="勘探" />
      </el-select>
    </el-form-item>
    <el-form-item label="数据类型">
      <el-select v-model="data.dataTypes" multiple :disabled="readonly" placeholder="选择数据类型">
        <el-option value="影像" label="影像" />
        <el-option value="点云" label="点云" />
        <el-option value="温度" label="温度" />
        <el-option value="压力" label="压力" />
        <el-option value="深度" label="深度" />
        <el-option value="光谱" label="光谱" />
      </el-select>
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
</style>