import type React from "react"
import Providers from "@/features/Providers"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <Header />
          {children}

        </Providers>


        <Analytics />
      </body>
    </html>
  )
}
