"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { User, AuthState } from "../types/auth";
import { authService } from "@/lib/authService";
import axios from "axios";

export interface AuthContextType extends AuthState {
  setAuthState: (state: Partial<AuthState>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const setAuthState = useCallback((newState: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  // Hydrate session from localStorage or sessionStorage
  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          
          setState({
            user: parsedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // Optionally verify token with backend here
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (e) {
        console.error("Hydration error", e);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    hydrate();
  }, []);

  // Sync user state to storage
  useEffect(() => {
    if (state.user) {
      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(state.user));
      } else if (sessionStorage.getItem("token")) {
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    }
  }, [state.user]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
      const res = await axios.put('/api/user/profile', updates, {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      });

      if (res.status === 200) {
        const updatedUser = res.data.user || { ...state.user, ...updates };
        setState((prev) => ({ ...prev, user: updatedUser as User }));
        return { success: true };
      } else {
        return { success: false, error: "Profile update failed." };
      }
    } catch (e: any) {
      return { success: false, error: e.response?.data?.error || "Failed to update profile." };
    }
  }, [state.token, state.user]);

  const contextValue = useMemo(
    () => ({
      ...state,
      setAuthState,
      logout,
      updateProfile,
    }),
    [state, setAuthState, logout, updateProfile]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
