<template>
  <div class="common-probles">
    <ul class="problems-list">
      <li class="title">
        <span class="pad-left"></span>
        <span>帮助中心</span>
      </li>
      <li class="problems-item" v-for="(item,index) in areaList" :key="'problems'+index"
          @click="saveProblem(item.id,item.title)">
        <p v-text="item.title"></p>
        <span class="iconfont icon-xiangyoujiantou"></span>
      </li>
      <li class="title">
        <span class="pad-left"></span>
        <span>客服电话</span>
      </li>
      <li class="phone">
        <a href="tel:4008980908">400-898-0908</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from '../md5'
  import util from '../util'

  export default {
    name: '',
    data() {
      return {
        areaList: []
      }
    },
    mounted() {
      this.init()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      //      微信JS-SDK
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
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
    components: {},
    methods: {
      init() {
        document.title = '常见问题'
        let params = {
          url: '/wfcm-api/member/question',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.areaList = data.areaList
          } else {
            console.log(data.msg)
          }
        })
      },
      saveProblem(id,title) {
        this.$router.push({path: '/saveProblem', query: {id,title}})
      }
    }
  }
</script>
<style lang="less">
  .common-probles {
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 1rem;
      margin-top: 1rem;
      font-size: 1.1rem;
      .pad-left{
        display: inline-block;
        width: 3px;
        height: 1rem;
        border-radius: 30%;
        background: #1b92ef;
        margin-right: 0.5rem;
      }
    }
    .problems-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0.8rem 0 ;
      color: gray;
      span,p{
        color: gray;
      }
    }
    .phone{
      a{
        color: #1b92ef;
        text-decoration: underline;
      }
    }
  }

</style>
