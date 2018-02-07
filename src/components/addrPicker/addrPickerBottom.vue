<template>
	<section class="addrPicker">
		<transition name="fade">
			<section class="popMask" v-if="isShow" @click="closePop"></section>
		</transition>
		<transition name="bottom-slider">
			<section class="popupContainer" v-if="isShow">
				<div class="popupHeader">
					<span class="popupHeaderItem" @click="closePop">取消</span>
					<span class="popupHeaderItem" @click="confirmEvent">完成</span>
				</div>
				<div class="popupBox">
					<section class="popupBoxItem">
						<div class="popupPicker">
							<div class="scrollComponent">
								<div class="scrollMask" ref="scrollMask"></div>
								<div class="scrollIndicator"></div>
								<div class="scrollContent" ref="scrollContent" style="transform: translate3d(0px, 102px, 0px);">
									<div class="scrollItem" v-for="item of provinceData" :data-id="item.ProvinceId" ref="scrollItem">{{ item.ProvinceName }}</div>
								</div>
							</div>
						</div>
					</section>
					<section class="popupBoxItem">
						<div class="popupPicker">
							<div class="scrollComponent">
								<div class="scrollMask"></div>
								<div class="scrollIndicator"></div>
								<div class="scrollContent" ref="scrollContent" style="transform: translate3d(0px, 102px, 0px);">
									<div class="scrollItem" v-for="item of cityData" :data-id="item.CityId" ref="scrollItem">{ item.CityName }</div>
								</div>
							</div>
						</div>
					</section>
					<section class="popupBoxItem">
						<div class="popupPicker">
							<div class="scrollComponent">
								<div class="scrollMask"></div>
								<div class="scrollIndicator"></div>
								<div class="scrollContent" ref="scrollContent" style="transform: translate3d(0px, 102px, 0px);">
									<div class="scrollItem" v-for="item of townData" :data-id="item.TownId" ref="scrollItem">item.TownName</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
		</transition>
	</section>
</template>
<script type="text/javascript">
	export default {
		data () {
			return {

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
		},
		mounted() {
			// window.addEventListener('scroll',() => {
			// },false)
				this.initScroll()
		},
		computed: {

		},
		methods: {
			initScroll() {
				this.scrollContentDom = this.$refs.scrollContent
				this.scrollItemList = this.$refs.scrollItem;
				let itemOffsetHeight = 0;
				this.scrollItemList.forEach((item,index) => {
					itemOffsetHeight = item.offsetTop;
				})

				let translateHeight = '102' + itemOffsetHeight + 'px'
				console.log(this.scrollItemList)
				this.scrollContentDom.addEventListener('touchmove',() => {
					this.scrollContentDom.style.transform = 'translate3d(0px,translateHeight,0px)'
				})
			},
			closePop() {
				this.$emit('closePop')
			},
			confirmEvent() {
				this.$emit('confirmEvent')
			}
		},
		match() {
			if (translateHeight) {
				consoel.log(1)
			}
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
	.bottom-slider-enter-active, .bottom-slider-leave-active{
		transition: all .5s ease;
	}
	.bottom-slider-enter, .bottom-slider-leave-active {
		transform: translate3d(0,100%,0);
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
		left: 0;
		bottom: 0;
		width: 100%;
		background: #eee;
		z-index: 501;
		max-height: 100%;
		overflow: auto;
		height: auto;
		.popupHeader {
			width: 100%;
			height: 44px;
			.flexCenterBox;
			justify-content: space-between;
			font-size: 16px;
			background: #fbf9fe;
			border-bottom: solid 1px #fbf9fe;
			padding: 0 5px;
			.popupHeaderItem {
				padding:5px;
				height: 100%;
				line-height: 34px;
			}
		}
		.popupBox {
			.flexCenterBox;
			width: 100%;
			flex-direction: row;
			.popupBoxItem {
				flex: 1;
				min-width: 20px;
				.scrollComponent {
					display: block;
					position: relative;
					height: 238px;
					overflow: hidden;
					width: 100%;
					.scrollMask {
						position: absolute;
					    left: 0;
					    top: 0;
					    height: 100%;
					    margin: 0 auto;
					    width: 100%;
					    z-index: 3;
					    transform: translateZ(0px);
					    background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.95), rgba(255,255,255,0.6)), -webkit-linear-gradient(bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
					    background-image: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.6)), linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
					    background-position: top, bottom;
					    background-size: 100% 102px;
					    background-repeat: no-repeat;
					}
					.scrollIndicator {
						width: 100%;
					    height: 34px;
					    position: absolute;
					    left: 0;
					    top: 102px;
					    z-index: 3;
					    background-image: -webkit-linear-gradient(top, #d0d0d0, #d0d0d0, transparent, transparent), -webkit-linear-gradient(bottom, #d0d0d0, #d0d0d0, transparent, transparent);
					    background-image: linear-gradient(to bottom, #d0d0d0, #d0d0d0, transparent, transparent), linear-gradient(to top, #d0d0d0, #d0d0d0, transparent, transparent);
					    background-position: top, bottom;
					    background-size: 100% 1px;
					    background-repeat: no-repeat;
					}
					.scrollContent {
						position: absolute;
					    left: 0;
					    top: 0;
					    width: 100%;
					    z-index: 1;
					    overflow: auto;
					    .scrollItem {
					    	line-clamp: 1;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    text-align: center;
						    font-size: 16px;
						    height: 34px;
						    line-height: 34px;
						    color: #000;
					    }
					}
				}
			}
		}
	}

</style>