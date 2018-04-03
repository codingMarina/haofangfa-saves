<template>
  <div class="invite-friend" id="">
    <img class="invite-friend-bg" src="../assets/invite-friend-bg.png" alt="">
    <div class="text-center">
      <img src="../assets/huodongshili.png" alt="">
    </div>
    <div class="txt">
      <p>
        A按照指定邀请方式邀请新用户B进入好芳法课堂，B成功注册将获得满300减20的满减券（有效期7天），A将获得满300减20的满减券（有效期30天）。当B在本平台首次购买并支付了1000元的课程费用，那么邀请人A还将获得50元铜钱的返利。
      </p>
    </div>
    <div class="text-center">
      <img src="../assets/huodongxize.png" alt="">
      <ol class="ol">
        <li><p class="text-left">本平台用户皆可参与邀请活动。</p></li>
        <li><p class="text-left">邀请好友购买课程，对方成功购买后，邀请人获得返利铜钱，返利铜钱的数额为被邀请好友首笔实际支付金额的5%，针对这个被邀请人，邀请人只能获得一次返利奖励。</p></li>
        <li><p class="text-left">邀请好友成功注册好芳法课堂，您将会获得一张满300减20的满减券（有效期30天）。好友可获得一张满300减20的满减券（有效期7天）。优惠券可与铜钱、全场满减活动叠加使用。（每笔订单限使用一张优惠券）</p></li>
        <li><p class="text-left">如果发现用户采取特殊手段扰乱正常活动秩序一经核实，好芳法课堂将取消您返利资格。</p></li>
        <li><p class="text-left">本活动长期有效；</p></li>
        <li><p class="text-left">本活动最终解释权归好芳法课堂所有；</p></li>
      </ol>
    </div>
    <div class="btn-group">
      <div class="invite-record" @click="toMyInviteHistory">
        <span>我的邀请记录</span>
      </div>
      <div class="invite-now" @click="toMyQRcode">
        <span>立即邀请好友</span>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  import { Qrcode } from 'vux'
  export default {
    name: '',
    data() {
      return {
        url:'',
        uid:''
      }
    },
    created(){
      let params = {
        url: '/wfcm-api/member/confirm',
        data: {'token': localStorage.token}
      }
      util.bginterface(params, data => {
        if (data.errCode == 0) {
          return
        } else {
          localStorage.removeItem('token')
          this.$router.push({path:'/'})
        }
      })
    },
    mounted() {
      this.init()
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
        document.querySelector('.invite-friend').style.height=window.innerHeight+'px'
      },
      toMyQRcode(){
        this.$router.push({path:'/myQRcode'})
      },
      toMyInviteHistory(){
        this.$router.push({path:'/myInviteHistory'})
      }

    }
  }
</script>
<style lang="less">
  .invite-friend{
    width: 100%;
    overflow-x: hidden;
    background: #fff7a6;
    box-sizing: border-box;
    padding-bottom: 5rem;
    img.invite-friend-bg{
      max-width: 100%;
    }
    img{
      text-align: center;
      max-width: 60%;
    }
    .txt,.ol{
      background: #ffffff;
      width: 90%;
      margin: 1rem auto;
      border-radius: 1rem;
      box-sizing: border-box;
      padding: 1rem 1.5rem;
      box-shadow: 2px 2px 0 0 lightgrey;
    }
    .ol{
      box-sizing: border-box;
      margin-right: 1.5rem;
    }
    .ol{
      -webkit-padding-start: 2.5rem;
    }
    .btn-group{
      position: fixed;
      z-index: 1000;
      width: 100%;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      bottom: 0;
      left: 0;
      div{
        width: 50%;
        height: 3rem;
        text-align: center;
        span{
          color: #ffffff;
          display: inline-block;
          line-height: 3rem;
          font-weight: bold;
        }
      }
      .invite-record{
        background: #17c6ee;

      }
      .invite-now{
        background: #ff3203;
      }
    }
  }
</style>
