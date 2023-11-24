<template>
  <div id="app">
    <!-- <router-view  v-if="isRouterAlive"></router-view> -->
    <keep-alive>
    <!-- 缓 存 -->
    <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
  </div>
</template>

<script>
// 每个vue文件都是一个vue组件
// script export 的就是当前的vue组件的一些东西，方法、属性等，会跟<template></template> <style></style>组装成一个vue组件
// 导入Vue组件需要注册后才能使用
export default {
  name: 'app',
  provide() {
    return {
      reload: this.reload
    }
  },
  created() {
  },
  data() {
    return {
      isRouterAlive: true,
      id: window.localStorage.getItem('id')
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    beforeunloadFn (e) {
      // 这个事件只有在鼠标真正和浏览器有了交互，再刷新或者关闭时才会触发, 浏览器事件会弹框确认用户是否要离开页面
      e = e || window.event
      if (e) {
        sessionStorage.setItem('store', this.$store.state)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
