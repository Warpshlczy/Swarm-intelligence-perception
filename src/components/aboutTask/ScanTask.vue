<template>
<div>
  <!-- 搜索框 -->
  <div class="search">
    <el-input placeholder="请输入任务搜索关键字" size="medium"
    v-model="queryInfo.searchText" clearable
    @clear="getTaskList" @keyup.enter.native="getTaskList">
    <el-button slot="append" icon="el-icon-search" type="primary" @click="getTaskList">搜索</el-button>
    </el-input>
  </div>

  <div style="display: flex;">
    <el-card class="TaskListBox" :class=" {TaskListBox_hidden:token,TaskListBox:!token}">
  <!-- <el-card class="TaskListBox"> -->
    <div class="header">
      <!-- 使用不使用tabs待定 -->
      <!-- v-model为选中选项卡的name值 -->
      <el-tabs v-model="activeClassName" @tab-click="handleClassClick">
        <el-tab-pane :label="'全部类型'" :name="''"></el-tab-pane>
        <el-tab-pane v-for="item in typeOptions" :label="item.content" :name="item.value+''" :key="item.value"></el-tab-pane>
      </el-tabs>

      <el-dropdown split-button type="primary" @command="handleRankClick">
      {{rankList[activeRankId].content}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in rankList" :key="item.id" :command="item.id">
            {{item.content}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div v-for="(item, i) in taskList" :key="item.id"
    :class="['bdbottom', i === 0 ? 'bdtop': '', 'taskItem']" @click="jumpToTask(item.id)">
      <!-- 用栅栏布局 -->
      <el-row>
        <el-col :span="6">
          <el-image :src="item.imagesPath[0]" fit="cover" class="taskImg"/>
        </el-col>
        <el-col :span="18">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <span class="boldtext">{{item.title}}</span>
            </el-col>
            <el-col class="endtime">
              <span class="boldtext">结束时间：</span><i class="el-icon-time"></i>&nbsp;{{item.endTime}}
            </el-col>
          </el-row>
          <el-row class="middlerow">
            <!-- <el-tooltip placement="top" :disabled="!tooltipFlag" ref="tlp" :content="item.details"> -->
            <span class="content" @mouseenter="visibilityChange($event)">{{item.details}}</span>
            <!-- </el-tooltip> -->
          </el-row>
          <el-row type="flex" justify="space-between" class="bottomrow">
            <!-- <div class="fuck">
              <el-avatar icon="el-icon-user-solid" :size="30" :src="item.profilePath" style="margin-right:5px"></el-avatar>{{item.nickName}}</div> -->
            <div class="content">
              <span class="boldtext">任务进展</span>
              <el-progress :percentage="(item.currentPassed/item.numberOfSmallTask)*100" :stroke-width="16" :show-text="false" class="progress"></el-progress>
              {{item.currentPassed+'/'+item.numberOfSmallTask}}
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      >
    </el-pagination>
  </el-card>
  <div class="recommend_task" v-if=!token>
      <div class="decommend_title">
        <span>推荐任务</span>
        <a href="#">
          <!-- <span class="change"
          @click="returnRecommendList()">换一批</span> -->
        </a>
      </div>
      <div v-if='recommendListFilter.length!=0'>
        <div class="decommend_detail taskItem"
              v-for="item in recommendListFilter"
              :key="item.item"
              @click="jumpToTask(item.id)"
          >
          <div>
              <div class="content_bottom">
                <span class="content_title">{{ item.title}}</span>
              <!-- <span class="content_user">{{ item.publisherName}}</span> -->
              <!-- <span class="content_time">{{ item.startTime }}</span> -->
              <span>结束时间：</span>
              <span class="content_time">{{ item.endTime.substring(0,13).split('T')[0] }}</span>
              <!-- <span class="content_user">123</span>
              <span class="content_time">123</span> -->
              </div>
              <span class="decommend_content">详情：{{ item.details}}</span>

          </div>
        </div>
      </div>
      <div v-else>
        暂无推荐任务
      </div>
  </div>
  </div>
</div>
  </template>
  <script>
  // import {getRecommend, changeRecommend} from '@/api/task'
  import { getType, getRecommend } from '@/api/task'
  import {returnRecommend, getTaskList} from '@/api/task'
  export default {
    data() {
      return {
        num: 0, // 推荐任务的分页设置
        strlen: 0, // 返回推荐任务数组的长度
        token: localStorage.getItem('Token') == null,
        tooltipFlag: false,
        details: '',
        total: 0,
        pagesize: 10,
        activeClassName: '',
        activeRankId: 0,
        queryInfo: {
          // 当前的页数
          current: 1,
          pageSize: 10,
          rootId: -1,
          searchText: '',
          // sortOrder: -1,
          sortNumber: 0,
          // type: "",
          submitStatus: 0
        },
        recommendInfo: {
          userId: localStorage.getItem('UserId'),
          current: 1,
          pageSize: 5
        },
        imagesPath: [],
        typeOptions: [],
        rankList: [
          {
            id: 0,
            content: '发布时间最近'
          },
          {
            id: 1,
            content: '结束时间最早'
          },
          {
            id: 2,
            content: '结束时间最晚'
          },
          {
            id: 3,
            content: '任务进展最快'
          },
          {
            id: 4,
            content: '所需任务最多'
          }
        ],
        taskList: [],
        recommendList: []
        // recommendPage: 1 // 用户推荐页数
      }
    },
    computed: {
      recommendListFilter: function() {
        return this.recommendList.filter(item => {
          if (item != null) { return item }
        })
      }
    },
    // 初始时加载数据
    created() {
      this.getTaskList()
      this.getTypeOptions()
      this.getRecommend()
      // this.returnRecommendList()
      // this.getRecommendList()
    },
    mounted() {
      // this.returnRecommendList()
      // this.getRecommendList()
      // const token = localStorage.getItem('token')
      // console.log(token)
    },
    activated() {
     this.$route.meta.keepAlive = false
      this.getTaskList()
    },
    methods: {
      async getRecommend() {
        const res = await getRecommend(this.recommendInfo)
        // const res = await getRecommend({
        //   userId: localStorage.getItem('UserId'),
        //   current: 1,
        //   pageSize: 5
        // })
        this.recommendList = res.data.data
        // console.log('recommend', this.recommendList)
      },
      // async getTypeOptions() {
      //   const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
      //   if (res.code !== 200) return this.$message.error('任务类型获取失败！')
      //   this.typeOptions = res.data
      // },
      async getTypeOptions() {
        // const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
        const res = await getType()
        // console.log('type', res)
        // if (res.code !== 200) return this.$message.error('任务类型获取失败！')
        // console.log('获取任务类型', res.data)
        res.data.data.forEach((value) => this.typeOptions.push({content: value, value: value}))
        // console.log(this.typeOptions)
        // this.typeOptions = res.data.data
      },
      // 获取任务列表
      async getTaskList() {
        // 所有小任务接口
        // const {data: res} = await this.$http.get('/taskPublish/searchAll', {params: this.queryInfo})
        // 所有大任务接口
        // const {data: res} = await this.$http.get('/afferentTaskPublish/searchAll', {params: this.queryInfo})
        this.queryInfo.title = this.queryInfo.searchText
        this.queryInfo.details = this.queryInfo.searchText
        // console.log(this.queryInfo)
        const res = await getTaskList(this.queryInfo)
        // if (res.data.code !== 200) return this.$message.error('获取任务列表失败！')
        this.taskList = res.data.data.records
        // console.log('taskList', res)
        for (let i = 0; i < this.taskList.length; i++) {
          let endTimeArr = this.taskList[i].endTime.split('.')
          let endTime = endTimeArr[0].replace('T', ' ')
          this.taskList[i].endTime = endTime
        }
        // for (let i = 0; i < this.taskList.length; i++) {
        //   const {data: res} = await this.$http.get('/afferentTaskPublish/search/id', {params: {id: this.taskList[i].id}})
        //   const data = res.data.taskPublishVo
        //   // console.log(res.data.taskPublishVo)
        //   this.taskList[i].maxPassed = data.length
        //   let passed = 0
        //   for (let i = 0; i < data.length; i++) {
        //     const {data: res} = await this.$http.get('/taskPublish/search/id', {params: {id: data[i].id}})
        //     // console.log(res.data)
        //     if (res.data.currentPassed === res.data.maxPassed) {
        //       passed++
        //     }
        //   }
        //   this.taskList[i].currentPassed = passed
        // }
        // console.log('任务列表')
        // console.log(this.taskList)
        // 分割图片地址
        this.taskList.forEach(task => {
          // if (task.profilePath) task.profilePath = this.$baseURL + task.profilePath
          if (!task.imagesPath) task.imagesPath = [require('../../assets/wutupian.jpg')]
          else {
            if (task.imagesPath.length !== 0) {
              task.imagesPath = task.imagesPath.split(',')
              // 每个图片加上基准地址
              for (var i = 0; i < task.imagesPath.length; i++) {
                task.imagesPath[i] = 'http://101.34.16.47/resource' + task.imagesPath[i]
              }
            } else {
              task.imagesPath = [require('../../assets/wutupian.jpg')]
            }
          }
        })
        this.total = res.data.data.total
        // console.log('total', this.total)
        this.pagesize = res.data.size
      },
      // 页码改变时刷新数据
      handleCurrentChange(newPage) {
        this.queryInfo.current = newPage
        // 再次根据currentPage获取数据
        this.getTaskList()
      },
      handleClassClick() {
        // console.log(this.activeClassName)
        if (this.activeClassName === '0') {
          delete this.queryInfo.type
          // console.log('queryInfo', this.queryInfo)
        } else {
          this.queryInfo.type = this.activeClassName
        }
        this.queryInfo.current = 1
        this.getTaskList()
      },
      handleRankClick(command) {
        // console.log(command)
        this.activeRankId = command
        this.queryInfo.sortNumber = command
        this.getTaskList()
      },
      // 跳转到详情页
      jumpToTask(id) {
        // #regin
        // // 要求不登录也可以查看任务详情页（等后端）
        // this.$http.get('/taskPublish/search/id?id=1').then(response => {
        //   console.log('请求成功', response.data)
        //   // this.$router.push('/publishTask')
        // },
        // error => {
        //   console.log('请求失败', error.response)
        //   if (error.response.status === 401) {
        //     localStorage.setItem('router_history', '/scanTask')
        //     this.$router.replace({
        //     // 跳转到登录页面
        //     path: '/login'
        //     // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //     // query: { redirect: this.$router.currentRoute.fullPath }
        //   })
        //   }
        // }
        //  )
        // #regin
      this.$router.push({path: '/Task', query: {id: id}}) // 通过this.$route.query.id获得id
      },
      // tooltip的可控
      visibilityChange(event) {
        this.tooltipFlag = true
        const ev = event.target
        const evheight = ev.offsetHeight // 文本的实际高度
        const contentheight = 49
        // this.$refs.tlp.$el.parentNode.clientHeight // 文本容器高度
        if (contentheight < evheight) {
          // 实际内容高度 > 文本高度 =》内容溢出
          this.tooltipFlag = true // NameIsIncludeWord ? true : !!false
        } else {
          // 否则为不溢出
          this.tooltipFlag = false
        }
      }
      // #region
       // 换一换!!!
      //  async ChangeTask() {
      //   // const {data: res} = await this.$http.get('/user/recommend/new', {params: this.queryId})
      //   // // const {data: res} = await this.$http.get('/taskPublish/search', {params: this.queryTest})
      //   // console.log('123')
      //   // if (res.code !== 200) return this.$message.error('获取推荐任务列表失败！')
      //   // this.recommendList = res.data.records
      //   // console.log('推荐任务列表')
      //   // console.log(this.recommendList)
      //   // // 分割图片地址
      //   // this.recommendList.forEach((task) => {
      //   //   if (task.profilePath) { task.profilePath = this.$baseURL + task.profilePath }
      //   //   task.startTime = task.startTime.slice(0, 10)
      //   // })
      //   this.recommendPage = (this.recommendPage + 1) % 3
      //   const params = {
      //     id: 58,
      //     time: this.recommendPage
      //   }
      //   // test
      //   changeRecommend(params).then((res) => {
      //     console.log('换一换', res)
      //     this.recommendList = res.data.data
      //     // console.log('res.data.data')
      //     // console.log(res.data.data)
      //     // console.log(res)
      //   }).catch((err) => {
      //     this.$message.error('获取推荐任务列表失败！')
      //     console.log(err)
      //   })
      //   },
        // 获取推荐列表
      //   async getRecommendList() {
      //   //   // , {params: this.queryId}
      //   //  const {data: res} = await this.$http.get('/user/recommend/create/id=58')
      //   // // const {data: res} = await this.$http.get('/taskPublish/search', {params: this.queryInfo})
      //   // if (res.code !== 200) return this.$message.error('获取推荐任务列表失败！')
      //   // this.recommendList = res.data.records
      //   // console.log(this.recommendList)
      //   // console.log('推荐任务列表')
      //   // console.log(this.recommendList)
      //   const params = {
      //     // id: window.localStorage.getItem('id')
      //     id: 58
      //   }
      //   getRecommend(params).then((res) => {
      //     console.log('获取推荐列表', res)
      //     this.recommendList = res.data.data
      //   }).catch((err) => {
      //     this.$message.error('请登录后获取推荐列表！')
      //     // this.$message.error('获取推荐任务列表失败！')
      //     console.log(err)
      //   })
      // },
      // #region
      // 获取推荐列表(换一换与获取推荐接口合二为一)
      //  async returnRecommendList() {
      //   const params = {
      //     id: localStorage.getItem('id')
      //   }
      //   // this.recommendList = await returnRecommend(params)
      //   returnRecommend(params).then((res) => {
      //     // console.log('根据id创建任务推荐并返回', res)
      //     if (res.data.data != null) { this.recommendList = res.data.data.taskPublishes } else this.recommendList = []
      //     this.strlen = this.recommendList.length
      //     this.recommendList = this.recommendList.slice(this.num * 5, this.num * 5 + 5)
      //     this.num = (this.num + 1) % Math.ceil(this.strlen / 5)
      //     // console.log('num', this.num)
      //   }).catch((err) => {
      //     // this.$message.error('获取推荐任务列表失败！请登录或尝试刷新页面!')
      //     console.log(err)
      //   })
      //   }
  }
  }
  </script>
  <style lang="less" scoped>
  .search{
    width: 40%;
    position:relative;
    left:50%;
    transform: translate(-50%,);
    /deep/ .el-input__inner {
      height: 50px;
    }
  }
  .TaskListBox_hidden{
    left:13%!important;
  }
  .TaskListBox{
    margin: 0 0;
    // transition-left: 50%;
    width:80%;
    min-height:700px;
    padding:0px 0px;
    position:relative;
    top:30px;
    left:0%;
    font-weight: lighter;
    color:#999999;
    .header{
      display: flex;
      justify-content: space-between;
    }
    .taskItem{
      padding:2% 2%;
      &:hover{
        cursor: pointer;
        background-color: rgba(242, 242, 242, 1);
      }
    }
    .taskImg{
      width:90%;
      height: 160px;
      display: inline-block;
    }
    .endtime{
      text-align: right;
      margin-right: 1%;
    }
    .middlerow{
      position: absolute;
      top: 30%;
      width: 75%;  /*限制宽度*/
      display: inline-block;
      display: -webkit-box;
      -webkit-line-clamp: 2; // 因为通过高度所以只显示一行，溢出显示省略号
      -webkit-box-orient: vertical;
      word-break: break-all;//英文数字折行
      // white-space: nowrap;  /*强制span不换行*/
        // display: inline-block;  /*将span当做块级元素对待*/
      overflow: hidden;  /*超出宽度部分隐藏*/
      text-overflow: ellipsis;  /*超出部分以点号代替*/
      .content{
      // display: -webkit-box;
      // -webkit-line-clamp: 2; //多行在这里修改数字即可
      // -webkit-box-orient: vertical;
      line-height: 30px;
      }
    }
    .bottomrow{
      position: absolute;
      width: 75%;
      top: 80%;
      line-height: 40px;
      .fuck{
        display: flex;
        align-items: center;
      }
      .content{
        display:flex;
        align-items: center;
        margin-right: 1%;
      }
      .progress{
        display: inline-block;
        width: 250px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
  .recommend_task {
       // positon改成固定的了 我也不知道为什么一打开找不到推荐任务了
    position:relative;
    // float: left;
    z-index: 1;
    top:30px;
    left:1%;
    // display: inline-block;
    padding: 0 1%;
    width: 17%;
    border-radius: 4px;
    background-color: #fff;
    // .taskItem{

    // }
    .decommend_title a {
      padding-top: 30px;
      margin-right: 15px;
      margin-left: 20px;
      display: inline-block;
      text-decoration: none;
      color: gray;
    }
    .decommend_title {
      display: inline-block;
      width: 240px;
      height: 30px;
      margin-bottom: 5px;
    }
    .decommend_title span {
      line-height: 30px;
      font-size: 15px;
      font-weight: 800;
      color: #666666;
    }
    .decommend_title .change {
      display: inline-block;
      height: 30px;
      background-image: url(../../assets/change_front.png);
      background-size: 15px 15px;
      background-repeat: no-repeat;
      background-position: 80px center;
      text-indent: 100px;
    }
    /* 换一批点击变换 */
    .decommend_title .change:hover {
      color: #0388fa;
      background-image: url(../../assets/change_last.png);
    }
    .decommend_detail {
      float: right;
      width: 100%;
      height: 130px;
      margin-top: 10px;
      // background-color: #000;
      padding:0% 0%;
      position:relative;
      right: 0%;
      &:hover{
        cursor: pointer;
        background-color: rgba(242, 242, 242, 1);
      }
    }
    .content_title {
      display: block;
      width: 240px;
      height: 30px;
      font-weight: 700;
      font-size: 15px;
      color: #666666;
    }
    .decommend_detail .decommend_content {
      display: block;
      height: 60px;
      width: 100%;
      padding-top: 30px;
      color: gray;
      font-size: 14px;
      border-bottom: 1px solid #e2e0e0;
    }
    .content_bottom {
      width: 240px;
      height: 36px;
      // border-top: 1px solid #666666;
    }
    .content_bottom span {
      display: inline-block;
      height: 30px;
      background-repeat: no-repeat;
      background-position: left center;
      color: gray;
      font-size: 13px;
      line-height: 30px;
    }
    .content_bottom .content_user {
      background-image: url(../../assets/user.png);
      background-size: 20px 20px;
      text-indent: 28px;
      margin-right: 5px;
      // width: 68px;
      width: 48%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align:top;
    }
    .content_bottom .content_time {
      background-image: url(../../assets/clock.png);
      background-size: 20px 20px;
      text-indent: 28px;
    }
  }
  </style>