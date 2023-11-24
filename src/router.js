import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from './store'
import More from './components/aboutTask/More'
import publishTask from './components/aboutTask/PublishTask.vue'
import ScanTask from './components/aboutTask/ScanTask.vue'
import Task from './components/aboutTask/Task.vue'
import ThemeMap from './components/aboutTask/ThemeMap.vue'
import Home from './components/Home.vue'
import Login from './components/Login'
import Register from './components/Register.vue'
import ResetPassword from './components/ResetPassword.vue'
import ResetPhone from './components/ResetPhone.vue'
import UserCenter from './components/UserCenter.vue'
import Feedback from './components/userCenter/Feedback.vue'
import MessageCenter from './components/userCenter/MessageCenter.vue'
import MyCollection from './components/userCenter/MyCollection.vue'
import MyContribution from './components/userCenter/MyContribution.vue'
import MyPublish from './components/userCenter/MyPublish.vue'
import MySubmission from './components/userCenter/MySubmission.vue'
import TaskProgress from './components/userCenter/TaskProgress.vue'
import UserInformation from './components/userCenter/UserInformation.vue'
import Welcome from './components/Welcome.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// APP.vue的routerview是第一层的出口，只匹配第一级的路由规则
// 同样的，与APP.vue的routerview匹配的第二级的组件中的routerview就会匹配第二级的路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/themeMap',
      meta: { title: '主题地图' }
    },
    {
      path: '/login',
      component: Login,
      name: '登录',
      meta: { title: '登录' }
    },
    {
      path: '/register',
      component: Register,
      name: '注册',
      meta: { title: '注册' }
    },
    {
      path: '/resetpassword',
      component: ResetPassword,
      name: '重置密码',
      meta: { title: '重置密码' }
    },
    {
      path: '/resetphone',
      component: ResetPhone,
      name: '更换手机号',
      meta: { title: '更换手机号' }
    },
    {
      // 访问/home会匹配Home组件去渲染第一层的routerview
      // 重定向继续访问/welcome
      // 访问/welcome会匹配Welcome组件去渲染第二层Home组件的routerview
      path: '/home',
      component: Home,
      meta: { keepAlive: false },
      redirect: '/welcome',
      // 第二级路由规则
      children: [
        {
          path: '/welcome',
          component: Welcome,
          name: '欢迎',
          meta: { title: '欢迎' }
        },
        {
          path: '/themeMap',
          component: ThemeMap,
          name: '主题地图',
          meta: { title: '主题地图' }
        },
        {
          path: '/publishTask',
          component: publishTask,
          name: '发布任务',
          meta: {
            title: '发布任务',
            keepAlive: true // 缓存路由，实现草稿功能
          }
        },
        {
          path: '/scanTask',
          component: ScanTask,
          name: '查看任务',
          meta: { title: '查看任务' }
        },
        {
          path: '/More',
          component: More,
          name: '更多',
          meta: { title: '更多' }
        },
        {
          path: '/TaskProgress',
          component: TaskProgress,
          name: '任务进展',
          meta: { title: '任务进展' }
          // beforeEnter: (to, from, next) => {
          //   from.meta.keepAlive = true
          //   next()
          // }
        },
        {
          path: '/task',
          component: Task,
          name: '任务详情',
          meta: { title: '任务详情' }
          // beforeEnter: (to, from, next) => {
          //   from.meta.keepAlive = true
          //   console.log(from.meta.title)
          //   console.log(from.meta.keepAlive)
          //   next()
          // }
        },
        {
          path: '/helloworld',
          component: HelloWorld,
          name: '下载页',
          meta: {title: '下载页'}
        },
        {
          path: '/userCenter',
          component: UserCenter,
          name: '用户中心',
          meta: { title: '用户中心' },
          redirect: '/userInformation',
          // 第三级路由规则
          children: [
            {
              path: '/userInformation',
              component: UserInformation,
              meta: { title: '基本信息' }
            },
            {
              path: '/messageCenter',
              component: MessageCenter,
              meta: { title: '消息中心' }
            },
            {
              path: '/myPublish',
              component: MyPublish,
              meta: { title: '我的发布' }
            },
            {
              path: '/mySubmission',
              component: MySubmission,
              meta: { title: '我的提交' }
            },
            {
              path: '/myCollection',
              component: MyCollection,
              meta: { title: '我的收藏' }
            },
            {
              path: '/myContribution',
              component: MyContribution,
              meta: { title: '我的贡献' }
            },
            {
              path: '/feedback',
              component: Feedback,
              meta: { title: '反馈意见' }
            }
          ]
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // console.log('scrollBehavior')
    if (savedPosition) { // 如果savedPosition存在，滚动条会自动跳到记录的值的地方
      // console.log(savedPosition)
      return savedPosition
    } else {
      return { top: 100 }// savedPosition也是一个记录x轴和y轴位置的对象
    }
  }
})

// 设置title
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

// 通过路由导航守卫来实现访问控制
// router.beforeEach((to, from, next) => {
//   // to表示将要访问的路径
//   // from表示从哪个路径跳转而来
//   // next表示放行函数，无参数则直接跳转到目标路径，有参数则表示强制跳转参数路径
//   if (to.path === '/themeMap' || to.path === '/login' || to.path === '/register' || to.path === '/home' || to.path === '/resetpassword' || to.path === '/resetphone' || to.path === '/scanTask') return next()
//   // if (from.path === '/login') window.location.reload()
//   const token = localStorage.getItem('token')
//   // if (token) {
//   //   // store.commit('set_token', token)
//   //   next()
//   // }
//   // 要求任务详情不登录也能进行查看
//   if (!token && to.path !== '/Task') {
//   // console.log('router')
//   return next('/login')
//   } else next()
// })
router.afterEach((to, from) => {
  if (from.path === '/login') {
    window.location.reload()
  }
})
router.beforeResolve((to, from, next) => {
  if (to.path === '/Task' || to.path === '/TaskProgress') {
    // from.meta.keepAlive = true
  } else {
    // from.meta.keepAlive = false
  }
  next()
})
export default router
