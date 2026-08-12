<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading-state">
      <i class="bi bi-hourglass-split"></i>
      <p>Loading post...</p>
    </div>
    
    <div v-else-if="post" class="post-detail">
        <div class="post-header">
          <button @click="$router.back()" class="btn btn-outline btn-sm back-btn">
            <i class="bi bi-arrow-left"></i>
            Back
          </button>
          
          <div v-if="canEdit" class="post-actions">
            <button @click="handleEdit" class="btn btn-outline btn-sm">
              <i class="bi bi-pencil"></i>
              Edit
            </button>
            <button @click="handleDelete" class="btn btn-outline btn-sm delete-btn">
              <i class="bi bi-trash"></i>
              Delete
            </button>
          </div>
        </div>
        
        <article class="post-content">
          <div class="post-meta">
            <div class="author-info">
              <div class="author-avatar">
                <img v-if="post.authorProfilePicture" :src="post.authorProfilePicture" alt="Profile" />
                <i v-else class="bi bi-person-circle"></i>
              </div>
              <div>
                <h4>{{ post.authorName }}</h4>
                <span class="post-date">
                  <i class="bi bi-calendar3"></i>
                  {{ formatDate(post.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          
          <h1 class="post-title">{{ post.title }}</h1>
          
          <div class="post-body">
            <p>{{ post.content }}</p>
          </div>
          
          <div class="post-interactions">
            <button 
              @click="handleLike" 
              class="interaction-btn" 
              :class="{ active: userLiked }"
              :disabled="!isAuthenticated"
            >
              <i :class="userLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              <span>{{ post.likes?.length || 0 }} Likes</span>
            </button>
            
            <button 
              @click="handleDislike" 
              class="interaction-btn" 
              :class="{ active: userDisliked }"
              :disabled="!isAuthenticated"
            >
              <i :class="userDisliked ? 'bi bi-hand-thumbs-down-fill' : 'bi bi-hand-thumbs-down'"></i>
              <span>{{ post.dislikes?.length || 0 }} Dislikes</span>
            </button>
          </div>
        </article>
        
        <CommentSection :post-id="post._id" />
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '../stores/post';
import { useAuthStore } from '../stores/auth';
import CommentSection from '../components/CommentSection.vue';
import { Notyf } from 'notyf';

const router = useRouter();
const route = useRoute();
const postStore = usePostStore();
const authStore = useAuthStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const loading = ref(false);
const post = computed(() => postStore.currentPost);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const canEdit = computed(() => {
  if (!authStore.isAuthenticated || !post.value) return false;
  const authorId = typeof post.value.author === 'object' ? post.value.author._id : post.value.author;
  return String(authStore.user.id) === String(authorId) || authStore.isAdmin;
});

const userLiked = computed(() => {
  if (!authStore.isAuthenticated || !post.value) return false;
  return post.value.likes?.some(id => String(id) === String(authStore.user.id)) || false;
});

const userDisliked = computed(() => {
  if (!authStore.isAuthenticated || !post.value) return false;
  return post.value.dislikes?.some(id => String(id) === String(authStore.user.id)) || false;
});

const loadPost = () => {
  loading.value = true;
  
  postStore.fetchPostById(route.params.id)
    .catch(error => {
      notyf.error('Failed to load post');
      router.push('/');
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleEdit = () => {
  router.push(`/post/${post.value._id}/edit`);
};

const handleDelete = () => {
  postStore.deletePost(post.value._id)
    .then(() => {
      notyf.success('Post deleted successfully');
      router.push('/');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to delete post');
    });
};

const handleLike = () => {
  if (!isAuthenticated.value) return;
  postStore.likePost(post.value._id)
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to like post');
    });
};

const handleDislike = () => {
  if (!isAuthenticated.value) return;
  postStore.dislikePost(post.value._id)
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to dislike post');
    });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.post-detail-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  max-width: 2000px;
  width: 100%;
  margin: 0 auto;
  margin-left: 200px;
}

.post-detail {
  width: 100%;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-actions {
  display: flex;
  gap: 0.75rem;
}

.delete-btn:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.post-content {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 4rem;
  box-shadow: var(--shadow-md);
}

.post-meta {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 3px solid var(--accent-primary);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar i {
  font-size: 3rem;
  color: var(--accent-primary);
}

.author-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.post-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 300;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.post-body p {
  white-space: pre-wrap;
  margin-bottom: 1.5rem;
}

.post-interactions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.interaction-btn:hover:not(:disabled) {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.interaction-btn.active {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.interaction-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.interaction-btn i {
  font-size: 1.25rem;
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
  .post-detail-container {
    margin-left: 100px;
  }
}

@media (max-width: 768px) {
  .post-content {
    padding: 2rem 1.5rem;
  }
  
  .post-title {
    font-size: 1.75rem;
  }
  
  .post-body {
    font-size: 1rem;
  }
  
  .post-detail-container {
    margin-left: 0;
  }
}
</style>
