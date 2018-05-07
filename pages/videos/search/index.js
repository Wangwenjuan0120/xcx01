import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    hotList: [],
    historyList: [],
    videos: [],
    state: "beign"  // beign search
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    core.cache.getHotSearch({}).then(data => {
      var hotList = data.hotList;

      self.setData({
        hotList: hotList
      })
    })

    core.cache.getData('history_list').then(data => {
      self.setData({
        historyList: data || []
      })
    });
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
  onHotSearch: function (e) {
    this.setData({
      inputVal: e.target.dataset.key
    });

    this.search();

    var data = this.data.historyList;
    data.unshift(e.target.dataset.key);

    if (data.length > 10) {
      data.length = 10;
    }

    this.setData({
      historyList: data
    });

    core.cache.saveData('history_list', data);
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

      var data = this.data.historyList;
      data.unshift(this.data.inputVal);

      if (data.length > 10) {
        data.length = 10;
      }

      this.setData({
        historyList: data
      });

      core.cache.saveData('history_list', data);
    }
  },
  historySearch: function (e) {
    this.setData({
      inputVal: e.target.dataset.key
    });

    this.search();
  },
  search: function () {
    var self = this;

    self.setData({
      state: 'load',
      inputShowed: true
    });

    core.video.searchVideo({ content: self.data.inputVal }).then(data => {
      var videos = data.videos;

      for (var i = 0; i < videos.length; i++) {
        videos[i]['titleList'] = videos[i]['title'].split(self.data.inputVal);
        videos[i]['contentList'] = videos[i]['content'].split(self.data.inputVal);
      }

      console.log(videos)

      self.setData({
        state: 'search',
        videos: videos
      });
    })
  },
  emptyHistory: function () {
    this.setData({
      historyList: []
    });

    core.cache.saveData('history_list', []);
  },
  emptyItem: function (e) {
    var historyList = this.data.historyList;
    historyList.splice(e.target.dataset.index, 1);

    this.setData({
      historyList: historyList
    });

    core.cache.saveData('history_list', historyList);
  }
})