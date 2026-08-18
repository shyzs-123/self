<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// ==================== 类型定义 ====================

type KnowledgeType = 'standard' | 'indicator' | 'business' | 'sensor' | 'algorithm' | 'expert' | 'case'

type Knowledge = {
    id: string
    title: string
    type: KnowledgeType
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

type FormData = Omit<Knowledge, 'id' | 'createTime' | 'updateTime'>

// ==================== Props & Emits ====================

const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    knowledge: Knowledge | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
    (e: 'save', v: FormData): void
}>()

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const title = computed(() => props.mode === 'create' ? '新增知识' : '编辑知识')

// ==================== 文案 ====================

const L = {
    title: '知识标题',
    type: '知识类型',
    category: '所属分类',
    tags: '关联标签',
    content: '知识内容',
    author: '创建人',
    remark: '备注',
    select: '请选择',
    input: '请输入',
    cancel: '取消',
    save: '保存'
}

// ==================== 常量 ====================

const typeOptions = [
    { value: 'standard', label: '标准规范' },
    { value: 'indicator', label: '指标规则' },
    { value: 'business', label: '业务规则' },
    { value: 'sensor', label: '传感器知识' },
    { value: 'algorithm', label: '算法说明' },
    { value: 'expert', label: '专家经验' },
    { value: 'case', label: '历史案例' }
]

const categoryOptions = ['标准规范', '指标规则', '业务规则', '传感器知识', '算法说明', '专家经验', '历史案例']

// ==================== 表单 ====================

const formRef = ref<FormInstance>()
const form = reactive<FormData>({
    title: '',
    type: 'standard',
    category: '',
    typeLabel: '',
    typeColor: '',
    tags: [],
    content: '',
    author: '',
    remark: ''
})

const rules: FormRules<FormData> = {
    title: [{ required: true, message: '请输入知识标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择知识类型', trigger: 'change' }],
    category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
    content: [{ required: true, message: '请输入知识内容', trigger: 'blur' }],
    author: [{ required: true, message: '请输入创建人', trigger: 'blur' }]
}

// ==================== 方法 ====================

function reset() {
    Object.assign(form, {
        title: '',
        type: 'standard',
        category: '',
        typeLabel: '',
        typeColor: '',
        tags: [],
        content: '',
        author: '',
        remark: ''
    })
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    reset()
    if (props.mode === 'edit' && props.knowledge) {
        const { id, createTime, updateTime, ...rest } = props.knowledge
        Object.assign(form, rest)
    }
    setTimeout(() => formRef.value?.clearValidate(), 0)
})

function close() { visible.value = false }

function toArray(v: string | string[]): string[] {
    return Array.isArray(v) ? v.filter(Boolean) : v.split(/[、，,]/).map(s => s.trim()).filter(Boolean)
}

async function save() {
    if (!formRef.value) return
    await formRef.value.validate()

    const typeInfo = typeOptions.find(t => t.value === form.type)
    emit('save', {
        ...form,
        typeLabel: typeInfo?.label || '',
        typeColor: ['standard', 'indicator', 'business', 'sensor', 'algorithm'].includes(form.type)
            ? ['primary', 'success', 'warning', 'info', 'danger'][['standard', 'indicator', 'business', 'sensor', 'algorithm'].indexOf(form.type)]
            : '',
        tags: toArray(form.tags)
    })
    close()
}
</script>

<template>
    <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="L.title" prop="title">
                <el-input v-model="form.title" :placeholder="L.input" />
            </el-form-item>

            <el-form-item :label="L.type" prop="type">
                <el-select v-model="form.type" :placeholder="L.select" style="width:100%">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="L.category" prop="category">
                <el-select v-model="form.category" :placeholder="L.select" style="width:100%">
                    <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
                </el-select>
            </el-form-item>

            <el-form-item :label="L.tags">
                <el-input v-model="form.tags" placeholder="用逗号分隔多个标签" />
            </el-form-item>

            <el-form-item :label="L.content" prop="content">
                <el-input v-model="form.content" type="textarea" :rows="5" :placeholder="L.input" />
            </el-form-item>

            <el-form-item :label="L.author" prop="author">
                <el-input v-model="form.author" :placeholder="L.input" />
            </el-form-item>

            <el-form-item :label="L.remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="L.input" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="close">{{ L.cancel }}</el-button>
            <el-button type="primary" @click="save">{{ L.save }}</el-button>
        </template>
    </el-dialog>
</template>