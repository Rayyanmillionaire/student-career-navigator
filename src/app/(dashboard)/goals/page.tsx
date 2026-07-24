"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2, Circle, Search, Filter } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Learn React Server Components", status: "TODO", deadline: "Next Week", progress: 0 },
    { id: 2, title: "Apply to 10 Summer Internships", status: "IN_PROGRESS", deadline: "This Month", progress: 40 },
    { id: 3, title: "Finish Database Schema Design", status: "COMPLETED", deadline: "Yesterday", progress: 100 },
  ]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals & Milestones</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your progress and stay focused on your career objectives.</p>
        </div>
        <button className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-accent-blue/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search goals..." 
            className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
          />
        </div>
        <button className="h-10 px-4 bg-card border border-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-muted/50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Kanban Board / List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* TODO Column */}
        <div className="flex flex-col bg-muted/20 border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Circle className="w-4 h-4 text-muted-foreground" />
              To Do
            </h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">1</span>
          </div>
          <div className="space-y-3">
            {goals.filter(g => g.status === 'TODO').map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* IN_PROGRESS Column */}
        <div className="flex flex-col bg-muted/20 border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-blue" />
              In Progress
            </h3>
            <span className="bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-full text-xs font-medium">1</span>
          </div>
          <div className="space-y-3">
            {goals.filter(g => g.status === 'IN_PROGRESS').map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* COMPLETED Column */}
        <div className="flex flex-col bg-muted/20 border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Completed
            </h3>
            <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-medium">1</span>
          </div>
          <div className="space-y-3">
            {goals.filter(g => g.status === 'COMPLETED').map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: any }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <h4 className="text-sm font-semibold mb-2 group-hover:text-accent-blue transition-colors">{goal.title}</h4>
      
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" 
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{goal.deadline}</span>
      </div>
    </motion.div>
  );
}