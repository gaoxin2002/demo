import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import PatientInfo from '@/components/PatientInfo'
import PatientView from '@/components/PatientView'
import MedicalWorkerInfo from '@/components/MedicalWorkerInfo'
import DeviceInfo from '@/components/DeviceInfo'
import SickbedInfo from '@/components/SickbedInfo'
import MonitorHistory from '@/components/MonitorHistory'
import LogQuery from '@/components/LogQuery'
// import PatientViewChar from '@/components/PatientViewChar'
// 监控页面
import MonitorList from '@/components/monitor/MonitorList'
// 监控二级页面
import MonitorDetail from '@/components/monitor/MonitorDetail'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: 'monitorList'
    },
    {
      path: '/PatientInfo',
      name: 'PatientInfo',
      component: PatientInfo
    },
    {
      path: '/PatientView',
      name: 'PatientView',
      component: PatientView
    },
    {
      path: '/MedicalWorkerInfo',
      name: 'MedicalWorkerInfo',
      component: MedicalWorkerInfo
    },
    {
      path: '/DeviceInfo',
      name: 'DeviceInfo',
      component: DeviceInfo
    },
    {
      path: '/SickbedInfo',
      name: 'SickbedInfo',
      component: SickbedInfo
    },
    {
      path: '/MonitorHistory',
      name: 'MonitorHistory',
      component: MonitorHistory
    },
    {
      path: '/LogQuery',
      name: 'LogQuery',
      component: LogQuery
    },
    {
      path: '/monitorList',
      name: 'MonitorList',
      component: MonitorList
    },
    {
      path: '/monitorDetail',
      name : 'MonitorDetail',
      component :MonitorDetail
    }
  ]
})
