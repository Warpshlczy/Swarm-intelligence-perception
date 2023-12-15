<template>
  <div>
    <baidu-map
      class="map"
      :center="gpsCenter"
      :zoom="15"
      :scroll-wheel-zoom="scrollWheelZoom"
    >
      <bm-marker :position="gpsCenter"> </bm-marker>
      <template v-for="taskGroup in tasks">
        <bm-marker
          v-for="task in taskGroup"
          :key="task.id"
          :position="{ lng: task.longitude, lat: task.latitude }"
          :icon="{
            url: getIconForTaskType(task.type),
            size: { width: 150, height: 150 },
            opts: { imageSize: getIconSizeForTask(task.id) },
          }"
          @click="showDialog(task.id)"
        >
          <bm-label
            :content="taskOrder[task.id].toString()"
            :labelStyle="labelStyle"
          />
        </bm-marker>
      </template>
    </baidu-map>
    <!-- 图例 -->
    <el-card class="legend">
      <el-row style="padding-bottom: 15px">
        <img width="25px" src="@/assets/images/GreenMarker.png" />
        <span>停车位</span>
      </el-row>
      <el-row>
        <img width="25px" src="@/assets/images/YellowMarker.png" />
        <span>噪声</span>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getNearbyTasks } from "@/api/task";
import AirMarker from "@/assets/images/GreenMarker.png";
import NoiseMarker from "@/assets/images/YellowMarker.png";

export default {
  name: "NearbyTasksMap",
  data() {
    return {
      distance: 10000, // 默认查询范围
      scrollWheelZoom: true,
      gpsCenter: {
        lng: "",
        lat: "",
      },
      tasks: [],
      taskOrder: {},
      icons: {
        噪声: NoiseMarker,
        空气质量: AirMarker,
      },
      labelStyle: {
        fontSize: "15px",
        fontWeight: "bolder",
        background: "transparent",
        border: "transparent",
        paddingLeft: "10px",
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      },
    };
  },
  created() {
    this.getGeolocation().then(() => {
      this.queryNearbyTasks();
    });
  },
  methods: {
    // 获取用户当前坐标
    async getGeolocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.gpsCenter = {
                lng: position.coords.longitude,
                lat: position.coords.latitude,
              };
              resolve();
            },
            (error) => {
              console.error("Error occurred: ", error);
              reject(error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    },
    // 查询附近任务
    async queryNearbyTasks() {
      try {
        const resp = await getNearbyTasks({
          longitude: this.gpsCenter.lng,
          latitude: this.gpsCenter.lat,
          distance: this.distance,
        });
        this.tasks = resp.data.data;
        this.taskOrder = {};
        let order = 1; // 初始化任务序号
        this.tasks.forEach((taskGroup) => {
          taskGroup.forEach((task) => {
            this.taskOrder[task.id] = order++; // 为每个任务分配一个唯一的序号
          });
        });
      } catch (err) {
        console.error(err);
      }
    },
    getIconForTaskType(taskType) {
      return this.icons[taskType];
    },
    getIconSizeForTask(taskId) {
      const order = this.taskOrder[taskId];
      if (order >= 1 && order <= 3) {
        return { width: 45, height: 45 }; // 对于1-3号的任务，使用更大的图标
      }
      return { width: 30, height: 30 };
    },
    showDialog(taskId) {
      this.$alert("", "查看具体任务", {
        confirmButtonText: "确定",
        callback: (action) => {
          if (action === "confirm") {
            // 跳转到具体的任务
            this.$router.push({ path: `/Task`, query: { id: taskId } });
          }
        },
      });
    },
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 800px;
}

.legend {
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 1000;
}
</style>