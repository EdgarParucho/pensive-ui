<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const emit = defineEmits(['showPasswordForm', 'showDeleteAccountForm'])
const { logout } = useAuth0()

</script>

<template>
  <aside class="settings-menu">
    <button
    class="button button_ml-auto button_icon button_bg-key"
    type="button"
    title="Change password"
    @click="emit('showPasswordForm')"
    >Password</button>
    <button
    class="button button_alert button_ml-auto button_icon button_bg-account-minus"
    type="button"
    title="Delete account"
    @click="emit('showDeleteAccountForm')"
    >Delete account</button>
    <button
    class="button button_ml-auto button_icon button_bg-logout"
    type="button"
    title="Logout"
    @click="() => logout()"
    >Logout</button>
  </aside>
</template>

<style scoped>
.settings-menu {
  position: absolute;
  top: 6px;
  right: 80px;
  height: 32px;
  display: flex;
  gap: 4px;
}
</style>