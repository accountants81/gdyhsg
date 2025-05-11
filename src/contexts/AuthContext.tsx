
"use client";

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_EMAILS, ADMIN_PASSWORD } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; isAdminUser: boolean }>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('aaamo-user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      // Check if the stored user's email is in the admin list
      setIsAdmin(ADMIN_EMAILS.includes(parsedUser.email.toLowerCase()) && parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; isAdminUser: boolean }> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const lowerCaseEmail = email.toLowerCase();
    const isActualAdmin = ADMIN_EMAILS.includes(lowerCaseEmail) && pass === ADMIN_PASSWORD;

    if (isActualAdmin) {
      const adminUser: User = { id: `admin-${lowerCaseEmail}`, email: lowerCaseEmail, role: 'admin', name: 'Admin User' };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('aaamo-user', JSON.stringify(adminUser));
      setLoading(false);
      return { success: true, isAdminUser: true };
    } else if (email && pass) { // Simulate a generic customer login
      const customerUser: User = { id: `cust-${Date.now()}`, email: lowerCaseEmail, role: 'customer', name: 'عميل جديد' };
      setUser(customerUser);
      setIsAdmin(false);
      localStorage.setItem('aaamo-user', JSON.stringify(customerUser));
      setLoading(false);
      return { success: true, isAdminUser: false };
    }
    
    setLoading(false);
    return { success: false, isAdminUser: false };
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
