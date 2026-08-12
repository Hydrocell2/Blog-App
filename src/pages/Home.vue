<template>
  <div class="home-container">
    <div class="container">
      <div class="hero-section">
        <h1><i class="bi bi-journal-text"></i> Welcome to Pocket</h1>
        <p class="hero-subtitle">Here we pocket your thoughts and news, then whip it out</p>
      </div>
      
      <div v-if="loading" class="loading-state">
        <i class="bi bi-hourglass-split"></i>
        <p>Loading posts...</p>
      </div>
      
      <div v-else-if="posts.length === 0" class="empty-state">
        <i class="bi bi-journal-x"></i>
        <h3>No posts yet</h3>
        <p>Be the first to share something amazing!</p>
        <router-link v-if="isAuthenticated" to="/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i>
          Create First Post
        </router-link>
      </div>
      
      <div v-else class="posts-grid">
        <PostCard 
          v-for="post in posts" 
          :key="post._id" 
          :post="post"
          :comment-count="post.commentCount || 0"
          @edit="handleEdit"
          @delete="handleDelete"
          @like="handleLike"
          @dislike="handleDislike"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '../stores/post';
import { useAuthStore } from '../stores/auth';
import PostCard from '../components/PostCard.vue';
import { Notyf } from 'notyf';

const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const loading = ref(false);
const posts = computed(() => postStore.posts);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const loadPosts = () => {
  loading.value = true;
  postStore.fetchPosts()
    .catch(error => {
      notyf.error('Failed to load posts');
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleEdit = (postId) => {
  router.push(`/post/${postId}/edit`);
};

const handleDelete = (postId) => {
  postStore.deletePost(postId)
    .then(() => {
      notyf.success('Post deleted successfully');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to delete post');
    });
};

const handleLike = (postId) => {
  postStore.likePost(postId)
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to like post');
    });
};

const handleDislike = (postId) => {
  postStore.dislikePost(postId)
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to dislike post');
    });
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  max-width: 1400px;
  width: 100%;
  margin-left: 100px;
}

.container {
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 16px;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hero-section i {
  color: var(--accent-primary);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 300;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-state i,
.empty-state i {
  font-size: 4rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.loading-state p {
  color: var(--text-secondary);
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .home-container {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 1.75rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .home-container {
    margin-left: 0;
  }
}
</style>
