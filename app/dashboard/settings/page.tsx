"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Save, Eye, EyeOff, Lock, User, MapPin, Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, setUser } from "../../../features/user/userSlice"
import { selectUserEmail } from "../../../features/user/userActiveEmail"
import { selectToken } from "../../../features/token/tokenSlice"

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

const tabContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
}

export default function SettingsPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const userEmail = useSelector(selectUserEmail)
  const token = useSelector(selectToken)
  
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Loading and notification states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(null)

  // Form state matching AccountUser model
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    billing_address: "",
    city: "",
    state: "",
    zip: "",
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://playground-backend-1t0f.onrender.com/api/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()

        // Filter user by email or id
        let filteredUser = null
        
        if (Array.isArray(data)) {
          if (user?.id) {
            filteredUser = data.find((u: Record<string, unknown>) => u.id === user.id)
          } else if (userEmail) {
            filteredUser = data.find((u: Record<string, unknown>) => u.email === userEmail)
          } else if (user?.email) {
            filteredUser = data.find((u: Record<string, unknown>) => u.email === user.email)
          }
        } else if (data.results && Array.isArray(data.results)) {
          if (user?.id) {
            filteredUser = data.results.find((u: Record<string, unknown>) => u.id === user.id)
          } else if (userEmail) {
            filteredUser = data.results.find((u: Record<string, unknown>) => u.email === userEmail)
          } else if (user?.email) {
            filteredUser = data.results.find((u: Record<string, unknown>) => u.email === user.email)
          }
        }

        if (filteredUser) {
          setCurrentUser(filteredUser)
          setFormData({
            email: filteredUser.email || "",
            first_name: filteredUser.first_name || "",
            last_name: filteredUser.last_name || "",
            mobile_number: filteredUser.mobile_number || "",
            billing_address: filteredUser.billing_address || "",
            city: filteredUser.city || "",
            state: filteredUser.state || "",
            zip: filteredUser.zip || "",
          })
          
          if (filteredUser.display_picture) {
            setProfileImage(filteredUser.display_picture as string)
          }
          
          dispatch(setUser(filteredUser))
        } else {
          showNotification("User not found", "error")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        showNotification("Failed to load user data", "error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userEmail, user?.email, user?.id, token, dispatch])

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size must be less than 5MB", "error")
        return
      }

      if (!file.type.startsWith('image/')) {
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser?.id) {
      showNotification("User ID not found", "error")
      return
    }

    try {
      setIsSaving(true)

      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key as keyof typeof formData]) {
          formDataToSend.append(key, formData[key as keyof typeof formData])
        }
      })

      if (imageFile) {
        formDataToSend.append('display_picture', imageFile)
      }

      const response = await fetch(
        `https://playground-backend-1t0f.onrender.com/api/users/${currentUser.id}/`,
        {
          method: "PATCH",
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: formDataToSend,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedUser = await response.json()
      
      setCurrentUser(updatedUser)
      dispatch(setUser(updatedUser))
      
      if (updatedUser.display_picture) {
        setProfileImage(updatedUser.display_picture)
      }
      
      setImageFile(null)
      showNotification("Profile updated successfully!", "success")
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification(error instanceof Error ? error.message : "Failed to update profile", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser?.id) {
      showNotification("User ID not found", "error")
      return
    }

    try {
      setIsSaving(true)

      const addressData = {
        billing_address: formData.billing_address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      }

      const response = await fetch(
        `https://playground-backend-1t0f.onrender.com/api/users/${currentUser.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify(addressData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update address")
      }

      const updatedUser = await response.json()
      
      setCurrentUser(updatedUser)
      dispatch(setUser(updatedUser))
      
      showNotification("Address updated successfully!", "success")
    } catch (error) {
      console.error("Error updating address:", error)
      showNotification(error instanceof Error ? error.message : "Failed to update address", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      showNotification("Passwords don't match!", "error")
      return
    }

    if (passwordData.new_password.length < 8) {
      showNotification("Password must be at least 8 characters", "error")
      return
    }

    if (!currentUser?.id) {
      showNotification("User ID not found", "error")
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(
        `https://playground-backend-1t0f.onrender.com/api/users/${currentUser.id}/change_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })

      showNotification("Password changed successfully!", "success")
    } catch (error) {
      console.error("Error changing password:", error)
      showNotification(error instanceof Error ? error.message : "Failed to change password", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelProfile = () => {
    if (currentUser) {
      setFormData({
        email: (currentUser.email as string) || "",
        first_name: (currentUser.first_name as string) || "",
        last_name: (currentUser.last_name as string) || "",
        mobile_number: (currentUser.mobile_number as string) || "",
        billing_address: (currentUser.billing_address as string) || "",
        city: (currentUser.city as string) || "",
        state: (currentUser.state as string) || "",
        zip: (currentUser.zip as string) || "",
      })
      
      setProfileImage((currentUser.display_picture as string) || null)
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 sm:mb-8 bg-secondary/50 w-full sm:w-auto">
            <TabsTrigger value="profile" className="gap-2 flex-1 sm:flex-initial">
              <User className="w-4 h-4 hidden sm:inline-block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2 flex-1 sm:flex-initial">
              <MapPin className="w-4 h-4 hidden sm:inline-block" />
              Address
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 flex-1 sm:flex-initial">
              <Lock className="w-4 h-4 hidden sm:inline-block" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <motion.div
              key="profile"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="p-4 sm:p-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">Upload a photo to personalize your account</p>
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

                  {/* Personal Information Section */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">Update your personal details</p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Email (Read-only) */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          readOnly
                          className="bg-secondary/50 border-border cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="first_name" className="text-sm font-medium text-foreground">
                            First Name
                          </label>
                          <Input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="last_name" className="text-sm font-medium text-foreground">
                            Last Name
                          </label>
                          <Input
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="bg-background border-border"
                          />
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-2">
                        <label htmlFor="mobile_number" className="text-sm font-medium text-foreground">
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

                  {/* Save Button */}
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
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelProfile}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="mt-0">
            <motion.div
              key="address"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="p-4 sm:p-6">
                <form onSubmit={handleSaveAddress} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Billing Address</h3>
                      <p className="text-sm text-muted-foreground">Update your billing and shipping information</p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Street Address */}
                      <div className="space-y-2">
                        <label htmlFor="billing_address" className="text-sm font-medium text-foreground">
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
                        <label htmlFor="city" className="text-sm font-medium text-foreground">
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
                          <label htmlFor="state" className="text-sm font-medium text-foreground">
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
                          <label htmlFor="zip" className="text-sm font-medium text-foreground">
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

                  {/* Save Button */}
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
                          Save Address
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelProfile}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <motion.div
              key="security"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="p-4 sm:p-6">
                <form onSubmit={handleSavePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Change Password</h3>
                      <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label htmlFor="current_password" className="text-sm font-medium text-foreground">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            id="current_password"
                            type={showPassword ? "text" : "password"}
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                            className="bg-background border-border pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <label htmlFor="new_password" className="text-sm font-medium text-foreground">
                          New Password
                        </label>
                        <Input
                          id="new_password"
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter your new password"
                          className="bg-background border-border"
                          required
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label htmlFor="confirm_password" className="text-sm font-medium text-foreground">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirm_password"
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          placeholder="Confirm your new password"
                          className="bg-background border-border"
                          required
                        />
                      </div>

                      {/* Password Requirements */}
                      <div className="bg-secondary/30 border border-border rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-2">Password requirements:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Minimum 8 characters long</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one lowercase letter</li>
                          <li>At least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
                    <Button type="submit" className="gap-2" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setPasswordData({
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                      })}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
