import {USER_LOGININ,USER_LOGINOUT} from '../mutation-types'

export default {
	//base data;
	state: {
		userInfo:null,
		userID:'',
		access_token:'',
		isLogin:false
	},
	//更改 Vuex store 中的状态方法是提交mutations,而mutations对象更像是事件注册(methods);(不允许异步操作)
	mutations: {
		[USER_LOGININ] (state,res) {
			state.userInfo = res.data.data;
			state.userID = state.userInfo.Customer.CustomerID;
			sessionStorage.setItem("customerID",JSON.stringify(state.userID))
			sessionStorage.setItem("customerInfo",JSON.stringify(state.userInfo))
		},
		[USER_LOGINOUT] (state) {

		}
	},
	//提交mutations
	actions: {
		getUserInfo({commit,state}) {
			// commit(types.USER_LOGININ, res)
		}
	}
}