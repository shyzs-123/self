<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import VersionDrawer from '@/modules/task/components/VersionDrawer.vue'
import VersionFormDialog from '@/modules/task/components/VersionFormDialog.vue'

// ==================== 类型定义 ====================

type IndicatorStatus = '进行中' | '待审核' | '已完成'

interface SnapshotItem {
  objectCount: number
  domainCount: number
  themeCount: number
  indicatorCount: number
  observationCount: number
  keyNodes: string[]
}

interface Version {
  id?: string
  versionNo: string
  releaseTime: string
  modifier: string
  changeContent: string
  referencedTaskCount: number
  description: string
  systemName: string
  status: IndicatorStatus
  snapshot: SnapshotItem
}

// ==================== 响应式数据 ====================

const drawerVisible = ref(false)
const selectRow = ref<Version | null>(null)

const versionDialogVisible = ref(false)
const versionDialogMode = ref<'create' | 'edit'>('create')
const currentEditVersion = ref<Version | null>(null)

const text = {
  actions: '操作',
}

const statusClassMap: Record<IndicatorStatus, string> = {
  进行中: 'status--running',
  待审核: 'status--pending',
  已完成: 'status--done',
}

// ✅ 使用 ref 包裹，使其成为响应式数据
const tableData = ref<Version[]>([
  {
    versionNo: '1.2',
    releaseTime: '2026-08-12',
    modifier: 'wangling',
    changeContent: '内容内容内容内容内容内容内容内容内容',
    referencedTaskCount: 8,
    description: '测试版本说明',
    systemName: '指标体系V1',
    status: '进行中',
    snapshot: {
      objectCount: 12,
      domainCount: 5,
      themeCount: 9,
      indicatorCount: 36,
      observationCount: 18,
      keyNodes: ['节点A', '节点B', '节点C']
    }
  },
  {
    versionNo: '1.1',
    releaseTime: '2026-08-12',
    modifier: 'wangling',
    changeContent: '数据分析功能内容内容内容内容内容内容内容',
    referencedTaskCount: 8,
    description: '历史版本',
    systemName: '指标体系V1',
    status: '待审核',
    snapshot: {
      objectCount: 10,
      domainCount: 4,
      themeCount: 7,
      indicatorCount: 22,
      observationCount: 11,
      keyNodes: ['旧节点']
    }
  }
])

// ==================== 查看抽屉 ====================

const handleView = (row: Version) => {
  selectRow.value = row
  drawerVisible.value = true
  console.log('父传递行数据', row)
}

// 只有从打开→关闭时才清空，刚打开不清空
watch(drawerVisible, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    selectRow.value = null
  }
})

// ==================== 编辑/删除 ====================

const handleEdit = (row: Version) => {
  console.log('编辑', row)
  handleEditVersion(row)
}

const handleDelete = (row: Version) => {
  console.log('删除', row)
  // 确认删除
  const index = tableData.value.findIndex(item => item.versionNo === row.versionNo)
  if (index !== -1) {
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

// ==================== 新建/编辑版本弹窗 ====================

// 打开新建版本弹窗
const handleCreateVersion = () => {
  versionDialogMode.value = 'create'
  currentEditVersion.value = null
  versionDialogVisible.value = true
}

// 打开编辑版本弹窗
const handleEditVersion = (row: Version) => {
  versionDialogMode.value = 'edit'
  currentEditVersion.value = row
  versionDialogVisible.value = true
}

// ✅ 保存版本 - 核心逻辑
const handleSaveVersion = (version: Version) => {
  console.log('保存版本数据:', version)

  if (versionDialogMode.value === 'create') {
    // ✅ 新建：添加到列表最前面（最新版本显示在最前）
    tableData.value.unshift(version)
    ElMessage.success('版本创建成功！')
    console.log('当前列表:', tableData.value)
  } else {
    // ✅ 编辑：更新对应版本
    const index = tableData.value.findIndex(item => item.versionNo === version.versionNo)
    if (index !== -1) {
      tableData.value[index] = version
      ElMessage.success('版本更新成功！')
      console.log('更新后的列表:', tableData.value)
    } else {
      ElMessage.error('未找到要更新的版本')
    }
  }

  // 关闭弹窗
  versionDialogVisible.value = false
}
</script>

<template>
  <section class="indicator-management">
    <!-- 标题和操作栏 -->
    <div class="indicator-management__header">
     
      <el-button type="primary" @click="handleCreateVersion">新建版本</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" :default-sort="{ prop: 'releaseTime', order: 'descending' }" style="width: 100%">
      <el-table-column prop="versionNo" label="版本" sortable width="100" />
      <el-table-column prop="releaseTime" label="发布时间" width="120" />
      <el-table-column label="修改内容" min-width="200">
        <template #default="{ row }">
          <el-tooltip :content="row.changeContent" placement="top-start">
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 2px;">
              {{ row.changeContent }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="referencedTaskCount" label="引用任务数" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <span class="status" :class="statusClassMap[row.status as IndicatorStatus]">
            {{ row.status }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="text.actions" width="200" fixed="right">
        <template #default="{ row }">
          <div class="task-management__actions">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 版本抽屉 -->
    <VersionDrawer v-model="drawerVisible" :row-data="selectRow" />

    <!-- 版本表单弹窗 -->
    <VersionFormDialog v-model="versionDialogVisible" :mode="versionDialogMode" :version="currentEditVersion"
      @save="handleSaveVersion" />
  </section>
</template>

<style scoped>
.indicator-management {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 16px;
}

.indicator-management__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.indicator-management__title {
  margin: 0;
  color: #1e3a5f;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status--running {
  background: #eaf2ff;
  color: #2563eb;
}

.status--pending {
  background: #fff7e6;
  color: #b45309;
}

.status--done {
  background: #ecfdf3;
  color: #047857;
}

.task-management__actions {
  display: flex;
  gap: 12px;
}
</style>
