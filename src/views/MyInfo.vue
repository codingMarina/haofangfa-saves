<template>
  <div class="my-info" id="my-info">
    <!--宝贝信息及收货信息-->
    <div class="goods-info">
      <tab>
        <tab-item selected @on-item-click="changeInfoTab(0)">宝贝信息</tab-item>
        <tab-item @on-item-click="changeInfoTab(1)">收货信息(选填)</tab-item>
      </tab>
      <!--宝贝信息-->
      <ul class="info" v-if="index==0">
        <div class="me-panel">
          <input class="file" name="imgFile" type="file" accept="image/*" @change="uploadImg"/>
          <span class="title" v-text="avatar?'您的头像':'选择您的头像'"></span>
          <div class="primary text-right">
            <img class="avatar" v-if="avatar" id="kay-avatar"
                 :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+avatar" alt="">
            <img class="avatar" v-if="!avatar" src="../assets/avatar.png" alt="">
          </div>
          <span class="right-arrow iconfont icon-xiangyoujiantou"></span>
        </div>

        <li class="u-name">
          <span>您心爱宝贝的昵称：</span>
          <x-input :value="uname" v-model="uname"></x-input>
        </li>
        <li>
          <calendar :display-format="displayFormat" @on-change="onChange" :title="birthday"
                    disable-future v-model="demo3">
          </calendar>
        </li>
        <li>
          <div class="me-panel" @click="gender=true">
            <span class="title">宝宝的性别</span>
            <div class="primary text-left">
              <span class="gender-name" v-model="genderName" v-text="genderName"></span>
            </div>
            <span class="right-arrow iconfont icon-xiangyoujiantou"></span>
          </div>
        </li>
        <li>
          <popup-radio title="您所在的地域" :options="districts" v-model="district" class="district" :value="userInfo.region">
            <p slot="popup-header" class="vux-1px-b demo3-slot">请选择地域</p>
          </popup-radio>
        </li>
      </ul>
      <!--收货地址-->
      <ul class="info" v-if="index==1">
        <li>
          <x-input title='收货人' placeholder="请输入收货人姓名" v-model="recipient"></x-input>
        </li>
        <li>
          <x-input title='联系方式' placeholder="请输入联系方式" v-model="contact"></x-input>
        </li>
        <li>
          <popup-radio title="收获地址" :options="districts" v-model="addressDistrict">
            <p slot="popup-header" class="vux-1px-b demo3-slot">请选择地域</p>
          </popup-radio>
        </li>
        <li>
          <x-input title='详细地址' placeholder="请输入详细地址" v-model="addressDetail"></x-input>
        </li>
      </ul>
      <div class="btn-group">
        <x-button class="btn login-btn" @click.native="save()" :gradients="['#2999f0', '#2999f0']">
          保存
        </x-button>
      </div>
    </div>

    <actionsheet v-model="gender" :menus="menus1" @on-click-menu="getGender"></actionsheet>
    <toast v-model="showToast" :text="toastMsg"></toast>

  </div>
</template>

<script>
  let proviences = ["北京市", "天津市", "河北省", "山西省", "内蒙古", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西省", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏", "陕西省", "甘肃省", "青海省", "宁夏", "新疆", "香港", "澳门", "台湾"]
  import axios from 'axios'
  import md5 from '../md5'
  import util from '../util'
  import {
    Tab,
    TabItem,
    Calendar,
    Checker,
    CheckerItem,
    Picker,
    XInput,
    PopupRadio,
    Actionsheet,
    XButton,
    Toast
  } from 'vux'

  let years = []
  for (var i = 2000; i <= 2030; i++) {
    years.push({
      name: i + '年',
      value: i + ''
    })
  }

  export default {
    name: '',
    data() {
      return {
        index: 0,
        demo3: '',
        avatar: null,
        displayFormat(value, type) {
          if (type === 'string') {
            return value
          } else {
            return value.length ? (value.length + ' days') : ''
          }
        },
        demo11: null,
        year1: [''],
        years: [years],
        uname: null,
        radio001: ['男孩', '女孩'],
        district: '',
        districts: proviences,
        gender: false,
        menus1: {
          male: '男孩',
          female: '女孩'
        },
        genderName: '',
        birthday: '请选择宝贝出生年月',
        userInfo: {},
        addressDetail: '',
        contact: '',
        postcode: '',
        recipient: '',
        addressDistrict: '',
        showToast: false,
        toastMsg: ''
      }
    },
    mounted() {
      this.init()
//      !window.initUrl && (window.initUrl = window.location.href)
//      util.commonShareWithFriends()
      util.wxConfig(encodeURIComponent(window.location.href))
      util.commonShare()
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
    components: {
      Calendar, Tab, TabItem, Checker, CheckerItem, Picker, XInput, PopupRadio, Actionsheet, XButton, Toast
    },
    methods: {
      init() {
        document.title = '个人资料'
        let params = {
          url: '/wfcm-api/member/children',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            console.log('宝贝信息', data)
            this.avatar = data.image
            if (data.memberChildrenEntity) {

              this.userInfo = data.memberChildrenEntity
              this.genderName = (data.memberChildrenEntity.childsex == 1) ? '男孩' : '女孩'
              this.district = data.memberChildrenEntity.region
              this.demo3 = data.memberChildrenEntity.childbirthday
              this.uname = data.memberChildrenEntity.childname
            }

          } else {
            console.log(data.msg)
          }
        })
      },
      changeInfoTab(n) {
        this.index = n
        if (n == 0) {
          this.init()
        } else if (n == 1) {
          this.getGoodsAddress()
        }
      },
      getGoodsAddress() {
        let params = {
          url: '/wfcm-api/member/address',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          console.log('收货地址', data)
          if (data.errCode == 0 && data.memberAddressEntity) {
            this.addressDetail = data.memberAddressEntity.address
            this.addressDistrict = data.memberAddressEntity.city
            this.contact = data.memberAddressEntity.contact
            this.postcode = data.memberAddressEntity.postcode
            this.recipient = data.memberAddressEntity.recipient
          } else {
            console.log(data.msg)
          }
        })
      },
      onChange(val) {
        if (this.demo3 != '') {
          this.birthday = '宝宝的出生年月'
        } else {
          this.birthday = '请选择宝宝的出生年月'
        }
      },
      getGender(key) {
        if (key == 'male') {
          this.genderName = '男孩'
        } else {
          this.genderName = '女孩'
        }
      },
      change(value) {
//        console.log('new Value', value)
      },
      changeGender(value, label) {
//        console.log('change:', value, label)
      },
      uploadImg(e) {
        let file = e.target.files[0];
        let param = new FormData(); //创建form对象
        let timestamp = new Date().getTime()
        let sign = timestamp + "zxcadsadwa@2321$"
        sign = md5.hexMD5(sign)
        let header = {
          sign: sign,
          timestamp: timestamp,
          'Content-Type': 'multipart/form-data',
          token: localStorage.token
        }
        param.append('imgFile', file);//通过append向form对象添加数据
        param.append('timestamp', timestamp);//添加form表单中其他数据
        param.append('sign', sign);//添加form表单中其他数据
        param.append('token', localStorage.token);//添加form表单中其他数据
//        console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: header
        };  //添加请求头

        axios.post('/wfcm-api/member/uploadPhoto', param, config)
          .then(response => {
            this.avatar = response.data.url
            console.log('头像链接', response.data.url)
          }).catch(err => {
          console.log(err)
        })
      },
      save() {
        if (this.index == 0) {
          let params = {
            url: '/wfcm-api/member/updateChildrenH5',
            data: {
              'token': localStorage.token,
              'childName': this.uname,
              'childBirthday': this.demo3,
              'city': this.district,
              'childSex': this.genderName == '男孩' ? 1 : 2
            }
          }
          console.log(this.uname, this.demo3, this.district, this.genderName)
          util.bginterface(params, data => {
            console.log(data)
            if (data.errCode == 0) {
              this.showToast = true
              this.toastMsg = data.msg
            } else {
              console.log(data.msg)
              this.showToast = true
              this.toastMsg = data.msg
            }
          })
        } else if (this.index == 1) {
          let params = {
            url: '/wfcm-api/member/updateAddressH5',
            data: {
              'token': localStorage.token,
              'recipient': this.recipient,
              'contact': this.contact,
              'city': this.addressDistrict,
              'address': this.addressDetail
            }
          }
          console.log(this.recipient, this.contact, this.addressDistrict, this.addressDetail)
          util.bginterface(params, data => {
            console.log(data)
            if (data.errCode == 0) {
              this.showToast = true
              this.toastMsg = data.msg
            } else {
              console.log(data.msg)
              this.showToast = true
              this.toastMsg = data.msg
            }
          })
        }
      },
    }
  }

</script>
<style lang="less">
  #my-info {
    .weui-cells_radio {
      height: 21rem !important;
    }

    .selected-days {
      color: #999;
      width: 90px;
    }

    .file {
      opacity: 0;
      position: absolute;
      width: 100%;
    }

    .demo1-item-selected {
      border: 1px solid green;
    }

    .vux-cell-placeholder {
      color: gray;
    }

    .vux-tab-ink-bar {
      width: 7% !important;
      margin-left: 21% !important;
    }

    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #333333 !important;
    }

    .user-bg {
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        border: 3px solid lightgrey;
        margin-right: 1rem;
        img {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
        }
      }
      .user-info {
        .title {
          font-size: 1rem;
        }
        .sub {
          color: gray;
          span {
            color: gray;
            line-height: 1.5;
          }
        }
      }
    }

    .u-name {
      span {
        color: gray;
        white-space: nowrap;
      }
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 10px 15px;
    }

    .nice-radio {
      div {
        position: relative;
        line-height: 30px;
        margin-right: 1rem;
      }

      input[type="radio"] {
        width: 1rem;
        height: 1rem;
        opacity: 0;
      }

      label {
        position: absolute;
        left: -1px;
        top: 7px;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 1px solid #999;
      }

      /*设置选中的input的样式*/
      /* + 是兄弟选择器,获取选中后的label元素*/
      input:checked + label {
        background-color: #fe6d32;
        border: 1px solid #fe6d32;
      }

      input:checked + label::after {
        position: absolute;
        content: "";
        width: 4px;
        height: 7px;
        top: 2px;
        left: 4px;
        border: 2px solid #fff;
        border-top: none;
        border-left: none;
        transform: rotate(45deg)
      }
    }

    .demo3-slot {
      text-align: center;
      padding: 8px 0;
      color: #888;
    }

    .vux-calendar {
      .weui-cell__ft {
        text-align: left;
      }
      .vux-cell-bd {
        .vux-label {
          color: gray;
          margin-right: 1rem;
        }
      }
    }

    .district {
      .weui-cell__ft {
        width: 76%;
        text-align: left;
      }
      .vux-label {
        color: gray;
        white-space: nowrap;
        margin-right: 1rem;
      }
    }

    .me-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 10px 15px;
      position: relative;
      .title {
        white-space: nowrap;
        color: gray;
      }
      .primary {
        width: 100%;
        img {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 2px solid lightgrey;
          margin-right: 1rem;
        }
      }
    }

    .icon-xiangyoujiantou {
      font-size: 12px;
      color: #C8C8CD;
      font-weight: bold;
    }

    .gender-name {
      margin-left: 1rem;
    }

    .uploader {
      opacity: 0;
      position: fixed;
      width: 100%;
      height: 70px;
    }

    .btn-group {
      box-sizing: border-box;
      padding: 1rem;
    }
  }

</style>
