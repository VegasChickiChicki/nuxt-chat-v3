<template>
  <div class="popup" @click.self="closePopup">
    <div class="popup__wrapper">
      <div class="popup__wrapper-head">
        <span class="popup__wrapper-head-title">
          {{ props.title }}
        </span>

        <button class="popup__close" type="button" @click="closePopup">
          <nuxt-icon class="popup__close-icon" name="plus-icon" filled />
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TProps, TEmits, TSlots } from './v-popup.types';

const props = defineProps<TProps>();
const emits = defineEmits<TEmits>();
const slots = defineSlots<TSlots>()

const closePopup = () => {
  emits('close-popup')
};
</script>

<style lang="scss">
.popup {
  width: 100%;
  height: 100%;

  padding: 64px;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  z-index: 25;

  background-color: rgba(0, 0, 0, 0.375);

  cursor: pointer;
  overflow: scroll;

  &__wrapper {
    width: auto;
    height: auto;

    margin: auto;
    padding: 16px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 15px;

    cursor: default;

    background-color: $main-color;
    border-radius: 10px;
  }

  &__wrapper-head {
    width: 100%;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__wrapper-head-title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
    color: $main-color--text;
  }

  &__close {
    width: auto;
    height: auto;

    margin-left: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  &__close-icon {
    svg {
      width: 32px;
      height: 32px;

      fill: $helper-color--text;
      transform: rotate(45deg);
    }
  }

  &-enter-active, &-leave-active {
    transition: background-color 0.25s;

    .popup__wrapper{
      transition: opacity ease 0.25s, transform ease 0.25s;
    }
  }

  &-enter-from, &-leave-to {
    background-color: rgba(0, 0, 0, 0);

    .popup__wrapper{
      opacity: 0;
      transform: translateY(17.5%);
    }
  }
}
</style>
