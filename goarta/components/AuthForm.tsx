"use client";
import React, { useState, useCallback } from 'react';
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

// Types
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

type ActiveTab = 'signup' | 'login';
type SocialProvider = 'facebook' | 'google';

// Social Icons
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AuthForm: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const { login, signup, socialLogin } = useAuth();
  const router = useRouter();

  // Event handlers
  const handleTabSwitch = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleSocialLogin = useCallback(async (provider: SocialProvider) => {
    // Social login is handled by Supabase OAuth
    try {
      await socialLogin(provider);
    } catch (error: any) {
      setError(error.message || 'An error occurred during social login');
    }
  }, [socialLogin]);

  const resetForms = useCallback(() => {
    setSignupData({ firstName: '', lastName: '', email: '', password: '' });
    setLoginData({ email: '', password: '' });
  }, []);

  const handleSignupSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
        setError("Please fill in all the fields.");
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await signup(
        signupData.email,
        signupData.password,
        signupData.firstName,
        signupData.lastName
      );

      if (result.success) {
        setSuccessMessage(`Welcome ${signupData.firstName}! Your account has been created successfully.`);
        resetForms();
        // Switch to login tab after successful signup
        setActiveTab('login');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [signupData, signup, resetForms]);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!loginData.email || !loginData.password) {
        setError("Please fill in both email and password.");
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await login(loginData.email, loginData.password);

      if (result.success) {
        setSuccessMessage('Welcome back! You have been logged in successfully.');
        resetForms();
        // Redirect to home page after successful login
        router.push('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [loginData, login, resetForms, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-500/90 via-cyan-800/95 to-yellow-700/90 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-yellow-700/20">
        <div className="flex mb-8 rounded-lg overflow-hidden bg-yellow-700/20">
          <button 
            className={`flex-1 py-3 px-6 text-sm font-medium transition-all duration-150 ${activeTab === 'signup' ? 'bg-teal-600 text-white' : 'text-gray-500'}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Sign up
          </button>
          <button 
            className={`flex-1 py-3 px-6 text-sm font-medium transition-all duration-150 ${activeTab === 'login' ? 'bg-teal-600 text-white' : 'text-gray-500'}`}
            onClick={() => handleTabSwitch('login')}
          >
            Log in
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              className="flex items-center justify-center gap-3 py-3 px-4 border border-blue-200 rounded-lg bg-white text-blue-600 text-sm font-medium transition-all duration-150 hover:bg-blue-50"
              onClick={() => handleSocialLogin('facebook')}
            >
              <FacebookIcon />
              {activeTab === 'signup' ? 'Sign up with Facebook' : 'Log in with Facebook'}
            </button>
            
            <button 
              className="flex items-center justify-center gap-3 py-3 px-4 border border-red-200 rounded-lg bg-white text-red-600 text-sm font-medium transition-all duration-150 hover:bg-red-50"
              onClick={() => handleSocialLogin('google')}
            >
              <GoogleIcon />
              {activeTab === 'signup' ? 'Sign up with Google' : 'Log in with Google'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative text-center my-2">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-700/30" />
            <span className="relative bg-white px-4 text-xs uppercase text-gray-500 font-medium tracking-wider">OR</span>
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-center text-sm">{successMessage}</p>}

          {/* Forms */}
          {activeTab === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                required
                minLength={6}
              />
              <button 
                type="submit"
                className="py-3 px-6 bg-teal-600 text-white rounded-lg text-sm font-medium transition-all duration-150 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-yellow-700/30 rounded-lg text-sm text-cyan-800 bg-white transition-all duration-150 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 outline-none"
                required
              />
              <button 
                type="submit"
                className="py-3 px-6 bg-teal-600 text-white rounded-lg text-sm font-medium transition-all duration-150 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;