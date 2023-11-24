<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="preheader">
        <img src="../assets/群智.png" alt="" style="height:60px" @click="jumpToUrbanSensing">
        <span @click="jumpToHomePage">群智感知平台</span>
        <el-menu style="width:545px" :default-active="$route.path" class="el-menu-demo" mode="horizontal" active-text-color="rgb(0, 121, 254)" router>
          <el-menu-item index="/themeMap">主题地图</el-menu-item>
          <el-menu-item index="/scanTask">查看任务</el-menu-item>
          <el-menu-item index="/PublishTask" @click="jumpToPublish">发布任务</el-menu-item>
          <el-menu-item index="/More" @click="More">更多</el-menu-item>
        </el-menu>
      </div>
      <!-- 头部右侧区域 -->
      <div class="postheader">
        <el-tooltip class="item" effect="light" content="消息中心" placement="bottom">
          <el-badge :value=$store.state.messageNumber :hidden=!$store.state.messageNumber :max="99" class="item" @click.native="jumpToMessageCenter">
            <i class="el-icon-message"></i>
          </el-badge>
        </el-tooltip>
        <!-- 头像 -->
        <el-tooltip class="item" effect="light" content="用户中心" placement="bottom">
          <el-avatar :size="45" :src=$store.state.profilePath @click.native="jumpToUserCenter"></el-avatar>
        </el-tooltip>
      </div>

    </el-header>
    <!-- 页面主体区域 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
// import bus from '../assets/js/bus.js'
import { getUserInfo } from '../api/user'
import { getMessageList } from '../api/message'


export default {
  data() {
    return {
      circleUrl: require('../assets/touxiang.png'),
      isdot: false
    }
  },
  created() {
    // this.$store.dispatch('getMessageNum')
    this.userInformation()
  },
  mounted() {
    // this.$store.dispatch('getMessageNum')
    // bus.$on('listenToMessageNum', (val) => {
    //   this.messageNum = val
    // })
  },
  inject: ['reload'],
  methods: {
    // 获取用户个人信息
    async userInformation() {
      const token = localStorage.getItem('Token')
      const res = await getUserInfo(token)
      // console.log(token)
      // console.log('个人信息：', res)
      // const path = this.$route.path
      // console.log(path) 
      // if (path !== '/scanTask' && path !== '/themeMap' && path !== '/More' && token && res.data.code != 200) {
      //   console.log(123)
      //   this.$message.error('登录已过期，请重新登录')
      // }
      this.user = res.data.data
      if (this.user.icon) {
        this.circleUrl = 'http://101.34.16.47/resource' + this.user.icon
        this.$store.state.profilePath = this.circleUrl
      }
      const res1 = await getMessageList({
        userId: res.data.data.id,
        current: 1,
        size: 10000
      })
      // console.log('message', res1.data.data)
      // let messageList = res1.data.data.resultList
      this.$store.state.messageNumber = res1.data.data.unreadNum
      // for (let i = 0;i < messageList.length;i++) {
      //   if (messageList[i].status === 0) messageNumber = messageNumber + 1
      // }
      // this.$store.state.messageNumber = messageNumber
      // console.log('messageNumber', messageNumber)
    },
    async jumpToPublish() {
      //  const {data: res} = await this.$http.get('/taskPublish/search/id?id=1')
      // //  console.log(res)
      //  if (res.code === 401) {
      //   this.$router.replace({
      //     // 跳转到登录页面
      //     path: '/login'
      //     // 将跳转的路由path作为参数，登录成功后跳转到该路由
      //     // query: { redirect: this.$router.currentRoute.fullPath }
      //   })
      //  }
        localStorage.setItem('router_history', '/PublishTask')
      //   this.$http.get('/taskPublish/search/id?id=1').then(response => {
      //     console.log('请求成功', response.data)
      //     // this.$router.push('/publishTask')
      //   },
      //   error => {
      //     console.log('请求失败', error.response)
      //     if (error.response.status === 401) {
      //       this.$router.replace({
      //       // 跳转到登录页面
      //       path: '/login'
      //       // 将跳转的路由path作为参数，登录成功后跳转到该路由
      //       // query: { redirect: this.$router.currentRoute.fullPath }
      //     })
      //     }
      //   }
      // )
        // console.log(res)
    },
    More () {
      localStorage.setItem('router_history', '/More')
    },
    jumpToUserCenter() {
      // this.$http.get('/taskPublish/search/id?id=1').then(response => {
        // console.log('请求成功', response.data)
        this.$router.push('/userCenter')
      // },
      // error => {
      //   console.log('请求失败', error.response)
      //   if (error.response.status === 401) {
      //     localStorage.setItem('router_history', '/userCenter')
      //     this.$router.replace({
      //     // 跳转到登录页面
      //     path: '/login'
      //     // 将跳转的路由path作为参数，登录成功后跳转到该路由
      //     // query: { redirect: this.$router.currentRoute.fullPath }
      //   })
      //   }
      // }
    //  )
    },
    jumpToMessageCenter() {
      // this.$http.get('/taskPublish/search/id?id=1').then(response => {
      //   console.log('请求成功', response.data)
      //   this.$router.push('/messageCenter')
      // },
      // error => {
      //   console.log('请求失败', error.response)
      //   // if (error.response.status === 401) {
      //   //   localStorage.setItem('router_history', '/messageCenter')
      //   //   this.$router.replace({
      //   //   // 跳转到登录页面
      //   //   path: '/login'
      //   //   // 将跳转的路由path作为参数，登录成功后跳转到该路由
      //   //   // query: { redirect: this.$router.currentRoute.fullPath }
      //   // })
      //   // }
      // })
      // const token = localStorage.getItem('Token')
      // if (!token) {
      //   // this.$confirm('当前尚未登录无法提交数据，请问是否登录？', '提示', {
      //   //   confirmButtonText: '确定',
      //   //   cancelButtonText: '取消',
      //   //   type: 'warning'
      //   // }).then(async() => {
      //   //   localStorage.setItem('router_history', '/scanTask')
      //   //   this.$router.push('login')
      //   // })
      //   this.$message.error('当前尚未登录无法查看消息，请先登录')
      // }
      // else {
        this.$router.push('/messageCenter')
      // }
    },
    // 跳转到群智感知平台主页
    async jumpToHomePage() {
      const {data: res} = await this.$http.post('/user/user', this.qs.stringify({id: this.userId}))
      // console.log(res.data)
      this.$router.push({name: res.data.homePage})
      // this.$router.push('/themeMap')
    },
    jumpToUrbanSensing() {
      window.location.href = 'https://www.fzu-urbansensing.com/'
    }
  }
}
</script>
<style lang="less" scoped>

.home-container{
  height: 100%;
}

.el-header{
  height: 80px !important;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding-left: 50px;
  // padding-left: 5%;
  align-items: center;
  color: #999999;
  font-size: 20px;
  .preheader{
    display: flex;
    align-items: center;
    img{
      cursor: pointer;
    }
    span{
      margin-left: 15px;
      width:120px;
      cursor: pointer;
    }
    .el-menu{
      margin-left: 20px;
      border-bottom: none;
      .el-menu-item{
        margin:0 20px;
        font-size: 16px;
        font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-weight: bold;
        color: #999999;
      }
    }
    .item{
      margin-top: 10px;
      margin-right: 40px;
      // margin-right: 4%;
    }
  };
  .postheader{
    display: flex;
    align-items: center;
    font-size: 25px;
    .el-badge{
      cursor: pointer;
      .el-icon-message{
        font-size: 30px;
      }
    }
    .el-button{
      margin-left: 20px;
    }
    .el-avatar{
      margin-left: 20px;
      cursor: pointer;
    }
  }

}
.el-main{
  background-color: #eaedf1;
}

.iconfont{
  margin-right: 10px;
}
</style>
