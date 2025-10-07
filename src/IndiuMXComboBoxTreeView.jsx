import { createElement, useState } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";
import "./ui/IndiuMXComboBoxTreeView.css";

function renderOptions(data, level = 0) {
    return data.flatMap(item => [
        <option key={item.value} value={item.value} data-label={item.label}>
            {`${"— ".repeat(level)}${item.label}`}
        </option>,
        ...(item.children ? renderOptions(item.children, level + 1) : [])
    ]);
}

export function IndiuMXComboBoxTreeView({ inputValue, selectedValue, onChange, width = "240px" }) {
    // Parse JSON string input

    let treeData = [];
    try {
        treeData = JSON.parse(inputValue.value || "[]");
    } catch {
        treeData = [];
    }

    // Flatten all values for easy lookup
    function flattenValues(data) {
        return data.flatMap(item => [
            item.value,
            ...(item.children ? flattenValues(item.children) : [])
        ]);
    }
    const allValues = flattenValues(treeData);

    // Only preselect if the value exists in the dropdown
    const initialSelected = allValues.includes(selectedValue?.value) ? selectedValue.value : "";
    const [selected, setSelected] = useState(initialSelected);

    function handleChange(e) {
        const val = e.target.value;
        setSelected(val);
    if (selectedValue && selectedValue.setValue) selectedValue.setValue(val);
        if (onChange && onChange.canExecute) {
            onChange.execute();
        }
    }

    // Find the label for the selected value (without prefix)
    function getSelectedLabel(value, data) {
        for (const item of data) {
            if (item.value === value) return item.label;
            if (item.children) {
                const childLabel = getSelectedLabel(value, item.children);
                if (childLabel) return childLabel;
            }
        }
        return "";
    }

    const displayLabel = selected ? getSelectedLabel(selected, treeData) : "Select...";

    return (
        <div style={{ width }}>
            <select
                value={selected}
                onChange={handleChange}
                className="mx-tree-dropdown"
                style={{ width }}
            >
                <option value="">Select...</option>
                {renderOptions(treeData)}
            </select>
        </div>
    );
}

