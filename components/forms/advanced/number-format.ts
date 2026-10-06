export function parseFormattedNumber(value: string, locale: string): string {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  const groupSeparator = parts.find((part) => part.type === "group")?.value ?? ","
  const normalized = value.replace(/\s/g, "").replace(/[\u00a0\u202f]/g, "")
  const separators = [...normalized.matchAll(/[.,]/g)]

  if (separators.length === 0) return normalized

  const lastSeparator = separators[separators.length - 1]
  const decimalIndex = lastSeparator.index ?? -1
  const typedDecimal = lastSeparator[0]
  const fractionalPart = normalized.slice(decimalIndex + 1)
  const separatorTypes = new Set(separators.map(([separator]) => separator))
  const hasBothSeparators = separatorTypes.size > 1
  const isValidGroupedNumber = /^[+-]?\d{1,3}(?:[,.]\d{3})+$/.test(normalized)
  const useAsThousands = !hasBothSeparators && (
    typedDecimal === groupSeparator &&
    (fractionalPart.length === 3 || (separators.length > 1 && isValidGroupedNumber))
  )

  if (useAsThousands) return normalized.replace(/[.,]/g, "")

  const whole = normalized.slice(0, decimalIndex).replace(/[.,]/g, "")
  const fraction = normalized.slice(decimalIndex + 1).replace(/[.,]/g, "")
  return `${whole}.${fraction}`
}
