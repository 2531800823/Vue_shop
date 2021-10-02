import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import Treetable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 添加的树形表格
Vue.component('tree-table', Treetable)
// 日期过滤器
Vue.filter('dataFilter', function (val) {
  const date = new Date(val);

  const n = date.getFullYear();
  const y = (date.getMonth() + 1+'').padStart(2,'0')
  const r = (date.getDate()+'').padStart(2,'0')

  const s = (date.getHours()+'').padStart(2, '0')
  const f = (date.getMinutes()+'').padStart(2, '0')
  const m = (date.getSeconds()+'').padStart(2, '0')


  return `${n}-${y}-${r} ${s}:${f}:${m}`
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
