<template>
  <!-- 病床监护 -new  -->
  <div class="home-bg">
    <!-- <el-button @click="handleFullScreen">全屏</el-button> -->
    <div class="center">
      <el-row>
        <el-col :span="6" v-for="item in tableData" :key="item.sickbed_id">
          <!-- 病床卡片容器 -->
          <div class="bed-card-content">
            <el-col :span="5" :offset="19">
              <div class="card-right">
                <p
                  style="line-height: 40px;font-size: 12px;text-align:center"
                >{{item.infusion_sum}}ml</p>
                <p
                  style="padding:30px 20px;font-size: 12px;text-align:center;color: #fff"
                >{{item.transfusion_progress == null?0:item.transfusion_progress}}%</p>
              </div>
            </el-col>
            <el-row>
              <!-- 卡片头部 -->
              <el-col :span="19" style="padding-top:6px">
                <div>
                  <el-col :span="8">
                    <el-image :src="bedLogoUrl" fit="contain" @click="openDialog(item)"></el-image>
                  </el-col>
                  <el-col :span="16" style="padding-left: 2px">
                    <p class="baseinfo">
                      <el-tag
                        effect="dark"
                        size="mini"
                        style="border-radius: 30px;font-weight: bold"
                      >{{item.sickbed_id}}床</el-tag>
                      <span style="font-weight: bold">{{item.name}}</span>
                      <span>&nbsp;&nbsp;性别: {{item.sex}}</span>
                    </p>
                    <p class="baseinfo">
                      <span>入院时间:</span>
                      <span style="color: #409EFF">{{item.in_date}}</span>
                      <span>&nbsp;&nbsp;年龄 : {{item.age}}岁</span>
                    </p>
                    <p class="baseinfo">
                      <span>医生: {{item.doctor}}</span>
                      <span>&nbsp;&nbsp;护士 : {{item.nurse}}</span>
                    </p>
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-divider style="margin:0px;"></el-divider>
            <el-row>
              <!-- 卡片中间 输液进度 -->
              <el-col :span="19">
                <p class="baseinfo">
                  <el-col :span="12">
                    <span>体温:</span>
                    <span style="color: red">{{item.temperature}} ℃</span>
                  </el-col>
                  <el-col :span="12">
                    <span>脉搏:</span>
                    <span style="color: #21c17f">{{item.sphygmus}} BPM</span>
                  </el-col>
                </p>
                <p class="baseinfo">
                  <el-col :span="12">
                    <span>SpO₂:</span>
                    <span style="color: red">{{item.blood_oxygen}}%</span>
                  </el-col>
                  <el-col :span="12">
                    <span>血糖:</span>
                    <span style="color: #21c17f">{{item.blood_sugar}}mmol/L</span>
                  </el-col>
                </p>
                <p class="baseinfo">
                  <el-col :span="24">
                    <span>当日尿量:</span>
                    <span style="color: #21c17f">{{item.urinate_volume}}ml</span>
                  </el-col>
                </p>
                <p class="baseinfo">
                  <el-col :span="13">
                    <span>膀胱训练:</span>
                    <span style="color: #21c17f">{{item.bladder}}min/次</span>
                  </el-col>
                  <el-col :span="11">
                    <span>排尿计时:</span>
                    <span style="color: red">{{item.urine_time}}min</span>
                  </el-col>
                </p>
              </el-col>
            </el-row>
            <el-divider style="margin:0px;"></el-divider>
            <el-row>
              <!-- 卡片底部开关 -->
              <el-col :span="19">
                <span style="font-size: 12px">
                  尿袋开关
                  <el-switch v-model="item.urine_switch" active-color="#13ce66"></el-switch>
                </span>
                <span style="float:right;font-size: 12px">
                  输液开关
                  <el-switch v-model="item.transfusion_switch" active-color="#13ce66"></el-switch>
                </span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 二级弹窗 -->

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :show-close="false"
      :fullscreen="true"
    >
      <!-- 标题开始 -->
      <div slot="title" class="dialog-title">
        <el-row>
          <el-col :span="5" :offset="1">
            <span>2019-9-6</span>
            <span>&nbsp;&nbsp;&nbsp;星期四</span>
          </el-col>
          <el-col :span="17">
            <span style="float:right">16:00</span>
          </el-col>
          <el-col :span="1">
            <i class="el-icon-close" style="margin-left:50%"></i>
          </el-col>
        </el-row>
      </div>
      <!-- 标题结束 -->

      <!-- 内容开始 -->
      <el-container>
        <!-- 左侧 -->
        <el-aside width="81%">
          <el-container>
            <el-header>
              <el-tag effect="dark" size="mini" style="border-radius: 30px;font-weight: bold">136床</el-tag>
              <el-image :src="bedLogoUrl" fit="contain" @click="openDialog(item)"></el-image>
            </el-header>
            <el-main>
              <el-container>
                <el-aside>中部左侧报表</el-aside>
                <el-main>中部右侧报表</el-main>
              </el-container>
            </el-main>
            <el-footer>底部报表</el-footer>
          </el-container>
        </el-aside>
        <!-- 右侧 -->
        <el-main>输液瓶</el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import pvcApi from "@/api/patentview";
import util from "@/utils/util";
export default {
  data() {
    return {
      bedLogoUrl: "/static/image/card-bed.png",
      tableData: [],
      value: 1,
      value2: 1,
      fullscreen: true,
      dialogVisible: true,
      requestParam : {
        page : 1,
        pageSize : 12
      }
    };
  },
  mounted() {
    this.getCurrentPatientMonitort();
    this.test();
    // if (this.timer) {
    //   clearInterval(this.timer);
    // } else {
    //   this.timer = setInterval(() => {
    //     this.getCurrentPatientMonitort();
    //   }, 2000);
    // }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // 测试
    test(){
      let obj ={
        name : "csq",
        age :123
      }
      var arr = [];
      for(var i=0;i<8;i++){
        arr[i] = obj;
      }
      var arr2 = arr.map(function(value,index){
        return value.name;
      })
      console.log(arr2);
    },

    // 获取监护数据接口
    getCurrentPatientMonitort() {
      this.tableData = [];
      pvcApi.getCurrentPatientMonitort(this.requestParam).then(response => {
        response.data.forEach((item, index) => {
          var temp = {};
          temp.sickbed_id = item["sickbed_id"];
          temp.name = item["name"];
          temp.sex = item["sex"];
          var birthdays =
            typeof item["birthdate"] === "undefined"
              ? null
              : new Date(item["birthdate"]);
          var d = new Date();
          temp.age =
            birthdays === null
              ? null
              : d.getFullYear() -
                birthdays.getFullYear() -
                (d.getMonth() < birthdays.getMonth() ||
                (d.getMonth() === birthdays.getMonth() &&
                  d.getDate() < birthdays.getDate())
                  ? 1
                  : 0);
          temp.in_date =
            typeof item["operate_time"] === "undefined"
              ? null
              : item["operate_time"].substr(0, 10);
          temp.doctor = item["doctor"];
          temp.nurse = item["nurse"];
          temp.occur_time =
            typeof item["occur_time"] === "undefined"
              ? null
              : item["occur_time"].substr(0, 10);
          temp.device_id = item["device_id"];
          temp.temperature = item["temperature"];
          temp.infusion_sum = item["infusion_sum"];
          temp.sphygmus = item["sphygmus"];
          temp.blood_oxygen = item["blood_oxygen"];
          temp.blood_sugar = item["blood_sugar"];
          temp.urinate_volume = item["urinate_volume"];
          temp.transfusion_progress = item["transfusion_progress"];
          temp.bladder = item["bladder"];
          temp.urine_time = item["urine_time"];
          temp.urine_switch = item["urine_switch"];
          temp.transfusion_switch = item["transfusion_switch"];
          this.tableData.push(temp);
        });
      });
    },

    // 二级弹窗操作
    openDialog(row) {
      this.dialogVisible = true;
    },
    handleClose() {}
  }
};
</script>

<style>
.home-bg {
  background: url(/static/image/monitor-bg.png) repeat-y center;
  margin: 0 auto;
  /* min-height: 800px; */
}
div.el-card__header {
  padding: 0px 10px 10px 10px;
}
div.el-divider--horizontal {
  /* display: block; */
  height: 1px;
  width: 100%;
  margin: 5px 0;
}
div.el-divider {
  background-color: #dcdfe6;
  position: initial;
}
div.el-dialog__header {
  padding: 0;
}
.el-dialog__body {
  padding: 0;
  color: #eef3f7;
  font-size: 14px;
  word-break: break-all;
}
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  height: 150px;
}
.el-main {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
}
.center {
  width: 98%;
  padding-left: 1%;
}
.box-card {
  margin: 5px;
  border-radius: 4px;
  padding: 0;
  /* font-size: 14px; */
  /* width: 428px; */
}
/* 二级弹窗标题 */
.dialog-title {
  background: url(/static/image/dialog-title.png) no-repeat center;
  margin: 0 auto;
  height: 57px;
  line-height: 57px;
  color: #fff;
  font-weight: bold;
}

.card-mid {
  padding: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.baseinfo {
  margin: 5px auto;
  font-size: 14px;
}

/* 不用el-card */
.bed-card-content {
  background-color: #fff;
  border-radius: 4px;
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 5px;
  padding: 0px 6px 6px 6px;
  position: relative;
}
.card-right {
  background: url(/static/image/right-infusion.png) no-repeat;
  background-size: 100% 100%;
  height: 85%;
  width: 16%;
  text-align: center;
  position: absolute;
}

@media screen and (max-width: 1300px) {
  .baseinfo {
    margin: 5px auto;
    font-size: 0.6em;
  }
  .card-right {
    background: url(/static/image/right-infusion.png) no-repeat;
    background-size: 100% 100%;
    height: 82%;
    width: 20%;
    text-align: center;
    position: absolute;
  }
}
</style>
