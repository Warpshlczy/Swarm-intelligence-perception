import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import '../main.js'
import { userId } from '../utils/config'

// 1.安装插件
Vue.use(Vuex)

// var storage = {
//   set (key, value) {
//     localStorage.setItem(key, JSON.stringify(value))
//   },
//   get (key) {
//     return JSON.parse(localStorage.getItem(key))
//   },
//   remove (key) {
//     localStorage.removeItem(key)
//   },
//   removeAll () {
//     localStorage.clear()
//   },
//   getAll () {
//     var len = localStorage.length
//     // eslint-disable-next-line no-array-constructor
//     var arr = []
//     for (var i = 0; i < len; i++) {
//       var getKey = localStorage.key(i)
//       var getVal = localStorage.getItem(getKey)
//       arr[i].push({
//         'key': getKey,
//         'val': getVal
//       })
//     }
//     return arr
//   }
// }

// 2.创建对象
const store = new Vuex.Store({
  state: {
    messageNumber: 0,
    token: '',
    profilePath: '',
    userName: '',
    signature: '',
    current_lng: '',
    current_lat: ''
  },
  mutations: {
    set_token(state, token) {
      state.token = token
      // storage.set('token', token)
      // console.log('store、localstorage保存token成功！')
    },
    del_token (state) {
      state.token = ''
      // storage.remove('token')
    },
    set_lng(state, lng) {
      state.current_lng = lng
      // storage.set('token', token)
    },
    set_lat(state, lat) {
      state.current_lat = lat
      // storage.set('token', token)
    },
    set_messageNum(state, num) {
      state.messageNumber = num
      // storage.set('messageNumber', num)
    },
    updateState(state, payload) {
      state.messageNumber = payload
      // console.log(state.messageNumber)
    },
    updateProfilePath(state, payload) {
      state.profilePath = payload + '?' + Date.now()
      // console.log(state.profilePath)
    },
    updateUsername(state, payload) {
      state.userName = payload
      // console.log(state.userName)
    },
    updateSignature(state, payload) {
      state.signature = payload
      // console.log(state.signature)
    }
  },
  actions: {
    getMessageNum({commit}) {
      return new Promise((resolve, reject) => {
        axios.get('/message/Message/UnreadMessageNums?UserId=' + userId).then(res => {
          // console.log('未读消息数')
          // console.log(res.data)
          commit('updateState', res.data.data)
          resolve(res.data.data)
        })
      })
    },
    updateAvatar({commit}, upData) {
      return new Promise((resolve, reject) => {
        axios.post('/user/upload/icon', upData).then(res => {
          // console.log(res)
          var circleUrl = '/api' + res.data.data.profilePath
          commit('updateProfilePath', circleUrl)
          resolve(circleUrl)
        })
      })
  }
},
  getters: {
  },
  modules: {
  }
})

// 3.导出使用
export default store
