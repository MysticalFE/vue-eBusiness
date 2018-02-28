<template>
	<div id="proDetail" :style="{background: '#f8f8f8'}">
		<other-header class="headerTop">
			<div slot='pro-text' class="proText" @click="judgeSelectedTab(0)" :class="{selectedTab:selectedTabInd == 0}"><span>商品</span></div>
			<div slot='detail-text' class="detailText proText" @click="judgeSelectedTab(1)" :class="{selectedTab:selectedTabInd == 1}"><span>详情</span></div>
			<div slot='eval-text' class="evalText proText"  @click="judgeSelectedTab(2)" :class="{selectedTab:selectedTabInd == 2}"><span>评价</span></div>
		</other-header>
		<ul v-if="getResData != null">
			<transition name="slide">
				<li v-show="selectedTabInd == 0" class="pr slideItem">
					<swiper class="swiper-container" :options=" swiperOption ">
						<swiper-slide v-for= "bannerImg of bannerImgList" :key= "bannerImg.id">
							<img :src=" bannerImg.mediumImageSrc " alt="" @error="carouselPlaceholder($event.target)">
						</swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
						<div class="productNum pa">商品编号:{{this.productNum}}</div>
					</swiper>
					<section class="productInfoTitle">
						<p> {{ getPrice }} <span> {{ getOriginPrice }} </span></p>
						<p> {{ productTitle }} </p>
						<p v-show="promotionTitle != ''" class="promotionTitle"> {{ promotionTitle }} </p>
						<p class="infoLabel">
							<span>{{ brandInfo.CountryName }}品牌</span>
							<span>正品保障</span>
							<span>满99包邮</span>
						</p>
					</section>
					<section class="productPropertyInfo">
						<div class="selectedProp">
							<span>已选</span>
							<span v-if="getResData.OnLineQty <= 0">无库存</span>
							<span v-if="productSpec.length > 0 && getResData.OnLineQty >= 0">请选择商品规格</span>
							<span v-if="productSpec.length <= 0 && getResData.OnLineQty > 0">{{inputNum}}件</span>
						</div>
						<div class="productProp" v-for="(item,index) of productSpec" v-if="productSpec.length > 0">
							<span class="productSpecTitle"> {{ item }}</span>
							<div class="productSpecProp">
								<span v-for="(propItem1,ind) of productSpecProItem.Prospec1" v-if="index == 0" @click="filterAttr(ind,$event)" :class="{selectedAttr: ind == flag,noStoreAttr:isSelected && filterItem == propItem1}" :data-value="propItem1"> {{ propItem1 }} </span>
								<span v-for="(propItem2,ind) of productSpecProItem.Prospec2" v-if="index == 1" @click="filterAttr(ind,$event)" :class="{selectedAttr:ind == flag,noStoreAttr:isSelected && filterItem == propItem2}" :data-value="propItem2"> {{ propItem2 }} </span>
							</div>
						</div>
						<div class="productInputNum">
							<span class="productSpecTitle">数量</span>
							<div class="productSpecProp" v-if="getResData.OnLineQty > 0">
								<span class="minusNum" @click="minusNum"> - </span>
								<input class="inputNum" type="text" name="number" maxlength="4" autocomplete="off" v-model="inputNum">
								<span class="plusNum" @click="plusNum"> + </span>
							</div>
							<div class="productSpecProp" v-else>库存不足</div>
						</div>
					</section>
					<section class="otherInfo">
						<section class="deliveryInfo">
							<span>配送:</span>
							<span v-if="getResData.CrossBorder == 0">由上海仓发货</span>
							<span v-else>由保税仓发货</span>
						</section>
						<section class="deliveryInfo" v-if="promotionInfoList.length > 0">
							<span>促销:</span>
							<span>{{ promotionInfoList[0].PromotiontName }} ></span>
						</section>
						<section class="deliveryInfo" v-if="couponInfoList.length > 0">
							<span>优惠券:</span>
							<span>{{ couponInfoList[0].Title }} ></span>
						</section>
					</section>
					<section class="productDesc">
						<section class="deliveryInfo">
							<span>商品描述</span>
							<span> > </span>
						</section>
						<section class="productDescHtml" v-html="proDescHtml" ref="productDescHtml"></section>
					</section>
					<section class="brandContent" v-if="brandInfo != null">
						<div class="brandTitle">
							<div class="brandLeft">
								<div class="brandLogo">
									<img :src="brandInfo.BrandLogoOfPro" alt="" @error="itemImglPlaceholder($event.target)">
								</div>
								<div class="brandName">
									<p> {{ brandInfo.BrandName }} </p>
									<p>所属国家 : {{ brandInfo.CountryName }}</p></div>
							</div>
							<div class="brandRight" v-show="brandInfo != null">
								<router-link :to="{path:'searchResult',query:{ brand:brandInfo.BrandID,keyword: brandInfo.BrandName}}" >进入品牌</router-link>
							</div>
						</div>
						<div class="brandDesc" v-if="brandInfo.BrandDesc != ''">
							<p> {{ brandInfo.BrandDesc }} </p>
						</div>
					</section>
					<section class="productInfo" v-show="productInfo.length > 0">
						<section class="deliveryInfo">
							<span>商品信息</span>
							<span> > </span>
						</section>
						<ul>
							<li v-for="item of productInfo">
								<span v-if="item.name != ''"> {{ item.name }}</span>
								<span v-if="item.value != ''"> {{ item.value }} </span>
							</li>
						</ul>
					</section>
					<section class="productEval">
						<section class="deliveryInfo">
							<span>商品描述</span>
							<span> > </span>
						</section>
					</section>
					<section class="adviseLiking" v-if="adviseLiking.length > 0">
						<div class="deliveryInfo">
							<span>猜你喜欢</span>
						</div>
						<ul>
							<li v-for="item of adviseLiking">
								<div class="adviseLikingItemImg">
									<img :src="item.PlazaSrc" alt="" @error="itemImglPlaceholder($event.target)">
								</div>
								<p>{{ item.MatchProductName }}</p>
								<p>￥{{ (item.Price).toFixed(2) }}</p>
							</li>
						</ul>
					</section>
				</li>
			</transition>
			<transition name="slide">
				<li v-show="selectedTabInd == 1" class="slideItem" style="padding-bottom: 3.5rem">
					<section class="productDescHtml" v-html="proDescHtml" ref="productDescHtml"></section>
				</li>
			</transition>
			<transition name="slide">
				<li v-show="selectedTabInd == 2" class="slideItem reviewWrapper">
					<section class="reviewContent">
						<div class="reviewStar">
							<span>综合评价</span>
							<div class="reviewImg">
								<img v-for="item of reviewStarList" :src="item.startImg" alt="">
							</div>
						</div>
						<ul v-show="reviewList" v-load-more="getMore">
							<li v-for="item of reviewList">
								<div class="commentInfo">
									<p class="userName">{{ item.NickName }}</p>
									<div class="labelList" v-show="item.LabelList != null">
										<div class="listLeft">
											<span>标签</span>
										</div>
										<div class="listRight">
											<span v-for="label of item.LabelList">{{ label.LabelName }}</span>
										</div>
									</div>
									<p class="reviewText">{{ item.ReviewContent }}</p>
									<ul v-show="item.ProductReviewPic != null">
										<li v-for="itemImg of item.ProductReviewPic">
											<img :src="itemImg.BigPictureUrl" alt="" @click="clickImg(itemImg.BigPictureUrl)">
										</li>
									</ul>
									<div class="reviewData">
										<span>{{ item.IndateTime }}</span>
									</div>
								</div>
							</li>
						</ul>
						<div class="loading" v-if="isLoading == true && reviewList.length > 0">加载中...请稍后</div>
						<div class="noLoading" v-if="isLoading == false">没有更多了...</div>
					</section>

				</li>
			</transition>
		</ul>
		<footer>
			<div class="collect-cart">
				<div class="collect">
					<div class="collect-icon"></div>
					<div>收藏</div>
				</div>
				<div class="cart pr">
					<div class="cart-icon"></div>
					<router-link to="cart">购物车</router-link>
					<span class="cartNum pa" :class="{changeCartNumAni:changCartNum}"> {{ cartNum }} </span>
				</div>
			</div>
			<div class="immediatelyBuy">立即购买</div>
			<div class="joinCart" @click="joinCart">加入购物车</div>

		</footer>
		<go-back-top></go-back-top>
		<tip-alert :showTip.sync="showTip" :tipText="tipText" :showTipBtn="showTipBtn"></tip-alert>
		<loading :showLoading="showLoading"></loading>
		<magnify-img :imgSrc="reviewImgSrc" v-if="showBigImg" @closeBigImg="viewImg"></magnify-img>
	</div>
</template>
<script>
	import otherHeader from '../../components/header/OtherHeader'
	import tipAlert from '../../components/common/tipAlert'
	import goBackTop from '../../components/goBackTop/goBackTop'
	import Loading from '../../components/common/loading.vue'
	import MagnifyImg from '../../components/magnifyImg/magnifyImg'
	import { filterRepEle,carouselPlaceholder,itemImglPlaceholder,uniquePro} from '../../config/common'
	// import { mixins} from '../../config/mixins'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				itemImglPlaceholder:itemImglPlaceholder,
				carouselPlaceholder:carouselPlaceholder,
				getResData:null,
				selectedTabInd:0,//头部tab标识
				productID:'',//接收上个页面传入的productID
				customerID:'',//用户标识
				bannerImgList:[],//轮播图
				productNum:'',//商品编号,
				storeNum:0,//库存，
				adviseLiking:[],//猜你喜欢, suggest
				productSpec:[],//商品规格, ProspecList 判断是否为多属性
				productSpecPro:[],//商品规格属性:ProSpec1,ProSpec2 =>商品规格属性字段；ProductItemID => 多属性商品ID; OnLineQty => 相应属性商品库存
				productSpecProItem:[],//规格集合；
				productSpecProList:[],//具体属性集合；
				productSpecProItem1:[],//尺寸;
				productSpecProItem2:[],//颜色;
				onLineQtyList:[],//相应属性库存列表;
				ProductItemIDList:[],//相应属性的productID;
				inputNum:1,//输入的商品数量
				proDescHtml:'',//商品信息html
				productInfo:[],//商品信息  CustomProspecList
				promDiscountInfo:{},//无属性商品折扣信息
				promDiscountInfoList:[],//多属性商品折扣信息列表
				brandInfo:{},//商品品牌信息  BrandInfo
				ItemImgList:[],//选中相应商品属性时的商品图片的切换
				price:'',//商品价格
				originPrice:'',//商品原价
				priceList:[],//相应属性商品的价格
				promotionInfoList:[],//促销列表
				couponInfoList:[],//优惠券信息列表
				productTitle:'',//商品标题
				promotionTitle:'',//商品折扣标题(小标题)
				cartNum:0,//购物车数量
				flag:-1,
				diffFlag:-1,
				filterItem:'',
				isSelected:false,//商品属性是否被选中;
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
				changCartNum:false,
				showLoading:true,
				reviewScore: -1,
				reviewStarList: [],
				pageInfo: {},
				reviewList: [],
				reviewImgSrc: '',
				showBigImg: false,
				isLoading:true,//是否加载数据 true => 加载
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
		created () {
			this.pageNumber = 1
			this.pagesize = 10
			this.init()
		},
		mounted () {

		},
		computed: {
			//详情页应显示的价格;
			getPrice () {
				//有无折扣
				if (this.promDiscountInfoList.length <= 0){
					//商品是否多属性
					if (this.productSpec.length <= 0){
						this.price = '￥' + this.getResData.Price.toFixed(2);
					} else {
						// this.price = [...this.priceList]
						this.sortPrice()
					}
				} else {
					if (this.productSpec.length <= 0) {
						this.price = '￥' + this.promDiscountInfoList[0].PromotionPrice.toFixed(2);
					} else {
						this.sortPrice()
					}
				}
				return this.price
			},
			//原价的显示;
			getOriginPrice () {
				if (this.promDiscountInfoList.length > 0) {
					if (this.productSpec.length <= 0) {
						this.originPrice = (this.promDiscountInfoList[0].PromotionPrice <= this.promDiscountInfoList[0].Price) ? this.promDiscountInfoList[0].Price : this.promDiscountInfoList[0].PromotionPrice
					} else {
						const promotionPriceArr = [];
						let	maxPromotionPrice = 0;
						for (let item of this.promDiscountInfoList) {
							promotionPriceArr.push(item.Price)
							maxPromotionPrice = promotionPriceArr.sort(this.sortNum)[promotionPriceArr.length-1]
							// maxPromotionPrice = maxPromotionPrice.toFixed(2);
							this.originPrice = '￥' + maxPromotionPrice
						}
					}
				}
				return this.originPrice;
			},
			// //评论星级
			// reviewStarLiist () {
			// 	setTimeout(() => {
			// 		const len = this.reviewScore
			// 		console.log(len)
			// 		return Array.from(new Array(len),(value,index) => ({
			// 			starIndex: index,
			// 			startImg: '../../images/fill_star.svg'
			// 		}))
			// 	},20)
			// }
		},
		methods: {
			async init () {
				this.productID = this.$route.query.productID;
				this.customerID = sessionStorage.getItem('customerID') || '';
				// this.cartNum = this.inputNum;
				let getItemListStorage = []
				if (sessionStorage.getItem('itemList')) {
					getItemListStorage = JSON.parse(sessionStorage.getItem('itemList'));
				}
				console.log(getItemListStorage)
				if (getItemListStorage) {
					let cartQuantity = 0;
					for (let item of getItemListStorage) {
						cartQuantity += item.Quantity;
					}
					this.cartNum = cartQuantity;
				}
				await this.getData()
			},
			//tab切换
			judgeSelectedTab (ind) {
				this.selectedTabInd = ind;
				//当前商品评价列表
				if (ind === 2) {
					this.showLoading = true
					this.getCommentData()
				}
			},
			//当前商品评论
			getCommentData() {
				this.$http({
					method: 'get',
					url: '/api/UIProduct/review',
					params: {
						ProductID: this.productID,
						pageNumber: this.pageNumber,
						pagesize: this.pagesize
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						const resData = res.data.data
						this.pageInfo = resData.PageInfo
						this.reviewList = this.reviewList.concat(resData.ReviewList)
						this.reviewScore = resData.ReviewScore
						this.showLoading = false
					}
				}).catch(error => {
					console.log(error)
				})
			},
			getData () {
				this.$http({
					method:'get',
					url:'/api/UIProduct/DetailV2',
					params:{
						itemID:this.productID,
						customerID:this.customerID
					}
				})
				.then(res => {
					if (res.data.code == 0) {
						console.log(res)
						const resData = res.data.data;
						this.getResData = resData;
						this.bannerImgList = resData.ImageList;
						this.productNum = resData.ProductCode;
						this.priceList = resData.PriceList;
						this.promDiscountInfo = resData.PromDiscountInfo;
						this.promDiscountInfoList = resData.PromDiscountInfoList;
						this.brandInfo = resData.BrandInfo;
						this.productSpec = resData.ProspecList;
						this.productSpecPro = resData.ProductProspecList;
						this.productTitle = resData.ProductName;
						this.promotionTitle = resData.PromotionTitle;
						this.proDescHtml = resData.Instor;
						this.promotionInfoList = resData.Promotion;
						this.couponInfoList = resData.Coupon;
						this.productInfo = resData.CustomProspecList;
						this.adviseLiking = resData.Suggest;
						this.showLoading = false
						this.filterSpecItem();
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			//将多属性obj中的单属性规格过滤重复元素，push到数组里面
			filterSpecItem() {
				for (let itemKey of Object.keys(this.productSpecPro[0])) {
					if ((/Prospec.*/).test(itemKey)) {
						this.productSpecProItem[itemKey] = [];
					}
				}
				for (let item of this.productSpecPro) {
					for (var key in item) {
						if ((/Prospec.*/).test(key)) {
							this.productSpecProItem[key].push(item[key]);
							this.productSpecProItem[key] = filterRepEle(this.productSpecProItem[key]);
						}
					}
				}
				console.log(this.productSpecProItem)
				this.excludeProp();
			},
			excludeProp () {
				const _this = this;
                for (let a of Object.keys(_this.productSpecProItem)) {
                	a = a.toString();
                	const proSpacProp = new RegExp(a);
					const macthProSpacProp = new RegExp(/Prospec.*/);
					const macthOnLineQty = new RegExp(/OnLineQty/);
					const macthProductItemID = new RegExp(/ProductItemID/);
                    for (let b in _this.productSpecProItem[a]) {
                        _this.productSpecProList[_this.productSpecProItem[a][b]] = [];
                        _this.productSpecPro.map(function (list, size) {
                            if (list[a] == _this.productSpecProItem[a][b]) {
                                const arr = [];
                                for (let prop in list){
                                	if (macthOnLineQty.test(prop)) arr['onLineQty'] = list[prop].toString();
	                                if (macthProductItemID.test(prop)) arr['proItemID'] = list[prop] || 0;
	                                if (!proSpacProp.test(prop) && macthProSpacProp.test(prop)) arr['proSpacProp'] = list[prop];
                                }
                                _this.productSpecProList[_this.productSpecProItem[a][b]].push(arr)
                            }
                        })
                    }
                }
                console.log(this.productSpecProList)
			},
			//数量-
			minusNum () {
				if (this.inputNum > 1) {
					this.inputNum--;
				}
			},
			//数量+
			plusNum () {
				//此处暂缺对库存的判断;
				this.inputNum++;
			},
			//多属性商品价格排序
			sortPrice () {
				const priceArr = [];
				let minPrice = 0,
					maxPrice = 0,
					sortPriceArr = [];
				for (let item of this.priceList){
					priceArr.push(item.Price)
					sortPriceArr = priceArr.sort(this.sortNum);
					minPrice = sortPriceArr[0];
					maxPrice = sortPriceArr[sortPriceArr.length-1];
					this.price = '￥' + minPrice + ' - ￥' + maxPrice;
				}
			},
			//价格列表排序;
			sortNum (a,b) {
				return a -b;
			},
			//筛选商品属性;
			filterAttr (index,e) {
				// console.log(e)
				const selectedProp = e.target.dataset.value;
				if (this.flag == index) {
					this.flag = null

				} else {
					this.flag = index;
					const proSpacPropArr = [],filterSpecArr = [];
					this.productSpecProList[selectedProp].map((value,index) => {
						proSpacPropArr.push(value)
					})
					for(let item of proSpacPropArr){
						if (item.onLineQty <= 0) {
							filterSpecArr.push(item)
							this.isSelected = true;
						}
					}
					for (let i=0;i<filterSpecArr.length;i++) {
						this.filterItem = filterSpecArr[i].proSpacProp;
						if (filterItem) {

						}

					}
					// for (let itemSpec in this.productSpecProItem) {
					// 	// console.log(itemSpec)
					// 	for(let filterSpec of this.productSpecProItem[itemSpec]) {
					// 		for (let index in filterSpecArr) {
					// 			if (filterSpec != filterSpecArr[index].proSpacProp) {
					// 				this.filterItemList.push(filterSpec);
					// 				this.filterItemList = filterRepEle(this.filterItemList)
					// 				console.log(filterSpec)
					// 				this.isSelected = true;
					// 			}
					// 		}
					// 	}
					// }
					console.log(this.filterItem)
					// console.log(this.filterItemList)
				};
			},
			//加入购物车;
			joinCart () {
				if (this.customerID == '') this.$router.push({path: 'login'})
				let tempID = sessionStorage.getItem('tempID') || '';
				// ,ItemList =JSON.parse(sessionStorage.getItem('itemList')) || [];
				let ItemList  = [];
				ItemList.push({
					"Quantity": parseInt(this.inputNum),
					"ID": this.getResData.ProductItemID,
					"ReductionID":null
				})
				this.$http({
					method:'POST',
					url: '/api/UIProduct/AddShopping',
					data: {
						CustomerID: this.customerID,
						TempID:tempID,
						ItemList: ItemList
					}
				}).then (res => {
					console.log(res)
					const _this = this;
					if (res.data.code == 0) {
						const data = res.data.data;
						if (tempID == '' || tempID != data.TempID) {
                            tempID = data.TempID;

                            let itemListStorage = []
                            if (itemListStorage) {
                            	itemListStorage = JSON.parse(sessionStorage.getItem('itemList'));
                            }
                           	ItemList = ItemList.concat(itemListStorage)
                           	let cartInfo = Object.assign({},uniquePro(ItemList))
                           	sessionStorage.setItem('itemList',uniquePro(ItemList))
							_this.$store.commit('CART_INFO', cartInfo)
							this.cartNum += this.inputNum;
							this.showTip = true;
							this.tipText = "加入成功";
							this.tipTimerOut(1300)
                        }
					} else {
						this.showTip = true;
						this.tipText = res.data.desc;
						this.tipTimerOut(1300)
					}
				}).catch (error => {
					console.log(error)
				})
			},
			//滚动获取更多;
			getMore () {
				let curProCount = this.pageNumber * this.pagesize;
				if(curProCount < this.pageInfo.TotalCount){
					this.pageNumber++;
					this.getCommentData();
				}else{
					this.isLoading = false;
				}
					// console.log(this.paramObj.page)
			},
			//点击放大评论图片
			clickImg (src) {
				console.log(src)
				this.showBigImg = true
				this.reviewImgSrc = src
			},
			//点击隐藏放大的图片
			viewImg () {
				this.showBigImg = false
			},
			//弹窗倒计时
			tipTimerOut (timer) {
				if (this.showTip === true) {
					this.timer = setTimeout( () => {
						this.showTip = false;
					},timer)
				} else {
					clearTimeout(this.timer)
				}
			},
		},
		watch: {
			//评论星级
			reviewScore(newVal) {
				this.reviewStarList = Array.from(new Array(newVal),(value,index) => ({
					starIndex: index,
					startImg: require('../../images/fill_star.svg')
				}))
				console.log(this.reviewStarList)
				return this.reviewStarList
			},
			// //返回的商品描述(有问题，待解决)
			// proDescHtml(newVal) {
			// 	setTimeout(() => {
			// 		for (let item of this.$refs.productDescHtml.childNodes[0].childNodes) {
			// 			item.style.width = '100%';
			// 			item.style.display = 'block';
			// 		}
			// 	},20)
			// }
		},
		components: {
			otherHeader,
			tipAlert,
			goBackTop,
			Loading,
			MagnifyImg
		}
	}
</script>
<style lang="less">
	@import '../../style/common.less';
	@fontColor:#4a4a4a;
	@borderColor:#d7d7d7;
	.productBaseCss{
		padding:1rem .85rem .3rem;
		border-bottom:1px solid #d9d9d9;
		background:#fff;
	}
	.productTitleTop{
		background:#fff;
		margin-top: 10px;
		border-top:1px solid @borderColor;
	}
	.changeNum{
		display: inline-block;
		width:1.7rem;
		height:1.7rem;
		border:1px solid @borderColor;
		text-align:center;
		line-height: 1.7rem;
	}
	.deliveryInfo{
		display: flex;
		align-items:center;
		justify-content:space-between;
		padding:1.05rem .8rem;
		border-bottom: 1px solid @borderColor;
		span:nth-child(2){
			color:#9b9b9b;
		}
	}
	.headerTop{
		background:rgba(191,191,191,0.9);
		position: fixed;
		top:0;
		left:0;
		z-index: 100;
		.proText{
			width:30%;
			display: inline-block;
			span{
				font-size: 1.2rem;
				color:#222;
			}
		}
		.selectedTab{
			border-bottom:2px solid @baseBackground;
			span{
				font-size: 1.4rem;
			}
		}
	}
	ul {
		.slideItem{
			margin-top:3rem;
			.swiper-container {
				width: 100%;
				height: 375px;
				border-bottom:1px solid #d9d9d9;
				img{
					width:100%;
				}
				.productNum{
					bottom:1.5%;
					right:1.5%;
					z-index: 999;
					color:#9b9b9b;
				}
			}
			.productInfoTitle{
				.productBaseCss;
				p{
					margin-bottom:.5rem;
				}
				p:nth-child(1){
					font-size: 1.5rem;
					font-family: 'Helvetica';
				    color: #f15353;
				    font-weight: bold;
				    line-height: 1.45rem;
				    span{
				    	font-size: 0.8rem;
				    	text-decoration: line-through;
				    	color:#9d9d9d;
				    }
				}
				p:nth-child(2){
					font-size:1.15rem;
					color:@fontColor;
					line-height: 1.45rem;
					overflow: hidden;
				    text-overflow: ellipsis;
				    word-break: break-all;
				    display: -webkit-box;
				    -webkit-line-clamp: 2;
				    -webkit-box-orient: vertical;
				}
				.promotionTitle{
					color:@baseBackground;
				}
				.infoLabel span{
					background: url(../../images/icon_check.png) left center no-repeat;
					background-size: 1rem;
					padding-left:1rem;
					margin-right:0.5rem;
				}
			}
			.productPropertyInfo{
				.productBaseCss;
				margin-top:10px;
				border-top:1px solid #d9d9d9;
				.selectedProp{
					span:nth-child(1){
						color:@fontColor;
					}
					span:nth-child(2){
						color:#000;
						margin-left:.4rem;
					}
				}
				.productProp{
					margin-top: .5rem;
					display: flex;
					width:100%;
					.productSpecTitle{
						color:@fontColor;
						width:33%;
					}
					.productSpecProp{
						display: inline-block;
						margin-left: .4rem;
						width:305%;
						span{
							display: inline-block;
							height:1.85rem;
							border: 1px solid @borderColor;
							border-radius: 4px;
							line-height: 1.8rem;
							text-align:center;
							color:#686868;
							margin-right: 10px;
						    padding:0 15px;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						    max-width: 100%;
						    box-sizing: border-box;
						    background-color: #fff;
						}
						.selectedAttr{
							background:@baseBackground;
							color:#fff;
						}
						.noStoreAttr{
							border:1px dotted #dfdfdf!important;
							background:#fff!important;
							color:#dfdfdf!important;
						}
					}
				}
				.productInputNum{
					margin-top: .5rem;
					display: flex;
					width:100%;
					.productSpecTitle{
						color:@fontColor;
						width:33%;
					}
					.productSpecProp{
						display: flex;
						margin-left: .4rem;
						width:305%;
						.minusNum{
							.changeNum;
						}
						.plusNum{
							.changeNum;
						}
						.inputNum{
							border-top:1px solid @borderColor;
							border-bottom:1px solid @borderColor;
							width:12%;
							text-align: center;
						}
					}
				}
			}
			.otherInfo{
				background:#fff;
				margin-top:10px;
				border-top:1px solid @borderColor;
			}
			.productDesc{
				background:#fff;
				margin-top:10px;
				border-top:1px solid @borderColor;
				width:100%;
				.deliveryInfo{
					span:nth-child(1):before{
						content: "";
					    width: 4px;
					    height: 12px;
					    display: inline-block;
					    vertical-align: middle;
					    margin: 0 8px 2px 0;
					    background-color: @baseBackground;
					}
				}
				.productDescHtml{
					padding-bottom:1rem;
					border-bottom: 1px solid @borderColor;
					width:100%;
					overflow: hidden;
					/*由于是scroped属性的原因导致css仅对当前组件生效,而用v-html绑定渲染出的内容可以理解为是子组件，所以相应的css并不会被应用*/
					p{
						width: 100%;
						img{
							width:100%;
							display: block;
						}
					}
				}
			}
			.brandContent{
				.productBaseCss;
				margin-top: 10px;
				border-top: 1px solid @borderColor;
				.brandTitle{
					display: flex;
					// padding-bottom:1.5rem;
					align-items:center;
					justify-content:space-between;
					.brandLeft{
						// width:50%;
						display: flex;
						.brandLogo{
							box-shadow: 7px 7px 3px #999;
							margin-right:1rem;
							img{
								width:3.8rem;
								height:3.8rem;
							}
						}
						.brandName{
							display: flex;
							flex-direction: column;
							justify-content:center;
						}
					}
					.brandRight{
						border: 1px solid #4a4a4a;
						border-radius: 15px;
						padding:3px;
					}
				}
				.brandDesc p{
					line-height: 20px;
					color: #606060;
					margin: 15px 10px 0;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 4;
					-webkit-box-orient: vertical;
				}
			}
			.productInfo{
				.productTitleTop;
				.deliveryInfo{
					span:nth-child(1):before{
						content: "";
					    width: 4px;
					    height: 12px;
					    display: inline-block;
					    vertical-align: middle;
					    margin: 0 8px 2px 0;
					    background-color: @baseBackground;
					}
				}
				ul{
					.productBaseCss;
					li{
						display: flex;
						align-items:center;
						margin-bottom: .5rem;
						span:nth-child(1){
							display: table-cell;
							text-align: justify;
							text-align-last: justify;
							width: 60px;
							height: 25px;
							line-height: 25px;
							margin-right: 10px;
							overflow: hidden;
						}
						span:nth-child(2){
							color:#9b9b9b;
						}
						span:nth-child(2):before{
							content: ':';
						    color: #4a4a4a;
						    font-weight: bold;
						    margin-right: 5px;
						}
					}
				}
			}
			.productEval{
				.productTitleTop;
				margin-bottom: 10px;
				.deliveryInfo{
					span:nth-child(1):before{
						content: "";
					    width: 4px;
					    height: 12px;
					    display: inline-block;
					    vertical-align: middle;
					    margin: 0 8px 2px 0;
					    background-color: @baseBackground;
					}
				}
			}
			.adviseLiking{
				.productTitleTop;
				overflow: hidden;
				margin-bottom:3rem;
				.deliveryInfo{
					span:nth-child(1):before{
						content: "";
					    width: 4px;
					    height: 12px;
					    display: inline-block;
					    vertical-align: middle;
					    margin: 0 8px 2px 0;
					    background-color: @baseBackground;
					}
				}
				ul{
					width:100%;
					display: flex;
					display: -webkit-box;
					flex-wrap:nowrap;
					overflow: auto;
					li{
						.flexCenterBox;
						width:33%;
						padding:.8rem;
						flex-direction:column;
						.adviseLikingItemImg{
							width:100%;
							img{
								width:100%;
							}
						}
						p{
							color: #232326;
							height: 2.1rem;
							line-height: 1.1rem;
							margin-top: 6px;
							/* white-space: nowrap; */
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						p:nth-child(3){
							color:#E50112;
						}
					}
				}
			}
		}
		.reviewWrapper {
			// position: relative;
			// top: 0;
			// left: 0;
			// right: 0;
			// bottom: 0;
			width: 100%;
			height: auto;
			// overflow: auto;
			padding-bottom: 3.5rem;
			background: rgb(248,248,248);
			.reviewContent {
				background: #fff;
				// overflow: auto;
				.reviewStar {
					padding: 10px;
					.flexCenterBox;
					justify-content: flex-start;
					.reviewImg {
						margin-left: 6px;
					}
				}
				ul{
					overflow: auto;
					li {
						min-height: 4rem;
						border-bottom: 1px solid #e5e5e5;
						.commentInfo {
							padding: 10px;
							.userName {
								color: #848689;
								font-size: 12px;
								margin-bottom: 2px;
							}
							.labelList {
								display: flex;
								justify-content: flex-start;
								.listLeft {
									width: 36px;
									span {
										color: #848689;
									}
								}
								.listRight {
									display: flex;
									flex: 1;
									flex-wrap: wrap;
									span {
										background: @baseBackground;
										color: #fff;
										font-size: 12px;
										line-height: 16px;
										height: 20px;
										padding: 2px;
										margin: 0 5px 5px;
										text-align: center;
										overflow: hidden;
										border-radius: 3px;
									}
								}
							}
							.reviewText {
								font-size: 14px;
								overflow: hidden;
								margin-bottom: 5px;
							}
							.reviewData {
								.flexCenterBox;
								justify-content: flex-end;
								span {
									font-size: 12px;
									color: #848689;
								}
							}
							ul {
								.flexCenterBox;
								justify-content:flex-start;
								flex-wrap: wrap;
								overflow: hidden;
								li {
									width: 25%;
									// height: 3.85rem;
									overflow: hidden;
									margin-bottom: 5px;
									border-bottom: 0;
									img {
										width: 100%;
									}
								}
							}
						}
					}
				}
				.loading,.noLoading{
					height:2rem;
					width:100%;
					line-height: 2rem;
					text-align: center;
				}
			}
		}
	}
	footer{
		width:100%;
		height:3.5rem;
		position:fixed;
		bottom:0;
		left:0;
		z-index: 120;
		display: flex;
		flex-wrap:nowrap;
		background:#fff;
		border-top:1px solid @borderColor;
		.collect-cart{
			width:40%;
			display: flex;
			flex-wrap:nowrap;
			border-right: 1px solid @borderColor;
			.collect{
				.flexCenterBox;
				flex-direction:column;
				width:50%;
				.collect-icon{
					width:21px;
					height:19px;
					background:url(../../images/focus-icon.png) no-repeat;
					background-size: 100px 100px;
				}
			}
			.cart{
				.flexCenterBox;
				font-size: .8rem;
				flex-direction:column;
				width:50%;
				border-left:1px solid @borderColor;
				.cart-icon{
					width:25px;
					height:24px;
					background:url(../../images/sprits_btm_new.png) no-repeat;
					background-position: 0 -23px;
    				background-size: 50px 50px;
				}
				.cartNum{
					top:7%;
					right:11%;
					z-index: 131;
					background:@baseBackground;
					line-height: .8rem;
					border-radius: 8px;
					padding: .1rem .5rem;
					color:#fff;
				}
				.changeCartNumAni{
					animation: tipMove .4s;
					// transition: cubic-bezier(.48,0,.24,.99);
				}
			}
		}
		.immediatelyBuy{
			.flexCenterBox;
			width:30%;
			color:@baseBackground;
			font-size: 1.2rem;
			background:#FAF7F1;
		}
		.joinCart{
			width:30%;
			.flexCenterBox;
			color:#fff;
			font-size: 1.2rem;
			background:@baseBackground;
		}
	}
	.slide-enter-active{
	  -webkit-animation: zoomIn .5s;
	  animation: zoomIn .5s;
	}
</style>