<template>
	<div id="firstcomponent">
		<h1> {{ title }} </h1>
		<a> {{ author }} </a>
	</div>
</template>

<script type="text/javascript">
	export default {
		data () {
			return {
				title: "I am a title",
				author: "Jack.jia"
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../style/common.less';
	h1{
		color:red;
	}
</style>