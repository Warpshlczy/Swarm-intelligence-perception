<template>
  <!-- 需要v-if来绑定才能显示taskData.***数据！不懂为啥！ -->
  <div class="taskProgressBox" v-if="status === true">
    <!-- 返回键页头 -->
    <el-page-header @back="goBack" content=""></el-page-header>
    <el-card>
      <!-- 任务名称 -->
      <el-row class="divide">
        <!-- 数据用组件中传值？路由传值 要传task.id到这个组件。然后再请求任务名称和任务进展。还是从后端在请求数据？ -->
        <div>
          <span id="boldtext">任务名称：</span>
          <span id="boldtext">{{ taskData.title }}</span>
        </div>
      </el-row>
      <!-- 任务进展 -->
      <el-row class="divide">
        <div class="taskpro">
          <span id="boldtext">大任务进展：</span>
          <el-progress :percentage="(taskData.currentPassed / taskData.numberOfSmallTask) * 100" :stroke-width="16"
            :show-text="false" class="progress"></el-progress>
          {{ taskData.currentPassed + '/' + taskData.numberOfSmallTask }}
        </div>
      </el-row>
      <el-collapse @change="handleChange" v-model="activeNames" accordion>
        <!-- 提交列表 -->
        <el-collapse-item name="0" v-if="checkList" v-loading="isloading">
          <template slot="title">
            <span id="boldtext">待审核列表</span>
          </template>
          <div v-for="item in checkList" :key="item.id">
            <el-card class="box-card">
              <!-- 卡片头 -->
              <div class="taskpro">
                <span id="boldtext">该提交所属小任务进展：</span>
                <el-progress :percentage="(item.currentPercentage / item.maxPassed) * 100" :stroke-width="16"
                  :show-text="false" class="progress"></el-progress>
                {{ item.currentPassed + '/' + item.maxPassed }}
              </div>
              <div slot="header" class="clearfix">
                <span id="boldtext">提交者：{{ item.submitNickName }}</span>
                <span id="highlight">new!</span>
                <ul style="float: right; margin: 5px 0">
                  <li style="color:#d9001b">
                    <span id="fontstyle1">{{ item.submitTime }}</span>
                  </li>
                </ul>
              </div>
              <!-- 卡片内容 -->
              <el-row>
                <!-- 左侧内容 -->
                <el-col :span="18">
                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(0) === '1'">
                    <span>提交描述：</span>
                    <span>{{ item.description }}</span>
                  </el-row>
                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(1) === '1'">
                    <span>
                      数值：{{ item.number }}</span>
                  </el-row>
                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(2) === '1'">
                    <span>提交的图片：</span>
                    <div>
                      <el-image class="taskImg" fit="cover" v-for="item1 in item.filesPath" :key="item1" :src="item1"
                        :preview-src-list="item.filesPath">
                      </el-image>
                    </div>
                  </el-row>
                  <el-row style="margin-top:20px" v-if="taskData.submitLimit.charAt(3) === '1'">
                    <span>地点：</span>
                    <div>
                      <iframe ref="iframe" name="selectAdress" src="static/提交地址.html" frameborder="0" scrolling="no"
                        class="taskAdress"></iframe>
                    </div>
                  </el-row>
                </el-col>
                <!-- 右侧操作 -->
                <el-col :span="6" style="margin-top:20px;padding-left: 100px;">
                  <!-- 编辑按钮 -->
                  <el-button type="primary" @click="AcorRe(item.submitId, 1)">接受</el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger"  @click="AcorRe(item.submitId, 2)">拒绝</el-button>
                  
                 

                </el-col>
              </el-row>
            </el-card>
          </div>
          <el-pagination v-if="notacTotal > pageSize" background layout="total,prev, pager, next" :current-page="checkCurrentPage" @current-change="handleCheckCurrentChange" 
            :total="notacTotal" :page-size="pageSize">
          </el-pagination>
        </el-collapse-item>
        <!-- 已接受列表 -->
        <el-collapse-item name="1" v-if="acceptList" v-loading="isloading">
          <template slot="title">
            <div class="title">
              <span id="boldtext">已接受列表</span>
            </div>
          </template>
          <div v-for="item in acceptList" :key="item.id">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span id="boldtext">提交者：{{ item.submitterName }}</span>
                <ul style="float: right; margin: 5px 0">
                  <li style="color:#d9001b">
                    <span id="fontstyle1">{{ item.submitTime }}</span>
                  </li>
                </ul>
              </div>
              <el-row>
                <el-col :span="18">
                  <el-row>
                    <span id="boldtext">该提交所属小任务进展：</span>
                    <el-progress :percentage="(item.currentPercentage / item.maxPassed) * 100" :stroke-width="16"
                      :show-text="false" class="progress"></el-progress>
                    {{ item.currentPassed + '/' + item.maxPassed }}
                  </el-row>

                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(0) === '1'">
                    <span>提交描述：</span>
                    <span>{{ item.description }}</span>
                  </el-row>
                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(1) === '1'">
                    <span>
                      数值：{{ item.number }}</span>
                  </el-row>
                  <el-row style="margin-top:20px" v-show="taskData.submitLimit.charAt(2) === '1'">
                    <span>提交的图片:</span>
                    <div>
                      <el-image class="taskImg" fit="cover" v-for="item1 in item.filesPath" :key="item1" :src="item1"
                        :preview-src-list="item.filesPath">
                      </el-image>
                    </div>
                  </el-row>
                  <el-row style="margin-top:20px" v-if="taskData.submitLimit.charAt(3) === '1'">
                    <span>地点：</span>
                    <div>
                      <iframe ref="iframe1" name="selectAdress" src="static/提交地址.html" frameborder="0" scrolling="no"
                        class="taskAdress"></iframe>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </div>
          <el-pagination v-if="acTotal > pageSize" background layout="total,prev, pager, next" :current-page.sync="acceptCurrentPage" @current-change="handleAcceptCurrentChange" 
            :total="acTotal" :page-size="pageSize">
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </el-card>

     
    <!-- <el-dialog title="拒绝原因" :visible.sync="dialogFormVisible" width="50%" @close="submitDialogClosed" top="5vh">

          <el-input type="textarea"  maxlength="200" show-word-limit rows="5" placeholder="请输入数据的文字描述" :disabled="flower"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        
        <el-button type="primary"  @click="submitData">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getTaskDetail, getTaskSchedule, getTaskSubmitList, getSmallTask } from '@/api/task'
import { checkSubmit} from '@/api/submit'

export default {
  data() {
    return {
      
      show: true,
      isloading: true,
      taskSchedule: [],
      submitLen: 0,
      status: false,
      dialogFormVisible: false,
      imgUrl: '', // 图片
      // showViewer: true, // 显示查看器
      activeNames: [],
      submitList: [],
      acceptList: [],
      checkList: [],
      newAcceptArr: [],
      newCheckArr: [],
      // acceptList: [],
      total: 0,
      acTotal: 0,
      notacTotal: 0,
      pageSize: 5,
      checkKey: 1,
      acceptKey: 1,
      checkCurrentPage: 1,
      acceptCurrentPage: 1,
      //拒绝原因
      dialogFormVisible:false,

      queryInfo: {
        // 当前的页数
        task_publish_id: '',
        type: 0 // 要查询的类别：0：审核中的提交（提交列表）1：已接受
      },
      viewsubDialogVisible: false,
      viewDialogVisible: false
    }
  },
  created() {
    this.getTask()
    this.getList()
    this.getSchedule()
    this.getUnPublishList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/messageCenter') {
        vm.activeNames = to.query.name
        vm.handleChange()
        vm.getTask()
      }
    })
  },
  mounted() {
    this.activeNames = []
    window.addEventListener('message', this.handleMessage)
  },
  updated() {
  },
  methods: {
    // 获取任务详细信息
    async getTask() {
      // console.log('id', this.$route.query.id)
      const res = await getTaskDetail({
        id: this.$route.query.id
      })
      // console.log('根据id获取详细任务返回值', res)
      if (res.data.code !== 200) {
        // console.log(this.$route.query.id, res.code)
        return this.$message.error('获取任务详情失败！')
      }
      this.taskData = res.data.data
      this.submitLimit = this.taskData.submitLimit
      // console.log(this.taskData.id, this.taskData)
      this.status = true
    },
    // 获取列表数据
    async getList() {
      this.acceptList = []
      this.checkList = []
      let acceptList = []
      let checkList = []
      this.acTotal = 0
      this.notacTotal = 0
      // this.queryInfo.task_publish_id = this.$route.query.id
      // const {data: res} = await this.$http.get('/taskSubmit/SubmitListByTaskID', {params: this.queryInfo})
      // if (res.code !== 200) return this.$message.error('获取任务详情失败！')
      // this.submitList = res.data.records
      // console.log('提交列表', this.submitList)
      // this.submitLen = res.data.total
      // this.$refs.iframe.resetFields()
      // const small = await getSmallTask({ bigTaskId: parseInt(this.$route.query.id) })
      // console.log('small', small.data.data.childTask)
      // const smallTask = small.data.data.childTask
      // for (let i = 0; i < smallTask.length; i++) {
        const res1 = await getTaskSubmitList({
          'current': this.acceptCurrentPage ,
          'pageSize': this.pageSize,
          'taskId': parseInt(this.$route.query.id),
          'status': 1 //已通过
        })
        acceptList = res1.data.data.lists
        this.acTotal = res1.data.data.total
        console.log(res1)
        const res2 = await getTaskSubmitList({
          'current': this.checkCurrentPage ,
          'pageSize': this.pageSize,
          'taskId': parseInt(this.$route.query.id),
          'status': 0 //已通过
        })
        checkList = res2.data.data.lists
        this.notacTotal = res2.data.data.total
        // res1.data.data.forEach(item => {
        //   if (smallTask[i].currentPassed >= smallTask[i].maxPassed) item.currentPercentage = smallTask[i].maxPassed
        //   else item.currentPercentage = smallTask[i].currentPassed
        //   item.currentPassed = smallTask[i].currentPassed
        //   item.maxPassed = smallTask[i].maxPassed
        //   // console.log(item.currentPassed, item.maxPassed, item.currentPercentage)
        // })
        // this.acceptList = this.acceptList.concat(res1.data.data)
        // this.acTotal += res1.data.data.length
        // console.log('acceptList', res1.data.data)
        // console.log('acceptList', this.acceptList.length)
        // const res2 = await getTaskSubmitList({
        //   'current': 1,
        //   'pageSize': 20,
        //   'taskId': smallTask[i].id,
        //   'status': 0 //未审核
        // })
        // res2.data.data.forEach(task => {
        //   if (smallTask[i].currentPassed >= smallTask[i].maxPassed) task.currentPercentage = smallTask[i].maxPassed
        //   else task.currentPercentage = smallTask[i].currentPassed
        //   task.currentPassed = smallTask[i].currentPassed
        //   task.maxPassed = smallTask[i].maxPassed
        //   // console.log(task.currentPassed, task.maxPassed, task.currentPercentage)
        // })
        // this.checkList = this.checkList.concat(res2.data.data)
        // this.notacTotal += res2.data.data.length
        // console.log('checkList', this.checkList)

      // }
      // console.log('acceptList', acceptList)
      // console.log('checkList', checkList)
      // this.newAcceptArr = [];
      // // console.log(Math.ceil(this.acceptList.length / this.pageSize))
      // for (var x = 0; x < Math.ceil(this.acceptList.length / this.pageSize); x++) {
      //   var start = x * this.pageSize;
      //   var end = start + this.pageSize;
      //   this.newAcceptArr.push(this.acceptList.slice(start, end));
      //   // console.log('newAcceptArr', this.newAcceptArr)
      // }
      // this.acceptList = this.newAcceptArr[this.acceptCurrentPage - 1]
      // this.newCheckArr = [];
      // for (var x = 0; x < Math.ceil(this.checkList.length / this.pageSize); x++) {
      //   var start = x * this.pageSize;
      //   var end = start + this.pageSize;
      //   this.newCheckArr.push(this.checkList.slice(start, end));
      // }
      // this.checkList = this.newCheckArr[this.checkCurrentPage - 1]
      // console.log('acceptList', this.acceptList)
      // console.log('checkList', this.checkList)
      // console.log('acTotal', this.acTotal)
      // console.log('notacTotal', this.notacTotal)
      // 分割图片地址
      // console.log(this.activeNames)
      // if (this.activeNames === '0') {
      //   refnum = this.submitLen
      // }
      // console.log(refnum)
      if (acceptList) {
        acceptList.forEach(task => {
          // console.log('files1', task.filePath)
          task.filesPath = []
          // console.log('filePath', typeof(task.filePath), task.filePath, typeof(task.filePath) != 'object')
          // console.log()
          if (typeof (task.filePath) != 'object') {
            task.filePath = task.filePath.split(',')
            // task.filePath = task.filePath.slice(0, task.filePath.length - 1)
            // 每个图片加上基准地址
            for (var i = 0; i < task.filePath.length; i++) {
              task.filesPath[i] = ('http://101.34.16.47/resource' + task.filePath[i])
              // console.log('filesPath', typeof(task.filesPath), task.filesPath)
            }
          } else {
            task.filesPath = [require('../../assets/wutupian.jpg')]
          }
        })
      }
      this.acceptList = acceptList
      console.log(this.acceptList)
      if (this.acceptList) {
        var refnum1 = 0
        // console.log('acceptList', this.acceptList)
        this.acceptList.forEach(task => {
          // if (this.$refs.iframe) {
          // console.log(this.$refs)
          // 将回调函数中的操作放到下一次DOM更新之后执行
          // 这一块代码也是写的好恶心，是我太菜了能实现就好
          this.$nextTick(() => {
            // if (this.activeNames === '0') {
            //   // console.log(refnum)
            //   if (this.$refs.iframe) {
            //     const mapFrame = this.$refs.iframe[refnum]
            //     // console.log(mapFrame)
            //     mapFrame.contentWindow.location.reload()
            //     if (mapFrame.attachEvent) { // 兼容浏览器判断
            //       mapFrame.attachEvent('onload', function () {
            //         const iframeWin = mapFrame.contentWindow
            //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
            //       })
            //     } else {
            //       mapFrame.onload = () => {
            //         const iframeWin = mapFrame.contentWindow
            //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
            //       }
            //     }
            //   }
            // } else {
            if (this.$refs.iframe1) {
              const mapFrame = this.$refs.iframe1[refnum1]
              // console.log(mapFrame)
              mapFrame.contentWindow.location.reload()
              if (mapFrame.attachEvent) { // 兼容浏览器判断
                // console.log('mapFrame.attachEvent', )
                mapFrame.attachEvent('onload', function () {
                  const iframeWin = mapFrame.contentWindow
                  iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
                })
              } else {
                mapFrame.onload = () => {
                  const iframeWin = mapFrame.contentWindow
                  iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
                }
              }
            }
            // }
            refnum1 = refnum1 + 1
          })
        })
      }
      if (checkList) {
        checkList.forEach(task => {
          // console.log('files1', task.filePath)
          task.filesPath = []
          // console.log('filePath', typeof(task.filePath), task.filePath, typeof(task.filePath) != 'object')
          // console.log()
          if (typeof (task.filePath) != 'object') {
            task.filePath = task.filePath.split(',')
            // task.filePath = task.filePath.slice(0, task.filePath.length - 1)
            // 每个图片加上基准地址
            for (var i = 0; i < task.filePath.length; i++) {
              task.filesPath[i] = ('http://101.34.16.47/resource' + task.filePath[i])
              // console.log('filesPath', typeof(task.filesPath), task.filesPath)
            }
          } else {
            task.filesPath = [require('../../assets/wutupian.jpg')]
          }
        })
      }
      this.checkList = checkList
      console.log(this.checkList)
      if (this.checkList) {
        var refnum = 0
        this.checkList.forEach(task => {
          // if (this.$refs.iframe) {
          // console.log(this.$refs)
          // 将回调函数中的操作放到下一次DOM更新之后执行
          // 这一块代码也是写的好恶心，是我太菜了能实现就好
          this.$nextTick(() => {
          // if (this.activeNames === '0') {
          console.log(refnum)
          console.log('mapFrame', this.$refs.iframe)
          if (this.$refs.iframe) {
            const mapFrame = this.$refs.iframe[refnum]
            console.log('mapFrame', mapFrame)
            mapFrame.contentWindow.location.reload()
            if (mapFrame.attachEvent) { // 兼容浏览器判断
              mapFrame.attachEvent('onload', function () {
                const iframeWin = mapFrame.contentWindow
                iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
              })
            } else {
              mapFrame.onload = () => {
                const iframeWin = mapFrame.contentWindow
                iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
              }
            }
          }
          // } else {
          //   if (this.$refs.iframe1) {
          //     const mapFrame = this.$refs.iframe1[refnum]
          //     // console.log(mapFrame)
          //     mapFrame.contentWindow.location.reload()
          //     if (mapFrame.attachEvent) { // 兼容浏览器判断
          //       mapFrame.attachEvent('onload', function () {
          //         const iframeWin = mapFrame.contentWindow
          //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
          //       })
          //     } else {
          //       mapFrame.onload = () => {
          //         const iframeWin = mapFrame.contentWindow
          //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
          //       }
          //     }
          //   }
          // }
          refnum = refnum + 1
        })
      })
      }
      // })
      // this.total = res.data.total
      // console.log('conplete')
      this.isloading = false
      // this.pagesize = 5
      this.getTask()
    },
    // 获取任务进展
    async getSchedule() {
      const res = await getTaskSchedule({
        id: this.$route.query.id
      })
      // console.log('获取任务完成情况返回值', res)
      if (res.data.code !== 200) {
        return this.$message.error('获取任务进度失败！')
      }
      this.taskSchedule = res.data.data
    },
    // 获取未审核提交列表
    async getUnPublishList() {
      const res = await getTaskSubmitList({
        'current': 1,
        'pageSize': 5,
        'taskId': this.$route.query.id,
        'status': 0
      })
      // console.log('获取未审核提交列表返回值', res)
      if (res.data.code !== 200) {
        return this.$message.error('获取任务提交情况失败！')
      }
      this.submitList = res.data.data
    },
    // 折叠面板
    async handleChange() {
      // this.queryInfo.type = Number(this.activeNames)
      // // this.acceptList = []
      // // this.checkList = []
      // // this.acTotal = 0
      // // this.notacTotal = 0
      // // this.getList()
      // if (this.acceptList) {
      //   var refnum1 = 0
      //   // console.log('acceptList', this.acceptList)
      //   this.acceptList.forEach(task => {
      //     // console.log('files1', task.filePath)
      //     task.filesPath = []
      //     // console.log('filePath', typeof(task.filePath), task.filePath, typeof(task.filePath) != 'object')
      //     // console.log()
      //     if (typeof (task.filePath) != 'object') {
      //       task.filePath = task.filePath.split(',')
      //       // task.filePath = task.filePath.slice(0, task.filePath.length - 1)
      //       // 每个图片加上基准地址
      //       for (var i = 0; i < task.filePath.length; i++) {
      //         task.filesPath[i] = ('http://101.34.16.47/resource' + task.filePath[i])
      //         // console.log('filesPath', typeof(task.filesPath), task.filesPath)
      //       }
      //     } else {
      //       task.filePath = [require('../../assets/wutupian.jpg')]
      //     }
      //     // if (this.$refs.iframe) {
      //     // console.log(this.$refs)
      //     // 将回调函数中的操作放到下一次DOM更新之后执行
      //     // 这一块代码也是写的好恶心，是我太菜了能实现就好
      //     this.$nextTick(() => {
      //       // if (this.activeNames === '0') {
      //       //   // console.log(refnum)
      //       //   if (this.$refs.iframe) {
      //       //     const mapFrame = this.$refs.iframe[refnum]
      //       //     // console.log(mapFrame)
      //       //     mapFrame.contentWindow.location.reload()
      //       //     if (mapFrame.attachEvent) { // 兼容浏览器判断
      //       //       mapFrame.attachEvent('onload', function () {
      //       //         const iframeWin = mapFrame.contentWindow
      //       //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
      //       //       })
      //       //     } else {
      //       //       mapFrame.onload = () => {
      //       //         const iframeWin = mapFrame.contentWindow
      //       //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
      //       //       }
      //       //     }
      //       //   }
      //       // } else {
      //       if (this.$refs.iframe1) {
      //         const mapFrame = this.$refs.iframe1[refnum1]
      //         // console.log(mapFrame)
      //         mapFrame.contentWindow.location.reload()
      //         if (mapFrame.attachEvent) { // 兼容浏览器判断
      //           // console.log('mapFrame.attachEvent', )
      //           mapFrame.attachEvent('onload', function () {
      //             const iframeWin = mapFrame.contentWindow
      //             iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
      //           })
      //         } else {
      //           mapFrame.onload = () => {
      //             const iframeWin = mapFrame.contentWindow
      //             iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
      //           }
      //         }
      //       }
      //       // }
      //       refnum1 = refnum1 + 1
      //     })
      //   })
      // }
      // if (this.checkList) {
      //   var refnum = 0
      //   this.checkList.forEach(task => {
      //     // console.log(task)
      //     task.filesPath = []
      //     // console.log('filePath', typeof(task.filePath), task.filePath, typeof(task.filePath) != 'object')
      //     // console.log()
      //     if (typeof (task.filePath) != 'object') {
      //       task.filePath = task.filePath.split(',')
      //       // task.filePath = task.filePath.slice(0, task.filePath.length - 1)
      //       // 每个图片加上基准地址
      //       for (var i = 0; i < task.filePath.length; i++) {
      //         task.filesPath[i] = ('http://101.34.16.47/resource' + task.filePath[i])
      //         // console.log('filesPath', typeof(task.filesPath), task.filesPath)
      //       }
      //     } else {
      //       task.filePath = [require('../../assets/wutupian.jpg')]
      //     }
      //     // if (this.$refs.iframe) {
      //     // console.log(this.$refs)
      //     // 将回调函数中的操作放到下一次DOM更新之后执行
      //     // 这一块代码也是写的好恶心，是我太菜了能实现就好
      //     // this.$nextTick(() => {
      //     // if (this.activeNames === '0') {
      //     // console.log(refnum)
      //     if (this.$refs.iframe) {
      //       const mapFrame = this.$refs.iframe[refnum]
      //       // console.log('mapFrame', mapFrame)
      //       mapFrame.contentWindow.location.reload()
      //       if (mapFrame.attachEvent) { // 兼容浏览器判断
      //         mapFrame.attachEvent('onload', function () {
      //           const iframeWin = mapFrame.contentWindow
      //           iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
      //         })
      //       } else {
      //         mapFrame.onload = () => {
      //           const iframeWin = mapFrame.contentWindow
      //           iframeWin.postMessage({ latitude: task.submitLatitude, longitude: task.submitLongitude }, '*')
      //         }
      //       }
      //     }
      //     // } else {
      //     //   if (this.$refs.iframe1) {
      //     //     const mapFrame = this.$refs.iframe1[refnum]
      //     //     // console.log(mapFrame)
      //     //     mapFrame.contentWindow.location.reload()
      //     //     if (mapFrame.attachEvent) { // 兼容浏览器判断
      //     //       mapFrame.attachEvent('onload', function () {
      //     //         const iframeWin = mapFrame.contentWindow
      //     //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
      //     //       })
      //     //     } else {
      //     //       mapFrame.onload = () => {
      //     //         const iframeWin = mapFrame.contentWindow
      //     //         iframeWin.postMessage({ latitude: task.latitude, longitude: task.longitude }, '*')
      //     //       }
      //     //     }
      //     //   }
      //     // }
      //     refnum = refnum + 1
      //   })
      // }
    },
    // 页码改变时刷新数据
    handleCheckCurrentChange(newPage) {
      this.checkCurrentPage = newPage
      this.checkKey = newPage
      // 再次根据currentPage获取数据
      // this.getTask()
      this.isloading = true
      this.getList()
    },
    // 页码改变时刷新数据
    handleAcceptCurrentChange(newPage) {
      this.acceptCurrentPage = newPage
      this.acceptKey = newPage
      // this.show = false;//让分页隐藏
      // console.log('page', this.acceptCurrentPage, this.checkCurrentPage)
      // 再次根据currentPage获取数据
      // this.getTask()
      this.isloading = true
      this.getList()
      // this.acceptList = 
      // this.$nextTick(() => {//重新渲染分页
      //   this.show = true;
      // });
    },
    async AcorRe(id, type) {
      this.isloading = true
      // console.log('id', id)
      // const {data: res} = await this.$http.post('/taskSubmit/SubmitRequest', this.qs.stringify({task_submit_id: Id, type: type}))
      const res = await checkSubmit({ id: id, status: type })
      // console.log('jieshou', res)
      // if (res.code !== 200) return this.$message.error('操作失败！')
      if (type === 1) {
        if (res.data.code === 200) this.$message.success('已接受')
        else this.$message.error('接受失败，请重试')
      }
      else if (type === 2) {
        this.$prompt('请输入拒绝的原因', '原因填写', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(async ({ value }) => {
           const res = await checkSubmit({ id: id, status: type, reason: value })
          //  console.log(res);
           if (res.data.code === 200) this.$message({type: 'success',message: '拒绝成功'});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
        location.reload();
      // else if (type === 2) {
      //   this.dialogFormVisible = true;
      //   if (res.data.code === 200){ 
                  
      //         // this.$message.success('已拒绝');
      //   }
      //   else this.$message.error('拒绝失败，请重试')

          // this.$confirm('确认拒绝？', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }).then(async() => {
          //     const res = await getMessageList(
          //       {
                   
                 
          //       }
          //     )
             
          //     if (res.data.code === 200) {
                
          //       this.refuseDialogVisible = false
          //       return this.$message.success('拒绝成功！')
          //     } else {
          //       return this.$message.error('拒绝失败！')
          //     }
          //   })

          





      }
      // const {data: res1} = await this.$http.post('/message/EditMessageStatus', qs.stringify({MessageId: id, Status: 1}))
      // if (res1.code !== 200) return this.$message.error('查看消息失败！')
      // this.handleChange()
      // this.getTask()
      // this.taskData = []
      // this.submitLimit = ''
      // this.acceptList = []
      // this.checkList = []
      this.getTask()
      this.getList()
      // this.isloading = false
      this.activeNames = '0'
    },

   
    // 获取经纬度数据
    // handleMessage(event, task) {
    //   const data = event.data
    //   task.longitude = data.lng
    //   task.latitude = data.lat
    // },
    goBack() {
      this.$router.go(-1) // 返回上一层
    },
  
    
  
  }
}
</script>

<style lang="less" scoped>
.el-page-header {
  line-height: 30px;
  margin-left: 50px;
}

.taskProgressBox {
  // width:880px;
  // width:950px;
  width: 98%;
  height: 680px;
  // left: 48px;
  top: 128px;
  color: #555;

  .el-card {
    margin-left: 50px;
  }

  // display: flex;
  // position: absolute;
  //   min-height:700px;
  //   line-height: 32px;
  //   position:relative;
  //   top:20px;
  //   left:100px;
  // font-weight: 600;
  //   .header{
  //     display: flex;
  //     justify-content: space-between;
  //   }
  .divide {
    line-height: 60px;
    border-bottom: 0.1px solid #e4e7ed;
  }

  div span:first-child {
    .labelText()
  }

  .taskpro {
    display: flex;
    align-items: center;
    // margin-right: 15px;
    color: #999;
    font-weight: 400;
  }

  .progress {
    display: inline-block;
    width: 250px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .footer {
    width: 40%;
    position: relative;
    left: 50%;
    transform: translate(-50%, );

    .el-button {
      width: 100px;
      height: 50px;
      margin-left: 50px;
    }
  }

  .taskAdress {
    margin: 0% 5%;
    width: 100%;
    height: 600px;
  }

  .taskImg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-top: 10px;
    margin-left: 5px;
    // margin:10px 10px;
  }

  .box-card {
    margin: 20px 30px;
  }

  .el-card ::v-deep .el-card__header {
    // padding: 2px 10px;
    background-color: #f9f9f9;
  }

  .el-pagination {
    text-align: center;
  }
}

// .taskContainer > div{
//   .labelText()
// }
.labelText {
  font-weight: 300;
  color: #666;
}

.el-card {
  font-size: 16px;
}

.selectAdress {
  width: 350px;
  height: 300px;
}

.imageClass {
  width: 160px;
  height: 150px;
  margin: 0 5px;
}

.el-collapse ::v-deep .el-collapse-item__header {
  // padding: 2px 10px;
  height: 60px;
  line-height: 60px;
  font-weight: 300;
  color: #666;
  font-size: 14px;
}
</style>