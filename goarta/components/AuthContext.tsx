"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

// User type
interface User {
  id: string;
  email: string;
  fname?: string;
  lname?: string;
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

  // Helper to sync state + localStorage
  const setUserAndCache = (profile: User | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Fetch profile from Supabase
  const fetchUserProfile = async (auth_id: string, email: string) => {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("auth_id", auth_id)
      .maybeSingle();

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
    const init = async () => {
      try {
        // 1. Load from localStorage (faster UI)
        const cached = localStorage.getItem("user");
        if (cached) setUser(JSON.parse(cached));

        // 2. Verify with Supabase
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || "");
          if (profile) setUserAndCache(profile);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" };

    const { error } = await supabaseClient
      .from("users")
      .update(updates)
      .eq("auth_id", user.id);

    if (error) return { success: false, error: error.message };

    const updatedUser = { ...user, ...updates };
    setUserAndCache(updatedUser);
    return { success: true };
  };

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
        if (profile) setUserAndCache(profile);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Signup
  const signup = async (email: string, password: string, fname: string, lname: string, phnumber?: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) return { success: false, error: error.message };

      if (data?.user) {
        await supabaseClient.from("users").insert({
          auth_id: data.user.id,
          email,
          fname,
          lname,
          phnumber: phnumber || "",
        });

        const profile: User = { id: data.user.id, email, fname, lname, phnumber };
        setUserAndCache(profile);

        return { success: true, message: "Please confirm your email before logging in." };
      }
      return { success: false, error: "Signup failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUserAndCache(null);
  };

  const socialLogin = async (provider: "google" | "facebook") => {
    await supabaseClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, socialLogin, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
