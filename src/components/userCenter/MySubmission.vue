<template>
  <div class="MySubmissionBox">
    <el-card>
      <el-row>
        <!-- 标签页 -->
        <el-tabs v-model="activeClassName" @tab-click="handleClassClick">
          <el-tab-pane :label="'待审核'" :name="0+''"></el-tab-pane>
          <el-tab-pane :label="'已通过'" :name="1+''"></el-tab-pane>
          <el-tab-pane :label="'不合格'" :name="2+''"></el-tab-pane>
          <el-tab-pane :label="'全部'" :name="-1+''"></el-tab-pane>
        </el-tabs>
          <!-- <el-button v-if="activeClassName==='2'" class="deletebtn" type="text" @click="jumpToPubish()">一键清空</el-button> -->
      </el-row>
      <el-table :data="taskList"
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}"
      border stripe style="width: 100%">
        <el-table-column label="任务名称" style="width: 20%">
          <template slot-scope="scope">
          <div @click="jumpToTask(scope.row.taskPublishId)" style="cursor: pointer;">
            <!-- {{ scope.row.title }} -->
            {{ scope.row.taskName }}
          </div>
        </template>
        </el-table-column>
        <el-table-column sortable label="提交时间" prop="submitTime" width="180"></el-table-column>
        <el-table-column label="提交描述" prop="description" width="230"
      :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="数值" prop="number" width="100"></el-table-column>
        <el-table-column label="文件" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onPreview(scope.row)">
            <i class="el-icon-view el-icon--right"></i> 查看</el-button>
            <el-image-viewer
            v-show="showViewer"
            :on-close="closeViewer"
            :url-list="srcList">
            </el-image-viewer>
        </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" style="width: 15%" v-if="activeClassName==='-1'">
          <template slot-scope="scope">
            <ul v-if="scope.row.status === 0" style="float:left">
              <li style="color:#0079FE">
                <span id="fontstyle1">待审核</span>
              </li>
            </ul>
            <ul v-if="scope.row.status === 1" style="float:left">
              <li style="color:#4BD863">
                <span id="fontstyle1">已通过</span>
              </li>
            </ul>
            <ul v-if="scope.row.status === 2" style="float:left">
              <li style="color:#d9001b">
                <span id="fontstyle1">不合格</span>
              </li>
            </ul>
            <ul v-if="scope.row.status === 3" style="float:left">
              <li style="color:#c0c4cc">
                <span id="fontstyle1">已失效</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="activeClassName!=='-1'">
        <template slot-scope="scope">
            <!-- <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" v-if="activeClassName==='0'">编辑</el-button> -->
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.submitId)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :current-page="currentPage"
      :page-size="pagesize">
    </el-pagination>
    </el-card>
    <!-- 编辑弹出的对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="60%"
      :before-close="handleClose"
      class="edit-form">
        <!-- :rules="editFormRules" -->
      <el-form label-width="80px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="left">
        <el-form-item v-if="textDescription" label="提交描述" prop="textDescription"
        :rules="[{required: textDescription, message: '请输入数据的文字描述', trigger: 'blur' }]">
          <el-input type="textarea" rows="5" v-model="editForm.textDescription" :disabled="flower"></el-input>
        </el-form-item>
        <el-form-item v-if="numericalValue" label="数值" prop="numericalValue" :rules="[{required: numericalValue, message: '请输入数值数据', trigger: 'blur' }]">
          <el-input-number controls-position="right" :precision="2" v-model="editForm.numericalValue" placeholder="数值" :min="0" :max="10000"></el-input-number>
        </el-form-item>
      <el-form-item v-if="filesPath" label="文件"
      :rules="[{required: filesPath, message: '请提交文件数据', trigger: 'blur' }]">
        <el-upload
          action="#"
          ref="upload"
          :multiple="true"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :http-request="addPicture"
          :before-remove="beforeRemove"
          :file-list="editForm.filesPath"
          :on-success="handleSuccess"
          accept=".jpg, .jpeg, .png, .gif"
          :limit="fileLimit"
          :on-exceed="exceed">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg,jpeg,png文件，单张不超过2MB,最多可上传{{fileLimit}}张</div>
        </el-upload>
        <el-dialog :visible.sync="imageDialogVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="place" label="任务地址" prop="place">
    <iframe ref="iframe" name="selectAdress" src="static/修改地址.html" frameborder="0" scrolling="no" class="taskAdress"></iframe>
    <el-row>
      <!-- <button @click="updateLocation">重新选择任务地址</button> -->
    </el-row>
  </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSubmitList } from '@/api/userTask'
import { deleteSubmit } from '@/api/submit'

import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { ElImageViewer },
  created() {
    this.getTaskList()
  },
  activated() {
   this.$route.meta.keepAlive = false
    this.getTaskList()
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
  },
  updated() {
    if (this.$refs.iframe) {
      this.$nextTick(() => {
        const mapFrame = this.$refs.iframe
        if (mapFrame.attachEvent) { // 兼容浏览器判断
          mapFrame.attachEvent('onload', function() {
            const iframeWin = mapFrame.contentWindow
            iframeWin.postMessage({latitude: this.editForm.latitude, longitude: this.editForm.longitude}, '*')
          })
        } else {
          mapFrame.onload = () => {
            const iframeWin = mapFrame.contentWindow
            iframeWin.postMessage({latitude: this.editForm.latitude, longitude: this.editForm.longitude}, '*')
          }
        }
          })
    }
  },
  data() {
    return {
      flower: false,
      fileLimit: 5,
      showViewer: false,
      srcList: [],
      textDescription: false,
      numericalValue: false,
      filesPath: false,
      place: false,
      defaultImg: require('../../assets/wutupian.jpg'),
      activeClassName: 0,
      editDialogVisible: false,
      dialogImageUrl: '',
      imageDialogVisible: false,
      total: 0,
      pagesize: 5,
      queryInfo: {
        current: 1,
        pageSize: 5,
        status: ''
      },
      // 当前的页数
      currentPage: 1,
      submit_id: this.userId,
      type: 0,
      taskList: [], // 提交任务列表
      // 编辑表单的数据绑定对象
      editForm: {
        id: '',
        textDescription: '',
        numericalValue: ''
      },
      // 有些字段的验证写在上面才有效
      editFormRules: {
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
      }
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // console.log(to)
  //   if (to.path === '/Task' || to.path === '/TaskProgress') {
  //     from.meta.keepAlive = true
  //     // console.log('to.path === /task')
  //   } else from.meta.keepAlive = false
  //     next()
  // },
  methods: {
    async getTaskList() {
      if (this.activeClassName !== '-1') this.queryInfo.status = Number(this.activeClassName)
      else this.queryInfo.status = ''
      this.queryInfo.current = this.currentPage
      const res = await getSubmitList(this.queryInfo)
      // console.log('获取当前用户提交任务列表返回值:', res)
      this.textDescription = false
      this.numericalValue = false
      this.filesPath = false
      this.place = false
      this.type = this.activeClassName
      if (res.data.code !== 200) return this.$message.error('获取任务列表失败！')
      this.taskList = res.data.data.taskSubmitDetails
      this.total = res.data.data.numberOfSubmit
      // console.log(this.taskList)
      // 分割图片地址
      this.taskList.forEach((task, index) => {
        if (task.status === 3) this.taskList.splice(index, 1)
        
        if (task.filesPath) {
          task.filesPath = task.filesPath.split(';')
          // 每个图片加上基准地址
          for (var i = 0; i < task.filesPath.length; i++) {
            task.filesPath[i] = this.$baseURL + task.filesPath[i]
          }
          task.filesPath = task.filesPath.slice(0, task.filesPath.length - 1)
        } else {
          task.filesPath = [require('../../assets/wutupian.jpg')]
        }
      })
      // console.log('我的提交列表')
      // console.log(this.taskList)
      // this.pagesize = res.data.size
  },
  // 编辑按钮
    async handleEdit (row) {
      this.editDialogVisible = true // dialog对话窗口打开
      // console.log(row)
      // 如果是花见任务
      // if (row.taskPublishId === 1) {
      //   // this.dataSubmitForm.text = '茉莉花2，油菜花3，梅花4，钟花樱桃5，桃花6，郁金香7，冰岛罂粟8，菊花9，荷花10，马鞭草11'
      //   this.fileLimit = 1
      //   this.flower = true
      // }
      // this.editForm = row // 将数据传入dialog页面
      const {data: res} = await this.$http.get('/taskSubmit/SelectSubmitBySubmitID?submit_id=' + row.id)
      if (res.code !== 200) return this.$message.error('获取任务列表失败！')
      // 为了获取提交要求
      const {data: res1} = await this.$http.get('/taskPublish/search/id?id=' + res.data.taskPublishId)
      // 限制条件勾选框
      var dataStrArr = res1.data.submitLimit
      // for (var i = 0; i < dataStrArr.length; i++) {
        if (dataStrArr.charAt(0) === '1') this.textDescription = true
        if (dataStrArr.charAt(1) === '1') this.numericalValue = true
        if (dataStrArr.charAt(2) === '1') this.filesPath = true
        if (dataStrArr.charAt(3) === '1') {
          this.place = true
          this.editFormRules.place[0].required = true
        }
      // }
      // 分割图片地址
      var pictureList = res.data.filesPath.split(';')
      // console.log(pictureList)
      pictureList = pictureList.slice(0, pictureList.length - 1)
      // 每个图片加上基准地址
      for (var j = 0; j < pictureList.length; j++) {
        pictureList[j] = this.$baseURL + pictureList[j]
      }
      res.data.filesPath = pictureList.map(item => {
        return {
          name: item,
          url: item,
          raw: new File([item], item)
        }
      })
      this.editForm = res.data
      this.$refs.iframe.src = 'static/修改地址.html'
      // console.log(row)
      },
      // 更新
      async handleUpdate() {
        var upData = new FormData()
        // console.log(this.editForm)
        upData.append('id', this.editForm.id)
        if (this.textDescription) upData.append('text_description', this.editForm.textDescription)
        if (this.numericalValue) upData.append('numerical_value', parseFloat(this.editForm.numericalValue))
        if (this.place) {
          upData.append('longitude', parseFloat(this.editForm.longitude))
          upData.append('latitude', parseFloat(this.editForm.latitude))
        }
        // upData.append('title', this.editForm.title)
        const {data: res} = await this.$http.post('/taskSubmit/edit/Submit', upData)
        //  console.log(res)
          if (res.code !== 200) return this.$message.error('更新任务信息失败！')
          // 提示修改成功
          this.$message.success('更新任务信息成功！')
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getTaskList()
      },
  // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.imageDialogVisible = true
    },
     // 改变图片
    handleChange(file, fileList) {
      // console.log('改变图片')
      this.editForm.filesPath = fileList
      // console.log(this.editForm.filesPath)
    },
    // 图片数量限制
    exceed(file, fileList) {
      this.$message.error('最多上传' + this.fileLimit + '张图片哦！')
    },
    async addPicture(params) {
      // console.log('添加图片')
      // console.log(params)
      var file = params.file
     if (this.beforeUpload(file)) {
        // beforeUpload返回的是个promise对象，要用await解构出来拿到PromiseResult值。这个居然整了好久！！给忘了
        var result = await this.beforeUpload(file)
        var formData = new FormData()
        formData.append('id', this.editForm.id)
        formData.append('files', result)
        const {data: res} = await this.$http.post('/taskSubmit/edit/taskSubmit/AddImage', formData)
        if (res.code !== 200) {
          //  上传失败后清除当前上传的图片
          this.$refs.upload.clearFiles()
          return this.$message.error('添加图片失败！')
        }
        // console.log('添加成功')
        // console.log(res.data)
        // 得拿到后端重命名的地址，不然无法在这里进行删除图片操作
        // 分割图片地址
        var pictureList = res.data.split(';')
        pictureList = pictureList.slice(pictureList.length - 2, pictureList.length - 1)
        this.editForm.filesPath[this.editForm.filesPath.length - 1].name = pictureList[0]
        // console.log(this.editForm.filesPath)
      }
    },
    // 图片上传前的操作
    beforeUpload(file) {
      // console.log('图片上传前')
      // console.log(file)
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
          // console.log(this.editForm.files)
          // console.log(this.$refs.upload.uploadFiles)
          this.$refs.upload.uploadFiles = this.editForm.files
          return false
      }
      if (!isLt10M) {
          this.$message.error('上传图片大小不能超过2MB!')
          // 1.获取将要删除图片的临时路径
          const fileuid = file.uid
          // 2.从pics数组中，找到图片对应的索引值
          const i = this.editForm.files.findIndex(x => x.uid === fileuid)
          // 3.调用splice方法，移除图片信息
          this.editForm.files.splice(i, 1)
          // console.log(this.editForm.files)
          // console.log(this.$refs.upload.uploadFiles)
          this.$refs.upload.uploadFiles = this.editForm.files
          return false
      }
      return this.compresspic.compressAccurately(file, 200)
    },
    handleSuccess(res, file) {
      // console.log('上传成功')
      this.$refs.upload.uploadFiles = this.editForm.filesPath
      this.$forceUpdate()
      // this.editForm.files += URL.createObjectURL(file)
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
      // console.log(filename)
      const {data: res} = await this.$http.post('/taskSubmit/edit/taskSubmit/deleteImage', this.qs.stringify({id: this.editForm.id, idPath: filename}))
      if (res.code !== 200) return this.$message.error('删除图片失败！')
      this.$message.success('删除图片成功！')
      // 1.获取将要删除图片的临时路径
      const fileuid = file.uid
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.editForm.filesPath.findIndex(x => x.uid === fileuid)
      // 3.调用splice方法，移除图片信息
      this.editForm.filesPath.splice(i, 1)
      this.$refs.upload.uploadFiles = this.editForm.filesPath
      // this.$forceUpdate()
    },
  // 页码改变时刷新数据
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      // 再次根据currentPage获取数据
      this.getTaskList()
    },
    handleClassClick() {
      this.type = Number(this.activeClassName)
      this.currentPage = 1
      this.getTaskList()
    },
    handleClick() {
      this.$confirm('是否删除此提交', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.editDialogVisible = false
            this.$refs.editFormRef.resetFields()
            this.$refs.iframe.clearFiles()
            // 清空文件
            this.$refs.upload.clearFiles()
            this.getTaskList()
            done()
          })
          .catch(_ => {})
      },
      // 点击按钮预览图片
    //   showPicture(row) {
    //   // 调用image组件中的大图浏览图片方法
    //     this.imageUrl = []
    //     console.log(row)
    //     this.imageUrl.push(row.filesPath)
    //     this.$refs.imageRef.clickHandler()
    // },
    // 预览图片
    onPreview(row) {
      row.filesPath = []
        // console.log('filePath', typeof(task.filePath), task.filePath, typeof(task.filePath) != 'object')
        // console.log()
      if (typeof (row.filePath) != 'object') {
        row.filePath = row.filePath.split(',')
        // task.filePath = task.filePath.slice(0, task.filePath.length - 1)
        // 每个图片加上基准地址
        for (var i = 0; i < row.filePath.length; i++) {
          row.filesPath[i] = ('http://101.34.16.47/resource' + row.filePath[i])
          // console.log('filesPath', typeof(task.filesPath), task.filesPath)
        }
      }
      this.srcList = row.filesPath
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
     this.showViewer = false
    },
      // 删除任务
    async handleDelete(id) {
      // 弹框提示用户是否要删除
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该提交信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // const {data: res} = await this.$http.post('/taskSubmit/delete/BySubmitId', this.qs.stringify({id: id}))
      const res = await deleteSubmit({ id: id })
      // console.log('delete', res)
      if (res.data.code !== 200) return this.$message.error('删除任务失败！')
      this.$message.success('删除任务成功！')
      this.getTaskList()
    },
    // 重新选择任务地址
    updateLocation() {
      // console.log(this.$refs.iframe.src)
      this.$nextTick(() => {
        // setTimeout(() => {
        // this.$refs.iframe.src = 'static/选择地址.html'
        this.$refs.iframe.setAttribute('src', 'static/选择地址.html')
        // this.$refs.iframe.contentWindow.location.reload(true)
      // }, 200)
      })
    },
    // 获取经纬度数据
    handleMessage(event) {
      const data = event.data
      if (data.lat) {
        this.editForm.longitude = data.lng
        this.editForm.latitude = data.lat
      }
    },
    // 跳转到详情页
    jumpToTask(id) {
      this.$router.push({path: '/Task', query: {id: id}}) // 通过this.$route.query.id获得id
    }
  }
}

</script>

<style lang="less" scoped>

.MySubmissionBox{
  .el-table{
    font-size: 14px;
    color: #666666;
  }
}
.el-pagination{
  text-align: center;
  margin-top: 25px;
}
.show{
  vertical-align:middle;
    text-align: center;
}
.selectAdress{
    width: 100%;
    height: 200px;
  }
  .taskAdress{
    width: 100%;
    height: 300px;
  }
  .deletebtn{
      position: absolute;
      top: -5px;
      right: 10px;
    }
/*隐藏el-image图片组件中不需要展示的的img标签*/
// .hideImgDiv {
//   /deep/ .el-image__inner {
//     display: none;
//   }
// }
/deep/ .el-upload-list__item.is-success.focusing .el-icon-close-tip{
  display: none !important;
  }
</style>
