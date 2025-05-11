
"use client";

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_EMAIL } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>; // Simulate async login
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to load user from localStorage on initial mount
    setLoading(true);
    const storedUser = localStorage.getItem('aaamo-user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.email === ADMIN_EMAIL && parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_EMAIL && pass === ADMIN_EMAIL) { // Using ADMIN_EMAIL as password for demo
      const adminUser: User = { id: 'admin-user', email: ADMIN_EMAIL, role: 'admin', name: 'المطور' };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('aaamo-user', JSON.stringify(adminUser));
      setLoading(false);
      return true;
    } else if (email && pass) { // Simulate a generic customer login
      const customerUser: User = { id: `cust-${Date.now()}`, email, role: 'customer', name: 'عميل جديد' };
      setUser(customerUser);
      setIsAdmin(false);
      localStorage.setItem('aaamo-user', JSON.stringify(customerUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false; // Login failed
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('aaamo-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
