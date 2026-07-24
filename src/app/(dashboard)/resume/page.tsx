"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  const [summary, setSummary] = useState("A passionate and driven Computer Science student looking for summer internships in Software Engineering.");
  const [skills, setSkills] = useState("JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL");
  
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">Craft your perfect resume and download it as a PDF.</p>
        </div>
        <button className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-accent-blue/20 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Left Pane: Editor */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-3">
              <FileText className="w-5 h-5 text-accent-blue" />
              Professional Summary
            </h2>
            <textarea 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full h-32 bg-muted/50 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
              placeholder="Write a brief professional summary..."
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent-purple" />
                Skills
              </h2>
            </div>
            <textarea 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full h-24 bg-muted/50 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
              placeholder="Comma separated skills (e.g. React, Node, Python)"
            />
          </div>
          
          {/* Mock Education & Experience for UI purposes */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 opacity-70 grayscale">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold">Experience (Coming Soon)</h2>
              <button className="text-accent-blue hover:underline text-sm font-medium">Add</button>
            </div>
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-full lg:w-1/2 bg-muted/30 border border-border rounded-xl flex items-center justify-center p-8 overflow-hidden relative">
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1.5 rounded text-xs font-mono font-medium text-muted-foreground border border-border z-10">
            Live Preview
          </div>
          
          {/* A4 Paper Mockup */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[500px] aspect-[1/1.414] bg-white text-black p-8 sm:p-12 shadow-2xl overflow-hidden rounded-sm"
          >
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 uppercase">John Doe</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">john.doe@example.com • linkedin.com/in/johndoe • GitHub: johndoe</p>
            </div>
            
            {/* Summary */}
            <div className="mb-6">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
              <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed text-justify">
                {summary || "Your professional summary will appear here."}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.split(',').map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Mock Experience */}
            <div>
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">Experience</h2>
              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-gray-900">Software Engineering Intern</h3>
                  <span className="text-[10px] text-gray-500">June 2025 - Aug 2025</span>
                </div>
                <div className="text-[11px] italic text-gray-700 mb-1">Tech Corp Inc.</div>
                <ul className="list-disc list-inside text-[10px] text-gray-600 space-y-1 pl-1">
                  <li>Developed internal tools using React and Node.js.</li>
                  <li>Optimized database queries reducing latency by 20%.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
