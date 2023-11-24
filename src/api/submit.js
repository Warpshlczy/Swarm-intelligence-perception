// axios的封装
import axios from 'axios'
// 提交任务
export function submitTask(params) {
    return axios({
        url: '/task/submit/add',
        method: 'POST',
        data: params
    })
}

// 提交图片
export function uploadSubmitImages(params, submitId) {
    return axios({
        url: '/task/submit/updateImages/' + submitId,
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取任务提交列表
export function getTaskSubmitList(params) {
    return axios({
        url: '/task/submit/list/page/publish',
        method: 'POST',
        data: params,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 审核
export function checkSubmit(params) {
    return axios({
        url: '/task/submit/update',
        method: 'POST',
        data: params,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 删除提交
export function deleteSubmit(params) {
    return axios({
        url: '/task/submit/delete',
        method: 'POST',
        data: params,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 根据提交id获取任务id
export function getTaskIdBySubmitId(params) {
    return axios({
        url: '/task/submit/getTaskIdBySubmitId/?submitId=' + params,
        method: 'POST',
        // data: params,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}