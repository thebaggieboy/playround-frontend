import type React from "react"
import { Metadata } from "next"
import Providers from "@/features/Providers"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Playground | Enterprise Financial Modeling Simplified",
  description: "Playground offers powerful financial modelling, economic forecasting, and portfolio management tools. Built for speed, collaboration, and simplicity.",
  keywords: "plyground, plygroundfinancials, financial modelling, financial forecasting, economic modeling, portfolio management, enterprise planning, financial analysis software",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className="antialiased selection:bg-blue-500/30"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif" }}
      >
        <Providers>
          <Header />
          {children}

        </Providers>


        <Analytics />
      </body>
    </html>
  )
}
