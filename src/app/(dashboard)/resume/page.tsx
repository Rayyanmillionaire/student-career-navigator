"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Settings,
  Download,
  Plus,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import useStore from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

type Step = "personal" | "education" | "experience" | "projects" | "templates";

export default function ResumePage() {
  const { resumeData, updateResume, isLoading } = useStore();

  const [activeStep, setActiveStep] = useState<Step>("personal");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local Form state (synced from store on mount/load)
  const [personal, setPersonal] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  });

  const [education, setEducation] = useState<Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    dates: string;
    gpa?: string;
  }>>([]);

  const [experience, setExperience] = useState<Array<{
    id: string;
    company: string;
    role: string;
    dates: string;
    description: string;
    current: boolean;
  }>>([]);

  const [projects, setProjects] = useState<Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>>([]);

  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern");

  // Hydrate local state from store
  useEffect(() => {
    if (resumeData) {
      setPersonal({
        name: resumeData.personal.name || "",
        email: resumeData.personal.email || "",
        phone: resumeData.personal.phone || "",
        address: resumeData.personal.address || "",
        linkedin: resumeData.personal.linkedin || "",
        github: resumeData.personal.github || "",
        portfolio: resumeData.personal.portfolio || "",
        summary: resumeData.personal.summary || "",
      });
      setEducation(resumeData.education || []);
      setExperience(resumeData.experience || []);
      setProjects(resumeData.projects || []);
      setTemplate(resumeData.template || "modern");
    }
  }, [resumeData]);

  // Save changes to Global Store (optimistic update + API call)
  const handleSave = async () => {
    const updated = {
      template,
      personal,
      education,
      experience,
      projects,
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      internships: resumeData.internships || [],
      languages: resumeData.languages || [],
      achievements: resumeData.achievements || [],
      references: resumeData.references || [],
    };

    const success = await updateResume(updated);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Stepper controls
  const steps: { key: Step; label: string; icon: any }[] = [
    { key: "personal", label: "Profile", icon: User },
    { key: "education", label: "Education", icon: GraduationCap },
    { key: "experience", label: "Work", icon: Briefcase },
    { key: "projects", label: "Projects", icon: FolderGit2 },
    { key: "templates", label: "Style", icon: Settings },
  ];

  const handleNext = () => {
    const idx = steps.findIndex((s) => s.key === activeStep);
    if (idx < steps.length - 1) setActiveStep(steps[idx + 1].key);
  };

  const handlePrev = () => {
    const idx = steps.findIndex((s) => s.key === activeStep);
    if (idx > 0) setActiveStep(steps[idx - 1].key);
  };

  // Education list CRUD
  const addEducation = () => {
    setEducation([
      ...education,
      { id: generateId(), institution: "", degree: "", field: "", dates: "", gpa: "" },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducationField = (id: string, field: string, value: string) => {
    setEducation(
      education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  // Experience list CRUD
  const addExperience = () => {
    setExperience([
      ...experience,
      { id: generateId(), company: "", role: "", dates: "", description: "", current: false },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter((exp) => exp.id !== id));
  };

  const updateExperienceField = (id: string, field: string, value: string | boolean) => {
    setExperience(
      experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  // Projects list CRUD
  const addProject = () => {
    setProjects([
      ...projects,
      { id: generateId(), name: "", description: "", technologies: [], url: "", github: "" },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProjectField = (id: string, field: string, value: string | string[]) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // A4 PDF Generation
  const handleDownloadPDF = () => {
    const element = document.getElementById("resume-preview-paper");
    if (!element) return;

    // Inject html2pdf script dynamically to avoid bundle bloat
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      const opt = {
        margin: 0.2,
        filename: `${personal.name || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      // @ts-ignore
      window.html2pdf().from(element).set(opt).save();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Resume Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Construct an ATS-friendly resume to secure your target career interviews.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isLoading}>
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-success" /> Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" /> Save Changes
              </>
            )}
          </Button>
          <Button variant="gradient" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Stepper Form */}
        <div className="space-y-6">
          {/* Stepper Tabs Nav */}
          <div className="flex justify-between border-b border-border pb-1 overflow-x-auto gap-2 bg-white/[0.01] p-1.5 rounded-lg border border-white/5">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = s.key === activeStep;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveStep(s.key)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-semibold select-none transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper Content Slider */}
          <Card className="min-h-[380px]">
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {activeStep === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <CardTitle className="text-base uppercase tracking-wider font-mono">Personal Info</CardTitle>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Name</label>
                        <input
                          type="text"
                          value={personal.name}
                          onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                          className="w-full h-9 px-3 bg-muted border border-border rounded-md text-xs focus:outline-none focus:border-accent-blue"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Email</label>
                        <input
                          type="email"
                          value={personal.email}
                          onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                          className="w-full h-9 px-3 bg-muted border border-border rounded-md text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Phone</label>
                        <input
                          type="text"
                          value={personal.phone}
                          onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                          className="w-full h-9 px-3 bg-muted border border-border rounded-md text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Address</label>
                        <input
                          type="text"
                          value={personal.address}
                          onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                          className="w-full h-9 px-3 bg-muted border border-border rounded-md text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Professional Summary</label>
                      <textarea
                        value={personal.summary}
                        onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                        className="w-full min-h-[90px] p-3 bg-muted border border-border rounded-md text-xs focus:outline-none focus:border-accent-blue"
                        placeholder="Detail your career summary..."
                      />
                    </div>
                  </motion.div>
                )}

                {activeStep === "education" && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base uppercase tracking-wider font-mono">Academic Profiles</CardTitle>
                      <Button variant="outline" size="sm" onClick={addEducation}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>

                    {education.length === 0 && (
                      <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        No education records added.
                      </div>
                    )}

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {education.map((edu, idx) => (
                        <div key={edu.id} className="p-4 rounded-lg border border-border bg-white/[0.01] space-y-3 relative">
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-xs font-bold text-accent-blue font-mono">Degree #{idx + 1}</div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => updateEducationField(edu.id, "institution", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                            <input
                              placeholder="Degree (e.g. BS)"
                              value={edu.degree}
                              onChange={(e) => updateEducationField(edu.id, "degree", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                            <input
                              placeholder="Field (e.g. Computer Science)"
                              value={edu.field}
                              onChange={(e) => updateEducationField(edu.id, "field", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs"
                            />
                            <input
                              placeholder="Dates (e.g. 2021 - 2025)"
                              value={edu.dates}
                              onChange={(e) => updateEducationField(edu.id, "dates", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base uppercase tracking-wider font-mono">Work Experience</CardTitle>
                      <Button variant="outline" size="sm" onClick={addExperience}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>

                    {experience.length === 0 && (
                      <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        No work records added.
                      </div>
                    )}

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {experience.map((exp, idx) => (
                        <div key={exp.id} className="p-4 rounded-lg border border-border bg-white/[0.01] space-y-3 relative">
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-xs font-bold text-accent-blue font-mono">Job #{idx + 1}</div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => updateExperienceField(exp.id, "company", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                            <input
                              placeholder="Role (e.g. Developer)"
                              value={exp.role}
                              onChange={(e) => updateExperienceField(exp.id, "role", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                            <input
                              placeholder="Dates (e.g. 2024 - Present)"
                              value={exp.dates}
                              onChange={(e) => updateExperienceField(exp.id, "dates", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs col-span-2"
                            />
                          </div>
                          <textarea
                            placeholder="Responsibilities & bullet points..."
                            value={exp.description}
                            onChange={(e) => updateExperienceField(exp.id, "description", e.target.value)}
                            className="w-full min-h-[60px] p-3 bg-muted border border-border rounded text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === "projects" && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base uppercase tracking-wider font-mono">Projects Portfolio</CardTitle>
                      <Button variant="outline" size="sm" onClick={addProject}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>

                    {projects.length === 0 && (
                      <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        No projects records added.
                      </div>
                    )}

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {projects.map((p, idx) => (
                        <div key={p.id} className="p-4 rounded-lg border border-border bg-white/[0.01] space-y-3 relative">
                          <button
                            onClick={() => removeProject(p.id)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-xs font-bold text-accent-blue font-mono">Project #{idx + 1}</div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              placeholder="Name"
                              value={p.name}
                              onChange={(e) => updateProjectField(p.id, "name", e.target.value)}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                            <input
                              placeholder="Technologies (comma separated)"
                              value={p.technologies.join(", ")}
                              onChange={(e) => updateProjectField(p.id, "technologies", e.target.value.split(", "))}
                              className="h-9 px-3 bg-muted border border-border rounded text-xs focus:outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Project summaries..."
                            value={p.description}
                            onChange={(e) => updateProjectField(p.id, "description", e.target.value)}
                            className="w-full min-h-[60px] p-3 bg-muted border border-border rounded text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === "templates" && (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <CardTitle className="text-base uppercase tracking-wider font-mono">Template Style</CardTitle>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTemplate("modern")}
                        className={`p-4 rounded-lg border text-xs font-bold font-sans text-center transition-all ${
                          template === "modern"
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                            : "border-border bg-white/[0.01] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Modern Glow
                      </button>
                      <button
                        onClick={() => setTemplate("classic")}
                        className={`p-4 rounded-lg border text-xs font-bold font-sans text-center transition-all ${
                          template === "classic"
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                            : "border-border bg-white/[0.01] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Classic Serif
                      </button>
                      <button
                        onClick={() => setTemplate("minimal")}
                        className={`p-4 rounded-lg border text-xs font-bold font-sans text-center transition-all ${
                          template === "minimal"
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                            : "border-border bg-white/[0.01] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Minimalist
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Stepper buttons footer */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={steps.findIndex((s) => s.key === activeStep) === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={steps.findIndex((s) => s.key === activeStep) === steps.length - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Right Side: Virtual A4 Preview */}
        <div className="space-y-4">
          <div className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-blue" /> Live Preview
          </div>
          
          <div className="w-full overflow-x-auto p-4 bg-white/[0.01] border border-border rounded-lg select-none">
            {/* Aspect container scales down internally via CSS variables */}
            <div
              id="resume-preview-paper"
              className={`w-[600px] h-[848px] bg-white text-black p-10 flex flex-col justify-start text-left shadow-2xl mx-auto ${
                template === "classic" ? "font-serif" : "font-sans"
              }`}
            >
              {/* Header profile details */}
              <div className="space-y-2 pb-4 border-b border-zinc-200">
                <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
                  {personal.name || "YOUR NAME"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-600">
                  {personal.email && <span>{personal.email}</span>}
                  {personal.phone && <span>{personal.phone}</span>}
                  {personal.address && <span>{personal.address}</span>}
                </div>
              </div>

              {/* Summary */}
              {personal.summary && (
                <div className="py-4 border-b border-zinc-100 space-y-1">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Summary</h3>
                  <p className="text-[10px] text-zinc-700 leading-relaxed">{personal.summary}</p>
                </div>
              )}

              {/* Education section */}
              {education.length > 0 && (
                <div className="py-4 border-b border-zinc-100 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Education</h3>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-950">{edu.institution || "College Name"}</div>
                          <div className="text-[9px] text-zinc-600">
                            {edu.degree || "Degree"} in {edu.field || "Major"}
                          </div>
                        </div>
                        <div className="text-[9px] font-medium text-zinc-500">{edu.dates || "Dates"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work section */}
              {experience.length > 0 && (
                <div className="py-4 border-b border-zinc-100 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Work Experience</h3>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[10px] font-bold text-zinc-950">{exp.company || "Company"}</div>
                            <div className="text-[9px] text-zinc-600">{exp.role || "Role"}</div>
                          </div>
                          <div className="text-[9px] font-medium text-zinc-500">{exp.dates || "Dates"}</div>
                        </div>
                        <p className="text-[9px] text-zinc-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects section */}
              {projects.length > 0 && (
                <div className="py-4 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Projects</h3>
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="space-y-1">
                        <div className="flex justify-between">
                          <div className="text-[10px] font-bold text-zinc-950">{p.name || "Project Name"}</div>
                          <div className="text-[8px] font-mono font-medium text-zinc-400">
                            {p.technologies.join(" • ")}
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-600 leading-relaxed">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
