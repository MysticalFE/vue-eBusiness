<template>
	<div class="address">
		<other-header class="headerTop">
				<span slot="order-text">收货地址</span>
		</other-header>
		<section class="addrInfo">
			<div class="addrInfoList" v-if="shipAddressList.length > 0"></div>
			<div class="noAddrInfo" v-else>
				<div class="noAddrInfoImg">
					<img src="../../images/norecord.png" alt="">
				</div>
				<div>暂无收货地址信息</div>
			</div>
		</section>
		<footer>
			<!-- <span>新建收货地址</span> -->
			<router-link tag="span" to="addAddr">新建收货地址</router-link>
		</footer>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	export default {
		data () {
			return {
				customerID: '',
				pageNumber: 1,
				pagesize: 10,
				shipAddressList: []
			}
		},
		created () {
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
					}
					console.log(res)
				})
			}
		},
		components: {
			OtherHeader
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
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
