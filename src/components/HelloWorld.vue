<template>
  <div class="mobile-page">
    <div v-if="overlay" class="overlay">
      <p>请点击右上角选择在浏览器打开↗</p>
    </div>
    <div class="header">
      <div class="logo">
        <img src="@/assets/群智.png" alt="logo">
      </div>
      <h1 class="title">群智感知平台</h1>
    </div>
    <div class="content">
      <button class="button" @click="downloadApp">下载应用</button>
      <button class="button" @click="openApp">已下载 打开应用</button>
    </div>
    <hr>
    <div class="footer">
      <p>开发者:<a href="https://www.fzu-urbansensing.com/">福州大学人机共融智能课题组</a></p>
    </div>
  </div>
</template>

<script>
// 兼容
var browser = {
  versions: function () {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1,
      /*IE内核*/
      presto: u.indexOf('Presto') > -1,
      /*opera内核*/
      webKit: u.indexOf('AppleWebKit') > -1,
      /*苹果、谷歌内核*/
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
      /*火狐内核*/
      mobile: !!u.match(/AppleWebKit.*Mobile.*/),
      /*是否为移动终端*/
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      /*ios终端*/
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      /*android终端或者uc浏览器*/
      iPhone: u.indexOf('iPhone') > -1,
      /*是否为iPhone或者QQHD浏览器*/
      iPad: u.indexOf('iPad') > -1,
      /*是否iPad*/
      webApp: u.indexOf('Safari') === -1,
      /*是否web应用程序，没有头部与底部*/
      souyue: u.indexOf('souyue') > -1,
      superapp: u.indexOf('superapp') > -1,
      weixin: u.toLowerCase().indexOf('micromessenger') > -1,
      qq: u.match(/\sQQ/i) === " qq" && /iphone/i.test(u.toLowerCase()) === false,
      Safari: u.indexOf('Safari') > -1
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
export default {
  data() {
    return {
      path: '',
      overlay: false
    }
  },
  created() {
    this.checkInWeChat();
    this.checkInQQ()

    this.path = window.location.href.split('?')[1];
    console.log(this.path);
    // fzucrowdsense为APP的scheme，scheme用于打开指定的APP
    if (browser.versions.android) {
      window.location.href = 'fzucrowdsense://' + this.path;
    }
  },
  methods: {
    // 下载app
    downloadApp() {
      if (browser.versions.android) {
        window.location.href = 'https://www.fzu-urbansensing.com/image/crowdplatform/CrowdSense.apk'; //app下载地址
      }
    },
    //打开app
    openApp() {
      if (browser.versions.android) {
        window.location.href = 'fzucrowdsense://' + this.path;
      }
    },
    checkInWeChat() {
      // 检测是否在微信浏览器中
      if (typeof WeixinJSBridge !== 'undefined' || /MicroMessenger/i.test(navigator.userAgent)) {
        this.overlay = true;
      }
    },
    checkInQQ() {
      // 检测是否在 QQ 自带浏览器中
      if (/MQQBrowser/i.test(navigator.userAgent) || /QQ/i.test(navigator.userAgent)) {
        this.overlay = true;
      }
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  color: white;
  font-size: 20px;
}

.mobile-page {
  text-align: center;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
}

.header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 创建圆形效果 */
  overflow: hidden;
  margin: 0 auto 10px; /* 调整图片的位置 */
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.title {
  font-size: 40px;
  font-weight: bold;
  color: #333;
  line-height: 1.5; /* 垂直居中 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer {
  font-size: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  line-height: 1.5; /* 垂直居中 */
}

.button:hover {
  background-color: #0056b3;
}
</style>
