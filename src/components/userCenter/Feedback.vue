<template>
  <div class="feedbackBox">
    <el-card>
      <el-row>
          <!-- Tabs标签页 -->
            <el-tabs v-model="activeClassName" @tab-click="handleClassClick">
              <el-tab-pane :label="'我要反馈'" :name="0+''">
                <el-form :model="feedbackForm" :rules="feedbackFormRules" ref="feedbackFormRef" label-width="80px" class="feedbackForm">
                  <el-form-item label="意见" prop="advice">
                    <el-input type="textarea" v-model="feedbackForm.advice" rows="8" maxlength="200" show-word-limit placeholder="不超过200字"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式" width="50%" prop="contactDetails">
                    <el-input v-model="feedbackForm.contactDetails" placeholder="请输入手机号或邮箱，方便我们第一时间联系您"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitSuggestion">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane :label="'历史反馈'" :name="1+''">
                  <div class="history">
                    <el-timeline>
                      <el-timeline-item
                        v-for="item in myFeedbackListPage"
                        :key="item.id"
                        :timestamp="item.createTime.replace('T',' ')"
                         placement="top">
                         <el-card>
                          {{item.advice}}
                          <el-button
                           type="primary"
                           icon="el-icon-edit"
                           circle
                           style='position: absolute;right:66px;top:35px;'
                           @click="updateFeedBack(item.advice, item.id)">
                          </el-button>
                          <el-button
                           type="danger"
                           icon="el-icon-delete"
                           circle
                           style='position: absolute;right:10px;top:35px;'
                           @click="deleteFeedBack(item.id)">
                          </el-button>
                         </el-card>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                  <!-- <div v-for="item in myFeedbackList" :key="item.id">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <el-row>
                        <el-col :span="8">
                          <span>反馈时间：{{item.createTime}}</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                          <span>联系方式：{{item.contactDetails}}</span>
                        </el-col>
                      </el-row>
                    </div>
                      <span>反馈内容：{{item.advice}}</span>
                  </el-card>
                </div> -->
                <el-pagination
                background
                layout="total,prev, pager, next"
                @current-change="handleCurrentChange"
                :total="total"
                :page-size="queryInfo.pageSize">
                </el-pagination>
              </el-tab-pane>
            </el-tabs>
        </el-row>
    </el-card>
  </div>
</template>

<script>
import { addFeedback, selectFeedback, deleteFeedback, updateFeedback} from '@/api/feedback'
import { getUserInfo } from '@/api/user'

export default {
  created() {
  },
  mounted() {
    this.initInformation()
  },
  data() {
    var validatorContactDetails = function (rule, value, callback) {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-])+/
      if (value === '') {
        callback(new Error('联系方式不能为空'))
      } else if (!/^1\d{10}$/.test(value) && !regEmail.test(value)) {
        callback(new Error('手机号或邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      feedbackForm: {
        advice: '', // 反馈内容
        contactDetails: '', // 反馈详细信息（手机号或邮箱）
        feedbackUserId: '' // 反馈者的用户id
      },
      activeClassName: '0',
       // 注册表单的验证规则对象
      feedbackFormRules: {
        advice: [
          // { min: 3, message: '至少输入10个字符', trigger: 'blur' },
          {required: true, message: '请输入反馈内容', trigger: 'blur'}
        ],
        contactDetails: [
          { required: true, validator: validatorContactDetails, trigger: 'blur' }
        ]
      },
      // 分页器变量
      queryInfo: {
        pageNum: 1, // 当前页码数
        pageSize: 5, // 分页条数
        feedbackUserId: 1 // 用户id
      },
      total: 0, // 数据总条数
      myFeedbackList: [],
      myFeedbackListPage: []
    }
  },
  methods: {
    // 获取用户信息
    async initInformation() {
        const token = localStorage.getItem('Token')
        const res = await getUserInfo(token)
        this.user = res.data.data
        // console.log('用户信息：', res)
        // console.log('用户id：', this.user.id)
        // 用户id要进行转换为long
        this.feedbackForm.feedbackUserId = this.user.id
        this.queryInfo.feedbackUserId = this.user.id
    },
    // 添加反馈意见
    async submitSuggestion() {
       // 表单预验证，回调函数会传入验证结果为参数
      this.$refs.feedbackFormRef.validate(async (valid) => {
        if (!valid) return

        const res = await addFeedback(this.feedbackForm)
        // console.log('添加反馈意见返回值', res)
        if (res.data.code !== 200) return this.$message.error('反馈意见失败！请稍后再试！')
        this.$message.success('反馈意见成功！')
        this.$refs.feedbackFormRef.resetFields()
      })
    },
    handleClassClick(tab) {
      if (tab.name === '1') this.getMyFeedback()
    },
    // 查询历史反馈意见
    async getMyFeedback() {
      const res = await selectFeedback(this.queryInfo)
      // console.log('查询反馈接口返回信息:', this.queryInfo, res)
      this.myFeedbackList = res.data.data
      // console.log('该用户所有反馈信息：', this.myFeedbackList)
      this.total = this.myFeedbackList.length
      // console.log('总条数：', this.total, '分页条数：', this.queryInfo.pageSize)
      this.myFeedbackListPage = this.myFeedbackList.slice(5 * (this.queryInfo.pageNum - 1), 5 * (this.queryInfo.pageNum))
      // console.log(5 * (this.queryInfo.pageNum - 1), 5 * (this.queryInfo.pageNum) - 1, this.myFeedbackListPage)
      // this.pagesize = res.data.pagesize
    },
    // 页码改变时刷新数据
    handleCurrentChange(newPage) {
      // console.log('当前页码数：', newPage)
      this.queryInfo.pageNum = newPage
      // 再次根据pageNum获取数据
      this.getMyFeedback()
    },
    // 修改反馈意见
    updateFeedBack(advice, id) {
        this.$prompt('请输入反馈内容', '修改反馈意见', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: advice
        }).then(async (updateAdvice) => {
          const params = {
            id: id,
            advice: updateAdvice.value
          }
          const res = await updateFeedback(params)
          // console.log('修改反馈接口返回值：', res)
          if (res.data.code === 200) {
            this.$message({
                        type: 'success',
                        message: '修改反馈成功!'
            })
            this.getMyFeedback()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改反馈失败！请稍后再试！'
          })
        })
    },
    // 删除反馈意见
    async deleteFeedBack(id) {
      const params = {
        id: id
      }
      const res = await deleteFeedback(params)
      // console.log('删除反馈意见接口返回值：', res)
      if (res.data.code === 200) { this.$message.success('删除成功！') }
      this.getMyFeedback()
    }
  }
}
</script>

<style lang="less" scoped>

.feedbackBox{
  width: 100%;
  .el-card{
    // height: 575px;
    .feedbackForm{
      margin:30px 20px 30px;
      width: 95%;
    }
    .box-card{
    margin: 20px 30px;
    height: 180px;
    }
    .histroy{
      margin: 20px 30px;
    }
  }
  .el-card ::v-deep .el-card__header {
    // padding: 2px 10px;
    background-color: #f9f9f9;
    font-weight: 400;
    font-size:14px;
    color:#666666;
  }
  /deep/.el-card__body {
    padding-right: 112px;
  }
  .el-pagination{
    text-align: center;
  }
}

</style>
