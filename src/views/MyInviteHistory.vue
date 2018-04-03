<template>
  <div class="my-invite-history" id="my-invite-history">
    <div class="invite-bg">
      <div v-show="n==0">
        <p class="big">3</p>
        <p>累计邀请(人)</p>
      </div>
      <div v-show="n==1">
        <p class="big">63</p>
        <p>累计赚取铜钱(铜钱)</p>
      </div>
      <div v-show="n==2">
        <p class="big">4</p>
        <p>累计优惠券(张)</p>
      </div>
    </div>
    <!--tab-list-->
    <div class="tab-list">
      <sticky ref="sticky" :offset="0" :check-sticky-support="false">
        <tab :line-width="2">
          <tab-item :selected="n==0" @click.native="init(0)">被邀人</tab-item>
          <tab-item :selected="n==1" @click.native="init(1)">铜钱</tab-item>
          <tab-item :selected="n==2" @click.native="init(2)">优惠券</tab-item>
        </tab>
      </sticky>
    </div>
    <!--tab-content-->
    <div class="tab-contents">
      <!--TAB1-被邀人-->
      <div class="tab-content" v-show="n==0">
        <ul class="invitee-list">
          <li v-for="item in InvitedList">
            <div class="user" v-if="item.member">
              <img v-if="!item.member.headimage" src="../assets/logo.png" alt="">
              <img v-if="item.member.headimage" @error="setErrorImg" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.member.headimage" alt="">
              <div>
                <p  v-text="item.member.telephone.substr(0,3)+'****'+item.member.telephone.substr(7)"></p>
                <p  v-text="item.member.username"></p>
              </div>
            </div>
            <p v-text="item.createtime"></p>
          </li>
          <li v-for="item in memberberGiveCoinLogList">
            <div class="user" v-if="item.memberEntity">
              <img v-if="!item.memberEntity.headimage" src="../assets/logo.png" alt="">
              <img v-if="item.memberEntity.headimage" @error="setErrorImg" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.memberEntity.headimage" alt="">
              <div>
                <p v-text="item.memberEntity.telephone.substr(0,3)+'****'+item.memberEntity.telephone.substr(7)"></p>
                <p v-text="item.memberEntity.username"></p>
              </div>
            </div>
            <p v-text="item.createtime"></p>
          </li>
        </ul>
      </div>
      <!--TAB2-铜钱-->
      <div class="tab-content" v-show="n==1">
        <ul class="coin-list">
          <li v-for="(item,index) in  resultList1" :key="'resultList1'+index" v-if="item.goodsOrder.memberEntity">
            <p v-text="item.goodsOrder.memberEntity.telephone?item.goodsOrder.memberEntity.telephone:'无法获取手机号'"></p>
            <p v-text="'购买课程消费'+(Number(item.goodsOrder.gold)+Number(item.goodsOrder.orderamount))"></p>
            <p class="coin" v-text="'+'+item.coins"></p>
          </li>
          <li v-for="(item,index) in  resultList2" :key="'resultList2'+index" v-if="item.goodsOrder.memberEntity">
            <p v-text="item.goodsOrder.memberEntity.telephone?item.goodsOrder.memberEntity.telephone:'无法获取手机号'"></p>
            <p v-text="'购买课程消费'+(Number(item.goodsOrder.gold)+Number(item.goodsOrder.orderamount))"></p>
            <p class="coin" v-text="'+'+item.coins"></p>
          </li>
        </ul>
      </div>
      <!--TAB3-优惠券-->
      <div class="tab-content" v-show="n==2">
        <ul class="coupon-list">
          <li v-for="item in InvitedList">
            <p>成功邀请<span
              v-text="item.member.telephone.substr(0,3)+'****'+item.member.telephone.substr(7)"></span></p>
            <p>获得<span class="coupon">满300减20优惠券</span>一张</p>
          </li>
          <li v-for="item in memberberGiveCoinLogList">
            <p>成功邀请<span
              v-text="item.memberEntity.telephone.substr(0,3)+'****'+item.memberEntity.telephone.substr(7)"></span></p>
            <p>获得<span class="coupon">满300减20优惠券</span>一张</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  import {Tab, TabItem, Sticky} from 'vux'

  export default {
    name: '',
    data() {
      return {
        n: 1,
        resultList1: [],
        resultList2: [],
        InvitedList: [],
        memberberGiveCoinLogList: []
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
      this.init(1)
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {
      Tab, TabItem, Sticky
    },
    methods: {
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      init(n) {
        this.n = n
        console.log(n)
        document.title = '我的邀请记录'
        if (this.n == 1) {
//          铜钱
          let params = {
            url: '/wfcm-api/member/getInvitedCoinsList',
            data: {'token': localStorage.token}
          }
          util.bginterface(params, data => {
            console.log(data)
            if (data.errCode == 0) {
              this.resultList1 = data.resultList1
              this.resultList2 = data.resultList2
            } else {
              console.log(data.msg)
            }
          })
        } else if (this.n == 0 || this.n == 2) {
//          邀请人
          let params = {
            url: '/wfcm-api/member/getInvitedList',
            data: {'token': localStorage.token}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              console.log(data)
              this.InvitedList = data.InvitedList
              this.memberberGiveCoinLogList = data.memberberGiveCoinLogList
            } else {
              console.log(data.msg)
            }
          })
        }
      },
      chaneTab(n) {
        this.n = n
      }
    }
  }
</script>
<style lang="less">
  .my-invite-history {
    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #2999f0 !important;

    }
    .vux-tab {
      .vux-tab-item {
        font-size: 1.2rem;
      }
    }
    .vux-tab-ink-bar {
      background-color: transparent;
      background: #2999f0 !important;
      margin-left: 11.75%;
      width: 10%;
      border-radius: 0;
    }
    .tab-content {
      box-sizing: border-box;
      padding: 1rem 1.5rem;
    }
    .invite-bg {
      width: 100%;
      background: url("../assets/invite-history-bg.png") no-repeat;
      background-size: cover;
      background-position: center center;
      min-height: 8rem;
      .big {
        font-size: 2rem;
        padding: 2rem 0 0;
        font-weight: bold;
      }
      p {
        text-align: center;
        padding: 1rem 0;
        font-weight: bold;
      }
    }
    .coupon-list {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.8rem 0;
        p {
          white-space: nowrap;
          .coupon {
            color: #99cc00;
          }
        }
      }
    }
    .coin-list {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.8rem 0;
        p {
          white-space: nowrap;

        }
        .coin {
          color: orange;
        }
      }
    }
    .invitee-list {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.8rem 0;
        div.user {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          img {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            margin-right: 0.5rem;
          }
        }

      }
    }
  }
</style>
