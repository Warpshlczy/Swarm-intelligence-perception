<template>
  <div class="UserInformationBox">
    <el-card>
      <el-tabs v-model="activeClassName" @tab-click="handleClick">
        <el-tab-pane label="我的信息" name="userInformation">
          <div class="user">
            <el-row style="background-color: rgba(242, 242, 242, 1)">
            <el-col :span="4" :offset="2"><div><span>头像</span></div></el-col>
            <el-col :span="8"><div><el-avatar  icon="el-icon-user-solid" :size="50" :src=$store.state.profilePath class="avatar"></el-avatar></div></el-col>
            <el-col :span="6">
              <!-- 修改头像 -->
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request='updateAvatar'
                :on-success="handleAvatarSuccess"
                list-type="picture">
                <el-button type="text">修改</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <!-- 修改昵称 -->
          <el-row>
            <el-col :span="4" :offset="2"><div><span>昵称</span></div></el-col>
            <el-col :span="8"><div><span>{{ user.nickName }}</span></div></el-col>
            <el-col :span="6">
              <div><el-button type="text" @click="nickDialogVisible=true">修改</el-button></div>
            </el-col>
            <el-dialog
          title="修改昵称"
          :visible.sync="nickDialogVisible"
          width="380px"
          class="edit-form">
           <!-- label-width="80px" -->
          <el-form ref="editFormRef" :rules="editFormRules" :model="user" label-position="left">
            <el-form-item prop="nickName">
              <el-input v-model="user.nickName"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="nickDialogVisible = false;initInformation()">取 消</el-button>
            <el-button type="primary" @click="updateNickName()">确 定</el-button>
          </span>
        </el-dialog>
          </el-row>
          <!-- 修改个性签名 -->
          <el-row style="background-color: rgba(242, 242, 242, 1)">
          <el-col :span="4" :offset="2"><div><span>个性签名</span></div></el-col>
          <el-col :span="8"><div><span>{{ user.signature }}</span></div></el-col>
          <el-col :span="6"><div><el-button type="text" @click="sigDialogVisible=true">修改</el-button></div></el-col>
          <el-dialog
        title="修改个性签名"
        :visible.sync="sigDialogVisible"
        width="385px"
        class="edit-form">
        <el-form ref="editFormRef" :rules="editFormRules" :model="user" label-position="left">
          <el-form-item prop="signature">
            <el-input v-model="user.signature"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="sigDialogVisible = false;initInformation()">取 消</el-button>
          <el-button type="primary" @click="initSignature()">确 定</el-button>
        </span>
      </el-dialog>
        </el-row>
          <!-- 修改平台默认首页 -->
          <el-row>
            <el-col :span="4" :offset="2"><div>
              <el-tooltip content="登录后跳转的页面" placement="top" style="color:#999999">
                <i class="el-icon-question"/>
              </el-tooltip>
              <span>平台默认首页</span></div></el-col>
            <el-col :span="8"><div><span>{{ user.homePage }}</span></div></el-col>
            <el-col :span="6">
              <div>
                <el-button type="text" @click="homePageDialogVisible=true">修改</el-button>
              </div>
            </el-col>
            <el-dialog
              title="修改平台默认首页"
              :visible.sync="homePageDialogVisible"
              width="385px"
              class="edit-form">
              <el-form :model="user" label-position="left">
                <el-form-item prop="homePage">
                  <el-select v-model="user.home" placeholder="请选择登录后跳转的页面">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="homePageDialogVisible = false;initInformation()">取 消</el-button>
                <el-button type="primary" @click="updateHomePage()">确 定</el-button>
              </span>
            </el-dialog>
          </el-row>
          <!-- 修改我的常用位置 -->
          <el-row style="background-color: rgba(242, 242, 242, 1)">
            <el-col :span="4" :offset="2"><div>
              <el-tooltip content="用于任务推荐" placement="top" style="color:#999999">
                <i class="el-icon-question"/>
              </el-tooltip>
              <span>我的常用位置</span></div></el-col>
            <el-col :span="8">
              <div><span>{{ user.address }}</span></div></el-col>
            <el-col :span="6"><div><el-button type="text" @click="openAddressDialog">修改</el-button></div></el-col>
            <el-dialog
          title="修改我的常用位置"
          :visible.sync="addressDialogVisible"
          width="50%"
          class="edit-form">
            <el-form ref="editFormRef" :rules="editFormRules" :model="user" label-position="left">
            <el-form-item label="" prop="address" style="width:100%">
              <iframe ref="iframe" name="selectAdress" src="static/选择地址.html" frameborder="0" scrolling="no" class="selectAdress"></iframe>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addressDialogVisible = false;initInformation()">取 消</el-button>
            <el-button type="primary" @click="updateAddress()">确 定</el-button>
          </span>
        </el-dialog>
          </el-row>
          <el-row :gutter="20">
            <el-col class="logout" :span="4" :offset="8">
              <el-button type="info" @click="logout">退出</el-button>
            </el-col>
          </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账号设置" name="accountSetting">
          <div class="accountsetting">
            <el-row>
              <el-col style="font-size:48px;color:#CCC" :span="2" :offset="4">
                <i class="el-icon-lock"></i>
              </el-col>
              <el-col :span="18">
                <el-row id="boldtext">登录密码</el-row>
                <el-row id="fontstyle1">建议您定期更换密码，设置安全性高的密码可以使帐号更安全</el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="6">
                <el-button type="info" plain class="btn" @click="pushResetPassword">修改</el-button>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
              <el-col style="font-size:48px;color:#CCC" :span="2" :offset="4">
                <i class="el-icon-mobile-phone"></i>
              </el-col>
              <el-col :span="18">
                <el-row id="boldtext">安全手机 {{ phone }}</el-row>
                <el-row id="fontstyle1">安全手机可以用于登录帐号，重置密码或其他安全验证</el-row>
                <el-row><el-button type="info" plain class="btn" @click="pushResetPhone">更换</el-button></el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {userLogout, getUserInfo, uploadInfo, updateIcon} from '@/api/user'
// import { regionData, CodeToText } from 'element-china-area-data'
export default {
  created() {
    this.initInformation()
    // 初始化省市区
    // this.selectedOptions = [this.form.provinceCode, this.form.cityCode, this.form.areaCode]
  },
  updated() {
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
  },
  computed: {
    now() {
      return Date.now()
    }
  },
  data() {
    var validatorNickName = function (rule, value, callback) {
      // if (!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(value)) {
      //   callback(new Error('昵称只能是中文、字母和数字，不能包含特殊字符'))
      // } else {
      //   callback()
      // }
    }
    return {
      logoutData: '', // 退出接口返回的数据
      // 设置我的常用地址，暂未实现
      // regionOptions: regionData,
      // selectedOptions: [],
      // cityName: '',
      // countyName: '',
      longitude: '',
      latitude: '',
      activeClassName: 'userInformation',
      circleUrl: require('../../assets/touxiang.png'),
      feedbackForm: {
        suggestion: '',
        contact: ''
      },
      user: {},
      // 这是用户信息表单的数据绑定对象
      phone: '',
      nickDialogVisible: false,
      sigDialogVisible: false,
      homePageDialogVisible: false,
      addressDialogVisible: false,
      options: [{
          value: 'null',
          label: '无'
        }, {
          value: '/ScanTask',
          label: '查看任务'
        }, {
          value: '/PublishTask',
          label: '发布任务'
        }, {
          value: '/ThemeMap',
          label: '主题地图'
        }],
      editFormRules: {
        nickName: [
          { max: 20, message: '长度在1到20个字符之间', trigger: 'blur' }
          // { required: true, validator: validatorNickName, trigger: 'blur' }
        ],
        signature: [
          { max: 25, message: '长度在1到25个字符之间', trigger: 'blur' }
        ],
        address: [
          { max: 500, message: '长度在1到50个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  inject: ['reload'],
  methods: {
    // 获取用户信息
    async initInformation() {
        const token = localStorage.getItem('Token')
        // console.log('token:', token)
        const res = await getUserInfo(token)
        this.user = res.data.data
        // console.log('用户信息：', res)
        // 头像相关
        if (this.user.icon) {
          this.circleUrl = 'http://101.34.16.47/resource' + this.user.icon
          this.$store.state.profilePath = this.circleUrl
        }
        if (!this.user.nickName) this.user.nickName = '无'
        this.$store.state.userName = this.user.nickName
        if (!this.user.signature) this.user.signature = '无'
        this.$store.state.signature = this.user.signature
        if (!this.user.address) this.user.address = '无'
        switch(this.user.home) {
          case('null'): this.user.homePage = '无';break;
          case(null): this.user.homePage = '无';break;
          case('/ScanTask'): this.user.homePage = '查看任务';break;
          case('/PublishTask'): this.user.homePage = '发布任务';break;
          case('/ThemeMap'): this.user.homePage = '主题地图';break;
        }
        // if (!this.user.homePage) this.user.homePage = '任务列表'
        // if (!this.user.homePage) this.user.homePage = '无'
        this.phone = this.user.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    },
    // 修改头像
    // async initPicture(file) {
    //   // 新建一个FormData
    //   var upData = new FormData()
    //   upData.append('files', file.raw, file.name) // 因为要上传多个文件，所以需要遍历一下才行
    //   upData.append('id', this.user.id)
    //   const {data: res} = await this.$http.post('/user/update/profile_path', upData)
    //    if (res.code !== 200) return this.$message.error('修改用户头像失败！')
    //   this.$message.success('修改用户头像成功！')
    //   this.circleUrl = URL.createObjectURL(file.raw)
    // },

    // 修改用户头像
    async updateAvatar() {
        var upData = new FormData()
        this.file = await this.compresspic.compressAccurately(this.file, 200)
        // console.log('this.file:', this.file)
        // upData.append('icon', this.file, this.fileName)
        upData.append('icon', this.file)
        // upData.append('userId', this.user.id)
        // await this.$store.dispatch('updateAvatar', upData)
        // console.log(this.$store.state.profilePath)
        const res1 = await updateIcon(upData, this.user.id)
        // console.log('上传头像返回的数据：', res1)
        this.user.icon = 'http://101.34.16.47/resource' + res1.data.data
        // console.log('头像地址：', this.user.icon)
        if (res1.data.code === 200) this.$message.success('修改头像成功！')
        else this.$message.error('修改头像失败！请稍后再试！')
        this.initInformation()
        // console.log(this.$store.state.profilePath + '?' + Date.now())
        // const {data: res} = await this.$http.post('/user/update/profile_path', upData)
        // console.log(res)
        // if (res.code !== 201) return this.$message.error('修改用户头像失败！')
        // this.$message.success('修改用户头像成功！')
        // this.circleUrl = this.$baseURL + res.data.profilePath
        // // console.log(this.circleUrl)
        // this.$store.commit('updateProfilePath', this.circleUrl)
        // console.log(this.$store.state.profilePath)
        // this.reload()
    },
    async beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
      this.file = file
      this.fileName = file.name
      this.fileType = file.type
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg, jpeg, png 格式!')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
        return resolve(true)
      })
    },
    handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 修改用户昵称
   async updateNickName() {
     this.$refs.editFormRef.validate(async (valid) => {
      if (!valid) return
      // const {data: res} = await this.$http.post('/user/update/nick_name',
      // this.qs.stringify({
      //   id: this.userId,
      //   nick_name: this.user.nickName
      // }))
      // console.log('用户id：', this.user.id)
      const res = await uploadInfo({
        userId: this.user.id,
        nickName: this.user.nickName,
        signature: this.user.signature
      })
      // console.log('修改用户昵称返回数据', res)
      if (res.data.code !== 200) return this.$message.error('修改用户昵称失败！')
      this.$message.success('修改用户昵称成功！')
      this.$store.commit('updateUsername', res.data.nickName)
      this.user.name = this.$store.state.userName
      this.nickDialogVisible = false
      this.initInformation()
      // this.reload()
      })
    },
    // 修改个性签名
     async initSignature() {
      this.$refs.editFormRef.validate(async (valid) => {
      if (!valid) return
      // const {data: res} = await this.$http.post('/user/update/signature',
      // this.qs.stringify({
      //   id: this.user.id,
      //   signature: this.user.signature
      // }))
      const res = await uploadInfo({
        userId: this.user.id,
        nickName: this.user.nickName,
        signature: this.user.signature
      })
      // console.log('res', res)
      // if (res.code !== 201) return this.$message.error('修改个性签名失败！')
      this.$message.success('修改个性签名成功！')
      this.$store.commit('updateSignature', res.data.signature)
      this.user.signature = this.$store.state.signature
      this.sigDialogVisible = false
      this.initInformation()
      // this.reload()
      })
    },
    // 修改首页地址
    async updateHomePage() {
      // const {data: res} = await this.$http.post('/user/update/home_page',
      // this.qs.stringify({
      //   id: this.user.id,
      //   homePage: this.user.homePage
      // }))
      //  if (res.code !== 201) return this.$message.error('修改首页地址失败！')
      console.log('1', this.user)
      const res = await uploadInfo({
        userId: this.user.id,
        home: this.user.home
      })
      if (res.data.code === 200) {
        this.$message.success('修改首页地址成功！')
      }
      else {
        this.$message.error('修改失败，请重试')
      }
      this.homePageDialogVisible = false
      this.initInformation()
    },
    // 修改我的常用位置
    openAddressDialog() {
      // this.$nextTick(() => {
      //   // console.log(this.$refs.iframe1)
      //   this.$refs.iframe.src = 'static/选择地址.html'
      //   // this.$refs.iframe.contentWindow.location.reload(true)
      // })
      this.addressDialogVisible = true
    },
    async updateAddress() {
      this.$refs.editFormRef.validate(async (valid) => {
      if (!valid) return
      // const {data: res} = await this.$http.post('/user/update/address',
      // this.qs.stringify({
      //   id: this.user.id,
      //   address: this.user.address,
      //   latitude: this.latitude,
      //   longitude: this.longitude
      // }))
      const res = await uploadInfo({
        userId: this.user.id,
        address: this.user.address,
        latitude: this.latitude,
        longitude: this.longitude
      })
      // console.log(this.user.id)
      // console.log(res)
      if (res.data.code !== 200) return this.$message.error('修改我的地址失败！')
      this.$message.success('修改我的地址成功！')
      this.initInformation()
      this.addressDialogVisible = false
      })
    },
    pushResetPassword() {
      window.sessionStorage.clear()
      this.$router.push({ path: '/resetpassword', query: {phone: this.user.phone, id: this.user.id}})
    },
    pushResetPhone() {
      window.sessionStorage.clear()
      this.$router.push({ path: '/resetphone', query: {phone: this.user.phone, id: this.user.id}})
    },
    handleClick(tab, event) {
      if (tab.name === 'userInformation') {
        this.initInformation()
      } else {
        // this.getMyContribution()
        }
    },
    // 获取经纬度数据
    handleMessage(event) {
      const data = event.data
      // console.log(data)
      // this.user.address = this.qs.stringify(data)
      if (data.address) {
        this.user.address = JSON.stringify(data.address)
        this.latitude = JSON.stringify(data.lat)
        this.longitude = JSON.stringify(data.lng)
        this.user.address = this.user.address.split('"').join('')
        this.user.address = this.user.address.split(',').join('')
        this.user.address = this.user.address.split(' ').join('')
      }
    },
    // 用户退出登录
    async logout() {
      this.logoutData = await userLogout(localStorage.getItem('Token'))
      // console.log('退出登录返回数据', this.logoutData)
      if (this.logoutData.data.code === 200) {
        this.$message.success('退出成功')
        this.$store.state.profilePath = ''
        this.$router.push('/')
      } else {
            this.$message.error(this.logoutData.data.message)
        }
      // 清除用户状态
      window.localStorage.clear()
      window.localStorage.setItem('isLogin', false)
      // this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
// 信息栏位置向右移
::v-deep .el-col-offset-2 {
  margin-left: 15%;
}
.logout {
  padding-left: 11.5% !important;
  padding-right: 0 !important;
}
.UserInformationBox{
  width: 100%;
  .el-card{
    height: 575px;
  }
  .user {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    text-align: center;
    line-height: 80px;
    .el-row {
      height: 80px;
      font-size: 15px;
      margin-left: 10px;
      margin-right: 10px;
      position: relative;
    }
    .el-row .el-col:first-child {
      color: black;
      font-weight: 300;
    }
  }
  .avatar {
    // display: table-cell; //主要是这个属性
    vertical-align: middle;
    text-align: center;
  }
  .address{
    height: auto;
    line-height: 20px;
    // width:199.5px;
    // display: flex;
    // justify-content: center; //水平
    // align-items: center; //垂直
    // position: absolute;
    top: 50%;
    transform: translate(0, 50%);
    span{
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
      text-align:center;
  }
  .selectAdress{
    width: 100%;
    height: 300px;
  }
  .accountsetting{
    margin-top: 50px;
    .el-row{
      margin-bottom: 15px;
    }
  }
  #boldtext{
    font-size:18px;
    line-height: 36px;
  }
  .btn{
    padding-left: 60px;
    padding-right: 60px;
    font-weight: 700;
    color: #999;
    line-height: 24px;
  }
  // 去掉弹框内容的默认padding值
  /deep/ .el-dialog__body {
    padding: 0px;
    text-align: center;
  }
  .el-input{
     width:80%
  }
  /deep/ .el-form-item__error{
    position: relative;
  }
}

</style>
