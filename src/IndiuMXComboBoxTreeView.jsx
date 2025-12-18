import { createElement, useState, useEffect } from "react";

import "./ui/IndiuMXComboBoxTreeView.css";

function renderOptions(data, level = 0, selectedValue = "") {
    return data.flatMap(item => [
        <option
            key={item.key}
            value={item.key}
            data-label={item.value}
            className={item.key === selectedValue ? "selected-option" : ""}
        >
            {`${"\u00A0".repeat(level * 4)}${level > 0 ? "↳ " : ""}${item.value}`}
        </option>,
        ...(item.children ? renderOptions(item.children, level + 1, selectedValue) : [])
    ]);
}

export function IndiuMXComboBoxTreeView({ inputValue, selectedValue, onChange, width = "240px", defaultValue }) {
    const [treeData, setTreeData] = useState([]);
    const [selected, setSelected] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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
            item.key,
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

    }, [treeData, defaultValue, allValues]);

    function handleChange(e) {
        const val = e.target.value;
        setSelected(val);
        setIsOpen(false); // Reset chevron to downward position after selection
        if (selectedValue && selectedValue.setValue) selectedValue.setValue(val);
        if (onChange && onChange.canExecute) {
            onChange.execute();
        }
    }

    function handleFocus() {
        setIsOpen(true);
    }

    function handleBlur() {
        setIsOpen(false);
    }

    // Find the label for the selected value (without prefix)
    function getSelectedLabel(value, data) {
        for (const item of data) {
            if (item.key === value) return item.value;
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
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="mx-tree-dropdown"
                style={{ width }}
            >
                <option value="">Select...</option>
                {renderOptions(treeData, 0, selected)}
            </select>
            {/* Dropdown chevron icon */}
            <div
                className="mx-tree-dropdown-icon"
                style={{
                    transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
                    transition: 'transform 0.2s ease'
                }}
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

