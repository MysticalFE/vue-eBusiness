import { CART_INFO } from '../mutation-types'

export default {
	//base data;
	state: {
		tempID:null,
		itemList:[],
		item: null,
	},
	//更改 Vuex store 中的状态方法是提交mutations,而mutations对象更像是事件注册(methods);(不允许异步操作)
	mutations: {
		[CART_INFO] (state,res) {
			console.log(res)
			state.itemList = res;
		}
	},
	//提交mutations
	actions: {
		getCartInfo({commit,state}) {
			// commit(CART_INFO, res)
		}
	}
}