<template>
	<footer>
		<section class="footer-tabs">
			<router-link to="/home" class="footer-tab">
				<img src="../../images/home-footer/toolbar_icon_home_nor.png" alt="">
				<!-- <img src="../../images/home-footer/toolbar_icon_home_sel.png" alt=""> -->
				<span>首页</span>
			</router-link>
			<router-link to="/classify" class="footer-tab">
				<img src="../../images/home-footer/toolbar_icon_classify_nor.png" alt="">
				<!-- <img src="../../images/home-footer/toolbar_icon_classify_sel.png" alt=""> -->
				<span>分类</span>
			</router-link>
			<router-link to="/cart" class="footer-tab">
				<img src="../../images/home-footer/toolbar_icon_shopcart_nor.png" alt="">
				<!-- <img src="../../images/home-footer/toolbar_icon_shopcart_sel.png" alt=""> -->
				<span>购物车</span>
			</router-link>
			<router-link to="/myCenter" class="footer-tab">
				<img src="../../images/home-footer/toolbar_icon_mine_nor.png" alt="">
				<!-- <img src="../../images/home-footer/toolbar_icon_mine_sel.png" alt=""> -->
				<span>我的</span>
			</router-link>
		</section>
	</footer>
</template>
<script>
	export default {
		data () {
			return {

			}
		},
		methods:{

		}
	}
</script>
<style lang="less" scoped>
	footer{
		width:100%;
		height:3.5rem;
		position: fixed;
		bottom:0;
		left:0;
		z-index: 999;
		background: #fff;
		box-shadow: 0 0 10px 0px rgba(155,143,143,0.6);
		.footer-tabs{
			display: flex;
			width:100%;
			justify-content:space-around;
			align-items:center;
			padding: 0.4rem 0;
			.footer-tab{
				width:25%;
				img{
					display: block;
					width:1.7rem;
					height:1.7rem;
					margin:0 auto;
				}
				span{
					display: block;
					text-align: center;
					margin:0 auto;
				}
			}
		}
	}
</style>