import config from '../../config'
import * as service from '../service/index'

export function getLiveList(params) {
  return service.studio('get_recommend_subject', params).then(res => {
    return res.data.rsps[0].body
  })
}

export function getSmallList(params) {
  return service.studio('get_small_subject', params).then(res => {
    return res.data.rsps[0].body
  })
}

// live video detail
export function fetchSubjectInfo(params) {
  return service.studio('get_subject_info', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch live action info
export function fetchActionInfo(params) {
  return service.studio('get_subject_live_actions', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch current ppt image
export function fetchCurrentPPT(params) {
  return service.studio('get_current_ppt_img', params).then(res => {
    return res.data.rsps[0].body
  })
}

// loop fetch subject info
export function loopFetchSubject(params) {
  return service.studio('loop_subject', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch first enter live detail message
export function fetchFirstEnter(params) {
  return service.studio('enter_subject', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch senior message list
export function fetchSeniorMsgList(params) {
  return service.studio('get_advance_msg_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// fetch normal message list
export function fetchNormalMsgList(params) {
  return service.studio('get_normal_msg_list', params).then(res => {
    return res.data.rsps[0].body
  })
}

// add message
export function addMessage(params) {
  return service.studio('save_msg', params).then(res => {
    return res.data.rsps[0].body
  })
}

// signup live video
export function addWorkpoint(params) {
  return service.studio('add_workpoint', params).then(res => {
    return res.data.rsps[0].body
  })
}

// signup live video
export function signupLiveVideo(params) {
  return service.video('signup_live_video', params).then((res, status) => {
    const data = res.data.rsps[0].body
    return {
      data,
      status
    }
  })
}