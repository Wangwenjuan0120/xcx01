import {
  getWorkpointMap
} from '../../../utils/tool/workpoint'
import {
  timeMMSS
} from '../../../utils/tool/time'
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
    options: '',
    intoViewId: '',
    pageWidth: 0,
    isLogin: '',
    isLiveControl: false,
    isLivePlay: true,
    isLiveFull: false,
    isLiveMute: false,
    isNews: true,
    msgScrollHeight: 0,
    tabs: ["介绍", "互动"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    surplusTime: 0,
    durationDayHour: '',
    workpointMap: [],
    isUnfold: [false, false],
    liveStatus: '',
    liveCode: false,
    actionTime: '',
    subjectInfo: {},
    currentPPT: '',
    actionCurrent: '',
    actionInfo: '',
    applyForm: {
      vdoid: 0,
      type: 1,
      isSignup: true,
      isIgnore: true,
      src: ''
    },
    gradeForm: {
      type: 1,
      sbtid: 0,
      workpoint: 0
    },
    loopQuery: {
      studioId: '',
      subjectId: '',
      advMsgId: '',
      nmrMsgId: '',
      updateKeys: []
    },
    loadingMsg: false,
    isLoadingMore: true,
    historyMsgIds: {
      advMsgId: '',
      nmrMsgId: ''
    },
    localMsg: {
      isLocal: true,
      uid: 0,
      headImg: '',
      name: '',
      questionFlag: false,
      msgType: 1,
      userRole: 100,
      textContent: '',
    },
    onlySenior: false,
    msgIsScroll: true,
    msgInterval: '',
    fuseMsgList: [],
    sendPlaceholder: '发表评论，提问',
    sendFocus: false,
    sendMsgForm: {
      studioId: 0,
      subjectId: 0,
      type: 2,
      msgType: 1,
      content: '',
      questionFlag: false
    },
    gradeShow: false,
    gradeVisible: false,
    gradeVals: [],
    filterVisible: false,
    nowShowTime: '00:00',
    durationShowTime: '00:00',
    allDuration: 100,
    liveTimeSet: null,
    currentImg: '',
    isSlider: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const studioId = options.studioId
    const subjectId = options.subjectId

    let applyForm = this.data.applyForm
    applyForm.vdoid = subjectId

    let gradeForm = this.data.gradeForm
    gradeForm.sbtid = subjectId

    let loopQuery = this.data.loopQuery
    loopQuery.subjectId = subjectId
    loopQuery.studioId = studioId

    let sendMsgForm = this.data.sendMsgForm
    sendMsgForm.subjectId = subjectId
    sendMsgForm.studioId = studioId

    const isLogin = core.user.isLogin()

    this.setData({
      isLogin,
      options,
      applyForm,
      gradeForm,
      loopQuery,
      sendMsgForm
    })

    wx.setKeepScreenOn({
      keepScreenOn: true
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
    })

    // fetch subject message
    this.getFirstEnter().then(subjectInfo => {
      let msgInterval = setInterval(_ => {
        this.loopSubject()
      }, 3000)

      this.setData({
        msgInterval
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.subjectLive = wx.createLivePlayerContext('subjectLive', this)
    this.subjectLookBack = wx.createVideoContext('subjectLookBack', this)
  },
  onShow: function () {
    const isLogin = core.user.isLogin()
    this.setData({
      isLogin
    })
  },
  noLoginPlay: function () {
    core.user.loginTo()
  },
  tapLivePlay: function () {
    const isLiveControl = this.data.isLiveControl
    this.setData({
      isLiveControl: !isLiveControl
    })
    if (!isLiveControl) {
      setTimeout(_ => {
        this.setData({
          isLiveControl: false
        })
      }, 8000)
    }
  },
  tapPlayPause: function (e) {
    const isLivePlay = e.currentTarget.dataset.play
    const liveStatus = this.data.liveStatus
    const that = this
    if (isLivePlay) {
      if (liveStatus === 1) {
        this.subjectLive.play({
          success: function () {
            that.setData({
              isLivePlay: true
            })
          }
        })
      } else {
        this.subjectLookBack.play()
        that.setData({
          isLivePlay: true
        })
      }
    } else {
      if (liveStatus === 1) {
        this.subjectLive.pause({
          success: function () {
            that.setData({
              isLivePlay: false
            })
          }
        })
      } else {
        this.subjectLookBack.pause()
        that.setData({
          isLivePlay: false
        })
      }
    }
  },
  tapMuteResume: function (e) {
    const isLiveMute = e.currentTarget.dataset.mute
    const that = this
    this.subjectLive.mute({
      success: function () {
        that.setData({
          isLiveMute
        })
      }
    })
  },
  tapRequestExitFullScreen: function (e) {
    const isLiveFull = e.currentTarget.dataset.full
    const liveStatus = this.data.liveStatus
    const that = this
    if (isLiveFull) {
      if (liveStatus === 1) {
        this.subjectLive.requestFullScreen({
          direction: 90,
          success: function () {
            that.setData({
              isLiveFull: true
            })
          }
        })
      } else {
        this.subjectLookBack.requestFullScreen({
          direction: 90
        })
        that.setData({
          isLiveFull: true
        })
      }
    } else {
      if (liveStatus === 1) {
        this.subjectLive.exitFullScreen({
          success: function () {
            that.setData({
              isLiveFull: false
            })
          }
        })
      } else {
        this.subjectLookBack.exitFullScreen()
        that.setData({
          isLiveFull: false
        })
      }
    }
  },
  processMsg: function (msgGatherData, isUpper) {
    if (!msgGatherData) {
      return false
    }

    let onlySenior = this.data.onlySenior
    let pendingData = []
    const seniorMsgList = msgGatherData.seniorMsgList
    const normalMsgList = msgGatherData.normalMsgList

    let fuseMsgList = this.data.fuseMsgList
    fuseMsgList = fuseMsgList.filter(item => {
      return !item.isLocal
    })

    if (seniorMsgList.length > 0) {
      let seniorTagMsglist = seniorMsgList.map(item => {
        if (item.msgType === 3) {
          item.isPlay = false
        }
        item.seniorTag = true
        return item
      })
      pendingData = pendingData.concat(seniorTagMsglist)
    }

    if (normalMsgList.length > 0 && !onlySenior) {
      pendingData = pendingData.concat(normalMsgList)
    }

    const orderMsg = pendingData.sort((a, b) => {
      return a.msgTime - b.msgTime
    })

    fuseMsgList = isUpper ? orderMsg.concat(fuseMsgList) : fuseMsgList.concat(orderMsg)
    this.setData({
      fuseMsgList
    })

    const msgIsScroll = this.data.msgIsScroll
    if (msgIsScroll) {
      this.setData({
        intoViewId: 'viewBottom'
      })
    }
  },
  setLiveStartTime() {
    const subjectInfo = this.data.subjectInfo
    const nowDate = (new Date()).getTime()
    const startTime = subjectInfo.startTime * 1000
    const surplusTime = startTime - nowDate
    const durationTime = moment.duration(startTime - nowDate)
    let durationDayHour = ''
    if (durationTime.days() > 0) {
      durationDayHour = durationTime.days() + '天'
    } else {
      durationDayHour = durationDayHour + durationTime.hours() + '小时' + durationTime.minutes() + '分'
    }
    this.setData({
      durationDayHour,
      surplusTime
    })
  },
  setSubjectInfo: function (subjectInfo) {
    if (subjectInfo) {
      const liveStatus = subjectInfo.liveStatus
      if (subjectInfo.subjectIntro.length > 80) subjectInfo.subSubjectIntro = subjectInfo.subjectIntro.substr(0, 80)
      if (subjectInfo.subjectMaster.introduce.length > 80) subjectInfo.subjectMaster.subIntroduce = subjectInfo.subjectMaster.introduce.substr(0, 80)

      subjectInfo.avg_workpoint = subjectInfo.avg_workpoin > 0 ? subjectInfo.avg_workpoint.toFixed(1) : 0
      subjectInfo.liveTime = moment(subjectInfo.startTime * 1000).format('MM-DD HH:mm')
      const workpointMap = getWorkpointMap(subjectInfo.avg_workpoint)

      this.setData({
        liveStatus,
        workpointMap,
        subjectInfo
      })

      this.setLiveStartTime()
    }
  },
  getMsgHistory() {
    const options = this.data.options
    const onlySenior = this.data.onlySenior
    let historyMsgIds = this.data.historyMsgIds
    let isLoadingMore = this.data.isLoadingMore

    let msgGatherData = {
      seniorMsgList: [],
      normalMsgList: []
    }

    if (isLoadingMore) {
      this.setData({
        loadingMsg: true
      })
      Promise.all([core.studio.fetchSeniorMsgList({
        studioId: options.studioId,
        subjectId: options.subjectId,
        direction: false,
        msgId: historyMsgIds.advMsgId,
        limit: 20
      }), core.studio.fetchNormalMsgList({
        studioId: options.studioId,
        subjectId: options.subjectId,
        direction: false,
        msgId: historyMsgIds.nmrMsgId,
        limit: 20,
        onlyQuestion: onlySenior
      })]).then(([seniorMsg, normalMsg]) => {

        msgGatherData.seniorMsgList = seniorMsg.msgList
        historyMsgIds.advMsgId = seniorMsg.msgId

        msgGatherData.normalMsgList = normalMsg.msgList
        historyMsgIds.nmrMsgId = normalMsg.msgId

        this.processMsg(msgGatherData, true)

        if (seniorMsg.is_end && normalMsg.is_end) {
          isLoadingMore = false
        } else {
          isLoadingMore = true
        }

        this.setData({
          loadingMsg: false,
          isLoadingMore,
          historyMsgIds
        })
      })
    }
  },
  getFirstEnter: function () {
    let options = this.data.options
    let loopQuery = this.data.loopQuery
    let historyMsgIds = this.data.historyMsgIds

    return core.studio.fetchFirstEnter(options).then(data => {
      console.log(data)
      const subjectInfo = data.subject
      this.setSubjectInfo(subjectInfo)

      const currentPPT = data.currentImg
      let actionInfo = {
        firstImg: data.firstImg,
        actionList: data.actionList
      }

      let msgGatherData = {
        seniorMsgList: [],
        normalMsgList: []
      }
      if (data.advanceMsg) {
        msgGatherData.seniorMsgList = data.advanceMsg.msgList
        loopQuery.advMsgId = data.advanceMsg.msgId
        historyMsgIds.advMsgId = data.advanceMsg.msgId
      }
      if (data.normalMsg) {
        msgGatherData.normalMsgList = data.normalMsg.msgList
        loopQuery.nmrMsgId = data.normalMsg.msgId
        historyMsgIds.nmrMsgId = data.normalMsg.msgId
      }

      this.setData({
        loopQuery,
        historyMsgIds,
        currentPPT,
        actionInfo
      })

      this.processMsg(msgGatherData)
      return subjectInfo
    })
  },
  loopSubject: function () {
    let loopQuery = this.data.loopQuery
    return core.studio.loopFetchSubject(loopQuery).then(data => {
      console.log(data)
      const liveStatus = data.liveStatus
      const currentPPT = data.currentImg

      this.setData({
        liveStatus,
        currentPPT
      })

      this.setLiveStartTime()

      let msgGatherData = {
        seniorMsgList: [],
        normalMsgList: []
      }

      if (data.advMsgList) {
        msgGatherData.seniorMsgList = data.advMsgList.msgList
        loopQuery.advMsgId = data.advMsgList.msgId
      }
      if (data.nmrMsgList) {
        msgGatherData.normalMsgList = data.nmrMsgList.msgList
        loopQuery.nmrMsgId = data.nmrMsgList.msgId
      }

      this.setData({
        loopQuery
      })
      this.processMsg(msgGatherData)
    })
  },
  liveChange: function (e) {
    const liveCode = e.detail.code
    this.setData({
      liveCode
    })
  },
  setActionCurrent() {
    const actionTime = this.data.actionTime
    const actionList = this.data.actionInfo.actionList

    // const actionCurrent = actionList.find(item => {
    //   return item.actionTime === actionTime
    // })

    let actionCurrent = '';

    for (var i = (actionList.length - 1); i >= 0; i--) {
      if (actionTime > actionList[i]['actionTime']) {
        //  console.log(i)
        actionCurrent = actionList[i];
        break
      }
    }


    if (actionCurrent) {
      this.setData({
        actionCurrent
      })
    }
  },
  actionVideoTime: function (e, e2) {
    const actionTime = this.data.actionTime
    const currentTime = e.detail.currentTime
    const duration = Math.round(e.detail.duration)
    const nowActionTime = Math.round(currentTime)

    if (!this.data.isSlider) {
      this.setData({
        actionTime: nowActionTime
      })
      this.setActionCurrent()
    }


    this.setData({
      nowShowTime: timeMMSS(nowActionTime) || this.data.nowShowTime
    })

    if (this.data.durationShowTime == '00:00') {
      this.setData({
        durationShowTime: timeMMSS(duration),
        allDuration: duration
      })
    }

  },
  tabTap: function (e) {
    const activeIndex = e.currentTarget.id
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex,
      isNews: !activeIndex === '1'
    })
    const that = this
    if (activeIndex === '1') {
      wx.createSelectorQuery().select('#msgScrollBox').boundingClientRect(function (rect) {
        that.setData({
          msgScrollHeight: rect.height
        })
      }).exec()

      const msgIsScroll = this.data.msgIsScroll
      if (msgIsScroll) {
        this.setData({
          intoViewId: 'viewBottom'
        })
      }
    }
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
          sliderOffset,
          isNews: !activeIndex === 1
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
  filterTap: function () {
    this.setData({
      filterVisible: true
    })
  },
  showGrade: function () {
    this.setData({
      gradeVisible: true,
      gradeVals: [1, 1, 1, 0, 0]
    })
  },
  cancelGrade: function () {
    this.setData({
      gradeVisible: false
    })
  },
  gradeItemTap: function (e) {
    const itemIndex = e.currentTarget.dataset.index
    const nowGradeVals = this.data.gradeVals

    let gradeResult = nowGradeVals.map((item, index) => {
      return index <= itemIndex ? 1 : 0
    })

    this.setData({
      gradeVals: gradeResult
    })
  },
  submitGrade: function () {
    const nowGradeVals = this.data.gradeVals
    let subjectInfo = this.data.subjectInfo
    let gradeForm = this.data.gradeForm
    const scoreVal = nowGradeVals.filter(item => {
      return item === 1
    })
    const isLogin = core.user.isLogin()
    if (isLogin) {
      const workpoint = scoreVal.length
      if (workpoint > 0) {
        gradeForm.workpoint = workpoint
        core.studio.addWorkpoint(gradeForm).then(data => {
          wx.showToast({
            title: '评分成功',
            icon: 'success',
            duration: 2000
          })
          subjectInfo.workpoint = workpoint
          this.setData({
            subjectInfo,
            gradeVisible: false
          })
        })
      } else {
        wx.showToast({
          title: '请对话题评分',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      core.user.loginTo()
    }
  },
  interactTap: function () {
    const pageWidth = this.data.pageWidth
    const tabsLength = this.data.tabs.length
    const sliderOffset = pageWidth / tabsLength
    this.setData({
      activeIndex: 1,
      sliderOffset,
      isNews: false
    })
  },
  applyTap: function () {
    const subjectInfo = this.data.subjectInfo
    const applyForm = this.data.applyForm

    if (!subjectInfo.signup) {
      const isLogin = core.user.isLogin()
      if (isLogin) {
        core.studio.signupLiveVideo(applyForm).then(data => {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000
          })
          subjectInfo.signup = true
          this.setData({
            subjectInfo
          })
        })
      } else {
        core.user.loginTo()
      }
    }
  },
  messageScroll: function (e) {
    const isLoadingMore = this.data.isLoadingMore
    const loadingMsg = this.data.loadingMsg

    const msgScrollHeight = this.data.msgScrollHeight
    const scrollHeight = e.detail.scrollHeight
    const scrollTop = e.detail.scrollTop

    if (scrollTop <= 30 && isLoadingMore && !loadingMsg) {
      this.getMsgHistory()
    }

    if ((scrollTop + 20) > (scrollHeight - msgScrollHeight)) {
      this.setData({
        msgIsScroll: true
      })
    } else {
      this.setData({
        msgIsScroll: false
      })
    }
  },
  checkboxChange: function (e) {
    const checkedVal = e.detail.value,
      sendMsgForm = this.data.sendMsgForm
    sendMsgForm.questionFlag = !!checkedVal.length > 0

    this.setData({
      sendMsgForm
    })
  },
  sendTextBlur: function () {
    this.setData({
      sendFocus: false,
      sendPlaceholder: '发表评论，提问'
    })
  },
  tapSendText: function (e) {
    this.setData({
      sendFocus: true
    })
  },
  sendInputting: function (e) {
    let sendMsgForm = this.data.sendMsgForm
    sendMsgForm.content = e.detail.value
    this.setData({
      sendMsgForm
    })
  },
  fleetingMsg() {
    let localMsg = this.data.localMsg
    let fuseMsgList = this.data.fuseMsgList
    let sendMsgForm = this.data.sendMsgForm

    if (sendMsgForm.content) {
      localMsg.textContent = sendMsgForm.content
      const itemMsg = Object.assign({}, localMsg, sendMsgForm)
      fuseMsgList.push(itemMsg)
      this.setData({
        fuseMsgList
      })
    }
  },
  sendMessage: function () {
    const isLogin = core.user.isLogin()
    if (isLogin) {
      const user = core.user.getUser()
      let localMsg = this.data.localMsg
      localMsg.uid = user.uid
      localMsg.name = user.xcxInfo.nickName
      localMsg.headImg = user.xcxInfo.headUrl
      this.setData({
        localMsg
      })

      let sendMsgForm = this.data.sendMsgForm
      sendMsgForm.content.trim()
      if (sendMsgForm.content) {
        core.studio.addMessage(sendMsgForm).then(data => {
          this.fleetingMsg()
          sendMsgForm.content = ''
          sendMsgForm.questionFlag = false
          this.setData({
            sendMsgForm,
            intoViewId: 'viewBottom'
          })
          this.sendTextBlur()
        })
      }
    } else {
      core.user.loginTo()
    }
  },
  cancelFilter: function () {
    this.setData({
      filterVisible: false
    })
  },
  filterChange: function (e) {
    const onlySenior = e.detail.value
    let msgInterval = this.data.msgInterval
    clearInterval(msgInterval)

    this.setData({
      isLoadingMore: true,
      fuseMsgList: [],
      onlySenior
    })

    // fetch subject message
    this.getFirstEnter().then(subjectInfo => {
      let msgInterval = setInterval(_ => {
        this.loopSubject()
      }, 3000)

      this.setData({
        msgInterval
      })
    })
  },
  tapAudioPlayPause: function (e) {
    const activeIndex = e.currentTarget.dataset.index
    const fuseMsgList = this.data.fuseMsgList
    for (const [index, item] of fuseMsgList.entries()) {
      const isPlay = item.isPlay
      if (item.msgType === 3) {
        const msgAudioId = item.id.toString()
        const msgAudioCtx = wx.createAudioContext(msgAudioId)
        if (!isPlay && activeIndex === index) {
          msgAudioCtx.play()
          item.isPlay = true
        } else {
          msgAudioCtx.pause()
          item.isPlay = false
        }
      }
    }

    this.setData({
      fuseMsgList
    })
  },
  audioEnded: function (e) {
    const index = e.currentTarget.dataset.index
    const fuseMsgList = this.data.fuseMsgList
    fuseMsgList[index].isPlay = false

    this.setData({
      fuseMsgList
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(msgInterval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const msgInterval = this.data.msgInterval
    clearInterval(msgInterval)
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
    const subjectInfo = this.data.subjectInfo
    const options = this.data.options
    return {
      title: subjectInfo.subjectTitle,
      path: `pages/liveVideo/detail/index?studioId=${options.studioId}&subjectId=${options.subjectId}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 
   */
  isLiveControlHide: function () {
    clearTimeout(this.data.liveTimeSet);

    let liveTimeSet = setTimeout(_ => {
      console.log(121)
      this.setData({
        isLiveControl: false
      })
    }, 8000)

    this.setData({
      liveTimeSet: liveTimeSet
    })
  },
  /**
   * 图片预览(视频)
   */
  previewImageAndtapLivePlay: function (e) {
    const isLiveControl = this.data.isLiveControl;
    const actionCurrent = this.data.actionCurrent;
    const firstImg = this.data.actionInfo.firstImg;

    if (!isLiveControl) {
      this.setData({
        isLiveControl: true
      })

      this.isLiveControlHide();
    } else {
      let currentImg = '';
      if (!actionCurrent) {
        currentImg = firstImg;
      } else {
        currentImg = actionCurrent.url;
      }

      this.setData({
        currentImg: currentImg
      })

      // wx.previewImage({
      //   current: currentImg,
      //   urls: [currentImg],
      // });
    }
  },
  /**
   * 图片预览(直播)
   */
  liveImageAndtapLivePlay: function () {
    const isLiveControl = this.data.isLiveControl;
    const actionCurrent = this.data.currentPPT;
    const firstImg = this.data.currentPPT.firstImg;

    if (!isLiveControl) {
      this.setData({
        isLiveControl: true
      })

      this.isLiveControlHide();
    } else {
      let currentImg = '';
      if (!actionCurrent) {
        currentImg = firstImg;
      } else {
        currentImg = actionCurrent.url;
      }

      wx.previewImage({
        current: currentImg,
        urls: [currentImg],
      });

      // this.setData({
      //   currentImg: currentImg
      // })
    }
  },
  currentImgHide: function () {
    this.setData({
      currentImg: ''
    })
  },
  pptSliderChang: function (e) {
    this.isLiveControlHide();

    this.setData({
      isSlider: true
    })
  },
  pptSliderChange: function (e) {
    this.isLiveControlHide();

    let time = e.detail.value;

    this.subjectLookBack.seek(time);

    this.setData({
      isSlider: false
    })

    this.setData({
      actionTime: time
    })
    this.setActionCurrent()
  }
})