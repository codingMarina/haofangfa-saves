<template>
  <div class="make-buy-now-order" id="">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <!--订单列表-->
    <div class="order-list">
      <div class="shop-item" v-if="type==2">
        <img v-if="courseChapterEntity.imgpath" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath" @error="setErrorImg" alt="">
        <div class="item-detail">
          <p class="title" v-text="courseChapterEntity.chaptername"></p>
          <div>
            <span v-if="courseChapterEntity.wfSpeakerEntity" v-text="'讲师：'+courseChapterEntity.wfSpeakerEntity.speakername"></span>
            <span v-text="'销量：'+courseChapterEntity.chaptersalenumber"></span>
          </div>
          <div class="price" v-text="'￥'+courseChapterEntity.chapterprice"></div>
        </div>
      </div>
      <div class="shop-item" v-if="type==1">
        <img v-if="courseInfoEntity.courseimgurl" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseInfoEntity.courseimgurl" @error="setErrorImg" alt="">
        <div class="item-detail">
          <p class="title" v-text="courseInfoEntity.coursename"></p>
          <div>
            <span v-if="courseInfoEntity.wfSpeakerEntity"
                  v-text="'讲师：'+courseInfoEntity.wfSpeakerEntity.speakername"></span>
            <span v-text="'销量：'+courseInfoEntity.coursesalenumber"></span>
          </div>
          <div class="price" v-text="'￥'+courseInfoEntity.activityprice"></div>
        </div>
      </div>
      <div class="shop-item" v-if="type==3">
        <img v-if="vipCardEntity.cardimg" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+vipCardEntity.cardimg" @error="setErrorImg" alt="">
        <div class="item-detail">
          <p class="title" v-text="vipCardEntity.cardname"></p>
          <div>
              <span v-for="teacher in vipteacherList" v-if="teacher.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity"
                v-text="'讲师：'+teacher.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
            <span v-text="'销量：'+vipCardEntity.cardsalenumber"></span>
          </div>
          <div class="price" v-text="'￥'+vipCardEntity.cardprice"></div>
        </div>
      </div>
    </div>
    <group>
      <cell title="活动" v-if="activity" :value="activity.title"></cell>
      <cell title="优惠券" v-if="coupon&&hasCoupon" :value="coupon.title" is-link @click.native="chooseCoupon"></cell>
      <cell title="优惠券" v-if="coupon&&!hasCoupon" value="暂无可用优惠券" is-link></cell>
    </group>
    <group>
      <check-icon :value.sync="chooseIcons">
        <div>
          <span v-text="'铜钱  '+coins"></span>
        </div>
      </check-icon>
    </group>
    <group>
      <cell title="商品金额" class="orange" :value="'￥'+price"></cell>
      <cell title="活动优惠" v-if="activity" class="orange" :value="'-￥'+activity.cost"></cell>
      <cell title="优惠券" v-if="coupon" class="orange" :value="'-￥'+payCoupon"></cell>
      <cell title="铜钱" class="orange" :value="'-￥'+payCoins"></cell>
    </group>
    <group>
      <cell title="实付款" class="orange" :value="payMoney"></cell>
    </group>
    <group>
      <cell title="支付方式" value="微信支付"></cell>
    </group>
    <div class="to-submit-order">
      <div class="tip">
        温馨提示：课程一经购买成功，不得退款、转让。
      </div>
      <div class="deal-money">
        <div class="money" v-text="'实付款￥'+payMoney"></div>
        <div class="submit-order" @click="submitOrder">提交订单</div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  import {Cell, Group, CheckIcon} from 'vux'

  export default {
    name: '',
    data() {
      return {
        coupon: {cost: 0},
        price: 100,
        coins: 0,
        activity: {cost: 0},
        cartList: [],
        chooseIcons: true,
        chooseGold: true,
        payCoupon: 0,
        payCoins: 0,
        goods: {},
        id: '',
        type: '',
        courseChapterEntity: {},
        courseInfoEntity: {},
        vipCardEntity: {},
        vipteacherList:[],
        hasCoupon:true,
        isMyLoading:true
      }
    },
    computed: {
      // 计算属性的 getter
      payMoney: {
        get: function () {
          /*如果有优惠活动*/
          //            1.课程金额-活动满减金额
          if (Number(this.price) - Number(this.activity.cost) > 0) {
            let remainer = Number(this.price) - Number(this.activity.cost)
//            2.剩余金额-优惠券
            if (Number(remainer.toFixed(2)) - Number(this.coupon.cost) > 0) {
              remainer = Number(remainer.toFixed(2)) - Number(this.coupon.cost)
//              消耗掉优惠券
              this.payCoupon = this.coupon.cost

//              3.1选择铜钱
              if (this.chooseIcons) {
//                console.log('.....选择铜钱.....')
//                铜钱不够用
                if (Number(remainer.toFixed(2)) - Number(this.coins) > 0) {
                  remainer = Number(remainer.toFixed(2)) - Number(this.coins)
//                  消耗掉所有铜钱
                  this.payCoins = Number(this.coins)
                  return remainer.toFixed(2)
                } else {
//                  铜钱够用
                  this.payCoins = remainer.toFixed(2)
                  return 0
                }
              } else {
//                没选铜钱
                this.payCoins = 0
                return Number(remainer).toFixed(2)
              }


            } else {
//            活动满减+优惠券已足够
              this.payCoupon = this.coupon.cost.toFixed(2)
              this.payCoins = 0
              return 0
            }

          } else {
//            活动满减已足够
            this.payCoupon = 0
            this.payCoins = 0
            return 0
          }
        },
        set: function (newVal) {
        }
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
      this.id = this.$route.query.id
      this.price = this.$route.query.price
      this.type = this.$route.query.type
    },
    mounted() {
      document.title = '支付'
      this.getAvailableCoupon()
      this.getGoodsDetail()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.hideMenu()
    },
    components: {
      Cell, Group, CheckIcon
    },
    methods: {
      getAvailableCoupon() {
        let params = {
          url: '/wfcm-api/order/toCal',
          data: {'token': localStorage.token, 'price': this.price}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            if (data.resultList.length > 0) {
              this.hasCoupon=true
              if (this.$route.query.couponItem) {
                this.coupon = this.$route.query.couponItem

              } else {
                this.coupon = data.resultList[0]

              }
            }else{
              this.hasCoupon=false
            }
            if (data.activity) {
              this.activity = data.activity
              console.log(this.price)
              console.log(data.activity)
            }
            if (data.coins) {
              this.coins = data.coins
            }
          } else {
            console.log(data.msg)
          }
        })
      },
      setErrorImg(e){
        e.srcElement.src='/static/img/no-pic.jpg'
      },
      getGoodsDetail() {
        if (this.type == 2) {
          let params = {
            url: '/wfcm-api/course/courseChapter',
            data: {'token': localStorage.token, 'chapterId': this.id}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              // 赋值
              this.courseChapterEntity = data.courseChapterEntity
              console.log('章节', this.courseChapterEntity)
              this.$nextTick(()=>{
                this.isMyLoading=false
              })
            } else {
              console.log(data.msg)
            }
          })
        } else if (this.type == 1) {
          console.log(this.type)
          let params = {
            url: '/wfcm-api/course/courseInfo',
            data: {'token': localStorage.token, 'courseId': this.id}
          }
          util.bginterface(params, data => {
            console.log(data)
            if (data.errCode == 0) {
//             赋值
              this.courseInfoEntity = data.courseInfoEntity
              console.log('课程', this.courseInfoEntity.courseimgurl)
            } else {
              console.log(data.msg)
            }
          })
        } else if (this.type == 3) {
          let params = {
            url: '/wfcm-api/course/vipCard',
            data: {'token': localStorage.token, 'vipCardId': this.id}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              this.vipCardEntity = data.vipCardEntity
              this.vipteacherList=data.vipteacherList
              console.log(data)
              console.log('课程包', this.vipCardEntity)
            } else {
              console.log(data.msg)
            }
          })
        } else {
          console.log('参数错误')
        }

      }
      ,
      change(val, label) {
        console.log('change', val, label)
      }
      ,
      chooseCoupon() {
        if(this.hasCoupon){
          this.$router.replace({path: '/availableCoupon', query: {'price': this.price,'id':this.id,'type':this.type}})
        }

      }
      ,
      submitOrder() {
        console.log('商品金额：', this.price)
        console.log('花费铜钱：', this.payCoins)
        console.log('剩余铜钱：', (this.coins - this.payCoins).toFixed(2))
        console.log('优惠券：', this.payCoupon)
        console.log('活动：', this.activity.cost)
        console.log('实际支付：', this.payMoney)
      }
    }
  }
</script>
<style lang="less">
  .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before {
    color: orange !important;
  }

  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
    color: orange !important;
  }

  .make-buy-now-order {
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    padding-bottom: 6rem;
    .shop-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      img {
        max-width: 46%;
        margin-right: 4%;
        border-radius: 0.5rem;
      }
      .item-detail {
        width: 50%;
        text-align: left;
        .title {
          font-weight: bold;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        div {
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            color: gray;
          }
          span:first-child {
            margin-right: 1rem;
          }
        }
        .price {
          color: orange;
        }
      }
    }
    .weui-cell {
      padding: 0.5rem 0;
    }
    .weui-cell__bd {
      p {
        font-size: 1rem;
      }
    }
    .vux-label, .weui-cell__ft {
      font-size: 1rem !important;
    }
    .orange {
      .weui-cell__ft {
        color: orange;
      }
    }

    .to-submit-order {
      position: fixed;
      z-index: 1000;
      bottom: 0;
      left: 0;
      width: 100%;

      .tip {
        background: #fff3dc;
        padding: 0.75rem 1.5rem;
      }
      .deal-money {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        background: #ffffff;
        div {
          font-size: 1.25rem;
          color: #f97927;
          span {
            color: #f97927;
            font-size: 1.25rem;
          }
        }
        .money {
          margin-right: 1rem;
          padding: 0.75rem;
          font-size: 1.25rem;
        }
        .submit-order {
          background: #f97927;
          color: #ffffff;
          padding: 0.75rem 1.5rem;

        }
      }
    }
    .vux-check-icon {
      width: 100%;
      font-size: 1rem;
      margin-bottom: 1rem;
      i {
        float: right;
      }
      span {
        float: left;
      }
    }
    .weui-icon-success-circle, .weui-icon-success, .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
      color: orange !important;
    }
    .vux-check-icon:after {
      content: '';
      display: block;
      height: 0;
      overflow: hidden;
      clear: both;
    }
  }

  .weui-cells:before, .weui-cells:after, .weui-cell:before, .weui-cell:after {
    border: 1px solid transparent !important;
  }
</style>
