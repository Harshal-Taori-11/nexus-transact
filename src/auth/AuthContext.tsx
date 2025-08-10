import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isTokenExpired, parseJwt } from "@/lib/jwt";

export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

type AuthState = {
  token: string | null;
  userId: number | null;
  role: UserRole | null;
};

type AuthContextType = AuthState & {
  login: (data: { token: string; userId: number }) => void;
  logout: () => void;
};

const STORAGE_KEY = "auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ token: null, userId: null, role: null });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed.token && !isTokenExpired(parsed.token)) {
        const claims = parseJwt(parsed.token);
        const role = (claims?.role?.[0] as UserRole) || null;
        setState({ token: parsed.token, userId: parsed.userId, role });
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (data: { token: string; userId: number }) => {
    const claims = parseJwt(data.token);
    const role = (claims?.role?.[0] as UserRole) || null;
    const newState: AuthState = { token: data.token, userId: data.userId, role };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const logout = () => {
    setState({ token: null, userId: null, role: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
