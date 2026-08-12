<template>
  <aside class="right-sidebar">
    <div class="sidebar-section">
      <h3><i class="bi bi-fire"></i> What's Happening</h3>
      <div v-if="loadingTrending" class="loading-state">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <div v-else-if="trendingPosts.length === 0" class="empty-state">
        <p>No trending posts yet</p>
      </div>
      <div v-else class="posts-list">
        <router-link 
          v-for="post in trendingPosts" 
          :key="post._id" 
          :to="`/post/${post._id}`"
          class="mini-post-card"
        >
          <div class="mini-post-content">
            <h4>{{ truncate(post.title, 50) }}</h4>
            <div class="mini-post-meta">
              <span><i class="bi bi-person"></i> {{ post.authorName }}</span>
              <span><i class="bi bi-heart-fill"></i> {{ post.likes?.length || 0 }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div class="sidebar-section">
      <h3><i class="bi bi-stars"></i> New Posts</h3>
      <div v-if="loadingNew" class="loading-state">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <div v-else-if="newPosts.length === 0" class="empty-state">
        <p>No new posts yet</p>
      </div>
      <div v-else class="posts-list">
        <router-link 
          v-for="post in newPosts" 
          :key="post._id" 
          :to="`/post/${post._id}`"
          class="mini-post-card"
        >
          <div class="mini-post-content">
            <h4>{{ truncate(post.title, 50) }}</h4>
            <div class="mini-post-meta">
              <span><i class="bi bi-person"></i> {{ post.authorName }}</span>
              <span><i class="bi bi-clock"></i> {{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePostStore } from '../stores/post';

const postStore = usePostStore();

const loadingTrending = ref(false);
const loadingNew = ref(false);

const trendingPosts = computed(() => postStore.trendingPosts);
const newPosts = computed(() => postStore.newPosts);

const loadTrending = () => {
  loadingTrending.value = true;
  postStore.fetchTrendingPosts()
    .catch(() => {})
    .finally(() => {
      loadingTrending.value = false;
    });
};

const loadNew = () => {
  loadingNew.value = true;
  postStore.fetchNewPosts()
    .catch(() => {})
    .finally(() => {
      loadingNew.value = false;
    });
};

const truncate = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const formatDate = (date) => {
  const now = new Date();
  const posted = new Date(date);
  const diff = Math.floor((now - posted) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

onMounted(() => {
  loadTrending();
  loadNew();
});
</script>

<style scoped>
.right-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 320px;
  background-color: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
}

.sidebar-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.sidebar-section h3 i {
  color: var(--accent-primary);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mini-post-card {
  display: block;
  padding: 0.875rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.mini-post-card:hover {
  background-color: var(--bg-tertiary);
  transform: translateX(-4px);
  box-shadow: var(--shadow-sm);
}

.mini-post-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.mini-post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

.mini-post-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.mini-post-meta i {
  font-size: 0.7rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 1.5rem 0;
}

.loading-state i {
  font-size: 1.5rem;
  color: var(--accent-primary);
}

.empty-state p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 1400px) {
  .right-sidebar {
    display: none;
  }
}
</style>
