"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { USER_TYPES, selectUser, setUser, setUserType } from "../features/user/userSlice";
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query";
import useSignUp from "../hooks/useSignUp";



const solutions = [
  {
    name: "Financial Model",
    description: "Create and manage comprehensive financial models",
  },
  {
    name: "Economic Model",
    description: "Build and analyze economic forecasting models",
  },
  {
    name: "Portfolio Management",
    description: "Track and optimize investment portfolios",
  },
  {
    name: "AI Integration",
    description: "Leverage AI to enhance analysis and predictions",
  },
  {
    name: "Export",
    description: "Save and share data in multiple formats",
  },
]

export function Header() {
  const user = useSelector(selectUser);
   const router = useRouter(); 
  const [spinner, setSpinner] = useState(false);
 const [isLoading, setIsLoading] = useState(false)

const dispatch = useDispatch();
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{ fontFamily: "Poppins, Sans-serif", lineHeight: 1, background:"linear-gradient(to right bottom, rgb(26, 38, 84), rgb(26, 38, 84))" }}
      className="sticky top-0 z-50  text-xs  supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-smooth"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 group shrink-0">
            
            <span style={{
             color: "",
            }} className="font-bold text-white text-sm text-foreground group-hover:text-primary  transition-smooth hidden sm:inline">
              Playground
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center ml-10 gap-8 flex-1">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex items-center text-white gap-1 text-foreground/70 hover:text-primary text-sm transition-smooth font-medium focus:outline-none">
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-primary font-semibold">Platform Solutions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {solutions.map((solution) => (
                <DropdownMenuItem key={solution.name} className="flex flex-col items-start gap-1 py-2 cursor-pointer">
                  <span className="font-medium text-foreground">{solution.name}</span>
                  <span className="text-xs text-foreground/60">{solution.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="/use-cases/financial-forecasting" className="text-foreground/70  text-white hover:text-primary text-sm transition-smooth font-medium">
            Financial Forecasting
          </a>

          <a href="/use-cases/investment-analysis" className="text-foreground/70  text-white hover:text-primary text-sm transition-smooth font-medium">
            Investment Analysis
          </a>
          <a href="/use-cases/portfolio-management" className="text-foreground/70  text-white hover:text-primary text-sm transition-smooth font-medium">
            Portfolio Management
          </a>
          <a href="/about" className="text-foreground/70  text-white hover:text-primary text-sm transition-smooth font-medium">
            About
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/demo">
            <Button
               
              className="hidden sm:inline-flex  bg-gradient-to-r from-blue-600 to-indigo-600  text-sm border-primary/20 hover:bg-primary/5"
            >
              Request Demo
            </Button>
          </Link>
          <Link href="/onboard">
            <Button className="bg-white  hover:bg-accent text-black-foreground rounded-full px-4 sm:px-6 py-2 transition-smooth-lg hover:shadow-lg hover:shadow-primary/20 text-sm sm:text-base">
              Get Started
            </Button>
          </Link>
             
        
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-2 flex flex-col gap-2">
      <Link href={"/"}>
          <div className="flex items-center gap-2 group shrink-0">
            
            <span style={{
             color: "",
            }} className="font-bold text-white text-sm text-foreground group-hover:text-primary  transition-smooth hidden sm:inline">
              Playground
            </span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left text-white flex items-center justify-between px-3 py-2 rounded-md text-foreground/70 hover:bg-accent/50 transition-smooth text-sm font-medium">
            Solutions
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            <DropdownMenuLabel>Platform Solutions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {solutions.map((solution) => (
              <DropdownMenuItem key={solution.name} className="flex flex-col items-start gap-1 py-2">
                <span className="font-medium">{solution.name}</span>
                <span className="text-xs text-foreground/60">{solution.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      
      </div>
    </header>
  )
}
