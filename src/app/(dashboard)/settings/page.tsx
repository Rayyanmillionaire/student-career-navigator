"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, User, Bell, Lock, Shield, Save } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@example.com",
    college: user?.college || "University of Technology",
    bio: user?.bio || "Computer Science major passionate about frontend development.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-accent-blue" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <SettingsTab active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User className="w-4 h-4" />} label="My Profile" />
          <SettingsTab active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell className="w-4 h-4" />} label="Notifications" />
          <SettingsTab active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<Lock className="w-4 h-4" />} label="Security & Password" />
          <SettingsTab active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} icon={<Shield className="w-4 h-4" />} label="Privacy & Data" />
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6">Public Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">Contact support to change your email address.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">College / University</label>
                    <input 
                      type="text" 
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Short Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full h-24 p-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-border mt-6 flex justify-end">
                    <button type="submit" className="bg-accent-blue hover:bg-accent-blue/90 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-accent-blue/20 transition-all">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab !== "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <Settings2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">Coming Soon</h3>
              <p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
                This settings panel is currently under development. Please check back later!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
        active 
          ? "bg-accent-blue/10 text-accent-blue font-semibold" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
