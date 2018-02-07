<template>
	<div class="addAddr">
		<other-header class="headerTop">
				<span slot="order-text">新建收货地址</span>
		</other-header>
		<section class="userInfo">
			<form>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="收货人地址" maxlength="20" autocomplete="off">
				</div>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="手机号码" maxlength="20" autocomplete="off">
				</div>
				<div class="userInfoItem addrSelect" ref="addrSelect" id="addrSelect" @click="showMask">
					<div class="inputBox">请选择您所在省,市,县/区</div>
				</div>
			</form>
		</section>
		<addr-picker
			:isShow="isShow"
			:provinceData="provinceData"
			:cityData="cityData"
			:townData="townData"
			:loading="loading"
			@closePop="closePop"
			@confirmEvent="confirmEvent"
			@getPvince = "getPvince"
			@getCity = "getCity"
			@getTown = "getTown"
			></addr-picker>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import AddrPicker from '../../components/addrPicker/addrPicker'
	// import AddrPicker from 'better-picker'
	export default {
		data () {
			return {
				provinceData: [],
				cityData: [],
				townData: [],
				paramData: {
					areaType: 0,
					pageNumber: 1,
					pageSize: 100
				},
				selProInfo: {},
				selCityInfo: {},
				selTownInfo: {},
				isShow: false,
				loading: false
			}
		},
		created() {

		},
		mounted() {
			this.init()
		},
		methods: {
			init () {
				// this.nextTick(() => {
				// 	this.addrSelect = this.$refs.addrSelect
				// })
				this.getInfo()
			},
			getInfo () {
				this.$http({
					method: 'post',
					url: '/api/System/AddressArea',
					params: this.paramData
				}).then(res => {
					console.log(res)
					if (res.data.code === 0) {
						this.provinceData = res.data.data.ProvinceInfo;
						this.cityData = res.data.data.CityInfo;
						this.townData = res.data.data.TownInfo;
						this.loading = false
						console.log(this.townData)
					}
				}).catch(error => {
					console.log(error)
				})
			},
			getCityInfo () {

			},
			showMask() {
				this.isShow = !this.isShow
			},
			closePop() {
				this.isShow = !this.isShow
			},
			confirmEvent() {

			},
			async getPvince(selectedProInfo) {
				this.selProInfo = selectedProInfo;
				this.paramData = Object.assign({},this.paramData,{provinceID: this.selProInfo.provinceID,areaType:1})
				await this.getInfo()
			},
			async getCity(selectedCityInfo) {
				this.selCityInfo = selectedCityInfo
				this.paramData = Object.assign({},this.paramData,{CityID: this.selCityInfo.cityID,areaType:2})
				console.log(this.paramData)
				await this.getInfo()
			},
			async getTown(selectedTownInfo) {
				this.selTownInfo = selectedTownInfo;
				this.isShow = !this.isShow
			},
		},
		components: {
			OtherHeader,
			AddrPicker
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
	.userInfo {
		width: 100%;
		margin-top: 3rem;
		padding-bottom: 2rem;
		background: #f4f4f4;
		form {
			padding: 20px 15px;
			.userInfoItem {
				margin-bottom: 10px;
				width: 100%;
				.inputBox {
					width:100%;
					height: 3.1rem;
					line-height: 3.1rem;
					border: 1px solid #d7d7d7;
					border-radius: 3px;
					background:#fff;
					font-size: 16px;
					color:#252525;
					padding: 0 15px;
				}
			}
		}
	}
</style>