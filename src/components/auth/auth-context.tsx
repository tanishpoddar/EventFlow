// NOTE: This is a placeholder for a real authentication context.
// In a production app, you would integrate with an actual authentication provider
// (e.g., Firebase Auth, NextAuth.js, Clerk, etc.) and handle sessions, tokens, etc.

"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (userData: User) => void; // Simulate login
  logout: () => void; // Simulate logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User) => {
    // In a real app, this would involve API calls, setting tokens/cookies
    console.log("Simulating login for:", userData.email, "as", userData.userType);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    // In a real app, this would involve API calls, clearing tokens/cookies
    console.log("Simulating logout");
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const userRole = user?.userType || null;

  const value = useMemo(
    () => ({ user, isAuthenticated, userRole, login, logout }),
    [user, isAuthenticated, userRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
