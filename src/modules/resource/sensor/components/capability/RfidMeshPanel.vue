<script setup lang="ts">
import { computed } from 'vue'
import type { RfidMeshCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: RfidMeshCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: RfidMeshCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: RfidMeshCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 网关信息 -->
    <div class="sub-section">网关信息</div>
    <div class="grid">
      <el-form-item label="网关标识">
        <el-input v-model="data.gatewayId" :disabled="readonly" placeholder="如: GW-001" />
      </el-form-item>
      <el-form-item label="网关类型">
        <el-input v-model="data.gatewayType" :disabled="readonly" placeholder="如: LoRa网关" />
      </el-form-item>
    </div>

    <!-- 网络拓扑 -->
    <div class="sub-section">网络拓扑</div>
    <div class="grid">
      <el-form-item label="拓扑类型">
        <el-select v-model="data.topologyType" :disabled="readonly" placeholder="选择拓扑类型">
          <el-option value="star" label="星型" />
          <el-option value="tree" label="树型" />
          <el-option value="mesh" label="网状" />
        </el-select>
      </el-form-item>
      <el-form-item label="节点数量">
        <el-input-number v-model="data.nodeCount" :disabled="readonly" :min="0" placeholder="节点数" />
      </el-form-item>
    </div>
    <el-form-item label="最大跳数">
      <el-input-number v-model="data.maxHopCount" :disabled="readonly" :min="0" placeholder="如: 5" />
    </el-form-item>

    <!-- 覆盖区域 -->
    <div class="sub-section">覆盖区域</div>
    <div class="grid">
      <el-form-item label="覆盖半径">
        <el-input v-model="data.coverageRadius" :disabled="readonly" placeholder="如: 500m" />
      </el-form-item>
      <el-form-item label="覆盖面积">
        <el-input v-model="data.coverageArea" :disabled="readonly" placeholder="如: 0.8km²" />
      </el-form-item>
    </div>

    <!-- 标签配置 -->
    <div class="sub-section">标签配置</div>
    <el-form-item label="标签类型">
      <el-select v-model="data.tagTypes" multiple :disabled="readonly" placeholder="选择标签类型">
        <el-option value="主动式" label="主动式" />
        <el-option value="被动式" label="被动式" />
        <el-option value="半主动式" label="半主动式" />
      </el-select>
    </el-form-item>
    <el-form-item label="最大标签数">
      <el-input-number v-model="data.maxTagCount" :disabled="readonly" :min="0" placeholder="如: 1000" />
    </el-form-item>

    <!-- 采样参数 -->
    <div class="sub-section">采样参数</div>
    <div class="grid">
      <el-form-item label="采样频率">
        <el-input v-model="data.sampleFrequency" :disabled="readonly" placeholder="如: 1Hz" />
      </el-form-item>
      <el-form-item label="读取距离">
        <el-input v-model="data.readRange" :disabled="readonly" placeholder="如: 10m" />
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
:deep(.el-input-number) {
  width: 100%;
}
</style>