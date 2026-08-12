<template>
  <div class="profile-container">
    <div v-if="loading" class="loading-state">
      <i class="bi bi-hourglass-split"></i>
      <p>Loading profile...</p>
    </div>

    <div v-else class="profile-card">
        <div class="profile-header">
          <h1><i class="bi bi-person-circle"></i> My Profile</h1>
        </div>

        <div class="profile-content">
          <div class="profile-picture-section">
            <div class="profile-picture">
              <i v-if="!formData.profilePicture" class="bi bi-person-circle"></i>
              <img v-else :src="formData.profilePicture" alt="Profile picture" />
            </div>
            <div class="picture-upload">
              <label class="form-label">Profile Picture URL</label>
              <input 
                v-model="formData.profilePicture" 
                type="text" 
                class="form-control" 
                placeholder="Enter image URL"
              />
              <p class="helper-text">Paste an image URL</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  :value="authStore.user.username"
                  disabled
                />
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  :value="authStore.user.email"
                  disabled
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea 
                v-model="formData.bio" 
                class="form-control" 
                placeholder="Tell us about yourself..."
                rows="4"
                maxlength="500"
              ></textarea>
              <p class="char-count">{{ formData.bio.length }} / 500</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select v-model="formData.gender" class="form-control">
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Age</label>
                <input 
                  v-model.number="formData.age" 
                  type="number" 
                  class="form-control" 
                  placeholder="Enter your age"
                  min="0"
                  max="150"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="handleLogout" class="btn btn-outline">
                <i class="bi bi-box-arrow-right"></i>
                Logout
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="!submitting">
                  <i class="bi bi-check-circle"></i>
                  Save Changes
                </span>
                <span v-else>
                  <i class="bi bi-hourglass-split"></i>
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { Notyf } from 'notyf';

const router = useRouter();
const authStore = useAuthStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const loading = ref(false);
const submitting = ref(false);
const formData = ref({
  bio: '',
  gender: '',
  age: null,
  profilePicture: ''
});

const loadProfile = () => {
  loading.value = true;
  
  api.user.getProfile()
    .then(response => {
      const user = response.data.user;
      formData.value = {
        bio: user.bio || '',
        gender: user.gender || '',
        age: user.age || null,
        profilePicture: user.profilePicture || ''
      };
    })
    .catch(error => {
      notyf.error('Failed to load profile');
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSubmit = () => {
  submitting.value = true;

  api.user.updateProfile(formData.value)
    .then(response => {
      authStore.user = {
        ...authStore.user,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(authStore.user));
      notyf.success('Profile updated successfully!');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to update profile');
    })
    .finally(() => {
      submitting.value = false;
    });
};

const handleLogout = () => {
  authStore.logout();
  notyf.success('Logged out successfully');
  router.push('/login');
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  max-width: 2000px;
  width: 100%;
  margin: 0 auto;
  margin-left: 200px;
}

.profile-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  width: 100%;
}

.profile-header {
  padding: 3rem 3.5rem 2rem;
  border-bottom: 2px solid var(--border-color);
}

.profile-header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: var(--text-primary);
}

.profile-header i {
  color: var(--accent-primary);
  font-size: 2.5rem;
}

.profile-content {
  padding: 3.5rem;
}

.profile-picture-section {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-picture {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--bg-secondary);
  border: 3px solid var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-picture i {
  font-size: 8rem;
  color: var(--accent-primary);
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picture-upload {
  flex: 1;
}

.helper-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.char-count {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
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
  .profile-container {
    margin-left: 100px;
  }
}

@media (max-width: 768px) {
  .profile-picture-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .profile-content {
    padding: 1.5rem;
  }

  .profile-header {
    padding: 1.5rem;
  }

  .profile-header h1 {
    font-size: 1.5rem;
  }
  
  .profile-container {
    margin-left: 0;
  }
}
</style>
