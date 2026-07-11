"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Search,
  KeyRound,
  Trash2,
  Check,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

interface UserDirectoryItem {
  id: number;
  name: string;
  email: string;
  role: string;
  college?: string;
  major?: string;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const [usersList, setUsersList] = useState<UserDirectoryItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Modals state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDirectoryItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-career-navigator-api.onrender.com";

  // Fetch all users list
  const fetchAdminData = useCallback(async () => {
    if (!token) return;
    setIsFetching(true);
    setActionError(null);
    try {
      // 1. Fetch Users
      const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsersList(data);
      } else {
        setActionError("Failed to fetch users list.");
      }

      // 2. Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setTotalUsers(statsData.totalUsers || 0);
      }
    } catch (err) {
      setActionError("API server is offline or unreachable.");
    } finally {
      setIsFetching(false);
    }
  }, [token, API_BASE_URL]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || newPassword.length < 6 || !token) return;

    setIsActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${selectedUser.id}/reset-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setActionSuccess(true);
        setNewPassword("");
        setTimeout(() => {
          setActionSuccess(false);
          setIsResetOpen(false);
          setSelectedUser(null);
        }, 1500);
      } else {
        const errData = await res.json();
        setActionError(errData.error || "Failed to reset password.");
      }
    } catch (err) {
      setActionError("Server error occurred during password reset.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser || !token) return;

    setIsActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setActionSuccess(true);
        setTimeout(() => {
          setActionSuccess(false);
          setIsDeleteOpen(false);
          setSelectedUser(null);
          fetchAdminData(); // Refresh table list
        }, 1500);
      } else {
        setActionError("Failed to delete user.");
      }
    } catch (err) {
      setActionError("Server connection lost during user deletion.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter users list based on search query
  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Admin Control Portal
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage student registrations, reset credentials, and view system activity.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchAdminData}
          disabled={isFetching}
          className="h-9 px-3"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stat 1 */}
        <Card hoverEffect>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono tracking-widest text-muted-foreground uppercase">
                Registered Students
              </span>
              <div className="text-2xl font-bold font-mono">
                {isFetching ? "..." : totalUsers || usersList.length}
              </div>
              <p className="text-[10px] text-muted-foreground">Total platform registrations</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue shadow-lg shadow-accent-blue/10">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card hoverEffect>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono tracking-widest text-muted-foreground uppercase">
                System Status
              </span>
              <div className="text-2xl font-bold font-mono text-success flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping shrink-0" />
                ONLINE
              </div>
              <p className="text-[10px] text-muted-foreground">Spring Boot connection live</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center text-success shadow-lg shadow-success/10">
              <Shield className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Manage password resets and accounts.</CardDescription>
          </div>
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-muted border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent-blue"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          {actionError && (
            <div className="p-4 bg-danger/10 border-b border-danger/20 text-xs text-danger flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {isFetching && usersList.length === 0 ? (
            <div className="text-center py-20 text-xs text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
              Loading student directory...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-xs text-muted-foreground">
              No students found matching your search.
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5 text-muted-foreground font-mono uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3.5 font-semibold">User ID</th>
                  <th className="px-6 py-3.5 font-semibold">Name</th>
                  <th className="px-6 py-3.5 font-semibold">Email</th>
                  <th className="px-6 py-3.5 font-semibold">Role</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{u.id}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{u.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        u.role === "admin" ? "bg-accent-purple/10 text-accent-purple" : "bg-accent-blue/10 text-accent-blue"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u);
                          setIsResetOpen(true);
                        }}
                        className="h-8 px-2.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 mr-1" /> Reset
                      </Button>
                      
                      {u.role !== "admin" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsDeleteOpen(true);
                          }}
                          className="h-8 px-2.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal 1: Reset Password */}
      <Dialog
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setSelectedUser(null);
        }}
        title="Reset User Password"
      >
        {actionSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold">Password reset successfully!</h3>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1 bg-white/[0.01] p-3 rounded border border-white/5 text-left text-xs mb-4">
              <div className="font-semibold text-foreground">Target Student: {selectedUser?.name}</div>
              <div className="text-muted-foreground">{selectedUser?.email}</div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters..."
                className="w-full h-10 px-3 bg-muted border border-border rounded-md text-xs focus:outline-none focus:border-accent-blue"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsResetOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isActionLoading}>
                {isActionLoading ? "Saving..." : "Update Password"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* Modal 2: Delete User */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User Account"
      >
        {actionSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold">Student account deleted!</h3>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-xs rounded flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">CRITICAL WARNING</div>
                <div>Deleting this student profile deletes all associated resume, skills, roadmaps, goals, and productivity history. This action cannot be undone.</div>
              </div>
            </div>

            <div className="space-y-1 bg-white/[0.01] p-3 rounded border border-white/5 text-xs">
              <div className="font-semibold text-foreground">Target Student: {selectedUser?.name}</div>
              <div className="text-muted-foreground">{selectedUser?.email}</div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser} disabled={isActionLoading}>
                {isActionLoading ? "Deleting..." : "Confirm Delete Account"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
