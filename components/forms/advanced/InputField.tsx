import React, { useState } from "react"
import { Info, RotateCcw, AlertCircle } from "lucide-react"

export function InputField({
  label,
  type = "text",
  name,
  value,
  prefix,
  suffix,
  defaultValue,
  calculated = false,
  tooltip,
  options,
  placeholder,
  onChange,
  size = "default",
  error,
  warning,
}: {
  label: string
  type?: "text" | "number" | "select" | "date"
  name?: string
  value?: string | number
  prefix?: string
  suffix?: string
  defaultValue?: string | number
  calculated?: boolean
  tooltip?: string
  options?: string[]
  placeholder?: string
  onChange?: (value: string) => void
  size?: "default" | "sm"
  error?: string
  warning?: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const inputClasses = size === "sm" ? "text-xs py-1.5" : "text-sm py-2"
  const labelClasses = size === "sm" ? "text-xs" : "text-sm"

  const handleReset = () => {
    if (defaultValue !== undefined && onChange) {
      onChange(defaultValue.toString())
    }
  }

  const hasChanged = value !== undefined && defaultValue !== undefined && value.toString() !== defaultValue.toString()

  let borderStateClass = "border-blue-200 focus:border-blue-400 focus:ring-blue-100 dark:border-blue-800 dark:focus:border-blue-500"
  let bgStateClass = "bg-blue-50 dark:bg-blue-950/30"
  
  if (calculated) {
    bgStateClass = "bg-blue-50/50 dark:bg-blue-950/10"
    borderStateClass = "border-blue-200/70 focus:border-blue-400 focus:ring-blue-100 dark:border-blue-800/50"
  }
  
  if (error) {
    borderStateClass = "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-700"
    bgStateClass = "bg-red-50 dark:bg-red-950/20"
  } else if (warning) {
    borderStateClass = "border-amber-400 focus:border-amber-500 focus:ring-amber-100 dark:border-amber-700"
    bgStateClass = "bg-amber-50 dark:bg-amber-950/20"
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className={`${labelClasses} font-medium text-foreground`}>{label}</label>
          {tooltip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <Info className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-5 z-50 w-64 bg-popover text-popover-foreground border shadow-lg text-xs p-2.5 rounded-md">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        {hasChanged && !calculated && (
          <button
            onClick={handleReset}
            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            title="Reset to default"
            type="button"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="sr-only sm:not-sr-only">Reset</span>
          </button>
        )}
      </div>
      
      <div className="relative">
        {prefix && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {prefix}
          </span>
        )}
        
        {type === "select" ? (
          <select
            className={`w-full px-3 ${inputClasses} border rounded-lg transition-colors text-foreground focus:ring-2 outline-none ${bgStateClass} ${borderStateClass}`}
            value={value !== undefined ? value : (defaultValue || '')}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={calculated}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-16" : "pr-3"} ${inputClasses} border rounded-lg transition-colors text-foreground focus:ring-2 outline-none ${bgStateClass} ${borderStateClass}`}
            value={value !== undefined ? value : (defaultValue || '')}
            onChange={(e) => onChange?.(e.target.value)}
            readOnly={calculated}
          />
        )}
        
        {suffix && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {suffix}
          </span>
        )}
      </div>
      
      {(error || warning) && (
        <div className={`flex items-center gap-1.5 text-xs ${error ? 'text-red-500' : 'text-amber-500'}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error || warning}</span>
        </div>
      )}
    </div>
  )
}
