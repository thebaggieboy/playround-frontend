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
import { InputField } from "../../../../../components/forms/advanced/InputField"
import { RevenueForm } from "../../../../../components/forms/advanced/RevenueForm"
import { OpexForm } from "../../../../../components/forms/advanced/OpexForm"
import { CapexForm } from "../../../../../components/forms/advanced/CapexForm"
import { MacroForm } from "../../../../../components/forms/advanced/MacroForm"
import { DebtForm } from "../../../../../components/forms/advanced/DebtForm"
import { TaxForm } from "../../../../../components/forms/advanced/TaxForm"
import { WorkingCapitalForm } from "../../../../../components/forms/advanced/WorkingCapitalForm"
import { DepreciationForm } from "../../../../../components/forms/advanced/DepreciationForm"
import { DividendForm } from "../../../../../components/forms/advanced/DividendForm"
import { ValuationForm } from "../../../../../components/forms/advanced/ValuationForm"

import { INDUSTRY_SUB_TYPES } from "../../../../../components/forms/advanced/IndustryConfig"
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
  industrySubType: string
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
  const [inputMode, setInputMode] = useState<"essential" | "standard" | "expert">("standard")
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
        industry_sub_type: formData.industrySubType,
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
        reporting_currency: (formData.reportingCurrency || 'USD').split(' ')[0],
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
        revenue_model_type: product.revenueModelType || 'Volume × Price',
        unit_of_measure: product.unitOfMeasure,
        currency: product.currency || 'USD ($)',
        year_1_sales_volume: product.year1SalesVolume,
        unit_price_year_1: product.unitPriceYear1,
        volume_growth_rate: product.volumeGrowthRate,
        price_escalation_rate: product.priceEscalationRate,
        capacity_factor: product.capacityFactor,
        tariff_rate: product.tariffRate,
        take_or_pay_pct: product.takeOrPayPct,
        tariff_escalation: product.tariffEscalation,
        initial_customers: product.initialCustomers,
        arpu_monthly: product.arpuMonthly,
        customer_growth_rate: product.customerGrowthRate,
        churn_rate: product.churnRate,
        number_of_units: product.numberOfUnits || product.number_of_units || formData.numberOfUnits,
        rent_per_unit: product.rentPerUnit,
        occupancy_rate: product.occupancyRate,
        lease_escalation: product.leaseEscalation,
        contract_value: product.contractValue,
        contract_duration: product.contractDuration,
        gba_gross_building_area: product.gbaGrossBuildingArea || product.gba_gross_building_area || formData.gbaGrossBuildingArea,
        lettable_area: product.lettableArea || product.lettable_area || formData.lettableArea,
        sale_price_per_unit: product.sale_price_per_unit || formData.salePricePerUnit,
        receivables_days_dso: product.receivables_days_dso || formData.receivablesDaysDso,
        revenue_rampup_months: product.revenue_rampup_months || formData.revenueRampUpPeriod,
        seasonal_adjustment_factor: product.seasonal_adjustment_factor || formData.seasonalAdjustmentFactor || 1.0,
        sales_absorption_period_months: product.sales_absorption_period_months || formData.salesAbsorptionPeriod,
        presales_offplan_percentage: product.presales_offplan_percentage || formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct,
        custom_parameters: product.customParameters || []
      })),
      operating_expenses: {
        total_headcount: formData.totalHeadcount,
        average_annual_salary: formData.averageAnnualSalary,
        salary_escalation_rate: formData.salaryEscalationRate,
        benefits_payroll_tax_pct: formData.benefitsPayrollTaxPct || formData.benefitsPayrollTax,
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
        custom_opex_items: formData.customOpexItems || [],
        custom_parameters_opex: formData.customParametersOpex || [],
        template_opex: Object.keys(formData).filter(k => k.startsWith('templateOpex_')).reduce((acc, key) => { acc[key] = formData[key]; return acc; }, {})
      },
      capital_expenditure: {
        land_cost: formData.landCost || formData.landValue,
        construction_building_cost: formData.constructionBuildingCost || formData.buildingCivilWorks,
        equipment_machinery_cost: formData.equipmentMachineryCost || formData.plantMachineryEquipment,
        ffe_cost: formData.ffeCost || formData.ffeFurnitureFixtures,
        vehicles_it_equipment: formData.vehiclesItEquipment,
        project_contingency: formData.projectContingency,
        pre_operating_expenses: formData.preOperatingExpenses,
        initial_working_capital: formData.initialWorkingCapital,
        carpark_cost: formData.carpark_cost || formData.multiStoreyCarParkCost,
        amenities_cost: formData.amenities_cost || formData.amenitiesCost,
        apartment_construction_cost: formData.apartment_construction_cost || formData.apartmentConstruction,
        hotel_commercial_cost: formData.hotel_commercial_cost || formData.hotelCommercialConstruction,
        contingency_pct: formData.contingencyPct || formData.contingency,
        professional_fees_pct: formData.professionalFeesPct || formData.professionalFees,
        permits_approvals_pct: formData.permitsApprovalsPct || formData.permitsApprovals,
        vat_on_construction_pct: formData.vatOnConstructionPct || formData.vatOnConstruction,
        capitalize_interest: formData.capitalizeInterestDuringConstruction || true,
        construction_loan_interest_rate: formData.constructionLoanInterestRate || 8.5,
        year_1_drawdown_pct: formData.drawdownYear1 || 60,
        year_2_drawdown_pct: formData.drawdownYear2 || 30,
        year_3_drawdown_pct: formData.drawdownYear3 || 10,
        year_4_drawdown_pct: formData.drawdownYear4 || 0,
        year_5_drawdown_pct: formData.drawdownYear5 || 0,
        replacement_capex_pct_revenue: formData.replacement_capex_pct_revenue || formData.replacementCapex || 3.0,
        expansion_capex: formData.expansion_capex || formData.expansionCapexIfApplicable || 0,
        custom_capex_items: formData.customCapexItems || [],
        custom_parameters_capex: formData.customParametersCapex || []
      },
      debt_financing: {
        equity_percentage: formData.equityPercentage,
        debt_percentage: formData.debtPercentage,
        offplan_presales_percentage: formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct || null,
        interest_rate_type: formData.interestRateType || "Floating",
        base_rate_type: formData.baseRateType,
        base_rate_value: formData.baseRateValue,
        interest_margin_spread: formData.interestMarginSpread,
        loan_tenor_years: formData.loanTenorYears,
        grace_period_months: formData.gracePeriodMonths || 36,
        repayment_type: formData.repaymentType || "Amortizing (Equal Installments)",
        dsra_requirement_months: formData.dsraRequirementMonths || 6,
        dsra_funding_source: formData.dsraFundingSource || "Cash",
        upfront_fees_pct: formData.upfrontFeesPct || 2.0,
        commitment_fee_pct: formData.commitmentFeePct || 0.5,
        drawdown_linked_to: formData.drawdownLinkedTo || "CAPEX Schedule",
        drawdown_frequency: formData.drawdownFrequency || "Quarterly",
        custom_debt_tranches: formData.customDebtTranches || [],
        custom_parameters_debt: formData.customParametersDebt || []
      },
      tax_assumptions: {
        corporate_income_tax_rate: formData.corporateIncomeTaxRate,
        tax_holiday_years: formData.taxHolidayYears || 0,
        minimum_tax_rate: formData.minimumTaxRate || 0.5,
        vat_sales_tax_rate: formData.vatSalesTaxRate,
        wht_dividends: formData.whtDividends || 10.0,
        wht_interest: formData.whtInterest || 10.0,
        wht_services: formData.whtServices || 5.0,
        wht_rent: formData.whtRent || 10.0,
        education_tax_pct: formData.educationTaxPct || 2.5,
        tax_loss_carryforward_years: formData.taxLossCarryforwardYears || 5,
        initial_allowance_pct: formData.initialAllowancePct || 25.0,
        annual_allowance_pct: formData.annualAllowancePct || 20.0,
        custom_taxes: formData.customTaxes || [],
        custom_parameters_tax: formData.customParametersTax || []
      },
      working_capital: {
        initial_wc_pct_year1_opex: formData.initialWorkingCapital || 30.0,
        receivables_days_dso: formData.receivablesDaysDso,
        inventory_days_dio: formData.inventoryDaysDio,
        payables_days_dpo: formData.payablesDaysDpo,
        wc_pct_revenue: formData.workingCapitalAsPctOfRevenue || 10.0,
        minimum_cash_balance: formData.minimumCashBalance || 1000000,
        wc_funding_source: formData.workingCapitalFunding || "From Equity",
        wc_reserve_account: formData.wcReserveAccount === "Yes",
      },
      depreciation_schedules: formData.assetClassDepreciation?.length > 0 ? formData.assetClassDepreciation : [
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
      custom_parameters_depreciation: formData.customParametersDepreciation || [],
      dividend_policy: {
        dividend_payout_ratio_pct: formData.dividendPayoutRatio || formData.dividendPayoutRatioPct,
        dividend_payment_frequency: formData.dividendPaymentFrequency || "Annually",
        minimum_cash_before_dividend: formData.minimumCashBeforeDividend || 5000000,
        minimum_dscr_for_dividend: formData.minimumDscrForDividend || 1.3,
        minimum_llcr_for_dividend: formData.minimumLlcrForDividend || 1.5,
        preferred_dividend_rate_pct: formData.preferredDividendRate || 0,
        share_buyback_provision: formData.shareBuybackProvision === "Yes",
        dividend_wht_pct: formData.dividendWithholdingTax || 10.0,
        dividend_reinvestment_option: formData.dividendReinvestmentOption === "Yes",
      },
      exit_valuation: {
        exit_year: formData.exitYear,
        exit_multiple_ev_ebitda: formData.exitMultipleEvEbitda,
        terminal_growth_rate_pct: formData.terminalGrowthRate || formData.terminalGrowthRatePct,
        discount_rate_npv_pct: formData.discountRateForNpv || formData.discountRateNpvPct,
        target_irr_pct: formData.targetIrr || formData.targetIrrPct,
        pe_multiple: formData.pEMultiple || 12.0,
        price_book_multiple: formData.priceBookMultiple || 2.5,
        revenue_multiple: formData.revenueMultiple || 1.5,
        asset_sale_value: formData.assetSaleValueIfApplicable || 0,
        transaction_costs_pct: formData.transactionCosts || 3.0,
        valuation_method: formData.valuationMethod || "DCF (Discounted Cash Flow)",
        target_equity_irr_pct: formData.targetEquityIrr || 20.0,
        target_project_irr_pct: formData.targetProjectIrr || 15.0,
        payback_period_target_years: formData.paybackPeriodTarget || 7,
        minimum_moic: formData.minimumMoic || 2.5,
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
                  const next = !inputMode
                  setInputMode(next)
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
                {inputMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {inputMode ? "Simple" : "Detailed"}
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
                  inputMode={inputMode}
                  onProjectTypeChange={setProjectType}
                />
              )}
              {activeTab === "macro" && (
                <MacroForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "revenue" && (
                <RevenueForm
                  formData={formData}
                  updateFormData={updateFormData}
                  updateRevenueProduct={updateRevenueProduct}
                  addRevenueProduct={addRevenueProduct}
                  removeRevenueProduct={removeRevenueProduct}
                  inputMode={inputMode}
                  projectType={projectType}
                />
              )}
              {activeTab === "opex" && (
                <OpexForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                  projectType={projectType}
                />
              )}
              {activeTab === "capex" && (
                <CapexForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                  projectType={projectType}
                />
              )}
              {activeTab === "debt" && (
                <DebtForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "tax" && (
                <TaxForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "working-capital" && (
                <WorkingCapitalForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "depreciation" && (
                <DepreciationForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "dividend" && (
                <DividendForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
                />
              )}
              {activeTab === "valuation" && (
                <ValuationForm
                  formData={formData}
                  updateFormData={updateFormData}
                  inputMode={inputMode}
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
  inputMode,
  onProjectTypeChange
}: {
  formData: any
  updateFormData: (field: string, value: any) => void
  inputMode: "essential" | "standard" | "expert"
  onProjectTypeChange: (type: "manufacturing" | "real_estate" | "energy" | "oil_gas" | "healthcare" | "technology" | "agriculture" | "infrastructure" | "general") => void
}) {
  const { INDUSTRY_SUB_TYPES } = require("../../../../../components/forms/advanced/IndustryConfig");
  const { Card } = require("@/components/ui/card");
  const { InputField } = require("../../../../../components/forms/advanced/InputField");
  const { motion } = require("framer-motion");

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
        
        {INDUSTRY_SUB_TYPES[formData?.industrySector || "Manufacturing"] && formData?.industrySector !== "Other" && (
          <InputField
            label="Industry Sub-Type"
            type="select"
            value={formData?.industrySubType}
            options={INDUSTRY_SUB_TYPES[formData?.industrySector || "Manufacturing"]}
            defaultValue={INDUSTRY_SUB_TYPES[formData?.industrySector || "Manufacturing"][0]}
            onChange={(val) => updateFormData('industrySubType', val)}
          />
        )}
        {formData?.industrySector === "Other" && (
          <InputField
            label="Custom Industry Name"
            type="text"
            value={formData?.projectName}
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

      {inputMode !== "essential" && (
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
