<template>
  <div class="has-buy" id="my-course-tab">
    <ul class="has-buy-list" v-if="courseInfoList.length>0">
      <!--课程-->
      <li  v-for="(item,index) in courseInfoList" @click="toDetail(item.id,item.to)">
        <div class="has-buy-item">
          <img class="has-buy-img" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseimgurl" alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.coursename"></p>
            <p class="detail" v-text="item.coursedesc"></p>
            <p class="author" v-text="'主讲人：'+item.wfSpeakerEntity.speakername"></p>
          </div>
        </div>
        <div class="divider"></div>
      </li>
      <!--课程包-->
      <li v-for="(item,index) in vipCardList" @click="toDetail(item.id,item.to)">
        <div class="has-buy-item" >
          <img class="has-buy-img" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.cardimg" alt="">
          <div class="has-buy-course">
            <p class="title" v-text="item.cardname"></p>
            <p class="detail" v-text="item.carddesc"></p>
            <p class="author" v-text="'主讲人：'+item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
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
        empty: false
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
//      微信JS-SDK
      /*!window.initUrl && (window.initUrl = window.location.href.split('#')[0])
      let isIOS = () => (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad'))
      if (isIOS()) {
        util.wxConfig(window.initUrl)
      } else {
        util.wxConfig(window.location.href.split('#')[0])
      }
      util.commonShare()*/
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {},
    methods: {
      init() {
        document.title = '我的课程'
        let params = {
          url: '/wfcm-api/order/myCourse',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            console.log(data)
            this.courseInfoList=data.courseInfoList
            this.vipCardList =data.vipCardList
            this.courseInfoList = data.courseInfoList
            for(let i=0;i<this.courseInfoList.length;i++){
              this.courseInfoList[i].to='/myCourseChapter'
            }
            this.vipCardList = data.vipCardList
            for(let i=0;i<this.vipCardList.length;i++){
              this.vipCardList[i].to='/myCardCourse'
            }
            if (this.courseInfoList.length + this.vipCardList.length  == 0) {
              this.empty = true
            }
          }else {
            console.log(data.msg)
          }
        })
      },
      toDetail(id,to) {
        this.$router.push({path: to, query: {id, hasbuy: true}})
      }
    }
  }
</script>
<style lang="less">
  #my-course-tab{
    padding-bottom: 3rem;
      .has-buy-list {
        .has-buy-item {
          box-sizing: border-box;
          padding: 0.5rem 1rem;
          /*margin-bottom: 1rem;*/
          display: flex;
          align-items: center;
          justify-content: flex-start;
          img {
            max-width: 40%;
            margin-right: 5%;
            border-radius: 1rem;
          }
          .has-buy-course {
            width: 55%;
            .title, .detail {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 1.8;
            }
            .author,.detail{
              color: gray;
              line-height: 1.8;
              font-size: 0.8rem;
            }
          }
        }
      }
    .divider{
      height: 0.25rem;
    }
  }


</style>
