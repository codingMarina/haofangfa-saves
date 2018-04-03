<template>
  <div class="news">
    <div id="newsContent"></div>
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
      let index = this.$route.query.index
      let timestamp = new Date().getTime()
      let sign = timestamp + "zxcadsadwa@2321$"
      sign = md5.hexMD5(sign)
      let params = {
        sign: sign,
        timestamp: timestamp
      }
      axios({
        method: 'post',
        url: '/wfcm-api/activity/newsList?timestamp=' + timestamp + '&sign=' + sign+'&token='+localStorage.token,
        headers: {
          sign: sign,
          timestamp: timestamp
        }
      }).then(res => {
        if (res.data.errCode == 0) {
          this.$nextTick(()=>{
            document.getElementById('newsContent').innerHTML = res.data.newsList[index].content
            //设置样式
            let imgs = document.getElementsByTagName('img')
            if (imgs.length > 0) {
              Array.from(imgs).forEach(item => {
                if (item.attributes.width && item.attributes.height) {
                  let originWidth = item.attributes.width.value
                  let originHeight = item.attributes.height.value
                  let nowWidth = item.width
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
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()

    },
    methods: {}
  }
</script>
<style lang="less">
  .news {
    max-width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    margin: 0 auto;
    overflow-x: hidden;
    img {
      max-width: 100%;
    }
  }
</style>
