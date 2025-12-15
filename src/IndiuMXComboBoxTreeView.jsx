import { createElement, useState, useEffect } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";
import "./ui/IndiuMXComboBoxTreeView.css";

function renderOptions(data, level = 0) {
    return data.flatMap(item => [
        <option
            key={item.value}
            value={item.value}
            data-label={item.label}
        >
            {`${"\u00A0".repeat(level * 4)}${level > 0 ? "↳ " : ""}${item.label}`}
        </option>,
        ...(item.children ? renderOptions(item.children, level + 1) : [])
    ]);
}

export function IndiuMXComboBoxTreeView({ inputValue, selectedValue, onChange, width = "240px", defaultValue }) {
    const [treeData, setTreeData] = useState([]);
    const [selected, setSelected] = useState("");

    // Parse JSON string input in useEffect
    useEffect(() => {
        try {
            const parsedData = JSON.parse(inputValue.value || "[]");
            setTreeData(parsedData);
        } catch {
            setTreeData([]);
        }
    }, [inputValue]);

    // Flatten all values for easy lookup
    function flattenValues(data) {
        return data.flatMap(item => [
            item.value,
            ...(item.children ? flattenValues(item.children) : [])
        ]);
    }
    const allValues = flattenValues(treeData);

    // Get the clean label (without arrow) for the currently selected value
    const selectedLabel = selected ? getSelectedLabel(selected, treeData) : "";

    // Set initial selected value when tree data or selectedValue/defaultValue changes
    useEffect(() => {
        let initialSelected = "";
        if (selectedValue?.value && allValues.includes(selectedValue.value)) {
            initialSelected = selectedValue.value;
        } else if (defaultValue && allValues.includes(defaultValue.value)) {
            initialSelected = defaultValue.value;
        }
        setSelected(initialSelected);

        console.log("defaultValue (string prop):", defaultValue);
        console.log("selectedValue:", initialSelected);
    }, [treeData, defaultValue, allValues]);

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


    return (
        <div style={{ width, position: 'relative' }}>
            {/* Custom display for selected value without arrow */}
            {selected && (
                <div className="mx-tree-selected-display">
                    {selectedLabel}
                </div>
            )}
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

