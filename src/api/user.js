import axios from 'axios'
// 获取RSA
export function getRsa() {
    return axios({
        url: '/user/rsa',
        method: 'GET'
    })
}

// 注册
export function userRegister(params) {
    return axios({
        url: '/user/register',
        method: 'POST',
        data: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 用密码登录
export function userLoginByPassword(params) {
    return axios({
        url: '/user/login/by/password',
        method: 'POST',
        data: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 用短信登录
export function userLoginByCode(params) {
    return axios({
        url: '/user/login/by/code',
        method: 'POST',
        data: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 退出
export function userLogout(params) {
    return axios({
        url: '/user/logout',
        method: 'POST',
        data: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

// 获取用户信息
export function getUserInfo(params) {
    return axios({
        url: '/user/current',
        method: 'POST',
        data: JSON.stringify(params)
    })
}

// 修改密码
export function resetPassword(params) {
    return axios({
        url: '/user/update/password',
        method: 'PUT',
        data: params
        // data: JSON.stringify(params)
    })
}

// 修改手机号
export function resetPhone(params) {
    return axios({
        url: '/user/update/phone',
        method: 'PUT',
        data: params
        // data: JSON.stringify(params)
    })
}

// 上传用户头像
export function updateIcon(params, userId) {
    return axios({
        url: '/user/update/icon/' + userId,
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
        // data: JSON.stringify(params)
    })
}

// 修改用户个人信息
export function uploadInfo(params) {
    return axios({
        url: '/user/update/info',
        method: 'PUT',
        data: params
        // data: JSON.stringify(params)
    })
}

// 发送短信验证码
export function sendCode(params) {
    return axios({
        url: '/sms/send',
        method: 'POST',
        // data: params,
        data: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
          }
    })
}
