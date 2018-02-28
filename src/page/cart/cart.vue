<template>
	<div id="cart">
		<other-header class="headerTop">
			<div slot='pro-text' class="proText" @click="judgeSelectedTab(0)" :class="{selectedTab:selectedTabInd == 0}"><span>爱奢汇商品</span></div>
			<div slot='detail-text' class="detailText proText" @click="judgeSelectedTab(1)" :class="{selectedTab:selectedTabInd == 1}"><span>跨境商品</span></div>
		</other-header>
		<ul v-if="customerID != '' && customerID != null">
			<li v-if=" noCrossProList.length > 0 && selectedTabInd == 0">
				<section class="proItem pr" v-for="(item,index) of noCrossProList" :key="index">
					<div class="checkBox">
						<span class="checkIcon" :class="{ check: item.checked}" @click="selectedProduct(item)" ref="checkIcon"></span>
					</div>
					<div class="proBox">
						<div class="proImg">
							<img :src=" item.ImageUrl " alt="" @error="itemImglPlaceholder($event.target)">
						</div>
						<div class="proInfo">
							<router-link :to="{ path: 'proDetail',query: {productID: item.ProductItemID} }" class="proItemLink">
								<div class="proInfoName"> {{ item.ProductName }} </div>
							</router-link>
							<div class="proSpec" v-if="item.Spec != ''"> {{ item.Spec }} </div>
							<div class="proInfoPrice">
								<span>{{ formatCurrency(item.Price) }} </span>
								<!-- <span>×{{ item.Num }} </span> -->
								<div class="changeProNum">
									<span @click="numChange(item,-1)"> - </span>
									<input type="text" maxlength="3" :max="item.StoreNum" :value="item.Num" disabled>
									<span @click="numChange(item,1)"> + </span>
								</div>
							</div>
						</div>
					</div>
					<div class="proItemBottom pa">
						<div class="showDiscountName">
							<span v-if="item.DiscountName != null">{{ item.DiscountName }}</span>
						</div>
						<div class="editProNum">
							<span class="noProStore" v-if="item.StoreNum < 1">商品已售罄</span>
							<!-- <span class="deletePro" v-if="item.Num <= 1">删除</span> -->
							<span class="deletePro" @click="deleteCartPro(item)">删除</span>
						</div>
					</div>
				</section>
			</li>
			<li v-if="crossProList.length > 0 && selectedTabInd == 1">
				<section class="proItem pr" v-for="(item,index) of crossProList" :key="index">
					<div class="checkBox">
						<span class="checkIcon" :class="{ check: item.checked}" @click="selectedProduct(item)"></span>
					</div>
					<div class="proBox">
						<div class="proImg">
							<img :src=" item.ImageUrl " alt="" @error="itemImglPlaceholder($event.target)">
						</div>
						<div class="proInfo">
							<router-link :to="{ path: 'proDetail',query: {productID: item.ProductItemID} }" class="proItemLink">
								<div class="proInfoName"> {{ item.ProductName }} </div>
							</router-link>
							<div class="proSpec" v-if="item.Spec != ''"> {{ item.Spec }} </div>
							<div class="proInfoPrice">
								<span>{{ formatCurrency(item.Price) }} </span>
								<!-- <span>×{{ item.Num }} </span> -->
								<div class="changeProNum">
									<span @click="numChange(item,-1)"> - </span>
									<input type="text" maxlength="3" :max="item.StoreNum" :value="item.Num" disabled>
									<span @click="numChange(item,1)"> + </span>
								</div>
							</div>
						</div>
					</div>
					<div class="proItemBottom pa">
							<div class="showDiscountName">
								<span v-if="item.DiscountName != null">{{ item.DiscountName }}</span>
							</div>
							<div class="editProNum">
								<span class="noProStore" v-if="item.StoreNum < 1">库存不足</span>
								<!-- <span class="deletePro" v-if="item.Num <= 1">删除</span> -->
								<span class="deletePro" @click="deleteCartPro(item)">删除</span>
							</div>
						</div>
				</section>
			</li>
		</ul>
		<section class="noLogin" v-else>
			<p>
				<span>您当前未登录,登录后可同步购物车</span>
				<router-link tag="span" class="jumpToLogin" to="/login">去登录</router-link>
			</p>
		</section>
		<tip-alert
			:showTip.sync="showTip"
			:tipText="tipText"
			:showTipBtn="showTipBtn"
			@closeTip = "closeTip"
			@confirmEvent = "confirmEvent">
		</tip-alert>
		<footer>
			<section class="cartCheckBox">
				<span class="checkIcon" :class="{checkAll :checkAllFlag}" @click="seclectedAll"></span>
				<span>全选</span>
			</section>
			<section class="cartAccount">
				<div class="totalMoney">
					<span>合计:<span>{{ formatCurrency(totalMoney) }}</span></span>
					<span>活动优惠:{{ formatCurrency(-discountMoney) }}</span>
				</div>
				<div class="cartSettlement" @click="jumpOrder">
					<!-- <router-link tag="span" :to="{path: 'order',query: {crossBorder: selectedTabInd}}">去结算({{ cartSelectedNum }})</router-link> -->
					<span>去结算({{ cartSelectedNum }})</span>
				</div>
			</section>
		</footer>
		<loading :showLoading="showLoading"></loading>
	</div>
</template>
<script>
	import otherHeader from '../../components/header/OtherHeader'
	import tipAlert from '../../components/common/tipAlert'
	import loading from '../../components/common/loading.vue'
	import { itemImglPlaceholder,filterCartItemList,uniquePro,formatCurrency } from '../../config/common'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				itemImglPlaceholder:itemImglPlaceholder,
				formatCurrency: formatCurrency,
				resData:null,
				cross: 0,// 0 => 非跨境
				selectedTabInd: 0, //
				customerID: '', //userID
				isEditor: false, //true => 代表编辑后的状态;
				// isReduction: 0, //0 =>
				crossProList:[],//跨境商品
				noCrossProList:[],//非跨境商品
				totalMoney: 0,//合计金额
				discountMoney: 0,//优惠金额
				cartSelectedNum: 0,//选中的数量
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
				checkAllFlag: false,//全选
				showLoading:false,
				inputNum:1,
				proItem:null
			}
		},
		created () {
			this.itemList = []//购物车商品列表
		},
		mounted () {
			this.init()
		},
		computed: {

		},
		methods: {
			// ...mapMutations({
			// 	setItemList: 'CART_INFO'
			// }),
			async init () {
				// this.customerID = this.$store.state.login.userID;
				//当前页面刷新后，state的数据全部为空，待解决
				this.showLoading = true;
				this.customerID = sessionStorage.getItem('customerID')
				this.getData();
				// this.isCurAllProSelected()
			},
			//切换购物车类型
			judgeSelectedTab (ind) {
				this.selectedTabInd = ind;
				this.changeTotalMoney()
			},
			getData () {
				this.$http({
					method: 'post',
					url:'/api/Shopping/ShopCartV4',
					data: {
						CustomerID: this.customerID,
						ItemList: this.itemList,
						tempID: ''
					}
					// headers: {
					// 	'X-Iluxday-Authentication':'nPJv7QpgP3tkm52gLCnaNGlDk2c4pV7IbJI8yqQuhXk='
					// }
				}).then(res => {
					console.log(res)
					const resData = res.data.data;
					if (res.data.code == 0 && resData) {
						// console.log(resData)
						this.resData = resData;
						this.noCrossProList = resData.ShopCartProduct;
						this.crossProList = resData.CrossborderProduct;
						// this.refreshCart();
						this.changeTotalMoney()
						this.addItemChecked()
						this.showLoading = false
						// console.log(this.noCrossProList)
					} else if (res.data.code == 1) {
						this.showTip = true;
						this.tipText = res.data.desc;
						this.tipTimerOut(1300)
						this.showLoading = false
					} else {
						this.itemList = [];
					}
				}).catch (error => {
					console.log(error)
				})
			},
			//页面初始化时添加属性checked;
			addItemChecked () {
				this.crossProList.forEach ((item,index) => {
					if (item.IsCheck === 1) {
						this.$set(item,"checked",true)
					} else {
						this.$set(item,"checked",false)
					}
				});
				this.noCrossProList.forEach ((item,index) => {
					if (item.IsCheck === 1) {
						this.$set(item,"checked",true)
					} else {
						this.$set(item,"checked",false)
					}
				});
			},
			//单选
			selectedProduct (item) {
				typeof item.checked === 'undefined' ? this.$set(item,"checked",true) : item.checked = !item.checked;
				this.showLoading = true;
				this.refreshCart();
				this.isCurAllProSelected();
			},
			//点击单选判断是否全选
			isCurAllProSelected () {
				let checkedInd = 0 //记录单选商品选中数量
				switch (this.selectedTabInd) {
					case 0:
						this.noCrossProList.map((item,index) => {
							if (item.checked === true) checkedInd++
						})
						checkedInd === this.noCrossProList.length ? this.checkAllFlag = true : this.checkAllFlag = false
					case 1:
						this.crossProList.forEach((item,index) => {
							if (item.checked === true) checkedInd++
						})
						checkedInd === this.crossProList.length ? this.checkAllFlag = true : this.checkAllFlag = false
				}
			},
			//点击全选
			seclectedAll () {
				const _this = this
				this.checkAllFlag = !this.checkAllFlag;
				if (this.selectedTabInd === 0) {
					this.noCrossProList.forEach((item,index) => {
						if (typeof item.checked === 'undefined') {
							this.$set(item,"checked",this.checkAllFlag)
							this.showLoading = true;
						} else {
							item.checked = _this.checkAllFlag;
							this.showLoading = true;
						}
					})
					this.refreshCart();
				} else {
					this.crossProList.forEach((item,index) => {
						if (typeof item.checked === 'undefined') {
							this.$set(item,"checked",this.checkAllFlag)
							this.showLoading = true;
						} else {
							item.checked = this.checkAllFlag;
							this.showLoading = true;
						}
					})
					this.refreshCart();
				}
				this.refreshCart();
			},
			//数量-,+
			numChange (item,sign) {
				if (typeof item.checked === 'undefined') this.$set(item,"checked",true)
					if (item.checked === false) item.checked = true
				if (sign > 0) {
					item.Num ++;
					this.showLoading = true;
					this.refreshCart()
				} else {
					item.Num --;
					this.showLoading = true;
					if (item.Num < 1) {
						item.Num = 1;
						this.showTip = true
						this.tipText = '至少选择一件商品';
						this.tipTimerOut(1300)
					}
					this.refreshCart()
				}
				this.isCurAllProSelected()
			},
			//删除订单
			deleteCartPro (item) {
				this.proItem = item;
				this.showTip = true
				this.tipText = '确定删除该商品吗';
				this.showTipBtn = true;
				// this.tipTimerOut(1300)
			},
			//确认删除商品
			confirmEvent () {
				this.$http({
					method: 'post',
					url: '/api/UIProduct/DeleteShopping',
					data: {
						ShopCartProductID: this.proItem.ShopCartProductID
					}
				})
				.then(res => {
					if (res.data.code === 0) {
						this.showTip = false;
						this.showLoading = true;
						this.getData()
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
			//刷新购物车
			async refreshCart () {
				// if (this.selectedTabInd === 0) {
				// 	this.setProObj(this.noCrossProList)
				// } else {
				// 	this.setProObj(this.crossProList)
				// }
				this.selectedTabInd === 0 ? this.setProObj(this.noCrossProList) : this.setProObj(this.crossProList)
				// if (this.itemList.length === 0) this.itemList = [];
				await this.getData();
			},
			//不同购物车的金额切换；
			changeTotalMoney () {
				if (this.resData.ShopCart) {
					if (this.selectedTabInd === 0) {
						this.totalMoney = this.resData.ShopCart.SumAmount;
						this.discountMoney = this.resData.ShopCart.ReductionAmout;
						this.cartSelectedNum = this.resData.ShopCart.ShopCartSelectCount;
					} else {
						this.totalMoney = this.resData.ShopCart.SumKJAmount;
						this.discountMoney = this.resData.ShopCart.KJReductionAmount;
						this.cartSelectedNum = this.resData.ShopCart.ShopCartSelectKJCount;
					}
				}
			},
			//设置itemList
			setProObj (list) {
				let proObj = {};
				let arr = []
				list.forEach((item,index) => {
					if (item.checked) {
						proObj = {
							Quantity: item.Num,
							ID: item.ProductItemID,
							ReductionID: item.ReductionID
						};
						arr.push(proObj);
						// console.log(this.itemList)
					}
				})
				arr.length > 0 ? this.itemList = arr : this.itemList = '[]';
				// this.itemList = uniquePro(this.itemList);
				const cloneItemList = this.itemList.slice(0)//对itemList深拷贝,避免直接对state状态值进行操作
				// console.log(cloneItemList)
				this.$store.commit('CART_INFO', cloneItemList)
			},
			//跳转order页面
			jumpOrder() {
				let allCheck = false;
				if (this.selectedTabInd == 0) {
					this.noCrossProList.forEach ((item,index) => {
						if (item.checked) {
							allCheck = true;
							return allCheck
						} else {
							return;
						}
					});
				} else {
					this.crossProList.forEach ((item,index) => {
						if (item.checked) {
							allCheck = true;
							return allCheck
						} else {
							return;
						}
					});
				}
				if (allCheck) {
					this.$router.push({path: '/order',query: {crossBorder: this.selectedTabInd}})
					sessionStorage.setItem('crossBorder',this.selectedTabInd)
				} else {
					this.showTip = true
					this.tipText = '您当前购物车内未加入任何商品';
					this.tipTimerOut(1500)
				}
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
			otherHeader,
			tipAlert,
			loading
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	.checkIcon{
		width:20px;
		height:20px;
		background: url(../../images/no-selected.svg) no-repeat;
		background-size: cover;
	}
	.check {
		width:20px;
		height:20px;
		background: url(../../images/selected.svg) no-repeat;
		background-size: cover;
	}
	.headerTop{
		background:rgba(191,191,191,0.9);
		position: fixed;
		top:0;
		left:0;
		z-index: 100;
		.proText{
			width:50%;
			display: inline-block;
			span{
				font-size: 1.2rem;
				color:#222;
			}
		}
		.selectedTab{
			border-bottom:2px solid @baseBackground;
			span{
				font-size: 1.4rem;
			}
		}
	}
	ul {
		padding-bottom:3.56rem;
		li {
			margin-top: 3rem;
			.proItem{
					display: flex;
					background:#fff;
					padding:1rem 0;
					width:100%;
					height:10rem;
					overflow: hidden;
					border-bottom:1px solid #e5e5e5;
				.checkBox{
					height:100%;
					width:3rem;
					.flexCenterBox;

				}
				.proBox{
					display: flex;
					.proImg{
						height:6.3rem;
						img{
							width:6.3rem;
							border-radius: 6.1px;
							border:1px solid #e3e5e9;
						}
					}
					.proInfo{
						display: flex;
						flex-direction:column;
						justify-content:space-between;
						height:7rem;
						padding:.5rem;
						.proInfoName{
							overflow: hidden;
						    display: -webkit-box;
						    display:box;
						    -webkit-line-clamp: 2;
						    line-clamp:2;
						    -webkit-box-orient: vertical;
						    box-orient:vertical;
						    word-break: break-all;
						}
						.proSpec{
							color:#9b9b9b;
						}
						.proInfoPrice{
							display: flex;
							span:nth-child(1){
								font-size: 1.2rem;
							}
							span:nth-child(2){
								margin-left: 1.2rem;
								color:#9b9b9b;
							}
							.changeProNum {
								display: flex;
								position: absolute;
								right:5%;
								margin-top: -5px;
								border: 1px solid #d7d7d7;
								border-radius: 3px;
								span{
									display: inline-block;
									height: 25px;
									width: 25px;
									text-align: center;
									line-height: 25px;
								}
								input {
									height: 25px;
									width: 30px;
									border-right: 1px solid #d7d7d7;
									border-left: 1px solid #d7d7d7;
									line-height: 25px;
									text-align: center;
									background: #fff;
								}
							}
						}
					}
				}
				.proItemBottom{
					bottom:5px;
					right:10px;
					width:60%;
					display: flex;
					justify-content:space-between;
					.showDiscountName span{
						display: inline-block;
						line-height: 14px;
						background:#F5A623;
						color:#fff;
						padding:1px;
					}
					.editProNum{
						// width:30%;
						.noProStore{
							color:#E50112;
							margin-right:10px;
							display: inline-block;
						}
						.deletePro{
							font-size: 12px;
							line-height: 15px;
							color: #232326;
							padding-left: 10px;
							border-left: 1px solid #e3e5e9;
						}
					}
				}
			}
		}
	}
	.noLogin {
		text-align: center;
		display: flex;
		justify-content:center;
		align-items: center;
		height:50rem;
		p {
			span {
				font-size:1.3rem;
			}
			.jumpToLogin {
				background: @baseBackground;
				padding: 3px;
				color: #fff;
				border-radius: 3px;
			}
		}
	}
	footer {
		width:100%;
		height:3.56rem;
		position:fixed;
		bottom:0;
		left:0;
		z-index: 999;
		display: flex;
		align-items:center;
		justify-content:space-between;
		background: rgba(255,255,255,.8);
    	border-top: 1px solid #e3e5e9;
		.cartCheckBox {
			width: 20%;
			height:100%;
			.flexCenterBox;
			span:nth-child(2) {
				font-size:12px;
				font-weight: bold;
				margin-left:5px;
			}
			.checkAll {
				width:20px;
				height:20px;
				background: url(../../images/selectedAll.svg) no-repeat;
				background-size: cover;
			}
		}
		.cartAccount {
			width:100%;
			height: 100%;
			.flexCenterBox;
			justify-content: flex-end;
			.totalMoney {
				height:100%;
				.flexCenterBox;
				flex-direction:column;
				align-items: flex-end;
				margin-right: 10px;
				span:nth-child(1) {
					font-size: 14px;
					span {
						color: #E50112;
						font-size:18px;
					}
				}
				span:nth-child(2) {
					color:#9B9B9B;
					font-size:12px;
				}
			}
			.cartSettlement {
				height:100%;
				.flexCenterBox;
				width:30%;
				background:@baseBackground;
				span{
					color:#fff;
					font-size:16px;
				}
			}
		}
	}
</style>