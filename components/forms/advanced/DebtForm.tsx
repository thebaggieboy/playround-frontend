import React from "react"
import { Building, Plus, X, PieChart, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion, AnimatePresence } from "framer-motion"

export function DebtForm({
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
  
  const customDebtTranches = formData.customDebtTranches || []

  const handleAddTranche = () => {
    if (customDebtTranches.length < 5) {
      const newItems = [...customDebtTranches, {
        id: Math.random().toString(36).substr(2, 9),
        name: "", amount: 0, interestRate: 8.5, tenor: 10, gracePeriod: 24, repaymentType: "Amortizing"
      }]
      updateFormData('customDebtTranches', newItems)
    }
  }

  const handleUpdateTranche = (id: string, field: string, value: any) => {
    const newItems = customDebtTranches.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customDebtTranches', newItems)
  }

  const handleRemoveTranche = (id: string) => {
    const newItems = customDebtTranches.filter((item: any) => item.id !== id)
    updateFormData('customDebtTranches', newItems)
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Debt & Financing Structure</h3>
        <p className="text-sm text-muted-foreground">Configure funding sources and debt terms</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Define the capital structure and financing mix for your project
        </AlertDescription>
      </Alert>

      <div className="pt-4">
        <h4 className="text-sm font-semibold text-foreground mb-4">Funding Mix</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Total Project Cost" type="number" prefix="$" defaultValue="184215458" calculated tooltip="The comprehensive project cost that requires funding (Final Development Cost)." value={formData?.totalProjectCost} onChange={(val) => updateFormData('totalProjectCost', Number(val))} />
          <InputField label="Equity Percentage" type="number" suffix="%" defaultValue="23.9" tooltip="The portion of the project cost funded by shareholders' capital." value={formData?.equityPercentage} onChange={(val) => updateFormData('equityPercentage', Number(val))} />
          <InputField label="Equity Amount" type="number" prefix="$" defaultValue="43983691" tooltip="Calculated dollar amount of equity needed based on the percentage." calculated value={formData?.equityAmount} onChange={(val) => updateFormData('equityAmount', Number(val))} />
          <InputField label="Debt Percentage" type="number" suffix="%" defaultValue="43.0" tooltip="The portion of the project cost funded by external bank loans or bonds." value={formData?.debtPercentage} onChange={(val) => updateFormData('debtPercentage', Number(val))} />
          <InputField label="Debt Amount" type="number" prefix="$" defaultValue="79155515" tooltip="Calculated dollar amount of debt needed based on the percentage." calculated value={formData?.debtAmount} onChange={(val) => updateFormData('debtAmount', Number(val))} />
          <InputField label="Off-Plan Sales / Pre-sales %" type="number" suffix="%" defaultValue="33.2" tooltip="Funding derived from customer deposits before completion." value={formData?.offPlanSalesPreSalesPct} onChange={(val) => updateFormData('offPlanSalesPreSalesPct', Number(val))} />
        </div>
      </div>

      {customDebtTranches.length === 0 && (
        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">Primary Debt Terms & Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Interest Rate Type" type="select" options={["Fixed", "Floating", "Mixed"]} defaultValue="Floating" tooltip="Select whether the interest rate remains constant or changes based on market benchmarks." value={formData?.interestRateType} onChange={(val) => updateFormData('interestRateType', val)} />
            <InputField label="Base Rate" type="select" options={["SOFR", "MPR", "LIBOR", "Prime Rate", "Other"]} defaultValue="SOFR" tooltip="The reference benchmark rate (e.g., SOFR for US Dollars)." value={formData?.baseRate} onChange={(val) => updateFormData('baseRate', val)} />
            <InputField label="Base Rate Value" type="number" suffix="%" defaultValue="5.0" tooltip="The current percentage value of the selected benchmark rate." value={formData?.baseRateValue} onChange={(val) => updateFormData('baseRateValue', Number(val))} />
            <InputField label="Interest Margin/Spread" type="number" suffix="%" defaultValue="3.5" tooltip="The additional interest percentage added by the lender over the base rate." value={formData?.interestMarginSpread} onChange={(val) => updateFormData('interestMarginSpread', Number(val))} />
            <InputField label="All-in Interest Rate" type="number" suffix="%" defaultValue="8.5" calculated tooltip="The total effective interest rate (Base Rate + Margin)." value={formData?.allInInterestRate} onChange={(val) => updateFormData('allInInterestRate', Number(val))} />
            <InputField label="Loan Tenor" type="number" suffix="years" defaultValue="15" tooltip="The total duration of the loan from first drawdown to final repayment." value={formData?.loanTenor} onChange={(val) => updateFormData('loanTenor', Number(val))} />
          </div>
        </div>
      )}

      {/* Custom Debt Tranches Components */}
      {isStandardOrExpert && (
        <div className="pt-6 border-t border-border mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Custom Debt Tranches
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Add specific tranches (Senior, Mezzanine, Subordinated) to override the primary debt terms.</p>
            </div>
            <Button onClick={handleAddTranche} variant="outline" size="sm" className="gap-1.5 text-xs h-8" disabled={customDebtTranches.length >= 5}>
              <Plus className="w-3.5 h-3.5" />
              Add Tranche
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {customDebtTranches.map((item: any) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
                >
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTranche(item.id)} className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField label="Tranche Name" value={item.name} onChange={(val) => handleUpdateTranche(item.id, 'name', val)} size="sm" placeholder="e.g. Mezzanine Debt" />
                    <InputField label="Amount" type="number" prefix="$" value={item.amount} onChange={(val) => handleUpdateTranche(item.id, 'amount', Number(val))} size="sm" />
                    <InputField label="Interest Rate" type="number" suffix="%" value={item.interestRate} onChange={(val) => handleUpdateTranche(item.id, 'interestRate', Number(val))} size="sm" />
                    <InputField label="Tenor" type="number" suffix="years" value={item.tenor} onChange={(val) => handleUpdateTranche(item.id, 'tenor', Number(val))} size="sm" />
                    <InputField label="Grace Period" type="number" suffix="months" value={item.gracePeriod} onChange={(val) => handleUpdateTranche(item.id, 'gracePeriod', Number(val))} size="sm" />
                    <InputField label="Repayment Type" type="select" options={["Amortizing", "Bullet", "Sculpted"]} value={item.repaymentType} onChange={(val) => handleUpdateTranche(item.id, 'repaymentType', val)} size="sm" />
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
          <h4 className="text-sm font-semibold text-foreground mb-4">Advanced Debt Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Grace Period" type="number" suffix="months" defaultValue="36" tooltip="The moratorium period (in months) where only interest is paid before principal repayments begin." value={formData?.gracePeriod} onChange={(val) => updateFormData('gracePeriod', Number(val))} />
            <InputField label="Repayment Type" type="select" options={["Amortizing (Equal Installments)", "Bullet (Lump Sum)", "Sculpted (Custom Schedule)"]} defaultValue="Amortizing (Equal Installments)" tooltip="The structure for paying back the loan principal." value={formData?.repaymentType} onChange={(val) => updateFormData('repaymentType', val)} />
            <InputField label="DSRA Requirement" type="number" suffix="months" defaultValue="6" tooltip="Debt Service Reserve Account: The number of months of debt service required to be kept in reserve." value={formData?.dsraRequirement} onChange={(val) => updateFormData('dsraRequirement', Number(val))} />
            <InputField label="DSRA Funding Source" type="select" options={["Cash", "Letter of Credit", "Mixed"]} defaultValue="Cash" tooltip="The method used to fund the debt service reserve account." value={formData?.dsraFundingSource} onChange={(val) => updateFormData('dsraFundingSource', val)} />
            <InputField label="Upfront Fees" type="number" suffix="% of loan" defaultValue="2.0" tooltip="One-time transactional fees paid to lenders at the time of loan closing." value={formData?.upfrontFees} onChange={(val) => updateFormData('upfrontFees', Number(val))} />
            <InputField label="Commitment Fee" type="number" suffix="% p.a." defaultValue="0.5" tooltip="An annual fee charged on the undisbursed portion of the loan facility." value={formData?.commitmentFee} onChange={(val) => updateFormData('commitmentFee', Number(val))} />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Debt Drawdown Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Drawdown Linked To" type="select" options={["CAPEX Schedule", "Custom Schedule", "Equal Drawdowns"]} defaultValue="CAPEX Schedule" tooltip="Determines how loan funds are released (usually follows actual construction spending)." value={formData?.drawdownLinkedTo} onChange={(val) => updateFormData('drawdownLinkedTo', val)} />
              <InputField label="Drawdown Frequency" type="select" options={["Monthly", "Quarterly", "Milestone-based"]} defaultValue="Quarterly" tooltip="The frequency at which loan funds are disbursed from the lender." value={formData?.drawdownFrequency} onChange={(val) => updateFormData('drawdownFrequency', val)} />
            </div>
          </div>
        </motion.div>
      )}

      {isExpert && (
        <CustomParametersPanel 
          title="Custom Debt Parameters"
          parameters={formData.customParametersDebt || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersDebt || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersDebt', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersDebt || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersDebt', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersDebt || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersDebt', newParams);
          }}
        />
      )}
    </Card>
  )
}
