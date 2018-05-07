// pages/liveVideo/index.js
import core from '../../../utils/core/index'
import { timeDiff } from '../../../utils/tool/time'
import moment from '../../../lib/moment/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: [],
    index: 0,
    state: 'begin' // begin load end 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData('');
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
      liveList: [],
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

    core.studio.getSmallList({ start: self.data.index, limit: 5, type: 1 }).then(data => {
      var subjects = data['subjects'];

      for (var i = 0; i < subjects.length; i++) {
        subjects[i]['liveTime'] = moment(new Date(subjects[i]['startTime'] * 1000)).format("HH:mm")
        subjects[i]['distanceTime'] = timeDiff(subjects[i]['startTime'] * 1000)

        if (subjects[i]['liveStatus'] == 0) {
          if ((new Date().getTime()) > subjects[i]['startTime'] * 1000) {
            subjects[i]['tobegin'] = true
          } else {
            subjects[i]['tobegin'] = false
          }
        }
      }

      self.setData({
        liveList: self.data.liveList.concat(subjects),
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
  },
  applyTap: function (e) {
    var self = this;

    core.user.loginTo().then(loginInfo => {
      var item = e.currentTarget.dataset.item;
      var index = e.currentTarget.dataset.index;
      var liveList = self.data.liveList;

      let applyForm = {
        vdoid: item.subjectId,
        type: 1,
        isSignup: true,
        isIgnore: true,
        src: ''
      }

      if (!item.signup) {
        core.studio.signupLiveVideo(applyForm).then(data => {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000
          })

          var liveItem = 'liveList[' + index + '].signup';
          var liveSignNum = 'liveList[' + index + '].signNum';

          self.setData({
            [liveItem]: true,
            [liveSignNum]: +item.signNum + 1
          })
        })
      }
    })
  }
})