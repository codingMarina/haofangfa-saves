//去除html标记并去掉空格
function delHtmlTag(str) {
  var str = str.replace(/<\/?[^>]*>/gim, "");//去掉所有的html标记
  var result = str.replace(/(^\s+)|(\s+$)/g, "");//去掉前后空格
  return result.replace(/\s/g, "");//去除文章中间空格
}

import md5 from './md5'
import axios from 'axios'

function bginterface(params, callback) {
  let timestamp = new Date().getTime()
  let sign = timestamp + "zxcadsadwa@2321$"
  sign = md5.hexMD5(sign)
  let header = {
    sign: sign,
    timestamp: timestamp
  }
  let url = params.url
  let param = transformParams(params.data)
  let token = localStorage.token
  let myUrl = `${url}?timestamp=${timestamp}&sign=${sign}&token=${token}`
  axios({
    method: 'post',
    url: myUrl + param,
    data: header,
    sync: false,
    headers: header
  }).then(res => {
    let result = res.data
    typeof callback === 'function' && callback.call(window, result);
    return result
  }).catch(err => {
    console.log(err)
  })

}

function transformParams(params) {
  let str = ''
  for (let key in params) {
    str += `&${key}=${params[key]}`
  }
  return str
}
/*let wxConfig=new Promise((resolve,reject)=>{
  let timestamp = new Date().getTime()
  let sign = timestamp + "zxcadsadwa@2321$"
  sign = md5.hexMD5(sign)
  let header = {
    sign: sign,
    timestamp: timestamp
  }
  axios({
    method: 'post',
    url: '/wfcm-api/wx/sign',
    headers: header,
    data:{wxUrl:wxUrl}
  }).then(res => {
    if (res.status==200) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxbb2f079521354d0e', // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: ['onMenuShareAppMessage', 'showAllNonBaseMenuItem', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
      });
      resolve({status:200})
    } else {
      reject({status:500})
      console.log(data.msg)
    }
  }).catch(err => {
    console.log(err)
  })
})*/
function wxConfig(wxUrl) {
  let timestamp = new Date().getTime()
  let sign = timestamp + "zxcadsadwa@2321$"
  sign = md5.hexMD5(sign)
  let header = {
    sign: sign,
    timestamp: timestamp
  }
  axios({
    method: 'post',
    url: '/wfcm-api/wx/sign',
    headers: header,
    data:{wxUrl:wxUrl}
  }).then(res => {
    if (res.status==200) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxbb2f079521354d0e', // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: ['onMenuShareAppMessage', 'showAllNonBaseMenuItem', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
      });
    } else {
      console.log(data.msg)
    }
  }).catch(err => {
    console.log(err)
  })
}


function commonShare() {
  wx.ready(function () {
    let params = {
      title: '好芳法课堂', // 分享标题
      desc: `我的孩子正在"好芳法课堂"和王芳老师一起学习，你也快来加入吧！`, // 分享描述
      link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1858388294,1564305533&fm=58&bpow=400&bpoh=500',
    }
    wx.showAllNonBaseMenuItem();
    wx.onMenuShareAppMessage({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享朋友圈
    wx.onMenuShareTimeline({
      title: params.title, // 分享标题
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享QQ
    wx.onMenuShareQQ({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享空间
    wx.onMenuShareQZone({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
  })
}

function detailShare(query) {
  console.log('!!!!', query)
  let params = {
    title: '好芳法课堂', // 分享标题
    desc: `我的孩子正在"${query.desc}"和王芳老师一起学习，你也快来加入吧！`, // 分享描述
    link: `${query.url}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: `${query.img}`,
  }
  wx.ready(function () {

    // wx.showAllNonBaseMenuItem();
    wx.onMenuShareAppMessage({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享朋友圈
    wx.onMenuShareTimeline({
      title: params.title, // 分享标题
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享QQ
    wx.onMenuShareQQ({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
    //分享空间
    wx.onMenuShareQZone({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
    });
  })
}

function hideMenu() {
  wx.ready(function () {
    wx.hideAllNonBaseMenuItem();
  })
}

export default {
  bginterface: bginterface,
  commonShare: commonShare,
  wxConfig: wxConfig,
  detailShare: detailShare,
  hideMenu: hideMenu
}
