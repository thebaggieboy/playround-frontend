"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

// Mock Data
const revenueData = [
  { name: "Jan", revenue: 4000, target: 2400 },
  { name: "Feb", revenue: 3000, target: 1398 },
  { name: "Mar", revenue: 2000, target: 9800 },
  { name: "Apr", revenue: 2780, target: 3908 },
  { name: "May", revenue: 1890, target: 4800 },
  { name: "Jun", revenue: 2390, target: 3800 },
  { name: "Jul", revenue: 3490, target: 4300 },
  { name: "Aug", revenue: 4000, target: 2400 },
  { name: "Sep", revenue: 3000, target: 1398 },
  { name: "Oct", revenue: 2000, target: 9800 },
  { name: "Nov", revenue: 2780, target: 3908 },
  { name: "Dec", revenue: 3490, target: 4300 },
]

const projectTypesData = [
  { name: "Manufacturing", value: 400 },
  { name: "Real Estate", value: 300 },
  { name: "Energy", value: 300 },
  { name: "General", value: 200 },
]

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#6366f1", "#ec4899"]

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
            "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          }`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <DashboardHeader />

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Comprehensive overview of your models and projects.</p>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[300px] sm:w-[400px]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Top Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue Modeled"
              value="$45.2M"
              change="+20.1%"
              isPositive={true}
              icon={DollarSign}
            />
            <StatCard
              title="Active Projects"
              value="124"
              change="+12"
              isPositive={true}
              icon={Activity}
            />
            <StatCard
              title="Avg. Target IRR"
              value="18.5%"
              change="-0.5%"
              isPositive={false}
              icon={TrendingUp}
            />
            <StatCard
              title="Models Generated"
              value="892"
              change="+14.2%"
              isPositive={true}
              icon={Users}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

            <Card className="col-span-4 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Projections vs Targets</CardTitle>
                <CardDescription>
                  Comparison of calculated aggregate revenues across all your models.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`$${value}`, undefined]}
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#94a3b8"
                        fillOpacity={1}
                        fill="url(#colorTarget)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 shadow-sm">
              <CardHeader>
                <CardTitle>Projects by Industry</CardTitle>
                <CardDescription>Distribution of financial models across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectTypesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {projectTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
