/**
 * 服务端接口中间层
 */
import config from '../../config'
const UUID = require('./uuid')
const md5 = require('./md5')

function run(server, command = '', params = {}) {
  let guid = "";
  let now = (new Date()).getTime();
  let token = md5(guid + now);
  let encrypt = ""
  let userInfo = {};

  // let token = md5(UUID.create() + now)

  try {
    guid = wx.getStorageSync(config.UUID_key);
  } catch (e) {

  }

  try {
    userInfo = wx.getStorageSync(config.USER_STORAGE_KEY);
    encrypt = userInfo && userInfo.user && userInfo.user.encrypt || '4dMtrpIm201/goik3oVddUXV1Fb0PibTHJJgRDJuCsRXHZY3lhcqtqQN3/9rQu6Z'
  } catch (e) {

  }


  let requestData = {
    guid: guid,
    platform: "xcx",
    version: "3.0.0",
    time: now,
    // encrypt: {
    //   token: token,
    //   uid: userInfo && userInfo.userInfo && userInfo.userInfo.uid || 0,
    //   sessionKey: userInfo && userInfo.userInfo && userInfo.userInfo.sessionKey || 0
    // },
    encrypt: encrypt,
    reqs: [{
      head: {
        srv: server,
        cmd: command
      },
      body: params
    }]
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: config.API_HOST,
      data: requestData,
      method: 'POST',
      success: (res, status, header) => {
        if ((!!res.data && !!res.data.msg) || (!!res.data.rsps[0] && !!res.data.rsps[0].head && !!res.data.rsps[0].head.msg)) {
          wx.showToast({
            title: res.data.msg || res.data.rsps[0].head.msg,
            icon: 'none',
            duration: 2000
          })
        }
        resolve(res, status, header)
      },
      fail: () => {
        reject()
      }
    })
  })
}

// 直播
export function studio(command, params) {
  return run('studio_studio', command, params)
}

// 视频
export function video(command, params) {
  return run('video_video', command, params)
}

// 用户
export function user(command, params) {
  return run('user_user', command, params)
}

// 评论
export function article(command, params) {
  return run('article_article', command, params)
}

// 搜索
export function search(command, params) {
  return run('search_list', command, params)
}

//意见反馈
export function suggestion(command, params) {
  return run('suggestion_suggestion', command, params)
}

//七牛
export function qiniu(command, params) {
  return run('qiniu_qiniu', command, params)
}