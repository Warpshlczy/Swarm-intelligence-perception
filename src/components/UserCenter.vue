<template>
  <div class="userCenterBox">
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside width="200px">
        <el-card class="userCard">
          <!-- 用户头像 -->
          <el-avatar :size="60" :src=$store.state.profilePath></el-avatar>
          <!-- 用户名 -->
          <p>{{ $store.state.userName }}</p>
          <!-- 个性签名 -->
          <p>{{ $store.state.signature }}</p>
        </el-card>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          ctive-text-color="rgb(0, 121, 254)" router>
          <el-menu-item index="/userInformation">基本信息</el-menu-item>
          <el-menu-item index="/messageCenter">消息中心</el-menu-item>
          <el-menu-item index="/myPublish">我的发布</el-menu-item>
          <el-menu-item index="/mySubmission">我的提交</el-menu-item>
          <el-menu-item index="/myCollection">我的收藏</el-menu-item>
          <el-menu-item index="/myContribution">我的贡献</el-menu-item>
          <el-menu-item index="/feedback">反馈意见</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容栏 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getUserInfo } from '../api/user'

export default {
  created() {
    this.userInformation()
  },
  mounted() {
  },
  data() {
    return {
      circleUrl: require('../assets/touxiang.png'),
      user: {
         nickName: '',
         signature: ''
      }
    }
  },
  methods: {
    // 和UserInformation.vue可复用
  async userInformation() {
        // const {data: res} = await this.$http.post('/user/user', this.qs.stringify({id: this.userId}))
        const token = localStorage.getItem('Token')
        // console.log(token)
        // console.log(window.localStorage)
        const res = await getUserInfo(token)
        // const id = await getUserInfo(token).data.data.id
        // console.log("res", res)
        // if (res.code !== 200) return this.$message.error('获取用户信息失败！')
        if (res.data.code !== 200) {
          this.$router.replace({
          // 跳转到登录页面
          path: '/login',
          // 将跳转的路由path作为参数，登录成功后跳转到该路由
          query: { redirect: this.$router.currentRoute.fullPath }
        })
        }
        this.user = res.data.data
        // this.user.id = String(res.data.data.id)
        // console.log("userinfo", res.data.data.id)
        if (!this.user.nickName) this.user.nickName = '无'
        this.$store.state.userName = this.user.nickName
        if (!this.user.signature) this.user.signature = ''
        this.$store.state.signature = this.user.signature
        if (this.user.profilePath) {
          this.circleUrl = this.$baseURL + this.user.profilePath
          this.$store.state.profilePath = this.circleUrl
        }
    }
  }
}
</script>

<style lang="less" scoped>

.userCenterBox{
  width: 99%;
  padding-left: 1%;
  .userCard{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .el-menu{
    text-align: center;
  }
}

.el-main{
  padding-top: 0;
}
</style>
