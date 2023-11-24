<template>
  <div class="MyPublishBox">
    <div class="header">
      <el-card>
        <el-row>
          <!-- Tabs标签页 -->
          <el-tabs v-model="activeClassName" @tab-click="handleClassClick">
            <el-tab-pane :label="'进行中'" :name="0+''"></el-tab-pane>
            <el-tab-pane :label="'已完成'" :name="1+''"></el-tab-pane>
            <el-tab-pane :label="'已失效'" :name="2+''"></el-tab-pane>
            <el-tab-pane :label="'全部'" :name="-1+''"></el-tab-pane>
          </el-tabs>
          <!-- 发布任务按钮 -->
          <el-button class="publishbtn" type="primary" @click="jumpToPubish()">发布任务</el-button>
        </el-row>
        <!-- 内容主体区域 -->
        <div v-for="(item, i) in taskList" :key="item.id"
        :class="['bdbottom', i === 0 ? 'bdtop': '', 'taskItem']">
          <el-row :gutter="20">
          <!-- 用栅栏布局 左半边图片文字部分-->
            <el-col :span="16">
              <el-row class="context">
                <!-- 图片 -->
                <el-col :span="6">
                  <div class="demo-image__preview">
                    <el-image
                    :src="item.imagesPath[0]"
                    class="taskImg"
                    fit="cover"
                    :preview-src-list="item.imagesPath">
                    </el-image>
                  </div>
                </el-col>
                <div @click="jumpToTask(item.id)">
                  <!-- 文字部分 -->
                  <el-col :span="16" class="text">
                    <!-- 标题 -->
                    <el-row type="flex" justify="space-between">
                      <el-col :span="12">
                        <span class="boldtext">{{item.title}}</span>
                      </el-col>
                    </el-row>
                    <!-- 任务描述 -->
                    <el-row class="middlerow">
                      <span class="content">{{item.details}}</span>
                    </el-row>
                    <!-- 底部信息-->
                    <el-row type="flex" justify="space-between" class="bottomrow">
                      <div class="fuck">
                        <el-avatar icon="el-icon-user-solid" :size="30" style="margin-right:5px">
                        </el-avatar>
                        {{username}}
                      </div>
                      <!-- 是放进度条还是和查看任务中的列表一样放头像用户名 -->
                        <!-- <div class="taskpro"><el-progress :percentage="(item.currentPassed/item.maxPassed)*100" :stroke-width="16" :show-text="false" class="progress"></el-progress>
        {{item.currentPassed+'/'+item.maxPassed}}</div> -->
                      <div class="endtime">
                        <span class="boldtext">任务结束时间：</span><i class="el-icon-time" ></i>&nbsp;{{item.endTime}}
                      </div>
                    </el-row>
                  </el-col>
                </div>
              </el-row>
            </el-col>
            <!-- 右半边操作部分 -->
            <el-col :span="8" class="operation">
              <!-- 任务进展按钮 -->
              <el-button type="success" @click="jumpToTaskProgress(item.id)">任务进展</el-button>
              <!-- 编辑按钮 -->
              <el-button  type="primary" v-if="group===0 && !group" @click="handleEdit(item.id)">编辑</el-button>
              <!-- 删除按钮 -->
                <el-button type="danger" v-if="group===0 && !group" @click="handleDelete(item.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="total,prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          :current-page="currentPage"
          :page-size="pagesize"
          >
        </el-pagination>
      </el-card>
    </div>
  <!-- 编辑对话框 -->
  <el-dialog
  title="编辑"
  :visible.sync="newEditDialogVisible"
  width="60%"
  :before-close="handleClose"
  class="edit-form">
    <!-- <div class="edit_tip">该任务还没有提交被接受，故字段均可编辑。</div> -->
    <el-form :model="editForm"
    ref="editFormRef"
    :rules="editFormRules"
    label-width="120px" class="editForm" size="medium" label-position="left" v-loading="isloading">
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="editForm.type" :disabled="isDisabled">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" width="50%" prop="title">
        <el-input v-model="editForm.title" placeholder="任务名称" :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="details">
        <el-input type="textarea" :disabled="isDisabled" v-model="editForm.details" rows="5" placeholder="请输入任务描述"></el-input>
        <!-- 图片上传 -->
        <el-upload
          :auto-upload="false"
          action="#"
          ref="upload"
          :multiple="true"
          list-type="picture-card"
          :class="{disabled:isDisabled}"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :before-remove="beforeRemove"
          :file-list="editForm.files"
          :on-success="handleSuccess"
          accept=".jpg, .jpeg, .png, .gif"
          :limit="5"
          :disabled="isDisabled"
          aria-readonly="true"
          :on-exceed="exceed">
          <!-- :http-request="addPicture" -->
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg,jpeg,png文件，单张不超过2MB,最多可上传五张</div>
        </el-upload>
        <el-dialog :visible.sync="imageDialogVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
  </el-form-item>
  <el-form-item label="任务地址" prop="place">
    <div class="mask" v-if="isDisabled"></div>
    <iframe ref="iframe" name="selectAdress" src="static/修改地址.html" frameborder="0" scrolling="no" class="taskAdress" ></iframe>
    <el-row>
      <!-- <button @click="updateLocation" :disabled="isDisabled">重新选择任务地址</button> -->
    </el-row>
  </el-form-item>
  <!-- <el-form-item label="起止时间"  prop="taskDate" v-if="!submitter"> -->
    <!-- 日期时间选择器统一成下面一种，分开选择的，不然会存在用户误以为起止时间修改时不能设置为同一天的问题 -->
    <!-- 没有提交者的日期时间选择器 -->
    <!-- <el-date-picker
      v-model="editForm.taskDate"
      :picker-options="pickerOptions"
      type="datetimerange"
      range-separator="至"
      start-placeholder="提交开始日期"
      end-placeholder="提交结束日期">
    </el-date-picker>
  </el-form-item> -->
  <el-form-item label="起止时间" prop="taskDate">
    <!-- 有提交者的时间日期选择器 -->
    <div class="block">
      <el-date-picker
        v-model="editForm.startTime"
        type="datetime"
        placeholder="选择日期时间"
        :picker-options="startDatePicker"
        :disabled="isDisabled">
      </el-date-picker>
      <el-date-picker
        v-model="editForm.endTime"
        :picker-options="endDatePicker"
        type="datetime"
        placeholder="选择日期时间"
        :disabled="isDisabled">
      </el-date-picker>
    </div>
    </el-form-item>
  <el-form-item label="所需完成数量" width="50%" prop="maxPassed">
    <el-input-number controls-position="right" v-model="editForm.maxPassed" placeholder="请输入任务数量" :min="1" :max="50" :disabled="isDisabled"></el-input-number>
  </el-form-item>
  <el-form-item label="提交要求" prop="submitLimit">
    <el-checkbox-group v-model="editForm.submitLimitCheck" :disabled="isDisabled">
      <!-- label就是对应的值 -->
      <el-checkbox v-for="limit in limitOptions" :label="limit.id" :key="limit.id">{{limit.content}}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
  <el-button @click="handleClose">取 消</el-button>
  <el-button type="primary" @click="handleUpdate()" :disabled="isDisabled">确 定</el-button>
  </span>
  </el-dialog>
  </div>
</template>

<script>
import { getPublicList, deleteTask } from '@/api/userTask'
import { getTaskDetail, getType, uploadTaskImages, getSmallTask, updateTask, publishTask } from '@/api/task'

// import { compress } from '../../assets/js/compresspic.js'
// eslint-disable-next-line no-extend-native
Date.prototype.format = function(format) {
  var o = {
  'M+': this.getMonth() + 1, // month
  'd+': this.getDate(), // day
  'h+': this.getHours(), // hour
  'm+': this.getMinutes(), // minute
  's+': this.getSeconds(), // second
  'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
  'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
  format = format.replace(RegExp.$1,
  (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
  if (new RegExp('(' + k + ')').test(format)) {
  format = format.replace(RegExp.$1,
  RegExp.$1.length === 1 ? o[k]
  : ('00' + o[k]).substr(('' + o[k]).length))
  }
  }
  return format
}

export default {
  created() {
    this.getTaskList()
    this.getTypeOptions()
  },
 activated() {
   this.$route.meta.keepAlive = false
    this.getTaskList()
    // console.log(this.$route.meta.keepAlive)
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
  },
  updated() {
    if (this.newEditDialogVisible) {
      const mapFrame = this.$refs.iframe
      if (mapFrame.attachEvent) { // 兼容浏览器判断
        mapFrame.attachEvent('onload', function() {
          const iframeWin = mapFrame.contentWindow
          iframeWin.postMessage({coordinate: this.smallTask, size: this.editForm.size}, '*')
        })
      } else {
        mapFrame.onload = () => {
          const iframeWin = mapFrame.contentWindow
          iframeWin.postMessage({coordinate: this.smallTask, size: this.editForm.size}, '*')
        }
      }
    }
  },
  // watch: {
  //   'editForm.taskPublishVo': {
  //     handler(newVal, oldVal) {
  //     console.log('11111111', this.editForm.taskPublishVo)

  //       const mapFrame = this.$refs.iframe
  //       if (mapFrame.attachEvent) { // 兼容浏览器判断
  //         mapFrame.attachEvent('onload', function() {
  //           const iframeWin = mapFrame.contentWindow
  //           iframeWin.postMessage({coordinate: this.editForm.taskPublishVo, size: this.editForm.size}, '*')
  //         })
  //       } else {
  //         mapFrame.onload = () => {
  //           const iframeWin = mapFrame.contentWindow
  //           iframeWin.postMessage({coordinate: this.editForm.taskPublishVo, size: this.editForm.size}, '*')
  //         }
  //       }
  //     }
  //   }
  // },
  data() {
    // 时间选择器校验
    var validateConfirmDate = (rule, value, callback) => {
      var startTime = new Date(this.editForm.startTime).getTime()
      var endTime = new Date(this.editForm.endTime).getTime()
      // console.log(startTime)
      // console.log(endTime)
      // console.log(startTime - endTime)
//  转化为毫秒数以后 如果（创建时间 - 起始时间）的运算结果大于0的时候 就触发设定的规则 否则就继续往下运行
        if ((startTime - endTime) > 0) {
          callback(new Error('任务起始时间不能小于创建时间！'))
        } else {
          callback()
        }
        callback()
      }
    return {
      isloading: false,
      taskId: null,
      coordinate: [],
      type: null,
      smallTask: null,
      username: null, // 发布者姓名
      group: null, // 查询类型 0表示进行中，1表示已完成，2表示已失效，空表示全部
      isDisabled: true,
      // 编辑中开始时间的选择范围
      startDatePicker: this.processStartDate(),
      // 编辑中结束时间的选择范围
      endDatePicker: this.processEndDate(),
      newEditDialogVisible: false,
      dialogImageUrl: '',
      imageDialogVisible: false,
      total: 0,
      pagesize: 0,
      currentPage: 1,
      queryInfo: {
        // 当前的页数
        publisher_id: this.userId,
        // publish_id: this.userId,
        type: ''
      },
      activeClassName: '0',
      taskList: [],
      editForm: {},
      typeOptions: [
        // {label: '内河污染监测', value: '1'},
        // {label: '停车位监测', value: '2'},
        // {label: '空气质量监测', value: '3'},
        // {label: '其他', value: '0'}
      ],
      limitOptions: [
        {id: 0, content: '文本'},
        {id: 1, content: '数值'},
        {id: 2, content: '文件(图片)'},
        {id: 3, content: '地点'}],
      editFormRules: {
        type: [
          { required: true, message: '请选择任务类型', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 20, message: '长度在1到20个字符之间', trigger: 'blur' }
        ],
        submitLimit: [
          { required: true, message: '请选择提交要求', trigger: 'blur' }
        ],
        taskDate: [
          { required: true, validator: validateConfirmDate, message: '任务结束时间需晚于任务开始时间！请重新选择！', trigger: 'blur' }
        ],
        place: [
          {
          required: true,
          validator: (rule, value, callback) => {
            if (this.editForm.longitude === '' || this.editForm.latitude === '') {
              callback(new Error('请选择任务地点！'))
            } else {
            callback()
            }
          },
          trigger: 'blur'
          }
        ]
      },
      watch: {
        // endTime: function () {
        //   this.editForm.endTime.format('yyyy-MM-dd hh:mm:ss')
        // }
      }
    }
  },
  methods: {
    // 开始时间选择范围
    processStartDate() {
      const self = this
      return {
        disabledDate(time) {
          // 原先的开始时间早于现在时间，则可以把时间设置为开始时间之后
          if (self.editForm.startTime) { // 如果开始时间不为空，则结束时间大于开始时间
            return time.getTime() < Date.now() - 8.64e7
          } else {
            // 原先的开始时间晚于现在时间，则可以把时间设置为现在时间之后
            // return time.getTime() < Date.now() - 8.64e7
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    // 结束时间选择范围
    processEndDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.editForm.startTime) { // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.editForm.startTime).getTime() - 8.64e7 > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    async getTaskList() {
      // this.currentPage = 1
      this.group = 1
      if (this.activeClassName === '0') {
        this.group = 0
      } else if (this.activeClassName === '1') {
        this.group = 1
      } else if (this.activeClassName === '2') {
        this.group = 2
      }
      let params = {
        current: this.currentPage,
        pageSize: 5,
        group: this.group
      }
      if (this.activeClassName === '-1') { delete params.group }
      const res = await getPublicList(params)
      // const res = await getPublicList({
      //   current: 1,
      //   pageSize: 5,
      //   group: 0
      // })
      // console.log('获取当前用户发布任务列表返回值:', this.activeClassName, res)
      this.queryInfo.type = Number(this.activeClassName)
      if (res.data.code !== 200) return this.$message.error('获取发布列表失败！')
      let tmp = res.data.data.publisherTaskDetails
      for (let i = 0;i < tmp.length;i++) {
        // console.log('tmp[i].imagesPath', tmp[i].imagesPath)
        tmp[i].endTime = tmp[i].endTime.split('.')[0].replace('T',' ')

        let imagesTmp = tmp[i].imagesPath
        tmp[i].imagesPath = []
        if (!imagesTmp) tmp[i].imagesPath.push(require('../../assets/wutupian.jpg'))
        else {
          let imagesArr = imagesTmp.split(',')
          for (let j = 0;j < imagesArr.length;j++){
            tmp[i].imagesPath.push('http://101.34.16.47/resource' + imagesArr[j])
          }
        }
      }
      this.taskList = tmp
      // console.log('人物列表', this.taskList)
      this.total = res.data.data.totalTaskNumber
      this.username = res.data.data.publisherName
      this.pagesize = 5
      // console.log(res.data)
      // 分割图片地址
      // res.data.records.forEach(task => {
      //   if (task.imagesPath.length !== 0) {
      //       task.imagesPath = task.imagesPath.split(';')
      //       task.imagesPath = task.imagesPath.slice(0, task.imagesPath.length - 1)
      //     // 每个图片加上基准地址
      //     for (var i = 0; i < task.imagesPath.length; i++) {
      //       task.imagesPath[i] = this.$baseURL + task.imagesPath[i]
      //     }
      //   } else {
      //     task.imagesPath = [require('../../assets/wutupian.jpg')]
      //   }
      // })
    },
    // 页码改变时刷新数据
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      // 再次根据currentPage获取数据
      this.getTaskList()
    },
    handleClassClick() {
      this.queryInfo.type = Number(this.activeClassName)
      this.currentPage = 1
      this.getTaskList()
    },
    // 跳转到详情页
    jumpToTask(id) {
      this.$router.push({path: '/Task', query: {id: id}}) // 通过this.$route.query.id获得id
    },
    // 发布按钮
    jumpToPubish() {
      this.$router.push('/PublishTask')
    },
    // 跳转到任务进展
    jumpToTaskProgress(id) {
      this.$router.push({path: '/TaskProgress', query: {id: id}})
    },
    // 删除任务
    async handleDelete(id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const res = await deleteTask({
        id: id
      })
      // console.log('删除任务返回值：', res)
      // const {data: res} = await this.$http.post('/afferentTaskPublish/delete/ByTaskID', this.qs.stringify({id: id}))
      if (res.status !== 200) return this.$message.error('删除任务失败！')
      this.$message.success('删除任务成功！')
      this.getTaskList()
    },
    // async getTypeOptions() {
    //   const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
    //   if (res.code !== 200) return this.$message.error('任务类型获取失败！')
    //   this.typeOptions = res.data
    // },
    async getTypeOptions() {
      // const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
      const res = await getType()
      // if (res.code !== 200) return this.$message.error('任务类型获取失败！')
      // console.log('获取任务类型', res.data)
      res.data.data.forEach((value) => this.typeOptions.push({label: value, value: value}))
      // console.log(this.typeOptions)
      // console.log('type', this.typeOptions)
      // this.typeOptions = res.data.data
    },
    // 点击编辑按钮
    async handleEdit (id) {
      this.taskId = id
      this.editForm.files = []
      const res = await getTaskDetail({id: id})
      // const {data: res} = await this.$http.get('/afferentTaskPublish/search/id?id=' + id)
      // if (res.code !== 200) return this.$message.error('获取任务列表失败！')
      // console.log('任务详情', res.data.data)
      // this.editForm.taskPublishVo = []
      // this.editForm.size = 0
      // let tmp = res.data.data
      // this.type = res.data.data.type
      // console.log('tmp', this.type)
      // tmp.startTime = tmp.startTime.split('.')[0].replace('T',' ')
      // tmp.endTime = tmp.endTime.split('.')[0].replace('T',' ')
      let tmpForm = res.data.data
      tmpForm.startTime = tmpForm.startTime.split('.')[0].replace('T',' ')
      tmpForm.endTime = tmpForm.endTime.split('.')[0].replace('T',' ')
      tmpForm.submitLimitCheck = tmpForm.submitLimit
      this.editForm = tmpForm // 将数据传入dialog页面
      // let imagesTmp = this.editForm.imagesPath
      // let tmp = []
      // let imagesArr = imagesTmp.split(',')
      // for (let j = 0;j < imagesArr.length;j++){
        //   tmp.push('http://101.34.16.47/resource' + imagesArr[j])
        // }
        // this.editForm.imagesPath = tmp
        // console.log('任务详情1', this.editForm)
        // this.editForm = Object.assign(res.data.afferentTaskPublish, res.data) // 将数据传入dialog页面
        // console.log('editForm', this.editForm)
        // console.log('editForm.taskPublishVo', this.editForm.taskPublishVo)
        // this.newEditDialogVisible = true
        // this.isDisabled = false
        const res1 = await getSmallTask({ bigTaskId: id })
        this.smallTask = res1.data.data.childTask
        // console.log('smalltask', res1.data.data.childTask)
        // 有提交者的情况
        if (res.data.data.currentPassed !== 0) {
          this.isDisabled = true
          this.editForm.taskDate = [new Date(this.editForm.startTime), new Date(this.editForm.endTime)]
        } else {
          // 没有提交者的情况
        this.isDisabled = false
        this.editForm.taskDate = [new Date(this.editForm.startTime), new Date(this.editForm.endTime)]
      }
      if (this.isDisabled) this.$message.error('已接受提交，无法编辑任务')
      this.newEditDialogVisible = true
      // this.getTypeOptions()
      var limit = []
      // 限制条件勾选框
      var dataStrArr = this.editForm.submitLimitCheck
      if (dataStrArr.charAt(0) === '1') {
        limit.push(0)
      }
      if (dataStrArr.charAt(1) === '1') {
        limit.push(1)
      }
      if (dataStrArr.charAt(2) === '1') {
        limit.push(2)
      }
      if (dataStrArr.charAt(3) === '1') {
        limit.push(3)
      }
      this.editForm.submitLimitCheck = limit
      // console.log(this.editForm.submitLimit, '1')
      this.typeOptions.forEach(option => {
        if (res.data.data.type === option.value) this.editForm.type = option.label
      })
      // 分割图片地址
      //   var pictureList = res.data.data.imagesPath
      //   // pictureList = pictureList.slice(0, pictureList.length - 1)
      //   // // 每个图片加上基准地址
      //   // for (var j = 0; j < pictureList.length; j++) {
      //   //   pictureList[j] = 'http://101.34.16.47/resource' + pictureList[j]
      //   // }
      //   this.editForm.files = pictureList.map(item => {
      //   return {
      //     name: item,
      //     url: item,
      //     raw: new File([item], item)
      //   }
      // })
      this.$refs.iframe.src = 'static/修改地址.html'
    },
    // 更新操作
    async handleUpdate() {
      this.isloading = true
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        var upData = new FormData()
        // 不能直接用editForm.files传，加到FormData里面去，一次性传
        if (this.editForm.files){
          this.editForm.files.forEach(function (file) {
          upData.append('images', file.raw) // 因为要上传多个文件，所以需要遍历一下才行
          // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
          // console.log(file)
          // console.log(file.raw)
        })
        }
        
        // for (var value of upData.values()) {
        //   console.log('value', value);
        // }
        // console.log('images', up)
        var strlimit = this.editForm.submitLimitCheck
        // console.log(this.editForm.submitLimit, '2')
        var submitLimit = []
        if (strlimit.some(item => item === 0)) submitLimit[0] = 1
        else submitLimit[0] = 0
        if (strlimit.some(item => item === 1)) submitLimit[1] = 1
        else submitLimit[1] = 0
        if (strlimit.some(item => item === 2)) submitLimit[2] = 1
        else submitLimit[2] = 0
        if (strlimit.some(item => item === 3)) submitLimit[3] = 1
        else submitLimit[3] = 0
        // console.log(submitLimit)
        // // 将submitLimit转为字符串再传
        submitLimit = submitLimit.join('')
        // console.log('submitlimit', submitLimit)
        // 上传数据
        // upData.append('startTime', this.taskDate[0].format('yyyy-MM-ddThh:mm:ss.000+00:00'))
        // upData.append('endTime', this.taskDate[1].format('yyyy-MM-ddThh:mm:ss.000+00:00'))
        // upData.append('type', this.editForm.type)
        // upData.append('title', this.editForm.title)
        // upData.append('details', this.editForm.details)
        // upData.append('size', this.editForm.size)
        // upData.append('longitude', this.editForm.longitude)
        // upData.append('latitude', this.editForm.latitude)
        // upData.append('maxPassed', this.editForm.maxPassed)
        // upData.append('submitLimit', submitLimit)
        // upData.append('publisherId', this.userId)
        // console.log('发布信息' + JSON.stringify(upData))
        // this.$http.post('/taskPublish/create', upData).then(res => {
        // console.log("upData", upData.keys())       
        // for (var value of upData.values()) {
        //   console.log(value);
        // }
        // const jsonData = this.jsonData(upData)
        this.editForm.submitLimit = submitLimit
        // console.log('submitlimit', this.editForm.submitLimit)
        // this.editForm.publisherId = this.userId
        this.editForm.startTime = new Date(this.editForm.startTime).format('yyyy-MM-ddThh:mm:ss.000+00:00')
        this.editForm.endTime = new Date(this.editForm.endTime).format('yyyy-MM-ddThh:mm:ss.000+00:00')
        delete this.editForm.taskDate
        // console.log('submitlimit', this.editForm.submitLimit)
        delete this.editForm.imagesPath
        this.editForm.rootId = -1
        const res = await updateTask(this.editForm)
        // console.log('this.editForm', this.editForm)
        // console.log("bigtask", res)
        // console.log('rootId', res.data.data)
        const res1 = await uploadTaskImages( upData, this.taskId )
        // console.log('image', res1)
        for (let i= 0;i < this.smallTask.length;i++) {
          const res = await deleteTask({ id: this.smallTask[i].id })
          // console.log('delete', res)
        }
          // if (this.editForm.files) {
          //   for (let i = 0; i < this.editForm.files.length;i++) {
          //     // 新建一个FormData
          //     var upData = new FormData()
          //     // var upData = {}
          //     // 不能直接用editForm.files传，加到FormData里面去，一次性传
          //     const file = this.editForm.files[i]
          //     upData.append('images', file.raw, file.name) // 因为要上传多个文件，所以需要遍历一下才行
          //     // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
          //     // console.log(file)
          //     // console.log(file.raw)
          //     uploadTaskImages(
          //       upData,
          //       res.data.data,
          //     ).then(res => {
          //       console.log('images', res)
          //     })
          //   }
          // }
        this.editForm.rootId = this.taskId
        // console.log('smalltaskinfo1', this.editForm)
        for (let i = 0;i < this.coordinate.length;i++){
          // upData.append('longitude', this.editForm.coordinate[i][0])
          // upData.append('latitude', this.editForm.coordinate[i][1])
          // let jsonData = this.jsonData(upData)
          // console.log(jsonData)
          this.editForm.longitude = this.coordinate[i][0]
          this.editForm.latitude = this.coordinate[i][1]
          // console.log('smalltaskinfo2', this.editForm)
          const res = await publishTask(this.editForm)
          // console.log("smalltask", res)
          if (i === this.coordinate.length - 1 && res.data.code === 200) {
            this.isloading = false
            this.$message.success('任务更新成功')
          }
          if (i === this.coordinate.length - 1 && res.data.code != 200) {
            this.isloading = false
            this.$message.error('任务更新失败')
          }
        }
          this.$refs.editFormRef.resetFields()
          // 清空文件
          this.$refs.upload.clearFiles()
          this.newEditDialogVisible = false
          this.isDisabled = false
          // this.$refs.iframe.src = 'static/选择地址.html'
          this.$refs.iframe.src = 'static/修改地址.html'
        // }).catch(error => {
        //   console.log(error.response)
        //   this.$message.error('更新任务失败！请重试')
        //   this.isDisabled = false
        // })
      // 上传数据
      //   var type = this.editForm.type
      //   this.typeOptions.forEach(option => {
      //     if (this.editForm.type === option.content) type = option.value
      //   })
      //   // window.addEventListener('message', function(event) {
      //   //   const data = event.data
      //   //   this.editForm.coordinate = data.coordinate
      //   //   this.editForm.size = data.size
      //   //   // const contrast = '(' + data.lat + ',' + data.lng + ');'
      //   //   // if (this.editForm.coordinate.indexOf(contrast) === -1) {
      //   //   // this.editForm.coordinate = this.editForm.coordinate + '(' + data.lat + ',' + data.lng + ');'
      //   //   // } else {
      //   //   // this.editForm.coordinate = this.editForm.coordinate.replace(contrast, '')
      //   //   // }
      //   //   // console.log('经纬度', this.editForm.coordinate)

      //   //   // this.editForm.longitude = data.lng
      //   //   // this.editForm.latitude = data.lat
      //   //   // console.log('经纬度' + this.editForm.longitude)
      //   // })
      //   upData.append('startTime', new Date(this.editForm.startTime).format('yyyy-MM-dd hh:mm:ss'))
      //   upData.append('endTime', new Date(this.editForm.endTime).format('yyyy-MM-dd hh:mm:ss'))
      //   upData.append('type', type)
      //   upData.append('title', this.editForm.title)
      //   upData.append('details', this.editForm.details)
      //   // upData.append('longitude', parseFloat(this.editForm.longitude))
      //   // upData.append('latitude', parseFloat(this.editForm.latitude))
      //   console.log(this.editForm.coordinate, this.editForm.size)
      //   upData.append('coordinate', this.editForm.coordinate)
      //   upData.append('size', this.editForm.size)
      //   upData.append('publisherId', this.userId)
      //   upData.append('maxPassed', this.editForm.maxPassed)
      //   // 这么写真的好恶心阿
      // var submitlimit = []
      //   var strlimit = this.editForm.submitLimit
      //   if (strlimit.some(item => item === 0)) submitlimit[0] = 1
      //   else submitlimit[0] = 0
      //   if (strlimit.some(item => item === 1)) submitlimit[1] = 1
      //   else submitlimit[1] = 0
      //   if (strlimit.some(item => item === 2)) submitlimit[2] = 1
      //   else submitlimit[2] = 0
      //   if (strlimit.some(item => item === 3)) submitlimit[3] = 1
      //   else submitlimit[3] = 0
      //   // 将submitLimit转为字符串再传
      //   upData.append('submitLimit', submitlimit.join(''))
      //   upData.append('id', this.editForm.id)
      //   // 贡献值设置
      //   upData.append('integration', 12)
      //   const {data: res} = await this.$http.post('/afferentTaskPublish/edit/afferentTaskPublish', upData)
      //   if (res.code !== 200) return this.$message.error('更新任务失败！')
      //   this.$message.success('更新任务成功！')
      //   this.$refs.editFormRef.resetFields()
      //   this.newEditDialogVisible = false
      //   // 刷新数据列表
        this.getTaskList()
      })
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.imageDialogVisible = true
    },
     // 改变图片
    async handleChange(file, fileList) {
      this.editForm.files = fileList
      if (this.beforeUpload(file.raw)) {
        // beforeUpload返回的是个promise对象，要用await解构出来拿到PromiseResult值。这个居然整了好久！！给忘了
        file = await this.compresspic.compressAccurately(file.raw, 200)
        // console.log(file)
        fileList[fileList.length - 1].raw = file
      }
      // console.log(this.file)
      this.editForm.files = fileList
      // console.log('files', this.editForm.files)
    },
    // 图片数量限制
    exceed(file, fileList) {
      this.$message.error('最多上传5张图片哦！')
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
          const i = this.editForm.files.findIndex(x => x.uid === fileuid)
          // 3.调用splice方法，移除图片信息
          this.editForm.files.splice(i, 1)
          this.$refs.upload.uploadFiles = this.editForm.files
          return false
      }
      if (!isLt10M) {
          this.$message.error('上传图片大小不能超过4MB!')
          // 1.获取将要删除图片的临时路径
          const fileuid = file.uid
          // 2.从pics数组中，找到图片对应的索引值
          const i = this.editForm.files.findIndex(x => x.uid === fileuid)
          // 3.调用splice方法，移除图片信息
          this.editForm.files.splice(i, 1)
          this.$refs.upload.uploadFiles = this.editForm.files
          return false
      }
      return this.compresspic.compressAccurately(file, 200)
    },
    handleSuccess(res, file) {
      // console.log('上传成功')
      this.$refs.upload.uploadFiles = this.editForm.files
      this.$forceUpdate()
      // this.editForm.files += URL.createObjectURL(file)
    },
    async addPicture(params) {
      var file = params.file
      if (this.beforeUpload(file)) {
        // beforeUpload返回的是个promise对象，要用await解构出来拿到PromiseResult值。这个居然整了好久！！给忘了
      var result = await this.beforeUpload(file)
      var formData = new FormData()
      formData.append('id', this.editForm.id)
      formData.append('files', result)
        const {data: res} = await this.$http.post('/afferentTaskPublish/edit/taskPublish/AddImage', formData)
        if (res.code !== 200) {
          //  上传失败后清除当前上传的图片
          this.$refs.upload.clearFiles()
          return this.$message.error('添加图片失败！')
        }
        // console.log(res.data)
        // 得拿到后端重命名的地址，不然无法在这里进行删除图片操作
        // 分割图片地址
        var pictureList = res.data.split(';')
        pictureList = pictureList.slice(pictureList.length - 2, pictureList.length - 1)
        this.editForm.files[this.editForm.files.length - 1].name = pictureList[0]
      }
    },
    beforeRemove(file, fileList) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          //  执行删除操作
          this.handleRemove(file, fileList)
        }).catch(() => {
        this.$message({
            type: 'info',
            message: '已取消删除'
        })
        })
        return false
    },
    // 删除图片
    async handleRemove(file, fileList) {
      var index = file.name.lastIndexOf('/')
      var filename = file.name.substring(index + 1, file.name.length)
      // const {data: res} = await this.$http.post('/afferentTaskPublish/edit/afferentTaskPublish/deleteImage', this.qs.stringify({id: this.editForm.id, idPath: filename}))
      // if (res.code !== 200) return this.$message.error('删除图片失败！')
      this.$message.success('删除图片成功！')
      // 1.获取将要删除图片的临时路径
      const fileuid = file.uid
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.editForm.files.findIndex(x => x.uid === fileuid)
      // 3.调用splice方法，移除图片信息
      this.editForm.files.splice(i, 1)
      this.$refs.upload.uploadFiles = this.editForm.files
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.newEditDialogVisible = false
            this.$refs.editFormRef.resetFields()
            // this.$refs.iframe.location.reload(true)
            // this.$refs.iframe.clearFiles()
            // 清空文件
            this.$refs.upload.clearFiles()
            this.getTaskList()
            done()
          })
          .catch(_ => {})
      },
    // 获取经纬度数据，重新选择地址时触发
    handleMessage(event) {
      const data = event.data
      // console.log('00000', this.editForm.coordinate)
      this.coordinate = data.coordinate
      // console.log('11111', this.editForm.coordinate)
      this.editForm.size = data.size
      // console.log('22222', this.editForm.size)
    },
    // 重新选择任务地址
    // updateLocation() {
    //   this.$nextTick(() => {
    //   console.log(this.$refs.iframe)
    //   // setTimeout(() => {
    //     // this.$refs.iframe.removeAttribute('src')
    //     this.$refs.iframe.setAttribute('src', 'static/选择地址.html')
    //     // this.$refs.iframe.contentWindow.location.reload(true)
    //   // }, 1)
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.MyPublishBox{
  // width: 1175px;
  // height: 962px;
  width: 100%;
  font-weight: lighter;
  color:#999999;
  .header{
    // display: flex;
    justify-content: space-between;
  }
  .publishbtn{
      position: absolute;
      top: -10px;
      right: 10px;
    }
  .taskItem{
    // border-top: 0.5px solid #e4e7ed;
    border-left: 0.5px solid #e4e7ed;
    border-right: 0.5px solid #e4e7ed;
    .context{
    // margin:0 10px;
    border-right: 1px solid #e4e7ed;
    &:hover{
      cursor: pointer;
      background-color: rgba(242, 242, 242, 1);
    }
  }
  }
  .taskImg{
    width:90%;
    height: 130px;
    display: inline-block;
    margin:10px 10px;
  }
  .text{
    margin:15px 10px;

  }
  .boldtext{
    margin-top: 10px;
    font-weight: bold;
    color: #666666;
    white-space: nowrap;  /*强制span不换行*/
    // display: inline-block;  /*将span当做块级元素对待*/
    width: 260px;  /*限制宽度*/
    overflow: hidden;  /*超出宽度部分隐藏*/
    text-overflow: ellipsis;  /*超出部分以点号代替*/
    line-height: 0.9;  /*数字与之前的文字对齐*/
  }
  .progress{
    display: inline-block;
    width: 250px;
    margin-left: 20px;
  }
  .operation{
    margin-top: 60px;
  }
  .middlerow{
    position: relative;
    top: 20px;
    width: 100%;  /*限制宽度*/
    overflow: hidden;  /*超出宽度部分隐藏*/
    text-overflow: ellipsis;  /*超出部分以点号代替*/
    display: inline-block;
    display: -webkit-box;
    -webkit-line-clamp: 1; // 因为通过高度所以只显示一行，溢出显示省略号
    -webkit-box-orient: vertical;
    word-break: break-all;//英文数字折行
    // white-space: nowrap;  /*强制span不换行*/
      // display: inline-block;  /*将span当做块级元素对待*/
    .content{
      line-height: 30px;
    }
  }
  .bottomrow{
    position: absolute;
    width: 72%;
    top: 70%;
    line-height: 40px;
    .fuck{
      display: flex;
      align-items: center;
    }
    .endtime{
      margin-left: 3%;
    }
    .taskpro{
      width: 35%;
      display:flex;
      align-items: center;
    // font: 14px;
    // font-weight: 700;
    // color: #555;
  }
  .progress{
    display: inline-block;
    width: 220px;
    margin-left: 0px;
    margin-right: 2%;
  }
  }
//   .el-divider--horizontal {
//     margin-top: 0;
//     margin-bottom: 0;
//     border: 0.5px solid #e4e7ed;
//   }
//   .el-divider--vertical {
//   display: inline-block;
//   width: 1px;
//   height: 175px;
//   // top: -34px;
//   // margin: 0 8px;
//   // vertical-align: middle;
//   // position: absolute;
// }
  .selectAdress{
    width: 100%;
    height: 200px;
  }
  .taskAdress{
    width: 100%;
    height: 300px;
  }
  .edit_tip{
    font-size: 12px;
    color: #606266;
    margin-bottom: 30px;
  }
  .disabled /deep/.el-upload--picture-card{
    display: none;
  }
  .mask{
    position:absolute;
    width:100%;
    height:100%;
    z-index:1;
    filter:alpha(opacity=0);
    opacity:0.7;
    background:#ffffff}
}
</style>