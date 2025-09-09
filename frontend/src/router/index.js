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
import PlacesView from '../views/PlacesView.vue';
import CreatePlaceView from '../views/CreatePlaceView.vue';
import FlaggedUsersView from '../views/FlaggedUsersView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true, restrictedForAdmin: true } },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true, restrictedForAdmin: true } },
  { path: '/create-post', name: 'CreatePost', component: CreatePostView, meta: { requiresAuth: true, restrictedForAdmin: true } },
  { path: '/places', name: 'Places', component: PlacesView, meta: { requiresAuth: true } },
  { path: '/create-place', name: 'CreatePlace', component: CreatePlaceView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/flagged-users', name: 'FlaggedUsers', component: FlaggedUsersView, meta: { requiresAuth: true, requiresAdmin: true } },
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

  // Check if the route requires admin access
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    return next('/places');
  }

  // Check if the route has specific role requirements
  if (to.meta.role && !to.meta.role.includes(userRole)) {
    return next('/');
  }

  // Admin restrictions: admins can only access places and create-place
  if (userRole === 'admin') {
    if (to.meta.restrictedForAdmin) {
      return next('/places');
    }
    // If admin tries to go to home page, redirect to places
    if (to.path === '/') {
      return next('/places');
    }
  }

  // Prevent logged-in users from accessing login and signup pages
  if (userRole && (to.path === '/login' || to.path === '/signup')) {
    // For admin users, redirect to places instead of home
    if (userRole === 'admin') {
      return next('/places');
    }
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
