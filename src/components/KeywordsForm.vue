<script setup lang="ts">
import { ref, onMounted } from "vue"

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
  const value = keyword.value.trim().toLowerCase()
  if (value.length < 3 || keywords.value?.includes(value)) return
  keywords.value += `, ${value}`
  keyword.value = ''
}

function removeKeyword(keyword: string) {
  keywords.value = keywords.value.replace(`, ${keyword}`, '')
}

function clear() {
  keywords.value = ''
}

function undo() {
  keywords.value = props.keywords || ''
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
      v-model="keyword"
      placeholder="Type a keyword and press enter to add it.">
      <button
      type="submit"
      class="button button_rounded button_icon button_bg-add"
      :disabled="keyword.length < 3"
      >Add</button>
    </fieldset>
    <ul class="keyword-container">
      <li
      v-for="keyword in keywords.split(',').map(k => k.trim()).filter(k => k)"
      :key="keyword"
      class="keyword"
      >
        <span>{{ keyword }}</span>
        <button
        @click="removeKeyword(keyword)"
        type="button"
        class="button button_rounded button_icon button_bg-x button_sm"
        v-if="!props.formLocked"
        >Remove keyword</button>
      </li>
    </ul>
    <div class="actions">
      <button
      type="button"
      class="button button_rounded button_icon button_bg-cancel"
      title="Dismiss"
      @click="emit('dismiss')">
      Dismiss</button>
      <button
      type="button"
      title="Restore to original"
      class="button button_rounded button_icon button_bg-undo"
      :disabled="(keywords === props.keywords) || !props.keywords || props.formLocked"
      @click="setOriginalValues">
      Restore</button>
      <button
      :disabled="props.formLocked || !keywords"
      type="button"
      class="button button_rounded button_icon button_bg-eraser"
      title="Clear fields"
      @click="clear">
      Clear</button>
      <button
      type="button"
      class="button button_rounded button_icon button_bg-check"
      :disabled="formLocked || (!keywords && !props.keywords) || keywords === props.keywords"
      @click="emit('setKeywords', keywords)">
      Confirm</button>
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