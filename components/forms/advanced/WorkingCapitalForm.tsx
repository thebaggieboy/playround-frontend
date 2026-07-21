import React from "react"
import { Card } from "@/components/ui/card"
import { InputField } from "./InputField"
import { motion } from "framer-motion"

export function WorkingCapitalForm({
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Working Capital Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define working capital requirements and cash cycle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Initial Working Capital" type="number" suffix="% of Year 1 OpEx" defaultValue="30.0" tooltip="The amount of cash required at the start of operations, expressed as a percentage of first-year OpEx." value={formData?.initialWorkingCapital} onChange={(val) => updateFormData('initialWorkingCapital', Number(val))} />
        <InputField label="Receivables Days (DSO)" type="number" suffix="days" defaultValue="45" tooltip="Days Sales Outstanding: The average number of days it takes to collect cash from customers after a sale." value={formData?.receivablesDaysDso} onChange={(val) => updateFormData('receivablesDaysDso', Number(val))} />
        <InputField label="Inventory Days (DIO)" type="number" suffix="days" defaultValue="60" tooltip="Days Inventory Outstanding: The average number of days you hold raw materials or finished goods before selling them." value={formData?.inventoryDaysDio} onChange={(val) => updateFormData('inventoryDaysDio', Number(val))} />
        <InputField label="Payables Days (DPO)" type="number" suffix="days" defaultValue="30" tooltip="Days Payables Outstanding: The average number of days you take to pay your suppliers and creditors." value={formData?.payablesDaysDpo} onChange={(val) => updateFormData('payablesDaysDpo', Number(val))} />
        <InputField label="Cash Cycle (Days)" type="number" suffix="days" defaultValue="75" calculated tooltip="The net duration of the cash conversion cycle: DSO + DIO - DPO." value={formData?.cashCycleDays} onChange={(val) => updateFormData('cashCycleDays', Number(val))} />
      </div>

      {inputMode !== "essential" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Additional Working Capital Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Working Capital as % of Revenue" type="number" suffix="%" defaultValue="10.0" tooltip="The target level of net working capital maintained as a percentage of gross revenue." value={formData?.workingCapitalAsPctOfRevenue} onChange={(val) => updateFormData('workingCapitalAsPctOfRevenue', Number(val))} />
            <InputField label="Minimum Cash Balance" type="number" prefix="$" defaultValue="1000000" tooltip="The absolute minimum cash reserve the company must hold for operational safety." value={formData?.minimumCashBalance} onChange={(val) => updateFormData('minimumCashBalance', Number(val))} />
            <InputField label="Working Capital Funding" type="select" options={["From Equity", "From Debt", "From Operations", "Mixed"]} defaultValue="From Equity" tooltip="The primary source of funds used to bridge working capital shortfalls." value={formData?.workingCapitalFunding} onChange={(val) => updateFormData('workingCapitalFunding', val)} />
            <InputField label="WC Reserve Account" type="select" options={["Yes", "No"]} defaultValue="No" tooltip="Specifies if a dedicated bank account is maintained specifically for working capital reserves." value={formData?.wcReserveAccount} onChange={(val) => updateFormData('wcReserveAccount', val)} />
          </div>
        </motion.div>
      )}
    </Card>
  )
}
