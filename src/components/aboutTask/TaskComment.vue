<template>
  <div>
    <h1>评论区({{ comments.length }})</h1>
    <el-collapse v-for="comment in currentComments" :key="comment.id">
      <div class="d-flex" style="align-items: center">
        <el-avatar size="large"></el-avatar>
        <el-card style="flex: 1; margin: 0 3vh; margin-top: 4vh">
          <h3 slot="header" style="color: cornflowerblue; margin: 0">
            {{ comment.operatorId }}
          </h3>
          <p style="margin: 0; margin-bottom: 2%; font-size: 16px">
            {{ comment.content }}
          </p>
          <div
            class="d-flex hoverPointer"
            style="justify-content: end; align-items: center"
          >
            <i class="el-icon-time" style="margin-right: 2%">
              {{ comment.sendTime }}
            </i>

            <i
              class="el-icon-chat-round"
              style="margin-right: 2%"
              @click="openDialog(comment.id, comment.operatorId)"
            >
              回复
            </i>
            <el-popconfirm
              title="确定删除评论吗？"
              v-if="comment.operatorId === userID"
              style="color: red"
              @confirm="deleteComment(comment.id)"
            >
              <i slot="reference" class="el-icon-error"> 删除 </i>
            </el-popconfirm>
          </div>
        </el-card>
      </div>
      <el-collapse-item
        v-if="comment.responses != '' && comment.responses != null"
      >
        <template slot="title">
          <div
            class="d-flex"
            style="justify-content: end; width: 100%; color: cornflowerblue"
          >
            <span>(展开回复)</span>
          </div>
        </template>
        <div v-for="response in comment.responses" :key="response.responseId">
          <div class="d-flex" style="margin-bottom: 15px">
            <div class="d-flex" style="align-items: center; margin-left: 5%">
              <el-avatar size="small"></el-avatar>
            </div>
            <el-button type="text" style="padding: 0 5px"
              >{{ response.operatorId }}:</el-button
            >
            {{ response.content }}
          </div>
          <div
            class="d-flex hoverPointer"
            style="justify-content: end; align-items: center"
          >
            <i class="el-icon-time" style="margin-right: 2%">
              {{ response.sendTime }}
            </i>

            <i
              class="el-icon-chat-round"
              @click="openDialog(comment.id, response.operatorId)"
              style="margin-right: 2%"
            >
              回复</i
            >
            <el-popconfirm
              title="确定删除回复吗？"
              v-if="response.operatorId === userID"
              @confirm="deleteResponse(response.responseId)"
            >
              <i slot="reference" class="el-icon-error" style="color: red">
                删除
              </i>
            </el-popconfirm>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <br />

    <!---->
    <el-input
      type="textarea"
      placeholder="快来发表你的评论吧"
      resize="none"
      rows="4"
      v-model="outerMessage"
      maxlength="200"
      show-word-limit
      style="font-size: 16px"
    >
    </el-input>
    <el-button
      type="primary"
      style="margin: 10px 10px; float: right"
      @click="comment()"
      >发送</el-button
    >
    <!---->

    <!---->
    <el-pagination
      layout="prev,pager,next"
      :total="totalPage * 10"
      background
      :current-page="currentPage"
    ></el-pagination>
    <!---->

    <!---->
    <el-dialog title="快速回复" :visible.sync="dialogVisible" width="60%">
      <el-input
        type="textarea"
        :placeholder="'回复@' + replyTargetUser + ':'"
        resize="none"
        v-model="replyMessage"
        maxlength="150"
        show-word-limit
        style="font-size: 16px"
        rows="5"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reply(replyTargetID)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!---->
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      //当前页数
      maxCommentsEach: 10,
      //一页最多展示10份评论
      totalPage: 5,
      //所有页数
      outerMessage: null,
      replyMessage: null,
      replyTargetID: "",
      replyTargetUser: "",
      dialogVisible: false,
      comments: [],
      currentComments: [],
      userID: "",
    };
  },
  methods: {
    initUserID() {
      this.userID = localStorage.getItem("UserId");
    },
    openDialog(targetID, targetUser) {
      if (!this.dialogVisible) this.dialogVisible = true;
      this.replyTargetID = targetID;
      this.replyTargetUser = targetUser;
    },
    initAllComments() {
      let task_id = this.$route.query.id;
      this.$commentApi.getAllComments(task_id).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              this.comments = res.data.data;
              this.initCurrentPage();
              break;
            }
            case 40000: {
              alert(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
    initCurrentPage() {
      let max = this.comments.length % this.maxCommentsEach;
      this.totalPage = this.comments.length / this.maxCommentsEach;
      for (let i = 0; i < max; i++) {
        this.currentComments[i] =
          this.comments[max * (this.currentPage - 1) + i];
        this.initCommentsResponse(this.currentComments[i]);
      }
    },
    async initCommentsResponse(comment) {
      await this.$commentApi.getAllResponses(comment.id).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              comment.responses = res.data.data;
              this.$forceUpdate();
              break;
            }
            case 40000: {
              alert(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
    comment() {
      let task_id = this.$route.query.id;
      let content = this.outerMessage;
      this.$commentApi.addNewComment(task_id, content).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              this.$message.success("发布评论成功！");
              this.outerMessage = "";
              this.$router.go(0);
              break;
            }
            case 40000: {
              this.$message.error(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
    reply(comment_id) {
      let content = this.replyMessage;
      this.$commentApi.addNewResponse(content, comment_id).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              this.$message.success("发布回复成功！");
              this.replyMessage = "";
              this.$router.go(0);
              break;
            }
            case 40000: {
              this.$message.error(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
    deleteComment(comment_id) {
      this.$commentApi.deleteComment(comment_id).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              this.$message.success("删除评论成功！");
              this.$router.go(0);
              break;
            }
            case 40000: {
              this.$message.error(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
    deleteResponse(response_id) {
      this.$commentApi.deleteResponse(response_id).then(
        (res) => {
          switch (res.data.code) {
            case 200: {
              this.$message.success("删除回复成功！");
              this.$router.go(0);
              break;
            }
            case 40000: {
              this.$message.error(res.data.message);
              break;
            }
          }
        },
        (error) => {
          alert("未知错误");
        }
      );
    },
  },
  mounted() {
    this.initUserID();
    this.initAllComments();
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
}
.hoverPointer:hover {
  cursor: pointer;
}
</style>