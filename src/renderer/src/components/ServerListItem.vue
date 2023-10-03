<script setup lang="ts">
import ServerButton from './ServerButton.vue'

const emit = defineEmits(['showModal'])
const props = defineProps({ title: String })

function showModal() {
  console.log('Delete', props.title)
  emit('showModal', props.title)
}

function deleteServer() {
  console.log('Delete', props.title)
  showModal()
}
</script>

<template>
  <div class="server-list-item">
    <ServerButton :title="title"></ServerButton>
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
