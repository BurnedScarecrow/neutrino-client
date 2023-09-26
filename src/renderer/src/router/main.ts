import ServerList from '../views/ServerListView.vue'
import NewServer from '../views/NewServerView.vue'
import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: ServerList },
  { path: '/new-server', component: NewServer }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
