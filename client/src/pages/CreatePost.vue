<template>
  <div class="create-container">
    <div class="create-card">
        <div class="create-header">
          <h1><i class="bi bi-pencil-square"></i> Create New Post</h1>
          <p class="text-muted">Share your thoughts with the world</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="create-form">
          <div class="form-group">
            <label class="form-label">Post Title</label>
            <input 
              v-model="formData.title" 
              type="text" 
              class="form-control" 
              placeholder="Enter an engaging title"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Content</label>
            <textarea 
              v-model="formData.content" 
              class="form-control textarea-large" 
              placeholder="Write your story..."
              rows="12"
              required
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="$router.back()" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">
                <i class="bi bi-check-circle"></i>
                Publish Post
              </span>
              <span v-else>
                <i class="bi bi-hourglass-split"></i>
                Publishing...
              </span>
            </button>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '../stores/post';
import { Notyf } from 'notyf';

const router = useRouter();
const postStore = usePostStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const formData = ref({
  title: '',
  content: ''
});

const loading = ref(false);

const handleSubmit = () => {
  loading.value = true;
  
  postStore.createPost(formData.value)
    .then(() => {
      notyf.success('Post published successfully!');
      router.push('/');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to create post');
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.create-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  max-width: 2000px;
  width: 100%;
  margin: 0 auto;
  margin-left: 200px;
}

.create-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 4rem;
  width: 100%;
}

.create-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.create-header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.create-header i {
  color: var(--accent-primary);
}

.create-header p {
  color: var(--text-secondary);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.textarea-large {
  resize: vertical;
  min-height: 300px;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.form-actions .btn {
  min-width: 140px;
}

@media (max-width: 1200px) {
  .create-container {
    margin-left: 100px;
  }
}

@media (max-width: 768px) {
  .create-container {
    margin-left: 0;
  }
}
</style>
