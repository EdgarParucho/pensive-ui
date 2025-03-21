<script setup lang='ts'>
const emit = defineEmits(['show-query-form', 'show-note-form'])
</script>

<template>
  <aside class="menu">
    <button
      class="button button_bl-rounded button_icon button_bg-search"
      type="button"
      @click="() => emit('show-query-form')"
      >Search</button>
    <button
    class="button button_br-rounded button_icon button_bg-add"
    type="button"
    @click="() => emit('show-note-form')"
    >Add</button>
  </aside>
</template>

<style scoped>
.menu {
  height: 24px;
  width: 140px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--dark);
  border-radius: 20px;
}
</style>