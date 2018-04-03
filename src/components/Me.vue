<template>
  <div class="me">
    <div class="more text-right">
      <a href="javascript:;" @click="toMyInfo()">编辑</a>
    </div>
    <!--用户信息部分-->
    <div class="user-bg">
      <div class="avatar">
        <img v-if="!avatar" src="../assets/avatar.png" alt="">
        <img v-if="avatar" :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+avatar" alt="">
      </div>
      <div class="user-info">
        <p class="title" v-text="username?username:'暂无昵称'"></p>
        <p class="sub">正在使用<span>手机账号</span>登录</p>
      </div>
    </div>
    <group>
      <cell title="购物车" is-link @click.native="toShopCart()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/gouwuche.png">
      </cell>
    </group>
    <div class="divider"></div>
    <group>
      <cell title="铜钱" is-link @click.native="toCoins">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/tongqian.png">
      </cell>
      <cell title="我的订单" is-link @click.native="toMyOrder()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/wodedingdan.png">
      </cell>
      <cell title="优惠券" is-link @click.native="toMyCoupon()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../assets/youhuiquan.png">
      </cell>
    </group>
    <div class="divider"></div>
    <group>
      <cell title="我的收藏" is-link @click.native="toMyFavorite()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/wodeshoucang.png">
      </cell>
      <cell title="我的缓存" is-link @click.native="showModal=true">
        <img slot="icon"

             width="20" style="display:block;margin-right:5px;"
             src="../assets/wodehuancun.png">
      </cell>
      <cell title="历史收听" is-link @click.native="toListenHistory">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/lishishouting.png">
      </cell>
    </group>
    <div class="divider"></div>
    <group>
      <cell title="账号绑定" is-link @click.native="showModal=true">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/zhanghaobangding.png">
      </cell>
      <cell title="邀请好友" is-link @click.native="inviteFriend()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/yaoqinghaoyou.png">
      </cell>
      <cell title="常见问题" is-link @click.native="solveProblems()">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/changjianwenti.png">
      </cell>
      <!--<cell title="联系客服" is-link>-->
        <!--<img slot="icon" width="20" style="display:block;margin-right:5px;" src="../assets/lianxikefu.png">-->
        <!--<a class="phone" href="tel:4008980908"></a>-->
      <!--</cell>-->
      <a class="kefu"  href="tel:4008980908">
        <p>
          <img src="../assets/lianxikefu.png" alt="">
          <span>联系客服</span>
        </p>
        <p class="tel text-right">4008980908</p>
        <p class="iconfont icon-xiangyoujiantou"></p>
      </a>
      <cell title="问题反馈" is-link @click.native="toFallback">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/wentifankui.png">
      </cell>
      <cell title="用户设置" is-link @click.native="showModal=true">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             src="../assets/yonghushezhi.png">
      </cell>
    </group>
    <div class="btn-box">
      <button class="btn btn-primary log-out" @click="logout()">退出登录</button>
    </div>
    <div v-transfer-dom @click="showModal=false">
      <x-dialog v-model="showModal" class="dialog-demo">
        <p class="dialog-title">请您下载好芳法课堂进行查看</p>
        <span class="vux-close" @click="showModal=false"></span>
      </x-dialog>
    </div>
    <confirm v-model="confirm" title="确定要退出好芳法课堂么？" @on-cancel="onCancel" @on-confirm="onConfirm"></confirm>
    <my-tab></my-tab>
  </div>
</template>

<script>
  import MyTab from './MyTab.vue'
  import {XDialog, XButton,Confirm, Group, XSwitch, TransferDomDirective as TransferDom, Cell} from 'vux'
  import util from '../util'
  export default {

    name: '',
    data() {
      return {
        msg: '',
        showModal: false,
        confirm:false,
        avatar:null,
        username:null
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
      document.title = '我的'
      if(!localStorage.token){
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
    directives: {
      TransferDom
    },
    methods: {
      init(){
        let params = {
          url: '/wfcm-api/member/children',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.avatar = data.image
            if(data.memberChildrenEntity){
              this.username=data.memberChildrenEntity.childname
            }
            console.log(data)
          } else {
            console.log(data.msg)
          }
        })
      },
      onCancel () {
//        console.log('on cancel')
      },
      toMyCoupon(){
        this.$router.push({path:'/myCoupon'})
      },
      onConfirm (msg) {
        let params = {
          url: '/wfcm-api/member/logout',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            localStorage.removeItem('token')
            this.$router.push({path:'/'})
          }
          else {
            alert(data.msg)
//            console.log(data.msg)
          }
        })
      },
      toCoins(){
        this.$router.push({path: '/coins'})
      },
      toHasBuy() {
        this.$router.push({path: '/myCourse'})
      },
      solveProblems() {
        this.$router.push({path: '/commonProblems'})
      },
      toMyInfo() {
        this.$router.push({path: '/myInfo'})
      },
      logout(){
        this.confirm=true
      },
      toMyFavorite(){
        this.$router.push({path:'/myFavorite'})
      },
      toListenHistory(){
        this.$router.push({path:'/listenHistory'})
      },
      inviteFriend(){
        this.$router.push({path:'/inviteFriend'})
      },
      toShopCart(){
        this.$router.push({path:'/shopCart'})
      },
      toMyOrder(){
        this.$router.push({path:'/myOrder'})
      },
      toFallback(){
        this.$router.push({path:'/fallback'})
      }
    },
    components: {
      MyTab,XDialog,XButton,Group,XSwitch,Cell,Confirm
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/close';
  @import "../assets/less/me";
</style>
