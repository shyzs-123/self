<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// ==================== 类型定义 ====================

type Priority = 'high' | 'medium' | 'low'
type Status = 'pending' | 'ready' | 'running' | 'paused' | 'completed' | 'archived'
type EventItem = { title: string; time: string; content: string }
type Task = {
  id: string
  name: string
  target: string
  area: string
  startTime: string
  endTime: string
  priority: Priority
  owner: string
  status: Status
  createdAt: string
  resultRequirement: string
  constraints: string
  remark: string
  lifecycle: EventItem[]
  logs: EventItem[]
}

/** 表单数据类型（排除自动生成的字段） */
type FormData = Omit<Task, 'id' | 'status' | 'createdAt' | 'lifecycle' | 'logs'>

// ==================== Props & Emits ====================

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  task: Task | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', task: Task): void
}>()

// ==================== 文案配置 ====================

const text = {
  create: '新建任务',
  edit: '编辑任务',
  save: '保存',
  cancel: '取消',
  name: '任务名称',
  target: '监测对象',
  area: '任务区域',
  start: '开始时间',
  end: '结束时间',
  priority: '优先级',
  owner: '负责人',
  result: '成果要求',
  constraints: '约束条件',
  remark: '备注',
  select: '请选择',
  input: '请输入'
}

// ==================== 常量数据 ====================

const status: Status = 'pending'

const areas = ['东区', '南区', '西区', '北区', '全域']

const owners = ['张明', '李娜', '王强', '赵敏', '陈晨']

const priorities: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
]

// ==================== 响应式数据 ====================

const formRef = ref<FormInstance>()
//接受父组件传递的状态参数，并更新
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => 
  props.mode === 'create' ? text.create : text.edit
)

// 表单数据
const form = reactive<FormData>({
  name: '',
  target: '',
  area: '',
  startTime: '',
  endTime: '',
  priority: 'medium',
  owner: '',
  resultRequirement: '',
  constraints: '',
  remark: ''
})

// ==================== 表单验证规则 ====================

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  target: [{ required: true, message: '请输入监测对象', trigger: 'blur' }],
  area: [{ required: true, message: '请选择任务区域', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  owner: [{ required: true, message: '请选择负责人', trigger: 'change' }],
  resultRequirement: [{ required: true, message: '请输入成果要求', trigger: 'blur' }],
  constraints: [{ required: true, message: '请输入约束条件', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

// ==================== 方法 ====================

/** 重置表单 */
function reset() {
  Object.assign(form, {
    name: '',
    target: '',
    area: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
    owner: '',
    resultRequirement: '',
    constraints: '',
    remark: ''
  })
}

/** 监听弹窗打开/关闭 */
watch(() => props.modelValue, (opened) => {
  if (!opened) return
  
  // 重置表单
  reset()
  
  // 如果是编辑模式，填充数据
  if (props.task) {
    Object.assign(form, props.task)
  }
  
  // 清除验证状态
  window.setTimeout(() => formRef.value?.clearValidate(), 0)
})

/** 关闭弹窗 */
function close() {
  visible.value = false
}

/** 保存任务 */
async function save() {
  if (!formRef.value) return
  
  // 表单验证
  await formRef.value.validate()
  
  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  const previous = props.task
  
  // 构建完整的任务数据    子向父提交  详细内容？
  emit('save', {
    id: previous?.id ?? `TASK-${Date.now()}`,
    ...form,
    status: previous?.status ?? status,
    createdAt: previous?.createdAt ?? now,
    lifecycle: previous?.lifecycle ?? [
      { title: '创建', time: now, content: '任务已创建' }
    ],
    logs: previous 
      ? [
          { title: '任务编辑', time: now, content: '更新任务信息' },
          ...previous.logs
        ]
      : [
          { title: '任务创建', time: now, content: '保存新建任务' }
        ]
  })
  
  close()
}
</script>

<template>
  <el-dialog 
    v-model="visible" 
    :title="title" 
    width="680px" 
    destroy-on-close
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-width="92px" 
      label-position="left"
    >
      <!-- 任务名称 -->
      <el-form-item :label="text.name" prop="name">
        <el-input v-model="form.name" :placeholder="text.input" />
      </el-form-item>
      
      <!-- 监测对象 -->
      <el-form-item :label="text.target" prop="target">
        <el-input v-model="form.target" :placeholder="text.input" />
      </el-form-item>
      
      <!-- 任务区域 + 优先级（两列布局） -->
      <div class="grid">
        <el-form-item :label="text.area" prop="area">
          <el-select v-model="form.area" :placeholder="text.select">
            <el-option 
              v-for="area in areas" 
              :key="area" 
              :label="area" 
              :value="area" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="text.priority" prop="priority">
          <el-select v-model="form.priority" :placeholder="text.select">
            <el-option 
              v-for="item in priorities" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value" 
            />
          </el-select>
        </el-form-item>
      </div>
      
      <!-- 开始时间 + 结束时间（两列布局） -->
      <div class="grid">
        <el-form-item :label="text.start" prop="startTime">
          <el-date-picker 
            v-model="form.startTime" 
            type="datetime" 
            :placeholder="text.select" 
            format="YYYY-MM-DD HH:mm" 
            value-format="YYYY-MM-DD HH:mm" 
          />
        </el-form-item>
        
        <el-form-item :label="text.end" prop="endTime">
          <el-date-picker 
            v-model="form.endTime" 
            type="datetime" 
            :placeholder="text.select" 
            format="YYYY-MM-DD HH:mm" 
            value-format="YYYY-MM-DD HH:mm" 
          />
        </el-form-item>
      </div>
      
      <!-- 负责人 -->
      <el-form-item :label="text.owner" prop="owner">
        <el-select v-model="form.owner" :placeholder="text.select">
          <el-option 
            v-for="owner in owners" 
            :key="owner" 
            :label="owner" 
            :value="owner" 
          />
        </el-select>
      </el-form-item>
      
      <!-- 成果要求 -->
      <el-form-item :label="text.result" prop="resultRequirement">
        <el-input 
          v-model="form.resultRequirement" 
          type="textarea" 
          :rows="3" 
          :placeholder="text.input" 
        />
      </el-form-item>
      
      <!-- 约束条件 -->
      <el-form-item :label="text.constraints" prop="constraints">
        <el-input 
          v-model="form.constraints" 
          type="textarea" 
          :rows="3" 
          :placeholder="text.input" 
        />
      </el-form-item>
      
      <!-- 备注 -->
      <el-form-item :label="text.remark" prop="remark">
        <el-input 
          v-model="form.remark" 
          type="textarea" 
          :rows="2" 
          :placeholder="text.input" 
        />
      </el-form-item>
    </el-form>
    
    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="close">{{ text.cancel }}</el-button>
      <el-button type="primary" @click="save">{{ text.save }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 两列网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* 下拉框和日期选择器占满宽度 */
:deep(.el-select),
:deep(.el-date-editor) {
  width: 100%;
}

/* 响应式：小屏幕改为单列 */
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 弹窗样式优化 */
:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a5f;
}

:deep(.el-dialog__body) {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #334155;
}

:deep(.el-textarea__inner) {
  resize: none;
}
</style>