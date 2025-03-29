<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['reference', 'formLocked'])
const emit = defineEmits(['setReference'])

onMounted(() => {
  reference.value = props.reference || ''
  document.getElementById('reference-type')?.focus()
})

const typeOfReference = ref('')
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
const reference = ref('')
const authors = ref<{ firstName: string; lastName: string }[]>([])

const referencePreview = computed(() => {
  if (!typeOfReference.value) return ''
  if (typeOfReference.value === 'custom') return reference.value
  let refString = ''

  if (authors.value.length == 0) {
    if (authorLastName.value) {
      refString += authorLastName.value
      refString += (authorFirstName.value) ? `, ${nameFormatted(authorFirstName.value)}` : '.'
    } else if (authorFirstName.value) {
      refString += `${nameFormatted(authorFirstName.value)}`
    } else {
      if (authorLastName.value || authorFirstName.value) {
        if (authorLastName.value) refString += `${authorLastName.value}`
        refString += (authorFirstName.value) ? `, ${nameFormatted(authorFirstName.value)}` : '.'
      } else {
        refString += 'Unknown author.'
      }
    }
  } else {
    if (authors.value[0].lastName) {
      refString += authors.value[0].lastName
      refString += (authors.value[0].firstName) ? `, ${nameFormatted(authors.value[0].firstName)}` : '.'
    } else {
      refString += `${nameFormatted(authors.value[0].firstName)}`
    }
    if (authors.value.length > 2) {
      refString += ', et al.'
    } else {
      if (authors.value[1].lastName) {
        refString += `, and ${authors.value[1].lastName}`
        refString += (authors.value[1].firstName) ? `, ${nameFormatted(authors.value[1].firstName)}` : '.'
      } else {
        refString += `${nameFormatted(authors.value[1].firstName)}`
      }
    }
  }
  return refString
})

function nameFormatted(name: string) {
  return name.split(' ').map(n => n[0]).join('.') + '.'
}

function addAuthor() {
  authors.value.push({
    firstName: authorFirstName.value,
    lastName: authorLastName.value,
  })
  authorFirstName.value = ''
  authorLastName.value = ''
}

function removeAuthor(author: string) {
  authors.value = authors.value.filter(
    (a) => `${a.firstName} ${a.lastName}` !== author
  )
}

function clear() {
  reference.value = ''
}

function undo() {
  reference.value = props.reference || ''
}

</script>

<template>
  <form class="reference_form">
    <fieldset class="form__fieldset">
      <label for="reference-type" class="form__label form__label_w-sm">
        Reference type
        <select id="reference-type" class="form__select" v-model="typeOfReference">
          <option class="form__option" value="">No reference</option>
          <option class="form__option" value="book">Book</option>
          <option class="form__option" value="web-article">Web Article</option>
          <option class="form__option" value="website">Website</option>
          <option class="form__option" value="media">Media</option>
          <option class="form__option" value="online-lesson">Online lesson</option>
          <option class="form__option" value="custom">Custom</option>
        </select>
      </label>
      <Transition>
        <label v-if="typeOfReference === 'custom'" for="reference" class="form__label form__label_w-lg form__label_ml-16">
          Custom
          <input
          id="reference"
          type="text"
          class="form__input form__input_w-lg"
          v-model="reference"
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
              v-model="authorFirstName"
              placeholder="First name">
            </label>
            <label for="last-name" class="form__label">
              Last name of author
              <input
              id="last-name"
              type="text"
              class="form__input"
              v-model="authorLastName"
              placeholder="Last name">
            </label>
            <button
            class="button button_rounded button_icon button_bg-add"
            type="button"
            :disabled="(authorFirstName + authorLastName).length < 3"
            @click="addAuthor">Add author</button>
          </div>
          <ul class="author-container">
            <li
            v-for="author in authors"
            :key="author.firstName"
            class="author"
            >
              <span>{{ author.lastName }}, {{ author.firstName }}</span>
              <button
              @click="removeAuthor(author.firstName + ' ' + author.lastName)"
              type="button"
              class="button button_rounded button_icon button_bg-x button_sm"
              v-if="!props.formLocked"
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
            v-model="title"
            placeholder="Title">
          </label>
          <label v-if="typeOfReference === 'book'" for="publisher" class="form__label">
            Publisher
            <input
            id="publisher"
            type="text"
            class="form__input"
            v-model="publisher"
            placeholder="Publisher">
          </label>
          <label v-if="typeOfReference === 'media'" for="platform" class="form__label">
            Platform
            <input
            id="platform"
            type="text"
            class="form__input"
            v-model="platform"
            placeholder="Platform">
          </label>
          <label v-if="typeOfReference.includes('web')" for="website" class="form__label">
            Title of the page
            <input
            id="website"
            type="text"
            class="form__input"
            v-model="website"
            placeholder="Title of the page">
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
            v-model="url"
            placeholder="URL">
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
            v-model="institution"
            placeholder="Institution">
          </label>
          <label for="type-of-class" class="form__label">
            Type of class
            <input
            id="type-of-class"
            type="text"
            class="form__input"
            v-model="typeOfClass"
            placeholder="Type of class">
          </label>
        </div>
      </Transition>
      {{ referencePreview }}
    </fieldset>
    <div class="actions">
      <button
      v-if="(props.reference || reference) && !props.formLocked"
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
      :disabled="reference === props.reference"
      @click="undo">
      Undo</button>
      <button
      type="button"
      class="button button_rounded button_icon button_bg-check"
      @click="emit('setReference', reference)">
      Confirm</button>
    </div>
  </form>
</template>

<style scoped>

.reference_form {
  height: 100%;
  max-height: 400px;
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