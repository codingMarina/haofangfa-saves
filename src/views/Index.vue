<template>
  <div class="index">
    <router-view></router-view>
    <my-tab ></my-tab>
  </div>
</template>

<script>
  //  import MyIndex from '../components/HomeCourse.vue'
  import MyTab from '../components/MyTab.vue'
  import util from '../util'
  //  let imgServer = 'http://wangfang.oss-cn-qingdao.aliyuncs.com/'
  export default {
    data() {
      return {}
    },
    created() {
    },
    mounted() {
      document.title = '好芳法课堂'
      if (!localStorage.token) {
        this.$router.push({path: '/'})
      }else{
        this.$router.push({path: localStorage.tabPath})
      }
    },
    components: {
      MyTab
    },
    methods: {

    }
  }
</script>
<style lang="less">
  .index {
    width: 100%;
    overflow-x: hidden;
  }
</style>
