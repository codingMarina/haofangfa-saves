<template>
  <div class="" id="">

  </div>
</template>

<script>
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
      util.wxConfig()
      wx.ready( ()=> {
        let params = {
          title: '好芳法课堂',
          desc: '我的孩子正在"好芳法课堂"和王芳老师一起学习，你也快来加入吧！',
          link: window.location.href,
          imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520517740428&di=e3fbddc6faa61011af055468fd845196&imgtype=0&src=http%3A%2F%2Fimg3.cache.netease.com%2Fparentchild%2Ffen%2F16031004.jpg'
        }
        util.shareWithFriends(params,()=>{})
      });
//      this.init()
    },
    components: {

    },
    methods: {
      init() {
        document.title = '邀请好友'
        let params = {
          url: '',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {

          } else {
            console.log(data.msg)
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style>
