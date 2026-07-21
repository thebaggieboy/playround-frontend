import React from "react"
import { Card } from "@/components/ui/card"
import { InputField } from "./InputField"
import { motion } from "framer-motion"

export function ValuationForm({
  formData,
  updateFormData,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  inputMode: "essential" | "standard" | "expert"
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Exit & Valuation Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define exit strategy and valuation parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Exit Year" type="number" defaultValue="10" tooltip="Year of exit from investment (from operations start)" value={formData?.exitYear} onChange={(val) => updateFormData('exitYear', Number(val))} />
        <InputField label="Exit Multiple (EV/EBITDA)" type="number" suffix="x" defaultValue="8.5" tooltip="Enterprise Value / EBITDA multiple" value={formData?.exitMultipleEvEbitda} onChange={(val) => updateFormData('exitMultipleEvEbitda', Number(val))} />
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
          <h4 className="text-sm font-semibold text-foreground mb-4">Alternative Valuation Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="P/E Multiple" type="number" suffix="x" defaultValue="12.0" tooltip="Price to Earnings multiple" value={formData?.pEMultiple} onChange={(val) => updateFormData('pEMultiple', Number(val))} />
            <InputField label="Price/Book Multiple" type="number" suffix="x" defaultValue="2.5" tooltip="Price to Book Value multiple" value={formData?.priceBookMultiple} onChange={(val) => updateFormData('priceBookMultiple', Number(val))} />
            <InputField label="Revenue Multiple" type="number" suffix="x" defaultValue="1.5" tooltip="Enterprise Value / Revenue multiple" value={formData?.revenueMultiple} onChange={(val) => updateFormData('revenueMultiple', Number(val))} />
            <InputField label="Asset Sale Value (if applicable)" type="number" prefix="$" defaultValue="0" tooltip="If selling assets instead of equity" value={formData?.assetSaleValueIfApplicable} onChange={(val) => updateFormData('assetSaleValueIfApplicable', Number(val))} />
            <InputField label="Transaction Costs" type="number" suffix="% of exit value" defaultValue="3.0" tooltip="M&A advisory, legal, tax costs" value={formData?.transactionCosts} onChange={(val) => updateFormData('transactionCosts', Number(val))} />
            <InputField label="Valuation Method" type="select" options={["DCF (Discounted Cash Flow)", "Multiple-based", "Asset-based", "Hybrid"]} defaultValue="DCF (Discounted Cash Flow)" value={formData?.valuationMethod} onChange={(val) => updateFormData('valuationMethod', val)} />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Return Metrics Targets</h4>
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
