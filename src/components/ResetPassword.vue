<template>
  <div class="register_container">
    <div class="register_box">
      <el-button type="text" class="backbtn" v-if="resetSuccess===false" @click="pushLogin">返回</el-button>
      <div class="avatar_box">
        <img src="../assets/群智.png" alt="">
      </div>
      <el-row class="reset" v-if="resetSuccess===false">重置密码</el-row>
      <!-- 登录表单,ref为此registerForm对象的引用 -->
      <el-form v-if="resetNext===false && resetSuccess===false" ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form">
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="verifyCode" class="verifyitem" >
          <el-input v-model="registerForm.verifyCode" prefix-icon="el-icon-message" placeholder="请输入验证码" class="verifyCode"></el-input>
          <el-button  type="primary"  @click="getVerify" :disabled="!show" style="width:112px;">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s后重发</span>
          </el-button>
        </el-form-item>
        <el-form-item prop="newPassword">
        <el-input v-model="registerForm.newPassword" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
      <el-input v-model="registerForm.checkpassword" prefix-icon="el-icon-lock" placeholder="请输入确认密码" show-password></el-input>
      </el-form-item>
        <el-form-item class="btns">
          <!-- <el-button type="primary" @click="confirmCode" class="registerbutton">下一步</el-button> -->
          <el-button type="primary" @click="register" class="registerbutton">下一步</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-form v-if="resetNext===true && resetSuccess===false" ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form"> -->
        <!-- 密码 -->
        <!-- <el-form-item prop="newPassword">
          <el-input v-model="registerForm.newPassword" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </el-form-item> -->
        <!-- 确认密码 -->
        <!-- 确认密码 -->
        <!-- <el-form-item prop="checkpassword">
          <el-input v-model="registerForm.checkpassword" prefix-icon="el-icon-lock" placeholder="请输入确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="register" class="registerbutton">下一步</el-button>
        </el-form-item>
      </el-form> -->
      <!-- 重置密码成功 -->
      <div v-if="resetSuccess===true" class="resetsuccess">
        <!-- <el-result icon="success" title="密码重置成功" subTitle="请妥善保管您的账户信息">
          <template slot="extra">
            <el-button type="primary" size="medium">重新登录</el-button>
          </template>
        </el-result> -->
        <img src="../assets/check.png" style="height:90px" alt="">
        <el-row id="boldtext">密码重置成功</el-row>
        <el-row id="fontstyle1">请妥善保管您的账户信息</el-row>
        <el-button type="primary" plain @click="pushLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
import { resetPassword, sendCode, getRsa } from '@/api/user'
import JsEncrypt from 'jsencrypt'

export default {
  data() {
    var validatorPhone = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    var validatorverifyCode = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (!/^\d{6}$/.test(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }

    var validatorcheckpassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

    return {
      resetNext: false,
      resetSuccess: false,
      show: true,
      count: '', // 初始化次数
      timer: null,
      timer2: null,
      count2: '',
      // 注册表单的数据绑定对象
      registerForm: {
        userId: this.$route.query.id,
        // phone: this.$route.query.phone,
        phone: null,
        verifyCode: '',
        newPassword: '',
        checkpassword: ''
      },
      // 注册表单的验证规则对象
      registerFormRules: {
        phone: [
          { required: true, validator: validatorPhone, trigger: 'blur' }
        ],
        // phone: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' },
        //   { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        // ],
        verifyCode: [
          {required: true, validator: validatorverifyCode, trigger: 'blur'}
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
        // checkpassword: [
        //   {required: true, validator: validatorcheckpassword, trigger: 'blur'}
        // ]
      }
    }
  },
  methods: {
    resetregisterForm() {
      // this为此vue组件
      this.$refs.registerFormRef.resetFields()
    },
    confirmCode() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return
        this.resetNext = true
        // console.log(this.registerForm)
      })
    },
    register() {
      // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return

        // 获取RSA
        this.RSA = await getRsa()
          .then((res) => res.data.data)
          .catch((err) => err)
          // console.log('获取RSA', this.RSA)

        const publicKey = this.RSA
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicKey)
        const originalData = this.registerForm.checkpassword
        const encryptedData = encrypt.encrypt(originalData)
        // console.log('加密后的密码：', encryptedData)
        this.registerForm.newPassword = encryptedData
        const res = await resetPassword({
          userId: this.registerForm.userId,
          phone: this.registerForm.phone,
          verifyCode: this.registerForm.verifyCode,
          newPassword: encryptedData
        })
        // console.log('重置密码接口返回值', res)
        if (res.data.code !== 200) return this.$message.error('重置失败，请稍后再试！')
        this.$message.success('重置密码成功！')
        this.resetSuccess = true
        this.pushLogin()
        // 保存token到浏览器的sessionStorage中
        // window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航跳转页面,3秒后跳转到login页面
        // const TIME_COUNT = 3 //
        // if (!this.timer2) {
        //     this.count2 = TIME_COUNT
        //     this.timer2 = setInterval(() => {
        //         if (this.count2 > 0 && this.count2 <= TIME_COUNT) {
        //             this.count2--
        //         } else {
        //             clearInterval(this.timer2) // 清除定时器
        //             this.timer2 = null
        //             this.$router.push('/login')
        //         }
        //     }, 1000)
        // }
      })
    },
    pushLogin() {
      this.$router.push('/login')
    },
    async getVerify() {
      // 验证手机号
      if (this.checkPhone() === false) {
          return false
      } else {
          const TIME_COUNT = 60 // 更改倒计时时间
          if (!this.timer) {
              this.count = TIME_COUNT
              this.show = false
              this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--
                  } else {
                      this.show = true
                      clearInterval(this.timer) // 清除定时器
                      this.timer = null
                  }
              }, 1000)
          }
        const params = {
          phone: this.registerForm.phone,
          type: 'update'
        }
          const res = await sendCode(params)
          // console.log('发送验证码接口返回值：', res)
          if (res.data.code !== 200) this.$message.error(res.data.message)
          else this.$message.success('发送成功！')
      }
    },
    checkPhone() {
        const phone = this.registerForm.phone
        if (!/^1[3456789]\d{9}$/.test(phone)) {
            this.$message.error('请填写正确的手机号')
            return false
        }
    }

  }
}
</script>

<style lang="less" scoped>

.register_container{
  background-color: rgba(0, 121, 254, 1);
  height: 100%;
}
.register_box{
  width:450px;
  height: 550px;
  background-color: #fff;
  border-radius: 3px;
  // 居中
  position:absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .backbtn{
    position:absolute;
    top:3%;
    left:4%;
    color: #999;
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width:100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.reset{
  text-align:center;
  margin-top:100px;
  height:20px;
  font-weight: 700;
  color: #999;
  font-size: 20px;
}
.register_form{
  position: absolute;
  top:40%;
  bottom: 0;
  width:100%;
  padding: 0 50px;
  // width和height设置的是内容区的宽高
  // 如果没有这句话则盒子实际宽高会在内容区宽高的基础上再加上padding和border
  // 这句话表示在设置宽高时就包含了border和padding，而不仅仅是内容区，这样这个width:100%就是实际的宽度了(与父元素宽度相同)
  box-sizing: border-box;
  .registerbutton{
    width: 100%;
  }
}
.resetsuccess{
  position: absolute;
  top:20%;
  width: 100%;
  text-align:center;
  #boldtext{
    margin-top: 20px;
    font-weight: 700;
    font-size: 24px;
    color: #666;
    line-height: 24px;
  }
  #fontstyle1{
    margin-top: 15px;
    font-weight: 400;
    font-size: 14px;
    color: #999;
    line-height: 22px;
  }
  .el-button{
    margin-top: 20px;
    padding: 15px 30px;
  }
}

.bottom{
  .link{
    margin-left: 10px;
    float:right;
  }
}

.verifyitem{
  .verifyCode{
    width:65%;
    margin-right: 10px;
  .verifybutton{
    width:75px;
  }
}
}
// .btns{
//   display: flex;
//   justify-content: flex-end;
// }
</style>
