import React, { useEffect } from "react"
import { Users, Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion } from "framer-motion"
import { getOpexTemplate } from "./IndustryConfig"

export function OpexForm({
  formData,
  updateFormData,
  projectType,
  industrySector,
  industrySubType,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  projectType: string
  industrySector: string
  industrySubType: string
  inputMode: "essential" | "standard" | "expert"
}) {
  const isExpert = inputMode === "expert"
  const isStandardOrExpert = inputMode !== "essential"

  const customOpexItems = formData.customOpexItems || []
  
  const handleAddCustomOpex = () => {
    const newItems = [...customOpexItems, {
      id: Math.random().toString(36).substr(2, 9),
      name: "", type: "fixed_usd", value: 0, escalation: 2.5
    }]
    updateFormData('customOpexItems', newItems)
  }

  const handleUpdateCustomOpex = (id: string, field: string, value: any) => {
    const newItems = customOpexItems.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customOpexItems', newItems)
  }

  const handleRemoveCustomOpex = (id: string) => {
    const newItems = customOpexItems.filter((item: any) => item.id !== id)
    updateFormData('customOpexItems', newItems)
  }

  const templateItems = getOpexTemplate(industrySector, industrySubType)
  
  useEffect(() => {
    templateItems.forEach(item => {
      const fieldName = `templateOpex_${item.name.replace(/\s+/g, '')}`
      if (formData[fieldName] === undefined) {
        updateFormData(fieldName, item.defaultValue)
      }
    })
  }, [industrySector, industrySubType])

  let totalOpexEstimation = 0
  
  const staffCost = (formData.totalHeadcount || 250) * (formData.averageAnnualSalary || 45000) * (1 + (formData.benefitsPayrollTax || 25) / 100)
  totalOpexEstimation += staffCost
  
  totalOpexEstimation += (formData.powerElectricityCost || 300000)
  totalOpexEstimation += (formData.waterGasUtilities || 100000)
  
  customOpexItems.forEach((item: any) => {
    if (item.type.includes('fixed')) {
      totalOpexEstimation += Number(item.value || 0)
    }
  })
  
  templateItems.forEach(item => {
    if (item.type.includes('fixed')) {
      const fieldName = `templateOpex_${item.name.replace(/\s+/g, '')}`
      totalOpexEstimation += Number(formData[fieldName] || 0)
    }
  })
  
  totalOpexEstimation += (formData.insuranceAnnual || 200000)
  totalOpexEstimation += (formData.administrativeExpenses || 150000)
  totalOpexEstimation += (formData.rentFacilities || 120000)
  totalOpexEstimation += (formData.technologySoftware || 50000)
  totalOpexEstimation += (formData.professionalFees || 75000)

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Operating Expenses (OpEx)</h3>
          <p className="text-sm text-muted-foreground">Define operational costs and expense assumptions</p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 px-4 py-3 rounded-lg text-left sm:text-right w-full sm:w-auto">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Est. Fixed OpEx (Year 1)</p>
          <p className="text-xl font-bold text-foreground">${totalOpexEstimation.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">+ variable costs</p>
        </div>
      </div>

      {templateItems.length > 0 && (
        <div className="pt-0 border-t border-border mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-4 mt-6">Industry-Specific Costs ({industrySubType || industrySector})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templateItems.map((item, idx) => {
              const fieldName = `templateOpex_${item.name.replace(/\s+/g, '')}`
              return (
                <InputField
                  key={idx}
                  label={item.name}
                  type="number"
                  prefix={item.type.includes('fixed') ? "$" : undefined}
                  suffix={item.type === 'pct_revenue' ? "% of revenue" : undefined}
                  defaultValue={item.defaultValue}
                  value={formData[fieldName]}
                  onChange={(val) => updateFormData(fieldName, Number(val))}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className={templateItems.length > 0 ? "pt-6 border-t border-border" : "pt-0 border-t border-border mt-6"}>
        <h4 className="text-sm font-semibold text-foreground mb-4 mt-6">Labor & Personnel Costs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Total Headcount" type="number" defaultValue="250"
            tooltip="The total number of full-time equivalent (FTE) employees."
            value={formData?.totalHeadcount}
            onChange={(val) => updateFormData('totalHeadcount', Number(val))}
          />
          <InputField label="Average Annual Salary" type="number" prefix="$" defaultValue="45000"
            value={formData?.averageAnnualSalary}
            onChange={(val) => updateFormData('averageAnnualSalary', Number(val))}
          />
          {isStandardOrExpert && (
            <>
              <InputField label="Salary Escalation Rate" type="number" suffix="%" defaultValue="5.0"
                value={formData?.salaryEscalationRate}
                onChange={(val) => updateFormData('salaryEscalationRate', Number(val))}
              />
              <InputField label="Benefits & Payroll Tax" type="number" suffix="% of salary" defaultValue="25"
                value={formData?.benefitsPayrollTax}
                onChange={(val) => updateFormData('benefitsPayrollTax', Number(val))}
              />
            </>
          )}
          <InputField
            label="Total Annual Staff Cost"
            type="number"
            prefix="$"
            defaultValue={14062500}
            calculated
            value={staffCost}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Utilities & Facilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Power/Electricity Cost" type="number" prefix="$" suffix="/year" defaultValue="300000"
            value={formData?.powerElectricityCost}
            onChange={(val) => updateFormData('powerElectricityCost', Number(val))}
          />
          <InputField label="Water & Gas Utilities" type="number" prefix="$" suffix="/year" defaultValue="100000"
            value={formData?.waterGasUtilities}
            onChange={(val) => updateFormData('waterGasUtilities', Number(val))}
          />
          {isStandardOrExpert && (
            <InputField label="Utilities Escalation Rate" type="number" suffix="%" defaultValue="4.0"
              value={formData?.utilitiesEscalationRate}
              onChange={(val) => updateFormData('utilitiesEscalationRate', Number(val))}
            />
          )}
        </div>
      </div>

      {isStandardOrExpert && (
        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">Maintenance & Insurance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Regular Maintenance" type="number" suffix="% of revenue" defaultValue="2.5"
              value={formData?.regularMaintenance}
              onChange={(val) => updateFormData('regularMaintenance', Number(val))}
            />
            <InputField label="Insurance (Annual)" type="number" prefix="$" defaultValue="200000"
              value={formData?.insuranceAnnual}
              onChange={(val) => updateFormData('insuranceAnnual', Number(val))}
            />
            {(projectType === "manufacturing" || projectType === "energy" || industrySector === "Oil & Gas") && (
              <>
                <InputField label="Turn Around Maintenance (TAM) Cost" type="number" prefix="$" defaultValue="2000000"
                  tooltip="The lump-sum cost of a scheduled, large-scale plant shutdown for overhaul and inspections."
                  value={formData?.turnAroundMaintenanceTamCost}
                  onChange={(val) => updateFormData('turnAroundMaintenanceTamCost', Number(val))}
                />
                <InputField label="TAM Frequency" type="number" suffix="years" defaultValue="5"
                  tooltip="Years between major maintenance"
                  value={formData?.tamFrequency}
                  onChange={(val) => updateFormData('tamFrequency', Number(val))}
                />
              </>
            )}
          </div>
        </div>
      )}

      {isStandardOrExpert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Administrative & General</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Marketing & Sales" type="number" suffix="% of revenue" defaultValue="8.0"
              value={formData?.marketingSales}
              onChange={(val) => updateFormData('marketingSales', Number(val))}
            />
            <InputField label="Administrative Expenses" type="number" prefix="$" suffix="/year" defaultValue="150000"
              value={formData?.administrativeExpenses}
              onChange={(val) => updateFormData('administrativeExpenses', Number(val))}
            />
            <InputField label="Rent & Facilities" type="number" prefix="$" suffix="/year" defaultValue="120000"
              value={formData?.rentFacilities}
              onChange={(val) => updateFormData('rentFacilities', Number(val))}
            />
            <InputField label="Technology & Software" type="number" prefix="$" suffix="/year" defaultValue="50000"
              value={formData?.technologySoftware}
              onChange={(val) => updateFormData('technologySoftware', Number(val))}
            />
            <InputField label="Professional Fees" type="number" prefix="$" suffix="/year" defaultValue="75000"
              tooltip="Legal, accounting, consulting"
              value={formData?.professionalFees}
              onChange={(val) => updateFormData('professionalFees', Number(val))}
            />
          </div>
        </motion.div>
      )}

      <div className="pt-6 border-t border-border mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Custom OpEx Items
            </h4>
            <p className="text-xs text-muted-foreground mt-1">Add custom operational expenses specific to your project</p>
          </div>
          <Button onClick={handleAddCustomOpex} variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {customOpexItems.map((item: any) => (
            <div key={item.id} className="p-4 bg-secondary/30 border border-border rounded-lg relative group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCustomOpex(item.id)}
                className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <InputField 
                  label="Expense Name" 
                  value={item.name} 
                  onChange={(val) => handleUpdateCustomOpex(item.id, 'name', val)}
                  size="sm"
                />
                <InputField 
                  label="Type" 
                  type="select"
                  options={["fixed_usd", "fixed_local", "pct_revenue"]}
                  value={item.type} 
                  onChange={(val) => handleUpdateCustomOpex(item.id, 'type', val)}
                  size="sm"
                />
                <InputField 
                  label="Value" 
                  type="number"
                  prefix={item.type.includes('fixed') ? "$" : undefined}
                  suffix={item.type === 'pct_revenue' ? "%" : undefined}
                  value={item.value} 
                  onChange={(val) => handleUpdateCustomOpex(item.id, 'value', Number(val))}
                  size="sm"
                />
                <InputField 
                  label="Escalation Rate" 
                  type="number"
                  suffix="%"
                  value={item.escalation} 
                  onChange={(val) => handleUpdateCustomOpex(item.id, 'escalation', Number(val))}
                  size="sm"
                />
              </div>
            </div>
          ))}
          {customOpexItems.length === 0 && (
            <div className="text-center py-6 bg-secondary/10 border border-dashed rounded-lg text-sm text-muted-foreground">
              No custom OpEx items added yet.
            </div>
          )}
        </div>
      </div>

      {isExpert && (
        <CustomParametersPanel 
          title="Custom General Parameters"
          parameters={formData.customParametersOpex || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersOpex || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersOpex', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersOpex || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersOpex', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersOpex || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersOpex', newParams);
          }}
        />
      )}
    </Card>
  )
}
