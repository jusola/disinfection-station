import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './custom.scss'

Vue.config.productionTip = false

Vue.use(Buefy)

export default new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
