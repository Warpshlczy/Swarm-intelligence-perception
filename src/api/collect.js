// axios的封装
import axios from 'axios'

// 获取用户已完成的收藏
export function getCompletedCollection(params) {
    return axios({
        url: '/favorites/select/FinishedFavorites',
        method: 'POST',
        data: params,
        headers: {
         'Content-Type': 'application/json'
        }
    })
}

// 获取用户未完成的收藏
export function getUnCompletedCollection(params) {
    return axios({
        url: '/favorites/select/UnFinishedFavorites',
        method: 'POST',
        data: params,
        headers: {
         'Content-Type': 'application/json'
        }
    })
}

// 获取用户收藏
// export function getCollection(params) {
//     return axios({
//         url: '/favorites/getFavorites',
//         params: params,
//         method: 'GET'
//     })
// }

// 获取用户收藏总数
// export function getCollectionNum(params) {
//     return axios({
//         url: '/favorites/getCountByUserId',
//         params: params,
//         method: 'GET'
//     })
// }

//是否已收藏
export function isCollected(params) {
    return axios({
        url: '/favorites/checkFavorites',
        method: 'GET',
        params: params
    })
}

// 获取分组
// export function getGroupName(params) {
//     return axios({
//         url: '/favorites/queryGroupName',
//         method: 'GET',
//         params: params
//     })
// }

//添加收藏
export function addCollect(params) {
    return axios({
        url: '/favorites/add',
        method: 'POST',
        data: params
    })
}

// 删除收藏
export function deleteCollect(params) {
    return axios({
        url: '/favorites/deleteById',
        method: 'DELETE',
        params: params,
        headers: {
         'Content-Type': 'multipart/form-data'
        }
    })
}