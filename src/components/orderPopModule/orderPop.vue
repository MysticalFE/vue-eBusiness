<template>
	<div class="PopWrapper">
		<transition name="fade">
			<section class="popMask" v-if="showPopList"></section>
		</transition>
		<transition name="bottom-top-slider">
			<div class="popDataList" v-if="showPopList">
				<header>
					<slot name="proListTitle"></slot>
					<slot name="invoiceTitle"></slot>
					<div class="downArrow" @click="closePop">
						<img src="../../images/downArrow.svg" alt="">
					</div>
				</header>
				<slot name="proList"></slot>
				<slot name="invoiceList"></slot>
				<slot name="footer"></slot>
			</div>
		</transition>
	</div>
</template>
<script type="text/javascript">
	export default {
		props: {
			showPopList: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			closePop() {
				this.$emit('closePop')
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
	.bottom-top-slider-enter-active, .bottom-top-slider-leave-active{
		transition: all .5s ease;
	}
	.bottom-top-slider-enter, .bottom-top-slider-leave-active {
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
	.popDataList {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 502;
		height: 100%;
		overflow: auto;
		background: #f4f4f4;
		header {
			.flexCenterBox;
			position: fixed;
			top: 0;
			left: 0;
			height: 3rem;
			width: 100%;
			background: #fcfcfc;
			border-bottom: 1px solid #e5e5e5;
			font-size: 18px;
			.downArrow {
				width: 10%;
				height: 100%;
				img {
					display: block;
					width: 100%;
				}
			}
		}
	}

</style>