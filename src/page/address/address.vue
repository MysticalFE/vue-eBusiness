<template>
	<div class="address">
		<other-header class="headerTop">
				<span slot="order-text">收货地址</span>
		</other-header>
		<section class="addrInfo">
			<div class="addrInfoList" v-if="shipAddressList.length > 0">
				<section class="addrInfoListItem" v-for="item of shipAddressList">
					<div class="addrssInfo" ref="addressInfo" @click="getAddressInfo(item)">
						<p>
							<span>收件人 </span>
							<span> {{ item.TrueName + '&nbsp;&nbsp;' + dealMobilePhone(item.Mobile) }}</span>
							<span v-show="item.IsDefault == 1" class="addDefault">默认</span>
						</p>
						<p>
							<span>地&nbsp;&nbsp;&nbsp;&nbsp;址</span>
							<span>{{ item.ProvinceName + '&nbsp;&nbsp;' + item.CityName + '&nbsp;&nbsp;' + item.CityZoneName + '&nbsp;&nbsp;' + item.Address}}</span>
						</p>
						<p>
							<span>邮&nbsp;&nbsp;&nbsp;&nbsp;编</span>
							<span>{{ item.Zip }}</span>
						</p>
					</div>
					<div class="dealAddrInfo">
						<div class="btn btnDelete" @click="delAddr(item.ContactorID)">删除</div>
						<div class="btn btnEditor" @click="editAddr(item.ContactorID,item.ProvinceID,item.CityID,item.CityZoneID,item.IsDefault)">编辑</div>
					</div>
				</section>
			</div>
			<div class="noAddrInfo" v-else>
				<div class="noAddrInfoImg">
					<img src="../../images/norecord.png" alt="">
				</div>
				<div>暂无收货地址信息</div>
			</div>
		</section>
		<footer>
			<!-- <span>新建收货地址</span> -->
			<span @click="emptyState">新建收货地址</span>
		</footer>
		<tip-alert
			:showTip.sync="showTip"
			:tipText="tipText"
			:showTipBtn="showTipBtn"
			@closeTip = "closeTip"
			@confirmEvent = "confirmEvent">
		</tip-alert>
		<loading :showLoading="showLoading"></loading>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import TipAlert from '../../components/common/tipAlert'
	import Loading from '../../components/common/loading.vue'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				customerID: '',
				pageNumber: 1,
				pagesize: 100,
				shipAddressList: [],
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
				showLoading:false
			}
		},
		created () {
			this.showLoading = true;
			this.init()
		},
		methods: {
			async init () {
				this.customerID = sessionStorage.getItem('customerID') || '';

				await this.getAddrList()
			},
			getAddrList () {
				this.$http({
					method: 'get',
					url: '/api/Customers/ShipaddressList',
					params: {
						CustomerID: this.customerID,
						pagesize: this.pagesize,
						pageNumber: this.pageNumber
					},
					headers: {
						'X-Iluxday-Authentication':'nPJv7QpgP3tkm52gLCnaNGlDk2c4pV7IbJI8yqQuhXk='
					}
				})
				.then (res => {
					if (res.data.code === 0) {
						let resData = res.data.data;
						this.shipAddressList = resData.ShipAddressList;
						this.showLoading = false
					}
					console.log(res)
				})
			},
			dealMobilePhone (tel) {
				if (tel) {
					tel = tel.replace(/^(\w{3})\w{4}(.*)$/, '$1****$2');
				}
				return tel;
			},
			delAddr(addressID) {
				this.$store.commit('ADDRESS_ID',addressID)
				this.showTip = true;
				this.showTipBtn = true;
				this.tipText = '确定要删除该地址么？'
				// this.tipTimerOut(1300)
			},
			editAddr(addressID,proId,cityId,townId,isDefault) {
				this.$store.commit('ADDRESS_ID',{addressID: addressID,provinceID: proId,cityID: cityId,townID: townId,isDefault: isDefault})
				this.$router.push('/addAddr')
			},
			emptyState() {
				if (this.$store.state.addr.addressInfo.addressID) {
					this.$store.commit('ADDRESS_ID',{addressID: ''})
					this.$router.push('/addAddr')
				} else {
					this.$router.push('/addAddr')
				}
			},
			getAddressInfo(item) {
				this.$store.commit('ADDRESS_INFO',item)
				this.$router.push('/order')
			},
			//确认删除商品
			confirmEvent () {
				this.$http({
					method: 'post',
					url: '/api/Customers/shippingAddressDelete',
					params: {
						CustomerID: this.customerID,
						shippingAddressID: this.$store.state.addr.addressInfo
					}
				})
				.then(res => {
					if (res.data.code === 0) {
						this.showTip = false;
						this.showLoading = true;
						this.getAddrList()
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			//取消删除商品
			closeTip () {
				this.showTip = false;
			},
			//弹窗倒计时
			tipTimerOut (timer) {
				if (this.showTip === true) {
					this.timer = setTimeout( () => {
						this.showTip = false;
					},timer)
				} else {
					clearTimeout(this.timer)
				}
			},
		},
		components: {
			OtherHeader,
			TipAlert,
			Loading
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	.address {
		background: #f4f4f4;
	}
	.headerTop {
		background:rgba(191,191,191,0.9);
		span {
			font-size: 1.2rem;
			color: #222;
		}
	}
	.addrInfo {
		margin-top: 3rem;
		img {
			display: block;
			width:65%;
		}
		.noAddrInfo {
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			padding-top: 30px;
			.noAddrInfoImg {
				img{
					margin: 0 auto;
				}
			}
			div:nth-child(2) {
				margin-top: 10px;
				color: #9b9b9b;
			}
		}
	}
	.addrInfoList {
		padding-bottom: 10px;
		.addrInfoListItem {
			margin-bottom: 10px;
			background: #fff;
			overflow: hidden;
			padding: 10px;
			border-bottom: 1px solid #e5e5e5;
			p {
				display: flex;
				justify-content: flex-start;
				font-size: 14px;
				margin-bottom: 7px;
				span:nth-child(1) {
					display: flex;
					width: 4.27rem;
					text-align: justify;
					text-align-last: justify;
					justify-content: space-evenly;
					&:after {
						content: ": ";
						display: inline-block;
    					padding-left: 5px;
    					line-height: 18px;
					}
				}
				.addDefault {
					height: 25px;
					padding: 0 5px;
					color: @baseBackground;
					line-height: 25px;
					text-align: center;
					margin-left: 20px;
					border: 1px solid @baseBackground;
				}
			}
			.dealAddrInfo {
				width: 100%;
				.flexCenterBox;
				padding-top: 10px;
				border-top: 1px solid #e0e0e0;
				justify-content: flex-start;
				.btn {
					font-size: 14px;
					line-height: 14px;
					border: 1px solid @baseBackground;
					border-radius: 4px;
					padding:6px 12px;
					min-width: 6.5rem;
					.flexCenterBox;
					margin-right: 20px;
				}
				.btnDelete {
					color: @baseBackground;
				}
				.btnEditor {
					color: #fff;
					background: @baseBackground;
				}
			}
		}
	}
	footer {
		height: 3.2rem;
		position: fixed;
		bottom: 10px;
		width: 100%;
		padding: 0 .8rem;
		span {
			width: 100%;
			background:@baseBackground;
			color:#fff;
			display: block;
			border-radius: 3px;
			line-height: 3.2rem;
			text-align: center;
			font-size: 16px;
		}
	}
</style>
