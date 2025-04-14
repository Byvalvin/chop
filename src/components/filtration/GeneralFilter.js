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
  variant = "light", // Add variant prop for theme
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

  // Define color scheme based on `variant`
  const isDark = variant === "dark";

  return (
    <div className="mt-4 relative"> {/* Add relative positioning to the parent */}
      <div
        className={`cursor-pointer flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
          hasUnsavedChanges
            ? "bg-yellow-100 border-2 border-yellow-400"
            : isDark
            ? "bg-teal-900 text-white border-teal-700"
            : "bg-gray-200 text-gray-800 border-gray-300"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          {title}: {selectedTitle}
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </span>
        <span className={`text-sm ${isDark ? "text-white" : "text-gray-500"}`}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {isOpen && (
          <div
            className={`mt-2 p-2 rounded-md transition-all duration-300 absolute z-10 w-full bg-gray-100 ${ // Use absolute positioning
              isDark ? "bg-teal-800 text-white" : "bg-gray-100 text-gray-700"
            }`}
            style={{
              top: "100%", // Position it right below the parent element
              maxHeight: "300px", // Set a max height to control the dropdown
              overflowY: "auto", // Add scroll if content exceeds maxHeight
            }}
          >
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
                    className={`text-xs rounded-md px-2 py-1 hover:bg-red-200 ${
                      isDark ? "text-red-500 bg-red-100" : "text-red-600 bg-red-200"
                    }`}
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
                } ${isDark ? "text-gray-200" : "text-gray-700"}`}
                onClick={() => handleDropdownChange("")}
              >
                Any
              </li>
              {localOptions.map((option) => (
                <li
                  key={option}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-200 ${
                    isDark ? "text-gray-200 hover:bg-teal-700" : "text-gray-800 hover:bg-gray-200"
                  }`}
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
                      className={`text-xs rounded-md px-2 py-1 ml-2 ${
                        isDark ? "text-red-500 bg-red-100 hover:bg-red-200" : "text-red-600 bg-red-200 hover:bg-red-300"
                      }`}
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
                className={`w-full p-1 border rounded text-sm focus:outline-none ${
                  isDark ? "border-gray-500 text-white bg-teal-900" : "border-gray-300 text-gray-800"
                }`}
              />
              <button
                onClick={handleCustomAdd}
                className={`mt-1 px-2 py-1 text-xs rounded hover:bg-blue-600 ${
                  isDark ? "bg-teal-500 text-white" : "bg-blue-500 text-white"
                }`}
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
            className={`mt-4 w-full py-2 text-sm rounded-md ${
              isDark ? "bg-teal-700 text-white hover:bg-teal-600" : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Clear {title}
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralFilter;
