import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Loading } from 'element-ui'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import * as compresspic from './assets/js/compresspic.js'
import print from './assets/js/print.js'
// import Print from 'vue-print-nb'
import axios from 'axios'
import qs from 'qs'
import { userId } from './utils/config.js'

// RSA加密
import JSEncrypt from 'jsencrypt'
Vue.prototype.$jsEncrypt = JSEncrypt
Vue.use(Loading.directive);
Vue.use(print)

// 配置axios异步请求方式
// 配置请求的基准地址
axios.defaults.baseURL = '/api'

// 配置全局变量
Vue.prototype.$baseURL = '/api'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 给headers添加token,这里Authorization是服务端定义的
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  // const token = store.state.token
  // localStorage.setItem(
  //   'Token',
  //   '111'
  // )
  const token = localStorage.getItem('Token')
  if (token) config.headers['X-Token'] = token
  return config
},
  error => {
    // console.log('在request拦截器显示错误：', error.response)
    return Promise.reject(error)
  })

 // respone拦截器
  axios.interceptors.response.use(
  response => {
    // console.log(response.data)
    // 在status正确的情况下，code不正确则返回对应的错误信息（后台自定义为200是正确，并且将错误信息写在message），正确则返回响应
    return response.data.code === 200 || response.data.status === 201 || response.data ? response : Promise.reject(response.data)
  },
  error => {
    // console.log('在respone拦截器显示错误：', error.response.status)
    // // 在status不正确的情况下，判别status状态码给出对应响应
    // console.log(router.history.current.path)
    // console.log('error:', error.response.request.responseURL.slice(-17))
    const path = router.history.current.path
    switch (error.response.status) {
      case 401:
        // if (path !== '/scanTask' && path !== '/themeMap' && path !== '/Task' && path !== '/More') {
        //   router.replace({
        //       // 跳转到登录页面
        //       path: '/login',
        //       // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //       query: { redirect: router.currentRoute.fullPath }
        //     })
        // }
        //  else if (path === '/Task' && error.response.request.responseURL.slice(-17) === 'taskSubmit/create') {
        //   router.replace({
        //     // 跳转到登录页面
        //     path: '/login',
        //     // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //     query: { redirect: router.currentRoute.fullPath }
        //   })
        // }
        // this.$store.commit('set_token', '')
          // localStorage.setItem(
          //   'token',
          //   ''
          // )
        // console.log('this.$store', localStorage)
        // console.log('0123')
        // // console.log('在respone拦截器显示错误：', response.data)
        // store.commit('del_token')
        // router.replace({
        //   // 跳转到登录页面
        //   path: '/login',
        //   // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //   query: { redirect: router.currentRoute.fullPath }
        // })
        break
      case 400:
        store.commit('del_token')
        alert('请先登录')
        router.replace({
          // 跳转到登录页面
          path: '/login',
          // 将跳转的路由path作为参数，登录成功后跳转到该路由，方便登陆成功后再跳转到刚刚的页面
          query: { redirect: router.currentRoute.fullPath }
        })
        break
    }
    return Promise.reject(error.response.data)
  }
)

  // 写不动 死在了根据id获取用户信息，后端用的是post请求，直接进到了请求拦截器里面
//   // respone拦截器
//   axios.interceptors.response.use(
//   response => {
//     console.log(response.data)
//     // 在status正确的情况下，code不正确则返回对应的错误信息（后台自定义为200是正确，并且将错误信息写在message），正确则返回响应
//     return response.data.code === 200 || response.data.status === 201 || response.data ? response : Promise.reject(response.data)
//   },
//   error => {
//     // 在status不正确的情况下，判别status状态码给出对应响应
//     if (error.response) {
//       console.log('在respone拦截器显示错误：', error.response)
//       switch (error.response.status) {
//         case 401:
//           store.commit('del_token')
//           router.replace({
//             // 跳转到登录页面
//             path: '/login',
//             // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             query: { redirect: router.currentRoute.fullPath }
//           })
//           break
//         case 400:
//           store.commit('del_token')
//           alert('请先登录')
//           router.replace({
//             // 跳转到登录页面
//             path: '/login',
//             // 将跳转的路由path作为参数，登录成功后跳转到该路由，方便登陆成功后再跳转到刚刚的页面
//             query: { redirect: router.currentRoute.fullPath }
//           })
//           break
//       }
//     }
//     return Promise.reject(error.response.data)
//   }
// )
// 不带token的axios

const newRequest = axios.create()
newRequest.interceptors.request.use(config => {
  return config
})
// 给每个Vue组件添加axois请求对象
Vue.prototype.$http = axios
Vue.prototype.$newAxios = newRequest
Vue.prototype.qs = qs // 全局注册，使用方法为:this.qs
Vue.prototype.compresspic = compresspic
Vue.prototype.print = print
Vue.prototype.userId = userId

Vue.config.productionTip = false
// el:'#app' 和 mount('#app')都是挂载
// 这里new Vue是实例化一个根组件，一个项目只有一个根组件
new Vue({
  router,
  store,
  data() {
    return {
    }
  },
  render: h => h(App)
}).$mount('#app')
