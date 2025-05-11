
"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { TooltipProvider } from "@/components/ui/tooltip";
// Import other providers here as needed, e.g., QueryClientProvider

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  );
}
