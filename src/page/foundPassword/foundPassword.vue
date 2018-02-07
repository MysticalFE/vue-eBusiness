<template>
	<div id="foundPassword">
		<Other-header class="headerTop">
			<span slot='login-text' class="loginText">找回密码</span>
		</Other-header>
		<section class="registerWrap">
			<div class="loginTabList">
				<form>
					<div class="getSMSCode">
						<input type="text" name="text" autocomplete="off" placeholder="请输入手机号码" maxlength="11" v-model="userMobile">
						<span @click.prevent="sendSMSCode" v-if="isGetSMSCode"> 获取短信验证码 </span>
						<span v-else class="sendCodeText"> {{SMSCodeNum}}s后再次获取 </span>
					</div>
					<input type="text" name="name" autocomplete="off" placeholder="请输入短信验证码" class="validateCode userName" v-model="validateCode" maxlength="6">
					<div class="userName">
						<input type="password" name="password" autocomplete="off" placeholder="请设置6-20位登录密码" v-model="loginPassword" class="inputPassword" v-if="!showPassword" maxlength="20">
						<input type="text" name="text" autocomplete="off" placeholder="请设置6-20位登录密码" v-model="loginPassword" class="inputPassword" v-else>
						<div class="button_switch" :class="{change_to_text: showPassword}" maxlength="20">
		                    <div class="circel_button" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
		                    <span>abc</span>
		                    <span>...</span>
            			</div>
					</div>
					<div class="resBtn" @click="resIn">确认</div>
				</form>
			</div>
		</section>
		<tip-alert :showTip.sync="showTip" :tipText="tipText" :showTipBtn="showTipBtn" @closeTip="closeTip"></tip-alert>
	</div>
</template>
<script>
	import tipAlert from '../../components/common/tipAlert'
	import OtherHeader from '../../components/header/OtherHeader'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				userMobile:'',//手机号码
				validateCode:'',//验证码
				loginPassword:'',//密码
				inviteCode:'',//邀请码
				showPassword:false,//是否显示密码
				customerInfo:null,//个人信息
				showPassword:false,//是否显示密码
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示按钮
				isGetSMSCode:true,//是否重复发送
				SMSCodeNum:120//验证码倒计时
			}
		},
		methods: {
			changePassWordType(){
                this.showPassword = !this.showPassword;
            },
			resIn () {
					if (this.userMobile == '') {
						this.showTip = true;
						this.tipText = "手机号不能为空";
						this.tipTimerOut(1300);
						return;
					}
					if (!/^1[3|4|5|7|8]\d{9}$/.test(this.userMobile)) {
						this.showTip = true;
						this.tipText = "手机号不正确";
						this.tipTimerOut(1300);
						return;
					}
					if(this.validateCode == ''){
						this.showTip = true;
						this.tipText = "验证码不能为空";
						this.tipTimerOut(1300);
						return;
					}
					if(this.loginPassword == ''){
						this.showTip = true;
						this.tipText = "密码设置不能为空";
						this.tipTimerOut(1300);
						return;
					}
					this.$http({
						method: 'post',
						url:'/api/login/EditPassword',
						params:{
							mobile:this.userMobile,
							validatecode:this.validateCode,
							password:this.loginPassword,
							type:2,//重置密码参数
							step:2//完成重置密码
						}
					})
					.then(res => {
						if(res.data.code == 0){
							console.log(res)
							this.customerInfo = res;
							// this.$store.commit('USER_LOGININ', this.customerInfo)
							//此一步是为了避免首次点击登陆,store内的数据没有被复制的问题(也可以在actions里异步处理数据)
							this.showTip = true;
							this.tipText = res.data.desc;
							this.tipTimerOut(1300);
							setTimeout(this.$router.replace('login'),2000)
						} else {
							this.showTip = true;
							this.tipText = res.data.desc;
							this.tipTimerOut(1300);
						}
					})
			},
			//发送验证码
			sendSMSCode (){
				this.$http({
					method: 'post',
					url:'/api/System/SendSMS',
					params:{
						Mobile:this.userMobile,
						Type:2
					}
				})
				.then(res => {
					if(res.data.code == 0){
						this.isGetSMSCode = false;
						this.showTip = true;
						this.tipText = "验证码已发送";
						this.tipTimerOut(1300);
						this.sendCodeTimer = setInterval(this.sendSMSCodeTimer,1000);
					}else{
						this.showTip = true;
						this.tipText = res.data.desc;
						this.tipTimerOut(1300);
					}
					console.log(res)
				})
			},
			//验证码倒计时
			sendSMSCodeTimer () {
				if(this.SMSCodeNum > 0){
					this.SMSCodeNum -= 1;
				} else {
					clearInterval(this.sendCodeTimer);
                	this.isGetSMSCode = true;
                	this.SMSCodeNum = 120;
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
			closeTip () {

			}
		},
		components:{
			tipAlert,
			OtherHeader
		}
	}
</script>
<style lang="less" scoped>
	@import '../../style/common';
	.headerTop{
		background:@baseBackground;
		.loginText{
			color:#fff;
			font-size: 1.2rem;
		}
	}
	.registerWrap{
		width:100%;
		padding:4rem 1rem 0;
		.loginTabList{
			form{
				.getSMSCode{
					width:100%;
					display: flex;
					justify-content:space-between;
					margin-bottom:.6rem;
					input{
						width:53%;
						font-size: 1.1rem;
						padding:.8rem;
						border:1px solid #d7d7d7;
						border-radius: .3rem;
					}
					span{
						display: inline-block;
						width:44%;
						padding:.8rem;
						color:@baseBackground;
						text-align: center;
						border:1px solid @baseBackground;
						border-radius: .3rem;
					}
					.sendCodeText{
						 background:#ccc;
						 color:#eee;
						 border:1px solid #ccc;
					}
				}
				.userName{
					width:100%;
					font-size: 1.1rem;
					padding:.8rem;
					border:1px solid #d7d7d7;
					border-radius: .3rem;
					margin-bottom:.6rem;
					display: flex;
					justify-content: space-between;
					.inputPassword{
						width:80%;
						font-size: 1.1rem;
					}
					.button_switch{
				        background-color: #fff;
				        width:4rem;
				        height:2rem;
				        display: flex;
				        align-items: center;
				        justify-content: space-between;
				        padding: 0 .2rem;
				        border: 1px;
				        border-radius: 0.8rem;
				        position: relative;
				        transition: all .3s;
				        border: 1px solid #eee;
				        box-shadow: 0 0 0.1rem  0 rgba(0,0,0,.3);
				        .circel_button{
				        	width:2rem;
				        	height:2rem;
				            transition: all .3s;
				            position: absolute;
				            z-index: 1;
				            left: 0rem;
				            background-color: #f1f1f1;
				            border-radius: 50%;

				        }
				        .trans_to_right{
				            transform: translateX(2rem);
				        }
				        span{
				            transform: translate(-.05rem,.05rem);
				            line-height: 2rem;
				        }
				        span:nth-of-type(2){
				        	font-size: 1.3rem;
				            transform: translate(-.3rem,-.3rem);
				        }
				    }
				    .change_to_text{
				        background-color: @baseBackground;
				        span{
				        	color:#fff;
				        }
				    }
				}
				.resBtn{
					width:100%;
					height:3rem;
					color:#fff;
					font-size: 1.2rem;
					margin-top:1rem;
					line-height: 3rem;
					text-align: center;
					background:@baseBackground;
				}
			}
		}
	}

</style>