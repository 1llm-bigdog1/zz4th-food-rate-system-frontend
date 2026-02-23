
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  // 可在此添加更多路由
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
