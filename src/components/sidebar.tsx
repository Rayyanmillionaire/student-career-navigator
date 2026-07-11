"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  LayoutDashboard,
  Map,
  Award,
  FileText,
  Briefcase,
  ShieldCheck,
  Calendar,
  Timer,
  BarChart3,
  Bell,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      section: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Roadmaps", href: "/roadmaps", icon: Map },
        { name: "Skills", href: "/skills", icon: Award },
        { name: "Resume", href: "/resume", icon: FileText },
        { name: "Internships", href: "/internships", icon: Briefcase },
        { name: "Certifications", href: "/certifications", icon: ShieldCheck },
      ],
    },
    {
      section: "Productivity",
      items: [
        { name: "Goals", href: "/goals", icon: Calendar },
        { name: "Productivity", href: "/productivity", icon: Timer },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      section: "System",
      items: [
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Settings", href: "/settings", icon: Settings },
        ...(user?.role === "admin"
          ? [{ name: "Admin Portal", href: "/admin", icon: Shield }]
          : []),
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30 bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden select-none">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/15">
            <Compass className="w-4.5 h-4.5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-base tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent"
            >
              CareerNav
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 py-6 overflow-y-auto px-3 space-y-6 scrollbar-thin">
        {menuItems.map((section) => (
          <div key={section.section} className="space-y-1.5">
            {!isCollapsed ? (
              <h4 className="px-3 text-[10px] font-bold font-mono tracking-widest text-muted-foreground uppercase opacity-60">
                {section.section}
              </h4>
            ) : (
              <div className="h-2 border-b border-white/5 mb-2" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative group",
                      isActive
                        ? "text-foreground font-semibold bg-white/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                    )}
                  >
                    {/* Active Bar Glow Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded bg-accent-blue shadow-lg shadow-accent-blue/50"
                      />
                    )}

                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}

                    {/* Tooltip for collapsed states */}
                    {isCollapsed && (
                      <div className="absolute left-16 px-2.5 py-1 rounded bg-card border border-border text-xs text-foreground font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 shadow-xl z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Collapse Actions */}
      <div className="p-3 border-t border-white/5 space-y-1 bg-white/[0.01]">
        {/* Logout Link */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-danger/80 hover:text-danger hover:bg-danger/10 active:scale-98 transition-all duration-150 group relative"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
          
          {isCollapsed && (
            <div className="absolute left-16 px-2.5 py-1 rounded bg-card border border-border text-xs text-danger font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 shadow-xl z-50">
              Sign Out
            </div>
          )}
        </button>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center h-9 mt-1 rounded-md border border-white/5 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-[0.97] transition-all duration-150"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
