"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Server, 
  Database,
  ArrowRight,
  Code,
  CheckCircle2,
  Shield
} from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-card">
      <header className="border-b border-border bg-card px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Complete documentation for the PLYGROUND Financial Modeling Platform — MVP v1.0
          </p>
        </div>
      </header>

      <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full">
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-secondary/50 p-1">
            <TabsTrigger value="guide" className="flex gap-2"><BookOpen className="w-4 h-4"/> User Guide</TabsTrigger>
            <TabsTrigger value="architecture" className="flex gap-2"><Server className="w-4 h-4"/> Architecture</TabsTrigger>
            <TabsTrigger value="schema" className="flex gap-2"><Database className="w-4 h-4"/> Database Schema</TabsTrigger>
            <TabsTrigger value="api" className="flex gap-2"><Code className="w-4 h-4"/> API Specs</TabsTrigger>
          </TabsList>

          {/* ── User Guide ──────────────────────────────── */}
          <TabsContent value="guide" className="mt-0 space-y-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Platform User Guide</CardTitle>
                <CardDescription>How to navigate the 3-statement financial modeling platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-foreground/80 leading-relaxed">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary"/> 1. Creating a Model
                  </h3>
                  <p>Navigate to <strong>Input Model</strong> in the sidebar. The wizard is organized into tabbed sections: Project Info, Macro & General Assumptions, Revenue, Operating Expenses, Capital Expenditure, Debt & Financing, Tax, Working Capital, Depreciation, and Dividend & Exit. Each tab covers a specific domain of financial assumptions.</p>
                  <p className="mt-2">You can fetch <strong>live market data</strong> (USD/NGN exchange rate via Frankfurter API and SOFR benchmark rate) by clicking "Fetch Live Market Data" on the Macro tab.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary"/> 2. Scenarios & Sensitivity
                  </h3>
                  <p>Each model supports <strong>unlimited scenarios</strong> (Base, Upside, Downside, Custom). Navigate to <strong>Scenarios</strong> to duplicate a base case, modify assumptions, and compare results side-by-side. The <strong>Sensitivity Analysis</strong> module provides interactive sliders for revenue growth, OpEx margin, CAPEX, and discount rate that update results in real-time without saving to the database.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary"/> 3. Reports & Output Schedules
                  </h3>
                  <p>Navigate to <strong>Reports</strong> to generate visual financial statements. The platform outputs <strong>12 detailed schedules</strong>: Income Statement, Balance Sheet, Cash Flow, Ratios (DSCR, LLCR, PLCR), Valuation (NPV, IRR, Payback), Debt, Revenue & Receivables, OpEx, Fixed Assets, Tax, Reserve Accounts & Dividends (including DSRA), and Exit & Terminal Value.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary"/> 4. Automated Validation
                  </h3>
                  <p>Every report automatically runs integrity checks: <strong>Balance Sheet integrity</strong> (Assets = Liabilities + Equity), <strong>DSCR covenant</strong> breach detection ({"<"} 1.0×), and <strong>IRR viability</strong> validation against the discount rate. Results display as a green/red status bar.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Architecture ──────────────────────────────── */}
          <TabsContent value="architecture" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>System Architecture Overview</CardTitle>
                <CardDescription>Full-stack technical mapping of the application framework.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-foreground/80">
                <p>The platform operates as a decoupled client-server architecture with a React-based frontend communicating via REST API to a Python-based calculation engine.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg border">
                        <h4 className="font-semibold text-foreground mb-1">Frontend (Vercel)</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                            <li>Next.js 16 App Router / React 19</li>
                            <li>TailwindCSS + Framer Motion</li>
                            <li>ShadCN UI (Radix Primitives)</li>
                            <li>Recharts for financial visualizations</li>
                            <li>Redux Toolkit for state management</li>
                            <li>Zod for form validation</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg border">
                        <h4 className="font-semibold text-foreground mb-1">Backend (Render)</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                            <li>Django 5.0 + Django REST Framework</li>
                            <li>JWT Authentication (SimpleJWT)</li>
                            <li>Custom CalculationEngine (pure Decimal math)</li>
                            <li>openpyxl (Excel export/import)</li>
                            <li>ReportLab (PDF generation)</li>
                            <li>SQLite → PostgreSQL (production)</li>
                        </ul>
                    </div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg border mt-4">
                    <h4 className="font-semibold text-foreground mb-1">Calculation Pipeline (12 Steps)</h4>
                    <p className="text-muted-foreground mt-2 font-mono text-xs leading-relaxed">
                      Periods → Revenue → OpEx → Depreciation → CAPEX → Debt → Income Statement → Cash Flow → Balance Sheet → Ratios (DSCR, LLCR, PLCR) → Valuation (NPV, IRR, Payback) → Save (12 statement types)
                    </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Schema ──────────────────────────────── */}
          <TabsContent value="schema" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>Database Entity-Relationship Schema</CardTitle>
                <CardDescription>Primary Django ORM models and relationships.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-zinc-950 p-4 rounded-md overflow-x-auto text-xs text-green-400 font-mono">
<pre>
{`User (Django Auth)
 └── FinancialModel
      ├── id (UUID), name, project_type, status, owner (FK→User)
      │
      └── Scenario (1:N)
           ├── id, name, scenario_type (base/upside/downside/custom)
           ├── MacroAssumptions (1:1) — benchmark_rate, inflation, exchange_rate
           ├── RevenueAssumptions (1:1) — base_revenue, growth_rate
           ├── RevenueProduct (1:N) — name, units, price, growth
           ├── OperatingExpenses (1:1) — variable_pct, fixed_costs, staff
           ├── CapitalExpenditure (1:1) — land, construction, equipment
           ├── DebtFinancing (1:1) — equity_pct, debt_pct, interest, tenor
           ├── TaxAssumptions (1:1) — CIT, EDT, VAT, WHT
           ├── WorkingCapital (1:1) — DSO, DPO, DIO
           ├── DepreciationSchedule (1:N) — asset_category, useful_life
           ├── DividendPolicy (1:1) — payout_ratio, min_cash
           ├── ExitValuation (1:1) — exit_year, exit_multiple, WACC
           │
           └── CalculatedStatement (1:N) — OUTPUT
                ├── statement_type: is | bs | cfs | ratio | valuation |
                │                   debt | revenue | opex | fixed_assets |
                │                   tax | dividend | exit
                ├── line_item (e.g., "Total Revenue", "DSRA Target")
                └── values_by_period (JSON: {"2025": 1000000, ...})

Report
 ├── financial_model (FK→FinancialModel)
 ├── scenario (FK→Scenario)
 └── status (pending/processing/completed/failed)`}
</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── API ──────────────────────────────── */}
          <TabsContent value="api" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>RESTful API Endpoints</CardTitle>
                <CardDescription>All endpoints require JWT Bearer authentication.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-3 font-mono text-sm">
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-blue-500 font-bold">GET /api/models/</span>
                        <span className="text-muted-foreground text-xs font-sans">List all financial models for the authenticated user.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-green-500 font-bold">POST /api/models/</span>
                        <span className="text-muted-foreground text-xs font-sans">Create a new financial model with a default base case scenario.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-green-500 font-bold">GET /api/scenarios/&#123;id&#125;/calculate/</span>
                        <span className="text-muted-foreground text-xs font-sans">Trigger the CalculationEngine to generate all 12 output schedules.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-purple-500 font-bold">POST /api/scenarios/&#123;id&#125;/sensitivity/</span>
                        <span className="text-muted-foreground text-xs font-sans">Run in-memory sensitivity analysis with slider overrides (no DB save).</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-purple-500 font-bold">POST /api/scenarios/&#123;id&#125;/duplicate/</span>
                        <span className="text-muted-foreground text-xs font-sans">Duplicate a scenario with all input assumptions for variant modeling.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-orange-500 font-bold">GET /api/models/&#123;id&#125;/export_excel/</span>
                        <span className="text-muted-foreground text-xs font-sans">Download multi-sheet Excel workbook with all financial schedules.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-orange-500 font-bold">GET /api/models/&#123;id&#125;/export_pdf/</span>
                        <span className="text-muted-foreground text-xs font-sans">Download formatted PDF report for investor sharing.</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-green-500 font-bold">POST /api/models/parse_upload/</span>
                        <span className="text-muted-foreground text-xs font-sans">Parse uploaded Excel/CSV file and return structured sheet data for the viewer.</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
