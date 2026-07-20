"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  DollarSign,
  Users,
  CreditCard,
  History,
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
  Loader2,      // ← ADD THIS LINE
  CheckCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { selectToken } from "@/features/token/tokenSlice"
import { useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
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
  factoryCapacityMultiplier: number

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
  constructionEndDate: string           // ← ADD
  modelTolerance: number                // ← ADD
  longtermTargetInflation: number       // ← ADD
  revenueOpexEscalationUsd: number      // ← ADD
  contingencyBuffer: number             // ← ADD
  waterGasUtilitiesAnnual: number       // ← ADD
  administrativeExpensesAnnual: number  // ← ADD
  rentFacilitiesAnnual: number          // ← ADD
  technologySoftwareAnnual: number      // ← ADD
  professionalFeesAnnual: number        // ← ADD
  payablesDaysDpo2: number              // ← ADD (for working capital)
  minimumCashBalance: number
  // Auto-added properties
  administrativeExpenses?: any;
  amenitiesCost?: any;
  annualAllowance?: any;
  apartmentConstruction?: any;
  assetSaleValueIfApplicable?: any;
  baseRate?: any;
  benefitsPayrollTax?: any;
  capitalizeInterestDuringConstruction?: any;
  commitmentFee?: any;
  constructionLoanInterestRate?: any;
  contingency?: any;
  daysInYear?: any;
  discountRateForNpv?: any;
  dividendPaymentFrequency?: any;
  dividendPayoutRatio?: any;
  dividendReinvestmentOption?: any;
  dividendWithholdingTax?: any;
  drawdownFrequency?: any;
  drawdownLinkedTo?: any;
  dsraFundingSource?: any;
  dsraRequirement?: any;
  educationTax?: any;
  equipmentMachinery?: any;
  expansionCapexIfApplicable?: any;
  fuelGasCost?: any;
  furnitureFixturesEquipmentFfe?: any;
  gbaGrossBuildingArea?: any;
  gracePeriod?: any;
  hotelCommercialConstruction?: any;
  hoursInDay?: any;
  initialAllowance?: any;
  initialWorkingCapital?: any;
  interestRateType?: any;
  landValue?: any;
  loanTenor?: any;
  longTermTargetInflation?: any;
  marketShareTarget?: any;
  marketingSales?: any;
  minimumCashBeforeDividend?: any;
  minimumDscrForDividend?: any;
  minimumLlcrForDividend?: any;
  minimumMoic?: any;
  minimumTaxRate?: any;
  multiStoreyCarParkCost?: any;
  numberOfPhases?: any;
  numberOfUnits?: any;
  offPlanSalesPreSalesPct?: any;
  overallWeightedAverageLife?: any;
  pEMultiple?: any;
  paybackPeriodTarget?: any;
  permitsApprovals?: any;
  phaseICapacity?: any;
  phaseIiCapacity?: any;
  powerElectricityCost?: any;
  preSalesOffPlanPct?: any;
  preferredDividendRate?: any;
  priceBookMultiple?: any;
  professionalFees?: any;
  propertyManagement?: any;
  rawMaterialCostPerUnit?: any;
  rawMaterialPriceEscalation?: any;
  regularMaintenance?: any;
  rentFacilities?: any;
  repaymentType?: any;
  replacementCapex?: any;
  residualValue?: any;
  revenueMultiple?: any;
  revenueOpexEscalationRateUsd?: any;
  revenueRampUpPeriod?: any;
  salePricePerUnit?: any;
  salesAbsorptionPeriod?: any;
  seasonalAdjustmentFactor?: any;
  shareBuybackProvision?: any;
  tamFrequency?: any;
  targetEquityIrr?: any;
  targetIrr?: any;
  targetProjectIrr?: any;
  taxHolidayPeriod?: any;
  taxLossCarryforwardPeriod?: any;
  technologySoftware?: any;
  transactionCosts?: any;
  turnAroundMaintenanceTamCost?: any;
  upfrontFees?: any;
  usefulLife?: any;
  valuationMethod?: any;
  value?: any;
  variableCostAsPctOfRevenue?: any;
  vatOnConstruction?: any;
  waterGasUtilities?: any;
  wcReserveAccount?: any;
  whtOnDividends?: any;
  whtOnInterest?: any;
  whtOnRent?: any;
  whtOnServices?: any;
  workingCapitalAsPctOfRevenue?: any;
  workingCapitalFunding?: any;
  year1?: any;
  year2?: any;
  year3?: any;

}


export default function InputModelPage() {
  const token = useSelector(selectToken)
  const [activeTab, setActiveTab] = useState<TabType>("project")
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("base")
  const [detailMode, setDetailMode] = useState(false)
  const [projectType, setProjectType] = useState<"manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general">("general")

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  // Model and scenario IDs
  const [modelId, setModelId] = useState<number | null>(null)
  const [scenarioId, setScenarioId] = useState<number | null>(null)

  // Progress tracking
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [calcStep, setCalcStep] = useState<number>(-1)  // -1 = idle

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
    operationsDurationYears: 10,
    totalCapacity: 100000,
    capacityUnit: "bpd (barrels per day)",
    maximumPlantAvailability: 90,
    availabilityDuringTam: 80,
    commissioningAvailability: 60,
    factoryCapacityMultiplier: 0,
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
      year1SalesVolume: 500000,
      unitPriceYear1: 120,
      volumeGrowthRate: 5.0,
      priceEscalationRate: 2.5
    }],

    // Operating Expenses
    totalHeadcount: 100,
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
    // ADD THESE:
    constructionEndDate: "2029-07-01",
    modelTolerance: 0.001,
    longtermTargetInflation: 9.0,
    revenueOpexEscalationUsd: 2.5,
    contingencyBuffer: 4.0,
    waterGasUtilitiesAnnual: 100000,
    administrativeExpensesAnnual: 150000,
    rentFacilitiesAnnual: 120000,
    technologySoftwareAnnual: 50000,
    professionalFeesAnnual: 75000,
    payablesDaysDpo2: 30,
    minimumCashBalance: 1000000,
  })
  console.log("FormData: ", formData)
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
  const updateFormData = async (field: string, value: any) => {
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

  // Get auth token safely from Redux
  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && token.access) return token.access;
    return '';
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
        construction_end_date: formData.constructionEndDate || formData.operationsStartDate,
        operations_start_date: formData.operationsStartDate,
        operations_duration_years: formData.operationsDurationYears,
        total_capacity: formData.totalCapacity,
        capacity_unit: formData.capacityUnit,
        maximum_plant_availability: formData.maximumPlantAvailability,
        availability_during_tam: formData.availabilityDuringTam,
        commissioning_availability: formData.commissioningAvailability,
        factory_capacity_multiplier: formData.factoryCapacityMultiplier,
        number_of_phases: formData.numberOfPhases || 1,
        phase_1_capacity: formData.phase_1_capacity || formData.phaseICapacity,
        phase_2_capacity: formData.phase_2_capacity || formData.phaseIiCapacity,
        days_in_year: formData.daysInYear || 365,
        hours_in_day: formData.hoursInDay || 24,
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
        model_tolerance: formData.modelTolerance || 0.001,
        revenue_opex_escalation_usd: formData.revenueOpexEscalationUsd || 2.5,
        longterm_target_inflation: formData.longtermTargetInflation || 9.0,
        contingency_buffer: formData.contingencyBuffer || 4.0,
      },
      revenue_products: formData.revenueProducts.map(product => ({
        product_order: product.productOrder,
        product_name: product.productName,
        unit_of_measure: product.unitOfMeasure,
        year_1_sales_volume: product.year1SalesVolume,
        unit_price_year_1: product.unitPriceYear1,
        volume_growth_rate: product.volumeGrowthRate,
        price_escalation_rate: product.priceEscalationRate,
        number_of_units: product.number_of_units || formData.numberOfUnits,
        gba_gross_building_area: product.gba_gross_building_area || formData.gbaGrossBuildingArea,
        lettable_area: product.lettable_area || formData.lettableArea,
        sale_price_per_unit: product.sale_price_per_unit || formData.salePricePerUnit,
        receivables_days_dso: product.receivables_days_dso || formData.receivablesDaysDso,
        revenue_rampup_months: product.revenue_rampup_months || formData.revenueRampUpPeriod,
        seasonal_adjustment_factor: product.seasonal_adjustment_factor || formData.seasonalAdjustmentFactor || 1.0,
        sales_absorption_period_months: product.sales_absorption_period_months || formData.salesAbsorptionPeriod,
        presales_offplan_percentage: product.presales_offplan_percentage || formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct,
      })),
      operating_expenses: {
        total_headcount: formData.totalHeadcount,
        average_annual_salary: formData.averageAnnualSalary,
        salary_escalation_rate: formData.salaryEscalationRate,
        benefits_payroll_tax_pct: formData.benefitsPayrollTaxPct,
        power_electricity_cost_annual: formData.powerElectricityCostAnnual || formData.powerElectricityCost,
        water_gas_utilities_annual: formData.waterGasUtilitiesAnnual || formData.waterGasUtilities || 100000,
        utilities_escalation_rate: formData.utilitiesEscalationRate,
        property_management_pct: formData.property_management_pct || formData.propertyManagement,
        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue || formData.regularMaintenance,
        insurance_annual: formData.insuranceAnnual,
        tam_cost: formData.turnAroundMaintenanceTamCost || formData.tam_cost,
        tam_frequency_years: formData.tamFrequency || formData.tam_frequency,
        marketing_sales_pct_revenue: formData.marketingSalesPctRevenue || formData.marketingSales,
        administrative_expenses_annual: formData.administrativeExpensesAnnual || formData.administrativeExpenses || 150000,
        rent_facilities_annual: formData.rentFacilitiesAnnual || formData.rentFacilities || 120000,
        technology_software_annual: formData.technologySoftwareAnnual || formData.technologySoftware || 50000,
        professional_fees_annual: formData.professionalFeesAnnual || formData.professionalFees || 75000,
        payables_days_dpo: formData.payablesDaysDpo,
      },
      capital_expenditure: {
        land_cost: formData.landCost || formData.landValue,
        construction_building_cost: formData.constructionBuildingCost,
        equipment_machinery_cost: formData.equipmentMachineryCost || formData.equipmentMachinery,
        ffe_cost: formData.ffeCost || formData.furnitureFixturesEquipmentFfe,
        carpark_cost: formData.carpark_cost || formData.multiStoreyCarParkCost,
        amenities_cost: formData.amenities_cost || formData.amenitiesCost,
        apartment_construction_cost: formData.apartment_construction_cost || formData.apartmentConstruction,
        hotel_commercial_cost: formData.hotel_commercial_cost || formData.hotelCommercialConstruction,
        contingency_pct: formData.contingencyPct || formData.contingency,
        professional_fees_pct: formData.professionalFeesPct || formData.professionalFees,
        permits_approvals_pct: formData.permitsApprovalsPct || formData.permitsApprovals,
        vat_on_construction_pct: formData.vatOnConstructionPct || formData.vatOnConstruction,
        capitalize_interest: true,
        construction_loan_interest_rate: formData.constructionLoanInterestRate || 8.5,
        year_1_drawdown_pct: 30,
        year_2_drawdown_pct: 50,
        year_3_drawdown_pct: 20,
        replacement_capex_pct_revenue: formData.replacement_capex_pct_revenue || formData.replacementCapex || 3.0,
        expansion_capex: formData.expansion_capex || formData.expansionCapexIfApplicable || 0,
      },
      debt_financing: {
        equity_percentage: formData.equityPercentage,
        debt_percentage: formData.debtPercentage,
        offplan_presales_percentage: formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct || null,
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

  const CALC_STEPS = [
    "Creating model...",
    "Saving scenario data...",
    "Building Revenue forecast...",
    "Computing Operating Expenses...",
    "Calculating Depreciation...",
    "Structuring Debt & Financing...",
    "Building Income Statement...",
    "Building Cash Flow Statement...",
    "Constructing Balance Sheet...",
    "Calculating Financial Ratios...",
    "Running Valuation models...",
    "Finalizing results...",
  ]

  // Generate Model (#6 — step-by-step progress)
  const handleGenerateModel = async () => {
    setIsGenerating(true)
    setCalcStep(0)

    const advanceStep = (step: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => { setCalcStep(step); resolve() }, 800)
      })
    }

    try {
      let currentModelId = modelId;
      let currentScenarioId = scenarioId;

      // Step 0: Create model if it doesn't exist
      if (!currentModelId) {
        const createModelResponse = await fetch(`${API_BASE_URL}/models/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        })

        if (!createModelResponse.ok) {
          const errorData = await createModelResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData) || 'Failed to create model');
        }

        const modelData = await createModelResponse.json()
        currentModelId = modelData.id
        setModelId(currentModelId)

        if (modelData.scenarios && modelData.scenarios.length > 0) {
          currentScenarioId = modelData.scenarios[0].id
          setScenarioId(currentScenarioId)
        }
      } else {
        // Update model metadata to ensure the selected industry project type is correctly persisted
        const updateModelResponse = await fetch(`${API_BASE_URL}/models/${currentModelId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        });
        
        if (!updateModelResponse.ok) {
           console.warn('Failed to update financial model metadata');
        }
      }

      await advanceStep(1)

      // Step 1: Save scenario data
      const scenarioData = {
        ...transformToAPIFormat(),
        name: activeScenario === 'base' ? 'Base Case' :
          activeScenario === 'upside' ? 'Upside Case' : 'Downside Case',
        scenario_type: activeScenario,
        model: currentModelId
      }

      const saveResponse = await fetch(
        `${API_BASE_URL}/scenarios/${currentScenarioId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify(scenarioData)
        }
      )

      if (!saveResponse.ok) throw new Error('Failed to save scenario data')

      // Animate through calculation steps while API call runs
      await advanceStep(2)
      await advanceStep(3)
      await advanceStep(4)
      await advanceStep(5)
      await advanceStep(6)

      // Step 3: Trigger calculation (the real async work)
      const calcPromise = fetch(
        `${API_BASE_URL}/models/${currentModelId}/calculate/`,
        {
          method: 'POST',
          headers: { 'Authorization': `JWT ${getAuthToken()}` }
        }
      )

      await advanceStep(7)
      await advanceStep(8)
      await advanceStep(9)
      await advanceStep(10)

      const calculateResponse = await calcPromise

      if (!calculateResponse.ok) throw new Error('Failed to calculate model')

      const result = await calculateResponse.json()

      // Check for partial failures in the result
      const failedSteps = result?.failed_steps || []
      await advanceStep(11)

      if (failedSteps.length > 0) {
        toast({
          title: "⚠️ Model Generated with Warnings",
          description: `Some steps had issues: ${failedSteps.join(', ')}. Other statements completed successfully.`,
          variant: "destructive",
          duration: 6000,
        })
      } else {
        toast({
          title: "✨ Model Generated Successfully",
          description: (
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm font-medium">All financial statements are ready.</span>
              <span className="text-xs text-green-700/80 dark:text-green-300">You can now view your model results.</span>
            </div>
          ) as any,
          className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/40 dark:to-green-900/20 dark:border-green-800",
          duration: 4000,
        })
      }

    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate model",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
      setTimeout(() => setCalcStep(-1), 2000)
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
      const formattedProjectType = formData.industrySector.toLowerCase().replace(/ & | /g, "_")

      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/save_as_template/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: `${formData.projectName} Template`,
            description: `Template created from ${formData.projectName}`,
            is_public: false,
            project_type: formattedProjectType
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData) || 'Failed to create template');
      }

      toast({
        title: "✨ Template Successfully Saved",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium">"{formData.projectName} Template"</span>
            <span className="text-xs text-muted-foreground">Ready to be used for your next model.</span>
          </div>
        ) as any,
        className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/40 dark:to-green-900/20 dark:border-green-800",
        duration: 4000,
      })

    } catch (error: any) {
      console.error('Template save error:', error)
      toast({
        title: "Template Error",
        description: error.message || "Failed to save template.",
        variant: "destructive"
      })
    } finally {
      setIsSavingTemplate(false)
    }
  }

  // Export to Excel
  const handleExportExcel = async () => {
    if (!scenarioId) {
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
        `${API_BASE_URL}/scenarios/${scenarioId}/export_excel/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${getAuthToken()}`
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
        title: "📊 Export Successful",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium">{formData.projectName}.xlsx downloaded.</span>
            <span className="text-xs text-blue-700/80 dark:text-blue-300">Your model is ready for Excel.</span>
          </div>
        ) as any,
        className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 dark:border-blue-800",
        duration: 4000,
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

  // Export to PDF
  const handleExportPdf = async () => {
    if (!scenarioId) {
      toast({
        title: "No model to export",
        description: "Please generate a model first before exporting.",
        variant: "destructive"
      })
      return
    }

    setIsExportingPdf(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/scenarios/${scenarioId}/export_pdf/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${getAuthToken()}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to export to PDF')
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.projectName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "📄 Export Successful",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium">{formData.projectName}.pdf downloaded.</span>
            <span className="text-xs text-red-700/80 dark:text-red-300">Your PDF report is ready.</span>
          </div>
        ) as any,
        className: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/40 dark:to-red-900/20 dark:border-red-800",
        duration: 4000,
      })

    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export to PDF",
        variant: "destructive"
      })
    } finally {
      setIsExportingPdf(false)
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
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        })

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData) || 'Failed to create model');
        }

        const modelData = await createResponse.json()
        setModelId(modelData.id)
        if (modelData.scenarios?.[0]) setScenarioId(modelData.scenarios[0].id)
      } else {
        // Ensure the selected industry dropdown value is saved!
        const updateModelResponse = await fetch(`${API_BASE_URL}/models/${modelId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify({
            name: formData.projectName,
            project_type: projectType
          })
        });
        
        if (!updateModelResponse.ok) {
           console.warn('Failed to update financial model metadata');
        }
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
            'Authorization': `JWT ${getAuthToken()}`
          },
          body: JSON.stringify(scenarioData)
        })
      }

      setLastSaved(new Date())

      toast({
        title: "💾 Draft Saved",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium">Your work has been securely saved.</span>
            <span className="text-xs text-slate-500">You can safely leave this page.</span>
          </div>
        ) as any,
        className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:from-slate-900/40 dark:to-slate-900/20 dark:border-slate-800",
        duration: 3000,
      })

    } catch (error: any) {
      console.error('Save draft error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save draft. Please check your data.",
        variant: "destructive"
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Auto-save to localStorage every 30 seconds (#9)
  useEffect(() => {
    const draftKey = `plyground_draft_${modelId || 'unsaved'}`
    localStorage.setItem(draftKey, JSON.stringify(formData))
  }, [formData, modelId])

  // Auto-save to backend every 30 seconds if model exists (#9)
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (modelId && scenarioId) {
        handleSaveDraft()
      }
    }, 30000) // 30 seconds
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

  console.log("Token: ", token)

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Input Model</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {/* Quick Actions */}
            <Link href="/dashboard/models/upload" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all text-xs sm:text-sm h-8 sm:h-9">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Import
              </Button>
            </Link>
            <Link href="/dashboard/templates" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-2 hover:border-primary hover:bg-primary/5 transition-all text-xs sm:text-sm h-8 sm:h-9">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Templates
              </Button>
            </Link>

            {/* Scenario Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <Button
                    key={scenario.id}
                    onClick={() => {
                      if (activeScenario !== scenario.id) {
                        setActiveScenario(scenario.id)
                        toast({
                          title: `Switched to ${scenario.label}`,
                          description: `You are now editing the ${scenario.label} assumptions.`,
                          duration: 2500,
                        })
                      }
                    }}
                    variant={activeScenario === scenario.id ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {scenario.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Completion: {completionPercentage}%</span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span>Saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Step-by-step calculation progress (#6) */}
        {isGenerating && calcStep >= 0 && (
          <div className="mt-3 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {CALC_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                    i < calcStep ? 'bg-green-100 text-green-700' :
                    i === calcStep ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i < calcStep ? (
                      <CheckCircle className="w-2.5 h-2.5" />
                    ) : i === calcStep ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : null}
                    <span className="hidden sm:inline">{step}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                  {i < CALC_STEPS.length - 1 && (
                    <div className={`w-3 h-px ${ i < calcStep ? 'bg-green-400' : 'bg-border' }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 min-w-max pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              <Button
                onClick={() => {
                  const next = !detailMode
                  setDetailMode(next)
                  toast({
                    title: next ? "Detailed Mode" : "Simple Mode",
                    description: next
                      ? "Showing all advanced input fields."
                      : "Showing essential fields only.",
                    duration: 2000,
                  })
                }}
                variant="outline"
                size="sm"
                className="gap-2"
              >
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
                  onProjectTypeChange={setProjectType}
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
                  projectType={projectType}
                />
              )}
              {activeTab === "opex" && (
                <OpexForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                  projectType={projectType}
                />
              )}
              {activeTab === "capex" && (
                <CapexForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                  projectType={projectType}
                />
              )}
              {activeTab === "debt" && (
                <DebtForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
              {activeTab === "tax" && (
                <TaxForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
              {activeTab === "working-capital" && (
                <WorkingCapitalForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
              {activeTab === "depreciation" && (
                <DepreciationForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
              {activeTab === "dividend" && (
                <DividendForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
              {activeTab === "valuation" && (
                <ValuationForm
                  formData={formData}
                  updateFormData={updateFormData}
                  detailMode={detailMode}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <Card className="p-4 sm:p-6 mb-8 mt-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center w-full">
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <Button
                  variant="outline"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                  onClick={handleExportExcel}
                  disabled={isExporting || !scenarioId}
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  Excel <span className="hidden sm:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf || !scenarioId}
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  PDF <span className="hidden sm:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                  onClick={handleSaveAsTemplate}
                  disabled={isSavingTemplate || !modelId}
                >
                  {isSavingTemplate ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  Template
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                >
                  {isSavingDraft ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  Save Draft
                </Button>
                <Button
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                  onClick={handleGenerateModel}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

// PROJECT INFORMATION FORM
function ProjectForm({
  formData,
  updateFormData,
  detailMode,
  onProjectTypeChange
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  detailMode: boolean
  onProjectTypeChange: (type: "manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general") => void
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
          name="projectName"
          value={formData?.projectName}
          tooltip="The full legal or operational name of the project."
          onChange={(value) => updateFormData('projectName', value)}
          placeholder="e.g., Eghudu Refinery Project" />

        <InputField label="Project Location" value={formData?.projectLocation} type="text" tooltip="The geographical area where the project is situated." onChange={(value) => updateFormData('projectLocation', value)} placeholder="e.g., Edo State, Nigeria" />
        <InputField
          label="Industry/Sector"
          type="select"
          value={formData?.industrySector}
          tooltip="The primary economic sector the project belongs to."
          options={["Manufacturing", "Real Estate", "Energy & Power", "Oil & Gas", "Healthcare", "Technology", "Agriculture", "Infrastructure", "Other"]}
          defaultValue="Manufacturing"
          onChange={(val) => {
            updateFormData('industrySector', val);
            if (val === "Manufacturing") onProjectTypeChange("manufacturing")
            else if (val === "Real Estate") onProjectTypeChange("real_estate")
            else if (val === "Energy & Power") onProjectTypeChange("energy")
            else if (val === "Oil & Gas") onProjectTypeChange("oil_gas")
            else if (val === "Healthcare") onProjectTypeChange("healthcare")
            else if (val === "Technology") onProjectTypeChange("technology")
            else if (val === "Agriculture") onProjectTypeChange("agriculture")
            else if (val === "Infrastructure") onProjectTypeChange("infrastructure")
            else onProjectTypeChange("general")
          }}
        />
        {formData?.industrySector === "Other" && (
          <InputField
            label="Custom Industry Name"
            type="text"
            value={formData?.projectName} // Repurposing projectName or using a dedicated field
            tooltip="Specify your industry sector if it's not listed."
            onChange={(val) => updateFormData('industrySector', val)}
            placeholder="e.g., Mining, Fintech, etc."
          />
        )}
        <InputField label="Project Type" value={formData?.projectType} type="select" tooltip="Classification of the project development stage (e.g., Greenfield for new builds)." options={["Greenfield", "Brownfield", "Expansion", "Acquisition", "Development"]} onChange={(value) => updateFormData('projectType', value)} defaultValue="Greenfield" />
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Project Timeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Project Commencement Date" type="date" value={formData?.projectCommencementDate} tooltip="The date project planning and administrative activities begin." onChange={(value) => updateFormData('projectCommencementDate', value)} defaultValue="2026-07-01" />
          <InputField label="Construction Start Date" type="date" value={formData?.constructionStartDate} tooltip="The date physical construction on-site is expected to start." onChange={(value) => updateFormData('constructionStartDate', value)} defaultValue="2026-07-01" />
          <InputField label="Construction Duration" type="number" value={formData?.constructionDuration} onChange={(value) => updateFormData('constructionDuration', value)} suffix="months" defaultValue="36" tooltip="Total time allocated for the construction phase in months." />
          <InputField label="Construction End Date" type="date" value={formData?.constructionEndDate} tooltip="The calculated date when construction completes." onChange={(value) => updateFormData('constructionEndDate', value)} defaultValue="2029-07-01" calculated />
          <InputField label="Operations Start Date" type="date" value={formData?.operationsStartDate} tooltip="The date commercial operations and revenue generation begin." onChange={(value) => updateFormData('operationsStartDate', value)} defaultValue="2029-07-01" />
          <InputField label="Operations Duration" type="number" value={formData?.operationsDuration} suffix="years" onChange={(value) => updateFormData('operationsDuration', value)} defaultValue="25" tooltip="The total operational life span of the project used for the model." />
        </div>
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-6 border-t border-border space-y-6"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Capacity & Production Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Total Plant/Factory Capacity"
              type="number"
              defaultValue="100000"
              value={formData?.totalCapacity}
              tooltip="The maximum production output the plant is designed for (at 100% load)."
              onChange={(value) => updateFormData('totalCapacity', value)}
            />
            <InputField
              label="Capacity Unit"
              type="select"
              value={formData?.capacityUnit}
              tooltip="The unit of measurement for your project's output capacity."
              options={["bpd (barrels per day)", "tons/day", "MW (Megawatts)", "units/month", "sq.ft", "sq.m", "kg/day", "liters/day", "other"]}
              defaultValue="bpd (barrels per day)"
              onChange={(value) => updateFormData('capacityUnit', value)}
            />
            <InputField
              label="Maximum Plant Availability"
              type="number"
              suffix="%"
              defaultValue="90"
              value={formData?.maximumPlantAvailability}
              tooltip="The percentage of time the plant is operational after factoring in routine maintenance."
              onChange={(value) => updateFormData('maximumPlantAvailability', value)}
            />
            <InputField
              label="Availability During TAM Year"
              type="number"
              suffix="%"
              defaultValue="80"
              value={formData?.availabilityDuringTam}
              tooltip="Plant availability during years where Turn Around Maintenance (TAM) occurs."
              onChange={(value) => updateFormData('availabilityDuringTam', value)}
            />
            <InputField
              label="Commissioning Availability"
              type="number"
              suffix="%"
              defaultValue="60"
              value={formData?.commissioningAvailability}
              tooltip="Expected availability during the initial ramp-up or commissioning period."
              onChange={(value) => updateFormData('commissioningAvailability', value)}
            />
            <InputField
              label="Factory Capacity Multiplier"
              type="number"
              defaultValue="0.25"

              tooltip="A scaling factor applied to the total capacity for specific calculation adjustments."

              value={formData?.factoryCapacityMultiplier}
              onChange={(val) => updateFormData('factoryCapacityMultiplier', Number(val))}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Phase Implementation (if applicable)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Number of Phases" type="select" tooltip="Select if the project is built in a single stage or multiple stages." options={["Single Phase", "2 Phases", "3 Phases", "4+ Phases"]} defaultValue="Single Phase"
                value={formData?.numberOfPhases}
                onChange={(val) => updateFormData('numberOfPhases', val)}
              />
              <InputField label="Phase I Capacity" type="number" defaultValue="100000"
                tooltip="Output capacity specifically for the first phase of development."
                value={formData?.phaseICapacity}
                onChange={(val) => updateFormData('phaseICapacity', Number(val))}
              />
              <InputField label="Phase II Capacity" type="number" defaultValue="0"
                tooltip="Additional output capacity added during the second phase expansion."
                value={formData?.phaseIiCapacity}
                onChange={(val) => updateFormData('phaseIiCapacity', Number(val))}
              />
              <InputField label="Total Capacity (All Phases)" type="number" tooltip="The cumulative capacity once all phases are complete." defaultValue="100000" calculated
                value={formData?.totalCapacityAllPhases}
                onChange={(val) => updateFormData('totalCapacityAllPhases', Number(val))}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Time Constraints</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Days in Year" type="number" defaultValue="365" size="sm"
                tooltip="Number of days in a year used for financial and operational indexing."
                value={formData?.daysInYear}
                onChange={(val) => updateFormData('daysInYear', Number(val))}
              />
              <InputField label="Hours in Day" type="number" defaultValue="24" size="sm"
                tooltip="Number of operational hours in a standard production day."
                value={formData?.hoursInDay}
                onChange={(val) => updateFormData('hoursInDay', Number(val))}
              />
              <InputField label="Hours in Year" tooltip="Total hours operating in a standard calendar year." type="number" defaultValue="8760" calculated size="sm"
                value={formData?.hoursInYear}
                onChange={(val) => updateFormData('hoursInYear', Number(val))}
              />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// MACRO & GENERAL ASSUMPTIONS FORM
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Macro Economic & General Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define global parameters for your financial model</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Reporting Currency"
          type="select"
          options={["USD ($)", "NGN (₦)", "EUR (€)", "GBP (£)", "JPY (¥)"]}
          defaultValue="USD ($)"
          value={formData?.reportingCurrency}
          tooltip="The primary currency used for all financial statements and calculations."
          onChange={(value) => updateFormData('reportingCurrency', value)}

        />
        <InputField
          label="Exchange Rate (Local/USD)"
          type="number"
          defaultValue="1470"
          value={formData?.exchangeRate}
          tooltip="Local currency units per 1 USD (e.g., NGN/USD)."
          onChange={(value) => updateFormData('exchangeRate', value)}
        />
        <InputField label="Base Year" type="number" tooltip="The first year of the financial model (Year 0/1)." value={formData?.baseYear} defaultValue="2025" onChange={(value) => updateFormData('baseYear', value)} />
        <InputField
          label="Periodicity"
          type="select"
          options={["Monthly", "Quarterly", "Semi-Annually", "Annually"]}
          defaultValue="Annually"
          value={formData?.periodicity}
          tooltip="The time frequency for generated financial reports (e.g., Annual vs Quarterly updates)."
          onChange={(value) => updateFormData('periodicity', value)}
        />
        <InputField label="Number of Years in Model" type="number" value={formData?.numberOfYears} onChange={(value) => updateFormData('numberOfYears', value)} defaultValue="28" tooltip="Total forecast horizon for the project evaluation." />
        <InputField label="Model Tolerance" type="number" defaultValue="0.001" value={formData?.modelTolerance} onChange={(value) => updateFormData('modelTolerance', value)} tooltip="Maximum allowable error margin for balance sheet balancing." />
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Inflation Assumptions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Local Inflation Rate"
            type="number"
            suffix="%"
            defaultValue="15.0"
            value={formData?.localInflationRate}
            tooltip="Projected annual inflation rate for the local market currency."
            onChange={(value) => updateFormData('localInflationRate', value)}
          />
          <InputField
            label="US/Foreign Inflation Rate"
            type="number"
            suffix="%"
            defaultValue="2.5"
            value={formData?.foreignInflationRate}
            tooltip="Projected annual inflation rate for US Dollar (USD) or international benchmark."
            onChange={(value) => updateFormData('foreignInflationRate', value)}
          />
          <InputField
            label="Long-term Target Inflation"
            type="number"
            suffix="%"
            defaultValue="9.0"
            tooltip="The equilibrium inflation rate reached after the initial high-growth/volatile period."

            value={formData?.longTermTargetInflation}
            onChange={(val) => updateFormData('longTermTargetInflation', Number(val))}
          />
          <InputField
            label="Revenue/OpEx Escalation Rate (USD)"
            type="number"
            suffix="%"
            defaultValue="2.5"
            tooltip="Annual percentage increase applied to revenues and operational costs denominated in USD."

            value={formData?.revenueOpexEscalationRateUsd}
            onChange={(val) => updateFormData('revenueOpexEscalationRateUsd', Number(val))}
          />
        </div>
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Financial Rates & Benchmarks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Discount Rate / WACC"
              type="number"
              suffix="%"
              defaultValue="12.5"
              value={formData?.discountRateWacc}
              tooltip="Weighted Average Cost of Capital, used to discount future cash flows to Net Present Value (NPV)."
              onChange={(value) => updateFormData('discountRateWacc', value)}
            />
            <InputField
              label="Risk-Free Rate"
              type="number"
              suffix="%"
              defaultValue="4.5"
              value={formData?.riskFreeRate}
              tooltip="Theoretical return on an investment with 0% risk, typically the 10-year US Treasury yield."
              onChange={(value) => updateFormData('riskFreeRate', value)}
            />
            <InputField
              label="Benchmark Rate"
              type="select"
              options={["SOFR", "MPR (Monetary Policy Rate)", "LIBOR", "Prime Rate", "Other"]}
              defaultValue="SOFR"
              value={formData?.benchmarkRateType}
              tooltip="The reference interest rate used for debt calculation (e.g., Secured Overnight Financing Rate)."
              onChange={(value) => updateFormData('benchmarkRate', value)}
            />
            <InputField
              label="Benchmark Rate Value"
              type="number"
              suffix="%"
              defaultValue="5.0"
              tooltip="Current benchmark rate value"
              value={formData?.benchmarkRateValue}
              onChange={(value) => updateFormData('benchMarkRateValue', value)}
            />
            <InputField
              label="Terminal Growth Rate"
              type="number"
              suffix="%"
              defaultValue="3.0"
              tooltip="Perpetual growth rate for terminal value"
              value={formData?.terminalGrowthRate}
              onChange={(value) => updateFormData('terminalGrowthRate', value)}
            />
            <InputField
              label="Contingency Buffer"
              type="number"
              suffix="%"
              defaultValue="4.0"
              tooltip="General contingency percentage"
              value={formData?.contingencyBuffer}
              onChange={(value) => updateFormData('contingencyBuffer', value)}
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// REVENUE ASSUMPTIONS FORM (with dynamic product support)
function RevenueForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general"
  detailMode: boolean
}) {
  const [numProducts, setNumProducts] = useState(1)

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Assumptions</h3>
        <p className="text-sm text-muted-foreground">Configure revenue streams and growth assumptions</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium">Number of Revenue Streams/Products</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setNumProducts(Math.max(1, numProducts - 1))}
            disabled={numProducts <= 1}
          >
            <X className="w-4 h-4" />
          </Button>
          <span className="text-lg font-bold w-8 text-center">{numProducts}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setNumProducts(Math.min(10, numProducts + 1))}
            disabled={numProducts >= 10}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product-specific inputs */}
      {Array.from({ length: numProducts }).map((_, idx) => (
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
                onClick={() => setNumProducts(numProducts - 1)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label={projectType === "real-estate" ? "Building/Unit Type" : "Product/Service Name"}
              type="text"
              tooltip="The specific name or category of the revenue-generating asset or product."
              value={formData.revenueProducts[idx]?.productName}
              onChange={(value) => updateRevenueProduct(idx, 'productName', value)}
              placeholder={
                projectType === "real-estate" ? "e.g., 4-Bedroom Apartment" :
                  projectType === "manufacturing" ? "e.g., Gasoline, Diesel, Urea" :
                    projectType === "energy" ? "e.g., Energy Sales, Capacity Payments" :
                      "e.g., Product A"
              }
            />
            <InputField
              label="Unit of Measure"
              type="select"
              tooltip="The standard unit used to quantify sales (e.g., Barrels, MWh, Units)."
              value={formData.revenueProducts[idx]?.unitOfMeasure}
              onChange={(value) => updateRevenueProduct(idx, 'unitOfMeasure', value)}
              options={
                projectType === "real_estate"
                  ? ["sq.ft", "sq.m", "units", "acres"]
                  : projectType === "manufacturing"
                    ? ["barrels", "tons", "liters", "kg", "pieces", "MT"]
                    : (projectType === "energy" || projectType === "oil_gas")
                      ? ["MWh", "kWh", "MW", "GWh"]
                      : ["units", "pieces", "kg", "liters"]
              }
              defaultValue={
                formData?.industrySector === "Real Estate" ? "sq.ft" :
                  formData?.industrySector === "Manufacturing" ? "barrels" :
                    (formData?.industrySector === "Energy & Power" || formData?.industrySector === "Oil & Gas") ? "MWh" :
                      "units"
              }
            />

            {formData?.industrySector === "Real Estate" || projectType === "real_estate" ? (
              <>
                <InputField label="Number of Units" type="number" defaultValue="18"
                  tooltip="The total count of buildings or apartments of this specific type."
                  value={formData?.numberOfUnits}
                  onChange={(val) => updateFormData('numberOfUnits', Number(val))}
                />
                <InputField label="GBA (Gross Building Area)" type="number" suffix="sq.m" defaultValue="456"
                  tooltip="The total floor area inside the building envelope, including external walls."
                  value={formData?.gbaGrossBuildingArea}
                  onChange={(val) => updateFormData('gbaGrossBuildingArea', Number(val))}
                />
                <InputField label="Lettable Area" type="number" suffix="sq.m" defaultValue="387.6" tooltip="The total area that can be rented out to tenants (usually GBA minus common areas)." calculated
                  value={formData?.lettableArea}
                  onChange={(val) => updateFormData('lettableArea', Number(val))}
                />
                <InputField label="Sale Price per Unit" type="number" prefix="$" defaultValue="250000"
                  tooltip="The expected average market price for selling one unit of this type."
                  value={formData?.salePricePerUnit}
                  onChange={(val) => updateFormData('salePricePerUnit', Number(val))}
                />
              </>
            ) : (
              <>
                <InputField label="Year 1 Sales Volume" type="number" tooltip="The total number of units expected to be sold in the first operational year." onChange={(value) => updateRevenueProduct(idx, 'year1SalesVolume', Number(value))} defaultValue="500000" value={formData.revenueProducts[idx]?.year1SalesVolume} />
                <InputField label="Unit Price (Year 1)" type="number" tooltip="The selling price per unit in the first year of operations." onChange={(value) => updateRevenueProduct(idx, 'unitPriceYear1', Number(value))} prefix="$" defaultValue="120" value={formData.revenueProducts[idx]?.unitPriceYear1} />
                <InputField label="Volume Growth Rate" type="number" tooltip="The annual percentage increase in the quantity of units sold." onChange={(value) => updateRevenueProduct(idx, 'volumeGrowthRate', Number(value))} suffix="%" defaultValue="5.0" value={formData.revenueProducts[idx]?.volumeGrowthRate} />
                <InputField label="Price Escalation Rate" type="number" tooltip="The annual percentage increase in the unit selling price (usually inflation-linked)." onChange={(value) => updateRevenueProduct(idx, 'priceEscalationRate', Number(value))} suffix="%" defaultValue="2.5" value={formData.revenueProducts[idx]?.priceEscalationRate} />
              </>
            )}
          </div>
        </div>
      ))}

      {detailMode && (
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
              tooltip="Days Sales Outstanding: The average number of days it takes to collect payment after a sale."
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
                  tooltip="The duration (in months) it takes for sales to reach steady-state capacity."
                  value={formData?.revenueRampUpPeriod}
                  onChange={(val) => updateFormData('revenueRampUpPeriod', Number(val))}
                />
                <InputField
                  label="Seasonal Adjustment Factor"
                  type="number"
                  defaultValue="1.0"
                  tooltip="A multiplier used to account for monthly fluctuations in demand (1.0 = baseline)."
                  value={formData?.seasonalAdjustmentFactor}
                  onChange={(val) => updateFormData('seasonalAdjustmentFactor', Number(val))}
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
                  tooltip="The total time expected to sell or lease all available inventory."
                  value={formData?.salesAbsorptionPeriod}
                  onChange={(val) => updateFormData('salesAbsorptionPeriod', Number(val))}
                />
                <InputField
                  label="Pre-sales / Off-plan %"
                  type="number"
                  suffix="%"
                  defaultValue="30"
                  tooltip="The percentage of total inventory sold before the project construction is finished."
                  value={formData?.preSalesOffPlanPct}
                  onChange={(val) => updateFormData('preSalesOffPlanPct', Number(val))}
                />
              </>
            )}
            <InputField
              label="Market Share Target"
              type="number"
              suffix="%"
              defaultValue="15.0"
              tooltip="The portion of the total addressable market the project aims to capture."

              value={formData?.marketShareTarget}
              onChange={(val) => updateFormData('marketShareTarget', Number(val))}
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// OPERATING EXPENSES FORM (project-type aware)
function OpexForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Operating Expenses (OpEx)</h3>
        <p className="text-sm text-muted-foreground">Define operational costs and expense assumptions</p>
      </div>

      {(projectType === "manufacturing" || projectType === "energy" || projectType === "oil_gas") && (
        <div className="pt-0">
          <h4 className="text-sm font-semibold text-foreground mb-4">Raw Materials & Variable Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Raw Material Cost (per unit)"
              type="number"
              prefix="$"
              defaultValue="45"
              tooltip="The direct cost of primary raw materials required to produce one unit of output."

              value={formData?.rawMaterialCostPerUnit}
              onChange={(val) => updateFormData('rawMaterialCostPerUnit', Number(val))}
            />
            <InputField
              label="Raw Material Price Escalation"
              type="number"
              suffix="%"
              defaultValue="3.0"
              tooltip="The projected annual percentage increase in raw material pricing."

              value={formData?.rawMaterialPriceEscalation}
              onChange={(val) => updateFormData('rawMaterialPriceEscalation', Number(val))}
            />
            <InputField
              label="Variable Cost as % of Revenue"
              type="number"
              suffix="%"
              defaultValue="35"
              tooltip="An aggregate variable cost estimate calculated as a direct percentage of gross sales."

              value={formData?.variableCostAsPctOfRevenue}
              onChange={(val) => updateFormData('variableCostAsPctOfRevenue', Number(val))}
            />
            {(projectType === "energy" || projectType === "oil_gas") && (
              <InputField
                label="Fuel/Gas Cost"
                type="number"
                prefix="$"
                suffix="/MMBTU"
                defaultValue="3.5"
                tooltip="The feedstock cost for energy production, denominated per Million British Thermal Units."

                value={formData?.fuelGasCost}
                onChange={(val) => updateFormData('fuelGasCost', Number(val))}
              />
            )}
          </div>
        </div>
      )}

      <div className={projectType === "manufacturing" || projectType === "energy" ? "pt-6 border-t border-border" : "pt-0"}>
        <h4 className="text-sm font-semibold text-foreground mb-4">Labor & Personnel Costs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Total Headcount" type="number" defaultValue="250"
            tooltip="The total number of full-time equivalent (FTE) employees across all departments."
            value={formData?.totalHeadcount}
            onChange={(val) => updateFormData('totalHeadcount', Number(val))}
          />
          <InputField
            label="Average Annual Salary"
            type="number"
            prefix="$"
            defaultValue="45000"
            tooltip="The weighted average yearly base salary per employee before benefits."

            value={formData?.averageAnnualSalary}
            onChange={(val) => updateFormData('averageAnnualSalary', Number(val))}
          />
          <InputField
            label="Salary Escalation Rate"
            type="number"
            suffix="%"
            defaultValue="5.0"
            tooltip="The expected annual percentage increase in employee wages."

            value={formData?.salaryEscalationRate}
            onChange={(val) => updateFormData('salaryEscalationRate', Number(val))}
          />
          <InputField
            label="Benefits & Payroll Tax"
            type="number"
            suffix="% of salary"
            defaultValue="25"
            tooltip="Combined employer costs for health insurance, pensions, and statutory payroll taxes."

            value={formData?.benefitsPayrollTax}
            onChange={(val) => updateFormData('benefitsPayrollTax', Number(val))}
          />
          <InputField
            label="Total Annual Staff Cost"
            type="number"
            prefix="$"
            defaultValue="14062500"
            calculated
            tooltip="The calculated total yearly labor expense: Headcount × Avg Salary × (1 + Benefits%)."
            value={formData?.totalAnnualStaffCost}
            onChange={(val) => updateFormData('totalAnnualStaffCost', Number(val))}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Utilities & Facilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Power/Electricity Cost"
            type="number"
            prefix="$"
            suffix="/year"
            defaultValue="300000"
            tooltip="Annual expenditure for electricity supply to the facilities."
            value={formData?.powerElectricityCost}
            onChange={(val) => updateFormData('powerElectricityCost', Number(val))}
          />
          <InputField
            label="Water & Gas Utilities"
            type="number"
            prefix="$"
            suffix="/year"
            defaultValue="100000"
            tooltip="Annual expenditure for water supply and natural gas utilities."
            value={formData?.waterGasUtilities}
            onChange={(val) => updateFormData('waterGasUtilities', Number(val))}
          />
          <InputField
            label="Utilities Escalation Rate"
            type="number"
            suffix="%"
            defaultValue="4.0"
            tooltip="The projected annual percentage increase in utility tariff rates."
            value={formData?.utilitiesEscalationRate}
            onChange={(val) => updateFormData('utilitiesEscalationRate', Number(val))}
          />
          {(formData?.industrySector === "Energy & Power" || formData?.industrySector === "Oil & Gas") && (
            <InputField
              label="Fuel/Gas Cost"
              type="number"
              prefix="$"
              suffix="/MMBTU"
              defaultValue="3.50"
              tooltip="The cost of natural gas or fuel used for power generation or industrial heating."
              value={formData?.fuelGasCost}
              onChange={(val) => updateFormData('fuelGasCost', Number(val))}
            />
          )}
          {projectType === "real-estate" && (
            <InputField
              label="Property Management"
              type="number"
              suffix="% of revenue"
              defaultValue="5.0"
              tooltip="Fees paid to third-party management firms for operating the property assets."
              value={formData?.propertyManagement}
              onChange={(val) => updateFormData('propertyManagement', Number(val))}
            />
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Maintenance & Insurance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Regular Maintenance"
            type="number"
            suffix="% of revenue"
            defaultValue="2.5"
            tooltip="Annual provision for routine preventive and corrective maintenance activities."

            value={formData?.regularMaintenance}
            onChange={(val) => updateFormData('regularMaintenance', Number(val))}
          />
          <InputField
            label="Insurance (Annual)"
            type="number"
            prefix="$"
            defaultValue="200000"
            tooltip="Comprehensive annual premiums for property, casualty, and operational risk insurance."

            value={formData?.insuranceAnnual}
            onChange={(val) => updateFormData('insuranceAnnual', Number(val))}
          />
          {(projectType === "manufacturing" || projectType === "energy") && (
            <>
              <InputField
                label="Turn Around Maintenance (TAM) Cost"
                type="number"
                prefix="$"
                defaultValue="2000000"
                tooltip="The lump-sum cost of a scheduled, large-scale plant shutdown for overhaul and inspections."

                value={formData?.turnAroundMaintenanceTamCost}
                onChange={(val) => updateFormData('turnAroundMaintenanceTamCost', Number(val))}
              />
              <InputField
                label="TAM Frequency"
                type="number"
                suffix="years"
                defaultValue="5"
                tooltip="Years between major maintenance"

                value={formData?.tamFrequency}
                onChange={(val) => updateFormData('tamFrequency', Number(val))}
              />
            </>
          )}
        </div>
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Additional Operating Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Marketing & Sales"
              type="number"
              suffix="% of revenue"
              defaultValue="8.0"

              value={formData?.marketingSales}
              onChange={(val) => updateFormData('marketingSales', Number(val))}
            />
            <InputField
              label="Administrative Expenses"
              type="number"
              prefix="$"
              suffix="/year"
              defaultValue="150000"

              value={formData?.administrativeExpenses}
              onChange={(val) => updateFormData('administrativeExpenses', Number(val))}
            />
            <InputField
              label="Rent & Facilities"
              type="number"
              prefix="$"
              suffix="/year"
              defaultValue="120000"

              value={formData?.rentFacilities}
              onChange={(val) => updateFormData('rentFacilities', Number(val))}
            />
            <InputField
              label="Technology & Software"
              type="number"
              prefix="$"
              suffix="/year"
              defaultValue="50000"

              value={formData?.technologySoftware}
              onChange={(val) => updateFormData('technologySoftware', Number(val))}
            />
            <InputField
              label="Professional Fees"
              type="number"
              prefix="$"
              suffix="/year"
              defaultValue="75000"
              tooltip="Legal, accounting, consulting"

              value={formData?.professionalFees}
              onChange={(val) => updateFormData('professionalFees', Number(val))}
            />
            <InputField
              label="Payables Days (DPO)"
              type="number"
              suffix="days"
              defaultValue="30"
              tooltip="Days to pay suppliers"

              value={formData?.payablesDaysDpo}
              onChange={(val) => updateFormData('payablesDaysDpo', Number(val))}
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// CAPITAL EXPENDITURE FORM (project-type aware)
function CapexForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Capital Expenditure (CAPEX)</h3>
        <p className="text-sm text-muted-foreground">Define initial investment and capital spending</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Land Cost"
          type="number"
          prefix="$"
          defaultValue="13711180"
          tooltip="The total acquisition cost of the project site, including brokerage and legal fees."

          value={formData?.landCost}
          onChange={(val) => updateFormData('landCost', Number(val))}
        />
        <InputField
          label={projectType === "real_estate" ? "Construction Cost" : "Building & Civil Works"}
          type="number"
          prefix="$"
          defaultValue="109626400"
          tooltip="Total direct costs for building construction, site development, and civil infrastructure."
          value={formData?.constructionBuildingCost}
          onChange={(val) => updateFormData('constructionBuildingCost', Number(val))}
        />
        <InputField
          label="Equipment & Machinery"
          type="number"
          prefix="$"
          defaultValue="20554950"
          tooltip="Cost of purchasing and installing industrial machinery, specialized tools, and plant equipment."

          value={formData?.equipmentMachinery}
          onChange={(val) => updateFormData('equipmentMachinery', Number(val))}
        />
        <InputField
          label="Furniture, Fixtures & Equipment (FFE)"
          type="number"
          prefix="$"
          defaultValue="6851650"
          tooltip="Movable furniture, specialized fixtures, and administrative equipment not permanently attached to the building."

          value={formData?.furnitureFixturesEquipmentFfe}
          onChange={(val) => updateFormData('furnitureFixturesEquipmentFfe', Number(val))}
        />
      </div>

      {projectType === "real_estate" && detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Real Estate Specific Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Multi-Storey Car Park Cost" type="number" prefix="$" defaultValue="27735000"
              tooltip="Dedicated construction budget for parking facilities."
              value={formData?.multiStoreyCarParkCost}
              onChange={(val) => updateFormData('multiStoreyCarParkCost', Number(val))}
            />
            <InputField label="Amenities Cost" type="number" prefix="$" defaultValue="8638875"
              tooltip="Costs for recreational facilities like pools, gyms, and community centers."
              value={formData?.amenitiesCost}
              onChange={(val) => updateFormData('amenitiesCost', Number(val))}
            />
            <InputField label="Apartment Construction" type="number" prefix="$" defaultValue="29661375"
              tooltip="Direct construction costs specifically for residential units."
              value={formData?.apartmentConstruction}
              onChange={(val) => updateFormData('apartmentConstruction', Number(val))}
            />
            <InputField label="Hotel/Commercial Construction" type="number" prefix="$" defaultValue="60000000"
              tooltip="Direct construction costs for commercial or hospitality segments."
              value={formData?.hotelCommercialConstruction}
              onChange={(val) => updateFormData('hotelCommercialConstruction', Number(val))}
            />
          </div>
        </motion.div>
      )}

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Additional Costs & Fees</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Contingency"
            type="number"
            suffix="% of total capex"
            defaultValue="4.0"
            tooltip="An additional budget provision to cover unforeseen costs and price fluctuations."

            value={formData?.contingency}
            onChange={(val) => updateFormData('contingency', Number(val))}
          />
          <InputField
            label="Professional Fees"
            type="number"
            suffix="% of capex"
            defaultValue="5.0"
            tooltip="Fees for project stakeholders like Architects, Quantity Surveyors, and Engineers."

            value={formData?.professionalFees}
            onChange={(val) => updateFormData('professionalFees', Number(val))}
          />
          <InputField
            label="Permits & Approvals"
            type="number"
            suffix="% of capex"
            defaultValue="1.0"
            tooltip="Statutory fees paid for building permits and environmental approvals."

            value={formData?.permitsApprovals}
            onChange={(val) => updateFormData('permitsApprovals', Number(val))}
          />
          <InputField
            label="VAT on Construction"
            type="number"
            suffix="%"
            defaultValue="7.5"
            tooltip="Value Added Tax applied to construction contracts and materials."

            value={formData?.vatOnConstruction}
            onChange={(val) => updateFormData('vatOnConstruction', Number(val))}
          />
          <InputField
            label="Total Hard Costs"
            type="number"
            prefix="$"
            defaultValue="150744180"
            tooltip="The sum of direct physical construction and land costs (excludes financing and soft fees)."
            calculated
            value={formData?.totalHardCosts}
            onChange={(val) => updateFormData('totalHardCosts', Number(val))}
          />
          <InputField
            label="Total CAPEX (incl. soft costs)"
            type="number"
            prefix="$"
            defaultValue="173012634"
            tooltip="The comprehensive initial investment before accounting for capitalized interest."
            calculated
            value={formData?.totalCapex}
            onChange={(val) => updateFormData('totalCapex', Number(val))}
          />
        </div>
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Capitalized Interest & Financing Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Capitalize Interest During Construction"
              type="select"
              options={["Yes", "No"]}
              defaultValue="Yes"
              tooltip="If 'Yes', loan interest during construction is added to the asset cost instead of being expensed."

              value={formData?.capitalizeInterestDuringConstruction}
              onChange={(val) => updateFormData('capitalizeInterestDuringConstruction', val)}
            />
            <InputField
              label="Construction Loan Interest Rate"
              type="number"
              suffix="%"
              defaultValue="8.5"
              tooltip="The specific interest rate applied to drawdowns during the construction period."

              value={formData?.constructionLoanInterestRate}
              onChange={(val) => updateFormData('constructionLoanInterestRate', Number(val))}
            />
            <InputField
              label="Interest During Construction"
              type="number"
              prefix="$"
              defaultValue="11202824"
              tooltip="The total dollar amount of interest accrued before the project becomes operational."
              calculated
              value={formData?.interestDuringConstruction}
              onChange={(val) => updateFormData('interestDuringConstruction', Number(val))}
            />
            <InputField
              label="Total Development Cost"
              type="number"
              prefix="$"
              defaultValue="184215458"
              tooltip="The grand total of all CAPEX, fees, and capitalized interest (Final Project Cost)."
              calculated
              value={formData?.totalDevelopmentCost}
              onChange={(val) => updateFormData('totalDevelopmentCost', Number(val))}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">CAPEX Drawdown/Phasing Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField label="Year 1" type="number" suffix="%" defaultValue="30" size="sm"
                tooltip="Percentage of total CAPEX spent in the first construction year."
                value={formData?.year1}
                onChange={(val) => updateFormData('year1', Number(val))}
              />
              <InputField label="Year 2" type="number" suffix="%" defaultValue="50" size="sm"
                tooltip="Percentage of total CAPEX spent in the second construction year."
                value={formData?.year2}
                onChange={(val) => updateFormData('year2', Number(val))}
              />
              <InputField label="Year 3" type="number" suffix="%" defaultValue="20" size="sm"
                tooltip="Percentage of total CAPEX spent in the third construction year."
                value={formData?.year3}
                onChange={(val) => updateFormData('year3', Number(val))}
              />
              <InputField label="Total" tooltip="Sum of annual drawdowns (must equal 100%)." type="number" suffix="%" defaultValue="100" calculated size="sm"
                value={formData?.totalDrawdown}
                onChange={(val) => updateFormData('totalDrawdown', Number(val))}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Ongoing Capital Expenditure</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Replacement CAPEX"
                type="number"
                suffix="% of revenue"
                defaultValue="3.0"
                tooltip="Annual percentage of revenue set aside for replacing worn-out equipment or upgrades."

                value={formData?.replacementCapex}
                onChange={(val) => updateFormData('replacementCapex', Number(val))}
              />
              <InputField
                label="Expansion CAPEX (if applicable)"
                type="number"
                prefix="$"
                defaultValue="0"
                tooltip="Specific capital allocated for increasing the project's capacity in future years."

                value={formData?.expansionCapexIfApplicable}
                onChange={(val) => updateFormData('expansionCapexIfApplicable', Number(val))}
              />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// DEBT & FINANCING FORM
function DebtForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
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
          <InputField
            label="Total Project Cost"
            type="number"
            prefix="$"
            defaultValue="184215458"
            calculated
            tooltip="The comprehensive project cost that requires funding (Final Development Cost)."
            value={formData?.totalProjectCost}
            onChange={(val) => updateFormData('totalProjectCost', Number(val))}
          />
          <InputField
            label="Equity Percentage"
            type="number"
            suffix="%"
            defaultValue="23.9"
            tooltip="The portion of the project cost funded by shareholders' capital."

            value={formData?.equityPercentage}
            onChange={(val) => updateFormData('equityPercentage', Number(val))}
          />
          <InputField
            label="Equity Amount"
            type="number"
            prefix="$"
            defaultValue="43983691"
            tooltip="Calculated dollar amount of equity needed based on the percentage."
            calculated
            value={formData?.equityAmount}
            onChange={(val) => updateFormData('equityAmount', Number(val))}
          />
          <InputField
            label="Debt Percentage"
            type="number"
            suffix="%"
            defaultValue="43.0"
            tooltip="The portion of the project cost funded by external bank loans or bonds."

            value={formData?.debtPercentage}
            onChange={(val) => updateFormData('debtPercentage', Number(val))}
          />
          <InputField
            label="Debt Amount"
            type="number"
            prefix="$"
            defaultValue="79155515"
            tooltip="Calculated dollar amount of debt needed based on the percentage."
            calculated
            value={formData?.debtAmount}
            onChange={(val) => updateFormData('debtAmount', Number(val))}
          />
          <InputField
            label="Off-Plan Sales / Pre-sales %"
            type="number"
            suffix="%"
            defaultValue="33.2"
            tooltip="Funding derived from customer deposits before completion (common in Real Estate)."

            value={formData?.offPlanSalesPreSalesPct}
            onChange={(val) => updateFormData('offPlanSalesPreSalesPct', Number(val))}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Debt Terms & Conditions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Interest Rate Type"
            type="select"
            options={["Fixed", "Floating", "Mixed"]}
            defaultValue="Floating"
            tooltip="Select whether the interest rate remains constant or changes based on market benchmarks."

            value={formData?.interestRateType}
            onChange={(val) => updateFormData('interestRateType', val)}
          />
          <InputField
            label="Base Rate"
            type="select"
            options={["SOFR", "MPR", "LIBOR", "Prime Rate", "Other"]}
            defaultValue="SOFR"
            tooltip="The reference benchmark rate (e.g., SOFR for US Dollars)."

            value={formData?.baseRate}
            onChange={(val) => updateFormData('baseRate', val)}
          />
          <InputField
            label="Base Rate Value"
            type="number"
            suffix="%"
            defaultValue="5.0"
            tooltip="The current percentage value of the selected benchmark rate."

            value={formData?.baseRateValue}
            onChange={(val) => updateFormData('baseRateValue', Number(val))}
          />
          <InputField
            label="Interest Margin/Spread"
            type="number"
            suffix="%"
            defaultValue="3.5"
            tooltip="The additional interest percentage added by the lender over the base rate."

            value={formData?.interestMarginSpread}
            onChange={(val) => updateFormData('interestMarginSpread', Number(val))}
          />
          <InputField
            label="All-in Interest Rate"
            type="number"
            suffix="%"
            defaultValue="8.5"
            calculated
            tooltip="The total effective interest rate (Base Rate + Margin)."
            value={formData?.allInInterestRate}
            onChange={(val) => updateFormData('allInInterestRate', Number(val))}
          />
          <InputField
            label="Loan Tenor"
            type="number"
            suffix="years"
            defaultValue="15"
            tooltip="The total duration of the loan from first drawdown to final repayment."

            value={formData?.loanTenor}
            onChange={(val) => updateFormData('loanTenor', Number(val))}
          />
        </div>
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Advanced Debt Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Grace Period"
              type="number"
              suffix="months"
              defaultValue="36"
              tooltip="The moratorium period (in months) where only interest is paid before principal repayments begin."

              value={formData?.gracePeriod}
              onChange={(val) => updateFormData('gracePeriod', Number(val))}
            />
            <InputField
              label="Repayment Type"
              type="select"
              options={["Amortizing (Equal Installments)", "Bullet (Lump Sum)", "Sculpted (Custom Schedule)"]}
              defaultValue="Amortizing (Equal Installments)"
              tooltip="The structure for paying back the loan principal."

              value={formData?.repaymentType}
              onChange={(val) => updateFormData('repaymentType', val)}
            />
            <InputField
              label="DSRA Requirement"
              type="number"
              suffix="months"
              defaultValue="6"
              tooltip="Debt Service Reserve Account: The number of months of debt service required to be kept in reserve."

              value={formData?.dsraRequirement}
              onChange={(val) => updateFormData('dsraRequirement', Number(val))}
            />
            <InputField
              label="DSRA Funding Source"
              type="select"
              options={["Cash", "Letter of Credit", "Mixed"]}
              defaultValue="Cash"
              tooltip="The method used to fund the debt service reserve account."

              value={formData?.dsraFundingSource}
              onChange={(val) => updateFormData('dsraFundingSource', val)}
            />
            <InputField
              label="Upfront Fees"
              type="number"
              suffix="% of loan"
              defaultValue="2.0"
              tooltip="One-time transactional fees paid to lenders at the time of loan closing."

              value={formData?.upfrontFees}
              onChange={(val) => updateFormData('upfrontFees', Number(val))}
            />
            <InputField
              label="Commitment Fee"
              type="number"
              suffix="% p.a."
              defaultValue="0.5"
              tooltip="An annual fee charged on the undisbursed portion of the loan facility."

              value={formData?.commitmentFee}
              onChange={(val) => updateFormData('commitmentFee', Number(val))}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Debt Drawdown Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Drawdown Linked To"
                type="select"
                options={["CAPEX Schedule", "Custom Schedule", "Equal Drawdowns"]}
                defaultValue="CAPEX Schedule"
                tooltip="Determines how loan funds are released (usually follows actual construction spending)."

                value={formData?.drawdownLinkedTo}
                onChange={(val) => updateFormData('drawdownLinkedTo', val)}
              />
              <InputField
                label="Drawdown Frequency"
                type="select"
                options={["Monthly", "Quarterly", "Milestone-based"]}
                defaultValue="Quarterly"
                tooltip="The frequency at which loan funds are disbursed from the lender."

                value={formData?.drawdownFrequency}
                onChange={(val) => updateFormData('drawdownFrequency', val)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// TAX ASSUMPTIONS FORM
function TaxForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Assumptions</h3>
        <p className="text-sm text-muted-foreground">Configure tax rates and policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Corporate Income Tax Rate"
          type="number"
          suffix="%"
          defaultValue="30.0"
          tooltip="The standard statutory tax rate applied to the company's taxable profits."

          value={formData?.corporateIncomeTaxRate}
          onChange={(val) => updateFormData('corporateIncomeTaxRate', Number(val))}
        />
        <InputField
          label="Tax Holiday Period"
          type="number"
          suffix="years"
          defaultValue="0"
          tooltip="The initial period (in years) where the project is exempt from paying corporate income tax (e.g., Pioneer Status)."

          value={formData?.taxHolidayPeriod}
          onChange={(val) => updateFormData('taxHolidayPeriod', Number(val))}
        />
        <InputField
          label="Minimum Tax Rate"
          type="number"
          suffix="%"
          defaultValue="0.5"
          tooltip="A tax floor based on gross turnover, applicable if the calculated CIT is lower than this amount."

          value={formData?.minimumTaxRate}
          onChange={(val) => updateFormData('minimumTaxRate', Number(val))}
        />
        <InputField
          label="VAT/Sales Tax Rate"
          type="number"
          suffix="%"
          defaultValue="7.5"
          tooltip="Value Added Tax applied to the sale of goods and services."

          value={formData?.vatSalesTaxRate}
          onChange={(val) => updateFormData('vatSalesTaxRate', Number(val))}
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Withholding Taxes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="WHT on Dividends"
              type="number"
              suffix="%"
              defaultValue="10.0"
              tooltip="Tax withheld at source on dividend payments to shareholders."

              value={formData?.whtOnDividends}
              onChange={(val) => updateFormData('whtOnDividends', Number(val))}
            />
            <InputField
              label="WHT on Interest"
              type="number"
              suffix="%"
              defaultValue="10.0"
              tooltip="Tax withheld at source on interest payments to lenders."

              value={formData?.whtOnInterest}
              onChange={(val) => updateFormData('whtOnInterest', Number(val))}
            />
            <InputField
              label="WHT on Services"
              type="number"
              suffix="%"
              defaultValue="5.0"
              tooltip="Tax withheld on payments made for professional and technical services."

              value={formData?.whtOnServices}
              onChange={(val) => updateFormData('whtOnServices', Number(val))}
            />
            <InputField
              label="WHT on Rent"
              type="number"
              suffix="%"
              defaultValue="10.0"
              tooltip="Tax withheld on lease or rental payments for land and buildings."

              value={formData?.whtOnRent}
              onChange={(val) => updateFormData('whtOnRent', Number(val))}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Other Tax Provisions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Education Tax"
                type="number"
                suffix="% of assessable profit"
                defaultValue="2.5"
                tooltip="Tertiary education tax applied to assessable profits (specific to Nigeria)."

                value={formData?.educationTax}
                onChange={(val) => updateFormData('educationTax', Number(val))}
              />
              <InputField
                label="Tax Loss Carryforward Period"
                type="number"
                suffix="years"
                defaultValue="5"
                tooltip="The number of years that operational losses can be used to reduce future taxable income."

                value={formData?.taxLossCarryforwardPeriod}
                onChange={(val) => updateFormData('taxLossCarryforwardPeriod', Number(val))}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Capital Allowances (Tax Depreciation)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Initial Allowance"
                type="number"
                suffix="%"
                defaultValue="25.0"
                tooltip="The percentage of capital expenditure that can be deducted for tax purposes in the first year of acquisition."

                value={formData?.initialAllowance}
                onChange={(val) => updateFormData('initialAllowance', Number(val))}
              />
              <InputField
                label="Annual Allowance"
                type="number"
                suffix="%"
                defaultValue="20.0"
                tooltip="The annual percentage deduction for tax depreciation in subsequent years."

                value={formData?.annualAllowance}
                onChange={(val) => updateFormData('annualAllowance', Number(val))}
              />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// WORKING CAPITAL FORM
function WorkingCapitalForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Working Capital Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define working capital requirements and cash cycle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Initial Working Capital"
          type="number"
          suffix="% of Year 1 OpEx"
          defaultValue="30.0"
          tooltip="The amount of cash required at the start of operations, expressed as a percentage of first-year OpEx."

          value={formData?.initialWorkingCapital}
          onChange={(val) => updateFormData('initialWorkingCapital', Number(val))}
        />
        <InputField
          label="Receivables Days (DSO)"
          type="number"
          suffix="days"
          defaultValue="45"
          tooltip="Days Sales Outstanding: The average number of days it takes to collect cash from customers after a sale."

          value={formData?.receivablesDaysDso}
          onChange={(val) => updateFormData('receivablesDaysDso', Number(val))}
        />
        <InputField
          label="Inventory Days (DIO)"
          type="number"
          suffix="days"
          defaultValue="60"
          tooltip="Days Inventory Outstanding: The average number of days you hold raw materials or finished goods before selling them."

          value={formData?.inventoryDaysDio}
          onChange={(val) => updateFormData('inventoryDaysDio', Number(val))}
        />
        <InputField
          label="Payables Days (DPO)"
          type="number"
          suffix="days"
          defaultValue="30"
          tooltip="Days Payables Outstanding: The average number of days you take to pay your suppliers and creditors."

          value={formData?.payablesDaysDpo}
          onChange={(val) => updateFormData('payablesDaysDpo', Number(val))}
        />
        <InputField
          label="Cash Cycle (Days)"
          type="number"
          suffix="days"
          defaultValue="75"
          calculated
          tooltip="The net duration of the cash conversion cycle: DSO + DIO - DPO."
          value={formData?.cashCycleDays}
          onChange={(val) => updateFormData('cashCycleDays', Number(val))}
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Additional Working Capital Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Working Capital as % of Revenue"
              type="number"
              suffix="%"
              defaultValue="10.0"
              tooltip="The target level of net working capital maintained as a percentage of gross revenue."

              value={formData?.workingCapitalAsPctOfRevenue}
              onChange={(val) => updateFormData('workingCapitalAsPctOfRevenue', Number(val))}
            />
            <InputField
              label="Minimum Cash Balance"
              type="number"
              prefix="$"
              defaultValue="1000000"
              tooltip="The absolute minimum cash reserve the company must hold for operational safety."

              value={formData?.minimumCashBalance}
              onChange={(val) => updateFormData('minimumCashBalance', Number(val))}
            />
            <InputField
              label="Working Capital Funding"
              type="select"
              options={["From Equity", "From Debt", "From Operations", "Mixed"]}
              defaultValue="From Equity"
              tooltip="The primary source of funds used to bridge working capital shortfalls."

              value={formData?.workingCapitalFunding}
              onChange={(val) => updateFormData('workingCapitalFunding', val)}
            />
            <InputField
              label="WC Reserve Account"
              type="select"
              options={["Yes", "No"]}
              defaultValue="No"
              tooltip="Specifies if a dedicated bank account is maintained specifically for working capital reserves."

              value={formData?.wcReserveAccount}
              onChange={(val) => updateFormData('wcReserveAccount', val)}
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// DEPRECIATION FORM
function DepreciationForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Depreciation & Amortization</h3>
        <p className="text-sm text-muted-foreground">Define asset depreciation policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Depreciation Method"
          type="select"
          options={["Straight Line", "Declining Balance", "Units of Production", "Sum of Years Digits"]}
          defaultValue="Straight Line"
          tooltip="The accounting method used to allocate the cost of assets over their useful lives."

          value={formData?.depreciationMethod}
          onChange={(val) => updateFormData('depreciationMethod', val)}
        />
        <InputField
          label="Overall Weighted Average Life"
          type="number"
          suffix="years"
          defaultValue="20"
          tooltip="The blended average useful life (in years) calculated across all tangible assets in the model."

          value={formData?.overallWeightedAverageLife}
          onChange={(val) => updateFormData('overallWeightedAverageLife', Number(val))}
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Asset Category Details</h4>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-foreground mb-3">Land & Land Improvements</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Land Value" type="number" prefix="$" defaultValue="13711180" size="sm"
                  tooltip="Total value assigned to land (note: land value is typically not depreciated)."
                  value={formData?.landValue}
                  onChange={(val) => updateFormData('landValue', Number(val))}
                />
                <InputField label="Useful Life" type="number" suffix="years" defaultValue="0" size="sm" tooltip="Expected duration of asset use. Set to 0 for non-depreciable assets like land."
                  value={formData?.usefulLife}
                  onChange={(val) => updateFormData('usefulLife', Number(val))}
                />
                <InputField label="Residual Value" tooltip="Scrap or salvage expected value of an asset at end of life." type="number" suffix="%" defaultValue="100" size="sm" calculated
                  value={formData?.residualValue}
                  onChange={(val) => updateFormData('residualValue', Number(val))}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-foreground mb-3">Buildings & Structures</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Value" type="number" prefix="$" defaultValue="109626400" size="sm"
                  tooltip="The total book value of buildings and permanent civil works."
                  value={formData?.value}
                  onChange={(val) => updateFormData('value', Number(val))}
                />
                <InputField label="Useful Life" type="number" suffix="years" defaultValue="40" size="sm"
                  tooltip="The estimated number of years the building structure will be used."
                  value={formData?.usefulLife}
                  onChange={(val) => updateFormData('usefulLife', Number(val))}
                />
                <InputField label="Residual Value" type="number" suffix="%" defaultValue="10" size="sm"
                  tooltip="The salvage value of the building as a percentage of its initial cost at the end of its life."
                  value={formData?.residualValue}
                  onChange={(val) => updateFormData('residualValue', Number(val))}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-foreground mb-3">Plant, Equipment & Machinery</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Value" type="number" prefix="$" defaultValue="20554950" size="sm"
                  value={formData?.value}
                  onChange={(val) => updateFormData('value', Number(val))}
                />
                <InputField label="Useful Life" type="number" suffix="years" defaultValue="15" size="sm"
                  value={formData?.usefulLife}
                  onChange={(val) => updateFormData('usefulLife', Number(val))}
                />
                <InputField label="Residual Value" type="number" suffix="%" defaultValue="5" size="sm"
                  value={formData?.residualValue}
                  onChange={(val) => updateFormData('residualValue', Number(val))}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-foreground mb-3">Furniture, Fixtures & Equipment</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Value" type="number" prefix="$" defaultValue="6851650" size="sm"
                  value={formData?.value}
                  onChange={(val) => updateFormData('value', Number(val))}
                />
                <InputField label="Useful Life" type="number" suffix="years" defaultValue="7" size="sm"
                  value={formData?.usefulLife}
                  onChange={(val) => updateFormData('usefulLife', Number(val))}
                />
                <InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm"
                  value={formData?.residualValue}
                  onChange={(val) => updateFormData('residualValue', Number(val))}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-foreground mb-3">Vehicles & IT Equipment</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Value" type="number" prefix="$" defaultValue="1000000" size="sm"
                  value={formData?.value}
                  onChange={(val) => updateFormData('value', Number(val))}
                />
                <InputField label="Useful Life" type="number" suffix="years" defaultValue="5" size="sm"
                  value={formData?.usefulLife}
                  onChange={(val) => updateFormData('usefulLife', Number(val))}
                />
                <InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm"
                  value={formData?.residualValue}
                  onChange={(val) => updateFormData('residualValue', Number(val))}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// DIVIDEND FORM
function DividendForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Dividend & Shareholder Assumptions</h3>
        <p className="text-sm text-muted-foreground">Configure dividend policy and shareholder returns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Dividend Payout Ratio"
          type="number"
          suffix="% of net income"
          defaultValue="15.0"
          tooltip="Percentage of profits distributed as dividends"

          value={formData?.dividendPayoutRatio}
          onChange={(val) => updateFormData('dividendPayoutRatio', Number(val))}
        />
        <InputField
          label="Dividend Payment Frequency"
          type="select"
          options={["Annually", "Semi-Annually", "Quarterly", "None"]}
          defaultValue="Annually"

          value={formData?.dividendPaymentFrequency}
          onChange={(val) => updateFormData('dividendPaymentFrequency', val)}
        />
        <InputField
          label="Minimum Cash Before Dividend"
          type="number"
          prefix="$"
          defaultValue="5000000"
          tooltip="Required cash buffer before paying dividends"

          value={formData?.minimumCashBeforeDividend}
          onChange={(val) => updateFormData('minimumCashBeforeDividend', Number(val))}
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Advanced Dividend Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Minimum DSCR for Dividend"
              type="number"
              defaultValue="1.3"
              tooltip="Minimum debt service coverage ratio before paying dividends"

              value={formData?.minimumDscrForDividend}
              onChange={(val) => updateFormData('minimumDscrForDividend', Number(val))}
            />
            <InputField
              label="Minimum LLCR for Dividend"
              type="number"
              defaultValue="1.5"
              tooltip="Minimum loan life coverage ratio"

              value={formData?.minimumLlcrForDividend}
              onChange={(val) => updateFormData('minimumLlcrForDividend', Number(val))}
            />
            <InputField
              label="Preferred Dividend Rate"
              type="number"
              suffix="% p.a."
              defaultValue="0"
              tooltip="For preferred shares if applicable"

              value={formData?.preferredDividendRate}
              onChange={(val) => updateFormData('preferredDividendRate', Number(val))}
            />
            <InputField
              label="Share Buyback Provision"
              type="select"
              options={["Yes", "No"]}
              defaultValue="No"

              value={formData?.shareBuybackProvision}
              onChange={(val) => updateFormData('shareBuybackProvision', val)}
            />
            <InputField
              label="Dividend Withholding Tax"
              type="number"
              suffix="%"
              defaultValue="10.0"

              value={formData?.dividendWithholdingTax}
              onChange={(val) => updateFormData('dividendWithholdingTax', Number(val))}
            />
            <InputField
              label="Dividend Reinvestment Option"
              type="select"
              options={["Yes", "No"]}
              defaultValue="No"
              tooltip="DRIP - Dividend Reinvestment Plan"

              value={formData?.dividendReinvestmentOption}
              onChange={(val) => updateFormData('dividendReinvestmentOption', val)}
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// EXIT & VALUATION FORM
function ValuationForm({
  formData,
  updateFormData,
  updateRevenueProduct,
  addRevenueProduct,
  removeRevenueProduct,
  projectType,
  detailMode
}: {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  updateRevenueProduct: (index: number, field: string, value: any) => void
  addRevenueProduct: () => void
  removeRevenueProduct: (index: number) => void
  projectType: "manufacturing" | "real-estate" | "energy" | "general"
  detailMode: boolean
}) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Exit & Valuation Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define exit strategy and valuation parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Exit Year"
          type="number"
          defaultValue="10"
          tooltip="Year of exit from investment (from operations start)"

          value={formData?.exitYear}
          onChange={(val) => updateFormData('exitYear', Number(val))}
        />
        <InputField
          label="Exit Multiple (EV/EBITDA)"
          type="number"
          suffix="x"
          defaultValue="8.5"
          tooltip="Enterprise Value / EBITDA multiple"

          value={formData?.exitMultipleEvEbitda}
          onChange={(val) => updateFormData('exitMultipleEvEbitda', Number(val))}
        />
        <InputField
          label="Terminal Growth Rate"
          type="number"
          suffix="%"
          defaultValue="3.0"
          tooltip="Perpetual growth rate for terminal value calculation"

          value={formData?.terminalGrowthRate}
          onChange={(val) => updateFormData('terminalGrowthRate', Number(val))}
        />
        <InputField
          label="Discount Rate for NPV"
          type="number"
          suffix="%"
          defaultValue="12.5"
          tooltip="Discount rate for net present value calculations"

          value={formData?.discountRateForNpv}
          onChange={(val) => updateFormData('discountRateForNpv', Number(val))}
        />
        <InputField
          label="Target IRR"
          type="number"
          suffix="%"
          defaultValue="18.0"
          tooltip="Target internal rate of return"

          value={formData?.targetIrr}
          onChange={(val) => updateFormData('targetIrr', Number(val))}
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-4">Alternative Valuation Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="P/E Multiple"
              type="number"
              suffix="x"
              defaultValue="12.0"
              tooltip="Price to Earnings multiple"

              value={formData?.pEMultiple}
              onChange={(val) => updateFormData('pEMultiple', Number(val))}
            />
            <InputField
              label="Price/Book Multiple"
              type="number"
              suffix="x"
              defaultValue="2.5"
              tooltip="Price to Book Value multiple"

              value={formData?.priceBookMultiple}
              onChange={(val) => updateFormData('priceBookMultiple', Number(val))}
            />
            <InputField
              label="Revenue Multiple"
              type="number"
              suffix="x"
              defaultValue="1.5"
              tooltip="Enterprise Value / Revenue multiple"

              value={formData?.revenueMultiple}
              onChange={(val) => updateFormData('revenueMultiple', Number(val))}
            />
            <InputField
              label="Asset Sale Value (if applicable)"
              type="number"
              prefix="$"
              defaultValue="0"
              tooltip="If selling assets instead of equity"

              value={formData?.assetSaleValueIfApplicable}
              onChange={(val) => updateFormData('assetSaleValueIfApplicable', Number(val))}
            />
            <InputField
              label="Transaction Costs"
              type="number"
              suffix="% of exit value"
              defaultValue="3.0"
              tooltip="M&A advisory, legal, tax costs"

              value={formData?.transactionCosts}
              onChange={(val) => updateFormData('transactionCosts', Number(val))}
            />
            <InputField
              label="Valuation Method"
              type="select"
              options={["DCF (Discounted Cash Flow)", "Multiple-based", "Asset-based", "Hybrid"]}
              defaultValue="DCF (Discounted Cash Flow)"

              value={formData?.valuationMethod}
              onChange={(val) => updateFormData('valuationMethod', val)}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Return Metrics Targets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Target Equity IRR"
                type="number"
                suffix="%"
                defaultValue="20.0"
                tooltip="Target return on equity"

                value={formData?.targetEquityIrr}
                onChange={(val) => updateFormData('targetEquityIrr', Number(val))}
              />
              <InputField
                label="Target Project IRR"
                type="number"
                suffix="%"
                defaultValue="15.0"
                tooltip="Target unlevered project return"

                value={formData?.targetProjectIrr}
                onChange={(val) => updateFormData('targetProjectIrr', Number(val))}
              />
              <InputField
                label="Payback Period Target"
                type="number"
                suffix="years"
                defaultValue="7"
                tooltip="Desired payback period"

                value={formData?.paybackPeriodTarget}
                onChange={(val) => updateFormData('paybackPeriodTarget', Number(val))}
              />
              <InputField
                label="Minimum MOIC"
                type="number"
                suffix="x"
                defaultValue="2.5"
                tooltip="Multiple on Invested Capital"

                value={formData?.minimumMoic}
                onChange={(val) => updateFormData('minimumMoic', Number(val))}
              />
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

// INPUT FIELD COMPONENT
function InputField({
  label,
  type = "text",
  name,
  value,
  prefix,
  suffix,
  defaultValue,
  calculated = false,
  tooltip,
  options,
  placeholder,
  onChange,
  size = "default",
}: {
  label: string
  type?: "text" | "number" | "select" | "date"
  name?: string
  value?: string | number
  prefix?: string
  suffix?: string
  defaultValue?: string | number
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
            className={`w-full px-3 ${inputClasses} border rounded-lg ${calculated
              ? "bg-blue-50/50 border-blue-200/70 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              : "bg-blue-50 border-blue-200 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              }`}
            value={value !== undefined ? value : (defaultValue || '')}
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
            className={`w-full ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-20" : "pr-3"} ${inputClasses} border rounded-lg ${calculated
              ? "bg-blue-50/50 border-blue-200/70 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              : "bg-blue-50 border-blue-200 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              }`}
            value={value !== undefined ? value : (defaultValue || '')}
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