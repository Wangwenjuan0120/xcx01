import config from '../../config'
import * as service from '../service/index'
import * as cache from './cache';

export function passport(params) {
  return service.user('reg_or_signin', params).then(res => {
    try {
      wx.setStorageSync(config.USER_STORAGE_KEY, res.rsps[0].body.user)
    } catch (e) { }
    return res
  })
}


export function isLogin() {
  return wx.getStorageSync(config.USER_STORAGE_KEY) !== ''
}


// 登陆更新个人信息
export function saveUser(data) {
  var self = this;

  cache.getData('weixin_info').then(weixin => {
    var loginInfo = data.user;

    var xcxInfo = {
      isLogin: !!loginInfo.uid || false,
      nickName: loginInfo.name || weixin.nickName || "我",
      headUrl: weixin.avatarUrl || loginInfo.headUrl || "../../../images/me.png",
      title: loginInfo.title,
      hospital: loginInfo.hospital,
    }

    loginInfo['xcxInfo'] = xcxInfo;

    try {
      wx.setStorageSync(config.USER_STORAGE_KEY, data);
    } catch (e) { }

    // 保存头像信息
    if (data.result == 5) {
      self.saveHeadImg({ headImg: weixin.avatarUrl || '', nickName: weixin.nickName || '' }).then(data => {
        console.log(data)
      })
    }
  })
}

// 获取个人信息并更新
export function updateUserInfo() {
  return new Promise((resolve, reject) => {
    getUserInfo().then(data => {
      console.log(data)
      let info = wx.getStorageSync(config.USER_STORAGE_KEY);

      let user = Object.assign({}, info.user, data.user);

      let xcxInfo = Object.assign({}, user.xcxInfo, { title: user.title, hospital: user.hospital, nickName: user.name });

      user['xcxInfo'] = xcxInfo;
      info['user'] = user;

      try {
        wx.setStorageSync(config.USER_STORAGE_KEY, info);
      } catch (e) { }

      resolve(data);
    })
  })
}


// 登陆回调  jump 是否跳转页面
export function loginTo(jump = true) {
  return new Promise((resolve, reject) => {
    var data = wx.getStorageSync(config.USER_STORAGE_KEY);

    if (!!data && !!data.uid) {
      resolve(data.user);
    } else {
      if (jump) {
        wx.navigateTo({
          url: '/pages/user/login/index?jump=true'
        })
      } else {
        resolve(false);
      }
    }

  })
}

// 获取用户信息
export function getUser() {
  const userInfo = wx.getStorageSync(config.USER_STORAGE_KEY)
  return userInfo.user || {}
}

// 获取短信验证码
export function getVcode(params) {
  return service.user('vcode', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 登陆
export function login(params) {
  return service.user('reg_or_signin', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 是否登陆接口
export function isAuth(params) {
  return service.user('auth', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 意见反馈
export function getSuggestion(params) {
  return service.suggestion('get_suggestion_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 保存意见反馈
export function saveSuggestion(params) {
  return service.suggestion('save_suggestion', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取二级科室
export function getDepartment(params) {
  return service.user('get_department_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 保存个人信息
export function saveUserInfo(params) {
  return service.user('submit_userinfo', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取个人信息
export function getUserInfo(params) {
  return service.user('get_user_info', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 保存个人信息 头像和昵称
export function saveHeadImg(params) {
  return service.user('set_head_img', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取专业
export function getMajor(params) {
  return service.user('get_major_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取省
export function getProvince(params) {
  return service.user('get_province_list', params).then(res => {
    return res.data.rsps[0].body
  })
}
// 获取市
export function getCity(params) {
  return service.user('get_city_list', params).then(res => {
    return res.data.rsps[0].body
  })
}
// 获取区
export function getDistrict(params) {
  return service.user('get_district_list', params).then(res => {
    return res.data.rsps[0].body
  })
}
// 获取医院
export function getHospital(params) {
  return service.user('get_hospital_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 搜索医院
export function searchHospital(params) {
  return service.suggestion('search_hospital_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取七牛token
export function getToken(params) {
  return service.qiniu('get_qiniu_token', params).then(res => {
    return res.data.rsps[0].body
  })
}