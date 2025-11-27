import axios from 'axios';

const BASE_URL = 'http://localhost:9191/api/v1/auth';

export const authService = {


  saveToken: (token) => {
    localStorage.setItem('user', token);
  },

  removeToken: () => {
    localStorage.removeItem('user');
  },


  getToken: () => {
    return localStorage.getItem('user');
  },

  initiateGoogleLogin: () => {
    // Redirect to backend OAuth2 endpoint which will redirect to Google
    window.location.href = 'http://localhost:9191/oauth2/authorization/google';
  },

  handleOAuthCallback: () => {
    // Extract token from URL query parameters (set by OAuth2LoginSuccessHandler)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('user', token);
      return true;
    }
    return false;
  }
};