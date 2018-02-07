<template>
	<header>
			<div class="spriteIcon goBack" @click="backPrepage"></div>
			<div class="headerText">
				<slot name="login-text"></slot>
				<slot name="pro-text"></slot>
				<slot name="detail-text"></slot>
				<slot name="eval-text"></slot>
				<slot name="order-text"></slot>
			</div>
			<div></div>
	</header>
</template>
<script>
	export default {
		data () {
			return {

			}
		},
		methods:{
			backPrepage () {
				this.$router.go(-1);
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	header{
		width:100%;
		height:3rem;
		position:fixed;
		top:0;
		display: flex;
		align-items:center;
		justify-content:space-around;
		background:#efefef;
		border-bottom:1px solid #bfbfbf;
		.goBack{
			width:20px;
			height:20px;
			background-position: -22px 0;
		}
		.headerText{
			width:72%;
			display: flex;
			line-height: 2.8rem;
			justify-content:space-around;
			text-align: center;
		}
	}
</style>
