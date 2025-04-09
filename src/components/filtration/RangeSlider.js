import React from "react";
import { Slider } from "antd";

const RangeSlider = ({ label, min, max, value, onChange, unit }) => {
  // Define marks to display labels at certain points on the slider
  const marks = {
    [min]: `${min} ${unit}`,
    [max]: `${max} ${unit}`,
    [Math.floor((max + min) / 2)]: `${Math.floor((max + min) / 2)} ${unit}`,
  };

  return (
    <div className="mt-4">
      <label className="block text-lg font-semibold text-gray-700">
        {label} ({unit})
      </label>
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        marks={marks}  // Display the marks
        className="w-full mt-2" // Tailwind's width utility to make it full width
        tooltip={{
          formatter: (value) => `${value} ${unit}`, // Updated to tooltip.formatter
        }}
        handleStyle={{
          borderColor: "#4caf50", // Customize the slider handle color
          backgroundColor: "#4caf50", // Customize the slider handle background color
        }}
        trackStyle={{
          backgroundColor: "#4caf50", // Customize the slider track color
        }}
        railStyle={{
          backgroundColor: "#e5e5e5", // Customize the rail color
        }}
      />
      <div className="text-sm text-gray-600">
        {/* Display the current value with unit */}
        {value[0]} {unit} - {value[1]} {unit}
      </div>
    </div>
  );
};

export default RangeSlider;
