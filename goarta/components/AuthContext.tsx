"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

// User type
export interface User {
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
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>; // ✅ added message
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
    console.log("Fetching user profile for auth_id:", auth_id);
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("auth_id", auth_id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    console.log("Database user data:", data);

    // If no data exists for this user, create a basic profile
    if (!data) {
      console.log("No profile found, creating basic profile for user:", auth_id);
      
      // Get user metadata from auth
      const { data: { user } } = await supabaseClient.auth.getUser();
      const metadata = user?.user_metadata || {};
      
      // Create profile with available metadata
      const profileData = {
        auth_id: auth_id,
        email: email,
        fname: metadata.first_name || "",
        lname: metadata.last_name || ""
      };
      
      // Try to create a basic profile entry
      const { data: insertedData, error: insertError } = await supabaseClient
        .from("users")
        .insert(profileData)
        .select();
      
      if (insertError) {
        console.error("Error creating basic profile:", insertError.message);
        // Even if we can't create a profile, return a basic user object
        return {
          id: auth_id,
          email,
          fname: metadata.first_name || "",
          lname: metadata.last_name || ""
        } as User;
      } else {
        console.log("Basic profile created successfully:", insertedData);
        // Return the newly created profile
        const newProfile = insertedData?.[0];
        return {
          id: auth_id,
          email,
          fname: newProfile?.fname || metadata.first_name || "",
          lname: newProfile?.lname || metadata.last_name || "",
          short_bio: newProfile?.short_bio || "",
          profile_pic: newProfile?.profile_pic || "",
          phnumber: newProfile?.phnumber || "",
          countrycode: newProfile?.countrycode || ""
        } as User;
      }
    }

    return {
      id: auth_id,
      email,
      fname: data.fname || "",
      lname: data.lname || "",
      short_bio: data.short_bio || "",
      profile_pic: data.profile_pic || "",
      phnumber: data.phnumber || "",
      countrycode: data.countrycode || ""
    } as User;
  };

  // Check session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const cached = localStorage.getItem("user");
        console.log("Cached user data:", cached);
        if (cached) setUser(JSON.parse(cached));

        const { data: { session } } = await supabaseClient.auth.getSession();
        console.log("Supabase session:", session);
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || "");
          console.log("Fetched profile:", profile);
          if (profile) setUserAndCache(profile);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        console.log("Finished initialization, user:", user);
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" };

    console.log("Updating profile with:", updates);
    console.log("Current user:", user);

    // Try to update first
    const { error: updateError } = await supabaseClient
      .from("users")
      .update(updates)
      .eq("auth_id", user.id);

    // If update fails, it might be because the record doesn't exist
    if (updateError) {
      console.log("Update failed, trying insert:", updateError.message);
      
      // Try to insert a new record
      const insertData = {
        auth_id: user.id,
        email: user.email,
        ...updates
      };
      
      const { error: insertError } = await supabaseClient
        .from("users")
        .insert(insertData);
        
      if (insertError) {
        console.error("Insert also failed:", insertError.message);
        return { success: false, error: insertError.message };
      }
      
      console.log("Insert successful");
    }

    const updatedUser = { ...user, ...updates };
    console.log("Updated user:", updatedUser);
    setUserAndCache(updatedUser);
    return { success: true };
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      if (data?.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email || "");
        if (profile) setUserAndCache(profile);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err: unknown) {
      if (err instanceof Error) return { success: false, error: err.message };
      return { success: false, error: "An unknown error occurred" };
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
        // Don't insert user data here, let fetchUserProfile handle it
        // when the user actually logs in
        return { success: true, message: "Please confirm your email before logging in." };
      }
      return { success: false, error: "Signup failed" };
    } catch (err: unknown) {
      if (err instanceof Error) return { success: false, error: err.message };
      return { success: false, error: "An unknown error occurred" };
    }
  };

  // Logout
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUserAndCache(null);
  };

  // Social login
  const socialLogin = async (provider: "google" | "facebook") => {
    await supabaseClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  // ✅ Resend confirmation email
 const resendConfirmationEmail = async (email: string) => {
  try {
    await supabaseClient.auth.resend({
      type: "signup",
      email,
    });
    return { success: true, message: "Confirmation email has been resent." }; // ✅ added message
  } catch (err: unknown) {
    if (err instanceof Error) return { success: false, error: err.message };
    return { success: false, error: "An unknown error occurred" };
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        socialLogin,
        updateProfile,
        resendConfirmationEmail, // ✅ added here
        isLoading,
      }}
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
