"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Settings2, 
  Server, 
  Database,
  ArrowRight,
  Code
} from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-card">
      <header className="border-b border-border bg-card px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to the Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Consulting documentation for the Verbena Financial Services Minimum Viable Product.
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
                  <p>Navigate to <strong>Input Model</strong> in the sidebar. The forms map directly to project finance standards. Enter your variables including Base Year, Revenue Drivers, Operating Expenses, Capital/Debt Structures, and historical datasets. You can fetch live market indicators (SOFR / FX) directly from the form by clicking "Fetch Live Market Data."</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary"/> 2. Scenarios
                  </h3>
                  <p>Each model can contain multiple analytical scenarios (Base Case, Upside, Downside). Navigate to <strong>Scenarios</strong> to copy a base case, mutate variables (e.g. increase revenue growth), and save it. Use <strong>Compare Scenarios</strong> to view side-by-side differentials.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary"/> 3. Engine Output & Ratios
                  </h3>
                  <p>Once compiled, navigate to <strong>Reports</strong>. The platform strictly enforces automated integrity (Assets = Liabilities + Equity) tracking any drifts. It also verifies covenant checks (DSCR {">"} 1.0) and Project IRR. Detailed schedules for LLCR, PLCR, and Payback are automatically generated.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>System Architecture Overview</CardTitle>
                <CardDescription>Full-stack mapping of the application framework.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-foreground/80">
                <p>The platform runs an decoupled monolithic architecture, segmented entirely between a React Engine mapping the DOM and a Python matrix running the heavy finance validation calculations.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg border">
                        <h4 className="font-semibold text-foreground mb-1">Frontend Layer (Vercel Node)</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                            <li>Next.js 16/React 19 Framework.</li>
                            <li>TailwindCSS and Framer Motion logic.</li>
                            <li>Client-side calculation state buffering via Redux.</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg border">
                        <h4 className="font-semibold text-foreground mb-1">Backend Layer (WSGI Gunicorn)</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                            <li>Django 5.0 with Django Rest Framework.</li>
                            <li>Engine.py class handling raw NPV/IRR computations natively.</li>
                            <li>SQLite Persistence (Upgradeable to Postgres).</li>
                        </ul>
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>Database Entity-Relationship Schema</CardTitle>
                <CardDescription>Primary storage models and foreign keys.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-zinc-950 p-4 rounded-md overflow-x-auto text-xs text-green-400 font-mono">
<pre>
{`[FinancialModel]
 - id (UUID)
 - user (FK -> User)
 - name (String)

[Scenario]
 - id (UUID)
 - financial_model (FK -> FinancialModel)
 - scenario_type (Choices: base, upside, downside)
 - macro_assumptions (JSON)
 - capital_expenditure (JSON)
 ...

[CalculatedStatement]
 - id (UUID)
 - scenario (FK -> Scenario)
 - statement_type (Choices: income, balance, cashflow, \n   ratio, valuation, revenue, opex, fixed_assets, debt)
 - period_range (JSON)
 - values_by_period (JSON)
`}
</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-0">
             <Card>
              <CardHeader>
                <CardTitle>RESTful API Endpoints</CardTitle>
                <CardDescription>Data transmission endpoints requiring JWT authentication.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-3 font-mono text-sm">
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-blue-500 font-bold">GET /api/models/</span>
                        <span className="text-muted-foreground text-xs font-sans">Fetches all models belonging to authenticated user.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-green-500 font-bold">POST /api/models/&#123;id&#125;/calculate/</span>
                        <span className="text-muted-foreground text-xs font-sans">Triggers the python CalculationEngine.py to execute financial algorithms.</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b pb-3">
                        <span className="text-purple-500 font-bold">POST /api/scenarios/&#123;id&#125;/sensitivity/</span>
                        <span className="text-muted-foreground text-xs font-sans">Accepts slider offsets (e.g. +20% revenue) and resolves an un-persistent memory calculation for UI display.</span>
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
