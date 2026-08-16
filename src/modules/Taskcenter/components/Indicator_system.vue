<template>
  <div class="page-wrap">
    <!-- 顶部标题 -->
    
    <!-- 搜索栏 -->
    <div class="page-content">
      <el-form :model="form" label-width="auto" class="search-form">
        <el-row justify="start" align="middle" class="search-row">
          <el-col class="search-col">
            <el-form-item label="" class="form-item-no-margin">
              <el-input v-model="form.name" class="input-name" placeholder="搜索指标" />
            </el-form-item>
          </el-col>
          <el-col class="search-col">
            <el-form-item label="指标体系" class="form-item-no-margin">
              <el-select v-model="form.region" placeholder="" class="select-zone">
                <el-option label="指标体系1" value="id1" />
                <el-option label="指标体系2" value="id2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="search-col-btn">
            <el-form-item label="&nbsp;" class="form-item-no-margin">
              <div class="button-group">
                <el-button type="primary" @click="onSubmit">新建指标体系</el-button>
                <el-button>删除指标体系</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 主体区域 -->
    <section class="page-body">
      <div class="page-left">
        <div class="page-header">
          <div>
            <h3>指标体系</h3>
          </div>
          <div class="header-actions"></div>
        </div>
        <div class="tree-slot">
          <el-tree-v2 :data="data" :props="props" :height="200" class="tree-v2" />
        </div>
      </div>

      <div class="page-right">
        <div class="page-header">
          <div>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
              <div class="editor-grid">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name" maxlength="64" />
                </el-form-item>
                <el-form-item label="编码" prop="code">
                  <el-input v-model="form.code" maxlength="64" />
                </el-form-item>
                <el-form-item label="所属层级" prop="level">
                  <el-select v-model="form.level">
                    <el-option v-for="option in levelOptions" :key="option.value" :label="option.label"
                      :value="option.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="指标属性" prop="property">
                  <el-select v-model="form.property">
                    <el-option v-for="option in propertyOptions" :key="option.value" :label="option.label"
                      :value="option.value" />
                  </el-select>
                </el-form-item>
                <el-form-item class="span-all" label="描述" prop="description">
                  <el-input v-model="form.description" :rows="3" type="textarea" />
                </el-form-item>
                <el-form-item class="span-all" label="计算规则" prop="calculationRule">
                  <el-input v-model="form.calculationRule" :rows="3" type="textarea" />
                </el-form-item>
                <el-form-item class="span-all" label="观测要求" prop="observationRequirement">
                  <el-input v-model="form.observationRequirement" :rows="3" type="textarea" />
                </el-form-item>
                <el-form-item class="span-all" label="关联资源" prop="relatedResourceIds">
                  <el-select v-model="form.relatedResourceIds" multiple filterable placeholder="选择关联资源">
                    <el-option v-for="resource in resources" :key="resource.id"
                      :label="`${resource.name} (${resource.code})`" :value="resource.id" />
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="clear">清空</el-button>
              </div>
            </el-form>
          </div>

        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue'

const form = reactive({
  name: '',
  region: '',
})

const onSubmit = () => {
  console.log('submit!')
}
const clear = () => {
  console.log('clear!')
}
interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const getKey = (prefix: string, id: number) => {
  return `${prefix}-${id}`
}

const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = 'node'
): Tree[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}

const data = createData(4, 30, 40)
</script>

<style scoped>
/* ==================== 树组件 ==================== */
.tree-v2 {
  width: 100%;
}

/* ==================== 页面容器 ==================== */
.page-wrap {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 16px;
}

/* ==================== 顶部标题 ==================== */
.toolbar-slot {
  height: 48px;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  text-indent: 20px;
  margin-top: 20px;
}

/* ==================== 搜索栏 ==================== */
.page-content {
  margin-top: 16px;
  padding: 0 20px;
}

.search-form {
  width: 100%;
}

.search-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.search-col {
  flex: 0 0 auto;
  padding-left: 0 !important;
  padding-right: 8px !important;
}

.search-col-btn {
  flex: 0 0 auto;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.form-item-no-margin {
  margin-bottom: 0;
}

.input-name {
  width: 120px;
}

.select-zone {
  width: 120px;
}

/* ==================== 按钮组 ==================== */
.button-group {
  display: flex;
  gap: 8px;
}

/* ==================== 主体区域 ==================== */
.page-body {
  display: grid;
  flex: 1;
  min-height: 0;
  grid-template-columns: minmax(340px, 440px) 1fr;
  gap: 12px;
}

.page-left,
.page-right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}

.page-right {
  padding: 18px;
}

/* ==================== 卡片头部 ==================== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--el-border-color);
  flex-shrink: 0;
}

.page-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.page-header p {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* ==================== 内容区域 ==================== */
.tree-slot,
.editor-slot {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px 16px;
}
</style>