import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/user/LoginPage.vue';
import RegisterPage from '../pages/user/RegisterPage.vue';
import AccountDetailPage from '../pages/user/AccountDetail.vue';
import DishesList from '../pages/rating/DishesList.vue';
import RatingDetail from '../pages/rating/RatingDetail.vue';
import SelectionList from '../pages/selection/SelectionList.vue';

// 路由表：按页面模块分组，便于后续拆分子路由。
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
  {
    path: '/dishes',
    name: 'DishesList',
    component: DishesList
  },
  {
    path: '/rating-detail',
    name: 'RatingDetail',
    component: RatingDetail
  },
  {
    path: '/selectionlist',
    name: 'SelectionList',
    component: SelectionList
  }
];

const router = createRouter({
  // 本地开发和部署到根路径时使用 HTML5 History。
  history: createWebHistory(),
  routes
});

export default router;
