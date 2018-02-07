import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'
/*
**通过webpack的require.ensure()来达到代码分割目的;
*vue-router  懒加载
 */
const home = r => require.ensure([], () => r(require('../page/home/home.vue')), 'home')
const promDisProList = r => require.ensure([], () => r(require('../page/promDisProList/promDisProList.vue')), 'promDisProList')
const search = r => require.ensure([], () => r(require('../page/search/search.vue')), 'search')
const group = r => require.ensure([], () => r(require('../page/group/group.vue')), 'group')
const globleGoods = r => require.ensure([], () => r(require('../page/globleGoods/globleGoods.vue')), 'globleGoods')
const crossBorderKnow = r => require.ensure([], () => r(require('../page/crossBorderKnow/crossBorderKnow.vue')), 'crossBorderKnow')
const inviteRrturnMoney = r => require.ensure([], () => r(require('../page/inviteRM/inviteRrturnMoney.vue')), 'inviteRrturnMoney')
const proDetail = r => require.ensure([], () => r(require('../page/proDetail/proDetail.vue')), 'proDetail')
const activity = r => require.ensure([], () => r(require('../page/activity/activity.vue')), 'activity')
const searchResult = r => require.ensure([], () => r(require('../page/searchResult/searchResult.vue')), 'searchResult')
const classify = r => require.ensure([], () => r(require('../page/classify/classify.vue')), 'classify')
const cart = r => require.ensure([], () => r(require('../page/cart/cart.vue')), 'cart')
const myCenter = r => require.ensure([], () => r(require('../page/myCenter/myCenter.vue')), 'myCenter')
const login = r => require.ensure([], () => r(require('../page/login/login.vue')), 'login')
const register = r => require.ensure([], () => r(require('../page/register/register.vue')), 'register')
const foundPassword = r => require.ensure([], () => r(require('../page/foundPassword/foundPassword.vue')), 'foundPassword')
const order = r => require.ensure([], () => r(require('../page/order/order.vue')), 'order')
const address = r => require.ensure([], () => r(require('../page/address/address.vue')), 'address')
const addAddr = r => require.ensure([], () => r(require('../page/addAddr/addAddr.vue')), 'addAddr')




Vue.use(VueRouter)
//项目路由配置
export default new VueRouter({
	mode: 'history',
	base: '/app/',
	routes:[
		{
			path: '/',
			component:App,//顶层路由配置
			children:[
				//地址为空时,重定向为home页
				{
					path:'/',
					redirect:'/home'
				},
				//首页
				{
					path:'/home',
					component:home
				},
				//登录
				{
					path:'/login',
					component:login
				},
				//注册
				{
					path:'/register',
					component:register
				},
				//忘记密码
				{
					path:'/foundPassword',
					component:foundPassword
				},
				//分类
				{
					path:'/classify',
					component:classify
				},
				//购物车
				{
					path:'/cart',
					component:cart
				},
				//订单确认
				{
					path: '/order',
					component: order
				},
				//收货地址
				{
					path: '/address',
					component: address
				},
				//新增收货地址
				{
					path: '/addAddr',
					component: addAddr
				},
				//个人中心
				{
					path:'/myCenter',
					component:myCenter
				},
				//促销优惠(bannerInfo && prodductID)
				{
					path:'/promDisProList',
					component:promDisProList
				},
				//搜索关键字
				{
					path:'/search',
					component:search
				},
				//搜索结果
				{
					path:'/searchResult',
					component:searchResult
				},
				//拼团
				{
					path:'/group',
					component:group
				},
				//全球好货
				{
					path:'/globleGoods',
					component:globleGoods
				},
				//跨境须知
				{
					path:'/crossBorderKnow',
					component:crossBorderKnow
				},
				//邀请返现
				{
					path:'/inviteRrturnMoney',
					component:inviteRrturnMoney
				},
				//商品详情页
				{
					path:'/proDetail',
					component:proDetail
				},
				//首页推荐活动
				{
					path:'/activity',
					component:activity
				}
			]
		}
	]
})