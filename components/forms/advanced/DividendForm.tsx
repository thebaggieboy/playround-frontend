import React from "react"
import { Card } from "@/components/ui/card"
import { InputField } from "./InputField"
import { motion } from "framer-motion"
import { getIndustryFormCopy } from "./IndustryConfig"

export function DividendForm({
  formData,
  updateFormData,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  inputMode: "essential" | "standard" | "expert"
}) {
  const industry = formData?.industrySector || "Project"
  const subType = formData?.industrySubType || industry
  const industryCopy = getIndustryFormCopy(industry, subType)

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{industryCopy.sectionNames.dividend}</h3>
        <p className="text-sm text-muted-foreground">Set distributions from {subType} project cash flows, subject to debt service, covenants and required reserve funding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label={industry === "Energy & Power" || industry === "Mining and Natural Resources" ? "Cash Available for Distribution" : "Dividend Payout Ratio"} type="number" suffix={industry === "Energy & Power" || industry === "Mining and Natural Resources" ? "% of distributable cash" : "% of net income"} defaultValue="15.0" tooltip={`Share of ${subType} project earnings or distributable cash allocated to shareholders after required debt and reserve tests.`} value={formData?.dividendPayoutRatio} onChange={(val) => updateFormData('dividendPayoutRatio', Number(val))} />
        <InputField label="Dividend Payment Frequency" type="select" options={["Annually", "Semi-Annually", "Quarterly", "None"]} defaultValue="Annually" value={formData?.dividendPaymentFrequency} onChange={(val) => updateFormData('dividendPaymentFrequency', val)} />
        <InputField label="Minimum Cash Before Dividend" type="number" prefix="$" defaultValue="5000000" tooltip="Required cash buffer before paying dividends" value={formData?.minimumCashBeforeDividend} onChange={(val) => updateFormData('minimumCashBeforeDividend', Number(val))} />
      </div>

      {inputMode !== "essential" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">{subType} Covenant & Distribution Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Minimum DSCR for Dividend" type="number" defaultValue="1.3" tooltip="Minimum debt service coverage ratio before paying dividends" value={formData?.minimumDscrForDividend} onChange={(val) => updateFormData('minimumDscrForDividend', Number(val))} />
            <InputField label="Minimum LLCR for Dividend" type="number" defaultValue="1.5" tooltip="Minimum loan life coverage ratio" value={formData?.minimumLlcrForDividend} onChange={(val) => updateFormData('minimumLlcrForDividend', Number(val))} />
            <InputField label="Preferred Dividend Rate" type="number" suffix="% p.a." defaultValue="0" tooltip="For preferred shares if applicable" value={formData?.preferredDividendRate} onChange={(val) => updateFormData('preferredDividendRate', Number(val))} />
            <InputField label="Share Buyback Provision" type="select" options={["Yes", "No"]} defaultValue="No" value={formData?.shareBuybackProvision} onChange={(val) => updateFormData('shareBuybackProvision', val)} />
            <InputField label="Dividend Withholding Tax" type="number" suffix="%" defaultValue="10.0" value={formData?.dividendWithholdingTax} onChange={(val) => updateFormData('dividendWithholdingTax', Number(val))} />
            <InputField label="Dividend Reinvestment Option" type="select" options={["Yes", "No"]} defaultValue="No" tooltip="DRIP - Dividend Reinvestment Plan" value={formData?.dividendReinvestmentOption} onChange={(val) => updateFormData('dividendReinvestmentOption', val)} />
          </div>
        </motion.div>
      )}
    </Card>
  )
}
