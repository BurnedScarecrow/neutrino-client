import ServerList from '../views/ServerListView.vue'
import NewServer from '../views/NewServerView.vue'
import Connection from '../views/ConnectionView.vue'
import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: ServerList },
  { path: '/new-server', component: NewServer },
  { path: '/connect', component: Connection }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
