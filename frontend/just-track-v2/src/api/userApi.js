// src/api/userApi.js
import apiClient from './axiosConfig';

// Matches UserController: POST /users, DELETE /users/{id}
// (resolves to /api/users once combined with the baseURL)
export const userApi = {
  create: (user) => apiClient.post('/users', user),
  delete: (id) => apiClient.delete(`/users/${id}`),
};