<template>
  <div class="register_container">
    <div class="register_box">
      <div class="avatar_box">
        <img src="../assets/群智.png" alt="">
      </div>
      <!-- 登录表单,ref为此registerForm对象的引用 -->
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form">
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
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="checkpassword">
          <el-input v-model="registerForm.checkpassword" prefix-icon="el-icon-lock" placeholder="请输入确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="registerTest" class="registerbutton">注册</el-button>
        </el-form-item>
        <el-form-item class="bottom">
          <el-link @click="pushLogin" type="primary" :underline="false" class="link">已有账号，立即登录</el-link>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import {getRsa, userRegister, sendCode} from '@/api/user'
import JsEncrypt from 'jsencrypt'
// import qs from 'qs'
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
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

    return {
      RSA: '',
      register: '',
      show: true,
      count: '', // 初始化次数
      timer: null,
      timer2: null,
      count2: '',
      // 注册表单的数据绑定对象
      registerForm: {
        phone: '',
        verifyCode: '',
        password: '',
        checkpassword: '',
        registerstate: false
      },
      // 注册表单的验证规则对象
      registerFormRules: {
        phone: [
          { required: true, validator: validatorPhone, trigger: 'blur' }
        ],
        verifyCode: [
          {required: true, validator: validatorverifyCode, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        checkpassword: [
          {required: true, validator: validatorcheckpassword, trigger: 'blur'}
        ]
      }
    }
  },
  // 获取RSA公钥
  // async mounted() {
  //   this.RSA = await getRsa()
  //     .then((res) => res.data.data)
  //     .catch((err) => err)
  //     console.log('获取RSA', this.RSA)
  //     // 将RSA公钥存储在本地
  //     localStorage.setItem('RSA', this.RSA)
  // },
  methods: {
    resetregisterForm() {
      // this为此vue组件
      this.$refs.registerFormRef.resetFields()
    },
    async registerTest() {
      // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return

        // 获取RSA公钥
        this.RSA = await getRsa()
          .then((res) => res.data.data)
          .catch((err) => err)
          // console.log('获取RSA', this.RSA)
          // 将RSA公钥存储在本地
          // localStorage.setItem('RSA', this.RSA)

        // 从服务器端获取到RSA加密公钥
        const publicKey = this.RSA
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicKey)
        const originalData = this.registerForm.password
        // console.log('加密前的密码：', originalData)
        const encryptedData = encrypt.encrypt(originalData)
        // console.log('加密后的密码：', encryptedData)
        const params = {
          phone: this.registerForm.phone,
          password: encryptedData,
          verifyCode: this.registerForm.verifyCode
        }
        this.registerdata = await userRegister(params)
        // console.log('注册', this.registerdata)
        if (this.registerdata.data.code === 200) {
          this.$message.success('注册成功！ 3秒后将跳转到登录界面！')
          // 编程式导航跳转页面,3秒后跳转到login页面
          const TIME_COUNT = 3
          if (!this.timer2) {
              this.count2 = TIME_COUNT
              this.timer2 = setInterval(() => {
                  if (this.count2 > 0 && this.count2 <= TIME_COUNT) {
                      this.count2--
                  } else {
                      clearInterval(this.timer2) // 清除定时器
                      this.timer2 = null
                      this.$router.push('/login')
                  }
              }, 1000)
          }
        } else if (this.registerdata.data.code === 40000) { this.$message.error(this.registerdata.data.message) }
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
          type: 'register'
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
  height: 500px;
  background-color: #fff;
  border-radius: 3px;
  // 居中
  position:absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);

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

.register_form{
  position: absolute;
  top:100px;
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
