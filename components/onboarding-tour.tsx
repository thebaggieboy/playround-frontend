"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, ArrowRight, ArrowLeft, LayoutDashboard, PenSquare,
    Zap, BarChart3, Download, Upload, Sparkles, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const TOUR_STEPS = [
    {
        title: "Welcome to Playground! 🎉",
        description: "Your enterprise financial modeling platform. Let's take a quick 30-second tour to get you started.",
        icon: Sparkles,
        color: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
        title: "Create a Financial Model",
        description: "Start by building your model from scratch. Input project details, revenue assumptions, capital expenditure, debt financing, and more.",
        icon: PenSquare,
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        action: { label: "Create Model", href: "/dashboard/models/input/advanced" },
    },
    {
        title: "Or Import an Existing Model",
        description: "Already have a financial model in Excel? Upload it and explore it visually right in the browser.",
        icon: Upload,
        color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        action: { label: "Import Model", href: "/dashboard/models/upload" },
    },
    {
        title: "Run Calculations",
        description: "Once your inputs are complete, run the calculation engine to generate Income Statements, Balance Sheets, Cash Flows, Ratios, and Valuation metrics.",
        icon: Zap,
        color: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
        title: "Analyze & Compare",
        description: "View detailed charts, compare scenarios side-by-side, and run sensitivity analysis on key variables like NPV and IRR.",
        icon: BarChart3,
        color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
        title: "Export & Share",
        description: "Export your results as professionally formatted Excel workbooks or PDF reports for stakeholder presentations.",
        icon: Download,
        color: "bg-gradient-to-br from-rose-500 to-pink-600",
    },
    {
        title: "You're All Set!",
        description: "Use Ctrl+K anytime to quickly navigate. Explore the dashboard and start building your first model.",
        icon: CheckCircle2,
        color: "bg-gradient-to-br from-emerald-500 to-teal-600",
        action: { label: "Go to Dashboard", href: "/dashboard" },
    },
]

export default function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("plyground-onboarding-complete")
        if (!hasSeenTour) {
            // Small delay so dashboard loads first
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1)
    }

    const handleComplete = () => {
        localStorage.setItem("plyground-onboarding-complete", "true")
        setIsVisible(false)
    }

    const handleSkip = () => {
        localStorage.setItem("plyground-onboarding-complete", "true")
        setIsVisible(false)
    }

    const handleAction = (href: string) => {
        handleComplete()
        router.push(href)
    }

    if (!isVisible) return null

    const step = TOUR_STEPS[currentStep]
    const Icon = step.icon
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />

                {/* Modal */}
                <motion.div
                    key={currentStep}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Progress bar */}
                    <div className="h-1 bg-muted">
                        <motion.div
                            className="h-full bg-primary rounded-r-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Content */}
                    <div className="p-8 pt-6">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                        >
                            <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        {/* Text */}
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

                        {/* Step indicator */}
                        <div className="flex items-center gap-1.5 mb-6">
                            {TOUR_STEPS.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === currentStep ? 'w-6 bg-primary' :
                                        idx < currentStep ? 'w-3 bg-primary/40' :
                                        'w-3 bg-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {currentStep > 0 && (
                                    <Button variant="ghost" size="sm" onClick={handlePrev} className="gap-1">
                                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                                    Skip Tour
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                {step.action && (
                                    <Button variant="outline" size="sm" onClick={() => handleAction(step.action!.href)}>
                                        {step.action.label}
                                    </Button>
                                )}
                                <Button size="sm" onClick={handleNext} className="gap-1">
                                    {currentStep < TOUR_STEPS.length - 1 ? (
                                        <>Next <ArrowRight className="w-3.5 h-3.5" /></>
                                    ) : (
                                        "Get Started"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
