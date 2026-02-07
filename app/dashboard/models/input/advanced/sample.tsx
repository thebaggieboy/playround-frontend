"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  DollarSign,
  Users,
  CreditCard,
  Info,
  ChevronDown,
  ChevronUp,
  Save,
  Play,
  Copy,
  TrendingUp,
  TrendingDown,
  Target,
  Building2,
  Calculator,
  Percent,
  TrendingUpDown,
  Factory,
  Zap,
  Upload,
  Download,
  FileText,
  BarChart3,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

type TabType =
  | "project"
  | "macro"
  | "revenue"
  | "opex"
  | "capex"
  | "debt"
  | "tax"
  | "working-capital"
  | "depreciation"
  | "dividend"
  | "valuation"

type ScenarioType = "base" | "upside" | "downside"

interface FormData {
  // Project Information
  projectName: string
  projectLocation: string
  industrySector: string
  projectType: string
  projectCommencementDate: string
  constructionStartDate: string
  constructionDurationMonths: number
  operationsStartDate: string
  operationsDurationYears: number
  totalCapacity: number
  capacityUnit: string
  maximumPlantAvailability: number
  availabilityDuringTam: number
  commissioningAvailability: number
  
  // Macro Assumptions
  reportingCurrency: string
  exchangeRate: number
  baseYear: number
  periodicity: string
  numberOfYears: number
  localInflationRate: number
  foreignInflationRate: number
  discountRateWacc: number
  riskFreeRate: number
  benchmarkRateType: string
  benchmarkRateValue: number
  terminalGrowthRate: number
  
  // Revenue Products (dynamic)
  revenueProducts: Array<{
    productOrder: number
    productName: string
    unitOfMeasure: string
    year1SalesVolume: number
    unitPriceYear1: number
    volumeGrowthRate: number
    priceEscalationRate: number
  }>
  
  // Operating Expenses
  totalHeadcount: number
  averageAnnualSalary: number
  salaryEscalationRate: number
  benefitsPayrollTaxPct: number
  powerElectricityCostAnnual: number
  utilitiesEscalationRate: number
  regularMaintenancePctRevenue: number
  insuranceAnnual: number
  marketingSalesPctRevenue: number
  
  // Capital Expenditure
  landCost: number
  constructionBuildingCost: number
  equipmentMachineryCost: number
  ffeCost: number
  contingencyPct: number
  professionalFeesPct: number
  permitsApprovalsPct: number
  vatOnConstructionPct: number
  
  // Debt Financing
  equityPercentage: number
  debtPercentage: number
  baseRateType: string
  baseRateValue: number
  interestMarginSpread: number
  loanTenorYears: number
  
  // Tax Assumptions
  corporateIncomeTaxRate: number
  vatSalesTaxRate: number
  
  // Working Capital
  receivablesDaysDso: number
  inventoryDaysDio: number
  payablesDaysDpo: number
  
  // Depreciation (simplified)
  depreciationMethod: string
  
  // Dividend Policy
  dividendPayoutRatioPct: number
  
  // Exit Valuation
  exitYear: number
  exitMultipleEvEbitda: number
  terminalGrowthRatePct: number
  discountRateNpvPct: number
  targetIrrPct: number
}

export default function InputModelPage() {
  const [activeTab, setActiveTab] = useState<TabType>("project")
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("base")
  const [detailMode, setDetailMode] = useState(false)
  const [projectType, setProjectType] = useState<"manufacturing" | "real-estate" | "energy" | "general">("general")
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  
  // Model and scenario IDs
  const [modelId, setModelId] = useState<number | null>(null)
  const [scenarioId, setScenarioId] = useState<number | null>(null)
  
  // Progress tracking
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const { toast } = useToast()
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<FormData>({
    // Project Information
    projectName: "New Financial Model",
    projectLocation: "",
    industrySector: "Manufacturing",
    projectType: "Greenfield",
    projectCommencementDate: "2026-07-01",
    constructionStartDate: "2026-07-01",
    constructionDurationMonths: 36,
    operationsStartDate: "2029-07-01",
    operationsDurationYears: 25,
    totalCapacity: 100000,
    capacityUnit: "bpd (barrels per day)",
    maximumPlantAvailability: 90,
    availabilityDuringTam: 80,
    commissioningAvailability: 60,
    
    // Macro Assumptions
    reportingCurrency: "USD ($)",
    exchangeRate: 1470,
    baseYear: 2025,
    periodicity: "Annually",
    numberOfYears: 28,
    localInflationRate: 15.0,
    foreignInflationRate: 2.5,
    discountRateWacc: 12.5,
    riskFreeRate: 4.5,
    benchmarkRateType: "SOFR",
    benchmarkRateValue: 5.0,
    terminalGrowthRate: 3.0,
    
    // Revenue Products
    revenueProducts: [{
      productOrder: 1,
      productName: "Product 1",
      unitOfMeasure: "barrels",
      year1SalesVolume: 10000,
      unitPriceYear1: 80,
      volumeGrowthRate: 5.0,
      priceEscalationRate: 2.5
    }],
    
    // Operating Expenses
    totalHeadcount: 250,
    averageAnnualSalary: 45000,
    salaryEscalationRate: 5.0,
    benefitsPayrollTaxPct: 25,
    powerElectricityCostAnnual: 300000,
    utilitiesEscalationRate: 4.0,
    regularMaintenancePctRevenue: 2.5,
    insuranceAnnual: 200000,
    marketingSalesPctRevenue: 8.0,
    
    // Capital Expenditure
    landCost: 13711180,
    constructionBuildingCost: 109626400,
    equipmentMachineryCost: 20554950,
    ffeCost: 6851650,
    contingencyPct: 4.0,
    professionalFeesPct: 5.0,
    permitsApprovalsPct: 1.0,
    vatOnConstructionPct: 7.5,
    
    // Debt Financing
    equityPercentage: 23.9,
    debtPercentage: 43.0,
    baseRateType: "SOFR",
    baseRateValue: 5.0,
    interestMarginSpread: 3.5,
    loanTenorYears: 15,
    
    // Tax Assumptions
    corporateIncomeTaxRate: 30.0,
    vatSalesTaxRate: 7.5,
    
    // Working Capital
    receivablesDaysDso: 45,
    inventoryDaysDio: 60,
    payablesDaysDpo: 30,
    
    // Depreciation
    depreciationMethod: "Straight Line",
    
    // Dividend Policy
    dividendPayoutRatioPct: 15.0,
    
    // Exit Valuation
    exitYear: 10,
    exitMultipleEvEbitda: 8.5,
    terminalGrowthRatePct: 3.0,
    discountRateNpvPct: 12.5,
    targetIrrPct: 18.0,
  })
  
  // Calculate completion percentage based on filled fields
  useEffect(() => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(value => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim() !== ''
      if (typeof value === 'number') return value !== 0
      return !!value
    }).length
    
    const percentage = Math.round((filledFields / totalFields) * 100)
    setCompletionPercentage(percentage)
  }, [formData])
  
  // Update form data handler
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Update nested form data (for revenue products)
  const updateRevenueProduct = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      revenueProducts: prev.revenueProducts.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }))
  }
  
  // Add revenue product
  const addRevenueProduct = () => {
    if (formData.revenueProducts.length >= 10) {
      toast({
        title: "Maximum products reached",
        description: "You can add up to 10 revenue products.",
        variant: "destructive"
      })
      return
    }
    
    setFormData(prev => ({
      ...prev,
      revenueProducts: [...prev.revenueProducts, {
        productOrder: prev.revenueProducts.length + 1,
        productName: `Product ${prev.revenueProducts.length + 1}`,
        unitOfMeasure: "units",
        year1SalesVolume: 0,
        unitPriceYear1: 0,
        volumeGrowthRate: 0,
        priceEscalationRate: 0
      }]
    }))
  }
  
  // Remove revenue product
  const removeRevenueProduct = (index: number) => {
    if (formData.revenueProducts.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "At least one revenue product is required.",
        variant: "destructive"
      })
      return
    }
    
    setFormData(prev => ({
      ...prev,
      revenueProducts: prev.revenueProducts.filter((_, i) => i !== index)
    }))
  }
  
  // Get auth token (adjust based on your auth implementation)
  const getAuthToken = () => {
    // Replace with your actual auth token retrieval
    return localStorage.getItem('authToken') || ''
  }
  
  // Transform form data to API format
  const transformToAPIFormat = () => {
    return {
      project_info: {
        project_name: formData.projectName,
        project_location: formData.projectLocation,
        industry_sector: formData.industrySector,
        project_type: formData.projectType,
        project_commencement_date: formData.projectCommencementDate,
        construction_start_date: formData.constructionStartDate,
        construction_duration_months: formData.constructionDurationMonths,
        construction_end_date: formData.operationsStartDate,
        operations_start_date: formData.operationsStartDate,
        operations_duration_years: formData.operationsDurationYears,
        total_capacity: formData.totalCapacity,
        capacity_unit: formData.capacityUnit,
        maximum_plant_availability: formData.maximumPlantAvailability,
        availability_during_tam: formData.availabilityDuringTam,
        commissioning_availability: formData.commissioningAvailability,
      },
      macro_assumptions: {
        reporting_currency: formData.reportingCurrency.split(' ')[0],
        exchange_rate_local_per_usd: formData.exchangeRate,
        base_year: formData.baseYear,
        periodicity: formData.periodicity,
        number_of_years: formData.numberOfYears,
        local_inflation_rate: formData.localInflationRate,
        foreign_inflation_rate: formData.foreignInflationRate,
        discount_rate_wacc: formData.discountRateWacc,
        risk_free_rate: formData.riskFreeRate,
        benchmark_rate_type: formData.benchmarkRateType,
        benchmark_rate_value: formData.benchmarkRateValue,
        terminal_growth_rate: formData.terminalGrowthRate,
        model_tolerance: 0.001,
        revenue_opex_escalation_usd: 2.5,
        longterm_target_inflation: 9.0,
        contingency_buffer: 4.0,
      },
      revenue_products: formData.revenueProducts.map(product => ({
        product_order: product.productOrder,
        product_name: product.productName,
        unit_of_measure: product.unitOfMeasure,
        year_1_sales_volume: product.year1SalesVolume,
        unit_price_year_1: product.unitPriceYear1,
        volume_growth_rate: product.volumeGrowthRate,
        price_escalation_rate: product.priceEscalationRate,
      })),
      operating_expenses: {
        total_headcount: formData.totalHeadcount,
        average_annual_salary: formData.averageAnnualSalary,
        salary_escalation_rate: formData.salaryEscalationRate,
        benefits_payroll_tax_pct: formData.benefitsPayrollTaxPct,
        power_electricity_cost_annual: formData.powerElectricityCostAnnual,
        water_gas_utilities_annual: 100000,
        utilities_escalation_rate: formData.utilitiesEscalationRate,
        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue,
        insurance_annual: formData.insuranceAnnual,
        marketing_sales_pct_revenue: formData.marketingSalesPctRevenue,
        administrative_expenses_annual: 150000,
        rent_facilities_annual: 120000,
        technology_software_annual: 50000,
        professional_fees_annual: 75000,
        payables_days_dpo: formData.payablesDaysDpo,
      },
      capital_expenditure: {
        land_cost: formData.landCost,
        construction_building_cost: formData.constructionBuildingCost,
        equipment_machinery_cost: formData.equipmentMachineryCost,
        ffe_cost: formData.ffeCost,
        contingency_pct: formData.contingencyPct,
        professional_fees_pct: formData.professionalFeesPct,
        permits_approvals_pct: formData.permitsApprovalsPct,
        vat_on_construction_pct: formData.vatOnConstructionPct,
        capitalize_interest: true,
        construction_loan_interest_rate: 8.5,
        year_1_drawdown_pct: 30,
        year_2_drawdown_pct: 50,
        year_3_drawdown_pct: 20,
        replacement_capex_pct_revenue: 3.0,
        expansion_capex: 0,
      },
      debt_financing: {
        equity_percentage: formData.equityPercentage,
        debt_percentage: formData.debtPercentage,
        interest_rate_type: "Floating",
        base_rate_type: formData.baseRateType,
        base_rate_value: formData.baseRateValue,
        interest_margin_spread: formData.interestMarginSpread,
        loan_tenor_years: formData.loanTenorYears,
        grace_period_months: 36,
        repayment_type: "Amortizing (Equal Installments)",
        dsra_requirement_months: 6,
        dsra_funding_source: "Cash",
        upfront_fees_pct: 2.0,
        commitment_fee_pct: 0.5,
        drawdown_linked_to: "CAPEX Schedule",
        drawdown_frequency: "Quarterly",
      },
      tax_assumptions: {
        corporate_income_tax_rate: formData.corporateIncomeTaxRate,
        tax_holiday_years: 0,
        minimum_tax_rate: 0.5,
        vat_sales_tax_rate: formData.vatSalesTaxRate,
        wht_dividends: 10.0,
        wht_interest: 10.0,
        wht_services: 5.0,
        wht_rent: 10.0,
        education_tax_pct: 2.5,
        tax_loss_carryforward_years: 5,
        initial_allowance_pct: 25.0,
        annual_allowance_pct: 20.0,
      },
      working_capital: {
        initial_wc_pct_year1_opex: 30.0,
        receivables_days_dso: formData.receivablesDaysDso,
        inventory_days_dio: formData.inventoryDaysDio,
        payables_days_dpo: formData.payablesDaysDpo,
        wc_pct_revenue: 10.0,
        minimum_cash_balance: 1000000,
        wc_funding_source: "From Equity",
        wc_reserve_account: false,
      },
      depreciation_schedules: [
        {
          asset_category: "land",
          depreciation_method: "straight_line",
          asset_value: formData.landCost,
          useful_life_years: 0,
          residual_value_pct: 100,
        },
        {
          asset_category: "buildings",
          depreciation_method: "straight_line",
          asset_value: formData.constructionBuildingCost,
          useful_life_years: 40,
          residual_value_pct: 10,
        },
        {
          asset_category: "equipment",
          depreciation_method: "straight_line",
          asset_value: formData.equipmentMachineryCost,
          useful_life_years: 15,
          residual_value_pct: 5,
        },
        {
          asset_category: "ffe",
          depreciation_method: "straight_line",
          asset_value: formData.ffeCost,
          useful_life_years: 7,
          residual_value_pct: 0,
        },
      ],
      dividend_policy: {
        dividend_payout_ratio_pct: formData.dividendPayoutRatioPct,
        dividend_payment_frequency: "Annually",
        minimum_cash_before_dividend: 5000000,
        minimum_dscr_for_dividend: 1.3,
        minimum_llcr_for_dividend: 1.5,
        preferred_dividend_rate_pct: 0,
        share_buyback_provision: false,
        dividend_wht_pct: 10.0,
        dividend_reinvestment_option: false,
      },
      exit_valuation: {
        exit_year: formData.exitYear,
        exit_multiple_ev_ebitda: formData.exitMultipleEvEbitda,
        terminal_growth_rate_pct: formData.terminalGrowthRatePct,
        discount_rate_npv_pct: formData.discountRateNpvPct,
        target_irr_pct: formData.targetIrrPct,
        pe_multiple: 12.0,
        price_book_multiple: 2.5,
        revenue_multiple: 1.5,
        asset_sale_value: 0,
        transaction_costs_pct: 3.0,
        valuation_method: "DCF (Discounted Cash Flow)",
        target_equity_irr_pct: 20.0,
        target_project_irr_pct: 15.0,
        payback_period_target_years: 7,
        minimum_moic: 2.5,
      }
    }
  }
  
  // Generate Model (Main function)
  const handleGenerateModel = async () => {
    setIsGenerating(true)
    
    try {
      // Step 1: Create model if it doesn't exist
      if (!modelId) {
        const createModelResponse = await fetch(`${API_BASE_URL}/models/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        })
        
        if (!createModelResponse.ok) {
          throw new Error('Failed to create model')
        }
        
        const modelData = await createModelResponse.json()
        setModelId(modelData.id)
        
        // Get base scenario ID
        if (modelData.scenarios && modelData.scenarios.length > 0) {
          setScenarioId(modelData.scenarios[0].id)
        }
      }
      
      // Step 2: Save scenario data
      const scenarioData = {
        ...transformToAPIFormat(),
        name: activeScenario === 'base' ? 'Base Case' : 
              activeScenario === 'upside' ? 'Upside Case' : 'Downside Case',
        scenario_type: activeScenario,
        model: modelId
      }
      
      const saveResponse = await fetch(
        `${API_BASE_URL}/scenarios/${scenarioId}/`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(scenarioData)
        }
      )
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save scenario data')
      }
      
      // Step 3: Trigger calculation
      const calculateResponse = await fetch(
        `${API_BASE_URL}/models/${modelId}/calculate/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      )
      
      if (!calculateResponse.ok) {
        throw new Error('Failed to calculate model')
      }
      
      const result = await calculateResponse.json()
      
      toast({
        title: "Success!",
        description: "Model generated successfully with all financial statements.",
        variant: "default"
      })
      
      // Redirect to results page or show success
      // window.location.href = `/models/${modelId}/results`
      
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate model",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Save as Template
  const handleSaveAsTemplate = async () => {
    if (!modelId) {
      toast({
        title: "No model to save",
        description: "Please generate a model first before saving as template.",
        variant: "destructive"
      })
      return
    }
    
    setIsSavingTemplate(true)
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/save_as_template/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: `${formData.projectName} Template`,
            description: `Template created from ${formData.projectName}`,
            is_public: false
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to save template')
      }
      
      const template = await response.json()
      
      toast({
        title: "Template saved!",
        description: `"${template.name}" has been saved successfully.`,
      })
      
    } catch (error) {
      console.error('Save template error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save template",
        variant: "destructive"
      })
    } finally {
      setIsSavingTemplate(false)
    }
  }
  
  // Export to Excel
  const handleExportExcel = async () => {
    if (!modelId) {
      toast({
        title: "No model to export",
        description: "Please generate a model first before exporting.",
        variant: "destructive"
      })
      return
    }
    
    setIsExporting(true)
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/export_excel/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to export to Excel')
      }
      
      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.projectName}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Export successful!",
        description: "Excel file has been downloaded.",
      })
      
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export to Excel",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }
  
  // Save Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    
    try {
      // Create model if doesn't exist
      if (!modelId) {
        const createResponse = await fetch(`${API_BASE_URL}/models/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        })
        
        if (!createResponse.ok) throw new Error('Failed to create model')
        
        const modelData = await createResponse.json()
        setModelId(modelData.id)
        if (modelData.scenarios?.[0]) setScenarioId(modelData.scenarios[0].id)
      }
      
      // Save scenario data
      if (scenarioId) {
        const scenarioData = {
          ...transformToAPIFormat(),
          name: 'Base Case',
          scenario_type: 'base',
          model: modelId
        }
        
        await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(scenarioData)
        })
      }
      
      setLastSaved(new Date())
      
      toast({
        title: "Draft saved",
        description: "Your work has been saved successfully.",
      })
      
    } catch (error) {
      console.error('Save draft error:', error)
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      })
    } finally {
      setIsSavingDraft(false)
    }
  }
  
  // Auto-save every 2 minutes
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (modelId && scenarioId) {
        handleSaveDraft()
      }
    }, 120000) // 2 minutes
    
    return () => clearInterval(autoSave)
  }, [modelId, scenarioId, formData])

  const tabs = [
    { id: "project" as TabType, label: "Project Info", icon: Building2 },
    { id: "macro" as TabType, label: "Macro & General", icon: Settings },
    { id: "revenue" as TabType, label: "Revenue", icon: DollarSign },
    { id: "opex" as TabType, label: "Operating Expenses", icon: Users },
    { id: "capex" as TabType, label: "Capital Expenditure", icon: Factory },
    { id: "debt" as TabType, label: "Debt & Financing", icon: CreditCard },
    { id: "tax" as TabType, label: "Tax", icon: Calculator },
    { id: "working-capital" as TabType, label: "Working Capital", icon: Zap },
    { id: "depreciation" as TabType, label: "Depreciation", icon: TrendingDown },
    { id: "dividend" as TabType, label: "Dividend", icon: Percent },
    { id: "valuation" as TabType, label: "Exit & Valuation", icon: TrendingUpDown },
  ]

  const scenarios = [
    { id: "base" as ScenarioType, label: "Base Case", icon: Target },
    { id: "upside" as ScenarioType, label: "Upside", icon: TrendingUp },
    { id: "downside" as ScenarioType, label: "Downside", icon: TrendingDown },
  ]

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Input Model</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Build comprehensive financial models from scratch
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <Button
                    key={scenario.id}
                    onClick={() => setActiveScenario(scenario.id)}
                    variant={activeScenario === scenario.id ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {scenario.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span>Completion: {completionPercentage}%</span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
          {(isGenerating || isSavingDraft || isSavingTemplate || isExporting) && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {isGenerating && "Generating model..."}
                {isSavingDraft && "Saving..."}
                {isSavingTemplate && "Saving template..."}
                {isExporting && "Exporting..."}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-secondary/20">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Detail Mode Toggle */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">Input Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Switch between simple and detailed inputs
                  </p>
                </div>
              </div>
              <Button onClick={() => setDetailMode(!detailMode)} variant="outline" size="sm" className="gap-2">
                {detailMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {detailMode ? "Simple" : "Detailed"}
              </Button>
            </div>
          </Card>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "project" && (
                <ProjectForm 
                  formData={formData} 
                  updateFormData={updateFormData}
                  detailMode={detailMode} 
                />
              )}
              {activeTab === "macro" && (
                <MacroForm 
                  formData={formData} 
                  updateFormData={updateFormData}
                  detailMode={detailMode} 
                />
              )}
              {activeTab === "revenue" && (
                <RevenueForm 
                  formData={formData} 
                  updateFormData={updateFormData}
                  updateRevenueProduct={updateRevenueProduct}
                  addRevenueProduct={addRevenueProduct}
                  removeRevenueProduct={removeRevenueProduct}
                  detailMode={detailMode} 
                />
              )}
              {/* Add other form components similarly */}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleExportExcel}
                  disabled={isExporting || !modelId}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export to Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSaveAsTemplate}
                  disabled={isSavingTemplate || !modelId}
                >
                  {isSavingTemplate ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  Save as Template
                </Button>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                >
                  {isSavingDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Draft
                </Button>
                <Button 
                  className="gap-2"
                  onClick={handleGenerateModel}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Generate Model
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Simplified form components with onChange handlers
// (I'll show the pattern for one - apply to all)

function ProjectForm({ 
  formData, 
  updateFormData, 
  detailMode 
}: { 
  formData: FormData
  updateFormData: (field: string, value: any) => void
  detailMode: boolean 
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
        <p className="text-sm text-muted-foreground">Define basic project details and timeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Project Name" 
          type="text" 
          value={formData.projectName}
          onChange={(value) => updateFormData('projectName', value)}
        />
        <InputField 
          label="Project Location" 
          type="text" 
          value={formData.projectLocation}
          onChange={(value) => updateFormData('projectLocation', value)}
        />
        {/* Add remaining fields following this pattern */}
      </div>
    </Card>
  )
}

function MacroForm({ 
  formData, 
  updateFormData, 
  detailMode 
}: { 
  formData: FormData
  updateFormData: (field: string, value: any) => void
  detailMode: boolean 
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Macro Economic Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define global parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Base Year" 
          type="number" 
          value={formData.baseYear}
          onChange={(value) => updateFormData('baseYear', Number(value))}
        />
        {/* Add remaining fields */}
      </div>
    </Card>
  )
}

function RevenueForm({ 
  formData, 
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  detailMode 
}: { 
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  detailMode: boolean 
}) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Assumptions</h3>
          <p className="text-sm text-muted-foreground">Configure revenue streams</p>
        </div>
        <Button onClick={addRevenueProduct} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {formData.revenueProducts.map((product, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Product {index + 1}</h4>
            {formData.revenueProducts.length > 1 && (
              <Button 
                onClick={() => removeRevenueProduct(index)} 
                variant="ghost" 
                size="sm"
                className="text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Product Name" 
              type="text" 
              value={product.productName}
              onChange={(value) => updateRevenueProduct(index, 'productName', value)}
            />
            <InputField 
              label="Year 1 Volume" 
              type="number" 
              value={product.year1SalesVolume}
              onChange={(value) => updateRevenueProduct(index, 'year1SalesVolume', Number(value))}
            />
          </div>
        </div>
      ))}
    </Card>
  )
}

// Enhanced InputField with onChange
function InputField({
  label,
  type = "text",
  prefix,
  suffix,
  value,
  calculated = false,
  tooltip,
  options,
  placeholder,
  onChange,
  size = "default",
}: {
  label: string
  type?: "text" | "number" | "select" | "date"
  prefix?: string
  suffix?: string
  value?: string | number
  calculated?: boolean
  tooltip?: string
  options?: string[]
  placeholder?: string
  onChange?: (value: string) => void
  size?: "default" | "sm"
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const inputClasses = size === "sm" ? "text-xs py-1.5" : "text-sm py-2"
  const labelClasses = size === "sm" ? "text-xs" : "text-sm"

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className={`${labelClasses} font-medium text-foreground`}>{label}</label>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Info className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
            </button>
            {showTooltip && (
              <div className="absolute left-0 top-5 z-10 w-64 bg-foreground text-background text-xs p-2 rounded shadow-lg">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {prefix}
          </span>
        )}
        {type === "select" ? (
          <select
            className={`w-full px-3 ${inputClasses} border rounded-lg ${
              calculated
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-blue-50 border-blue-200 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }`}
            value={value}
            disabled={calculated}
            onChange={(e) => onChange?.(e.target.value)}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-20" : "pr-3"} ${inputClasses} border rounded-lg ${
              calculated
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-blue-50 border-blue-200 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }`}
            value={value}
            disabled={calculated}
            readOnly={calculated}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
        {suffix && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}