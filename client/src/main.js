import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import { mask } from '@/filters/mask.filter.js'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.filter('mask', mask)


new Vue({
  render: h => h(App),
}).$mount('#app')
