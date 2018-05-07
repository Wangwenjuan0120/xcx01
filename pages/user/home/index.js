import core from '../../../utils/core/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    nickName: '', //昵称
    headUrl: "../../../images/me.png", //头像
    title: '', //职称
    hospital: '' //医院
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      // console.log(loginInfo)
      if (!!loginInfo) {
        self.setData({
          isLogin: loginInfo.xcxInfo.isLogin,
          nickName: loginInfo.xcxInfo.nickName,
          headUrl: loginInfo.xcxInfo.headUrl,
          title: loginInfo.xcxInfo.title,
          hospital: loginInfo.xcxInfo.hospital
        })
      }
    })
  },
  myLive: function () {
    core.user.loginTo().then(loginInfo => {
      wx.navigateTo({
        url: '/pages/user/myLive/index'
      })
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

  }
})