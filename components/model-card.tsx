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
    <Link href={`/dashboard/models/${id}`}>
      <Card className="group h-full p-6 cursor-pointer border-l-4 border-l-primary/50 hover:border-l-primary transition-all hover:shadow-lg hover:bg-secondary">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {type === "template" ? "Template" : "Custom"}
                </span>
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
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={(e) => e.preventDefault()}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category & Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">{category}</span>
            <span className="text-xs text-muted-foreground">Modified {lastModified}</span>
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
