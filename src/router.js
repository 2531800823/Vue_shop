import Vue from 'vue'
import VueRouter from 'vue-router'
 
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/Users.vue'
import Rights from './components/power/Rigths.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
import Orders from './components/order/Orders.vue'

Vue.use(VueRouter)

const router  =  new VueRouter({
    routes: [
        { path: '/', component: Login},
        { path: '/login', component: Login},
        {
            path: '/Home', 
            component: Home,
            redirect:'/welcome',
            children: [
                {path:'/welcome',component:Welcome},
                { path: '/users', component: User },
                {path:"/rights",component:Rights},
                { path: "/roles", component: Roles },
                {path: '/categories', component: Cate },
                {path: '/params', component: Params },
                {path: '/goods', component: List },
                {path: '/add', component: Add },
                {path: '/orders', component: Orders },
                
            ]
        },
    ]
})

// 导航守卫
router.beforeEach(function (to,from,next) {
    if (to.path === '/login') return next()
    
    const token = window.sessionStorage.getItem('token');

    if (!token) return next('/login')
    
    next();
})


export default router

