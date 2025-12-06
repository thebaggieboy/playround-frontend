"use client"

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-smooth-lg group-hover:scale-110">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-foreground group-hover:text-primary transition-smooth">
            Playground
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#overview" className="text-foreground/70 hover:text-primary transition-smooth font-medium">
            Overview
          </a>
          <a href="#features" className="text-foreground/70 hover:text-primary transition-smooth font-medium">
            Features
          </a>
          <a href="#why" className="text-foreground/70 hover:text-primary transition-smooth font-medium">
            Why It Matters
          </a>
        </nav>
        <Button className="bg-primary hover:bg-accent text-primary-foreground rounded-full px-6 transition-smooth-lg hover:shadow-lg hover:shadow-primary/20">
          Get Started
        </Button>
      </div>
    </header>
  )
}
