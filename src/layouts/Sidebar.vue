<script setup>
import { useWindowStore } from '@/stores/workspace.js'

const windowStore = useWindowStore()

const openPanel = (panelName) => {
  windowStore.openPanel(panelName)
}
</script>

<template>
  <header class="ssidebar">
    <h3>控制面板</h3>
    <ul>
      <li><button type="button" class="button" @click="openPanel('task')">任务中心</button></li>
      <li><button type="button" class="button" @click="openPanel('resource')">资源中心</button></li>
      <li><button type="button" class="button" @click="openPanel('application')">应用中心</button></li>
      <li><button type="button" class="button" @click="openPanel('business')">业务中心</button></li>
    </ul>
  </header>
</template>

<style>
.ssidebar {
  position: relative;
  z-index: 30;
  flex: 0 0 224px;
  padding: 20px 12px;
  background-color: #f8fbff;
  border-right: 1px solid #dbeafe;
  box-shadow: 2px 0 10px rgba(30, 64, 175, 0.04);
  color: #1e3a5f;
}

.ssidebar h3 {
  margin: 0 8px 14px;
  color: #1e3a5f;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.ssidebar ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.button {
  display: block;
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  margin: 1px 0;
  padding: 11px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: transparent;
  color: #334155;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.button:hover {
  background-color: #eaf4ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}
</style>
