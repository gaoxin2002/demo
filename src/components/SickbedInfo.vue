<template>
  <div>
    <el-divider content-position='left'>操作</el-divider>
    <el-button type='primary' @click='registordialogVisible = true'>病床登记</el-button>
    <el-divider content-position='left'>病床列表</el-divider>
    <div>
      <el-table :data="tableData">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="sickbed_id" label="病床ID" width="120">
        </el-table-column>
        <el-table-column prop="device_id" label="设备ID" width="120">
        </el-table-column>
        <el-table-column prop="name" label="患者姓名" width="150">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type='text' size='small' @click='exchangeClick(scope.$index)'>换床</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type='text' size='small' @click='outPatinetClick(scope.$index)'>出院</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small" @click='deviceBindClick(scope.$index)'>设备绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-dialog title='病床登记' width='25%' :visible.sync='registordialogVisible' center>
        <el-form :model='sickbedInfoForm'>
          <el-form-item>
            <el-input placeholder="请输入内容" v-model="sickbedInfoForm.sickbed_id">
              <template slot="prepend">病床ID</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='registordialogVisible = false'>取 消</el-button>
          <el-button type='primary' @click='sickbedRegister'>确 定</el-button>
        </div>
     </el-dialog>
      <el-dialog title='设备绑定' width='420px' :visible.sync='deviceBindDialogVisible' center>
        <el-form :model='sickbedInfoForm' label-width="50px">
          <el-form-item label='设备'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="sickbedInfoForm.device_id"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='deviceBindCancel'>取 消</el-button>
          <el-button type='primary' @click='deviceBindApply'>确 定</el-button>
        </div>
     </el-dialog>
      <el-dialog title='患者换床' width='420px' :visible.sync='exchangeDialogVisible' center>
        <el-form :model='exchangeForm' label-width="80px">
          <el-form-item label='患者姓名'>
            <span>{{ patientName }}</span>
          </el-form-item>
          <el-form-item label='操作人员'>
            <el-autocomplete
            class="inline-input"
            style='width:100%'
            v-model="exchangeForm.operator"
            :fetch-suggestions="querySearchOperator"
            placeholder="请输入内容"
            @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='主治医师'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="exchangeForm.doctor"
              :fetch-suggestions="querySearchDocotor"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='责任护士'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="exchangeForm.nurse"
              :fetch-suggestions="querySearchNurse"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label='病床编号'>
            <el-autocomplete
              class="inline-input"
              style='width:100%'
              v-model="exchangeForm.sickbed_id"
              :fetch-suggestions="querySearchSickbed"
              placeholder="请输入内容"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='exchangeCancel'>取 消</el-button>
          <el-button type='primary' @click='exchangeApply'>确 定</el-button>
        </div>
     </el-dialog>
     <el-dialog title='患者出院' width='420px' :visible.sync='outPatientDialogVisible' center>
        <el-form :model='outPatientForm' label-width="80px">
          <el-form-item label='患者姓名'>
            <span>{{ patientName }}</span>
          </el-form-item>
          <el-form-item label='操作人员'>
            <el-autocomplete
            class="inline-input"
            style='width:100%'
            v-model="outPatientForm.operator"
            :fetch-suggestions="querySearchOperator"
            placeholder="请输入内容"
            @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='outPatientCancel'>取 消</el-button>
          <el-button type='primary' @click='outPatientApply'>确 定</el-button>
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
      deviceList: [],
      medicalWorkerList: [],
      docotorList: [],
      nurseList: [],
      sickbedList: [],
      registordialogVisible: false,
      deviceBindDialogVisible: false,
      exchangeDialogVisible: false,
      outPatientDialogVisible: false,
      sickbedInfoForm: {
        id: 0,
        sickbed_id: '',
        device_id: '',
        patient_id: 0
      },
      exchangeForm: {
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
      outPatientForm: {
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
      patientName: ''
    }
  },
  mounted () {
    this.getSickbedList()
    this.loadDeviceList()
    this.loadMedicalWorker()
  },
  methods: {
    querySearchOperator (queryString, cb) {
      var medicalWorkerList = this.medicalWorkerList
      var results = queryString ? medicalWorkerList.filter(this.createFilter(queryString)) : medicalWorkerList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchSickbed (queryString, cb) {
      var sickbedList = this.sickbedList
      var results = queryString ? sickbedList.filter(this.createFilter(queryString)) : sickbedList
      cb(results)
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
    getSickbedList () {
      this.tableData = []
      axios.post(global.serverip + '/getsickbedpatientview')
        .then(response => {
          // console.log(response.data)
          response.data.forEach((item, index) => {
            var temp = {}
            temp.sickbed_id = item['sickbed_id']
            temp.device_id = item['device_id']
            temp.patient_id = item['patient_id']
            temp.name = item['name']
            temp.sex = item['sex']
            temp.birthdate = item['birthdate']
            temp.telephone = item['telephone']
            this.tableData.push(temp)
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
    sickbedRegister () {
      this.registordialogVisible = false
      axios.post(global.serverip + '/sickbedregister', qs.stringify(this.sickbedInfoForm))
        .then(response => {
          console.log(response.data)
          this.getSickbedList()
          this.$notify({
            title: '成功',
            message: 'Sickbed Register OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadDeviceList () {
      axios.post(global.serverip + '/getdevicelist')
        .then(response => {
          response.data.forEach((item, index) => {
            this.deviceList.push({ 'value': item['device_id'], 'date': item['setup_date'] })
          })
          this.$notify({
            title: '成功',
            message: 'GetDeviceList OK!',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    querySearch (queryString, cb) {
      var deviceList = this.deviceList
      var results = queryString ? deviceList.filter(this.createFilter(queryString)) : deviceList
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    deviceBindClick (index) {
      // this.sickbedInfoForm.id = this.tableData[index].id
      this.sickbedInfoForm.sickbed_id = this.tableData[index].sickbed_id
      this.sickbedInfoForm.device_id = this.tableData[index].device_id
      this.sickbedInfoForm.patient_id = this.tableData[index].patient_id
      this.deviceBindDialogVisible = true
    },
    deviceBindCancel () {
      this.deviceBindDialogVisible = false
    },
    deviceBindApply () {
      if (this.sickbedInfoForm.device_id === '') {
        this.$message({
          message: '警告，设备ID不能为空！',
          type: 'warning'
        })
        return
      }
      var msg = '设备[' + this.sickbedInfoForm.device_id + ']绑定成功！'
      axios.post(global.serverip + '/updatesickbedinfodeviceid', qs.stringify(this.sickbedInfoForm))
        .then(response => {
          this.getSickbedList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
        .catch(error => {
          console.log(error)
        })
      this.deviceBindDialogVisible = false
    },
    exchangeClick (index) {
      // this.isNameSet = false
      this.patientName = this.tableData[index].name
      this.exchangeForm.patient_id = this.tableData[index].patient_id
      // this.inPatientForm.patient_id = this.tableData[index].id
      // console.log('Select :' + this.tableData[index].id)
      // this.deviceRegisterForm.sickbed_id = this.tableData[index].sickbedid
      this.exchangeForm.department = this.tableData[index].sickbed_id
      this.exchangeDialogVisible = true
    },
    exchangeCancel () {
      this.exchangeDialogVisible = false
    },
    exchangeApply () {
      var msg = '患者[' + this.patientName + ']换床成功！'
      this.exchangeForm.in_out = '换床'
      axios.post(global.serverip + '/patientexchangesickbed', qs.stringify(this.exchangeForm))
        .then(response => {
          this.getSickbedList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
        .catch(error => {
          console.log(error)
        })
      this.exchangeDialogVisible = false
    },
    outPatinetClick (index) {
      // this.isNameSet = false
      this.patientName = this.tableData[index].name
      this.outPatientForm.patient_id = this.tableData[index].patient_id
      // console.log('Select :' + this.tableData[index].id)
      this.outPatientForm.sickbed_id = this.tableData[index].sickbed_id
      this.outPatientDialogVisible = true
    },
    outPatientCancel () {
      this.outPatientDialogVisible = false
    },
    outPatientApply () {
      var msg = '患者[' + this.patientName + ']出院成功！'
      this.outPatientForm.in_out = '出院'
      axios.post(global.serverip + '/outpatient', qs.stringify(this.outPatientForm))
        .then(response => {
          this.getSickbedList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
        .catch(error => {
          console.log(error)
        })
      this.outPatientDialogVisible = false
    }
  }
}
</script>

<style>
</style>
