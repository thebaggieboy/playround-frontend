"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { Loader2, Settings2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

export function QuickEditPanel({ model, scenarioId }: { model: any, scenarioId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [scenId, setScenId] = useState<string | null>(null)
  
  // A few quick inputs to edit
  const [discountRate, setDiscountRate] = useState<number>(10.0)
  const [taxRate, setTaxRate] = useState<number>(20.0)
  const [exitMultiple, setExitMultiple] = useState<number>(5.0)

  const token = useSelector(selectToken)
  const { toast } = useToast()

  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && (token as any).access) return (token as any).access;
    return '';
  }

  useEffect(() => {
    // Determine the scenario to edit. Default to Base Case or the first active one.
    if (!isOpen) return
    
    let activeScen = null
    if (scenarioId) {
        activeScen = model.scenarios?.find((s: any) => s.id.toString() === scenarioId)
    }
    if (!activeScen && model.scenarios?.length > 0) {
        activeScen = model.scenarios[0]
    }
    
    if (activeScen) {
        setScenId(activeScen.id.toString())
        // Normally, we'd GET the full scenario details to pre-fill the form.
        // For quick edit, let's fetch the full detail.
        fetchScenarioDetails(activeScen.id)
    }
  }, [isOpen, model, scenarioId])

  const fetchScenarioDetails = async (id: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/scenarios/${id}/`, {
            headers: { 'Authorization': `JWT ${getAuthToken()}` }
        })
        if (res.ok) {
            const data = await res.json()
            if (data.macro_assumptions?.discount_rate_pct !== undefined) {
                setDiscountRate(data.macro_assumptions.discount_rate_pct)
            }
            if (data.tax_assumptions?.corporate_tax_rate_pct !== undefined) {
                setTaxRate(data.tax_assumptions.corporate_tax_rate_pct)
            }
            if (data.exit_valuation?.ebitda_multiple !== undefined) {
                setExitMultiple(data.exit_valuation.ebitda_multiple)
            }
        }
    } catch (e) {
        console.error("Failed to fetch scenario details for quick edit", e)
    }
  }

  const handleSave = async () => {
    if (!scenId) return

    try {
      setIsSaving(true)
      
      // We will perform a partial patch if the API supports it, otherwise a full patch.
      // Since our API endpoint accepts nested dicts for patches:
      const payload = {
          macro_assumptions: { discount_rate_pct: discountRate },
          tax_assumptions: { corporate_tax_rate_pct: taxRate },
          exit_valuation: { ebitda_multiple: exitMultiple }
      }
      
      const res = await fetch(`${API_BASE_URL}/scenarios/${scenId}/`, {
        method: "PATCH",
        headers: { 
            "Authorization": `JWT ${getAuthToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error("Failed to save quick edits")
      
      toast({ title: "Quick Edits Saved!", description: "Inputs updated successfully. Please run calculation." })
      setIsOpen(false)
      // We don't automatically trigger calculation here, but we could!
      
    } catch (err: any) {
      toast({ title: "Save Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="lg" className="w-full lg:w-auto gap-2">
          <Settings2 className="w-4 h-4" />
          Quick Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full sm:max-w-md w-full border-l border-border bg-card">
        <SheetHeader>
          <SheetTitle className="text-xl">Quick Adjustments</SheetTitle>
          <SheetDescription>
            Tweak the core assumptions of the Base Case scenario without leaving the results view.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6 space-y-8">
            <div className="space-y-4 bg-secondary/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm flex items-center gap-2">Macro Assumptions</h4>
                <div className="grid gap-2">
                    <Label htmlFor="dr">Discount Rate (%)</Label>
                    <Input 
                        id="dr" 
                        type="number" 
                        value={discountRate} 
                        onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)} 
                    />
                </div>
            </div>

            <div className="space-y-4 bg-secondary/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm flex items-center gap-2">Tax Assumptions</h4>
                <div className="grid gap-2">
                    <Label htmlFor="tr">Corporate Tax Rate (%)</Label>
                    <Input 
                        id="tr" 
                        type="number" 
                        value={taxRate} 
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
                    />
                </div>
            </div>

            <div className="space-y-4 bg-secondary/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm flex items-center gap-2">Exit Valuation</h4>
                <div className="grid gap-2">
                    <Label htmlFor="em">EBITDA Multiple (x)</Label>
                    <Input 
                        id="em" 
                        type="number" 
                        value={exitMultiple} 
                        onChange={(e) => setExitMultiple(parseFloat(e.target.value) || 0)} 
                    />
                </div>
            </div>
        </div>
        
        <SheetFooter className="mt-auto border-t border-border pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
