<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: boolean
    rowData: any | null
}>()
const emit = defineEmits(['update:modelValue'])

const detailVisible = computed({
    get() {
        return props.modelValue
    },
    set(val: boolean) {
        emit('update:modelValue', val)
    }
})

const currentRow = computed(() => props.rowData)

const statusMeta = (status: string) => {
    const map: Record<string, { label: string; type: 'primary' | 'warning' | 'success' | 'info' }> = {
        '进行中': { label: '进行中', type: 'primary' },
        '待审核': { label: '待审核', type: 'warning' },
        '已完成': { label: '已完成', type: 'success' },
    }
    return map[status] ?? { label: '未知', type: 'info' }
}
</script>
<template>
    <el-drawer v-model="detailVisible" size="420px" title="版本详情">
        <!-- 增加判空，必须同时存在rowData才渲染详情 -->
        <div v-if="currentRow" class="detail-panel">
            <div class="detail-panel__meta">
                <el-tag :type="statusMeta(currentRow.status).type" effect="light">
                    {{ statusMeta(currentRow.status).label }}
                </el-tag>
                <strong>{{ currentRow.versionNo }}</strong>
                <span>{{ currentRow.releaseTime }}</span>
            </div>
            <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="修改人">
                    {{ currentRow.modifier }}
                </el-descriptions-item>
                <el-descriptions-item label="修改内容">
                    {{ currentRow.changeContent }}
                </el-descriptions-item>
                <el-descriptions-item label="引用任务数">
                    {{ currentRow.referencedTaskCount }}
                </el-descriptions-item>
                <el-descriptions-item label="说明">
                    {{ currentRow.description }}
                </el-descriptions-item>
                <el-descriptions-item label="版本体系">
                    {{ currentRow.systemName }}
                </el-descriptions-item>
            </el-descriptions>
            <section class="snapshot-block">
                <h3>快照摘要</h3>
                <ul>
                    <li>对象：{{ currentRow.snapshot?.objectCount }}</li>
                    <li>领域：{{ currentRow.snapshot?.domainCount }}</li>
                    <li>主题：{{ currentRow.snapshot?.themeCount }}</li>
                    <li>指标：{{ currentRow.snapshot?.indicatorCount }}</li>
                    <li>观测指标：{{ currentRow.snapshot?.observationCount }}</li>
                </ul>
            </section>
            <section class="snapshot-block" v-if="currentRow.snapshot?.keyNodes?.length">
                <h3>关键节点</h3>
                <div class="key-node-list">
                    <el-tag v-for="node in currentRow.snapshot.keyNodes" :key="node" effect="light">
                        {{ node }}
                    </el-tag>
                </div>
            </section>
        </div>
        <!-- 空状态兜底 -->
        <el-empty v-else description="暂无版本数据" />
    </el-drawer>
</template>



<style scoped>
.detail-panel {
    padding: 4px;
}

.detail-panel__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}

.snapshot-block {
    margin-top: 18px;
}

.snapshot-block h3 {
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 600;
}

.snapshot-block ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.snapshot-block li {
    line-height: 1.8;
}

.key-node-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>