<template>
  <div class="has-buy" id="my-coupon">
    <sticky ref="sticky" :offset="0" :check-sticky-support="false">
      <tab>
        <tab-item selected @on-item-click="onItemClick(0,2,2)">未使用</tab-item>
        <tab-item @on-item-click="onItemClick(1,1,2)">已使用</tab-item>
        <tab-item @on-item-click="onItemClick(2,2,1)">已过期</tab-item>
      </tab>
    </sticky>

    <ul class="has-buy-list">
      <!--未使用-->
      <li v-for="(item,index) in couponList" :key="'notUsed'+index">
        <div class="has-buy-item" v-if="n==0&&couponList.length>0">
          <div class="coupon" :class="item.ftype>0?'manjian':'dikou'">
            <div class="top">
              <div class="ammount">
                <span>￥</span>
                <span class="price" v-text="item.cost"></span>
              </div>
              <div class="condition">
                <p class="bad-condition" v-if="item.ftype>0" v-text="'满'+item.ftype+'可用'"></p>
                <p class="bad-condition" v-if="item.ftype==0">抵扣券</p>
                <p class="good-condition">全场可用</p>
              </div>
            </div>
            <div class="bottom">
              <span class="start-time" v-text="item.beginDate"></span>-
              <span class="start-time" v-text="item.endDate"></span>
            </div>
          </div>
          <div class="btn-group">
            <div class="buy-now" @click="toIndex()" :class="item.ftype>0?'manjian':'dikou'">
              <span>立即使用</span>
            </div>
          </div>
        </div>
      </li>
      <li class="is-empty" v-if="n==0 &&couponList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您暂时没有未使用的优惠券</h4>
      </li>
      <!--已使用-->
      <li v-for="(item,index) in couponList">
        <div class="has-buy-item" v-if="n==1&&couponList.length>0">
          <div class="coupon expired">
            <div class="top">
              <div class="ammount">
                <span>￥</span>
                <span class="price" v-text="item.cost"></span>
              </div>
              <div class="condition">
                <p class="bad-condition" v-if="item.ftype>0" v-text="'满'+item.ftype+'可用'"></p>
                <p class="bad-condition" v-if="item.ftype==0">抵扣券</p>
                <p class="good-condition">全场可用</p>
              </div>
            </div>
            <div class="bottom">
              <span class="start-time" v-text="item.beginDate"></span>-
              <span class="start-time" v-text="item.endDate"></span>
            </div>
          </div>
          <div class="btn-group">
            <div class="has-used"></div>
          </div>
        </div>
      </li>
      <li class="is-empty" v-if="n==1 &&couponList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您暂时没有已使用的优惠券</h4>
      </li>
      <li v-for="(item,index) in couponList">
        <div class="has-buy-item" v-if="n==2&&couponList.length>0">
          <div class="coupon expired">
            <div class="top">
              <div class="ammount">
                <span>￥</span>
                <span class="price" v-text="item.cost"></span>
              </div>
              <div class="condition">
                <p class="bad-condition" v-if="item.ftype>0" v-text="'满'+item.ftype+'可用'"></p>
                <p class="bad-condition" v-if="item.ftype==0">抵扣券</p>
                <p class="good-condition">全场可用</p>
              </div>
            </div>
            <div class="bottom">
              <span class="start-time" v-text="item.beginDate"></span>-
              <span class="start-time" v-text="item.endDate"></span>
            </div>
          </div>
          <div class="btn-group">
            <div class="has-expired"></div>
          </div>
        </div>
      </li>
      <li class="is-empty" v-if="n==2 &&couponList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您暂时没有已过期的优惠券</h4>
      </li>
    </ul>
  </div>
</template>

<script>
  import util from '../util'
  import {Sticky, Tab, TabItem} from 'vux'

  export default {
    name: '',
    data() {
      return {
        couponList: [],
        empty: false,
        n: 0
      }
    },
    mounted() {
      if (localStorage.token) {
        this.init()
      } else {
        this.$router.push({path: '/'})
      }
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.hideMenu()
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
    components: {Sticky, Tab, TabItem},
    methods: {
      init() {
        document.title = '我的优惠券'
        let params = {
          url: '/wfcm-api/coupon/coupons',
          data: {'token': localStorage.token, 'status': 2, 'out': 2}
        }
        util.bginterface(params, data => {
          console.log(data)
          if (data.errCode == 0) {
            this.couponList = data.resultList
          } else {
            console.log(data.msg)
          }
        })
      },
      toIndex() {
        this.$router.push({path: '/'})
      },
      onItemClick(index, used, expired) {
        this.n = index

        let params = {
          url: '/wfcm-api/coupon/coupons',
          data: {'token': localStorage.token, 'status': used, 'out': expired}
        }
        util.bginterface(params, data => {

          if (data.errCode == 0) {
            this.couponList = data.resultList
          } else {
            console.log(data.msg)
          }
        })
      },
    }
  }
</script>
<style lang="less">
  #my-coupon {
    .vux-tab-ink-bar {
      background-color: transparent;
      background: linear-gradient(to right, #009deb 50%, #7888fc 50%) !important;
      width: 4%;
      margin-left: 14.5%;
    }

    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #333 !important;
      border-bottom: none;
    }

    .demo-content {
      display: flex;
      align-items: center;
    }
    .has-buy-list {
      box-sizing: border-box;
      padding: 0.5rem;
      .has-buy-item {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        .coupon {
          width: 80%;
          min-width: 60%;
          box-sizing: border-box;
          /*padding: 0.25rem 0.5rem;*/
          padding: 0.25rem 0.5rem 0.5rem;
          min-height: 4rem;
          .top, .bottom {
            color: #fff;
            span, p {
              color: #fff;
            }
          }
          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            /*padding: 1rem 1rem 0 1rem;*/
            padding: 0.35rem 1rem 0.15rem;
            .condition {
              .bad-condition {
                color: #333;
                font-weight: bold;
              }
            }
          }
          .bottom {
            span {
              font-size: 0.75rem;
              margin-bottom: 0.25rem;
            }
          }
          .ammount {
            span {
              font-size: 1.5rem;
            }
            .price {
              font-size: 2rem;
              font-weight: bold;
            }
          }
        }
        .coupon.manjian {
          background: url("../assets/manjian.png") no-repeat;
          /*background-size: cover;
          background-position: center center;*/
          background-size: contain;
          background-position: center center;
          /*box-sizing: content-box;*/
          /*padding: 0.5rem 0.5rem 1.5rem;*/
        }
        .coupon.dikou {
          background: url("../assets/dikou.png") no-repeat;
          /*background-size: cover;
          background-position: center center;*/
          background-size: contain;
          background-position: center center;
          /*box-sizing: content-box;*/
          /*padding: 0.5rem 0.5rem 1.5rem;*/
        }
        .coupon.expired {
          background: url("../assets/expired.png") no-repeat;
          background-size: contain;
          background-position: center center;
          /*padding: 0.5rem 0.5rem 1.5rem;*/
          width: 80%;
        }
        .has-used {
          width: 4rem;
          height: 3.5rem;
          background: url("../assets/hasused.png") no-repeat;
          background-size: contain;
          background-position: center center;
          margin: 0 auto;
        }
        .has-expired {
          width: 4rem;
          height: 3.5rem;
          margin: 0 auto;
          background: url("../assets/hasexpired.png") no-repeat;
          background-size: contain;
          background-position: center center;
        }
        .btn-group {
          min-width: 30%;
        }
        .buy-now {
          white-space: nowrap;
          box-sizing: border-box;
          padding: 0.3rem 0.4rem;
          border-radius: 2rem;
          margin: 0 0.5rem;
          width: 94%;
          text-align: center;
        }
        .buy-now.manjian {
          border: 1px solid lightblue;
          span {
            color: lightblue;
          }
        }
        .buy-now.dikou {
          border: 1px solid lightgreen;
          span {
            color: lightgreen;
          }
        }
      }
    }
  }


</style>
