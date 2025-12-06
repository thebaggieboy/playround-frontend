"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement sign in logic
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <a href="#" className="text-sm text-primary hover:text-accent transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-2 rounded-lg transition-colors"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-foreground/60">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
      >
        Google
      </Button>
    </form>
  )
}
