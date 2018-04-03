<template>
  <div class="course-detail" id="course-detail">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <div class="toShare" v-if="toShare">
      <img class="lead-to-share" src="../assets/leadtoshare.png" alt="">
      <img @click="toShare=false" class="i-know" src="../assets/iknow.png" alt="">
    </div>
    <!--章节顶部封面-->
    <div class="chapter-poster" v-if="courseChapterEntity.courseimgurl">
      <!--课程图片-->
      <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.courseimgurl" @error="setErrorImg"
           alt="">
      <div v-if="!isShowCart">
        <!--音频-->
        <div class="diy-audio" v-if="videoType==3">
          <audio controls :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath"
                 controlsList="nodownload"></audio>
        </div>
        <!--视频-->
        <div class="my-video" v-if="courseChapterEntity.courseimgurl && videoType==4">
          <my-video :mysrc="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath"
                    :myposter="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.courseimgurl"></my-video>
        </div>
      </div>

    </div>
    <div class="course-desc">
      <p class="title" v-text="courseChapterEntity.coursename"></p>
      <p class="desc" v-text="courseChapterEntity.coursedesc"></p>
      <div class="details">
        <p class="price">
          <span v-if="courseChapterEntity.activityprice>0" class="orignal-price"
                v-text="'￥'+courseChapterEntity.orignalprice"></span>
          <span v-if="courseChapterEntity.activityprice>0" class="activity-price"
                v-text="'￥'+courseChapterEntity.activityprice"></span>
          <span v-if="courseChapterEntity.activityprice==0" class="activity-price">免费</span>
        </p>
        <p class="author"><span v-text="'主讲：'+wfSpeakerEntity.speakername"></span></p>
        <p class="sales-num" v-text="'销量：'+courseChapterEntity.coursesalenumber"></p>
        <!--<p class="played-num" v-text="'播放：'+courseChapterEntity.coursesalenumber+'次'"></p>-->

      </div>
    </div>
    <div class="funcs">
      <!--<div class="func-item" @click="support()">-->
      <!--<img src="../assets/support.png" alt="" :class="{'suc-sup':sucSup}">-->
      <!--<p v-text="greatTotal>0?greatTotal:'点赞'"></p>-->
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
    <!--tab-list-->
    <div class="tab-list"  style="height:44px;">
      <sticky ref="sticky" :offset="0" :check-sticky-support="false">
        <tab :line-width="2" :class="{'two-vux-tab-ink-bar':courseChapterEntity.activityprice>0}">
          <tab-item selected @click.native="chaneTab(0)">介绍</tab-item>
          <tab-item @click.native="chaneTab(1)">相关</tab-item>
          <!--<tab-item @click.native="chaneTab(2)" v-if="courseChapterEntity.activityprice==0">评论-->
          <!--<span class="bedge" v-text="commentTotal"></span>-->
          <!--</tab-item>-->
        </tab>
      </sticky>
    </div>
    <!--tab-content-->
    <div class="tab-contents">
      <!--TAB1-介绍-->
      <div class="tab-content" v-show="showNum==0">
        <!--章节介绍-->
        <div class="chapter-desc">
          <div class="title">
            <span class="highlight">「内容介绍」</span>
          </div>
          <div class="desc" id="chapterDesc" v-html="courseChapterEntity.coursedetails"></div>
        </div>
        <!--讲师介绍-->
        <div class="teacher-info" v-if="wfSpeakerEntity">
          <div class="title">
            <span class="highlight">「讲师介绍」</span>
          </div>
          <div class="desc" id="teacherDesc" v-html="wfSpeakerEntity.speakerdesc"></div>
        </div>
      </div>
      <!--TAB2-目录-->
      <div class="tab-content" v-show="showNum==1" v-if="courseid>=0">
        <div class="title">
          <span class="highlight">「课程内容」</span>
        </div>
        <div class="chapter-list">
          <div class="chapter-item" v-for="(item,index) in courseList" :key="index" @click="toChapterDetail(item.id)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.imgpath" @error="setErrorImg">
            <div class="chapter-desc">
              <p class="title" v-text="item.chaptername"></p>
              <p v-text="item.chaptersubtitle"></p>
              <div class="price-box">
                <p class="sales-num" v-if="parseInt(item.chapterprice)>0" v-text="'销量:'+item.chaptersalenumber"></p>
                <p class="activity-price" v-text="parseInt(item.chapterprice)>0?('￥'+item.chapterprice+'/套'):'免费'"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--TAB3-评论-->
      <div class="comments" v-show="showNum==2">
        <span class="comment-title">评论</span>
        <ul class="comment-list">
          <li class="comment-item" v-for="(item,index) in commentList" :key="index">
            <img class="user-avatar" src="../assets/logo.png" alt="" v-if="!item.memberEntity.thumbimg">
            <img class="user-avatar" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.memberEntity.thumbimg"
                 @error="setErrorImg"
                 alt="" v-if="item.memberEntity.thumbimg">
            <div class="item-info">
              <div class="user-info">
                <span v-text="item.memberEntity.username"></span>
                <span class="time" v-text="item.commenttime"></span>
              </div>
              <div class="comment-content" v-text="item.commentcontent">
              </div>
            </div>
          </li>
        </ul>
        <!--评论输入框-->
        <div class="my-input" v-if="hasBuy">
          <div class="avatar">
            <img src="../assets/logo.png" alt="">
          </div>
          <div class="main">
            <input type="text" class="form-control" placeholder="我来说两句">
          </div>
          <div class="send">
            <button class="btn mini">发送</button>
          </div>
        </div>
      </div>
    </div>
    <!--购买入口-->
    <div class="purchase" v-if="isShowCart">
      <div class="price">
        <p class="activity-price"
           :class="{'big-price':parseInt(courseChapterEntity.orignalprice)==parseInt(courseChapterEntity.activityprice)}"
           v-text="'￥'+courseChapterEntity.activityprice"></p>
        <p class="orignal-price"
           v-if="parseInt(courseChapterEntity.orignalprice)>parseInt(courseChapterEntity.activityprice)"
           v-text="'￥'+courseChapterEntity.orignalprice"></p>
      </div>
      <!--<div class="cartList" @click="toShopCart">-->
        <!--<span class="iconfont icon-gouwuche">-->
          <!--<span class="cart-num" v-if="parseInt(cartTotal)>0" v-text="cartTotal"></span>-->
        <!--</span>-->
      <!--</div>-->
      <!--<div class="addToCart" @click="addToCart">-->
        <!--<span class="iconfont icon-iconset0313"></span>-->
      <!--</div>-->
      <div class="cartList" @click="toShopCart">
        <span class="shop-cart">
          <span class="cart-num" v-if="parseInt(cartTotal)>0" v-text="cartTotal"></span>
        </span>
      </div>
      <div class="addToCart" @click="addToCart">
        <span class="add-shop-cart"></span>
      </div>
      <div class="buy" @click="toBuyNow(courseid,courseChapterEntity.activityprice,1)">
        立即购买
      </div>
    </div>
    <!--已购买入口-->
    <div class="purchased" v-if="!isShowCart" @click="toStudy(courseid)">立即听课</div>
    <toast v-model="hasToast" :text="toastMsg"></toast>
  </div>
</template>

<script>
  import myVideo from '../components/myVideo.vue'
  import util from '../util'
  import {Tab, TabItem, Sticky, Toast} from 'vux'

  export default {
    name: '',
    data() {
      return {
        cartTotal: 0,
        toShare: false,
        hasToast: false,
        sucSup: true,
        toastMsg: '',
        showNum: 0,
        courseid: -1,
        commentTotal: 0,
        playTotal: 0,
        courseChapterEntity: {},
        wfSpeakerEntity: {},
        greatTotal: 0,
        pageNum: 1,
        commentList: [],
        isShowMoreBtn: false,
        videoType: -1,
        courseList: [],
        hasBuy: false,
        fromMyCourse: false,
        isShowCart: false,
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
    befoteMount() {
      console.log('befoteMount')
    },
    mounted() {
      this.init()
      this.getCartTotal()
      this.fromMyCourse = this.$route.query.hasbuy
      if (this.fromMyCourse) {
        if (document.querySelector('.vux-tab-ink-bar')) {
          document.querySelector('.vux-tab-ink-bar').setAttribute('style', 'margin-left:14.5%;margin-right:14.5%;')
        }
      }
//      微信JS-SDK
      util.wxConfig(window.location.href.split('#')[0])
    },
    components: {
      myVideo, Tab, TabItem, Sticky, Toast
    },
    methods: {
      init() {
        this.courseid = this.$route.query.id
//       课程
        if (parseInt(this.courseid) >= 0) {
          console.log(this.courseid)
          let params = {
            url: '/wfcm-api/course/courseInfo',
            data: {'token': localStorage.token, 'courseId': this.courseid}
          }
          util.bginterface(params, data => {
            console.log('课程', data)
            if (data.errCode == 0) {
//             赋值
              this.courseChapterEntity = data.courseInfoEntity
              this.wfSpeakerEntity = data.courseInfoEntity.wfSpeakerEntity
              this.courseList = data.chapterlist
              console.log(data.chapterlist)
              this.isShowCart = (data.courseInfoEntity.coursetype == 2) && (data.access == -1)
              let query={
                desc:this.courseChapterEntity.coursedesc,
                img:'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+this.courseChapterEntity.courseimgurl,
                url:'http://wftest.wfkids.net/courseDetail?id='+this.$route.query.id+'&fromApp=true'
              }
              if(this.courseChapterEntity.courseimgurl&&this.courseChapterEntity.coursedesc){
                util.detailShare(query)
              }
              let name=this.courseChapterEntity.coursename

//              判断音频/视频
              if (this.courseChapterEntity.videopath) {
                this.videoType = this.courseChapterEntity.videopath.split('')[this.courseChapterEntity.videopath.length - 1]
              }
              //      设置样式
              this.$nextTick(function () {
                this.isMyLoading = false
              })
            } else {
              console.log(data.msg)
            }
          })
        }
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
            'type': 1,
            'price': this.courseChapterEntity.activityprice
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
            console.log(data)
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
          data: {'token': localStorage.token, 'chapterid': this.courseid, 'commenttype': 1}
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
          data: {'token': localStorage.token, 'foreignId': this.courseid, 'type': 1}
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
      chaneTab(n) {
        this.showNum = n
      },
      toChapterDetail(chapterid) {
        this.$router.push({path: '/chapterDetail', query: {id: chapterid, hasbuy: this.fromMyCourse}})
      },
      toStudy(id) {
        if (parseInt(this.courseChapterEntity.activityprice) == 0) {
          console.log('人家是免费课')
          this.$router.push({path: '/chapterDetail', query: {id: this.courseList[0].id}})
        } else {
          this.$router.push({path: '/myCourseChapter', query: {id}})
        }
      }
    }
  }
</script>
<style lang="less">
  #course-detail {
    padding-bottom: 3rem;
    .author{
      span {
        color: gray;
      }
    }
    .func-item{
      p{
        color: gray;
        font-size: 0.8rem;
      }
      margin-bottom: 0.2rem;
    }
    .vux-tab-ink-bar {
      margin-left: 23% !important;
    }
    .highlight {
      color: #91c0e6;
      line-height: 2;
    }
    .vux-sticky-box {
      width: 100%;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      position: relative;
      color: #333333;
      border: none;
    }
    .chapter-poster {
      img {
        max-width: 100%;
      }
      .diy-audio {
        audio {
          width: 100%;
        }
      }
    }
    .price-box{
      display: flex;
      align-items: center;
      justify-content: space-between;

    }
    .sales-num{
      color: gray;
    }
    .tab-contents {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      .chapter-title {
        .title {
          font-size: 1.2rem;
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
          span {
            color: gray;
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
          width: 100%;
          box-sizing: border-box;
          padding: 0.5rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            max-width: 45%;
            border-radius: 1rem;
            margin-right: 5%;
          }
          .chapter-desc{
            width: 50%;
            p{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: gray;
              line-height: 2;
            }
            .title{
              color: #333333;
            }
          }
        }

      }

      .comments {
        padding-bottom: 45px;
        box-sizing: border-box;
        .comment-item {
          border-bottom: 1px solid lightgrey;
          display: flex;
          align-items: flex-start;
          padding-top: 1rem;
          justify-content: flex-start;
          .user-avatar {
            width: 3rem;
            height: 3rem;
            margin-right: 1rem;
            border-radius: 50%;
          }
          .user-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 0.85rem;
            }
            .time {
              color: gray;
            }
          }
          .comment-content {
            padding: 1rem 0;
          }
          .item-info {
            width: 100%;
          }
        }
      }

      .my-input {
        height: 42px;
        position: fixed;
        z-index: 1000;
        width: 100%;
        left: 0;
        bottom: 0;
        box-sizing: border-box;
        padding: 0.25rem 1rem;
        background: #dadada;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .avatar {
          width: 10%;
          height: 100%;
          img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 50%;
          }
        }
        .send {
          width: 20%;
          text-align: center;
          .btn {
            background: lightseagreen;
            color: #ffffff;
          }
        }
        .main {
          width: 68%;
          background: #ffffff;
          border-radius: 10px;
          text-align: center;
          input {
            border: none;
            width: 100%;
            box-sizing: border-box;
            padding: 0.5rem 1rem;
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

    .my-video {
      width: 100%;
      overflow-x: hidden;
      img {
        max-width: 100%;
      }
      .diy-audio {
        width: 100%;
        audio {
          width: 100%;
        }
      }
    }

    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100% !important;
        height: auto;
      }
    }

    .suc-sup {
      animation: minMax .5s linear;
    }
    .toShare {
      width: 100%;
      height: 100%;
      position: fixed;
      background: rgba(0, 0, 0, 0.3);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      img {
        position: absolute;
      }
      .lead-to-share {
        max-width: 80%;
        top: 0;
        left: 12%;
      }
      .i-know {
        top: 57%;
        left: 37%;
        right: 37%;
      }
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
