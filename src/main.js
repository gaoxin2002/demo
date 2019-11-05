// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import Vuex from 'vuex';
import store from './vuex/store';
import globalRules from "@/common/data/global_rules";
import globalOptions from "@/common/data/global_options";
import globalCharXy from "@/common/data/global_charXy";
import '@/assets/css/reset.css'

//打印pdf
// import htmlToPdf from './utils/pdfutil'
// Vue.use(htmlToPdf)

import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})

Vue.prototype.$echarts = echarts
Vue.prototype.globalRules = globalRules
Vue.prototype.globalOptions = globalOptions
Vue.prototype.globalCharXy = globalCharXy

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuex)

// Vue.component('chart', ECharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
})
