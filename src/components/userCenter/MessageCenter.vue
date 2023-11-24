<template>
  <div class="MessageCenterBox">
    <el-card>
      <el-tabs v-model="activeClassName" @tab-click="handleClassClick">
        <el-tab-pane :label="'我的发布'" :name="0+''">
          <span slot="label">
            我的发布
            <el-badge is-dot :value="unread[0]" :hidden="!unread[0]"></el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane :label="'任务推荐'" :name="1+''">
          <span slot="label">
            任务推荐
            <el-badge is-dot :value="unread[1]" :hidden="!unread[1]"></el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane :label="'数据审核'" :name="2+''">
          <span slot="label">
            数据审核
            <el-badge is-dot :value="unread[2]" :hidden="!unread[2]"></el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane :label="'我的提交'" :name="3+''">
          <span slot="label">
            我的提交
            <el-badge is-dot :value="unread[3]" :hidden="!unread[3]"></el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <div v-for="item in smallMessageList" :key="item.id">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="12">
                <el-button type="text" @click="jumpToTask(item.tId, item.id ,item.status)">查看任务详情</el-button>
                <el-button type="text" v-if="activeClassName==='0' || activeClassName==='2'" @click="jumpToTaskProgress(item.tId, item.id, item.status)">查看任务进展</el-button>
                <el-button type="text" v-if="activeClassName==='3'" @click="jumpToMySubmission(item.taskId, item.id, item.status)">查看我的提交</el-button>
                <span v-if="item.status===0" id="highlight">new!</span>
              </el-col>
              <el-col :span="6" :offset="6">
                <span style="margin-right:10px">{{item.updateTime}}</span>
                <el-button type="text" @click="deleteMessage(item.id)">删除</el-button>
              </el-col>
            </el-row>
            <div style="float: right">
            <el-checkbox v-model="selectedMessageIds[item.id]"></el-checkbox>      <!--   标记-添加 -->
            </div>
          </div>
          <span class="cardbody">{{item.title}}</span> {{item.content}}
        </el-card>
      </div>
       <el-button type="danger" icon="el-icon-delete" circle @click="deleteSelectedMessages" class="floating-button"></el-button>
       <!--  <el-button type="danger" size="small" @click="deleteSelectedMessages">全选删除</el-button>标记 -->

      <el-pagination
        background
        layout="total,prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getMessageList, deleteMessages, changeMessageStatus } from '@/api/message'
import { getTaskDetail } from '@/api/task'
import {  getTaskIdBySubmitId } from '@/api/submit'


export default {
  created() {
    // this.getMessageList()
  },
  mounted() {
    this.getUnread()
    this.getMessageList()
    // this.$store.dispatch('getMessageNum')
  },
  data() {
    return {
      activeClassName: '0',
      total: 0,
      pageSize: 5,
      currentPage: 1, // 当前的页数
      messageList: [], // 消息列表
      smallMessageList: [], // 过滤后的消息列表
      unread: [],
       selectedMessageIds:{}   //选中的消息id
    }
  },
  methods: {
    // 获取未读消息数
    async getUnread() {
      let unread = []
      for (let i = 0;i < 4;i++) {
        const res = await getMessageList({
          userId: localStorage.getItem('UserId'),
          page: 1,
          size: 5,
          type: i + ''
        })
        // console.log(res)
        if (res.data.data) {
          unread.push(res.data.data.unreadNum)
        }
        else unread.push(0)
      }
      this.unread = unread
    },
    // 获取任务列表
    async getMessageList() {
      this.smallMessageList = [] // 清空消息列表
      const res = await getMessageList({
        userId: localStorage.getItem('UserId'),
        page: this.currentPage,
        size: 5,
        type: this.activeClassName
      })
      if (res.data.data) {
        this.smallMessageList = res.data.data.resultList
        this.total = res.data.data.totalNum
      }
      // console.log('获取当前用户消息列表接口返回数据：', res)
      // if (res.data.code !== 200) return this.$message.error('获取消息列表失败！')
      // this.messageList = res.data.data.resultList
      // for (let i = 0; i < this.messageList.length; i++) {
      //   console.log(i, this.messageList[i].type, Number(this.activeClassName))
      //   if (this.messageList[i].type === Number(this.activeClassName)) {
      //     this.smallMessageList.push(this.messageList[i])
      //     console.log('1', i)
      //   }
      // }
      // console.log('过滤后的消息列表：', this.smallMessageList)
      // this.total = this.smallMessageList.length
      // this.smallMessageList = this.smallMessageList.slice((this.currentPage - 1) * 5, (this.currentPage - 1) * 5 + 5)
      // console.log(this.smallMessageList)
    },
    handleClassClick() {
      // this.queryInfo.type = Number(this.activeClassName)
      this.currentPage = 1
      this.total = 0
      this.getMessageList()
    },
    // 页码改变时刷新数据
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      // 再次根据currentPage获取数据
      this.getMessageList()
    },
    // 跳转到任务进展
    async jumpToTaskProgress(tId, id, status) {
      // if (!status) {
      //   const {data: res} = await this.$http.post('/message/EditMessageStatus', this.qs.stringify({MessageId: id, Status: 1}))
      //   if (res.code !== 200) return this.$message.error('查看消息失败！')
      //   this.$store.dispatch('getMessageNum')
      // }
      const res = await changeMessageStatus({
        'messageIds': [String(id)],
        'userId': localStorage.getItem('UserId')
      })
      // console.log('改变消息状态返回值：', res)
      if (this.activeClassName === '0') this.$router.push({path: '/TaskProgress', query: {id: tId, name: '0'}})
      if (this.activeClassName === '2') {
        const res = await getTaskIdBySubmitId(tId)
        // console.log(res.data.data)
        const res1 = await getTaskDetail({ id: res.data.data })
        // console.log('taskdata', res1.data.data.rootId)
        let id = res1.data.data.rootId
        if (id === -1) id = res.data.data
        // console.log('Iddddddddddd', id)
        this.$router.push({path: '/TaskProgress', query: {id: id, name: '0'}})
      }
    },
    // 跳转到查看任务详情
    async jumpToTask(tId, id, status) {
      // if (!status) {
      //   const {data: res} = await this.$http.post('/message/EditMessageStatus', this.qs.stringify({MessageId: id, Status: 1}))
      //   if (res.code !== 200) return this.$message.error('查看消息失败！')
      //   this.$store.dispatch('getMessageNum')
      // }
      const res = await changeMessageStatus({
        'messageIds': [String(id)],
        'userId': localStorage.getItem('UserId')
      })
      // console.log('改变消息状态返回值：', res)
      if (this.activeClassName === '0') this.$router.push({path: '/Task', query: {id: tId, name: '0'}})
      if (this.activeClassName === '1') {
        const res = await getTaskDetail({ id: tId })
        // console.log('taskdata', res.data.data.rootId)
        let id = res.data.data.rootId
        if (id === -1) id = tId 
        this.$router.push({path: '/Task', query: {id: id, name: '0'}})
      }
      if (this.activeClassName === '2' || this.activeClassName === '3') {
        const res = await getTaskIdBySubmitId(tId)
        // console.log(res.data.data)
        const res1 = await getTaskDetail({ id: res.data.data })
        // console.log('taskdata', res1.data.data.rootId)
        let id = res1.data.data.rootId
        if (id === -1) id = res.data.data
        // console.log('Iddddddddddd', id)
        this.$router.push({path: '/Task', query: {id: id, name: '0'}})
      }
      // this.$router.push({path: '/Task', query: {id: tId}})
    },
    // 跳转到我的提交
    async jumpToMySubmission(taskId, id, status) {
      if (!status) {
        // const {data: res} = await this.$http.post('/message/EditMessageStatus', this.qs.stringify({MessageId: id, Status: 1}))
        // if (res.code !== 200) return this.$message.error('查看消息失败！')
        // this.$store.dispatch('getMessageNum')
      }
      this.$router.push({path: '/mySubmission'})
    },
    // 删除消息
    async deleteMessage(id) {
      const confirmResult = await this.$confirm('此操作将删除该任务消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const res = await deleteMessages({
        'messageIds': [String(id)],
        'userId': localStorage.getItem('UserId')
      })
      // console.log('删除信息返回值：', res)
      if (res.data.code !== 200) return this.$message.error('删除消息失败！')
      this.$message.success('删除消息成功！')
      // this.$store.dispatch('getMessageNum')
      this.getMessageList()
    },
    // async deleteSelectedMessages(selectedMessageIds){
    //   for(var i=0;i<selectedMessageIds.length;i++){
    //     deleteMessage(selectedMessageIds[i])
    //   }    
    // }
  //   deleteSelectedMessages() {
  // // 获取选中的消息id列表
  // const selectedIds = Object.keys(this.selectedMessageIds).filter(id => this.selectedMessageIds[id])

  // // 删除选中的消息（调用删除消息接口）
  // selectedIds.forEach(async id => {
  //       await deleteMessages({
  //         messageId: id,
  //         userId: localStorage.getItem('UserId')
  //       })
  //     })

  //     // 刷新消息列表
  //     this.getMessageList()

  //     // 清空选中的消息id列表
  //     this.selectedMessageIds = {}
  //   },

        async deleteSelectedMessages() {
        const confirmResult = await this.$confirm('此操作将删除选中的任务消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除')
        }

        // 获取选中的消息id列表
        const selectedIds = Object.keys(this.selectedMessageIds).filter(id => this.selectedMessageIds[id])

        // 删除选中的消息（调用删除消息接口）
        const res = await deleteMessages({
          'messageIds': selectedIds.map(String),
          'userId': localStorage.getItem('UserId')
        })

        if (res.data.code !== 200) {
          return this.$message.error('删除消息失败！')
        }

        this.$message.success('删除消息成功！')

        // 刷新消息列表
        this.getMessageList()
        this.selectedMessageIds = {}
      },
  }
}
</script>

<style lang="less" scoped>

.MessageCenterBox{
  // width:880px;
  // height:680px;
  // left: 48px;
  // top: 128px;
  // margin-left: 20px;
  // font-weight: 600;
  
  .progress{
    display: inline-block;
    width: 250px;
    margin-left: 20px;
  }
  .footer{
    width: 40%;
    position: relative;
    left: 50%;
    transform: translate(-50%,);
    .el-button{
      width: 100px;
      height: 50px;
      margin-left: 50px;
    }
  }
  .taskAdress{
    width: 350px;
    height: 300px;
  }
  .taskImg{
    width:96px;
    height: 80px;
    display: inline-block;
    margin-top: 10px;
    // margin:10px 10px;
  }
.box-card{
  margin: 20px 30px;
  // .item{
  //     position: absolute;
  //     z-index: 99;
  //     margin-top: 50px;
  //     margin-left: 40px;
  //   }
}
  .el-card ::v-deep .el-card__header {
  // padding: 2px 10px;
  background-color: #f9f9f9;
}
.cardhead{
  // font-weight: 700;
  font-size:16px;
  color:#999999;
}
.cardbody{
  font-weight: 600;
  font-size:15px;
  color:#666666;
}
.el-pagination{
    text-align: center;
  }
  .floating-button {
  position: fixed;
  top: 115px;
  right: 80px;
  z-index: 9999; /* 确保按钮显示在最上层 */
}
}

</style>
