import req from '../api/requestType'
/**
 * 首页数据
 */
export const homeData = () => {
	return req.get('/RestHome/HomeActivity')
}
/**
 * 拼团详情
 */
export const groupDetail = param => {
	return req.get('/RestHome/GroupDetail',param)
}
/**
 * 判断是否团长
 */
export const judgeGroupLeader = param => {
	return req.post('/RestHome/IsCheckGroup',param)
}

/**
 * 拼团列表
 */
export const groupList = param => {
	return req.get('/RestHome/GroupList',param)
}
/**
 * 参团条件判断
*/
export const isCheckGroupOrder = param => {
	return req.post('/Shopping/IsCheckGroupOrdersV2',param)
}
/**
 * 加入购物车
 */
export const joinCart = param => {
	return req.post('/UIProduct/AddShopping',param)
}

/**
 * 登录
 */
export const login = param => {
	return req.post('/login/login',param)
}
/**
 * 动态密码登录
 */
export const dynamiclogin = param => {
	return req.post('/login/dynamiclogin',param)
}
/**
 * 短信验证码
 */
export const sendSMS = param => {
	return req.post('/System/SendSMSInter',param)
}
