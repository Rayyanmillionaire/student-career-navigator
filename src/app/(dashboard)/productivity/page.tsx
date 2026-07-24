"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Plus, Coffee, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductivityPage() {
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  
  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review React docs", completed: false },
    { id: 2, text: "Finish internship application", completed: true },
    { id: 3, text: "Update resume", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch mode on complete
      if (mode === "work") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("work");
        setTimeLeft(25 * 60);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: "work" | "break") => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productivity Suite</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay focused with the Pomodoro technique and track daily tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Left: Pomodoro Timer */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle background glow based on mode */}
          <div className={cn(
            "absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-colors duration-1000",
            mode === 'work' ? 'bg-accent-blue' : 'bg-success'
          )} />
          
          <div className="flex bg-muted p-1 rounded-lg mb-8 relative z-10">
            <button 
              onClick={() => switchMode("work")}
              className={cn("px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", mode === 'work' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <BrainCircuit className="w-4 h-4" /> Focus
            </button>
            <button 
              onClick={() => switchMode("break")}
              className={cn("px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", mode === 'break' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <Coffee className="w-4 h-4" /> Break
            </button>
          </div>

          <div className="text-7xl font-bold font-mono tracking-tighter mb-10 text-foreground relative z-10">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={toggleTimer}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95",
                isActive ? "bg-muted text-foreground border border-border" : "bg-accent-blue text-white shadow-accent-blue/25 hover:bg-accent-blue/90"
              )}
            >
              {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Daily Tasks */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Focus Tasks</h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                  task.completed ? "bg-muted/30 border-transparent" : "bg-background border-border hover:border-accent-blue/50"
                )}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <span className={cn(
                  "text-sm font-medium transition-all",
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {task.text}
                </span>
              </motion.div>
            ))}
          </div>

          <form onSubmit={addTask} className="relative mt-auto">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..." 
              className="w-full h-11 pl-4 pr-12 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
            />
            <button 
              type="submit"
              disabled={!newTask.trim()}
              className="absolute right-1 top-1 bottom-1 w-9 bg-accent-blue rounded-md flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}