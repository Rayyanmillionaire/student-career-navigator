"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Clock, Building2, Search, Filter, CheckCircle2 } from "lucide-react";

export default function InternshipsPage() {
  const [activeTab, setActiveTab] = useState("discover"); // discover, applied
  const [internships] = useState([
    {
      id: 1,
      title: "Frontend Engineering Intern",
      company: "Vercel",
      location: "Remote",
      salary: "$8k - $10k / mo",
      type: "Summer 2026",
      logo: "V",
      color: "bg-black",
      applied: false
    },
    {
      id: 2,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      salary: "$9k - $11k / mo",
      type: "Summer 2026",
      logo: "G",
      color: "bg-blue-500",
      applied: true
    },
    {
      id: 3,
      title: "Product Design Intern",
      company: "Figma",
      location: "San Francisco, CA",
      salary: "$7k - $9k / mo",
      type: "Fall 2025",
      logo: "F",
      color: "bg-orange-500",
      applied: false
    },
    {
      id: 4,
      title: "Backend Engineering Intern",
      company: "Stripe",
      location: "Remote / NYC",
      salary: "$9k - $12k / mo",
      type: "Summer 2026",
      logo: "S",
      color: "bg-indigo-500",
      applied: false
    }
  ]);

  const [appliedJobs, setAppliedJobs] = useState<number[]>([2]); // IDs of applied jobs

  const handleApply = (id: number) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Internship Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover and apply to top internships seamlessly.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setActiveTab("discover")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'discover' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setActiveTab("applied")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'applied' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Applications <span className="ml-1.5 bg-accent-blue/10 text-accent-blue px-1.5 rounded-full text-xs">{appliedJobs.length}</span>
          </button>
        </div>
      </div>

      {activeTab === 'discover' && (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by role, company, or tech stack..." 
                className="w-full h-11 pl-9 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
            <button className="h-11 px-4 bg-card border border-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-muted/50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internships.map(job => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <motion.div 
                  key={job.id}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${job.color} flex items-center justify-center text-white font-bold text-lg shadow-inner`}>
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent-blue transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {job.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied}
                    className={`w-full h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isApplied 
                        ? 'bg-success/10 text-success cursor-default border border-success/20' 
                        : 'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-lg shadow-accent-blue/20'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Applied
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'applied' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Role & Company</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date Applied</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {internships.filter(job => appliedJobs.includes(job.id)).map(job => (
                  <tr key={job.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{job.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        {job.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Today
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-accent-blue/10 text-accent-blue px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-accent-blue/20">
                        In Review
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent-purple hover:underline text-xs font-semibold">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {appliedJobs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      You haven't applied to any internships yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}