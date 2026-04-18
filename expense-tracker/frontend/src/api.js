import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const getTransactions = (filters = {}) => API.get('/transactions', { params: filters });
export const createTransaction = (data) => API.post('/transactions', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getSummary = () => API.get('/transactions/stats/summary');
