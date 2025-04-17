import React from "react";
import { Slider } from "antd";

const RangeSlider = ({ label, min, max, value, onChange, unit, ticks = 1 }) => {
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

  const TextInput = ({ type, value, min, max, onChange, className }) => {
    return (
      <input
        type={type}
        className={`w-24 px-3 py-1.5 border border-[var(--primary-cmpmt)] rounded-md text-sm shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent transition ${className}`}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
      />
    );
  };
  const RangeInput = ({ value, min, max, handleInputChange }) => {
    return (
      <div className="flex items-center space-x-2">
        <TextInput
          type="number"
          value={value[0]}
          min={min}
          max={value[1]}
          onChange={(e) => handleInputChange(0, e.target.value)}
        />
        <span className="text-sm text-[var(--sub-text)]">–</span>
        <TextInput
          type="number"
          value={value[1]}
          min={value[0]}
          max={max}
          onChange={(e) => handleInputChange(1, e.target.value)}
        />
      </div>
    );
  };
  
  const handleInputChange = (index, newValue) => {
    const updated = [...value];
    updated[index] = Number(newValue);
    if (updated[0] <= updated[1]) {
      onChange(updated);
    }
  };

  return (
    <div className="mt-4 flex flex-col space-y-3 p-4 bg-[var(--primary)] text-[var(--main-text)] rounded-md">
      {/* Label */}
      <label className="block text-lg font-semibold text-[var(--main-text)] mb-2" >
        {label} {unit ? `(${unit})` : ""}
      </label>

      {/* Unified Range Control Block */}
      <div className="flex flex-col space-y-3 ">
        {/* Inputs + Dash */}
        <div className="flex items-center justify-between gap-3">
          <RangeInput
            value={value}
            min={min}
            max={max}
            handleInputChange={handleInputChange}
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
            backgroundColor: "var(--slider-bg)", // Unselected area color
          }}
          handleStyle={{
            borderColor: "var(--slider-handle-border)", // Handle border color
            backgroundColor: "var(--slider-handle-bg)", // Handle background
          }}
          trackStyle={{
            backgroundColor: "var(--slider-track-bg)", // Selected range color
          }}
          railStyle={{
            backgroundColor: "var(--slider-rail-bg)", // Rail (unselected area) color
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;