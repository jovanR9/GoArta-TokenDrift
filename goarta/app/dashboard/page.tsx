"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Edit,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import DashboardCards from "@/components/DashboardCard";
import { useRouter } from "next/navigation";



const ProfileDashboard = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    fname: "",
    lname: "",
    phnumber: "",
    countrycode: "+91",
    short_bio: "",
  });

  // Debugging: Log profileData changes
  useEffect(() => {
    console.log("Profile data state updated:", profileData);
  }, [profileData]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form with user data on load
  useEffect(() => {
    console.log("User data updated:", user);
    if (user) {
      setProfileData({
        fname: user?.fname || "",
        lname: user?.lname || "",
        phnumber: user?.phnumber || "",
        countrycode: user?.countrycode || "+91",
        short_bio: user?.short_bio || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const updates = {
      fname: profileData.fname,
      lname: profileData.lname,
      phnumber: profileData.phnumber,
      countrycode: profileData.countrycode,
      short_bio: profileData.short_bio,
    };

    try {
      const { success, error } = await updateProfile(updates);
      if (success) {
        setIsEditing(false);
        console.log("Profile saved successfully!");
      } else {
        setError(error || "Failed to save profile. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while saving profile. Please try again.");
      console.error("Profile save error:", err);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        fname: user?.fname || "",
        lname: user?.lname || "",
        phnumber: user?.phnumber || "",
        countrycode: user?.countrycode || "+91",
        short_bio: user?.short_bio || "",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-700 text-xl">
          Loading your cultural journey...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-red-600 text-xl">
          Please log in to view this page.
        </div>
      </div>
    );
  }

  // ✅ Safe initials function
  const getInitials = () => {
    const f = user?.fname ? user.fname.charAt(0) : "";
    const l = user?.lname ? user.lname.charAt(0) : "";
    return f + l;
  };

  // ✅ Full return
  return (
    <>
      <div className="mt-12 min-h-screen p-6 relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-20 animate-pulse delay-2000"></div>

        {/* Profile Card */}
        <div className="relative z-10 flex justify-center">
          <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
            {/* Header */}
            <div className="h-52 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 relative overflow-hidden">
              {/* Avatar */}
              <div className="absolute mt-28 left-8 ">
                <div className="relative -mt-20">
                  <div className="w-36 h-36 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-6 border-white shadow-2xl relative overflow-hidden">
                    <span className="relative z-10">{getInitials()}</span>
                  </div>
                  <div className=" -mt-20 absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl cursor-pointer hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="absolute top-6 right-6 flex gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg border border-white/30 hover:border-white/50"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-24 px-10 pb-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                  {error}
                </div>
              )}

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-amber-900 mb-2">
                  Welcome to Your Cultural Journey
                </h1>
                <p className="text-amber-700">
                  Explore, Experience, and Embrace the Rich Heritage
                </p>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fname}
                      onChange={(e) =>
                        handleInputChange("fname", e.target.value)
                      }
                      className="w-full text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                    />
                  ) : (
                    <div className="text-lg text-amber-800 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                      {profileData.fname}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lname}
                      onChange={(e) =>
                        handleInputChange("lname", e.target.value)
                      }
                      className="w-full text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                    />
                  ) : (
                    <div className="text-lg text-amber-800 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                      {profileData.lname}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="flex gap-3">
                    <select
                      value={profileData.countrycode}
                      onChange={(e) =>
                        handleInputChange("countrycode", e.target.value)
                      }
                      className="w-24 text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                    </select>

                    <input
                      type="text"
                      value={profileData.phnumber}
                      onChange={(e) =>
                        handleInputChange("phnumber", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="flex-1 text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="text-lg text-amber-800 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                    {profileData.countrycode} {profileData.phnumber}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="text-lg text-amber-700 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                  {user?.email}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                  Cultural Journey Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.short_bio}
                    onChange={(e) =>
                      handleInputChange("short_bio", e.target.value)
                    }
                    rows={4}
                    placeholder="Share your passion for cultural exploration..."
                    className="w-full text-amber-900 bg-amber-50/50 border-2 border-amber-300 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 resize-none leading-relaxed"
                  />
                ) : (
                  <div className="text-amber-800 leading-relaxed py-4 px-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    {profileData.short_bio ||
                      "Share your passion for cultural exploration..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div>
        <DashboardCards />
        {/* <CulturalDashboardCards /> */}
      </div>
    </>
  );
};

export default ProfileDashboard;
