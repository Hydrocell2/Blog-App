<template>
  <div class="edit-container">
    <div v-if="loading" class="loading-state">
      <i class="bi bi-hourglass-split"></i>
      <p>Loading post...</p>
    </div>
    
    <div v-else class="edit-card">
        <div class="edit-header">
          <h1><i class="bi bi-pencil"></i> Edit Post</h1>
          <p class="text-muted">Update your story</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="edit-form">
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
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="!submitting">
                <i class="bi bi-check-circle"></i>
                Update Post
              </span>
              <span v-else>
                <i class="bi bi-hourglass-split"></i>
                Updating...
              </span>
            </button>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '../stores/post';
import { Notyf } from 'notyf';

const router = useRouter();
const route = useRoute();
const postStore = usePostStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const formData = ref({
  title: '',
  content: ''
});

const loading = ref(false);
const submitting = ref(false);

const loadPost = () => {
  loading.value = true;
  
  postStore.fetchPostById(route.params.id)
    .then(response => {
      formData.value.title = response.post.title;
      formData.value.content = response.post.content;
    })
    .catch(error => {
      notyf.error('Failed to load post');
      router.push('/');
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSubmit = () => {
  submitting.value = true;
  
  postStore.updatePost(route.params.id, formData.value)
    .then(() => {
      notyf.success('Post updated successfully!');
      router.push(`/post/${route.params.id}`);
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to update post');
    })
    .finally(() => {
      submitting.value = false;
    });
};

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.edit-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  max-width: 2000px;
  width: 100%;
  margin: 0 auto;
  margin-left: 200px;
}

.edit-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 4rem;
  width: 100%;
}

.edit-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.edit-header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.edit-header i {
  color: var(--accent-primary);
}

.edit-header p {
  color: var(--text-secondary);
}

.edit-form {
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

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-state i {
  font-size: 4rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.loading-state p {
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .edit-container {
    margin-left: 100px;
  }
}

@media (max-width: 768px) {
  .edit-container {
    margin-left: 0;
  }
}
</style>
