<template>
  <div ref="mapContainer">
    <iframe
      id="parkFrame"
      src="ParkingMap/parkingMap.html"
      frameborder="0"
      scrolling="no"
      class="mapIframe"
    ></iframe>
  </div>
</template>

<script>
import { Loading } from "element-ui";

import Mock from "mockjs";
import axios from "axios";

export default {
  name: "ParkingMap",
  created() {
    this.loadIframe();
  },
  data() {
    return {
      loadingInstance: null,
      iframeLoaded: false,
    };
  },
  mounted() {
    window.addEventListener("message", this.handleMessage);
  },
  methods: {
    loadIframe() {
      if (!this.iframeLoaded) {
        this.iframeLoaded = true; // 标记 iframe 已加载
        this.$nextTick(() => {
          /* 在 DOM 更新后初始化 Loading 服务
            保证 mapContainer 已经在 DOM 中，
            可以被 Loading 服务作为目标使用 */
          this.loadingInstance = Loading.service({
            target: this.$refs.mapContainer, // 只在指定区域 loading
          });
        });
      }
    },
    // ⭐ 解决iframe 传来的数据 ⭐
    handleMessage(event) {
      if (event.data.type === "MAP_LOADED") {
        console.log("停车位地图加载完成");
        this.closeLoading();
      }
      if (this.iframeLoaded && event.data.type === "GET_CONGESTION_DATA") {
        // 调用 getCongestionData 方法并传递时间
        this.getCongestionData(event.data.time);
      }
    },
    getCongestionData(date) {
      // 拦截 axios（无后端时，前端测试用）
      // Mock.mock(RegExp("/road/get/congestion/byTime" + ".*"), "post", () => {
      //   return [
      //     {
      //       value: 5,
      //       roadCoordinate: [
      //         { longitude: 119.262, latitude: 26.047 },
      //         { longitude: 119.263, latitude: 26.048 },
      //       ],
      //     },
      //     {
      //       value: 10,
      //       roadCoordinate: [
      //         { longitude: 119.264, latitude: 26.049 },
      //         { longitude: 119.265, latitude: 26.05 },
      //       ],
      //     },
      //     {
      //       value: 15,
      //       roadCoordinate: [
      //         { longitude: 119.266, latitude: 26.051 },
      //         { longitude: 119.267, latitude: 26.052 },
      //       ],
      //     },
      //     {
      //       value: 20,
      //       roadCoordinate: [
      //         { longitude: 119.268, latitude: 26.053 },
      //         { longitude: 119.269, latitude: 26.054 },
      //       ],
      //     },
      //   ];
      // });

      axios
        .post("/road/get/congestion/byTime", { date: date })
        .then((response) => {
          console.log("Vue的停车数据:", response.data);
          /* 将获取的数据传入 iframe 处理
          由于这份【祖传】代码之前是利用原生js写的
          避免大量重构，于是这么处理 */
          const iframe = document.getElementById("parkFrame");
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              { type: "CONGESTION_DATA_RECEIVED", data: response.data },
              "*"
            );
          }
        })
        .catch((error) => {});
    },

    closeLoading() {
      if (this.loadingInstance) {
        this.loadingInstance.close(); // 关闭 Loading
        this.loadingInstance = null; // 重置 Loading 实例
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.handleMessage);
    this.closeLoading();
  },
};
</script>

<style scoped>
.mapIframe {
  min-height: 800px;
  width: 100%;
}
</style>
