<template>
  <div class="my-order">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <sticky ref="sticky" :offset="0" :check-sticky-support="false">
      <tab>
        <tab-item selected @on-item-click="onItemClick(0)">全部</tab-item>
        <tab-item @on-item-click="onItemClick(1,1)">代付款</tab-item>
        <tab-item @on-item-click="onItemClick(2,4)">已完成</tab-item>
      </tab>
    </sticky>

    <ul class="my-order-content">
      <!--全部-->
      <li v-if="n==0">

        <div v-if="orderList.length>0" class="order-list">
          <div class="order-item" v-for="order in orderList">
            <div class="order-info">
              <p class="order-num" v-text="'订单号：'+order.ordercode"></p>
              <p class="order-time" v-text="order.ordertime"></p>
            </div>
            <!--章节-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==2">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseChapterEntity.chaptername"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseChapterEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseChapterEntity.chapterprice>0?'￥'+item.courseChapterEntity.chapterprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==1">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseInfoEntity.coursename"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseInfoEntity.activityprice>0?'￥'+item.courseInfoEntity.activityprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程包-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==3">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.vipCardEntity.cardname"></p>
                  <p class="course-desc">
                    <span class="author"
                          v-text="'主讲人:'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.vipCardEntity.cardprice>0?'￥'+item.vipCardEntity.cardprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <div class="order-detail">
              <span>活动满减：</span>
              <span v-text="order.activityinfo?order.activityinfo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>优惠券使用情况：</span>
              <span v-text="order.couponsMemo?order.couponsMemo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>铜钱使用情况：</span>
              <span v-text="order.coppercash?order.coppercash:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>实际支付金额：</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
            <!--<div class="order-detail">
              <span>购买类型：</span>
              <span>章节</span>
            </div>-->
            <div class="total text-right">
              <span>合计</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
          </div>

        </div>
        <div v-if="orderList.length==0" class="is-empty">
          <img src="../assets/empty.png" alt="">
          <h4>暂无订单</h4>
        </div>
      </li>
      <!--代付款-->
      <li class="not-pay-li" v-if="n==1">
        <div class="not-pay" v-if="showTip&&(orderList.length>0)">
          <p>
            <span class="iconfont icon-time"></span>
            <span>订单号一小时内有效，过期自动关闭</span>
          </p>
          <span @click="showTip=false" class="iconfont icon-close text-right"></span>
        </div>
        <div v-if="orderList.length>0" class="order-list">
          <div class="order-item" v-for="order in orderList">
            <div class="order-info">
              <p class="order-num" v-text="'订单号：'+order.ordercode"></p>
              <p class="order-time" v-text="order.ordertime"></p>
            </div>
            <!--章节-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==2">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseChapterEntity.chaptername"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseChapterEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseChapterEntity.chapterprice>0?'￥'+item.courseChapterEntity.chapterprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==1">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseInfoEntity.coursename"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseInfoEntity.activityprice>0?'￥'+item.courseInfoEntity.activityprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程包-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==3">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.vipCardEntity.cardname"></p>
                  <p class="course-desc">
                    <span class="author"
                          v-text="'主讲人:'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.vipCardEntity.cardprice>0?'￥'+item.vipCardEntity.cardprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <div class="order-detail">
              <span>活动满减：</span>
              <span v-text="order.activityinfo?order.activityinfo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>优惠券使用情况：</span>
              <span v-text="order.couponsMemo?order.couponsMemo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>铜钱使用情况：</span>
              <span v-text="order.coppercash?order.coppercash:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>实际支付金额：</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
            <!--<div class="order-detail">
              <span>购买类型：</span>
              <span>章节</span>
            </div>-->
            <div class="total text-right">
              <span>合计</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
          </div>

        </div>
        <div class="is-empty" v-if="orderList.length==0">
          <img src="../assets/empty.png" alt="">
          <h4>暂无代付款订单</h4>
        </div>
      </li>
      <!--已完成-->
      <li v-if="n==2">

        <div v-if="orderList.length>0" class="order-list">
          <div class="order-item" v-for="order in orderList">
            <div class="order-info">
              <p class="order-num" v-text="'订单号：'+order.ordercode"></p>
              <p class="order-time" v-text="order.ordertime"></p>
            </div>
            <!--章节-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==2">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseChapterEntity.chaptername"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseChapterEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseChapterEntity.chapterprice>0?'￥'+item.courseChapterEntity.chapterprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==1">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.courseInfoEntity.coursename"></p>
                  <p class="course-desc">
                    <span class="author" v-text="'主讲人:'+item.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.courseInfoEntity.activityprice>0?'￥'+item.courseInfoEntity.activityprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <!--课程包-->
            <div v-for="item in order.goodsOrderRelationList" v-if="item.goodssort==3">
              <div class="course-detail">
                <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg"
                     @error="setErrorImg" alt="">
                <div class="course-info">
                  <p class="course-title" v-text="item.vipCardEntity.cardname"></p>
                  <p class="course-desc">
                    <span class="author"
                          v-text="'主讲人:'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                    <span class="price"
                          v-text="'价格：'+(item.vipCardEntity.cardprice>0?'￥'+item.vipCardEntity.cardprice:'暂无')"></span>
                  </p>
                </div>
              </div>
            </div>
            <div class="order-detail">
              <span>活动满减：</span>
              <span v-text="order.activityinfo?order.activityinfo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>优惠券使用情况：</span>
              <span v-text="order.couponsMemo?order.couponsMemo:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>铜钱使用情况：</span>
              <span v-text="order.coppercash?order.coppercash:'暂无'"></span>
            </div>
            <div class="order-detail">
              <span>实际支付金额：</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
            <!--<div class="order-detail">
              <span>购买类型：</span>
              <span>章节</span>
            </div>-->
            <div class="total text-right">
              <span>合计</span>
              <span v-text="'￥'+order.orderamount"></span>
            </div>
          </div>

        </div>
        <div class="is-empty" v-if="orderList.length==0">
          <img src="../assets/empty.png" alt="">
          <h4>暂无已完成订单</h4>
        </div>
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
        empty: false,
        n: 0,
        orderList: [],
        showTip: true,
        isMyLoading: true
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
      util.commonShare()
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
        document.title = '我的订单'
        let params = {
          url: '/wfcm-api/order/myOrder',
          data: {'token': localStorage.token, 'orderStatus': ''}
        }
        util.bginterface(params, data => {
          console.log('我的订单',data)
          if (data.errCode == 0) {
            this.orderList = data.goodsOrderList
            this.$nextTick(() => {
              this.isMyLoading = false
            })
          } else {
            console.log(data.msg)
          }
        })
      },
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      onItemClick(index, status) {
        this.n = index
        if (status) {
          let params = {
            url: '/wfcm-api/order/myOrder',
            data: {'token': localStorage.token, 'orderStatus': status}
          }
          util.bginterface(params, data => {
//            console.log(data)
            if (data.errCode == 0) {
              this.orderList = data.goodsOrderList
            } else {
              console.log(data.msg)
            }
          })
        } else {
          this.init()
        }


      },
    }
  }
</script>
<style lang="less">
  .my-order {
    .my-order-content {
      box-sizing: border-box;
      padding: 1rem 1.5rem;

    }
    .total {
      span {
        color: orange;
      }
    }
    .order-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        margin-bottom: 0.5rem;
      }
      .order-time {
        white-space: nowrap;
      }
    }

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
    .order-item {
      margin-bottom: 1rem;
      .author {
        margin-right: 1rem
      }
      .course-detail {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 0.5rem;

        img {
          max-width: 38%;
          margin-right: 4%;
          border-radius: 1rem;
        }
        .course-info {
          max-width: 58%;
        }
        .course-title {
          line-height: 2;
          font-size: 1.1rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .course-desc {
          padding: 0;
          line-height: 1.25;
          color: gray;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            color: gray;
            font-size: 0.8rem;
          }
        }
      }
      .order-detail {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        span {
          color: gray;
        }
      }
    }
    .my-order-content {
      position: relative;
    }
    .not-pay {
      background: #2999f0;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.25rem;
      position: absolute;
      top: 0;
      z-index: 1000;
      width: 100%;
      height: 1.5rem;
      left: 0;
      box-sizing: border-box;
      span {
        color: #ffffff;
      }
    }

  }


</style>
