import {
    createRouter,
    createWebHistory,
    useRouter
} from 'vue-router'
const toRefsCom = () => import('../components/toRefs.vue')
const setupCom = () => import('../components/setUp.vue')
const routes = [
    {
        name: 'toRefs',
        path: '/toRefs',
        component: toRefsCom,
    },
    {
        name: 'setUp',
        path: '/setup',
        component: setupCom,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router