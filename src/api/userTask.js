import axios from 'axios'

// 获取用户提交列表
export function getSubmitList(params) {
  return axios({
      url: '/task/submit/list/page',
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

// 获取用户发布列表
export function getPublicList(params) {
    return axios({
        url: '/task/publish/get/taskList',
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 删除任务
export function deleteTask(params) {
  return axios({
      url: '/task/publish/delete',
      data: params,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}