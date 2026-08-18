<template>
  <div class="knowledge-page">
    <!-- 上半部分：左侧树列 + 右侧表格区 -->
    <div class="knowledge-top">
      <!-- 左侧：树列 -->
      <div class="knowledge-sidebar">
        <div class="sidebar-header">
          <span>知识分类</span>
          <el-button type="primary" link size="small" @click="handleAddRoot">
            <el-icon><Plus /></el-icon>新建分类
          </el-button>
        </div>
        <div class="sidebar-body">
          <el-tree-v2
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            :height="treeHeight"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="tree-node" :class="{ current: data.id === currentId }">
                <span class="tree-label" @click="handleNodeClick(data)">
                  {{ data.label }}
                  
                  <el-badge v-if="data.count" :value="data.count" class="badge" />
                </span>
                <span class="tree-actions">
                  <el-button link size="small" @click.stop="addChild(data)">
                    <el-icon><Plus /></el-icon>
                  </el-button>
                  <template v-if="!data.root">
                    <el-button link size="small" @click.stop="editNode(data)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button link type="danger" size="small" @click.stop="deleteNode(data)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </template>
                </span>
              </div>
            </template>
          </el-tree-v2>
        </div>
      </div>

      <!-- 右侧：工具条 + 表格 -->
      <div class="knowledge-right">
        <!-- 工具条 -->
        <div class="main-toolbar">
          <h2 class="main-title">知识库</h2>
          <div class="toolbar-actions">
            <el-select v-model="filterType" clearable placeholder="知识类型" style="width:140px" @change="search">
              <el-option v-for="t in typeOptions" :key="t.value" :label="t.label" :value="t.value" />
            </el-select>
            <el-input v-model="keyword" clearable placeholder="搜索..." style="width:200px" @keyup.enter="search">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="refresh"><el-icon><Refresh /></el-icon>刷新</el-button>
            <el-button type="primary" plain @click="openCreate"><el-icon><Plus /></el-icon>新增知识</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <div class="main-table">
          <el-table :data="pageData" height="100%" v-loading="loading" border>
            <el-table-column prop="title" label="知识标题" min-width="180">
              <template #default="{ row }">
                <el-tag :type="row.typeColor" size="small">{{ row.typeLabel }}</el-tag>
                {{ row.title }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="所属分类" width="120" />
            <el-table-column prop="tags" label="标签" width="160">
              <template #default="{ row }">
                <el-tag v-for="tag in row.tags" :key="tag" size="small" type="info" effect="plain" style="margin-right:4px">
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="创建人" width="100" />
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="openView(row)"><el-icon><View /></el-icon>查看</el-button>
                <el-button link type="primary" size="small" @click="openEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
                <el-button link type="danger" size="small" @click="remove(row)"><el-icon><Delete /></el-icon>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 下半部分：分页器 -->
    <div class="knowledge-bottom">
      <div class="main-pagination">
        <span class="pagination-info">共 {{ filteredData.length }} 篇</span>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredData.length"
          layout="sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 弹窗/抽屉 -->
    <Knowledge_FormDialog v-model="formShow" :mode="formMode" :knowledge="formData" @save="saveData" />
    <Knowledge_DetailDrawer v-model="detailShow" :knowledge="detailData" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import Knowledge_FormDialog from '@/modules/resource/components/Knowledge_FormDialog.vue'
import Knowledge_DetailDrawer from '@/modules/resource/components/Knowledge_DetailDrawer.vue'

type KnowType = 'standard' | 'indicator' | 'business' | 'sensor' | 'algorithm' | 'expert' | 'case'

interface TreeNode {
  id: string
  label: string
  count?: number
  root?: boolean
  children?: TreeNode[]
}

interface Knowledge {
  id: string
  title: string
  type: KnowType
  category: string
  typeLabel: string
  typeColor: string
  tags: string[]
  content: string
  author: string
  createTime: string
  updateTime: string
  remark: string
}

// ==================== 树 ====================
const treeRef = ref()
const currentId = ref('')
const treeProps = { 
    value: 'id', 
    label: 'label', 
    children: 'children' }

const typeMap: Record<KnowType, { label: string; color: string }> = {
  standard: { label: '标准规范', color: 'primary' },
  indicator: { label: '指标规则', color: 'success' },
  business: { label: '业务规则', color: 'warning' },
  sensor: { label: '传感器知识', color: 'info' },
  algorithm: { label: '算法说明', color: 'danger' },
  expert: { label: '专家经验', color: '' },
  case: { label: '历史案例', color: '' }
}

let idCounter = 0
const genId = () => `n-${++idCounter}`

const rootLabels = ['标准规范', '指标规则', '传感器知识', '算法说明', '业务规则', '专家经验', '历史案例']

const treeData = ref<TreeNode[]>(
  rootLabels.map(label => ({
    id: `root-${label}`,
    label,
    count: Math.floor(Math.random() * 30) + 5,
    root: true,
    children: [
      { id: genId(), label: `${label}子类1` },
      { id: genId(), label: `${label}子类2` }
    ]
  }))
)

const treeHeight = computed(() => {
  const count = treeData.value.reduce((sum, n) => sum + 1 + (n.children?.length || 0), 0)
  return Math.min(Math.max(count * 36 + 20, 200), 600)
})

function findNode(tree: TreeNode[], id: string): TreeNode | null {
  for (const n of tree) {
    if (n.id === id) return n
    if (n.children) {
      const found = findNode(n.children, id)
      if (found) return found
    }
  }
  return null
}

function findParent(tree: TreeNode[], childId: string): TreeNode | null {
  for (const node of tree) {
    if (node.children?.some(c => c.id === childId)) return node
    if (node.children) {
      const found = findParent(node.children, childId)
      if (found) return found
    }
  }
  return null
}

function getRootLabel(node: TreeNode): string {
  if (node.root) return node.label
  for (const root of treeData.value) {
    if (root.children?.some(c => c.id === node.id || findNode(root.children || [], node.id))) {
      return root.label
    }
  }
  return node.label
}

function handleNodeClick(data: TreeNode) {
  currentId.value = data.id
  selectedCategory.value = data.root ? data.label : getRootLabel(data)
  page.value = 1
  search()
}

function addChild(parent: TreeNode) {
  ElMessageBox.prompt('子类名称', '新增子类', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '名称不能为空'
  }).then(({ value }) => {
    if (!value) return
    const parentNode = findNode(treeData.value, parent.id)
    if (!parentNode) return
    if (!parentNode.children) parentNode.children = []
    parentNode.children.push({ id: genId(), label: value.trim() })
    treeData.value = [...treeData.value]
    nextTick(() => treeRef.value?.expandNode(parent.id))
  }).catch(() => {})
}

function editNode(data: TreeNode) {
  if (data.root) return
  ElMessageBox.prompt('新名称', '编辑分类', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: data.label,
    inputPattern: /\S+/,
    inputErrorMessage: '名称不能为空'
  }).then(({ value }) => {
    if (!value) return
    const node = findNode(treeData.value, data.id)
    if (node) { node.label = value.trim(); treeData.value = [...treeData.value] }
  }).catch(() => {})
}

function deleteNode(data: TreeNode) {
  if (data.root) return
  ElMessageBox.confirm(`删除「${data.label}」？`, '确认', { type: 'warning' })
    .then(() => {
      const parent = findParent(treeData.value, data.id)
      if (parent?.children) {
        parent.children = parent.children.filter(c => c.id !== data.id)
        if (!parent.children.length) parent.children = []
        treeData.value = [...treeData.value]
        if (currentId.value === data.id) { currentId.value = ''; selectedCategory.value = null }
      }
    }).catch(() => {})
}

function handleAddRoot() {
  ElMessageBox.prompt('分类名称', '新建分类', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '名称不能为空'
  }).then(({ value }) => {
    if (!value) return
    treeData.value.push({
      id: `root-${Date.now()}`,
      label: value.trim(),
      count: 0,
      root: true,
      children: []
    })
    treeData.value = [...treeData.value]
  }).catch(() => {})
}

// ==================== 知识数据 ====================
const categoryMap: Record<KnowType, string> = {
  standard: '标准规范',
  indicator: '指标规则',
  business: '业务规则',
  sensor: '传感器知识',
  algorithm: '算法说明',
  expert: '专家经验',
  case: '历史案例'
}

const knowledgeData = ref<Knowledge[]>(
  Array.from({ length: 35 }, (_, i) => {
    const types: KnowType[] = ['standard', 'indicator', 'business', 'sensor', 'algorithm', 'expert', 'case']
    const type = types[i % types.length]
    const tagGroups = [
      ['遥感', '监测'], ['水质', '生态'], ['预警', '应急'],
      ['光学', '数据'], ['分类', 'AI'], ['经验', '方法'], ['案例', '分析']
    ]
    return {
      id: `K-${String(i + 1).padStart(4, '0')}`,
      title: `${typeMap[type].label}文档 ${i + 1}`,
      type,
      category: categoryMap[type],
      typeLabel: typeMap[type].label,
      typeColor: typeMap[type].color,
      tags: tagGroups[i % tagGroups.length],
      content: `${typeMap[type].label}文档 ${i + 1} 详细内容...`,
      author: ['张工', '李工', '王工', '赵工', '孙工', '刘工', '陈工'][i % 7],
      createTime: `2026-08-${String(i + 1).padStart(2, '0')}`,
      updateTime: `2026-08-${String(i + 1).padStart(2, '0')}`,
      remark: ''
    }
  })
)

// ==================== 状态 ====================
const keyword = ref('')
const filterType = ref<KnowType | ''>('')
const selectedCategory = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const formShow = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formData = ref<Omit<Knowledge, 'id' | 'createTime' | 'updateTime'> | null>(null)

const detailShow = ref(false)
const detailData = ref<Knowledge | null>(null)

const typeOptions = [
  { value: '', label: '全部' },
  ...Object.entries(typeMap).map(([k, v]) => ({ value: k, label: v.label }))
]

// ==================== 计算 ====================
const filteredData = computed(() => {
  let data = knowledgeData.value
  if (filterType.value) data = data.filter(d => d.type === filterType.value)
  if (selectedCategory.value) data = data.filter(d => d.category === selectedCategory.value)
  if (keyword.value.trim()) {
    const k = keyword.value.trim().toLowerCase()
    data = data.filter(d => d.title.toLowerCase().includes(k) || d.tags.some(t => t.includes(k)))
  }
  return data
})

const pageData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// ==================== 方法 ====================
function search() { page.value = 1 }
function refresh() { loading.value = true; setTimeout(() => { loading.value = false }, 400) }

function openCreate() {
  formMode.value = 'create'
  formData.value = { title: '', type: 'standard', category: '', typeLabel: '', typeColor: '', tags: [], content: '', author: '', remark: '' }
  formShow.value = true
}

function openEdit(row: Knowledge) {
  formMode.value = 'edit'
  const { id, createTime, updateTime, ...rest } = row
  formData.value = rest
  formShow.value = true
}

function openView(row: Knowledge) {
  detailData.value = { ...row }
  detailShow.value = true
}

function saveData(data: Omit<Knowledge, 'id' | 'createTime' | 'updateTime'>) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  if (formMode.value === 'create') {
    knowledgeData.value.unshift({ ...data, id: `K-${Date.now()}`, createTime: now, updateTime: now })
  } else {
    const idx = knowledgeData.value.findIndex(d => d.id === detailData.value?.id)
    if (idx >= 0) knowledgeData.value[idx] = { ...data, id: detailData.value!.id, createTime: detailData.value!.createTime, updateTime: now }
  }
}

async function remove(row: Knowledge) {
  try {
    await ElMessageBox.confirm(`删除「${row.title}」？`, '确认', { type: 'warning' })
    knowledgeData.value = knowledgeData.value.filter(d => d.id !== row.id)
  } catch {}
}
</script>

<style scoped>
.knowledge-page {
  display: flex;
  flex-direction: column;
  height: 80vh;
  padding: 16px;
  gap: 12px;
  background: #f5f7fa;
  overflow: hidden;
  box-sizing: border-box;
}

.knowledge-top {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.knowledge-sidebar {
  width: 220px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.sidebar-body {
  flex: 1;
  overflow: hidden;
  padding: 8px 4px;
  min-height: 0;
}
.sidebar-body :deep(.el-tree-v2) {
  height: 100% !important;
}

.knowledge-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.main-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  flex-shrink: 0;
}

.main-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.main-table {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
.main-table :deep(.el-table) {
  height: 100%;
}
.main-table :deep(.el-table__body-wrapper) {
  height: calc(100% - 48px);
  overflow-y: auto;
}

.knowledge-bottom {
  flex-shrink: 0;
}

.main-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  width: 100%;
  box-sizing: border-box;
  min-height: 56px;
}

.pagination-info {
  color: #909399;
  font-size: 13px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  border-radius: 4px;
  transition: .2s;
  cursor: pointer;
}
.tree-node:hover {
  background: #f0f5ff;
}
.tree-node.current {
  background: #e6f0ff;
}
.tree-node.current .tree-label {
  color: #1677ff;
  font-weight: 600;
}
.tree-label {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: #303133;
}
.tree-actions {
  display: none;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.tree-node:hover .tree-actions {
  display: flex;
}
.tree-actions .el-button {
  padding: 2px 4px;
  font-size: 14px;
}
.badge :deep(.el-badge__content) {
  background: #f5f7fa;
  color: #909399;
  font-size: 11px;
  border: none;
}

@media (max-width: 1024px) {
  .main-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar-actions .el-select,
  .toolbar-actions .el-input {
    width: 100% !important;
  }
  .toolbar-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .knowledge-page {
    padding: 8px;
    height: auto;
  }
  .knowledge-top {
    flex-direction: column;
    min-height: 500px;
  }
  .knowledge-sidebar {
    width: 100%;
    min-width: 0;
    height: 250px;
  }
  .main-pagination {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
}
</style>
