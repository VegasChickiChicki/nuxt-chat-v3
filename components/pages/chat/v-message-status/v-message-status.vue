<template>
  <button class="message-status" :class="messageStatusClasses" type="button" @click="handleStatus">
    <nuxt-icon class="message-status__icon" name="heart-icon" filled />

    <span class="message-status__count" v-if="props.statusCount !== 0">
      {{ props.statusCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import type { TProps, TEmits } from './v-message-status.types'

const props = defineProps<TProps>()
const emits = defineEmits<TEmits>()

const handleStatus = (): void => {
  emits('handle-click', props.statusType)
}

const messageStatusClasses = computed<Record<string, boolean>>(() => {
  return {
    'message-status--active': props.statusActive
  }
})
</script>

<style lang="scss">
.message-status {
  $this: &;

  width: auto;
  height: auto;

  padding: 4px 8px;

  background-color: rgb(52 52 52);
  border-radius: 10px;
  box-shadow: 0 0 15px 5px rgba(64, 64, 64, 0.2);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 4px;

  border: none;
  cursor: pointer;
  position: relative;

  &--active {
    #{$this}__icon svg {
      fill: $main-color--error;
    }
  }

  &__icon svg {
    width: 24px;
    height: 24px;

    transition: fill ease 0.25s;

    fill: $helper-color--text;

    &:hover {
      fill: $main-color--error;
    }
  }

  &__count {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    color: $main-color--error;
  }
}
</style>
