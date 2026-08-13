/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@ant-design/icons-vue' {
  import { DefineComponent } from 'vue'
  export const SmileOutlined: DefineComponent
  // 如果还有其他图标需要声明
  export const HomeOutlined: DefineComponent
  export const UserOutlined: DefineComponent
  // 或者直接声明所有
  const icons: {
    [key: string]: DefineComponent
  }
  export default icons
}