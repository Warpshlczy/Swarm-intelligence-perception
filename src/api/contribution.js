// axios的封装
import axios from 'axios'

// 获取用户收藏总数
export function getContribution() {
    return axios({
        url: '/contribution/get',
        method: 'GET'
    })
}