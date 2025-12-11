"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Star, FileText, Download, Share2, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ReportCardProps {
  id: string
  name: string
  description: string
  model: string
  type: string
  createdDate: string
  status: "completed" | "processing" | "failed"
  isFavorite?: boolean
}

export function ReportCard({
  id,
  name,
  description,
  model,
  type,
  createdDate,
  status,
  isFavorite = false,
}: ReportCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  }

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
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={(e) => e.preventDefault()}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium text-foreground">{model}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">{type}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">Created {createdDate}</span>
          </div>
        </div>

        {/* Favorite Star Indicator */}
        {favorite && (
          <div className="absolute top-4 right-4 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}
      </Card>
    </Link>
  )
}
