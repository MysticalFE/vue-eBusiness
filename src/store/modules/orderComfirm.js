import { ORDER_COMFIRM } from '../mutation-types'

export default {
	state: {
		shopCartPro: null,
		address: null, //地址
		shipType: null, //发货方式
		invoice: null, //发票
		payType: null, //付款方式
		amount: null //账户
	},
	mutations: {
		[ORDER_COMFIRM] (state,res) {

		}
	},
	actions: {
		summitOrder ({commit,state}) {
			// commit(ORDER_COMFIRM, res)
		}
	}
}