import config from '../../config'
import * as service from '../service/index'

// fetch comment list
export function getCommentList(params) {
    return service.article('get_comment_list', params).then(res => {
        return res.data.rsps[0].body
    })
}

// report comment
export function reportComment(params) {
    return service.article('report_comment', params).then(res => {
        return res.data.rsps[0].body
    })
}

// add comment
export function addComment(params) {
    return service.article('add_comment', params).then(res => {
        return res.data.rsps[0].body
    })
}

// praise comment
export function praiseComment(params) {
    return service.article('praise_comment', params).then(res => {
        return res.data.rsps[0].body
    })
}