"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Map, Award, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/hooks/useStore";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { notifications } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const items = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmaps", href: "/roadmaps", icon: Map },
    { name: "Skills", href: "/skills", icon: Award },
    { name: "Inbox", href: "/notifications", icon: Bell, badge: unreadCount > 0 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 md:hidden h-14 rounded-full border border-border bg-card/75 backdrop-blur-lg shadow-2xl px-4 flex items-center justify-around select-none">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-10 rounded-full text-muted-foreground relative transition-colors duration-250",
              isActive ? "text-accent-blue" : "hover:text-foreground"
            )}
          >
            {/* Active Pill Glow background */}
            {isActive && (
              <motion.div
                layoutId="mobile-active-pill"
                className="absolute inset-0 bg-accent-blue/10 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <div className="relative">
              <Icon className="w-5 h-5" />
              {/* Notification Indicator Dot */}
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-blue rounded-full ring-2 ring-card animate-pulse" />
              )}
            </div>
            
            <span className="text-[9px] font-medium tracking-tight mt-0.5 font-sans">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
