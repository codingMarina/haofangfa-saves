<template>
  <div class="my-qrcode-box" id="">
    <div class="toShare" v-if="toShare">
      <img class="lead-to-share" src="../assets/leadtoshare.png" alt="">
      <img @click="toShare=false" class="i-know" src="../assets/iknow.png" alt="">
    </div>
    <div class="my-box">
      <qrcode class="my-qrcode" :value="'http://172.16.2.78:8080?inviterId='+uid" type="img"></qrcode>
      <img class="mini-avatar" src="../assets/logo.png" v-if="!avatar" alt="">
      <img class="mini-avatar" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+avatar" v-if="avatar" alt="">
    </div>
    <p class="desc">我是<span>娜子</span>，邀请您加入好芳法课堂</p>
    <div class="pic text-center">
      <img src="../assets/qrcode-friend-pic.png" alt="">
    </div>
    <div class="bottom">
      <div class="pic text-center">
        <img src="../assets/yaoqingfangshi.png" alt="">
      </div>
      <div class="invite-way">
        <div class="friend" @click="toShare=true">
          <img src="../assets/wx-friend.png" alt="">
          <p>微信好友</p>
        </div>
        <div class="friend" @click="toShare=true">
          <img src="../assets/wx-circle.png" alt="">
          <p>微信朋友圈</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import util from '../util'
  import {Qrcode} from 'vux'

  export default {
    name: '',
    data() {
      return {
        url: '',
        uid: '',
        toShare: false,
        avatar: null
      }
    },
    created() {
      let params = {
        url: '/wfcm-api/member/confirm',
        data: {'token': localStorage.token}
      }
      util.bginterface(params, data => {
        if (data.errCode == 0) {
          return
        } else {
          localStorage.removeItem('token')
          this.$router.push({path: '/'})
        }
      })
    },
    mounted() {
      document.querySelector('.my-qrcode-box').style.height = window.innerHeight + 'px'
      this.init()
      this.getMyInfo()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {
      Qrcode
    },
    methods: {
      init() {
        document.title = '邀请好友'
        let params = {
          url: '/wfcm-api/member/getUserId',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.uid = data.uid
          } else {
            console.log(data.msg)
          }
        })
      },
      getMyInfo() {
        let params = {
          url: '/wfcm-api/member/children',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.avatar = data.image
//            this.uname=
            console.log(data)
          } else {
            console.log(data.msg)
          }
        })
      },

    }
  }
</script>
<style lang="less">

  .my-qrcode-box {
    .btn {
      border: 1px solid lightseagreen;
    }
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    .my-box {
      margin: 0 auto;
      margin-top: 2rem;
      position: relative;
      width: 160px;
      height: 160px;
      .mini-avatar {
        position: absolute;
        left: 65px;
        top: 65px;
        width: 30px;
        height: 30px;
      }
    }
    .my-qrcode {
      width: 160px;
      height: 160px;
      text-align: center;
      overflow: hidden;
    }
    .desc {
      text-align: center;
      margin: 1.5rem auto;
    }
    img {
      max-width: 100%;
    }
    .invite-way {
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        width: 40%;
        text-align: center;
        img {
          width: 4rem;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 1rem;
    }
  }

</style>
