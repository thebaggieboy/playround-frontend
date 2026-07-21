import React from "react"
import { Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion, AnimatePresence } from "framer-motion"

export function MacroForm({
  formData,
  updateFormData,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  inputMode: "essential" | "standard" | "expert"
}) {
  const isExpert = inputMode === "expert"
  const isStandardOrExpert = inputMode !== "essential"

  const customMacroDrivers = formData.customMacroDrivers || []

  const handleAddMacroDriver = () => {
    if (customMacroDrivers.length < 10) {
      const newItems = [...customMacroDrivers, {
        id: Math.random().toString(36).substr(2, 9),
        name: "", value: 0, unit: "%", type: "Index"
      }]
      updateFormData('customMacroDrivers', newItems)
    }
  }

  const handleUpdateMacroDriver = (id: string, field: string, value: any) => {
    const newItems = customMacroDrivers.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customMacroDrivers', newItems)
  }

  const handleRemoveMacroDriver = (id: string) => {
    const newItems = customMacroDrivers.filter((item: any) => item.id !== id)
    updateFormData('customMacroDrivers', newItems)
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Macro Economic & General Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define global parameters for your financial model</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Reporting Currency" type="select" options={["USD ($)", "NGN (₦)", "EUR (€)", "GBP (£)", "JPY (¥)"]} defaultValue="USD ($)" value={formData?.reportingCurrency} tooltip="The primary currency used for all financial statements and calculations." onChange={(value) => updateFormData('reportingCurrency', value)} />
        <InputField label="Exchange Rate (Local/USD)" type="number" defaultValue="1470" value={formData?.exchangeRate} tooltip="Local currency units per 1 USD (e.g., NGN/USD)." onChange={(value) => updateFormData('exchangeRate', Number(value))} />
        <InputField label="Base Year" type="number" tooltip="The first year of the financial model (Year 0/1)." value={formData?.baseYear} defaultValue="2025" onChange={(value) => updateFormData('baseYear', Number(value))} />
        <InputField label="Periodicity" type="select" options={["Monthly", "Quarterly", "Semi-Annually", "Annually"]} defaultValue="Annually" value={formData?.periodicity} tooltip="The time frequency for generated financial reports (e.g., Annual vs Quarterly updates)." onChange={(value) => updateFormData('periodicity', value)} />
        <InputField label="Number of Years in Model" type="number" value={formData?.numberOfYears} onChange={(value) => updateFormData('numberOfYears', Number(value))} defaultValue="28" tooltip="Total forecast horizon for the project evaluation." />
        <InputField label="Model Tolerance" type="number" defaultValue="0.001" value={formData?.modelTolerance} onChange={(value) => updateFormData('modelTolerance', Number(value))} tooltip="Maximum allowable error margin for balance sheet balancing." />
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Inflation Assumptions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Local Inflation Rate" type="number" suffix="%" defaultValue="15.0" value={formData?.localInflationRate} tooltip="Projected annual inflation rate for the local market currency." onChange={(value) => updateFormData('localInflationRate', Number(value))} />
          <InputField label="US/Foreign Inflation Rate" type="number" suffix="%" defaultValue="2.5" value={formData?.foreignInflationRate} tooltip="Projected annual inflation rate for US Dollar (USD) or international benchmark." onChange={(value) => updateFormData('foreignInflationRate', Number(value))} />
          <InputField label="Long-term Target Inflation" type="number" suffix="%" defaultValue="9.0" tooltip="The equilibrium inflation rate reached after the initial high-growth/volatile period." value={formData?.longTermTargetInflation} onChange={(val) => updateFormData('longTermTargetInflation', Number(val))} />
          <InputField label="Revenue/OpEx Escalation Rate (USD)" type="number" suffix="%" defaultValue="2.5" tooltip="Annual percentage increase applied to revenues and operational costs denominated in USD." value={formData?.revenueOpexEscalationRateUsd} onChange={(val) => updateFormData('revenueOpexEscalationRateUsd', Number(val))} />
        </div>
      </div>

      {isStandardOrExpert && (
        <div className="pt-6 border-t border-border mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Custom Macro Drivers
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Define custom indices (e.g. Brent Crude, FX Forward Curves) that can be referenced in the model.</p>
            </div>
            <Button onClick={handleAddMacroDriver} variant="outline" size="sm" className="gap-1.5 text-xs h-8" disabled={customMacroDrivers.length >= 10}>
              <Plus className="w-3.5 h-3.5" />
              Add Driver
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {customMacroDrivers.map((item: any) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
                >
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveMacroDriver(item.id)} className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                    <InputField label="Driver Name" value={item.name} onChange={(val) => handleUpdateMacroDriver(item.id, 'name', val)} size="sm" placeholder="e.g. Brent Crude Price" />
                    <InputField label="Type" type="select" options={["Index", "Commodity", "Currency Curve", "Rate"]} value={item.type} onChange={(val) => handleUpdateMacroDriver(item.id, 'type', val)} size="sm" />
                    <InputField label="Value (Year 1)" type="number" value={item.value} onChange={(val) => handleUpdateMacroDriver(item.id, 'value', Number(val))} size="sm" />
                    <InputField label="Unit" value={item.unit} onChange={(val) => handleUpdateMacroDriver(item.id, 'unit', val)} size="sm" placeholder="e.g. $/bbl" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {isStandardOrExpert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Financial Rates & Benchmarks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Discount Rate / WACC" type="number" suffix="%" defaultValue="12.5" value={formData?.discountRateWacc} tooltip="Weighted Average Cost of Capital, used to discount future cash flows to Net Present Value (NPV)." onChange={(value) => updateFormData('discountRateWacc', Number(value))} />
            <InputField label="Risk-Free Rate" type="number" suffix="%" defaultValue="4.5" value={formData?.riskFreeRate} tooltip="Theoretical return on an investment with 0% risk, typically the 10-year US Treasury yield." onChange={(value) => updateFormData('riskFreeRate', Number(value))} />
            <InputField label="Benchmark Rate" type="select" options={["SOFR", "MPR (Monetary Policy Rate)", "LIBOR", "Prime Rate", "Other"]} defaultValue="SOFR" value={formData?.benchmarkRateType} tooltip="The reference interest rate used for debt calculation (e.g., Secured Overnight Financing Rate)." onChange={(value) => updateFormData('benchmarkRateType', value)} />
            <InputField label="Benchmark Rate Value" type="number" suffix="%" defaultValue="5.0" tooltip="Current benchmark rate value" value={formData?.benchmarkRateValue} onChange={(value) => updateFormData('benchmarkRateValue', Number(value))} />
            <InputField label="Terminal Growth Rate" type="number" suffix="%" defaultValue="3.0" tooltip="Perpetual growth rate for terminal value" value={formData?.terminalGrowthRate} onChange={(value) => updateFormData('terminalGrowthRate', Number(value))} />
            <InputField label="Contingency Buffer" type="number" suffix="%" defaultValue="4.0" tooltip="General contingency percentage" value={formData?.contingencyBuffer} onChange={(value) => updateFormData('contingencyBuffer', Number(value))} />
          </div>
        </motion.div>
      )}

      {isExpert && (
        <CustomParametersPanel 
          title="Custom Macro Parameters"
          parameters={formData.customParametersMacro || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersMacro || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersMacro', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersMacro || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersMacro', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersMacro || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersMacro', newParams);
          }}
        />
      )}
    </Card>
  )
}
