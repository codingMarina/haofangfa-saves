<template>
  <div class="login" id="login">
    <div class="login-box">
      <!--输入窗口-->
      <div class="input-group">
        <div class="input-box">
          <img src="../assets/uname.png" alt="">
          <input type="tel" placeholder="请输入手机号" v-model="uname">
          <a href="javascript:;" class="disable-time"></a>
        </div>
        <div class="input-box">
          <img src="../assets/pwd.png" alt="">
          <input type="number" v-model="pwd" @input="sendInput()" placeholder="请输入验证码">
          <a href="javascript:;" @click="getCode()" class="get-code" v-if="!hasSend">获取验证码</a>
          <a href="javascript:;" class="disable-time" v-if="hasSend" v-text="decreaseTime+'s'"></a>
        </div>
      </div>
      <!--登录按钮-->
      <div class="btn-group">
        <x-button class="btn login-btn" :class="{disabledBg:btnDisabled}" :disabled="btnDisabled" @click.native="login()">
          立即登录
        </x-button>
      </div>
      <!--第三方登陆-->
      <div class="quick-login">
        <span>其他登录方式</span>
        <div class="third-part-login">
          <img src="../assets/wx.png" alt="" @click="wxLogin()">
          <p>微信登录</p>
        </div>
      </div>
      <!--用户协议-->
      <div class="protocol">
        <check-icon :value.sync="isAgree" type="plain">我已经阅读并同意</check-icon>
        <a href="javascript:;" @click="toUserAgreement" class="agreement">《用户服务协议》</a>
      </div>
    </div>
    <toast v-model="codeToast" type="text" :text="bgMsg"></toast>
  </div>
</template>

<script>
  import {CheckIcon, Toast, XButton} from 'vux'
  import util from '../util'

  let waitTime = 120
  //  let reg = /^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/;
  export default {
    name: '',
    data() {
      return {
        isAgree: true,
        decreaseTime: waitTime,
        hasSend: false,
        uname: '',
        pwd: '',
        codeToast: false,
        btnDisabled: true,
        bgMsg: '',
        uid: ''
      }
    },
    created() {
      this.uid = window.location.search.split('=')[1]
      this.isLogined()
    },
    mounted() {
      document.title = '好芳法课堂'
//      正常登陆或者正常退出validStatus=0,token过期validStatus=2
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {
      CheckIcon, Toast, XButton
    },
    methods: {
      isLogined() {
        if (localStorage.token) {
          this.$router.push({path: '/index/homeCourse'})
        } else {
          console.log('isLogined')
          let param=this.$route.query.fromApp
          console.log(param)
          this.$router.push({path: '/',query:{'fromApp':param}})
        }
      },
      getCode() {
//          调用接口获取验证码
        let params = {
          url: '/wfcm-api/send/sendMessage',
          data: {'mobile': this.uname}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.bgMsg = data.msg
            this.codeToast = true
            setTimeout(() => {
              this.bgMsg = ''
              this.codeToast = false
            }, 3000)
            //        倒计时效果
            this.hasSend = true
            let countDown = setInterval(() => {
              if (this.decreaseTime > 0) {
                this.decreaseTime--
              }
            }, 1000)
            setTimeout(() => {
              clearInterval(countDown)
              this.decreaseTime = waitTime
              this.hasSend = false
            }, 1000 * waitTime)
          } else {
            this.bgMsg = data.msg
            this.codeToast = true
            setTimeout(() => {
              this.bgMsg = ''
              this.codeToast = false
            }, 3000)
          }
        })
      },
      sendInput() {
        if (this.pwd != '') {
          this.btnDisabled = false
        } else {
          this.btnDisabled = true
        }
      },
      login() {
        if(this.isAgree){
          let params = {
            url: '/wfcm-api/member/login',
            data: {'mobile': this.uname, 'code': this.pwd, 'inviterId': this.uid}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              console.log('登录', data)
              localStorage.userid = data.memberEntity.userid
              localStorage.token = data.token
              if(this.$route.query.fromApp=='true'){
                console.log('从手机来的')
                console.log(localStorage.fromAppPath)
                this.$router.push({path:localStorage.fromAppPath,query:{id:localStorage.fromAppQuery}})
              }else{
                this.$router.push({path: '/index/homeCourse'})
              }
            } else {
              this.bgMsg = data.msg
              this.codeToast = true
              setTimeout(() => {
                this.bgMsg = ''
                this.codeToast = false
              }, 3000)
              console.log(data.msg)
            }
          })
        }else{
          this.bgMsg = '您未同意《用户服务协议》'
          this.codeToast = true
        }

      },
      wxLogin() {
        this.bgMsg = '暂未开通，请下载好芳法课堂APP获取更好体验'
        this.codeToast = true
      },
      toUserAgreement() {
        this.$router.push({path: '/userAgreement'})
      }
    },
  }

</script>
<style lang="less">
  @import url('../assets/less/login');
</style>
