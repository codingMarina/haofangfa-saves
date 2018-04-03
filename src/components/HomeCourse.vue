<template>
  <div class="home-course" id="home-course">
    <div class="loading" v-if="isMyLoading">
      <img src="../assets/audio.svg" alt="">
    </div>
    <!--搜索-->
    <div class="search" @click="toSearch()">
      <span class="iconfont icon-sousuo"></span>
      <p>大语文 | 情商课 | 兴趣课</p>
    </div>
    <!--头部轮播图-->
    <div class="my-swiper">
      <swiper :show-dots="true" dots-position="center" :auto="true" :loop="true" :aspect-ratio=0.5>
        <swiper-item v-for="(item, index) in adList" :key="index" v-if="adList.length>0">
          <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.imgurl" alt="" @click="toSwiperDetail(item)"
               class="swiper-img">
        </swiper-item>
        <swiper-item v-for="i in 3" :key="i" v-if="adList.length==0">
          <img src="../assets/course-test.jpg" alt="" class="swiper-img">
        </swiper-item>
      </swiper>
    </div>
    <!--公告-->
    <div class="announce">
      <img src="../assets/ad.jpg" class="ad" alt="">
      <swiper :show-dots="false" :auto="true" :loop="true" direction="vertical" height="30px">
        <swiper-item v-for="(item,index) in newsList" :key="index" @click.native="toNewsDetail(index)">
          <p class="title" v-text="item.title"></p>
        </swiper-item>
      </swiper>
      <a href="javascript:;" class="iconfont icon-xiangyoujiantou"></a>
    </div>
    <div class="divider pad"></div>

    <!--功能区-->
    <div class="func-zone">
      <div class="func-item" v-for="(item,index) in funcList"
           @click="getFuncs(item.courseCategoryId,item.ageId,item.title)">
        <img :src="item.img" alt="">
        <p v-text="item.title"></p>
      </div>
    </div>
    <div class="divider"></div>
    <div class="course-by-type">
      <!--语文分级课23-->
      <div class="course">
        <div class="course-title">
          <p class="title">语文分级课</p>
          <a class="show-more" @click="toAll(23)" href="javascript:;">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in chineseList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in chineseList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in chineseList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in chineseList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in chineseList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in chineseList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(23)">
          <p>查看全部<span v-text="chineseTotal"></span>个</p>
        </div>
      </div>
      <div class="divider"></div>
      <!--免费课程10-->
      <div class="course">
        <div class="course-title">
          <p class="title">免费课程</p>
          <a class="show-more" @click="toAll(10)" href="javascript:;">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in freeList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in freeList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in freeList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <!--<p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>-->
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in freeList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in freeList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in freeList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <!--<p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>-->
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(10)">
          <p>查看全部<span v-text="freeTotal"></span>个</p>
        </div>
      </div>
      <div class="divider"></div>
      <!--精品课程11-->
      <div class="course">
        <div class="course-title">
          <p class="title">精品课程</p>
          <a class="show-more" @click="toAll(11)" href="javascript:;">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in bestList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in bestList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in bestList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in bestList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in bestList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in bestList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(11)">
          <p>查看全部<span v-text="bestTotal"></span>个</p>
        </div>
      </div>
      <div class="divider"></div>
      <!--今日推荐25-->
      <div class="course" v-if="recomList.length>0">
        <div class="course-title">
          <p class="title">今日推荐</p>
          <a class="show-more" @click="toAll(25)" href="javascript:;">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in recomList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in recomList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in recomList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in recomList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in recomList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in recomList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(25)">
          <p>查看全部<span v-text="recomTotal"></span>个</p>
        </div>
      </div>
      <div class="divider" v-if="recomList.length>0"></div>

      <!--超值课程包12-->
      <div class="course">
        <div class="course-title">
          <p class="title">超值课程包</p>
          <a class="show-more" @click="toAll(12)" href="javascript:;">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in cardList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in cardList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="(item,index) in cardList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in cardList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in cardList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in cardList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(12)">
          <p>查看全部<span v-text="cardTotal"></span>个</p>
        </div>
      </div>
      <div class="divider"></div>
      <!--数学分级课22-->
      <div class="course">
        <div class="course-title">
          <p class="title">数学分级课</p>
          <a class="show-more" href="javascript:;" @click="toAll(22)">更多<span
            class="iconfont icon-xiangyoujiantou"></span></a>
        </div>
        <!--四图模式-->
        <div class="four-pics-mode-box">
          <!--章节-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in mathList"
               v-if="(item.buytype==2)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in mathList"
               v-if="(item.buytype==1)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'销量：'+item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="four-pics-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in mathList"
               v-if="(item.buytype==3)&&(item.displaytype==1||item.displaytype==2)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <!--列表模式-->
        <div class="list-mode-box">
          <!--章节-->
          <div class="list-mode" @click="toDetail(item.to,item.chapterid,item)" v-for="item in mathList"
               v-if="(item.buytype==2)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseChapterEntity.imgpath"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseChapterEntity.chaptername"></p>
                <p class="sub-title" v-text="item.courseChapterEntity.chaptersubtitle||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.courseChapterEntity.wfCourseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-text="'销量：'+item.courseChapterEntity.coursesalenumber"
                   v-if="item.courseChapterEntity.chapterprice>0"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice>0"
                   v-text="'￥'+item.courseChapterEntity.chapterprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseChapterEntity.chapterprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程-->
          <div class="list-mode" @click="toDetail(item.to,item.courseid,item)" v-for="item in mathList"
               v-if="(item.buytype==1)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.courseInfoEntity.courseimgurl"
                 @error="setErrorImg" alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.courseInfoEntity.coursename"></p>
                <p class="sub-title" v-text="item.courseInfoEntity.coursedesc||'暂无课程描述'"></p>
                <p class="author" v-text="'主讲人：'+item.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="item.courseInfoEntity.coursesalenumber"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice>0"
                   v-text="'￥'+item.courseInfoEntity.activityprice+'/套'"></p>
                <p class="sales-price" v-if="item.courseInfoEntity.activityprice==0">免费</p>
              </div>
            </div>
          </div>
          <!--课程包-->
          <div class="list-mode" @click="toDetail(item.to,item.cardid,item)" v-for="item in mathList"
               v-if="(item.buytype==3)&&(item.displaytype==4)">
            <img :src="'http://wangfang.oss-cn-qingdao.aliyuncs.com/'+item.vipCardEntity.cardimg" @error="setErrorImg"
                 alt="">
            <div class="desc">
              <div class="detail">
                <p class="title" v-text="item.vipCardEntity.cardname"></p>
                <p class="sub-title" v-text="item.vipCardEntity.carddesc||'暂无课程描述'"></p>
                <p class="author"
                   v-text="'主讲人：'+item.vipCardEntity.cardCourseRelationEntity.courseInfoEntity.wfSpeakerEntity.speakername"></p>
              </div>
              <div class="price">
                <p class="sales-num" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'销量：'+item.vipCardEntity.cardsalenumber"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice>0"
                   v-text="'￥'+item.vipCardEntity.cardprice+'/套'"></p>
                <p class="sales-price" v-if="item.vipCardEntity.cardprice==0">免费</p>
              </div>
            </div>
          </div>
        </div>
        <div class="show-more-btn" @click="toAll(22)">
          <p>查看全部<span v-text="mathTotal"></span>个</p>
        </div>
      </div>
      <div class="divider"></div>
    </div>
    <toast class="toast-tip" v-model="isAvailable" type="text" text="暂未开通，敬请期待..."></toast>
  </div>
</template>

<script>
  import MyTab from '../components/MyTab.vue'
  import util from '../util'
  import {Sticky, Swiper, SwiperItem, Toast, Tab, TabItem} from 'vux'

  window.onresize = () => {
    if (document.querySelector('.vux-swiper')) {
      document.querySelector('.vux-swiper').style.height = (window.innerWidth / 2) + 'px'
    }
  }
  let funcsList = [
    {'img': '../static/img/funcs/chinese.jpg', 'title': '大语文', 'courseCategoryId': 32, 'ageId': -1},
    {'img': '../static/img/funcs/hg.jpg', 'title': '史地课', 'courseCategoryId': 33, 'ageId': -1},
    {'img': '../static/img/funcs/talk.jpg', 'title': '脱口秀', 'courseCategoryId': 34, 'ageId': -1},
    {'img': '../static/img/funcs/intrest.jpg', 'title': '兴趣课', 'courseCategoryId': 35, 'ageId': -1},
    {'img': '../static/img/funcs/math.jpg', 'title': '数学课', 'courseCategoryId': 36, 'ageId': -1},
    {'img': '../static/img/funcs/0-5.jpg', 'title': '0-5岁', 'courseCategoryId': -1, 'ageId': 37},
    {'img': '../static/img/funcs/6-9.jpg', 'title': '6-9岁', 'courseCategoryId': -1, 'ageId': 38},
    {'img': '../static/img/funcs/9m.jpg', 'title': '9岁以上', 'courseCategoryId': -1, 'ageId': 39},
    {'img': '../static/img/funcs/latest.jpg', 'title': '最新', 'courseCategoryId': -1, 'ageId': -1},
    {'img': '../static/img/funcs/activity.jpg', 'title': '课外活动', 'courseCategoryId': -1, 'ageId': -1}
  ]
  let typesList = [
    {title: '免费课', type: 10},
    {title: '推荐课', type: 24},
    {title: '精品课', type: 11},
    {title: '课程包', type: 12},
    {title: '分级课', type: 13}
  ]
  export default {
    data() {
      return {
        tabActive: 0,
        adList: [],
        newsList: [],
        funcList: funcsList,
        courseType: 10,
        stickyHeight: 0,
        typeList: typesList,
        sys_height: window.innerHeight + 50,
        itemNum: 0,
        swiperHeight: 0,
        isAvailable: false,
        modeType: -1,
        freeList: [],//免费课程10
        bestList: [],//精品课程11
        cardList: [],//超值课程包12
        mathList: [],//数学分级课22
        chineseList: [],//语文分级课23
        recomList: [],//今日推荐25
        chineseTotal: '',
        freeTotal: '',
        bestTotal: '',
        cardTotal: '',
        mathTotal: '',
        audioTotal: '',
        recomTotal: '',
        isMyLoading: true,
      }
    },
    created() {
      /*this.$vux.loading.show({
        text: '精彩课程马上呈现'
      })*/
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
      this.init()

    },
    mounted() {

      /*!window.initUrl && (window.initUrl = window.location.href.split('#')[0])
      let isIOS = () => (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad'))
      if (isIOS()) {
        util.wxConfig(window.initUrl)
      } else {
        util.wxConfig(window.location.href.split('#')[0])
      }*/
      //      微信JS-SDK
      util.wxConfig(window.location.href.split('#')[0])
      util.commonShare()

      this.init()
      document.title = '好芳法课堂'
      if (document.querySelector('.vux-tab-ink-bar')) {
        document.querySelector('.vux-tab-ink-bar').setAttribute('style', 'background:linear-gradient(to right, #009deb 50%, #7888fc 50%);border-radius:30%;margin-left:7%;margin-right:7%;')
      }
    },
    components: {
      MyTab, Sticky, Swiper, SwiperItem, Toast, Tab, TabItem
    },
    methods: {
      init() {
        this.getBanner()
        this.getNewsList()
        this.getChinese()
        this.getFreeList()
        this.getBestList()
        this.getCardList()
        this.getMathList()
        this.getRecomList()
      },
      setErrorImg(e) {
        e.srcElement.src = '/static/img/no-pic.jpg'
      },
      toSearch() {
        this.$router.push({path: '/search'})
      },
      getBanner() {
        let params = {
          url: '/wfcm-api/ad/findAdInfo',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          console.log(data)
          if (data.errCode == 0) {
            this.adList = data.adList

          } else {
            console.log(data.msg)
          }
        })
      },
      toSwiperDetail(item) {

        console.log(item.adtype)
        if (item.adtype == 2) {
          //        课程
          this.$router.push({path: '/courseDetail', query: {id: item.courseid}})
        } else if (item.adtype == 5) {
          //        课程包
          this.$router.push({path: '/cardDetail', query: {id: item.courseid}})
        } else if (item.adtype == 6) {
          //        章节
          this.$router.push({path: '/chapterDetail', query: {id: item.courseid}})
        }


      },
      getNewsList() {
        let params = {
          url: '/wfcm-api/activity/newsList',
          data: {'token': localStorage.token}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.newsList = data.newsList
            this.$nextTick(() => {
              this.$vux.loading.hide()
            })
          } else {
            console.log(data.msg)
          }
        })
      },
      toNewsDetail(index) {
        this.$router.push({path: '/news', query: {'index': index}})
      },
      getFuncs(typeid, ageid, title) {
        if (typeid >= 0 || ageid >= 0) {
          this.$router.push({path: '/funcDetail', query: {'typeid': typeid, 'ageid': ageid, 'title': title}})
        } else {
          this.isAvailable = true
        }
      },
      toDetail(to, id, item) {
        this.$router.push({path: to, query: {id}})
      },
      getChinese() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 23, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.chineseTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.chineseList = allResult
            this.$nextTick(() => {
              this.isMyLoading = false
            })

          } else {
            console.log(data.msg)
          }
        })
      },
      getFreeList() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 10, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.freeTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.freeList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      getBestList() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 11, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.bestTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.bestList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      getCardList() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 12, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.cardTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.cardList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      getRecomList() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 25, 'num': 4}
        }
        util.bginterface(params, data => {
          console.log('今日推荐', data)
          if (data.errCode == 0) {
            this.recomTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.recomList = allResult

          } else {
            console.log(data.msg)
          }
        })
      },
      getMathList() {
        let params = {
          url: '/wfcm-api/indexRecommend/indexTypeList',
          data: {'token': localStorage.token, 'indexTypeCode': 22, 'num': 4}
        }
        util.bginterface(params, data => {
          if (data.errCode == 0) {
            this.mathTotal = data.total
            let allResult = data.resultList
            allResult.forEach(item => {
              if (item.buytype == 1) {
                item.to = '/courseDetail'
              } else if (item.buytype == 2) {
                item.to = '/chapterDetail'
              } else if (item.buytype == 3) {
                item.to = '/cardDetail'
              }
            })
            this.mathList = allResult
          } else {
            console.log(data.msg)
          }
        })
      },
      toAll(code) {
        this.$router.push({path: '/showAllCourse', query: {'code': code}})
      }
    },
    beforeRouteLeave(to, from, next) {
      console.log('我要消失啦~~~~')
//      window.history.replaceState({}, '', this.currentPage)
      next()
    }
  }
</script>
<style lang="less">

  #home-course {
    .isfree {
      position: relative;
      &:before {
        position: absolute;
        content: '免费';
        background: url("../assets/free-tag.png") no-repeat;
        background-size: cover;
        background-position: center center;
        color: #ffffff;
        right: 0;
        top: 0;
        padding: 0.25rem;
      }
    }
    .vux-tab .vux-tab-item {
      font-size: 16px;
    }
    .weui-toast__content {
      color: #ffffff;
    }
    @mainColor: #4dba87;
    .vux-tab {
      .vux-tab-item.fs-16 {
        font-size: 16px;
      }
    }
    .vux-tab-ink-bar {
      background-color: transparent;
    }
    .toast-tip {
      p {
        color: #ffffff;
      }
    }
    .weui-toast__content {
      color: #fff !important;
    }
    .ad {
      height: 1rem;
      margin-right: 1rem;
      line-height:30px;
      margin-left: 1rem;
      max-width: 2.5rem;
    }

    .search {
      display: flex;
      align-items: center;
      padding: 0.25rem 1rem;
      width: 90%;
      background:rgba(242,244,247,1);
      border-radius: 2rem;
      margin: 0.25rem auto 0.5rem;
      span {
        display: inline-block;
        width: 10%;
        text-align: center;
        color: lightgrey;
      }
      p {
        width: 90%;
        text-align: left;
        color: lightgrey;
      }
    }

    .swiper-img {
      width: 100%;
      height: 100%;
    }
    .divider {
      height: 0.5rem;
      width: 100%;
      background: #f4f3f6;
    }
    .announce {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      height: 30px;
      overflow-y: hidden;
      display: flex;
      align-items: center;
      padding: 0rem 1.5rem;
      box-sizing: border-box;
      justify-content: flex-start;
      .vux-slider {
        width: 100%;
        height: 100%;
        p {
          width: 100%;
          height: 100%;
          line-height: 30px;
          text-align: left;
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 0;
        }
      }
      span {
        display: inline-block;
        width: 20%;
        font-size: 1.1rem;
        text-align: center;
        color: #fb5b5b;
        font-weight: bold;
        letter-spacing: 5px;
        line-height: 1.5rem;
      }
      a {
        display: inline-block;
        width: 10%;
        text-align: center;
        line-height: 1.5rem;
        font-size: 1rem;
      }
    }

    .func-zone {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      flex-wrap: wrap;
      text-align: center;
      .func-item {
        width: 20%;
        white-space: nowrap;
        text-align: center;
        /*margin-top: 1rem;*/
        img {
          max-width: 50%;
        }
      }
      .func-item:nth-child(6),.func-item:nth-child(7),.func-item:nth-child(8),.func-item:nth-child(9),.func-item:nth-child(10){
        margin-top: 1rem;
      }
    }
    .course-by-type {
      margin-bottom: 4rem;
      .show-more-btn {
        border-top: 1px solid lightgrey;
        padding: 0.5rem 1.5rem;
        p {
          text-align: center;
        }
      }
      .course{
        box-sizing: border-box;
        padding: 1rem 1.5rem 0;
      }
      .course-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid lightgrey;
        margin-bottom: 0.5rem;
        .title {
          position: relative;
          padding-left: 0.5rem;
          border-left: 3px solid orange;
          font-size: 1.2rem;
          margin: 0 !important;
        }
        .show-more {
          color: #9f9f9f;
          font-size: 0.8rem;
          span {
            color: #9f9f9f;
            font-size: 0.8rem;
          }
        }
      }
      .big-mode {
        margin-bottom: 1rem;
        border-radius: 0.5rem;
        border: 1px solid lightgrey;
        img {
          max-width: 100%;
          border-radius: 0.5rem;
        }
        .desc {
          box-sizing: border-box;
          padding: 0.5rem 1rem;
          .detail {
            .title {
              font-weight: bold;
            }
            .author, .sales-num {
              color: gray;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-price {
              color: rgb(250,145,69);
            }
          }
          .author, .price p {
            font-size: 0.8rem;
          }
          .title, .sub-title {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

      }
      .four-pics-mode-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .four-pics-mode {
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #eeeeee;
          width: 48%;
          img {
            max-width: 100%;
            border-radius: 0.5rem;
          }
          .desc {
            padding: 0.25rem;
            font-size: 0.8rem;
            color: gray;
            .detail {
              .title {
                /*font-weight: bold;*/
                line-height: 1.5;
              }
              .author, .sales-num,.sub-title {
                color: gray;
                line-height: 1.5;
              }
            }
            .author, .price p,.sales-num {
              font-size: 0.8rem;
              line-height: 1.5;
            }
            .title, .sub-title {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              line-height: 1.5;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-num{
              color: gray;
            }
            .sales-price {
              color: rgb(250,145,69);
            }
          }
        }
      }
      .list-mode {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        overflow-x: hidden;
        img {
          max-width: 45%;
          border-radius: 0.5rem;
        }
        .desc {
          box-sizing: border-box;
          padding: 0.5rem;
          width: 55%;
          .detail {
            .title {
              /*font-weight: bold;*/
              line-height: 1.5;
            }
            .sub-title,.author, .sales-num {
              color: gray;
              font-size: 0.8rem;
              line-height: 1.5;
            }
          }
          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sales-price {
              color: rgb(250,145,69);
            }
          }
          .author, .price p {
            font-size: 0.8rem;
          }
          .title, .sub-title {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

      }

    }
  }

</style>
