<script lang="ts" setup>
import { inject } from 'vue';
const props = defineProps(['showingDialog', 'dialogs'])
const showDialog = inject('showDialog') as (dialog: keyof typeof props.dialogs) => void
</script>

<template>
  <header class="header" :class="{ 'header_blur': showingDialog }">
    <button
    class="button button_bl-rounded button_icon button_bg-search"
    type="button"
    @click="showDialog('SearchForm')"
    >Search</button>
    <button
    class="button button_br-rounded button_icon button_bg-add"
    type="button"
    @click="showDialog('NoteForm')"
    >Add</button>
  </header>
</template>

<style scoped>

.header {
  height: 24px;
  width: 140px;
  margin: 0 auto;
  border: 1px solid var(--dark);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  transition: filter .5s;
}

.header_blur {
  filter: blur(4px);
}

</style>