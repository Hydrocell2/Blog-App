<template>
  <div class="comment-item">
    <div class="comment-header">
      <div class="comment-author">
        <div class="author-avatar">
          <img v-if="comment.authorProfilePicture" :src="comment.authorProfilePicture" alt="Profile" />
          <i v-else class="bi bi-person-circle"></i>
        </div>
        <div>
          <h5>{{ comment.authorName }}</h5>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
        </div>
      </div>
      
      <div v-if="canEdit" class="comment-actions">
        <button @click="startEdit" class="action-btn" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button @click="$emit('delete', comment._id)" class="action-btn delete-btn" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
    
    <div v-if="!isEditing" class="comment-content">
      <p>{{ comment.content }}</p>
    </div>
    
    <div v-else class="comment-edit-form">
      <textarea 
        v-model="editContent" 
        class="form-control"
        rows="3"
      ></textarea>
      <div class="edit-actions">
        <button @click="cancelEdit" class="btn btn-secondary btn-sm">
          <i class="bi bi-x"></i>
          Cancel
        </button>
        <button @click="saveEdit" class="btn btn-primary btn-sm">
          <i class="bi bi-check"></i>
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update', 'delete']);

const authStore = useAuthStore();

const isEditing = ref(false);
const editContent = ref('');

const canEdit = computed(() => {
  if (!authStore.isAuthenticated) return false;
  const authorId = typeof props.comment.author === 'object' ? props.comment.author._id : props.comment.author;
  return String(authStore.user.id) === String(authorId) || authStore.isAdmin;
});

const startEdit = () => {
  isEditing.value = true;
  editContent.value = props.comment.content;
};

const cancelEdit = () => {
  isEditing.value = false;
  editContent.value = '';
};

const saveEdit = () => {
  emit('update', props.comment._id, { content: editContent.value });
  isEditing.value = false;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.comment-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--bg-tertiary);
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
  font-size: 2rem;
  color: var(--accent-primary);
}

.comment-author h5 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.comment-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 300;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.85rem;
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

.comment-content p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.comment-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}
</style>
