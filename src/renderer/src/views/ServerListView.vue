<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NewServerButton from '../components/NewServerButton.vue';
import ServerListItem from '../components/ServerListItem.vue';

const serverList = ref({})

onMounted(() => {
  window.api.on('servers:update:ans', (_, data) => {
    console.log('vue: update-list')
    console.log(data)

    serverList.value = data
  })

  window.api.getServers()
})

function addServer() {
  const newName = 'Новый сервер'
  const newConfig = { ip: 'value1' }
  console.log("vue: emit event with data")
  window.api.addServer({ name: newName, config: newConfig })
}
</script>

<template>
  <div class="server-list">
    <!-- <RouterLink to="/new-server"> -->
    <NewServerButton @click="addServer()"></NewServerButton>
    <!-- </RouterLink> -->
    <!-- {{ serverList }} -->
    <ServerListItem 
      v-for="(item, name) of serverList"
      :key="name"
      :title="name"
      >{}</ServerListItem>
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
