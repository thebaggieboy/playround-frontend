import React from "react"
import { Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion, AnimatePresence } from "framer-motion"

export function TaxForm({
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

  const customTaxes = formData.customTaxes || []

  const handleAddCustomTax = () => {
    if (customTaxes.length < 10) {
      const newItems = [...customTaxes, {
        id: Math.random().toString(36).substr(2, 9),
        name: "", rate: 0, basis: "Revenue"
      }]
      updateFormData('customTaxes', newItems)
    }
  }

  const handleUpdateCustomTax = (id: string, field: string, value: any) => {
    const newItems = customTaxes.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customTaxes', newItems)
  }

  const handleRemoveCustomTax = (id: string) => {
    const newItems = customTaxes.filter((item: any) => item.id !== id)
    updateFormData('customTaxes', newItems)
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Assumptions</h3>
        <p className="text-sm text-muted-foreground">Configure tax rates and policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Corporate Income Tax Rate" type="number" suffix="%" defaultValue="30.0" tooltip="The standard statutory tax rate applied to the company's taxable profits." value={formData?.corporateIncomeTaxRate} onChange={(val) => updateFormData('corporateIncomeTaxRate', Number(val))} />
        <InputField label="VAT/Sales Tax Rate" type="number" suffix="%" defaultValue="7.5" tooltip="Value Added Tax applied to the sale of goods and services." value={formData?.vatSalesTaxRate} onChange={(val) => updateFormData('vatSalesTaxRate', Number(val))} />
        <InputField label="Tax Holiday Period" type="number" suffix="years" defaultValue="0" tooltip="The initial period (in years) where the project is exempt from paying corporate income tax (e.g., Pioneer Status)." value={formData?.taxHolidayPeriod} onChange={(val) => updateFormData('taxHolidayPeriod', Number(val))} />
        <InputField label="Tax Holiday Rate" type="number" suffix="%" defaultValue="0" tooltip="The effective tax rate applied during the tax holiday period (usually 0%)." value={formData?.taxHolidayRate} onChange={(val) => updateFormData('taxHolidayRate', Number(val))} />
        <InputField label="Minimum Tax Rate" type="number" suffix="%" defaultValue="0.5" tooltip="A tax floor based on gross turnover, applicable if the calculated CIT is lower than this amount." value={formData?.minimumTaxRate} onChange={(val) => updateFormData('minimumTaxRate', Number(val))} />
      </div>

      {isStandardOrExpert && (
        <div className="pt-6 border-t border-border mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Custom Taxes & Duties
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Add localized taxes like Carbon Tax, Royalties, or property taxes.</p>
            </div>
            <Button onClick={handleAddCustomTax} variant="outline" size="sm" className="gap-1.5 text-xs h-8" disabled={customTaxes.length >= 10}>
              <Plus className="w-3.5 h-3.5" />
              Add Tax
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {customTaxes.map((item: any) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
                >
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomTax(item.id)} className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField label="Tax Name" value={item.name} onChange={(val) => handleUpdateCustomTax(item.id, 'name', val)} size="sm" placeholder="e.g. Carbon Tax" />
                    <InputField label="Rate" type="number" suffix="%" value={item.rate} onChange={(val) => handleUpdateCustomTax(item.id, 'rate', Number(val))} size="sm" />
                    <InputField label="Tax Basis" type="select" options={["Revenue", "Gross Profit", "EBITDA", "Net Profit", "Fixed Amount"]} value={item.basis} onChange={(val) => handleUpdateCustomTax(item.id, 'basis', val)} size="sm" />
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
          <h4 className="text-sm font-semibold text-foreground mb-4">Withholding Taxes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="WHT on Dividends" type="number" suffix="%" defaultValue="10.0" tooltip="Tax withheld at source on dividend payments to shareholders." value={formData?.whtOnDividends} onChange={(val) => updateFormData('whtOnDividends', Number(val))} />
            <InputField label="WHT on Interest" type="number" suffix="%" defaultValue="10.0" tooltip="Tax withheld at source on interest payments to lenders." value={formData?.whtOnInterest} onChange={(val) => updateFormData('whtOnInterest', Number(val))} />
            <InputField label="WHT on Services" type="number" suffix="%" defaultValue="5.0" tooltip="Tax withheld on payments made for professional and technical services." value={formData?.whtOnServices} onChange={(val) => updateFormData('whtOnServices', Number(val))} />
            <InputField label="WHT on Rent" type="number" suffix="%" defaultValue="10.0" tooltip="Tax withheld on lease or rental payments for land and buildings." value={formData?.whtOnRent} onChange={(val) => updateFormData('whtOnRent', Number(val))} />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Other Tax Provisions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Education Tax" type="number" suffix="% of assessable profit" defaultValue="2.5" tooltip="Tertiary education tax applied to assessable profits (specific to Nigeria)." value={formData?.educationTax} onChange={(val) => updateFormData('educationTax', Number(val))} />
              <InputField label="Tax Loss Carryforward Period" type="number" suffix="years" defaultValue="5" tooltip="The number of years that operational losses can be used to reduce future taxable income." value={formData?.taxLossCarryforwardPeriod} onChange={(val) => updateFormData('taxLossCarryforwardPeriod', Number(val))} />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Capital Allowances (Tax Depreciation)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Initial Allowance" type="number" suffix="%" defaultValue="25.0" tooltip="The percentage of capital expenditure that can be deducted for tax purposes in the first year of acquisition." value={formData?.initialAllowance} onChange={(val) => updateFormData('initialAllowance', Number(val))} />
              <InputField label="Annual Allowance" type="number" suffix="%" defaultValue="20.0" tooltip="The annual percentage deduction for tax depreciation in subsequent years." value={formData?.annualAllowance} onChange={(val) => updateFormData('annualAllowance', Number(val))} />
            </div>
          </div>
        </motion.div>
      )}

      {isExpert && (
        <CustomParametersPanel 
          title="Custom Tax Parameters"
          parameters={formData.customParametersTax || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersTax || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersTax', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersTax || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersTax', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersTax || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersTax', newParams);
          }}
        />
      )}
    </Card>
  )
}
