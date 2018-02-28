<template>
	<div class="group" v-load-more="getMore">
		<other-header class="headerTop">
				<span slot="order-text">爱拼团</span>
		</other-header>
		<section class="groupList" v-if="data.length > 0">
			<ul>
				<li v-for="item of data" @click="jumpToDetail(item.GroupShoppingID)">
					<div class="itemImg">
						<img v-lazy="item.ActivityPicture" alt="">
					</div>
					<p class="title" v-show="item.Title">{{ item.Title }}</p>
					<!-- <p class="desc" v-show="item.Description">{{ item.Description }}</p> -->
					<section class="priceInfo">
						<div class="priceInfoLeft">
							<span>￥{{ item.LeaderPrice }}</span>
							<span>/{{ item.LimitNum }}{{ item.MainUnit}}</span>
							<span>立省￥{{ item.EconomizePrice }}</span>
						</div>
						<div class="priceInfoRight" >
							<span>去开团</span>
						</div>
					</section>
				</li>
			</ul>
			<div class="loading" v-if="isLoading == true && data.length > 0">加载中...请稍后</div>
		</section>
		<router-view></router-view>
		<loading :showLoading="showLoading"></loading>
	</div>
</template>
<script type="text/javascript">
	import OtherHeader from '../../components/header/OtherHeader'
	import Loading from '../../components/common/loading.vue'
	import {groupList} from '../../config/api/getData'
	export default {
		data() {
			return {
				data: [],
				showLoading: true,
				isLoading:false,//是否加载数据 true => 加载
			}
		},
		created() {
			this.pageNumber = 1
			this.pageSize = 10
			this.totalCount = 0
			this.init()
		},
		methods: {
			init() {
				this.getData()
			},
			async getData() {
				const params = {
					TopCataID: 0,
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}
				const res = await groupList(params)
				if (res.data.code === 0) {
					this.data = res.data.data.UIGroupShopping
					this.totalCount = res.data.data.PageInfo.TotalCount
					this.showLoading = false
				}
			},
			jumpToDetail(id) {
				this.$router.push({
					path: `/group/${id}`
				})
			},
			//滚动获取更多;
			getMore () {
				let curProCount = this.pageNumber * this.pageSize;
				console.log(curProCount)
				if(curProCount < this.totalCount){
					this.isLoading = true
					this.pageNumber++;
					this.getData();
				}else{
					this.isLoading = false;
				}
					// console.log(this.paramObj.page)
			}
		},
		components: {
			OtherHeader,
			Loading
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	.headerTop {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		height: 3rem;
		width: 100%;
		background:rgba(191,191,191,0.9);
		span {
			font-size: 1.2rem;
			color: #222;
		}
	}
	.groupList {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		overflow: auto;
		margin-top: 3rem;
		padding-bottom: 15px;
		background: #f4f4f4;
		ul {
			li {
				// width: 100%;
				margin: 10px 8px 25px;
				border-bottom: 1px solid rgba(229,229,229,1);
				.itemImg {
					width: 100%;
					border-radius: 15px;
					img {
						width: 100%;
						border-radius: 15px;
					}
				}
				.title {
					width: 100%;
					height: 40px;
					line-height: 20px;
					margin: 15px 4px;
					font-weight: 700;
					.twoLinesEllipsis;
				}
				.desc{
					line-height: 14px;
					font-size: 12px;
					margin: 15px 4px;
					.twoLinesEllipsis(4);
				}
				.priceInfo {
					.flexCenterBox;
					justify-content: space-between;
					margin-bottom: 12px;
					.priceInfoLeft {
						span {
							&:nth-child(1) {
								font-size: 18px;
								color: #E50112;
							}
							&:nth-child(2), &:nth-child(3){
								font-size: 12px;
								color: #9B9B9B;
								margin-right: 10px;
							}
						}
					}
					.priceInfoRight {
						span {
							display: inline-block;
							width: 5.69rem;
							height: 2.1rem;
							line-height: 2.1rem;
							text-align: center;
							color: #fff;
							border-radius: 6px;
							background-image: @baseLinearBackground;
						}
					}
				}
			}
		}
		.loading {
			height:2rem;
			width:100%;
			line-height: 2rem;
			text-align: center;
		}
	}
</style>