import React, { useState, useRef, useEffect } from "react";

export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value = [],
  defaultValue = [],
  onValueChange,
  ...props
}) {
  const getInitialValue = () => {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    } else if (Array.isArray(defaultValue) && defaultValue.length > 0) {
      return defaultValue[0];
    } else {
      return min;
    }
  };

  const [internalValue, setInternalValue] = useState(getInitialValue());
  const trackRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setInternalValue(value[0]);
    }
  }, [value]);

  const percentage = ((internalValue - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);

    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <div
      className={`relative flex w-full touch-none select-none items-center ${
        className || ""
      }`}
      {...props}
    >
      <div className="relative w-full h-2">
        {/* Background track */}
        <div
          className="absolute h-2 w-full rounded-full bg-secondary"
          ref={trackRef}
        />

        {/* Filled track */}
        <div
          className="absolute h-2 rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          className="absolute w-full h-2 cursor-pointer opacity-0"
        />

        <div
          className="absolute w-4 h-4 rounded-full border-2 border-primary bg-background -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
