<template>
  <div class="system-message">
    <span class="system-message__line" />

    <span class="system-message__text">
      {{ props.text }}
    </span>

    <span class="system-message__line" />
  </div>
</template>

<script setup lang="ts">
import type { TProps } from './v-system-message.types';

const props = defineProps<TProps>()
</script>

<style lang="scss">
.system-message {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  &__text {
    padding: 0 24px;

    flex-shrink: 0;

    color: $helper-color--text;

    text-align: center;
  }

  &__line {
    width: 100%;
    height: 1px;

    display: block;

    background-color: $main-color--light;
  }
}
</style>
