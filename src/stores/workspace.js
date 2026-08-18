import { defineStore } from 'pinia'

export const useWindowStore = defineStore('window', {
  state: () => ({
    isOpen: false,
    currentPanel: 'task',
    isMaximized: false,
    refreshToken: 0,   // 初始为隐藏
  }),
  actions: {
    openPanel(panelName) {
      this.currentPanel = panelName
      this.isOpen = true
    },

    close() {
      this.isOpen = false
      this.isMaximized = false
    },

    toggleMaximized() {
      this.isMaximized = !this.isMaximized
      this.isOpen = true
    },

    refresh() {
      this.refreshToken += 1
    },
  }
})
