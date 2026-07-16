// src/api/transactionApi.js
import apiClient from './axiosConfig';

export const transactionApi = {
  getAll: () => apiClient.get('/transactions'),
  create: (transaction) => apiClient.post('/transactions', transaction),
  delete: (id) => apiClient.delete(`/transactions/${id}`),

};