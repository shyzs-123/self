# Vue 3 Project Architecture

This document describes the current source structure and runtime relationships.
It reflects the implemented code only. Business functions remain inside Vue SFCs.

## Component Organization

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background": "#ffffff", "primaryColor": "#eff6ff", "primaryTextColor": "#1e293b", "primaryBorderColor": "#2563eb", "lineColor": "#64748b", "secondaryColor": "#f8fafc", "tertiaryColor": "#ffffff"}}}%%
flowchart LR
    main["main.ts"]
    app["App.vue"]

    subgraph layoutLayer["Layout Layer"]
        header["Header.vue"]
        sidebar["Sidebar.vue"]
        workspace["Workspace.vue"]
    end

    subgraph mapLayer["Map Layer"]
        mapContainer["MapContainer.vue"]
        mapToolbar["MapToolbar.vue"]
        measure["measure.js"]
    end

    subgraph stateLayer["Shared State"]
        workspaceStore["stores/workspace.js"]
    end

    subgraph taskModule["Task Module"]
        taskPanel["TaskPanel.vue"]
        taskViews["Task views"]
        taskDialogs["Task dialogs and drawers"]
    end

    subgraph resourceModule["Resource Module"]
        resourcePanel["ResourcePanel.vue"]
        resourceViews["Resource views"]
        resourceDialogs["Resource dialogs and drawers"]
    end

    subgraph applicationModule["Application Module"]
        applicationPanel["ApplicationPanel.vue"]
        applicationViews["Application views"]
    end

    subgraph businessModule["Business Module"]
        businessPanel["BusinessPanel.vue"]
        businessViews["Business views"]
    end

    main -->|"mounts"| app
    app -->|"renders"| header
    app -->|"renders"| sidebar
    app -->|"renders"| mapContainer
    app -->|"renders"| workspace

    sidebar -->|"openPanel"| workspaceStore
    workspace -->|"reads and updates"| workspaceStore
    workspace -->|"loads dynamically"| taskPanel
    workspace -->|"loads dynamically"| resourcePanel
    workspace -->|"loads dynamically"| applicationPanel
    workspace -->|"loads dynamically"| businessPanel

    mapContainer -->|"uses"| measure
    mapToolbar -.->|"currently not mounted"| mapContainer

    taskPanel -->|"switches tabs"| taskViews
    taskViews -->|"opens"| taskDialogs
    resourcePanel -->|"switches tabs"| resourceViews
    resourceViews -->|"opens"| resourceDialogs
    applicationPanel -->|"switches tabs"| applicationViews
    businessPanel -->|"switches tabs"| businessViews
```

## Vue 3 Technical Architecture Layers

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background": "#ffffff", "primaryColor": "#eff6ff", "primaryTextColor": "#1e293b", "primaryBorderColor": "#2563eb", "lineColor": "#64748b", "secondaryColor": "#f8fafc", "tertiaryColor": "#ffffff"}}}%%
flowchart TB
    subgraph bootstrapLayer["Bootstrap Layer"]
        vite["Vite"]
        mainEntry["main.ts"]
        vueApp["Vue 3 Application"]
        elementPlus["Element Plus"]
        pinia["Pinia"]
    end

    subgraph presentationLayer["Presentation Layer"]
        appShell["App.vue"]
        workspaceShell["Workspace and Layouts"]
        modulePanels["Task, Resource, Application, Business Panels"]
        moduleViews["Module Views"]
        dialogComponents["Dialogs and Drawers"]
    end

    subgraph stateLayer2["State Layer"]
        workspaceState["workspace store"]
        localState["Component local state"]
    end

    subgraph capabilityLayer["Capability Layer"]
        cesium["Cesium map runtime"]
        measureCapability["Measurement capability"]
        httpService["services/http.js"]
    end

    subgraph dataLayer["Current Data Layer"]
        mockData["In-component mock data"]
        futureApi["Backend API integration pending"]
    end

    vite --> mainEntry
    mainEntry --> vueApp
    mainEntry -->|"registers"| elementPlus
    mainEntry -->|"registers"| pinia
    vueApp --> appShell
    appShell --> workspaceShell
    workspaceShell --> modulePanels
    modulePanels --> moduleViews
    moduleViews --> dialogComponents

    workspaceShell --> workspaceState
    modulePanels --> localState
    moduleViews --> localState

    appShell --> cesium
    cesium --> measureCapability
    moduleViews -.->|"future use"| httpService
    moduleViews --> mockData
    httpService -.->|"not wired"| futureApi
```

## Current Boundary Notes

- `layouts/` owns the application shell and workspace behavior.
- `map/` owns Cesium rendering and measurement support.
- `modules/` owns business panels, views, dialogs, and drawers by domain.
- `stores/workspace.js` owns cross-component workspace state only.
- Most business data and functions remain local to the corresponding Vue component.
- `services/http.js` exists, but current module views still use in-component mock data.
