"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Edit, LogOut, MapPin, Globe, Calendar, Star } from 'lucide-react';

import { useAuth } from '@/components/AuthContext';
import DashboardCards from '@/components/DashboardCard';
import { useRouter } from 'next/navigation';

// Cultural Tourism Dashboard Cards Component for demo
const CulturalDashboardCards = () => (
  <div className="mt-16 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Your Cultural Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: MapPin, title: "Places Visited", value: "12", subtitle: "Heritage Sites", color: "from-amber-600 to-orange-600" },
          { icon: Calendar, title: "Tours Booked", value: "8", subtitle: "This Year", color: "from-red-600 to-pink-600" },
          { icon: Star, title: "Reviews Given", value: "24", subtitle: "5-Star Average", color: "from-purple-600 to-indigo-600" },
          { icon: Globe, title: "Countries", value: "3", subtitle: "Explored", color: "from-teal-600 to-blue-600" }
        ].map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border border-amber-100">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-amber-900 mb-1">{card.value}</div>
            <div className="text-lg font-semibold text-amber-800 mb-1">{card.title}</div>
            <div className="text-sm text-amber-600">{card.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileDashboard = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    fname: '',
    lname: '',
    phnumber: '',
    countrycode: '+91',
    short_bio: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      setProfileData({
        fname: user.fname || '',
        lname: user.lname || '',
        phnumber: user.phnumber || '',
        countrycode: user.countrycode || '+91',
        short_bio: user.short_bio || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Use the correct field names that match your database schema
    const updates = {
      fname: profileData.fname,     // Matches users table
      lname: profileData.lname,     // Matches users table
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
        fname: user.fname || '',
        lname: user.lname || '',
        phnumber: user.phnumber || '',
        countrycode: user.countrycode || '+91',
        short_bio: user.short_bio || ''
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-700 text-xl">Loading your cultural journey...</div>
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

  const getInitials = () => {
    return `${user.fname?.charAt(0) || ''}${user.lname?.charAt(0) || ''}`;
  };

  return (
    <>
      <div className="mt-12 min-h-screen p-6 relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Cultural Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Floating Cultural Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-20 animate-pulse delay-2000"></div>

        {/* Content */}
        <div className="relative z-10 flex justify-center">
          {/* Profile Card */}
          <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-200">

            {/* Header with Cultural Heritage Theme */}
            <div className="h-52 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 relative overflow-hidden">
              {/* Cultural Pattern Overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-8.837-7.163-16-16-16S-12 11.163-12 20s7.163 16 16 16 16-7.163 16-16zm-16 8c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {/* Cultural Icons */}
              <div className="absolute top-6 left-6 flex gap-3 opacity-60">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Profile Avatar with Cultural Design */}
              <div className="absolute -bottom-20 left-8">
                <div className="relative">
                  <div className="w-36 h-36 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-6 border-white shadow-2xl relative overflow-hidden">
                    {/* Inner Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    <span className="relative z-10">{getInitials()}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl cursor-pointer hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                      {isSaving ? 'Saving...' : 'Save Changes'}
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

              {/* Cultural Tourism Badge */}
              <div className="absolute bottom-6 right-6">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <span className="text-white text-sm font-medium">Cultural Explorer</span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-24 px-10 pb-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                  {error}
                </div>
              )}

              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-amber-900 mb-2">
                  Welcome to Your Cultural Journey
                </h1>
                <p className="text-amber-700">Explore, Experience, and Embrace the Rich Heritage</p>
              </div>
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fname}
                      onChange={(e) => handleInputChange('fname', e.target.value)}
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
                      onChange={(e) => handleInputChange('lname', e.target.value)}
                      className="w-full text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                    />
                  ) : (
                    <div className="text-lg text-amber-800 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                      {profileData.lname}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <select
                        value={profileData.countrycode}
                        onChange={(e) => handleInputChange('countrycode', e.target.value)}
                        className="w-24 text-lg text-amber-900 bg-amber-50/50 border-0 border-b-3 border-amber-300 px-0 py-3 focus:outline-none focus:border-amber-600 focus:bg-white/70 transition-all duration-300 rounded-t-lg"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+49">+49</option>
                        <option value="+33">+33</option>
                        <option value="+86">+86</option>
                        <option value="+81">+81</option>
                        <option value="+61">+61</option>
                        <option value="+971">+971</option>
                        <option value="+65">+65</option>
                        <option value="+852">+852</option>
                        <option value="+34">+34</option>
                        <option value="+39">+39</option>
                        <option value="+55">+55</option>
                        <option value="+27">+27</option>
                      </select>

                      <input
                        type="text"
                        value={profileData.phnumber}
                        onChange={(e) => handleInputChange('phnumber', e.target.value)}
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
              </div>

              {/* Email Field */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="text-lg text-amber-700 py-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent rounded-t-lg px-3">
                  {user.email}
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                  Cultural Journey Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.short_bio}
                    onChange={(e) => handleInputChange('short_bio', e.target.value)}
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
        </div>
      </div>

      <div>
        <DashboardCards />
        <CulturalDashboardCards />
      </div>
    </>
  );
};

export default ProfileDashboard;