<template>
  <div class="MyCollectionBox">
    <div class="header">
      <el-card>
        <el-row>
          <!-- Tabs标签页 -->
          <!-- <el-col :span="8"> -->
            <el-tabs
             v-model="activeClassName"
             @tab-click="handleClassClick">
              <!-- <el-tab-pane :label="'进行中'" :name="0+''"></el-tab-pane> -->
              <el-tab-pane
              :label="'已完成'"
              :name="1+''"></el-tab-pane>
              <el-tab-pane
              :label="'已失效'"
              :name="2+''"></el-tab-pane>
              <!-- <el-tab-pane :label="'全部'" :name="-1+''"></el-tab-pane> -->
            </el-tabs>
          <!-- </el-col> -->
        </el-row>
        <div v-for="(item, i) in taskList" :key="item.id"
        :class="['bdbottom', i === 0 ? 'bdtop': '', 'taskItem']">
          <el-row :gutter="20">
          <!-- 用栅栏布局 左半边图片文字部分-->
            <el-col :span="18">
              <el-row class="context">
                <!-- 图片 -->
                <el-col :span="6">
                  <div>
                    <el-image
                    fit="cover"
                    :src="item.task.imagesPath[0]"
                    class="taskImg"
                    :preview-src-list="item.task.imagesPath">
                    </el-image>
                  </div>
                </el-col>
                <div @click="jumpToTask(item.taskId)">
                  <!-- 文字 -->
                  <el-col :span="16" class="text">
                    <!-- 标题 -->
                    <el-row type="flex" justify="space-between">
                      <el-col>
                        <span class="boldtext">{{item.task.title}}</span>
                      </el-col>
                    </el-row>
                    <el-row class="middlerow">
                      <!-- <el-tooltip placement="top" :disabled="!tooltipFlag" ref="tlp" :content="item.details">
                      <span class="content" @mouseenter="visibilityChange($event)">{{item.details}}</span>
                      </el-tooltip> -->
                      <span class="content">{{item.task.details}}</span>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="bottomrow">
                        <div class="fuck">
                          <el-avatar icon="el-icon-user-solid" :size="30" style="margin-right:5px">
                          </el-avatar>
                          {{item.task.publisherInfo.phone}}
                          </div>
                        <div class="endtime">
                          <span class="boldtext">任务结束时间：</span><i class="el-icon-time" ></i>&nbsp;{{item.task.updateTime.slice(0,10)}} {{item.task.updateTime.slice(11,19)}}
                        </div>
                    </el-row>
                  </el-col>
              </div>
              </el-row>
            </el-col>
            <!-- 右半边操作部分 -->
            <el-col :span="6" class="operation">
              <!-- 删除按钮 -->
                <el-button type="danger" @click="DeleteFavorite(item.taskId)">取消收藏</el-button>
            </el-col>
          </el-row>
    </div>
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="pagesize"
      :page-total="pagecount"
      >
    </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getCompletedCollection, getUnCompletedCollection, deleteCollect } from '@/api/collect'
// eslint-disable-next-line no-extend-native
// Date.prototype.format = function(format) {
//   var o = {
//   'M+': this.getMonth() + 1, // month
//   'd+': this.getDate(), // day
//   'h+': this.getHours(), // hour
//   'm+': this.getMinutes(), // minute
//   's+': this.getSeconds(), // second
//   'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
//   'S': this.getMilliseconds() // millisecond
//   }
//   if (/(y+)/.test(format)) {
//   format = format.replace(RegExp.$1,
//   (this.getFullYear() + '').substr(4 - RegExp.$1.length))
//   }
//   for (var k in o) {
//   if (new RegExp('(' + k + ')').test(format)) {
//   format = format.replace(RegExp.$1,
//   RegExp.$1.length === 1 ? o[k]
//   : ('00' + o[k]).substr(('' + o[k]).length))
//   }
//   }
//   return format
// }

export default {
 async created() {
    this.getTaskList()
  },
  activated() {
   this.$route.meta.keepAlive = false
    this.getTaskList()
    // console.log('activated')
    // console.log(this.$route.meta.keepAlive)
  },
  mounted() {
  },
  data() {
    return {
      tooltipFlag: false,
      imagePaths: '',
      submitter: '', // 1：有提交者，0：没有提交者
      total: 0,
      pagesize: 10,
      pagecount: 10,
      queryInfo: {
        // 当前的页数
        currentPage: 1,
        userId: this.userId,
        status: ''
      },
      activeClassName: '1',
      taskList: [],
      watch: {
        endTime: function () {
          // console.log('时间change')
          // this.editForm.endTime.format('yyyy-MM-dd hh:mm:ss')
        }
      }
    }
  },
  methods: {
    async getTaskList() {
      this.queryInfo.status = Number(this.activeClassName)
      if (this.activeClassName === '1') {
        const res = await getCompletedCollection({
              current: 1,
              pageSize: 10
          })
        // console.log('已完成收藏列表：', res)
        this.taskList = res.data.data.records
      } else {
        const res1 = await getUnCompletedCollection({
              current: 1,
              pageSize: 10
          })
        // console.log('未完成收藏列表：', res1)
        this.taskList = res1.data.data.records
      }
      this.total = this.taskList.length
      // console.log(this.total)

      // if (!res.data.length) {
      //   // this.total = 0
      //   // this.taskList = []
      // } else {
      //   this.taskList = res.data
      //   // 分割图片地址
        this.taskList.forEach(task => {
        // this.pagecount = task.page
        // this.total = task.totalNum
        if (task.task.imagesPath) {
          task.task.imagesPath = task.task.imagesPath.split(',')
          // task.task.imagesPath = task.task.imagesPath.slice(0, task.task.imagesPath.length - 1)
          // 每个图片加上基准地址
          for (var i = 0; i < task.task.imagesPath.length; i++) {
            task.task.imagesPath[i] = 'http://101.34.16.47/resource' + task.task.imagesPath[i]
            // console.log(task.imagesPath[i])
          }
        } else {
          task.task.imagesPath = [require('../../assets/wutupian.jpg')]
        }
      })
      // // console.log(this.taskList)
      // // this.total = res.data.total
      // // this.pagesize = res.data.size
      // this.pagesize = 5
      // }
    },
    // 页码改变时刷新数据
    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage
      // 再次根据currentPage获取数据
      this.getTaskList()
    },
    handleClassClick() {
      // alert(this.activeClassName)
      this.queryInfo.status = Number(this.activeClassName)
      this.queryInfo.currentPage = 1
      this.getTaskList()
    },
    // 跳转到详情页
    jumpToTask(id) {
      this.$router.push({path: '/Task', query: {id: id}}) // 通过this.$route.query.id获得id
    },
    // 取消收藏任务
    async DeleteFavorite(id) {
      const confirmResult = await this.$confirm('此操作将取消收藏该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('不取消收藏')
      }
      const res2 = await deleteCollect({
        taskId: Number(id)
      })
      // console.log('取消收藏返回值', res2, id)
      if (res2.data.code !== 200) return this.$message.error('取消收藏失败！')
      this.$message.success('取消收藏成功！')
      this.getTaskList()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // tooltip的可控
    visibilityChange(event) {
      this.tooltipFlag = true
      const ev = event.target
      const evheight = ev.offsetHeight // 文本的实际高度
      // console.log(evheight)
      const contentheight = 18
      // this.$refs.tlp.$el.parentNode.clientHeight // 文本容器高度
      if (contentheight < evheight) {
        // 实际内容高度 > 文本高度 =》内容溢出
        this.tooltipFlag = true // NameIsIncludeWord ? true : !!false
      } else {
        // 否则为不溢出
        this.tooltipFlag = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.MyCollectionBox{
  // width: 1175px;
  // height: 962px;
  // width: 90%;
  font-weight: lighter;
  color:#999999;
  .header{
    // display: flex;
    justify-content: space-between;
  }
  .bdtop {
  border-top: 0.5px solid #e4e7ed;
  }
.bdbottom{
  border-bottom: 0.5px solid #e4e7ed;
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
    // line-height: 0.9;  /*数字与之前的文字对齐*/
  }
  .progress{
    display: inline-block;
    width: 250px;
    margin-left: 20px;
  }
  .operation{
    margin-top: 40px;
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
      margin-left: 30px;
    }
  }
  .el-pagination{
    text-align: center;
    margin-top: 25px;
  }
  .selectAdress{
    width: 70%;
    height: 200px;
  }
}
</style>
