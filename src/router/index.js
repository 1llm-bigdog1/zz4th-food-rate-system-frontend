
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/user/LoginPage.vue';
import RegisterPage from '../pages/user/RegisterPage.vue';
import AccountDetailPage from '../pages/user/AccountDetail.vue';

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
  {
    path: '/account',
    name: 'AccountDetail',
    component: AccountDetailPage
  },
  // 可在此添加更多路由
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
