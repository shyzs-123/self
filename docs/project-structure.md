# Project Structure

The source tree is organized by application responsibility without changing component implementation content:

```text
src/
├─ layouts/
│  ├─ Header.vue
│  ├─ Sidebar.vue
│  └─ Workspace.vue
├─ map/
│  ├─ MapContainer.vue
│  ├─ MapToolbar.vue
│  └─ measure/measure.js
├─ modules/
│  ├─ task/
│  │  ├─ TaskPanel.vue
│  │  ├─ views/
│  │  └─ components/
│  ├─ resource/
│  │  ├─ ResourcePanel.vue
│  │  ├─ views/
│  │  └─ components/
│  ├─ application/
│  │  ├─ ApplicationPanel.vue
│  │  └─ views/
│  └─ business/
│     ├─ BusinessPanel.vue
│     └─ views/
├─ services/http.js
└─ stores/workspace.js
```

`views/` contains module-level page content, while `components/` contains module-owned dialogs, drawers, and supporting Vue components. Business logic remains in the original Vue files; this change only reorganizes paths and updates imports.
