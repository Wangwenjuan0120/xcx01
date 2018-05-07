import {
  getWorkpointMap
} from '../../../utils/tool/workpoint'
import core from '../../../utils/core/index'
import moment from '../../../lib/moment/moment'

let touchDot = 0
let touchTime = 0
let maxTab = 1
let touchInterval = ''
let tabFlag = true

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoId: 0,
    isUnfold: [false, false],
    pageWidth: 0,
    isLogin: '',
    tabs: ["介绍", "互动"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    activeVideo: 0,
    videoClass: [],
    workpointMap: [],
    videoInfo: {},
    commentList: [],
    aboutVideoList: [],
    sendPlaceholder: '发表评论',
    sendFocus: false,
    commentQuery: {
      start: 0,
      limit: 20,
      type: 2,
      order: 0,
      topic_id: 0,
      comment_start: 2147483647
    },
    isReplay: false,
    commentForm: {
      type: 2,
      topic_id: 0,
      user_id: '',
      content: ''
    },
    replayCommentForm: {
      reply_comment_id: '',
      reply_user_id: ''
    },
    praiseVideo: {
      vdoid: 0,
      support: 0
    },
    praiseComment: {
      type: 2,
      praise_comment_id: 0,
      praise_user_id: 0,
      topic_id: 0,
      user_id: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vdoid = options.vdoid
    const commentQuery = this.data.commentQuery
    commentQuery.topic_id = vdoid
    let commentForm = this.data.commentForm
    commentForm.topic_id = vdoid
    let praiseComment = this.data.praiseComment
    praiseComment.topic_id = vdoid
    const isLogin = core.user.isLogin()

    this.setData({
      isLogin,
      videoId: vdoid,
      commentForm,
      commentQuery,
      praiseComment
    })

    let that = this
    let sliderWidth = 22
    wx.getSystemInfo({
      success: function (res) {
        const tabsLength = that.data.tabs.length
        const pageWidth = res.windowWidth
        that.setData({
          pageWidth,
          sliderLeft: (pageWidth / tabsLength - sliderWidth) / 2,
          sliderOffset: pageWidth / tabsLength * that.data.activeIndex
        })
      }
    });

    this.getVideoData().then(data => {
      return core.video.getAboutVideoList({
        start: 0,
        limit: 5,
        tag: data.video.tag
      })
    }).then(data => {
      const aboutVideoList = data.videos
      this.setData({
        aboutVideoList
      })
    })

    this.getVideoComment()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const isLogin = core.user.isLogin()
    this.setData({
      isLogin
    })
    
    this.getVideoData().then(data => {
      return core.video.getAboutVideoList({
        start: 0,
        limit: 5,
        tag: data.video.tag
      })
    }).then(data => {
      const aboutVideoList = data.videos
      this.setData({
        aboutVideoList
      })
    })

    this.getVideoComment()
  },
  noLoginPlay: function () {
    core.user.loginTo()
  },
  getVideoData: function () {
    const vdoid = this.data.videoId
    return core.video.getVideoDetail({
      vdoid,
      src: 23
    }).then(data => {
      let videoInfo = data.video
      videoInfo.avg_workpoint = videoInfo.avg_workpoint ? videoInfo.avg_workpoint.toFixed(1) : 0
      videoInfo.videoTime = moment(videoInfo.startTime * 1000).format('YYYY-MM-DD HH:mm')
      if (videoInfo.proDetail.length > 80) videoInfo.subProDetail = videoInfo.proDetail.substr(0, 80)
      if (videoInfo.content.length > 80) videoInfo.subContent = videoInfo.content.substr(0, 80)
      const videoClass = data.classify
      const workpointMap = getWorkpointMap(videoInfo.avg_workpoint)
      let praiseVideo = this.data.praiseVideo
      praiseVideo.vdoid = vdoid
      praiseVideo.support = videoInfo.supported

      this.setData({
        workpointMap,
        videoInfo,
        videoClass,
        praiseVideo
      })
      return data
    })
  },
  getVideoComment: function () {
    const commentQuery = this.data.commentQuery
    return core.article.getCommentList(commentQuery).then(data => {
      const commentList = data.comments.map(item => {
        item.isPraise = false
        return item
      })
      this.setData({
        commentList
      })
      return data
    })
  },
  tabTap: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  tabTouchStart: function (e) {
    touchDot = e.touches[0].pageX
    touchInterval = setInterval(_ => {
      touchTime++
    }, 100)
  },
  tabTouchMove: function (e) {
    let activeIndex = this.data.activeIndex
    const moveToVal = e.touches[0].pageX
    const pageWidth = this.data.pageWidth
    const tabsLength = this.data.tabs.length

    // touch to left
    if (moveToVal - touchDot <= -40 && touchTime < 10) {
      if (activeIndex < 1 && tabFlag) {
        activeIndex++
        const sliderOffset = pageWidth / tabsLength * activeIndex
        this.setData({
          activeIndex,
          sliderOffset
        })
      }
    }

    // touch to right
    if (moveToVal - touchDot >= 40 && touchTime < 10) {
      if (activeIndex > 0 && tabFlag) {
        activeIndex--
        const sliderOffset = pageWidth / tabsLength * activeIndex
        this.setData({
          activeIndex,
          sliderOffset
        })
      }
    }
  },
  tabTouchEnd: function () {
    clearInterval(touchInterval)
    touchTime = 0
    tabFlag = true
  },
  unfoldTap: function (e) {
    let isUnfold = this.data.isUnfold
    const itemIndex = e.currentTarget.dataset.index
    isUnfold[itemIndex] = !isUnfold[itemIndex]
    this.setData({
      isUnfold
    })
  },
  classItemTap: function (e) {
    this.setData({
      activeVideo: e.currentTarget.dataset.index
    })
  },
  reportTap: function (e) {
    const itemIndex = e.currentTarget.dataset.index
    const reportItem = this.data.commentList[itemIndex]
    const report_comment_id = reportItem.comment_id

    wx.showActionSheet({
      itemList: ['举报'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex === 0) {
            core.article.reportComment({
              report_comment_id
            }).then(data => {
              wx.showToast({
                title: '举报成功',
                icon: 'success',
                duration: 2000
              })
            })
          }
        }
      }
    })
  },
  praiseCommentTap: function (e) {
    const isLogin = core.user.isLogin()
    if (isLogin) {
      const user = core.user.getUser()
      let praiseComment = this.data.praiseComment
      if (user) {
        praiseComment.user_id = user.uid
        this.setData({
          praiseComment
        })
      }
      const itemIndex = e.currentTarget.dataset.index
      let commentList = this.data.commentList
      commentList[itemIndex].isPraise = !commentList[itemIndex].isPraise
      commentList[itemIndex].praise = commentList[itemIndex].isPraise ? commentList[itemIndex].praise + 1 : commentList[itemIndex].praise - 1

      praiseComment.praise_comment_id = commentList[itemIndex].comment_id
      praiseComment.praise_user_id = commentList[itemIndex].user_id

      this.setData({
        commentList
      })
      let praiseTile = commentList[itemIndex].isPraise ? '点赞成功' : '取消点赞'
      core.article.praiseComment(praiseComment).then(data => {
        wx.showToast({
          title: praiseTile,
          icon: 'success',
          duration: 2000
        })
      })
    } else {
      core.user.loginTo()
    }
  },
  praiseVideoTap: function () {
    let praiseVideo = this.data.praiseVideo
    praiseVideo.support = !praiseVideo.support
    let praiseTile = praiseVideo.support ? '点赞成功' : '取消点赞'
    core.video.setVideoPraise(praiseVideo).then(data => {
      wx.showToast({
        title: praiseTile,
        icon: 'success',
        duration: 2000
      })
      let videoInfo = this.data.videoInfo
      videoInfo.supportNum = data.num
      this.setData({
        videoInfo,
        praiseVideo
      })
    })
  },
  commentOrderTap: function (e) {
    const order = e.currentTarget.dataset.order
    let commentQuery = this.data.commentQuery
    commentQuery.order = order
    this.setData({
      commentQuery
    })
    this.getVideoComment()
  },
  sendTextBlur: function () {
    this.setData({
      sendFocus: false,
      isReplay: false,
      sendPlaceholder: '发表评论'
    })
  },
  sendTextFocus: function (e) {
    this.setData({
      sendFocus: true
    })
  },
  sendInputting: function (e) {
    let commentForm = this.data.commentForm
    commentForm.content = e.detail.value
    this.setData({
      commentForm
    })
  },
  sendComment: function () {
    let commentForm = this.data.commentForm
    if (!commentForm.content) {
      wx.showToast({
        title: '不得少于5个字符',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    const isLogin = core.user.isLogin()
    if (isLogin) {
      const user = core.user.getUser()
      if (user) {
        commentForm.user_id = user.uid
        this.setData({
          commentForm
        })
      }
      const replayCommentForm = this.data.replayCommentForm
      const isReplay = this.data.isReplay
      let formData = commentForm
      if (isReplay) {
        formData = Object.assign({}, commentForm, replayCommentForm)
      }
      formData.content.trim()
      core.article.addComment(formData).then(data => {
        this.getVideoComment()
        commentForm.content = ''
        this.setData({
          commentForm
        })
        this.sendTextBlur()
        wx.showToast({
          title: isReplay ? '回复成功' : '发表成功',
          icon: 'success',
          duration: 2000
        })
      })
    } else {
      core.user.loginTo().then(data => {
        let commentForm = this.data.commentForm
        commentForm.user_id = data.uid
        this.setData({
          commentForm
        })
      })
    }
  },
  replyItemTap: function (e) {
    let replayCommentForm = this.data.replayCommentForm
    const itemIndex = e.currentTarget.dataset.index
    const replyItem = this.data.commentList[itemIndex]
    replayCommentForm.reply_comment_id = replyItem.comment_id
    replayCommentForm.reply_user_id = replyItem.user_id

    this.setData({
      sendFocus: true,
      isReplay: true,
      sendPlaceholder: `回复:${replyItem.nick_name || replyItem.reply_nick_name}`,
      replayCommentForm
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const videoInfo = this.data.videoInfo
    const videoId = this.data.videoId
    return {
      title: videoInfo.shareTitle,
      path: `pages/videos/detail/index?vdoid=${videoId}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})