import React from "react"
import { Plus, X, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { motion, AnimatePresence } from "framer-motion"

export interface CustomParameter {
  id: string
  name: string
  value: string | number
  unit: string
  notes: string
}

export function CustomParametersPanel({
  parameters,
  onAdd,
  onUpdate,
  onRemove,
  title = "Custom Parameters"
}: {
  parameters: CustomParameter[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof CustomParameter, value: any) => void
  onRemove: (id: string) => void
  title?: string
}) {
  return (
    <div className="pt-6 border-t border-border mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">Add custom assumptions that aren't covered by standard fields</p>
        </div>
        <Button onClick={onAdd} variant="outline" size="sm" className="gap-1.5 text-xs h-8">
          <Plus className="w-3.5 h-3.5" />
          Add Parameter
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {parameters.map((param) => (
            <motion.div 
              key={param.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-secondary/30 border border-border rounded-lg relative group"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(param.id)}
                className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="md:col-span-1">
                  <InputField 
                    label="Parameter Name" 
                    value={param.name} 
                    onChange={(val) => onUpdate(param.id, 'name', val)}
                    size="sm"
                    placeholder="e.g. Special Tax Rate"
                  />
                </div>
                <div className="md:col-span-1">
                  <InputField 
                    label="Value" 
                    type="number"
                    value={param.value} 
                    onChange={(val) => onUpdate(param.id, 'value', Number(val))}
                    size="sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <InputField 
                    label="Unit" 
                    value={param.unit} 
                    onChange={(val) => onUpdate(param.id, 'unit', val)}
                    size="sm"
                    placeholder="e.g. %, $, days"
                  />
                </div>
                <div className="md:col-span-1">
                  <InputField 
                    label="Notes" 
                    value={param.notes} 
                    onChange={(val) => onUpdate(param.id, 'notes', val)}
                    size="sm"
                    placeholder="Optional context"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {parameters.length === 0 && (
          <div className="text-center py-6 bg-secondary/10 border border-dashed rounded-lg text-sm text-muted-foreground">
            No custom parameters added yet.
          </div>
        )}
      </div>
    </div>
  )
}
