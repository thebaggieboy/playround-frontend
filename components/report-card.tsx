"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Star, FileText, Download, Share2, Trash2, TrendingUp, DollarSign, Activity, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ReportCardProps {
  id: string
  name: string
  description: string
  model_name: string
  scenario_name: string
  report_type: string
  date_created: string
  status: "completed" | "processing" | "failed"
  calculated_data?: Record<string, any> | null
  onExportExcel?: (reportId: string) => void
  onExportPdf?: (reportId: string) => void
  onDelete?: (reportId: string) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "—"
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function extractLastValue(
  data: Record<string, Array<{ line_item: string; values_by_period: Record<string, number> }>>,
  statementType: string,
  lineItem: string
): number | null {
  const statements = data?.[statementType] ?? []
  const match = statements.find(s => s.line_item === lineItem)
  if (!match) return null
  const entries = Object.entries(match.values_by_period).sort(([a], [b]) => a.localeCompare(b))
  // Return the most recent non-zero value
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i][1] !== 0) return Number(entries[i][1])
  }
  return 0
}

function extractPeakValue(
  data: Record<string, Array<{ line_item: string; values_by_period: Record<string, number> }>>,
  statementType: string,
  lineItem: string
): number | null {
  const statements = data?.[statementType] ?? []
  const match = statements.find(s => s.line_item === lineItem)
  if (!match) return null
  const values = Object.values(match.values_by_period).map(Number)
  if (values.length === 0) return null
  return Math.max(...values)
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReportCard({
  id,
  name,
  description,
  model_name,
  scenario_name,
  report_type,
  date_created,
  status,
  calculated_data,
  onExportExcel,
  onExportPdf,
  onDelete,
}: ReportCardProps) {
  const [favorite, setFavorite] = useState(false)

  const statusColors = {
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  // Extract key metrics if calculated_data exists
  const hasData = calculated_data && Object.keys(calculated_data).length > 0
  const peakRevenue = hasData ? extractPeakValue(calculated_data!, 'is', 'Total Revenue') : null
  const lastEbitda = hasData ? extractLastValue(calculated_data!, 'is', 'EBITDA') : null
  const lastNetIncome = hasData ? extractLastValue(calculated_data!, 'is', 'Net Income') : null

  return (
    <Link href={`/dashboard/reports/${id}`}>
      <Card className="group h-full p-6 cursor-pointer border-l-4 border-l-primary/50 hover:border-l-primary transition-all hover:shadow-lg hover:bg-secondary">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary opacity-60" />
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    setFavorite(!favorite)
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {favorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  onExportPdf?.(id)
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  onExportExcel?.(id)
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={(e) => {
                  e.preventDefault()
                  onDelete?.(id)
                }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Key Metrics — only shown when calculated data exists */}
          {hasData && (
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50">
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="w-3 h-3 text-primary opacity-60" />
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Revenue</span>
                </div>
                <p className="text-sm font-bold text-foreground">{peakRevenue !== null ? fmt(peakRevenue) : '—'}</p>
              </div>
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500 opacity-60" />
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">EBITDA</span>
                </div>
                <p className="text-sm font-bold text-foreground">{lastEbitda !== null ? fmt(lastEbitda) : '—'}</p>
              </div>
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-blue-500 opacity-60" />
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Net Income</span>
                </div>
                <p className="text-sm font-bold text-foreground">{lastNetIncome !== null ? fmt(lastNetIncome) : '—'}</p>
              </div>
            </div>
          )}

          {/* No data indicator */}
          {!hasData && (
            <div className="py-2 border-y border-border/50 text-center">
              <span className="text-xs text-muted-foreground italic">No calculated data — run calculation to see metrics</span>
            </div>
          )}

          {/* Meta Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium text-foreground">{model_name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Scenario:</span>
              <span className="font-medium text-foreground">{scenario_name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">{report_type}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              Created {new Date(date_created).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
