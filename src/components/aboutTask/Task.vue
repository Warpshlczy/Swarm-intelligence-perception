<template>
  <div>
    <el-card class="taskBox" v-if="status===true">
      <div slot="header" class="header">
        <span class="title">{{taskData.title}}</span>
        <el-tooltip content="收藏" placement="top" :enterable="false" style="margin-right:30px;font-size:20px">
          <i :class="[{'el-icon-star-on': collectStatus}, {'el-icon-star-off': !collectStatus}]" style="color:#f95e5a" @click="Collection()"></i>
        </el-tooltip>
        <!-- <el-button type="text" @click="Collection()">收藏</el-button> -->
      </div>
      <div class="taskContainer">
        <span class="bigtext">任务详情</span>
        <el-row>
          <el-col :span="14" class="containerLeft">
            <div><span>任务描述：</span><div class="details">{{taskData.details}}</div>
            <div><el-image v-for="item in taskData.imagesPath" fit="cover" :key="item" class="imageClass" :src="item" :preview-src-list=[item] /></div></div>
            <div><span>类型：</span> <span>{{taskData.type}}</span></div>
            <div><span>发布时间：</span><span>{{taskData.createTime}}</span></div>
            <div><span>发布者：</span><span>{{taskData.publisherName}}</span></div>
            <div><span>开始提交时间：</span><span>{{taskData.startTime}}</span></div>
            <div><span>结束提交时间：</span><span>{{taskData.endTime}}</span></div>
            <span>大任务进展：</span>
            <el-table :data="taskPercentage" style="width: 75%" :show-header=false max-height=290 row-key="id">
              <el-table-column label="大任务" width="60">
                <template slot-scope="scope"><span v-if="scope.row.id===1">总</span><span v-else style="position: relative;font-size: 10px;top: -10px;left: 35px;">{{ scope.row.id - 1 }}</span></template>
              </el-table-column>
              <el-table-column label="大任务" >
                <template slot-scope="scope" v-if="taskPercentage[0].children != []">
                  <el-progress :color="percentageSetColors" v-if="scope.row.id===1" :percentage="(scope.row.passed / scope.row.maxPass)*100" :stroke-width="16" :show-text="false" class="progress"></el-progress>
                  <el-progress :color="percentageSetColors" v-else :percentage="(scope.row.passed / scope.row.maxPass)*100" :stroke-width="16" :show-text="false" class="progress dividedProgress"></el-progress>
                  <span v-if="scope.row.id===1" style="position:relative;top:-3px">{{ scope.row.passed }}/{{ scope.row.maxPass }}</span>
                  <span v-else  style="position:relative;top:-3px;left: 20px;">{{ scope.row.passed }}/{{ scope.row.maxPass }}</span>
                </template>
              </el-table-column>
             </el-table>
            <!-- <div class="taskpro" v-for="(item, index) in this.passedPercentage" :key="index">
              <span v-if="index > 98">{{ index + 1}}</span>
              <span v-else-if="index > 8">{{ index + 1 + "\u00a0\u00a0"}}</span>
              <span v-else>{{ index + 1 + "\u00a0\u00a0\u00a0\u00a0"}}</span>
              <el-progress :percentage="(item[0]/item[1])*100" :stroke-width="16" :show-text="false" class="progress"></el-progress>{{item[0]+'/'+item[1]}}
            </div> -->
            <!-- <div class="taskpro">
              <el-progress :percentage="(this.molecule / this.denominator)*100" :stroke-width="16" :show-text="false" class="progress"></el-progress>{{this.molecule }}/{{ this.denominator}}
            </div> -->
          </el-col>
          <el-col :span="10" class="containerRight">
            <div><span>任务地点(请先点击选择一个任务地点网格再进行提交)：</span></div>
            <iframe ref="iframe" name="selectAdress" src="static/任务地址.html" frameborder="0" scrolling="no" class="taskAdress">
            </iframe>
            <!-- 图例 -->
            <div class="flexBox">
              <div class="flexBox">
                <div class="tipUndone"></div>
                <span class="tipFontUndone">未完成任务</span>
              </div>
              <div class="flexBox">
                <div class="tipDone"></div>
                <span class="tipFontDone">已完成任务</span>
              </div>
            </div>
            <!-- <div><span>蓝色网格任务未完成，灰色网格任务已完成</span></div> -->
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="footer">
        <el-button type="info" @click="goBack">返回</el-button>
        <div class="submitbtn">
          <el-button type="primary" :disabled="!btnChangeEnable" @click="opensubmitDialog">提交</el-button>
        </div>
      </div>
        <!-- <el-tooltip
        effect="dark"
        :disabled="!btnChangeEnable"
        content="该任务已完成，无需提交"
        placement="top-end"> -->
        <!-- </el-tooltip> -->
    </el-card>
    <!-- 数据提交框 -->
    <el-dialog  title="数据提交框" :visible.sync="submitDialogVisible" width="50%" @close="submitDialogClosed" top="5vh" v-if="status===true">
      <!-- 内容主体区域 -->
      <el-form :model="dataSubmitForm" :rules="dataSubmitFormRules" ref="dataSubmitFormRef" label-width="80px" v-loading="isloading">
        <el-form-item label="提交描述" prop="text" v-show="taskData.submitLimit.charAt(0)==='1'"
        :rules="[{required: taskData.submitLimit.charAt(0)==='1', message: '请输入数据的文字描述', trigger: 'blur' }]">
          <el-input type="textarea" v-model="dataSubmitForm.text" maxlength="200" show-word-limit rows="5" placeholder="请输入数据的文字描述" :disabled="flower"></el-input>
        </el-form-item>
        <el-form-item label="数值" prop="number" v-show="taskData.submitLimit.charAt(1)==='1'"
        :rules="[{required: taskData.submitLimit.charAt(1)==='1', message: '请输入数值数据', trigger: 'blur' }]">
          <el-input-number controls-position="right" :precision="2" v-model="dataSubmitForm.number" placeholder="数值" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="文件" prop="files" v-show="taskData.submitLimit.charAt(2)==='1'"
        :rules="[{required: taskData.submitLimit.charAt(2)==='1', message: '请提交文件数据', trigger: 'blur' }]">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :limit="fileLimit"
            :on-exceed="exceed"
            :file-list="dataSubmitForm.files"
            accept=".jpg, .jpeg, .png"
            list-type="picture">
            <el-button size="medium" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg,jpeg,png文件，单张不超过2MB</div>
          </el-upload>
        </el-form-item>
        <!-- :rules="[{required: taskData.submitLimit.charAt(3)==='1'}]" -->
        <el-form-item label="地点" prop="place" v-show="taskData.submitLimit.charAt(3)==='1'">
          <iframe name="selectAdress" ref="iframe1" src="static/选择地址.html" frameborder="0" scrolling="no" class="selectAdress" >
          </iframe>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 收藏框 -->
    <el-dialog  title="收藏" :visible.sync="collectDialogVisible" width="20%" top="35vh" v-if="status===true">
      <!-- 内容主体区域 -->
      <el-form :model="collectForm" ref="collectFormRef" label-width="80px">
        <el-form-item label="任务别名" prop="alias" >
          <el-input type="text" v-model="collectForm.alias" placeholder="可设置任务别名" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="任务分组" prop="groupName">
          <el-select
            v-model="collectForm.group"
            filterable
            allow-create
            default-first-option
            placeholder="请选择分组或输入新分组"
            style="width: 80%;"
            @change="show()">
            <el-option
              v-for="item in groupName"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="collectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="collectTask()">收 藏</el-button>
      </span>
    </el-dialog>
  </div>
  </template>
  <script>
  // import e from 'express'
  import { getTaskDetail, getSmallTask, getPublisherName } from '@/api/task'
  import { getUserInfo } from '@/api/user'
  import { isCollected, addCollect, deleteCollect } from '@/api/collect'
  import { submitTask, uploadSubmitImages } from '@/api/submit'

  export default {
    data() {
      // var validatorPlace = function (rule, value, callback) {
      //   console.log(value)
      //   if (this.dataSubmitForm.longitude === '' || this.dataSubmitForm.latitude === '') {
      //     callback(new Error('请选择数据采集地点！'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        isloading: false,
        taskData: {
          submitLimit: '0000'
        },
        userId: '',
        groupName: [
          {
            label: '默认分组',
            value: ''
          }
        ],
        collectForm: {
          group: '',
          alias: ''
        },
        taskPercentage: [{
          // index: 0,
          id: 1,
          passed: 1,
          maxPass: 1,
          // hasChildren: false,
          children: []
        }],
        molecule: 0, // 总任务进度分子
        denominator: 0, // 总任务进度分母
        placeshow: false,
        fileLimit: 5,
        flower: false,
        collectStatus: 0, // 0：未被收藏，1：已被收藏
        submitLimit: [],
        queryInfo: {
          userId: this.userId,
          taskId: this.$route.query.id
        },
        QueryFavoriteInfo: {
          favoriteTaskId: this.$route.query.id,
          userId: this.userId
        },
        submitParams: {
          submitterId: localStorage.getItem('UserId'),
          rootTaskId: parseInt(this.$route.query.id)
        },
        typeOptions: [],
        status: false,
        // 是否展示提交按钮
        btnChangeEnable: false,
        submitDialogVisible: false,
        collectDialogVisible: false,
        dataSubmitForm: {
          text: '',
          number: 0,
          files: [],
          longitude: '',
          latitude: ''
        },
        coordinate: {},
        size: 500,
        tasks: [],
        passedPercentage: [],
        taskIndex: 0,
        afferentTaskId: 0,
        // 有些字段的验证写在上面才有效
        dataSubmitFormRules: {
          // text: [
          //   { required: true, message: '请输入数据的文字描述', trigger: 'blur' },
          //   { max: 200, message: '长度在1到200个字符之间', trigger: 'blur' }
          // ],
          // files: [
          //   { message: '请提交文件数据', trigger: 'blur' }
          // ],
          // number: [
          //   { message: '请输入数值数据', trigger: 'blur' }
          // ],
          place: [
            {
            required: false,
            validator: (rule, value, callback) => {
              if (this.dataSubmitForm.longitude === '' || this.dataSubmitForm.latitude === '') {
                callback(new Error('请选择数据采集地点'))
              } else {
              callback()
              }
            },
            trigger: 'blur'
            }
          ]
        },
        checkInput: false
      }
    },
    // 初始时加载数据
    created() {
      this.getUserInfo()
    },
    mounted() {
      window.addEventListener('message', this.handleMessage)
      this.getTask()
      // this.getTypeOptions()
    },
    updated() {
      // const mapFrame = this.$refs.iframe
      // if (mapFrame.attachEvent) { // 兼容浏览器判断
      //   mapFrame.attachEvent('onload', function() {
      //     const iframeWin = mapFrame.contentWindow
      //     // console.log('111', this.coordinate)
      //     iframeWin.postMessage({coordinate: this.coordinate, size: this.size, passedPercentage: this.passedPercentage}, '*')
      //   })
      // } else {
      //   mapFrame.onload = () => {
      //     const iframeWin = mapFrame.contentWindow
      //     // console.log('111', this.coordinate)
      //     iframeWin.postMessage({coordinate: this.coordinate, size: this.size, passedPercentage: this.passedPercentage}, '*')
      //   }
      // }
    },
    // inject: ['reload'],
    methods: {
      show() {
        // console.log(this.collectForm)
      },
      // async getGroupName() {
      //   const res = await getGroupName({ userId: this.userId })
      //   const groupName = res.data.data
      //   for (let i = 0; i < groupName.length; i++) {
      //     if (groupName[i] !== '') {
      //       console.log('groupName[i]', groupName[i])
      //       this.groupName.push({ value: groupName[i], label: groupName[i] })
      //     }
      //   }
      //   // this.groupName = this.groupName.concat(res.data.data)
      //   console.log('group', res.data.data, this.groupName)
      // },
      async getUserInfo() {
        const token = localStorage.getItem('Token')
        // console.log('token', token)
        const res = await getUserInfo(token)
        // console.log('res', res)
        if (res.data.code === 200) this.userId = res.data.data.id
        // console.log(this.userId)
        if (token === null) {
          // console.log(111)
          this.$message.error('当前尚未登录无法提交数据，请先登录')
        }
        else if (!this.userId && token) {
          this.$message.error('登录已过期，请重新登录')
        }
        this.isFavorite()
        // this.getGroupName()
      },
      handleNodeClick(data) {
        // console.log(data)
      },
      percentageSetColors(percentage) {
        if (percentage === 100) {
          return 'grey'
        }
      },
      // async getTypeOptions() {
      //   const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
      //   if (res.code !== 200) return this.$message.error('任务类型获取失败！')
      //   this.typeOptions = res.data
      // },
      // 获取任务详情
      async getTask() {
        // this.$refs.iframe.src = 'static/任务地址.html'
        // this.$refs.iframe.setAttribute('src', 'static任务地址.html')
        // this.$refs.iframe.contentWindow.location.reload(true)
        // console.log(this.$route.query.id)
        // const {data: res} = await this.$http.get('/taskPublish/search/id?id=' + this.$route.query.id)
        // const {data: res} = await this.$http.get('/afferentTaskPublish/search/id?id=' + this.$route.query.id)
        // console.log(this.$route.query.id)
        // console.log('获取任务详情', res)
        // console.log('id', parseInt(this.$route.query.id))
        const res = await getTaskDetail({id: parseInt(this.$route.query.id)})
        // console.log('taskkkkkkkkkkkkkkkkkkkkkkkkkkkkk', res.data.data.imagesPath, res.data.data)
        if (res.data.code !== 200) return this.$message.error('获取任务详情失败！')
        if (res.data.code !== 200) {
          this.$router.replace({
          // 跳转到登录页面
          path: '/login',
          // 将跳转的路由path作为参数,登录成功后跳转到该路由
          query: { redirect: this.$router.currentRoute.fullPath }
        })
        }
        this.status = true
        // this.taskData = res.data.afferentTaskPublish
        res.data.data.submitLimit += ''
        // console.log(res.data.data.submitLimit)
        const name = await getPublisherName({ publisherId: res.data.data.publisherId})
        // console.log('name', name.data.data, typeof (name.data.data) === 'string')
        if (typeof (name.data.data) === 'string') {
          res.data.data.publisherName = name.data.data
        }
        // console.log('res.data.data', res.data.data)
        if (res.data.data.imagesPath && res.data.data.imagesPath.length !== 0) {
          res.data.data.imagesPath = res.data.data.imagesPath.split(',')
          // res.data.data.imagesPath = res.data.data.imagesPath.slice(0, res.data.data.imagesPath.length - 1)
          // 每个图片加上基准地址
          for (var i = 0; i < res.data.data.imagesPath.length; i++) {
            res.data.data.imagesPath[i] = 'http://101.34.16.47/resource' + res.data.data.imagesPath[i]
          }
        }
        // console.log(res.data.data.imagesPath, '22222222222222222222222222222222222')
        this.taskData = res.data.data
        // console.log(this.taskData, '111')
        // const startTime = new Date(this.taskData.startTime).toJSON()
        // const endTime = new Date(this.taskData.endTime).toJSON()
        // const createTime = new Date(this.taskData.createTime).toJSON()
        this.taskData.startTime = this.taskData.startTime.split('.')[0].replace('T',' ')
        this.taskData.endTime = this.taskData.endTime.split('.')[0].replace('T',' ')
        this.taskData.createTime = this.taskData.createTime.split('.')[0].replace('T',' ')
        // this.taskData.startTime = this.taskData.startTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        // this.taskData.endTime = new Date(new Date(endTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        // this.taskData.createTime = new Date(new Date(createTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        this.size = this.taskData.size
        // this.taskData.submitLimit += ''
        // console.log('submitLimit', this.taskData.submitLimit, typeof(this.taskData.submitLimit))
        
        // console.log('taskdata', this.taskData)
        if (this.taskData.submitLimit.charAt(3) === '1') this.placeshow = true
        // this.taskData.imagesPath = res.data.data.imagesPath
        // this.taskdata.submitLimit += ''
        if (!this.taskData.details) this.taskData.details = '无'
        // if (this.taskData.currentPassed >= this.taskData.maxPassed) this.btnChangeEnable = true
        // console.log('收藏状态：' + this.collectStatus)
        // console.log('passedPercentage' + this.passedPercentage[2])
        const res1 = await getSmallTask({ bigTaskId: parseInt(this.$route.query.id) })
        // console.log('smalltask', res1.data.data.childTask)
        this.coordinate = res1.data.data.childTask
        for (let i = 0; i < this.coordinate.length; i++) {
        //   const {data: res} = await this.$http.get('/taskPublish/search/id?id=' + this.coordinate[i].id)
        //   const data = res.data
          const data = this.coordinate[i]
          if (this.passedPercentage.length < this.coordinate.length) {
            if (data.currentPassed >= data.maxPassed) data.currentPassed = data.maxPassed
            this.passedPercentage.push([data.currentPassed, data.maxPassed])
            this.taskPercentage[0].children.push({
              id: i + 2,
              passed: data.currentPassed,
              maxPass: data.maxPassed
            })
          }
          if (this.tasks.length < this.coordinate.length) {
            this.tasks.push(data)
          }
        }
        // console.log('passedPercentage', this.passedPercentage)
        if (!this.denominator) {
          this.taskPercentage[0].passed -= 1
          this.taskPercentage[0].maxPass -= 1
          for (let i = 0; i < this.passedPercentage.length; i++) {
            this.taskPercentage[0].passed += this.passedPercentage[i][0]
            this.taskPercentage[0].maxPass += this.passedPercentage[i][1]
            this.molecule += this.passedPercentage[i][0]
            this.denominator += this.passedPercentage[i][1]
          }
        }
        // console.log('总进度', this.molecule + '/' + this.denominator)
        // console.log(this.taskPercentage[0].children)
        // console.log('大任务中的小任务', res.data.taskPublishVo)
        // 合并小任务数据,换成总的大任务进度
        const mapFrame = this.$refs.iframe
        if (mapFrame.attachEvent) { // 兼容浏览器判断
          mapFrame.attachEvent('onload', function() {
            const iframeWin = mapFrame.contentWindow
            // console.log('111', this.coordinate)
            iframeWin.postMessage({coordinate: this.coordinate, size: this.size, passedPercentage: this.passedPercentage}, '*')
          })
        } else {
          mapFrame.onload = () => {
            const iframeWin = mapFrame.contentWindow
            // console.log('111', this.coordinate)
            iframeWin.postMessage({coordinate: this.coordinate, size: this.size, passedPercentage: this.passedPercentage}, '*')
          }
        }
      },
      // 判断任务是否被收藏
      async isFavorite() {
        // console.log(this.QueryFavoriteInfo)
        // const {data: res} = await this.$http.get('/favorites/QueryFavorite?', {params: this.QueryFavoriteInfo })
        const res = await isCollected({ userId: this.userId, taskId: this.$route.query.id })
        // console.log('userId', this.userId)
        // console.log('id', typeof (this.$route.query.id))
        // console.log('isCollected', res)
        // if (res.code !== 200) return this.$message.error('获取任务收藏状态失败！')
        if (res.data.code) {
          this.collectStatus = res.data.data
          // console.log('已收藏', this.collectStatus)
        }
      },
      // 点击收藏
      async Collection() {
        if (!this.collectStatus) {
          // this.collectDialogVisible = true
          // const {data: res} = await this.$http.post('/favorites/Collection', this.qs.stringify(this.queryInfo))
          // // if (res.code === 404) return this.$message.success('任务已收藏!')
          // if (res.code !== 200) return this.$message.error('收藏失败！')
          // this.collectStatus = 1
          // return this.$message.success('收藏成功！')
          this.$confirm('确认收藏？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.smallMessageList = [] 
            const res = await getMessageList(
              {
                
              }
            )
            // console.log(res)
            if (res.data.code === 200) {
              this.collectStatus = 1
              this.getTask()
              this.collectDialogVisible = false
              return this.$message.success('收藏成功！')
            } else {
              return this.$message.error('收藏失败！')
            }
          })
        } else {
          // const {data: res} = await this.$http.post('/favorites/DeleteFavorite', this.qs.stringify({taskId: this.queryInfo.taskId, userId: this.queryInfo.userId}))
          // if (res.code !== 200) return this.$message.error('取消收藏失败！')
          // this.collectStatus = 0
          // return this.$message.success('取消收藏成功！')

          this.$confirm('确认取消收藏？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
              const res = await deleteCollect({ taskId: this.$route.query.id})
              // console.log(res)
              if (res.data.code === 200) {
                this.collectStatus = 0
                this.getTask()
                return this.$message.success('取消收藏成功！')
              } else {
                return this.$message.error('取消收藏失败！')
              }
            })
        }
      },
      async collectTask() {
        const res = await addCollect(
            {
              userId: this.userId,
              taskId: this.$route.query.id
              // alias: this.collectForm.alias,
              // groupName: this.collectForm.group,
            }
        )
        // console.log(res)
        if (res.data.code === 200) {
          this.collectStatus = 1
          this.getTask()
          this.collectDialogVisible = false
          return this.$message.success('收藏成功！')
        } else {
          return this.$message.error('收藏失败！')
        }
      },
      opensubmitDialog() {
        // const token = localStorage.getItem('Token')
        // if (!token) {
        //   // this.$confirm('当前尚未登录无法提交数据，请问是否登录？', '提示', {
        //   //   confirmButtonText: '确定',
        //   //   cancelButtonText: '取消',
        //   //   type: 'warning'
        //   // }).then(async() => {
        //   //   localStorage.setItem('router_history', '/scanTask')
        //   //   this.$router.push('login')
        //   // })
        //   this.$message.error('当前尚未登录无法提交数据，请先登录')

        // }
        this.$nextTick(() => {
          // console.log(this.$refs.iframe1)
          this.$refs.iframe1.src = 'static/选择地址.html'
          this.$refs.iframe1.contentWindow.location.reload(true)
        })
        // 控制地点的必选，写在rule中不实现
        if (this.placeshow) this.dataSubmitFormRules.place[0].required = true
        this.dataSubmitForm.longitude = ''
        this.dataSubmitForm.latitude = ''
        this.submitDialogVisible = true
        // if (this.taskData.id === 1) {
        //   this.dataSubmitForm.text = '茉莉花2，油菜花3，梅花4，钟花樱桃5，桃花6，郁金香7，冰岛罂粟8，菊花9，荷花10，马鞭草11'
        //   this.fileLimit = 1
        //   this.flower = true
        // }
      },
      async submitData() {
        // console.log(111, this.tasks)
        // if (this.taskData.submitLimit.charAt(0) === '1' && this.dataSubmitForm.text) this.checkInput = true
        // if (this.taskData.submitLimit.charAt(1) === '1' && this.dataSubmitForm.number) this.checkInput = true
        // if (this.taskData.submitLimit.charAt(2) === '1' && this.dataSubmitForm.files.length) this.checkInput = true
        // if (this.taskData.submitLimit.charAt(3) === '1' && this.dataSubmitForm.longitude) this.checkInput = true
        // if (!this.checkInput) {
        //   this.$message({
        //     type: 'info',
        //     message: '至少提交一项内容！'
        //   })
        // } else {
        // console.log(this.dataSubmitForm)
        this.$refs.dataSubmitFormRef.validate(async (valid) => {
          // if (this.dataSubmitForm.longitude === '' || this.dataSubmitForm.latitude === '') {
            //   console.log('请选择数据采集地点！')
            // }
          if (!valid) return
          this.$confirm('确认提交数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const token = localStorage.getItem('Token')
            // const res2 = await getUserInfo(token)
            // console.log('个人信息：', res2)
            if (!token) {
              this.$confirm('当前尚未登录无法提交数据，请问是否登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async() => {
                localStorage.setItem('router_history', '/scanTask')
                this.$router.push('login')
              })
            }
            else if (token && !this.userId) {
              this.$confirm('登录已过期，是否重新登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async() => {
                localStorage.setItem('router_history', '/scanTask')
                this.$router.push('login')
              })
            // const path = this.$route.path
            // console.log(path) 
            // if (path !== '/scanTask' && path !== '/themeMap' && path !== '/More' && token && res.data.code != 200) {
            //   console.log(123)
              // this.$message.error('登录已过期，请重新登录')
            // }
            }
            // 新建一个FormData
            // console.log(this.taskIndex)
            // this.submitParams.taskId = this.coordinate[this.taskIndex - 1].id
            // 
            this.isloading = true
            if (this.taskData.submitLimit.charAt(0) === '1') {
              // upData.append('textDescription', this.dataSubmitForm.text)
              this.submitParams.description = this.dataSubmitForm.text
            }
            if (this.taskData.submitLimit.charAt(1) === '1') {
              // upData.append('numericalValue', parseFloat(this.dataSubmitForm.number))
              this.submitParams.numericalValue = this.dataSubmitForm.number
            }
            if (this.taskData.submitLimit.charAt(2) === '1') {
              // 不能直接用publishForm.files传，加到FormData里面去，一次性传
              // this.dataSubmitForm.files.forEach(function (file) {
              //   upData.append('files', file.raw, file.name) // 因为要上传多个文件，所以需要遍历一下才行
              //   // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
              //   // console.log(file.raw)
              // })
            }
            if (this.taskData.submitLimit.charAt(3) === '1') {
              // upData.append('longitude', this.dataSubmitForm.longitude)
              // upData.append('latitude', this.dataSubmitForm.latitude)
              this.submitParams.longitude = this.dataSubmitForm.longitude
              this.submitParams.latitude = this.dataSubmitForm.latitude
            }
            // 提交者id
           // upData.append('submitterId', this.userId)
            // 任务id
            // upData.append('taskPublishId', this.afferentTaskId)
            // console.log('submit', this.submitParams)
            const res = await submitTask(this.submitParams)
            this.isloading = false
            if (res.data.code === 200) {
              this.$message.success('提交数据成功！')
            }
            else {
              return this.$message.error('提交数据失败！')
            }
            // console.log('submitres', res)
            var upData = new FormData()
            this.dataSubmitForm.files.forEach(function (file) {
              upData.append('images', file.raw) // 因为要上传多个文件，所以需要遍历一下才行
              // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
              // console.log(file)
              // console.log(file.raw)
            })
            const res1 = await uploadSubmitImages(upData, res.data.data)
            // console.log('submitImages', res1)
              // const {data: res} = await this.$http.post('/taskSubmit/create', upData)
              // console.log('111', res)
              // if (res.code !== 201) return this.$message.error('提交数据失败！')
              // if (res.code === 401) return this.$message.error('提交数据失败！')
              // this.$message.success('提交数据成功！')
              // this.$store.dispatch('getMessageNum')
              // 花见任务，还得将提交数据上传到花见后台
              // if (this.taskData.id === 1) {
              //   var upData1 = new FormData()
              //   upData1.append('flowerType', parseInt(this.dataSubmitForm.number))
              //   upData1.append('longitude', this.dataSubmitForm.longitude)
              //   upData1.append('latitude', this.dataSubmitForm.latitude)
              //   this.dataSubmitForm.files.forEach(function (file) {
              //   upData1.append('file', file.raw, file.name) // 因为要上传多个文件，所以需要遍历一下才行
              //   // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
              //   // console.log(file.raw)
              // })
              //   const {data: res1} = await this.$newAxios.post('http://47.98.235.212:8888/flowerPoint/create', upData1)
              //   if (res1.code !== 201) {
              //     console.log('提交数据到花见失败')
              //   }
              // }
              this.submitDialogVisible = false
              this.$refs.dataSubmitFormRef.resetFields()
              // 清空文件
              this.$refs.upload.clearFiles()
              // this.$nextTick(() => {
              //   // console.log(this.$refs.iframe1)
              //   this.$refs.iframe1.removeAttribute('src')
              //   this.$refs.iframe1.setAttribute('src', 'static/选择地址.html')
              //   // this.$refs.iframe.src = 'static/任务地址.html'
              //   // this.$refs.iframe.contentWindow.location.reload(true)
              // })
              // console.log(222, this.tasks)
          }).catch()
      })
      // }
      this.getTask()
      },
      // 图片上传前的操作
      beforeUpload(file) {
        // 判断图片是否大于10M
        const isLt10M = file.size / 1024 / 1024 < 10
        // 判断图片的类型
        const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'
        if (!isJpg) {
            this.$message.error('只能上传jpg, jpeg, png, gif格式的图片！')
            // 1.获取将要删除图片的临时路径
            const fileuid = file.uid
            // 2.从pics数组中，找到图片对应的索引值
            const i = this.dataSubmitForm.files.findIndex(x => x.uid === fileuid)
            // 3.调用splice方法，移除图片信息
            this.dataSubmitForm.files.splice(i, 1)
            // console.log(this.editForm.files)
            // console.log(this.$refs.upload.uploadFiles)
            this.$refs.upload.uploadFiles = this.dataSubmitForm.files
            return false
        }
        if (!isLt10M) {
            this.$message.error('上传图片大小不能超过2MB!')
            // 1.获取将要删除图片的临时路径
            const fileuid = file.uid
            // 2.从pics数组中，找到图片对应的索引值
            const i = this.dataSubmitForm.files.findIndex(x => x.uid === fileuid)
            // 3.调用splice方法，移除图片信息
            this.dataSubmitForm.files.splice(i, 1)
            // console.log(this.editForm.files)
            // console.log(this.$refs.upload.uploadFiles)
            this.$refs.upload.uploadFiles = this.dataSubmitForm.files
            return false
        }
        return true
      },
      // 改变图片
      async handleChange(file, fileList) {
        if (this.beforeUpload(file.raw)) {
          // beforeUpload返回的是个promise对象，要用await解构出来拿到PromiseResult值。这个居然整了好久！！给忘了
          file = await this.compresspic.compressAccurately(file.raw, 200)
          fileList[fileList.length - 1].raw = file
        }
        this.dataSubmitForm.files = fileList
      },
      // 删除图片
      handleRemove(file, fileList) {
        this.dataSubmitForm.files = fileList
      },
      // 图片数量限制
      exceed(file, fileList) {
        this.$message.error('最多上传' + this.fileLimit + '张图片哦！')
      },
      // 返回上一页
      goBack() {
        this.$router.go(-1)
      },
      // 关闭提交框
      submitDialogClosed() {
        this.$refs.dataSubmitFormRef.resetFields()
      },
      // 获取经纬度数据
      handleMessage(event) {
        const data = event.data
        // console.log(data)
        if (data.lat) {
          this.dataSubmitForm.longitude = data.lng
          this.dataSubmitForm.latitude = data.lat
        }
        if (data.taskIndex !== -1) {
          this.taskIndex = data.taskIndex
          // console.log(this.taskIndex)
          if (data.btnChangeEnable !== undefined) {
            this.btnChangeEnable = data.btnChangeEnable
          }
          const showMassage = data.showMessage
          if (showMassage) {
            this.$message.closeAll()
            this.$message.error('该任务已完成，请选择其他任务')
          }
          if (this.tasks[this.taskIndex - 1] !== undefined) {
            // console.log('000', this.tasks[this.taskIndex - 1])
            this.afferentTaskId = this.tasks[this.taskIndex - 1].id
          }
          if (this.coordinate[this.taskIndex - 1] !== undefined) {
            this.submitParams.taskId = this.coordinate[this.taskIndex - 1].id
            // console.log('000', this.submitParams.taskId)
          }
          // console.log('111', this.taskIndex, this.btnChangeEnable, this.afferentTaskId)
        }
      }
    }
  }
  </script>
  <style lang="less" scoped>
  .taskBox{
    width:78%;
    margin:0% 5%;
    min-height:700px;
    line-height: 32px;
    position:relative;
    top:20px;
    left:5%;
    padding-left: 2%;
    font-weight: 600;
    color:#555;
    .header{
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      align-items: center;
    }
    .title{
    color: #666;
    font-size: 18px;
    font-weight: 700;
  }
  .labelText{
    font: 14px;
    font-weight: 700;
    color: #555;
  }
  .details{
    .labelText();
    // color: #999;
    // font-weight: 400;
    margin-right: 5%;
    margin-bottom: 10px;
  }
  // 标题
    .el-col div span:first-child{
      color: #999;
      font-weight: 400;
    }
    // 内容
    .el-col div > span:nth-child(2){
      .labelText()
    }
    .taskpro{
      display:flex;
      align-items: center;
      margin-right: 5%;
      font: 14px;
      font-weight: 700;
      color: #555;
    }
    /deep/ .el-table tr {
      height: 40px;
    }
    /deep/ .el-table .cell{
      line-height: 18px;
    }
    /deep/ .el-table .el-table__cell{
      padding: 0;
    }
    .progress{
      display: inline-block;
      width: 70%;
      margin-right: 10px;
      margin-top: 10px;
    }
    .dividedProgress{
      left: 20px;
    }
    .footer{
      width: 100%;
      position: relative;
      // top: 10px;
      // inset: 10px auto;
      // transform: translate(-50%,);
      // width: 40%;
      // position: relative;
      // left: 20%;
      // top: -100px;
      // transform: translate(-50%,);
      .el-button{
        position: relative;
        width: 100px;
        height: 50px;
        left: 60%;
      }
      .submitbtn{
        position: relative;
        width: 100px;
        height: 50px;
        left: 20%;
        transform: translate(0, -100%);
      }
    }
    //放大地图
    .containerLeft {
      width: 35%;
    }
    .containerRight {
      width: 62%;
    }
    .taskAdress{
      width: 100%;
      height: 500px;
    }
  }
  // .taskContainer > div{
  //   .labelText()
  // }
  .bigtext{
    color: #666;
    font-weight: 700;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .selectAdress{
    width: 100%;
    height: 300px;
  }
  .flexBox {
    display: flex;
    flex-direction: row;
  }
  .tipDone {
    margin-left: 10px;
    width: 30px;
    height: 30px;
    background-color: #a3a3a3;
  }
  .tipUndone {
    width: 30px;
    height: 30px;
    background-color: #9393f9;
  }
  .tipFontDone {
    margin-left: 10px;
  }
  .tipFontUndone {
    margin-left: 10px;
  }
  .imageClass{
    width:160px;
    height:150px;
    margin: 0 5px;
  }
</style>