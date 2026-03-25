import { createElement, useState, useEffect, useRef } from "react";

import "./ui/IndiuMXComboBoxTreeView.css";

// Flatten tree into a list with level info for rendering and filtering.
// `uid` is a unique path-based ID for React keys; `key` is the actual data value stored in Mendix.
function flattenTree(data, level = 0, parentPath = "") {
    return data.flatMap((item, i) => {
        const uid = `${parentPath}${i}:${item.key}`;
        return [
            { key: item.key, value: item.value, level, uid },
            ...(item.children ? flattenTree(item.children, level + 1, `${uid}/`) : [])
        ];
    });
}

export function IndiuMXComboBoxTreeView({ inputValue, selectedValue, onChange, width = "240px", defaultValue }) {
    const [treeData, setTreeData] = useState([]);
    const [selected, setSelected] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        try {
            const parsedData = JSON.parse(inputValue?.value || "[]");
            setTreeData(parsedData);
        } catch {
            setTreeData([]);
        }
    }, [inputValue?.value]);

    const flatItems = flattenTree(treeData);

    // Filter items by search term
    const filteredItems = searchTerm.trim()
        ? flatItems.filter(item => item.value.toLowerCase().includes(searchTerm.toLowerCase()))
        : flatItems;

    function getSelectedLabel(key) {
        const found = flatItems.find(i => i.key === key);
        return found ? found.value : "";
    }

    const selectedLabel = selected ? getSelectedLabel(selected) : "";

    // Set initial selected value
    useEffect(() => {
        const allKeys = flatItems.map(i => i.key);
        let initialSelected = "";
        if (selectedValue?.value && allKeys.includes(selectedValue.value)) {
            initialSelected = selectedValue.value;
        } else if (defaultValue?.value && allKeys.includes(defaultValue.value)) {
            initialSelected = defaultValue.value;
        }
        setSelected(initialSelected);
    }, [treeData, defaultValue]);

    // Close on outside click
    useEffect(() => {
        function handleOutsideClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Focus search when opening
    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    function handleSelect(key) {
        setSelected(key);
        setIsOpen(false);
        setSearchTerm("");
        if (selectedValue?.setValue) selectedValue.setValue(key);
        if (onChange?.canExecute) onChange.execute();
    }

    function toggleOpen() {
        setIsOpen(prev => {
            if (prev) setSearchTerm("");
            return !prev;
        });
    }

    return (
        <div ref={containerRef} style={{ width, position: "relative" }}>
            {/* Trigger button */}
            <div
                className={`mx-tree-trigger${isOpen ? " mx-tree-trigger--open" : ""}`}
                onClick={toggleOpen}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={`mx-tree-trigger-label${!selected ? " mx-tree-trigger-placeholder" : ""}`}>
                    {selected ? selectedLabel : "Select..."}
                </span>
                <div
                    className="mx-tree-dropdown-icon"
                    style={{ transform: `rotate(${isOpen ? "180deg" : "0deg"})`, transition: "transform 0.2s ease" }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            {/* Dropdown panel */}
            {isOpen && (
                <div className="mx-tree-panel" role="listbox">
                    <div className="mx-tree-search-wrapper">
                        <input
                            ref={searchRef}
                            type="text"
                            className="mx-tree-search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mx-tree-options">
                        {filteredItems.length === 0 ? (
                            <div className="mx-tree-no-results">No results</div>
                        ) : (
                            filteredItems.map(item => (
                                <div
                                    key={item.uid}
                                    className={`mx-tree-option${item.key === selected ? " mx-tree-option--selected" : ""}`}
                                    onClick={() => handleSelect(item.key)}
                                    role="option"
                                    aria-selected={item.key === selected}
                                >
                                    {item.level > 0 && (
                                        <span className="mx-tree-option-indent">
                                            {"\u00A0".repeat(item.level * 4)}{"↳ "}
                                        </span>
                                    )}
                                    {item.value}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
