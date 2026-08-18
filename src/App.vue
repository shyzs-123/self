<script setup>
import Header from  '@/layouts/Header.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Mapcontainer from '@/map/MapContainer.vue'
import { useWindowStore } from '@/stores/workspace.js'
import Workspace from '@/layouts/Workspace.vue'

const windowStore = useWindowStore()
</script>

<template>
  <div>
     <Header /> 

    <div class="page-wrap">
  <Sidebar />

  <main class="map-stage">
    <Mapcontainer />
    <Workspace />
  </main>
</div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
}

.map-stage {
  position: relative;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
.page-wrap {
  display: flex;

  height: calc(100vh - 60px);
  width: 100vw;          
  overflow: hidden;  
  color: #333;   
}


/* 右侧 Cesium 容器 */
.map-container {
  flex: 1;               /* 占满剩余宽度 */
  height: 100%;          /* 继承父容器高度 */
  background-color: #f7f4f4; /* 备用背景，加载地图前可见 */
}
</style>
