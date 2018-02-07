<template transtion="fade">
	<div id="home">
		<!-- 头部搜索 -->
		<searchHeader>

		</searchHeader>
		<!-- 顶部banner -->
		<div class="contentWrap">
			<swiper class="swiper-container" :options=" swiperOption ">
				<swiper-slide v-for= "bannerImg of bannerImgList" :key= "bannerImg.id">
					<router-link :to=" {path: '/promDisProList?' + bannerImg.URL} " v-if="bannerImg.URL != null && bannerImg.URL.indexOf('BannerInfoID') >= 0">
						<img :src=" bannerImg.ImageURL " alt="" @error="carouselPlaceholder($event.target)">
					</router-link>
					<a :href=" bannerImg.URL " v-else-if="bannerImg.URL != null && (bannerImg.URL.indexOf('http://') >= 0 || bannerImg.URL.indexOf('https://') >= 0)">
						<img :src=" bannerImg.ImageURL " alt="" @error="carouselPlaceholder($event.target)">
					</a>
					<router-link :to=" {path: '/search.html?keyword=' + bannerImg.URL } " v-else>
						<img :src=" bannerImg.ImageURL " alt="" @error="carouselPlaceholder($event.target)">
					</router-link>
				</swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
			<!-- 中间四个入口 -->
			<section class="entry-nav">
				<router-link to="/group" class="entry-nav-link">
					<img src="../../images/home_icon_group.png" alt="">
					<span>爱拼团</span>
				</router-link>
				<router-link to="/globleGoods" class="entry-nav-link">
					<img src="../../images/home_icon_glob.png" alt="">
					<span>全球好货</span>
				</router-link>
				<router-link to="/crossBorderKnow" class="entry-nav-link">
					<img src="../../images/home_icon_know.png" alt="">
					<span>跨境须知</span>
				</router-link>
				<router-link to="/inviteRrturnMoney" class="entry-nav-link">
					<img src="../../images/home_icon_fanxian.png" alt="">
					<span>邀请返现</span>
				</router-link>
			</section>
			<!-- 广告/活动banner -->
			<section class="ADBanner" v-if=" ADbanner != null ">
				<a :href=" ADbanner.URL ">
					<img :src=" ADbanner.ImageURL " alt="">
				</a>
			</section>
			<!-- 每日必抢 -->
			<section class="dailyBuy" v-if=" diffTimer > 0 ">
				<div class="dailyBuy-title">
					<div class="dailyBuy-title-img">
						<img src="../../images/daily-title.png" alt="">
					</div>
					<div class="dailyBuy-title-timer">
						<span class="timer"> {{ hours }} </span> :
						<span class="timer"> {{ minutes }} </span> :
						<span class="timer"> {{ seconds }} </span>
						<span> 后结束 </span>
					</div>
				</div>
				<div class="dailyBuy-content">
					<ul class="homeActivityShoppingList">
						<li v-for=" item of PromDiscountList ">
							<router-link :to="{path:'proDetail',query:{ productID: item.ProductID}}">
								<div class="homeActivityShoppingTitle">
									<img :src=" item.Picture " alt="" @error="itemImglPlaceholder($event.target)">
								</div>
								<div class="homeActivityShoppingDesc">
									<p class="homeActivityShoppingDesc">
										<img src="../../images/icon_kuajing.png" alt="" v-if="item.CrossBorder == 1">
									 	{{ item.ProductName }}
									 </p>
									<p class="homeActivityShoppingPrice">
										￥{{ (item.PromotionPrice).toFixed(2) }}
									</p>
									<p class="ProductPrice">
										<span> 平日价 </span>
										<span> ￥{{ item.Price }} </span>
									</p>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</section>
			<!-- 活动及其商品 -->
			<section class="homeActivity">
				<!-- 判断Type字段是否为商品/活动 1:商品 2：活动   Type == 1-->
				<div class="homeActivityItem" v-for="(item,index) of homeActivityList" v-if="item.Type== 1">
					<div class="homeActivityBanner">
						<a :href="item.ActivityURL" v-if="item.ActivityURL != null && item.ActivityURL.indexOf('http://') >= 0">
							<img :src=" item.BannerURL" alt="" @error="waterFallPlaceholder($event.target)">
						</a>
						<router-link :to="{path:'activity',query:{ADActivityID: item.ActivityURL,HomeActivityID: item.HomeActivityID}}" v-else>
							<img :src=" item.BannerURL" alt="" @error="waterFallPlaceholder($event.target)">
						</router-link>
					</div>
					<ul class="homeActivityShoppingList">
						<li v-for=" homeActivityShopping of item.HomeActivityProduct ">
							<router-link :to="{path:'proDetail',query:{productID: homeActivityShopping.ProductID }}">
								<div class="homeActivityShoppingTitle">
									<img :src=" homeActivityShopping.ImageUrl " alt="" @error="itemImglPlaceholder($event.target)">
								</div>
								<div class="homeActivityShoppingDesc">
									<p class="homeActivityShoppingDesc">
										<img src="../../images/icon_kuajing.png" alt="" v-if="homeActivityShopping.CrossBorder == 1">
									 	{{ homeActivityShopping.ProductName }}
									 </p>
									<p class="homeActivityShoppingPrice">
										￥{{ (homeActivityShopping.Price).toFixed(2) }}
									</p>
								</div>
							</router-link>
						</li>
						<li>
							<div class="homeActivityShoppingTitle">
								<router-link :to="{path:'activity',query:{ADActivityID: item.ActivityURL,HomeActivityID: item.HomeActivityID}}">
									<img src="../../images/home_image_more.png" alt="">
								</router-link>
							</div>
						</li>
					</ul>
				</div>
				<!-- Type == 2 -->
				<div class="homeActivityItem" v-for="(item,index) of homeActivityList" v-if="item.Type== 2">
					<div class="homeActivityBanner">
						<router-link :to="{path:'activity',query:{ADActivityID: item.ADAtivityID,HomeActivityID: item.HomeActivityID}}">
							<img :src=" item.BannerURL" alt="" @error="waterFallPlaceholder($event.target)">
						</router-link>
					</div>
					<ul class="homeActivityShoppingList">
						<li v-for=" (homeActivityShopping,ind) of item.ADActivity.ADActivityFloorList">
							<router-link :to="{path:'activity',query:{ADActivityID: item.ADAtivityID,HomeActivityID: item.HomeActivityID}}">
								<div class="homeActivityShoppingTitle">
									<img :src=" homeActivityShopping.RecommendURL " alt="" @error="itemImglPlaceholder($event.target)">
								</div>
								<div class="homeActivityShoppingDesc">
									<p class="homeActivityShoppingDesc">
										<img src="../../images/icon_kuajing.png" alt="" v-if="homeActivityShopping.CrossBorder == 1">
									 	{{ homeActivityShopping.ProductName }}
									 </p>
									<p class="homeActivityShoppingPrice">
										<!-- ￥{{ (homeActivityShopping.Price).toFixed(2) }} -->
									</p>
								</div>
							</router-link>
						</li>
						<li>
							<div class="homeActivityShoppingTitle">
								<router-link :to="{path:'activity',query:{ADActivityID: item.ActivityURL,HomeActivityID: item.HomeActivityID}}">
									<img src="../../images/home_image_more.png" alt="">
								</router-link>
							</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
		<footerTabs></footerTabs>
		<loading :showLoading="showLoading"></loading>
		<go-back-top></go-back-top>
	</div>
</template>
<script>
	import searchHeader from '../../components/Header/Header.vue'
	import footerTabs from '../../components/footer/footer.vue'
	import loading from '../../components/common/loading.vue'
	import goBackTop from '../../components/goBackTop/goBackTop'
	import { waterFallPlaceholder,carouselPlaceholder,itemImglPlaceholder} from '../../config/common'
	export default {
		data () {
			return {
				waterFallPlaceholder:waterFallPlaceholder,
				carouselPlaceholder:carouselPlaceholder,
				itemImglPlaceholder:itemImglPlaceholder,
				homePageData : {},
				bannerImgList : [],
				ADbanner:{},
				homeActivityList:[],
				PromDiscountList:[],
				diffTimer:'',
				showLoading:true,
				hours : 0,
			    minutes : 0,
			    seconds : 0,
				swiperOption: {
		          	autoplay : 2000,
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
		created () {
			this.getPageData();
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
					this.ADbanner = this.homePageData.ADBanner;
					this.homeActivityList = this.homePageData.HomeActivityList;
					this.PromDiscountList = this.homePageData.PromDiscountList;
					// console.log(res)
					this.downTimer(this.PromDiscountList);
					this.showLoading = false;
				})
				.catch(error => {
					console.error(error)
				})
			},
			downTimer (PromDiscountList) {
				if(PromDiscountList.length > 0){
					const endDate = (PromDiscountList[0].EndDate).replace(/\-/g, "/"),
					      nowDate = (PromDiscountList[0].NowDate).replace(/\-/g, "/"),
					      endTimer = new Date(endDate).getTime(),
					      startTimer = new Date(nowDate).getTime();
					let diffTimer = (endTimer - startTimer)/1000,
					    hours = this.hours,
					    minutes = this.minutes,
					    seconds = this.seconds;
					this.diffTimer = diffTimer;
					console.log(diffTimer)
					let myTimer = setInterval( () => {
						if (diffTimer > 0) {
							hours = Math.floor(diffTimer/3600);
							minutes = Math.floor((diffTimer/60)%60);
							seconds = Math.floor(diffTimer%60);
							this.hours = hours > 9 ? hours : '0' + hours;
							this.minutes = minutes > 9 ? minutes : '0' + minutes;
							this.seconds = seconds > 9 ? seconds : '0' + seconds;
						} else {
							clearInterval(myTimer);
						}
						diffTimer--;
					},1000)
				}
			}
		},
		components:{
			searchHeader,
			footerTabs,
			loading,
			goBackTop
		}
	}
</script>

<style lang="less" scoped>
	@import '../../style/common.less';
	.swiper-container {
		width: 100%;
		height: 18.5rem;
		margin-top:2.75rem;
		img{
			width:100%;
		}
	}
	.entry-nav{
		display: flex;
		// display: -webkit-box;
		background:#f8f8f8;
		width:100%;
		justify-content:space-around;
		align-items:center;
		padding: 0.85rem 0;
		.entry-nav-link{
			width:25%;
			img{
				display: block;
				width:2.85rem;
				height:2.85rem;
				margin:0 auto;
			}
			span{
				display: block;
				text-align: center;
				margin:0 auto;
			}
		}
	}
	.ADBanner{
		margin-bottom: 0.5rem;
		img{
			width:100%;
		}
	}
	.homeActivityBanner img{
		width:100%;
	}
	.homeActivityShoppingList{
		display: flex;
		display: -webkit-box;
		flex-wrap:nowrap;
		overflow-x: scroll;
		li{
			width:10rem;
			padding:0.8rem;
			img{
				width:7.5rem;
			}
			.homeActivityShoppingDesc {
				.homeActivityShoppingDesc{
				    height: 32px;
				    line-height: 15px;
				    margin-top: 22px;
				    display: -webkit-box;
				    -webkit-line-clamp: 2;
				    -webkit-box-orient: vertical;
				    text-overflow: ellipsis;
				    overflow: hidden;
				    img{
				    	width:13%;
				    	vertical-align: middle;
				    }
				}
				.homeActivityShoppingPrice{
					color:#E50112;
					margin-top:5px;
					font-size: 1.3rem;
				}
				.ProductPrice{
					span{
						display: inline-block;
						color:#9b9b9b;
					}
					span:nth-child(1){
						line-height: 16px;
						font-size:0.8rem;
						padding:2px;
						text-align: center;
						border:1px solid #9b9b9b;
						border-radius: 14px;
					}
					span:nth-child(2){
						font-size: 0.8rem;
						text-decoration: line-through;
					}
				}
			}
		}
	}
	.dailyBuy{
		background:#fff;
		padding:0.8rem 0.8rem 0 .8rem;
		width:100%;
		.dailyBuy-title{
			display: flex;
			display: -webkit-box;
			border-bottom: 1px solid #f0f0f0;
			img{
				width:54%;
			}
			.dailyBuy-title-timer{
				margin-left:-84px;
				font-weight: 700;
				img{
					width:54%;
				}
				.timer{
					display: inline-block;
					padding:2px;
					line-height: 1.3rem;
					background: #000;
					color:#fff;
					text-align: center;
				}
				span:nth-child(4){
					color:#9b9b9b;
				}
			}
		}
	}
</style>