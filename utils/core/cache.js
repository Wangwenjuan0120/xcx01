// 缓存内容
import config from '../../config'
import * as service from '../service/index'


export function saveData(key, data) {
  wx.setStorage({
    key: key,
    data: data
  })
  return data
}

export function getData(key) {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: key,
      success: function (res) {
        resolve(res.data)
      },
      fail: function () {
        resolve('');
      }
    })
  })
}




function cache(key = '') {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: key,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}


// 热门搜索
export function getHotSearch(params) {
  return cache('get_hot_search').catch(data => {
    return service.article('get_hot_search', params).then(res => {
      return saveData('get_hot_search', res.data.rsps[0].body)
    })
  })
}

// 获取全部分类
export function getCategory(params) {
  return cache('get_category_list').catch(data => {
    return service.video('get_category_list', params).then(res => {
      return saveData('get_category_list', res.data.rsps[0].body)
    })
  })
}