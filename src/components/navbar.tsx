"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Bell, Menu, User as UserIcon, Settings, LogOut, ShieldAlert } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import useStore from "@/hooks/useStore";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isSidebarCollapsed }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notifications } = useStore();

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sync theme
  useEffect(() => {
    const saved = localStorage.getItem("scn_theme") as "light" | "dark" || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("scn_theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 h-16 bg-background/80 border-b border-border flex items-center justify-between px-6 backdrop-blur-md transition-all duration-300 left-0",
        "md:left-[260px]",
        isSidebarCollapsed ? "md:left-[72px]" : "md:left-[260px]"
      )}
    >
      {/* Left section: Hamburger (Mobile Only) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-md border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all duration-150"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mock Search Bar (Triggers global search command menu in next phase) */}
        <div className="relative w-48 sm:w-64 md:w-80 group cursor-pointer">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
          <input
            type="text"
            readOnly
            placeholder="Search skills, roadmaps..."
            className="w-full h-9 pl-9 pr-10 bg-muted/50 border border-border rounded-md text-xs text-foreground cursor-pointer focus:outline-none group-hover:border-white/10 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right section: Theme, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          className="w-9 h-9 rounded-md border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon with Badge */}
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-md border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all duration-150 relative"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-blue rounded-full ring-2 ring-background animate-pulse" />
          )}
        </Link>

        {/* User initials / Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-white/5 flex items-center justify-center font-mono text-xs font-semibold text-accent-blue hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer select-none"
          >
            {user ? getInitials(user.firstName + ' ' + user.lastName) : "U"}
          </button>

          {/* Context Dropdown menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-2xl p-1.5 z-30"
              >
                {/* User details header */}
                <div className="px-3 py-2 border-b border-white/5 text-left mb-1">
                  <div className="text-xs font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                </div>

                {/* Menu items */}
                <div className="space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-accent-purple bg-accent-purple/5 hover:bg-accent-purple/10 transition-all duration-150"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Portal</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-danger/80 hover:text-danger hover:bg-danger/10 transition-all duration-150 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
