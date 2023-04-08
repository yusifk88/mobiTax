import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import salesTaxpage from '@/views/salesTaxPage.vue';
import payrolPage from '@/views/payrollPage.vue';
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: "/vat",
        component: salesTaxpage

    },
    {
        path: "/payslip",
        component: payrolPage

    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/message/:id',
        component: () => import('../views/ViewMessagePage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next)=>{

if (from.path== "/vat"){

    store.state.taxSheetOpen=false;
}

next()

});

export default router
