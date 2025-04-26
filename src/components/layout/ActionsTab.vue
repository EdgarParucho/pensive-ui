<script setup lang="ts">
defineProps(['blur'])
const emit = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div class="tab-container" :class="{ 'tab-container_blur': blur }">
    <div class="tab-bottom-half">
      <div class="tab-top-half">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

.tab-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 44px;
  background-color: var(--darkest);
}

.tab-container_blur {
  filter: blur(4px)
}

.tab-top-half {
  height: 20px;
  width: 340px;
  padding-top: 24px;
  border-radius: 16px 16px 0 0;
  margin: -19px auto 0;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--dark);
}

.tab-top-half::before {
  content: '';
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background-color: var(--darkest);
  position: absolute;
  bottom: -25px;
  left: -44px;
  z-index: 20;
}

.tab-top-half::after {
  content: '';
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background-color: var(--darkest);
  position: absolute;
  bottom: -25px;
  right: -44px;
  z-index: 20;
}

.tab-bottom-half {
  height: 26px;
  width: 400px;
  border-radius: 16px 16px 0 0;
  position: absolute;
  bottom: 0;
  left: calc(50% - 200px);
  background-color: var(--dark);
}

</style>