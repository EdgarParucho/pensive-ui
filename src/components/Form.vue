<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'
import Note from '../models/Note.ts'

onMounted(() => document.getElementById('title')?.focus())

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['close-form'])

const note = ref(new Note({}))
const loading = ref(false)

async function handleSubmit() {
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
    <button
    class="button button_secondary button_self-end"
    type="button"
    @click="emit('close-form')"
    >Close</button>
    <fieldset class="form__fieldset">

      <input
      id="title"
      class="form__input form__input_text-lg"
      type="text"
      placeholder="New Record"
      required
      v-model.trim="note.title"
      autofocus>

      <textarea
      id="body"
      class="form__textarea"
      placeholder="Type the content of your record here."
      required
      v-model.trim="note.body"></textarea>

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
      v-model.trim="note.keywords">

      <label class="form__label" for="reference">Reference</label>
      <input
      id="reference"
      class="form__input form__input_border-bottom"
      type="text"
      placeholder="(Optional)"
      v-model.trim="note.reference">

    </fieldset>
    <button
    class="button button_ml-auto"
    type="submit"
    >{{ loading ? 'Saving' : 'Save' }}</button>
  </form>
</template>
