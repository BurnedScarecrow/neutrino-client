<script setup lang="ts">
import { ref } from 'vue'
import NewServerButton from '../components/NewServerButton.vue'
import ServerListItem from '../components/ServerListItem.vue'

const servers = ref([...window.api.getServers()])
const addServer = (name, ip) => {
  console.log('added')
  window.api.addServer(name, ip)
  servers.value = [...window.api.getServers()] // Обновляем массив servers после добавления сервера
}
</script>

<template>
  <div class="server-list">
    <RouterLink to="/new-server">
      <NewServerButton @click="addServer('name', 'ip')"></NewServerButton>
    </RouterLink>
    <ServerListItem v-for="item in servers" :key="item.id" :title="item.name"></ServerListItem>
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
