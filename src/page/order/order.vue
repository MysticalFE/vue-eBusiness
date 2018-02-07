<template>
	<div id="order">
		<other-header class="headerTop">
				<span slot="order-text">订单确认</span>
		</other-header>
		<!-- <addr></addr> -->
		<section class="addr">
			<section class="showAddr" v-if="address.lengh > 0">

			</section>
			<section class="noAddr" v-else>
				<!-- <div class="addressAddButton">新建收货地址</div> -->
				<router-link tag="div" class="addressAddButton" to="/address">新建收货地址</router-link>
			</section>
		</section>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				customerID: null,
				crossBorder: 0,
				shipAddressID: '',
				address: [],
			}
		},
		created () {
			this.init();
		},
		mounted () {

		},
		methods: {
			init () {
				this.crossBorder = this.$route.params.crossBorder;
				this.customerID = sessionStorage.getItem('customerID') || '';
				this.getOrderdata()
			},
			getOrderdata () {
				this.$http({
					method: 'post',
					url: '/api/Shopping/CheckOutOrderV4',
					data: {
						CustomerID: this.customerID,
						ItemList: this.$store.state.cart.itemList,
						CrossBorder: this.crossBorder,
						ShipAddressID: this.shipAddressID
					}
				})
				.then (res => {
					console.log(res)
					if (res.data.code === 0) {
						const resData = res.data.data;
						this.address = resData.Address;
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
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
	.addr {
		margin-top: 3rem;
		background:#f0f0f0;
		.noAddr {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1.3rem 0;
			.addressAddButton {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #999;
				border-radius: 3px;
				color:#333;
				height: 1.5rem;
				padding: 1rem 1rem;
				font-size: 14px;
			}
		}
	}
</style>