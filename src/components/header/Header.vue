<template>
	<header>
		<div class="search-box">
			<span class="search-icon spriteIcon"></span>
			<form>
				<input type="text" name="" autocomplete="off" @focus="jumpSearchPage">
			</form>
		</div>
		<div class="search-login">
			<span class="login-icon" @click="jumpLoginPage"> 登录 </span>
		</div>
	</header>
</template>
<script>
	export default {
		data () {
			return {

			}
		},
		methods: {
			jumpSearchPage () {
				this.$router.push('search')
			},
			jumpLoginPage () {
				this.$router.push('login')
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	@headerBcolor:rgba(34,34,34,0.80);
	header{
		display: flex;
		width:100%;
		height: 2.75rem;
		position:fixed;
		top: 0;
		left: 0;
		background: @headerBcolor;
		flex-wrap:nowrap;
		align-items:center;
		justify-content:space-around;
		z-index: 99;
		.search-box {
			width:80%;
			display: flex;
			align-items:center;
			justify-content:center;
			background:#fff;
			border-radius: 1rem;
			margin-left: 1.3rem;
			.search-icon {
				display: inline-block;
				background-position:-60px -109px;
				width:20px;
				height:20px;
				margin: 0 0.5rem;
				margin-left: -1.5rem;
			}
			form{
				display: inline-block;
				width:80%;
				height:2rem;
				input{
					width:100%;
					height:2rem;
				}
			}
		}
		.search-login{
			width:40px;
			height:40px;
			display: flex;
			align-items:center;
			justify-content:center;
			.login-icon{
				display: block;
				font-size: 1rem;
				color:#fff;
			    margin-right:8px;
			}
		}
	}
</style>