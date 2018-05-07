import core from '../../../utils/core/index'
import { imgUpload } from '../../../utils/tool/imgUpload'
import moment from '../../../lib/moment/moment'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    suggestion: [],
    intoViewId: '',

    nickName: '',
    headUrl: '',
    isOne: true,
    sugInterval: null,
    windowHeight: '',
    isNew: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    // 获取屏幕高度为了跳转到页面底部 
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight * 2 - 110
        })
      }
    })

    self.getSuggestion();

    let sugInterval = setInterval(_ => {
      self.getSuggestion()
    }, 5000)

    self.setData({
      sugInterval
    })

  },
  getSuggestion: function () {
    var self = this;

    core.user.getSuggestion({}).then(data => {
      var suggestion = data.suggestion;

      for (var i = 0; i < suggestion.length; i++) {
        suggestion[i]['createData'] = moment(new Date(suggestion[i]['createTime'] * 1000)).format("YYYY-MM-DD HH:mm");
      }

      console.log(suggestion)

      self.setData({
        suggestion: suggestion
      })

      if (self.data.isNew){
        self.tobottom();

        self.setData({
          isNew: false
        })
      }
    })
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
    var self = this;

    core.user.loginTo(false).then(loginInfo => {
      if (self.data.isOne) {
        if (loginInfo) {
          self.setData({
            nickName: loginInfo.xcxInfo.nickName,
            headUrl: loginInfo.xcxInfo.headUrl,
            isOne: false
          })
        } else {
          self.setData({
            nickName: "我",
            headUrl: "../../../images/me.png",
            isOne: false
          })
        }
      }
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
    const sugInterval = this.data.sugInterval
    clearInterval(sugInterval)
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

  },
  bindKeyInput: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  addComment: function () {
    var self = this;

    if (!!self.data.inputVal) {
      wx.showLoading({
        title: '反馈中',
      })

      self.saveSuggestion({ type: '1', content: self.data.inputVal }).then(data => {

        self.setData({
          inputVal: ''
        })
        self.getSuggestion();
      })
    }
  },
  chooseImage: function () {
    var self = this;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '反馈中',
        })
        var tempFilePaths = res.tempFilePaths;

        imgUpload(tempFilePaths[0]).then(data => {
          self.saveSuggestion({ type: '2', content: data.imageURL }).then(data => {
            self.getSuggestion();
          })
        })
      }
    })
  },
  saveSuggestion: function (params) {
    var self = this;

    return new Promise(function (resolve, reject) {
      core.user.saveSuggestion(params).then(data => {
        wx.hideLoading();
        resolve(data);

        self.setData({
          isNew: true
        })
      })
    })
  },
  tobottom: function () {
    // wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
    //   // 使页面滚动到底部
    //   wx.pageScrollTo({
    //     scrollTop: rect.bottom + 180
    //   })
    // }).exec()

    this.setData({
      intoViewId: 'viewBottom'
    })
  }
})