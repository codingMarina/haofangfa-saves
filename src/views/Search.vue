<template>
  <div class="search-page">
    <!--搜索-->
    <div class="search">
      <input type="text" placeholder="史地课程包" v-model="searchContent">
      <a href="javascript:;" @click="search()">搜索</a>
    </div>
    <!--热搜-->
    <div class="hot" v-if="searchResult==0">
      <h4>热搜</h4>
      <div class="hot-list">
        <a href="javascript:;" class="hot-item" @click="getSearchContent(item.keyword)"
           v-for="(item,index) in keyWordsList" v-text="item.keyword"></a>
      </div>
    </div>
    <!--搜索结果-->
    <div class="search-result">
      <ul class="result-list">
        <!--课程结果-->
        <li v-for="(item,index) in searchResult" class="result-item" @click="toCourseDetail(item.id)" :key="'scourse'+index">
          <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseimgurl" alt="">
          <div class="course-info">
            <p class="title" v-text="item.coursename"></p>
            <p class="desc" v-text="item.coursedesc"></p>
            <p>主讲人：<span v-text="item.wfSpeakerEntity.speakername"></span></p>
            <p v-if="item.activityprice>0"><span class="activity">￥<span v-text="item.activityprice"></span>/套</span>
              <span class="orignal">￥<span v-text="item.orignalprice"></span>/套</span></p>
            <p class="activity" v-if="item.activityprice==0">免费</p>
          </div>
          <div class="iconfont icon-xiangyoujiantou">
          </div>
        </li>
        <!--课程包结果-->
        <li v-for="(item,index) in vipCardlist" class="result-item"  @click="toCardDetail(item.id)"  :key="'scard'+index">
          <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.cardimg" alt="">
          <div class="course-info">
            <p class="title" v-text="item.cardname"></p>
            <p class="desc" v-text="item.carddesc"></p>
            <p>主讲人：<span v-text="item.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></span></p>
            <p v-if="item.cardprice>0"><span class="activity">￥<span v-text="item.cardprice"></span>/套</span> <span
              class="orignal">￥<span v-text="item.cardorignalprice"></span>/套</span></p>
            <p class="activity" v-if="item.cardprice==0">免费</p>
          </div>
          <div class="iconfont icon-xiangyoujiantou">
          </div>
        </li>
      </ul>
    </div>
    <my-tab></my-tab>
  </div>
</template>

<script>
  import axios from 'axios'
  import MyTab from '../components/MyTab.vue'
  import md5 from '../md5'
  import util from '../util'

  export default {
    name: '',
    data() {
      return {
        searchContent: '',
        keyWordsList: [],
        searchResult: [],
        vipCardlist: []
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
      document.title = '搜索'
      this.getKeyWords()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {
      MyTab
    },
    methods: {
      search() {
//        if (this.searchContent != '') {
        let timestamp = new Date().getTime()
        let sign = timestamp + "zxcadsadwa@2321$"
        sign = md5.hexMD5(sign)
        let params = {
          sign: sign,
          timestamp: timestamp
        }
        axios({
          method: 'post',
          url: '/wfcm-api/search/H5course?timestamp=' + timestamp + '&sign=' + sign + '&keywords=' + this.searchContent,
          headers: params
        }).then(res => {
          if (res.data.errCode == 0) {
            this.searchResult = res.data.courseInfolist
            this.vipCardlist = res.data.vipCardlist
          }
        }).catch(err => {
          console.log(err)
        })
//        } else {
//          console.log('搜索内容不能为空')
//        }
      },
      getSearchContent(content) {
        this.searchContent = content
        this.search()
      },
      getKeyWords() {
        let timestamp = new Date().getTime()
        let sign = timestamp + "zxcadsadwa@2321$"
        sign = md5.hexMD5(sign)
        let params = {
          sign: sign,
          timestamp: timestamp
        }
        axios({
          method: 'post',
          url: '/wfcm-api/search/searchHotKeyword?timestamp=' + timestamp + '&sign=' + sign,
          headers: params
        }).then(res => {
          this.keyWordsList = res.data.keywordList

        }).catch(err => {
          console.log(err)
        })
      },
      toCourseDetail(courseid) {
        console.log(courseid)
        this.$router.push({path: '/courseDetail', query: {id:courseid}})
      },
      toCardDetail(cardid) {
        console.log(cardid)
        this.$router.push({path: '/cardDetail', query: {id:cardid}})
      }

    }
  }
</script>
<style lang="less">
  .search-page {
    .search {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      input {
        width: 85%;
        border: none;
        background: #eeeeee;
        border-radius: 5rem;
        padding: 0.35rem 1rem;
      }
      a {
        width: 15%;
        text-align: center;
      }
    }
    h4 {
      margin: 0;
      padding: 1rem 2rem 0;
      box-sizing: border-box;
    }
    .hot-list {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      flex-wrap: wrap;
      justify-content: flex-start;
      a {
        display: inline-block;
        text-align: center;
        margin-top: 1rem;
        padding: 0.35rem 0.75rem;
        box-sizing: border-box;
        background: #eeeeee;
        margin: 0.5rem;
        border-radius: 10px;
        white-space: nowrap;
      }
    }
    .result-list {
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      padding-bottom: 4.5rem;
      .result-item {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        img {
          max-width: 40%;
          margin-right: 5%;
        }
        .course-info {
          width: 50%;
          .activity {
            color: orange;
            span {
              color: orange;
            }
          }
          .title {
            font-weight: bold;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .desc {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .orignal {
            text-decoration: line-through;
          }
        }
      }
    }
  }
</style>
