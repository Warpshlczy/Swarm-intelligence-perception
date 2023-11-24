<template>
  <div class="register_container">
    <div class="register_box">
      <el-button type="text" class="backbtn" @click="pushLogin">返回</el-button>
      <div class="avatar_box">
        <img src="../assets/群智.png" alt="">
      </div>
      <el-row class="reset" v-if="resetSuccess===false">更换手机号</el-row>
      <!-- 登录表单,ref为此resetPhoneForm对象的引用 -->
      <el-form v-if="resetSuccess===false" ref="resetPhoneFormRef" :model="resetPhoneForm" :rules="resetPhoneFormRules" label-width="0px" class="resetphone_form">
        <!-- 用户名 -->
        <el-form-item prop="oldPhone">
          <el-input v-model="resetPhoneForm.oldPhone" prefix-icon="el-icon-user" placeholder="请输入旧的手机号"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="oldCode" class="verifyitem" >
          <el-input v-model="resetPhoneForm.oldCode" prefix-icon="el-icon-message" placeholder="请输入旧手机验证码" class="verifyCode"></el-input>
          <el-button  type="primary"  @click="getOldVerify" :disabled="!show" style="width:112px;">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s后重发</span>
          </el-button>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item prop="newPhone">
          <el-input v-model="resetPhoneForm.newPhone" prefix-icon="el-icon-user" placeholder="请输入新的手机号"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="newCode" class="verifyitem" >
          <el-input v-model="resetPhoneForm.newCode" prefix-icon="el-icon-message" placeholder="请输入新手机验证码" class="verifyCode"></el-input>
          <el-button  type="primary"  @click="getNewVerify" :disabled="!show" style="width:112px;">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s后重发</span>
          </el-button>
        </el-form-item>
        <!-- 密码 -->
        <!-- <el-form-item prop="password">
          <el-input v-model="resetPhoneForm.password" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </el-form-item> -->
        <!-- 确认密码 -->
        <!-- <el-form-item prop="checkpassword">
          <el-input v-model="resetPhoneForm.checkpassword" prefix-icon="el-icon-lock" placeholder="请输入确认密码" show-password></el-input>
        </el-form-item> -->
        <el-form-item class="btns">
          <el-button type="primary" @click="register" class="registerbutton">下一步</el-button>
        </el-form-item>
      </el-form>
      <!-- 重置密码成功 -->
      <div v-if="resetSuccess===true" class="resetsuccess">
        <img src="../assets/check.png" style="height:90px" alt="">
        <el-row id="boldtext">手机号更换成功</el-row>
        <el-row id="fontstyle1">请妥善保管您的账户信息</el-row>
        <el-button type="primary" plain @click="pushLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPhone, sendCode } from '@/api/user'

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
      } else if (!/^\d{4}$/.test(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }

    var validatorcheckpassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetPhoneForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

    return {
      resetSuccess: false,
      show: true,
      count: '', // 初始化次数
      timer: null,
      timer2: null,
      count2: '',
      // 注册表单的数据绑定对象
      resetPhoneForm: {
        userId: this.$route.query.id,
        newPhone: '',
        oldPhone: '',
        oldCode: '',
        newCode: ''
        // password: '',
        // checkpassword: ''
      },
      // 注册表单的验证规则对象
      resetPhoneFormRules: {
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在8到20个字符之间', trigger: 'blur' }
        ],
        checkpassword: [
          {required: true, validator: validatorcheckpassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    resetresetPhoneForm() {
      // this为此vue组件
      this.$refs.resetPhoneFormRef.resetFields()
    },
    register() {
      // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.resetPhoneFormRef.validate(async (valid) => {
        if (!valid) return

        const res = await resetPhone(this.resetPhoneForm)
        // console.log('重置手机号返回值', res)
        if (res.data.code !== 200) return this.$message.error('更换手机号失败，请稍后再试！')
        this.$message.success('更换手机号成功')
        this.resetSuccess = true
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
    // 验证旧手机号
    async getOldVerify() {
      // 验证手机号
      if (this.checkPhone(this.resetPhoneForm.oldPhone) === false) {
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
          const res = await sendCode({
            phone: this.resetPhoneForm.oldPhone,
            type: 'update'
          })
          // console.log('旧手机号验证码接口返回值：', res)
          if (res.data.code !== 200) this.$message.error(res.data.message)
          else this.$message.success('发送成功！')
      }
    },
    // 验证新手机号
    async getNewVerify() {
      if (this.checkPhone(this.resetPhoneForm.newPhone) === false) {
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
          const res = await sendCode({
            phone: this.resetPhoneForm.newPhone,
            type: 'update'
          })
          // console.log('新手机号验证码接口返回值：', res)
          if (res.data.code !== 200) this.$message.error(res.data.message)
          else this.$message.success('发送成功！')
      }
    },
    checkPhone(phone) {
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
  .backbtn{
    position:absolute;
    top:4%;
    left:3%;
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
.resetphone_form{
  position: absolute;
  top:30%;
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
