/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import SignUpView from '../views/SignUpView.vue';
import ProfileView from '../views/ProfileView.vue';
import CreatePostView from '../views/CreatePostView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/create-post', name: 'CreatePost', component: CreatePostView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = localStorage.getItem('auth');
  const userRole = auth ? JSON.parse(auth).role : null;

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !userRole) {
    return next('/login');
  }

  // Check if the route has specific role requirements
  if (to.meta.role && !to.meta.role.includes(userRole)) {
    return next('/');
  }

  // Prevent logged-in users from accessing login and signup pages
  if (userRole && (to.path === '/login' || to.path === '/signup')) {
    return next('/');
  }

  // Route to home if path doesn't exist in router paths
  if (!routes.some(route => route.name === to.name)) {
    return next('/');
  }

  next();
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router;
