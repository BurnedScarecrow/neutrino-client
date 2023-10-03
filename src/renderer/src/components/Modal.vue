<script setup lang="ts">
const emit = defineEmits(['close', 'approve'])
const props = defineProps({ name: String })

function close() {
  emit('close')
}
function approve() {
  emit('approve', { name: props.name })
}
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header id="modalTitle" class="modal-header">
          <slot name="header"> Delete "{{ props.name }}"? </slot>
        </header>

        <footer class="modal-footer">
          <button type="button" class="btn-red" aria-label="Close modal" @click="approve">
            Delete
          </button>
          <button type="button" class="btn-green" aria-label="Close modal" @click="close">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 250px;
  background: var(--bg);
  overflow-x: auto;
  backdrop-filter: t;
  display: flex;
  flex-direction: column;
  border-radius: 7px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.4);
}

.modal-header,
.modal-footer {
  padding: 20px;
  display: flex;
}

.modal-header {
  position: relative;
  color: var(--white);
  padding-bottom: 0px;
  font-size: 12px;
  justify-content: space-around;
}

.modal-footer {
  flex-direction: row;
  justify-content: center;
  gap: 12px;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: var(--secondary);
  background: transparent;
}

.btn-green,
.btn-red {
  width: 75px;
  height: 25px;
  box-sizing: border-box;
  padding: 3px 12px;
  border-radius: 7px;
  color: var(--white);
  transition: all 0.2s ease;
}

.btn-green {
  background: var(--dark);
  border: 1px solid var(--primary);

  &:hover {
    cursor: pointer;
    background: var(--bg);
  }
}

.btn-red {
  background: var(--dark);
  border: 1px solid var(--fail);

  &:hover {
    cursor: pointer;
    background: var(--fail);
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>
