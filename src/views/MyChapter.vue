<template>
  <div class="chapter-detail" id="my-chapter-detail">
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
      <!--音频-->
      <div class="diy-audio" v-if="courseChapterEntity.imgpath &&videoType==3">
        <audio @play="isPlayAudio(chapterid)" @ended="audioEnded(now)" autoplay controls
               :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath"
               controlsList="nodownload" :loop="isLoop"></audio>
      </div>
      <!--视频-->
      <div class="my-video" v-if="courseChapterEntity.imgpath && videoType==4">
        <my-video :mysrc="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.videopath" :isLoop="isLoop"
                  @getPlayTotal="onVideoPlayerPlay" @hasFinished="videoHasFinished"
                  :myposter="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath"
                  :chapterid="chapterid"></my-video>
      </div>
    </div>
    <div class="top-box">
      <div class="chapter-title">
        <p class="title" v-text="courseChapterEntity.chaptername"></p>
        <p class="desc" v-text="courseChapterEntity.chaptersubtitle"></p>
        <p class="details">
          <span class="detail">主讲人：<span v-text="wfSpeakerEntity.speakername"></span></span>
          <span class="detail">销量：<span v-text="courseChapterEntity.chaptersalenumber"></span></span>
          <span class="detail">播放次数：
            <span v-text="playTotal"></span>
          </span>
          <!--<span class="detail" @click="support(courseChapterEntity)">-->
          <!--<span class="iconfont icon-jushoucang" v-if="!hasSupport"></span>-->
          <!--<span class="iconfont icon-dianzan" :class="{'support-active':hasSupport}" v-if="hasSupport"></span>-->
          <!--<span v-text="greatTotal"></span>-->
          <!--</span>-->
        </p>
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
          <div class="func-item" @click="isShowListenList=true">
            <img src="../assets/listen-list.png" alt="">
            <p>播放列表</p>
          </div>
        </div>
      </div>
    </div>
    <!--tab-list-->
    <div class="tab-list">
      <sticky ref="sticky" :offset="0" :check-sticky-support="false">
        <tab :line-width="2">
          <tab-item selected @click.native="chaneTab(0)">介绍</tab-item>
          <!--<tab-item @click.native="chaneTab(1)">相关</tab-item>-->
          <tab-item @click.native="chaneTab(2)"><span class="bedge-box">评论<span class="bedge"
                                                                                v-text="commentTotal"></span></span>
          </tab-item>

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
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+courseChapterEntity.imgpath">
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
        <span class="comment-title">评论</span>
        <ul class="comment-list">
          <li class="comment-item" v-for="(item,index) in commentList" :key="index">
            <img class="user-avatar" alt="" v-if="item.memberEntity.thumbimg"
                 :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.memberEntity.thumbimg" @error="setErrorImg">
            <img class="user-avatar" src="../assets/avatar.png" alt="" v-if="!item.memberEntity.thumbimg">
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
    <!--评论输入框-->
    <div class="my-input" v-if="showNum==2">
      <div class="avatar">
        <img src="../assets/editor.png" alt="">
      </div>
      <div class="main">
        <input type="text" @focus="focusInput" class="form-control ios-input" v-model="commentcontent"
               placeholder="我来说两句">
      </div>
      <div class="send">
        <button class="btn mini" @click="sendComment()">发送</button>
      </div>
    </div>
    <!--购买入口-->
    <div class="purchase" v-if="fromMyCourse&&(courseChapterEntity.chapterprice!=0)">
      <div class="price">
        <p class="activity-price">
          ￥<span>359.00</span>
        </p>
        <p class="orignal-price">
          ￥<span>599.00</span>
        </p>
      </div>
      <div class="cartList">
        <span class="iconfont icon-gouwuche">
          <span class="cart-num">1</span>
        </span>
      </div>
      <div class="addToCart">
        <span class="iconfont icon-iconset0313"></span>
      </div>
      <div class="buy">
        立即购买
      </div>
    </div>
    <toast v-model="hasToast" type="text" :text="toastMsg"></toast>
    <div v-transfer-dom @click="showModal=false">
      <x-dialog v-model="showModal" class="dialog-demo">
        <p class="dialog-title">请您下载好芳法课堂进行查看</p>
        <span class="vux-close" @click="showModal=false"></span>
      </x-dialog>
    </div>
    <transition name="bounce">
      <div class="layer" v-if="isShowListenList" @click="isShowListenList=false">
        <div v-if="isShowListenList" class="music-box">
          <div class="music-header">
            <div class="left">
              <div class="order" v-show="listType==0" @click.stop.prevent="changeListType">
                <img src="../assets/menu.png" alt="">
                <span>顺序播放</span>
              </div>
              <div class="list-circle" v-show="listType==1" @click.stop.prevent="changeListType">
                <img src="../assets/circle-list.png" alt="">列表循环
              </div>
              <div class="single-circle" v-show="listType==2" @click.stop.prevent="changeListType">
                <img src="../assets/circle-one.png" alt="">单曲循环
              </div>
            </div>
            <div class="right">
              <div class="previous" @click.stop.prevent="previous(now)">
                <img src="../assets/media-previous.png" alt="">
                <span>上一节</span>
              </div>
              <div class="next" @click.stop.prevent="next(now)">
                <img src="../assets/media-next.png" alt="">
                <span>下一节</span>
              </div>
            </div>
          </div>
          <ul class="play-list">
            <li v-for="(item,index) in listenList" @click.stop.prevent="chooseItem(item,index)">
              <img src="../assets/triangle.png" v-if="item.isActive" alt="">
              <p v-text="item.chaptername"></p>
            </li>
          </ul>
        </div>

      </div>
    </transition>
    <div v-transfer-dom>
      <confirm v-model="showDeleteConfirm"
               title="确定要删除此评论吗？"
               @on-confirm="onConfirm">
        <p style="text-align:center;">删除后将不能恢复</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import myVideo from '../components/myVideo.vue'
  import util from '../util'
  import {XDialog, Tab, TabItem, Sticky, TransferDomDirective as TransferDom, Toast, Actionsheet, Confirm} from 'vux'

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
        showModal: false,
        isShowListenList: false,
        listenList: [],
        isMyLoading: true,
        now: {},
        listType: 0,
        isLoop: false,
        userid: localStorage.userid,
        showDeleteConfirm: false,
        toDeleteId: null
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
      this.chapterid = this.$route.query.id
      this.init()
      this.getComments()
      if (document.querySelector('.my-input')) {
        document.querySelector('.my-input').style.width = window.innerWidth + 'px'
      }
      this.fromMyCourse = this.$route.query.hasbuy
      this.getListenList()
      !(window.initUrl) && (window.initUrl = location.href)
      util.wxConfig(window.initUrl)
    },
    components: {
      myVideo, Tab, TabItem, Sticky, Toast, XDialog, Actionsheet, Confirm
    },
    directives: {
      TransferDom
    },
    methods: {
      init() {
//        章节
        if (parseInt(this.chapterid) >= 0) {
          let params = {
            url: '/wfcm-api/course/courseChapter',
            data: {'token': localStorage.token, 'chapterId': this.chapterid}
          }
          console.log('params', params)
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              // 赋值
              this.commentTotal = data.commentTotal
              this.playTotal = data.playTotal
              this.greatTotal = data.greatTotal
              this.courseChapterEntity = data.courseChapterEntity
              this.wfSpeakerEntity = data.courseChapterEntity.wfSpeakerEntity
              let name = this.courseChapterEntity.chaptername
//              微信sdk参数
              let query = {
                desc: this.courseChapterEntity.chaptersubtitle,
                img: 'http://wangfang.oss-cn-qingdao.aliyuncs.com/' + this.courseChapterEntity.imgpath,
                url: 'http://wftest.wfkids.net/chapterDetail?id=' + this.$route.query.id + '&fromApp=true'
              }
              if (this.courseChapterEntity.chaptersubtitle && this.courseChapterEntity.imgpath) {
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
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      chaneTab(n) {
        this.showNum = n
      },
      getComments(moreFlag) {
        console.log('@@@@@')
        let params = {
          url: '/wfcm-api/course/pageComment',
          data: {'token': localStorage.token, 'chapterId': this.chapterid, 'page': this.pageNum}
        }
        if (moreFlag) {
          util.bginterface(params, data => {
            if (data.errCode == 0) {
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
              this.commentList = data.page.list
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
            if (data.errCode == 0) {
              this.toastMsg = '评论成功！'
              this.hasToast = true
              this.commentcontent = ''
              this.getComments()
            } else {
              this.commentcontent = ''
              this.getComments()
              this.toastMsg = data.msg
              this.hasToast = true
            }
          })
        }
      },
      onVideoPlayerPlay(data) {
        this.playTotal = data
      },
      getListenList() {
        let id = this.$route.query.courseId
        let params = {
          url: '/wfcm-api/order/courseChapter',
          data: {'token': localStorage.token, 'courseId': id}
        }

        util.bginterface(params, data => {
          if (data.errCode == 0) {
            data.courseChapterList.forEach((item, index) => {
              item.isActive = (item.id == this.chapterid)
              if (item.isActive) {
                item.index = index
                this.now = item
              }
            })
            this.listenList = data.courseChapterList
          } else {
            console.log(data.msg)
          }
        })
      },
      chooseItem(item, index) {
        this.listenList.forEach(i => {
          i.isActive = false
        })
        item.isActive = true
        item.index = index
        this.chapterid = item.id
        this.now = item
        this.init()
        this.getComments()
        this.isShowListenList = false
      },
      previous(now) {
        if (now.index > 0) {
          let newNum = --now.index
          this.chapterid = this.listenList[newNum].id
          this.init()
          this.getComments()
          this.listenList.forEach(i => {
            i.isActive = false
          })
          this.listenList[newNum].isActive = true
          this.isShowListenList = false
        } else {
          this.toastMsg = '已经是第一节了'
          this.hasToast = true
          return
        }
      },
      next(now) {
        if (now.index < this.listenList.length - 1) {
          let newNum = ++now.index
          this.chapterid = this.listenList[newNum].id
          this.init()
          this.getComments()
          this.listenList.forEach(i => {
            i.isActive = false
          })
          this.listenList[newNum].isActive = true
          this.isShowListenList = false
        } else {
          if (this.listType == 1) {
            //如果是列表循环的话
            this.chapterid = this.listenList[0].id
            this.init()
            this.getComments()
            this.getListenList()
            this.listenList.forEach(i => {
              i.isActive = false
            })
            this.listenList[0].isActive = true
            this.isShowListenList = false
          } else {
            return
          }
        }
      },
      changeListType() {
        if (this.listType < 2) {
          ++this.listType
        } else {
          this.listType = 0
        }
        if (this.listType == 0) {
//          console.log('顺序播放')
          this.isLoop = false
        } else if (this.listType == 1) {
//          console.log('列表循环')
          this.isLoop = false
        } else if (this.listType == 2) {
//          console.log('单曲循环')
          this.isLoop = true
        }
      },
      audioEnded(now) {
        if (this.listType == 0 || this.listType == 1) {
          this.next(now)
        }
      },
      videoHasFinished(data) {
        if (data) {
          if (this.listType == 0 || this.listType == 1) {
            this.next(this.now)
          }
        }
      },
      focusInput() {
        setTimeout(() => {
          let myInput = document.querySelector('.my-input')
          document.body.scrollTop = document.body.scrollHeight
        }, 150)
      },
    }
  }
</script>
<style lang="less">
  #my-chapter-detail {
    .weui-toast {
      z-index: 100001;
    }
    .vux-tab-ink-bar {
      margin-left: 23%;
    }
    #teacherDesc, #chapterDesc {
      max-width: 100%;
      img {
        max-width: 100% !important;
        height: auto;
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
          /*background: lightseagreen;*/
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
    .bounce-enter-active {
      animation: bounce-in .5s;
    }

    .bounce-leave-active {
      animation: bounce-in .5s reverse;
    }

    .layer {
      position: fixed;
      width: 100%;
      z-index: 9999;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
      height: 100%;
    }

    .music-box {
      position: fixed;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 1.5rem;
      z-index: 10000;
      bottom: 0;
      left: 0;
      background: #ffffff;
      height: 70%;
      overflow-y: auto;
      .isActive {
        color: orangered;
      }
      .music-header {
        box-sizing: border-box;
        padding: 0 1.5rem 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        img {
          width: 1rem;
        }
        .left {
          width: 50%;
          div {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
        }
        .right {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
        }
      }
      .play-list {
        background: #ffffff;
        li {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 10px 1.5rem;
          border-bottom: 1px solid #f6f6f6;
          img {
            width: 0.75rem;
          }
          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .weui-actionsheet__menu {
      background-color: rgba(255, 255, 255, 0.6) !important;
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
    .vux-sticky-box {
      width: 100%;
    }
    .weui-actionsheet__cell {
      font-size: 1rem;
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
      /*margin-bottom: 3rem;*/
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
          height: 3rem;
          span {
            color: #999999;
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
            color: orange;
            font-size: 0.8rem;
            span {
              color: orange;
              font-size: 0.8rem;
            }
          }
        }
      }

      .comments {
        .delete-btn-box {
          padding-bottom: 0.5rem;
          box-sizing: border-box;
        }
        .delete-btn {
          color: #2999f0;
          font-size: 0.8rem;
        }
        /*padding-bottom: 45px;*/
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
            padding: 1rem 0 0.5rem;
          }
          .item-info {
            width: 100%;
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
        max-width: 100%;
      }
    }

    .icon-dianzan {
      color: #ff6974 !important;
    }

    .support-active {
      animation: mymove .3s linear;
    }

    .purchase {
      position: fixed;
      width: 100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      bottom: 0;
      left: 0;
      height: 3rem;
      text-align: center;
      .price {
        .activity-price {
          color: orange;
          text-align: center;
          span {
            color: orange;
            text-align: center;
            font-size: 1.2rem;
          }
        }
        .orignal-price {
          color: gray;
          text-decoration: line-through;
          text-align: center;
          span {
            color: gray;
            text-align: center;
          }
        }
        flex: 1;
      }
      .cartList {
        flex: 0.5;
        height: 100%;
        width: 100%;
        span.iconfont {
          color: orange;
          line-height: 3rem;
          font-size: 1.5rem;
          position: relative;
        }
        .cart-num {
          padding: 0.25rem;
          border-radius: 50%;
          background: orange;
          color: #ffffff;
          font-size: 0.25rem;
          position: absolute;
          right: -0.3rem;
          top: -0.4rem;
          width: 0.5rem;
          height: 0.5rem;
          line-height: 0.5rem;
        }
      }
      .addToCart {
        flex: 0.5;
        background: orange;
        height: 100%;
        width: 100%;
        span {
          color: #ffffff;
          line-height: 3rem;
          font-size: 1.5rem;
        }
      }
      .buy {
        flex: 1;
        background: #f97927;
        color: #ffffff;
        height: 100%;
        line-height: 3rem;
      }
    }

    .top-box {
      box-sizing: border-box;
      padding: 0.5rem 1.5rem;
      margin-bottom: 1rem;
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
          height: 3rem;
          span {
            color: #999999;
            flex: 1;
            text-align: center;
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
          /*img {
            width: 1.8rem;
            height: 1.8rem;
          }*/
        }
      }
    }

    .suc-sup {
      animation: minMax .5s linear;
    }

    .dialog-demo {
      .weui-dialog {
        border-radius: 8px;
        padding-bottom: 8px;
        width: 60%;
        padding: 1rem 1.5rem;
        top: 40%;
      }
      .dialog-title {
        line-height: 30px;
        color: #666;
        margin: 1rem auto;
      }
      .img-box {
        height: 350px;
        overflow: hidden;
      }
      .vux-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
    }

    .dialog-demo .vux-close {
      right: 0rem;
    }

    .weui-actionsheet__menu {
      max-height: 30rem;
      overflow-y: auto;
      text-align: left;
    }

    .vux-actionsheet-menu-default {
      text-align: left !important;
      box-sizing: border-box !important;
      padding-left: 1.5rem !important;
      padding-right: 1.5rem !important;
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

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
