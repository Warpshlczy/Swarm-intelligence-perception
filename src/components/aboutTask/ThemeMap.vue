<template>
  <div class="MapContainer">
    <div>
      <el-tabs
        type="border-card"
        tab-position="left"
        class="tabs"
        v-model="activeTab"
      >
        <el-tab-pane label="河流监测图">
          <span slot="label" class="fontClass">河流监测图</span>
          <iframe
            id="mainIframe"
            name="mainIframe"
            src="static/htmltest.html"
            frameborder="0"
            scrolling="no"
            class="mapIframe"
          ></iframe>
        </el-tab-pane>
        <el-tab-pane label="停车位地图" name="parkingMap">
          <span slot="label" class="fontClass">停车位地图</span>
          <!-- 未来如果引入新的地图可以参考这个进行封装，
          不要直接在这个页面又引入iframe，耦合度过高了 -->
          <ParkingMap v-if='activeTab==="parkingMap"' />
        </el-tab-pane>
        <el-tab-pane label="噪声监测图">
          <span slot="label" class="fontClass">噪声监测图</span>
          <el-empty description="暂无数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane label="空气质量图">
          <span slot="label" class="fontClass">空气质量图</span>
          <el-empty description="暂无数据"></el-empty>
        </el-tab-pane>
        <!-- <el-tab-pane label="花见展示图">
          <span slot="label" class="fontClass">花见展示图</span>
          <el-empty class="flower" image="../花见.png" description="花见展示图">
            <el-button type="primary" @click="jumpToFlowerMeet">跳转到花见</el-button>
          </el-empty>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div></div>
  </div>
</template>

<script>
import ParkingMap from "../ParkingMap.vue";
export default {
  components: {
    ParkingMap,
  },
  data() {
    return {
      activeTab: null, // 用于存储当前激活的标签页
    };
  },
  methods: {
    jumpToFlowerMeet() {
      window.open("https://www.fzu-urbansensing.com/flowermeet/");
    },
  },
  watch: {
    // activeTab(newVal) {
    //   if (newVal === "parkingMap" && this.$refs.parkingMapComponent) {
    //     this.$refs.parkingMapComponent.loadIframe();
    //   }
    //   // 以后可以按需添加新的地图
    // },
  },
};
</script>

<style lang="less" scoped>
.tabs {
  height: 800px;
  width: 90%;
  margin: 0 auto;
}
.fontClass {
  display: inline-block;
  width: 100px;
  text-align: center;
  font-size: 14px;
}
.mapIframe {
  min-height: 800px;
  width: 100%;
}
.el-empty {
  margin-top: 10%;
}
.flower {
  margin-top: 0%;
  padding: 0 0;
  /deep/ .el-empty__image {
    width: 100%;
  }
}
</style>
