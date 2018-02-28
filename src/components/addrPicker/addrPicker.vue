<template>
	<section class="addrPicker">
		<transition name="fade">
			<section class="popMask" v-if="isShow" @click="closePop"></section>
		</transition>
		<transition name="right-slider">
			<section class="popupContainer" v-if="isShow && provinceData.length != 0">
				<div class="headerTop">
					<span>选择省</span>
				</div>
				<ul>
					<li v-for="item of provinceData" :data-id="item.ProvinceId" :data-value="item.ProvinceName" @click="jumpCity($event)">
						<span>{{item.ProvinceName}}</span>
						<span class="arrow">
							<img src="../../images/arrowRight.svg" alt="">
						</span>
					</li>
				</ul>
			</section>
		</transition>
		<transition name="right-slider">
			<section class="popupContainer cityContainer" v-if="isShow && cityData.length != 0">
				<div class="headerTop">
					<span>选择市</span>
				</div>
				<ul>
					<li v-for="item of cityData" :data-id="item.CityId" :data-value="item.CityName" @click="jumpTown($event)">
						<span>{{item.CityName}}</span>
						<span class="arrow">
							<img src="../../images/arrowRight.svg" alt="">
						</span>
					</li>
				</ul>
			</section>
		</transition>
		<transition name="right-slider">
			<section class="popupContainer cityContainer" v-if="isShow && townData.length != 0">
				<div class="headerTop">
					<span>选择县/区</span>
				</div>
				<ul>
					<li v-for="item of townData" :data-id="item.TownId" :data-value="item.TownName" @click="townInfo($event)">
						<span>{{item.TownName}}</span>
						<span class="arrow">
							<img src="../../images/arrowRight.svg" alt="">
						</span>
					</li>
				</ul>
			</section>
		</transition>
		<loading :showLoading="loading"></loading>
	</section>
</template>
<script type="text/javascript">
	import loading from '../common/loading.vue'
	export default {
		data () {
			return {
				// showLoading: loading
				selectedProInfo: {},
				selectedCityInfo: {},
				selectedTownInfo: {}
			}
		},
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			provinceData: {
				type: Array,
				default: []
			},
			cityData: {
				type: Array,
				default: []
			},
			townData: {
				type: Array,
				default: []
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		created() {
			setTimeout(() => {
				if (this.selectedProInfo.provinceName && this.selectedCityInfo.cityName && this.selectedTownInfo.townName) {
					this.refresh()
				}
			},300)
		},
		computed: {

		},
		methods: {
			refresh() {
				this.$emit('refreshPvince')
			},
			jumpCity (el) {
				console.log(el)
				// this.showLoading = true
				this.loading = true
				this.selectedProInfo = {
					provinceName : el.target.dataset.value,
					provinceID : el.target.dataset.id
				}
				this.$emit('getPvince',this.selectedProInfo)
			},
			jumpTown(el) {
				// this.showLoading = true
				this.loading = true
				this.selectedCityInfo = {
					cityName : el.target.dataset.value,
					cityID : el.target.dataset.id
				}
				this.$emit('getCity',this.selectedCityInfo)
			},
			townInfo(el) {
				this.selectedTownInfo = {
					townName : el.target.dataset.value,
					townID : el.target.dataset.id
				}
				this.$emit('getTown',this.selectedTownInfo)
			},
			closePop() {
				this.$emit('closePop')
			},
			confirmEvent() {
				this.$emit('confirmEvent')
			},
		},
		components: {
			// OtherHeader
			loading
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	.fade-enter-active, .fade-leave-active{
		transition: all .5s ease;
	}
	.fade-enter, .fade-leave-active {
		opacity: 0;
	}
	.right-slider-enter-active, .right-slider-leave-active{
		transition: all .5s ease;
	}
	.right-slider-enter, .right-slider-leave-active {
		transform: translate3d(100%,0,0);
	}
	.right-slider-city-enter-active, .right-slider-city-leave-active{
		transition: all .5s ease;
	}
	.right-slider-city-enter, .right-slider-city-leave-active {
		transform: translate3d(100%,0,0);
	}
	.popMask {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: rgba(0,0,0,0.5);
		z-index: 500;
	}
	.popupContainer {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 85%;
		background: #fff;
		z-index: 501;
		max-height: 100%;
		overflow: auto;
		height: 100%;
		.headerTop {
			width: 85%;
			position: fixed;
			// right: 0;
			left: 15%;
			background:#eee;
			height: 3rem;
			.flexCenterBox;
			span {
				font-size: 18px;
			}
		}
		ul {
			width: 100%;
			margin-top: 3rem;
			li {
				.flexCenterBox;
				justify-content: space-between;
				flex-wrap: nowrap;
				border-bottom: 1px solid #eee;
				padding: 0 10px;
				span:nth-child(1) {
					font-size: 16px;
					line-height: 3.5rem;
				}
				.arrow {
					width: 6%;
					text-align: right;
					img {
						width: 100%;
					}
				}
			}
		}
	}

</style>