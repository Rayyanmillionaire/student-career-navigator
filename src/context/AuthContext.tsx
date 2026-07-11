"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { User, AuthState } from "../types/auth";

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  resetUserPassword: (userId: number, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-career-navigator-api.onrender.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verify token validity by calling profile endpoint
  const verifyToken = useCallback(async (token: string): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.error("Token verification failed", e);
      return null;
    }
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedToken = localStorage.getItem("scn_token");
        const storedUser = localStorage.getItem("scn_user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          
          // Set initial local state to avoid flickers
          setState((prev) => ({
            ...prev,
            user: parsedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: true,
          }));

          // Validate token against backend
          const freshUser = await verifyToken(storedToken);
          if (freshUser) {
            localStorage.setItem("scn_user", JSON.stringify(freshUser));
            setState({
              user: freshUser,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Token expired or invalid, logout
            localStorage.removeItem("scn_token");
            localStorage.removeItem("scn_user");
            setState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: "Session expired. Please log in again.",
            });
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (e) {
        console.error("Hydration error", e);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    hydrate();
  }, [verifyToken]);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("scn_token", data.token);
        localStorage.setItem("scn_user", JSON.stringify(data.user));

        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = data.error || "Login failed. Please check your credentials.";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
      }
    } catch (e) {
      const errorMsg = "Unable to connect to the login server.";
      console.error("Login request error", e);
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("scn_token", data.token);
        localStorage.setItem("scn_user", JSON.stringify(data.user));

        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = data.error || "Registration failed. Please check details.";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
      }
    } catch (e) {
      const errorMsg = "Unable to connect to the signup server.";
      console.error("Signup request error", e);
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("scn_token");
    localStorage.removeItem("scn_user");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.token) return { success: false, error: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        // updates return updated user inside data.user
        const updatedUser = data.user || { ...state.user, ...updates };
        localStorage.setItem("scn_user", JSON.stringify(updatedUser));
        setState((prev) => ({ ...prev, user: updatedUser }));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Profile update failed." };
      }
    } catch (e) {
      console.error("Profile update request error", e);
      return { success: false, error: "Failed to connect to the server." };
    }
  }, [state.token, state.user]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!state.token) return { success: false, error: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Password change failed." };
      }
    } catch (e) {
      console.error("Change password request error", e);
      return { success: false, error: "Failed to connect to the server." };
    }
  }, [state.token]);

  const resetUserPassword = useCallback(async (userId: number, newPass: string) => {
    if (!state.token || state.user?.role !== "admin") {
      return { success: false, error: "Access denied. Admin role required." };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/reset-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPass }),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || "Failed to reset student password." };
      }
    } catch (e) {
      console.error("Reset user password request error", e);
      return { success: false, error: "Failed to connect to the server." };
    }
  }, [state.token, state.user]);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
      resetUserPassword,
    }),
    [state, login, signup, logout, updateProfile, changePassword, resetUserPassword]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
