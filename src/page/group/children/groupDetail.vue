<template>
	<transition name="slide">
	  	<div class="detail">
		  	<other-header class="headerTop">
		  		<span slot="order-text">订单确认</span>
		  	</other-header>
	  		<swiper class="swiper-container" :options=" swiperOption ">
		  		<swiper-slide v-for= "bannerImg of bannerImgList" :key= "bannerImg.id">
		  			<img :src=" bannerImg.LargePic " alt="" @error="carouselPlaceholder($event.target)">
		  		</swiper-slide>
	  			<div class="swiper-pagination" slot="pagination" v-show="bannerImgList.length > 1"></div>
	  		</swiper>
	  		<div class="groupInfo">
	  			<div class="proNumber">
	  				<span>商品编号 ：{{ curGroupInfo.SKU }}</span>
	  			</div>
				<p class="title">{{ curGroupInfo.Title }}</p>
				<p class="desc">{{ curGroupInfo.Description }}</p>
				<p class="price">
					<span>￥{{ curGroupInfo.LeaderPrice }}</span>
					<span>{{ curGroupInfo.MemberLimit }}人团</span>
					<span>/{{ curGroupInfo.LimitNum }}{{ curGroupInfo.MainUnit}}</span>
					<span>￥{{ curGroupInfo.Price }}</span>
				</p>
				<p class="infoLabel">
					<span>{{ curGroupInfo.CountryName }}品牌</span>
					<span>正品保障</span>
					<span>拼团包邮</span>
				</p>
	  		</div>
	  		<div class="recommendGroupList" v-show="isShowRecroup">
	  			<h4>以下小伙伴要成团了，快帮TA一把！</h4>
	  			<section class="recommendGroup" v-for="item of recommendGroupList">
	  				<div class="headPic">
	  					<img v-lazy="item.HeadPic" alt="">
	  				</div>
	  				<div class="groupDetail">
	  					<h5>{{ item.NickName }}</h5>
	  					<div class="groupTime">
	  						<p>还差{{ item.PeopleNum }}人成团</p>
	  						<p>剩余{{ groupTimeDown }}结束</p>
	  					</div>
	  				</div>
	  				<div class="joinGroup">
	  					<span>去参团</span>
	  				</div>
	  			</section>
	  		</div>
	  		<footer>
	  			<div class="aloneBuy" @click="joinCart">
	  				<span>{{ formatCurrency(curGroupInfo.Price) }}</span>
	  				<span>单独购买</span>
	  			</div>
	  			<div class="openGroup" @click="openGroup" v-if="isHasStore">
	  				<span v-if="isLeader">团长价{{ formatCurrency(curGroupInfo.LeaderPrice) }}</span>
	  				<span v-else>{{ formatCurrency(curGroupInfo.MemberPrice) }}</span>
	  				<span>三人团</span>
	  			</div>
	  			<div class="openGroup" v-else>
	  				<span>已售罄</span>
	  			</div>
	  		</footer>
			<loading :showLoading="showLoading"></loading>
			<tip-alert
				:showTip.sync="showTip"
				:tipText="tipText"
				:showTipBtn="showTipBtn">
			</tip-alert>
	  	</div>
	</transition>
</template>
<script type="text/javascript">
	import OtherHeader from '../../../components/header/OtherHeader'
	import Loading from '../../../components/common/loading.vue'
	import tipAlert from '../../../components/common/tipAlert'
	import { carouselPlaceholder,formatCurrency} from '../../../config/common'
	import { isCheckGroupOrder,groupDetail,judgeGroupLeader,joinCart } from '../../../config/api/getData'
	const HOUR_TO_SEC = 3600
	const SEC_TO_MILLISEC = 1000
	export default {
		data() {
			return {
				carouselPlaceholder:carouselPlaceholder,
				formatCurrency: formatCurrency,
				bannerImgList: [],
				recommendGroupList: [],
				curGroupInfo: {},
				showLoading: true,
				hours: '',
				minutes: '',
				seconds: '',
				isLeader: false,
				isShowRecroup: false,
				isHasStore: true,
				groupTimeDown: '',
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
				swiperOption: {
		          	autoplay : 2000,
					autoplayDisableOnInteraction:false,
					pagination: '.swiper-pagination',
					paginationClickable :true,
					effect : 'fade',
					fade: {
					  crossFade: false
					}
		        }
			}
		},
		created() {
			// this.isCheckGroupOrder = false
			this.init()
		},
		computed: {

		},
		methods: {
			init() {
				this.groupId = this.$route.params.id
				this.customerId = sessionStorage.getItem('customerID') || ''
				this.judgeGroupLeader()
				this.getData()
			},
			async getData() {
				const res = await groupDetail({GroupShoppingID: this.groupId})
				console.log(res)
				if (res.data.code === 0) {
					this.bannerImgList = res.data.data.ImgList
					this.recommendGroupList = res.data.data.groupList
					this.curGroupInfo = res.data.data.groupshopping
					this.showLoading = false
					this.getRemainTime()
				}
			},
			//判断是否为团长
			async judgeGroupLeader() {
				const params = {
					CustomerID: this.customerId,
					GroupShoppingID: this.groupId
				}
				const res = await judgeGroupLeader(params)
				res.data.code === 0 ? this.isLeader = true : this.isLeader = false
			},
			//参团倒计时
			getRemainTime() {
				this.recommendGroupList.forEach((item,index) => {
					const beginTime = item.LogDate.replace(/\-/g,'/') //开始时间
					const nowTime = item.NowDate.replace(/\-/g,'/') //当前时间
					const timeLimit = item.TimeLimit * HOUR_TO_SEC //时间期限
					const expendTime = (new Date(nowTime).getTime() - new Date(beginTime).getTime()) / SEC_TO_MILLISEC //已耗费的时间
					let remainTime = timeLimit - expendTime //剩余时间
					let hours = this.hours, minutes = this.minutes, seconds = this.seconds
					const timer = setInterval( () => {
						if (remainTime > 0) {
							this.isShowRecroup = true
							hours = Math.floor(remainTime/HOUR_TO_SEC);
							minutes = Math.floor((remainTime/60)%60);
							seconds = Math.floor(remainTime%60);
							this.hours = hours > 9 ? hours : '0' + hours;
							this.minutes = minutes > 9 ? minutes : '0' + minutes;
							this.seconds = seconds > 9 ? seconds : '0' + seconds;
							this.groupTimeDown = `${this.hours}:${this.minutes}:${this.seconds}`
						} else {
							this.isShowRecroup = false
							clearInterval(timer);
						}
						remainTime--;
					},SEC_TO_MILLISEC)
				})
			},
			//加入购物车
			async joinCart() {
				if (this.isLogin()) {
					const itemListObj = {
						'Quantity': this.curGroupInfo.LimitNum,
						'ID': this.curGroupInfo.ProductItemID
					}
					const params = {
						CustomerID: this.customerId,
						ItemList: [itemListObj]
					}
					const res = await joinCart(params)
					if (res.data.code === 0) {
						this.showTip = true
						this.tipText = '已成功加入购物车'
						this.tipTimerOut(1000)
					}
				}
			},
			//开团
			async openGroup() {
				if (this.isLogin()) {
					if ((this.curGroupInfo.Inventory != 0 && this.curGroupInfo.GroupInventory < 1 ) || (this.curGroupInfo.Inventory == 0 && this.curGroupInfo.StoreNum < this.curGroupInfo.LimitNum)) {
						this.isHasStore = false
						this.showTip = true
						this.tipText = '该商品已售罄'
						this.tipTimerOut(1300)
						return
					} else {
						if (await this.checkGroupOrder()) {
							await this.$router.push('/groupOrder')
						}
					}
				}
			},
			//参团条件判断
			async checkGroupOrder(groupCodeID) {
				groupCodeID === undefined ? this.groupCodeID = 0 : this.groupCodeID = groupCodeID
				let isCheckOrder = false
				const params = {
					CustomerID: this.customerId,
					GroupShoppingID: this.curGroupInfo.GroupShoppingID,
					GroupCodeID: this.groupCodeID
				}
				const res = await isCheckGroupOrder(params)
				res.data.code === 0 ? isCheckOrder = true : isCheckOrder = false
				// console.log(isCheckOrder)
				return isCheckOrder
			},
			//判断是否登录
			isLogin() {
				if (this.customerId) {
					return true
				} else {
					this.$router.push('/login')
				}
			},
			//弹窗倒计时
			tipTimerOut (timer) {
				if (this.showTip === true) {
					this.timer = setTimeout( () => {
						this.showTip = false;
					},timer)
				}
			},
		},
		components: {
			OtherHeader,
			Loading,
			tipAlert
		}
	}
</script>
<style lang="less" scoped>
	@import '../../../style/mixin.less';
	.slide-enter-active, .slide-leave-active {
	  transition: all 0.3s;
	}
	.slide-enter, .slide-leave-to {
	  transform: translate3d(100%, 0, 0);
	}
	.detail {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		overflow: auto;
		margin-top: 3rem;
		padding-bottom: 3.5rem;
		background: #f4f4f4;
		.headerTop {
			background:rgba(191,191,191,0.9);
			z-index: 200;
			span {
				font-size: 1.2rem;
				color: #222;
			}
		}
		.swiper-container {
			height: 375px;
			border-bottom: 1px solid #e5e5e5;
			background: #fff;
			img {
				width: 100%;
			}
		}
		.groupInfo {
			background: #fff;
			padding: 15px 10px;
			border-bottom: 1px solid #e5e5e5;
			.proNumber {
				display: flex;
				justify-content: flex-end;
				height: 25px;
				span {
					color:#9b9b9b;
					font-size: 12px;
				}
			}
			.title {
				font-size: 16px;
				.oneLineEllipsis;
			}
			.desc {
				font-size: 12px;
				color:#9b9b9b;
				.twoLinesEllipsis(4);
				margin: 3px 0;
			}
			.price {
				border-bottom: 1px solid #e5e5e5;
				padding-bottom: 5px;
				span {
					margin-right: 5px;
					&:nth-child(1) {
						font-size: 20px;
						color: #f15353;
					}
					&:nth-child(3) {
						color:#9b9b9b;
					}
					&:nth-child(4) {
						color:#9b9b9b;
						text-decoration: line-through;
					}
				}
			}
			.infoLabel{
				margin-top: 8px;
				span{
					background: url(../../../images/icon_check.png) left center no-repeat;
					background-size: 1rem;
					padding-left:1rem;
					margin-right:0.5rem;
				}
			}
		}
		.recommendGroupList {
			// width: 95%;
			background: #fff;
			border-top: 1px solid #e5e5e5;
			border-bottom: 1px solid #e5e5e5;
			padding: 10px ;
			margin: 10px 0;
			h4 {
				text-align: center;
				margin-bottom: 10px;
			}
			.recommendGroup {
				position: relative;
				.flexCenterBox;
				justify-content: space-between;
				margin-bottom: 10px;
				.headPic {
					width: 50px;
					height: 50px;
					border-radius:100%;
					border: 2px solid #957A42;
					overflow: hidden;
					img {
						width: 100%;
					}
				}
				.groupDetail{
					position: absolute;
					left: 25px;
					.flexCenterBox;
					justify-content: space-between;
					padding-left: 35px;
					height: 50px;
					width: 70%;
					border-top: 2px solid #957A42;
					border-bottom: 2px solid #957A42;
					h5 {
						.oneLineEllipsis;
						width: 60px;
					}
					.groupTime {
						text-align: right;
						margin-right: 15px;
						p {
							font-size: 12px;
							&:nth-child(1) {
								color:red
							}
						}
					}
				}
				.joinGroup {
					background: #957a42;
					height: 50px;
					width: 24%;
					line-height: 50px;
					// text-align: center;
					text-indent: 10px;
					border-top-right-radius: 25px;
					border-bottom-right-radius: 25px;
					span {
						font-size: 16px;
						color:#fff;
					}
				}
			}
		}
		footer {
			position: fixed;
			left: 0;
			bottom: 0;
			height: 3.5rem;
			.flexCenterBox;
			justify-content: space-between;
			width: 100%;
			.aloneBuy {
				width: 50%;
				height: 100%;
				background: #fff;
				flex-direction: column;
				.flexCenterBox;
				span {
					color: #92722B;
				}
			}
			.openGroup {
				width: 50%;
				height: 100%;
				background: #957A42;
				flex-direction: column;
				.flexCenterBox;
				span {
					color: #fff
				}
			}
		}
	}
</style>