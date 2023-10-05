<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Modal from '../components/Modal.vue'
import NewServerButton from '../components/NewServerButton.vue'
import ServerListItem from '../components/ServerListItem.vue'

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

const updateServersHandler = (_, data) => {
  console.log('vue: update-list')
  console.log(data)
  serverList.value = data
}

onMounted(() => {
  window.ipcRenderer.on('servers:update:ans', updateServersHandler)

  window.api.getServers()
})
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
      <NewServerButton></NewServerButton>
    </RouterLink>

    <ServerListItem
      v-for="(_, name) of serverList"
      :key="name"
      :title="name"
      @show-modal="showModal($event)"
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
