<template>
  <div class="post-card">
    <div class="post-header">
      <div class="post-author">
        <div class="author-avatar">
          <img v-if="post.authorProfilePicture" :src="post.authorProfilePicture" alt="Profile" />
          <i v-else class="bi bi-person-circle"></i>
        </div>
        <div>
          <h4>{{ post.authorName }}</h4>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
      </div>
      
      <div v-if="canEdit" class="post-actions">
        <button @click.stop="$emit('edit', post._id)" class="action-btn">
          <i class="bi bi-pencil"></i>
        </button>
        <button @click.stop="$emit('delete', post._id)" class="action-btn delete-btn">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="post-content" @click="goToPost">
      <h2>{{ post.title }}</h2>
      <p>{{ truncateContent(post.content) }}</p>
    </div>
    
    <div class="post-footer">
      <div class="post-stats">
        <button 
          @click.stop="handleLike" 
          class="stat-btn" 
          :class="{ active: userLiked }"
          :disabled="!isAuthenticated"
        >
          <i :class="userLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          <span>{{ post.likes?.length || 0 }}</span>
        </button>
        
        <button 
          @click.stop="handleDislike" 
          class="stat-btn" 
          :class="{ active: userDisliked }"
          :disabled="!isAuthenticated"
        >
          <i :class="userDisliked ? 'bi bi-hand-thumbs-down-fill' : 'bi bi-hand-thumbs-down'"></i>
          <span>{{ post.dislikes?.length || 0 }}</span>
        </button>
        
        <button @click.stop="goToPost" class="stat-btn">
          <i class="bi bi-chat"></i>
          <span>{{ commentCount }}</span>
        </button>
      </div>
      
      <span class="read-more" @click="goToPost">
        Read More <i class="bi bi-arrow-right"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { usePostStore } from '../stores/post';

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  commentCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['edit', 'delete', 'like', 'dislike']);

const router = useRouter();
const authStore = useAuthStore();
const postStore = usePostStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const canEdit = computed(() => {
  if (!authStore.isAuthenticated) return false;
  const authorId = typeof props.post.author === 'object' ? props.post.author._id : props.post.author;
  return String(authStore.user.id) === String(authorId) || authStore.isAdmin;
});

const userLiked = computed(() => {
  if (!authStore.isAuthenticated) return false;
  return props.post.likes?.some(id => String(id) === String(authStore.user.id)) || false;
});

const userDisliked = computed(() => {
  if (!authStore.isAuthenticated) return false;
  return props.post.dislikes?.some(id => String(id) === String(authStore.user.id)) || false;
});

const goToPost = () => {
  router.push(`/post/${props.post._id}`);
};

const handleLike = () => {
  if (!isAuthenticated.value) return;
  emit('like', props.post._id);
};

const handleDislike = () => {
  if (!isAuthenticated.value) return;
  emit('dislike', props.post._id);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const truncateContent = (content) => {
  return content.length > 200 ? content.substring(0, 200) + '...' : content;
};
</script>

<style scoped>
.post-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  box-shadow: var(--shadow-md);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--accent-primary);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar i {
  font-size: 2.5rem;
  color: var(--accent-primary);
}

.post-author h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.post-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 300;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.delete-btn:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

.post-content {
  cursor: pointer;
  margin-bottom: 1rem;
  flex: 1;
}

.post-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.post-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.stat-btn:hover:not(:disabled) {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
}

.stat-btn.active {
  color: var(--accent-primary);
}

.stat-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.stat-btn i {
  font-size: 1.1rem;
}

.read-more {
  color: var(--accent-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.read-more i {
  transition: transform 0.2s ease;
}

.post-card:hover .read-more i {
  transform: translateX(4px);
}
</style>
