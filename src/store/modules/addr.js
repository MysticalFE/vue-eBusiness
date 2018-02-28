import { ADDRESS_ID,ADDRESS_INFO } from '../mutation-types'

export default {
	//base data;
	state: {
		addressInfo: {},
		address_info: {}
	},
	mutations: {
		[ADDRESS_ID] (state,res) {
			// console.log(res)
			state.addressInfo = res
		},
		[ADDRESS_INFO] (state,res) {
			// console.log(res)
			state.address_info = res
		}
	},
	//提交mutations
	actions: {
		getAddressID({commit,state}) {
			commit(ADDRESS_ID, res)
			console.log(res)
		},
		getAddressInfo({commit,state}) {
			commit(ADDRESS_INFO, res)
		}
	}
}