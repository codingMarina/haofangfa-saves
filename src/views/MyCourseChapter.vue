<template>
  <div class="has-buy" id="my-course-chapter">
    <ul class="has-buy-list">
      <!--章节-->
      <li v-for="(item,index) in courseChapterList" @click="toDetail(item.id)">
        <div class="has-buy-item" >
          <img class="has-buy-img"
               :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.imgpath" @error="setErrorImg" alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.chaptername"></p>
            <p class="detail" v-text="item.chapterduration"></p>
            <!--<p class="detail" v-text="item.chaptersubtitle"></p>-->
            <!--<p class="author" v-text="'主讲人：'+item.wfSpeakerEntity.speakername"></p>-->
            <!--<p class="price" v-if="item.chapterprice>0">-->
            <!--<span class="activity-price text-left" v-text="'￥'+item.chapterprice"></span>-->
            <!--<span class="orignal-price text-right" v-text="'￥'+item.chapterorignalprice"></span>-->
            <!--</p>-->
          </div>
        </div>
        <div class="divider"></div>
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
    mounted() {
      if (localStorage.token) {
        this.init()

      } else {
        this.$router.push({path: '/'})
      }
      util.wxConfig(window.location.href)
      util.commonShare()
    },
    components: {},
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
    methods: {
      init() {
        document.title = '查看章节'
        let id = this.$route.query.id
        let params = {
          url: '/wfcm-api/order/courseChapter',
          data: {'token': localStorage.token, 'courseId': id}
        }
        util.bginterface(params, data => {
          console.log(data)
          if (data.errCode == 0) {
            this.courseChapterList = data.courseChapterList
          } else {
            console.log(data.msg)
          }
        })
      },
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      toDetail(id) {
        this.$router.push({path: '/myChapter', query: {id, courseId: this.$route.query.id}})
      }
    }
  }
</script>
<style lang="less">
  #my-course-chapter {
    box-sizing: border-box;
    .divider{
      height: 0.25rem;
    }
    .has-buy-list {
      box-sizing: border-box;

      .has-buy-item {
        padding: 0.5rem 1rem;
        /*margin-bottom: 1rem;*/
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
            line-height: 2;
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
