<template>
  <div>
    <el-divider content-position='left'>操作</el-divider>
    <el-button type='primary' @click='patientRegisterClick'>患者注册</el-button>
<!--     <el-button type='primary' @click='inPatientdialogVisible = true'>患者入院</el-button>
    <el-button type='primary' @click='getPatientList'>Flush</el-button>
    <el-button type='primary' @click='test'>Test</el-button> -->
    <el-divider content-position='left'>患者列表</el-divider>
    <div>
      <el-table :data='tableData' height='600' border style='width: 100%'>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop='name' label='姓名' width='120'>
      </el-table-column>
      <el-table-column prop='sex' label='性别' width='90'>
      </el-table-column>
      <el-table-column prop='birthdate' label='出生日期' width='120'>
      </el-table-column>
      <el-table-column prop='telephone' label='联系电话' width='150'>
      </el-table-column>
      <el-table-column prop='department' label='操作' width='160'>
        <template slot-scope='scope'>
           <!-- :disabled='scope.row.patient_id === 44' -->
        <el-button type='text' size='small' :disabled="scope.row.status===1" @click='inPatientClick(scope.$index)'>入院</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" size='small' @click='editPatientClick(scope.$index)'>编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" size='small' @click='deletePatientClick(scope.$index)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
      <el-dialog title='患者注册' width='420px' :visible.sync='registordialogVisible' center>
        <el-form :model='patientRegisterForm' label-width="80px">
          <el-form-item label="患者姓名">
            <el-input placeholder="请输入姓名" v-model="patientRegisterForm.name"></el-input>
          </el-form-item>
          <el-form-item label='性别'>
            <el-select v-model='patientRegisterForm.sex' style='width:100%'>
              <el-option label='男' value='男'></el-option>
              <el-option label='女' value='女'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='出生年月'>
            <!-- <el-input placeholder="请输入内容" v-model='patientRegisterForm.birthdate'></el-input> -->
            <el-date-picker type="date" placeholder="选择日期" style='width:100%' v-model='patientRegisterForm.birthdate'></el-date-picker>
          </el-form-item>
          <el-form-item label='联系电话'>
            <el-input placeholder="请输入内容" v-model='patientRegisterForm.telephone'></el-input>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='registordialogVisible = false'>取 消</el-button>
          <el-button type='primary' @click='patientRegisterApply'>确 定</el-button>
        </div>
     </el-dialog>
      <el-dialog title='患者入院' width='420px' :visible.sync='inPatientdialogVisible' center>
        <el-form :model='inPatientForm' label-width="80px">
          <el-form-item label='患者姓名'>
              <el-select v-if='isNameSet'
                v-model='inPatientForm.name'
                style='width:100%'
                multiple
                filterable
                remote
                reserve-keyword
                placeholder='请输入关键词'
                :remote-method='remoteMethod'
                :loading='loading'>
              <el-option
                v-for='item in options'
                :key='item.value'
                :label='item.label'
                :value='item.value'>
              </el-option>
            </el-select>
            <span v-else>{{ patientName }}</span>
          </el-form-item>
          <el-form-item label='科室名称'>
            <el-input placeholder="请输入内容" v-model='inPatientForm.department' autocomplete='off'>
            </el-input>
          </el-form-item>
          <el-form-item label='操作人员'>
            <el-autocomplete
            class="inline-input"
            style='width:100%'
            v-model="inPatientForm.operator"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='主治医师'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="inPatientForm.doctor"
              :fetch-suggestions="querySearchDocotor"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='责任护士'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="inPatientForm.nurse"
              :fetch-suggestions="querySearchNurse"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='病床编号'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="inPatientForm.sickbed_id"
              :fetch-suggestions="querySearchSickbed"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='inPatientCancel'>取 消</el-button>
          <el-button type='primary' @click='inPatientApply'>确 定</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import axios from 'axios'
import qs from 'Qs'
import global from '@/components/Global'
export default {
  data () {
    return {
      tableData: [],
      medicalWorkerList: [],
      docotorList: [],
      nurseList: [],
      sickbedList: [],
      item: {
        id: 0,
        name: '',
        sex: '',
        birthdate: '',
        telephone: '',
        status: 0,
        record_id: 0
      },
      registordialogVisible: false,
      inPatientdialogVisible: false,
      patientRegisterForm: {
        id: 0,
        name: '',
        sex: '',
        birthdate: '',
        telephone: '',
        status: 0,
        record_id: 0
      },
      inPatientForm: {
        id: 0,
        patient_id: 0,
        in_out: '',
        operate_time: '',
        department: '',
        operator: '',
        doctor: '',
        nurse: '',
        sickbed_id: ''
      },
      patientname: '',
      options: [],
      value: [],
      // list: [],
      loading: false,
      states: [],
      isNameSet: true,
      isEdit: false,
      isDisabledFlag: false
    }
  },
  mounted () {
    this.getPatientList()
    this.getSickbedList()
    // this.list = this.states.map(item => {
    //   return { value: item, label: item }
    // })
    this.loadMedicalWorker()
  },
  methods: {
    querySearch (queryString, cb) {
      var medicalWorkerList = this.medicalWorkerList
      var results = queryString ? medicalWorkerList.filter(this.createFilter(queryString)) : medicalWorkerList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearchDocotor (queryString, cb) {
      var docotorList = this.docotorList
      var results = queryString ? docotorList.filter(this.createFilter(queryString)) : docotorList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchNurse (queryString, cb) {
      var nurseList = this.nurseList
      var results = queryString ? nurseList.filter(this.createFilter(queryString)) : nurseList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchSickbed (queryString, cb) {
      var sickbedList = this.sickbedList
      var results = queryString ? sickbedList.filter(this.createFilter(queryString)) : sickbedList
      cb(results)
    },
    loadMedicalWorker () {
      axios.post(global.serverip + '/getmedicalworkerlist')
        .then(response => {
          response.data.forEach((item, index) => {
            this.medicalWorkerList.push({ 'value': item['name'], 'duty': item['duty'] })
            if (item['duty'] === '医生') {
              this.docotorList.push({ 'value': item['name'], 'duty': item['duty'] })
            } else {
              this.nurseList.push({ 'value': item['name'], 'duty': item['duty'] })
            }
          })
          this.$notify({
            title: '成功',
            message: 'GetMedicalWorkList OK!',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelect (item) {
      console.log(item)
    },
    patientRegisterClick () {
      this.patientRegisterForm.id = 0
      this.patientRegisterForm.name = ''
      this.patientRegisterForm.sex = ''
      this.patientRegisterForm.birthdate = ''
      this.patientRegisterForm.telephone = ''
      this.patientRegisterForm.status = 0
      this.patientRegisterForm.record_id = 0
      this.registordialogVisible = true
    },
    patientRegisterApply () {
      if (this.patientRegisterForm.name === '') {
        this.$message({
          message: '警告，姓名不能为空！',
          type: 'warning'
        })
        return
      }
      if (this.patientRegisterForm.sex === '') {
        this.$message({
          message: '警告，性别不能为空！',
          type: 'warning'
        })
        return
      }
      this.registordialogVisible = false
      if (this.isEdit === true) {
        this.isEdit = false
        axios.post(global.serverip + '/patientedit', qs.stringify(this.patientRegisterForm))
          .then(response => {
            console.log(response.data)
            this.getPatientList()
            this.$notify({
              title: '成功',
              message: 'patientedit OK',
              type: 'success'
            })
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        axios.post(global.serverip + '/patientregister', qs.stringify(this.patientRegisterForm))
          .then(response => {
            console.log(response.data)
            this.getPatientList()
            this.$notify({
              title: '成功',
              message: 'patientregister OK',
              type: 'success'
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    getPatientList () {
      this.tableData = []
      axios.post(global.serverip + '/getpatientlist')
        .then(response => {
          response.data.forEach((item, index) => {
            var temp = {}
            temp.id = item['id']
            temp.name = item['name']
            temp.sex = item['sex']
            var birthdays = new Date(item['birthdate'])
            temp.birthdate = birthdays.getFullYear() + '-' + birthdays.getMonth() + '-' + birthdays.getDate()
            temp.telephone = item['telephone']
            temp.status = item['status']
            temp.record_id = item['record_id']
            console.log(response.data)

            this.tableData.push(temp)
            this.states.push(temp.name)
            this.list = this.states.map(item => {
              return { value: item, label: item }
            })
          })
          this.$notify({
            title: '成功',
            message: 'GetPatientList OK!',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSickbedList () {
      this.sickbedList = []
      axios.post(global.serverip + '/getsickbedlist')
        .then(response => {
          // console.log(response.data)
          response.data.forEach((item, index) => {
            // var temp = {}
            // temp.sickbed_id = item['sickbed_id']
            // temp.is_used = item['is_used']
            // this.tableData.push(temp)
            if (item['patient_id'] === 0) {
              this.sickbedList.push({ 'value': item['sickbed_id'], 'patient_id': item['patient_id'] })
            }
          })
          this.$notify({
            title: '成功',
            message: 'getSickbedList OK!',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    inPatientClick (index) {
      this.isNameSet = false
      this.patientName = this.tableData[index].name
      this.inPatientForm.patient_id = this.tableData[index].id
      console.log('Select :' + this.tableData[index].id)
      // this.deviceRegisterForm.sickbed_id = this.tableData[index].sickbedid
      this.inPatientdialogVisible = true
    },
    inPatientCancel () {
      this.inPatientdialogVisible = false
      this.isNameSet = true
    },
    inPatientApply () {
      if (this.inPatientForm.operator === '') {
        this.$message({
          message: '警告，操作人不能为空！',
          type: 'warning'
        })
        return
      }
      if (this.patientRegisterForm.doctor === '') {
        this.$message({
          message: '警告，主治医生不能为空！',
          type: 'warning'
        })
        return
      }
      if (this.patientRegisterForm.nurse === '') {
        this.$message({
          message: '警告，责任护士不能为空！',
          type: 'warning'
        })
        return
      }
      if (this.patientRegisterForm.sickbedid === '') {
        this.$message({
          message: '警告，病床号不能为空！',
          type: 'warning'
        })
        return
      }
      // if (this.medicalWorkerList.includes(this.patientRegisterForm.operator) === false) {
      //   this.$message({
      //     message: '警告，输入的操作人员不存在！',
      //     type: 'warning'
      //   })
      //   return
      // }
      // if (this.docotorList.includes(this.patientRegisterForm.doctor) === false) {
      //   this.$message({
      //     message: '警告，输入的医生不存在！',
      //     type: 'warning'
      //   })
      //   return
      // }
      // if (this.nurseList.includes(this.patientRegisterForm.nurse) === false) {
      //   this.$message({
      //     message: '警告，输入的护士不存在！',
      //     type: 'warning'
      //   })
      //   return
      // }
      // if (this.sickbedList.includes(this.patientRegisterForm.sickbedid) === false) {
      //   this.$message({
      //     message: '警告，输入的病床号不存在！',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.registordialogVisible = false
      var msg = '患者[' + this.patientName + ']入院成功！'
      this.inPatientForm.in_out = '入院'
      axios.post(global.serverip + '/inpatient', qs.stringify(this.inPatientForm))
        .then(response => {
          // this.sickbedList = []
          this.getSickbedList()
          this.getPatientList()
          // console.log(response.data)
          this.$message({
            type: 'success',
            message: msg
          })
        })
        .catch(error => {
          console.log(error)
        })
      this.inPatientdialogVisible = false
    },
    editPatientClick (index) {
      this.patientRegisterForm.id = this.tableData[index].id
      this.patientRegisterForm.name = this.tableData[index].name
      this.patientRegisterForm.sex = this.tableData[index].sex
      this.patientRegisterForm.birthdate = this.tableData[index].birthdate
      this.patientRegisterForm.telephone = this.tableData[index].telephone
      this.registordialogVisible = true
      this.isEdit = true
    },
    deletePatientClick (index) {
      this.$confirm('此操作将永久删除该患者信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var msg = '患者[' + this.tableData[index].name + ']删除成功！'
        axios.post(global.serverip + '/patientdelete', qs.stringify(this.tableData[index]))
          .then(response => {
            console.log(response.data)
            this.getPatientList()
            // this.$notify({
            //   title: '成功',
            //   message: msg,
            //   type: 'success'
            // })
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
    },
    test () {
      this.tableData = []
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style>
</style>
