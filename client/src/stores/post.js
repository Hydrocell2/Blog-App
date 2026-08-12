import { defineStore } from 'pinia';
import api from '../services/api';

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    currentPost: null,
    trendingPosts: [],
    newPosts: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      
      return api.posts.getAll()
        .then(response => {
          this.posts = response.data.posts;
          return response.data;
        })
        .catch(error => {
          this.error = error.response?.data?.error || 'Failed to fetch posts';
          throw error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    async fetchPostById(id) {
      this.loading = true;
      this.error = null;
      
      return api.posts.getById(id)
        .then(response => {
          this.currentPost = response.data.post;
          return response.data;
        })
        .catch(error => {
          this.error = error.response?.data?.error || 'Failed to fetch post';
          throw error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    async createPost(postData) {
      return api.posts.create(postData)
        .then(response => {
          this.posts.unshift(response.data.post);
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },
    
    async updatePost(id, postData) {
      return api.posts.update(id, postData)
        .then(response => {
          const index = this.posts.findIndex(p => p._id === id);
          if (index !== -1) {
            this.posts[index] = response.data.post;
          }
          if (this.currentPost?._id === id) {
            this.currentPost = response.data.post;
          }
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },
    
    async deletePost(id) {
      return api.posts.delete(id)
        .then(response => {
          this.posts = this.posts.filter(p => p._id !== id);
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },

    async likePost(id) {
      return api.posts.like(id)
        .then(response => {
          const index = this.posts.findIndex(p => p._id === id);
          if (index !== -1) {
            this.posts[index] = response.data.post;
          }
          if (this.currentPost?._id === id) {
            this.currentPost = response.data.post;
          }
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },

    async dislikePost(id) {
      return api.posts.dislike(id)
        .then(response => {
          const index = this.posts.findIndex(p => p._id === id);
          if (index !== -1) {
            this.posts[index] = response.data.post;
          }
          if (this.currentPost?._id === id) {
            this.currentPost = response.data.post;
          }
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },

    async fetchTrendingPosts() {
      return api.posts.getTrending()
        .then(response => {
          this.trendingPosts = response.data.posts;
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },

    async fetchNewPosts() {
      return api.posts.getNew()
        .then(response => {
          this.newPosts = response.data.posts;
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    }
  }
});
