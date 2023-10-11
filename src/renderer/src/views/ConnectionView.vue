<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const connected = ref(false)
const errorMessage = ref('')

const route = useRoute()
console.log(route.query)

const name = ref(route.query.name)
const local_port = ref('1080')

function connect() {
  if (connected.value === true) {
    window.api.disconnect()
  } else {
    const config = window.api.getServer(name.value)
    config.local_port = local_port.value
    config.timeout = 10

    const result = window.api.connect(JSON.stringify(config))

    if (result instanceof Error) {
      errorMessage.value = result.message
      return
    }
    errorMessage.value = ''
  }
  connected.value = !connected.value
}
</script>

<template>
  <div class="connection" :class="{ active: connected }">
    <nav>
      <router-link :class="{ hidden: connected }" class="round-button" to="/"
        ><img src="../assets/icons/back.svg"
      /></router-link>
      <div class="title" :class="{ active: connected }">{{ name }}</div>
    </nav>
    <section class="connection-section">
      <div class="start-btn" :class="{ active: connected }" @click="connect()">
        <svg
          width="70"
          height="77"
          viewBox="0 0 70 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48.2115 13.96C48.6154 13.1285 49.6195 12.7779 50.4285 13.2253C56.136 16.3811 60.741 21.2334 63.5919 27.1296C66.6862 33.5291 67.5334 40.7847 65.9968 47.725C64.4602 54.6653 60.6294 60.8852 55.1229 65.3805C49.6164 69.8758 42.7556 72.3841 35.6482 72.5004C28.5408 72.6168 21.6016 70.3345 15.9509 66.0219C10.3002 61.7093 6.26782 55.6181 4.50481 48.7319C2.74179 41.8456 3.35103 34.5661 6.23415 28.0687C8.89047 22.0824 13.3341 17.0819 18.9353 13.7409C19.7292 13.2673 20.7443 13.5848 21.1752 14.4027C21.6061 15.2206 21.2893 16.2287 20.4983 16.7072C15.5619 19.6938 11.6451 24.1284 9.29411 29.4265C6.71629 35.2359 6.17157 41.7445 7.74789 47.9016C9.32421 54.0586 12.9296 59.5047 17.9819 63.3607C23.0342 67.2166 29.2386 69.2573 35.5934 69.1532C41.9482 69.0492 48.0825 66.8065 53.0058 62.7872C57.9292 58.7679 61.3543 53.2067 62.7282 47.0013C64.1022 40.796 63.3446 34.3087 60.578 28.5868C58.0549 23.3685 53.9949 19.0646 48.9634 16.2411C48.1572 15.7887 47.8076 14.7915 48.2115 13.96Z"
            fill="url(#paint0_linear_1204_87)"
          />
          <path
            d="M45.015 21.0939C45.4208 20.2584 46.4307 19.905 47.2357 20.3685C51.3869 22.7589 54.7371 26.3488 56.8336 30.6846C59.1748 35.5266 59.8158 41.0164 58.6532 46.2675C57.4905 51.5187 54.5921 56.2248 50.4258 59.626C46.2595 63.0272 41.0685 64.925 35.6909 65.0131C30.3133 65.1011 25.0629 63.3743 20.7875 60.1113C16.5121 56.8483 13.4611 52.2396 12.1272 47.0293C10.7932 41.8191 11.2542 36.3113 13.4356 31.3952C15.389 26.993 18.6199 23.2954 22.6907 20.7704C23.48 20.2808 24.5009 20.6009 24.9339 21.4227C25.3669 22.2445 25.0472 23.2559 24.2635 23.7546C20.8595 25.9207 18.1568 29.0488 16.5102 32.7595C14.6356 36.9842 14.2394 41.7175 15.3858 46.1951C16.5321 50.6726 19.154 54.6332 22.8282 57.4374C26.5024 60.2415 31.0144 61.7255 35.6358 61.6499C40.2572 61.5742 44.7182 59.9432 48.2986 57.0203C51.879 54.0974 54.3699 50.0531 55.369 45.5404C56.3682 41.0277 55.8173 36.3099 53.8053 32.1488C52.0382 28.4941 49.2345 25.4561 45.7614 23.4026C44.9618 22.9299 44.6092 21.9294 45.015 21.0939Z"
            fill="url(#paint1_linear_1204_87)"
          />
          <path
            d="M30 5.57143C30 2.49441 32.4624 0 35.5 0C38.5376 0 41 2.49441 41 5.57143V33.4286C41 36.5056 38.5376 39 35.5 39C32.4624 39 30 36.5056 30 33.4286V5.57143Z"
            fill="url(#paint2_linear_1204_87)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1204_87"
              x1="3.73891"
              y1="37.1522"
              x2="66.5224"
              y2="44.63"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#77C5FF" />
              <stop class="gradient" offset="1" stop-color="#23F938" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1204_87"
              x1="11.5477"
              y1="38.2679"
              x2="59.0509"
              y2="43.9258"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#77C5FF" />
              <stop class="gradient" offset="1" stop-color="#23F938" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1204_87"
              x1="35.5"
              y1="0"
              x2="35.5"
              y2="39"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#77C5FF" />
              <stop class="gradient" offset="1" stop-color="#23F938" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
    <footer>
      <div class="divider" :class="{ hidden: connected }"></div>
      <div class="row">
        <span v-if="!connected">Local listenning port</span>
        <input v-else type="text" disabled placeholder="localhost" value="localhost" />
        <input v-model="local_port" :disabled="connected" type="text" placeholder="Port" />
      </div>
      <div class="divider" :class="{ hidden: !connected }"></div>
      <div class="error" :class="{ hidden: errorMessage === '' }">
        {{ errorMessage }}
      </div>
    </footer>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.error {
  display: flex;
  justify-content: center;
}

.connection {
  display: grid;
  gap: 10px;
  grid-template-rows: 30px 230px 80px; //total 340
  transition: all linear 0.2s;

  &.active {
    grid-template-rows: 30px 100px 80px;
  }
}

.connection-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .start-btn {
    width: 100px;
    height: 100px;
    transition: all ease 0.5s;
    background: transparent;
    cursor: pointer;
    border-radius: 100px;
    display: flex;
    align-items: center;
    margin-top: 10px;

    svg {
      transition: all ease 0.5s;
      width: 100px;
      height: 100px;
    }

    .gradient {
      transition: all ease 0.5s;
      stop-color: var(--primary);
    }

    &.active {
      svg {
        fill: transparent;
        filter: drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.4));
      }
      .gradient {
        stop-color: var(--success);
      }
    }
  }
}

footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  transition: all ease 0.5s;

  .title {
    display: flex;
    justify-content: center;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: var(--dark);
    border-radius: 10px;
    height: 25px;
    align-items: center;

    &.active {
      background: var(--primary);
    }
  }
}

.hidden {
  transition: 0.2s linear;
  opacity: 0;
  height: 0;
  cursor: default;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 160px 75px;
  gap: 15px;
  align-items: center;
}
</style>
