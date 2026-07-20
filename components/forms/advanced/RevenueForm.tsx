import React, { useState } from "react"
import { DollarSign, Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { CustomParametersPanel } from "./CustomParametersPanel"
import { motion } from "framer-motion"
import { REVENUE_MODEL_TYPES, CAPACITY_UNIT_MAPPINGS } from "./IndustryConfig"

export function RevenueForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  industrySector,
  inputMode
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: string
  industrySector: string
  inputMode: "essential" | "standard" | "expert"
}) {
  const [numProducts, setNumProducts] = useState(formData.revenueProducts?.length || 1)
  const isExpert = inputMode === "expert"
  const isStandardOrExpert = inputMode !== "essential"

  const handleAddProduct = () => {
    if (numProducts < 20) {
      setNumProducts(n => n + 1)
      addRevenueProduct()
    }
  }

  const handleRemoveProduct = (idx: number) => {
    if (numProducts > 1) {
      setNumProducts(n => n - 1)
      removeRevenueProduct(idx)
    }
  }
  
  const getUnitOptions = () => {
    if (CAPACITY_UNIT_MAPPINGS[industrySector]) {
      return CAPACITY_UNIT_MAPPINGS[industrySector]
    }
    return CAPACITY_UNIT_MAPPINGS["Other"]
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Assumptions</h3>
        <p className="text-sm text-muted-foreground">Configure revenue streams and growth assumptions</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium">Number of Revenue Streams/Products</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRemoveProduct(numProducts - 1)}
            disabled={numProducts <= 1}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          <span className="text-lg font-bold w-8 text-center">{numProducts}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddProduct}
            disabled={numProducts >= 20}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {formData.revenueProducts?.map((product: any, idx: number) => {
        const revModelType = product.revenueModelType || "Volume × Price"
        return (
          <div key={idx} className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">
                {projectType === "real_estate" ? `Property Type ${idx + 1}` :
                  projectType === "manufacturing" ? `Product ${idx + 1}` :
                    (projectType === "energy" || projectType === "oil_gas") ? `Revenue Stream ${idx + 1}` :
                      `Revenue Stream ${idx + 1}`}
              </h4>
              {idx > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveProduct(idx)}
                  className="text-red-600 hover:text-red-700 h-8 px-2"
                >
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={projectType === "real_estate" ? "Building/Unit Type" : "Product/Service Name"}
                type="text"
                tooltip="The specific name or category of the revenue-generating asset or product."
                value={product.productName}
                onChange={(value) => updateRevenueProduct(idx, 'productName', value)}
                placeholder={
                  projectType === "real_estate" ? "e.g., 4-Bedroom Apartment" :
                    projectType === "manufacturing" ? "e.g., Gasoline, Diesel, Urea" :
                      projectType === "energy" ? "e.g., Energy Sales, Capacity Payments" :
                        "e.g., Product A"
                }
              />
              
              <InputField
                label="Revenue Model Type"
                type="select"
                options={REVENUE_MODEL_TYPES}
                value={revModelType}
                onChange={(value) => updateRevenueProduct(idx, 'revenueModelType', value)}
              />

              <InputField
                label="Unit of Measure"
                type="select"
                tooltip="The standard unit used to quantify sales."
                value={product.unitOfMeasure}
                onChange={(value) => updateRevenueProduct(idx, 'unitOfMeasure', value)}
                options={getUnitOptions()}
              />
              
              {isExpert && (
                <InputField
                  label="Currency"
                  type="select"
                  options={["USD ($)", "NGN (₦)", "EUR (€)", "GBP (£)"]}
                  value={product.currency || "USD ($)"}
                  onChange={(value) => updateRevenueProduct(idx, 'currency', value)}
                />
              )}

              {revModelType === "Volume × Price" && (
                <>
                  <InputField label="Year 1 Sales Volume" type="number" onChange={(value) => updateRevenueProduct(idx, 'year1SalesVolume', Number(value))} defaultValue="500000" value={product.year1SalesVolume} />
                  <InputField label="Unit Price (Year 1)" type="number" prefix="$" onChange={(value) => updateRevenueProduct(idx, 'unitPriceYear1', Number(value))} defaultValue="120" value={product.unitPriceYear1} />
                  {isStandardOrExpert && (
                    <>
                      <InputField label="Volume Growth Rate" type="number" suffix="%" onChange={(value) => updateRevenueProduct(idx, 'volumeGrowthRate', Number(value))} defaultValue="5.0" value={product.volumeGrowthRate} />
                      <InputField label="Price Escalation Rate" type="number" suffix="%" onChange={(value) => updateRevenueProduct(idx, 'priceEscalationRate', Number(value))} defaultValue="2.5" value={product.priceEscalationRate} />
                    </>
                  )}
                </>
              )}

              {revModelType === "Capacity × Tariff" && (
                <>
                  <InputField label="Capacity Factor" type="number" suffix="%" onChange={(value) => updateRevenueProduct(idx, 'capacityFactor', Number(value))} defaultValue="85" value={product.capacityFactor} />
                  <InputField label="Tariff Rate" type="number" prefix="$" onChange={(value) => updateRevenueProduct(idx, 'tariffRate', Number(value))} defaultValue="0.10" value={product.tariffRate} />
                  {isStandardOrExpert && (
                    <>
                      <InputField label="Take-or-Pay Minimum" type="number" suffix="%" onChange={(value) => updateRevenueProduct(idx, 'takeOrPayPct', Number(value))} defaultValue="80" value={product.takeOrPayPct} />
                      <InputField label="Tariff Escalation" type="number" suffix="%" onChange={(value) => updateRevenueProduct(idx, 'tariffEscalation', Number(value))} defaultValue="2.0" value={product.tariffEscalation} />
                    </>
                  )}
                </>
              )}

              {revModelType === "Subscription/SaaS" && (
                <>
                  <InputField label="Initial Customers" type="number" onChange={(value) => updateRevenueProduct(idx, 'initialCustomers', Number(value))} defaultValue="1000" value={product.initialCustomers} />
                  <InputField label="ARPU (Monthly)" type="number" prefix="$" onChange={(value) => updateRevenueProduct(idx, 'arpuMonthly', Number(value))} defaultValue="50" value={product.arpuMonthly} />
                  {isStandardOrExpert && (
                    <>
                      <InputField label="Customer Growth Rate" type="number" suffix="%/month" onChange={(value) => updateRevenueProduct(idx, 'customerGrowthRate', Number(value))} defaultValue="5.0" value={product.customerGrowthRate} />
                      <InputField label="Churn Rate" type="number" suffix="%/month" onChange={(value) => updateRevenueProduct(idx, 'churnRate', Number(value))} defaultValue="2.0" value={product.churnRate} />
                    </>
                  )}
                </>
              )}

              {revModelType === "Rental/Lease" && (
                <>
                  <InputField label="Number of Units" type="number" defaultValue="18" onChange={(val) => updateRevenueProduct(idx, 'numberOfUnits', Number(val))} value={product.numberOfUnits || formData.numberOfUnits} />
                  <InputField label="Rent per Unit/Area" type="number" prefix="$" defaultValue="2500" onChange={(val) => updateRevenueProduct(idx, 'rentPerUnit', Number(val))} value={product.rentPerUnit} />
                  {isStandardOrExpert && (
                    <>
                      <InputField label="Occupancy Rate" type="number" suffix="%" defaultValue="85" onChange={(val) => updateRevenueProduct(idx, 'occupancyRate', Number(val))} value={product.occupancyRate} />
                      <InputField label="Lease Escalation Rate" type="number" suffix="%" defaultValue="5.0" onChange={(val) => updateRevenueProduct(idx, 'leaseEscalation', Number(val))} value={product.leaseEscalation} />
                    </>
                  )}
                </>
              )}

              {revModelType === "Fixed Contract" && (
                <>
                  <InputField label="Annual Contract Value" type="number" prefix="$" defaultValue="1000000" onChange={(val) => updateRevenueProduct(idx, 'contractValue', Number(val))} value={product.contractValue} />
                  <InputField label="Contract Duration" type="number" suffix="years" defaultValue="5" onChange={(val) => updateRevenueProduct(idx, 'contractDuration', Number(val))} value={product.contractDuration} />
                </>
              )}
            </div>
            
            {(formData?.industrySector === "Real Estate" || projectType === "real_estate") && revModelType !== "Rental/Lease" && isStandardOrExpert && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <InputField label="GBA (Gross Building Area)" type="number" suffix="sq.m" defaultValue="456"
                  value={product.gbaGrossBuildingArea || formData?.gbaGrossBuildingArea}
                  onChange={(val) => updateRevenueProduct(idx, 'gbaGrossBuildingArea', Number(val))}
                />
                <InputField label="Lettable Area" type="number" suffix="sq.m" defaultValue="387.6" calculated
                  value={product.lettableArea || formData?.lettableArea}
                  onChange={(val) => updateRevenueProduct(idx, 'lettableArea', Number(val))}
                />
              </div>
            )}
            
            {isExpert && (
              <CustomParametersPanel 
                title={`Custom Parameters - ${product.productName || 'Product'}`}
                parameters={product.customParameters || []}
                onAdd={() => {
                  const newParams = [...(product.customParameters || []), {
                    id: Math.random().toString(36).substr(2, 9),
                    name: "", value: 0, unit: "", notes: ""
                  }];
                  updateRevenueProduct(idx, 'customParameters', newParams);
                }}
                onUpdate={(id, field, value) => {
                  const newParams = (product.customParameters || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p);
                  updateRevenueProduct(idx, 'customParameters', newParams);
                }}
                onRemove={(id) => {
                  const newParams = (product.customParameters || []).filter((p: any) => p.id !== id);
                  updateRevenueProduct(idx, 'customParameters', newParams);
                }}
              />
            )}
          </div>
        )
      })}

      {isStandardOrExpert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Advanced Revenue Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Receivables Days (DSO)"
              type="number"
              suffix="days"
              defaultValue="45"
              value={formData?.receivablesDaysDso}
              onChange={(val) => updateFormData('receivablesDaysDso', Number(val))}
            />
            {projectType !== "real_estate" && (
              <>
                <InputField
                  label="Revenue Ramp-up Period"
                  type="number"
                  suffix="months"
                  defaultValue="12"
                  value={formData?.revenueRampUpPeriod}
                  onChange={(val) => updateFormData('revenueRampUpPeriod', Number(val))}
                />
                <InputField
                  label="Seasonality Pattern"
                  type="select"
                  options={["None", "Quarterly Peaks", "Summer Peak", "Winter Peak", "Custom"]}
                  defaultValue="None"
                  value={formData?.seasonalityPattern || "None"}
                  onChange={(val) => updateFormData('seasonalityPattern', val)}
                />
              </>
            )}
            {projectType === "real_estate" && (
              <>
                <InputField
                  label="Sales/Absorption Period"
                  type="number"
                  suffix="months"
                  defaultValue="24"
                  value={formData?.salesAbsorptionPeriod}
                  onChange={(val) => updateFormData('salesAbsorptionPeriod', Number(val))}
                />
                <InputField
                  label="Pre-sales / Off-plan %"
                  type="number"
                  suffix="%"
                  defaultValue="30"
                  value={formData?.preSalesOffPlanPct}
                  onChange={(val) => updateFormData('preSalesOffPlanPct', Number(val))}
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </Card>
  )
}
