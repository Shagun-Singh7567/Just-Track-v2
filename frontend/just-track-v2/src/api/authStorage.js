// src/api/authStorage.js
// Central place for reading/writing the JWT + logged-in user info.
// Uses sessionStorage (not localStorage) to match the existing
// "jt_demo_auth" convention already used in the codebase.

const TOKEN_KEY = "jt_token";
const USER_KEY = "jt_user"; // { email, name }

export const authStorage = {
  getToken() {
    return window.sessionStorage?.getItem(TOKEN_KEY) || null;
  },

  getUser() {
    const raw = window.sessionStorage?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Persists the token + user from an AuthResponse { token, email, name }
  setSession({ token, email, name }) {
    window.sessionStorage?.setItem(TOKEN_KEY, token);
    window.sessionStorage?.setItem(USER_KEY, JSON.stringify({ email, name }));
  },

  clear() {
    window.sessionStorage?.removeItem(TOKEN_KEY);
    window.sessionStorage?.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};