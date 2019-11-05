<template>
  <div>
    <el-divider content-position='left'>操作</el-divider>
    <el-button type='primary' @click='registordialogVisible = true'>医护人员登记</el-button>
    <el-divider content-position='left'>医护人员信息</el-divider>
    <el-table :data="tableData">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="duty" label="职务" width="100">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click='deleteClick(scope.$index)'>删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-dialog title='医护人员登记' width='420px' :visible.sync='registordialogVisible' center  >
      <el-form :model='medicalWorkerRegisterForm' label-width="80px">
        <el-form-item label='姓名'>
            <el-input placeholder="请输入内容" v-model="medicalWorkerRegisterForm.name">
              <!-- <template slot="prepend">姓名</template> -->
            </el-input>
        </el-form-item>
        <el-form-item label='职务'>
<!--             <el-input placeholder="请输入内容" v-model="medicalWorkerRegisterForm.duty">
              <template slot="prepend">职务</template>
            </el-input> -->
            <el-select v-model='medicalWorkerRegisterForm.duty' style='width:100%'>
              <el-option label='医生' value='医生'></el-option>
              <el-option label='护士' value='护士'></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='registordialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='medicalWorkerRegister'>确 定</el-button>
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
      medicalWorkerRegisterForm: {
        id: 0,
        name: '',
        duty: ''
      }
    }
  },
  mounted () {
    this.getMedicalWorkList()
  },
  methods: {
    getMedicalWorkList () {
      this.tableData = []
      axios.post(global.serverip + '/getmedicalworkerlist')
        .then(response => {
          response.data.forEach((item, index) => {
            var temp = {}
            temp.id = item['id']
            temp.name = item['name']
            temp.duty = item['duty']
            // console.log(response.data)

            this.tableData.push(temp)
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
    medicalWorkerRegister () {
      this.registordialogVisible = false
      axios.post(global.serverip + '/medicalworkerregister', qs.stringify(this.medicalWorkerRegisterForm))
        .then(response => {
          console.log(response.data)
          this.getMedicalWorkList()
          this.$notify({
            title: '成功',
            message: 'Medical Worker OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteClick (index) {
      this.$confirm('此操作将永久删除该医护人员信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var msg = '医护人员[' + this.tableData[index].name + ']删除成功！'
        axios.post(global.serverip + '/medicalworkerdelete', qs.stringify(this.tableData[index]))
          .then(response => {
            console.log(response.data)
            this.getMedicalWorkList()
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
