export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
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
