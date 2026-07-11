"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import useStore from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

export default function SkillsPage() {
  const { skills, addSkill, updateSkill, deleteSkill, isLoading } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New Skill form fields
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");
  const [newSkillProf, setNewSkillProf] = useState(50);
  const [newSkillTarget, setNewSkillTarget] = useState(80);

  // Submit Handler
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const success = await addSkill({
      name: newSkillName.trim(),
      proficiency: newSkillProf,
      category: newSkillCategory,
      goal: newSkillTarget
    });

    if (success) {
      // Reset form
      setNewSkillName("");
      setNewSkillProf(50);
      setNewSkillTarget(80);
      setIsAddOpen(false);
    }
  };

  // Slider change handler (with debounce/throttled update)
  const handleProficiencyChange = async (id: string | number, val: number) => {
    await updateSkill(id, { proficiency: val });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Skill Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log and sliders-scale your tech proficiencies relative to career milestones.
          </p>
        </div>
        <Button size="sm" variant="gradient" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Skill
        </Button>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/10">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold">No skills added yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Set up target skills like React, Spring Boot, or Python to monitor your progress.
          </p>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s) => {
            const hasReachedTarget = s.proficiency >= (s.goal || 80);

            return (
              <Card key={s.id} hoverEffect className="relative flex flex-col justify-between h-56">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
                        {s.category || "General"}
                      </span>
                      <CardTitle className="text-base">{s.name}</CardTitle>
                    </div>
                    <button
                      onClick={() => deleteSkill(s.id)}
                      className="w-7 h-7 rounded-md border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-danger active:scale-95 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  {/* Slider Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono font-semibold">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5" /> Drag to adjust
                      </span>
                      <span className={`${hasReachedTarget ? "text-success" : "text-foreground"}`}>
                        {s.proficiency}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={s.proficiency}
                      onChange={(e) => handleProficiencyChange(s.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-blue focus:outline-none"
                    />
                  </div>

                  {/* Target Goal Progress */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex justify-between text-[9px] font-mono font-semibold text-muted-foreground">
                      <span>Target Goal</span>
                      <span>{s.goal || 80}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                      {/* Target Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-accent-purple"
                        style={{ left: `${s.goal || 80}%` }}
                      />
                      {/* Current Progress bar */}
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          hasReachedTarget
                            ? "bg-success"
                            : "bg-accent-blue"
                        }`}
                        style={{ width: `${s.proficiency}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[8px] pt-1">
                      {hasReachedTarget ? (
                        <span className="flex items-center gap-0.5 text-success font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Target Achieved
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {Math.max(0, (s.goal || 80) - s.proficiency)}% remaining
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-accent-purple font-mono font-medium">
                        <TrendingUp className="w-2.5 h-2.5" /> Level {Math.ceil(s.proficiency / 25)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Skill Dialog Modal */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Track New Skill">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold">Skill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. React Native, Docker, Java"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full h-10 px-3.5 bg-muted border border-border rounded-md text-xs focus:outline-none focus:border-accent-blue"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold">Category</label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full h-10 px-3.5 bg-muted border border-border rounded-md text-xs focus:outline-none"
            >
              <option value="Frontend">Frontend Development</option>
              <option value="Backend">Backend Development</option>
              <option value="Database">Database Management</option>
              <option value="DevOps">DevOps & Cloud</option>
              <option value="Mobile">Mobile Development</option>
              <option value="AI / ML">Artificial Intelligence & ML</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold">Current Level ({newSkillProf}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold">Target Level ({newSkillTarget}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkillTarget}
                onChange={(e) => setNewSkillTarget(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-purple"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-white/5 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={isLoading}>
              Add Tracked Skill
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
