import Vue from 'vue'
import App from './App.vue'
import store from './store/'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from 'axios'
import router from './router/router.js'
import './config/rem.js'
import loadMore from './directives/loadMore' //指令
import vueLazyLoad from 'vue-lazyload'
Vue.prototype.$http = axios
Vue.use(VueAwesomeSwiper)
Vue.use(vueLazyLoad,{
	error: require('./images/WaterFallBanner.png'),
	loading: require('./images/WaterFallBanner.png')
})
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

