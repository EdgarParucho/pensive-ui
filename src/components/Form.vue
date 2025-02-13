<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'
import Note from '../models/Note.ts'

onMounted(() => document.getElementById('title')?.focus())

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['close-form'])

const note = ref(new Note({}))
const loading = ref(false)
const keywordsString = ref('')

const keywords = computed(() => new Set(keywordsString.value
    .toLowerCase()
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword != ''))
)

async function handleSubmit() {
  note.value.keywords = [...keywords.value].join(', ');
  try {
    const token = await getAccessTokenSilently()
    await note.value.create(token)
    note.value.clear()
    alertOnSuccess()
    emit('close-form')
  } catch (error) {
    alertOnFailure(error as Error)
  }
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">

    <fieldset class="form__fieldset">

      <input
      id="title"
      class="form__input form__input_text-lg"
      type="text"
      placeholder="New Record"
      required
      v-model.trim="note.title"
      autofocus
      autocomplete="off">

      <textarea
      id="body"
      class="form__textarea"
      placeholder="Type the content of your record here."
      required
      v-model.trim="note.body"
      autocomplete="off"></textarea>

      <label class="form__label" for="type">Type</label>
      <input
      id="type"
      class="form__input form__input_border-bottom form__input_w-25"
      type="text"
      v-model.trim="note.type">

      <label class="form__label" for="keywords">Keywords (comma separated)</label>
      <input
      id="keywords"
      class="form__input form__input_border-bottom form__input_w-50"
      type="text"
      placeholder="programming, self-development, health"
      v-model.trim="keywordsString"
      autocomplete="off">

      <div class="keyword-container">
        <span v-for="keyword, i in keywords" :key="i" class="keyword">{{ keyword }}</span>
      </div>

      <label class="form__label" for="reference">Reference</label>
      <input
      id="reference"
      class="form__input form__input_border-bottom"
      type="text"
      placeholder="(Optional)"
      v-model.trim="note.reference"
      autocomplete="off">

    </fieldset>

    <div class="form__actions">
      <button
      class="button button_secondary"
      type="button"
      @click="emit('close-form')"
      >Discard</button>
      <button
      class="button"
      type="submit"
      >{{ loading ? 'Saving' : 'Save' }}</button>
    </div>
  </form>
</template>

<style scoped>
.keyword-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.keyword {
  padding: 0 6px;
  border-radius: 2px;
  font-size: .7rem;
  color: var(--light);
  background-color: var(--dark);
}
</style>