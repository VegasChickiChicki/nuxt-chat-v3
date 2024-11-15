<template>
  <button class="button-small" :class="buttonSmallClasses" type="button"
  >
    <nuxt-icon class="button-small__icon" :name="props.icon" filled />
  </button>
</template>

<script setup lang="ts">
import type { TProps } from './v-button-small.types'

const props = defineProps<TProps>()

const buttonSmallClasses = computed<Record<string, boolean>>(() => {
  return {
    'button-small--orange': props.theme === 'orange',
    'button-small--blue': props.theme === 'blue',
  }
})
</script>

<style lang="scss">
.button-small {
  $this: &;

  width: auto;
  height: auto;

  padding: 4px;

  background-color: rgb(52 52 52);
  border-radius: 8px;
  box-shadow: 0 0 15px 5px rgba(64, 64, 64, 0.2);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 4px;

  border: none;
  cursor: pointer;
  position: relative;

  &__icon svg {
    width: 20px;
    height: 20px;

    transition: fill ease 0.25s;

    fill: $helper-color--text;
  }

  &:hover {
    #{$this}__icon svg {
      fill: $main-color--error;
    }
  }

  &--orange {
    &:hover {
      #{$this}__icon svg {
        fill: $main-color--danger;
      }
    }
  }

  &--blue {
    &:hover {
      #{$this}__icon svg {
        fill: $main-blue;
      }
    }
  }
}
</style>
