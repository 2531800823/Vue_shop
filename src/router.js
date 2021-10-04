import Vue from 'vue'
import VueRouter from 'vue-router'
 
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')

// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')

// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')


// import User from './components/user/Users.vue'
const User = () => import(/* webpackChunkName: "user_rights_roles" */ './components/user/Users.vue')

// import Rights from './components/power/Rigths.vue'
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ './components/power/Rigths.vue')

// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ './components/power/Roles.vue')


// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ './components/goods/Cate.vue')

// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ './components/goods/Params.vue')


// import List from './components/goods/List.vue'
const List = () => import(/* webpackChunkName: "list_add" */ './components/goods/List.vue')

// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "list_add" */ './components/goods/Add.vue')


// import Orders from './components/order/Orders.vue'
const Orders = () => import(/* webpackChunkName: "orders_report" */ './components/order/Orders.vue')

// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "orders_report" */ './components/report/Report.vue')



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
                {path: '/reports', component: Report },
                
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

