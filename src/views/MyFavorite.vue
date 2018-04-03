<template>
  <div class="has-buy" id="my-favorite">
    <sticky ref="sticky" :offset="0" :check-sticky-support="false">
      <tab>
        <tab-item selected @on-item-click="onItemClick(0)">课程包</tab-item>
        <tab-item @on-item-click="onItemClick(1)">课程</tab-item>
        <tab-item @on-item-click="onItemClick(2)">章节</tab-item>
      </tab>
    </sticky>

    <swipeout class="has-buy-list">
      <!--课程包-->
      <swipeout-item class="has-buy-item" transition-mode="follow" v-for="(item,index) in vipCardList"
                     :key="'vip'+index"
                     v-if="n==0 &&vipCardList.length>0" @click.native="toDetail(item.foreignid,item.to)">
        <div slot="right-menu">
          <swipeout-button @click.native.stop="onButtonClick(3,item.id)" type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-t">
          <img class="has-buy-img" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg"
               @error="setErrorImg"
               alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.vipCardEntity.cardname"></p>
            <p class="detail" v-text="item.vipCardEntity.carddesc"></p>
            <!--<p class="price">-->
            <!--<span v-if="item.vipCardEntity.cardprice>0" v-text="'销量：'+item.vipCardEntity.cardsalenumber"></span>-->
            <!---->
            <!--<span v-if="item.vipCardEntity.cardprice>0" class="activity-price" v-text="'￥'+item.vipCardEntity.cardprice"></span>-->
            <!--<span v-if="item.vipCardEntity.cardprice==0" class="activity-price">免费</span>-->
            <!--</p>-->
            <div class="price">
              <p><span>销量:<span
                v-text="item.vipCardEntity.cardsalenumber?item.vipCardEntity.cardsalenumber:'暂无'"></span></span></p>
              <p><span v-if="item.vipCardEntity.cardprice>0">价格:<span class="activity-price"
                                                                      v-text="'￥'+item.vipCardEntity.cardprice"></span></span>
                <span v-if="item.vipCardEntity.cardprice==0" class="activity-price">免费</span></p>
            </div>
          </div>
        </div>
      </swipeout-item>
      <div class="is-empty" v-if="n==0 &&vipCardList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您还没有收藏过课程包</h4>
      </div>
      <!--课程-->
      <swipeout-item transition-mode="follow" class="has-buy-item" v-for="(item,index) in courseInfoList" v-if="n==1"
                     :key="'course'+index" @click.native="toDetail(item.foreignid,item.to)">
        <div slot="right-menu">
          <swipeout-button @click.native.stop="onButtonClick(1,item.id)" type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-t">
          <img class="has-buy-img"
               :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
               @error="setErrorImg" alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.courseInfoEntity.coursename"></p>
            <p class="detail" v-text="item.courseInfoEntity.coursedesc"></p>
            <div class="price">
              <p><span>销量:<span
                v-text="item.courseInfoEntity.coursesalenumber?item.courseInfoEntity.coursesalenumber:'暂无'"></span></span>
              </p>
              <p><span v-if="item.courseInfoEntity.activityprice>0">价格:<span class="activity-price"
                                                                             v-text="'￥'+item.courseInfoEntity.activityprice"></span></span>
                <span v-if="item.courseInfoEntity.activityprice==0" class="activity-price">免费</span></p>
            </div>
          </div>
        </div>
      </swipeout-item>
      <div class="is-empty" v-if="n==1 &&courseInfoList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您还没有收藏过课程</h4>
      </div>
      <!--章节-->
      <swipeout-item transition-mode="follow" class="has-buy-item" v-for="(item,index) in courseChapterList" v-if="n==2"
                     :key="'chapter'+index" @click.native="toDetail(item.foreignid,item.to)">
        <div slot="right-menu">
          <swipeout-button @click.native.stop="onButtonClick(2,item.id)" type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-t">
          <img class="has-buy-img"
               :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" @error="setErrorImg" alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
            <p class="detail" v-text="item.courseChapterEntity.chaptersubtitle?item.courseChapterEntity.chaptersubtitle:'暂无'"></p>
            <div class="price">
              <p>
                <span v-if="item.courseChapterEntity.chapterprice>0" class="activity-price" v-text="'￥'+item.courseChapterEntity.chapterprice"></span>
                <span v-if="item.courseChapterEntity.chapterprice==0" class="activity-price">免费</span></p>
              <p><span v-if="item.courseChapterEntity.chapterprice>0" v-text="'销量:'+item.courseChapterEntity.chaptersalenumber"></span></p>
            </div>
          </div>
        </div>
      </swipeout-item>
      <div class="is-empty" v-if="n==2 &&courseChapterList.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>您还没有收藏过章节</h4>
      </div>
    </swipeout>
    <transition name="fade" mode="out-in" appear>
      <div class="empty" v-if="empty">
        <img src="../assets/empty.png" alt="">
        <h3 class="text-center">暂时没有购买课程</h3>
      </div>
    </transition>
  </div>
</template>

<script>
  import util from '../util'
  import {Tab, TabItem, Sticky, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'

  export default {
    name: '',
    data() {
      return {
        courseChapterList: [],
        courseInfoList: [],
        vipCardList: [],
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
    components: {Tab, TabItem, Sticky, Swipeout, SwipeoutItem, SwipeoutButton},
    methods: {
      init() {
        document.title = '我的收藏'
        let params = {
          url: '/wfcm-api/favorite/list',
          data: {'token': localStorage.token, 'type': 3}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.vipCardList = data.resultList
            for (let i = 0; i < this.vipCardList.length; i++) {
              this.vipCardList[i].to = '/cardDetail'
            }
          } else {
            console.log(data.msg)
          }
        })
      },
      onButtonClick(n, id) {
        let params = {
          url: '/wfcm-api/favorite/del',
          data: {'Token': localStorage.token, 'collectionId': id}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.onItemClick(n)
          } else {
            console.log(data.msg)
          }
        })
      },
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      toDetail(id, to) {
        this.$router.push({path: to, query: {id}})
      },
      onItemClick(index) {
        this.n = index
        let params = {
          url: '/wfcm-api/favorite/list',
          data: {'token': localStorage.token, 'type': index}
        }
        util.bginterface(params, data => {
          console.log(data)
          if (data.errCode == 0) {
            if (index == 1) {
//              课程
              this.courseInfoList = data.resultList
              for (let i = 0; i < this.courseInfoList.length; i++) {
                this.courseInfoList[i].to = '/courseDetail'
              }
            }
            if (index == 2) {
//              章节
              this.courseChapterList = data.resultList
              for (let i = 0; i < this.courseChapterList.length; i++) {
                this.courseChapterList[i].to = '/chapterDetail'
              }
            }
            if (index == 3) {
//              章节
              this.vipCardList = data.resultList
              for (let i = 0; i < this.vipCardList.length; i++) {
                this.vipCardList[i].to = '/cardDetail'
              }
            }
          } else {
            console.log(data.msg)
          }
        })
      },
    }
  }
</script>
<style lang="less">
  #my-favorite {
    width: 100%;
    overflow-x: hidden;
    .activity-price {
      color: orange;
    }
    .price {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .vux-tab-ink-bar {
      background-color: transparent;
      background: linear-gradient(to right, #009deb 50%, #7888fc 50%) !important;
      width: 4% !important;
      margin-left: 14.5% !important;
    }

    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #333 !important;
      border-bottom: none;
    }

    .demo-content {
      display: flex;
      align-items: center;
    }
    .vux-swipeout-content {
      width: 100%;
    }
    .vux-swipeout-button {
      width: 90px !important;
    }
    .has-buy-list {
      box-sizing: border-box;
      padding: 0.5rem 0 0.5rem 0.5rem !important;
      .has-buy-item {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          max-width: 40%;
          margin-right: 5%;
          border-radius: 1rem;
        }
        /*.has-buy-img{*/
          /*max-width: 40%;*/
          /*margin-right: 5%;*/
          /*border-radius: 1rem;*/
        /*}*/
        .has-buy-course {
          width: 50%;
          .title, .detail {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .title {
            font-weight: bold;
          }
        }
      }
    }
  }


</style>
