<template>
  <div ref="containerRef" class="map-container"></div>
  <!-- 工具栏增加清空按钮 -->
  <div class="tool-bar" style="position: absolute;top:10px;left:10px;z-index:999;display:flex;gap:6px;">
    <button @click="startDistance" >📏</button>
    <button @click="startArea">⬟</button>
    <button @click="startRect">▢</button>
    <button @click="startCircle">⭕</button>
    <button @click="clearMeasure" style="color:red;">🗑🗑🗑</button>
</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import Measure from '@/map/measure/measure.js'

const containerRef = ref(null)
let viewer = null
// 定义量测工具实例
let measureTool = null

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTkwZjdiYy04N2FjLTQ3ZmYtOGQ5My1jM2M2OTIwNjUzOTIiLCJpZCI6NDYzMDE4LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODU2MzU1NTJ9.Nvp49PJz7-YCdtnMZbQGghRUESTHMiYbWAPV_QLnMSo'

const cesiumConfig = {
  homeButton: false,
  sceneModePicker: false,
  fullscreenButton: false,
  infoBox: false,
  selectionIndicator: false,
  baseLayerPicker: false,
  shadows: false,
  shouldAnimate: false,
  animation: false,
  timeline: false,
  geocoder: false,
  navigationHelpButton: false,
  contextOptions: {
    contextType: 2,
  },
  creditContainer: document.createElement('div'),
}

const initMap = () => {
  if (!containerRef.value || viewer) return
  viewer = new Cesium.Viewer(containerRef.value, cesiumConfig)
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(114.3, 30.6, 35000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 2,
  })

  // 地图初始化完成后实例化量测工具
  measureTool = new Measure(viewer, {
    basePath: ''
  })
}

// 1. 测距
const startDistance = () => {
  measureTool.drawLineMeasureGraphics({
    clampToGround: true,
    measure: true,
    style: {
      line: { width: 3, material: Cesium.Color.BLUE.withAlpha(0.7) },
      point: { pixelSize: 8, color: Cesium.Color.WHITE }
    },
    callback: (res) => {
      console.log('测距结果：', res.measure, '坐标点：', res.points)
    }
  })
}

// 2. 测面积
const startArea = () => {
  measureTool.drawAreaMeasureGraphics({
    clampToGround: true,
    measure: true,
    // 开启centerPoint才会在中心显示面积文字
    centerPoint: true,
    style: {
      polygon: { material: Cesium.Color.GREEN.withAlpha(0.15) },
      line: { width: 2, material: Cesium.Color.GREEN },
      // 中心点样式配置
      centerPoint: {
        pixelSize: 6,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE
      }
    },
    callback: (res) => {
      console.log('面积：', res.measure, '点位：', res.points)
    }
  })
}


// 4. 矩形量测
const startRect = () => {
  measureTool.drawRectangleMeasureGraphics({
    clampToGround: true,
    measure: true,
    style: { centerPoint: true },
    callback: (res) => {
      console.log('矩形面积', res.measure)
    }
  })
}

// 5. 圆形量测
const startCircle = () => {
  measureTool.drawCircleMeasureGraphics({
    clampToGround: true,
    measure: true,
    callback: (res) => {
      console.log('圆半径', res.radius, '圆心坐标', res.center)
    }
  })
}

// ===== 新增：清空所有量测绘制 =====
const clearMeasure = () => {
  if (!measureTool) return
  // 清空measureLayer图层下所有点、线、面、标注
  measureTool._drawLayer.entities.removeAll()
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy()
  }
  viewer = null
  measureTool = null
})
</script>

<style scoped>

.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}
</style>
