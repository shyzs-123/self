<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// ==================== 类型定义 ====================

type AlgorithmType = '数据处理' | '识别分析' | '预测预警' | '评价计算' | '规划优化'
type AlgorithmStatus = 'draft' | 'published' | 'deprecated' | 'archived'
type ServiceStatus = 'running' | 'stopped' | 'error' | 'pending'

type InputParam = {
    id: number
    name: string
    type: string
    required: boolean
    description: string
    defaultValue?: string
}

type OutputParam = {
    id: number
    name: string
    type: string
    description: string
}

type ParamTemplateItem = {
    id: number
    name: string
    description: string
    params: InputParam[]
}

type AlgorithmService = {
    runtimeEnv: string
    paramTemplates: ParamTemplateItem[]
    apiEndpoint: string
    computeResource: string
    serviceStatus: ServiceStatus
}

type Algorithm = {
    id: string
    name: string
    type: AlgorithmType
    version: string
    description: string
    inputs: InputParam[]
    outputs: OutputParam[]
    applicableIndicators: string[]
    applicableScenarios: string[]
    modelFile: string
    service: AlgorithmService
    status: AlgorithmStatus
    createdAt: string
    updatedAt: string
    createdBy: string
    remark: string
}

// FormData 中 applicableIndicators 和 applicableScenarios 允许字符串（用户输入）或数组
type FormData = Omit<Algorithm, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> & {
    updatedAt?: string
    applicableIndicators: string[] | string
    applicableScenarios: string[] | string
}

// ==================== Props & Emits ====================

const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    algorithm: Algorithm | null
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
    (event: 'save', algorithm: Algorithm): void
}>()

// ==================== 文案配置 ====================

const text = {
    create: '新增算法',
    edit: '编辑算法',
    save: '保存',
    cancel: '取消',
    // 基础信息
    basicInfo: '基础信息',
    name: '算法名称',
    type: '算法类型',
    version: '版本号',
    description: '算法描述',
    status: '状态',
    // 输入输出
    ioInfo: '输入输出',
    inputs: '输入参数',
    outputs: '输出参数',
    inputName: '参数名称',
    inputType: '参数类型',
    inputRequired: '是否必填',
    inputDescription: '参数说明',
    inputDefault: '默认值',
    outputName: '输出名称',
    outputType: '输出类型',
    outputDescription: '输出说明',
    // 适用信息
    applicableInfo: '适用信息',
    applicableIndicators: '适用指标',
    applicableScenarios: '适用场景',
    // 模型文件
    modelFile: '模型文件',
    // 服务配置
    serviceInfo: '服务配置',
    runtimeEnv: '运行环境',
    paramTemplates: '参数模板',
    paramTemplateName: '模板名称',
    paramTemplateDescription: '模板说明',
    apiEndpoint: '调用接口',
    computeResource: '计算资源要求',
    serviceStatus: '服务状态',
    // 通用
    remark: '备注',
    select: '请选择',
    input: '请输入',
    delete: '删除',
    export: '导出',
    add: '新增',
    addTemplate: '新增参数模板',
    addInput: '新增输入参数',
    addOutput: '新增输出参数'
}

// ==================== 常量数据 ====================

const typeOptions = [
    { value: '数据处理' as const, label: '数据处理' },
    { value: '识别分析' as const, label: '识别分析' },
    { value: '预测预警' as const, label: '预测预警' },
    { value: '评价计算' as const, label: '评价计算' },
    { value: '规划优化' as const, label: '规划优化' }
]

const statusOptions = [
    { value: 'draft' as const, label: '草稿' },
    { value: 'published' as const, label: '已发布' },
    { value: 'deprecated' as const, label: '已废弃' },
    { value: 'archived' as const, label: '已归档' }
]

const serviceStatusOptions = [
    { value: 'running' as const, label: '运行中' },
    { value: 'stopped' as const, label: '已停止' },
    { value: 'error' as const, label: '异常' },
    { value: 'pending' as const, label: '待部署' }
]

const paramTypeOptions = [
    { value: 'string', label: '字符串' },
    { value: 'number', label: '数值' },
    { value: 'boolean', label: '布尔' },
    { value: 'file', label: '文件' },
    { value: 'json', label: 'JSON' }
]

// ==================== 响应式数据 ====================

let idCounter = 0
let templateIdCounter = 0

const formRef = ref<FormInstance>()
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const title = computed(() => props.mode === 'create' ? text.create : text.edit)

// 创建空输入参数
function createEmptyInput(): InputParam {
    return {
        id: ++idCounter,
        name: '',
        type: 'string',
        required: false,
        description: '',
        defaultValue: ''
    }
}

// 创建空输出参数
function createEmptyOutput(): OutputParam {
    return {
        id: ++idCounter,
        name: '',
        type: 'string',
        description: ''
    }
}

// 创建空参数模板
function createEmptyTemplate(): ParamTemplateItem {
    return {
        id: ++templateIdCounter,
        name: '',
        description: '',
        params: [createEmptyInput()]
    }
}

// 默认服务配置
const defaultService = (): AlgorithmService => ({
    runtimeEnv: 'Python 3.8',
    paramTemplates: [createEmptyTemplate()],
    apiEndpoint: '',
    computeResource: '',
    serviceStatus: 'pending'
})

const form = reactive<FormData>({
    name: '',
    type: '数据处理',
    version: 'v1.0.0',
    description: '',
    status: 'draft',
    inputs: [createEmptyInput()],
    outputs: [createEmptyOutput()],
    applicableIndicators: [],
    applicableScenarios: [],
    modelFile: '',
    service: defaultService(),
    remark: '',
    updatedAt: ''
})

// ==================== 表单验证规则 ====================

const rules: FormRules<FormData> = {
    name: [{ required: true, message: '请输入算法名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择算法类型', trigger: 'change' }],
    version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
    description: [{ required: true, message: '请输入算法描述', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    'service.runtimeEnv': [{ required: true, message: '请输入运行环境', trigger: 'blur' }],
    'service.apiEndpoint': [{ required: true, message: '请输入调用接口地址', trigger: 'blur' }],
    'service.computeResource': [{ required: true, message: '请输入计算资源要求', trigger: 'blur' }],
    'service.serviceStatus': [{ required: true, message: '请选择服务状态', trigger: 'change' }]
}

// ==================== 方法 ====================

function reset() {
    idCounter = 0
    templateIdCounter = 0
    Object.assign(form, {
        name: '',
        type: '数据处理',
        version: 'v1.0.0',
        description: '',
        status: 'draft',
        inputs: [createEmptyInput()],
        outputs: [createEmptyOutput()],
        applicableIndicators: [],
        applicableScenarios: [],
        modelFile: '',
        service: defaultService(),
        remark: '',
        updatedAt: ''
    })
}

watch(() => props.modelValue, (opened) => {
    if (!opened) return
    reset()
    if (props.mode === 'edit' && props.algorithm) {
        const { id, createdAt, updatedAt, createdBy, ...rest } = props.algorithm
        const processed = JSON.parse(JSON.stringify(rest))
        // 编辑时，将数组转为逗号分隔的字符串方便编辑
        if (Array.isArray(processed.applicableIndicators)) {
            processed.applicableIndicators = processed.applicableIndicators.join('、')
        }
        if (Array.isArray(processed.applicableScenarios)) {
            processed.applicableScenarios = processed.applicableScenarios.join('、')
        }
        Object.assign(form, processed)
    }
    setTimeout(() => formRef.value?.clearValidate(), 0)
})

function close() {
    visible.value = false
}

// ---- 输入参数操作 ----
function addInput() {
    form.inputs.push(createEmptyInput())
}

function removeInput(index: number) {
    if (form.inputs.length <= 1) {
        form.inputs = [createEmptyInput()]
        return
    }
    form.inputs.splice(index, 1)
}

// ---- 输出参数操作 ----
function addOutput() {
    form.outputs.push(createEmptyOutput())
}

function removeOutput(index: number) {
    if (form.outputs.length <= 1) {
        form.outputs = [createEmptyOutput()]
        return
    }
    form.outputs.splice(index, 1)
}

// ---- 参数模板操作 ----
function addTemplate() {
    form.service.paramTemplates.push(createEmptyTemplate())
}

function removeTemplate(index: number) {
    if (form.service.paramTemplates.length <= 1) {
        form.service.paramTemplates = [createEmptyTemplate()]
        return
    }
    form.service.paramTemplates.splice(index, 1)
}

// ---- 模板内参数操作 ----
function addTemplateParam(templateIndex: number) {
    form.service.paramTemplates[templateIndex].params.push(createEmptyInput())
}

function removeTemplateParam(templateIndex: number, paramIndex: number) {
    const params = form.service.paramTemplates[templateIndex].params
    if (params.length <= 1) {
        params[0] = { id: ++idCounter, name: '', type: 'string', required: false, description: '', defaultValue: '' }
        return
    }
    params.splice(paramIndex, 1)
}

/**
 * 将字符串转为数组（支持中文逗号、英文逗号、顿号分隔）
 */
function stringToArray(value: string | string[]): string[] {
    if (Array.isArray(value)) {
        return value.filter(item => item.trim() !== '')
    }
    if (typeof value === 'string') {
        return value.split(/[、，,]/).map(s => s.trim()).filter(Boolean)
    }
    return []
}

// ---- 保存 ----
async function save() {
    if (!formRef.value) return
    await formRef.value.validate()

    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    const previous = props.algorithm

    const validInputs = form.inputs.filter((item) => item.name.trim() !== '')
    const validOutputs = form.outputs.filter((item) => item.name.trim() !== '')

    const validTemplates = form.service.paramTemplates
        .filter((t) => t.name.trim() !== '')
        .map((t) => ({
            ...t,
            params: t.params.filter((p) => p.name.trim() !== '')
        }))

    emit('save', {
        id: previous?.id ?? `ALG-${Date.now()}`,
        name: form.name,
        type: form.type,
        version: form.version,
        description: form.description,
        status: form.status,
        inputs: validInputs.length > 0 ? validInputs : [createEmptyInput()],
        outputs: validOutputs.length > 0 ? validOutputs : [createEmptyOutput()],
        // 将字符串转为数组
        applicableIndicators: stringToArray(form.applicableIndicators),
        applicableScenarios: stringToArray(form.applicableScenarios),
        modelFile: form.modelFile,
        service: {
            runtimeEnv: form.service.runtimeEnv,
            paramTemplates: validTemplates.length > 0 ? validTemplates : [createEmptyTemplate()],
            apiEndpoint: form.service.apiEndpoint,
            computeResource: form.service.computeResource,
            serviceStatus: form.service.serviceStatus
        },
        remark: form.remark,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
        createdBy: previous?.createdBy ?? 'admin'
    })

    close()
}
</script>

<template>
    <el-dialog v-model="visible" :title="title" width="820px" destroy-on-close>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="left">
            <!-- ============================================================ -->
            <!-- 基础信息 -->
            <!-- ============================================================ -->
            <div class="section-title">{{ text.basicInfo }}</div>

            <div class="grid">
                <el-form-item :label="text.name" prop="name">
                    <el-input v-model="form.name" :placeholder="text.input" />
                </el-form-item>

                <el-form-item :label="text.type" prop="type">
                    <el-select v-model="form.type" :placeholder="text.select">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </div>

            <div class="grid">
                <el-form-item :label="text.version" prop="version">
                    <el-input v-model="form.version" :placeholder="text.input" />
                </el-form-item>

                <el-form-item :label="text.status" prop="status">
                    <el-select v-model="form.status" :placeholder="text.select">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item :label="text.description" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="2" :placeholder="text.input" />
            </el-form-item>

            <!-- ============================================================ -->
            <!-- 输入输出 -->
            <!-- ============================================================ -->
            <div class="section-title">
                <span>{{ text.ioInfo }}</span>
            </div>

            <!-- 输入参数 -->
            <div class="sub-section-title">
                <span>{{ text.inputs }}</span>
                <el-button type="primary" size="small" plain @click="addInput" style="margin-left:12px">
                    + {{ text.addInput }}
                </el-button>
            </div>

            <div v-for="(input, index) in form.inputs" :key="input.id" class="param-card">
                <div class="param-header">
                    <span class="param-title">{{ text.inputs }} {{ index + 1 }}</span>
                    <el-button type="danger" size="small" link @click="removeInput(index)">
                        {{ text.delete }}
                    </el-button>
                </div>

                <div class="grid">
                    <el-form-item :label="text.inputName">
                        <el-input v-model="input.name" :placeholder="text.input" />
                    </el-form-item>

                    <el-form-item :label="text.inputType">
                        <el-select v-model="input.type" :placeholder="text.select">
                            <el-option v-for="item in paramTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>

                <div class="grid">
                    <el-form-item :label="text.inputRequired">
                        <el-switch v-model="input.required" />
                    </el-form-item>

                    <el-form-item :label="text.inputDefault">
                        <el-input v-model="input.defaultValue" :placeholder="text.input" />
                    </el-form-item>
                </div>

                <el-form-item :label="text.inputDescription">
                    <el-input v-model="input.description" :placeholder="text.input" />
                </el-form-item>
            </div>

            <!-- 输出参数 -->
            <div class="sub-section-title">
                <span>{{ text.outputs }}</span>
                <el-button type="primary" size="small" plain @click="addOutput" style="margin-left:12px">
                    + {{ text.addOutput }}
                </el-button>
            </div>

            <div v-for="(output, index) in form.outputs" :key="output.id" class="param-card">
                <div class="param-header">
                    <span class="param-title">{{ text.outputs }} {{ index + 1 }}</span>
                    <el-button type="danger" size="small" link @click="removeOutput(index)">
                        {{ text.delete }}
                    </el-button>
                </div>

                <div class="grid">
                    <el-form-item :label="text.outputName">
                        <el-input v-model="output.name" :placeholder="text.input" />
                    </el-form-item>

                    <el-form-item :label="text.outputType">
                        <el-select v-model="output.type" :placeholder="text.select">
                            <el-option v-for="item in paramTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item :label="text.outputDescription">
                    <el-input v-model="output.description" :placeholder="text.input" />
                </el-form-item>
            </div>

            <!-- ============================================================ -->
            <!-- 适用信息 -->
            <!-- ============================================================ -->
            <div class="section-title">{{ text.applicableInfo }}</div>

            <el-form-item :label="text.applicableIndicators">
                <el-input v-model="form.applicableIndicators" :placeholder="'请输入适用指标ID，用逗号分隔'" />
            </el-form-item>

            <el-form-item :label="text.applicableScenarios">
                <el-input v-model="form.applicableScenarios" :placeholder="'请输入适用场景，用逗号分隔'" />
            </el-form-item>

            <!-- 模型文件 -->
            <el-form-item :label="text.modelFile">
                <el-input v-model="form.modelFile" :placeholder="text.input" />
            </el-form-item>

            <!-- ============================================================ -->
            <!-- 服务配置 -->
            <!-- ============================================================ -->
            <div class="section-title">{{ text.serviceInfo }}</div>

            <div class="grid">
                <el-form-item :label="text.runtimeEnv" prop="service.runtimeEnv">
                    <el-input v-model="form.service.runtimeEnv" :placeholder="text.input" />
                </el-form-item>

                <el-form-item :label="text.serviceStatus" prop="service.serviceStatus">
                    <el-select v-model="form.service.serviceStatus" :placeholder="text.select">
                        <el-option v-for="item in serviceStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item :label="text.apiEndpoint" prop="service.apiEndpoint">
                <el-input v-model="form.service.apiEndpoint" :placeholder="text.input" />
            </el-form-item>

            <el-form-item :label="text.computeResource" prop="service.computeResource">
                <el-input v-model="form.service.computeResource" :placeholder="text.input" />
            </el-form-item>

            <!-- 参数模板（动态，模仿能力列表） -->
            <div class="sub-section-title">
                <span>{{ text.paramTemplates }}</span>
                <el-button type="primary" size="small" plain @click="addTemplate" style="margin-left:12px">
                    + {{ text.addTemplate }}
                </el-button>
            </div>

            <div v-for="(template, tIndex) in form.service.paramTemplates" :key="template.id" class="template-card">
                <div class="template-header">
                    <span class="template-title">{{ text.paramTemplates }} {{ tIndex + 1 }}</span>
                    <el-button type="danger" size="small" link @click="removeTemplate(tIndex)">
                        {{ text.delete }}
                    </el-button>
                </div>

                <div class="grid">
                    <el-form-item :label="text.paramTemplateName">
                        <el-input v-model="template.name" :placeholder="text.input" />
                    </el-form-item>

                    <el-form-item :label="text.paramTemplateDescription">
                        <el-input v-model="template.description" :placeholder="text.input" />
                    </el-form-item>
                </div>

                <!-- 模板内的参数列表 -->
                <div class="sub-sub-section-title">
                    <span>{{ text.inputs }}</span>
                    <el-button type="primary" size="small" plain @click="addTemplateParam(tIndex)"
                        style="margin-left:8px">
                        + {{ text.addInput }}
                    </el-button>
                </div>

                <div v-for="(param, pIndex) in template.params" :key="param.id" class="param-card-inner">
                    <div class="param-header-inner">
                        <span class="param-title">{{ text.inputs }} {{ pIndex + 1 }}</span>
                        <el-button type="danger" size="small" link @click="removeTemplateParam(tIndex, pIndex)">
                            {{ text.delete }}
                        </el-button>
                    </div>

                    <div class="grid">
                        <el-form-item :label="text.inputName">
                            <el-input v-model="param.name" :placeholder="text.input" />
                        </el-form-item>

                        <el-form-item :label="text.inputType">
                            <el-select v-model="param.type" :placeholder="text.select">
                                <el-option v-for="item in paramTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="grid">
                        <el-form-item :label="text.inputRequired">
                            <el-switch v-model="param.required" />
                        </el-form-item>

                        <el-form-item :label="text.inputDefault">
                            <el-input v-model="param.defaultValue" :placeholder="text.input" />
                        </el-form-item>
                    </div>

                    <el-form-item :label="text.inputDescription">
                        <el-input v-model="param.description" :placeholder="text.input" />
                    </el-form-item>
                </div>
            </div>

            <!-- 备注 -->
            <el-form-item :label="text.remark" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="text.input" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="close">{{ text.cancel }}</el-button>
            <el-button type="primary" @click="save">{{ text.save }}</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.section-title {
    display: flex;
    align-items: center;
    margin: 16px 0 12px 0;
    padding-left: 10px;
    color: #1e3a5f;
    font-size: 15px;
    font-weight: 600;
    border-left: 3px solid #1677ff;
    line-height: 1.4;
}

.section-title:first-of-type {
    margin-top: 0;
}

.sub-section-title {
    display: flex;
    align-items: center;
    margin: 12px 0 10px 0;
    color: #334155;
    font-size: 14px;
    font-weight: 500;
}

.sub-sub-section-title {
    display: flex;
    align-items: center;
    margin: 10px 0 8px 0;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    padding-left: 8px;
}

/* 参数卡片样式 */
.param-card,
.template-card {
    padding: 14px 16px 8px 16px;
    margin-bottom: 12px;
    border: 1px solid #e8ecf1;
    border-radius: 8px;
    background-color: #fafbfc;
}

.param-card-inner {
    padding: 12px 14px 8px 14px;
    margin-bottom: 10px;
    border: 1px solid #eef0f3;
    border-radius: 6px;
    background-color: #ffffff;
}

.param-header,
.template-header,
.param-header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.param-title,
.template-title {
    color: #1e3a5f;
    font-weight: 600;
    font-size: 14px;
}

.param-card .grid,
.param-card-inner .grid,
.template-card .grid {
    margin-bottom: 4px;
}

.param-card .grid:last-child,
.param-card-inner .grid:last-child,
.template-card .grid:last-child {
    margin-bottom: 0;
}

:deep(.el-select) {
    width: 100%;
}

@media (max-width: 720px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

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
    max-height: 65vh;
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