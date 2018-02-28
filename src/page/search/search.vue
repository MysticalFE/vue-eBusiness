<!--
    遗留的问题：1.点击热搜关键字，不会保存到历史搜索；(和提示关键词思路一样的；代码未做处理 已解决)
    2.点击历史搜索关键字，不会重新排序。(待定)


    排序参数只有sort ，1：默认，2：时间（最老在前），3：时间（最新在前），4：销量（最少在前），5：销量（最多在前），6：价格（最便宜在前），7：价格（最贵在前）

 -->
<template>
	<div id="search">
		<header>
			<div class="spriteIcon goBack" @click="backPrepage"></div>
			<form class="searchForm">
				<input type="text" autocomplete="off" :placeholder="defaultMsg" v-model=" searchInputMsg " v-if="defaultMsg != null" @input="getTipData">
				<span class="spriteIcon" @click="bindLoginIcon"></span>
			</form>
		</header>
		<div class="hotSearch" v-if="searchInputMsg == '' && hotSearchKeyList.length > 0">
			<span class="hotSearchTitle">热搜</span>
			<ul class="hotSearchList">
				<li v-for="(item,index) of hotSearchKeyList" :key="index">
						<span class="hotSearchListDot" @click="hotKeywordSearch(index)"> {{ item.Name }} </span>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="historySearch" v-if=" searchInputMsg == '' && searchInputMsgList[0] != null && searchInputMsgList[0].length > 0 && show == true">
			<span class="hotSearchTitle">历史搜索</span>
			<ul class="historySearchList">
				<li v-for="item in searchInputMsgList[0]">
					<router-link  :to="{path: 'searchResult',query: {keyword: item}}">
						<span> {{ item }} </span>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="historySearchClear" @click="removeStorage" v-if=" searchInputMsgList[0] != null && searchInputMsgList[0].length > 0 && show == true">
			<span>清除历史搜索</span>
		</div>
		<div class="tipKeyword" v-if="searchInputMsg != '' && istipKeyShow == true">
			<ul v-if="tipSearchKeyList.length > 0">
				<li v-for="(item,index) of tipSearchKeyList" :key="index" @click="tipKeywordSearch(index)">
					<div class="tipKeywordLeft">
						<span class="spriteIcon tipSearchIcon"></span>
						<span class="tipKeywordLeft-key"> {{ item.Keyword }} </span>
					</div>
					<div class="tipKeywordRight">
						<span>约{{item.ItemCount}}条结果</span>
					</div>
				</li>
			</ul>
			<p v-else>暂无推荐结果</p>
		</div>
		<footerTabs></footerTabs>
	</div>
</template>
<script>
	import footerTabs from '../../components/footer/footer.vue'
	export default {
		data () {
			return {
				searchInputMsg:"",
				searchInputMsgList:[],
				defaultMsg:"",
				hotSearchKeyList:[],
				tipSearchKeyList:[],
				show:true,
				istipKeyShow:false
			}
		},
		created () {
			// this.getData();
		},
		mounted () {
			this.initData();
		},
		methods:{
			initData () {
				this.getHotData();
				this.getStorage();
			},
			//热搜关键词的获取;
			getHotData () {
				this.$http({
					method:'get',
					url:'/api/Search/HotKey'
				})
				.then(res => {
					this.defaultMsg = res.data.data.DefaultKey;
					this.hotSearchKeyList = res.data.data.SearchKeyList;
					console.log(this.searchKeyList);
				})
				.catch( error => {
					console.error(error)
				})
			},
			//监听input-value实时变化时提示关键词数据的获取
			getTipData () {
				this.$http({
					method:'get',
					url:'/api/Search/Autokeywords?keyword=' + this.searchInputMsg
				})
				.then(res => {
					if(res.data.code == 0){
						this.tipSearchKeyList = res.data.data.UIKeywordItemInfo;
						this.istipKeyShow = true;
						console.log(this.tipSearchKeyList)
					}
				})
				.catch(error => {
					console.error(error)
				})
			},
			//热搜关键词搜索跳转
			hotKeywordSearch (index) {
				console.log(this.hotSearchKeyList)
				this.searchInputMsg = this.hotSearchKeyList[index].Name;
				this.setStorage();
				this.$router.push({path:'searchResult',query:{keyword:this.searchInputMsg}})
			},
			//提示关键词搜索跳转
			tipKeywordSearch (index) {
				this.searchInputMsg = this.tipSearchKeyList[index].Keyword;
				this.setStorage();
				this.$router.push({path:'searchResult',query:{keyword:this.searchInputMsg}})
			},
			//点击搜索按钮
			bindLoginIcon (e) {
				//输入为空，给默认关键字
				if(this.searchInputMsg == ""){
					this.searchInputMsg = this.defaultMsg;
				}
				this.$router.push({path:'searchResult',query:{keyword:this.searchInputMsg}})
				this.setStorage();
				console.log(e)
			},
			//返回上一页
			backPrepage () {
				this.$router.go(-1)
			},
			//历史查询数据的处理
			historyData () {
				let historyDataArr = this.searchInputMsgList,
					//是否有搜索重复的关键字;true => 无；
					isHasTag = false;
				for (let item in historyDataArr[0]) {
					if(this.searchInputMsg == historyDataArr[0][item]){
		                isHasTag = true;
		            }
				}
				if(!isHasTag){
		            historyDataArr.unshift(this.searchInputMsg);
		            this.searchInputMsgList = historyDataArr;
		        }
			},
			//将input-value值存入本地
			setStorage () {
				this.historyData();
		        window.localStorage.setItem("searchInputMsgList",this.searchInputMsgList);
		        console.log(this.searchInputMsgList)
			},
			//取出value值
			getStorage () {
				if(window.localStorage.getItem("searchInputMsgList")){
					let searchInputMsgList = window.localStorage.getItem("searchInputMsgList");
					//此处处理的缘由:localStorage会自动将localStorage所存的内容转换为字符串形式;
					//将字符串类型转换为数组类型;(其他数据类型也需转换)
					const searchsearchInputMsgListNew = searchInputMsgList.split(",");
					this.searchInputMsgList.unshift(searchsearchInputMsgListNew);
					console.log(this.searchInputMsgListNew)
				}
			},
			//移除存储的searchInputMsgList字段
			removeStorage () {
				this.searchInputMsgList = [];
				window.localStorage.removeItem("searchInputMsgList",this.searchInputMsgList)
				this.show = false;
			}
		},
		components:{
			footerTabs
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common.less';
	header{
		width:100%;
		height:42px;
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
			background-position: -40px 0;
		}
		.searchForm{
			width:85%;
			display: flex;
			align-items:center;
			height:28px;
			input{
				width:90%;
				height:28px;
				border-radius: 4px 0 0 4px;
				text-align: left;
				text-indent: 10px;
				border:1px solid #bfbfbf;
			}
			span{
				width:28px;
				height:28px;
				display: flex;
				alidn-items:center;
				justify-content:center;
				border: 1px solid #bfbfbf;
				border-left:none;
				border-radius: 0 4px 4px 0;
				background-position:-56px -106px;
				// background:rgba(34,34,34,0.80);
			}
		}
	}
	.hotSearch{
		display: flex;
		flex-wrap:nowrap;
		justify-content:center;
		margin-top:42px;
		padding-top:10px;
		background:#f8f8f8;
		border-bottom:1px solid #e0e0e0;
		.hotSearchTitle {
			display: block;
			font-weight: 700;
			width:35px;
			margin-left:5px;
			margin-top:5px;
		}
		.hotSearchList {
			margin-left:10px;
			width:100%;
			li{
				display: inline-block;
				.hotSearchListDot{
					// width:2rem;
					height:2.5rem;
					line-height: 2.5rem;
					background: #fff;
					border-radius: 5px;
					border:1px solid #e0e0e0;
					text-align: center;
					padding:3px;
					margin-right:10px;
				}
			}
		}
	}
	.historySearch{
		display: flex;
		flex-wrap:nowrap;
		justify-content:space-around;
		background:#f8f8f8;
		padding-top:10px;
		padding-bottom:10px;
		.hotSearchTitle {
			display: block;
			font-weight: 700;
			width:35px;
			margin-left:5px;
			margin-top:5px;
		}
		.historySearchList{
			width:85%;
			li{
				padding:5px 0;
				border-bottom:1px solid #e0e0e0;
			}
		}
	}
	.tipKeyword{
		// padding-top:42px;
		ul{
			width:100%;
			padding:0.5rem;
			li{
				display: flex;
				align-items:center;
				justify-content:space-between;
				border-bottom: 1px solid #dedede;
				padding:0.5rem;
				.tipKeywordLeft{
					.tipSearchIcon{
						display: inline-block;
						width:16px;
						height:14px;
						background-position:-82px 0;
						vertical-align: middle;
					}
					.tipKeywordLeft-key{
						color:#848689;
					}
				}
				.tipKeywordRight{
					span{
						color:#bfbfbf;
					}
				}
			}
		}
		p{
			display: flex;
			alidn-items:center;
			justify-content:center;
			font-size: 1.5rem;
			padding-top:2rem;
			color:red;
		}
	}
	.historySearchClear{
		display: flex;
		align-items:center;
		justify-content:center;
		padding:10px;
		span{
			display: block;
			width:50%;
			font-size: 1.2rem;
			border:1px solid #848689;
			text-align: center;
			line-height: 2rem;
			border-radius: 4px;
		}
	}
</style>