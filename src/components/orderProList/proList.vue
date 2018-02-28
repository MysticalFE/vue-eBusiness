<template>
	<div class="proListWrapper">
		<order-pop :showPopList="showPopList" @closePop="closePop">
			<span slot="proListTitle">商品清单</span>
			<div slot="proList" class="proList">
				<div class="proListContent">
					<div class="proListItem" v-if="isDivide == 1" v-for="(item,i) of data">
						<p v-if="crossBorder === 0 && item.packgeIndex" class="shipAddr">包裹{{i + 1}}</p>
						<p v-if="crossBorder === 1 && item.packgeName" class="shipAddr">{{ item.packgeName }}</p>
						<ul>
							<li v-for="item of item.proList">
								<div class="itemContent">
									<div class="proImg">
										<img :src="item.ImageUrl" alt="">
									</div>
									<div class="itemRight">
										<div class="rightTop">
											<span>{{ item.ProductName }}</span>
										</div>
										<div class="itemBottom">
											<p>
												<span>{{ formatCurrency(item.Price) }}</span>
												<span>×{{ item.Num }}</span>
											</p>
											<p>
												<span>小计: <span class="ItemTotalMoney">{{ total(item) }} </span></span>
											</p>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="proListItem" v-if="isDivide == 0" v-for="(item,i) of data" style="margin-bottom: 0;border-top:0">
						<p v-if="crossBorder === 1" class="shipAddr">{{ item.Package }}</p>
						<ul>
							<li>
								<div class="itemContent">
									<div class="proImg">
										<img :src="item.ImageUrl" alt="">
									</div>
									<div class="itemRight">
										<div class="rightTop">
											<span>{{ item.ProductName }}</span>
										</div>
										<div class="itemBottom">
											<p>
												<span>{{ formatCurrency(item.Price) }}</span>
												<span>×{{ item.Num }}</span>
											</p>
											<p>
												<span>小计: <span class="ItemTotalMoney">{{ total(item) }} </span></span>
											</p>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="proListTotal">
						<span>共{{ totalNum }}件</span>
						<div class="proListTotalR">
							<span>运费 {{ formatCurrency(amount.ShippingPrice) }}</span>
							<span>金额<i>{{ formatCurrency(amount.ShoppingAmount) }}</i></span>
						</div>
					</div>
				</div>
			</div>
		</order-pop>
	</div>
</template>
<script type="text/javascript">
	import OrderPop from '../../components/orderPopModule/orderPop'
	import { formatCurrency } from '../../config/common'
	export default {
		data () {
			return {
				formatCurrency: formatCurrency
			}
		},
		props: {
			data: {
				type: Array,
				default: []
			},
			amount: {
				type: Object,
				default: null
			},
			showPopList: {
				type: Boolean,
				default: false
			},
			isDivide: {
				type: Number,
				default: 0
			},
			crossBorder: {
				type: Number,
				default: 0
			}
		},
		created() {
			console.log(this.data)
		},
		computed: {
			totalNum() {
				let num = 0
				if (this.isDivide == 1) {
					this.data.forEach((item,index) => {
						item.proList.forEach(proInfo => {
							num += proInfo.Num
						})
					})
				} else {
					this.data.forEach((item,index) => {
						num += item.Num
					})
				}
				return num
			}
		},
		methods: {
			closePop() {
				this.$emit('closePop')
			},
			total(item) {
				return formatCurrency(item.Num*item.Price)
			}
		},
		components: {
			OrderPop
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	.proListContent {
		margin-top: 3rem;
		padding-bottom: 42px;
		.proListItem {
			background: #fcfcfc;
			margin-bottom: 20px;
			border-top: 1px solid #e3e5e9;
			.shipAddr {
				padding: 10px 10px 0px 10px;
			}
			ul {
				li {
					border-bottom: 1px solid #e3e5e9;
					.itemContent {
						.flexCenterBox;
						justify-content: flex-start;
						width: 100%;
						height: 100%;
						padding: 15px 10px;
						.proImg {
							margin-right: 15px;
							width: 80px;
							height: 80px;
							border: 1px solid #e3e5e9;
							border-radius: 8px;
							img {
								width: 100%;
								border-radius: 8px;
							}
						}
						.itemRight {
							height: 80px;
							width:calc(100%-30px);
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.itemBottom {
								.flexCenterBox;
								justify-content: space-between;
								p{
									&:nth-child(1) {
										span {
											color:#9b9b9b;
											margin-right: 5px;
										}
									}
									&:nth-child(2) {
										.ItemTotalMoney {
											font-size: 16px;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		.proListTotal {
			.flexCenterBox;
			justify-content: space-between;
			padding: 10px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
			background: #fff;
			width: 100%;
			border-top: 1px solid #eee;
			.proListTotalR {
				span {
					font-size: 12px;
					&:nth-child(1) {
						color: #9b9b9b;
						margin-right: 10px;
					}
					&:nth-child(2) {
						i {
							color: #E50112;
							font-size: 16px;
						}
					}
				}
			}
		}
	}
</style>