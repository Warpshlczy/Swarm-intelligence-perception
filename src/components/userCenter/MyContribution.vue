<template>
  <div class="myContributionBox">
    <el-card>
      <div id="dialogContent" ref="print">
      <img src="../../assets/certificate.png" style="width:100%">
      <p class="p1"><span>{{ nickName }}</span>同志积极参与志愿服务。</p>
      <p class="p2">累计发布<span>{{ myCotribution.numberOfPublishTask }}</span>个任务，
      其中获得<span>{{ myCotribution.numberOfReceive }}</span>条提交记录。</p>
      <p class="p3">累计参与进行<span>{{ myCotribution.numberOfParticipateInTask }}</span>个任务，
      其中有<span>{{ myCotribution.numberOfBeReceivedTask }}</span>条提交记录被接受。</p>
      <!-- 新增贡献 -->
      <p class="p4" v-if="myCotribution.mostSubmitTime ==='你还没有完成过任务哦'"><span>你还没有完成过任务哦</span></p>
      <p class="p4" v-if="myCotribution.mostSubmitTime!=='你还没有完成过任务哦'">你最常完成的任务类型是：<span>{{ type }}</span></p>
      <!-- 0：其他类型 1：河流监测 2：车位感知 3：空气质量 4：花见 -->
      <p class="p5" v-if="myCotribution.mostSubmitTime!=='你还没有完成过任务哦'">在<span>{{myCotribution.mostSubmitTime}}</span>你第一次发布了自己的任务</p>
      <p class="p6" v-if="myCotribution.mostSubmitTime!=='你还没有完成过任务哦'">在<span>{{myCotribution.mostCompleteTime}}</span>你第一次完成了任务</p>
      <!-- <p class="p7" v-if="myCotribution.mostSubmitTime!=='你还没有完成过任务哦'">你最常提交任务的地点为<span>{{location}}</span></p> -->
      <!-- <img src="../../assets/群智2.png" class="stamp"> -->
      </div>
      <el-row>
        <el-col :span="2" :offset="22">
        <el-button class="printbtn" size="small" type="primary" @click="goPrint">打印</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<!-- 引入百度地图api -->
<script src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=hlIMPlOmAGq65NyonNFC7o5tSBvI7FF4"></script>
<script src="./node_modules/_mapvgl@1.0.0-beta.119@mapvgl/dist/mapvgl.min.js"></script>
<script src="https://code.bdstatic.com/npm/jquery@1.12.4/dist/jquery.min.js"></script>
<script>
import { getUserInfo } from '@/api/user'
import { getContribution } from '@/api/contribution'
export default {
  created() {
    this.getMyContribution()
  },
  async mounted() {
      const token = localStorage.getItem('Token')
      const res = await getUserInfo(token)
      this.nickName = res.data.data.nickName
      // console.log('用户信息：', res)
  },
  data() {
    return {
      id: this.userId,
      nickName: '',
      myCotribution: '',
      type: '',
      location: ''
      // fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      // url: 'src/assets/certificate.jpg'
    }
  },
  methods: {
    formatDate (d) {
    var date = new Date(d);
    var YY = date.getFullYear() + '-';
    var MM =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var ss =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return YY + MM + DD + ' ' + hh + mm + ss;
    },
    async getMyContribution() {
      const res = await getContribution()
      // const {data: res} = await this.$http.get('/Contribution/MyContribution?userId=' + this.id)
      // console.log('贡献接口返回值：', res)
      if (res.data.code !== 200) return this.$message.error('获取贡献信息失败！')
      this.myCotribution = res.data.data
      this.myCotribution.mostSubmitTime = this.formatDate(this.myCotribution.mostSubmitTime)
      this.myCotribution.mostCompleteTime = this.formatDate(this.myCotribution.mostCompleteTime)
      // 判断最常完成的任务类型
      // if (this.myCotribution.taskType === 1) this.type = '河流监测'
      // else if (this.myCotribution.taskType === 2) this.type = '车位感知'
      // else if (this.myCotribution.taskType === 3) this.type = '空气质量'
      // else if (this.myCotribution.taskType === 4) this.type = '花见'
      // else this.type = '其他类型'
      this.type = this.myCotribution.taskType
      // console.log(this.myCotribution)
      // const {data: res1} = await this.$http.get('/user/query/nick_name?id=' + this.id)
      // this.nickName = res1.data
      // 逆地址解析（经纬度转化为地址）
      var geoc = new BMapGL.Geocoder();
      var point = new BMapGL.Point(this.myCotribution.submitLongitude,this.myCotribution.submitLatitude);
      // console.log("point",point);
      geoc.getLocation(point, rs=>{
          var addComp = rs.addressComponents;
          this.location = addComp.province + ", " + addComp.city + ", " + addComp.district
          // this.location = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
          // console.log("最常做任务地址",this.location)
      })
    },
    goPrint() {
      this.$print(this.$refs.print)
    }
  }
}
</script>

<style lang="less" scoped>
.myContributionBox{
  width: 100%;
  // .el-card{
  //    height: 575px;
  // }
  .printbtn{
    margin-top: 18px;
    margin-left: 70px;
  }
  div{
    position: relative;
    p{
      width: 100%;
      text-align:center;
      color: black;
      line-height: 40px;
      font-size: 20px;
    }
    .p1{
      position: absolute;
      top: 35%;
    }
    .p2{
      position: absolute;
      top: 40%;
    }
    .p3{
      position: absolute;
      top: 45%;
    }
    .p4{
      position: absolute;
      top: 50%;
    }
    .p5{
      position: absolute;
      top: 55%;
    }
    .p6{
      position: absolute;
      top: 60%;
    }
    .p7{
      position: absolute;
      top: 65%;
    }
    .stamp{
      position: absolute;
      width: 200px;
      height: 200px;
      bottom:7%;
      right: 40%;
    }
    span {
        padding: 0 10px;
        font-size: 18px;
        font-weight: 600;
        font-style: italic;
      }
  }
}
</style>
