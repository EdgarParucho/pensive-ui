<script setup lang="ts">
import { ref, onMounted } from "vue"
import Button from '../layout/Button.vue'

const props = defineProps(['keywords', 'formLocked'])
const emit = defineEmits(['dismiss', 'setKeywords'])

onMounted(() => {
  if (props.keywords) setOriginalValues()
  document.getElementById('keyword')?.focus()
})

const keyword = ref('')
const keywords = ref('')

function setOriginalValues() {
  keywords.value = props.keywords
}

function addKeyword() {
  const value = keyword.value.toLowerCase()
  if (value.length < 3 || keywords.value?.includes(value)) return
  keywords.value += keywords.value ? `, ${value}` : value
  keyword.value = ''
}

function removeKeyword(keyword: string) {
  keywords.value = keywords.value.replace(`, ${keyword}`, '')
}

function clear() {
  keywords.value = ''
}

</script>

<template>
  <form class="form" @submit.prevent="addKeyword">
    <fieldset class="form__fieldset" v-if="!props.formLocked">
      <label for="keyword"></label>
      <input
      id="keyword"
      type="text"
      class="form__input"
      v-model.trim="keyword"
      placeholder="Type a keyword and press enter to add it.">
      <Button
      type="submit"
      :modifiers="['button_bg-add']"
      :disabled="keyword.length < 3"
      text=">Add" />
    </fieldset>
    <ul class="keyword-container">
      <li
      v-for="keyword in keywords.split(',').map(k => k.trim()).filter(k => k)"
      :key="keyword"
      class="keyword"
      >
        <span>{{ keyword }}</span>
        <Button
        text="Remove keyword"
        :modifiers="['button_bg-x', 'button_sm']"
        @click="removeKeyword(keyword)"
        v-if="!props.formLocked" />
      </li>
    </ul>
    <div class="actions">
      <Button
      text="Dismiss"
      :modifiers="['button_bg-cancel']"
      @click="emit('dismiss')" />
      <Button
      text="Restore"
      :modifiers="['button_bg-undo']"
      :disabled="(keywords === props.keywords) || !props.keywords || props.formLocked"
      @click="setOriginalValues" />
      <Button
      text="Clear"
      :disabled="props.formLocked || !keywords"
      :modifiers="['button_bg-eraser']"
      @click="clear" />
      <Button
      text="Confirm"
      :modifiers="['button_bg-check']"
      :disabled="formLocked || (!keywords && !props.keywords) || keywords === props.keywords"
      @click="emit('setKeywords', keywords)" />
    </div>
  </form>
</template>

<style scoped>

.form {
  max-height: 140px;
  position: absolute;
  top: calc(50% - 200px);
  display: grid;
  place-items: center;
}

.form__fieldset {
  width: 100%;
  height: 24px;
  margin-top: 12px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.form__input {
  width: 100%;
  max-width: 272px;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
}

.form__input::placeholder, .form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
}

.form__input:focus {
  border-bottom: 1px solid  cyan;
}

.actions {
  display: flex;
  gap: 64px;
}

.keyword-container {
  display: flex;
  justify-self: start;
  flex-wrap: wrap;
  gap: 4px;
  height: 24px;
}

.keyword {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  font-size: .7rem;
  background-color: var(--darkest);
  padding: 4px 8px;
  gap: 6px;
}

.button_sm {
  width: 12px;
  height: 12px;
}

</style>