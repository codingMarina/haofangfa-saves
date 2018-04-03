<template>
  <div class="save-peoblem">
    <div class="title">
      <span class="pad-left"></span>
      <span>帮助中心</span>
    </div>
    <div class="question">
      <span class="q-a">Q:</span>
      <span v-text="question"></span>
    </div>
    <div class="question">
      <span class="q-a">A:</span>
    </div>
    <div id="content-box">
      <div v-html="content"></div>
    </div>
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
        areaList: [],
        content: '',
        id: '',
        question: ''
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
      this.init()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()
    },
    components: {},
    methods: {
      init() {
        document.title = '查看解决方案'

        this.id = this.$route.query.id
        this.question = this.$route.query.title
        let timestamp = new Date().getTime()
        let sign = timestamp + "zxcadsadwa@2321$"
        sign = md5.hexMD5(sign)
        let params = {
          sign: sign,
          timestamp: timestamp
        }
        axios({
          method: 'post',
          url: '/wfcm-api/member/question?timestamp=' + timestamp + '&sign=' + sign + '&token=' + localStorage.token,
          headers: params
        }).then(res => {
          if (res.data.errCode == 0) {
            Array.from(res.data.areaList).forEach((item) => {
              if (item.id == this.id) {
                this.content = item.content
              } else {
                return
              }
            })
            this.$nextTick(function () {
              let box = document.getElementById('content-box')
              let cimgs = box.getElementsByTagName('img')
              let imgs = Array.from(cimgs)
              if (imgs.length > 0) {
                Array.from(imgs).forEach(item => {
                  if (item.attributes.width && item.attributes.height) {
                    let originWidth = item.attributes.width.value
                    let originHeight = item.attributes.height.value
                    let nowWidth = box.offsetWidth
                    let nowHeight = nowWidth / originWidth * originHeight
                    item.style.height = nowHeight + 'px'
                  }
                })
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less">
  .save-peoblem {
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 1rem;
      margin-top: 1rem;
      font-size: 1.1rem;
      .pad-left {
        display: inline-block;
        width: 3px;
        height: 1rem;
        border-radius: 30%;
        background: #1b92ef;
        margin-right: 0.5rem;
      }
    }
    .question {
      span {
        color: darkgray;
      }
    }
    .q-a {
      color: lightgray;
      font-weight: bold;
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    .question {
      margin-bottom: 1rem;
    }
    #content-box {
      img {
        max-width: 100%;
      }
    }
  }

</style>
