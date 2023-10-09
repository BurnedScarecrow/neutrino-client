<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const name = ref('')
const config = ref({
  server: '',
  server_port: '',
  method: '',
  password: ''
})
</script>

<template>
  <div class="connection">
    <nav>
      <router-link class="round-button" to="/"><img src="../assets/icons/back.svg" /></router-link>
      {{ name }}
    </nav>

    <div class="divider"></div>
    <div class="row">
      <span>Local listenning port</span>
      <input v-model="config.server_port" type="text" placeholder="Port" />
    </div>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.connection {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 160px 75px;
  gap: 15px;
  align-items: center;
}
</style>
