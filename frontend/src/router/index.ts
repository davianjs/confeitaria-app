import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { isAuthenticated } from '../services/authService';

import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Insumos from '../views/Insumos.vue';
import Produtos from '../views/Produtos.vue';
import Vendas from '../views/Vendas.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/insumos',
    name: 'Insumos',
    component: Insumos,
    meta: { requiresAuth: true }
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: Produtos,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendas',
    name: 'Vendas',
    component: Vendas,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const autenticado = isAuthenticated();

  if (to.meta.requiresAuth && !autenticado) {
    next('/login');
  } else if (to.meta.requiresGuest && autenticado) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
