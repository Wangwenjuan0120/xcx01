// pages/liveVideo/index.js
import core from '../../../utils/core/index'
import {
  timeDiff
} from '../../../utils/tool/time'
import moment from '../../../lib/moment/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: [],
    trailerList: [],

    liveShow: false,
    trailerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getData: function (type) {
    var self = this;

    Promise.all([core.studio.getSmallList({
      start: 0,
      limit: 5,
      type: 1
    }), core.studio.getSmallList({
      start: 0,
      limit: 5,
      type: 2
    })]).then(([subjects1, subjects2]) => {
      // 拉取直播
      var subjects = subjects1['subjects'];

      for (var i = 0; i < subjects.length; i++) {
        subjects[i]['liveTime'] = moment(new Date(subjects[i]['startTime'] * 1000)).format("HH:mm");
        subjects[i]['distanceTime'] = timeDiff(subjects[i]['startTime'] * 1000);

        if (subjects[i]['liveStatus'] == 0) {
          if ((new Date().getTime()) > subjects[i]['startTime'] * 1000) {
            subjects[i]['tobegin'] = true
          } else {
            subjects[i]['tobegin'] = false
          }
        }
      }

      self.setData({
        liveList: subjects,
        liveShow: !subjects1['is_end']
      })

      // 拉取预告
      var trailerList = subjects2['subjects'];

      for (var w = 0; w < trailerList.length; w++) {
        var time = moment(new Date(trailerList[w]['startTime'] * 1000));

        trailerList[w]['liveTime'] = moment(new Date(trailerList[w]['startTime'] * 1000)).format("MM月DD日 HH:mm");
        trailerList[w]['distanceTime'] = timeDiff(trailerList[w]['startTime'] * 1000);

        if (trailerList[w]['signNum'] > 500) {
          trailerList[w]['isHot'] = true;
        }
      }

      self.setData({
        trailerList: trailerList,
        trailerShow: !subjects2['is_end']
      })


      if (type == 'refresh') {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }

    })
  },
  onLoad: function (options) {
    var self = this;

    self.getData('');
  },
  applyTap: function (e) {
    var video_type = e.target.dataset.type;
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

          var liveItem = "";
          var liveSignNum = "";
          if (video_type == "live") {
            var liveItem = 'liveList[' + index + '].signup';
            var liveSignNum = 'liveList[' + index + '].signNum';
          } else {
            liveItem = 'trailerList[' + index + '].signup';
            liveSignNum = 'trailerList[' + index + '].signNum';
          }

          self.setData({
            [liveItem]: true,
            [liveSignNum]: +item.signNum + 1
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // core.user.passport({ phone: '13067655005', vcode:'44er'}).then(res=>{
    //     console.log(res)
    // })
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

    this.getData('refresh');
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