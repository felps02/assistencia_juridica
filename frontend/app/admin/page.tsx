"use client";

import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogin } from "@/components/AdminLogin";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminPage() {
  const { token, saveToken, logout } = useAdminAuth();
  if (!token) return <AdminLogin onLogin={saveToken} />;
  return <AdminDashboard onLogout={logout} />;
}

