
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/user/LoginPage.vue';
import RegisterPage from '../pages/user/RegisterPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  // 可在此添加更多路由
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
