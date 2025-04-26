<script setup lang='ts'>
import { useAuth0 } from '@auth0/auth0-vue'
import ActionsTab from '../layout/ActionsTab.vue';
const { isLoading, loginWithRedirect } = useAuth0()
</script>

<template>
  <div>
    <div>
      <div class="drop"></div>
      <button
      class="start-button"
      :class="{ 'button_pulse': isLoading }"
      :disabled="isLoading"
      @click="() => loginWithRedirect()"
      >{{ isLoading ? 'Loading' : 'Start' }}</button>
    </div>
    <ActionsTab>
    <footer>
      <p>Parucho Palma E. 2025.</p>
      <div class="link-container">
        <a
        target="_blank"
        href="https://edgarparucho.github.io"
        class="link"
        >Visit Website</a>
        <a
        target="_blank"
        href="https://linkedin.com/in/edgarparucho"
        class="link"
        >Go to LinkedIn</a>
      </div>
    </footer>
    </ActionsTab>
  </div>
</template>

<style scoped>

.drop {
  position: absolute;
  top: 15%;
  left: calc(50% - 10px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-image: linear-gradient(360deg, var(--dark) 80%, cyan);
  animation-name: drop;
  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
}

@keyframes drop {
  0% {
    box-shadow: -8px -2px 12px cyan;
  }
  100% {
    box-shadow: -1px -12px 16px cyan;
    transform: translateY(140px);
  }
}

.start-button {
  height: 24px;
  width: 72px;
  border: 1px solid var(--dark);
  border-radius: 2px;
  color: var(--light);
  outline: none;
  background-color: var(--dark);
  position: absolute;
  top: calc(50% - 11px);
  left: calc(50% - 36px);
  cursor: pointer;
  transition: box-shadow .5s;
}

.start-button:focus, .start-button:hover {
  box-shadow: 0 -1px 8px cyan;
}

.start-button:disabled {
  cursor: auto;
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
}

@keyframes pulse {
  0% {
    box-shadow: 0 -1px 12px cyan;
  }
  100% {
    box-shadow: 0 -1px 16px cyan;
  }
}

.link-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  color: var(--neutral);
  text-decoration: none;
  font-size: .8rem;
  font-weight: 400;
  transition: color .2s;
}

.link:hover {
  text-decoration: cyan underline;
  color: var(--light);
}

</style>