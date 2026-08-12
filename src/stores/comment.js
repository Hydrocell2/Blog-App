import { defineStore } from 'pinia';
import api from '../services/api';

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchCommentsByPost(postId) {
      this.loading = true;
      this.error = null;
      
      return api.comments.getByPost(postId)
        .then(response => {
          this.comments = response.data.comments;
          return response.data;
        })
        .catch(error => {
          this.error = error.response?.data?.error || 'Failed to fetch comments';
          throw error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    async createComment(postId, commentData) {
      return api.comments.create(postId, commentData)
        .then(response => {
          this.comments.unshift(response.data.comment);
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },
    
    async updateComment(id, commentData) {
      return api.comments.update(id, commentData)
        .then(response => {
          const index = this.comments.findIndex(c => c._id === id);
          if (index !== -1) {
            this.comments[index] = response.data.comment;
          }
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    },
    
    async deleteComment(id) {
      return api.comments.delete(id)
        .then(response => {
          this.comments = this.comments.filter(c => c._id !== id);
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    }
  }
});
