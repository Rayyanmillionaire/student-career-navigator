"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Target, Briefcase, Clock, Zap } from "lucide-react";

const activityData = [
  { name: 'Mon', hours: 2.5, applications: 1 },
  { name: 'Tue', hours: 3.8, applications: 3 },
  { name: 'Wed', hours: 1.5, applications: 0 },
  { name: 'Thu', hours: 4.2, applications: 5 },
  { name: 'Fri', hours: 5.0, applications: 2 },
  { name: 'Sat', hours: 1.0, applications: 0 },
  { name: 'Sun', hours: 0.5, applications: 0 },
];

const goalsData = [
  { name: 'Week 1', completed: 2 },
  { name: 'Week 2', completed: 5 },
  { name: 'Week 3', completed: 3 },
  { name: 'Week 4', completed: 7 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Visualize your progress and maintain your momentum.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Focus Hours" value="18.5h" trend="+12% this week" icon={<Clock className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Applications Sent" value="11" trend="+3 this week" icon={<Briefcase className="w-5 h-5 text-purple-500" />} />
        <StatCard title="Goals Completed" value="17" trend="2 pending" icon={<Target className="w-5 h-5 text-emerald-500" />} />
        <StatCard title="Current Streak" value="5 Days" trend="Personal best: 12" icon={<Zap className="w-5 h-5 text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Chart 1 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6 text-foreground">Weekly Activity</h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6 text-foreground">Applications Output</h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col transition-all cursor-default"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border/50">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">{trend}</p>
      </div>
    </motion.div>
  );
}