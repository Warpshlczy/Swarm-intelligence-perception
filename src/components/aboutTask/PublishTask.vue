<template>
  <el-card class="publishBox">
    <el-form
      :model="publishForm"
      ref="publishFormRef"
      :rules="publishFormRules"
      label-width="120px"
      class="publishForm"
      size="medium"
      label-position="left"
      v-loading="isloading"
    >
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="publishForm.type" placeholder="请选择任务类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          class="input"
          v-model="publishForm.title"
          placeholder="任务名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="details">
        <el-input
          class="input"
          type="textarea"
          v-model="publishForm.details"
          maxlength="161"
          show-word-limit
          rows="5"
          placeholder="请输入任务描述"
        ></el-input>
        <!-- 图片上传 -->
        <el-upload
          action="#"
          ref="upload"
          :multiple="true"
          list-type="picture-card"
          :before-upload="beforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="publishForm.files"
          accept=".jpg, .jpeg, .png, .gif"
          :limit="5"
          :on-exceed="exceed"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg,jpeg,png文件，单张不超过2MB,最多可上传五张
          </div>
        </el-upload>
        <!-- 放大图片 -->
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
          <el-image width="100%" :src="dialogImageUrl" alt=""></el-image>
        </el-dialog>
      </el-form-item>
      <el-form-item label="任务地址" prop="place">
        <!-- 地图 -->
        <!-- <SelectAddress class="selectAdress"/> -->
        <iframe
          name="selectAdress"
          ref="iframe"
          src="static/SelectAddress.html"
          frameborder="0"
          scrolling="no"
          class="selectAdress"
          @load="handleIframeLoad"
        ></iframe>
      </el-form-item>
      <el-form-item label="起止时间" prop="taskDate">
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="publishForm.taskDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="提交开始日期"
          end-placeholder="提交结束日期"
          unlink-panels="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所需完成数量" width="50%" prop="maxPassed">
        <el-input-number
          controls-position="right"
          v-model="publishForm.maxPassed"
          placeholder="请输入任务数量"
          :min="1"
          :max="50"
        ></el-input-number>
      </el-form-item>
      <div class="el-upload__tip tip">一个小任务所需要用户提交的数据数量</div>
      <el-form-item label="提交要求" prop="submitLimit">
        <el-checkbox-group v-model="publishForm.submitLimit">
          <!-- label就是对应的值 -->
          <el-checkbox
            v-for="limit in limitOptions"
            :label="limit.id"
            :key="limit.id"
            >{{ limit.content }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publishTask" :disabled="isDisabled"
          >发布任务</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// import qs from 'qs'
// eslint-disable-next-line no-extend-native
import { publishTask, getType, uploadTaskImages } from "@/api/task";
import { getUserInfo } from "@/api/user";

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

export default {
  created() {
    this.getTypeOptions();
  },
  mounted() {
    this.getUserInfo();
    window.addEventListener("message", this.handleMessage);
    // const params = {
    //   id: localStorage.getItem('id')
    // }
    // const {data: res} = this.$http.get('/user/query/nick_name', {params: params})
    // this.nickName = res
  },
  destroyed() {
    window.addEventListener("message", this.handleMessage);
  },
  data() {
    return {
      userId: "",
      isloading: false,
      isDisabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; // 如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      typeOptions: [
        // {label: '内河污染监测', value: '1'},
        // {label: '停车位监测', value: '2'},
        // {label: '空气质量监测', value: '3'},
        // {label: '其他', value: '0'}
      ],
      limitOptions: [
        { id: 0, content: "文本" },
        { id: 1, content: "数值" },
        { id: 2, content: "文件(图片)" },
        { id: 3, content: "地点" },
      ],
      nickName: "",
      dialogImageUrl: "",
      dialogVisible: false,
      selectedCoordinates: [], //地图草稿坐标
      publishForm: {
        imagesPath: "",
        onlineStatus: 1,
        checkStatus: 1,
        rootId: -1,
        longitude: 119.28,
        latitude: 26.08,
        type: "",
        title: "",
        details: "", // 位置坐标字符串 示例：'(x1,y1);(x2,y2);'
        longitude: 119.28,
        latitude: 26.08,
        size: "",
        files: [],
        maxPassed: 1,
        submitLimit: [],
        taskDate: [],
      },
      coordinate: "", // 地图坐标
      publishFormRules: {
        type: [{ required: true, message: "请选择任务类型", trigger: "blur" }],
        title: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
          { max: 20, message: "长度在1到20个字符之间", trigger: "blur" },
        ],
        details: [
          { required: true, message: "请输入任务描述", trigger: "blur" },
          {
            message: "请输入任务的具体描述已便于用户收集数据",
            trigger: "blur",
          },
        ],
        submitLimit: [
          { required: true, message: "请选择提交要求", trigger: "blur" },
        ],
        taskDate: [
          { required: true, message: "请选择任务起止时间", trigger: "blur" },
        ],
        place: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // console.log(this.publishForm.longitude)
              if (this.coordinate === "") {
                callback(new Error("请选择任务地点！"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleIframeLoad() {
      console.log("地图加载完成", this.selectedCoordinates);
      if (this.selectedCoordinates != undefined) {
        // 如果不为空
        console.log("发送地图草稿数据");
        this.$refs.iframe.contentWindow.postMessage(
          {
            action: "callSelectedCoordinates",
            selectedCoordinates: this.selectedCoordinates,
          },
          "*"
        );
      }
    },
    async getUserInfo() {
      const token = localStorage.getItem("Token");
      // console.log('token', token)
      const res = await getUserInfo(token);
      if (res.data.code === 200) this.userId = res.data.data.id;
      if (!token) {
        this.$message.error("当前尚未登录无法发布任务，请先登录");
      } else if (token && !this.userId) {
        // console.log('1',this.userId)
        this.$message.error("登录已过期，请重新登录");
      }
    },
    async getTypeOptions() {
      // const {data: res} = await this.$http.get('/dict/search/key', {params: {keyName: 'taskType'}})
      const res = await getType();
      // console.log('type', res)
      // if (res.code !== 200) return this.$message.error('任务类型获取失败！')
      // console.log('获取任务类型', res.data)
      res.data.data.forEach((value) =>
        this.typeOptions.push({ label: value, value: value })
      );
      // console.log(this.typeOptions)
      // this.typeOptions = res.data.data
    },
    jsonData(formData) {
      var jsonData = {};
      formData.forEach((value, key) => (jsonData[key] = value));
      return jsonData;
    },
    async publishTask() {
      this.isDisabled = true;
      this.isloading = true;
      this.$refs.publishFormRef.validate(async (valid) => {
        if (!valid) {
          this.isDisabled = false;
          return;
        }

        // 新建一个FormData
        var upData = new FormData();
        // var upData = {}
        // 不能直接用publishForm.files传，加到FormData里面去，一次性传
        if (this.publishForm.files) {
          this.publishForm.files.forEach(function (file) {
            upData.append("images", file.raw); // 因为要上传多个文件，所以需要遍历一下才行
            // upData.append('file', this.file); 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
          });
        }

        var strlimit = this.publishForm.submitLimit;
        var submitLimit = [];
        if (strlimit.some((item) => item === 0)) submitLimit[0] = 1;
        else submitLimit[0] = 0;
        if (strlimit.some((item) => item === 1)) submitLimit[1] = 1;
        else submitLimit[1] = 0;
        if (strlimit.some((item) => item === 2)) submitLimit[2] = 1;
        else submitLimit[2] = 0;
        if (strlimit.some((item) => item === 3)) submitLimit[3] = 1;
        else submitLimit[3] = 0;
        // console.log(submitLimit)
        // // 将submitLimit转为字符串再传
        submitLimit = submitLimit.join("");
        this.publishForm.submitLimit = submitLimit;
        this.publishForm.publisherId = this.userId;
        this.publishForm.startTime = this.publishForm.taskDate[0].format(
          "yyyy-MM-ddThh:mm:ss.000+00:00"
        );
        this.publishForm.endTime = this.publishForm.taskDate[1].format(
          "yyyy-MM-ddThh:mm:ss.000+00:00"
        );
        delete this.publishForm.taskDate;
        const res = await publishTask(this.publishForm);

        const token = localStorage.getItem("Token");

        if (res.data.description === "未能读取到有效Token") {
          this.isloading = false;
          this.$confirm("当前尚未登录无法发布任务，请问是否登录？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            localStorage.setItem("router_history", "/PublishTask");
            this.$router.push("login");
          });
        } else if (token && !this.userId) {
          this.$confirm("登录已过期无法发布任务，是否重新登录？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            localStorage.setItem("router_history", "/PublishTask");
            this.$router.push("login");
          });
        }

        // 提交图片和提交其他分开
        const res1 = await uploadTaskImages(upData, res.data.data);
        this.publishForm.rootId = res.data.data;

        // 处理地图坐标
        for (let i = 0; i < this.coordinate.length; i++) {
          this.publishForm.longitude = this.coordinate[i][0];
          this.publishForm.latitude = this.coordinate[i][1];

          const res = await publishTask(this.publishForm);
          // console.log("smalltask", res)
          if (i === this.coordinate.length - 1) {
            if (res.data.code === 200) {
              this.isloading = false;
              this.$message.success("发布任务成功！");
            } else {
              this.isloading = false;
              this.$message.error("发布任务失败！请重新发布");
            }
          }
        }
        this.$refs.publishFormRef.resetFields();
        // 清空文件
        this.$refs.upload.clearFiles();
        this.isDisabled = false;
        // this.$refs.iframe.src = 'static/选择地址.html'
        this.$refs.iframe.src = "static/SelectAddress.html";
        this.dialogVisible = false;
      });
    },
    // 改变图片(预览图片的核心函数)
    async handleChange(file, fileList) {
      console.log(file);
      this.publishForm.files = fileList;
      if (this.beforeUpload(file.raw)) {
        // beforeUpload返回的是个promise对象，要用await解构出来拿到PromiseResult值。这个居然整了好久！！给忘了
        file = await this.compresspic.compressAccurately(file.raw, 200);
        // console.log(file)
        fileList[fileList.length - 1].raw = file;
      }
      console.log(file);
      this.publishForm.files = fileList;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.publishForm.files = fileList;
    },
    // 放大图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // console.log(file.url);
      this.dialogVisible = true;
    },
    // 图片数量限制
    exceed(file, fileList) {
      this.$message.error("最多上传5张图片哦！");
    },
    // 图片上传前的操作
    async beforeUpload(file) {
      return new Promise((resolve, reject) => {
        // 判断图片是否大于10M
        const isLt10M = file.size / 1024 / 1024 < 10;
        // const fileType = file.name.substring(file.name.lastIndexOf('.')+1)
        // 判断图片的类型
        const isJpg =
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/gif";
        if (!isJpg) {
          this.$message.error("只能上传jpg, jpeg, png, gif格式的图片！");
          // 1.获取将要删除图片的临时路径
          const fileuid = file.uid;
          // 2.从pics数组中，找到图片对应的索引值
          const i = this.publishForm.files.findIndex((x) => x.uid === fileuid);
          // 3.调用splice方法，移除图片信息
          this.publishForm.files.splice(i, 1);
          // console.log(this.$refs.upload.uploadFiles)
          this.$refs.upload.uploadFiles = this.publishForm.files;
          return false;
        }
        if (!isLt10M) {
          this.$message.error("上传图片大小不能超过2MB!");
          // 1.获取将要删除图片的临时路径
          const fileuid = file.uid;
          // 2.从pics数组中，找到图片对应的索引值
          const i = this.publishForm.files.findIndex((x) => x.uid === fileuid);
          // 3.调用splice方法，移除图片信息
          this.publishForm.files.splice(i, 1);
          this.$refs.upload.uploadFiles = this.publishForm.files;
          return false;
        }
        return resolve(true);
      });
    },

    // 获取SelectAddress.html（内嵌iframe）传过来的数据(每次iframe 加载都会调用)
    handleMessage(event) {
      const data = event.data;
      this.coordinate = data.coordinate;
      this.publishForm.size = data.size;

      if (event.data.action === "updateSelectedCoordinates") { // 设定特定行为，避免被重置
        // console.log("更新缓存", data.selectedCoordinates);
        this.selectedCoordinates = data.selectedCoordinates;
      }
    },
  },
  activated() {},
};
</script>

<style lang="less" scoped>
.el-upload__tip {
  color: #c0c4cc;
}

.tip {
  margin-left: 120px;
  margin-top: -1%;
}

.publishBox {
  width: 75%;
  min-height: 700px;
  padding: 50px 0px;
  position: relative;
  left: 50%;
  transform: translate(-50%);

  .publishForm {
    width: 80%;
    margin: 0px auto;
  }

  .selectAdress {
    width: 100%;
    height: 500px;
  }
}

.select {
  width: 10%;
  height: 100px;
}

.input {
  width: 90%;
}
</style>
