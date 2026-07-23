import apiClient from './axiosConfig';

export const transactionApi = {
  create: (user) => apiClient.post('/users', user),
  delete: (id) => apiClient.delete(`/users/${id}`),
};