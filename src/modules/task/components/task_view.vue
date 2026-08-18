<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">任务详情</h2>
        <button class="modal__close" @click="handleClose">×</button>
      </div>

      <div class="modal__body">
        <div class="detail-item">
          <span class="detail-item__label">任务名称：</span>
          <span class="detail-item__value">{{ task?.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">检测对象：</span>
          <span class="detail-item__value">{{ task?.target }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">任务区域：</span>
          <span class="detail-item__value">{{ task?.area }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">执行时间：</span>
          <span class="detail-item__value">{{ task?.time }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">任务状态：</span>
          <span class="status" :class="statusClassMap[task?.status || '进行中']">
            {{ task?.status }}
          </span>
        </div>
      </div>

      <div class="modal__footer">
        <button class="modal__btn modal__btn--primary" @click="handleConfirm">确认</button>
        <button class="modal__btn modal__btn--default" @click="handleClose">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TaskStatus = '进行中' | '待审核' | '已完成'

type TaskItem = {
  name: string
  target: string
  area: string
  time: string
  status: TaskStatus
}

const visible = ref(false)
const task = ref<TaskItem | null>(null)

const statusClassMap: Record<TaskStatus, string> = {
  进行中: 'status--running',
  待审核: 'status--pending',
  已完成: 'status--done',
}

const open = (data: TaskItem) => {
  task.value = data
  visible.value = true
} 

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  console.log('查看任务:', task.value)
  visible.value = false
}

defineExpose({
  open
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  width: 520px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e3a5f;
}

.modal__close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
}

.modal__body {
  padding: 24px;
}

.detail-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item__label {
  min-width: 100px;
  font-weight: 600;
  color: #475569;
}

.detail-item__value {
  color: #1e293b;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 13px;
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

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal__btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.modal__btn--primary {
  background: #1677ff;
  color: #fff;
}

.modal__btn--default {
  background: #f1f5f9;
  color: #475569;
}
</style>