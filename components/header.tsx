"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
export function Header() {
  return (
    <header style={{fontFamily:"Poppins, Sans-serif", lineHeight:1}} className="sticky top-0 z-50 bg-transparent backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-smooth-lg group-hover:scale-110">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-foreground group-hover:text-primary transition-smooth">
            Playground
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#overview" className="text-foreground/70 hover:text-primary text-black text-sm transition-smooth font-medium">
            Overview
          </a>
          <a href="#features" className="text-foreground/70 hover:text-primary text-black text-sm transition-smooth font-medium">
            Pricing
          </a>
          <a href="#why" className="text-foreground/70 hover:text-primary text-black text-sm transition-smooth font-medium">
            Why It Matters
          </a>

          <a href="/about" className="text-foreground/70 hover:text-primary text-black text-sm transition-smooth font-medium">
            About
          </a>



        </nav>
        <Link href="/signup" className="bg-primary hover:bg-accent text-primary-foreground rounded-full px-6 py-2 transition-smooth-lg hover:shadow-lg hover:shadow-primary/20">
          Get Started
        </Link>
      </div>
    </header>
  )
}
