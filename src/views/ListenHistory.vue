<template>
  <div class="listen-history" id="">
    <div class="listen-list" v-if="chapterPlayRecordList.length>0">
      <div v-for="(item,index) in chapterPlayRecordList" v-if="item.chapter.chaptername" @click="toChapterDetail(item.chapterid)">
        <div class="listen-item"  >
          <img class="goods-img" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.chapter.imgpath" alt="">
          <div class="detail">
            <p class="title" v-text="item.chapter.chaptername"></p>
            <p class="sub-title" v-text="item.chapter.chaptersubtitle==''?'暂无课程描述':item.chapter.chaptersubtitle"></p>
            <p class="time" v-text="item.chapter.chapterduration"></p>
          </div>
          <!--<img class="download" src="../assets/toDownload.png" alt="" @click="toApp">-->
        </div>
        <div class="divider"></div>
      </div>
    </div>
    <div class="is-empty" v-if="chapterPlayRecordList.length==0">
      <img src="../assets/empty.png" alt="">
      <h4>暂无已收听节目</h4>
    </div>
    <toast class="toast-tip" v-model="isShowToast" type="text" text="请下载好芳法课堂APP获得更好体验"></toast>
  </div>
</template>

<script>
  import util from '../util'
  import {Toast} from 'vux'
  export default {
    name: '',
    data() {
      return {
        chapterPlayRecordList:[],
        isShowToast:false
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
      this.init()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {
      Toast
    },
    methods: {
      init() {
        document.title = '历史收听'
        let params = {
          url: '/wfcm-api/course/playLogList',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            console.log(data)
            this.chapterPlayRecordList=data.chapterPlayRecordList
          } else {
            console.log(data.msg)
          }
        })
      },
      toApp(){
        this.isShowToast=true
      },
      toChapterDetail(id){
        this.$router.push({path:'/chapterDetail',query:{id}})
      }
    }
  }
</script>
<style lang="less">
.listen-history{
  .divider{
    height: 0.25rem;
  }
  .listen-item{
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
      width: 55%;
      p{
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 1.8;
      }
    }
    .goods-img{
      max-width: 40%;
      margin-right: 4%;
      border-radius: 1rem;
    }
    .download{
      max-width: 6%;
    }
  }

}
</style>
