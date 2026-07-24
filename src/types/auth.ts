export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin' | 'faculty' | 'recruiter';
  college?: string;
  major?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  gradYear?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  userId: number;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
