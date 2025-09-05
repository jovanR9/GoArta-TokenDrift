
import React, { useState, useCallback } from 'react';
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

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

const LoginModal: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('signup');
  const [showModal, setShowModal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Event handlers
  const handleTabSwitch = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setError(null);
  }, []);

  const handleSocialLogin = useCallback(async (provider: SocialProvider) => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
    });
    if (error) {
        setError(error.message);
    } else {
        setError(null);
    }
  }, []);

  const resetForms = useCallback(() => {
    setSignupData({ firstName: '', lastName: '', email: '', password: '' });
    setLoginData({ email: '', password: '' });
  }, []);

  const handleSignupSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
        setError("Please fill in all the fields.");
        setIsSubmitting(false);
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
            data: {
                first_name: signupData.firstName,
                last_name: signupData.lastName,
            },
        },
    });

    if (error) {
        setError(error.message);
    } else {
        alert(`Welcome ${signupData.firstName}! Your account has been created successfully.`);
        resetForms();
    }
    setIsSubmitting(false);
  }, [signupData, resetForms]);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!loginData.email || !loginData.password) {
        setError("Please fill in both email and password.");
        setIsSubmitting(false);
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
    });

    if (error) {
        setError(error.message);
    } else {
        alert('Welcome back! You have been logged in successfully.');
        resetForms();
    }
    setIsSubmitting(false);
  }, [loginData, resetForms]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const reopenModal = useCallback(() => {
    setShowModal(true);
    resetForms();
  }, [resetForms]);

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(33, 128, 141, 0.9) 0%, rgba(19, 52, 59, 0.95) 50%, rgba(94, 82, 64, 0.9) 100%)',
    zIndex: -1,
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(94, 82, 64, 0.12)',
    animation: 'modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#626c71',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.15s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(94, 82, 64, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#134252',
    background: 'white',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    background: '#218085',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginTop: '8px',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#ccc',
    cursor: 'not-allowed',
  };

  const closedMessageStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '40px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  };

  if (!showModal) {
    return (
      <div style={containerStyle}>
        <div style={overlayStyle} />
        <div style={closedMessageStyle}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: 600 }}>
            Modal Closed
          </h2>
          <button onClick={reopenModal} style={{
            padding: '12px 24px',
            background: 'white',
            color: '#134252',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>
            Reopen Modal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={overlayStyle} />
      
      <div style={modalStyle}>
        <button 
          style={closeBtnStyle} 
          onClick={closeModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(94, 82, 64, 0.12)';
            e.currentTarget.style.color = '#134252';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = '#626c71';
          }}
        >
          ×
        </button>
        
        <div style={{
          display: 'flex',
          marginBottom: '32px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'rgba(94, 82, 64, 0.12)',
        }}>
          <button 
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'signup' ? '#218085' : 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              color: activeTab === 'signup' ? 'white' : '#626c71',
            }}
            onClick={() => handleTabSwitch('signup')}
          >
            Sign up
          </button>
          <button 
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'login' ? '#218085' : 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              color: activeTab === 'login' ? 'white' : '#626c71',
            }}
            onClick={() => handleTabSwitch('login')}
          >
            Log in
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Social Login Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(24, 119, 242, 0.3)',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                color: '#1877f2',
              }}
              onClick={() => handleSocialLogin('facebook')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(24, 119, 242, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <FacebookIcon />
              {activeTab === 'signup' ? 'Sign up with Facebook' : 'Log in with Facebook'}
            </button>
            
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(66, 133, 244, 0.3)',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                color: '#4285f4',
              }}
              onClick={() => handleSocialLogin('google')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(66, 133, 244, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <GoogleIcon />
              {activeTab === 'signup' ? 'Sign up with Google' : 'Log in with Google'}
            </button>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(94, 82, 64, 0.2)',
            }} />
            <span style={{
              background: 'white',
              color: '#626c71',
              padding: '0 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 500,
            }}>OR</span>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {/* Forms */}
          {activeTab === 'signup' ? (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="First name"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                  style={inputStyle}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#218085';
                    e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                  style={inputStyle}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#218085';
                    e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                style={inputStyle}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#218085';
                  e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                style={inputStyle}
                required
                minLength={6}
                onFocus={(e) => {
                  e.target.style.borderColor = '#218085';
                  e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                type="submit"
                style={isSubmitting ? disabledButtonStyle : buttonStyle}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = '#1d6670';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = '#218085';
                  }
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                style={inputStyle}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#218085';
                  e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                style={inputStyle}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#218085';
                  e.target.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(94, 82, 64, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                type="submit"
                style={isSubmitting ? disabledButtonStyle : buttonStyle}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = '#1d6670';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = '#218085';
                  }
                }}
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

export default LoginModal;
