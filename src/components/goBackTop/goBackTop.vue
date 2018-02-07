<template>
	<div class="goBackTop" v-if="scrollDistance > 800" @click="goBackTop">
		<img src="../../images/scroll-to-top-icon.png" alt="">
	</div>
</template>
<script>
	export default{
		data () {
			return {
				scrollDistance:'',//滚动距离
				stepDis:100//步长
			}
		},
		mounted () {
			window.addEventListener('scroll',() => {
				this.scrollDistance = document.body.scrollTop;
			})
		},
		methods:{
			goBackTop () {
				const timer = setInterval(() => {
					if (this.scrollDistance > 0) {
						document.body.scrollTop -= this.stepDis;
					} else{
						this.scrollDistance = 0;
						clearInterval(timer);
					}
				},20)
			}
		}
	}
</script>
<style lang="less" scoped>
	.goBackTop{
		width:3rem;
		height:3rem;
		position: fixed;
		right:8%;
		bottom:12%;
		z-index: 135;
		img{
			width:100%;
		}
	}
</style>