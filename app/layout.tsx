"use client"
import type React from "react"
import type { Metadata } from "next"
import Providers from "@/features/Providers"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
 
import store from "../features/store"
 
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-sans antialiased`}>
        <Providers>
        <Header />
        {children}
        
        </Providers>
     
      
        <Analytics />
      </body>
    </html>
  )
}
