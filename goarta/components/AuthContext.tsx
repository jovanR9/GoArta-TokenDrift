"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/app/api/supabaselogin/supabase';

// Types
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          const { id, email } = session.user;
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', id)
            .single();
            
          setUser({
            id,
            email: email || '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || ''
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { id, email } = session.user;
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', id)
            .single();
            
          setUser({
            id,
            email: email || '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || ''
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const { id, email: userEmail } = data.user;
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', id)
          .single();
          
        setUser({
          id,
          email: userEmail || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || ''
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Set user data in state
        setUser({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Social login error:', error);
      }
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, socialLogin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};