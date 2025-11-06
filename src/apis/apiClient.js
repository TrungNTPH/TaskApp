import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const getTasks = (params) => api.get('/tasks', { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (formData) =>
  api.post('/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateTask = (id, formData) =>
  api.put(`/tasks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);


export default api;
