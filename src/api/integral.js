import axios from 'axios'

// 新增积分
export function addIntegral(params) {
    return axios({
        url: '/contribution/add',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 根据id删除积分
export function deleteIntegral(params) {
    return axios({
        url: '/contribution/delete',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}