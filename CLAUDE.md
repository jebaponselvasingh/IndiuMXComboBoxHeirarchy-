# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Mendix 10+ pluggable widget (`IndiuMXComboBoxTreeView`) that renders a hierarchical dropdown (combobox) supporting unlimited nested levels, single-select, and two-way data binding via Mendix attributes. The dropdown data is passed as a JSON string from Mendix.

## Commands

```bash
npm install         # install dependencies
npm start           # dev server with watch mode (start:server)
npm run dev         # dev build for web (start:web)
npm run build       # production build → dist/tmp/widgets/
npm run release     # lints then builds release .mpk
npm run lint        # lint source
npm run lint:fix    # auto-fix lint issues
```

Build output: `dist/tmp/widgets/` (JS/CSS) and `dist/{version}/indium.IndiuMXComboBoxTreeView.mpk` (deployable Mendix package).

## Architecture

This is a **Mendix Pluggable Widget** — React-based, built with `@mendix/pluggable-widgets-tools` (webpack under the hood, no explicit config needed).

### Key Files

| File | Purpose |
|------|---------|
| `src/IndiuMXComboBoxTreeView.jsx` | Main widget component — all runtime logic |
| `src/IndiuMXComboBoxTreeView.xml` | Widget property schema (defines what shows in Mendix Studio) |
| `src/IndiuMXComboBoxTreeView.editorConfig.js` | Studio Pro editor configuration |
| `src/IndiuMXComboBoxTreeView.editorPreview.jsx` | Design-time preview in Studio |
| `src/ui/IndiuMXComboBoxTreeView.css` | Widget styles |
| `src/package.xml` | Mendix package metadata (widget ID, namespace) |

### Widget Properties (from XML schema)

- `inputValue` (String attribute, **required**) — JSON string representing the tree hierarchy
- `selectedValue` (String attribute, optional) — two-way binding for selected value
- `defaultValue` (String attribute, optional) — fallback preselection
- `width` (String, default `"240px"`) — dropdown CSS width
- `onChange` (action, optional) — triggered on selection change

### JSON Input Format

```json
[
  {
    "value": "parent1",
    "label": "Parent 1",
    "children": [
      { "value": "child1", "label": "Child 1", "children": [] }
    ]
  }
]
```

### Component Logic (`IndiuMXComboBoxTreeView.jsx`)

- **`renderOptions(data, level, selectedValue)`** — recursively flattens tree into `<option>` elements; uses non-breaking spaces + `↳` arrows for visual depth indentation
- **`flattenValues(data)`** — extracts all values from tree for validation
- **`getSelectedLabel(value, data)`** — recursive lookup of display label for selected value (strips indent prefixes)
- **`handleChange(e)`** — updates state, writes to Mendix `selectedValue` attribute via `.setValue()`, executes `onChange` action
- Two `useEffect` hooks: one parses `inputValue.value` JSON into `treeData`, another initializes selection from `selectedValue` or `defaultValue`

### Mendix Widget Conventions

- Widget namespace: `indium`, package path: `indium`
- `needsEntityContext="true"` — widget must be placed inside a data view or list view
- `offlineCapable="true"`, `supportedPlatform="Web"`
- Mendix attribute values are accessed via `.value` and set via `.setValue()`; actions are executed via `.execute()`
- The `.mpk` file is what gets installed into a Mendix project
