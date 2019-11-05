const inHosRules = {
    patientName: [
        { required: true, message: '请输入患者姓名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ],
      doctorName: [
        { required: true, message: '请输入医生姓名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ],
      nurseName: [
        { required: true, message: '请输入护士姓名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ],
      departmentName: [
        { required: true, message: '请输入科室名称', trigger: 'blur' },
        // { min: 3, max: 5, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ],
      inHosTime: [
        { required: true, message: '请选择入院时间', trigger: 'blur' },
        // { min: 3, max: 5, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ],
}

export default{
    inHosRules,
}