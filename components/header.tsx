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
import { ChevronDown, Menu, X, Activity, PieChart, LineChart, Cpu, FileDown, Info, Briefcase, BookOpen, Users, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setUser } from "../features/user/userSlice"
import { useRouter } from "next/navigation"
import { selectToken, setToken } from "@/features/token/tokenSlice"
import { motion, AnimatePresence } from "framer-motion"

const solutions = [
  {
    name: "Financial Forecasting",
    description: "Create and manage comprehensive financial models with precision.",
    src: "/use-cases/financial-forecasting/",
    icon: LineChart,
  },
  {
    name: "Economic Modeling",
    description: "Build and analyze complex economic scenarios and forecasts.",
    src: "/use-cases/economic-modeling/",
    icon: Activity,
  },

  {
    name: "AI Integration",
    description: "Leverage AI to enhance analysis and predictive modeling capabilities.",
    src: "/platform/ai-features/",
    icon: Cpu,
  },
  {
    name: "Data Export & Reports",
    description: "Save, share, and export your data in multiple professional formats.",
    src: "/platform/reporting/",
    icon: FileDown,
  },
]

const companyLinks = [
  {
    name: "About Us",
    description: "Learn about our mission, vision, and the team behind Playground.",
    src: "/about",
    icon: Info,
  },
  {
    name: "Careers",
    description: "Join the Playground team and help build the future of finance.",
    src: "/careers",
    icon: Briefcase,
  },
  {
    name: "Blog",
    description: "Read the latest insights, updates, and articles from our experts.",
    src: "/blog",
    icon: BookOpen,
  },
  {
    name: "Partners",
    description: "Explore our partner ecosystem and integration opportunities.",
    src: "/partners",
    icon: Users,
  },
  {
    name: "Contact Sales",
    description: "Get in touch with our team to discuss your specific needs.",
    src: "/contact",
    icon: Phone,
  },
]

export function Header() {
  const user = useSelector(selectUser)
  const router = useRouter()
  const token = useSelector(selectToken)

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function logout() {
    try {
      document.cookie = ""
      dispatch(setToken(null))
      dispatch(setUser(null))
      router.push("/signin")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header
      style={{ fontFamily: "Poppins, Sans-serif", lineHeight: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 group shrink-0">
            <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-200 hidden sm:inline tracking-tight">
              Plyground
            </span>
            <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-200 sm:hidden tracking-tight">
              P
            </span>
          </div>
        </Link>

        {user == null && (
          <nav className="hidden md:flex items-center ml-10 gap-8 flex-1">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="flex items-center text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors duration-200 focus:outline-none">
                Solutions
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : ""}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[360px] p-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl mt-2">
                <div className="px-3 py-3 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Platform Solutions</h4>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">Discover how Playground empowers your financial workflows</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                <div className="mt-2 space-y-1">
                  {solutions.map((solution) => {
                    const Icon = solution.icon
                    return (
                      <DropdownMenuItem key={solution.name} asChild className="p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-all duration-200 group">
                        <Link href={solution.src || "#"} className="flex items-start gap-4 outline-none">
                          <div className="p-2.5 bg-blue-50/50 text-blue-600 rounded-lg border border-blue-100/50 group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{solution.name}</span>
                            <span className="text-xs text-slate-500 leading-snug">{solution.description}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/use-cases/industry" className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors duration-200">
              Industry
            </Link>

            <Link href="/use-cases/customer-stories" className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors duration-200">
              Customer Stories
            </Link>

            <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen}>
              <DropdownMenuTrigger className="flex items-center text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors duration-200 focus:outline-none">
                Company
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${companyOpen ? "rotate-180 text-blue-600" : ""}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[360px] p-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl mt-2">
                <div className="px-3 py-3 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Company</h4>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">Everything you need to know about us</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                <div className="mt-2 space-y-1">
                  {companyLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <DropdownMenuItem key={link.name} asChild className="p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-all duration-200 group">
                        <Link href={link.src} className="flex items-start gap-4 outline-none">
                          <div className="p-2.5 bg-indigo-50/50 text-indigo-600 rounded-lg border border-indigo-100/50 group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <span className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{link.name}</span>
                            <span className="text-xs text-slate-500 leading-snug">{link.description}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {user == null ? (
            <>
              <Link href="/signin" className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors duration-200 px-2 py-2">
                Sign In
              </Link>
              <Link href="/demo">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 transition-all shadow-sm hover:shadow-md font-medium text-sm">
                  Request Demo
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 transition-all shadow-sm hover:shadow-md font-medium text-sm">
                  Go to Dashboard
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full px-4 font-medium transition-colors">
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-800 hover:bg-slate-100 active:bg-slate-200 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-slate-200 shadow-xl"
          >
            <div className="px-4 py-6 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {user == null && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Products & Solutions</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {solutions.map((solution) => {
                        const Icon = solution.icon
                        return (
                          <Link key={solution.name} href={solution.src || "#"} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm text-slate-800">{solution.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Company</h4>
                    <div className="grid grid-cols-1 gap-1">
                      <Link href="/use-cases/industry" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="font-semibold text-sm text-slate-800">Industry</span>
                      </Link>
                      <Link href="/use-cases/customer-stories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="font-semibold text-sm text-slate-800">Customer Stories</span>
                      </Link>
                      {companyLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <Link key={link.name} href={link.src} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm text-slate-800">{link.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-slate-100 pb-6">
                {user == null ? (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 bg-white hover:bg-slate-50 h-12 text-base font-semibold rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/demo" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-xl shadow-md">
                        Request Demo
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-xl shadow-md">
                        Dashboard
                      </Button>
                    </Link>
                    <Button onClick={logout} variant="ghost" className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-12 font-medium rounded-xl">
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
