<template>
  <div class="fall-back" id="">
    <group>
      <x-textarea :max="200" v-model="content" placeholder="您的反馈意见..." ></x-textarea>
      <x-button class="blue-btn" @click.native="submitFallback">提交</x-button>
    </group>
    <toast v-model="hasToast" type="text" :text="toastMsg"></toast>
  </div>
</template>

<script>
  import util from '../util'
  import { XTextarea, Group,XButton,Toast } from 'vux'
  export default {
    name: '',
    data() {
      return {
        content:'',
        hasToast:false,
        toastMsg:''
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
      XTextarea, Group,XButton,Toast
    },
    methods: {
      init() {
        document.title = '问题反馈'
      },
      submitFallback(){
        if(this.content.trim()==''){
          this.toastMsg='内容不能为空'
          this.hasToast=true
        }else{
          let params = {
            url: '/wfcm-api/member/opinion',
            data: {'token': localStorage.token,'remark':this.content}
          }
          util.bginterface(params, data => {
            if (data.errCode == 0) {
              this.toastMsg=data.msg
              this.hasToast=true
              this.content=this.content.trim()
              this.content=''
            } else {
              console.log(data.msg)
            }
          })
        }

      }
    }
  }
</script>
<style lang="less">
.fall-back{
  box-sizing: border-box;
  padding: 1rem 1.5rem;
  .blue-btn{
    background: #2999f0;
    color: #fff;
  }
  .vux-x-textarea{
    border: 1px solid #eeeeee;
    margin-bottom: 1rem;
    border-radius: 1rem;
  }
.weui-textarea-counter{
  span{
    color: rgb(169, 169, 169);
  }
}
}
</style>
