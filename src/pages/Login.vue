<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <i class="bi bi-box-arrow-in-right"></i>
        <h1>Welcome Back</h1>
        <p>Login to continue to Pocket</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input 
            v-model="formData.email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Password</label>
          <input 
            v-model="formData.password" 
            type="password" 
            class="form-control" 
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-box-arrow-in-right"></i>
            Login
          </span>
          <span v-else>
            <i class="bi bi-hourglass-split"></i>
            Logging in...
          </span>
        </button>
      </form>
      
      <div class="auth-footer">
        <p>
          Don't have an account? 
          <router-link to="/register">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Notyf } from 'notyf';

const router = useRouter();
const authStore = useAuthStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const formData = ref({
  email: '',
  password: ''
});

const loading = ref(false);

const handleLogin = () => {
  loading.value = true;
  
  authStore.login(formData.value)
    .then(() => {
      notyf.success('Welcome back!');
      router.push('/');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Login failed');
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-left: 150px;
}

.auth-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  padding: 5rem;
  width: 100%;
  max-width: 1200px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header i {
  font-size: 3rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.auth-header p {
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.auth-footer a {
  color: var(--accent-primary);
  font-weight: 600;
}

.auth-footer p {
  color: var(--text-muted);
}

@media (max-width: 1200px) {
  .auth-container {
    margin-left: 75px;
  }
}

@media (max-width: 768px) {
  .auth-container {
    margin-left: 0;
  }
  
  .auth-card {
    padding: 3rem;
  }
}
</style>
