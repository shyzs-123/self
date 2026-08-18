<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
    modelValue: boolean
    knowledge: Knowledge | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
}>()

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const L = {
    title: '知识详情',
    empty: '暂无知识详情',
    basic: '基础信息',
    content: '知识内容',
    remark: '备注'
}

const infoRows = computed(() => {
    if (!props.knowledge) return []
    const k = props.knowledge
    return [
        { label: '知识标题', value: k.title },
        { label: '知识类型', value: k.typeLabel },
        { label: '所属分类', value: k.category },
        { label: '关联标签', value: k.tags.join('、') || '无' },
        { label: '创建人', value: k.author },
        { label: '创建时间', value: k.createTime },
        { label: '更新时间', value: k.updateTime }
    ]
})
</script>

<template>
    <el-drawer v-model="visible" :title="L.title" size="560px" destroy-on-close>
        <el-empty v-if="!knowledge" :description="L.empty" />

        <div v-else class="detail">
            <!-- 基础信息 -->
            <section>
                <h3>{{ L.basic }}</h3>
                <el-table :data="infoRows" border style="width:100%">
                    <el-table-column prop="label" label="" width="90">
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

            <!-- 知识内容 -->
            <section>
                <h3>{{ L.content }}</h3>
                <div class="content-box">{{ knowledge.content }}</div>
            </section>

            <!-- 备注 -->
            <section v-if="knowledge.remark">
                <h3>{{ L.remark }}</h3>
                <div class="content-box">{{ knowledge.remark }}</div>
            </section>
        </div>
    </el-drawer>
</template>

<style scoped>
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

.content-box {
    padding: 14px 18px;
    background: #f8f9fa;
    border-radius: 6px;
    color: #1f2937;
    line-height: 1.8;
    font-size: 14px;
    border: 1px solid #ebeef5;
}

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
    background: #f5f7fa;
    color: #475569;
    font-weight: 600;
    padding: 10px 14px;
    margin: -10px -14px;
}

:deep(.el-table td:not(:first-child) .cell) {
    color: #1f2937;
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
</style>