<template>
	<div class="tipWraper" v-if="showTip" transtion="fade">
		<div class="tipBg pa"></div>
		<div class="tipContainer pa">
			<p> {{ tipText }} </p>
			<div class="tipBtns" v-if="showTipBtn">
				<span @click="closeTip">取消</span>
				<span @click="confirmEvent">确认</span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {

			}
		},
		props:['showTip','tipText','showTipBtn','timer'],
		computed: {
			get () {
				typeof this.tipText === 'String' ? this.tipText : String(this.tipText);//内容
				typeof this.showTipBtn !== 'Boolean' ? false : this.showTipBtn;
				typeof this.timer === 'undefined' ? 0 : this.timer;
				return this.tipText,this.showTipBtn,this.timer;
			}
		},
		methods: {
			closeTip () {
                this.$emit('closeTip')
            },
            confirmEvent () {
            	this.$emit('confirmEvent')
            }
		}
		// watch: {
		// 	showTip (val) {
		// 		clearTimeout(this.setTimer)
		// 		if (val === true) {
		// 			this.setTimer = setTimeout( () => {
		// 				this.showTip = false;
		// 			},this.timer)
		// 		}
		// 	}
		// }
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	.tipWraper {
		position:fixed;
		left:0;
		top:0;
		right:0;
		bottom:0;
		z-index: 10000;
		.flexCenterBox;
		.tipBg{
			left:0;
			top:0;
			right:0;
			bottom:0;
			width:100%;
			height:100%;
			background:#000;
			opacity: 0.5;
		}
		.tipContainer{
			.flexCenterBox;
			width:20rem;
			// display: flex;
			// align-items:center;
			// justify-content:center;
			flex-direction: column;
			animation: tipMove .4s ;
			border-radius: 1rem;
			background:#f8f8f8;
			padding:1.4rem 1rem;
			overflow: hidden;
			p{
				width:100%;
				text-align: center;
				font-size: 1.2rem;
				line-height: 1.7rem;
				color:#686868;
			}
			.tipBtns{
				width:100%;
				.flexCenterBox;
				// display: flex;
				// align-items:center;
				// justify-content:center;
				padding-top:0.5rem;
				span{
					display: inline-block;
					width:38%;
					height:2.455rem;
					border-radius: 3px;
					line-height: 2.445rem;
					text-align: center;
					margin:0 auto;
				}
				span:nth-child(1){
					color:#999;
					background:#fff;
					border:1px solid #d9d9d9;
				}
				span:nth-child(2){
					background: #947A41;
    				color: #fff;
				}
			}
		}
	}
	@keyframes tipMove{
       0%   { transform: scale(1) }
       35%  { transform: scale(.8) }
       70%  { transform: scale(1.1) }
       100% { transform: scale(1) }
    }
</style>

