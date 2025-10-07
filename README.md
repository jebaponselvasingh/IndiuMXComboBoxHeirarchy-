## IndiuMXComboBoxTreeView

A Mendix 10+ widget for displaying hierarchical dropdowns with single-select capability, JSON-driven configuration, and Mendix attribute binding.

---

### Features
- Hierarchical dropdown (supports unlimited levels)
- Single-select (parent or child)
- Configurable dropdown width
- Preselects value from Mendix attribute if present
- Binds selected value to Mendix string attribute
- Triggers Mendix action/microflow on change
- Accepts JSON as a string attribute for dynamic options

---

### Sample JSON Value
```json
[
  {
    "value": "north-america",
    "label": "North America",
    "children": [
      {
        "value": "usa",
        "label": "United States",
        "children": [
          { "value": "california", "label": "California" },
          { "value": "texas", "label": "Texas" },
          { "value": "new-york", "label": "New York" }
        ]
      },
      {
        "value": "canada",
        "label": "Canada",
        "children": [
          { "value": "ontario", "label": "Ontario" },
          { "value": "quebec", "label": "Quebec" },
          { "value": "british-columbia", "label": "British Columbia" }
        ]
      }
    ]
  }
]
```

---

### XML Operations & Properties

**inputValue** (attribute, required)
- Type: String
- Description: JSON string representing the dropdown hierarchy and values.
- Example: See above sample JSON.

**selectedValue** (attribute, optional)
- Type: String
- Description: Binds the selected value to a Mendix string attribute. If the value matches an option, it is preselected.

**width** (string, optional, default: "240px")
- Description: Sets the width of the dropdown (e.g., "240px", "100%").

**onChange** (action, optional)
- Description: Triggers a Mendix microflow/nanoflow when the selection changes.

---

### Usage
1. Add the widget to your Mendix page.
2. Bind a string attribute to `inputValue` containing the JSON for dropdown options.
3. Bind a string attribute to `selectedValue` to store the selected value.
4. Optionally, set the `width` property for custom dropdown width.
5. Optionally, bind a microflow/nanoflow to `onChange` for selection events.

---

### Demo Project
[link to sandbox]

---

### Issues, Suggestions, and Feature Requests
[link to GitHub issues]

---

### Development and Contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
2. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

[specify contribution]
