"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

// User type (matches your users table)
interface User {
  id: string; // Supabase Auth UID
  fname?: string;
  lname?: string;
  email: string;
  short_bio?: string;
  profile_pic?: string;
  phnumber?: string;
  countrycode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phnumber?: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  socialLogin: (provider: "google" | "facebook") => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile by auth_id
  const fetchUserProfile = async (auth_id: string, email: string) => {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("auth_id", auth_id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    return {
      id: auth_id,
      email,
      fname: data.fname,
      lname: data.lname,
      short_bio: data.short_bio,
      profile_pic: data.profile_pic,
      phnumber: data.phnumber,
      countrycode: data.countrycode,
    } as User;
  };

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email || "");
        if (profile) setUser(profile);
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || "");
          if (profile) setUser(profile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { success: false, error: error.message };

      if (data?.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email || "");
        if (profile) setUser(profile);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Signup
  const signup = async (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phnumber?: string
  ) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });

      if (error) return { success: false, error: error.message };

      if (data?.user) {
        // Insert into users table
        await supabaseClient.from("users").insert({
          auth_id: data.user.id,
          email,
          fname,
          lname,
          phnumber: phnumber || "",
        });

        setUser({
          id: data.user.id,
          email,
          fname,
          lname,
          phnumber,
        });

        return { success: true, message: "Please confirm your email before logging in." };
      }

      return { success: false, error: "Signup failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Social login (Google, Facebook)
  const socialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) console.error("Social login error:", error.message);
    } catch (err: any) {
      console.error("Social login error:", err.message);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" };

    const { error } = await supabaseClient
      .from("users")
      .update(updates)
      .eq("auth_id", user.id);

    if (error) return { success: false, error: error.message };

    setUser({ ...user, ...updates });
    return { success: true };
  };

  // Logout
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, socialLogin, updateProfile, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
