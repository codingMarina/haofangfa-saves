<template>
  <div class="trade-history" id="">
    <div class="trade-list" v-if="coinLogList.length>0">
      <div class="trade-item" v-for="(all,index) in coinLogList" :key="'coinLogList'+index">
        <p class="time" v-text="all.mouth"></p>
        <div class="trade-detail-item" v-for="(item,i) in all.logList" :key="'logList'+i">
          <div class="goods-info">
            <p v-if="item.resource==1">购物</p>
            <p v-if="item.resource==2">邀请好友</p>
            <p v-if="item.resource==3">充值</p>
            <p v-text="'订单号'+item.ordercode"></p>
          </div>
          <p class="total-price" :class="{'orange':item.flowflag==1}" v-text="item.flowflag==1?'+'+item.coinvalue:'-'+item.coinvalue"></p>
        </div>
      </div>
    </div>
    <div class="is-empty" v-if="coinLogList.length==0">
      <img src="../assets/empty.png" alt="">
      <h4>暂无交易记录</h4>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  export default {
    name: '',
    data() {
      return {
        coinLogList:[]
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
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {

    },
    methods: {
      init() {
        document.title = '交易记录'
        let params = {
          url: '/wfcm-api/order/coinlog',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          console.log(data)
          if (data.errCode == 0) {
            this.coinLogList=data.coinLogList
          } else {
            console.log(data.msg)
          }
        })
      }
    }
  }
</script>
<style lang="less">
.trade-history{
  .trade-list{
    .trade-item{
      .time{
        background: #f6f6f6;
        box-sizing: border-box;
        padding: 0.5rem 1.5rem;
      }
      .trade-detail-item{
        width: 100%;
        overflow-x: hidden;
        box-sizing: border-box;
        padding: 0.5rem 1.5rem 1rem;
        border-bottom: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .total-price{
          width: 20%;
          white-space: nowrap;
          font-size: 1.5rem;
          text-align: right;
        }
        .goods-info{
          p:first-child{
            font-size: 1.1rem;
            line-height: 1.5rem;
          }
          p:last-child{
            color: gray;
          }
        }
      }
    }

  }
  .orange{
    color: orange;
  }
}

</style>
