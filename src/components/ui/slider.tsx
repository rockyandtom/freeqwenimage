"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, min = 0, step = 1, disabled = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange([newValue]);
    };

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0] || min}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
            "slider:bg-primary slider:h-2 slider:rounded-lg",
            "slider:thumb:appearance-none slider:thumb:h-5 slider:thumb:w-5",
            "slider:thumb:rounded-full slider:thumb:bg-primary slider:thumb:cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((value[0] - min) / (max - min)) * 100}%, hsl(var(--secondary)) ${((value[0] - min) / (max - min)) * 100}%, hsl(var(--secondary)) 100%)`
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider }