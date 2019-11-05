<template>
  <div>
    <el-divider content-position='left'>条件</el-divider>
    <p>监控时间：<el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']">
    </el-date-picker></p>
    <p>入院时间：<el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']">
    </el-date-picker></p>
    <p><el-row :gutter="10">
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">设备ID</template>
        </el-input>
      </div></el-col>
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">病床ID</template>
        </el-input>
      </div></el-col>
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">姓名</template>
        </el-input>
      </div></el-col>
    </el-row></p>
    <p><el-row :gutter="10">
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">医生</template>
        </el-input>
      </div></el-col>
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">护士</template>
        </el-input>
      </div></el-col>
    </el-row></p>
    <el-button type='primary'>查询</el-button>
    <el-divider content-position='left'>查询结果</el-divider>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="occur_time" label="时间" width="180">
      </el-table-column>
      <el-table-column prop="device_id" label="设备ID" width="80">
      </el-table-column>
      <el-table-column prop="bednum" label="床号" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="110">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="90">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="90">
      </el-table-column>
      <el-table-column prop="date" label="入院时间" width="110">
      </el-table-column>
      <el-table-column prop="doctor" label="医生" width="110">
      </el-table-column>
      <el-table-column prop="nurse" label="护士" width="120">
      </el-table-column>
      <el-table-column prop="temperature" label="体温" width="90">
      </el-table-column>
      <el-table-column prop="sphygmus" label="脉搏" width="90">
      </el-table-column>
      <el-table-column prop="blood_oxygen" label="SpO2" width="90">
      </el-table-column>
      <el-table-column prop="blood_sugar" label="血糖" width="90">
      </el-table-column>
      <el-table-column prop="urinate_volume" label="当日尿量" width="90">
      </el-table-column>
      <el-table-column prop="transfusion_progress" label="输液进度" width="90">
      </el-table-column>
      <el-table-column prop="bladder" label="膀胱训练" width="90">
      </el-table-column>
      <el-table-column prop="urine_time" label="排尿计时" width="90">
      </el-table-column>
      <el-table-column prop="urine_switch" label="尿袋开关" width="90">
      </el-table-column>
      <el-table-column prop="transfusion_switch" label="输液开关" width="90">
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      tableData: [],
      value1: ''
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
  .div-inline{ display:inline}
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
