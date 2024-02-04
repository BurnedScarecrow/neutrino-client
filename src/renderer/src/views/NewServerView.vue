<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tab = ref('config')
const name = ref('')

const config = ref({
  server: '',
  server_port: '',
  method: '',
  password: ''
})

const authKey = ref('')
const hostname = ref('')

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    event.preventDefault()
    save()
  }
})

const errorServerExists = ref(false)
const errorEmptyTitle = ref(false)
const errorEmptyKey = ref(false)
const errorIP = ref(false)
const errorInvalidPort = ref(false)
const errorNoMethod = ref(false)
const errorNoPassword = ref(false)
const errorGettingConfig = ref(false)

function isValidIPv4Address(ipAddress) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  return ipv4Regex.test(ipAddress)
}

function checkFields2() {
  name.value = name.value.trim()
  authKey.value = authKey.value.trim()
  if (name.value === '') {
    errorEmptyTitle.value = true
    return false
  } else {
    errorEmptyTitle.value = false
  }
  if (authKey.value === '') {
    errorEmptyKey.value = true
    return false
  } else {
    errorEmptyKey.value = false
  }
  return true
}

function checkFields() {
  name.value = name.value.trim()
  config.value.server = config.value.server.trim()
  config.value.server_port = config.value.server_port.trim()
  config.value.password = config.value.password.trim()
  config.value.method = config.value.method.trim()

  const portNumber = Number.parseInt(config.value.server_port)

  if (name.value === '') {
    errorEmptyTitle.value = true
    return false
  } else {
    errorEmptyTitle.value = false
  }

  const response = window.api.getServer(name.value)

  if (response) {
    errorServerExists.value = true
    return false
  } else {
    errorServerExists.value = false
  }

  if (config.value.server === '' || !isValidIPv4Address(config.value.server)) {
    errorIP.value = true
    return false
  } else {
    errorIP.value = false
  }

  if (config.value.server_port === '' || portNumber < 0 || portNumber > 65535) {
    errorInvalidPort.value = true
    return false
  } else {
    errorInvalidPort.value = false
  }

  if (config.value.method === '') {
    errorNoMethod.value = true
    return false
  } else {
    errorNoMethod.value = false
  }

  if (config.value.password === '') {
    errorNoPassword.value = true
    return false
  } else {
    errorNoPassword.value = false
  }

  return true
}

function save() {
  if (tab.value === 'config') {
    if (!checkFields()) return

    const data = {
      name: name.value,
      config: config.value
    }
    console.log('[vue]-> add server')
    const result = window.api.addServer(JSON.stringify(data))
    console.log(result)

    if (result) router.push('/')
  } else if (tab.value === 'auth-key') {
    if (!checkFields2()) return

    const key = authKey.value.trim()
    console.log(key)

    const data = {
      name: name.value,
      key,
      hostname: hostname.value
    }

    console.log('[vue]-> add server key')
    const result = window.api.addServerKey(JSON.stringify(data))
    console.log(result)
    if (result) router.push('/')
    else if (result === false) {
      errorGettingConfig.value = true
    }
  }
}
</script>

<template>
  <div class="new-server-settings">
    <nav>
      <router-link class="round-button" to="/"><img src="../assets/icons/back.svg" /></router-link>
      New proxy settings
      <div class="apply-button" @click="save">
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
      <div class="btn" :class="{ active: tab == 'config' }" @click="tab = 'config'">Raw config</div>
      <div class="btn" :class="{ active: tab == 'auth-key' }" @click="tab = 'auth-key'">
        Auth key
      </div>
    </div>

    <div v-show="tab == 'config'" class="tab-content raw-config-tab">
      <div class="socket-row">
        <input v-model="config.server" type="text" placeholder="IP address" />
        <input v-model="config.server_port" type="text" placeholder="Port" />
      </div>

      <select v-model="config.method" placeholder="Encription">
        <option value="" disabled selected>Encryption method</option>
        <option value="rc4-md5">rc4-md5</option>
        <option value="aes-128-gcm">aes-128-gcm</option>
        <option value="aes-192-gcm">aes-192-gcm</option>
        <option value="aes-256-gcm">aes-256-gcm</option>
        <option value="aes-256-cfb">aes-256-cfb</option>
        <option value="chacha20-ietf-poly1305">chacha20-ietf-poly1305</option>
      </select>

      <input v-model="config.password" type="password" placeholder="Password" />
    </div>

    <div v-show="tab == 'auth-key'" class="tab-content auth-key-tab">
      <textarea v-model="authKey" placeholder="Paste access key" />
      <input v-model="hostname" placeholder="Hostname (optional)" />
      <p class="notion">
        Enter "localhost" or another alias as a hostname if you have local-running proxy-server
        (Container, Cluster, VM, etc.)
      </p>
    </div>

    <div class="err-row">
      <div v-if="errorEmptyTitle" class="error">Title is empty</div>
      <div v-if="errorIP" class="error">IP address is not valid</div>
      <div v-if="errorServerExists" class="error">Server with this title exists</div>
      <div v-if="errorInvalidPort" class="error">Port is not valid</div>
      <div v-if="errorNoMethod" class="error">Choose encryption method</div>
      <div v-if="errorNoPassword" class="error">Enter password</div>
      <div v-if="errorEmptyKey" class="error">Enter auth-key</div>
      <div v-if="errorGettingConfig" class="error">
        Failed to get config.<br />Check hostname and auth key.
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.notion {
  color: #dd6;
  font-size: 0.9em;
}

.tabs-row {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.err-row {
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  gap: 12px;
  position: fixed;
  bottom: 20px;
  left: 0;
  box-sizing: border-box;
  padding: 0 10px;
}

.error {
  background-color: var(--fail);
  padding: 5px 10px;
  border-radius: 10px;
  min-height: 23px;
  text-align: center;
  width: 90%;
  box-sizing: border-box;
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
  width: 25px;
  height: 25px;
  background: var(--dark);
  position: relative;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-put;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  border: 0;
  outline: 0;

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
</style>
