"use client"

import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CFO, Tech Startup",
      content: "Playground cut our financial analysis time in half. The templates are incredibly intuitive.",
      image: "/professional-woman-headshot.png",
    },
    {
      name: "Michael Rodriguez",
      role: "Financial Analyst",
      content: "Finally, a tool that doesn't require a PhD in finance. The visualizations are beautiful and clear.",
      image: "/professional-man-headshot.png",
    },
    {
      name: "Emma Thompson",
      role: "Investment Manager",
      content: "The export functionality is game-changing. Our clients love the professional reports.",
      image: "/professional-woman-headshot.png",
    },
  ]

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/40 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Finance{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Professionals</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">See what users are saying about Playground</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 border border-border hover:border-accent/50 transition-smooth-lg hover:shadow-xl hover:shadow-accent/15 hover:-translate-y-1 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed group-hover:text-foreground transition-smooth">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm group-hover:text-accent transition-smooth">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
