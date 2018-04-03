<template>
  <div class="my-tab">
    <tabbar style="position: absolute;width: 100%;z-index: 1000;bottom: 0;left: 0;">
      <tabbar-item v-for="(item,index) in tabList" :selected="n==index" :key="'tab'+index"
                   @click.native="changeTab(index)">
        <img slot="icon" :src="item.img" class="iconfont">
        <img slot="icon-active" :src="item.activeImg" class="iconfont icon-active">
        <span slot="label" v-text="item.title"></span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'

  let tabsList = [
    {
      'img': '../static/img/tab/home.jpg',
      'activeImg': '../static/img/tab/home-active.jpg',
      'title': '首页',
      'to': '/index/homeCourse',
      'selected': true
    },
    {
      'img': '../static/img/tab/fang.jpg',
      'activeImg': '../static/img/tab/fang-active.jpg',
      'title': '我的课程',
      'to': '/index/myCourse',
      'selected': false
    },
    {
      'img': '../static/img/tab/me.jpg',
      'activeImg': '../static/img/tab/me-active.jpg',
      'title': '我的',
      'to': '/index/me',
      'selected': false
    }
  ]
  export default {
    name: '',
    data() {
      return {
        n: 0,
        tabList: tabsList
      }
    },
    created() {
      if (location.pathname == '/index/homeCourse') {
        this.n = 0
      } else if (location.pathname == '/index/myCourse') {
        this.n = 1
      } else if (location.pathname == '/index/me') {
        this.n = 2
      }
      localStorage.tabPath=location.pathname
    },
    components: {
      Tabbar, TabbarItem
    },
    methods: {
      changeTab(n) {
        this.n = n
        this.$router.push({path: this.tabList[n].to})
        this.$nextTick(() => {
          let list = document.querySelectorAll('.icon-active')
          if (list[n]) {
            list[n].className = 'icon-active'
            setTimeout(() => {
              list[n].className = 'icon-active iconfont'
            }, 50)
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .my-tab {
    position: fixed;
    background: #ffffff;
    z-index: 10000;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow-x: hidden;
    height: 4rem;
    .weui-tabbar {
      box-sizing: border-box;
      padding: 0.25rem;
    }
    .weui-tabbar__icon {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
    }
    .weui-bar__item_on {
      span {
        color: #6ca3d4;
      }
      .iconfont {
        animation: toScale .3s linear;
      }
    }
    @keyframes toScale {
      0% {
        transform: scale(0.85, 0.85);
      }
      35% {
        transform: scale(1.1, 1.1);
      }
      70% {
        transform: scale(1.0, 1.0);
      }
      100% {
        transform: scale(0.95, 0.95);
      }
    }
  }

  .my-tab {
    .weui-tabbar__label {
      font-size: 1rem;
    }
  }

</style>
