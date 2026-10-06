import React from "react"
import { Card } from "@/components/ui/card"
import { InputField } from "./InputField"
import { motion } from "framer-motion"
import { getIndustryFormCopy } from "./IndustryConfig"

export function ValuationForm({
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
        <h3 className="text-lg font-semibold text-foreground mb-4">{industryCopy.sectionNames.valuation}</h3>
        <p className="text-sm text-muted-foreground">Set the {subType} cash-flow case, exit basis, discount rate, terminal value and return targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Exit Year" type="number" defaultValue="10" tooltip="Year of exit from investment (from operations start)" value={formData?.exitYear} onChange={(val) => updateFormData('exitYear', Number(val))} />
        <InputField label={industry === "Energy & Power" ? "Exit Multiple (EV / EBITDA)" : industry === "Real Estate" ? "Exit Multiple (EV / Stabilised NOI)" : industry === "Mining and Natural Resources" ? "Exit Multiple (EV / EBITDA, Resource Case)" : "Exit Multiple (EV / EBITDA)"} type="number" suffix="x" defaultValue="8.5" tooltip={`Exit valuation multiple applied to the forecast ${subType} operating earnings; confirm the metric is appropriate to the sector.`} value={formData?.exitMultipleEvEbitda} onChange={(val) => updateFormData('exitMultipleEvEbitda', Number(val))} />
        <InputField label="Terminal Growth Rate" type="number" suffix="%" defaultValue="3.0" tooltip="Perpetual growth rate for terminal value calculation" value={formData?.terminalGrowthRate} onChange={(val) => updateFormData('terminalGrowthRate', Number(val))} />
        <InputField label="Discount Rate for NPV" type="number" suffix="%" defaultValue="12.5" tooltip="Discount rate for net present value calculations" value={formData?.discountRateForNpv} onChange={(val) => updateFormData('discountRateForNpv', Number(val))} />
        <InputField label="Target IRR" type="number" suffix="%" defaultValue="18.0" tooltip="Target internal rate of return" value={formData?.targetIrr} onChange={(val) => updateFormData('targetIrr', Number(val))} />
      </div>

      {inputMode !== "essential" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Alternative {subType} Valuation Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="P/E Multiple" type="number" suffix="x" defaultValue="12.0" tooltip="Price to Earnings multiple" value={formData?.pEMultiple} onChange={(val) => updateFormData('pEMultiple', Number(val))} />
            <InputField label="Price/Book Multiple" type="number" suffix="x" defaultValue="2.5" tooltip="Price to Book Value multiple" value={formData?.priceBookMultiple} onChange={(val) => updateFormData('priceBookMultiple', Number(val))} />
            <InputField label="Revenue Multiple" type="number" suffix="x" defaultValue="1.5" tooltip="Enterprise Value / Revenue multiple" value={formData?.revenueMultiple} onChange={(val) => updateFormData('revenueMultiple', Number(val))} />
            <InputField label="Asset Sale Value (if applicable)" type="number" prefix="$" defaultValue="0" tooltip="If selling assets instead of equity" value={formData?.assetSaleValueIfApplicable} onChange={(val) => updateFormData('assetSaleValueIfApplicable', Number(val))} />
            <InputField label="Transaction Costs" type="number" suffix="% of exit value" defaultValue="3.0" tooltip="M&A advisory, legal, tax costs" value={formData?.transactionCosts} onChange={(val) => updateFormData('transactionCosts', Number(val))} />
            <InputField label="Valuation Method" type="select" options={["DCF (Discounted Cash Flow)", "Multiple-based", "Asset-based", "Hybrid"]} defaultValue="DCF (Discounted Cash Flow)" value={formData?.valuationMethod} onChange={(val) => updateFormData('valuationMethod', val)} />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">{subType} Return Hurdles & Performance Targets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Target Equity IRR" type="number" suffix="%" defaultValue="20.0" tooltip="Target return on equity" value={formData?.targetEquityIrr} onChange={(val) => updateFormData('targetEquityIrr', Number(val))} />
              <InputField label="Target Project IRR" type="number" suffix="%" defaultValue="15.0" tooltip="Target unlevered project return" value={formData?.targetProjectIrr} onChange={(val) => updateFormData('targetProjectIrr', Number(val))} />
              <InputField label="Payback Period Target" type="number" suffix="years" defaultValue="7" tooltip="Desired payback period" value={formData?.paybackPeriodTarget} onChange={(val) => updateFormData('paybackPeriodTarget', Number(val))} />
              <InputField label="Minimum MOIC" type="number" suffix="x" defaultValue="2.5" tooltip="Multiple on Invested Capital" value={formData?.minimumMoic} onChange={(val) => updateFormData('minimumMoic', Number(val))} />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}
