import Vue from 'vue'
import VueRouter from 'vue-router'
 
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(VueRouter)

const router  =  new VueRouter({
    routes: [
        { path: '/', component: Login},
        { path: '/login', component: Login},
        { path: '/Home', component: Home},
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

