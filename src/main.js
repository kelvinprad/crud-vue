import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Student from './components/Student.vue'
import Edit from './components/editStudent.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/students', name: 'Students', component: Student },
  { path: '/students/:id', name: 'edit', component: Edit },
]

const router = createRouter({
  linkActiveClass: 'active-menu',
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')

export default router
