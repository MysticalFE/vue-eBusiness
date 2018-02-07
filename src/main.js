import Vue from 'vue'
import App from './App.vue'
import store from './store/'
import VueAwesomeSwiper from 'vue-awesome-swiper'
//用vue-resource进行与服务端的通信,vue2.0以后不推荐使用
// import VueResource from 'vue-resource'
//用axios进行与服务端的通信。
import axios from 'axios'
import router from './router/router.js'
import './config/rem.js'
import loadMore from './directives/loadMore' //指令
// Vue.use(VueResource)
Vue.use(axios)
Vue.prototype.$http = axios
Vue.use(VueAwesomeSwiper)
//创建一个路由实例并配置路由规则 (路由直接写在了router.js内)
// const router = new VueRouter({
// 	mode:'history',
// 	Router
// })

//创建App实例
new Vue({
	router,//对组件的注入,必须传入router对象(若换了字段，比如Router则会报错)
	store
}).$mount('#app')

