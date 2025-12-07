"use client"

import type React from "react"

import { useState } from "react"
import { SignUpForm } from "@/components/signup-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useDispatch, useSelector } from "react-redux";
import { USER_TYPES, selectUser, setUser, setUserType } from "../../features/user/userSlice";
import Head from "next/head"

import { useMutation } from "@tanstack/react-query";
import useSignUp from "../../hooks/useSignUp";



const user = useSelector(selectUser);
const router = useRouter(); 
const [spinner, setSpinner] = useState(false);
 const [isLoading, setIsLoading] = useState(false)

const dispatch = useDispatch();

  const { isIdle, isPending, error, mutateAsync: signUpFn } = useSignUp("https://avantrades-api.onrender.com/auth/users/", signUpSuccess, USER_TYPES.user)
  //const { isIdle, isPending, error, mutateAsync: signUpFn } = useDjoserSignup("https://altclan-brands-api-1-1.onrender.com/auth/jwt/create", signUpSuccess, USER_TYPES.user)

  
  const [formErr, setFormErr] = useState(error)
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: ""
  })

  const { email, password1, password2 } = formData

  const emailErr = formErr?.email || null;
  const passwordErr = formErr?.password || formErr?.password2 || null

  const inputChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })

  }
  
 

  function signUpSuccess() {
    
    router.push("/dashboard")
  }
  const submit = async (e) => {
    
    e.preventDefault();
    try {
      if (password1 !== password2) {
        throw { password: "Passwords do not match" }
      }
      setSpinner(true)
      const url = "https://avantrades-api.onrender.com/auth/users/"
      const res = await fetch(url, {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password:password1}),
                credentials: "include"

            })
            const data = await res.json()

            if (res.status >= 200 & res.status <= 209) {
            console.log("New User Registered.")
            console.log(data)
         
            setSpinner(false)
            signUpSuccess()
            await signUpFn(formData)
           
            
                
                
            }
      
            const error = { ...data }
            throw error

      
    
    } catch (error) {
      setFormErr(error)
      console.log("SIGNUP ERROR: ", error)
    }
  };

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
           
            <span className="font-bold text-xl mt-5   text-foreground">Playground</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-foreground/60">Join Playground and start analyzing financial models</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
  
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
                  name="password1"
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
                  id="password2"
                  name="password2"
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
    disabled={isPending}
    className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-2 rounded-lg transition-colors"
  >
    {isPending ? "Creating account..." : "Create account"}
  </Button>

  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-background text-foreground/60">Or sign up with</span>
    </div>
  </div>
 
</form>
        {/* Sign in link */}
        <p className="text-center text-foreground/60 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:text-accent font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
