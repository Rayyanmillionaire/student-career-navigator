export interface Skill {
  id: string | number;
  name: string;
  category: string;
  proficiency: number;
  goal: number;
  createdAt?: string;
}

export interface Goal {
  id: string | number;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'career';
  category: string;
  progress: number;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: string;
}

export interface Internship {
  id: string | number;
  company: string;
  role: string;
  location?: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Accepted' | 'Rejected';
  appliedDate?: string;
  interviewDate?: string;
  stipend?: string;
  url?: string;
  notes?: string;
}

export interface Certification {
  id: string | number;
  name: string;
  issuer: string;
  category: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
}

export interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'project' | 'personal';
  dueDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
  date: string;
}

export interface ResumeData {
  template: 'modern' | 'classic' | 'minimal';
  personal: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary?: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    dates: string;
    gpa?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    dates: string;
    description: string;
    current: boolean;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  internships: Array<{
    id: string;
    company: string;
    role: string;
    dates: string;
    description: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
  achievements: Array<{
    id: string;
    text: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email?: string;
    phone?: string;
  }>;
}

export interface RoadmapProgress {
  [roadmapId: string]: {
    completed: string[];
  };
}

export interface Habit {
  id: string | number;
  name: string;
  streak: number;
  weeklyHistory: { [dateStr: string]: boolean };
}

export interface StudySession {
  id: string | number;
  subject: string;
  duration: number; // in seconds
  date: string;
}

export interface Assignment {
  id: string | number;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Exam {
  id: string | number;
  subject: string;
  date: string;
  type: string;
  notes?: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  privacy: 'public' | 'private';
}

export interface StoreState {
  skills: Skill[];
  goals: Goal[];
  internships: Internship[];
  certifications: Certification[];
  todos: Todo[];
  notifications: NotificationItem[];
  resumeData: ResumeData;
  roadmapProgress: RoadmapProgress;
  habits: Habit[];
  studySessions: StudySession[];
  assignments: Assignment[];
  exams: Exam[];
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}
