<template>
  <nav class="sidebar" @mouseenter="isExpanded = true" @mouseleave="isExpanded = false" :class="{ expanded: isExpanded }">
    <div class="sidebar-content">
      <div class="sidebar-top">
        <router-link to="/" class="sidebar-brand">
          <i class="bi bi-journal-text"></i>
          <span v-if="isExpanded">Pocket</span>
        </router-link>
        
        <router-link to="/" class="sidebar-link">
          <i class="bi bi-house-door"></i>
          <span v-if="isExpanded">Home</span>
        </router-link>
        
        <template v-if="isAuthenticated">
          <router-link to="/create" class="sidebar-link">
            <i class="bi bi-plus-circle"></i>
            <span v-if="isExpanded">Create Post</span>
          </router-link>
        </template>
        
        <template v-else>
          <router-link to="/login" class="sidebar-link">
            <i class="bi bi-box-arrow-in-right"></i>
            <span v-if="isExpanded">Sign In</span>
          </router-link>
        </template>
      </div>
      
      <div class="sidebar-bottom">
        <button @click="toggleTheme" class="sidebar-link" :title="isDark ? 'Light Mode' : 'Dark Mode'">
          <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
          <span v-if="isExpanded">{{ isDark ? 'Light' : 'Dark' }} Mode</span>
        </button>
        
        <template v-if="isAuthenticated">
          <router-link to="/profile" class="sidebar-link user-profile">
            <i class="bi bi-person-circle"></i>
            <span v-if="isExpanded">Profile</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const isDark = ref(false);
const isExpanded = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 70px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  transition: width 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.sidebar.expanded {
  width: 250px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.5rem 0;
}

.sidebar-top,
.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
  text-decoration: none;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.sidebar-brand i {
  font-size: 1.75rem;
  min-width: 1.75rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  white-space: nowrap;
}

.sidebar-link i {
  font-size: 1.5rem;
  min-width: 1.5rem;
}

.sidebar-link:hover {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
}

.sidebar-link.router-link-active {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border-right: 3px solid var(--accent-primary);
}

.user-profile {
  cursor: default;
  font-weight: 600;
  color: var(--text-primary);
}

.user-profile:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.logout-btn {
  color: #dc3545;
}

.logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .sidebar.expanded {
    width: 200px;
  }
}
</style>
