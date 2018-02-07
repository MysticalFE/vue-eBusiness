<template>
	<div id="login">
		<Other-header class="headerTop">
			<span slot='login-text' class="loginText">会员登录</span>
		</Other-header>
		<section class="loginContent">
			<section class="chooseLoginTab">
				<ul class="loginTabTitle">
					<li :class="{active:isChecked == 0}" @click="judgeLoginTab(0)">普通方式登录</li>
					<li :class="{active:isChecked == 1}" @click="judgeLoginTab(1)">动态密码登录</li>
				</ul>
				<div class="loginTabList" v-show="isChecked == 0">
					<form>
						<input type="text" name="name" autocomplete="off" placeholder="请输入用户名/邮箱/已验证手机号码" class="userName" v-model="userName">
						<div class="userName">
							<input type="password" name="password" autocomplete="off" placeholder="请输入密码" v-model="userPassword" class="inputPassword" v-if="!showPassword">
							<input type="text" name="text" autocomplete="off" placeholder="请输入密码" v-model="userPassword" class="inputPassword" v-else>
							<div class="button_switch" :class="{change_to_text: showPassword}">
			                    <div class="circel_button" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
			                    <span>abc</span>
			                    <span>...</span>
	            			</div>
						</div>
					</form>
				</div>
				<div class="loginTabList" v-show="isChecked == 1">
					<form>
						<input type="text" name="name" autocomplete="off" placeholder="请输入已验证手机号码" class="userName" v-model="userMobile">
						<div class="dynamicPassword">
							<input type="password" name="password" autocomplete="off" placeholder="请输入动态密码" maxlength="6" v-model="dynamicPassword">
							<span @click.prevent="sendSMSCode" v-if="isGetSMSCode"> 获取动态密码 </span>
							<span v-else class="sendCodeText"> {{SMSCodeNum}}s后再次获取 </span>
						</div>
					</form>
				</div>
				<form>
					<div class="loginBtn" @click="loginIn"> 登录 </div>
				</form>
			</section>
			<section class="otherJump">
				<router-link to="register" class="link">快速注册</router-link>
				<router-link to="foundPassword" class="link">找回密码</router-link>
			</section>
		</section>
		<tip-alert :showTip.sync="showTip" :tipText="tipText" :showTipBtn="showTipBtn" @closeTip="closeTip"></tip-alert>
	</div>
</template>
<script>
	import OtherHeader from '../../components/header/OtherHeader'
	import tipAlert from '../../components/common/tipAlert'
	import { mapState,mapMutations} from 'vuex'
	export default {
		data () {
			return {
				customerInfo:null,//个人信息
				showPassword:false,//是否显示密码
				userName:'',//用户名
				userPassword:'',//密码
				userMobile:'',//手机号码
				dynamicPassword:'',//动态密码
				isChecked:0,//密码切换方式
				showTip:false,//是否显示弹框
				tipText:'',//弹窗内容
				showTipBtn:false,//是否显示按钮
				isGetSMSCode:true,//是否重复发送
				SMSCodeNum:120//验证码倒计时
			}
		},
		created () {

		},
		mounted () {

		},
		methods: {
			judgeLoginTab (ind) {
				this.isChecked = ind;
			},
			changePassWordType(){
                this.showPassword = !this.showPassword;
            },
			loginIn () {
				if(this.isChecked == 0){
					if (this.userName == '') {
						this.showTip = true;
						this.tipText = "用户名不能为空";
						this.tipTimerOut(1300);
		                return;
		            }
		            if (this.userPassword == "") {
		                this.showTip = true;
						this.tipText = "密码不能为空";
						this.tipTimerOut(1300);
		                return;
		            }
					this.$http({
						method: 'post',
						url:'/api/login/login',
						params:{
							name:this.userName,
							password:this.userPassword
						}
					})
					.then(res => {
						if(res.data.code == 0){
							this.customerInfo = res;
							this.$store.commit('USER_LOGININ', this.customerInfo)
							//此一步是为了避免首次点击登陆,store内的数据没有被复制的问题(也可以在actions里异步处理数据)
							this.showTip = true;
							this.tipText = "登入成功";
							this.tipTimerOut(1300);
						} else {
							this.showTip = true;
							this.tipText = res.data.desc;
							// this.tipTimerOut(1300);
						}
					})
					// this.USER_LOGININ(this.customerInfo);
				} else {
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
					if(this.dynamicPassword == ''){
						this.showTip = true;
						this.tipText = "动态密码不能为空";
						this.tipTimerOut(1300);
						return;
					}
					this.$http({
						method: 'post',
						url:'/api/login/dynamiclogin',
						params:{
							phonenumber:this.userMobile,
							password:this.dynamicPassword
						}
					})
					.then(res => {
						console.log(res)
						if(res.data.code == 0){
							this.customerInfo = res;
							this.$store.commit('USER_LOGININ', this.customerInfo)
							//此一步是为了避免首次点击登陆,store内的数据没有被复制的问题(也可以在actions里异步处理数据)
							this.showTip = true;
							this.tipText = "登入成功";
							this.tipTimerOut(1300);
						} else {
							this.showTip = true;
							this.tipText = res.data.desc;
							this.tipTimerOut(1300);
						}
					})
				}

			},
			//发送验证码
			sendSMSCode (){
				this.$http({
					method: 'post',
					url:'/api/System/SendSMS',
					params:{
						Mobile:this.userMobile,
						Type:5
					}
				})
				.then(res => {
					if(res.data.code == 0){
						this.isGetSMSCode = false;
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
						if(this.customerInfo.data.code == 0){
							console.log(this.$router)
							this.$router.go(-1)//此处暂时先这样(有问题的)
						}
					},timer)
				} else {
					clearTimeout(this.timer)
				}
			},
			closeTip () {

			}
			// ...mapMutations([
			// 	'USER_LOGININ',
			// ]),
		},
		components: {
			OtherHeader,
			tipAlert
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
	.loginContent{
		width:100%;
		padding:4rem 1rem 0;
		.chooseLoginTab{
			width:100%;
			.loginTabTitle{
				display: flex;
				flex-wrap:nowrap;
				align-items:center;
				justify-content:space-around;
				margin-bottom:0.8rem;
				border-bottom:1px solid #e5e5e5;
				li{
					width:50%;
					text-align: center;
					color:#9b9b9b;
					font-size: 1.2rem;
					padding-bottom:0.7rem;
				}
				.active{
					color:#232326;
					font-weight:700;
					border-bottom:1px solid @baseBackground;
				}
			}
			.loginTabList{
				form{
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
					.dynamicPassword{
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
				}
			}
			form{
				.loginBtn{
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
		.otherJump{
			display: flex;
			margin-top:1.5rem;
			justify-content:space-between;
			.link{
				color:#686868;
				text-decoration: underline;
			}
		}
	}
</style>