<template>
	<transition name="fade">
		<div class="imgview" @click="bigImg">
			<div class="mask"></div>
			<div class="bigImg">
				<img :src="imgSrc" alt="">
			</div>
		</div>
	</transition>
</template>
<script type="text/javascript">
	export default {
		props: {
			imgSrc: {
				type: String,
				default: ''
			}
		},
		methods: {
			bigImg () {
				this.$emit('closeBigImg')
			}
		}
	}
</script>
<style lang="less" scroped>
	.fade-enter-active,.fade-leave-active {
		transtion: all .3s linear;
		transform: translate3d(0,0,0);
	}
	.fade-enter,.fade-leave-active {
		transform: translate3d(100,0,0);
	}
	.imgview {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
		overflow: hidden;
		.mask {
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.5);
			overflow: hidden;
		}
		.bigImg {
			// width: 100%;
			img {
				max-width: 100%;
				display: block;
				position: absolute;
				left: 50%;
			    top: 50%;
			    transform: translate3d(-50%,-50%,0);
				z-index: 1000;
			}
		}
	}
</style>