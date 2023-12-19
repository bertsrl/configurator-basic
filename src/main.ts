import './assets/main.css'

import App from './App.vue'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import quasarUserOptions from './quasar-user-options'

// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';


createApp(App).use(createPinia()).use(Quasar, quasarUserOptions).mount('#app')
  
