"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Briefcase, CheckCircle2, Target, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const notifications = [
    {
      id: 1,
      type: "application",
      title: "Application Submitted",
      message: "Your application for Software Engineering Intern at Google has been successfully submitted.",
      time: "2 hours ago",
      read: false,
      icon: <Briefcase className="w-5 h-5 text-blue-500" />
    },
    {
      id: 2,
      type: "goal",
      title: "Goal Completed",
      message: "Congratulations! You completed your goal: 'Finish Database Schema Design'.",
      time: "5 hours ago",
      read: false,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 3,
      type: "system",
      title: "New Internship Alert",
      message: "Vercel just posted a new Frontend Engineering Intern role matching your preferences.",
      time: "1 day ago",
      read: true,
      icon: <Target className="w-5 h-5 text-purple-500" />
    },
    {
      id: 4,
      type: "reminder",
      title: "Upcoming Deadline",
      message: "Your application for Stripe Backend Intern is due in 2 days.",
      time: "2 days ago",
      read: true,
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />
    }
  ];

  const filteredNotifications = filter === "all" ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="flex flex-col h-full space-y-6 max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent-blue" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Stay updated on your career progress and alerts.</p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setFilter("all")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("unread")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2", filter === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            Unread
            <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notif, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={notif.id}
              className={cn(
                "flex gap-4 p-5 rounded-xl border transition-all hover:bg-muted/30 cursor-pointer relative",
                notif.read ? "bg-card border-border" : "bg-accent-blue/5 border-accent-blue/20"
              )}
            >
              {!notif.read && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-12 bg-accent-blue rounded-r-full" />
              )}
              
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                {notif.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={cn("text-sm font-semibold truncate pr-4", notif.read ? "text-foreground" : "text-foreground")}>
                    {notif.title}
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap pt-0.5">
                    {notif.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
