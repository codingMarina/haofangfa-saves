<template>
  <div class="video">
    <video-player class="video-player-box video-js vjs-big-play-centered"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                  customEventName="customstatechangedeventname"
                  @play="onPlayerPlay($event)"
                  @ended="onPlayerEnded($event)"
                  @pause="onPlayerPause($event)"
                  @error="videoError"
                  @statechanged="playerStateChanged($event)"
                  @ready="playerReadied">
    </video-player>
  </div>
</template>

<script>
  import util from '../util'

  export default {
    props: ['mysrc', 'myposter', 'chapterid', 'isLoop'],
    data() {
      return {
        playerOptions: {
          // videojs options
          muted: false,
          language: 'cn',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          aspectRatio: '16:9',
          sources: [{
            type: "video/mp4",
            src: this.mysrc
          }],
          poster: this.myposter,
          loop: this.isLoop,
          preload:true
        },
      }
    },
    mounted() {
      document.querySelector('.vjs-menu').style.display = 'none'
    },
    watch: {
      mysrc: {
        handler(newValue, oldValue) {
          this.mysrc = newValue
          this.playerOptions.sources[0].src = newValue
          this.player.load()
        },
//        deep: true
      },
      isLoop: {
        handler(newValue, oldValue) {
          this.playerOptions.loop = newValue
        },
//        deep: true
      },

    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
        let params = {
          url: '/wfcm-api/course/savePlayLog',
          data: {'token': localStorage.token, 'chapterId': this.chapterid}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            let params = {
              url: '/wfcm-api/course/courseChapter',
              data: {'token': localStorage.token, 'chapterId': this.chapterid}
            }
            util.bginterface(params, data => {
              if (data.errCode == 0) {
                // 赋值
                this.$emit('getPlayTotal', data.playTotal);
              } else {
                console.log(data.msg)
              }
            })
          } else {
            console.log(data.msg)
          }
        })
      },
      videoError(){
        alert('手机视频解析器无法解析本视频，请您用电脑客户端微信打开好芳法课堂公众号进行收听')
        this.$emit('hasFinished', true);
      },
      onPlayerEnded(player) {
        console.log('听完啦~')
        this.$emit('hasFinished', true);
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
//        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
//        document.querySelector('.vjs-tech').setAttribute('autoplay', true)
      }
    }
  }
</script>
<style lang="less">
  @import "../assets/less/video";
</style>
