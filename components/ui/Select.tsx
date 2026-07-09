"use client"

import React, { forwardRef } from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = "", id, ...props }, ref) => {
    const selectId = id || `select-${Date.now()}`
    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-medium text-text-secondary uppercase tracking-[0.8px] mb-2 font-sans"
          >
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-bg-secondary/80 border border-border focus:border-accent rounded-sm px-4 h-[44px] text-sm font-sans text-text-primary outline-none transition-all duration-200 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-secondary text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

Select.displayName = "Select"
export default Select

