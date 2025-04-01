<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['reference', 'formLocked'])
const emit = defineEmits(['setReference'])

onMounted(() => {
  referenceStringified.value = props.reference || ''
  if (props.reference) parseReference(props.reference)
  document.getElementById('reference-type')?.focus()
})


const typeOfReference = ref('')
const typesOfReference = ['book', 'website', 'media', 'online-lesson', 'custom']
const authorFirstName = ref('')
const authorLastName = ref('')
const title = ref('')
const website = ref('')
const year = ref(2025)
const url = ref('')
const publisher = ref('')
const institution = ref('')
const typeOfClass = ref('')
const platform = ref('')
const customReference = ref('')
const authors = ref<{ firstName: string; lastName: string, fullName: string }[]>([])
const referenceStringified = ref('')

const referencePreview = computed(() => {
  if (typeOfReference.value === 'custom') return customReference.value
  const author = getAuthors()
  switch (typeOfReference.value) {
    case 'book':
      return [
        author,
        title.value,
        publisher.value,
        String(year.value)
      ].map(cleanString).join(' ')
    case 'website':
      return [
        author,
        title.value,
        website.value,
        String(year.value),
        url.value
      ].map(cleanString).join(' ')
    case 'media':
      return [
        author,
        title.value,
        platform.value,
        String(year.value),
        url.value
      ].map(cleanString).join(' ')
    case 'online-lesson':
      return [
        author,
        title.value,
        typeOfClass.value,
        institution.value,
        String(year.value),
        url.value
      ].map(cleanString).join(' ')
    default:
      return ''
  }
})

function formattedType(type: string) {
  return type[0].toUpperCase() + type.slice(1).replace('-', ' ')
}

function nameFormatted(name: string) {
  if (name.includes(' ')) return name.split(' ').map(n => n[0]).join('.') + '.'
  else if (name.includes('.')) return name.split('.').map(n => n[0]).join('.')
  else return name[0] + '.'
}

function cleanString(str: string) {
  if (!str) return ''
  str = str.replace(/\s+/g, ' ')
  str = (str.endsWith('.')) ? str : str + '.'
  return str
}

function parseReference(reference: string) {
  const parsedReference = JSON.parse(reference)
  if (parsedReference.authors) {
    authors.value = parsedReference.authors.map((author: { firstName: string; lastName: string, fullName: string }) => ({
      firstName: author.firstName,
      lastName: author.lastName,
      fullName: author.fullName
    }))
    typeOfReference.value = parsedReference.typeOfReference || ''
    title.value = parsedReference.title || ''
    website.value = parsedReference.website || ''
    year.value = parsedReference.year || new Date().getFullYear()
    url.value = parsedReference.url || ''
    publisher.value = parsedReference.publisher || ''
    institution.value = parsedReference.institution || ''
    typeOfClass.value = parsedReference.typeOfClass || ''
    platform.value = parsedReference.platform || ''
  }
  typeOfReference.value = parsedReference.type || ''
}

function getAuthor(author = { firstName: authorFirstName.value, lastName: authorLastName.value } ) {
  const { firstName, lastName} = author
  if (lastName) return lastName.concat(firstName ? `, ${nameFormatted(firstName)}` : '.')
  else if (firstName) return firstName
  else return 'Unknown author.'
}

function getAuthors() {
  if (authors.value.length == 0) return getAuthor()
  if (authors.value.length == 1) return getAuthor(authors.value[0])
  if (authors.value.length == 2) return `${getAuthor(authors.value[0])}, and ${getAuthor(authors.value[1])}`
  else return `${getAuthor(authors.value[0])}, et al.`
}

function addAuthor() {
  authors.value.push({
    firstName: nameFormatted(authorFirstName.value),
    lastName: authorLastName.value,
    fullName: [authorFirstName.value, authorLastName.value].join(' ').trim() || 'Unknown author'
  })
  authorFirstName.value = ''
  authorLastName.value = ''
}

function removeAuthor(i: number) {
  authors.value.splice(i, 1)
}

function clear() {
  typeOfReference.value = ''
  authors.value =  []
  authorFirstName.value = ''
  authorLastName.value = ''
  publisher.value = ''
  platform.value = ''
  website.value = ''
  title.value =  ''
  typeOfClass.value =  ''
  institution.value =  ''
  year.value =  new Date().getFullYear()
  url.value =  ''
  customReference.value = ''
  referenceStringified.value = ''
}

function undo() {
  referenceStringified.value = props.reference
}

function onSubmit() {
  switch (typeOfReference.value) {
    case 'book':
      referenceStringified.value = JSON.stringify({
        type: 'book',
        authors: authors.value.length ? authors.value : [{
          firstName: authorFirstName.value,
          lastName: authorLastName.value,
          fullName: [authorFirstName.value, authorLastName.value].join(' ').trim() || 'Unknown author'
        }],
        title: title.value,
        publisher: publisher.value,
        year: year.value
      })
      break
    case 'website':
      referenceStringified.value = JSON.stringify({
        type: 'website',
        authors: authors.value.length ? authors.value : [{
          firstName: authorFirstName.value,
          lastName: authorLastName.value,
          fullName: [authorFirstName.value, authorLastName.value].join(' ').trim() || 'Unknown author'
        }],
        title: title.value,
        website: website.value,
        year: year.value,
        url: url.value,
      })
      break
    case 'media':
      referenceStringified.value = JSON.stringify({
        type: 'media',
        authors: authors.value.length ? authors.value : [{
          firstName: authorFirstName.value,
          lastName: authorLastName.value,
          fullName: [authorFirstName.value, authorLastName.value].join(' ').trim() || 'Unknown author'
        }],
        title: title.value,
        platform: platform.value,
        year: year.value,
        url: url.value
      })
      break
    case 'online-lesson':
      referenceStringified.value = JSON.stringify({
        type: 'online-lesson',
        authors: authors.value.length ? authors.value : [{
          firstName: authorFirstName.value,
          lastName: authorLastName.value,
          fullName: [authorFirstName.value, authorLastName.value].join(' ').trim() || 'Unknown author'
        }],
        title: title.value,
        typeOfClass: typeOfClass.value,
        institution: institution.value,
        year: year.value,
        url: url.value
      })
      break
    default:
      referenceStringified.value = JSON.stringify({ customReference: customReference.value })
      break
  }
  emit('setReference', referenceStringified.value)
}

</script>

<template>
  <form class="reference_form" @submit.prevent="onSubmit">
    <fieldset class="form__fieldset">
      <label for="reference-type" class="form__label form__label_w-sm">
        Reference type
        <select id="reference-type" class="form__select" v-model="typeOfReference">
          <option class="form__option" value="">No reference</option>
          <option
          v-for="type in typesOfReference"
          :key="type"
          :value="type"
          class="form__option"
          >{{ formattedType(type) }}</option>
        </select>
      </label>
      <Transition>
        <label v-if="typeOfReference === 'custom'" for="reference" class="form__label form__label_w-lg form__label_ml-16">
          Custom
          <input
          id="reference"
          type="text"
          class="form__input form__input_w-lg"
          v-model="customReference"
          placeholder="Custom">
        </label>
      </Transition>
      <Transition>
        <div v-if="typeOfReference && typeOfReference != 'custom'">
          <div class="form__row">
            <label for="first-name" class="form__label">
              First name of author
              <input
              id="first-name"
              type="text"
              class="form__input"
              v-model.trim="authorFirstName"
              placeholder="First name">
            </label>
            <label for="last-name" class="form__label">
              Last name of author
              <input
              id="last-name"
              type="text"
              class="form__input"
              v-model.trim="authorLastName"
              placeholder="Last name">
            </label>
            <button
            class="button button_rounded button_icon button_bg-add"
            type="button"
            :disabled="(authorFirstName + authorLastName).length < 3"
            @click="addAuthor">Add author</button>
          </div>
          <ul class="author-container">
            <li v-for="author, i in authors" :key="i" class="author">
              <span>{{ author.fullName }}</span>
              <button
              v-if="!props.formLocked"
              type="button"
              class="button button_rounded button_icon button_bg-x button_sm"
              @click="removeAuthor(i)"
              >Remove author</button>
            </li>
          </ul>
        </div>
      </Transition>
      <Transition>
        <div class="form__row" v-if="typeOfReference && typeOfReference != 'custom'">
          <label for="title" class="form__label">
            Title
            <input
            id="title"
            type="text"
            class="form__input"
            v-model.trim="title"
            placeholder="Title"
            required>
          </label>
          <label v-if="typeOfReference === 'book'" for="publisher" class="form__label">
            Publisher
            <input
            id="publisher"
            type="text"
            class="form__input"
            v-model.trim="publisher"
            placeholder="Publisher"
            required>
          </label>
          <label v-if="typeOfReference === 'media'" for="platform" class="form__label">
            Platform
            <input
            id="platform"
            type="text"
            class="form__input"
            v-model.trim="platform"
            placeholder="Platform"
            required>
          </label>
          <label v-if="typeOfReference === 'website'" for="website" class="form__label">
            Title of the page
            <input
            id="website"
            type="text"
            class="form__input"
            v-model.trim="website"
            placeholder="Title of the page"
            required>
          </label>
        </div>
      </Transition>
      <Transition>
        <div class="form__row" v-if="typeOfReference && typeOfReference != 'custom'">
          <label for="year" class="form__label">
            Year of publication
            <input
            id="year"
            type="number"
            class="form__input"
            v-model="year"
            placeholder="YYYY"
            min="0"
            :max="new Date().getFullYear()">
          </label>
          <label v-if="typeOfReference !== 'book'" for="url" class="form__label">
            URL
            <input
            id="url"
            type="url"
            class="form__input"
            v-model.trim="url"
            placeholder="URL"
            required>
          </label>
        </div>
      </Transition>
      <Transition>
        <div v-if="typeOfReference === 'online-lesson'" class="form__row">
          <label for="institution" class="form__label">
            Institution
            <input
            id="institution"
            type="text"
            class="form__input"
            v-model.trim="institution"
            placeholder="Institution"
            required>
          </label>
          <label for="type-of-class" class="form__label">
            Type of class
            <input
            id="type-of-class"
            type="text"
            class="form__input"
            v-model.trim="typeOfClass"
            placeholder="Type of class"
            required>
          </label>
        </div>
      </Transition>
      <small>{{ referencePreview }}</small>
    </fieldset>
    <div class="actions">
      <button
      v-if="(props.reference || referenceStringified) && !props.formLocked"
      type="button"
      class="button button_rounded button_icon button_bg-clear"
      title="Clear reference"
      @click="clear">
      Clear</button>
      <button
      v-if="props.reference && !props.formLocked"
      type="button"
      class="button button_rounded button_icon button_bg-undo"
      title="Undo changes"
      :disabled="referenceStringified === props.reference"
      @click="undo">
      Undo</button>
      <button
      type="submit"
      class="button button_rounded button_icon button_bg-check">
      Confirm</button>
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
}

.form__fieldset {
  width: 100%;
  height: 94%;
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