import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    album: {
      topUrl: '',
      summary: '',
      title: ''
    },
    videos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log(options)

    self.setData({
      'album.topUrl': options.topUrl,
      'album.summary': options.summary,
      'album.title': options.title
    })


    core.video.getAlbum({ start: 0, limit: 100, topicId: options.vdoid }).then(data => {
      self.setData({
         videos: data.videos
      })
    })

    console.log(self.data)
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