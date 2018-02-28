<template>
	<div class="order">
		<other-header class="headerTop">
				<span slot="order-text">订单确认</span>
		</other-header>
		<!-- <addr></addr> -->
		<section class="addr orderItem">
			<section class="showAddr" v-for="item of address" v-if="address.length > 0 && item.IsDefault === 1">
				<router-link tag="div" to="/address" class="addrWraper">
					<div class="addrContent">
						<div class="addrLeft">
							<p class="addrUserInfo">
								<span>{{ item.TrueName }}</span>
								<span>{{ item.Mobile }}</span>
								<span v-show="item.IsDefault === 1">默认</span>
							</p>
							<p class="addrInfo">
								<img src="../../images/location.svg" alt="">
								<span>{{ item.CityName + '&nbsp;&nbsp;' + item.CityZoneName + '&nbsp;&nbsp;' + item.Address}}</span>
							</p>
						</div>
						<div class="addrRight">
							<img src="../../images/arrowRight.svg" alt="">
						</div>
					</div>
				</router-link>
			</section>
			<section class="noAddr" v-if="address.length <= 0">
				<!-- <div class="addressAddButton">新建收货地址</div> -->
				<router-link tag="div" class="addressAddButton" to="/address">选择收货地址</router-link>
			</section>
		</section>
		<section class="proInfo orderItem">
			<section class="proInfoContent">
				<div class="proNum proCommon" @click="popProList($event)" data-type="1">
					<div class="proLeft" data-type="1">
						<span>共{{ retProNum }}件商品</span>
					</div>
					<div class="proRight" data-type="1">
						<img src="../../images/arrowRight.svg" alt="">
					</div>
				</div>
				<!-- 拆单情况 -->
				<div class="proImg" v-if="isDivide === 1" v-for="(item,i) of orderProList">
					<div class="packageImglist">
						<span v-if="crossBorder === 0 && item.packgeIndex">包裹{{i + 1}}</span>
						<span v-if="crossBorder === 1 && item.packgeName">{{ item.packgeName }}</span>
					</div>
					<div class="proImgItemList">
						<div class="proImgItem" v-for="itemImg of item.proList">
							<img :src="itemImg.ImageUrl" alt="">
							<span>×{{ itemImg.Num }}</span>
						</div>
					</div>
				</div>
				<!-- 不拆单情况 -->
				<div class="proImg" v-if="isDivide === 0">
					<div class="packageImglist">
						<!-- <span v-if="crossBorder === 0"></span> -->
						<span v-if="crossBorder === 1 && orderProList.length > 0">{{ orderProList[0].Package }}</span>
					</div>
					<div class="proImgItemList">
						<div class="proImgItem" v-for="(item,i) of orderProList">
							<img :src="item.ImageUrl" alt="">
							<span>×{{ item.Num }}</span>
						</div>
					</div>
				</div>
				<!-- 非跨境显示发票 -->
				<div class="invoice proCommon" v-show="crossBorder === 0" @click="popProList($event)" data-type="2">
					<div class="proLeft" data-type="2">
						<span>发票信息</span>
					</div>
					<div class="proRight" data-type="2">
						<span>{{ invoiceName }}</span>
						<img src="../../images/arrowRight.svg" alt="">
					</div>
				</div>
				<!-- 跨境显示发票 -->
				<div class="invoice proCommon" v-show="crossBorder === 1" @click="popProList($event)" data-type="2">
					<div class="proLeft" data-type="2">
						<span>身份信息</span>
					</div>
					<div class="proRight" data-type="2">
						<span>{{ getName }}</span>
						<img src="../../images/arrowRight.svg" alt="">
					</div>
				</div>
			</section>
		</section>
		<section class="aboutDiscount orderItem">
			<div class="discountCards proCommon" ref="discountCard">
				<div class="proLeft">
					<span>优惠券</span>
					<span>可用{{ couponList.length }}张</span>
				</div>
				<div class="proRight">
					<span v-if="isdiscountUsable === true">不可用</span>
					<span v-if="couponList.length === 0 && isdiscountUsable === false">无可用优惠券</span>
					<span v-if="couponList.length != 0 && isdiscountUsable === false" class="couponTitle">{{ couponList[0].title }}</span>
					<img src="../../images/arrowRight.svg" alt="">
				</div>
			</div>
			<div class="remainingMoney proCommon">
				<div class="proLeft">
					<span>余额</span>
					<span>可用{{ formatCurrency(remainingMoney) }}</span>
				</div>
				<div class="proRight">
					<div class="button_switch" :class="{change_to_text: showReacc, noClickStyle: giftNocilck}" ref="remainaccSwitch">
	                    <div class="circel_button" :class="{trans_to_right: showReacc}" @click="switchRacc"></div>
        			</div>
				</div>
			</div>
			<div class="giftCard proCommon">
				<div class="proLeft">
					<span>礼品卡</span>
					<span>可用{{ formatCurrency(giftCardAcc) }}</span>
				</div>
				<div class="proRight">
					<div class="button_switch" :class="{change_to_text: showGiftacc, noClickStyle: remainNoclick}" ref="giftSwitch">
	                    <div class="circel_button" :class="{trans_to_right: showGiftacc}" @click="switchGiftacc"></div>
        			</div>
				</div>
			</div>
		</section>
		<section class="accountInfo orderItem"  v-if="amount != null">
			<div class="giftCard proCommon">
				<div class="proLeft">
					<span>商品金额</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(amount.ShoppingAmount) }}</span>
				</div>
			</div>
			<div class="giftCard proCommon">
				<div class="proLeft">
					<span>运费</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(amount.ShippingPrice) }}</span>
				</div>
			</div>
			<div class="giftCard proCommon">
				<div class="proLeft">
					<span>满减优惠</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(-amount.ReductionAmount) }}</span>
				</div>
			</div>
			<div class="giftCard proCommon">
				<div class="proLeft">
					<span>优惠券折扣</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(amount.Discount) }}</span>
				</div>
			</div>
			<div class="giftCard proCommon" v-show="showReacc === true">
				<div class="proLeft">
					<span>余额支付</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(amount.UsAccountPay) }}</span>
				</div>
			</div>
			<div class="discount proCommon" v-show="showGiftacc === true">
				<div class="proLeft">
					<span>礼品卡</span>
				</div>
				<div class="proRight">
					<span>{{ formatCurrency(amount.UsGiftCard) }}</span>
				</div>
			</div>
		</section>
		<footer v-if="amount">
			<div class="fLeft">
				<span>应付金额 : <span>{{ formatCurrency(amount.PaymentAmount) }}</span></span>
			</div>
			<div class="fRight">提交订单</div>
		</footer>
		<loading :showLoading="showLoading"></loading>
		<pro-list :showPopList="showPopList" :data="orderProList" :isDivide="isDivide" :crossBorder="crossBorder" :amount="amount" @closePop="closePop" v-show="popTypeFlag === 1"></pro-list>
		<invoice :showPopList="showPopList" @closePop="closePop" :crossBorder="crossBorder" :userName="getName" v-show="popTypeFlag === 2"></invoice>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import Loading from '../../components/common/loading'
	import ProList from '../../components/orderProList/proList'
	import Invoice from '../../components/orderInvoice/invoice'
	import { formatCurrency } from '../../config/common'
	import { mapState,mapMutations} from 'vuex'
	const NO_INCOICE = '无需发票'
	const PERSONAGE = '个人'
	export default {
		data () {
			return {
				formatCurrency: formatCurrency,
				customerID: null,
				crossBorder: 0,
				shipAddressID: '',
				address: [],
				shopCartProduct: [],
				dispatchType: {},
				payType: [],
				couponList: [],
				remainingMoney: 0,
				giftCardAcc: 0,
				amount: {},
				isDivide: 0,
				showReacc: false,//是否使用余额
				showGiftacc: false,//是否使用礼品卡
				isdiscountUsable: false,//优惠券是否可用
				giftNocilck: false,//屏蔽礼品卡点击事件标识
				remainNoclick: false,//屏蔽余额点击事件标识
				showLoading:false,//是否显示加载图标
				showPopList: false,//是否显示商品清单
				orderProList: [],//处理好的拆单商品
				popTypeFlag: -1,//商品清单 发票 优惠券列表弹出层标识
				invoiceName: NO_INCOICE,//发票信息
				identifyNumber: ''//纳税人识别号
			}
		},
		created () {
			this.showLoading = true
			// this.isDivide = 0
			this.init();
		},
		mounted () {

		},
		computed: {
			retProNum() {
				let totalNum = 0;
				this.shopCartProduct.forEach((item,index) => {
					totalNum += item.Num
				})
				return totalNum
			},
			getName() {
				let name = '';
				this.address.forEach((item,index) => {
					if (item.IsDefault === 1) {
						name = item.TrueName
					}
				})
				return name
			},
		},
		methods: {
			init () {
				this.shipAddressID = this.$store.state.addr.address_info.ContactorID || ''
				this.crossBorder = Number(sessionStorage.getItem('crossBorder'))
				this.customerID = sessionStorage.getItem('customerID') || '';
				this.getOrderdata()
			},
			getOrderdata () {
				this.$http({
					method: 'post',
					url: '/api/Shopping/CheckOutOrderV4',
					data: {
						CustomerID: this.customerID,
						ItemList: sessionStorage.getItem('itemList'),
						CrossBorder: this.crossBorder,
						ShipAddressID: this.shipAddressID
					}
				}).then (res => {
					console.log(res)
					if (res.data.code === 0) {
						const resData = res.data.data;
						console.log(resData)
						this.address = resData.Address;
						this.shopCartProduct = resData.ShopCartProduct;
						this.dispatchType = resData.ShipType;
						this.payType = resData.PayType;
						this.couponList = resData.Coupon;
						this.remainingMoney = resData.AbleUsAcc;
						this.giftCardAcc = resData.AbleUsGiftCard;
						this.amount = resData.Amount;
						this.isDivide = resData.IsDivide
						this.carryOrderAmount = resData.CarryOrderAmount;//包邮门槛
						this.showLoading = false
						this.divideOrder()
					}
				}).catch(error => {
					console.log(error)
				})
			},
			//拆单
			divideOrder() {
				//将Package相同的商品处理在一起
				let divideProList = []
				const shopCartProduct = this.shopCartProduct
				if (this.isDivide === 1) {
					this.shopCartProduct.forEach((item,index) => {
						if (item.StoreNum > 0) {
							divideProList.push({
								packgeIndex: index + 1,
								packgeName: item.Package,
								proList: [item]
							})
						}
					})
					for (let i = 0;i < divideProList.length; i++) {
						for (let j = 0; j < divideProList.length; j++) {
							if (divideProList[i].packgeName === divideProList[j].packgeName && i < j)  {
								divideProList[i].proList = divideProList[i].proList.concat(divideProList[j].proList)
								// divideProList.splice(j,3)
							}
						}
					}
					this.getDealResult(divideProList)
				} else {
					this.orderProList = shopCartProduct
					console.log(this.orderProList)
				}
			},
			//如果是拆单订单,将divideProList中相同的Package过滤掉
			getDealResult(divideProList = []) {
				let dealResult = [],filterRepetEle = {},elem =''
				for (let i = 0; i< divideProList.length; i++) {
					elem = divideProList[i].packgeName
					if (!filterRepetEle[elem]) {
						dealResult.push({
							packgeIndex: i + 1,
							packgeName: elem,
							proList: divideProList[i].proList
						})
						filterRepetEle[elem] = true;
					}
				}
				console.log(dealResult)
				this.orderProList = dealResult
			},
			/**
			 * 非跨境：余额和优惠券可以同时使用，礼品卡只能单独使用，优惠券不抵扣运费
			 * 跨  境： 余额 优惠券 礼品卡只能选择一个用，并且最多使用商品总金额的50%
			 */
			//余额使用切换
			switchRacc() {
				this.showReacc = !this.showReacc
			},
			//礼品卡使用切换
			switchGiftacc() {
				this.showGiftacc = !this.showGiftacc;
			},
			//弹出层显示
			popProList(e) {
				// debugger
				this.popTypeFlag = Number(e.target.dataset.type)
				this.showPopList = !this.showPopList
			},
			//弹出层隐藏
			closePop() {
				this.showPopList = !this.showPopList
				if (this.$store.state.invoice.invoiceInfo.type == 0) {
					this.invoiceName = NO_INCOICE
				}
				if (this.$store.state.invoice.invoiceInfo.type == 1) {
					this.invoiceName = PERSONAGE
				}
				if (this.$store.state.invoice.invoiceInfo.type == 2) {
					this.invoiceName = this.$store.state.invoice.invoiceInfo.invoiceName
					this.identifyNumber = this.$store.state.invoice.invoiceInfo.identifyNumber
				}
			}
		},
		watch: {
			showReacc (curVal) {
				switch (this.crossBorder) {
					case 1:
						if (curVal === true) {
							this.remainNoclick = true
							this.isdiscountUsable = true
						} else {
							this.remainNoclick = false
							this.isdiscountUsable = false
						}
						break
					case 0:
						curVal === true ? this.remainNoclick = true : this.remainNoclick = false
						break
				}
			},
			showGiftacc (curVal) {
				if (curVal === true) {
					this.giftNocilck = true
					this.isdiscountUsable = true
				} else {
					this.giftNocilck = false
					this.isdiscountUsable = false
				}
			}
		},
		components: {
			OtherHeader,
			Loading,
			ProList,
			Invoice
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	.order {
		background: #f4f4f4;
	}
	.headerTop {
		background:rgba(191,191,191,0.9);
		span {
			font-size: 1.2rem;
			color: #222;
		}
	}
	.orderItem {
		overflow: hidden;
		margin-bottom: 10px;
		border-bottom: 1px solid #e0e0e0;
		.showAddr {
			background: #fff;
		}
		.proCommon {
			.flexCenterBox;
			background: #fff;
			padding: 15px 10px;
			line-height: 18px;
			overflow: hidden;
			justify-content: space-between;
			// border-bottom: 1px solid #e0e0e0;
			.proLeft {
				.flexCenterBox;
				width: 50%;
				justify-content: flex-start;
				span{
					font-size: 1.1rem;
				}
				span:nth-child(2) {
					display: inline-block;
					padding: 1px 4px;
					background: @baseBackground;
					font-size: 12px;
					color: #fff;
					margin-left: 10px;
				}
			}
			.proRight {
				.flexCenterBox;
				justify-content: flex-end;
				span {
					font-size: 13px;
					margin-right: 5px;
				}
				img {
					width: 8.1%;
				}
				.button_switch{
			        background-color: #fff;
			        width:4rem;
			        height:2rem;
			        display: flex;
			        align-items: center;
			        justify-content: space-between;
			        padding: 0 .2rem;
			        border: 1px;
			        border-radius: 1rem;
			        position: relative;
			        transition: all .3s;
			        border: 1px solid #eee;
			        box-shadow: 0 0 0.1rem  0 rgba(0,0,0,.3);
			        &.noClickStyle {
			        	pointer-events: none;
			        	background: #eee;
			        }
			        .circel_button{
			        	width:2rem;
			        	height:2rem;
			            transition: all .3s;
			            position: absolute;
			            z-index: 1;
			            left: 0rem;
			            background-color: #e0e0e0;
			            border-radius: 50%;

			        }
			        .trans_to_right{
			            transform: translateX(2rem);
			        }
			    }
			    .change_to_text{
			        background-color: @baseBackground;
			    }
			}
		}
	}
	.addr {
		margin-top: 3rem;
		// background:#f0f0f0;
		.addrContent {
			.flexCenterBox;
			padding: 15px 10px;
			line-height: 18px;
			overflow: hidden;
			justify-content: space-between;
			.addrLeft {
				.addrUserInfo {
					.flexCenterBox;
					justify-content: flex-start;
					margin: 0 0 6px 10px;
					margin-left: 6%;
					span{
						margin-right: 10px;
						color: #4a4a4a;
						font-size: 15px;
						font-weight: 700;
					}
					span:nth-child(3) {
						width: 3rem;
						line-height: 20px;
						color: #fff;
						background-color: #947A41;
						font-size: 12px;
						text-align: center;
					}
				}
				.addrInfo {
					.flexCenterBox;
					justify-content: flex-start;
					font-size: 12px;
					img {
						width: 5%;
					}
				}
			}
			.addrRight {
				.flexCenterBox;
				justify-content: flex-end;
				width: 10%;
				img {
					width: 56%;
				}
			}
		}
		.noAddr {
			width: 100%;
			.flexCenterBox;
			padding: 1.3rem 0;
			.addressAddButton {
				.flexCenterBox;
				border: 1px solid #999;
				border-radius: 3px;
				color:#333;
				height: 1.5rem;
				padding: 1rem 1rem;
				font-size: 14px;
			}
		}
	}
	.proInfo {
		border-top: 1px solid #e0e0e0;
		.proInfoContent {
			background: #fff;
			.proNum {
				border-bottom: 1px solid #e0e0e0;
			}
			.proImg {
				// .flexCenterBox;
				// justify-content: flex-start;
				// // flex-direction: column;
				overflow: hidden;
				border-bottom: 1px solid #e0e0e0;
				padding: 5px 10px;
				.packageImglist {
					margin-left: 10px;
				}
				.proImgItemList {
					.flexCenterBox;
					display: -webkit-box;
					justify-content: flex-start;
					overflow: auto;
					.proImgItem {
						.flexCenterBox;
						flex-wrap: nowrap;
						flex-direction: column;
						width: 5rem;
						padding: 5px 10px;

						img {
							width: 100%;
						}
						span {
							color: #848689;
						}
					}
				}
			}
			.invoice {
				border-bottom: none;
			}
		}
	}
	.accountInfo {
		padding-bottom: 4.2rem;
		margin-bottom: 0;
		.discount {
			border-bottom: 1px solid #e0e0e0;
		}
	}
	footer {
		.flexCenterBox;
		justify-content: flex-end;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 500;
		background: rgba(255,255,255,.8);
		height: 3.51rem;
		width: 100%;
		border-top: 1px solid #e0e0e0;
		.fLeft {
			padding-right: 10px;
			.flexCenterBox;
			justify-content: center;
			span {
				font-size: 14px;
				color: @baseBackground;
				span {
					font-size: 18px;
				}
			}
		}
		.fRight {
			width: 30%;
			text-align: center;
			line-height: 3.51rem;
			background: @baseBackground;
			font-size: 16px;
			color: #fff;
		}
	}
</style>