<script setup lang="ts">
import ServerButton from './ServerButton.vue';
defineProps({ title: String })
</script>

<template>
  <div class="server-list-item">
    <ServerButton :title="title"></ServerButton>
    <div class="delete-button">
      <a href="">
        <img src="../assets/icons/delete-icon.svg" >
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
