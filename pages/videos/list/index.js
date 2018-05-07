import core from '../../../utils/core/index'

let touchDot = 0
let touchTime = 0
let maxTab = 1
let touchInterval = ''
let tabFlag = true

let delay = (function () {
  var timer = 0;
  return function (callback, time) {
    clearTimeout(timer);
    timer = setTimeout(callback, time);
  };
})();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    channels: [],
    focusChannels: [],
    channel: '',
    channelState: "scroll",  // scroll all
    catids: [],
    defaultChannel: {
      catName: "推荐",
      catid: '',
      isFocus: true
    },
    addChannel: {
      catName: "心血管",
      catid: 2,
      isFocus: true
    },
    videos: [],
    index: 0,
    state: 'begin', // begin load end 
    isOne: true,
    isLogin: false
  },
  getCategory: function () {
    return new Promise(function (resolve, reject) {
      core.cache.getCategory({}).then(data => {
        var cats = data.cats;
        resolve(cats);
      })
    })
  },
  loginTo: function () {
    return new Promise(function (resolve, reject) {
      core.user.loginTo(false).then(data => {
        resolve(data);
      })
    })
  },
  getAllChannels: function () {
    var self = this;

    var focusChannels = [];
    Promise.all([self.getCategory(), self.loginTo(), core.cache.getData('focus_channels')]).then(([cats, user, catids_]) => {
      var catids = [];

      if (catids_.length > 0) {
        catids = catids_;
      } else {
        catids = user ? user.focusCats.replace(/[\[\]]/g, '').split(",") : [];
      }

      if (catids.length > 0) {
        for (var i = 0; i < cats.length; i++) {
          for (var w = 0; w < catids.length; w++) {
            if (cats[i]['catid'] == catids[w]) {
              cats[i]['isFocus'] = true;

              focusChannels.push(cats[i]);
              break;
            } else {
              cats[i]['isFocus'] = false;
            }
          }
        }
      } else {
        focusChannels.unshift(self.data.addChannel)
      }

      focusChannels.unshift(self.data.defaultChannel);

      self.setData({
        channels: cats,
        focusChannels: focusChannels,
        isLogin: !!user
      })
    })

  },
  onLoad: function (options) {
    var self = this;
    self.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var self = this;

    self.loginTo().then(user => {
      if (self.data.isOne) {
        self.getAllChannels();

        self.setData({
          isOne: false
        })
      } else {
        if (!!user != self.data.isLogin) {
          self.getAllChannels();
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
    // 页面卸载的时候保存焦点到缓存
    core.cache.saveData('focus_channels', this.data.catids);
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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  pressDown: function () {
    this.setData({
      channelState: 'all'
    })
  },
  pressTop: function () {
    var self = this;

    self.setData({
      channelState: 'scroll'
    })

    var channels = self.data.channels;
    var focusChannels = [];
    var catids = [];

    channels.forEach(function (item) {
      if (item.isFocus) {
        catids.push(item.catid);
        focusChannels.push(item);
      }
    })

    if (self.data.isLogin) {
      core.video.setFocus({ catids: catids }).then(data => {
      })
    } else {
      focusChannels.unshift(self.data.addChannel);
    }

    focusChannels.unshift(self.data.defaultChannel);

    self.setData({
      catids: catids,
      focusChannels: focusChannels
    })

    // 本来选中的正好取消，选择推荐
    var ishave = false;
    focusChannels.forEach(function (item) {
      if (item.catid == self.data.channel) {
        ishave = true;
      }
    })

    if (!ishave) {
      self.chooseItem('');
    }
  },
  getData: function () {
    var self = this;

    if (self.data.state == "end") {
      return
    }

    self.setData({
      state: 'load'
    })


    var catids = [];

    if (!!self.data.channel) {
      catids = [self.data.channel];
    }

    core.video.getVideoList({ start: self.data.index, limit: 12, catids: catids, tag: "", type: "-1" }).then(data => {
      var videos = data['videos'];
      
      self.setData({
        videos: self.data.videos.concat(videos),
        index: data.index
      })

      // videos.forEach(function(item){
      //     console.log(item.type) 
      //     if (item.type == 3){
      //       console.log(item) 
      //     }
      // })
      // console.log(data)

      if (data.is_end) {
        self.setData({
          state: 'end'
        })
      }
    })

  },
  focusItem: function (e) {
    var self = this

    core.user.loginTo().then(data => {
      var item = 'channels[' + e.target.dataset.index + '].isFocus';
      if (e.target.dataset.item.isFocus) {
        self.setData({
          [item]: false
        })
      } else {
        self.setData({
          [item]: true
        })
      }
    })
  },
  chooseChannel: function (e) {
    var self = this;

    self.chooseItem(e.target.dataset.item.catid);
  },
  chooseItem: function (catid) {
    var self = this;

    self.setData({
      state: 'begin',
      videos: [],
      channel: catid,
      index: 1
    })

    self.getData();
  },
  slidingChoose: function (type) {
    var self = this;
    var focusChannels = self.data.focusChannels;
    var channel = self.data.channel;

    // self.chooseItem(e.target.dataset.item.catid);
    // channel

    delay(function () {

      for (var i = 0; i < focusChannels.length; i++) {
        if (focusChannels[i].catid === channel) {

          if (type == "left") {
            if (i == 0) {
              return
            }
            self.chooseItem(focusChannels[i - 1].catid);
          }

          if (type == "right") {
            if (i == (focusChannels.length - 1)) {
              return
            }

            self.chooseItem(focusChannels[i + 1].catid);
          }
        }
      }



    }, 100)

  },
  tabTouchStart: function (e) {
    touchDot = e.touches[0].pageX
    touchInterval = setInterval(_ => {
      touchTime++
    }, 100)
  },
  tabTouchMove: function (e) {
    let activeIndex = this.data.activeIndex
    const moveToVal = e.touches[0].pageX
    const pageWidth = this.data.pageWidth
    const tabsLength = this.data.focusChannels.length

    // touch to left
    if (moveToVal - touchDot <= -40 && touchTime < 10) {
      this.slidingChoose('left');
    }

    // touch to right
    if (moveToVal - touchDot >= 40 && touchTime < 10) {
      this.slidingChoose('right');
    }
  },
  tabTouchEnd: function () {
    clearInterval(touchInterval)
    touchTime = 0
    tabFlag = true
  }
})