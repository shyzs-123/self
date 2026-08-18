# Vue 3 Technology Layered Architecture

The diagram below is based on the current project dependencies, source directories, and implemented import relationships.
Items marked as pending or reserved are not presented as completed capabilities.

```mermaid
graph TD
    subgraph viewLayer [View Layer]
        browser[Browser]
        appView[Vue 3 App]
        mapView[Cesium Map View]
        taskView[Task Center]
        resourceView[Resource Center]
        applicationView[Application Center]
        businessView[Business Center]
    end

    subgraph compileLayer [Compile Layer]
        vite[Vite]
        vuePlugin[@vitejs plugin vue]
        cesiumPlugin[vite plugin cesium]
        autoComponents[unplugin vue components]
    end

    subgraph codeLayer [Code Layer]
        appEntry[main.ts and App.vue]
        layouts[Page Containers and Layouts]
        workspace[Workspace Container]
        modulePanels[Business Module Panels]
        moduleViews[Business Views]
        moduleComponents[Dialogs and Drawers]
        elementPlus[Element Plus UI Library]
        pinia[Pinia Workspace State]
        cesiumRuntime[Cesium Runtime]
        measure[Map Measurement Module]
        routerReserved[Router Directory Reserved]
    end

    subgraph commonLayer [Common and Utility Layer]
        globalStyle[src/style.css]
        assets[src/assets and public]
        alias[Path Alias at sign]
    end

    subgraph dataLayer [Data Layer]
        httpService[services/http.js]
        axios[Axios]
        localMock[In component Mock Data]
        backendApi[Backend API Pending]
        networkReserved[Network Error and Retry Not Implemented]
    end

    browser --> appView
    browser --> mapView
    browser --> taskView
    browser --> resourceView
    browser --> applicationView
    browser --> businessView

    vite --> appEntry
    vuePlugin --> vite
    cesiumPlugin --> vite
    autoComponents --> vite

    appEntry --> layouts
    layouts --> workspace
    layouts --> mapView
    workspace --> modulePanels
    modulePanels --> moduleViews
    moduleViews --> moduleComponents

    appEntry --> elementPlus
    moduleViews --> elementPlus
    layouts --> pinia
    workspace --> pinia
    mapView --> cesiumRuntime
    cesiumRuntime --> measure

    appEntry --> globalStyle
    appEntry --> assets
    appEntry --> alias

    moduleViews --> localMock
    moduleViews -.->|reserved for future calls| httpService
    httpService --> axios
    axios -.->|not connected in current code| backendApi
    httpService -.->|not implemented| networkReserved
    routerReserved -.->|not installed or wired| appEntry
```

## Layer Mapping

| Layer | Current project elements | Responsibility |
| --- | --- | --- |
| View layer | Browser, four business centers, Cesium map | User-facing application and module entry points |
| Compile layer | Vite, Vue plugin, Cesium plugin, auto component plugin | SFC compilation, bundling, Cesium asset handling, component resolution |
| Code layer | `App.vue`, `layouts/`, `modules/`, Element Plus, Pinia, Cesium | Page composition, business interaction, state, UI controls, map rendering |
| Common layer | `style.css`, `assets/`, `public/`, alias `@` | Shared styles, static assets, source path resolution |
| Data layer | `services/http.js`, Axios, in-component mock data | Current data boundary and future API integration point |

## Current Boundaries

- `src/layouts/` contains the page containers: header, sidebar, and workspace.
- `src/modules/` contains task, resource, application, and business modules.
- Element Plus is registered globally in `main.ts` and used heavily inside module views and dialogs.
- Pinia currently manages the workspace window state in `stores/workspace.js`.
- Cesium is initialized by `map/MapContainer.vue`; the measurement implementation is in `map/measure/measure.js`.
- `services/http.js` imports Axios, but current module pages still use local mock data.
- Vue Router is not currently a runtime layer: `vue-router` is absent from `package.json`, and `src/Router` has no implemented route table.
