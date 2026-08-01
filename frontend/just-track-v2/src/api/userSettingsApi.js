// src/api/userSettingsApi.js
import apiClient from './axiosConfig';

// Matches UserSettingsController: POST /settings/, PATCH /settings/
// Note the trailing slash — the backend mapping is literally "/settings/",
// so dropping it will 404.
export const userSettingsApi = {
  create: (settings) => apiClient.post('/settings/', settings),
  update: (settings) => apiClient.patch('/settings/', settings),
};