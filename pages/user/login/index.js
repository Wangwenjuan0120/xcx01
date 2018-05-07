import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: true,
    jump: false,
    phone: '',
    vcode: '',
    url: '',
    isVcode: true,
    time: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var pages = getCurrentPages();

    // var url = '';
    // if (pages.length >= 2){
    //    var upPage = pages[pages.length - 2];
    //    var route = upPage['route'];
    //    var pageOptions = upPage['options'];

    //    var isOne = true;
    //    for (var key in pageOptions){
    //       if (isOne){
    //         route = route + "?" + key + "=" + pageOptions[key]; 

    //         isOne = false;
    //       } else{

    //         route = route + "&" + key + "=" + pageOptions[key]; 
    //       }     
    //    }
    //    url = route;
    // } 


    self.setData({
      jump: !!options && !!options.jump,
      url: !!pages[pages.length - 2] && pages[pages.length - 2]['route']
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
  writePhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  writeVcode: function (e) {
    this.setData({
      vcode: e.detail.value
    });
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  countdown: function () {
    var self = this;
    var time = self.data.time;

    let timeInterval = setInterval(function () {
      var newTime = time--;

      if (newTime == 0) {
        clearInterval(timeInterval);

        self.setData({
          isVcode: true
        })
      }

      self.setData({
        time: newTime
      })
    }, 1000)

  },
  getVcode: function (event) {
    var self = this;

    if (!!self.data.phone) {
      core.user.getVcode({ phone: self.data.phone, topic: 'regsig', type: 1 }).then(data => {
        self.setData({
          isVcode: false,
          time: 60
        })
        self.countdown();

        if (data.success) {
          wx.showToast({
            title: '短信发送成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '短信发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },
  login: function () {
    var self = this;

    if (!self.data.vcode) {
      wx.showToast({
        title: '验证码不正确',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!self.data.isAgree) {
      wx.showToast({
        title: '登陆需要同意《用户协议和隐私条款》',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!self.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }

    core.user.login({ phone: self.data.phone, vcode: self.data.vcode }).then(data => {
      if (!!data.uid) {
        core.user.saveUser(data);

        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            console.log(self.data.jump)
            if (data.user.type == 0) {
              wx.redirectTo({
                url: '/pages/user/perfect/index?type=login'
              })
            } else {
              if (self.data.jump) {
                wx.navigateBack();
              } else {
                wx.redirectTo({
                  url: '/pages/user/home/index'
                })
              }
            }
          }
        })
      } else {
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})