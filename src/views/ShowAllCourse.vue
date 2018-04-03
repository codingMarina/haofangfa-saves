<template>
  <div class="has-buy" id="show-all-course">
    <ul class="has-buy-list">
      <!--课程包-->
      <li class="has-buy-item" v-for="(item,index) in courseList" v-if="item.buytype==3"
          @click="toDetail(item.to,item.cardid)">
        <img class="has-buy-img"
             :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" alt="">
        <div class="has-buy-course">
          <p class="title" v-text="item.vipCardEntity.cardname"></p>
          <p class="detail" v-text="item.vipCardEntity.carddesc"></p>
          <p class="author"
             v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
          <div class="price-box">
            <p class="sales-num" v-if="parseInt(item.vipCardEntity.cardprice)>0"
               v-text="'销量:'+item.vipCardEntity.cardsalenumber"></p>
            <p class="price" v-if="item.vipCardEntity.cardprice>0">
              <span class="activity-price text-left" v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></span>
              <!--<span class="orignal-price text-right" v-text="'￥'+item.vipCardEntity.cardorignalprice"></span>-->
            </p>
          </div>
        </div>
      </li>
      <!--课程-->
      <li class="has-buy-item" v-for="(item,index) in courseList" v-if="item.buytype==1"
          @click="toDetail(item.to,item.courseid)">
        <img class="has-buy-img"
             :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl" alt="">
        <div class="has-buy-course">
          <p class="title" v-text="item.courseInfoEntity.coursename"></p>
          <p class="detail" v-text="item.courseInfoEntity.coursedesc"></p>
          <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
          <div class="price-box">
            <p class="sales-num" v-if="parseInt(item.courseInfoEntity.activityprice)>0"
               v-text="'销量:'+item.courseInfoEntity.coursesalenumber"></p>
            <p class="price" v-if="item.courseInfoEntity.activityprice>0">
              <span class="activity-price text-left" v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></span>
              <!--<span class="orignal-price text-right" v-text="'￥'+item.courseInfoEntity.orignalprice"></span>-->
            </p>
          </div>
        </div>
      </li>
      <!--章节-->
      <li class="has-buy-item" v-for="(item,index) in courseList" v-if="item.buytype==2"
          @click="toDetail(item.to,item.chapterid)">
        <img class="has-buy-img"
             :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath" alt="">
        <div class="has-buy-course">
          <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
          <p class="detail" v-text="item.courseChapterEntity.chaptersubtitle"></p>
          <p class="author" v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
          <div class="price-box">
            <p class="sales-num" v-if="parseInt(item.courseChapterEntity.chapterprice)>0"
               v-text="'销量:'+item.courseChapterEntity.chaptersalenumber"></p>
            <p class="price" v-if="item.courseChapterEntity.chapterprice>0">
              <span class="activity-price text-left" v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></span>
              <!--<span class="orignal-price text-right" v-text="'￥'+item.courseChapterEntity.chapterorignalprice"></span>-->
            </p>
            <p v-if="item.courseChapterEntity.chapterprice==0" class="activity-price">免费</p>
          </div>
        </div>
      </li>
    </ul>
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

  export default {
    name: '',
    data() {
      return {
        courseChapterList: [],
        courseInfoList: [],
        vipCardList: [],
        empty: false,
        courseList: []
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
      if (localStorage.token) {
        this.init()

      } else {
        this.$router.push({path: '/'})
      }
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {},
    methods: {
      init() {
        let typeCode = this.$route.query.code
//        document.title = '查看全部'
//10,免费课程 ； 11，精品课程； 12，超值课程包； 22,数学分级课 ;23语文分级课； 24，音频推荐
        switch (typeCode) {
          case 10:
            document.title = '免费课程'
            break
          case 11:
            document.title = '精品课程'
            break
          case 12:
            document.title = '超值课程包'
            break
          case 22:
            document.title = '数学分级课'
            break
          case 23:
            document.title = '语文分级课'
            break
          case 24:
            document.title = '音频推荐'
            break
          default:
            document.title = '查看全部'
            break
        }
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': typeCode}
        }
        util.bginterface(params, data => {
          console.log(data)
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
            this.courseList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      toDetail(to, id) {
        this.$router.push({path: to, query: {id}})
      }
    }
  }
</script>
<style lang="less">
  #show-all-course {
    .activity-price {
      color: orange;
    }
    .price-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    box-sizing: border-box;
    .has-buy-list {
      box-sizing: border-box;
      padding: 1rem 1.5rem;
      .has-buy-item {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          max-width: 45%;
          margin-right: 5%;
          border-radius: 1rem;
        }
        .has-buy-course {
          width: 50%;
          .title, .detail {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .title {
            display: block;
          }
        }
      }
    }
    .detail, .author {
      color: gray;
      font-size: 0.8rem;
    }
    .price {
      .activity-price {
        color: rgb(250, 145, 69);
        font-size: 0.8rem;
      }
      .orignal-price {
        color: gray;
        font-size: 0.8rem;
        text-decoration: line-through;
      }
    }
    .sales-num {
      color: gray;
      font-size: 0.8rem;
    }
  }


</style>
