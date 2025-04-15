import React from "react";
import { Slider } from "antd";

const RangeSlider = ({ label, min, max, value, onChange, unit, ticks = 1, variant = "light" }) => {
  // Generate marks dynamically based on tickCount
  const marks = {
    [min]: `${min}`,
    [max]: `${max}`,
    ...Array.from({ length: ticks }).reduce((acc, _, i) => {
      const val = Math.round(min + ((i + 1) * (max - min)) / (ticks + 1));
      acc[val] = `${val}`;
      return acc;
    }, {}),
  };

  const handleInputChange = (index, newValue) => {
    const updated = [...value];
    updated[index] = Number(newValue);
    if (updated[0] <= updated[1]) {
      onChange(updated);
    }
  };

  // Determine color scheme based on variant (light or dark)
  const isDark = variant === "dark";

  const baseCardClasses = `rounded-lg shadow-md border-b-4 transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-[400px] ${
    isDark
      ? "bg-[var(--primary)] border-[var(--primary-cmpmt)] text-white hover:shadow-teal-700/50"
      : "bg-white border-yellow-400 text-gray-800 hover:shadow-lg"
  }`;

  const titleClasses = `text-2xl font-semibold line-clamp-2 ${
    isDark ? "text-[var(--main-text)]" : "text-gray-800"
  }`;

  const descClasses = `text-sm mt-2 line-clamp-3 ${
    isDark ? "text-[var(--sub-text)]" : "text-gray-600"
  }`;

  return (
    <div className={`mt-4 flex flex-col space-y-3 p-4 ${isDark ? "bg-[var(--secondary-dark)] text-[var(--main-text)]" : "bg-white text-gray-800"} rounded-md shadow-sm`}>
      {/* Label */}
      <label className={`block text-lg font-semibold ${isDark ? "text-[var(--main-text)]" : "text-gray-700"} mb-2`}>
        {label} {unit ? `(${unit})` : ""}
      </label>

      {/* Unified Range Control Block */}
      <div className="flex flex-col space-y-3">

        {/* Inputs + Dash */}
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            className={`w-24 px-3 py-1.5 border ${isDark ? "border-[var(--primary-cmpmt)]" : "border-gray-300"} rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent transition`}
            value={value[0]}
            min={min}
            max={value[1]}
            onChange={(e) => handleInputChange(0, e.target.value)}
          />
          <span className={`text-sm ${isDark ? "text-[var(--sub-text)]" : "text-gray-500"}`}>–</span>
          <input
            type="number"
            className={`w-24 px-3 py-1.5 border ${isDark ? "border-[var(--primary-cmpmt)]" : "border-gray-300"} rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent transition`}
            value={value[1]}
            min={value[0]}
            max={max}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
        </div>

        {/* Slider */}
        <Slider
          range
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          marks={marks}
          className="w-[90%]"
          tooltip={{ formatter: (val) => `${val}` }}
          style={{
            backgroundColor: isDark ? "#e5e5e5" : "#e5e5e5", // Unselected area color
          }}
          handleStyle={{
            borderColor: isDark ? "#4caf50" : "#4caf50", // Handle border color
            backgroundColor: isDark ? "#4caf50" : "#4caf50", // Handle background
          }}
          trackStyle={{
            backgroundColor: isDark ? "#4caf50" : "#4caf50", // Selected range color
          }}
          railStyle={{
            backgroundColor: isDark ? "#e5e5e5" : "#e5e5e5", // Rail (unselected area) color
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;