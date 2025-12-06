"use client"

import { TrendingUp, PieChart, BarChart3, Zap } from "lucide-react"

export function UseCases() {
  const useCases = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Investment Analysis",
      description: "Evaluate investment opportunities with DCF and NPV models",
      color: "from-primary/30 to-accent/30",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Portfolio Management",
      description: "Track and analyze portfolio performance metrics",
      color: "from-accent/30 to-primary/30",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Financial Forecasting",
      description: "Create accurate forecasts with built-in templates",
      color: "from-primary/25 to-accent/25",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Analysis",
      description: "Get insights in minutes, not hours",
      color: "from-accent/25 to-primary/25",
    },
  ]

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Use Cases for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Every Role</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Whether you're a CFO, analyst, or finance novice, Playground adapts to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-smooth-lg hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1.5 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${useCase.color} rounded-lg flex items-center justify-center mb-4 text-accent group-hover:shadow-lg group-hover:shadow-accent/30 transition-smooth-lg group-hover:scale-110`}
              >
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-smooth">
                {useCase.title}
              </h3>
              <p className="text-sm text-foreground/70 group-hover:text-foreground/80 transition-smooth">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
