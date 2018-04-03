<template>
  <div class="shop-cart">
    <!--编辑-->
    <div class="top text-right" v-if="cartList.length>0">
      <span @click="changeEditor" class="editor" v-text="!isToEditor?'编辑':'完成'">编辑</span>
    </div>
    <!--课程展示-->
    <div v-if="cartList.length>0">
      <!--章节-->
      <div  v-for="(item,index) in cartList" :key="'cart-chapter'+index" v-if="item.type==2">
        <div class="shop-item">
          <check-icon class="my-check" :value.sync="item.checked">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" alt="">
            <div class="item-detail">
              <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
              <div>
                <span v-text="'讲师：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></span>
                <span v-text="'销量：'+item.courseChapterEntity.chaptersalenumber"></span>
              </div>
              <div class="price" v-text="'￥'+item.courseChapterEntity.chapterprice"></div>
            </div>
          </check-icon>
        </div>
        <div class="divider"></div>
      </div>

      <!--课程-->
      <div v-for="(item,index) in cartList" :key="'cart-course'+index" v-if="item.type==1">
        <div class="shop-item">
          <check-icon class="my-check" :value.sync="item.checked">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl" alt="">
            <div class="item-detail">
              <p class="title" v-text="item.courseInfoEntity.coursename"></p>
              <div>
                <span v-text="'讲师：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                <span v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></span>
              </div>
              <div class="price" v-text="'￥'+item.courseInfoEntity.activityprice"></div>
            </div>
          </check-icon>
        </div>
        <div class="divider"></div>
      </div>

      <!--课程包-->
      <div v-for="(item,index) in cartList" :key="'cart-vip'+index" v-if="item.type==3">
        <div class="shop-item">
          <check-icon class="my-check" :value.sync="item.checked">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" alt="">
            <div class="item-detail">
              <p class="title" v-text="item.vipCardEntity.cardname"></p>
              <div>
              <span
                v-text="'讲师：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                <span v-text="'销量：'+item.vipCardEntity.cardsalenumber"></span>
              </div>
              <div class="price" v-text="'￥'+item.vipCardEntity.cardprice"></div>
            </div>
          </check-icon>
        </div>
        <div class="divider"></div>
      </div>

    </div>
    <div class="is-empty" v-if="cartList.length==0">
      <img src="../assets/empty.png" alt="">
      <h4>您的购物车竟然是空的~</h4>
    </div>
    <!--为您推荐-->
    <div class="text-center recommend">
      <!--<img src="../assets/weinintuijian.png" alt="">-->
      <p class="text-center">◇◇◇◆为你推荐◆◇◇◇</p>
    </div>
    <!--推荐课程-->
    <div class="course-by-type">
      <div class="course">
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in chineseList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in chineseList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in chineseList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in chineseList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in chineseList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in chineseList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartList.length>0">
      <!--结算-->
      <div class="pay-off" v-if="!isToEditor">
        <div class="part">
          <check-icon class="my-check" :value.sync="isCheckAll" @click.native="checkAll">全选</check-icon>
        </div>
        <div class="part">
          <span>合计：</span>
          <span class="money" v-text="'￥'+moneyTotal"></span>
        </div>
        <div class="to-pay part" @click="toPay">去结算<span v-text="'('+cartTotal+')'"></span></div>
      </div>
      <!--编辑-->
      <div class="pay-off" v-if="isToEditor">
        <div class="part">
          <check-icon class="my-check" :value.sync="isCheckAll" @click.native="checkAll">全选</check-icon>
        </div>
        <div class="part"></div>
        <div class="to-pay part" @click="toShowDeleteModal">删除<span v-text="'('+cartTotal+')'"></span></div>
      </div>
    </div>
    <!--确认删除-->
    <div v-transfer-dom>
      <confirm v-model="showDeleteModal" title="删除商品提醒" @on-confirm="onConfirmDelete">
        <p style="text-align:center;" v-text="'您确定将这'+cartTotal+'个课程删除吗？'"></p>
      </confirm>
    </div>
    <toast v-model="isShowToast" type="text" :text="toastMsg"></toast>
  </div>
</template>

<script>
  import util from '../util'
  import {CheckIcon, Confirm, TransferDomDirective as TransferDom, Toast} from 'vux'

  export default {
    name: '',
    data() {
      return {
        cartList: [],
        chineseList: [],
        isToEditor: false,
        showDeleteModal: false,
        isShowToast: false,
        toastMsg: ''
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
      this.init()
      this.getRecommend()
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.hideMenu()
    },
    components: {
      CheckIcon, Confirm, Toast
    },
    directives: {
      TransferDom
    },
    computed: {
      // 计算属性的 getter
      isCheckAll: {
        get: function () {
          let isAll = this.cartList.filter(item => item.checked)
          return isAll.length == this.cartList.length
        },
        set: function (newVal) {
        }
      },
      cartTotal: {
        get: function () {
          let isAll = this.cartList.filter(item => item.checked)
          return isAll.length
        },
        set: function () {
        }
      },
      moneyTotal: {
        get: function () {
          let total = 0
          this.cartList.map(item => {
            if (item.checked) {
              if (item.type == 2) {
                total += Number(item.courseChapterEntity.chapterprice)
              } else if (item.type == 1) {
                total += Number(item.courseInfoEntity.activityprice)
              } else if (item.type == 3) {
                total += Number(item.vipCardEntity.cardprice)
              }
            }
          })
          return total
        },
        set: function () {
        }
      },
      deleteItems: {
        get: function () {
          let items = []
          this.cartList.map(item => {
            if (item.checked) {
              items.push(item.id)
            }
          })
          return items.join(',')
        },
        set: function (newVal) {
        }
      },
    },
    methods: {
      init() {
        document.title = '购物车'
        let params = {
          url: '/wfcm-api/shoppingCart/goods',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          console.log('购物车',data)
          if (data.errCode == 0) {
            data.resultList.forEach(item => {
              item.checked = true
            })
            this.cartList = data.resultList
          } else {
            console.log(data.msg)
          }
        })
      },
      toDetail(to, id, item) {
        this.$router.push({path: to, query: {id}})
      },
      getRecommend() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 23, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.chineseList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      checkAll() {
        this.cartList.forEach(item => {
          item.checked = !item.checked
        })
      },
      onConfirmDelete() {
        console.log(this.deleteItems)
        let params = {
          url: '/wfcm-api/shoppingCart/delGoods',
          data: {'token': localStorage.token, 'goodsId': this.deleteItems}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.toastMsg = data.msg
            this.isShowToast = true
            this.init()
          } else {
            console.log(data.msg)
            this.toastMsg = data.msg
            this.isShowToast = true
          }
        })
      },
      toShowDeleteModal() {
        if (this.cartTotal > 0) {
          this.showDeleteModal = true
        } else {
          this.toastMsg = '您没有选择商品哦'
          this.isShowToast = true
        }
      },
      changeEditor() {
        this.isToEditor = !this.isToEditor
        if (this.isToEditor) {
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }

      },
      toPay() {
        if (this.cartTotal > 0) {
          let list = this.cartList.filter(item => item.checked == true)
          this.$router.push({path: '/makeOrder'})
          let newList = []
          let storageList = []
          list.forEach(item => {
            newList.push(JSON.stringify(item))
            return newList
          })
          storageList = newList.join('@@@')
          /*,query:{
            'price':this.moneyTotal,
            'cartList':list
          }*/
          localStorage.price = this.moneyTotal
          localStorage.cartList = storageList
        } else {
          this.isShowToast = true
          this.toastMsg = '您还没有选择商品'
        }

      },
    }
  }
</script>
<style lang="less">
  .shop-cart {
    .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
      color: rgb(250,145,69) !important;
    }
    .divider{
      height: 0.25rem;
    }
    .vux-check-icon > span {
      line-height: 23px;
      color: #222;
      vertical-align: middle;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .top {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
    }
    .shop-item{
      box-sizing: border-box;
      padding: 0.5rem 1rem;
    }
    .my-check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      /*margin-bottom: 0.5rem;*/
      img {
        max-width: 40%;
        margin-right: 4%;
        border-radius: 0.5rem;
      }
      .item-detail {
        width: 56%;
        text-align: left;
        .title {
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
            font-size: 0.8rem;
          }
          span:first-child {
            margin-right: 1rem;
          }
        }
        .price {
          color: rgb(250,145,69);
        }
      }
    }
    .recommend {
      img {
        max-width: 50%;
      }
      p {
        padding: 1rem;
        /*font-weight: bold;*/
        color: gray;
      }
    }
    .course-by-type {
      margin-bottom: 4rem;
      .show-more-btn {
        border-top: 1px solid lightgrey;
        padding: 0.5rem 1.5rem;
        p {
          text-align: center;
        }
      }
      .course{
        box-sizing: border-box;
        padding: 1rem 1.5rem 0;
      }
      .course-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid lightgrey;
        margin-bottom: 0.5rem;
        .title {
          position: relative;
          padding-left: 0.5rem;
          border-left: 3px solid orange;
          font-size: 1.2rem;
          margin: 0 !important;
        }
        .show-more {
          color: #9f9f9f;
          font-size: 0.8rem;
          span {
            color: #9f9f9f;
            font-size: 0.8rem;
          }
        }
      }
      .big-mode {
        margin-bottom: 1rem;
        border-radius: 0.5rem;
        border: 1px solid lightgrey;
        img {
          max-width: 100%;
          border-radius: 0.5rem;
        }
        .desc {
          box-sizing: border-box;
          padding: 0.5rem 1rem;
          .detail {
            .title {
              font-weight: bold;
            }
            .author, .sales-num {
              color: gray;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-price {
              color: rgb(250,145,69);
            }
          }
          .author, .price p {
            font-size: 0.8rem;
          }
          .title, .sub-title {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

      }
      .four-pics-mode-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .four-pics-mode {
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #eeeeee;
          width: 48%;
          img {
            max-width: 100%;
            border-radius: 0.5rem;
          }
          .desc {
            padding: 0.25rem;
            font-size: 0.8rem;
            color: gray;
            .detail {
              .title {
                /*font-weight: bold;*/
                line-height: 1.5;
              }
              .author, .sales-num,.sub-title {
                color: gray;
                line-height: 1.5;
              }
            }
            .author, .price p,.sales-num {
              font-size: 0.8rem;
              line-height: 1.5;
            }
            .title, .sub-title {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              line-height: 1.5;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-num{
              color: gray;
            }
            .sales-price {
              color: rgb(250,145,69);
            }
          }
        }
      }
      .list-mode {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        overflow-x: hidden;
        img {
          max-width: 45%;
          border-radius: 0.5rem;
        }
        .desc {
          box-sizing: border-box;
          padding: 0.5rem;
          width: 55%;
          .detail {
            .title {
              /*font-weight: bold;*/
            }
            .author, .sales-num {
              color: gray;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-price {
              color: rgb(250,145,69);
            }
          }
          .author, .price p {
            font-size: 0.8rem;
          }
          .title, .sub-title {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

      }

    }
    .pay-off {
      position: fixed;
      z-index: 1000;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      left: 0;
      bottom: 0;
      div.part {
        width: 40%;
        height: 3rem;
        box-sizing: border-box;
        padding: 0.75rem;
        text-align: center;
        white-space: nowrap;
      }
      div.part:first-child {
        width: 30%;
      }
      .to-pay {
        background: orangered;
        color: #ffffff;
        text-align: left;
        width: 30%;
        span {
          color: #ffffff;
          text-align: left;
        }
      }
      .my-check {
        justify-content: center;
      }
      .money {
        color: orange;
      }
    }
    .weui-icon-circle {
      color: orange;
      font-weight: bold;
    }
  }
</style>
