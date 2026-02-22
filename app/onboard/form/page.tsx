"use client"

import React, { useState, useRef } from "react"
import {
  Save,
  User,
  MapPin,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

const API_URL = "https://playground-backend-1t0f.onrender.com/api/users/"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

interface FormData {
  first_name: string
  last_name: string
  mobile_number: string
  billing_address: string
  city: string
  state: string
  zip: string
}

interface UserRecord {
  id?: number
  email?: string
  first_name?: string
  last_name?: string
  mobile_number?: string
  display_picture?: string
  billing_address?: string
  city?: string
  state?: string
  zip?: string
  [key: string]: unknown
}

export default function OnboardingPage() {
  // Lookup state
  const [lookupValue, setLookupValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [foundUser, setFoundUser] = useState<UserRecord | null>(null)
  const [lookupComplete, setLookupComplete] = useState(false)

  // Form state matching AccountUser model fields
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    mobile_number: "",
    billing_address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Submission state
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  // Search for existing user by id or email
  const handleLookup = async () => {
    if (!lookupValue.trim()) {
      showNotification("Please enter a user ID or email address", "error")
      return
    }

    try {
      setIsSearching(true)

      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()

      const users: UserRecord[] = Array.isArray(data)
        ? data
        : data.results && Array.isArray(data.results)
          ? data.results
          : []

      // Filter by id or email
      const trimmed = lookupValue.trim()
      const isNumericId = /^\d+$/.test(trimmed)

      let matched: UserRecord | undefined

      if (isNumericId) {
        matched = users.find((u) => String(u.id) === trimmed)
      }

      if (!matched) {
        matched = users.find(
          (u) =>
            u.email?.toLowerCase() === trimmed.toLowerCase()
        )
      }

      if (matched) {
        setFoundUser(matched)
        setFormData({
          first_name: matched.first_name || "",
          last_name: matched.last_name || "",
          mobile_number: matched.mobile_number || "",
          billing_address: matched.billing_address || "",
          city: matched.city || "",
          state: matched.state || "",
          zip: matched.zip || "",
        })
        if (matched.display_picture) {
          setProfileImage(matched.display_picture)
        }
        setLookupComplete(true)
        showNotification("User found. Complete the onboarding fields below.", "success")
      } else {
        showNotification("No user found with that ID or email", "error")
      }
    } catch (error) {
      console.error("Lookup error:", error)
      showNotification(
        error instanceof Error ? error.message : "Failed to look up user",
        "error"
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size must be less than 5MB", "error")
        return
      }
      if (!file.type.startsWith("image/")) {
        showNotification("Please upload an image file", "error")
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!foundUser?.id) {
      showNotification("No user selected. Please look up a user first.", "error")
      return
    }

    // Basic validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      showNotification("First name and last name are required", "error")
      return
    }

    try {
      setIsSaving(true)

      const body = new FormData()
      body.append("first_name", formData.first_name)
      body.append("last_name", formData.last_name)
      body.append("mobile_number", formData.mobile_number)
      body.append("billing_address", formData.billing_address)
      body.append("city", formData.city)
      body.append("state", formData.state)
      body.append("zip", formData.zip)

      if (imageFile) {
        body.append("display_picture", imageFile)
      }

      const response = await fetch(`${API_URL}${foundUser.id}/`, {
        method: "PATCH",
        body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || errorData?.detail || "Failed to update profile"
        )
      }

      const updatedUser = await response.json()
      setFoundUser(updatedUser)

      if (updatedUser.display_picture) {
        setProfileImage(updatedUser.display_picture)
      }

      setImageFile(null)
      showNotification("Onboarding completed successfully!", "success")
    } catch (error) {
      console.error("Submit error:", error)
      showNotification(
        error instanceof Error ? error.message : "Failed to save onboarding data",
        "error"
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div
              className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in your details to get started with your account
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Step 1 -- User Lookup */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your user ID or email address to load your account
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleLookup()
                    }
                  }}
                  placeholder="User ID or email address"
                  className="bg-background border-border pl-10"
                  disabled={isSearching}
                />
              </div>
              <Button
                type="button"
                onClick={handleLookup}
                className="gap-2 w-full sm:w-auto"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Look Up
                  </>
                )}
              </Button>
            </div>

            {/* Show found user info */}
            <AnimatePresence>
              {foundUser && lookupComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {foundUser.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {foundUser.id}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Step 2 -- Onboarding Form (shown after lookup) */}
        <AnimatePresence>
          {lookupComplete && foundUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a photo to personalize your account
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {profileImage ? (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-border">
                            <img
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90 transition-opacity shadow-md"
                              aria-label="Remove profile picture"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border-2 border-border">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-picture"
                          aria-label="Upload profile picture"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max size 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tell us a bit about yourself
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="first_name"
                            className="text-sm font-medium text-foreground"
                          >
                            First Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="bg-background border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="last_name"
                            className="text-sm font-medium text-foreground"
                          >
                            Last Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="bg-background border-border"
                            required
                          />
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-2">
                        <label
                          htmlFor="mobile_number"
                          className="text-sm font-medium text-foreground flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Mobile Number
                        </label>
                        <Input
                          id="mobile_number"
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Address Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add your billing address details
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Street Address */}
                      <div className="space-y-2">
                        <label
                          htmlFor="billing_address"
                          className="text-sm font-medium text-foreground"
                        >
                          Street Address
                        </label>
                        <Input
                          id="billing_address"
                          type="text"
                          name="billing_address"
                          value={formData.billing_address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street, Apt 4B"
                          className="bg-background border-border"
                        />
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label
                          htmlFor="city"
                          className="text-sm font-medium text-foreground"
                        >
                          City
                        </label>
                        <Input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className="bg-background border-border"
                        />
                      </div>

                      {/* State and ZIP */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="state"
                            className="text-sm font-medium text-foreground"
                          >
                            State / Province
                          </label>
                          <Input
                            id="state"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="zip"
                            className="text-sm font-medium text-foreground"
                          >
                            ZIP / Postal Code
                          </label>
                          <Input
                            id="zip"
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="bg-background border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
                    <Button type="submit" className="gap-2" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Complete Onboarding
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          first_name: foundUser?.first_name || "",
                          last_name: foundUser?.last_name || "",
                          mobile_number: foundUser?.mobile_number || "",
                          billing_address: foundUser?.billing_address || "",
                          city: foundUser?.city || "",
                          state: foundUser?.state || "",
                          zip: foundUser?.zip || "",
                        })
                        setProfileImage(foundUser?.display_picture || null)
                        setImageFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      disabled={isSaving}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
