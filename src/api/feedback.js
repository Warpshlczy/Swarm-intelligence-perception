// 反馈
import axios from 'axios'

// 新增反馈
export function addFeedback(params) {
    return axios({
        url: '/feedback/add',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 通过反馈id删除反馈(这个用params传参，拼接在url后面)
export function deleteFeedback(params) {
    return axios({
        url: '/feedback/delete',
        method: 'POST',
        params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 通过反馈id更新反馈(接口成功但是修改内容不变)
export function updateFeedback(params) {
    return axios({
        url: '/feedback/update',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 查找反馈(只能获取20条记录)
export function selectFeedback(params) {
    return axios({
        url: '/feedback/select',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}