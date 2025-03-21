<script setup lang='ts'>
import { useAuth0 } from '@auth0/auth0-vue'

const { isLoading, loginWithRedirect, isAuthenticated, logout } = useAuth0()

</script>

<template>
  <div>
    <button
    v-if="isAuthenticated"
    class="button button_secondary button_ml-auto button_icon button_bg-logout"
    type="button"
    @click="() => logout()"
    >Logout</button>
    <button
    v-else
    class="button"
    type="button"
    :disabled="isLoading"
    @click="() => loginWithRedirect()"
    >Start</button>
  </div>
</template>