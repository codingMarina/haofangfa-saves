<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {}
    },
    components: {
    },
    created(){
    },
    mounted() {
    },
    methods: {

    }
  }

</script>
<style lang="less">
  @import "assets/less/common";

  #app {
    width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }
</style>

