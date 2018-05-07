import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: 1,
    inputShowed: true,
    inputVal: "",
    hospitalsList: [],
    state: "beign"  // beign search
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      back: options.back
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

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      state: 'beign'
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      state: 'beign'
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });

    if (e.detail.value == '') {
      this.setData({
        state: 'beign'
      });
    }
  },
  inputConfirm: function (e) {
    if (!!this.data.inputVal) {
      this.search();
    }
  },
  search: function () {
    var self = this;

    self.setData({
      state: 'load',
      inputShowed: true
    });

    core.user.searchHospital({ key: self.data.inputVal, start: 0, limit: 100 }).then(data => {
      console.log(data)
      var hospitalsList = data.list;

      self.setData({
        state: 'search',
        hospitalsList: hospitalsList
      });

      if (data.is_end) {
        self.setData({
          state: 'end'
        })
      }
    })
  },
  perfect: function (e) {
    var self = this;

    var data = {
      pvcName: e.currentTarget.dataset.item.pvcName,
      ctyName: e.currentTarget.dataset.item.ctyName,
      dstName: e.currentTarget.dataset.item.dstName,
      name: e.currentTarget.dataset.item.name
    }

    core.cache.saveData('hospital', data)

    wx.navigateBack({
      delta: +self.data.back + 1
    });
  }
})