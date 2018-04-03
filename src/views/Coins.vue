<template>
  <div class="my-coins" id="my-coins">
    <!--交易记录-->
    <div class="trade-history text-right">
      <span @click="toTradeHistory">交易记录</span>
    </div>
    <!--账户余额-->
    <div class="trade-history-bg">
      <div class="account-remain">
        <div class="info">
          <p>账户余额</p>
          <p>
            <span v-text="coins"></span><span>铜钱</span>
          </p>
        </div>
      </div>
    </div>
    <!--充值-->
    <div class="charge">
      <p>铜钱充值(1元=1铜钱)</p>
      <div class="charge-list">
        <div class="charge-item" :class="{'choosed':n==index}" @click="choose(index)" v-for="(item,index) in 6" :key="'coins'+index">
          <p>500铜钱</p>
          <p>反30</p>
        </div>
      </div>
      <button href="javascript:;" class="btn">立即充值</button>
    </div>
    <!--充值说明-->
    <div class="charge-tips">
      <p>1.铜钱充值以及使用比例为：1铜钱=1人民币</p>
      <p>2.代付款订单如果使用铜钱，铜钱会暂时被锁定，取消订单后，铜钱即可返回到铜钱余额中。</p>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  export default {
    name: '',
    data() {
      return {
        coins:0,
        n:-1
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
      //      微信JS-SDK
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {

    },
    methods: {
      init() {
        document.title = '我的铜钱'
        let params = {
          url: '/wfcm-api/member/myCoin',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.coins=data.coins
          } else {
            console.log(data.msg)
          }
        })

      },
      toTradeHistory(){
        this.$router.push({path:'/tradeHistory'})
      },
      choose(index){
        this.n=index
      }
    }
  }
</script>
<style lang="less">
.my-coins{
  box-sizing: border-box;
  padding: 1rem  1.5rem;
  .account-remain{
    margin-bottom: 1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    img{
      max-width: 46%;
      margin-left: 4%;
    }
    .info{
      p{
        color: darkgrey;
      }
      span:first-child{
        font-size: 1.5rem;
        margin: 0.25rem;
      }
      span:last-child{
        color: grey;
      }
    }
  }
  .charge{
    p:first-child{
      color: gray;
    }
    .charge-list{
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .charge-item{
        margin-top: 1rem;
        width: 30%;
        box-sizing: border-box;
        padding:1rem;
        text-align: center;
        p:first-child{
          font-size: 1.2rem;
          color: #333;
        }
        border: 1px solid lightgrey;
        border-radius: 0.5rem;
      }
      .choosed{
        border: 1px solid #2999f0;
      }
      .charge-item-active{
        border: 1px solid #2999f0;
      }
    }
    .btn{
      width: 100%;
      margin: 1rem auto;
      font-size: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      background: #2999f0;
      color: #fff;
      outline: none;
      border: none;
      -webkit-appearance: none;
      cursor: pointer;
    }
  }
  .charge-tips{
    p{
      font-size: 0.8rem;
      color: gray;
    }
  }
  .trade-history-bg{
    background: url("../assets/trade-history-bg.png") no-repeat;
    background-size: cover;
    background-position:center center;
    width: 100%;
    height: 100%;
  }
}
</style>
