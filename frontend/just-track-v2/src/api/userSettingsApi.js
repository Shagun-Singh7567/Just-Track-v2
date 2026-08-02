// src/api/userSettingsApi.js
import apiClient from './axiosConfig';

// Matches UserSettingsController: GET /settings, PATCH /settings
// No trailing slash (the backend mapping is "/settings", not "/settings/").
// GET creates a default row (theme: LIGHT, currencyCode: USD) the first
// time it's called for a user, so there's no separate "create" endpoint —
// the frontend never has to think about whether settings exist yet.
// PATCH accepts a partial body -- { theme } or { currencyCode } or both --
// and only touches the fields that are present.
export const userSettingsApi = {
  get: () => apiClient.get('/settings'),
  update: (settings) => apiClient.patch('/settings', settings),
};
