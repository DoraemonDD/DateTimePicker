import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)


// app.directive('focus', {
//   mounted(el, binding, vnode) {
//     const handler = (e: Event) => {
//       if (el.contains(e.target)) {
//         // vnode.context.onFoucs()
//       } else {
//         console.log("不包含")
//       }
//     }
//     document.addEventListener('click', handler)
//   }
// })

app.use(createPinia())
app.use(router)

app.mount('#app')
