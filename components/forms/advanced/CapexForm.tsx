import React from "react"
import { Building, Plus, X, PieChart, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion, AnimatePresence } from "framer-motion"

export function CapexForm({
  formData,
  updateFormData,
  projectType,
  industrySector,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  projectType: string
  industrySector: string
  inputMode: "essential" | "standard" | "expert"
}) {
  const isExpert = inputMode === "expert"
  const isStandardOrExpert = inputMode !== "essential"

  const customCapexItems = formData.customCapexItems || []

  const handleAddCustomCapex = () => {
    if (customCapexItems.length < 25) {
      const newItems = [...customCapexItems, {
        id: Math.random().toString(36).substr(2, 9),
        name: "", category: "Equipment", amount: 0, usefulLife: 10, residualValue: 0
      }]
      updateFormData('customCapexItems', newItems)
    }
  }

  const handleUpdateCustomCapex = (id: string, field: string, value: any) => {
    const newItems = customCapexItems.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customCapexItems', newItems)
  }

  const handleRemoveCustomCapex = (id: string) => {
    const newItems = customCapexItems.filter((item: any) => item.id !== id)
    updateFormData('customCapexItems', newItems)
  }

  // Calculate Hard Costs
  let hardCosts = 0
  hardCosts += Number(formData.landValue || 13711180)
  hardCosts += Number(formData.buildingCivilWorks || 109626400)
  hardCosts += Number(formData.plantMachineryEquipment || 20554950)
  hardCosts += Number(formData.ffeFurnitureFixtures || 6851650)
  hardCosts += Number(formData.vehiclesItEquipment || 1000000)
  
  customCapexItems.forEach((item: any) => {
    if (item.category === "Construction" || item.category === "Equipment" || item.category === "Land") {
      hardCosts += Number(item.amount || 0)
    }
  })

  // Calculate Soft Costs
  let softCosts = 0
  softCosts += Number(formData.projectContingency || 13711180)
  softCosts += Number(formData.preOperatingExpenses || 6851650)
  
  customCapexItems.forEach((item: any) => {
    if (item.category === "Soft Costs" || item.category === "Other") {
      softCosts += Number(item.amount || 0)
    }
  })

  const totalCapexExclFinancing = hardCosts + softCosts
  const capacity = Number(formData.projectCapacity || 1)
  const costPerUnit = capacity > 0 ? totalCapexExclFinancing / capacity : 0

  // Drawdown validation
  const ddY1 = Number(formData.drawdownYear1 || 60)
  const ddY2 = Number(formData.drawdownYear2 || 30)
  const ddY3 = Number(formData.drawdownYear3 || 10)
  const ddY4 = Number(formData.drawdownYear4 || 0)
  const ddY5 = Number(formData.drawdownYear5 || 0)
  const totalDrawdown = ddY1 + ddY2 + ddY3 + ddY4 + ddY5
  const drawdownValid = Math.abs(totalDrawdown - 100) < 0.01

  // Funding gap validation
  const equityPct = Number(formData.equityPercentage || 30)
  const debtPct = Number(formData.debtPercentage || 70)
  const grantPct = Number(formData.grantPercentage || 0)
  const totalFunding = equityPct + debtPct + grantPct
  const fundingGap = 100 - totalFunding

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Capital Expenditure (CapEx)</h3>
          <p className="text-sm text-muted-foreground">Define core assets and development costs</p>
        </div>
        
        {/* Funding Gap Banner */}
        <div className={`px-4 py-3 rounded-lg text-left sm:text-right w-full sm:w-auto border ${Math.abs(fundingGap) > 0.1 ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'}`}>
          <div className="flex items-center gap-2 justify-start sm:justify-end mb-1">
            {Math.abs(fundingGap) > 0.1 ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            <p className={`text-xs font-medium uppercase tracking-wider ${Math.abs(fundingGap) > 0.1 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              Funding Status
            </p>
          </div>
          {Math.abs(fundingGap) > 0.1 ? (
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Gap: {fundingGap.toFixed(1)}%</p>
          ) : (
            <p className="text-sm font-bold text-green-600 dark:text-green-400">Fully Funded</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5">Eq: {equityPct}% | Db: {debtPct}% | Gr: {grantPct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Land Value" type="number" prefix="$" defaultValue="13711180" tooltip="The total value of land required for the project." value={formData?.landValue} onChange={(val) => updateFormData('landValue', Number(val))} />
        <InputField label="Building & Civil Works" type="number" prefix="$" defaultValue="109626400" tooltip="Costs associated with constructing buildings, foundations, and site improvements." value={formData?.buildingCivilWorks} onChange={(val) => updateFormData('buildingCivilWorks', Number(val))} />
        <InputField label="Plant, Machinery & Equipment" type="number" prefix="$" defaultValue="20554950" tooltip="The cost of purchasing and installing primary operational machinery." value={formData?.plantMachineryEquipment} onChange={(val) => updateFormData('plantMachineryEquipment', Number(val))} />
        <InputField label="Furniture, Fixtures & Equipment (FF&E)" type="number" prefix="$" defaultValue="6851650" tooltip="Costs for office furniture, interior fixtures, and general equipment." value={formData?.ffeFurnitureFixtures} onChange={(val) => updateFormData('ffeFurnitureFixtures', Number(val))} />
        {isStandardOrExpert && (
          <>
            <InputField label="Vehicles & IT Equipment" type="number" prefix="$" defaultValue="1000000" tooltip="Vehicles, computers, servers, and software." value={formData?.vehiclesItEquipment} onChange={(val) => updateFormData('vehiclesItEquipment', Number(val))} />
            <InputField label="Project Contingency" type="number" prefix="$" defaultValue="13711180" tooltip="A reserve fund for unexpected costs or overruns." value={formData?.projectContingency} onChange={(val) => updateFormData('projectContingency', Number(val))} />
            <InputField label="Pre-Operating Expenses" type="number" prefix="$" defaultValue="6851650" tooltip="Expenses incurred before the project begins generating revenue (e.g., training, marketing)." value={formData?.preOperatingExpenses} onChange={(val) => updateFormData('preOperatingExpenses', Number(val))} />
            <InputField label="Initial Working Capital" type="number" prefix="$" defaultValue="5000000" tooltip="Funds required to cover day-to-day operations until the business becomes self-sustaining." value={formData?.initialWorkingCapital} onChange={(val) => updateFormData('initialWorkingCapital', Number(val))} />
          </>
        )}
      </div>

      {/* Custom CAPEX Components */}
      <div className="pt-6 border-t border-border mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Custom CapEx Components
            </h4>
            <p className="text-xs text-muted-foreground mt-1">Add specific capital expenditures not covered above</p>
          </div>
          <Button onClick={handleAddCustomCapex} variant="outline" size="sm" className="gap-1.5 text-xs h-8" disabled={customCapexItems.length >= 25}>
            <Plus className="w-3.5 h-3.5" />
            Add Component
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {customCapexItems.map((item: any) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
              >
                <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomCapex(item.id)} className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <X className="w-3.5 h-3.5" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <InputField label="Component Name" value={item.name} onChange={(val) => handleUpdateCustomCapex(item.id, 'name', val)} size="sm" />
                  <InputField label="Category" type="select" options={["Land", "Construction", "Equipment", "Soft Costs", "Other"]} value={item.category} onChange={(val) => handleUpdateCustomCapex(item.id, 'category', val)} size="sm" />
                  <InputField label="Amount" type="number" prefix="$" value={item.amount} onChange={(val) => handleUpdateCustomCapex(item.id, 'amount', Number(val))} size="sm" />
                  <div className="hidden md:block"></div>
                  
                  {isStandardOrExpert && (
                    <>
                      <InputField label="Useful Life" type="number" suffix="years" value={item.usefulLife} onChange={(val) => handleUpdateCustomCapex(item.id, 'usefulLife', Number(val))} size="sm" />
                      <InputField label="Residual Value" type="number" suffix="%" value={item.residualValue} onChange={(val) => handleUpdateCustomCapex(item.id, 'residualValue', Number(val))} size="sm" />
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {customCapexItems.length === 0 && (
            <div className="text-center py-6 bg-secondary/10 border border-dashed rounded-lg text-sm text-muted-foreground">
              No custom CapEx components added yet.
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Construction & Drawdown Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <InputField label="Year 1" type="number" suffix="%" defaultValue="60" value={formData?.drawdownYear1} onChange={(val) => updateFormData('drawdownYear1', Number(val))} error={!drawdownValid ? "Invalid total" : undefined} />
          <InputField label="Year 2" type="number" suffix="%" defaultValue="30" value={formData?.drawdownYear2} onChange={(val) => updateFormData('drawdownYear2', Number(val))} error={!drawdownValid ? "Invalid total" : undefined} />
          <InputField label="Year 3" type="number" suffix="%" defaultValue="10" value={formData?.drawdownYear3} onChange={(val) => updateFormData('drawdownYear3', Number(val))} error={!drawdownValid ? "Invalid total" : undefined} />
          {isStandardOrExpert && (
            <>
              <InputField label="Year 4" type="number" suffix="%" defaultValue="0" value={formData?.drawdownYear4} onChange={(val) => updateFormData('drawdownYear4', Number(val))} error={!drawdownValid ? "Invalid total" : undefined} />
              <InputField label="Year 5" type="number" suffix="%" defaultValue="0" value={formData?.drawdownYear5} onChange={(val) => updateFormData('drawdownYear5', Number(val))} error={!drawdownValid ? "Invalid total" : undefined} />
            </>
          )}
        </div>
        {!drawdownValid && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Drawdown schedule must sum to exactly 100%. Current sum: {totalDrawdown.toFixed(1)}%.
          </p>
        )}
      </div>

      {/* Live CAPEX Summary Panel */}
      <div className="pt-6 border-t border-border mt-6">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-primary" />
          CapEx Summary & Outputs
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Hard Costs (Direct Capex)</span>
              <span className="text-sm font-medium">${hardCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Soft Costs (Contingency, Pre-Ops, etc.)</span>
              <span className="text-sm font-medium">${softCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border bg-secondary/20 -mx-2 px-2 rounded">
              <span className="text-sm font-semibold text-foreground">Total CapEx (Excl. Financing)</span>
              <span className="text-sm font-bold text-primary">${totalCapexExclFinancing.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Estimated Capitalized Interest</span>
              <span className="text-sm font-medium italic text-muted-foreground">Calculated in engine</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-4">
              <span className="text-sm font-semibold text-foreground">Est. Cost Per Unit Capacity</span>
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                ${costPerUnit.toLocaleString(undefined, { maximumFractionDigits: 0 })} / unit
              </span>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg flex flex-col justify-center items-center">
             <div className="w-32 h-32 rounded-full mb-4 relative" style={{
                background: `conic-gradient(
                  hsl(var(--primary)) 0% ${(hardCosts/totalCapexExclFinancing)*100}%,
                  hsl(var(--chart-2)) ${(hardCosts/totalCapexExclFinancing)*100}% 100%
                )`
             }}>
                <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">TOTAL</span>
                </div>
             </div>
             <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
                   <span>Hard Costs</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-sm bg-chart-2"></div>
                   <span>Soft Costs</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {isExpert && (
        <CustomParametersPanel 
          title="Custom General Parameters"
          parameters={formData.customParametersCapex || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersCapex || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersCapex', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersCapex || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersCapex', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersCapex || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersCapex', newParams);
          }}
        />
      )}
    </Card>
  )
}
