"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement sign up logic
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
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="terms" required className="mt-1" />
        <Label htmlFor="terms" className="text-sm text-foreground/70 font-normal cursor-pointer">
          I agree to the{" "}
          <a href="#" className="text-primary hover:text-accent transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-accent transition-colors">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-2 rounded-lg transition-colors"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-foreground/60">Or sign up with</span>
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
