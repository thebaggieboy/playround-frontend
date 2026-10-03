import React, { createContext, useContext, useEffect, useState } from "react"
import { Info, RotateCcw, AlertCircle } from "lucide-react"

type InputNumberFormatSettings = {
  locale: string
  decimalPlaces: number
  currency: string
}

const InputNumberFormatContext = createContext<InputNumberFormatSettings>({
  locale: "en-US",
  decimalPlaces: 4,
  currency: "USD ($)",
})

export function InputNumberFormatProvider({
  locale,
  decimalPlaces,
  currency,
  children,
}: InputNumberFormatSettings & { children: React.ReactNode }) {
  return (
    <InputNumberFormatContext.Provider value={{ locale, decimalPlaces, currency }}>
      {children}
    </InputNumberFormatContext.Provider>
  )
}

const getCurrencySymbol = (currency: string) => {
  const symbol = currency.match(/\(([^)]+)\)$/)?.[1]
  if (symbol) return symbol

  const currencyCode = currency.split(" ")[0]
  return ({ USD: "$", NGN: "₦", EUR: "€", GBP: "£", JPY: "¥" } as Record<string, string>)[currencyCode] ?? currencyCode
}

export function useInputNumberFormat() {
  const settings = useContext(InputNumberFormatContext)
  return {
    currencySymbol: getCurrencySymbol(settings.currency),
    formatNumber: (value: string | number, decimalPlaces = settings.decimalPlaces) =>
      formatNumber(value, settings.locale, decimalPlaces),
  }
}

const formatNumber = (value: string | number, locale: string, decimalPlaces: number) => {
  if (value === "") return ""
  const number = Number(value)
  return Number.isFinite(number)
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: decimalPlaces }).format(number)
    : String(value)
}

const toEditableNumber = (value: string | number, locale: string) => {
  if (value === "") return ""
  const number = Number(value)
  return Number.isFinite(number)
    ? new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(number)
    : String(value)
}

const parseFormattedNumber = (value: string, locale: string) => {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  const groupSeparator = parts.find((part) => part.type === "group")?.value ?? ","
  const decimalSeparator = parts.find((part) => part.type === "decimal")?.value ?? "."
  return value
    .replace(/\s/g, "")
    .split(groupSeparator).join("")
    .split(decimalSeparator).join(".")
}

export function InputField({
  label,
  type = "text",
  name,
  value,
  prefix,
  currency,
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
  currency?: string
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
  const [isNumericFocused, setIsNumericFocused] = useState(false)
  const numberFormat = useContext(InputNumberFormatContext)
  const controlledValue = value !== undefined ? value : (defaultValue ?? "")
  const [draftValue, setDraftValue] = useState(() =>
    type === "number"
      ? formatNumber(controlledValue, numberFormat.locale, numberFormat.decimalPlaces)
      : String(controlledValue)
  )

  useEffect(() => {
    if (type === "number" && !isNumericFocused) {
      setDraftValue(formatNumber(controlledValue, numberFormat.locale, numberFormat.decimalPlaces))
    }
  }, [controlledValue, isNumericFocused, numberFormat.decimalPlaces, numberFormat.locale, type])

  const handleNumericChange = (nextValue: string) => {
    setDraftValue(nextValue)
    const normalizedValue = parseFormattedNumber(nextValue, numberFormat.locale)
    if (normalizedValue === "" || Number.isFinite(Number(normalizedValue))) {
      onChange?.(normalizedValue)
    }
  }

  const handleNumericBlur = () => {
    setIsNumericFocused(false)
    const normalizedValue = parseFormattedNumber(draftValue, numberFormat.locale)
    const number = Number(normalizedValue)
    if (normalizedValue === "" || Number.isFinite(number)) {
      onChange?.(normalizedValue)
      setDraftValue(formatNumber(normalizedValue, numberFormat.locale, numberFormat.decimalPlaces))
    } else {
      setDraftValue(formatNumber(controlledValue, numberFormat.locale, numberFormat.decimalPlaces))
    }
  }

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
            {prefix === "$" ? getCurrencySymbol(currency ?? numberFormat.currency) : prefix}
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
            type={type === "number" ? "text" : type}
            inputMode={type === "number" ? "decimal" : undefined}
            placeholder={placeholder}
            className={`w-full ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-16" : "pr-3"} ${inputClasses} border rounded-lg transition-colors text-foreground focus:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-75 ${bgStateClass} ${borderStateClass}`}
            value={type === "number" ? draftValue : controlledValue}
            onFocus={type === "number" ? () => {
              setIsNumericFocused(true)
              setDraftValue(toEditableNumber(controlledValue, numberFormat.locale))
            } : undefined}
            onBlur={type === "number" ? handleNumericBlur : undefined}
            onChange={(e) => type === "number" ? handleNumericChange(e.target.value) : onChange?.(e.target.value)}
            readOnly={calculated}
            disabled={calculated}
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
