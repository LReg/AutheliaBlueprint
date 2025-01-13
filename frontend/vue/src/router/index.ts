import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import {guardLoggedIn} from "@/security/oidcClient.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: guardLoggedIn
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: "/:catchAll(.*)",
      redirect: '/',
    },
  ],
})

export default router
