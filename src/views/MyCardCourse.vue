<template>
  <div class="has-buy" id="my-card-course">
    <ul class="has-buy-list">
      <!--课程-->
      <li class="has-buy-item" v-for="(item,index) in courseList"
          @click="toDetail(item.cardCourseRelationEntity.courseInfoEntity.id)">
        <img class="has-buy-img"
             :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.cardCourseRelationEntity.courseInfoEntity.courseimgurl" @error="setErrorImg"
             alt="">
        <div class="has-buy-course">
          <p class="title" v-text="item.cardCourseRelationEntity.courseInfoEntity.coursename"></p>
          <p class="detail" v-text="item.cardCourseRelationEntity.courseInfoEntity.coursedesc"></p>
          <p class="author"
             v-text="'主讲人：'+item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
          <!--<p class="price" v-if="item.courseInfoEntity.activityprice>0">-->
          <!--<span class="activity-price text-left" v-text="'￥'+item.courseInfoEntity.activityprice"></span>-->
          <!--<span class="orignal-price text-right" v-text="'￥'+item.courseInfoEntity.orignalprice"></span>-->
          <!--</p>-->
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
    created(){
      let params = {
        url: '/wfcm-api/member/confirm',
        data: {'token': localStorage.token}
      }
      util.bginterface(params, data => {
        if (data.errCode == 0) {
          return
        } else {
          localStorage.removeItem('token')
          this.$router.push({path:'/'})
        }
      })
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
    components: {},
    methods: {
      init() {
        document.title = '查看全部'
        let id = this.$route.query.id
        console.log('...:', id)
        let params = {
          url: '/wfcm-api/order/vipCard',
          data: {'token': localStorage.token, 'vipCardId': id}
        }
        util.bginterface(params, data => {
          console.log('我的课程包中的课程',data)
          if (data.errCode == 0) {
            this.courseList = data.courseList
          } else {
            console.log(data.msg)
          }
        })
      },
      setErrorImg(e){
        e.srcElement.src='/static/img/no-pic.jpg'
      },
      toDetail(id) {
        this.$router.push({path: '/myCourseChapter', query: {id}})
      }
    }
  }
</script>
<style lang="less">
  #my-card-course {
    box-sizing: border-box;
    padding-bottom: 3.5rem;
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
            font-weight: bold;
          }
        }
      }
    }
    .detail, .author {
      color: gray;
    }

    .price {
      .activity-price {
        color: orange;
      }
      .orignal-price {
        color: gray;
        text-decoration: line-through;
      }
    }
  }



</style>
