<template>
  <div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" width="50">
    </el-table-column>
    <el-table-column prop="sickbed_id" label="床号" width="60">
    </el-table-column>
    <el-table-column prop="occur_time" label="时间" width="160">
    </el-table-column>
    <el-table-column prop="device_id" label="设备ID" width="80">
    </el-table-column>
    <el-table-column prop="name" label="姓名" width="110">
    </el-table-column>
    <el-table-column prop="sex" label="性别" width="50">
    </el-table-column>
    <el-table-column prop="age" label="年龄" width="70">
    </el-table-column>
    <el-table-column prop="in_date" label="入院时间" width="160">
    </el-table-column>
    <el-table-column prop="doctor" label="医生" width="80">
    </el-table-column>
    <el-table-column prop="nurse" label="护士" width="80">
    </el-table-column>
    <el-table-column prop="temperature" label="体温" width="70">
    </el-table-column>
    <el-table-column prop="sphygmus" label="脉搏" width="70">
    </el-table-column>
    <el-table-column prop="blood_oxygen" label="SpO2" width="70">
    </el-table-column>
    <el-table-column prop="blood_sugar" label="血糖" width="70">
    </el-table-column>
    <el-table-column prop="urinate_volume" label="当日尿量" width="70">
    </el-table-column>
    <el-table-column prop="transfusion_progress" label="输液进度" width="70">
    </el-table-column>
    <el-table-column prop="bladder" label="膀胱训练" width="70">
    </el-table-column>
    <el-table-column prop="urine_time" label="排尿计时" width="80">
    </el-table-column>
    <el-table-column prop="urine_switch" label="尿袋开关" width="70">
    </el-table-column>
    <el-table-column prop="transfusion_switch" label="输液开关" width="70">
    </el-table-column>
  </el-table>
  <el-divider></el-divider>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import global from '@/components/Global'
export default {
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.getCurrentPatientMonitort()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.getCurrentPatientMonitort()
      }, 2000)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    getCurrentPatientMonitort () {
      this.tableData = []
      axios.post(global.serverip + '/getsickbedmonitorview')
        .then(response => {
          // console.log(response.data)
          response.data.forEach((item, index) => {
            var temp = {}
            temp.sickbed_id = item['sickbed_id']
            temp.name = item['name']
            temp.sex = item['sex']
            var birthdays = new Date(item['birthdate'])
            var d = new Date()
            temp.age = d.getFullYear() - birthdays.getFullYear() -
              (d.getMonth() < birthdays.getMonth() ||
              (d.getMonth() === birthdays.getMonth() &&
                d.getDate() < birthdays.getDate()) ? 1 : 0)
            temp.in_date = item['operate_time']
            temp.doctor = item['doctor']
            temp.nurse = item['nurse']
            temp.occur_time = item['occur_time']
            temp.device_id = item['device_id']
            temp.temperature = item['temperature']
            temp.sphygmus = item['sphygmus']
            temp.blood_oxygen = item['blood_oxygen']
            temp.blood_sugar = item['blood_sugar']
            temp.urinate_volume = item['urinate_volume']
            temp.transfusion_progress = item['transfusion_progress']
            temp.bladder = item['bladder']
            temp.urine_time = item['urine_time']
            temp.urine_switch = item['urine_switch']
            temp.transfusion_switch = item['transfusion_switch']
            this.tableData.push(temp)
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
  .div-inline{ display:inline }
</style>
