import config from './config'
import core from './utils/core/index'
const UUID = require('./utils/service/uuid')

//app.js
App({
  onLaunch: function () {

    // 缓存微信信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: function (res) {
                  core.cache.saveData('weixin_info', res.userInfo);
                }
              })
            }
          })
        }
      }
    })

    // 生成uuid 并保存
    core.cache.getData(config.UUID_key).then(uuid => {
      if (!uuid) {
        let newUuid = UUID.create().hex.replace(/-/g, '');
        core.cache.saveData(config.UUID_key, newUuid);
      }
    })




    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res.userInfo)
    //   }
    // })




    // core.user.loginTo({}).then(data => {
    //   console.log(data)
    // })

    // console.log(12) 
    // core.user.isAuth({}).then(data => {
    //     console.log(data)
    // })

    // wx.getSetting({
    //   success(res) {
    //     console.log(res)

    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           console.log(456)
    //           wx.getUserInfo({
    //             success: function (res) { 
    //               console.log(res)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    // wx.login({
    //   success: function (res) {
    //     console.log(res)
    //     // if (res.code) {
    //     //   //发起网络请求
    //     //   wx.request({
    //     //     url: 'https://test.com/onLogin',
    //     //     data: {
    //     //       code: res.code
    //     //     }
    //     //   })
    //     // } else {
    //     //   console.log('获取用户登录态失败！' + res.errMsg)
    //     // }
    //   }
    // });

    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
  }
})