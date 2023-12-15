<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/群智.png" alt="" />
      </div>
      <!-- 登录表单,ref为此loginForm对象的引用 -->
      <!-- 密码登录 -->
      <el-form
        v-if="!isMessage"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            prefix-icon="el-icon-user"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            @keydown.enter.native="passwordLogin"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="passwordLogin" class="loginbutton"
            >登录</el-button
          >
          <!-- <el-button type="info" @click="resetLoginForm">重置</el-button> -->
        </el-form-item>
        <el-form-item class="bottom">
          <el-switch
            v-model="loginForm.loginstate"
            active-text="记住我"
          ></el-switch>
          <!-- <el-link type="primary" :underline="false" class="switch" @click="pushThemeMap">游客登录</el-link> -->
          <el-link
            type="primary"
            :underline="false"
            class="link"
            @click="pushMessageLogin"
            >短信登录</el-link
          >
          <el-link
            type="primary"
            :underline="false"
            class="link"
            @click="pushResetPassword"
            >忘记密码</el-link
          >
          <el-link
            @click="pushRegister"
            type="primary"
            :underline="false"
            class="link"
            >注册新用户</el-link
          >
        </el-form-item>
      </el-form>
      <!-- 短信登录 -->
      <el-form
        v-if="isMessage"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            prefix-icon="el-icon-user"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="verifyCode" class="verifyitem">
          <el-input
            v-model="loginForm.verifyCode"
            prefix-icon="el-icon-message"
            placeholder="请输入验证码"
            class="verifyCode"
            @keydown.enter.native="messageLogin"
          ></el-input>
          <el-button
            type="primary"
            @click="getVerify"
            :disabled="!show"
            style="width: 112px"
          >
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }} s后重发</span>
          </el-button>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="messageLogin" class="loginbutton"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="bottom">
          <el-switch
            v-model="loginForm.loginstate"
            active-text="记住我"
          ></el-switch>
          <el-link
            type="primary"
            :underline="false"
            class="link"
            @click="pushPasswordLogin"
            >密码登录</el-link
          >
          <el-link
            type="primary"
            :underline="false"
            class="link"
            @click="pushResetPassword"
            >忘记密码</el-link
          >
          <el-link
            @click="pushRegister"
            type="primary"
            :underline="false"
            class="link"
            >注册新用户</el-link
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  userLoginByPassword,
  userLoginByCode,
  getRsa,
  getUserInfo,
  sendCode,
} from "@/api/user";
import JsEncrypt from "jsencrypt";
// import qs from 'qs'
// import { BMapGL } from '../map/bmpgl.js'

export default {
  data() {
    var validatorPhone = function (rule, value, callback) {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    var validatorverifyCode = function (rule, value, callback) {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else if (!/^\d{6}$/.test(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    return {
      isMessage: false,
      show: true,
      count: "", // 初始化次数
      RSA: "",
      logindata: "",
      // 存储登录跳转前的路由
      router: localStorage.getItem("router_history"),
      // 登录表单的数据绑定对象
      loginForm: {
        phone: "",
        password: "",
        loginstate: false,
        verifyCode: "",
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        phone: [{ required: true, validator: validatorPhone, trigger: "blur" }],
        verifyCode: [
          { required: true, validator: validatorverifyCode, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getCookie();
    // console.log('-------------------------')
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.path !== "/" &&
      from.path !== "/userInformation" &&
      from.path !== "/resetpassword" &&
      from.path !== "/resetphone"
    ) {
      next((vm) => {
        vm.$message.error("请先登录！");
      });
    } else next();
  },
  methods: {
    // 设置cookie,登录成功之后进行调用 传入账号名，密码，和保存天数3个参数
    setCookie(name, pwd, loginstate, exdays) {
      // console.log('setCookie', this.loginForm.loginstate)
      var exdate = new Date(); // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); // 保存的天数
      // console.log(exdate)
      // 字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + pwd + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "loginstate" +
        "=" +
        loginstate +
        ";path=/;expires=" +
        exdate.toGMTString();
    },
    pushMessageLogin() {
      this.isMessage = true;
    },
    pushPasswordLogin() {
      this.isMessage = false;
    },
    // 读取cookie 将用户名和密码回显到input框中
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === "userName") {
            this.loginForm.phone = arr2[1]; // 保存到保存数据的地方即v-model
          } else if (arr2[0] === "userPwd") {
            this.loginForm.password = arr2[1];
          } else if (arr2[0] === "loginstate") {
            this.loginForm.loginstate = Boolean(arr2[1]);
          }
        }
      }
      // if (window.localStorage.getItem("isLogin") !== "false") {
      //   this.login();
      // }
    },
    resetLoginForm() {
      // this为此vue组件
      this.$refs.loginFormRef.resetFields();
    },
    // 获取短信登录验证码
    async getVerify() {
      // 验证手机号
      if (this.checkPhone() === false) {
        return false;
      } else {
        const TIME_COUNT = 60; // 更改倒计时时间
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer); // 清除定时器
              this.timer = null;
            }
          }, 1000);
        }
        const params = {
          phone: this.loginForm.phone,
          type: "login",
        };
        const res = await sendCode(params);
        // console.log('发送验证码接口返回值：', res)
        if (res.data.code !== 200) this.$message.error(res.data.message);
        else this.$message.success("发送成功！");
      }
    },
    // 登录
    async passwordLogin() {
      // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; // 如果valid为false则不发送请求

        // 获取RSA
        this.RSA = await getRsa()
          .then((res) => res.data.data)
          .catch((err) => err);
        // console.log('获取RSA', this.RSA)

        const publicKey = this.RSA;
        // console.log('RSA--登录', publicKey)
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const originalData = this.loginForm.password;
        // console.log('加密前的密码：', originalData)
        const encryptedData = encrypt.encrypt(originalData);
        // console.log('加密后的密码：', encryptedData)
        // 发送登录请求
        const params = {
          phone: this.loginForm.phone,
          password: encryptedData,
        };
        this.logindata = await userLoginByPassword(params);
        // console.log('登录接口传参', JSON.stringify(params))
        // console.log('密码登录接口成功返回值', this.logindata)
        // console.log('Token', this.logindata.data.data)
        if (this.logindata.data.code === 200) {
          this.$message.success("登录成功");
          localStorage.setItem("Token", this.logindata.data.data.token);
          // 登录成功以后获取用户id并保存
          const user = await getUserInfo();

          localStorage.setItem("UserId", user.data.data.id);
          // 成功以后跳转到默认首页
          // console.log(user)
          if (user.data.data.home != "" && user.data.data.home != "null") {
            this.$router.push(user.data.data.home);
          } else {
            this.$router.push("/ScanTask");
          }
        } else {
          this.$message.error(this.logindata.data.message);
        }
      });

      // console.log('login', this.loginForm.loginstate)
      if (this.loginForm.loginstate === true) {
        this.setCookie(
          this.loginForm.phone,
          this.loginForm.password,
          this.loginForm.loginstate,
          7
        );
      } else {
        this.setCookie("", "", "", 1);
      }
      // console.log('cookie:', window.document.cookie)
      // console.log(this.loginForm.loginstate)
      // window.localStorage.clear()

      // 根据token获取用户id
      // const {data: res1} = await this.$http.get('/user/query/Id')
      // window.localStorage.setItem('id', res1.data)
      // const {data: res2} = await this.$http.post('/user/user', qs.stringify({id: res1.data}))
      // console.log(res2.data)
      // window.localStorage.setItem('id', JSON.stringify(res2))
      // 编程式导航跳转页面
      //   if (res2.data.homePage) this.$router.push({name: res2.data.homePage})
      //   if (res2.data.homePage == null) this.$router.push('/')
      //   else if (res2.data.homePage !== '默认') this.$router.push({name: res2.data.homePage})
      //   else {
      //     if (this.router == null) this.$router.push('/')
      //     else this.$router.push(this.router)
      //   }
      //   else this.$router.push('/scanTask')
      //   获取当前定位
      //   var geolocation = new BMapGL.Geolocation()
      //   console.log(localStorage.getItem('lng'))
      //   if (!localStorage.getItem('lng')) {
      //        geolocation.getCurrentPosition(function(r) {
      //        localStorage.setItem('lng', r.longitude)
      //        localStorage.setItem('lat', r.latitude)
      //        })
      //        console.log(localStorage.getItem('lng'))
      //   }
      // } else this.$message.error(res.status)
      // })
    },
    async messageLogin() {
      // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; // 如果valid为false则不发送请求

        // 发送登录请求
        const params = {
          phone: this.loginForm.phone,
          verifyCode: this.loginForm.verifyCode,
        };
        this.logindata = await userLoginByCode(params);
        // console.log('登录接口传参', JSON.stringify(params))
        // console.log('短信登录接口成功返回值', this.logindata)
        // console.log('Token', this.logindata.data.data)
        if (this.logindata.data.code === 200) {
          this.$message.success("登录成功");
          localStorage.setItem("Token", this.logindata.data.data.token);

          // 登录成功以后获取用户id并保存
          const userId = await getUserInfo();
          localStorage.setItem("UserId", userId.data.data.id);

          // 成功以后跳转到查看任务页
          this.$router.push("/ScanTask");
        } else {
          this.$message.error(this.logindata.data.message);
        }
      });

      // console.log('login', this.loginForm.loginstate)
      if (this.loginForm.loginstate === true) {
        this.setCookie(
          this.loginForm.phone,
          this.loginForm.password,
          this.loginForm.loginstate,
          7
        );
      } else {
        this.setCookie("", "", "", 1);
      }
    },
    pushRegister() {
      this.$router.push("/register");
    },
    pushResetPassword() {
      if (this.loginForm.phone)
        this.$router.push({
          path: "/resetpassword",
          query: { phone: this.loginForm.phone },
        });
      else this.$router.push("/resetpassword");
    },
    checkPhone() {
      const phone = this.loginForm.phone;
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        this.$message.error("请填写正确的手机号");
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgba(0, 121, 254, 1);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 400px;
  background-color: #fff;
  border-radius: 3px;
  // 居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  top: 100px;
  bottom: 0;
  width: 100%;
  padding: 0 50px;
  // width和height设置的是内容区的宽高
  // 如果没有这句话则盒子实际宽高会在内容区宽高的基础上再加上padding和border
  // 这句话表示在设置宽高时就包含了border和padding，而不仅仅是内容区，这样这个width:100%就是实际的宽度了(与父元素宽度相同)
  box-sizing: border-box;
  .loginbutton {
    width: 100%;
  }
}

.bottom {
  .link {
    margin-left: 10px;
    float: right;
  }
}

.verifyitem {
  .verifyCode {
    width: 65%;
    margin-right: 10px;
    // .verifybutton{
    //   width:75px;
  }
}
// .btns{
//   display: flex;
//   justify-content: flex-end;
// }
</style>