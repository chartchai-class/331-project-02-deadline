import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CountryDetail from '@/views/CountryDetail.vue';
import ContactView from '@/views/ContactView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import TeamMember from '@/views/TeamMember.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import AdminView from '@/views/AdminView.vue';
import nProgress from 'nprogress';
import AddCountryInfo from '@/views/AddCountryInfo.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/team',
    name: 'teammember',
    component: TeamMember,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/country/:noc',
    name: 'country-detail',
    component: CountryDetail,
    props: true,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
  {
    path: '/addcountryinfo',
    name: 'addcountryinfo',
    component: AddCountryInfo,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404-error',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  nProgress.start();
  next();
});

router.afterEach(() => {
  nProgress.done();
});

router.onError(() => {
  nProgress.done();
});

export default router;
