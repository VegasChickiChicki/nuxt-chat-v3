<template>
  <span class="message-image">
    <img
      class="message-image__image"
      :src="`${filesPath}${props.imagePath}`"
      alt="chat-image"
    >

    <button class="message-image__overlay" type="button" @click="setPopupState(true)">
      <nuxt-icon class="message-image__icon" name="eye-icon" filled />
    </button>
  </span>

  <teleport to="body">
    <transition name="popup">
      <v-popup title="" @close-popup="setPopupState(false)" v-if="popupState">
        <img
          class="message-image__popup-image"
          :src="`${filesPath}${props.imagePath}`"
          alt="chat-image"
        >
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { TProps } from './v-message-image.types';

import VPopup from "~/components/kit/v-popup/v-popup.vue";

import { usePopup } from "~/composables/usePopup/usePopup";

const { filesPath } = useAppConfig();

const props = defineProps<TProps>();
const { popupState, setPopupState } = usePopup();
</script>

<style lang="scss">
.message-image {
  $this: &;

  width: auto;
  height: auto;

  padding: 16px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  border: 1px solid $main-color--light;
  border-radius: 10px;
  position: relative;
  overflow: hidden;

  &:hover {
    #{$this}__overlay {
      opacity: 0.75;
    }
  }

  &__image {
    width: auto;
    height: 250px;

    object-fit: contain;
  }

  &__overlay {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: $main-color;
    border: none;
    opacity: 0;
    cursor: pointer;
    transition: opacity ease 0.25s;
  }

  &__icon {
    svg {
      font-size: 40px;

      fill: $helper-color--text;
    }
  }

  &__popup-image {
    width: 800px;
    height: auto;

    max-height: calc(100vh - 222px);

    object-fit: cover;
  }
}
</style>
