import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),
  
  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    currentUser: (state) => state.user
  },
  
  actions: {
    async register(userData) {
      const response = await api.auth.register(userData);
      return response.data;
    },
    
    async login(credentials) {
      const response = await api.auth.login(credentials);
      this.token = response.data.token;
      this.user = response.data.user;
      this.isAuthenticated = true;
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    checkAuth() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    }
  }
});
