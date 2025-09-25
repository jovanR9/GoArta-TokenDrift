"use client";

import React, { useState, useEffect } from "react";
import { Camera, Edit, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { getUserBookings } from "@/lib/bookingService";

const ProfileDashboard = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  // Profile state
  const [profileData, setProfileData] = useState({
    fname: "",
    lname: "",
    phnumber: "",
    countrycode: "+91",
    short_bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booked events state
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Load profile on user change
  useEffect(() => {
    if (user) {
      setProfileData({
        fname: user.fname || "",
        lname: user.lname || "",
        phnumber: user.phnumber || "",
        countrycode: user.countrycode || "+91",
        short_bio: user.short_bio || "",
      });
    }
  }, [user]);

  // Load booked events
  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      setLoadingBookings(true);
const data = await getUserBookings(Number(user.id));
      setBookings(data);
      setLoadingBookings(false);
    }
    fetchBookings();
  }, [user]);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { success, error } = await updateProfile(profileData);
      if (success) {
        setIsEditing(false);
      } else {
        setError(error || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving profile");
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        fname: user.fname || "",
        lname: user.lname || "",
        phnumber: user.phnumber || "",
        countrycode: user.countrycode || "+91",
        short_bio: user.short_bio || "",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Utility
  const getInitials = () => {
    const f = user?.fname ? user.fname.charAt(0) : "";
    const l = user?.lname ? user.lname.charAt(0) : "";
    return f + l;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-700 text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-red-600 text-xl">Please log in to view this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-200 mb-10">
        <div className="h-52 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 relative overflow-hidden">
          {/* Avatar */}
          <div className="absolute mt-28 left-8">
            <div className="relative -mt-20">
              <div className="w-36 h-36 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-6 border-white shadow-2xl">
                {getInitials()}
              </div>
              <div className="-mt-20 absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl cursor-pointer hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110">
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
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg border border-white/30 hover:border-white/50"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 border border-white/20 hover:border-white/40"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-amber-700">Explore, Experience, and Embrace the Rich Heritage</p>
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
                  onChange={(e) => handleInputChange("fname", e.target.value)}
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
                  onChange={(e) => handleInputChange("lname", e.target.value)}
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
                  onChange={(e) => handleInputChange("countrycode", e.target.value)}
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
                  onChange={(e) => handleInputChange("phnumber", e.target.value)}
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
              {user.email}
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
                onChange={(e) => handleInputChange("short_bio", e.target.value)}
                rows={4}
                placeholder="Share your passion for cultural exploration..."
                className="w-full text-amber-900 bg-amber-50/50 border-2 border-amber-300 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 resize-none leading-relaxed"
              />
            ) : (
              <div className="text-amber-800 leading-relaxed py-4 px-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                {profileData.short_bio || "Share your passion for cultural exploration..."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booked Events */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Your Booked Events</h2>
        {loadingBookings ? (
          <p className="text-amber-700">Loading your booked events...</p>
        ) : bookings.length === 0 ? (
          <p className="text-amber-700">You haven’t booked any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-lg p-4 border border-amber-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-amber-900">{b.events.name}</h3>
                <p className="text-amber-800">Price: ₹{b.events.price}</p>
                <p className="text-amber-700">Status: {b.status}</p>
                <p className="text-amber-600 text-sm">
                  Booked on: {new Date(b.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
