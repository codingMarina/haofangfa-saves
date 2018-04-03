<template>
  <div class="func-detail">
    <!--分类-->
    <div class="course-type"  style="height:44px;">
      <sticky ref="sticky" :offset="0" :check-sticky-support="false">
        <tab :line-width="3" v-model="tabActive">
          <tab-item selected @click.native="init()">全部</tab-item>
          <tab-item v-for="(item,index) in tabList" v-text="item.title" @click.native="query(item.id)"
                    :key="'tab'+index"></tab-item>
        </tab>
      </sticky>
    </div>
    <!--课程列表-->
    <div class="course-list">
      <!--课程-->
      <div v-for="(item,index) in courseInfoList" :key="'courseInfo'+index" @click="toCourseDetail(item.id)">
        <div class="course-item">
          <img v-if="item.courseimgurl" class="course-img"
               :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseimgurl" alt="">
          <img v-if="!item.courseimgurl" class="course-img" src="../assets/course-test.png" alt="">
          <div class="course-info">
            <p class="title" v-text="item.coursename"></p>
            <p class="desc" v-text="item.coursedesc"></p>
            <p class="author">主讲人：<span v-text="item.wfSpeakerEntity.speakername"></span></p>
            <div class="price-box">
              <p class="sales-num" v-if="parseInt(item.activityprice)>0">
                销量:<span v-text="item.coursesalenumber"></span>
              </p>
              <p class="price">
                <span class="activity-price" v-if="parseInt(item.activityprice)>0">
                ￥<span v-text="item.activityprice+'/套'"></span>
              </span>
                <span class="activity-price" v-if="parseInt(item.activityprice)==0">
                <span>免费</span>
              </span>
                <!--<span class="orignal-price" v-if="parseInt(item.orignalprice)>0">-->
                <!--￥<span v-text="item.orignalprice"></span>-->
              <!--</span>-->
              </p>

            </div>
          </div>
        </div>
        <div class="divider"></div>
      </div>
      <!--课程包-->
      <div  v-for="(item,index) in vipCardlist" :key="'card'+index" @click="toCardDetail(item.id)">
        <div class="course-item">
          <img v-if="item.cardimg" class="course-img" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.cardimg"
               alt="">
          <img v-if="!item.cardimg" class="course-img" src="../assets/course-test.png" alt="">
          <div class="course-info">
            <p class="title" v-text="item.cardname"></p>
            <p class="desc" v-text="item.carddesc"></p>
            <p class="author">主讲人：<span
              v-text="item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span></p>
            <div class="price-box">
              <p class="sales-num">
                销量:<span v-text="item.cardsalenumber"></span>
              </p>
              <p class="price">
              <span class="activity-price" v-if="parseInt(item.cardprice)>0">
                ￥<span v-text="item.cardprice+'/套'"></span>
              </span>
                <span class="activity-price" v-if="parseInt(item.cardprice)==0">
                <span>免费</span>
              </span>
                <!--<span class="orignal-price" v-if="parseInt(item.cardorignalprice)>0">-->
                <!--￥<span v-text="item.cardorignalprice"></span>-->
              <!--</span>-->
              </p>

            </div>
          </div>
        </div>
        <div class="divider"></div>
      </div>
      <div class="is-empty" v-if="courseInfoList.length+vipCardlist.length==0">
        <img src="../assets/empty.png" alt="">
        <h4>暂无课程</h4>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../util'
  import {Tab, TabItem, Sticky} from 'vux'

  let ageList = [
    {'id': '37', 'title': '0-5岁'},
    {'id': '38', 'title': '6-9岁'},
    {'id': '39', 'title': '9岁以上'}
  ]
  let typeList = [
    {'id': '32', 'title': '大语文'},
    {'id': '33', 'title': '史地课'},
    {'id': '34', 'title': '脱口秀'},
    {'id': '35', 'title': '兴趣课'},
    {'id': '36', 'title': '数学课'}
  ]
  export default {
    name: '',
    data() {
      return {
        typeList: [],
        tabActive: 0,
        courseInfoList: [],
        vipCardlist: [],
        tabList: []
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
        if (document.querySelector('.vux-tab-ink-bar')) {
          document.querySelector('.vux-tab-ink-bar').setAttribute('style', 'background:linear-gradient(to right, #009deb 50%, #7888fc 50%);border-radius:30%;')
        }
        this.init()
        util.wxConfig(window.location.href.split('#')[0])
        util.commonShare()
      } else {
        this.$router.push({path: '/'})
      }
    },
    methods: {
//    全部
      init() {
        let typeid = this.$route.query.typeid
        let ageid = this.$route.query.ageid
        document.title = this.$route.query.title
        if (typeid > 0) {
          this.tabList = ageList
          if (document.querySelector('.vux-tab-ink-bar')) {
            document.querySelector('.vux-tab-ink-bar').style.marginLeft = '10%'
            document.querySelector('.vux-tab-ink-bar').style.marginRight = '10%'
          }
          //按照类型分类
          let params = {
            url: '/wfcm-api/course/courseInfoList',
            data: {'token': localStorage.token, 'courseCategoryId': typeid}
          }
          util.bginterface(params, data => {
            console.log('按照课程分类', data)
            if (data.errCode == 0) {
              this.courseInfoList = data.courseInfolist
              this.vipCardlist = data.vipCardlist
            } else {
              console.log(data.msg)
            }
          })
        } else if (ageid > 0) {
          //按照年龄分类
          this.tabList = typeList
          if (document.querySelector('.vux-tab-ink-bar')) {
            document.querySelector('.vux-tab-ink-bar').style.marginLeft = '6%'
            document.querySelector('.vux-tab-ink-bar').style.marginRight = '6%'
          }
          let params = {
            url: '/wfcm-api/course/courseInfoList',
            data: {'token': localStorage.token, 'ageId': ageid}
          }
          util.bginterface(params, data => {
            console.log('按照年龄分类', data)
            if (data.errCode == 0) {
              this.courseInfoList = data.courseInfolist
              this.vipCardlist = data.vipCardlist
            } else {
              console.log(data.msg)
            }
          })
        }
      },
      toCourseDetail(id) {
        this.$router.push({path: '/courseDetail', query: {id}})
      },
      toCardDetail(id) {
        this.$router.push({path: '/cardDetail', query: {id}})
      },
      query(id) {
        console.log('id:', id)
        let typeid = this.$route.query.typeid
        let ageid = this.$route.query.ageid
        if (typeid >= 0) {
          let params = {
            url: '/wfcm-api/course/courseInfoList',
            data: {'token': localStorage.token, 'ageId': id, 'courseCategoryId': typeid}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              this.courseInfoList = data.courseInfolist
              this.vipCardlist = data.vipCardlist
            } else {
              console.log(data.msg)
            }
          })
        } else if (ageid >= 0) {
          let params = {
            url: '/wfcm-api/course/courseInfoList',
            data: {'token': localStorage.token, 'ageId': ageid, 'courseCategoryId': id}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              this.courseInfoList = data.courseInfolist
              this.vipCardlist = data.vipCardlist
            } else {
              console.log(data.msg)
            }
          })
        }
      }
    },
    components: {
      Tab, TabItem, Sticky
    }
  }
</script>
<style lang="less">
  @import "../assets/less/funcDetail";

</style>
