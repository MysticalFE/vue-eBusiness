import { INCOICE_INFO } from '../mutation-types'

export default {
	//base data;
	state: {
		invoiceInfo: {}
	},
	//更改 Vuex store 中的状态方法是提交mutations,而mutations对象更像是事件注册(methods);(不允许异步操作)
	mutations: {
		[INCOICE_INFO] (state,res) {
			console.log(res)
			// state.invoiceInfo = res;
			state.invoiceInfo = Object.assign({},res)
		}
	},
	//提交mutations
	actions: {
		getInvoiceInfo({commit,state}) {
			commit(INCOICE_INFO, res)
		}
	}
}