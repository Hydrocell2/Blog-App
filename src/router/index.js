import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Auth.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Auth.vue'),
      meta: { guest: true }
    },
    {
      path: '/create',
      name: 'CreatePost',
      component: () => import('../pages/CreatePost.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'PostDetail',
      component: () => import('../pages/PostDetail.vue')
    },
    {
      path: '/post/:id/edit',
      name: 'EditPost',
      component: () => import('../pages/EditPost.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../pages/Profile.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
