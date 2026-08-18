/**
 * 文件说明：index.js
 * 1. 这个脚本负责管理页面路由入口与路径映射关系。
 * 2. 该文件位于 src\router 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应优先关注它和其它模块之间的依赖关系，避免改动牵连过大。
 */
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/user/LoginPage.vue';
import RegisterPage from '../pages/user/RegisterPage.vue';
import AccountDetailPage from '../pages/user/AccountDetail.vue';
import DishesList from '../pages/rating/DishesList.vue';
import RatingDetail from '../pages/rating/RatingDetail.vue';
import AdviceList from '../pages/advice/AdviceList.vue';
import AdviceDetail from '../pages/advice/AdviceDetail.vue';
import SelectionList from '../pages/selection/SelectionList.vue';
import SelectionDetail from '../pages/selection/SelectionDetail.vue';
import SuggestionList from '../pages/suggestions/SuggestionList.vue';
import SuggestionDetail from '../pages/suggestions/SuggestionDetail.vue';
import DishesManagement from '../pages/management/DishesManagement.vue';
import AdminChannel from '../pages/management/AdminChannel.vue';

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
  },
  {
    path: '/selection-detail/:id',
    name: 'SelectionDetail',
    component: SelectionDetail
  },
  {
    path: '/advice-list',
    name: 'AdviceList',
    component: AdviceList
  },
  {
    path: '/advice-detail/:id',
    name: 'AdviceDetail',
    component: AdviceDetail
  },
  {
    path: '/suggestion-list',
    name: 'SuggestionList',
    component: SuggestionList
  },
  {
    path: '/suggestion-detail/:id',
    name: 'SuggestionDetail',
    component: SuggestionDetail
  },
  {
    path: '/dishes-management',
    name: 'DishesManagement',
    component: DishesManagement
  },
  {
    path: '/admin',
    name: 'AdminChannel',
    component: AdminChannel
  }
];

const router = createRouter({
  // 本地开发和部署到根路径时使用 HTML5 History。
  history: createWebHistory(),
  routes
});

export default router;
