<template>
  <div class="infoList">
    <div class="process" v-if="item.patientId > 0">
      <div class="process_container">
        <div class="process_ctn" ref="proheight"></div>
        <p>{{item.infusionSum}}ml</p>
        <div class="mid">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3>{{item.transfusionProgress === null?0:this.item.transfusionProgress}}%</h3>
      </div>
    </div>
    <div class="info" v-if="item.patientId > 0">
      <div class="info_top">
        <div class="pic">
          <img src="../../assets/images/pic.png" alt />
        </div>
        <div class="msg">
          <div class="top">
            <div>{{item.sickedId}}床</div>
            <h3>{{item.patientName}}</h3>
            <p>
              性别:
              <span>{{item.sex}}</span>
            </p>
          </div>
          <div class="mid">
            <p class="mid_left">
              入院时间:
              <span class="time">{{item.inHosTime}}</span>
            </p>
            <p>年龄: {{item.age}}岁</p>
          </div>
          <div class="bottom">
            <p class="bottom_left">
              医生:
              <span>{{item.doctorName}}</span>
            </p>
            <p>
              护士:
              <span>{{item.nurseName}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="info_mid">
        <div class="rows">
          <div class="rows_left">
            体温:
            <span>{{item.temperature}}°c</span>
          </div>
          <div class="rows_right">
            脉搏:
            <span>{{item.sphygmus}} BPM</span>
          </div>
        </div>

        <div class="rows">
          <div class="rows_left">
            SpO2:
            <span>{{item.spo2}}%</span>
          </div>
          <div class="rows_right">
            血糖:
            <span>{{item.bloodSugar}}mmoI/L</span>
          </div>
        </div>
        <div class="rows">
          <div class="rows_right">
            当日尿量:
            <span>{{item.urinateVol}}ml</span>
          </div>
        </div>
        <div class="rows">
          <div class="rows_right sub_right">
            膀胱训练:
            <span>{{item.bladder}}min/次</span>
          </div>
          <div class="rows_left sub_left">
            排尿计时:
            <span>{{item.urineTime}}min</span>
          </div>
        </div>
      </div>
    </div>
    <div class="control" v-if="item.patientId > 0" @click.stop="operatorSwitch">
      <div class="control_left">
        尿袋开关:
        <el-switch
          v-model="item.urineSwitch"
          active-color="#00BD74"
          inactive-color="#EAEAEA"
          :active-value="1"
          :inactive-value="0"
          height="40"
          active-text="开"
          inactive-text="关"
        ></el-switch>
      </div>
      <div class="control_right">
        输液开关:
        <el-switch
          v-model="item.transfusionSwitch"
          :active-value="1"
          :inactive-value="0"
          active-color="#00BD74"
          inactive-color="#EAEAEA"
          active-text="开"
          inactive-text="关"
        ></el-switch>
      </div>
    </div>
    <div class="empty" v-if="item.patientId == 0">{{item.sickedId}}&nbsp;床 </div>
  </div>
</template>

<script>
import pvcApi from "@/api/patentview";
export default {
  props: ["item"],
  data() {
    return {
      niaodaiVal: true,
      shuyeVal: false
      // dosage: null,
    };
  },
  created() {
    this.dosage = this.item.dos;
  },
  mounted() {
    if (this.item.patientId > 0) {
      this.dosageHeight();
    }
  },
  methods: {
    dosageHeight() {
      if(this.$refs.proheight){

        // this.$refs.proheight.style.height = this.item.transfusionProgress + "%";
        this.$refs.proheight.style.height =
          this.item.transfusionProgress === null
            ? 0 +"%"
            : this.item.transfusionProgress + "%";
        var that = this;
        // setInterval(function() {
        //   that.$refs.proheight.style.height = that.item.transfusionProgress + "%";
        // }, 3000);
        // this.$refs.proheight.style.height = this.item.dos + "%";
      }
    },
    // 开关操作
    operatorSwitch() {
      let params = {
        patientId: this.item.patientId,
        urineSwitch: this.item.urineSwitch,
        transfusionSwitch: this.item.transfusionSwitch
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
    }
  },
  watch:{
    item(val){
      // console.log(this.$refs.proheight);
      this.dosageHeight();
    }
  }
};
</script>

<style lang="less" scoped>
.infoList {
  position: relative;
  width: 4.24rem;
  height: 3.11rem;
  background: #fff;
  box-shadow: 0rem 0.2rem 0.24rem 0rem rgba(75, 117, 152, 0.1);
  border-radius: 0.2rem;
  margin-bottom: 0.4rem;
  // margin-right: 0.4rem;
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
    color: #999;
  }
  .process {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0.1rem;
    width: 0.65rem;
    height: 2.67rem;
    background: url(../../assets/images/jindu.png) no-repeat;
    background-size: 100% 100%;
    padding: 0.34rem 0.12rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .process_container {
      position: relative;
      width: 100%;
      height: 100%;
      .process_ctn {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #00bd74;
        width: 100%;
        height: 43%;
        z-index: 6;
      }
      p {
        position: absolute;
        top: 8%;
        left: 0;
        z-index: 9;
        font-size: 0.12rem;
        color: #5b6977;
        width: 100%;
        text-align: center;
      }
      .mid {
        position: absolute;
        bottom: 50%;
        left: 0;
        z-index: 9;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        div {
          width: 0.07rem;
          height: 0.07rem;
          margin-bottom: 0.07rem;
          background: #fff;
        }
      }
      h3 {
        position: absolute;
        bottom: 20%;
        left: 0;
        z-index: 9;
        color: #2b77ef;
        font-size: 0.15rem;
        // margin-bottom: 0.4rem;
        width: 100%;
        text-align: center;
      }
    }
  }
  .info {
    cursor: pointer;
    width: 100%;
    height: 2.65rem;
    border-bottom: 1px solid #dce8f2;
    .info_top {
      width: 100%;
      height: 1.21rem;
      border-bottom: 1px solid #dce8f2;
      padding-top: 0.11rem;
      padding-left: 0.13rem;
      padding-right: 0.77rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .pic {
        width: 1.01rem;
        height: 0.96rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .msg {
        .top {
          display: flex;
          align-items: baseline;
          margin-bottom: 0.14rem;
          div {
            font-size: 19/75rem;
            font-weight: bold;
            color: #fff;
            background: #2b77ef;
            padding: 0.07rem 0.12rem;
            border-radius: 0.2rem;
            margin-right: 0.1rem;
          }
          h3 {
            font-size: 0.18rem;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: #2b3f53;
            line-height: 0.23rem;
            margin-right: 0.16rem;
          }
          p {
            font-size: 0.14rem;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: #5b6977;
            span {
              color: #abb2b9;
            }
          }
        }
        .mid {
          padding-left: 0.06rem;
          margin-bottom: 0.14rem;
          display: flex;
          p {
            color: #5b6977;
            font-size: 0.14rem;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
          }
          .mid_left {
            margin-right: 0.12rem;
            .time {
              color: #128bf1;
              font-weight: bold;
            }
          }
        }
        .bottom {
          padding-left: 0.06rem;
          display: flex;
          p {
            color: #5b6977;
            font-size: 0.14rem;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            span {
              color: #abb2b9;
            }
          }
          .bottom_left {
            margin-right: 0.16rem;
          }
        }
      }
    }
    .info_mid {
      padding: 0.12rem 0.77rem 0 0.15rem;
      box-sizing: border-box;
      .rows {
        display: flex;
        margin-bottom: 0.15rem;
        .rows_left {
          width: 1.5rem;
          font-size: 0.16rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: #5b6977;
          span {
            color: #fb6363;
          }
        }
        .rows_right {
          font-size: 0.16rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: #5b6977;
          span {
            color: #00bd74;
          }
        }
        .sub_right {
          margin-right: 0.1rem;
        }
        .sub_left {
          margin: 0;
        }
      }
    }
  }
  .control {
    width: 100%;
    height: 0.45rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #5b6977;
    font-size: 0.18rem;
    padding: 0 0.15rem;
    box-sizing: border-box;
  }
}
// :nth-child(4n){
//     margin: 0;
// }
</style>
<style>
.control .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.control .el-switch__label--right {
  z-index: 1;
  /* right: -1px; */
}
/*关闭时文字位置设置*/
.control .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/*显示文字*/
.control .el-switch__label.is-active {
  display: block;
}
.control.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>
