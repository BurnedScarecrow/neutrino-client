<script setup lang="ts">
import { useRouter } from 'vue-router'
import ServerButton from './ServerButton.vue'

const router = useRouter()

const emit = defineEmits(['show-modal'])
const props = defineProps(['title', 'config'])

function showModal() {
  console.log('Delete', props.title)
  emit('show-modal', props.title)
}

function deleteServer() {
  console.log('Delete', props.title)
  showModal()
}

function choose() {
  console.log(props.config?.server)
  router.push({ name: `connect`, query: { name: props.title } })
}
</script>

<template>
  <div class="server-list-item">
    <ServerButton :title="title" @click="choose()"></ServerButton>
    <div class="delete-button">
      <a @click="deleteServer">
        <img src="../assets/icons/delete-icon.svg" />
      </a>
    </div>
  </div>
</template>

<style lang="less">
.server-list-item {
  display: grid;
  grid-template-columns: auto 40px;
  box-sizing: border-box;
  align-items: center;
  height: 40px;
  gap: 10px;

  .delete-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      &:hover {
        img {
          scale: 1.05;
        }
      }

      img {
        width: 20px;
      }
    }
  }
}
</style>
