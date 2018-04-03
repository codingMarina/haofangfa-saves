<template>
  <div class="chapter-detail" id="chapter-detail">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <div class="toShare" v-if="toShare">
      <img class="lead-to-share" src="../assets/leadtoshare.png" alt="">
      <img @click="toShare=false" class="i-know" src="../assets/iknow.png" alt="">
    </div>
    <!--章节顶部封面-->
    <div class="chapter-poster" v-if="courseChapterEntity.imgpath">
      <!--课程图片-->
      <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath" @error="setErrorImg" alt=""
           v-if="courseChapterEntity.imgpath&&videoType!=4">
      <div v-if="!isShowCart">
        <!--音频-->
        <div class="diy-audio" v-if="courseChapterEntity.imgpath &&videoType==3">
          <audio @play="isPlayAudio(chapterid)" controls
                 :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath"
                 controlsList="nodownload"></audio>
        </div>
        <!--视频-->
        <div class="my-video" v-if="courseChapterEntity.imgpath && videoType==4">
          <my-video :mysrc="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath"
                    :myposter="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath"
                    :chapterid="courseChapterEntity.id" @getPlayTotal="getPlayTotal"></my-video>
        </div>
      </div>
    </div>
    <div class="top-box">
      <div class="chapter-title">
        <p class="title" v-text="courseChapterEntity.chaptername"></p>
        <p class="desc" v-text="courseChapterEntity.chaptersubtitle"></p>
        <div class="details">
          <p>
            <span class="orignal-price" v-show="parseInt(courseChapterEntity.chapterorignalprice)>0"
                  v-text="'￥'+courseChapterEntity.chapterorignalprice"></span>
            <span class="activity-price"
                  v-text="parseInt(courseChapterEntity.chapterprice)>0?('￥'+courseChapterEntity.chapterprice):'免费'"></span>
          </p>
          <p class="detail" v-text="'主讲人：'+wfSpeakerEntity.speakername"></p>
          <p class="detail" v-if="parseInt(courseChapterEntity.chapterprice)>0"
             v-text="'销量：'+courseChapterEntity.chaptersalenumber"></p>
          <p class="detail" v-text="'播放次数：'+playTotal"></p>
          <!--<span class="detail" @click="support(courseChapterEntity)">-->
          <!--<span class="iconfont icon-jushoucang" v-if="!hasSupport"></span>-->
          <!--<span class="iconfont icon-dianzan" :class="{'support-active':hasSupport}" v-if="hasSupport"></span>-->
          <!--<span v-text="greatTotal"></span>-->
          <!--</span>-->
        </div>

      </div>
    </div>
    <div class="funcs">
      <div class="func-item" @click="support()">
        <img src="../assets/support.png" alt="" :class="{'suc-sup':sucSup}">
        <p v-text="greatTotal"></p>
      </div>
      <div class="func-item" @click="favorite()">
        <img src="../assets/favorite.png" alt="" :class="{'suc-sup':sucSup}">
        <p>收藏</p>
      </div>
      <div class="func-item" @click="toShare=true">
        <img src="../assets/share.png" alt="">
        <p>分享</p>
      </div>
      <div class="func-item" @click="showModal=true">
        <img src="../assets/toDownload.png" alt="">
        <p>下载</p>
      </div>
    </div>
    <div class="divider"></div>
    <!--tab-list-->
    <div class="tab-list" style="height:44px;">
      <sticky ref="sticky" :offset="0" :check-sticky-support="false">
        <tab :line-width="2">
          <tab-item selected @click.native="chaneTab(0)">介绍</tab-item>
          <!--<tab-item @click.native="chaneTab(1)">相关</tab-item>-->
          <tab-item @click.native="chaneTab(2)">
            <span class="bedge-box">评论<span class="bedge" v-text="commentTotal"></span></span>
          </tab-item>
        </tab>
      </sticky>
    </div>
    <!--tab-content  comments-->
    <div class="tab-contents">
      <!--TAB1-介绍-->
      <div class="tab-content" v-show="showNum==0">

        <!--章节介绍-->
        <div class="chapter-desc">
          <div class="title">
            <span class="highlight">「内容介绍」</span>
          </div>
          <div class="desc" id="chapterDesc" v-html="courseChapterEntity.chapterdesc"></div>
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
      <div class="tab-content" v-show="showNum==1" v-if="chapterid>=0">
        <div class="title">
          <span class="highlight">「课程内容」</span>
        </div>
        <div class="chapter-list">
          <div class="chapter-item" v-if="courseChapterEntity.imgpath">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath" @error="setErrorImg">
            <div>
              <p v-text="courseChapterEntity.chaptername"></p>
              <p v-text="courseChapterEntity.chaptersubtitle"></p>
              <p>
                <span>销量：<span v-text="courseChapterEntity.chaptersalenumber"></span></span>
                <span>价格：<span class="activity-price">
                  ￥<span v-text="courseChapterEntity.chapterprice"></span>元
                </span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--TAB3-评论-->
      <div class="comments" v-show="showNum==2">
        <span class="comment-title">
          评论
        </span>
        <ul class="comment-list">
          <li class="comment-item" v-for="(item,index) in commentList" :key="index">
            <img class="user-avatar" alt="" v-if="item.memberEntity.thumbimg"
                 :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.memberEntity.thumbimg" @error="setErrorImg">
            <img class="user-avatar" src="../assets/no-pic.jpg" alt="" v-if="!item.memberEntity.thumbimg">
            <div class="item-info">
              <div class="user-info">
                <span v-text="item.memberEntity.username"></span>
                <span class="time" v-text="item.commenttime"></span>
              </div>
              <div class="comment-content" v-text="item.commentcontent"></div>
              <div class="delete-btn-box" v-show="item.userid==userid" @click="toDelete(item.id)">
                <a href="javascript:;" class="delete-btn">删除</a>
              </div>
            </div>
          </li>
          <li>
            <p @click="showMore" v-if="hasMore" class="text-center show-more">查看更多</p>
            <p v-if="!hasMore" class="text-center show-more">这已经到我的底线啦~</p>
          </li>
        </ul>
      </div>
    </div>
    <!--购买入口-->
    <div class="purchase" v-if="isShowCart">
      <div class="price">
        <p class="activity-price"
           :class="{'big-price':parseInt(courseChapterEntity.chapterorignalprice)==parseInt(courseChapterEntity.chapterprice)}"
           v-text="'￥'+courseChapterEntity.chapterprice"></p>
        <p class="orignal-price"
           v-if="parseInt(courseChapterEntity.chapterorignalprice)>parseInt(courseChapterEntity.chapterprice)"
           v-text="'￥'+courseChapterEntity.chapterorignalprice"></p>
      </div>
     <!-- <div class="cartList" @click="toShopCart">
        <span class="iconfont icon-gouwuche">
          <span class="cart-num" v-if="parseInt(cartTotal)>0" v-text="cartTotal"></span>
        </span>
      </div>
      <div class="addToCart" @click="addToCart">
        <span class="iconfont icon-iconset0313"></span>
      </div>-->
      <div class="cartList" @click="toShopCart">
        <span class="shop-cart">
          <span class="cart-num" v-if="parseInt(cartTotal)>0" v-text="cartTotal"></span>
        </span>
      </div>
      <div class="addToCart" @click="addToCart">
        <span class="add-shop-cart"></span>
      </div>
      <div class="buy" @click="toBuyNow(chapterid,courseChapterEntity.chapterprice,2)">
        立即购买
      </div>
    </div>
    <!--评论输入框-->
    <div class="my-input" v-if="showNum==2&&(!isShowCart)">
      <div class="avatar">
        <img src="../assets/editor.png" alt="">
      </div>
      <div class="main">
        <input type="text" class="form-control ios-input" @blur="blurInput" @focus="focusInput" v-model="commentcontent"
               placeholder="我来说两句">
      </div>
      <div class="send">
        <button class="btn mini" @click="sendComment()">发送</button>
      </div>
    </div>
    <toast v-model="hasToast" :text="toastMsg"></toast>
    <div v-transfer-dom>
      <confirm v-model="showDeleteConfirm"
               title="确定要删除此评论吗？"
               @on-confirm="onConfirm">
        <p style="text-align:center;">删除后将不能恢复</p>
      </confirm>
    </div>
    <div v-transfer-dom @click="showModal=false">
      <x-dialog v-model="showModal" class="dialog-demo">
        <p class="dialog-title">请您下载好芳法课堂进行查看</p>
        <span class="vux-close" @click="showModal=false"></span>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import myVideo from '../components/myVideo.vue'
  import util from '../util'
  import {Tab, TabItem, Sticky, Toast, TransferDomDirective as TransferDom, Confirm,XDialog} from 'vux'

  export default {
    name: '',
    data() {
      return {
        toShare: false,
        moreTip: '显示更多',
        hasToast: false,
        sucSup: true,
        toastMsg: '',
        showNum: 0,
        chapterid: -1,
        commentTotal: 0,
        playTotal: 0,
        courseChapterEntity: {},
        wfSpeakerEntity: {},
        greatTotal: 0,
        pageNum: 1,
        commentList: [],
        isShowMoreBtn: false,
        videoType: -1,
        hasSupport: false,
        commentcontent: '',
        busy: false,
        hasMore: true,
        hasBuy: false,
        fromMyCourse: false,
        isShowCart: false,
        cartTotal: 0,
        isMyLoading: true,
        userid: localStorage.userid,
        showDeleteConfirm: false,
        toDeleteId: null,
        showModal: false,
      }
    },
    directives: {
      TransferDom
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
          localStorage.fromAppPath = location.pathname
          localStorage.fromAppQuery = window.location.search.split('&')[0].split('id=')[1]
          this.$router.push({path: '/', query: {fromApp: window.location.href.split('&fromApp=')[1]}})
        }
      })

    },
    mounted() {
      this.init()
      this.getCartTotal()
      this.getComments()
      if (document.querySelector('.my-input')) {
        document.querySelector('.my-input').style.width = window.innerWidth + 'px'
      }
      this.fromMyCourse = this.$route.query.hasbuy
//      !window.initUrl && (window.initUrl = window.location.href)
      //      微信JS-SDK
      util.wxConfig(window.location.href.split('#')[0])
//      util.commonShare()

    },
    components: {
      myVideo, Tab, TabItem, Sticky, Toast, Confirm,XDialog
    },
    methods: {
      init() {
        this.chapterid = this.$route.query.id
//        章节
        if (parseInt(this.chapterid) >= 0) {
          let params = {
            url: '/wfcm-api/course/courseChapter',
            data: {'token': localStorage.token, 'chapterId': this.chapterid}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              console.log('章节详情', data)
              // 赋值
              this.commentTotal = data.commentTotal
              this.playTotal = data.playTotal
              this.greatTotal = data.greatTotal
              this.courseChapterEntity = data.courseChapterEntity
              this.wfSpeakerEntity = data.courseChapterEntity.wfSpeakerEntity
              this.isShowCart = (data.access == -1) && (data.courseChapterEntity.chaptertype == 2)
              let name = this.courseChapterEntity.chaptername

              let query = {
                desc: this.courseChapterEntity.chaptersubtitle,
                img: 'http://wangfang.oss-cn-qingdao.aliyuncs.com/' + this.courseChapterEntity.imgpath,
                url:'http://wftest.wfkids.net/chapterDetail?id='+this.$route.query.id+'&fromApp=true'
              }
              if (this.courseChapterEntity.imgpath && this.courseChapterEntity.chaptersubtitle) {
                util.detailShare(query)
              }
//              判断音频/视频
              this.videoType = this.courseChapterEntity.videopath.split('')[this.courseChapterEntity.videopath.length - 1]
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
      toDelete(id) {
        this.showDeleteConfirm = true
        this.toDeleteId = id
      },
      onConfirm(id) {
        console.log('删除', this.toDeleteId)
        if (this.toDeleteId) {
          let params = {
            url: 'wfcm-api/courseOperation/del',
            data: {'token': localStorage.token, 'commentid': this.toDeleteId}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              this.commentList.forEach((item, index) => {
                if (item.id == this.toDeleteId) {
                  this.commentList.splice(index, 1)
                  this.toDeleteId = null
                  this.hasToast = true
                  this.toastMsg = '删除成功'
                }
              })
//             this.commentList = data.page.list
//             此处应该前端假象删除本条，而不调用初始化
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
            'type': 2,
            'price': this.courseChapterEntity.chapterprice
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
            console.log('....', data)
            this.cartTotal = data.total
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            this.sucSup = false
            this.cartTotal = 0
          }
        })
      },
      isPlayAudio(id) {
        let params = {
          url: '/wfcm-api/course/savePlayLog',
          data: {'token': localStorage.token, 'chapterId': id}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            let params = {
              url: '/wfcm-api/course/courseChapter',
              data: {'token': localStorage.token, 'chapterId': this.chapterid}
            }
            util.bginterface(params, data => {
              if (data.errCode == 0) {
                // 赋值
                this.playTotal = data.playTotal
              } else {
                console.log(data.msg)
              }
            })
          } else {
            console.log(data.msg)
          }
        })
      },
      chaneTab(n) {
        this.showNum = n
      },
      getComments(moreFlag) {
        let params = {
          url: '/wfcm-api/course/pageComment',
          data: {'token': localStorage.token, 'chapterId': this.chapterid, 'page': this.pageNum}
        }
        if (moreFlag) {
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              console.log('评论', data)
              if (data.page.list.length == 0) {
                this.hasMore = false
              } else {
                this.hasMore = true
                this.commentList = this.commentList.concat(data.page.list)

              }
            } else {
              console.log(data.msg)
            }
          })
        } else {
          this.pageNum = 1
          let params = {
            url: '/wfcm-api/course/pageComment',
            data: {'token': localStorage.token, 'chapterId': this.chapterid, 'page': this.pageNum}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              console.log('评论', data)
              this.commentList = data.page.list
            } else {
              console.log(data.msg)
            }
          })
        }

      },
      showMore() {
        this.pageNum++
        this.getComments(true)
      },
      support() {
        let params = {
          url: '/wfcm-api/courseOperation/H5add',
          data: {'token': localStorage.token, 'chapterid': this.chapterid, 'commenttype': 1}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.toastMsg = '点赞成功!'
            this.hasToast = true
            this.sucSup = true
            this.greatTotal++
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
          data: {'token': localStorage.token, 'foreignId': this.chapterid, 'type': 2}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.toastMsg = '收藏成功！'
            this.hasToast = true
          } else {
            this.toastMsg = data.msg
            this.hasToast = true
            this.sucSup = false
          }
        })
      },
      getPlayTotal(...data) {
        this.playTotal = data[0]
      },
      sendComment() {
        if (this.commentcontent != '') {
          let params = {
            url: '/wfcm-api/courseOperation/H5add',
            data: {
              'token': localStorage.token,
              'chapterid': this.chapterid,
              'commenttype': 2,
              'commentcontent': encodeURIComponent(this.commentcontent)
            }
          }
          util.bginterface(params, data => {
            console.log(data)
            if (data.errCode == 0) {
              this.toastMsg = '评论成功！'
              this.hasToast = true
              this.blurInput()
              this.commentcontent = ''
              this.getComments()
            } else {
              this.commentcontent = ''
              this.getComments()
              this.toastMsg = data.msg
              this.hasToast = true
              this.blurInput()
              console.log(data.msg)
            }
          })
        }
      },
      focusInput() {
        setTimeout(() => {
          let myInput = document.querySelector('.my-input')
          document.body.scrollTop = document.body.scrollHeight
        }, 150)
      },
      blurInput() {
      }
    }
  }
</script>
<style lang="less">
  #chapter-detail {
    padding-bottom: 0;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    .detail{
      color: gray;
    }
    .vux-sticky-box {
      width: 100%;
    }
    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100% !important;
        height: auto;
      }
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
    .tab-contents {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      margin-bottom: 3rem;
      .chapter-title {
        .title {
          line-height: 1.8;
        }
        .desc {
          line-height: 1.8;
          color: gray;
        }
        .details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 3rem;
          white-space: nowrap;
          span {
            white-space: nowrap;
            color: gray;
            flex: 1;
            text-align: center;
          }
        }
      }
      .chapter-list {

        .chapter-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          box-sizing: border-box;
          padding: 0.5rem;
          margin-top: 1rem;
          img {
            max-width: 46%;
            border-radius: 1rem;
            margin-right: 4%;
          }
          div {
            width: 50%;
            font-size: 0.8rem;
          }
          p {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 2;
            font-size: 0.8rem;
            color: #999999;
            &:first-child {
              font-size: 1.1rem;
              color: #333333;
            }
          }
          .activity-price {
            color: rgb(250, 145, 69);
            font-size: 0.8rem;
            span {
              color: rgb(250, 145, 69);
              font-size: 0.8rem;
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
      .my-input.abs {
        position: absolute;
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
    .my-input {
      height: 42px;
      position: fixed;
      z-index: 1000;
      width: 100%;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      padding: 0.25rem 1rem;
      background: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .avatar {
        width: 10%;
        height: 75%;
        img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }
      }
      .send {
        width: 20%;
        text-align: center;
        white-space: nowrap;
        .btn {
          background: linear-gradient(to right, #009deb, #7888fc);
          color: #ffffff;
          padding: 0.3rem 0.75rem;
        }
      }
      .main {
        width: 70%;
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

    .delete-btn-box {
      padding-bottom: 0.5rem;
      box-sizing: border-box;
    }

    .delete-btn {
      color: #2999f0;
      font-size: 0.8rem;
    }

    .show-more {
      padding: 0.5rem 0;
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

    .big-price {
      font-size: 1.5rem;
    }

    .highlight {
      color: #91c0e6;
      line-height: 2;
    }

    .bottom-line {
      .load-more {
        text-align: center;
        padding: 0.5rem;
      }
      span {
        display: inline-block;
        position: absolute;
        left: 24%;
        background: #ffffff;
        top: -0.8rem;
        padding: 0 1rem;
      }
      width: 100%;
      margin: 0 1.5rem;
      position: relative;
      height: 1px;
    }

    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100%;
      }
    }

    .icon-dianzan {
      color: #ff6974 !important;
    }

    .support-active {
      animation: mymove .3s linear;
    }

    .top-box {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      /*margin-bottom: 1rem;*/
      .chapter-title {
        .title {
          font-size: 1.2rem;
          line-height: 1.8;
        }
        .desc {
          line-height: 1.8;
          color: gray;
        }
        .details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 3rem;
          white-space: nowrap;
          span {
            color: gray;
            /*flex: 1;*/
            text-align: center;
            white-space: nowrap;
          }
          .orignal-price {
            text-decoration: line-through;
            /*flex: 0.5;*/
          }
          .activity-price {
            color: rgb(250, 145, 69);
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

    .suc-sup {
      animation: minMax .5s linear;
    }
    .func-item{
      padding-bottom: 0.5rem;
      p{
        color: gray;
      }
    }
  }

  @keyframes mymove {
    from {
      font-size: 0.8rem;
    }
    to {
      font-size: 1.3rem;
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
