// src/api/authApi.js
import apiClient from './axiosConfig';

// Matches AuthController: POST /auth/login, POST /auth/signup
// Both return an AuthResponse: { token, email, name }
export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  signup: (name, email, password) =>
    apiClient.post('/auth/signup', { name, email, password }),
};