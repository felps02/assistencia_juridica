"use client";

import { useEffect, useState } from "react";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin_token"));
  }, []);

  function saveToken(value: string) {
    localStorage.setItem("admin_token", value);
    document.cookie = `admin_token=${value}; path=/; max-age=28800; samesite=lax`;
    setToken(value);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    document.cookie = "admin_token=; Max-Age=0; path=/";
    setToken(null);
  }

  return { token, saveToken, logout };
}

