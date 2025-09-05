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
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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
        // Provide a more user-friendly error message for unconfirmed emails
        if (error.message.includes("Email not confirmed")) {
          return { 
            success: false, 
            error: "Please check your email and confirm your account before logging in." 
          };
        }
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
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
          emailRedirectTo: `${window.location.origin}/login`
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Check if user needs to confirm their email
        if (data.user.identities && data.user.identities.length === 0) {
          // This means the user already exists and is confirmed
          setUser({
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName
          });
          return { success: true };
        } else {
          // New user, needs to confirm email
          return { 
            success: true, 
            message: "Please check your email to confirm your account before logging in." 
          };
        }
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Social login error:', errorMessage);
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: "Confirmation email has been resent. Please check your inbox." };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, socialLogin, resendConfirmationEmail, isLoading }}>
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