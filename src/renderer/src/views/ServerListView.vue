<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NewServerButton from '../components/NewServerButton.vue'
import ServerListItem from '../components/ServerListItem.vue'
import Modal from '../components/Modal.vue'

const serverList = ref({})
const isModalVisible = ref(false)
const serverName = ref('')

function showModal(name: string) {
  isModalVisible.value = true
  serverName.value = name
}
function closeModal() {
  isModalVisible.value = false
  setTimeout(() => {
    serverName.value = ''
  }, 300)
}
function deleteServer(data) {
  console.log('deleteServer', data.name)
  closeModal()
  window.api.deleteServer({ name: data.name })
}

onMounted(() => {
  window.ipcRenderer.on('servers:update:ans', (_, data) => {
    console.log('vue: update-list')
    console.log(data)
    serverList.value = data
  })

  window.api.getServers()
})

function addServer() {
  const newName = 'Новый сервер'
  const newConfig = { ip: 'value1' }
  window.api.addServer({ name: newName, config: newConfig })
}
</script>

<template>
  <Modal
    v-show="isModalVisible"
    :name="serverName"
    @close="closeModal"
    @approve="deleteServer($event)"
  />
  <div class="server-list">
    <RouterLink to="/new-server">
      <NewServerButton @click="addServer"></NewServerButton>
    </RouterLink>
    <!-- {{ serverList }} -->
    <ServerListItem
      v-for="(_, name) of serverList"
      :key="name"
      :title="name"
      @showModal="showModal($event)"
      >{}</ServerListItem
    >
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.server-list {
  display: flex;
  gap: 14px;
  width: 100%;
  flex-direction: column;
}
</style>
