import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tot_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ── Users ─────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  getOnline: () => api.get('/users/online'),
  getById: (id: number) => api.get(`/users/${id}`),
  getLeaderboard: () => api.get('/users/leaderboard'),
  updateProfile: (data: { username: string; avatar?: string }) => api.put('/users/profile', data),
};

// ── News ─────────────────────────────────────────────────────
export const newsAPI = {
  getAll: () => api.get('/news'),
  getById: (id: number) => api.get(`/news/${id}`),
  create: (data: Record<string, unknown>) => api.post('/news', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
  vote: (id: number, vote: 'fact' | 'hoax') => api.post(`/news/${id}/vote`, { vote }),
  getVotes: (id: number) => api.get(`/news/${id}/votes`),
};

// ── Rooms ─────────────────────────────────────────────────────
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id: number) => api.get(`/rooms/${id}`),
  create: (data: Record<string, unknown>) => api.post('/rooms', data),
  join: (id: number) => api.post(`/rooms/${id}/join`),
  leave: (id: number) => api.post(`/rooms/${id}/leave`),
  updateStatus: (id: number, status: string) => api.put(`/rooms/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/rooms/${id}`),
};

// ── Scores ────────────────────────────────────────────────────
export const scoresAPI = {
  getMyScores: () => api.get('/scores/me'),
  getLeaderboard: () => api.get('/scores/leaderboard'),
  getRoomScores: (roomId: number) => api.get(`/scores/room/${roomId}`),
};

// ── Admin ─────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  changeRole: (id: number, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  getMessages: (limit?: number) => api.get(`/admin/messages?limit=${limit || 50}`),
  deleteMessage: (id: number) => api.delete(`/admin/messages/${id}`),
};

export default api;
