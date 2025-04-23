<script setup lang="ts">
import { inject, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'

const props = defineProps(['showingDialog', 'dialogs'])
const showDialog = inject('showDialog') as (dialog: keyof typeof props.dialogs) => void
const { logout } = useAuth0()

const showingSettings = ref(false)

</script>

<template>
  <aside class="aside" :class="{ 'aside_blur': showingDialog }">
    <button
    class="button button_icon button_bg-avatar"
    type="button"
    @click="showingSettings = !showingSettings"
    @blur="showingSettings = false"
    >SettingsMenu</button>
    <Transition>
      <ul class="settings" v-if="showingSettings">
        <li>
          <button
          class="button button_icon button_bg-key"
          type="button"
          title="Change password"
          @click="showDialog('PasswordForm')"
          >Update Password</button>
        </li>
        <li>
          <button
          class="button button_alert button_icon button_bg-delete-db"
          type="button"
          title="Delete account"
          @click="showDialog('DeleteAccount')"
          >Delete account</button>
        </li>
        <li>
          <button
          class="button button_icon button_bg-logout"
          type="button"
          title="Logout"
          @click="() => logout()"
          >Logout</button>
        </li>
      </ul>
    </Transition>
  </aside>
</template>

<style scoped>

.aside {
  margin-left: auto;
  position: relative;
  transition: filter .5s;
}

.aside_blur {
  filter: blur(4px);
}

.settings {
  height: 32px;
  position: absolute;
  top: 0;
  right: 80px;
  display: flex;
  gap: 4px;
}
</style>
