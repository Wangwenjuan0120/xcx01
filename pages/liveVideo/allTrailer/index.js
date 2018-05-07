import core from '../../../utils/core/index'
import { timeDiff } from '../../../utils/tool/time'
import moment from '../../../lib/moment/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trailerList: [],
    index: 0,
    state: 'begin' // begin load end 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
    wx.showNavigationBarLoading()

    this.setData({
      index: 0,
      trailerList: [],
      state: 'begin'
    })

    this.getData('refresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData: function (type) {
    var self = this;

    if (self.data.state == "end") {
      return
    }

    self.setData({
      state: 'load'
    })

    core.studio.getSmallList({ start: self.data.index, limit: 9, type: 2 }).then(data => {
      var trailerList = data['subjects'];

      for (var i = 0; i < trailerList.length; i++) {
        var time = moment(new Date(trailerList[i]['startTime'] * 1000));

        trailerList[i]['liveTime'] = moment(new Date(trailerList[i]['startTime'] * 1000)).format("MM月DD日 HH:mm");
        trailerList[i]['distanceTime'] = timeDiff(trailerList[i]['startTime'] * 1000);

        if (trailerList[i]['signNum'] > 500) {
          trailerList[i]['isHot'] = true;
        }
      }

      self.setData({
        trailerList: self.data.trailerList.concat(trailerList),
        index: data.index
      })

      if (data.is_end) {
        self.setData({
          state: 'end'
        })
      }

      if (type == 'refresh') {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  }
})