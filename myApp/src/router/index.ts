import {
    createRouter,
    createWebHistory,
    useRouter
} from 'vue-router'
const toRefsCom = () => import('../components/toRefs.vue')
const routes = [
    {
        name: 'toRefs',
        path: '/toRefs',
        component: toRefsCom,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router