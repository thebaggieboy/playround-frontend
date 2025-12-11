"use client"

import { useState } from "react"
import { Save, Eye, EyeOff, Bell, Lock, User, Zap, LogOut, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    emailReports: true,
    emailUpdates: true,
    modelAlerts: true,
    weeklyDigest: false,
  })

  return (
    <motion.div
      className="flex flex-col overflow-hidden flex-1"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
        </motion.div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              {/* Personal Information */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">Update your profile details</p>
                  </div>
                </div>

                <Card className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <Input defaultValue="John" className="bg-secondary/50 border-border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <Input defaultValue="Doe" className="bg-secondary/50 border-border" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input defaultValue="john.doe@example.com" type="email" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input defaultValue="+1 (555) 000-0000" type="tel" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Company</label>
                    <Input defaultValue="Financial Analytics Co." className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Job Title</label>
                    <Input defaultValue="Financial Manager" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Profile Picture */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Profile Picture</h2>
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">JD</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">JPEG or PNG, max 5MB</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Upload Photo
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Preferences */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
                <Card className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Default Currency</label>
                    <Input defaultValue="USD ($)" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Timezone</label>
                    <Input defaultValue="Eastern Time (ET)" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date Format</label>
                    <Input defaultValue="MM/DD/YYYY" className="bg-secondary/50 border-border" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                    <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                  </div>
                </div>

                <Card className="p-6 space-y-4">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-sm">Email Notifications</h3>

                    {[
                      {
                        id: "emailReports",
                        label: "Report Generation",
                        description: "Notify when reports are ready for download",
                      },
                      {
                        id: "emailUpdates",
                        label: "Model Updates",
                        description: "Notify about changes to your financial models",
                      },
                      {
                        id: "modelAlerts",
                        label: "Model Alerts",
                        description: "Alert when model thresholds are exceeded",
                      },
                      {
                        id: "weeklyDigest",
                        label: "Weekly Digest",
                        description: "Get a summary of your activity and insights",
                      },
                    ].map((notif) => (
                      <label
                        key={notif.id}
                        className="flex items-start gap-3 p-4 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={notificationSettings[notif.id as keyof typeof notificationSettings]}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [notif.id]: e.target.checked,
                            })
                          }
                          className="mt-1 w-4 h-4 rounded border-border cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{notif.label}</p>
                          <p className="text-xs text-muted-foreground">{notif.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Notification Settings
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-8">
              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Password & Security</h2>
                    <p className="text-sm text-muted-foreground">Keep your account secure</p>
                  </div>
                </div>

                <Card className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="bg-secondary/50 border-border pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <Input type="password" placeholder="Enter new password" className="bg-secondary/50 border-border" />
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-secondary/50 border-border"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="gap-2">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Two-Factor Authentication */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h2>
                <Card className="p-6 space-y-4 border-l-4 border-l-primary bg-secondary/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button className="gap-2">
                      <Zap className="w-4 h-4" />
                      Enable
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Active Sessions */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
                <Card className="p-6 space-y-4">
                  <div className="space-y-3">
                    {[
                      { device: "MacBook Pro", location: "San Francisco, CA", time: "Current" },
                      { device: "Chrome Desktop", location: "New York, NY", time: "2 hours ago" },
                      { device: "iPhone 14", location: "Unknown", time: "1 day ago" },
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                          <p className="font-medium text-foreground text-sm">{session.device}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.time}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Sign Out
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button variant="outline" className="bg-transparent gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out All Devices
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Danger Zone */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
                <Card className="p-6 border-l-4 border-l-red-500 space-y-4">
                  <div>
                    <p className="font-medium text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
}
