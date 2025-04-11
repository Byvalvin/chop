import React, { useState } from "react";

const GeneralFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  isMultiSelect = true,
  allowCustomInput = false,
  maxSelected = 10,
  onClear, // Individual clear button for each filter
  hasUnsavedChanges = false, // 👈 Add this
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [localOptions, setLocalOptions] = useState(options);
  const [customOptions, setCustomOptions] = useState([]);

  const selectedTitle = selectedValues.length === 0 ? "Any" : selectedValues.join(", ");

  const handleCheckboxChange = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else if (selectedValues.length < maxSelected) {
      onChange([...selectedValues, option]);
    }
  };

  const handleDropdownChange = (option) => {
    onChange([option]);
    setIsOpen(false);
  };

  const handleCustomAdd = () => {
    const trimmed = customInput.trim();
    if (trimmed && !localOptions.includes(trimmed)) {
      const updatedOptions = [...localOptions, trimmed];
      setLocalOptions(updatedOptions);
      setCustomOptions([...customOptions, trimmed]);

      if (isMultiSelect && selectedValues.length < maxSelected) {
        onChange([...selectedValues, trimmed]);
      } else if (!isMultiSelect) {
        onChange([trimmed]);
        setIsOpen(false);
      }

      setCustomInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomAdd();
    }
  };

  const handleRemoveCustomOption = (optionToRemove) => {
    const updatedOptions = localOptions.filter((opt) => opt !== optionToRemove);
    const updatedCustoms = customOptions.filter((opt) => opt !== optionToRemove);
    setLocalOptions(updatedOptions);
    setCustomOptions(updatedCustoms);

    // If the removed option was selected, unselect it
    if (selectedValues.includes(optionToRemove)) {
      onChange(selectedValues.filter((v) => v !== optionToRemove));
    }
  };

  return (
    <div className="mt-4">
      <div
        className={`cursor-pointer flex items-center justify-between p-2 rounded-md ${
          hasUnsavedChanges ? "bg-yellow-100 border-2 border-yellow-400" : "bg-gray-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          {title}: {selectedTitle}
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </span>
        <span className="text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </div>


      {isOpen && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md space-y-2">
          {isMultiSelect ? (
            localOptions.map((option) => (
              <div key={option} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
                {customOptions.includes(option) && (
                  <button
                    onClick={() => handleRemoveCustomOption(option)}
                    className="text-xs text-red-500 bg-red-100 rounded-md px-2 py-1 hover:bg-red-200"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))
          ) : (
            <ul className="space-y-1">
              <li
                className={`cursor-pointer text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-md ${
                  selectedValues.length === 0 ? "font-bold" : ""
                }`}
                onClick={() => handleDropdownChange("")}
              >
                Any
              </li>
              {localOptions.map((option) => (
                <li
                  key={option}
                  className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-200"
                >
                  <span
                    className="text-sm flex-1"
                    onClick={() => handleDropdownChange(option)}
                  >
                    {option}
                  </span>
                  {customOptions.includes(option) && (
                    <button
                      onClick={() => handleRemoveCustomOption(option)}
                      className="text-xs text-red-500 bg-red-100 rounded-md px-2 py-1 ml-2 hover:bg-red-200"
                    >
                      ❌
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* ✨ Custom Input Field */}
          {allowCustomInput && (
            <div className="pt-2 border-t border-gray-300 mt-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Add your own ${title.toLowerCase()}...`}
                className="w-full p-1 border rounded text-sm"
              />
              <button
                onClick={handleCustomAdd}
                className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                + Add
              </button>
              {isMultiSelect && (
                <p className="text-xs text-gray-500 mt-1">Max {maxSelected} items</p>
              )}
            </div>
          )}

          {/* Individual Clear Button */}
          <button
            onClick={onClear}
            className="mt-4 w-full py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear {title}
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralFilter;
