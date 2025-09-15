"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

// User type (matches your `users` table)
interface User {
  id: string; // auth.users.id
  email: string;
  first_name?: string;
  last_name?: string;
  phnumber?: string;
  countrycode?: string;
  short_bio?: string;
  profile_pic?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    fname: string,
    lname: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load current user session
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || "");
      }
    };

    getUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || "");
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile from `users` table
  const fetchUserProfile = async (id: string, email: string) => {
    const { data: profile, error } = await supabaseClient
      .from("users")
      .select("fname, lname, phnumber, countrycode, short_bio, profile_pic")
      .eq("auth_id", id)
      .maybeSingle(); // ✅ safe: no error if no row

    if (error) {
      console.error("Error fetching user profile:", error.message);
    }

    setUser({
      id,
      email,
      first_name: profile?.fname || "",
      last_name: profile?.lname || "",
      phnumber: profile?.phnumber || "",
      countrycode: profile?.countrycode || "",
      short_bio: profile?.short_bio || "",
      profile_pic: profile?.profile_pic || "",
    });
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
        await fetchUserProfile(data.user.id, data.user.email || "");
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      return { success: false, error: msg };
    }
  };

  // Signup (also insert into `users` table)
  const signup = async (
    email: string,
    password: string,
    fname: string,
    lname: string
  ) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) return { success: false, error: error.message };

      if (data?.user) {
        // Create row in `users` table
        await supabaseClient.from("users").insert({
          auth_id: data.user.id,
          email,
          fname,
          lname,
        });

        await fetchUserProfile(data.user.id, email);
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      return { success: false, error: msg };
    }
  };

  // Logout
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "No user is logged in." };

    try {
      const { error } = await supabaseClient
        .from("users")
        .update({
          fname: updates.first_name,
          lname: updates.last_name,
          phnumber: updates.phnumber,
          countrycode: updates.countrycode,
          short_bio: updates.short_bio,
          profile_pic: updates.profile_pic,
        })
        .eq("auth_id", user.id);

      if (error) return { success: false, error: error.message };

      // Update local state
      setUser((prev) =>
        prev ? { ...prev, ...updates } : prev
      );

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
