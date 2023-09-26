<script setup lang="ts">
defineProps({ title: String })
</script>

<template>
  <div class="primary-button">
    <span>{{ title }}</span>
  </div>
</template>

<style lang="less">
.primary-button {
  display: flex;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  align-items: center;
  border-radius: 10px;
  height: 40px;
  color: var(--white);
  background: var(--dark);
  transition: all ease 0.1s;

  &:hover {
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, 0.7);
    scale: 1.01;
  }
}
</style>
