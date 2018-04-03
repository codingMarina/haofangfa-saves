import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index' //带Tab布局的页面
import HomeCourse from '@/components/HomeCourse'//tab-首页课程
import MyCourse from '@/components/MyCourse'//tab-芳姐推荐
import Me from '@/components/Me'//tab-我的
import News from '@/views/News' //公告详情页面
import Search from '@/views/Search' //搜索页面
import ChapterDetail from '@/views/ChapterDetail'//未购买-章节详情页面
import CourseDetail from '@/views/CourseDetail'//未购买-课程详情页面
import CardDetail from '@/views/CardDetail'//未购买-课程包详情页面
import FuncDetail from '@/views/FuncDetail'//首页 十大分类 详情页面
import ShowAllCourse from '@/views/ShowAllCourse'//首页分类课程 查看全部
import Login from '@/views/Login' //登陆页面
import CommonProblems from '@/views/CommonProblems'//我的-常见问题页面
import SaveProblem from '@/views/SaveProblem'//我的-常见问题-解答问题页面
import MyInfo from '@/views/MyInfo'//我的-个人资料
import MyCardCourse from '@/views/MyCardCourse'
import MyCourseChapter from '@/views/MyCourseChapter'
import MyFavorite from '@/views/MyFavorite'//我的-我的收藏
import MyChapter from '@/views/MyChapter'//我的-我的收藏
import MyCoupon from '@/views/MyCoupon'//我的-优惠券
import InviteFriend from '@/views/InviteFriend'//我的-邀请好友
import ShopCart from '@/views/ShopCart'//购物车
import MyOrder from '@/views/MyOrder'//我的订单
import MakeOrder from '@/views/MakeOrder'//我的订单
import AvailableCoupon from '@/views/AvailableCoupon'//我可以使用的优惠券
import UserAgreement from '@/views/UserAgreement'//用户协议
import MakeBuyNowOrder from '@/views/MakeBuyNowOrder'//立即购买
import ListenHistory from '@/views/ListenHistory'//历史收听
import Coins from '@/views/Coins'//铜钱
import TradeHistory from '@/views/TradeHistory'//交易记录
import MyQRcode from '@/views/MyQRcode'//邀请好友-二维码页面
import MyInviteHistory from '@/views/MyInviteHistory'//邀请好友-邀请记录
import Fallback from '@/views/Fallback'//我的-问题反馈
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'homeCourse',
          name: 'homeCourse',
          component: HomeCourse
        },
        {
          path: 'myCourse',
          name: 'myCourse',
          component: MyCourse
        },
        {
          path: 'me',
          name: 'me',
          component: Me
        },
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/myFavorite',
      name: 'myFavorite',
      component: MyFavorite
    },
    {
      path: '/chapterDetail',
      name: 'chapterDetail',
      component: ChapterDetail
    },
    {
      path: '/courseDetail',
      name: 'courseDetail',
      component: CourseDetail
    },
    {
      path: '/cardDetail',
      name: 'cardDetail',
      component: CardDetail
    },
    {
      path: '/commonProblems',
      name: 'commonProblems',
      component: CommonProblems
    },
    {
      path: '/saveProblem',
      name: 'saveProblem',
      component: SaveProblem
    },
    {
      path: '/myInfo',
      name: 'myInfo',
      component: MyInfo
    },
    {
      path: '/myCardCourse',
      name: 'myCardCourse',
      component: MyCardCourse
    },
    {
      path: '/myCourseChapter',
      name: 'myCourseChapter',
      component: MyCourseChapter
    },
    {
      path: '/myChapter',
      name: 'myChapter',
      component: MyChapter
    },
    {
      path: '/myCoupon',
      name: 'myCoupon',
      component: MyCoupon
    },
    {
      path: '/inviteFriend',
      name: 'inviteFriend',
      component: InviteFriend
    },
    {
      path: '/shopCart',
      name: 'shopCart',
      component: ShopCart
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: MyOrder
    },
    {
      path: '/makeOrder',
      name: 'makeOrder',
      component: MakeOrder
    },
    {
      path: '/availableCoupon',
      name: 'availableCoupon',
      component: AvailableCoupon
    },
    {
      path: '/userAgreement',
      name: 'userAgreement',
      component: UserAgreement
    },
    {
      path: '/makeBuyNowOrder',
      name: 'MakeBuyNowOrder',
      component: MakeBuyNowOrder
    },
    {
      path: '/listenHistory',
      name: 'listenHistory',
      component: ListenHistory
    },
    {
      path: '/coins',
      name: 'coins',
      component: Coins
    },
    {
      path: '/tradeHistory',
      name: 'tradeHistory',
      component: TradeHistory
    },
    {
      path: '/myQRcode',
      name: 'myQRcode',
      component: MyQRcode
    },
    {
      path: '/myInviteHistory',
      name: 'myInviteHistory',
      component: MyInviteHistory
    },
    {
      path: '/fallback',
      name: 'fallback',
      component: Fallback
    },
    {
      path: '/funcDetail',
      name: 'funcDetail',
      component: FuncDetail
    },
    {
      path: '/showAllCourse',
      name: 'showAllCourse',
      component: ShowAllCourse
    }
  ]
})

