<template>
  <el-container style="border: 1px solid #eee" >
    <el-aside width="0" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>监护数据
          </template>
          <el-menu-item index="1-1">病床监护</el-menu-item>
          <el-menu-item index="1-6">病床监护2</el-menu-item>
          <el-menu-item index="1-2">患者信息</el-menu-item>
          <el-menu-item index="1-3">病床信息</el-menu-item>
          <el-menu-item index="1-4">医护信息</el-menu-item>
          <el-menu-item index="1-5">设备信息</el-menu-item>
          <!--           <el-menu-item index="1-6">监护历史</el-menu-item>
          <el-menu-item index="1-7">日志查询</el-menu-item>
          <el-menu-item index="1-8">出入院查询</el-menu-item>-->
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px" v-if="false">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>监护系统</span>
      </el-header>
      <el-main class="el-main2">
        <!-- <div style="margin-top:10px"> -->
          <!-- <keep-alive> -->
        <router-view></router-view>
          <!-- </keep-alive> -->
        <!-- </div> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      webHeight: window.innerHeight - 20 + "px"
      // searchCriteria: '',
      // breadcrumbItems: ['导航一']
    };
  },
  mounted() {
    // this.drawLine()
    // setInterval(this.getIntervalData, 1000)
    // 注：window.onresize只能在项目内触发1次
    window.onresize = function windowResize() {
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      this.webHeight = window.innerHeight - 20 + "px";
    };
  },
  methods: {
    handleIconClick(ev) {
      console.log(ev);
    },
    handleSelect(key, keyPath) {
      switch (key) {
        case "1-1":
          this.$router.push("/PatientView");
          // this.breadcrumbItems  = ['导航一']
          break;
        case "1-2":
          this.$router.push("/PatientInfo");
          // this.breadcrumbItems  = ['导航二']
          break;
        case "1-4":
          this.$router.push("/MedicalWorkerInfo");
          // this.breadcrumbItems  = ['导航三']
          break;
        case "1-5":
          this.$router.push("/DeviceInfo");
          // this.breadcrumbItems  = ['导航三']
          break;
        case "1-3":
          this.$router.push("/SickbedInfo");
          // this.breadcrumbItems  = ['导航三']
          break;
        // case '1-6':
        // this.$router.push('/MonitorHistory')
        // this.breadcrumbItems  = ['导航三']
        // break
        case "1-6":
          this.$router.push("/monitorList");
          break;
        case "1-7":
          this.$router.push("/LogQuery");
          // this.breadcrumbItems  = ['导航三']
          break;
      }
    }
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
.el-main2{
  padding :0 0;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 80px;
  width: 100%;
}
</style>
