<template>
  <button class="image-preview" type="button" @click="setPopupState(true)">
    <nuxt-icon class="image-preview__icon" name="eye-icon" filled />
  </button>

  <teleport to="body">
    <transition name="popup">
      <v-popup title="" v-if="popupState" @close-popup="setPopupState(false)">
        <img
          class="image-preview__image"
          :src="props.image"
          alt="chat-image"
        >
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { TProps } from './v-image-preview.types'

import VPopup from "~/components/kit/v-popup/v-popup.vue";

import { usePopup } from "~/composables/usePopup/usePopup";

const props = defineProps<TProps>();
const { popupState, setPopupState } = usePopup();
</script>

<style lang="scss">
.image-preview {
  $this: &;

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

  background-color: $main-color--light;
  opacity: 0;
  transition: opacity ease 0.25s;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }

  &__icon {
    svg {
      font-size: 40px;

      fill: $helper-color--text;
    }
  }

  &__image {
    width: 800px;
    height: auto;

    max-height: calc(100vh - 222px);

    object-fit: cover;
  }

}
</style>
