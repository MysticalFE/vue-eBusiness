<template>
	<div id="searchResult" v-loadMore:isScrollBottom="getMore">
		<header>
			<div class="header-icon-back spriteIcon" @click="backPrepage"></div>
			<form>
				<input type="text" name="keyword" autocomplete="off" :placeholder="paramObj.keyword" @focus="backPrepage">
			</form>
			<div></div>
		</header>
		<section class="sortWrap" >
			<div class="sortWrapItem" :class="{chooseType:sortType == '1'}">
				<div class="sortWrapItemContainer" @click="chooseSortType('1')">
					<span :class="{isCrossTitle:sortType == '1'}"> {{ isCrossTitle }} </span>
					<svg class="sortIcon" width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
		    			<polygon points="0,3 10,3 5,8"/>
		    		</svg>
				</div>
				<div class="sortWrapItemDetail" v-show="sortType == '1'">
					<ul @click="sortTypeItemList($event)">
						<li>
							<span data-id="1"> 综合 </span>
						</li>
						<li>
							<span data-id="0"> 跨境 </span>
						</li>
					</ul>
				</div>
			</div>
			<div class="sortWrapItem" :class="{chooseType:sortType == '2'}">
				<div class="sortWrapItemContainer" @click="chooseSortType('2')">
					<span :class="{isCrossTitle:sortType == '2'}"> {{ isSaleTitle }} </span>
					<svg class="sortIcon" width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
		    			<polygon points="0,3 10,3 5,8"/>
		    		</svg>
				</div>
				<div class="sortWrapItemDetail" v-show="sortType == '2'">
					<ul @click="sortTypeItemList($event)">
						<li>
							<span data-id="5"> 销量 </span>
						</li>
						<li>
							<span data-id="3"> 新品 </span>
						</li>
						<li>
							<span data-id="2"> 评价 </span>
						</li>
					</ul>
				</div>
			</div>
			<div class="sortWrapItem" :class="{chooseType:sortType == '3'}">
				<div class="sortWrapItemContainer" @click="chooseSortType('3')">
					<span :class="{isCrossTitle:sortType == '3'}"> {{isPriceTitle}} </span>
					<svg class="sortIcon" width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
		    			<polygon points="0,3 10,3 5,8"/>
		    		</svg>
				</div>
				<div class="sortWrapItemDetail" v-show="sortType == '3'">
					<ul @click="sortTypeItemList($event)">
						<li>
							<span data-id="6"> 价格↑ </span>
						</li>
						<li>
							<span data-id="7"> 价格↓ </span>
						</li>
					</ul>
				</div>
			</div>
			<div class="sortWrapItem" :class="{chooseType:sortType == '4'}">
				<div class="sortWrapItemContainer" @click.prevent="chooseSortType('4')">
					<span :class="{isCrossTitle:sortType == '4'}"> 筛选 </span>
					<svg class="sortIcon" width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
		    			<polygon points="0,3 10,3 5,8"/>
		    		</svg>
				</div>
				<div class="filterWrap" v-show="sortType == '4'">
					<div class="filterWrapLeft">
						<ul>
							<li v-for="(item,index) of filterWrapLeftList" :data-filter="index" @click="clickActive(index,$event)" :class="{avtiveLi:sortFilterTypeItem == index}"> {{ item }} </li>
						</ul>
					</div>
					<div class="filterWrapRight">
						<ul class="filter-category" @click="filterItemList($event)" v-if="categoryList.length > 0 && sortFilterTypeItem == 0">
							<li v-for="(item,index) of categoryList" :data-id="item.CategoryIdLevel"> {{ item.CategoryName }} </li>
						</ul>
						<ul class="filter-brand" @click="filterItemList($event)" v-if="brandList.length > 0 && sortFilterTypeItem == 1">
							<li v-for="(item,index) of brandList" :data-id="item.BrandID"> {{ item.BrandName }} </li>
						</ul>
						<ul class="filter-originPlace" @click="filterItemList($event)" v-if="countryList.length > 0 && sortFilterTypeItem == 2">
							<li v-for="(item,index) of countryList" :data-id="item.CountryID"> {{ item.CountryName }} </li>
						</ul>
						<ul class="filter-price" @click="filterItemList($event)" v-if="priceIntervalList.length > 0 && sortFilterTypeItem == 3">
							<li v-for="(item,index) of priceIntervalList" :data-id="item.PriceRange"> {{ item.PriceRange }} </li>
						</ul>
					</div>
				</div>
			</div>
		</section>
		<section class="selectedWrap" @click="reomveFilterSelected($event)">
			<div class="showCategory showFilterItem" v-if="filterSelectedList.CatagotyList && filterSelectedList.CatagotyList.length > 0">
				<span v-for="item of filterSelectedList.CatagotyList" :key="item.id" :data-value="0"> {{ item.CategoryName }} </span>
			</div>
			<div class="showBrand showFilterItem" v-if="filterSelectedList.BrandList && filterSelectedList.BrandList.length > 0">
				<span v-for="item of filterSelectedList.BrandList" :data-value="1"> {{ item.BrandName }} </span>
			</div>
			<div class="showBrand showFilterItem" v-else="filterSelectedList.BrandList && filterSelectedList.BrandList.length > 0">
				<span v-for="item of filterSelectedList.BrandList" :data-value="1"> {{ item.BrandName }} </span>
			</div>
			<div class="showCountry showFilterItem" v-if="filterSelectedList.Country && filterSelectedList.Country.CountryID != null">
				<span :data-value="2"> {{ filterSelectedList.Country.CountryName }} </span>
			</div>
			<div class="showPrice showFilterItem" v-if="filterSelectedList.Price && filterSelectedList.Price.PriceUrl != null">
				<span :data-value="3"> {{ filterSelectedList.Price.PriceRange }} </span>
			</div>
		</section>
		<section class="productList">
			<ul>
				<router-link v-for="(item,index) of productList"  :key="index" :to="{path:'proDetail',query:{ productID: item.ProductID}}" tag="li" class="productItem pr">
						<div class="productItemImg">
							<img :src="item.ImageUrl" :alt="item.ProductName" @error="itemImglPlaceholder($event.target)">
						</div>
						<div class="productItemDesc">
							<p> {{ item.ProductName }} </p>
							<p> ￥{{ item.Price }} </p>
						</div>
						<span :class="{globeBuy:item.CrossBorder}"></span>
				</router-link>
			</ul>
			<div class="loading" v-if="isLoading == true && productList.length > 0">加载中...请稍后</div>
			<div class="noLoading"  v-if="isLoading == false">没有更多了...</div>
			<div class="noLoading" v-show="isProduct == true">暂无此类商品</div>
		</section>
		<loading :showLoading="showLoading"></loading>
		<go-back-top></go-back-top>
	</div>
</template>
<script>
	import { trimLastString,itemImglPlaceholder } from '../../config/common'
	import loading from '../../components/common/loading'
	import goBackTop from '../../components/goBackTop/goBackTop'
/**
 * [searchRescult desc];
 * @param keyword    搜索关键字 true
 * @param page       分页页数 true
 * @param pageSize   请求商品的数量 true 默认一次请求10条数据
 * @param sort       排序(0 => 跨境(iscross = 1);
 *                   默认 1 => 综合(iscross = 0);
 *                        2 => 评价;
 *                        3 => 新品;
 *                        5 => 销量;
 *                        6 => 价格升序;
 *                        7 => 价格降序;
 *                       )
 * @param category   分类ID
 * @param brand      品牌ID
 * @param country    所属地ID
 * @param price      价格区间
 * @param iscross    是否跨境(0 => 非; 1 => 跨)
 * @param spell      拼写纠错  默认 0 使用纠错 1不使用
 * @param autoselect 自动选中，输入关键字是品牌或者分类选中，默认是0选中，1不选中
 * @param newProduct 是否新品 默认 0 全部 1 新品
 */
	export default {
		data () {
			return {
				// deliveryKeyword:'',//接收search页面传入的参数;
				itemImglPlaceholder:itemImglPlaceholder,
				productList:[],//搜索结果 - 商品列表
				pageInfo:null,//页面商品信息(总数量，分页)
				categoryList:[],//分类信息(对应筛选分类模块)
				brandList:[],//品牌(对应筛选品牌模块)
				countryList:[],//所属地(对应筛选所属地模块)
				priceIntervalList:[],//价格区间(对应筛选价格模块)
				filterSelectedList:{},//筛选排序中选中的分类;
				isLoading:true,//是否加载数据 true => 加载
				isProduct:false,//是否滚动到底部
				sortType:'',//四个排序 1 => 综合一栏；2 => 销量一栏；3 => 价格一栏；4 => 筛选一栏
				sortTypeItem:'',//某排序栏内标识;
				sortFilterTypeItem:'',//筛选排序标识;
				selectedFilter:'',//已选排序标识;
				showLoading:true,//是否显示loading;
				filterWrapLeftList:['分类','品牌','所属地','价格'],
				isCrossTitle:'综合',
				isSaleTitle:'销量',
				isPriceTitle:'价格',
				paramObj:{
					keyword:'',//接收search页面传入的参数;
					page:1,
					pageSize:10,
					sort:1,
					iscross:0,
					category:'',
					brand:'',
					country:'',
					price:''
				}
			}
		},
		created () {
		},
		mounted () {
			this.init()
		},
		methods: {
			//初始化；
			init () {
				this.paramObj.keyword = this.$route.query.keyword;
				// this.paramObj.brand = this.$router.query.brand;
				this.getData(this.paramObj)
			},
			//获取数据
			getData (paramObjs) {
				this.$http({
					method:'get',
					url:'/api/Search/Search',
					params:paramObjs
				})
				.then(res => {
					console.log(res)
					if(res.data.code == 0){
						const resData = res.data.data;
						this.productList = this.productList.concat(resData.ProductListItems);
						this.pageInfo = resData.PageInfo;
						this.categoryList = resData.CategoryList;
						this.brandList = resData.BrandList;
						this.countryList = resData.CountryList;
						this.priceIntervalList = resData.PriceList;
						this.filterSelectedList = resData.SelectSpec;
						if(this.productList.length <= 0){
							this.isProduct = true;
						};
						this.showLoading = false;
						// console.log(this.productList)
					}
				})
				.catch(error => {
					console.error(error)
				})
			},
			//返回上一级
			backPrepage () {
				this.$router.go(-1);
			},
			//重载刷新页面(会强制刷新页面,不推荐使用)
			pageReload () {
				window.location.reload();
			},
			//分类栏展开收起；
			chooseSortType (type) {
				if(this.sortType !== type){
					this.sortType = type;
				} else {
					this.sortType = '';
				}
			},
			//排序商品列表;
			async sortTypeItemList (event) {
				console.log(event)
				this.sortTypeItem = event.target.dataset.id;
				this.paramObj.page = 1;
				this.productList = [];
				switch (this.sortTypeItem) {
					case '1':
						this.paramObj.sort = 1;
						this.paramObj.iscross = 0;
						break;
					case '0':
						this.paramObj.sort = 0;
						this.paramObj.iscross = 1;
						break;
					case '2':
						this.paramObj.sort = 2;
						break;
					case '3':
						this.paramObj.sort = 3;
						break;
					case '5':
						this.paramObj.sort = 5;
						break;
					case '6':
						this.paramObj.sort = 6;
						break;
					case '7':
						this.paramObj.sort = 7;
						break;
				};
				await this.getData(this.paramObj)
				this.sortWrapTitle();
				this.showLoading = true;
			},
			//排序名称的改变;
			sortWrapTitle () {
				switch (this.sortType){
					case '1':
						this.isCrossTitle = event.target.innerText;
						break;
					case '2':
						this.isSaleTitle = event.target.innerText;
						break;
					case '3':
						this.isPriceTitle = event.target.innerText;
						break;
				}
				this.sortType = '';
			},
			//动态添加li style,控制index;
			clickActive (index,event) {
				this.sortFilterTypeItem = index;
			},
			//移除已选按钮;
			async reomveFilterSelected (event) {
				console.log(event)
				event.target.outerHTML = '';
				this.paramObj.page = 1;
				this.productList = [];
				this.selectedFilter = event.target.dataset.value;
				switch (this.selectedFilter) {
					case '0':
						this.paramObj.category = '';
						break;
					case '1':
						this.paramObj.brand = '';
						break;
					case '2':
						this.paramObj.country = '';
						break;
					case '3':
						this.paramObj.price = '';
						break;
				}
				// console.log(this.paramObj)
				await this.getData(this.paramObj)
				this.showLoading = true;
			},
			//筛选排序商品列表;
			async filterItemList (event) {
				console.log(event)
				this.paramObj.page = 1;
				this.productList = [];
				if(this.sortFilterTypeItem == "")this.sortFilterTypeItem = 0;
				switch (this.sortFilterTypeItem) {
					case 0:
						this.paramObj.category == ''?this.paramObj.category += event.target.dataset.id + '_':this.paramObj.category += '_' + event.target.dataset.id;
						this.paramObj.category = trimLastString(this.paramObj.category);
						break;
					case 1:
						this.paramObj.brand = event.target.dataset.id;
						break;
					case 2:
						this.paramObj.country = event.target.dataset.id;
						break;
					case 3:
						this.paramObj.price = event.target.dataset.id;
						break;
				}
				console.log(this.paramObj)
				await this.getData(this.paramObj);
				this.sortType = '';
				this.showLoading = true;
			},
			//滚动获取更多;
			async getMore () {
				let curProCount = this.paramObj.page * this.paramObj.pageSize;
				if(curProCount <= this.pageInfo.TotalCount){
					this.paramObj.page++;
					await this.getData(this.paramObj);
				}else{
					this.isLoading = false;
				}
					// console.log(this.paramObj.page)
			}
		},
		components:{
			loading,
			goBackTop
		}
	}
</script>
<style lang="less" scoped>
	@goldColor:#947A41;
	@height:2.5rem;
	header{
		height:3.1rem;
		width:100%;
		position:fixed;
		top:0;
		left:0;
		z-index: 99;
		display: flex;
		align-items:center;
		justify-content:space-around;
		background:#efefef;
		border-bottom:1px solid #bfbfbf;
		.header-icon-back{
			width:1.5rem;
			height:1.5rem;
		}
		form{
			width:70%;
			input{
				width:100%;
				// height:1.8rem;
				padding:0.3rem;
				border:1px solid #bfbfbf;
				border-radius: 4px;
				text-indent: 5px;
			}
		}
	}
	.sortWrap{
		width:100%;
		height:3rem;
		position:fixed;
		top:0;
		left:0;
		display: flex;
		align-items:center;
		justify-content:center;
		margin-top:3.1rem;
		z-index: 102;
		background:#fff;
		border-bottom:1px solid #dedede;
		.sortWrapItem{
			width:25%;
			text-align: center;
			line-height: 3rem;
			.sortWrapItemContainer{
				.sortIcon{
					vertical-align: middle;
					transition: all .3s;
					fill:#666;
				}
			}
			.sortWrapItemDetail{
				width:100%;
				height:auto;
				position: absolute;
				z-index: 101;
				left:0;
				background:#fff;
				display: flex;
				justify-content:start;
				border-bottom:1px solid #dedede;
				ul{
					width:100%;
					li{
						width:100%;
						height:2.5rem;
						line-height: 2.5rem;
						span{
							margin-left:20px;
							display: block;
							text-align: left;
						}
					}
				}
			}
			.filterWrap{
				width:100%;
				height:100%;
				display: flex;
				justify-content:start;
				position: fixed;
				top:8.3rem;
				left:0;
				z-index: 110;
				background:rgba(248,248,248,0.8);
				.filterWrapLeft{
					width:30%;
					// height:100%;
					overflow: hidden;
					z-index: 111;
					ul{
						.avtiveLi{
							color:@goldColor;
							background:#fff;
						}
						li{
							background: #f3f4f6;
							border-bottom:1px solid #e0e0e0;
						}
					}
				}
				.filterWrapRight{
					width:70%;
					z-index: 111;
					background:#fff;
					ul{
						width:100%;
						li{
							width:100%;
							text-align: left;
							text-indent: 20px;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						}
					}
				}
			}
		}
		.chooseType{
			.sortWrapItemContainer{
				.isCrossTitle{
					color:@goldColor;
				}
				.sortIcon{
					transform: rotate(180deg);
					fill:@goldColor;
				}
			}
		}
	}
	.selectedWrap{
		width:100%;
		height:auto;
		position:fixed;
		top:6.1rem;
		display: flex;
		flex-wrap:nowrap;
		overflow-x: auto;
		z-index: 115;
		background:rgba(254,254,254,.8);
		.showFilterItem{
			display: inline-block;
			margin: 5px;
			padding: 5px;
			max-width:120px;
			line-height: 1rem;
			text-overflow:ellipsis;
			white-space: nowrap;
			overflow: hidden;
			text-align:center;
			border:1px solid #dedede;
		}
	}
	.productList{
		width:100%;
		background:#f0f2f5;
		margin-top:6.1rem;
		padding:3px;
		ul{
			display: flex;
			justify-content:space-between;
			flex-wrap:wrap;
			.productItem{
				width:49.5%;
				background:#fff;
				margin-bottom:3px;
				padding:0.5rem;
				.productItemImg{
					img{
						width:100%;
					}
				}
				.productItemDesc{
					p:nth-child(1){
						overflow: hidden;
					    display: -webkit-box;
					    display:box;
					    -webkit-line-clamp: 2;
					    line-clamp:2;
					    -webkit-box-orient: vertical;
					    box-orient:vertical;
					    word-break: break-all;
					}
					p:nth-child(2){
						font-size: 1.4rem;
						color:#f15353;
					}
				}
				.globeBuy{
					position:absolute;
					top:64%;
					right:-18%;
					width:7rem;
					height:2.1rem;
					background:url(../../images/golbalbuy.png) no-repeat;
					background-size:55%;
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
</style>