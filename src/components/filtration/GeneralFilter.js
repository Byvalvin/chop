import React, { useState, useEffect } from "react";

const GeneralFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  isMultiSelect = true, // Whether multi-select is allowed or not
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // If single-select and no value is selected, default to 'Any'
  const selectedTitle = selectedValues.length === 0 ? "Any" : selectedValues.join(", ");

  // Handle item selection for multi-select (checkboxes)
  const handleCheckboxChange = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option)); // Remove if already selected
    } else {
      onChange(isMultiSelect ? [...selectedValues, option] : [option]); // Add new selection
    }
  };

  // Handle dropdown (single-select)
  const handleDropdownChange = (option) => {
    if (!isMultiSelect) {
      onChange([option]); // For single select, update with only the selected option
      setIsOpen(false); // Close the dropdown after selection
    }
  };

  return (
    <div className="mt-4">
      <div
        className="cursor-pointer flex items-center justify-between p-2 bg-gray-200 rounded-md"
        onClick={() => setIsOpen(!isOpen)} // Toggle open/close
      >
        <span className="text-sm font-semibold">{`${title}: ${selectedTitle}`}</span>
        <span className="text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md">
          {isMultiSelect ? (
            // Multi-Select with Checkboxes
            options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="form-checkbox"
                />
                <span>{option}</span>
              </label>
            ))
          ) : (
            // Single-Select Dropdown List
            <ul className="space-y-1">
              <li
                className="cursor-pointer text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                onClick={() => handleDropdownChange("")} // Option for 'Any'
              >
                Any
              </li>
              {options.map((option) => (
                <li
                  key={option}
                  className="cursor-pointer text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                  onClick={() => handleDropdownChange(option)} // Select on click
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneralFilter;
