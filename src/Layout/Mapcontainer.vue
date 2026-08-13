<template>
  <div ref="containerRef" class="map-container"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const containerRef = ref(null)
let viewer = null

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTkwZjdiYy04N2FjLTQ3ZmYtOGQ5My1jM2M2OTIwNjUzOTIiLCJpZCI6NDYzMDE4LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODU2MzU1NTJ9.Nvp49PJz7-YCdtnMZbQGghRUESTHMiYbWAPV_QLnMSo'

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
  if (!containerRef.value || viewer) {
    return
  }

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
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy()
  }
  viewer = null
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
