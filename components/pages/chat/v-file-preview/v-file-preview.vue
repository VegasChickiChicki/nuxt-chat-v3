<template>
  <div class="file-preview">
    <div class="file-preview__head">
      <v-button-small
        icon="pencil-icon"
        theme="orange"
        @click="emits('change-file', props.image.name)"
      />

      <v-button-small
        icon="trash-icon"
        @click="emits('remove-file', props.image.name)"
      />
    </div>

    <button class="file-preview__content" type="button" @click="setPopupState(true)">
      <img
        class="file-preview__content-image"
        :src="imageSrc"
        :alt="props.image.name"
        v-if="imageSrc !== null"
      />

      <span class="file-preview__content-overlay">
        <nuxt-icon class="file-preview__content-image-icon" name="eye-icon" filled />
      </span>
    </button>

    <span class="file-preview__footer">
      {{ props.image.name }}
    </span>
  </div>

  <teleport to="body">
    <transition name="popup">
      <v-popup title="" v-if="popupState" @close-popup="setPopupState(false)">
        <img
          class="file-preview__popup-image"
          :src="imageSrc"
          alt="chat-image"
          v-if="imageSrc !== null"
        >
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { TProps, TEmits } from './v-file-preview.types'

import VButtonSmall from "~/components/kit/v-button-small/v-button-small.vue";
import VPopup from "~/components/kit/v-popup/v-popup.vue";

import { usePopup } from "~/composables/usePopup/usePopup";

const props = defineProps<TProps>()
const emits = defineEmits<TEmits>()

const imageSrc = ref<string | null>(null);
const { popupState, setPopupState } = usePopup();

if (props.image.type.startsWith('image/')) {
  const reader = new FileReader();

  reader.onload = (event: ProgressEvent<FileReader>) => {
    if (event.target && typeof event.target.result === 'string') {
      imageSrc.value = event.target.result;
    }
  }

  reader.readAsDataURL(props.image)
}
</script>

<style lang="scss">
.file-preview {
  $this: &;

  width: auto;
  height: auto;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  flex-shrink: 0;

  border: 1px solid $main-color--light;
  border-radius: 10px;

  &__head {
    width: 100%;
    height: auto;

    padding: 8px 12px;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 8px;

    border-bottom: 1px solid $main-color--light;
  }

  &__content {
    width: 100%;
    height: auto;

    padding: 16px;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      #{$this}__content-overlay {
        opacity: 0.75;
      }
    }
  }

  &__content-overlay {
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
  }

  &__content-image {
    width: 150px;
    height: 150px;

    display: flex;
    justify-content: center;
    align-items: center;

    object-fit: contain;
  }

  &__content-image-icon {
    svg {
      font-size: 40px;

      fill: $helper-color--text;
    }
  }

  &__footer {
    width: 100%;
    height: auto;
    max-width: calc(150px + (16px * 2));

    padding: 8px 16px;

    display: inline-block;

    border-top: 1px solid $main-color--light;

    color: $helper-color--text;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__popup-image {
    width: 800px;
    height: auto;

    max-height: calc(100vh - 222px);

    object-fit: cover;
  }
}
</style>
