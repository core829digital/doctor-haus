"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState, useCallback, useMemo } from "react";

const TOKEN_KEY = "admin_session_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const queryArgs = useMemo(
    () => (token ? { token } : "skip"),
    [token],
  );
  const user = useQuery(api.adminAuth.getCurrentUser, queryArgs);

  const loading = !!token && user === undefined;

  const loginMutation = useMutation(api.adminAuth.login);
  const logoutMutation = useMutation(api.adminAuth.logout);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ email, password });
    setStoredToken(result.token);
    setToken(result.token);
    return result.user;
  }, [loginMutation]);

  const logout = useCallback(async () => {
    if (token) {
      try { await logoutMutation({ token }); } catch {}
      clearStoredToken();
      setToken(null);
    }
  }, [token, logoutMutation]);

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    token,
  };
}
