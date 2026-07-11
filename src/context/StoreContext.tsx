"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  Skill,
  Goal,
  Internship,
  Certification,
  Todo,
  NotificationItem,
  ResumeData,
  RoadmapProgress,
  Habit,
  StudySession,
  Assignment,
  Exam,
  Settings,
  StoreState,
} from "../types/store";

export interface StoreContextType extends StoreState {
  refreshData: () => Promise<void>;
  
  // Skills CRUD
  addSkill: (skill: Omit<Skill, "id">) => Promise<boolean>;
  updateSkill: (id: string | number, updates: Partial<Skill>) => Promise<boolean>;
  deleteSkill: (id: string | number) => Promise<boolean>;

  // Goals CRUD
  addGoal: (goal: Omit<Goal, "id">) => Promise<boolean>;
  updateGoal: (id: string | number, updates: Partial<Goal>) => Promise<boolean>;
  deleteGoal: (id: string | number) => Promise<boolean>;

  // Internships CRUD
  addInternship: (internship: Omit<Internship, "id">) => Promise<boolean>;
  updateInternship: (id: string | number, updates: Partial<Internship>) => Promise<boolean>;
  deleteInternship: (id: string | number) => Promise<boolean>;

  // Certifications CRUD
  addCertification: (cert: Omit<Certification, "id">) => Promise<boolean>;
  updateCertification: (id: string | number, updates: Partial<Certification>) => Promise<boolean>;
  deleteCertification: (id: string | number) => Promise<boolean>;

  // Todos CRUD
  addTodo: (todo: Omit<Todo, "id">) => void;
  updateTodo: (id: string | number, updates: Partial<Todo>) => void;
  deleteTodo: (id: string | number) => void;

  // Habits CRUD
  addHabit: (name: string) => void;
  toggleHabitDate: (id: string | number, dateStr: string) => void;
  deleteHabit: (id: string | number) => void;

  // Study Sessions CRUD
  addStudySession: (subject: string, duration: number) => void;
  deleteStudySession: (id: string | number) => void;

  // Assignments CRUD
  addAssignment: (assignment: Omit<Assignment, "id">) => void;
  updateAssignment: (id: string | number, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string | number) => void;

  // Exams CRUD
  addExam: (exam: Omit<Exam, "id">) => void;
  updateExam: (id: string | number, updates: Partial<Exam>) => void;
  deleteExam: (id: string | number) => void;

  // Resume Actions
  updateResume: (updates: Partial<ResumeData>) => Promise<boolean>;

  // Roadmap Progress Actions
  toggleRoadmapStep: (roadmapId: string, stepId: string) => Promise<boolean>;

  // Notifications Actions
  markNotificationRead: (id: string) => Promise<boolean>;
  markAllNotificationsRead: () => Promise<boolean>;

  // Settings Actions
  updateSettings: (updates: Partial<Settings>) => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-career-navigator-api.onrender.com";

const DEFAULT_RESUME: ResumeData = {
  template: "modern",
  personal: {},
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  internships: [],
  languages: [],
  achievements: [],
  references: [],
};

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  language: "en",
  notifications: true,
  emailNotifications: true,
  privacy: "public",
};

const INITIAL_STATE: StoreState = {
  skills: [],
  goals: [],
  internships: [],
  certifications: [],
  todos: [],
  notifications: [],
  resumeData: DEFAULT_RESUME,
  roadmapProgress: {},
  habits: [],
  studySessions: [],
  assignments: [],
  exams: [],
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,
};

export const StoreProvider: React.FC<{ children: React.ReactNode; authToken: string | null }> = ({
  children,
  authToken,
}) => {
  const [state, setState] = useState<StoreState>(INITIAL_STATE);

  // Initialize and Hydrate from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("scn_store");
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          ...parsed,
          isLoading: false,
        }));
      }
    } catch (e) {
      console.error("Failed to hydrate Store from LocalStorage", e);
    }
  }, []);

  // Write changes to LocalStorage whenever state updates (excluding load states)
  const saveToLocal = (updatedState: StoreState) => {
    try {
      const { isLoading, error, ...persistentData } = updatedState;
      localStorage.setItem("scn_store", JSON.stringify(persistentData));
    } catch (e) {
      console.error("Failed to save Store to LocalStorage", e);
    }
  };

  const updateStateAndLocal = (updater: (prev: StoreState) => StoreState) => {
    setState((prev) => {
      const next = updater(prev);
      saveToLocal(next);
      return next;
    });
  };

  // Fetch API backed collections from Server
  const refreshData = useCallback(async () => {
    if (!authToken) return;
    
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      // Run parallel fetches for speed
      const [skillsRes, goalsRes, certsRes, internshipsRes, resumeRes, notifsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/skills`, { headers }),
        fetch(`${API_BASE_URL}/api/goals`, { headers }),
        fetch(`${API_BASE_URL}/api/certifications`, { headers }),
        fetch(`${API_BASE_URL}/api/internships`, { headers }),
        fetch(`${API_BASE_URL}/api/resume`, { headers }),
        fetch(`${API_BASE_URL}/api/notifications`, { headers }),
      ]);

      const skillsData = skillsRes.ok ? await skillsRes.json() : [];
      const goalsData = goalsRes.ok ? await goalsRes.json() : [];
      const certsData = certsRes.ok ? await certsRes.json() : [];
      const internshipsData = internshipsRes.ok ? await internshipsRes.json() : [];
      const resumePayload = resumeRes.ok ? await resumeRes.json() : { data: "{}" };
      const notifsData = notifsRes.ok ? await notifsRes.json() : [];

      // Map DB field models back to front-end schemas
      const mappedSkills: Skill[] = skillsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category || "other",
        proficiency: s.level || 0,
        goal: s.level >= 80 ? 100 : 80, // Default goal mapping
      }));

      const mappedGoals: Goal[] = goalsData.map((g: any) => ({
        id: g.id,
        title: g.title,
        category: g.category || "learning",
        type: "daily", // default fallback
        progress: g.status === "completed" ? 100 : 0,
        dueDate: g.deadline,
        status: g.status || "pending",
      }));

      const mappedCerts: Certification[] = certsData.map((c: any) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        category: c.status || "Professional",
        dateObtained: c.date || "",
        credentialUrl: c.url,
      }));

      const mappedInternships: Internship[] = internshipsData.map((i: any) => ({
        id: i.id,
        company: i.company,
        role: i.role,
        status: i.status || "Applied",
        appliedDate: i.deadline, // mapping fallback
      }));

      let parsedResume: ResumeData = DEFAULT_RESUME;
      try {
        parsedResume = JSON.parse(resumePayload.data);
      } catch (e) {
        console.error("Failed to parse resume JSON data payload", e);
      }

      const mappedNotifs: NotificationItem[] = notifsData.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        type: n.read ? "info" : "warning",
        read: n.read || false,
        date: n.createdAt || new Date().toISOString(),
      }));

      // Fetch roadmap progress if there are roadmaps
      const roadmaps = ["full-stack", "java", "python", "ai", "machine-learning", "cybersecurity", "cloud", "devops", "ui-ux", "data-science", "android", "blockchain"];
      const roadmapProgress: RoadmapProgress = {};
      
      await Promise.all(
        roadmaps.map(async (rmId) => {
          try {
            const rmRes = await fetch(`${API_BASE_URL}/api/roadmaps/${rmId}/progress`, { headers });
            if (rmRes.ok) {
              const rmData = await rmRes.json();
              roadmapProgress[rmId] = { completed: rmData.completed || [] };
            }
          } catch (e) {
            console.error(`Failed to fetch progress for roadmap: ${rmId}`, e);
          }
        })
      );

      updateStateAndLocal((prev) => ({
        ...prev,
        skills: mappedSkills,
        goals: mappedGoals,
        certifications: mappedCerts,
        internships: mappedInternships,
        resumeData: parsedResume,
        notifications: mappedNotifs,
        roadmapProgress,
        isLoading: false,
        error: null,
      }));
    } catch (e) {
      console.error("Failed to refresh Store collections from backend API", e);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Network error. Reconnecting...",
      }));
    }
  }, [authToken]);

  // Hydrate whenever auth token becomes active
  useEffect(() => {
    if (authToken) {
      refreshData();
    } else {
      // Clear data on logout to avoid cross-user cache leakage
      setState(INITIAL_STATE);
    }
  }, [authToken, refreshData]);

  // --- SKILLS MUTATIONS ---
  const addSkill = useCallback(async (newSkill: Omit<Skill, "id">) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem: Skill = { ...newSkill, id: tempId };

    // Optimistic Update
    updateStateAndLocal((prev) => ({
      ...prev,
      skills: [...prev.skills, optimisticItem],
    }));

    if (!authToken) return true; // offline mode succeeds locally

    try {
      const res = await fetch(`${API_BASE_URL}/api/skills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSkill.name,
          category: newSkill.category,
          level: newSkill.proficiency,
          tags: "",
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        // Replace temp ID with server ID
        updateStateAndLocal((prev) => ({
          ...prev,
          skills: prev.skills.map((s) =>
            s.id === tempId ? { ...s, id: saved.id } : s
          ),
        }));
        return true;
      }
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Skill creation", e);
      // Rollback optimistic update
      updateStateAndLocal((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== tempId),
      }));
      return false;
    }
  }, [authToken]);

  const updateSkill = useCallback(async (id: string | number, updates: Partial<Skill>) => {
    const previousSkills = [...state.skills];

    // Optimistic Update
    updateStateAndLocal((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const current = previousSkills.find((s) => s.id === id);
      if (!current) return false;

      const merged = { ...current, ...updates };
      const res = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: merged.name,
          category: merged.category,
          level: merged.proficiency,
        }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Skill updates", e);
      // Rollback
      updateStateAndLocal((prev) => ({ ...prev, skills: previousSkills }));
      return false;
    }
  }, [authToken, state.skills]);

  const deleteSkill = useCallback(async (id: string | number) => {
    const previousSkills = [...state.skills];

    // Optimistic Update
    updateStateAndLocal((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Skill deletions", e);
      updateStateAndLocal((prev) => ({ ...prev, skills: previousSkills }));
      return false;
    }
  }, [authToken, state.skills]);

  // --- GOALS MUTATIONS ---
  const addGoal = useCallback(async (newGoal: Omit<Goal, "id">) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem: Goal = { ...newGoal, id: tempId };

    updateStateAndLocal((prev) => ({
      ...prev,
      goals: [...prev.goals, optimisticItem],
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/goals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newGoal.title,
          category: newGoal.category,
          deadline: newGoal.dueDate || "",
          status: newGoal.status,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        updateStateAndLocal((prev) => ({
          ...prev,
          goals: prev.goals.map((g) =>
            g.id === tempId ? { ...g, id: saved.id } : g
          ),
        }));
        return true;
      }
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Goal creation", e);
      updateStateAndLocal((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== tempId),
      }));
      return false;
    }
  }, [authToken]);

  const updateGoal = useCallback(async (id: string | number, updates: Partial<Goal>) => {
    const previousGoals = [...state.goals];

    updateStateAndLocal((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const current = previousGoals.find((g) => g.id === id);
      if (!current) return false;

      const merged = { ...current, ...updates };
      const res = await fetch(`${API_BASE_URL}/api/goals/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: merged.title,
          category: merged.category,
          deadline: merged.dueDate || "",
          status: merged.status,
        }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Goal updates", e);
      updateStateAndLocal((prev) => ({ ...prev, goals: previousGoals }));
      return false;
    }
  }, [authToken, state.goals]);

  const deleteGoal = useCallback(async (id: string | number) => {
    const previousGoals = [...state.goals];

    updateStateAndLocal((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Goal deletions", e);
      updateStateAndLocal((prev) => ({ ...prev, goals: previousGoals }));
      return false;
    }
  }, [authToken, state.goals]);

  // --- INTERNSHIPS MUTATIONS ---
  const addInternship = useCallback(async (newInternship: Omit<Internship, "id">) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem: Internship = { ...newInternship, id: tempId };

    updateStateAndLocal((prev) => ({
      ...prev,
      internships: [...prev.internships, optimisticItem],
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/internships`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: newInternship.company,
          role: newInternship.role,
          status: newInternship.status,
          deadline: newInternship.appliedDate || "",
          link: newInternship.url || "",
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        updateStateAndLocal((prev) => ({
          ...prev,
          internships: prev.internships.map((i) =>
            i.id === tempId ? { ...i, id: saved.id } : i
          ),
        }));
        return true;
      }
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Internship application", e);
      updateStateAndLocal((prev) => ({
        ...prev,
        internships: prev.internships.filter((i) => i.id !== tempId),
      }));
      return false;
    }
  }, [authToken]);

  const updateInternship = useCallback(async (id: string | number, updates: Partial<Internship>) => {
    const previousInternships = [...state.internships];

    updateStateAndLocal((prev) => ({
      ...prev,
      internships: prev.internships.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const current = previousInternships.find((i) => i.id === id);
      if (!current) return false;

      const merged = { ...current, ...updates };
      const res = await fetch(`${API_BASE_URL}/api/internships/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: merged.company,
          role: merged.role,
          status: merged.status,
          deadline: merged.appliedDate || "",
          link: merged.url || "",
        }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Internship updates", e);
      updateStateAndLocal((prev) => ({ ...prev, internships: previousInternships }));
      return false;
    }
  }, [authToken, state.internships]);

  const deleteInternship = useCallback(async (id: string | number) => {
    const previousInternships = [...state.internships];

    updateStateAndLocal((prev) => ({
      ...prev,
      internships: prev.internships.filter((i) => i.id !== id),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/internships/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Internship deletions", e);
      updateStateAndLocal((prev) => ({ ...prev, internships: previousInternships }));
      return false;
    }
  }, [authToken, state.internships]);

  // --- CERTIFICATIONS MUTATIONS ---
  const addCertification = useCallback(async (newCert: Omit<Certification, "id">) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem: Certification = { ...newCert, id: tempId };

    updateStateAndLocal((prev) => ({
      ...prev,
      certifications: [...prev.certifications, optimisticItem],
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/certifications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCert.name,
          issuer: newCert.issuer,
          status: newCert.category,
          date: newCert.dateObtained,
          url: newCert.credentialUrl || "",
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        updateStateAndLocal((prev) => ({
          ...prev,
          certifications: prev.certifications.map((c) =>
            c.id === tempId ? { ...c, id: saved.id } : c
          ),
        }));
        return true;
      }
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Certification creation", e);
      updateStateAndLocal((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== tempId),
      }));
      return false;
    }
  }, [authToken]);

  const updateCertification = useCallback(async (id: string | number, updates: Partial<Certification>) => {
    const previousCerts = [...state.certifications];

    updateStateAndLocal((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const current = previousCerts.find((c) => c.id === id);
      if (!current) return false;

      const merged = { ...current, ...updates };
      const res = await fetch(`${API_BASE_URL}/api/certifications/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: merged.name,
          issuer: merged.issuer,
          status: merged.category,
          date: merged.dateObtained,
          url: merged.credentialUrl || "",
        }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Certification updates", e);
      updateStateAndLocal((prev) => ({ ...prev, certifications: previousCerts }));
      return false;
    }
  }, [authToken, state.certifications]);

  const deleteCertification = useCallback(async (id: string | number) => {
    const previousCerts = [...state.certifications];

    updateStateAndLocal((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));

    if (!authToken || String(id).startsWith("temp_")) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/certifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Certification deletions", e);
      updateStateAndLocal((prev) => ({ ...prev, certifications: previousCerts }));
      return false;
    }
  }, [authToken, state.certifications]);

  // --- LOCAL MUTATIONS (Pure LocalStorage) ---
  
  // Todos
  const addTodo = useCallback((newTodo: Omit<Todo, "id">) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      todos: [...prev.todos, { ...newTodo, id: `todo_${Date.now()}` }],
    }));
  }, []);

  const updateTodo = useCallback((id: string | number, updates: Partial<Todo>) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTodo = useCallback((id: string | number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
  }, []);

  // Habits
  const addHabit = useCallback((name: string) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      habits: [...prev.habits, { id: `habit_${Date.now()}`, name, streak: 0, weeklyHistory: {} }],
    }));
  }, []);

  const toggleHabitDate = useCallback((id: string | number, dateStr: string) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== id) return h;
        const currentVal = h.weeklyHistory[dateStr] || false;
        const updatedHistory = { ...h.weeklyHistory, [dateStr]: !currentVal };
        
        // Simple streak recalculation
        let streak = h.streak;
        if (!currentVal) streak += 1;
        else streak = Math.max(0, streak - 1);

        return {
          ...h,
          weeklyHistory: updatedHistory,
          streak,
        };
      }),
    }));
  }, []);

  const deleteHabit = useCallback((id: string | number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  }, []);

  // Study Sessions
  const addStudySession = useCallback((subject: string, duration: number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      studySessions: [
        ...prev.studySessions,
        { id: `session_${Date.now()}`, subject, duration, date: new Date().toISOString() },
      ],
    }));
  }, []);

  const deleteStudySession = useCallback((id: string | number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      studySessions: prev.studySessions.filter((s) => s.id !== id),
    }));
  }, []);

  // Assignments
  const addAssignment = useCallback((newAssignment: Omit<Assignment, "id">) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { ...newAssignment, id: `assign_${Date.now()}` }],
    }));
  }, []);

  const updateAssignment = useCallback((id: string | number, updates: Partial<Assignment>) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, []);

  const deleteAssignment = useCallback((id: string | number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
  }, []);

  // Exams
  const addExam = useCallback((newExam: Omit<Exam, "id">) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      exams: [...prev.exams, { ...newExam, id: `exam_${Date.now()}` }],
    }));
  }, []);

  const updateExam = useCallback((id: string | number, updates: Partial<Exam>) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  const deleteExam = useCallback((id: string | number) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== id),
    }));
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<Settings>) => {
    updateStateAndLocal((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // --- RESUME SAVE ACTION ---
  const updateResume = useCallback(async (updates: Partial<ResumeData>) => {
    const previousResume = { ...state.resumeData };
    const mergedResume = { ...previousResume, ...updates };

    // Optimistic Update
    updateStateAndLocal((prev) => ({
      ...prev,
      resumeData: mergedResume,
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/resume`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: JSON.stringify(mergedResume),
        }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to sync Resume updates", e);
      updateStateAndLocal((prev) => ({ ...prev, resumeData: previousResume }));
      return false;
    }
  }, [authToken, state.resumeData]);

  // --- ROADMAP PROGRESS MUTATIONS ---
  const toggleRoadmapStep = useCallback(async (roadmapId: string, stepId: string) => {
    const previousProgress = { ...state.roadmapProgress };
    
    // Toggle locally
    const currentCompleted = previousProgress[roadmapId]?.completed || [];
    const isCompleted = currentCompleted.includes(stepId);
    const updatedCompleted = isCompleted
      ? currentCompleted.filter((id) => id !== stepId)
      : [...currentCompleted, stepId];

    const updatedProgress = {
      ...previousProgress,
      [roadmapId]: { completed: updatedCompleted },
    };

    // Optimistic Update
    updateStateAndLocal((prev) => ({
      ...prev,
      roadmapProgress: updatedProgress,
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/roadmaps/${roadmapId}/progress`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stepId }),
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to toggle roadmap progress node", e);
      updateStateAndLocal((prev) => ({ ...prev, roadmapProgress: previousProgress }));
      return false;
    }
  }, [authToken, state.roadmapProgress]);

  // --- NOTIFICATIONS MUTATIONS ---
  const markNotificationRead = useCallback(async (id: string) => {
    const previousNotifs = [...state.notifications];

    // Optimistic Read update
    updateStateAndLocal((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));

    if (!authToken || id.startsWith("temp_")) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to read notification", e);
      updateStateAndLocal((prev) => ({ ...prev, notifications: previousNotifs }));
      return false;
    }
  }, [authToken, state.notifications]);

  const markAllNotificationsRead = useCallback(async () => {
    const previousNotifs = [...state.notifications];

    updateStateAndLocal((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));

    if (!authToken) return true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) return true;
      throw new Error();
    } catch (e) {
      console.error("Failed to read all notifications", e);
      updateStateAndLocal((prev) => ({ ...prev, notifications: previousNotifs }));
      return false;
    }
  }, [authToken, state.notifications]);

  const contextValue = useMemo(
    () => ({
      ...state,
      refreshData,
      addSkill,
      updateSkill,
      deleteSkill,
      addGoal,
      updateGoal,
      deleteGoal,
      addInternship,
      updateInternship,
      deleteInternship,
      addCertification,
      updateCertification,
      deleteCertification,
      addTodo,
      updateTodo,
      deleteTodo,
      addHabit,
      toggleHabitDate,
      deleteHabit,
      addStudySession,
      deleteStudySession,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      addExam,
      updateExam,
      deleteExam,
      updateResume,
      toggleRoadmapStep,
      markNotificationRead,
      markAllNotificationsRead,
      updateSettings,
    }),
    [
      state,
      refreshData,
      addSkill,
      updateSkill,
      deleteSkill,
      addGoal,
      updateGoal,
      deleteGoal,
      addInternship,
      updateInternship,
      deleteInternship,
      addCertification,
      updateCertification,
      deleteCertification,
      addTodo,
      updateTodo,
      deleteTodo,
      addHabit,
      toggleHabitDate,
      deleteHabit,
      addStudySession,
      deleteStudySession,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      addExam,
      updateExam,
      deleteExam,
      updateResume,
      toggleRoadmapStep,
      markNotificationRead,
      markAllNotificationsRead,
      updateSettings,
    ]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};
