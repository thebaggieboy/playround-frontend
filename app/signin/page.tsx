import { SignInForm } from "@/components/signin-form"
import Link from "next/link"

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">Playground</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-foreground/60">Sign in to your Playground account</p>
        </div>

        {/* Sign in form */}
        <SignInForm />

        {/* Sign up link */}
        <p className="text-center text-foreground/60 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-accent font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
