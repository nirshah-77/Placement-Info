import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Login() {
  const { error, success } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState('');

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = () => {
      // Check for OAuth error
      const errorParam = searchParams.get('error');
      const emailParam = searchParams.get('email');

      if (errorParam === 'not_authorized') {
        setOauthError(`Access denied. The email ${emailParam} is not registered as an employee. Please contact your administrator.`);
        return;
      }

      // Check for successful OAuth token
      if (authService.handleOAuthCallback()) {
        // Token was successfully extracted and saved
        navigate('/dashboard');
      }
    };
    handleCallback();
  }, [navigate, searchParams]);



  const handleGoogleLogin = () => {
    setOauthError(''); // Clear any previous errors
    authService.initiateGoogleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access the placement portal</p>
        </div>

        {oauthError && (
          <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {oauthError}
          </div>
        )}



        <button
          onClick={handleGoogleLogin}
          type="button"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            color: '#374151',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05" />
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
