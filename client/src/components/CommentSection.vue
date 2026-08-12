<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3>
        <i class="bi bi-chat-dots"></i>
        Comments ({{ comments.length }})
      </h3>
    </div>
    
    <div v-if="isAuthenticated" class="comment-form">
      <textarea 
        v-model="newComment" 
        class="form-control" 
        placeholder="Write a comment..."
        rows="3"
      ></textarea>
      <button 
        @click="submitComment" 
        class="btn btn-primary" 
        :disabled="!newComment.trim() || submitting"
      >
        <span v-if="!submitting">
          <i class="bi bi-send"></i>
          Post Comment
        </span>
        <span v-else>
          <i class="bi bi-hourglass-split"></i>
          Posting...
        </span>
      </button>
    </div>
    
    <div v-else class="login-prompt">
      <i class="bi bi-lock"></i>
      <p>
        <router-link to="/login">Login</router-link> to leave a comment
      </p>
    </div>
    
    <div v-if="loading" class="loading-comments">
      <i class="bi bi-hourglass-split"></i>
      <p>Loading comments...</p>
    </div>
    
    <div v-else-if="comments.length === 0" class="no-comments">
      <i class="bi bi-chat"></i>
      <p>No comments yet. Be the first to comment!</p>
    </div>
    
    <div v-else class="comments-list">
      <CommentItem 
        v-for="comment in comments" 
        :key="comment._id" 
        :comment="comment"
        @update="handleUpdate"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCommentStore } from '../stores/comment';
import { useAuthStore } from '../stores/auth';
import CommentItem from './CommentItem.vue';
import { Notyf } from 'notyf';

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const commentStore = useCommentStore();
const authStore = useAuthStore();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'bottom' } });

const newComment = ref('');
const loading = ref(false);
const submitting = ref(false);

const comments = computed(() => commentStore.comments);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const loadComments = () => {
  loading.value = true;
  commentStore.fetchCommentsByPost(props.postId)
    .catch(error => {
      notyf.error('Failed to load comments');
    })
    .finally(() => {
      loading.value = false;
    });
};

const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  submitting.value = true;
  
  commentStore.createComment(props.postId, { content: newComment.value })
    .then(() => {
      newComment.value = '';
      notyf.success('Comment posted!');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to post comment');
    })
    .finally(() => {
      submitting.value = false;
    });
};

const handleUpdate = (commentId, data) => {
  commentStore.updateComment(commentId, data)
    .then(() => {
      notyf.success('Comment updated!');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to update comment');
    });
};

const handleDelete = (commentId) => {
  commentStore.deleteComment(commentId)
    .then(() => {
      notyf.success('Comment deleted!');
    })
    .catch(error => {
      notyf.error(error.response?.data?.error || 'Failed to delete comment');
    });
};

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.comments-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.comments-header i {
  color: var(--accent-primary);
}

.comment-form {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.comment-form .btn {
  align-self: flex-end;
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.login-prompt i {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.login-prompt p {
  margin: 0;
  color: var(--text-secondary);
}

.login-prompt a {
  font-weight: 600;
}

.loading-comments,
.no-comments {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-comments i,
.no-comments i {
  font-size: 3rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.loading-comments p,
.no-comments p {
  color: var(--text-secondary);
}

.comments-list {
  margin-top: 1.5rem;
}
</style>
