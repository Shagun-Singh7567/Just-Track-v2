// src/api/authStorage.js
// Central place for reading/writing the JWT + logged-in user info.
// Uses localStorage so the session is shared across tabs.

const TOKEN_KEY = "jt_token";
const USER_KEY = "jt_user"; // { email, name }

const store = () => {
  try {
    return window.localStorage;
  } catch {
    return null; // storage blocked (privacy mode, etc.)
  }
};

export const authStorage = {
  getToken() {
    return store()?.getItem(TOKEN_KEY) || null;
  },

  getUser() {
    const raw = store()?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Persists the token + user from an AuthResponse { token, email, name }
  setSession({ token, email, name }) {
    store()?.setItem(TOKEN_KEY, token);
    store()?.setItem(USER_KEY, JSON.stringify({ email, name }));
  },

  clear() {
    store()?.removeItem(TOKEN_KEY);
    store()?.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};