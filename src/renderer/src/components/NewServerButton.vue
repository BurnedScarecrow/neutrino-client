<script setup lang="ts"></script>

<template>
  <div class="dark-button">
    <span>Add new server</span>
    <img src="../assets/icons/add-square.svg" />
  </div>
</template>

<style lang="less">
.dark-button {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  align-items: center;
  border-radius: 10px;
  height: 40px;
  color: var(--white);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  transition: all ease 0.1s;

  img {
    width: 25px;
  }

  &:hover {
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, 0.7);
    scale: 1.01;
  }
}
</style>
