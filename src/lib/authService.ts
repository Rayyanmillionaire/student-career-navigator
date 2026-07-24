import axios from 'axios';

const api = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async register(data: any) {
    const response = await api.post('/register', data);
    return response.data;
  },

  async login(data: any) {
    const response = await api.post('/login', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/verify-email', { token });
    return response.data;
  }
};
