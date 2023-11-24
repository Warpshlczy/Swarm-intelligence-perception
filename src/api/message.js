import axios from 'axios'
// 获取当前用户信息列表
export function getMessageList(params) {
    return axios({
        url: '/message/list',
        params: params,
        method: 'GET'
    })
}

// 改变消息状态
export function changeMessageStatus(params) {
    return axios({
        url: '/message/read',
        data: params,
        method: 'PUT'
    })
}

// 删除消息
export function deleteMessages(params) {
    return axios({
        url: '/message/delete',
        data: params,
        method: 'DELETE'
    })
}