<template>
  <div class="infoDetail">
    <div class="title">
      <div class="title_left">
        <span>{{headerTime.date}}</span>
        <span>{{headerTime.week}}</span>
      </div>
      <div class="title_right">
        {{headerTime.time}}
        <el-button
          round
          type="success"
          @click="goToHome"
          icon="el-icon-caret-left"
          style="font-size: 0.26rem;font-weight:bold"
          size="medium"
        >返回主页</el-button>
      </div>
    </div>
    <div class="infoDetail_container">
      <div class="left">
        <div class="left_top">
          <p class="num" @click="toChangeBed">{{patientInfo.sickbedNum}}床</p>
          <div class="pic">
            <img src="../../assets/images/dpic.png" alt />
            <div class="come" @click="patientOut">出院</div>
          </div>
          <div class="patient_info" @click="editPatientShow">
            <h3 class="name">{{patientInfo.patientName}}</h3>
            <p class="sex">性别: {{patientInfo.sex}}</p>
            <p class="age">年龄: {{patientInfo.age}}岁</p>
            <div class="startime">
              入院时间：
              <span>{{patientInfo.inHosTime | formatDate}}</span>
            </div>
            <div class="doc">
              <div class="pic">
                <img src="../../assets/images/ys.png" alt />
              </div>
              <p>
                医生：
                <span>{{patientInfo.doctorName}}</span>
              </p>
            </div>
            <div class="doc">
              <div class="pic">
                <img src="../../assets/images/hs.png" alt />
              </div>
              <p>
                护士：
                <span>{{patientInfo.nurseName}}</span>
              </p>
            </div>
          </div>
          <!-- 导出按钮 -->
          <el-button type="primary" color="red" round @click="exportOperation">导出</el-button>
        </div>
        <div class="left_ctn">
          <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="wrapper">
            <div class="menu-container" ref="menuContainer">
              <div id="one" class="one"></div>
            </div>
          </v-touch>
          <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="wrapper">
            <div id="two" class="two"></div>
          </v-touch>
          <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="wrapper">
            <div id="three" class="three"></div>
          </v-touch>
          <div class="four" @click="toUpdatePatientBladder">
            <div class="four_left">
              <div class="left_title">膀胱训练</div>
              <div id="fourpic" class="fourpic">
                <div class="four_text">
                  <h4>{{ patientInfo.urineTimer === null?0: patientInfo.urineTimer}}分钟</h4>
                  <p>剩余</p>
                </div>
                <el-progress
                  type="circle"
                  :percentage="timePercentage"
                  color="#4089FF"
                  :stroke-width="16"
                ></el-progress>
              </div>
            </div>
            <div class="fourmsg">
              <p>
                剩余时间：
                <span>{{ patientInfo.urineTimer === null?0:parseInt(patientInfo.urineTimer/100) }}</span>
                <span>{{ patientInfo.urineTimer === null?0:parseInt((patientInfo.urineTimer%100)/10) }}</span>
                <span>{{ parseInt(patientInfo.urineTimer%10) }}</span>
                <!-- <span>6</span>
                <span>0</span>-->
                分钟
              </p>
              <h3>
                <span></span>
                膀胱训练：{{patientInfo.bladder === null?0:patientInfo.bladder}}分钟/次
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div class="rightcontainer">
        <div class="right" @click="toUpdatePatientTransf">
          <div class="process">
            <div class="process_container">
              <div class="process_ctn"></div>
              <p>{{patientInfo.transfusionSum}}ml</p>
              <h3>{{patientInfo.transfusionProgress === null?0:patientInfo.transfusionProgress}}%</h3>
              <div class="mid">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rightcontainerbtn" @click.stop="operatorSwitch">
          <div class="control">
            <span class="controltext">尿袋开关:</span>
            <el-switch
              v-model="patientInfo.urineSwitch"
              active-color="#E8F1ED"
              inactive-color="#EAEAEA"
              active-text="开"
              inactive-text="关"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </div>
          <div class="control">
            <span class="controltext">输液开关:</span>
            <el-switch
              v-model="patientInfo.transfusionSwitch"
              active-color="#E8F1ED"
              inactive-color="#EAEAEA"
              active-text="开"
              inactive-text="关"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改病人信息弹窗 -->
    <el-dialog title="病人入院" :visible.sync="editPatientInfoVisbale" width="50%">
      <el-form :model="editInfo" :rules="rules" ref="editInfo" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="editInfo.patientName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者性别" prop="sex">
              <el-select v-model="editInfo.sex" placeholder="请选择">
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
              <el-input v-model="editInfo.patientPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者年龄" prop="age">
              <el-input-number v-model="editInfo.age" :min="1" :max="300" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生姓名" prop="doctorName">
              <el-input v-model="editInfo.doctorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护士姓名" prop="nurseName">
              <el-input v-model="editInfo.nurseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="科室名称" prop="departmentName">
              <el-input v-model="editInfo.departmentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人" prop="operaterName">
              <el-input v-model="editInfo.operaterName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入院时间" prop="inHosTime">
              <el-date-picker
                v-model="editInfo.inHosTime"
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
              <el-input-number v-model="editInfo.transfusionSum" :min="0" :max="999" :step="50"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="updatePatientInfo">确认</el-button>
          <el-button @click="editPatientInfoVisbale = !editPatientInfoVisbale">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改输液总量 -->
    <el-dialog title="修改输液总量" :visible.sync="editPatientTransfVisbale" width="50%">
      <el-form :model="editTransfInfo" :rules="rules" ref="editTransfInfo" label-width="100px">
        <el-form-item label="输液总量" prop="transfusionSum">
          <el-input-number v-model="editTransfInfo.transfusionSum" :min="0" :max="999" :step="50"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePatientInfusion">确认</el-button>
          <el-button @click="editPatientTransfVisbale = !editPatientTransfVisbale">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改膀胱训练数据总量 -->
    <el-dialog title="修改膀胱训练" :visible.sync="editPatientBladderVisbale" width="50%">
      <el-form :model="editBladderInfo" :rules="rules" ref="editBladderInfo" label-width="220px">
        <el-form-item label="膀胱训练(分钟/次)" prop="bladder">
          <el-input-number v-model="editBladderInfo.bladder" :min="5" :max="180" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePatientBladder">确认</el-button>
          <el-button @click="editPatientBladderVisbale = !editPatientBladderVisbale">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 换床弹窗 -->
    <el-dialog title="换床" :visible.sync="changeBedVisable" width="50%">
      <el-form :model="editBladderInfo" :rules="rules" ref="changeBedInfo" label-width="120px">
        <el-form-item label="当前床号" prop="oldSickbedNum">
          <el-input v-model="changeBedInfo.oldSickbedNum" :disabled="true" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="目标床号" prop="newSickbedNum">
          <el-select v-model="changeBedInfo.newSickbedNum" placeholder="请选择" no-data-text="无可用空床">
            <el-option
              v-for="item in emptyBedsOptions"
              :key="item.id"
              :label="item.sickbedNum"
              :value="item.sickbedNum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeBed">确认</el-button>
          <el-button @click="changeBedVisable = !changeBedVisable">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 导出弹框 -->
    <el-dialog title="导出" @opened="exportClosedialog" :visible.sync="exportdataVisable" width="50%">
      <div>
        <span style="margin-right:1%">项目类型</span>
        <el-checkbox label="血糖" v-model="sugar"></el-checkbox>
        <el-checkbox label="体温" v-model="temperature"></el-checkbox>
        <el-checkbox label="血氧" v-model="oxygen"></el-checkbox>
        <el-checkbox label="尿量" v-model="urinateVolume"></el-checkbox>
        <el-checkbox label="脉搏" v-model="sphygmus"></el-checkbox>
      </div>

      <div style="margin-top:3%;">
        <span>导出格式</span>
        <el-select v-model="exportTypeValue" placeholder="请选择" style="width:62%;margin-left:1%">
          <el-option
            v-for="item in exportType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <!-- 导出时间选项 -->
      <div id="daterpicker" style="margin-top:3%;">
        <div class="block">
          <span style="margin-right:1%">时间选择</span>
          <el-date-picker
            v-model="exportDate"
            type="daterange"
            change="changeExporDate"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :editable="false"
          ></el-date-picker>
        </div>
      </div>

      <el-row style="margin-top:3%;margin-left:3%;" class="center">
        <el-button @click="exportPdf">导出</el-button>
        <el-button @click="exportClose">关闭</el-button>
        <el-button @click="DerivedData">渲染</el-button>
      </el-row>
    </el-dialog>

    <!--  transform:rotate(-90deg);position:fixed;left:-50% -->
    <!-- 血糖导出模块 -->
    <div
      v-for="(item,index) in sugerData"
      :id="getDivID(index)"
      :key="item.index"
      style="width:95;transform:rotate(-90deg);"
    >
      <div :id="getechartID(index)" style="width:100%;height:400px;"></div>
      <div style="display:flex">
        <div style="height:650px;clear:both;display:inline-block;margin:auto;">
          <el-table
            v-for="item in getsuggerTableData(index)"
            :key="item.index"
            :data="item.item"
            style="width:auto;float:left;"
            :row-style="{height:'38px'}"
            :cell-style="{padding:'0px'}"
          >
            <el-table-column
              align="center"
              v-for="(i,index) in (item.item).slice(0,1)"
              :key="index"
              :label="i.date"
            >
              <el-table-column align="center" prop="dateTime" label="时间" width="70"></el-table-column>
              <el-table-column align="center" prop="bloodSuger" label="血糖" width="70"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div id="tableStyle">
      <!-- 导出体温模块 -->
      <div
        style="width:120%;transform:rotate(-90deg);"
        :id="getTemperatureDivID(index)"
        v-for="(item,index) in temperatureData"
        :key="item.index"
      >
        <!-- 体温echarts -->
        <div :id="getTemperatureEchartID(index)" style="width:100%;height:400px;"></div>
        <!-- 体温数据表格 -->
        <!-- <div style="display:flex"> -->
        <div style="width:100%;height:700px;clear:both;display:inline-block;margin:auto;">
          <table style="width:100%;margin-top:55px">
            <tr style="background:#F5F7FA">
              <td style="width:8%">日期</td>
              <td v-for="item in exportTableDateList" :key="item.index">{{item}}</td>
            </tr>
            <tr v-for="item in getTemperatureTableData(index)" :key="item.index">
              <td
                style="width:8%;background:#F5F7FA"
                v-for="j in (item.item).slice(0,1)"
                :key="j.index"
              >{{j.date}}</td>
              <td v-for="i in (item.item)" :key="i.index">{{i.temperature}}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 导出血氧模块  -->
      <div
        style="width:120%;transform:rotate(-90deg);"
        :id="getSpo2DivID(index)"
        v-for="(item,index) in spo2Data"
        :key="item.index"
      >
        <!-- 血氧echarts -->
        <div :id="getSpo2EchartID(index)" style="width:100%;height:400px;"></div>
        <!-- 血氧数据表格 -->
        <div style="width:100%;height:700px;clear:both;display:inline-block;margin:auto;">
          <table style="width:100%;margin-top:55px">
            <tr style="background:#F5F7FA">
              <td style="width:8%">日期</td>
              <td v-for="item in exportTableDateList" :key="item.index">{{item}}</td>
            </tr>
            <tr v-for="item in getSpo2TableData(index)" :key="item.index">
              <td
                style="width:8%;background:#F5F7FA"
                v-for="j in (item.item).slice(0,1)"
                :key="j.index"
              >{{j.date}}</td>
              <td v-for="i in (item.item)" :key="i.index">{{i.spo2}}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 尿量 -->
      <div
        style="width:120%;transform:rotate(-90deg);"
        :id="getUrineDivID(index)"
        v-for="(item,index) in urineData"
        :key="item.index"
      >
        <div :id="getUrineEchartID(index)" style="width:100%;height:400px;"></div>
        <!-- 尿量数据表格 -->
        <div style="width:100%;height:700px;clear:both;display:inline-block;margin:auto;">
          <table style="width:100%;margin-top:55px">
            <tr style="background:#F5F7FA">
              <td style="width:8%">日期</td>
              <td v-for="item in exportTableDateList" :key="item.index">{{item}}</td>
            </tr>
            <tr v-for="item in getUrineTableData(index)" :key="item.index">
              <td
                style="width:8%;background:#F5F7FA"
                v-for="j in (item.item).slice(0,1)"
                :key="j.index"
              >{{j.date}}</td>
              <td v-for="i in (item.item)" :key="i.index">{{i.urinateVol}}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 脉搏 -->
    </div>
  </div>
</template>

<script>
// 引入基本模板,按需加载
let echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入柱状图
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import pvcApi from "@/api/patentview";
import util from "@/common/js/util";
import html2Canvas from "html2canvas";
import jspdf from "jspdf";

export default {
  name: "infoDetail",
  data() {
    return {
      testtab: null,
      //导出选项选项框
      sugar: false,
      temperature: false,
      oxygen: false,
      urinateVolume: false,
      sphygmus: false,

      printID: "",
      exportDate: "",
      export: {
        patientId: 0,
        startTime: null,
        endTime: null
      },
      pickerOptions: {
        disabledDate(time) {
          // console.log(time.getTime() < Date.now() - 8.64e7);
          return time.getTime() < Date.now() - 8.64e7; //设置时间选择的限制
        }
      },
      exportType: [
        {
          value: "EXCEL",
          label: "EXCEL"
        },
        {
          value: "PDF",
          label: "PDF"
        }
      ],
      value: "",
      exportTypeValue: null,
      ts: new Date(),
      headerTime: {
        date: "",
        week: "",
        time: ""
      },
      bedNum: 0,
      patientInfo: {}, // 病人信息
      editInfo: {}, // 编辑信息
      editPatientInfoVisbale: false, // 修改弹窗标识
      sexOptions: this.globalOptions.sexOptions,
      pickerOptions: this.globalOptions.pickerOptions,
      rules: this.globalRules.inHosRules, // 修改校验规则
      editPatientTransfVisbale: false, // 修改输液总量标识
      charParams: {
        patientId: 0,
        date: new Date(),
        ts: new Date()
      },
      editTransfInfo: {
        // 输液总量标识
        patientId: 0,
        transfusionSum: 500
      },
      editPatientBladderVisbale: false, // 膀胱训练弹窗标识
      editBladderInfo: {
        // 膀胱训练修改信息
        patientId: 0,
        bladder: 5
      },
      changeBedVisable: false, // 换床弹窗标识
      changeBedInfo: {
        patientId: 0,
        oldSickbedNum: 0,
        newSickbedNum: ""
      },
      emptyBedsOptions: [], // 空床下拉
      time: "090",
      timeLeft: 0,
      timePercentage: 0,
      timeRight: [],
      niaodaiVal: true,
      shuyeVal: false,
      dosage: 43,
      sugerCharList: [], // 血糖
      spo2CharList: [], // 血氧
      temperatureCharList: [], //体温
      urineCharList: [], //尿量
      sphygmusCharList: [], //脉搏
      exportdataVisable: false, //数据导出下拉, //表格数据

      sugerCharDateFromatList: [], //二级界面 血糖日期时分秒

      //pdf 导出血糖
      sugerCharListsByDay: [], //多天血糖数据
      sugerCharDateListByDay: [], //多天血糖日期
      //血糖多天
      sugerData: [], //打印时候放长度
      sugerTable: null, //表格所需

      //pdf 导出体温
      temperatureCharListsByDay: [], //多天体温数据
      temperatureCharDateListByDay: [], //多天体温日期
      temperatureTime: [],
      temperatureData: [], //体温打印时候放长度
      temperatureTable: null,

      //导出模块 血氧数据
      spo2CharListsByDay: [], //血氧多天数据
      spo2CharDateListByDay: [], //多天体温日期
      spo2Time: [],
      spo2Data: [], //体温打印时候放长度
      spo2Table: null,

      //导出模块 尿量数据
      urineCharListsByDay: [], //尿量多天数据
      urineCharDateListByDay: [], //多天尿量日期
      urineTime: [],
      urineData: [], //尿量打印时候放长度
      urineTable: null,

      //导出模块 脉搏数据
      sphygmusCharListsByDay: [], //脉搏多天数据
      sphygmusCharDateListByDay: [], //多天脉搏日期
      sphygmusTime: [],
      sphygmusData: [], //脉搏打印时候放长度
      sphygmusTable: null,
      //导出时表格显示的时间表头
      exportTableDateList: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ]
    };
  },
  mounted() {
    this.bedNum = sessionStorage.getItem("showDetailBedNum");
    this.charParams.patientId = sessionStorage.getItem("showDetailPatientId");
    // this.export.patientId = sessionStorage.getItem("showDetailPatientId");
    this.initPatientInfo(); // 病人信息加载
    this.selectMonitorDataCharList(); // 报表数据加载
    this.dealWithTime(new Date()); // 头部时间显示
    let _this = this;
    // 定时器
    this.timer = setInterval(function() {
      _this.realTime = _this.dealWithTime(new Date()); // 修改数据date
    }, 50000);
  },
  methods: {
    testtable() {
      this.testtab = new Array();
      let a = [];
      for (var i = 1; i <= 48; i++) {
        a.push({ date: "2019-9-23", time: "00:0" + i, urinateVol: "2000" });
      }
      this.testtab.push({ item: a });
    },
    //测试
    testEcharts() {
      // 基于dom，初始化echarts实例
      let test = echarts.init(document.getElementById("testEcharts"));
      // 绘制图表
      test.setOption({
        title: {
          text:
            this.patientInfo.departmentName +
            "\t\t" +
            this.patientInfo.sickbedNum +
            "床\t\t" +
            this.patientInfo.patientName +
            "\t\t体温数据",
          left: "2%",
          top: "2%",
          textStyle: {
            //设置主标题风格
            color: "#738195", //设置主标题字体颜色
            fontStyle: "" //主标题文字风格
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          name: "",
          boundaryGap: false,
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "#9DB0C1"
            }
          },
          data: this.globalCharXy.x,
          axisLabel: {
            interval: 11,
            rotate: 60,
            formatter: function(val) {
              let split0 = val.indexOf(" ");
              if (split0 != -1) {
                return val.substr(split0) + "\n" + val.substr(0, split0);
              } else {
                return val;
              }
            }
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "8%",
          containLabel: true
        },
        yAxis: [
          {
            type: "value",
            min: 35, // 设置y轴刻度的最小值
            max: 44, // 设置y轴刻度的最大值
            splitNumber: 10, // 设置y轴刻度间隔个数
            boundaryGap: false,
            // name: "温度",
            splitLine: { show: true },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#9DB0C1",
              formatter: function(val, index) {
                return val === 44 ? "(℃)" + val : val;
              }
            }
          }
        ],
        series: [
          {
            name: "体温",
            type: "line",
            symbol: "none",
            color: ["#23BF8B"],
            data: this.globalCharXy.urinate
          }
        ]
      });
    },
    exportClosedialog() {},
    // 初始化加载病人信息
    initPatientInfo() {
      pvcApi
        .selectPatientInfoByBedNum({ sickbedNum: this.bedNum })
        .then(data => {
          // console.log(data.data);
          this.patientInfo = data.data;
          this.dosageHeight();
        });
    },
    // 报表数据加载
    selectMonitorDataCharList() {
      //血糖数据
      pvcApi.selectPatientBloodSugerDef(this.charParams).then(data => {
        data.data.forEach((item, index) => {
          this.sugerCharList[index] =
            item.bloodSuger === null ? 0 : item.bloodSuger;
          this.sugerCharDateFromatList[index] =
            this.renderTime(this.toTime(item.ts))
              .split(" ")[1]
              .split(":")[0] +
            ":" +
            this.renderTime(this.toTime(item.ts))
              .split(" ")[1]
              .split(":")[1];
        });
        this.oneform();
      });
      pvcApi.selectMonitorDataCharList(this.charParams).then(data => {
        data.data.forEach((item, index) => {
          this.temperatureCharList[index] =
            item.temperature === null ? 0 : item.temperature;
          this.spo2CharList[index] = item.spo2 === null ? 0 : item.spo2;
          this.urineCharList[index] = 0;
          // item.urinateVol === null ? 0 : item.urinateVol;
          this.sphygmusCharList[index] =
            item.sphygmus === null ? 0 : item.sphygmus;
        });
        // 体温
        this.initChar();
      });
    },
    // echarts 渲染
    initChar() {
      this.twoform();
      this.threeform();
    },
    // 开关操作
    operatorSwitch() {
      let params = {
        patientId: this.patientInfo.patientId,
        urineSwitch:
          this.patientInfo.urineSwitch === null
            ? 0
            : this.patientInfo.urineSwitch,
        transfusionSwitch:
          this.patientInfo.transfusionSwitch === null
            ? 0
            : this.patientInfo.transfusionSwitch
      };
      pvcApi.operatorSwitch(params).then(data => {
        if (data.data === "success") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "操作失败",
            type: "success"
          });
        }
      });
    },
    // 修改病人弹窗
    editPatientShow() {
      this.editInfo = JSON.parse(JSON.stringify(this.patientInfo));
      // this.editInfo.inHosTime = new Date(this.editInfo.inHosTime);
      this.editPatientInfoVisbale = true;
    },
    // 修改病人信息
    updatePatientInfo() {
      pvcApi.updatePatienInfo(this.editInfo).then(data => {});
      this.editPatientInfoVisbale = false;
    },
    // 修改液量弹窗
    toUpdatePatientTransf() {
      this.editTransfInfo.patientId = this.patientInfo.patientId;
      this.editTransfInfo.transfusionSum = this.patientInfo.transfusionSum;
      this.editPatientTransfVisbale = true;
    },
    // 修改液量
    updatePatientInfusion() {
      // todo
    },
    // 修改膀胱训练弹窗
    toUpdatePatientBladder() {
      this.editBladderInfo.patientId = this.patientInfo.patientId;
      this.editBladderInfo.bladder = this.patientInfo.bladder;
      this.editPatientBladderVisbale = true;
    },
    // 修改膀胱训练
    updatePatientBladder() {
      pvcApi.updatePatientBladder(this.editBladderInfo).then(data => {
        if (data.data === "success") {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        }
      });
      this.editPatientBladderVisbale = false;
    },
    // 换床弹窗
    toChangeBed() {
      this.changeBedInfo.patientId = this.patientInfo.patientId;
      this.changeBedInfo.oldSickbedNum = this.patientInfo.sickbedNum;
      pvcApi.findUsableSickbed().then(data => {
        this.emptyBedsOptions = data.data;
      });
      this.changeBedVisable = true;
    },
    // 换床操作
    changeBed() {
      pvcApi.changeBed(this.changeBedInfo).then(data => {
        if (data.data === "success") {
          // 刷新当前页
          this.bedNum = this.changeBedInfo.newSickbedNum;
          this.initPatientInfo();
          this.changeBedVisable = false;
        } else {
          this.$message({
            type: "error",
            message: "操作失败"
          });
        }
      });
    },
    // 出院
    patientOut() {
      let params = {
        sickbedNum: this.patientInfo.sickbedNum,
        operaterName: "",
        patientId: this.patientInfo.patientId
      };

      pvcApi.patientOut(params).then(data => {});
      this.$router.push({
        path: "/monitorList"
      });
    },
    exportPdf() {
      //导出pdf

      //需要的打印div的块的ID
      var ids = [];

      for (let i = 0; i < this.sugerData.length; i++) {
        ids.push(this.getDivID(i));
      }

      for (let i = 0; i < this.temperatureData.length; i++) {
        ids.push(this.getTemperatureDivID(i));
      }

      for (let i = 0; i < this.spo2Data.length; i++) {
        ids.push(this.getSpo2DivID(i));
      }

      for (let i = 0; i < this.urineData.length; i++) {
        ids.push(this.getUrineDivID(i));
      }

      if (ids.length <= 0) {
        this.$message({
          message: "未选中上边参数!"
        });
        return;
      }

      //是否包含血糖(因为分辨率问题所以间隔的像素不同)默认不包含
      let flag = false;

      for (let i = 0; i < ids.length; i++) {
        if (ids[i].substring(0, 10) == "div_sugger") {
          flag = true;
        }
      }

      var title = "测试";
      // landscape横向
      var PDF = (PDF = new jspdf("", "pt", "a4"));
      html2Canvas(document.querySelector("#" + ids[0]), {
        allowTaint: true
      }).then(function(canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;

        let pageData = canvas.toDataURL("image/jpeg", 1.0);

        if (flag == false) {
          PDF.addImage(pageData, "JPEG", 60, 10, imgWidth, imgHeight);
        } else {
          PDF.addImage(pageData, "JPEG", 60, 55, imgWidth, imgHeight);
        }

        if (ids.length == 1) {
          PDF.save(title + ".pdf");
        }
        for (let i = 0; i < ids.length; i++) {
          if (i != 0) {
            if (i == ids.length - 1) {
              html2Canvas(document.querySelector("#" + ids[i]), {
                allowTaint: true
              }).then(function(canvas) {
                PDF.addPage();
                let pageData1 = canvas.toDataURL("image/jpeg", 1.0);
                if (flag == false) {
                  PDF.addImage(pageData1, "JPEG", 60, 10, imgWidth, imgHeight);
                } else {
                  PDF.addImage(pageData1, "JPEG", 60, 55, imgWidth, imgHeight);
                }
                PDF.save(title + ".pdf");
              });
            } else {
              html2Canvas(document.querySelector("#" + ids[i]), {
                allowTaint: true
              }).then(function(canvas) {
                PDF.addPage();
                let pageData1 = canvas.toDataURL("image/jpeg", 1.0);
                if (flag == false) {
                  PDF.addImage(pageData1, "JPEG", 60, 10, imgWidth, imgHeight);
                } else {
                  PDF.addImage(pageData1, "JPEG", 60, 55, imgWidth, imgHeight);
                }
              });
            }
          }
        }
      });
    },
    DerivedData() {
      if (
        this.sugar == true ||
        this.temperature == true ||
        this.oxygen == true ||
        this.urinateVolume == true ||
        this.sphygmus == true
      ) {
        if (this.exportTypeValue != null) {
          if (this.exportTypeValue == "EXCEL") {
            this.$message({
              message: "EXCEL导出暂未开发!"
            });
            return;
          }
          if (this.exportDate.length == 0) {
            this.$message({
              message: "请选择导出时间"
            });
          } else {
            //根据勾选项渲染项目
            if (this.sugar == true) {
              //血糖
              // alert("血糖")
              this.exportSugar();
            }
            // 如果体温或者其他项被选中,则调用通用方法进行渲染
            if (
              this.temperature == true ||
              this.oxygen == true ||
              this.urinateVolume == true ||
              this.sphygmus == true
            ) {
              //除了血糖通用渲染
              this.exportHtml();
            }
          }
        } else {
          this.$message({
            message: "请选择导出的格式"
          });
        }
      } else {
        this.$message({
          message: "请选择导出的项目"
        });
      }
    },
    // 导出操作
    exportOperation() {
      // this.$message({
      //   message: "功能暂未开放"
      // });
      // 测试
      this.exportdataVisable = true;
    },
    //渲染血糖多天echart数据表
    suggerForm(id, x, suggerData, strDate) {
      //dom渲染结束后进行echart渲染
      this.$nextTick(function() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById(id));
        // 绘制图表
        let option = {
          title: {
            text:
              this.patientInfo.departmentName +
              "\t\t" +
              this.patientInfo.sickbedNum +
              "床\t\t" +
              this.patientInfo.patientName +
              "\t\t血糖数据\t" +
              "(\t" +
              strDate +
              "\t)",
            left: "1%",
            top: "1%",
            textStyle: {
              //设置主标题风格
              color: "#738195", //设置主标题字体颜色
              fontStyle: "" //主标题文字风格
            }
          },
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "5%",
            right: "5%",
            bottom: "5%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: x,
              axisLine: {
                lineStyle: {
                  color: "#9DB0C1"
                }
              },
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0,
                rotate: 60,
                formatter: function(val) {
                  let split0 = val.indexOf(" ");
                  if (split0 != -1) {
                    return val.substr(split0) + "\n" + val.substr(0, split0);
                  } else {
                    return val;
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              min: 0, // 设置y轴刻度的最小值
              max: 20, // 设置y轴刻度的最大值
              splitNumber: 9, // 设置y轴刻度间隔个数
              axisLine: {
                lineStyle: {
                  color: "none"
                }
              },
              axisLabel: {
                color: "#9DB0C1"
                // interval: 0
              }
            }
          ],
          series: [
            {
              name: "直接访问",
              type: "bar",
              barWidth: "40%",
              barWidth: 10, //柱图宽度
              data: suggerData
            }
          ]
        };
        myChart.setOption(option);
      });
    },
    //导出pdf血糖
    exportSugar() {
      // debugger
      this.export.startTime =
        this.renderTime(this.exportDate[0]).split(" ")[0] + " 00:00:00";
      this.export.endTime =
        this.renderTime(this.exportDate[1]).split(" ")[0] + " 23:59:59";
      this.export.patientId = this.patientInfo.patientId;

      let dateVutio = null;

      pvcApi.selectPatientBloodSugerByDate(this.export).then(data => {
        if (data.data.length == 0) {
          this.$message({
            message: "选中的天数没有数据!"
          });
          return;
        }

        dateVutio = data.data;

        //将血糖数据存入数组中
        data.data.forEach((item, index) => {
          this.sugerCharListsByDay[index] =
            item.bloodSuger === null ? 0 : item.bloodSuger;
          this.sugerCharDateListByDay[index] = this.renderTime(
            this.toTime(item.ts)
          );
        });

        var formatDate = [];
        var tableDateList = [];

        //找出导出的所有天数
        for (var i = 0; i < this.sugerCharDateListByDay.length; i++) {
          if (i == 0) {
            tableDateList.push({
              time: this.sugerCharDateListByDay[i].split(" ")[0]
            });
          }

          if (i < this.sugerCharDateListByDay.length - 1) {
            if (
              this.sugerCharDateListByDay[i].split(" ")[0] !=
              this.sugerCharDateListByDay[i + 1].split(" ")[0]
            ) {
              tableDateList.push({
                time: this.sugerCharDateListByDay[i + 1].split(" ")[0]
              });
            }
          }
        }

        //需要导出的所有日期(不包含没有数据的天)
        tableDateList.forEach((item, index) => {
          tableDateList[index] = item.time;
        });

        //所有的日期
        let one = [];

        //创建数组
        for (var i = 0; i < tableDateList.length; i++) {
          one.push(new Array());
        }

        //添加
        dateVutio.forEach(item => {
          for (let i = 0; i < tableDateList.length; i++) {
            //所有的日期焚天
            if (item.date == tableDateList[i]) {
              one[i].push(item);
            }
          }
        });

        //每页最多45条超出则在另一页
        let dataDay = new Array();
        let dateDay = new Array();

        // //先添加一个数组为小于45的数据
        dataDay.push(new Array());
        dateDay.push(new Array());

        let index = 0;
        let sum = 0;

        for (var i = 0; i < one.length; i++) {
          if ((sum += one[i].length) <= 45) {
            one[i].forEach(item => {
              dataDay[index].push(item.bloodSuger);
              dateDay[index].push(this.renderTime(this.toTime(item.ts)));
            });
          } else {
            sum = 0;
            index++;
            dataDay.push(new Array());
            dateDay.push(new Array());
            one[i].forEach(item => {
              dataDay[index].push(item.bloodSuger);
              dateDay[index].push(this.renderTime(this.toTime(item.ts)));
            });
            sum += one[i].length;
          }
        }

        //把所有的日期格式化一下
        let dateFormatArry = [];

        for (let i = 0; i < dateDay.length; i++) {
          dateFormatArry.push(new Array());
          for (let j = 0; j < dateDay[i].length; j++) {
            if (j == 0) {
              dateFormatArry[i][j] =
                dateDay[i][j + 1].split(" ")[0] +
                " " +
                dateDay[i][j + 1].split(" ")[1].split(":")[0] +
                ":" +
                dateDay[i][j + 1].split(" ")[1].split(":")[1];
            }
            if (j < dateDay[i].length - 1) {
              if (
                dateDay[i][j].split(" ")[0] == dateDay[i][j + 1].split(" ")[0]
              ) {
                dateFormatArry[i][j + 1] =
                  dateDay[i][j + 1].split(" ")[1].split(":")[0] +
                  ":" +
                  dateDay[i][j + 1].split(" ")[1].split(":")[1];
              } else {
                dateFormatArry[i][j + 1] =
                  dateDay[i][j + 1].split(" ")[0] +
                  " " +
                  dateDay[i][j + 1].split(" ")[1].split(":")[0] +
                  ":" +
                  dateDay[i][j + 1].split(" ")[1].split(":")[1];
              }
            }
          }
        }

        this.sugerData = dateFormatArry;

        let maxLength = one[0].length;

        let tableObj = [];
        tableObj.push(new Array());

        let tableIndex = 0;
        let tableSum = 0;

        //吧表格分开
        for (let i = 0; i < one.length; i++) {
          if ((tableSum += one[i].length) <= 45) {
            tableObj[tableIndex].push({ item: one[i] });
          } else {
            tableSum = 0;
            tableIndex++;
            tableObj.push(new Array());
            tableObj[tableIndex].push({ item: one[i] });
            tableSum += one[i].length;
          }
        }

        // echarts图标中显示的日期
        var strDate = new Array();
        for (let splitOne = 0; splitOne < tableObj.length; splitOne++) {
          var str = "";
          for (
            let splitTwo = 0;
            splitTwo < tableObj[splitOne].length;
            splitTwo++
          ) {
            if (splitTwo == 0) {
              if (tableObj[splitOne].length != 1) {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (indexOne == 0) {
                    str +=
                      tableObj[splitOne][splitTwo].item[indexOne].date +
                      "\t至\t";
                  }
                }
              } else {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (indexOne == 0) {
                    str +=
                      tableObj[splitOne][splitTwo].item[indexOne].date +
                      "\t至\t" +
                      tableObj[splitOne][splitTwo].item[indexOne].date;
                    strDate[splitOne] = str;
                  }
                }
              }
            } else if (splitTwo == tableObj[splitOne].length - 1) {
              for (
                let indexOne = 0;
                indexOne < tableObj[splitOne][splitTwo].item.length;
                indexOne++
              ) {
                if (indexOne == tableObj[splitOne][splitTwo].item.length - 1) {
                  str += tableObj[splitOne][splitTwo].item[indexOne].date;
                  strDate[splitOne] = str;
                }
              }
            }
          }
        }

        //血糖表格数据不足数据 - 替补
        let maxTab = [];
        let maxTabIndex = 0;
        // debugger
        for (let i = 0; i < tableObj.length; i++) {
          for (let j = 0; j < tableObj[i].length; j++) {
            if (j == 0) {
              maxTab[i] = tableObj[i][j].item.length;
            }
            if (tableObj[i][j].item.length > maxTab[i]) {
              maxTab[i] = tableObj[i][j].item.length;
            }
          }
        }

        for (let i = 0; i < tableObj.length; i++) {
          for (let j = 0; j < tableObj[i].length; j++) {
            if (tableObj[i][j].item.length < maxTab[i]) {
              let lgh = maxTab[i] - tableObj[i][j].item.length;
              for (let k = 0; k < lgh; k++) {
                tableObj[i][j].item.push({
                  bloodSuger: "-",
                  dateTime: "-",
                  id: "-",
                  patientId: "-",
                  ts: "-"
                });
              }
            }
          }
        }

        //动态渲染echars
        for (let i = 0; i < dateFormatArry.length; i++) {
          let echartID = this.getechartID(i);
          this.suggerForm(echartID, dateFormatArry[i], dataDay[i], strDate[i]);
        }

        // 为表格属性赋值
        this.sugerTable = tableObj;
      });
    },
    exportClose() {
      this.exportdataVisable = false;
      this.exportDate = "";
    },
    //血糖div ID
    getDivID(index) {
      return "div_sugger" + index;
    },
    //血糖数据表格
    getsuggerTableData(index) {
      return this.sugerTable[index];
    },
    //血糖echart ID
    getechartID(index) {
      return "echart_" + index;
    },
    //体温div ID
    getTemperatureDivID(index) {
      return "div_temperature" + index;
    },
    getTemperatureEchartID(index) {
      return "echart_temperature" + index;
    },
    //渲染体温多天echart数据表
    temperatureForm(id, x, temperatureData, strDate) {
      //dom渲染结束后进行echart渲染
      this.$nextTick(function() {
        // 基于dom，初始化echarts实例
        let temperature = echarts.init(document.getElementById(id));
        // 绘制图表
        temperature.setOption({
          title: {
            text:
              this.patientInfo.departmentName +
              "\t\t" +
              this.patientInfo.sickbedNum +
              "床\t\t" +
              this.patientInfo.patientName +
              "\t\t体温数据\t" +
              "(\t" +
              strDate +
              "\t)",
            left: "2%",
            top: "2%",
            textStyle: {
              //设置主标题风格
              color: "#738195", //设置主标题字体颜色
              fontStyle: "" //主标题文字风格
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: "category",
            name: "",
            boundaryGap: false,
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#9DB0C1"
              }
            },
            data: x,
            axisLabel: {
              interval: 11,
              rotate: 60,
              formatter: function(val) {
                let split0 = val.indexOf(" ");
                if (split0 != -1) {
                  return val.substr(split0) + "\n" + val.substr(0, split0);
                } else {
                  return val;
                }
              }
            }
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "8%",
            containLabel: true
          },
          yAxis: [
            {
              type: "value",
              min: 35, // 设置y轴刻度的最小值
              max: 44, // 设置y轴刻度的最大值
              splitNumber: 10, // 设置y轴刻度间隔个数
              boundaryGap: false,
              // name: "温度",
              splitLine: { show: true },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: "#9DB0C1",
                formatter: function(val, index) {
                  return val === 44 ? "(℃)" + val : val;
                }
              }
            }
          ],
          series: [
            {
              name: "体温",
              type: "line",
              symbol: "none",
              color: ["#23BF8B"],
              data: temperatureData
            }
          ]
        });
      });
    },
    //血氧渲染
    sp02Form(id, x, spo2Data, strDate) {
      //dom渲染结束后进行echart渲染
      this.$nextTick(function() {
        // 基于dom，初始化echarts实例
        let test = echarts.init(document.getElementById(id));
        // 绘制图表
        test.setOption({
          title: {
            text:
              this.patientInfo.departmentName +
              "\t\t" +
              this.patientInfo.sickbedNum +
              "床\t\t" +
              this.patientInfo.patientName +
              "\t\t血氧数据\t" +
              "(\t" +
              strDate +
              "\t)",
            left: "2%",
            top: "2%",
            textStyle: {
              //设置主标题风格
              color: "#738195", //设置主标题字体颜色
              fontStyle: "" //主标题文字风格
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: "category",
            name: "",
            boundaryGap: false,
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#9DB0C1"
              }
            },
            data: x,
            axisLabel: {
              interval: 11,
              rotate: 60,
              formatter: function(val) {
                let split0 = val.indexOf(" ");
                if (split0 != -1) {
                  return val.substr(split0) + "\n" + val.substr(0, split0);
                } else {
                  return val;
                }
              }
            }
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "8%",
            containLabel: true
          },
          yAxis: [
            {
              type: "value",
              min: 55, // 设置y轴刻度的最小值
              max: 100, // 设置y轴刻度的最大值
              splitNumber: 10, // 设置y轴刻度间隔个数
              boundaryGap: false,
              name: "",
              splitLine: { show: true },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                formatter: "{value} %",
                color: "#9DB0C1"
              }
            }
          ],
          series: [
            {
              name: "血氧",
              type: "line",
              symbol: "none",
              color: ["#23BF8B"],
              data: spo2Data
            }
          ]
        });
      });
    },
    // 血氧echarts ID
    getSpo2EchartID(index) {
      return "echart_spo2" + index;
    },
    // 血氧div ID
    getSpo2DivID(index) {
      return "div_spo2" + index;
    },
    //血氧数据表格
    getSpo2TableData(index) {
      return this.spo2Table[index];
    },
    //尿量divID
    getUrineDivID(index) {
      return "div_urine" + index;
    },
    //尿量echart ID
    getUrineEchartID(index) {
      return "echart_urine" + index;
    },
    //尿量数据表格
    getUrineTableData(index) {
      return this.urineTable[index];
    },
    //尿量echarts渲染
    urineForm(id, x, urineData, strDate) {
      //dom渲染结束后进行echart渲染
      this.$nextTick(function() {
        // 基于dom，初始化echarts实例
        let test = echarts.init(document.getElementById(id));
        // 绘制图表
        test.setOption({
          title: {
            text:
              this.patientInfo.departmentName +
              "\t\t" +
              this.patientInfo.sickbedNum +
              "床\t\t" +
              this.patientInfo.patientName +
              "\t\t尿量数据\t" +
              "(\t" +
              strDate +
              "\t)",
            left: "2%",
            top: "2%",
            textStyle: {
              //设置主标题风格
              color: "#738195", //设置主标题字体颜色
              fontStyle: "" //主标题文字风格
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: "category",
            name: "",
            boundaryGap: false,
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#9DB0C1"
              }
            },
            data: x,
            axisLabel: {
              interval: 11,
              rotate: 60,
              formatter: function(val) {
                let split0 = val.indexOf(" ");
                if (split0 != -1) {
                  return val.substr(split0) + "\n" + val.substr(0, split0);
                } else {
                  return val;
                }
              }
            }
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "8%",
            containLabel: true
          },
          yAxis: [
            {
              type: "value",
              min: 0, // 设置y轴刻度的最小值
              max: 16000, // 设置y轴刻度的最大值
              splitNumber: 7, // 设置y轴刻度间隔个数
              boundaryGap: false,
              // name: "血糖",
              splitLine: { show: true },
              axisLine: {
                lineStyle: {
                  color: "none"
                }
              },
              axisLabel: {
                color: "#9DB0C1",
                formatter: function(params) {
                  return params - 1000;
                }
              }
            }
          ],
          series: [
            {
              name: "尿量",
              type: "line",
              symbolSize: 10,
              symbol: "none",
              color: ["#23BF8B"],
              data: urineData
            }
          ]
        });
      });
    },
    // 通用通用渲染
    exportHtml() {
      this.export.startTime =
        this.renderTime(this.exportDate[0]).split(" ")[0] + " 00:00:00";
      this.export.endTime =
        this.renderTime(this.exportDate[1]).split(" ")[0] + " 23:59:59";
      this.export.patientId = this.patientInfo.patientId;
      let dateVutio = null;
      pvcApi.selectMonitorByDate(this.export).then(data => {
        dateVutio = data.data;
        // console.log(data.data);
        let tabss = new Array();
        data.data.forEach((item, index) => {
          //判断勾选项目进行赋值
          if (this.temperature == true) {
            //存体温数据
            this.temperatureCharListsByDay[index] =
              item.temperature === null ? "-" : item.temperature;
            this.temperatureCharDateListByDay[index] =
              item.ts === null ? "-" : item.ts;
            this.temperatureTime[index] = item.time === null ? "-" : item.time;
          }
          if (this.oxygen == true) {
            //存血氧数据
            this.spo2CharListsByDay[index] =
              item.spo2 === null ? "-" : item.spo2;
            this.spo2CharDateListByDay[index] =
              item.ts === null ? "-" : item.ts;
            this.spo2Time[index] = item.time === null ? "-" : item.time;
          }
          if (this.urinateVolume == true) {
            //存尿量数据
            this.urineCharListsByDay[index] =
              item.urinateVol === null ? "-" : item.urinateVol;
            this.urineCharDateListByDay[index] =
              item.ts === null ? "-" : item.ts;
            this.urineTime[index] = item.time === null ? "-" : item.time;
          }
          if (this.sphygmus == true) {
            //存脉搏数据
            this.sphygmusCharListsByDay[index] =
              item.sphygmus === null ? "-" : item.sphygmus;
            this.sphygmusCharDateListByDay[index] =
              item.ts === null ? "-" : item.ts;
            this.sphygmusTime[index] = item.time === null ? "-" : item.time;
          }
        });

        //体温
        if (this.temperature == true) {
          //得到导出的天数(对象格式)
          var tableDateList = [];
          for (var i = 0; i < this.temperatureCharDateListByDay.length; i++) {
            if (i == 0) {
              tableDateList.push({
                time: this.temperatureCharDateListByDay[i].split(" ")[0]
              });
            }
            if (i < this.temperatureCharDateListByDay.length - 1) {
              if (
                this.temperatureCharDateListByDay[i].split(" ")[0] !=
                this.temperatureCharDateListByDay[i + 1].split(" ")[0]
              ) {
                tableDateList.push({
                  time: this.temperatureCharDateListByDay[i + 1].split(" ")[0]
                });
              }
            }
          }

          //得到导出的所有日期(数组)
          tableDateList.forEach((item, index) => {
            tableDateList[index] = item.time;
          });

          // console.log(tableDateList);
          //所有的日期
          let one = [];
          let two = [];

          //创建数组
          for (var i = 0; i < tableDateList.length; i++) {
            one.push(new Array());
            two.push(new Array());
          }

          //表格所需数据dateVutioTwo(1小时制)
          let dateVutioTwo = [];
          for (let i = 0; i < dateVutio.length; i++) {
            if (i % 6 == 0) {
              dateVutioTwo.push(dateVutio[i]);
            }
          }
          // console.log(dateVutioTwo);

          //echarts数据,把所有数据分天
          dateVutio.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                one[i].push(item);
              }
            }
          });
          //表格数据,把所有数据分天
          dateVutioTwo.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                two[i].push(item);
              }
            }
          });

          //每页最多84条超出则在另一页
          let dataDay = new Array();
          let dateDay = new Array();

          // //先添加一个数组为小于45的数据
          dataDay.push(new Array());
          dateDay.push(new Array());

          let index = 0;
          let sum = 0;
          // debugger;
          for (var i = 0; i < one.length; i++) {
            if ((sum += one[i].length) <= 720) {
              one[i].forEach(item => {
                dataDay[index].push(item.temperature);
                dateDay[index].push(item.ts);
              });
            } else {
              sum = 0;
              index++;
              dataDay.push(new Array());
              dateDay.push(new Array());
              one[i].forEach(item => {
                dataDay[index].push(item.temperature);
                dateDay[index].push(item.ts);
              });
              sum += one[i].length;
            }
          }

          //把所有的日期格式化一下
          let dateFormatArry = [];

          for (var i = 0; i < dateDay.length; i++) {
            dateFormatArry.push(new Array());
            for (let j = 0; j < dateDay[i].length; j++) {
              if (j == 0) {
                dateFormatArry[i][j] =
                  dateDay[i][j].split(" ")[0] +
                  " " +
                  dateDay[i][j].split(" ")[1].split(":")[0];
                continue;
              }
              if (j < dateDay[i].length) {
                if (j != dateDay[i].length - 1) {
                  if (
                    dateDay[i][j].split(" ")[0] ==
                    dateDay[i][j + 1].split(" ")[0]
                  ) {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  } else {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  }
                } else {
                  dateFormatArry[i][j] = dateDay[i][j]
                    .split(" ")[1]
                    .split(":")[0];
                }
              }
            }
          }

          this.temperatureData = dateFormatArry;

          // 以下为表格数据
          let maxLength = one[0].length;
          let tableObj = [];
          tableObj.push(new Array());

          let tableIndex = 0;
          let tableSum = 0;

          //吧表格分开
          for (let i = 0; i < two.length; i++) {
            if ((tableSum += two[i].length) <= 120) {
              tableObj[tableIndex].push({ item: two[i] });
            } else {
              tableSum = 0;
              tableIndex++;
              tableObj.push(new Array());
              tableObj[tableIndex].push({ item: two[i] });
              tableSum += two[i].length;
            }
          }

          // echarts图表中显示的日期
          var strDate = new Array();
          for (let splitOne = 0; splitOne < tableObj.length; splitOne++) {
            var str = "";
            for (
              let splitTwo = 0;
              splitTwo < tableObj[splitOne].length;
              splitTwo++
            ) {
              if (splitTwo == 0) {
                if (tableObj[splitOne].length != 1) {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t";
                    }
                  }
                } else {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t" +
                        tableObj[splitOne][splitTwo].item[indexOne].date;
                      strDate[splitOne] = str;
                    }
                  }
                }
              } else if (splitTwo == tableObj[splitOne].length - 1) {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (
                    indexOne ==
                    tableObj[splitOne][splitTwo].item.length - 1
                  ) {
                    str += tableObj[splitOne][splitTwo].item[indexOne].date;
                    strDate[splitOne] = str;
                  }
                }
              }
            }
          }

          let maxTab = [];
          let maxTabIndex = 0;
          // debugger
          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (j == 0) {
                maxTab[i] = tableObj[i][j].item.length;
              }
              if (tableObj[i][j].item.length > maxTab[i]) {
                maxTab[i] = tableObj[i][j].item.length;
              }
            }
          }

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (tableObj[i][j].item.length < maxTab[i]) {
                let lgh = maxTab[i] - tableObj[i][j].item.length;
                for (let k = 0; k < lgh; k++) {
                  tableObj[i][j].item.push({
                    booldSugar: "-",
                    date: "-",
                    dateTime: "-",
                    id: "-",
                    sphygmus: "-",
                    spo2: "-",
                    temperature: "-",
                    time: "-",
                    ts: "-",
                    urinateVol: "-"
                  });
                }
              }
            }
          }

          //动态渲染
          for (let i = 0; i < this.temperatureData.length; i++) {
            let echartID = this.getTemperatureEchartID(i);
            this.temperatureForm(
              echartID,
              dateFormatArry[i],
              dataDay[i],
              strDate[i]
            );
          }
          // console.log("体温表格数据");
          // console.log(tableObj);
          this.temperatureTable = tableObj;
        }

        // 血氧
        if (this.oxygen == true) {
          //得到导出的天数(对象格式)
          let tableDateList = [];
          for (var i = 0; i < this.spo2CharDateListByDay.length; i++) {
            if (i == 0) {
              tableDateList.push({
                time: this.spo2CharDateListByDay[i].split(" ")[0]
              });
            }
            if (i < this.spo2CharDateListByDay.length - 1) {
              if (
                this.spo2CharDateListByDay[i].split(" ")[0] !=
                this.spo2CharDateListByDay[i + 1].split(" ")[0]
              ) {
                tableDateList.push({
                  time: this.spo2CharDateListByDay[i + 1].split(" ")[0]
                });
              }
            }
          }

          //得到导出的所有日期(数组)
          tableDateList.forEach((item, index) => {
            tableDateList[index] = item.time;
          });

          //所有的日期
          let one = [];
          let two = [];

          //创建数组
          for (var i = 0; i < tableDateList.length; i++) {
            one.push(new Array());
            two.push(new Array());
          }

          //表格所需数据dateVutioTwo(1小时制)
          let dateVutioTwo = [];
          for (let i = 0; i < dateVutio.length; i++) {
            if (i % 6 == 0) {
              dateVutioTwo.push(dateVutio[i]);
            }
          }

          //echarts数据,把所有数据分天
          dateVutio.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                one[i].push(item);
              }
            }
          });

          //表格数据,把所有数据分天
          dateVutioTwo.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                two[i].push(item);
              }
            }
          });

          //每页最多84条超出则在另一页
          let dataDay = new Array();
          let dateDay = new Array();

          // //先添加一个数组为小于45的数据
          dataDay.push(new Array());
          dateDay.push(new Array());

          let index = 0;
          let sum = 0;

          for (var i = 0; i < one.length; i++) {
            if ((sum += one[i].length) <= 720) {
              one[i].forEach(item => {
                dataDay[index].push(item.spo2);
                dateDay[index].push(item.ts);
              });
            } else {
              sum = 0;
              index++;
              dataDay.push(new Array());
              dateDay.push(new Array());
              one[i].forEach(item => {
                dataDay[index].push(item.spo2);
                dateDay[index].push(item.ts);
              });
              sum += one[i].length;
            }
          }
          console.log(dataDay);
          console.log(dateDay);

          //把所有的日期格式化一下
          let dateFormatArry = [];

          for (var i = 0; i < dateDay.length; i++) {
            dateFormatArry.push(new Array());
            for (let j = 0; j < dateDay[i].length; j++) {
              if (j == 0) {
                dateFormatArry[i][j] =
                  dateDay[i][j].split(" ")[0] +
                  " " +
                  dateDay[i][j].split(" ")[1].split(":")[0];
                continue;
              }
              if (j < dateDay[i].length) {
                if (j != dateDay[i].length - 1) {
                  if (
                    dateDay[i][j].split(" ")[0] ==
                    dateDay[i][j + 1].split(" ")[0]
                  ) {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  } else {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  }
                } else {
                  dateFormatArry[i][j] = dateDay[i][j]
                    .split(" ")[1]
                    .split(":")[0];
                }
              }
            }
          }

          //放长度
          this.spo2Data = dateFormatArry;

          // 以下为表格数据
          let maxLength = one[0].length;
          let tableObj = [];
          tableObj.push(new Array());

          let tableIndex = 0;
          let tableSum = 0;

          //吧表格分开
          for (let i = 0; i < one.length; i++) {
            if ((tableSum += two[i].length) <= 120) {
              tableObj[tableIndex].push({ item: two[i] });
            } else {
              tableSum = 0;
              tableIndex++;
              tableObj.push(new Array());
              tableObj[tableIndex].push({ item: two[i] });
              tableSum += two[i].length;
            }
          }

          // echarts图表中显示的日期
          var strDate = new Array();
          for (let splitOne = 0; splitOne < tableObj.length; splitOne++) {
            var str = "";
            for (
              let splitTwo = 0;
              splitTwo < tableObj[splitOne].length;
              splitTwo++
            ) {
              if (splitTwo == 0) {
                if (tableObj[splitOne].length != 1) {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t";
                    }
                  }
                } else {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t" +
                        tableObj[splitOne][splitTwo].item[indexOne].date;
                      strDate[splitOne] = str;
                    }
                  }
                }
              } else if (splitTwo == tableObj[splitOne].length - 1) {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (
                    indexOne ==
                    tableObj[splitOne][splitTwo].item.length - 1
                  ) {
                    str += tableObj[splitOne][splitTwo].item[indexOne].date;
                    strDate[splitOne] = str;
                  }
                }
              }
            }
          }

          let maxTab = [];
          let maxTabIndex = 0;

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (j == 0) {
                maxTab[i] = tableObj[i][j].item.length;
              }
              if (tableObj[i][j].item.length > maxTab[i]) {
                maxTab[i] = tableObj[i][j].item.length;
              }
            }
          }

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (tableObj[i][j].item.length < maxTab[i]) {
                let lgh = maxTab[i] - tableObj[i][j].item.length;
                for (let k = 0; k < lgh; k++) {
                  tableObj[i][j].item.push({
                    booldSugar: "-",
                    date: "-",
                    dateTime: "-",
                    id: "-",
                    sphygmus: "-",
                    spo2: "-",
                    temperature: "-",
                    time: "-",
                    ts: "-",
                    urinateVol: "-"
                  });
                }
              }
            }
          }

          console.log(this.spo2Data);
          //动态渲染echarts图表
          for (let i = 0; i < this.spo2Data.length; i++) {
            let echartID = this.getSpo2EchartID(i);
            this.sp02Form(echartID, dateFormatArry[i], dataDay[i], strDate[i]);
          }

          // 血氧表格数据
          this.spo2Table = tableObj;
        }

        //尿量
        if (this.urinateVolume == true) {
          //得到导出的天数(对象格式)
          var tableDateList = [];
          for (var i = 0; i < this.urineCharDateListByDay.length; i++) {
            if (i == 0) {
              tableDateList.push({
                time: this.urineCharDateListByDay[i].split(" ")[0]
              });
            }
            if (i < this.urineCharDateListByDay.length - 1) {
              if (
                this.urineCharDateListByDay[i].split(" ")[0] !=
                this.urineCharDateListByDay[i + 1].split(" ")[0]
              ) {
                tableDateList.push({
                  time: this.urineCharDateListByDay[i + 1].split(" ")[0]
                });
              }
            }
          }

          //得到导出的所有日期(数组)
          tableDateList.forEach((item, index) => {
            tableDateList[index] = item.time;
          });

          //所有的日期
          let one = [];
          let two = [];

          //创建数组
          for (var i = 0; i < tableDateList.length; i++) {
            one.push(new Array());
            two.push(new Array());
          }

          //表格所需数据dateVutioTwo(1小时制)
          let dateVutioTwo = [];
          for (let i = 0; i < dateVutio.length; i++) {
            if (i % 6 == 0) {
              dateVutioTwo.push(dateVutio[i]);
            }
          }

          //把所有数据分天
          dateVutio.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                one[i].push(item);
              }
            }
          });

          //表格数据,把所有数据分天
          dateVutioTwo.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                two[i].push(item);
              }
            }
          });

          //每页最多84条超出则在另一页
          let dataDay = new Array();
          let dateDay = new Array();

          // //先添加一个数组为小于45的数据
          dataDay.push(new Array());
          dateDay.push(new Array());

          let index = 0;
          let sum = 0;

          for (var i = 0; i < one.length; i++) {
            if ((sum += one[i].length) <= 720) {
              one[i].forEach(item => {
                dataDay[index].push(item.urinateVol);
                dateDay[index].push(item.ts);
              });
            } else {
              sum = 0;
              index++;
              dataDay.push(new Array());
              dateDay.push(new Array());
              one[i].forEach(item => {
                dataDay[index].push(item.urinateVol);
                dateDay[index].push(item.ts);
              });
              sum += one[i].length;
            }
          }

          //把所有的日期格式化一下
          let dateFormatArry = [];

          for (var i = 0; i < dateDay.length; i++) {
            dateFormatArry.push(new Array());
            for (let j = 0; j < dateDay[i].length; j++) {
              if (j == 0) {
                dateFormatArry[i][j] =
                  dateDay[i][j].split(" ")[0] +
                  " " +
                  dateDay[i][j].split(" ")[1].split(":")[0];
                continue;
              }

              if (j < dateDay[i].length) {
                if (j != dateDay[i].length - 1) {
                  if (
                    dateDay[i][j].split(" ")[0] ==
                    dateDay[i][j + 1].split(" ")[0]
                  ) {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  } else {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  }
                } else {
                  dateFormatArry[i][j] = dateDay[i][j]
                    .split(" ")[1]
                    .split(":")[0];
                }
              }
            }
          }

          this.urineData = dateFormatArry;

          // 以下为表格数据
          let maxLength = one[0].length;
          let tableObj = [];
          tableObj.push(new Array());

          let tableIndex = 0;
          let tableSum = 0;

          //吧表格分开
          for (let i = 0; i < two.length; i++) {
            if ((tableSum += two[i].length) <= 120) {
              tableObj[tableIndex].push({ item: two[i] });
            } else {
              tableSum = 0;
              tableIndex++;
              tableObj.push(new Array());
              tableObj[tableIndex].push({ item: two[i] });
              tableSum += two[i].length;
            }
          }

          // echarts图表中显示的日期
          var strDate = new Array();
          for (let splitOne = 0; splitOne < tableObj.length; splitOne++) {
            var str = "";
            for (
              let splitTwo = 0;
              splitTwo < tableObj[splitOne].length;
              splitTwo++
            ) {
              if (splitTwo == 0) {
                if (tableObj[splitOne].length != 1) {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t";
                    }
                  }
                } else {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t" +
                        tableObj[splitOne][splitTwo].item[indexOne].date;
                      strDate[splitOne] = str;
                    }
                  }
                }
              } else if (splitTwo == tableObj[splitOne].length - 1) {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (
                    indexOne ==
                    tableObj[splitOne][splitTwo].item.length - 1
                  ) {
                    str += tableObj[splitOne][splitTwo].item[indexOne].date;
                    strDate[splitOne] = str;
                  }
                }
              }
            }
          }

          let maxTab = [];
          let maxTabIndex = 0;

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (j == 0) {
                maxTab[i] = tableObj[i][j].item.length;
              }
              if (tableObj[i][j].item.length > maxTab[i]) {
                maxTab[i] = tableObj[i][j].item.length;
              }
            }
          }

          // console.log(maxTab);

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (tableObj[i][j].item.length < maxTab[i]) {
                let lgh = maxTab[i] - tableObj[i][j].item.length;
                for (let k = 0; k < lgh; k++) {
                  tableObj[i][j].item.push({
                    booldSugar: "-",
                    date: "-",
                    dateTime: "-",
                    id: "-",
                    sphygmus: "-",
                    spo2: "-",
                    temperature: "-",
                    time: "-",
                    ts: "-",
                    urinateVol: "-"
                  });
                }
              }
            }
          }
          //动态渲染
          for (let i = 0; i < this.urineData.length; i++) {
            let echartID = this.getUrineEchartID(i);
            this.urineForm(echartID, dateFormatArry[i], dataDay[i], strDate[i]);
          }

          this.urineTable = tableObj;
        }

        //脉搏
        if (this.sphygmus == true) {
          //得到导出的天数(对象格式)
          var tableDateList = [];
          for (var i = 0; i < this.sphygmusCharDateListByDay.length; i++) {
            if (i == 0) {
              tableDateList.push({
                time: this.sphygmusCharDateListByDay[i].split(" ")[0]
              });
            }
            if (i < this.sphygmusCharDateListByDay.length - 1) {
              if (
                this.sphygmusCharDateListByDay[i].split(" ")[0] !=
                this.sphygmusCharDateListByDay[i + 1].split(" ")[0]
              ) {
                tableDateList.push({
                  time: this.sphygmusCharDateListByDay[i + 1].split(" ")[0]
                });
              }
            }
          }

          //得到导出的所有日期(数组)
          tableDateList.forEach((item, index) => {
            tableDateList[index] = item.time;
          });

          //所有的日期
          let one = [];
          let two = [];

          //创建数组
          for (var i = 0; i < tableDateList.length; i++) {
            one.push(new Array());
            two.push(new Array());
          }

          //表格所需数据dateVutioTwo(1小时制)
          let dateVutioTwo = [];
          for (let i = 0; i < dateVutio.length; i++) {
            if (i % 6 == 0) {
              dateVutioTwo.push(dateVutio[i]);
            }
          }

          //把所有数据分天
          dateVutio.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                one[i].push(item);
              }
            }
          });

          //表格数据,把所有数据分天
          dateVutioTwo.forEach(item => {
            for (let i = 0; i < tableDateList.length; i++) {
              if (item.date == tableDateList[i]) {
                two[i].push(item);
              }
            }
          });

          //每页最多84条超出则在另一页
          let dataDay = new Array();
          let dateDay = new Array();

          // //先添加一个数组为小于45的数据
          dataDay.push(new Array());
          dateDay.push(new Array());

          let index = 0;
          let sum = 0;

          for (var i = 0; i < one.length; i++) {
            if ((sum += one[i].length) <= 720) {
              one[i].forEach(item => {
                dataDay[index].push(item.sphygmus);
                dateDay[index].push(item.ts);
              });
            } else {
              sum = 0;
              index++;
              dataDay.push(new Array());
              dateDay.push(new Array());
              one[i].forEach(item => {
                dataDay[index].push(item.sphygmus);
                dateDay[index].push(item.ts);
              });
              sum += one[i].length;
            }
          }

          //把所有的日期格式化一下
          let dateFormatArry = [];

          for (var i = 0; i < dateDay.length; i++) {
            dateFormatArry.push(new Array());
            for (let j = 0; j < dateDay[i].length; j++) {
              if (j == 0) {
                dateFormatArry[i][j] =
                  dateDay[i][j].split(" ")[0] +
                  " " +
                  dateDay[i][j].split(" ")[1].split(":")[0];
                continue;
              }

              if (j < dateDay[i].length) {
                if (j != dateDay[i].length - 1) {
                  if (
                    dateDay[i][j].split(" ")[0] ==
                    dateDay[i][j + 1].split(" ")[0]
                  ) {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  } else {
                    if (
                      dateDay[i][j].split(" ")[0] ==
                      dateDay[i][j - 1].split(" ")[0]
                    ) {
                      dateFormatArry[i][j] = dateDay[i][j]
                        .split(" ")[1]
                        .split(":")[0];
                    } else {
                      dateFormatArry[i][j] =
                        dateDay[i][j + 1].split(" ")[0] +
                        " " +
                        dateDay[i][j].split(" ")[1].split(":")[0];
                    }
                  }
                } else {
                  dateFormatArry[i][j] = dateDay[i][j]
                    .split(" ")[1]
                    .split(":")[0];
                }
              }
            }
          }

          this.sphygmusData = dateFormatArry;

          // 以下为表格数据
          let maxLength = one[0].length;
          let tableObj = [];
          tableObj.push(new Array());

          let tableIndex = 0;
          let tableSum = 0;

          //吧表格分开
          for (let i = 0; i < two.length; i++) {
            if ((tableSum += two[i].length) <= 120) {
              tableObj[tableIndex].push({ item: two[i] });
            } else {
              tableSum = 0;
              tableIndex++;
              tableObj.push(new Array());
              tableObj[tableIndex].push({ item: two[i] });
              tableSum += two[i].length;
            }
          }

          // echarts图表中显示的日期
          var strDate = new Array();
          for (let splitOne = 0; splitOne < tableObj.length; splitOne++) {
            var str = "";
            for (
              let splitTwo = 0;
              splitTwo < tableObj[splitOne].length;
              splitTwo++
            ) {
              if (splitTwo == 0) {
                if (tableObj[splitOne].length != 1) {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t";
                    }
                  }
                } else {
                  for (
                    let indexOne = 0;
                    indexOne < tableObj[splitOne][splitTwo].item.length;
                    indexOne++
                  ) {
                    if (indexOne == 0) {
                      str +=
                        tableObj[splitOne][splitTwo].item[indexOne].date +
                        "\t至\t" +
                        tableObj[splitOne][splitTwo].item[indexOne].date;
                      strDate[splitOne] = str;
                    }
                  }
                }
              } else if (splitTwo == tableObj[splitOne].length - 1) {
                for (
                  let indexOne = 0;
                  indexOne < tableObj[splitOne][splitTwo].item.length;
                  indexOne++
                ) {
                  if (
                    indexOne ==
                    tableObj[splitOne][splitTwo].item.length - 1
                  ) {
                    str += tableObj[splitOne][splitTwo].item[indexOne].date;
                    strDate[splitOne] = str;
                  }
                }
              }
            }
          }

          let maxTab = [];
          let maxTabIndex = 0;

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (j == 0) {
                maxTab[i] = tableObj[i][j].item.length;
              }
              if (tableObj[i][j].item.length > maxTab[i]) {
                maxTab[i] = tableObj[i][j].item.length;
              }
            }
          }

          for (let i = 0; i < tableObj.length; i++) {
            for (let j = 0; j < tableObj[i].length; j++) {
              if (tableObj[i][j].item.length < maxTab[i]) {
                let lgh = maxTab[i] - tableObj[i][j].item.length;
                for (let k = 0; k < lgh; k++) {
                  tableObj[i][j].item.push({
                    booldSugar: "-",
                    date: "-",
                    dateTime: "-",
                    id: "-",
                    sphygmus: "-",
                    spo2: "-",
                    temperature: "-",
                    time: "-",
                    ts: "-",
                    urinateVol: "-"
                  });
                }
              }
            }
          }

          //  //动态渲染
          // for (let i = 0; i < this.urineData.length; i++) {
          //   let echartID = this.getUrineEchartID(i);
          //   this.urineForm(echartID, dateFormatArry[i], dataDay[i], strDate[i]);
          // }

          this.sphygmusTable = tableObj;
        }
      });
    },
    //体温数据表格
    getTemperatureTableData(index) {
      // console.log("----");
      // console.log(this.temperatureTable[index]);
      // console.log("----");
      return this.temperatureTable[index];
    },
    // 返回首页
    goToHome() {
      this.$router.go(-1);
    },
    // 左划
    swiperleft() {
      this.charParams.date.setTime(
        this.charParams.date.getTime() - 3600 * 1000 * 24
      );
      this.selectMonitorDataCharList();
      this.initChar();
    },
    // 右划
    swiperright() {
      this.charParams.date.setTime(
        this.charParams.date.getTime() + 3600 * 1000 * 24
      );
      this.selectMonitorDataCharList();
      this.initChar();
    },
    dosageHeight() {
      let dosage = document.querySelector(".process_ctn");
      if (dosage) {
        dosage.style.height =
          this.patientInfo.transfusionProgress == null
            ? 0 + "%"
            : this.patientInfo.transfusionProgress + "%";
      }
    },
    oneform() {
      let one = echarts.init(document.getElementById("one"));
      one.setOption({
        title: {
          text: "血糖",
          left: "2%",
          top: "2%",
          textStyle: {
            //设置主标题风格
            color: "#738195", //设置主标题字体颜色
            fontStyle: "" //主标题文字风格
          }
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.sugerCharDateFromatList,
            axisLine: {
              lineStyle: {
                color: "#9DB0C1"
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0, // 设置y轴刻度的最小值
            max: 20, // 设置y轴刻度的最大值
            splitNumber: 9, // 设置y轴刻度间隔个数
            axisLine: {
              lineStyle: {
                color: "none"
              }
            },
            axisLabel: {
              color: "#9DB0C1"
            }
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            barWidth: 10, //柱图宽度
            data: this.sugerCharList
          }
        ],
        toolbox: {
          show: true,

          feature: {
            saveAsImage: {
              show: true,

              excludeComponents: ["toolbox"],

              pixelRatio: 2
            }
          }
        }
      });
    },
    twoform() {
      // 基于dom，初始化echarts实例
      let two = echarts.init(document.getElementById("two"));
      // 绘制图表
      two.setOption({
        title: {
          text: util.formatDate.format(this.charParams.date, "yyyy-MM-dd"),
          left: "2%",
          top: "2%",
          textStyle: {
            //设置主标题风格
            color: "#738195", //设置主标题字体颜色
            fontStyle: "" //主标题文字风格
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          left: "center",
          data: ["体温", "SPO2"],
          top: 20
        },
        xAxis: {
          type: "category",
          name: "",
          boundaryGap: false,
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "#9DB0C1"
            }
          },
          data: this.globalCharXy.normalX
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "8%",
          containLabel: true
        },
        yAxis: [
          {
            type: "value",
            min: 35, // 设置y轴刻度的最小值
            max: 44, // 设置y轴刻度的最大值
            splitNumber: 10, // 设置y轴刻度间隔个数
            boundaryGap: false,
            // name: "温度",
            splitLine: { show: true },
            axisLine: {
              show: false
              // lineStyle: {
              //   color: "none"
              // }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // formatter: "{value} ℃",
              color: "#9DB0C1",
              formatter: function(val, index) {
                // console.log(val,index)
                // return index == this.two.setOption.yAxis.splitNumber +1?'(℃)' + val:val
                return val === 44 ? "(℃)" + val : val;
              }
            }
          },
          {
            type: "value",
            min: 55, // 设置y轴刻度的最小值
            max: 100, // 设置y轴刻度的最大值
            splitNumber: 10, // 设置y轴刻度间隔个数
            boundaryGap: false,
            name: "SPO2",
            splitLine: { show: true },
            axisLine: {
              lineStyle: {
                color: "none"
              }
            },
            axisLabel: {
              formatter: "{value} %",
              color: "#9DB0C1"
            }
          }
        ],
        series: [
          {
            name: "体温",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "#23BF8B",
                borderColor: "#fff", //拐点边框颜色
                borderWidth: 4 //拐点边框大小
              }
            },
            color: ["#23BF8B"],
            data: this.temperatureCharList
          },
          {
            name: "SPO2",
            type: "line",
            symbolSize: 10,
            yAxisIndex: 1,
            symbol: "triangle",
            itemStyle: {
              normal: {
                color: "#1E87F0",
                borderColor: "#fff", //拐点边框颜色
                borderWidth: 2 //拐点边框大小
              }
            },
            color: ["#1E87F0"],
            data: this.spo2CharList
          }
        ],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ["toolbox"],
              pixelRatio: 2
            }
          }
        }
      });
    },
    threeform() {
      // 基于dom，初始化echarts实例
      let three = echarts.init(document.getElementById("three"));
      // 绘制图表
      three.setOption({
        title: {
          // text: "血糖",
          left: "2%",
          top: "2%",
          textStyle: {
            //设置主标题风格
            color: "#738195", //设置主标题字体颜色
            fontStyle: "" //主标题文字风格
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          // formatter: '{b0}: {c0}<br />{b1}: {c1}'
          formatter: function(data) {
            data[0].value = data[0].value - 1000;
            return (
              data[0].axisValue +
              "<br/>\
                  " +
              data[0].marker +
              data[0].seriesName +
              ": " +
              data[0].value +
              "<br/>\
                  " +
              data[1].marker +
              data[1].seriesName +
              ": " +
              data[1].value
            );
          }
        },
        legend: {
          left: "center",
          data: ["尿量", "脉搏"],
          top: 20
        },
        xAxis: {
          type: "category",
          name: "",
          boundaryGap: false,
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "#9DB0C1"
            }
          },
          data: this.globalCharXy.normalX
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "8%",
          containLabel: true
        },
        yAxis: [
          {
            type: "value",
            min: 0, // 设置y轴刻度的最小值
            max: 16000, // 设置y轴刻度的最大值
            splitNumber: 7, // 设置y轴刻度间隔个数
            boundaryGap: false,
            // name: "血糖",
            splitLine: { show: true },
            axisLine: {
              lineStyle: {
                color: "none"
              }
            },
            axisLabel: {
              color: "#9DB0C1",
              formatter: function(params) {
                return params - 1000;
              }
            }
          },
          {
            type: "value",
            min: 20, // 设置y轴刻度的最小值
            max: 180, // 设置y轴刻度的最大值
            splitNumber: 7, // 设置y轴刻度间隔个数
            boundaryGap: false,
            name: "脉搏",
            splitLine: { show: true },
            axisLine: {
              lineStyle: {
                color: "none"
              }
            },
            axisLabel: {
              color: "#9DB0C1"
            }
          }
        ],
        series: [
          {
            name: "尿量",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "#23BF8B",
                borderColor: "#fff", //拐点边框颜色
                borderWidth: 4 //拐点边框大小
              }
            },
            color: ["#23BF8B"],
            data: this.newurineCharList
          },
          {
            name: "脉搏",
            type: "line",
            symbolSize: 10,
            symbol: "triangle",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "#1E87F0",
                borderColor: "#fff", //拐点边框颜色
                borderWidth: 2 //拐点边框大小
              }
            },
            color: ["#CC6BCC"],
            data: this.sphygmusCharList
          }
        ],
        toolbox: {
          show: true,

          feature: {
            saveAsImage: {
              show: true,

              excludeComponents: ["toolbox"],

              pixelRatio: 2
            }
          }
        }
      });
    },
    dealWithTime(data) {
      let formatDateTime;
      let Y = data.getFullYear();
      let M = data.getMonth() + 1;
      let D = data.getDate();
      let H = data.getHours();
      let Min = data.getMinutes();
      let S = data.getSeconds();
      let W = data.getDay();
      H = H < 10 ? "0" + H : H;
      Min = Min < 10 ? "0" + Min : Min;
      S = S < 10 ? "0" + S : S;
      switch (W) {
        case 0:
          W = "天";
          break;
        case 1:
          W = "一";
          break;
        case 2:
          W = "二";
          break;
        case 3:
          W = "三";
          break;
        case 4:
          W = "四";
          break;
        case 5:
          W = "五";
          break;
        case 6:
          W = "六";
          break;
        default:
          break;
      }
      formatDateTime =
        Y + "年" + M + "月" + D + "日 " + H + ":" + Min + ":" + S + " 星期" + W;
      this.headerTime.date = Y + "-" + M + "-" + D;
      this.headerTime.week = "星期" + W;
      this.headerTime.time = H + ":" + Min;
    },
    renderTime(date) {
      //格式化时间,例如(2019-09-23T20:07:13.000+0000)
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    toTime(strTime) {
      if (!strTime) {
        return "";
      }
      var myDate = new Date(strTime + "+0800");
      if (myDate == "Invalid Date") {
        strTime = strTime.replace(/T/g, " "); //去掉T
        strTime = strTime.replace(/-/g, "/");
        strTime = strTime.replace(/\.\d+/, " "); //去掉毫秒
        myDate = new Date(strTime + "+0800");
      }
      return myDate;
    }
  },
  filters: {
    formatDate(val) {
      if (val) {
        return util.formatDate.format(new Date(val), "yyyy-MM-dd");
      }
      return "";
    }
  },
  computed: {
    newurineCharList() {
      this.urineCharList.forEach((val, i) => {
        this.urineCharList[i] = val + 1000;
      });
      return this.urineCharList;
    }
  }
};
</script>
<style lang="less" scoped>
.infoDetail {
  width: 100%;
  .title {
    width: 100%;
    height: 0.72rem;
    background: url(../../assets/images/topbar.png) no-repeat;
    background-size: 100% 100%;
    padding: 0 0.4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title_left {
      font-size: 0.26rem;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: #fff;
      line-height: 0.17rem;
      span {
        margin-right: 0.2rem;
      }
    }
    .title_right {
      font-size: 0.26rem;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: #fff;
      line-height: 0.17rem;
    }
  }
  .infoDetail_container {
    width: 100%;
    height: 10.08rem;
    padding: 0.2rem 0.2rem 0.3rem;
    box-sizing: border-box;
    background: #edf1f5;
    display: flex;
    .left {
      width: 15.34rem;
      height: 9.57rem;
      margin-right: 0.2rem;
      .left_top {
        width: 15.34rem;
        height: 1.56rem;
        background: #fff;
        box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
        border-radius: 0.1rem;
        margin-bottom: 0.2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .num {
          font-size: 0.24rem;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: #fff;
          padding: 0.1rem 0.24rem;
          background: #2b77ef;
          border-radius: 0.22rem;
        }
        .pic {
          width: 1.2rem;
          height: 1.14rem;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .come {
            position: absolute;
            left: 0.15rem;
            bottom: -0.08rem;
            z-index: 9;
            width: 0.84rem;
            height: 0.32rem;
            text-align: center;
            line-height: 0.32rem;
            background: #23bf8b;
            border-radius: 0.16rem;
            color: #fff;
            font-size: 0.18rem;
          }
        }
        .patient_info {
          width: 70%;
          height: 1.56rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .name {
          font-size: 0.27rem;
          color: #2b3f53;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
        }
        .sex {
          color: #5b6977;
          font-size: 0.22rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
        }
        .age {
          color: #5b6977;
          font-size: 0.22rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
        }
        .startime {
          padding: 0.1rem 0.15rem;
          color: #5b6977;
          font-size: 0.16rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          background: #eaf3fc;
          display: flex;
          align-items: center;
          border-radius: 0.18rem;
          span {
            color: #128bf1;
            font-size: 0.17rem;
            margin-left: 0.1rem;
          }
        }
        .doc {
          display: flex;
          align-items: center;
          .pic {
            width: 0.64rem;
            height: 0.64rem;
            margin-right: 0.15rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          p {
            color: #5b6977;
            font-size: 0.16rem;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            span {
              font-size: 0.17rem;
              font-family: PingFang-SC-Bold;
              font-weight: bold;
              color: #128bf1;
            }
          }
        }
      }
      .left_ctn {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .one {
          width: 5.4rem;
          height: 3.8rem;
          background: #fff;
          box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
          border-radius: 0.1rem;
          margin-bottom: 0.2rem;
        }
        .two {
          width: 9.6rem;
          height: 3.8rem;
          background: #fff;
          box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
          border-radius: 0.1rem;
          margin-bottom: 0.2rem;
        }
        .three {
          width: 9.6rem;
          height: 3.8rem;
          background: #fff;
          box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
          border-radius: 0.1rem;
        }
        .four {
          width: 5.4rem;
          height: 3.8rem;
          background: #fff;
          box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
          border-radius: 0.1rem;
          display: flex;
          .four_left {
            .left_title {
              color: #738195;
              line-height: 0.6rem;
              height: 0.6rem;
              font-weight: 500;
              font-size: 0.2rem;
              padding-left: 0.2rem;
              box-sizing: border-box;
            }
            .fourpic {
              width: 2.7rem;
              height: 3.2rem;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              .four_text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                z-index: 9;
                h4 {
                  color: #566587;
                  font-size: 0.22rem;
                  text-align: center;
                  border-bottom: 0.14rem;
                }
                p {
                  font-size: 0.18rem;
                  color: #96a1bb;
                  text-align: center;
                }
              }
            }
          }

          .fourmsg {
            width: 2.7rem;
            height: 3.8rem;
            padding-top: 0.4rem;
            padding-left: 0.01rem;
            box-sizing: border-box;
            p {
              font-size: 0.18rem;
              color: #4a5a7f;
              margin-bottom: 1rem;
              span {
                display: inline-block;
                width: 0.31rem;
                height: 0.42rem;
                margin-right: 0.02rem;
                text-align: center;
                line-height: 0.42rem;
                font-size: 0.34rem;
                color: #fff;
                font-weight: bold;
                background: url(../../assets/images/timebg.png) no-repeat;
                background-size: 100% 100%;
              }
            }
            h3 {
              font-size: 0.2rem;
              color: #4a5a7f;
              span {
                display: inline-block;
                width: 0.14rem;
                height: 0.14rem;
                background: #4089ff;
                border-radius: 50%;
                margin-right: 0.12rem;
              }
            }
          }
        }
      }
    }
    .rightcontainer {
      width: 3.22rem;
      height: 9.57rem;
      .right {
        width: 3.22rem;
        height: 7.43rem;
        background: #fff;
        box-shadow: 0px 0.04rem 0.22rem 0rem rgba(214, 214, 214, 0.2);
        border-radius: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .process {
          width: 2.32rem;
          height: 7.43rem;
          background: url(../../assets/images/rightbg.png) no-repeat;
          background-size: 100% 100%;
          padding: 0.76rem 0.25rem;
          box-sizing: border-box;
          .process_container {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 0.91rem;
            overflow: hidden;
            .process_ctn {
              position: absolute;
              bottom: 0;
              left: 0;
              background: url(../../assets/images/processbg.png) no-repeat;
              background-size: 1.83rem 1.05rem;
              background-position: 0 100%;
              background-color: #58c095;
              width: 100%;
              // height: 100%;
              z-index: 6;
            }
            p {
              position: absolute;
              top: 1.07rem;
              left: 0;
              z-index: 9;
              font-size: 0.36rem;
              color: #5b6977;
              width: 100%;
              text-align: center;
            }
            .mid {
              position: absolute;
              bottom: 0.97rem;
              left: 0;
              z-index: 9;
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              align-items: flex-end;
              div {
                width: 0.23rem;
                height: 0.23rem;
                margin-bottom: 0.23rem;
                background: #fff;
              }
            }
            h3 {
              position: absolute;
              bottom: 2rem;
              left: 0;
              z-index: 9;
              color: #fff;
              font-size: 0.51rem;
              // margin-bottom: 0.4rem;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
      .rightcontainerbtn {
        margin-top: 0.2rem;
        width: 3.22rem;
        height: 1.94rem;
        border-radius: 0.1rem;
        background: #fff;
        padding: 0.3rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .control {
          display: flex;
          align-items: center;
          .controltext {
            color: #5b6977;
            font-size: 0.22rem;
            margin-right: 0.2rem;
          }
        }
      }
    }
  }
}
</style>

<style>
#tableStyle tr {
  line-height: 70px;
}
#tableStyle td {
  text-align: center;
  width: 80px;
  font-size: 17px;
}
/* 
#tableStyle table{
  margin-left: 5%;
} */

#tableStyle table,
#tableStyle table tr th,
#tableStyle table tr td {
  border: 1px solid black;
}

/* table,table tr th, table tr td { border:1px solid black; } */
/* 
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 20px;
} */
/* .el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 20px;
} */

.el-table--border td {
  border: 0.5px solid black;
}

.el-table::before {
  border: 0;
}

.el-table--border,
.el-table--group {
  border: 0;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: black;
}
.el-table--border th {
  border: 0.5px solid #000000;
}
/* .el-table td{
  border: 1px black solid ;
} */
/* .el-table{
  border: 1px black solid ;
  border-bottom: 2px black solid ;
} */
.rightcontainerbtn .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.rightcontainerbtn .el-switch__label--right {
  z-index: 1;
  color: #00bd74 !important;
  /* right: -1px; */
}
/*关闭时文字位置设置*/
.rightcontainerbtn .el-switch__label--left {
  z-index: 1;
  left: 38px;
  color: #b0b0b0 !important;
  /* font-size: 16px !important; */
}
/*显示文字*/
.rightcontainerbtn .el-switch__label.is-active {
  display: block;
}
.rightcontainerbtn .el-switch__core {
  width: 60px !important;
  height: 30px;
  border-radius: 15px;
  /* background: #EAEAEA; */
}
.rightcontainerbtn .el-switch__core::after {
  width: 26px;
  height: 26px;
  background: #b1b1b1;
}
.rightcontainerbtn .is-checked ::after {
  width: 26px;
  height: 26px;
  background: #39b082;
  left: 100%;
  margin-left: -27px !important;
}
.fourpic .el-progress-circle {
  width: 1.78rem !important;
  height: 1.78rem !important;
}
</style>