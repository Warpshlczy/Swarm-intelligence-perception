// axios的封装
import axios from 'axios'
// 获取推荐列表
// export function getRecommend(params) {
//     return axios({
//         url: '/user/recommend/create',
//         method: 'GET',
//         params: params
//     })
// }

// 更换推荐列表内容
export function changeRecommend(params) {
    return axios({
        url: '/user/recommend/new',
        method: 'GET',
        params: params
    })
}

// 根据id创建任务推荐并返回
export function returnRecommend(params) {
    return axios({
        url: '/user/recommend/createlist',
        method: 'GET',
        params: params
    })
}

// 任务列表
export function getTaskList(params) {
    return axios({
        url: '/task/publish/list/page',
        method: 'POST',
        data: params
    })
}

// 创建任务
export function publishTask(params) {
    return axios({
        url: '/task/publish/add',
        method: 'POST',
        // data: JSON.stringify(params),
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 更新大任务
export function updateTask(params) {
    return axios({
        url: '/task/publish/update',
        method: 'POST',
        // data: JSON.stringify(params),
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
    })
}
// 任务类型
export function getType() {
    return axios({
        url: '/type/select',
        method: 'GET'
    })
}

// 根据id获取任务完成情况
export function getTaskSchedule(params) {
    return axios({
        url: '/task/publish/select/task/schedule',
        method: 'POST',
        data: params
    })
}

// 根据id获取任务提交情况
export function getTaskSubmitList(params) {
    return axios({
        url: '/task/submit/list/page/publish',
        method: 'POST',
        data: params
    })
}

// 根据id获取单个任务详情
export function getTaskDetail(params) {
    return axios({
        // url: '/task/publish/get?id='+ params,
        url: '/task/publish/get',
        method: 'POST',
        params: params
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}


// 根据id删除任务
export function deleteTask(id) {
    return axios({
        // url: '/task/publish/get?id='+ params,
        url: '/task/publish/delete?id=' + id,
        method: 'POST',
        // params: params
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}
// 根据大任务id获取小任务详情
export function getSmallTask(params) {
    return axios({
        url: '/task/publish/list/page/publish/smallTask',
        method: 'POST',
        params: params
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 获取推荐任务
export function getRecommend(params) {
    return axios({
        url: '/task/publish/taskAllocation',
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取发布者昵称
export function getPublisherName(params) {
    return axios({
        url: '/user/get/publisherName',
        method: 'GET',
        params: params
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 上传任务图片
export function uploadTaskImages(params, taskId) {
    return axios({
        url: '/task/publish/update/taskImages/' + taskId,
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}