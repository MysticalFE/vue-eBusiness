<template>
	<div id="secondcomponent">
		<h1> {{ msg }} </h1>
		<div v-for="item in itemList" class="item">
			{{ item.ProductName }}
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				msg: 'douban movies ranking list',
				itemList:[]
			}
		},
		mounted () {
			this.getData()
		},
		methods: {
			getData () {
				this.$http.get('/api/RestHome/Index',{
					params:{
						pageNumber:1,
						pagesize:10

					}
				})
				.then( res => {
					console.log(res)
					this.itemList = res.data.data.ProductListItems
				})
				.catch( error => {

				})
			}
		}
	}
</script>

<style lang="less">
	@import '../style/common.less';
</style>