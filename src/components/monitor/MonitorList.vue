
<template>
  <div class="home">
    <info-list
      v-for="item in tableData"
      :key="item.id"
      :item="item"
      @click.native="goInfoDetail(item)"
    ></info-list>
    <div class="foote">
      <!-- <el-pagination background 
              @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="requestParam.page" :page-size="requestParam.pageSize" layout="total,prev, pager, next" :total="total"></el-pagination>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestParam.page"
        :page-size="requestParam.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="病人入院" :visible.sync="addmsgShow" width="50%">
      <el-form :model="baseInfo" :rules="rules" ref="baseInfo" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="baseInfo.patientName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者性别" prop="sex">
              <el-select v-model="baseInfo.sex" placeholder="请选择">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="patientPhone">
              <el-input v-model="baseInfo.patientPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者年龄" prop="age">
              <el-input-number v-model="baseInfo.age" :min="1" :max="300" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生姓名" prop="doctorName">
              <el-input v-model="baseInfo.doctorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护士姓名" prop="nurseName">
              <el-input v-model="baseInfo.nurseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="科室名称" prop="departmentName">
              <el-input v-model="baseInfo.departmentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人" prop="operaterName">
              <el-input v-model="baseInfo.operaterName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入院时间" prop="inHosTime">
              <el-date-picker
                v-model="baseInfo.inHosTime"
                align="right"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输液总量" prop="transfusionSum">
              <el-input-number v-model="baseInfo.transfusionSum" :min="0" :max="999" :step="50"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="patientInHos">入院</el-button>
          <!-- <el-button @click="resetForm('baseInfo')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import infoList from "@/common/homelist/infoList";
import pvcApi from "@/api/patentview";

export default {
  components: {
    infoList
  },
  name: "home",
  data() {
    return {
      addmsgShow: false,
      tableData: [],
      total: 0,
      requestParam: {
        page: 1,
        pageSize: 12
      },
      baseInfo: {
        patientName: "",
        sex: "男",
        age: 18,
        patientPhone: "",
        transfusionSum: 500,
        doctorName: "",
        nurseName: "",
        inHosTime: new Date(),
        departmentName: "骨科一室",
        operaterName: "刘玄德",
        sickbedNum: 0
      },
      rules: this.globalRules.inHosRules,
      sexOptions: this.globalOptions.sexOptions,
      pickerOptions: this.globalOptions.pickerOptions
    };
  },
  created() {
    this.getCurrentPatientMonitort();
    // if (this.timer) {
    //   clearInterval(this.timer)
    // } else {
    //   this.timer = setInterval(() => {
    //     this.getCurrentPatientMonitort()
    //   }, 2000)
    // }
  },
  methods: {
    // 获取监护数据接口
    getCurrentPatientMonitort() {
      // this.tableData = [];
      pvcApi.getCurrentPatientMonitort(this.requestParam).then(response => {
        this.total = response.data.total;
        this.tableData = response.data.list;
      });
    },

    goInfoDetail(item) {
      if (item.patientId > 0) {
        sessionStorage.setItem("showDetailBedNum", item.sickedId);
        sessionStorage.setItem("showDetailPatientId", item.patientId);
        this.$router.push({ path: "/monitorDetail" });
      } else {
        this.clear();
        this.baseInfo.sickbedNum = item.sickedId;
        this.addmsgShow = true;
      }
    },
    // 入院
    patientInHos() {
      this.baseInfo.inHosTime = this.formatterTime(this.baseInfo.inHosTime);
      this.$refs["baseInfo"].validate(valid => {
        if (valid) {
          pvcApi.patientInHos(this.baseInfo).then(data => {
            this.addmsgShow = false;
            this.getCurrentPatientMonitort();
          });
        } else {
          return false;
        }
      });
    },
    // 入院基础信息初始化
    clear() {
      this.baseInfo.patientName = "";
      this.baseInfo.sex = "男";
      this.baseInfo.age = 18;
      this.baseInfo.patientPhone = "";
      this.baseInfo.transfusionSum = 500;
      this.baseInfo.doctorName = "";
      this.baseInfo.nurseName = "";
      this.baseInfo.inHosTime = new Date();
      this.baseInfo.departmentName = "";
      this.baseInfo.operaterName = "";
      this.baseInfo.sickbedNum = 0;
    },
    closeAddmsg() {
      this.addmsgShow = false;
    },
    handleSizeChange(val) {
      this.requestParam.pageSize = val;
      this.getCurrentPatientMonitort();
    },
    handleCurrentChange(val) {
      this.requestParam.page = val;
      this.getCurrentPatientMonitort();
    },
    formatterTime: time => {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      // const dateTime = year + '-' + month + '-' + day + ' ' + utils.checkLength(hour) + ':' + utils.checkLength(minutes) + ':' + utils.checkLength(seconds)
      const dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    checkLength: str => {
      str = str.toString();
      if (str.length < 2) {
        str = "0" + str;
      }
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  // height: 10.80rem;
  background: url(../../assets/images/bg.png) no-repeat;
  background-size: 100% 100%;
  padding: 0.34rem 0.42rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .foote {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .addmsg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 11;
    .msg_container {
      width: 60%;
      height: 60%;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0rem 0.2rem 0.24rem 0rem rgba(75, 117, 152, 0.1);
      border-radius: 0.2rem;
      padding: 0.2rem;
      box-sizing: border-box;
    }
  }
}
</style>