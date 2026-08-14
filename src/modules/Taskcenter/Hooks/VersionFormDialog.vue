<!-- VersionFormDialog.vue -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// ==================== 类型定义（与父组件保持一致） ====================

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

/** 表单数据类型（排除自动生成的字段） */
type FormData = Omit<Version, 'id' | 'status' | 'referencedTaskCount' | 'snapshot'>

// ==================== Props & Emits ====================

const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    version: Version | null
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
    (event: 'save', version: Version): void
}>()

// ==================== 文案配置 ====================

const text = {
    create: '新建版本',
    edit: '编辑版本',
    save: '保存',
    cancel: '取消',
    versionNo: '版本号',
    systemName: '版本体系',
    releaseTime: '发布时间',
    modifier: '修改人',
    changeContent: '修改内容',
    description: '版本说明',
    select: '请选择',
    input: '请输入'
}

// ==================== 常量数据 ====================

const systemNames = ['指标体系V1', '指标体系V2', '数据标准V1', '数据标准V2', '质量体系V1']

const modifiers = ['wangling', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu']

// ==================== 响应式数据 ====================

const formRef = ref<FormInstance>()

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const title = computed(() =>
    props.mode === 'create' ? text.create : text.edit
)

// 表单数据
const form = reactive<FormData>({
    versionNo: '',
    systemName: '',
    releaseTime: '',
    modifier: '',
    changeContent: '',
    description: ''
})

// ==================== 表单验证规则 ====================

const rules: FormRules<FormData> = {
    versionNo: [
        { required: true, message: '请输入版本号', trigger: 'blur' },
        { pattern: /^\d+\.\d+$/, message: '版本号格式为 x.y（如 1.2）', trigger: 'blur' }
    ],
    systemName: [{ required: true, message: '请选择版本体系', trigger: 'change' }],
    releaseTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
    modifier: [{ required: true, message: '请选择修改人', trigger: 'change' }],
    changeContent: [
        { required: true, message: '请输入修改内容', trigger: 'blur' },
        { min: 5, max: 500, message: '修改内容长度为 5-500 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入版本说明', trigger: 'blur' },
        { min: 2, max: 200, message: '版本说明长度为 2-200 个字符', trigger: 'blur' }
    ]
}

// ==================== 工具方法 ====================

/** 获取当前时间字符串 */
function getNow(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/** 生成默认快照 */
function getDefaultSnapshot(): SnapshotItem {
    return {
        objectCount: 0,
        domainCount: 0,
        themeCount: 0,
        indicatorCount: 0,
        observationCount: 0,
        keyNodes: []
    }
}

// ==================== 方法 ====================

/** 重置表单 */
function reset() {
    Object.assign(form, {
        versionNo: '',
        systemName: '',
        releaseTime: '',
        modifier: '',
        changeContent: '',
        description: ''
    })
}

/** 监听弹窗打开/关闭 */
watch(() => props.modelValue, (opened) => {
    if (!opened) return

    // 重置表单
    reset()

    // 如果是编辑模式，填充数据
    if (props.mode === 'edit' && props.version) {
        Object.assign(form, {
            versionNo: props.version.versionNo,
            systemName: props.version.systemName,
            releaseTime: props.version.releaseTime,
            modifier: props.version.modifier,
            changeContent: props.version.changeContent,
            description: props.version.description
        })
    }

    // 如果是新建模式，自动填充发布时间
    if (props.mode === 'create') {
        form.releaseTime = getNow()
    }

    // 清除验证状态
    window.setTimeout(() => formRef.value?.clearValidate(), 0)
})

/** 关闭弹窗 */
function close() {
    visible.value = false
}

/** 保存版本 */
async function save() {
    if (!formRef.value) return

    // 表单验证
    await formRef.value.validate()

    const now = getNow()
    const previous = props.version

    // 构建完整的版本数据（完全匹配 Version 接口）
    const versionData: Version = {
        id: previous?.id ?? `VERSION-${Date.now()}`,
        versionNo: form.versionNo,
        releaseTime: form.releaseTime,
        modifier: form.modifier,
        changeContent: form.changeContent,
        referencedTaskCount: previous?.referencedTaskCount ?? 0,
        description: form.description,
        systemName: form.systemName,
        status: previous?.status ?? '进行中',
        snapshot: previous?.snapshot ?? getDefaultSnapshot()
    }

    emit('save', versionData)
    close()
}

</script>

<template>
    <el-dialog v-model="visible" :title="title" width="620px" destroy-on-close>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
            <!-- 版本号 -->
            <el-form-item :label="text.versionNo" prop="versionNo">
                <el-input v-model="form.versionNo" :placeholder="text.input" :disabled="props.mode === 'edit'">
                    <template v-if="props.mode === 'edit'" #append>
                        <el-tag size="small" type="info">不可修改</el-tag>
                    </template>
                </el-input>
            </el-form-item>

            <!-- 版本体系 + 修改人（两列布局） -->
            <div class="grid">
                <el-form-item :label="text.systemName" prop="systemName">
                    <el-select v-model="form.systemName" :placeholder="text.select">
                        <el-option v-for="name in systemNames" :key="name" :label="name" :value="name" />
                    </el-select>
                </el-form-item>

                <el-form-item :label="text.modifier" prop="modifier">
                    <el-select v-model="form.modifier" :placeholder="text.select">
                        <el-option v-for="modifier in modifiers" :key="modifier" :label="modifier" :value="modifier" />
                    </el-select>
                </el-form-item>
            </div>

            <!-- 发布时间 -->
            <el-form-item :label="text.releaseTime" prop="releaseTime">
                <el-date-picker v-model="form.releaseTime" type="date" :placeholder="text.select" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>

            <!-- 修改内容 -->
            <el-form-item :label="text.changeContent" prop="changeContent">
                <el-input v-model="form.changeContent" type="textarea" :rows="4" :placeholder="`${text.input}修改内容`"
                    show-word-limit maxlength="500" />
            </el-form-item>

            <!-- 版本说明 -->
            <el-form-item :label="text.description" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="2" :placeholder="`${text.input}版本说明`"
                    show-word-limit maxlength="200" />
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

/* 下拉框占满宽度 */
:deep(.el-select) {
    width: 100%;
}

/* 响应式：小屏幕改为单列 */
@media (max-width: 620px) {
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
    font-family: inherit;
}

:deep(.el-input-group__append) {
    background-color: #f5f7fa;
    border: none;
    padding: 0 8px;
}
</style>