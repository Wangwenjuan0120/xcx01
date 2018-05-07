import config from '../../config'
import * as service from '../service/index'

// fetch about video list
export function getAboutVideoList(params) {
  return service.video('relative_video_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch video detail
export function getVideoDetail(params) {
  return service.video('get_save_video', params).then(res => {
    return res.data.rsps[0].body
  })
}

// video praise
export function setVideoPraise(params) {
  return service.video('set_video_support', params).then(res => {
    return res.data.rsps[0].body
  })
}

export function getVideoList(params) {
  return service.video('get_new_save_video_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 获取全部的频道
export function getAllChannel(params) {
  return service.user('get_focus_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 设置订阅频道
export function setFocus(params) {
  return service.user('set_focus_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 搜索视频
export function searchVideo(params) {
  return service.article('search_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// 专辑
export function getAlbum(params) {
  return service.video('get_video_list_by_topic', params).then(res => {
    return res.data.rsps[0].body
  })
}