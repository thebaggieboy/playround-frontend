"use client"

import { useState, useRef, useEffect } from "react"
import { Save, Eye, EyeOff, Lock, User, MapPin, Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, setUser } from "../../features/user/userSlice"
import { selectUserEmail } from "../../features/user/userActiveEmail"
import { selectToken } from "../../features/token/tokenSlice"

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

export default function SettingsPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const userEmail = useSelector(selectUserEmail)
  const token = useSelector(selectToken)
  
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  
  // Loading and notification states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

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
        console.log("Fetched users:", data)

        // Filter user by email or id
        let filteredUser = null
        
        if (Array.isArray(data)) {
          // If user object from Redux has id or email
          if (user?.id) {
            filteredUser = data.find(u => u.id === user.id)
          } else if (userEmail) {
            filteredUser = data.find(u => u.email === userEmail)
          } else if (user?.email) {
            filteredUser = data.find(u => u.email === user.email)
          }
        } else if (data.results && Array.isArray(data.results)) {
          // Handle paginated response
          if (user?.id) {
            filteredUser = data.results.find(u => u.id === user.id)
          } else if (userEmail) {
            filteredUser = data.results.find(u => u.email === userEmail)
          } else if (user?.email) {
            filteredUser = data.results.find(u => u.email === user.email)
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
          
          // Set profile image if exists
          if (filteredUser.display_picture) {
            setProfileImage(filteredUser.display_picture)
          }
          
          // Update Redux store with full user data
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

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size must be less than 5MB", "error")
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification("Please upload an image file", "error")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
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

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    if (!currentUser?.id) {
      showNotification("User ID not found", "error")
      return
    }

    try {
      setIsSaving(true)

      // Create FormData for multipart/form-data (needed for image upload)
      const formDataToSend = new FormData()
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key]) { // Don't send email as it's read-only
          formDataToSend.append(key, formData[key])
        }
      })

      // Append image if changed
      if (imageFile) {
        formDataToSend.append('display_picture', imageFile)
      }

      const response = await fetch(
        `https://playground-backend-1t0f.onrender.com/api/users/${currentUser.id}/`,
        {
          method: "PATCH",
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
            // Don't set Content-Type - browser will set it with boundary for FormData
          },
          body: formDataToSend,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedUser = await response.json()
      console.log("Updated user:", updatedUser)
      
      // Update local state and Redux
      setCurrentUser(updatedUser)
      dispatch(setUser(updatedUser))
      
      // Update profile image if returned from server
      if (updatedUser.display_picture) {
        setProfileImage(updatedUser.display_picture)
      }
      
      setImageFile(null) // Clear the file after successful upload
      showNotification("Profile updated successfully!", "success")
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification(error.message || "Failed to update profile", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePassword = async (e) => {
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

      // Clear password fields
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })

      showNotification("Password changed successfully!", "success")
    } catch (error) {
      console.error("Error changing password:", error)
      showNotification(error.message || "Failed to change password", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelProfile = () => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || "",
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        mobile_number: currentUser.mobile_number || "",
        billing_address: currentUser.billing_address || "",
        city: currentUser.city || "",
        state: currentUser.state || "",
        zip: currentUser.zip || "",
      })
      
      setProfileImage(currentUser.display_picture || null)
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
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {profileImage ? (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden">
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-picture"
                        />
                        <label htmlFor="profile-picture">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max size 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-4">
                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <Input
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          First Name
                        </label>
                        <Input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Last Name
                        </label>
                        <Input
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
                      <label className="text-sm font-medium text-foreground">
                        Mobile Number
                      </label>
                      <Input
                        type="tel"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-3 pt-4 border-t border-border">
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
          <TabsContent value="address" className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Billing Address</h3>
                    
                    <div className="space-y-4">
                      {/* Street Address */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Street Address
                        </label>
                        <Input
                          type="text"
                          name="billing_address"
                          value={formData.billing_address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                          className="bg-background border-border"
                        />
                      </div>

                      {/* City, State, ZIP */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            City
                          </label>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            State
                          </label>
                          <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            ZIP Code
                          </label>
                          <Input
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
                  <div className="flex gap-3 pt-4 border-t border-border">
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
          <TabsContent value="security" className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <form onSubmit={handleSavePassword} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            className="bg-background border-border pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                        <label className="text-sm font-medium text-foreground">
                          New Password
                        </label>
                        <Input
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="bg-background border-border"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Must be at least 8 characters with uppercase, lowercase, and numbers
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="bg-background border-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-3 pt-4 border-t border-border">
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