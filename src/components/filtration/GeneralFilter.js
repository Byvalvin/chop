import React, { useState } from "react";

const GeneralFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  isMultiSelect = true,
  allowCustomInput = false,
  maxSelected = 10,
  onClear,
  hasUnsavedChanges = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [optionsState, setOptionsState] = useState({ local: options, custom: [] });

  const selectedTitle = selectedValues.length ? selectedValues.join(", ") : "Any";

  const handleSelectionChange = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else if (selectedValues.length < maxSelected) {
      onChange([...selectedValues, option]);
    }
  };

  const handleCustomAdd = () => {
    const trimmed = customInput.trim();
    if (trimmed && !optionsState.local.includes(trimmed)) {
      setOptionsState((prevState) => ({
        local: [...prevState.local, trimmed],
        custom: [...prevState.custom, trimmed],
      }));

      if (isMultiSelect && selectedValues.length < maxSelected) {
        onChange([...selectedValues, trimmed]);
      } else if (!isMultiSelect) {
        onChange([trimmed]);
        setIsOpen(false);
      }
    }
    setCustomInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomAdd();
    }
  };

  const handleRemoveCustomOption = (option) => {
    setOptionsState((prevState) => ({
      local: prevState.local.filter((opt) => opt !== option),
      custom: prevState.custom.filter((opt) => opt !== option),
    }));
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    }
  };

  return (
    <div className="mt-4 relative">
      <div
        className={`cursor-pointer flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
          hasUnsavedChanges
            ? "bg-[var(--filter-unsaved-bg)] border-2 border-[var(--signup-button-hover)]"
            : "bg-[var(--primary)] text-[var(--main-text)] border-[var(--secondary-dark)]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          {title}: {selectedTitle}
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-[var(--signup-button-hover)] animate-pulse" />
          )}
        </span>
        <span className="text-sm text-[var(--other-text)]">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div
          className="mt-2 p-2 rounded-md transition-all duration-300 absolute z-10 w-full bg-[var(--secondary-dark)] text-[var(--main-text)]"
          style={{
            top: "100%",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {isMultiSelect ? (
            optionsState.local.map((option) => (
              <div key={option} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleSelectionChange(option)}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
                {optionsState.custom.includes(option) && (
                  <button
                    onClick={() => handleRemoveCustomOption(option)}
                    className="text-xs rounded-md px-2 py-1 hover:bg-red-200 text-red-500 bg-red-100"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))
          ) : (
            <ul className="space-y-1">
              <li
                className={`cursor-pointer text-sm p-2 rounded-md ${
                  selectedValues.length === 0 ? "font-bold" : ""
                } text-[var(--sub-text)]`}
                onClick={() => handleSelectionChange("")}
              >
                Any
              </li>
              {optionsState.local.map((option) => (
                <li
                  key={option}
                  className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-[var(--sub-text)] text-[var(--sub-text)] hover:bg-[var(--secondary-dark)]"
                >
                  <span className="text-sm flex-1" onClick={() => handleSelectionChange(option)}>
                    {option}
                  </span>
                  {optionsState.custom.includes(option) && (
                    <button
                      onClick={() => handleRemoveCustomOption(option)}
                      className="text-xs rounded-md px-2 py-1 ml-2 text-red-500 bg-red-100 hover:bg-red-200"
                    >
                      ❌
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {allowCustomInput && (
            <div className="pt-2 border-t border-[var(--sub-text)] mt-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Add your own ${title.toLowerCase()}...`}
                className="w-full p-1 border rounded text-sm focus:outline-none border-[var(--other-text)] text-[var(--main-text)] bg-[var(--primary)]"
              />
              <button
                onClick={handleCustomAdd}
                className="mt-1 px-2 py-1 text-xs rounded hover:bg-blue-600 bg-[var(--secondary)] text-[var(--main-text)]"
              >
                + Add
              </button>
              {isMultiSelect && (
                <p className="text-xs text-[var(--other-text)] mt-1">Max {maxSelected} items</p>
              )}
            </div>
          )}

          <button
            onClick={onClear}
            className="mt-4 w-full py-2 text-sm rounded-md bg-[var(--secondary-dark)] text-[var(--main-text)] hover:bg-[var(--secondary)]"
          >
            Clear {title}
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralFilter;
