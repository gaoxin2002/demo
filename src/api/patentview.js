/* jshint esversion: 6 */
import axios from 'axios';
import qs from 'qs';
// let base = 'http://192.168.50.7:8080';
let base = 'http://192.168.50.234:8080';
// let base = 'http://www.zerolur.cn/CentreService';
// let gxIp = 'http://192.168.50.7:8080'


// 首页病人数据
const getCurrentPatientMonitort = params => { return axios.post(`${base}/getsickbedmonitorview`, qs.stringify(params)); };
// 开关操作
const operatorSwitch = params => { return axios.post(`${base}/patient-monitor/operatorSwitch`, qs.stringify(params)); };
// 入院
const patientInHos = params => { return axios.post(`${base}/patientIn`, qs.stringify(params)); };

//-----------------------------------二级页面-----------------------------------//

// 二级页面报表数据
const selectMonitorDataCharList = params => { return axios.post(`${base}/patient-monitor/selectMonitorDataCharList`, qs.stringify(params)); };
//二级界面查询血糖
const selectPatientBloodSugerDef = params => { return axios.post(`${base}/patient-monitor/selectPatientBloodSugerDef`, qs.stringify(params)); };


//导出时查询血糖数据
const selectPatientBloodSugerByDate = params => { return axios.post(`${base}/patient-monitor/selectPatientBloodSugerByDate`, qs.stringify(params)); };
//导出时根据天数查询数据
const selectMonitorByDate = params => { return axios.post(`${base}/patient-monitor/selectMonitorByDate`, qs.stringify(params)); };



// 修改病人信息
const updatePatienInfo = params => { return axios.post(`${base}/updatePatienInfoAndRecordInfo`, qs.stringify(params)); };
// 根据床号查询病人信息
const selectPatientInfoByBedNum = params => { return axios.post(`${base}/findPatientInfoById`, qs.stringify(params)); };
// 修改膀胱训练
const updatePatientBladder = params => { return axios.post(`${base}/patient-monitor/updatePatientBladder`, qs.stringify(params)); };
// 出院
const patientOut = params => { return axios.post(`${base}/patientOut`, qs.stringify(params)); };
// 空床下拉加载
const findUsableSickbed = params => { return axios.post(`${base}/findUsableSickbed`, qs.stringify(params)); };

const changeBed = params => { return axios.post(`${base}/changeBed`, qs.stringify(params)); };

export default {
    getCurrentPatientMonitort,
    selectMonitorDataCharList,
    operatorSwitch,
    patientInHos,
    updatePatienInfo,
    selectPatientInfoByBedNum,
    updatePatientBladder,
    patientOut,
    findUsableSickbed,
    changeBed,
    selectPatientBloodSugerDef,
    selectPatientBloodSugerByDate,
    selectMonitorByDate
}