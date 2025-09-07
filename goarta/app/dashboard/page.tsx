"use client";
import React, { useState } from 'react';
import { Camera, Edit, LogOut } from 'lucide-react';
import Image from 'next/image';
import DashboardCards from '@/components/DashboardCard';

const ProfileDashboard = () => {
  const [profileData, setProfileData] = useState({
    fname: 'Priya',
    lname: 'Sharma',
    phnumber: '8857990312',
    countryCode: '+91',
    email: 'priya.sharma@email.com',
    bio: 'Cultural enthusiast from Mumbai, passionate about exploring Goa\'s rich heritage, traditional cuisine, and vibrant festivals. Love discovering hidden gems and authentic local experiences.'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getInitials = () => {
    return `${profileData.fname.charAt(0)}${profileData.lname.charAt(0)}`;
  };

  return (
    <>
      <header className="navbar px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between">
          {/* Logo */}
          <a className="block text-teal-600" href="#">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={95}
              height={95}
              className="
                w-[70px] h-[70px]   /* default (mobile ~375px like iPhone SE) */
                sm:w-[90px] sm:h-[90px] 
                md:w-[110px] md:h-[110px] md:mt-10
                lg:w-[100px] lg:h-[100px] lg:mt-8
              "
            />
          </a>
        </div>
      </header>

      <div className="mt-12 min-h-screen p-6 relative">
        {/* Background Image with Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/image.png')" }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex justify-center">
          {/* Profile Card */}
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">

            {/* Header with gradient */}
            <div className="h-48 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 relative">

              {/* Profile Avatar */}
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                    PS
                  </div>
                  <div className="absolute bottom-1 right-1 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg cursor-pointer hover:bg-orange-600 transition-colors">
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
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 border border-white/30">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border border-white/30"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fname}
                      onChange={(e) => handleInputChange('fname', e.target.value)}
                      className="w-full text-lg text-gray-800 bg-gray-50 border-0 border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-orange-500 focus:bg-transparent transition-colors"
                    />
                  ) : (
                    <div className="text-lg text-gray-600 py-2 border-b border-gray-100">{profileData.fname}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lname}
                      onChange={(e) => handleInputChange('lname', e.target.value)}
                      className="w-full text-lg text-gray-800 bg-gray-50 border-0 border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-orange-500 focus:bg-transparent transition-colors"
                    />
                  ) : (
                    <div className="text-lg text-gray-600 py-2 border-b border-gray-100">{profileData.lname}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      {/* Country Code Dropdown */}
                      <select
                        value={profileData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        className="w-20 text-lg text-gray-800 bg-gray-50 border-0 border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-orange-500 focus:bg-transparent transition-colors"
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

                      {/* Phone Number Input */}
                      <input
                        type="text"
                        value={profileData.phnumber}
                        onChange={(e) => handleInputChange('phnumber', e.target.value)}
                        placeholder="Enter phone number"
                        className="flex-1 text-lg text-gray-800 bg-gray-50 border-0 border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-orange-500 focus:bg-transparent transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="text-lg text-gray-600 py-2 border-b border-gray-100">
                      {profileData.countryCode} {profileData.phnumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email
                </label>
                <div className="text-lg text-gray-500 py-2 border-b border-gray-100">{profileData.email}</div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Short Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                ) : (
                  <div className="text-gray-600 leading-relaxed py-3">{profileData.bio}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <DashboardCards />
      </div>
    </>
  );
};

export default ProfileDashboard;