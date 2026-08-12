import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-api-ok5m.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  auth: {
    register(data) {
      return api.post('/users/register', data);
    },
    login(data) {
      return api.post('/users/login', data);
    }
  },
  
  user: {
    getProfile() {
      return api.get('/users/profile');
    },
    updateProfile(data) {
      return api.put('/users/profile', data);
    }
  },
  
  posts: {
    getAll() {
      return api.get('/posts');
    },
    getById(id) {
      return api.get(`/posts/${id}`);
    },
    create(data) {
      return api.post('/posts', data);
    },
    update(id, data) {
      return api.put(`/posts/${id}`, data);
    },
    delete(id) {
      return api.delete(`/posts/${id}`);
    },
    like(id) {
      return api.post(`/posts/${id}/like`);
    },
    dislike(id) {
      return api.post(`/posts/${id}/dislike`);
    },
    getTrending() {
      return api.get('/posts/trending');
    },
    getNew() {
      return api.get('/posts/new');
    }
  },
  
  comments: {
    getByPost(postId) {
      return api.get(`/posts/${postId}/comments`);
    },
    create(postId, data) {
      return api.post(`/posts/${postId}/comments`, data);
    },
    update(id, data) {
      return api.put(`/comments/${id}`, data);
    },
    delete(id) {
      return api.delete(`/comments/${id}`);
    }
  }
};
