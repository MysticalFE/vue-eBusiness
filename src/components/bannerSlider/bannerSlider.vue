<template>
	<swiper class="swiper-container" :options=" swiperOption ">
		<swiper-slide v-for= "bannerImg in bannerImgList" :key= "bannerImg.id">
			<router-link :to=" {path: 'promDisProList?' + bannerImg.Url} " v-if="bannerImg.Url != null && bannerImg.Url.indexOf('BannerInfoID') >= 0">
				<img :src=" bannerImg.ImageURL " alt="">
			</router-link>
			<a :src=" '' " v-else-if="bannerImg.Url != null && (bannerImg.Url.indexOf('http://') >= 0 || bannerImg.Url.indexOf('https://') >= 0)">
				<img :src=" bannerImg.ImageURL " alt="">
			</a>
			<router-link :to=" {path: 'search.html?keyword=' + bannerImg.Url } " v-else>
				<img :src=" bannerImg.ImageURL " alt="">
			</router-link>
		</swiper-slide>
		<div class="swiper-pagination" slot="pagination"></div>
	</swiper>
</template>
<script>
	export default {
		data () {
			return {
				homePageData : {},
				bannerImgList : [],
				swiperOption: {
		          	autoplay : 3000,
					autoplayDisableOnInteraction:false,
					pagination: '.swiper-pagination',
					paginationClickable :true,
					effect : 'fade',
					fade: {
					  crossFade: false
					}
		        }
			}
		},
		mounted () {
			this.getPageData()
		},
		methods : {
			getPageData () {
				this.$http({
					method: 'get',
					url: '/api/RestHome/HomeActivity'
				})
				.then( res => {
					this.homePageData = res.data.data;
					this.bannerImgList = this.homePageData.BannerList;
					console.log(this.homePageData)
				})
				.catch(error => {
					console.error(error)
				})
			}
		}
	}
</script>

<style lang="less">
	@import '../../style/common.less';
	.swiper-container {
		width: 100%;
		height: 18.5rem;
		margin-top:2.75rem;
	}
</style>