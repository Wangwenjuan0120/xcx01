import core from '../../../utils/core/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: ''
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

    core.user.loginTo().then(loginInfo => {
      console.log(loginInfo)
      if (!!loginInfo) {
        if (loginInfo.studioId == 0) {
          self.setData({
            state: 'noCreate'  // 未申请
          })
        } else {
          if (loginInfo.status == 1) {
            self.setData({
              state: 'doing'  // 正在
            })
          } else {
            self.setData({
              state: 'nohave'  // 不支持
            })
          }
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