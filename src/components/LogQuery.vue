<template>
  <div>
    <el-divider content-position='left'>条件</el-divider>
    <div class="block">
      <p><el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']">
      </el-date-picker></p>
      <p><el-row :gutter="10">
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">操作人</template>
        </el-input>
      </div></el-col>
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">操作等级</template>
        </el-input>
      </div></el-col>
      <el-col :span="6"><div>
        <el-input placeholder="请输入内容">
          <template slot="prepend">操作内容</template>
        </el-input>
      </div></el-col>
      </el-row></p>
    </div>
    <el-button type='primary'>查询</el-button>
    <el-divider content-position='left'>查询结果</el-divider>
    <el-table :data="tableData">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="device_id" label="时间" width="150">
      </el-table-column>
      <el-table-column prop="device_id" label="操作等级" width="150">
      </el-table-column>
      <el-table-column prop="production_date" label="操作人" width="200">
      </el-table-column>
      <el-table-column prop="setup_date" label="操作内容" width="200">
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
</style>
