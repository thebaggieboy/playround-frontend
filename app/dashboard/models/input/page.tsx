"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type TabType = "general" | "revenue" | "expenses" | "capital" | "historical"
type ScenarioType = "base" | "upside" | "downside"

export default function InputModelPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general")
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("base")
  const [detailMode, setDetailMode] = useState(false)

  const tabs = [
    { id: "general" as TabType, label: "General & Macro", icon: Settings },
    { id: "revenue" as TabType, label: "Revenue Drivers", icon: DollarSign },
    { id: "expenses" as TabType, label: "Operating Expenses", icon: Users },
    { id: "capital" as TabType, label: "Capital & Debt", icon: CreditCard },
    { id: "historical" as TabType, label: "Historical Data", icon: History },
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
            <p className="text-sm text-muted-foreground mt-1">Build your financial model from scratch</p>
          </div>

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
                  <p className="text-xs text-muted-foreground">Switch between simple and detailed inputs</p>
                </div>
              </div>
              <Button onClick={() => setDetailMode(!detailMode)} variant="outline" size="sm" className="gap-2">
                {detailMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {detailMode ? "Simple" : "Detailed"}
              </Button>
            </div>
          </Card>

          {/* Form Content */}
          {activeTab === "general" && <GeneralForm detailMode={detailMode} />}
          {activeTab === "revenue" && <RevenueForm detailMode={detailMode} />}
          {activeTab === "expenses" && <ExpensesForm detailMode={detailMode} />}
          {activeTab === "capital" && <CapitalForm detailMode={detailMode} />}
          {activeTab === "historical" && <HistoricalForm detailMode={detailMode} />}

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                Save as Template
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button className="gap-2">
                <Play className="w-4 h-4" />
                Generate Model
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function GeneralForm({ detailMode }: { detailMode: boolean }) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">General & Macro Assumptions</h3>
        <p className="text-sm text-muted-foreground">Define global parameters for your financial model</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Currency"
          type="select"
          options={["USD", "EUR", "GBP", "JPY"]}
          defaultValue="USD"
          tooltip="Primary currency for all calculations"
        />
        <InputField label="Base Year" type="number" defaultValue="2025" tooltip="Starting year for your model" />
        <InputField
          label="Periodicity"
          type="select"
          options={["Monthly", "Quarterly", "Annually"]}
          defaultValue="Annually"
          tooltip="Frequency of financial reporting periods"
        />
        <InputField
          label="Model Duration (Years)"
          type="number"
          defaultValue="5"
          tooltip="Number of years to forecast"
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border"
        >
          <InputField
            label="Inflation Rate (%)"
            type="number"
            defaultValue="2.5"
            calculated={false}
            tooltip="Expected annual inflation rate"
          />
          <InputField
            label="Corporate Tax Rate (%)"
            type="number"
            defaultValue="21"
            calculated={false}
            tooltip="Applicable corporate income tax rate"
          />
          <InputField
            label="Discount Rate / WACC (%)"
            type="number"
            defaultValue="10"
            calculated={false}
            tooltip="Weighted Average Cost of Capital for NPV calculations"
          />
          <InputField
            label="Risk-Free Rate (%)"
            type="number"
            defaultValue="4.5"
            calculated={false}
            tooltip="Government bond rate for financial calculations"
          />
        </motion.div>
      )}
    </Card>
  )
}

function RevenueForm({ detailMode }: { detailMode: boolean }) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Drivers</h3>
        <p className="text-sm text-muted-foreground">Configure revenue assumptions and growth rates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Initial Revenue (Year 1)"
          type="number"
          prefix="$"
          defaultValue="1000000"
          calculated={false}
          tooltip="Starting annual revenue"
        />
        <InputField
          label="Revenue Growth Rate (%)"
          type="number"
          defaultValue="15"
          calculated={false}
          tooltip="Expected annual revenue growth percentage"
        />
        <InputField
          label="Number of Products/Services"
          type="number"
          defaultValue="3"
          tooltip="Product lines or service offerings"
        />
        <InputField
          label="Average Unit Price"
          type="number"
          prefix="$"
          defaultValue="99"
          calculated={false}
          tooltip="Average price per unit sold"
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Customer Acquisition Rate (Monthly)"
              type="number"
              defaultValue="100"
              calculated={false}
              tooltip="New customers acquired per month"
            />
            <InputField
              label="Customer Churn Rate (%)"
              type="number"
              defaultValue="5"
              calculated={false}
              tooltip="Percentage of customers lost per period"
            />
            <InputField
              label="Upsell/Cross-sell Rate (%)"
              type="number"
              defaultValue="12"
              calculated={false}
              tooltip="Revenue increase from existing customers"
            />
            <InputField
              label="Seasonal Adjustment Factor"
              type="number"
              defaultValue="1.0"
              calculated={false}
              tooltip="Multiplier for seasonal revenue variations"
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

function ExpensesForm({ detailMode }: { detailMode: boolean }) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Operating Expenses</h3>
        <p className="text-sm text-muted-foreground">Define costs and expense assumptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Cost of Goods Sold (% of Revenue)"
          type="number"
          defaultValue="30"
          calculated={false}
          tooltip="Direct costs as percentage of revenue"
        />
        <InputField label="Total Headcount" type="number" defaultValue="25" tooltip="Total number of employees" />
        <InputField
          label="Average Salary (Annual)"
          type="number"
          prefix="$"
          defaultValue="75000"
          calculated={false}
          tooltip="Average annual employee compensation"
        />
        <InputField
          label="Marketing & Sales (% of Revenue)"
          type="number"
          defaultValue="20"
          calculated={false}
          tooltip="Marketing expenses as percentage of revenue"
        />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Rent & Facilities (Annual)"
              type="number"
              prefix="$"
              defaultValue="120000"
              calculated={false}
              tooltip="Office rent and facility costs"
            />
            <InputField
              label="Technology & Software (Annual)"
              type="number"
              prefix="$"
              defaultValue="50000"
              calculated={false}
              tooltip="Software licenses and IT infrastructure"
            />
            <InputField
              label="Professional Services (Annual)"
              type="number"
              prefix="$"
              defaultValue="30000"
              calculated={false}
              tooltip="Legal, accounting, consulting fees"
            />
            <InputField
              label="Other Operating Expenses (Annual)"
              type="number"
              prefix="$"
              defaultValue="25000"
              calculated={false}
              tooltip="Miscellaneous operational costs"
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

function CapitalForm({ detailMode }: { detailMode: boolean }) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Capital & Debt Structure</h3>
        <p className="text-sm text-muted-foreground">Configure financing and capital expenditure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Initial Equity Investment"
          type="number"
          prefix="$"
          defaultValue="500000"
          calculated={false}
          tooltip="Starting equity capital injection"
        />
        <InputField
          label="Debt Principal"
          type="number"
          prefix="$"
          defaultValue="200000"
          calculated={false}
          tooltip="Total borrowed amount"
        />
        <InputField
          label="Interest Rate (%)"
          type="number"
          defaultValue="6.5"
          calculated={false}
          tooltip="Annual interest rate on debt"
        />
        <InputField label="Loan Term (Years)" type="number" defaultValue="5" tooltip="Duration of debt repayment" />
      </div>

      {detailMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 pt-6 border-t border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="CAPEX (% of Revenue)"
              type="number"
              defaultValue="5"
              calculated={false}
              tooltip="Capital expenditures as percentage of revenue"
            />
            <InputField
              label="Depreciation Period (Years)"
              type="number"
              defaultValue="7"
              tooltip="Asset depreciation timeframe"
            />
            <InputField
              label="Working Capital Days"
              type="number"
              defaultValue="45"
              calculated={false}
              tooltip="Days of working capital required"
            />
            <InputField
              label="Dividend Payout Ratio (%)"
              type="number"
              defaultValue="0"
              calculated={false}
              tooltip="Percentage of profits paid as dividends"
            />
          </div>
        </motion.div>
      )}
    </Card>
  )
}

function HistoricalForm({ detailMode }: { detailMode: boolean }) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Historical Data</h3>
        <p className="text-sm text-muted-foreground">Input previous financial statements for accuracy</p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Historical Data Import</p>
              <p className="text-xs text-blue-700 mt-1">
                Upload CSV or manually enter 2-3 years of historical financial data
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Year 1 Revenue"
            type="number"
            prefix="$"
            defaultValue="750000"
            calculated={false}
            tooltip="Total revenue from previous year"
          />
          <InputField
            label="Year 2 Revenue"
            type="number"
            prefix="$"
            defaultValue="900000"
            calculated={false}
            tooltip="Total revenue from two years ago"
          />
          <InputField
            label="Year 3 Revenue"
            type="number"
            prefix="$"
            defaultValue="1200000"
            calculated={false}
            tooltip="Total revenue from three years ago"
          />
        </div>

        {detailMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6 pt-6 border-t border-border"
          >
            <h4 className="text-sm font-semibold text-foreground">Balance Sheet Items</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Total Assets (Year 1)"
                type="number"
                prefix="$"
                defaultValue="450000"
                calculated={false}
              />
              <InputField
                label="Total Liabilities (Year 1)"
                type="number"
                prefix="$"
                defaultValue="150000"
                calculated={false}
              />
              <InputField label="Equity (Year 1)" type="number" prefix="$" defaultValue="300000" calculated={true} />
            </div>
          </motion.div>
        )}

        <Button variant="outline" className="w-full gap-2 bg-transparent">
          <History className="w-4 h-4" />
          Upload Historical CSV
        </Button>
      </div>
    </Card>
  )
}

function InputField({
  label,
  type = "text",
  prefix,
  defaultValue,
  calculated = false,
  tooltip,
  options,
}: {
  label: string
  type?: "text" | "number" | "select"
  prefix?: string
  defaultValue?: string | number
  calculated?: boolean
  tooltip?: string
  options?: string[]
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute left-0 top-6 z-10 w-64 bg-foreground text-background text-xs p-2 rounded shadow-lg">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>
        )}
        {type === "select" ? (
          <select
            className={`w-full px-3 py-2 border rounded-lg text-sm ${
              calculated
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-blue-50 border-blue-200 text-foreground"
            }`}
            defaultValue={defaultValue}
            disabled={calculated}
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
            className={`w-full ${prefix ? "pl-8" : "pl-3"} pr-3 py-2 border rounded-lg text-sm ${
              calculated
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-blue-50 border-blue-200 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }`}
            defaultValue={defaultValue}
            disabled={calculated}
            readOnly={calculated}
          />
        )}
      </div>
    </div>
  )
}
