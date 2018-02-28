<template>
	<div class="addAddr">
		<other-header class="headerTop">
				<span slot="order-text" v-if="addressID == ''">新建收货地址</span>
				<span slot="order-text" v-else>修改收货地址</span>
		</other-header>
		<section class="userInfo">
			<form>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="收货人姓名" maxlength="20" autocomplete="off" v-model="name">
				</div>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="手机号码" maxlength="11" autocomplete="off" v-model="mobilePhone">
				</div>
				<div class="checkDefault">
					<input type="checkbox" name="" id="checkAddr" class="checkAddr" ref="checkbox">
					<label for="checkAddr" class="checkIcon"></label>
					<label for="checkAddr"><span>默认地址</span></label>
				</div>
				<div class="userInfoItem addrSelect" ref="addrSelect" id="addrSelect" @click="showMask">
					<div class="inputBox">{{ selectedAddrText }}</div>
					<!-- <div class="inputBox" v-if="addressID != ''">{{ selectedText }}</div> -->
				</div>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="详细地址" autocomplete="off" v-model="detailAddr">
				</div>
				<div class="userInfoItem">
					<input class="inputBox" type="text" placeholder="邮编" maxlength="6" autocomplete="off" v-model="postCode">
				</div>
				<div class="saveBtn" @click="submitAddr">
					<span>保存</span>
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
			@refresh = "refreshPvince"
			></addr-picker>
		<tip-alert
			:showTip.sync="showTip"
			:tipText="tipText"
			:showTipBtn="showTipBtn">
		</tip-alert>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import AddrPicker from '../../components/addrPicker/addrPicker'
	import tipAlert from '../../components/common/tipAlert'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				name: '',
				mobilePhone: '',
				detailAddr: '',
				postCode: '',
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
				selectedText: '',
				isShow: false,
				loading: false,
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
				addressID: ''
			}
		},
		created() {
			this.customerID = sessionStorage.getItem('customerID') || ''
		},
		mounted() {
			setTimeout(() => {
				this.init()
				this.checkBox = this.$refs.checkbox
				if (this.$store.state.addr.addressInfo.isDefault == 1) {
					this.checkBox.checked = true
				}
			},20)
		},
		computed: {
			selectedAddrText() {
				if (this.addressID != '') {
					if (this.selProInfo.provinceName !=undefined && this.selCityInfo.cityName !=undefined && this.selTownInfo.townName !=undefined) {
					this.selectedText = this.selProInfo.provinceName + ',' + this.selCityInfo.cityName + ',' + this.selTownInfo.townName
						return this.selectedText;
					} else {
						this.selectedText = '请选择您所在省,市,县/区'
					}
					this.selectedText = this.backSelectedText
				} else {
					if (this.selProInfo.provinceName !=undefined && this.selCityInfo.cityName !=undefined && this.selTownInfo.townName !=undefined) {
					this.selectedText = this.selProInfo.provinceName + ',' + this.selCityInfo.cityName + ',' + this.selTownInfo.townName
						return this.selectedText
					} else {
						this.selectedText = '请选择您所在省,市,县/区'
					}
				}
				return this.selectedText;
			}
		},
		methods: {
			init () {
				// this.nextTick(() => {
				// 	this.addrSelect = this.$refs.addrSelect
				// })
				if (this.$store.state.addr.addressInfo.addressID) {
					this.getEditAddrInfo()
				}
				this.getInfo()
			},
			getEditAddrInfo() {
				this.$http({
					method: 'post',
					url: '/api/Customers/GetshippingAddress',
					params: {
						CustomerID: this.customerID,
						shippingAddressID: this.$store.state.addr.addressInfo.addressID
					}
				}).then(res => {
					if (res.data.code == 0) {
						console.log(res)
						const resData = res.data.data
						this.addressID = resData.ContactorID
						this.name = resData.TrueName
						this.mobilePhone = resData.Mobile
						this.backSelectedText = resData.ProvinceName + ',' + resData.CityName + ',' + resData.CityZoneName
						this.detailAddr = resData.Address
						this.postCode = resData.Zip
					}
				}).catch(error => {
					console.log(error)
				})
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
			refreshPvince() {
				this.paramData = {
					areaType: 0,
					pageNumber: 1,
					pageSize: 100
				}
				this.getInfo()
			},
			async getPvince(selectedProInfo) {
				console.log(selectedProInfo)
				this.selProInfo = selectedProInfo;
				this.paramData = Object.assign({},this.paramData,{provinceID: this.selProInfo.provinceID,areaType:1})
				await this.getInfo()
			},
			async getCity(selectedCityInfo) {
				console.log(selectedCityInfo)
				this.selCityInfo = selectedCityInfo
				this.paramData = Object.assign({},this.paramData,{CityID: this.selCityInfo.cityID,areaType:2})
				console.log(this.paramData)
				await this.getInfo()
			},
			async getTown(selectedTownInfo) {
				console.log(selectedTownInfo)
				this.selTownInfo = selectedTownInfo;
				this.isShow = !this.isShow
			},
			judgeHasInputContent() {
				if (!this.name) {
					this.showTip = true
					this.tipText = '请输入姓名'
					this.tipTimerOut(1300)
					return;
				}
				if (!/^1[3|4|5|7|8]\d{9}$/.test(this.mobilePhone)) {
					this.showTip = true;
					this.tipText = "手机号不正确";
					this.tipTimerOut(1300);
					return;
				}
				if (this.selectedText  === '请选择您所在省,市,县/区') {
					this.showTip = true;
					this.tipText = "请输入地址信息";
					this.tipTimerOut(1300);
					return;
				}
				if (!this.detailAddr) {
					this.showTip = true;
					this.tipText = "请输入地址信息";
					this.tipTimerOut(1300);
					return;
				}
				if (!this.postCode) {
					this.showTip = true;
					this.tipText = "请输入邮编";
					this.tipTimerOut(1300);
					return;
				}
			},
			submitAddr() {
				this.judgeHasInputContent()
				let proID = '',cityID = '',townID = '',url = '';
				this.selProInfo.provinceID  == undefined ? proID = this.$store.state.addr.addressInfo.provinceID : proID = this.selProInfo.provinceID
				this.selCityInfo.cityID  == undefined ? cityID = this.$store.state.addr.addressInfo.cityID : cityID = this.selCityInfo.cityID
				this.selTownInfo.townID  == undefined ? townID = this.$store.state.addr.addressInfo.townID : townID = this.selTownInfo.townID

				if (this.$store.state.addr.addressInfo.addressID != undefined){
					url = '/api/Customers/' + this.customerID + '/shippingAddress/' + this.addressID
				} else {
					url = '/api/Customers/shippingAddress'
				}
				let checkedFlag = 0;
				if (this.checkBox.checked) {
					checkedFlag = 1;
				}
				this.$http({
					method: 'post',
					url: url,
					params: {
						CustomerID: this.customerID,
						TrueName: this.name,
						Mobile: this.mobilePhone,
						Address: this.detailAddr,
						ProvinceID: proID,
						CityID: cityID,
						CityZoneID: townID,
						Zip: this.postCode,
						AddressAreaID: this.addressID,
						IsDefault: checkedFlag
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						this.showTip = true;
						this.tipText = res.data.desc;
						this.tipTimerOut(1300);
						setTimeout(() => {
							this.$router.go(-1)
						},1500)
					}
				}).catch(error => {
					console.log(error)
				})
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
		watch: {
			selectedText() {
				// this.selectedText = this.selProInfo.provinceName + ',' + this.selCityInfo.cityName + ',' + this.selTownInfo.townName
			}
		},
		components: {
			OtherHeader,
			AddrPicker,
			tipAlert
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
			.checkDefault {
				height: 24px;
				line-height: 20px;
				margin-bottom: 10px;
				.flexCenterBox;
				justify-content: flex-start;
				.checkAddr {
					display: none;
				}
				.checkIcon {
					background-color: #FFF;
				    border: 1px solid #C1CACA;
				    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
				    padding: 9px;
				    border-radius: 5px;
				    display: inline-block;
				    position: relative;
				    margin-right: 15px;
				    &:active {
				    	box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px 1px 3px rgba(0,0,0,0.1);
				    }
				}
				.checkAddr:checked + .checkIcon {
				    border: 1px solid #92A1AC;
				    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05), inset 15px 10px -12px rgba(255, 255, 255, 0.1);
				    color: #243441;
				    &:after {
					    content: '\2714'; //勾选符号
					    position: absolute;
					    top: 0px;
					    left: 0px;
					    color: #848689;
					    width: 100%;
					    text-align: center;
					    font-size: 1.4em;
					    padding: 1px 0 0 0;
					    vertical-align: text-top;
					}
				}
				span{
					font-size: 20px;
					line-height: 20px;
					color: #848689;
				}
			}
			.saveBtn {
				height: 3.1rem;
			    text-align: center;
			    position: fixed;
			    bottom: 10px;
			    left: 0;
			    width: 100%;
			    padding: 0 10px;
			    z-index: 13;
			    span {
			    	width: 100%;
				    background: #947A41;
				    color: #fff;
				    display: block;
				    border-radius: 3px;
				    height: 3.1rem;
				    line-height: 3.1rem;
				    text-align: center;
				    font-size: 16px;
			    }
			}
		}
	}
</style>