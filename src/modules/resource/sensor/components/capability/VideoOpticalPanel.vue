<script setup lang="ts">
import { computed } from 'vue'
import type { VideoOpticalCapability } from '../../types/platform'

const props = defineProps<{
  modelValue: VideoOpticalCapability
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: VideoOpticalCapability): void
}>()

const data = computed({
  get: () => props.modelValue,
  set: (val: VideoOpticalCapability) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="capability-panel">
    <!-- 视频参数 -->
    <div class="sub-section">视频参数</div>
    <div class="grid">
      <el-form-item label="编码格式">
        <el-input v-model="data.videoCodec" :disabled="readonly" placeholder="如: H.265" />
      </el-form-item>
      <el-form-item label="视频分辨率">
        <el-input v-model="data.resolution" :disabled="readonly" placeholder="如: 4K" />
      </el-form-item>
    </div>
    <div class="grid">
      <el-form-item label="帧率">
        <el-input v-model="data.frameRate" :disabled="readonly" placeholder="如: 30fps" />
      </el-form-item>
      <el-form-item label="码率">
        <el-input v-model="data.bitrate" :disabled="readonly" placeholder="如: 10Mbps" />
      </el-form-item>
    </div>

    <!-- 流地址 -->
    <div class="sub-section">流地址</div>
    <div class="grid">
      <el-form-item label="流媒体地址">
        <el-input v-model="data.streamUrl" :disabled="readonly" placeholder="如: rtmp://192.168.1.1/live" />
      </el-form-item>
      <el-form-item label="协议类型">
        <el-input v-model="data.protocolType" :disabled="readonly" placeholder="如: RTSP / HLS / WebRTC" />
      </el-form-item>
    </div>

    <!-- 视场参数 -->
    <div class="sub-section">视场参数</div>
    <div class="grid">
      <el-form-item label="视场角">
        <el-input v-model="data.fov" :disabled="readonly" placeholder="如: 60°" />
      </el-form-item>
      <el-form-item label="焦距">
        <el-input v-model="data.focalLength" :disabled="readonly" placeholder="如: 12mm" />
      </el-form-item>
    </div>
    <el-form-item label="传感器尺寸">
      <el-input v-model="data.sensorSize" :disabled="readonly" placeholder="如: 1/1.7英寸" />
    </el-form-item>

    <!-- 位置状态 -->
    <div class="sub-section">位置状态</div>
    <div class="grid">
      <el-form-item label="安装位置">
        <el-input v-model="data.installLocation" :disabled="readonly" placeholder="如: 2号门" />
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select v-model="data.deviceStatus" :disabled="readonly" placeholder="选择状态">
          <el-option value="online" label="在线" />
          <el-option value="offline" label="离线" />
          <el-option value="maintenance" label="维护中" />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="数据格式">
      <el-input v-model="data.dataFormat" :disabled="readonly" placeholder="如: MP4 / MJPEG" />
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