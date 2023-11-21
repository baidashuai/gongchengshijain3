import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/globle.css';
import request from "@/utils/request";

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false
Vue.use(ElementUI,{size:"mini"});
Vue.use(Vuesax)
Vue.prototype.request=request;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
