import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import EleForm from '../lib/main.ts'
// import "@Tornado/ele-form/dist/style.css"

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(EleForm)

app.mount('#app')
