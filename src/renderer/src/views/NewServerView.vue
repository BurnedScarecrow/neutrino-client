<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const settings = ref({
  server: '',
  server_port: '',
  method: '',
  password: ''
})
</script>

<template>
  <div class="new-server-settings">
    <nav>
      <router-link class="round-button" to="/"><img src="../assets/icons/back.svg" /></router-link>
      New proxy settings
      <div class="apply-button" to="/">
        <div class="apply_btn_inner"></div>
        <div class="apply_btn_inner"></div>
        <div class="apply_btn_inner"></div>
        <div class="apply_btn_inner">
          <img src="../assets/icons/tick.svg" />
        </div>
      </div>
    </nav>

    <input v-model="name" type="text" placeholder="Title" />

    <div class="divider"></div>

    <div class="title">Remote connection settings</div>

    <div class="tabs-row">
      <div class="btn active">Raw config</div>
      <div class="btn disabled">Auth key</div>
    </div>

    <div class="socket-row">
      <input v-model="settings.server" type="text" placeholder="IP address" />

      <input v-model="settings.server_port" type="text" placeholder="Port" />
    </div>
    <input v-model="settings.method" type="text" placeholder="Encription" />

    <input v-model="settings.password" type="password" placeholder="Password" />

    <div class="tabs-row">
      <div class="btn active">TCP</div>
      <div class="btn">TCP & UDP</div>
      <div class="btn">UDP</div>
    </div>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.tabs-row {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.socket-row {
  width: 100%;
  display: grid;
  grid-template-columns: 160px 75px;
  gap: 15px;
}

.round-button {
  width: 25px;
  height: 25px;
  background: var(--dark);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-put;

  &:hover {
    scale: 1.05;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  img {
    width: 15px;
  }
}

.apply-button {
  width: 20px;
  height: 20px;
  background: var(--dark);
  position: relative;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-put;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);

  .apply_btn_inner {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    outline: 1px solid var(--primary);
    border-radius: 2px;
    border: 0;
    background: var(--dark);
  }

  :nth-child(1) {
    transform: rotate(45deg);
  }
  :nth-child(3) {
    outline: 0;
    transform: rotate(45deg);
  }
  :nth-child(4) {
    outline: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      transform: rotate(0deg);
      width: 10px;
      transition: all 0.3s ease-in-out;
    }
  }

  &:hover {
    scale: 1.05;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;

    apply_btn_inner {
      img {
        scale: 1.05;
      }
    }
  }
}

.new-server-settings {
  display: flex;
  flex-direction: column;
  gap: 14px;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

input {
  background: var(--dark);
  border: 0;
  height: 25px;
  border-radius: 10px;
  outline: none;
  color: var(--white);
  padding: 2px 10px;
  box-sizing: border-box;
  text-align: center;
}
</style>
