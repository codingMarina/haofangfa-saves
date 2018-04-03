<template>
  <div class="chapter-detail" id="card-detail">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <div class="toShare" v-if="toShare">
      <img class="lead-to-share" src="../assets/leadtoshare.png" alt="">
      <img @click="toShare=false" class="i-know" src="../assets/iknow.png" alt="">
    </div>
    <!--章节顶部封面-->
    <div class="chapter-poster" v-if="courseChapterEntity.cardimg">
      <!--课程图片-->
      <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.cardimg" @error="setErrorImg"
           alt="">
    </div>
    <div class="top-box">
      <div class="chapter-title">
        <p class="title" v-text="courseChapterEntity.cardname"></p>
        <p class="desc" v-text="courseChapterEntity.carddesc"></p>
        <p class="details">
              <span class="detail">主讲人：
                <span v-for="item in wfSpeakerEntity">
                  <span v-if="wfSpeakerEntity.length==0"
                        v-text="item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                  <span v-if="wfSpeakerEntity.length>0"
                        v-text="item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span>
                </span>
              </span>
          <span class="detail">
                <span v-if="courseChapterEntity.cardprice>0" class="activity-price"
                      v-text="'￥'+courseChapterEntity.cardprice"></span>
                <span v-if="courseChapterEntity.cardprice==0" class="activity-price">免费</span>
                <span v-if="courseChapterEntity.cardorignalprice>0" class="orignal-price"
                      v-text="'￥'+courseChapterEntity.cardorignalprice"></span>
              </span>
          <span class="detail"><span>销量：</span><span v-text="courseChapterEntity.cardsalenumber"></span></span>
        </p>
      </div>
    </div>
    <div class="funcs">
      <!--<div class="func-item" @click="support()">-->
      <!--<img src="../assets/support.png" alt="" :class="{'suc-sup':sucSup}">-->
      <!--<p v-text="greatTotal"></p>-->
      <!--</div>-->
      <div class="func-item" @click="favorite()">
        <img src="../assets/favorite.png" alt="" :class="{'suc-sup':sucSup}">
        <p>收藏</p>
      </div>
      <div class="func-item" @click="toShare=true">
        <img src="../assets/share.png" alt="">
        <p>分享</p>
      </div>
    </div>
    <div class="divider"></div>
    <!--tab-content-->
    <div class="tab-contents">
      <div class="tab-content">

        <!--内容介绍-->
        <div class="chapter-desc">
          <div class="title">
            <span class="highlight">「内容介绍」</span>
          </div>
          <div class="desc" id="chapterDesc" v-html="courseChapterEntity.carddetail"></div>
        </div>
        <!--讲师介绍-->
        <div class="teacher-info" v-if="wfSpeakerEntity">
          <div class="title">
            <span class="highlight">「讲师介绍」</span>
          </div>
          <div id="teacherDesc">
            <div class="desc teacherDesc" v-for="item in wfSpeakerEntity"
                 v-html="item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakerdesc">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--购买入口-->
    <div class="purchase" v-if="isShowCart">
      <div class="price">
        <p class="activity-price"
           :class="{'big-price':parseInt(courseChapterEntity.cardorignalprice)==parseInt(courseChapterEntity.cardprice)}"
           v-text="'￥'+courseChapterEntity.cardprice"></p>
        <p class="orignal-price"
           v-if="parseInt(courseChapterEntity.cardorignalprice)>parseInt(courseChapterEntity.cardprice)"
           v-text="'￥'+courseChapterEntity.cardorignalprice"></p>
      </div>
      <div class="cartList" @click="toShopCart">
        <span class="shop-cart">
          <span class="cart-num" v-if="parseInt(cartTotal)>0" v-text="cartTotal"></span>
        </span>
      </div>
      <div class="addToCart" @click="addToCart">
        <span class="add-shop-cart"></span>
      </div>
      <div class="buy" @click="toBuyNow(cardid,courseChapterEntity.cardprice,3)">立即购买</div>
    </div>
    <!--已购买入口-->
    <div class="purchased" v-if="!isShowCart" @click="toStudy(cardid)">立即听课</div>
    <toast v-model="hasToast" :text="toastMsg"></toast>
  </div>
</template>

<script>
  import util from '../util'
  import {Toast} from 'vux'

  export default {
    name: '',
    data() {
      return {
        toShare: false,
        hasToast: false,
        sucSup: true,
        toastMsg: '',
        cardid: -1,
        commentTotal: 0,
        playTotal: 0,
        courseChapterEntity: {},
        wfSpeakerEntity: [],
        greatTotal: 0,
        pageNum: 1,
        commentList: [],
        isShowMoreBtn: false,
        videoType: -1,
        courseList: [],
        hasBuy: false,
        isShowCart: false,
        cartTotal: 0,
        isMyLoading: true
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
          localStorage.fromAppPath=location.pathname
          localStorage.fromAppQuery=window.location.search.split('&')[0].split('id=')[1]
          this.$router.push({path: '/',query:{fromApp:window.location.href.split('&fromApp=')[1]}})
        }
      })
    },
    mounted() {
      this.init()
      this.getCartTotal()
      util.wxConfig(window.location.href.split('#')[0])
    },
    components: {
      Toast
    },
    methods: {
      init() {
        this.cardid = this.$route.query.id
        let params = {
          url: '/wfcm-api/course/vipCard',
          data: {'token': localStorage.token, 'vipCardId': this.cardid}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.courseChapterEntity = data.vipCardEntity
            this.wfSpeakerEntity = data.vipteacherList
            this.isShowCart = (data.access == -1)
            let name=this.courseChapterEntity.cardname
            let query={
              desc:this.courseChapterEntity.carddesc,
              img:'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+this.courseChapterEntity.cardimg,
              url:'http://wftest.wfkids.net/cardDetail?id='+this.$route.query.id+'&fromApp=true'
            }
            wx.ready(function () {
              wx.showAllNonBaseMenuItem();
            })
            if(this.courseChapterEntity.carddesc&&this.courseChapterEntity.cardimg){
              util.detailShare(query)
            }

            this.$nextTick(function () {
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
      toBuyNow(id, price, type) {
        this.$router.push({path: '/makeBuyNowOrder', query: {id, price, type}})
      },
      toShopCart() {
        this.$router.push({path: '/shopCart'})
      },
      addToCart() {
        let params = {
          url: '/wfcm-api/shoppingCart/addGoods',
          data: {
            'token': localStorage.token,
            'foreignId': this.courseChapterEntity.id,
            'type': 3,
            'price': this.courseChapterEntity.cardprice
          }
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            console.log(data)
            this.toastMsg = data.msg
            this.hasToast = true
            this.getCartTotal()
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            console.log(data.msg)

          }
        })
      },
      getCartTotal() {
        let params = {
          url: '/wfcm-api/shoppingCart/total',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.cartTotal = data.total
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            this.sucSup = false
            this.cartTotal = 0
          }
        })
      },
      support() {
        let params = {
          url: '/wfcm-api/courseOperation/H5add',
          data: {'token': localStorage.token, 'chapterid': this.cardid, 'commenttype': 1}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.toastMsg = '点赞成功!'
            this.hasToast = true
            this.sucSup = true
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            this.sucSup = false
          }
        })
      },
      favorite() {
        let params = {
          url: '/wfcm-api/favorite/add',
          data: {'token': localStorage.token, 'foreignId': this.cardid, 'type': 3}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.toastMsg = '收藏成功！'
            this.hasToast = true
            console.log(data)
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            this.sucSup = false
          }
        })
      },
      toStudy(id) {
        this.$router.push({path: '/myCardCourse', query: {id, hasbuy: true}})
      }
    }
  }
</script>
<style lang="less">

  #card-detail {
    .chapter-poster {
      img {
        max-width: 100%;
      }
    }
    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100% !important;
        height: auto;
      }
    }
    .tab-contents {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      .chapter-title {
        .title {
          font-size: 1rem;
          line-height: 1.8;
        }
        .desc {
          line-height: 1.8;
        }
        .details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 1.8;
          flex-wrap: wrap;
          span {
            color: #999999;
            white-space: nowrap;
          }
          .activity-price {
            color: rgb(250,145,69);
            margin-right: 0.5rem;
          }
          .orignal-price {
            text-decoration: line-through;
          }
        }
      }
      .chapter-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .chapter-item {
          width: 50%;
          box-sizing: border-box;
          padding: 0.5rem;
          margin-top: 1rem;
          img {
            max-width: 100%;
            border-radius: 1rem;
          }
          p {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 2;
            color: #999999;
            &:first-child {
              font-size: 1.1rem;
              color: #333333;
            }
          }
        }

      }

      .tab-list {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        padding: 1rem 1.5rem;
        text-align: center;
        li {
          width: 33.33%;
          a {
            display: inline-block;
            width: 100%;
            padding: 0.5rem 0;
            text-align: center;
          }
        }
        .active {
          border-bottom: 2px solid lightseagreen;
        }
      }
    }
    .top-box {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      /*margin-bottom: 1rem;*/
      .chapter-title {
        .title {
          line-height: 1.8;
        }
        .desc {
          font-size: 0.8rem;
          color: gray;
          line-height: 1.8;
        }
        .details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 3rem;
          white-space: nowrap;
          span {
            font-size: 0.8rem;
            color: #999999;
            /*flex: 1;*/
            text-align: center;
            white-space: nowrap;
          }
          .orignal-price {
            text-decoration: line-through;
            /*flex: 0.5;*/
          }
          .activity-price {
            color: rgb(250,145,69);
          }
        }
      }
      .funcs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .func-item {
          width: 100%;
          text-align: center;
          img {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      }
    }
    .highlight {
      color: #91c0e6;
      line-height: 2;
    }
    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100%;
      }
    }
    .funcs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      .func-item {
        width: 100%;
        text-align: center;
        img {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }
    .suc-sup {
      animation: minMax .5s linear;
    }
  }

  @keyframes minMax {
    0% {
      width: 1.2rem;
      height: 1.2rem;
    }
    50% {
      width: 2rem;
      height: 2rem;
    }
    100% {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

</style>
