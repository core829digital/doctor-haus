"use client";

import { useEffect, useState, useCallback } from "react";

const TOKEN_KEY = "customer_session_token";
const USER_KEY = "customer_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): { email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: { email: string; name: string }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("customer_email");
}

export function useCustomerAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      const legacyEmail = localStorage.getItem("customer_email");
      if (legacyEmail) {
        localStorage.setItem("customer_email", legacyEmail);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: { email: string; name: string }) => {
    setStoredSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return { token, user, loading, login, logout, isAuthenticated };
}
