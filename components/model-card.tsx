"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Star, Copy, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ModelCardProps {
  id: string
  name: string
  description: string
  category: string
  lastModified: string
  type: "custom" | "template"
  isFavorite?: boolean
}

export function ModelCard({ id, name, description, category, lastModified, type, isFavorite = false }: ModelCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)

  return (
    <Link href={`/dashboard/models/${id}`} className="block h-full">
      <Card className="group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full bg-card overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1.5 flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider ${type === "template" ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"}`}>
                  {type === "template" ? "Template" : "Custom Model"}
                </span>
              </div>
              <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-1">{name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
            </div>
            {/* We stop propagation here so clicking dropdown doesn't trigger the Link */}
            <div onClick={(e) => e.preventDefault()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 -mr-2 -mt-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFavorite(!favorite)}>
                    <Star className="w-4 h-4 mr-2" />
                    {favorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-auto">
             {/* Visual placeholder for metrics to match Scenarios style */}
            <div className="bg-secondary/40 rounded-lg p-3 grid grid-cols-2 gap-3 mb-4">
               <div className="space-y-1">
                 <span className="text-[10px] text-muted-foreground uppercase font-bold block">Status</span>
                 <span className="text-sm font-medium">Draft</span>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] text-muted-foreground uppercase font-bold block">Type</span>
                 <span className="text-sm font-medium">{category}</span>
               </div>
            </div>

            {/* Category & Meta */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Modified</span>
              <span className="text-xs font-semibold text-muted-foreground">{lastModified}</span>
            </div>
          </div>
        </div>

        {/* Favorite Star Indicator */}
        {favorite && (
          <div className="absolute top-4 right-4 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}
      </Card>
    </Link>
  )
}
