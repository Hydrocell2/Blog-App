<template>
  <div class="auth-container">
    <div class="auth-cards-wrapper">
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
              v-model="loginData.email" 
              type="email" 
              class="form-control" 
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="loginData.password" 
              type="password" 
              class="form-control" 
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loginLoading">
            <span v-if="!loginLoading">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </span>
            <span v-else>
              <i class="bi bi-hourglass-split"></i>
              Logging in...
            </span>
          </button>
        </form>
      </div>

      <div class="auth-divider"></div>

      <div class="auth-card">
        <div class="auth-header">
          <i class="bi bi-person-plus"></i>
          <h1>Join Pocket</h1>
          <p>Create your account to start blogging</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              v-model="registerData.email" 
              type="email" 
              class="form-control" 
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              v-model="registerData.username" 
              type="text" 
              class="form-control" 
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="registerData.password" 
              type="password" 
              class="form-control" 
              placeholder="Create a password"
              required
            />
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="registerLoading">
            <i class="bi bi-person-plus"></i>
            Create Account
          </button>
        </form>
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

const loginData = ref({
  email: '',
  password: ''
});

const registerData = ref({
  email: '',
  username: '',
  password: ''
});

const loginLoading = ref(false);
const registerLoading = ref(false);

const handleLogin = () => {
  loginLoading.value = true;
  
  authStore.login(loginData.value)
    .then(() => {
      notyf.success('Welcome back!');
      router.push('/');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Login failed');
    })
    .finally(() => {
      loginLoading.value = false;
    });
};

const handleRegister = () => {
  registerLoading.value = true;
  
  authStore.register(registerData.value)
    .then(() => {
      notyf.success('Account created! You can now login.');
      registerData.value = { email: '', username: '', password: '' };
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Registration failed');
    })
    .finally(() => {
      registerLoading.value = false;
    });
};
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  margin-left: 250px;
}

.auth-cards-wrapper {
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 2000px;
  align-items: stretch;
}

.auth-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  padding: 4rem;
  flex: 1;
}

.auth-divider {
  width: 2px;
  background: linear-gradient(to bottom, transparent, var(--border-color) 20%, var(--border-color) 80%, transparent);
  align-self: stretch;
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

@media (max-width: 1400px) {
  .auth-cards-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .auth-divider {
    display: none;
  }
  
  .auth-container {
    margin-left: 125px;
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
