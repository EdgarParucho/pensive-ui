<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from './Button.vue'

const props = defineProps(['reference', 'formLocked'])
const emit = defineEmits(['dismiss', 'setReference'])

onMounted(() => {
  if (props.reference) setOriginalValues()
  document.getElementById('reference-type')?.focus()
})

const form = ref({
  typeOfReference: '',
  firstName: '',
  lastName: '',
  title: '',
  website: '',
  year: new Date().getFullYear(),
  url: '',
  publisher: '',
  institution: '',
  typeOfClass: '',
  platform: '',
  custom: '',
})

const authors = ref<{ firstName: string; lastName: string, fullName: string }[]>([])

const specificFields = {
  book: ['typeOfReference', 'title', 'publisher', 'year'],
  website: ['typeOfReference', 'title', 'website', 'year', 'url'],
  media: ['typeOfReference', 'title', 'platform', 'year', 'url'],
  'online-lesson': ['typeOfReference', 'title', 'typeOfClass', 'institution', 'year', 'url'],
  custom: ['typeOfReference', 'custom'],
}

const authorString = computed(() => {
  switch (authors.value.length) {
    case 0: return getAuthorNames(form.value)
    case 1: return getAuthorNames(authors.value[0])
    case 2: return getAuthorNames(authors.value[0]) + `, and ${getAuthorNames(authors.value[1], false)}`
    default: return `${getAuthorNames(authors.value[0])}, et al`
  }
})

const entriesToString = computed(() => {

  const { typeOfReference } = form.value

  if (!typeOfReference) return ''
  if (typeOfReference == 'custom') return JSON.stringify({
    typeOfReference,
    custom: form.value.custom
  })

  const common = {
    authors: authors.value.length ? authors.value : [{
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      fullName: [form.value.firstName, form.value.lastName].join(' ').trim() || 'Unknown author'
    }],
  }

  const entries = specificFields[typeOfReference as keyof typeof specificFields]
    .reduce((acc, field) => {
      acc[field] = String(form.value[field as keyof typeof form.value])
      return acc
    }, common as Record<string, string | object>)

  return JSON.stringify(entries)
})

function getAuthorNames({ firstName, lastName }: { firstName: string, lastName: string }, invert = true) {
  if (firstName && lastName) return (invert) ? `${lastName}, ${firstName}` : `${firstName} ${lastName}`
  else return firstName || lastName || 'Unknown author.'
}

function typeFormatted(type: string) {
  return type[0].toUpperCase() + type.slice(1).replace('-', ' ')
}

function setOriginalValues() {
  const { authors: authorsValue, ...formValues } = JSON.parse(props.reference)
  form.value = {
    ...form.value,
    ...formValues
  }
  if (authorsValue) authors.value = authorsValue
}

function addAuthor() {
  authors.value.push({
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    fullName: [form.value.firstName, form.value.lastName].join(' ').trim() || 'Unknown author'
  })
  form.value.firstName = ''
  form.value.lastName = ''
  document.getElementById('first-name')?.focus()
}

function removeAuthor(i: number) {
  authors.value.splice(i, 1)
}

function clear() {
  authors.value =  []
  form.value = {
    typeOfReference: '',
    firstName: '',
    lastName: '',
    title: '',
    website: '',
    year: new Date().getFullYear(),
    url: '',
    publisher: '',
    institution: '',
    typeOfClass: '',
    platform: '',
    custom: '',
  }
}

function onSubmit() {
  emit('setReference', entriesToString.value)
}

function fieldIsRequired(field: string) {
  if (!form.value.typeOfReference) return false
  return specificFields[form.value.typeOfReference as keyof typeof specificFields].includes(field)
}

</script>

<template>
  <form class="reference_form" @submit.prevent="onSubmit">
    <fieldset class="form__fieldset">
      <label for="reference-type" class="form__label form__label_w-sm">
        Reference type
        <select
        id="reference-type"
        class="form__select"
        v-model="form.typeOfReference"
        :disabled="formLocked">
          <option class="form__option" value="">No reference</option>
          <option
          v-for="type in Object.keys(specificFields)"
          :key="type"
          :value="type"
          class="form__option"
          >{{ typeFormatted(type) }}</option>
        </select>
      </label>
      <Transition>
        <label
        v-if="fieldIsRequired('custom')"
        for="custom"
        class="form__label form__label_w-lg form__label_ml-16"
        >Custom
          <input
          id="custom"
          type="text"
          class="form__input form__input_w-lg"
          v-model="form.custom"
          placeholder="Custom"
          :disabled="formLocked">
        </label>
      </Transition>
      <Transition>
        <div v-if="form.typeOfReference && form.typeOfReference != 'custom'">
          <div class="form__row">
            <label for="first-name" class="form__label">
              First name of author
              <input
              id="first-name"
              type="text"
              class="form__input"
              v-model.trim="form.firstName"
              placeholder="First name">
            </label>
            <label for="last-name" class="form__label">
              Last name of author
              <input
              id="last-name"
              type="text"
              class="form__input"
              v-model.trim="form.lastName"
              placeholder="Last name">
            </label>
            <Button
            text="Add author"
            :modifiers="['button_bg-add']"
            :disabled="(form.firstName + form.lastName).length < 3"
            @click="addAuthor" />
          </div>
          <ul class="author-container">
            <li v-for="author, i in authors" :key="i" class="author">
              <span>{{ author.fullName }}</span>
              <Button
              text="Remove author"
              v-if="!props.formLocked"
              :modifiers="['button_bg-x', 'button_sm']"
              @click="removeAuthor(i)" />
            </li>
          </ul>
        </div>
      </Transition>
      <Transition>
        <div class="form__row" v-if="fieldIsRequired('title')">
          <label for="title" class="form__label">
            Title
            <input
            id="title"
            type="text"
            class="form__input"
            v-model.trim="form.title"
            placeholder="Title"
            required>
          </label>
          <label v-if="fieldIsRequired('publisher')" for="publisher" class="form__label">
            Publisher
            <input
            id="publisher"
            type="text"
            class="form__input"
            v-model.trim="form.publisher"
            placeholder="Publisher"
            required>
          </label>
          <label v-if="fieldIsRequired('platform')" for="platform" class="form__label">
            Platform
            <input
            id="platform"
            type="text"
            class="form__input"
            v-model.trim="form.platform"
            placeholder="Platform"
            required>
          </label>
          <label v-if="fieldIsRequired('website')" for="website" class="form__label">
            Title of the page
            <input
            id="website"
            type="text"
            class="form__input"
            v-model.trim="form.website"
            placeholder="Title of the page"
            required>
          </label>
        </div>
      </Transition>
      <Transition>
        <div class="form__row" v-if="form.typeOfReference && form.typeOfReference != 'custom'">
          <label for="year" class="form__label">
            Year of publication
            <input
            id="year"
            type="number"
            class="form__input"
            v-model="form.year"
            placeholder="YYYY"
            min="0"
            :max="new Date().getFullYear()">
          </label>
          <label v-if="fieldIsRequired('url')" for="url" class="form__label">
            URL
            <input
            id="url"
            type="url"
            class="form__input"
            v-model.trim="form.url"
            placeholder="URL"
            required>
          </label>
        </div>
      </Transition>
      <Transition>
        <div v-if="form.typeOfReference === 'online-lesson'" class="form__row">
          <label for="institution" class="form__label">
            Institution
            <input
            id="institution"
            type="text"
            class="form__input"
            v-model.trim="form.institution"
            placeholder="Institution"
            required>
          </label>
          <label for="type-of-class" class="form__label">
            Type of class
            <input
            id="type-of-class"
            type="text"
            class="form__input"
            v-model.trim="form.typeOfClass"
            placeholder="Type of class"
            required>
          </label>
        </div>
      </Transition>
    </fieldset>
    <div class="reference-container" v-if="form.typeOfReference">
      <p class="reference-text" v-if="form.typeOfReference === 'custom'">{{ form.custom }}</p>
      <p class="reference-text" v-else>
        <span>{{ authorString }}. </span>
        <i class="text-italic" v-if="form.typeOfReference === 'book'">{{ form.title }}. </i>
        <span v-else>"{{ form.title }}." </span>
        <span v-if="form.typeOfReference === 'book'">{{ form.publisher }}, {{ form.year }}.</span>
        <i class="text-italic" v-if="form.typeOfReference === 'website'">{{ form.website }}</i>
        <i class="text-italic" v-if="form.typeOfReference === 'media'">{{ form.platform }}</i>
        <span v-if="form.typeOfReference === 'online-lesson'">{{ form.typeOfClass }}, {{ form.institution }}</span>
        <span v-if="form.typeOfReference !== 'book'">, {{ form.year }}, {{ form.url }}.</span>
       </p>
    </div>
    <div class="actions">
      <Button
      text="Dismiss"
      :modifiers="['button_bg-cancel']"
      @click="emit('dismiss')" />
      <Button
      text="Restore"
      :modifiers="['button_bg-undo']"
      :disabled="(entriesToString === props.reference) || !props.reference || props.formLocked"
      @click="setOriginalValues" />
      <Button
      :disabled="props.formLocked || !form.typeOfReference"
      text="Clear"
      :modifiers="['button_bg-eraser']"
      @click="clear" />
      <Button
      text="Confirm"
      @click="onSubmit"
      :modifiers="['button_bg-check']"
      :disabled="formLocked || (!entriesToString && !props.reference) || entriesToString === props.reference" />
    </div>
  </form>
</template>

<style scoped>

.reference_form {
  height: 100%;
  max-height: 440px;
  width: 100%;
  max-width: 540px;
  padding: 12px;
  align-self: center;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  position: relative;
}

.form__fieldset {
  border: none;
}

.form__row {
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 24px;
}

.form__label {
  width: 144px;
  width: 42%;
  font-weight: bold;
  font-size: .7rem;
  display: inline-grid;
  gap: 6px;
  color: var(--light);
}

.form__label_ml-16 {
  margin-left: 16px;
}

.form__label_w-sm {
  width: 35%;
}

.form__label_w-lg {
  width: 60%;
}

.form__select {
  width: 100%;
  padding: 2px;
  border-radius: 2px;
  border-color: var(--neutral);
  background-color: transparent;
  color: var(--light);
  outline: none;
}

.form__option {
  background-color: var(--dark);
  color: var(--light);
}

.form__input {
  margin-top: 7px;
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--neutral);
  display: inline-block;
  outline: none;
  background-color: transparent;
  color: var(--light);
}

.form__input_w-lg {
  width: 100%;
}

.form__input::placeholder, .form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
}

.form__input:focus {
  border-bottom: 1px solid  cyan;
}

.actions {
  position: absolute;
  width: 100%;
  bottom: 12px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 64px;
}

.author-container {
  display: flex;
  justify-self: start;
  flex-wrap: wrap;
  gap: 4px;
  height: 24px;
}

.author {
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

.reference-container {
  width: 96%;
  padding: 6px;
  border-radius: 2px;
  background-color: var(--darkest);
  position: absolute;
  bottom: 56px;
  left: 12px;
}

.reference-text {
  color: var(--neutral);
  font-size: .8rem;
}

.text-italic {
  font-style: italic;
}

/* Remove spinners in Chrome, Edge, and Safari */
input[type="number"]::-webkit-inner-spin-button,

input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove spinners in Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: none;
}
  
</style>