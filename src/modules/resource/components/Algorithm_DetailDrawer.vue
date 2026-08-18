<script setup lang="ts">
import { computed } from 'vue'

// ==================== 类型定义 ====================

type AlgorithmType = '语义分割' | '目标检测' | '变化检测' | '地物分类' | '反演计算'
type AlgorithmStatus = 'draft' | 'published' | 'deprecated' | 'archived'
type ServiceStatus = 'online' | 'offline' | 'error' | 'pending'

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

// ==================== Props & Emits ====================

const props = defineProps<{
    modelValue: boolean
    algorithm: Algorithm | null
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// ==================== 文案配置 ====================

const text = {
    title: '算法模型详情',
    empty: '暂无算法详情',
    intro: '算法介绍',
    versionInfo: '版本信息',
    ioInfo: '输入输出',
    paramTemplates: '参数模板',
    interfaceEnv: '接口与运行环境',
    serviceConfig: '服务配置',
    name: '算法名称',
    version: '版本号',
    type: '算法类型',
    serviceStatus: '运行状态',
    modelFile: '模型文件',
    owner: '负责人',
    updatedAt: '更新时间',
    remark: '备注',
    inputData: '输入数据',
    outputResult: '输出结果',
    indicators: '适用指标',
    scenarios: '适用场景',
    apiEndpoint: '接口地址',
    runtimeEnv: '运行环境',
    dependencies: '依赖资源',
    resourceRequirement: '资源需求',
    serviceAddress: '服务地址',
    protocol: '协议',
    timeout: '超时',
    replicas: '服务副本',
    enabled: '是否启用',
    paramName: '参数名',
    paramType: '类型',
    defaultValue: '默认值',
    required: '必填',
    description: '说明'
}

// ==================== 标签映射 ====================

function typeLabel(type: AlgorithmType): string {
    return type
}

function statusLabel(status: AlgorithmStatus): string {
    const map: Record<AlgorithmStatus, string> = {
        'draft': '草稿',
        'published': '已发布',
        'deprecated': '已废弃',
        'archived': '已归档'
    }
    return map[status] || status
}

function statusTagType(status: AlgorithmStatus): string {
    const map: Record<AlgorithmStatus, string> = {
        'draft': 'info',
        'published': 'success',
        'deprecated': 'warning',
        'archived': 'danger'
    }
    return map[status] || 'info'
}

function serviceStatusLabel(status: ServiceStatus): string {
    const map: Record<ServiceStatus, string> = {
        'online': '已启用',
        'offline': '已停用',
        'error': '异常',
        'pending': '待部署'
    }
    return map[status] || status
}

function serviceStatusTagType(status: ServiceStatus): string {
    const map: Record<ServiceStatus, string> = {
        'online': 'success',
        'offline': 'info',
        'error': 'danger',
        'pending': 'warning'
    }
    return map[status] || 'info'
}

// ==================== 版本信息（四列，每行两个字段） ====================

const versionRows = computed(() => {
    if (!props.algorithm) return []
    const a = props.algorithm
    return [
        { leftLabel: text.name, leftValue: a.name, rightLabel: text.version, rightValue: a.version },
        { leftLabel: text.type, leftValue: typeLabel(a.type), rightLabel: text.serviceStatus, rightValue: serviceStatusLabel(a.service.serviceStatus) },
        { leftLabel: text.modelFile, leftValue: a.modelFile, rightLabel: text.owner, rightValue: a.createdBy || '算法模型组' },
        { leftLabel: text.updatedAt, leftValue: a.updatedAt, rightLabel: text.remark, rightValue: a.remark || '-' }
    ]
})

// ==================== 输入输出（两列，包含适用指标和适用场景） ====================

const inputOutputRows = computed(() => {
    if (!props.algorithm) return []
    const a = props.algorithm
    const inputNames = a.inputs.map(i => i.name).join('、') || '无'
    const outputNames = a.outputs.map(o => o.name).join('、') || '无'
    const indicatorNames = a.applicableIndicators.join('、') || '无'
    const scenarioNames = a.applicableScenarios.join('、') || '无'
    return [
        { label: text.inputData, value: inputNames },
        { label: text.outputResult, value: outputNames },
        { label: text.indicators, value: indicatorNames },
        { label: text.scenarios, value: scenarioNames }
    ]
})

// ==================== 接口与运行环境（两列，每行一个字段） ====================

const interfaceRows = computed(() => {
    if (!props.algorithm) return []
    const a = props.algorithm
    return [
        { label: text.apiEndpoint, value: a.service.apiEndpoint },
        { label: text.runtimeEnv, value: a.service.runtimeEnv },
        { label: text.dependencies, value: 'PyTorch、Rasterio、GDAL' },
        { label: text.resourceRequirement, value: a.service.computeResource }
    ]
})

// ==================== 服务配置（四列，每行两个字段） ====================

const serviceConfigRows = computed(() => {
    if (!props.algorithm) return []
    const a = props.algorithm
    return [
        { leftLabel: text.serviceAddress, leftValue: a.service.apiEndpoint, rightLabel: text.protocol, rightValue: 'HTTPS / POST' },
        { leftLabel: text.timeout, leftValue: '60 秒', rightLabel: text.replicas, rightValue: '2' },
        { leftLabel: text.enabled, leftValue: serviceStatusLabel(a.service.serviceStatus), rightLabel: '', rightValue: '' }
    ]
})
</script>

<template>
    <el-drawer v-model="visible" :title="text.title" size="720px" destroy-on-close>
        <el-empty v-if="!algorithm" :description="text.empty" />

        <div v-else class="detail">
            <!-- ===== 算法介绍 ===== -->
            <section>
                <h3 class="title">{{ text.intro }}</h3>
                <div class="intro-box">
                    {{ algorithm.description }}
                </div>
            </section>

            <!-- ===== 版本信息 ===== -->
            <section>
                <h3 class="title">{{ text.versionInfo }}</h3>
                <el-table :data="versionRows" border style="width: 100%">
                    <el-table-column prop="leftLabel" label="" width="100">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.leftLabel }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="leftValue" label="" min-width="160">
                        <template #default="{ row }">
                            <el-tag v-if="row.leftLabel === text.serviceStatus"
                                :type="serviceStatusTagType(algorithm.service.serviceStatus)">
                                {{ row.leftValue }}
                            </el-tag>
                            <span v-else>{{ row.leftValue }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightLabel" label="" width="100">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.rightLabel }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightValue" label="" min-width="160">
                        <template #default="{ row }">
                            <span>{{ row.rightValue }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </section>

            <!-- ===== 输入输出（两列，包含适用指标和适用场景） ===== -->
            <section>
                <h3 class="title">{{ text.ioInfo }}</h3>
                <el-table :data="inputOutputRows" border style="width: 100%">
                    <el-table-column prop="label" label="" width="100">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.label }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="">
                        <template #default="{ row }">
                            <span>{{ row.value }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </section>

            <!-- ===== 参数模板 ===== -->
            <section>
                <h3 class="title">{{ text.paramTemplates }}</h3>
                <div v-if="!algorithm.service.paramTemplates || algorithm.service.paramTemplates.length === 0"
                    class="empty-tip">
                    暂无参数模板
                </div>
                <div v-else>
                    <div v-for="(template, index) in algorithm.service.paramTemplates" :key="template.id"
                        class="template-card">
                        <div class="template-header">
                            <span class="template-title">模板 {{ index + 1 }}：{{ template.name || '未命名' }}</span>
                        </div>
                        <div class="template-desc" v-if="template.description">
                            {{ template.description }}
                        </div>
                        <el-table :data="template.params" border style="width: 100%">
                            <el-table-column prop="name" :label="text.paramName" width="120" />
                            <el-table-column prop="type" :label="text.paramType" width="100" />
                            <el-table-column prop="defaultValue" :label="text.defaultValue" width="120">
                                <template #default="{ row }">
                                    <span>{{ row.defaultValue || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="required" :label="text.required" width="80">
                                <template #default="{ row }">
                                    <el-tag :type="row.required ? 'danger' : 'info'">{{ row.required ? '是' : '否'
                                        }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="description" :label="text.description" />
                        </el-table>
                    </div>
                </div>
            </section>

            <!-- ===== 接口与运行环境（两列） ===== -->
            <section>
                <h3 class="title">{{ text.interfaceEnv }}</h3>
                <el-table :data="interfaceRows" border style="width: 100%">
                    <el-table-column prop="label" label="" width="120">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.label }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="">
                        <template #default="{ row }">
                            <span>{{ row.value }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </section>

            <!-- ===== 服务配置 ===== -->
            <section>
                <h3 class="title">{{ text.serviceConfig }}</h3>
                <el-table :data="serviceConfigRows" border style="width: 100%">
                    <el-table-column prop="leftLabel" label="" width="100">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.leftLabel }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="leftValue" label="" min-width="200">
                        <template #default="{ row }">
                            <el-tag v-if="row.leftLabel === text.enabled"
                                :type="serviceStatusTagType(algorithm.service.serviceStatus)">
                                {{ row.leftValue }}
                            </el-tag>
                            <span v-else>{{ row.leftValue }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightLabel" label="" width="100">
                        <template #default="{ row }">
                            <span class="label-cell">{{ row.rightLabel }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightValue" label="" min-width="200">
                        <template #default="{ row }">
                            <span>{{ row.rightValue }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </section>
        </div>
    </el-drawer>
</template>

<style scoped>
.title {
    text-align: left;
    margin-left: 0;
    padding-left: 0;
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 4px 0;
}

.detail section {
    padding-bottom: 4px;
}

.detail h3 {
    margin: 0 0 12px;
    color: #1e3a5f;
    font-size: 15px;
    font-weight: 600;
    padding-left: 10px;
    border-left: 3px solid #1677ff;
}

.intro-box {
    padding: 14px 18px;
    background-color: #f8f9fa;
    border-radius: 6px;
    color: #1f2937;
    line-height: 1.8;
    font-size: 14px;
    border: 1px solid #ebeef5;
}

.empty-tip {
    padding: 16px 0;
    color: #a8abb2;
    text-align: center;
    font-size: 14px;
}

/* 表格样式 */
:deep(.el-table) {
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #ebeef5;
}

:deep(.el-table th) {
    display: none;
}

:deep(.el-table td) {
    padding: 0;
}

:deep(.el-table .cell) {
    padding: 10px 14px;
    line-height: 1.4;
}

.label-cell {
    display: block;
    background-color: #f5f7fa;
    color: #475569;
    font-weight: 600;
    padding: 10px 14px;
    margin: -10px -14px;
}

:deep(.el-table td:not(:first-child) .cell) {
    color: #1f2937;
}

:deep(.el-table .cell .el-tag) {
    font-size: 13px;
}

:deep(.el-table__inner-wrapper::before) {
    display: none;
}

:deep(.el-table__body tr) {
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__body tr:last-child) {
    border-bottom: none;
}

/* 参数模板卡片 */
.template-card {
    margin-bottom: 12px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
}

.template-card:last-child {
    margin-bottom: 0;
}

.template-header {
    padding: 10px 16px;
    background-color: #fafbfc;
    border-bottom: 1px solid #ebeef5;
}

.template-title {
    color: #1e3a5f;
    font-weight: 600;
    font-size: 14px;
}

.template-desc {
    padding: 8px 16px;
    color: #64748b;
    font-size: 13px;
    background-color: #fafbfc;
    border-bottom: 1px solid #ebeef5;
}

.template-card :deep(.el-table) {
    border: none;
    border-radius: 0;
}

.template-card :deep(.el-table__body tr:last-child) {
    border-bottom: none;
}

.template-card :deep(.el-table th) {
    display: table-cell;
    background-color: #f8f9fa;
    color: #475569;
    font-weight: 600;
}

.template-card :deep(.el-table th .cell) {
    padding: 8px 12px;
}
</style>