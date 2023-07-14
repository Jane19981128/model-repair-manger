import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: "/login",
        name: "login",
        component: () => import('../views/login/index.vue'),
        meta: {
            keepAlive: false
        }
    },
    {
        path: "/chalk",
        name: "chalk",
        component: () => import('../views/home/index.vue'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/404',
        name: 'notFound',
        meta: {
            title: 'page not found'
        },
        component: () => import('../views/notFound/404.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
];
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

export default router;