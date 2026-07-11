"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Compass,
  Layers,
  Coffee,
  Code,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import useStore from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import roadmapsData from "../../../../data/roadmaps.json";

// Map string icon names to Lucide icons
const iconMap: Record<string, any> = {
  layers: Layers,
  coffee: Coffee,
  code: Code,
  map: Map,
};

export default function RoadmapsPage() {
  const { roadmapProgress, toggleRoadmapStep } = useStore();
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

  const selectedRoadmap = roadmapsData.find((r) => r.id === selectedRoadmapId);

  // Toggle step completion status
  const handleToggleStep = async (roadmapId: string, stepId: string) => {
    await toggleRoadmapStep(roadmapId, stepId);
  };

  return (
    <div className="space-y-6 text-left">
      <AnimatePresence mode="wait">
        {!selectedRoadmapId ? (
          /* Roadmap Selection Grid view */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Career Roadmaps
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Curated timelines mapping skills and certifications to target careers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roadmapsData.map((r) => {
                const IconComponent = iconMap[r.icon] || Map;
                const completedSteps = roadmapProgress[r.id]?.completed?.length || 0;
                
                // Total steps calculator
                const totalSteps = r.levels.reduce((sum, lvl) => sum + lvl.steps.length, 0);
                const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                return (
                  <Card
                    key={r.id}
                    hoverEffect
                    className="cursor-pointer flex flex-col justify-between h-76"
                    onClick={() => setSelectedRoadmapId(r.id)}
                  >
                    <CardHeader>
                      <div className="flex gap-2.5 items-center">
                        <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue shadow-lg shadow-accent-blue/5">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle>{r.title}</CardTitle>
                          <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                            {r.difficulty}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between pt-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {r.description}
                      </p>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center text-[10px] font-mono font-semibold">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{progressPercent}% ({completedSteps}/{totalSteps})</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-white/5">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {totalSteps} Chapters</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Roadmap Interactive Timeline Detail view */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Back controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRoadmapId(null)}
                className="h-8 px-3"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Roadmaps
              </Button>
              <span className="text-xs text-muted-foreground font-mono">
                {selectedRoadmap?.title} timeline tree
              </span>
            </div>

            {/* Split Content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Timeline tree (2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                {selectedRoadmap?.levels.map((level, levelIdx) => (
                  <div key={level.name} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-blue/30 ring-4 ring-accent-blue/10" />
                      <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                        {level.name} Path
                      </h3>
                    </div>

                    <div className="relative pl-6 ml-1.5 border-l border-white/5 space-y-6 text-left">
                      {level.steps.map((step) => {
                        const isCompleted = (roadmapProgress[selectedRoadmapId]?.completed || []).includes(step.id);
                        
                        return (
                          <div
                            key={step.id}
                            onClick={() => handleToggleStep(selectedRoadmapId, step.id)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group relative ${
                              isCompleted
                                ? "border-success/20 bg-success/[0.01] hover:bg-success/[0.03]"
                                : "border-border bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10"
                            }`}
                          >
                            {/* Dot indicator position */}
                            <span className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                              {isCompleted ? (
                                <CheckCircle className="w-3.5 h-3.5 text-success fill-current" />
                              ) : (
                                <Circle className="w-2.5 h-2.5 text-muted-foreground" />
                              )}
                            </span>

                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <h4 className={`text-xs font-bold leading-none ${
                                  isCompleted ? "text-success" : "text-foreground"
                                }`}>
                                  {step.title}
                                </h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>

                            {/* Resources tags */}
                            {((step as any).resources) && ((step as any).resources).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                                {((step as any).resources).map((res: string) => (
                                  <span
                                    key={res}
                                    className="inline-flex items-center gap-1 text-[9px] font-mono font-medium text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded"
                                  >
                                    {res} <ExternalLink className="w-2.5 h-2.5" />
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right panel targets details */}
              <div className="space-y-6">
                {/* Target Skills */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-accent-blue" /> Target Skills
                    </CardTitle>
                    <CardDescription>Tech stack focus for this pathway.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 flex flex-wrap gap-2">
                    {selectedRoadmap?.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold text-foreground bg-white/5 border border-white/5 px-2.5 py-1 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </CardContent>
                </Card>

                {/* Suggested Projects */}
                {selectedRoadmap?.projects && selectedRoadmap.projects.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase tracking-wider font-mono">Suggested Projects</CardTitle>
                      <CardDescription>Build portfolio milestones.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2 text-left">
                      {selectedRoadmap.projects.map((p) => (
                        <div key={p.title} className="space-y-1">
                          <div className="text-[10px] font-bold text-foreground">{p.title}</div>
                          <div className="text-[9px] text-muted-foreground leading-relaxed">{p.description}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Certifications path */}
                {selectedRoadmap?.certifications && selectedRoadmap.certifications.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase tracking-wider font-mono">Recommended Certs</CardTitle>
                      <CardDescription>Industry verified achievements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2 text-left">
                      {selectedRoadmap.certifications.map((c) => (
                        <div key={c.title} className="space-y-1">
                          <div className="text-[10px] font-bold text-foreground">{c.title}</div>
                          <div className="text-[9px] text-muted-foreground font-mono">{c.provider}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
