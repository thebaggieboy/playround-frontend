import React from "react"
import { Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion, AnimatePresence } from "framer-motion"

export function DepreciationForm({
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

  const customAssetClasses = formData.customAssetClasses || []

  const handleAddCustomAssetClass = () => {
    if (customAssetClasses.length < 15) {
      const newItems = [...customAssetClasses, {
        id: Math.random().toString(36).substr(2, 9),
        name: "", method: "Straight Line", usefulLife: 10, residualValue: 0
      }]
      updateFormData('customAssetClasses', newItems)
    }
  }

  const handleUpdateCustomAssetClass = (id: string, field: string, value: any) => {
    const newItems = customAssetClasses.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('customAssetClasses', newItems)
  }

  const handleRemoveCustomAssetClass = (id: string) => {
    const newItems = customAssetClasses.filter((item: any) => item.id !== id)
    updateFormData('customAssetClasses', newItems)
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Depreciation & Amortization</h3>
        <p className="text-sm text-muted-foreground">Define asset depreciation policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Global Depreciation Method" type="select" options={["Straight Line", "Declining Balance", "Units of Production", "Sum of Years Digits"]} defaultValue="Straight Line" tooltip="The default accounting method used for assets not specified below." value={formData?.depreciationMethod} onChange={(val) => updateFormData('depreciationMethod', val)} />
        <InputField label="Overall Weighted Average Life" type="number" suffix="years" defaultValue="20" tooltip="The blended average useful life (in years) calculated across all tangible assets in the model." value={formData?.overallWeightedAverageLife} onChange={(val) => updateFormData('overallWeightedAverageLife', Number(val))} />
      </div>

      {isStandardOrExpert && (
        <div className="pt-6 border-t border-border mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Asset-Class Specific Depreciation Schedules
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Override the global method by defining specific asset classes and their unique schedules.</p>
            </div>
            <Button onClick={handleAddCustomAssetClass} variant="outline" size="sm" className="gap-1.5 text-xs h-8" disabled={customAssetClasses.length >= 15}>
              <Plus className="w-3.5 h-3.5" />
              Add Asset Class
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {customAssetClasses.map((item: any) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
                >
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomAssetClass(item.id)} className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                    <InputField label="Asset Class Name" value={item.name} onChange={(val) => handleUpdateCustomAssetClass(item.id, 'name', val)} size="sm" placeholder="e.g. Heavy Machinery" />
                    <InputField label="Depreciation Method" type="select" options={["Straight Line", "Declining Balance", "MACRS", "Units of Production"]} value={item.method} onChange={(val) => handleUpdateCustomAssetClass(item.id, 'method', val)} size="sm" />
                    <InputField label="Useful Life" type="number" suffix="years" value={item.usefulLife} onChange={(val) => handleUpdateCustomAssetClass(item.id, 'usefulLife', Number(val))} size="sm" />
                    <InputField label="Residual Value" type="number" suffix="%" value={item.residualValue} onChange={(val) => handleUpdateCustomAssetClass(item.id, 'residualValue', Number(val))} size="sm" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {customAssetClasses.length === 0 && (
              <div className="text-center py-6 bg-secondary/10 border border-dashed rounded-lg text-sm text-muted-foreground">
                No specific asset classes defined. The global method will be applied.
              </div>
            )}
          </div>
        </div>
      )}

      {isExpert && (
        <CustomParametersPanel 
          title="Custom Depreciation Parameters"
          parameters={formData.customParametersDepreciation || []}
          onAdd={() => {
            const newParams = [...(formData.customParametersDepreciation || []), {
              id: Math.random().toString(36).substr(2, 9),
              name: "", value: 0, unit: "", notes: ""
            }];
            updateFormData('customParametersDepreciation', newParams);
          }}
          onUpdate={(id, field, value) => {
            const newParams = (formData.customParametersDepreciation || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
            updateFormData('customParametersDepreciation', newParams);
          }}
          onRemove={(id) => {
            const newParams = (formData.customParametersDepreciation || []).filter((p: any) => p.id !== id);
            updateFormData('customParametersDepreciation', newParams);
          }}
        />
      )}
    </Card>
  )
}
