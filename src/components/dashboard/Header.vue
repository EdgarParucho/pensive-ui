<script lang="ts" setup>
import { inject } from 'vue'
import Button from '../layout/Button.vue'
const props = defineProps(['showingDialog', 'dialogs'])
const showDialog = inject('showDialog') as (dialog: keyof typeof props.dialogs) => void
</script>

<template>
  <header class="header" :class="{ 'header_blur': showingDialog }">
    <Button
    text="Search"
    :modifiers="['button_w-48', 'button_bl-rounded', 'button_bg-search']"
    @click="showDialog('SearchForm')" />
    <Button
    text="Add"
    :modifiers="['button_w-48', 'button_br-rounded', 'button_bg-add']"
    type="button"
    @click="showDialog('NoteForm')" />
  </header>
</template>

<style scoped>

.header {
  height: 36px;
  width: 144px;
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