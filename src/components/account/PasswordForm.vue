<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { Update } from "../../api/account"
import Prompt from "../layout/Prompt.vue"
import SuccessMark from '../layout/SuccessMark.vue'
import Button from "../layout/Button.vue"
import ActionsTab from '../layout/ActionsTab.vue'

onMounted(focusOnField)

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['dismiss-dialog'])

const password = ref('')
const passwordConfirm = ref('')
const promptData = ref({
  active: false,
  title: '',
  message: '',
})
const loading = ref(false)
const showingSuccessMark = ref(false)

const passwordRequirements = [
  { text: 'Number', test: (value: string) => /\d/.test(value) },
  { text: 'Special character', test: (value: string) => /[!@\-#_$%^&*]/.test(value) },
  { text: 'Uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { text: 'Lowercase letters', test: (value: string) => /[a-z]/.test(value) }
]

const fieldsMatch = computed(() => password.value === passwordConfirm.value && password.value !== '')
const lengthFulfilled = computed(() => password.value.length === 8)
const invalidForm = computed(() => !fieldsMatch.value || !lengthFulfilled.value ||
  passwordRequirements.filter(requirement => requirement.test(password.value)).length < 3
)

function showSuccessMark() {
  showingSuccessMark.value = true
  setTimeout(() => emit('dismiss-dialog'), 1500)
}

function focusOnField() {
  document.getElementById('password')?.focus()
}

async function updatePassword() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    await Update({ password: password.value, token })
    showSuccessMark()
  } catch (__) {
    promptData.value = {
      active: true,
      title: 'An error occurred',
      message: 'Please try again later.'
    }
    nextTick().then(focusOnField)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <form class="form" :class="{ 'form_blur': promptData.active || showingSuccessMark }" @submit.prevent="updatePassword">
    <label class="form__label" for="password">Password</label>
    <input
    id="password"
    type="password"
    class="form__input form__input_border-bottom"
    placeholder="Password"
    maxlength="8"
    :disabled="loading"
    v-model="password">
    <label class="form__label" for="confirm-password">Confirm password</label>
    <input
    id="confirm-password"
    placeholder="Confirm password"
    maxlength="8"
    type="password"
    class="form__input form__input_border-bottom"
    :disabled="loading"
    v-model="passwordConfirm"
    @keyup.enter="updatePassword">
    <div class="requirements">
      <h4>
        Password requirements
      </h4>
      <ul class="list">
        <li class="list__item" :class="{ 'list__item_fulfilled': lengthFulfilled }">8 characters long.</li>
        <li class="list__item" :class="{ 'list__item_fulfilled': fieldsMatch }">Fields must match.</li>
      </ul>
      <p>At least three of the following:</p>
      <ul class="list">
        <li
        class="list__item"
        :class="{ 'list__item_fulfilled': requirement.test(password) }"
        v-for="requirement, i in passwordRequirements"
        :key="i"
        >{{ requirement.text }}</li>
      </ul>
    </div>
  </form>
  <ActionsTab :blur="promptData.active || showingSuccessMark">
    <Button
    text="Cancel"
    :modifiers="['button_bg-cancel']"
    @click="emit('dismiss-dialog')" />
    <Button
    text="Confirm"
    :modifiers="['button_bg-check']"
    :highlight="!invalidForm"
    :loading="loading"
    :disabled="invalidForm || loading"
    @click="updatePassword" />
  </ActionsTab>
  <Transition>
    <dialog class="dialog" :open="promptData.active" v-if="promptData.active">
      <Prompt
      :title="promptData.title"
      :message="promptData.message"
      @dismiss="promptData.active = false"
      :confirming="false" />
    </dialog>
  </Transition>
  <SuccessMark v-if="showingSuccessMark" />
</template>

<style scoped>

.form {
  height: 90%;
  width: 100%;
  max-width: 320px;
  padding: 12px;
  align-self: start;
  justify-self: center;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  transition: filter .5s;
}

@media screen and (min-height: 540px) {
  .form {
    height: 460px;
    margin-top: 8px;
  }
}

@media screen and (min-height: 680px) {
  .form {
    margin-top: 16px;
    align-self: center;
  }
}

.form_blur {
  filter: blur(4px);
}

.form__fieldset {
  height: 90%;
  border: none;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
}

.form__label {
  margin: 8px 0;
  font-size: .7rem;
  font-weight: bold;
  display: block;
  color: var(--light);
}

.form__input {
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
}

.form__input::placeholder, .form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
}

.form__input_text-lg {
  font-size: 1.5rem;
}

.form__input_w-25 {
  width: 25%;
}

.form__input_w-80 {
  width: 80%;
}

.form__input_border-bottom {
  border-bottom: 1px solid  var(--dark);
}

.form__input_border-bottom:focus {
  border-bottom: 1px solid  cyan;
}

.requirements {
  display: grid;
  justify-content: center;
  gap: 4px;
  color: var(--light);
}

.list {
  margin: 4px 0;
  align-self: start;
  color: var(--light);
}

.list__item {
  margin-top: 6px;
  list-style: '✘ ';
  transition: color 0.2s;
  font-size: .8rem;
}

.list__item_fulfilled {
  color: var(--neutral);
  list-style: '✔ ';
}

</style>