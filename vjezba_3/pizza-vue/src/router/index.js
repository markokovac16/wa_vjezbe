import { createRouter, createWebHistory } from 'vue-router';
import PizzaList from '../components/PizzaList.vue';
import PizzaDetalji from '../components/PizzaDetalji.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: PizzaList },
    { path: '/pizze/:naziv', component: PizzaDetalji },
  ],
});

export default router;
