<template>
  <div>
    <el-divider content-position='left'>操作</el-divider>
    <el-button type='primary' @click='registordialogVisible = true'>设备注册</el-button>
    <el-divider content-position='left'>设备列表</el-divider>
    <div>
      <el-table :data="tableData">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="device_id" label="设备ID" width="150">
        </el-table-column>
<!--         <el-table-column prop="production_date" label="生产日期" width="200">
        </el-table-column> -->
        <el-table-column prop="setup_date" label="安装日期" width="200">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="150">
          <template slot-scope="scope">
<!--             <el-button type="text" size="small" @click='showUpdateView(scope.$index)'>编辑</el-button>
            <el-divider direction="vertical"></el-divider> -->
            <el-button type="text" size="small" @click='deleteClick(scope.$index)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-dialog title='设备注册' width='25%' :visible.sync='registordialogVisible' center>
        <el-form :model='deviceRegisterForm'>
          <el-form-item>
            <!-- <el-input v-model='deviceRegisterForm.device_id' autocomplete='off'></el-input> -->
            <el-input placeholder="请输入内容" v-model="deviceRegisterForm.device_id">
              <template slot="prepend">设备ID</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='registordialogVisible = false'>取 消</el-button>
          <el-button type='primary' @click='deviceRegister'>确 定</el-button>
        </div>
     </el-dialog>
     <el-dialog title='设备编辑' width='25%' :visible.sync='updatedialogVisible' center>
        <el-form :model='deviceRegisterForm'>
          <el-form-item>
            <span>设备ID：{{ updateDevice }}</span>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='updatedialogVisible = false'>取 消</el-button>
          <el-button type='primary' @click='deviceUpdate'>确 定</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import qs from 'Qs'
import global from '@/components/Global'
export default {
  data () {
    return {
      tableData: [],
      registordialogVisible: false,
      updatedialogVisible: false,
      deviceRegisterForm: {
        id: 0,
        device_id: '',
        production_date: '0',
        setup_date: ''
      },
      updateDevice: ''
    }
  },
  mounted () {
    this.getDeviceInfoList()
  },
  methods: {
    getDeviceInfoList () {
      this.tableData = []
      axios.post(global.serverip + '/getdevicelist')
        .then(response => {
          // console.log(response.data)
          response.data.forEach((item, index) => {
            var temp = {}
            temp.id = item['id']
            temp.device_id = item['device_id']
            temp.production_date = item['production_date']
            temp.setup_date = item['setup_date']
            this.tableData.push(temp)
          })
          this.$notify({
            title: '成功',
            message: 'getDeviceInfoList OK!',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    deviceRegister () {
      this.registordialogVisible = false
      axios.post(global.serverip + '/deviceregister', qs.stringify(this.deviceRegisterForm))
        .then(response => {
          // console.log(response.data)
          this.getDeviceInfoList()
          this.$notify({
            title: '成功',
            message: 'Device Register OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    showUpdateView (index) {
      this.updateDevice = this.tableData[index].device_id
      // this.deviceRegisterForm.sickbed_id = this.tableData[index].sickbedid
      this.updatedialogVisible = true
    },
    deviceUpdate () {
      this.updatedialogVisible = false
      this.deviceRegisterForm.device_id = this.updateDevice
      axios.post(global.serverip + '/updatedeviceinfo', qs.stringify(this.deviceRegisterForm))
        .then(response => {
          this.getDeviceInfoList()
          this.$notify({
            title: '成功',
            message: 'Device Register OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteClick (index) {
      this.$confirm('此操作将永久删除该设备信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var msg = '设备[' + this.tableData[index].name + ']删除成功！'
        axios.post(global.serverip + '/devicedelete', qs.stringify(this.tableData[index]))
          .then(response => {
            console.log(response.data)
            this.getDeviceInfoList()
            this.$message({
              type: 'success',
              message: msg
            })
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log('Select :' + this.tableData[index].id)
    }
  }
}
</script>

<style>
</style>
