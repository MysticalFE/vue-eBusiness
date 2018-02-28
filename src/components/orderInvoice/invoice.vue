<template>
	<div class="invoiceWrapper">
		<order-pop :showPopList="showPopList" @closePop="closePop">
			<span slot="invoiceTitle" v-show="crossBorder === 0">发票信息</span>
			<span slot="invoiceTitle" v-show="crossBorder === 1">身份信息</span>
			<section slot="invoiceList" class="invoiceContent" v-show="crossBorder === 0">
				<div class="invoiceType">
					<h4>发票类型</h4>
					<ul>
						<li data-type="0" @click="selectInvoiceType($event)" :class="{ active: index == 0}">无需发票</li>
						<li data-type="1" @click="selectInvoiceType($event)" :class="{active: index == 1}">个人</li>
						<li data-type="2" @click="selectInvoiceType($event)" :class="{active: index == 2}">公司</li>
					</ul>
				</div>
				<div class="companyInfo" v-show="index == 2">
					<div class="name">
						<span>发票抬头 ：</span>
						<input type="text" placeholder="请在此输入信息" autocomplete="off" v-model="invoiceName">
					</div>
					<div class="name">
						<span>纳税人识别号 ：</span>
						<input type="text" placeholder="请在此输入信息" autocomplete="off" v-model="identifyNumber">
					</div>
				</div>
				<div class="invoiceDesc">
					<h5>温馨提示 : </h5>
					<ul>
						<li>1.发票的开票金额为现金支付金额，不包括余额、优惠券、促销返利等。</li>
						<li>2.如需开增值税发票，请致电爱奢汇客服：400-602-2320。</li>
						<li>3.自2017年7月1日起，发票抬头选择公司(企业、有税号的非企业性单位和个体工商户）需要提供纳税人识别号。</li>
					</ul>
				</div>
			</section>
			<section slot="invoiceList" class="invoiceContent" v-show="crossBorder === 1">
				<div class="name">
					<p>姓名</p>
					<input type="text" :value="userName" disabled>
				</div>
				<div class="idCard">
					<p>身份证号码</p>
					<input type="text" autocomplete="off" maxlength="18" v-model="idCardNum">
				</div>
			</section>
			<footer slot="footer" @click="closePop">
				<span>确定</span>
			</footer>
		</order-pop>
		<tip-alert
			:showTip.sync="showTip"
			:tipText="tipText">
		</tip-alert>
	</div>
</template>
<script type="text/javascript">
	import OrderPop from '../../components/orderPopModule/orderPop'
	import tipAlert from '../../components/common/tipAlert'
	import { mapState,mapMutations} from 'vuex'
	export default {
		props: {
			showPopList: {
				type: Boolean,
				befault: false
			},
			crossBorder: {
				type: Number,
				default: 0
			},
			userName: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				index: 0,
				flag: false,
				invoiceName: '',
				identifyNumber: '',
				idCardNum: '',
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示弹窗按钮
			}
		},
		methods: {
			selectInvoiceType(e) {
				this.index = e.target.dataset.type
			},
			closePop() {
				this.crossBorder == 0 ? this.dealInvoice() : this.validateIdCard()
			},
			//处理发票信息
			dealInvoice() {
				this.info = {
					type: this.index,
					invoiceName: this.invoiceName,
					identifyNumber: this.identifyNumber,
				}
				this.$store.commit('INCOICE_INFO', this.info)
				if (this.index == 2) {
					if (this.invoiceName && this.identifyNumber) {
						this.$emit('closePop')
					} else {
						this.showTip = true
						this.tipText = '请填写完整的发票信息'
						this.tipTimerOut(1300)
					}
				} else {
					this.$emit('closePop')
				}
			},
			//验证身份证号码
			validateIdCard() {
				if (this.idCardNum) {
					this.idCardNum = this.idCardNum.replace(/ /g, "")
					if (this.idCardNum.length == 15) {
						this.$emit('closePop')
					} else if (this.idCardNum.length == 18) {
						this.validateIdCard18()
					} else {
						this.showTip = true
						this.tipText = '请填写正确的身份证号码'
						this.tipTimerOut(1300)
					}

				} else {
					this.showTip = true
					this.tipText = '请填写完整的身份证号码'
					this.tipTimerOut(1300)
				}
			},
			//验证18位
			validateIdCard18 () {
				const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
       			const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
       			let sum = 0
       			let idCardNumEnd = this.idCardNum[17]
       			if (this.idCardNum[17].toLowerCase() == 'x') {
       				idCardNumEnd = 10
       			}
       			// 18位是前17位每位乘一个权再加起来余11
       			for (let i = 0; i < 17; i++) {
       				sum += Wi[i] * this.idCardNum[i]
       			}
       			const valCodePosition = sum % 11
       			if (idCardNumEnd == ValideCode[valCodePosition]) {
       				// this.info = Object.assign({},this.info,{idCardNum: this.idCardNum})
       				this.$store.commit('INCOICE_INFO', {idCardNum: this.idCardNum})
       				this.$emit('closePop')
       			} else {
       				this.showTip = true
       				this.tipText = '请填写正确的身份证号码'
       				this.tipTimerOut(1300)
       			}
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
		components: {
			OrderPop,
			tipAlert
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	.invoiceText {
		color: #9b9b9b;
		font-size: 12px;
		line-height: 20px;
	}
	.invoiceContent {
		margin-top: 3rem;
		.invoiceType {
			background: #fff;
			padding: 10px;
			border-bottom: 1px solid #e0e0e0;
			ul {
				.flexCenterBox;
				justify-content: flex-start;
				li {
					margin: 10px 12px 0 0;
					padding: 0 12px;
					line-height: 32px;
					border: 1px solid #bfbfbf;
					border-radius: 3px;
					color: #686868;
					&.active {
						color: #b89868;
						border: 1px solid #b89868;
						padding: 0 10px 0 23px;
						background: url(../../images/btn_icon.png) no-repeat 8px 13px;
						background-size: 11px 8px;
					}
				}
			}
		}
		.invoiceDesc {
			padding: 10px;
			h5 {
				.invoiceText
			}
			ul {
				li {
					.invoiceText
				}
			}
		}
		.name,.idCard {
			background: #fff;
			padding: 10px;
			input {
				margin-top: 10px;
				width: 100%;
				height: 2.1rem;
				line-height: 2.1rem;
				border-radius: 3px;
				border: 1px solid #d7d7d7;
				text-indent: 10px;
			}
		}
	}
	.companyInfo {
		background: #fff;
		margin-top: 15px;
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		padding:10px 10px 0;
		.name {
			margin-bottom: 10px;
			span {
				display: inline-block;
				width: 30%;
			}
			input{
				width: 68%;
				border: 1px solid #d7d7d7;
				padding: 5px;
				border-radius: 4px;
			}
		}
	}
	footer {
		height: 44px;
	    text-align: center;
	    position: fixed;
	    bottom: 10px;
	    width: 100%;
	    padding: 0 10px;
	    z-index: 13;
	    span {
	    	width: 100%;
    	    background: #B89868;
    	    color: #fff;
    	    display: block;
    	    border-radius: 3px;
    	    height: 44px;
    	    line-height: 44px;
    	    text-align: center;
    	    font-size: 16px;
	    }
	}
</style>