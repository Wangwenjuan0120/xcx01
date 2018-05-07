import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctyid: '',
    pvcName: '',
    ctyName: '',
    dstName: '',
    value: '',
    hospitals: [],
    gradeVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log(options)

    var pages = getCurrentPages();

    console.log(pages)

    core.user.getHospital({ pvcid: options.pvcid, ctyid: options.ctyid, dstid: options.dstid }).then(data => {
      console.log(data)

      self.setData({
        ctyid: options.ctyid || "",
        pvcName: options.pvcName || "",
        ctyName: options.ctyName || "",
        dstName: options.dstName || "",
        hospitals: data.hospitals || ""
      })
      
    })

  },
  perfect: function (e) {
    var self = this;

    var data = {
      pvcName: self.data.pvcName,
      ctyName: self.data.ctyName,
      dstName: self.data.dstName,
      name: e.currentTarget.dataset.name
    }

    core.cache.saveData('hospital', data)

    self.goPerfect();
  },
  submitGrade: function () {
    var self = this;

    var data = {
      pvcName: self.data.pvcName,
      ctyName: self.data.ctyName,
      dstName: self.data.dstName,
      name: self.data.value,
    }

    core.cache.saveData('hospital', data)
    self.goPerfect();
  },
  goPerfect: function () {
    var self = this;

    if (self.data.ctyid == 0) {
      wx.navigateBack({
        delta: 3
      });
    } else {
      wx.navigateBack({
        delta: 4
      });
    }
  },
  manuallyEnter: function () {
    this.setData({
      gradeVisible: true
    })
  },
  cancelGrade: function () {
    this.setData({
      gradeVisible: false
    })
  },
  inputhospital: function (e) {
    this.setData({
      'value': e.detail.value
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

  }
})