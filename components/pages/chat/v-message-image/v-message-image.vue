<template>
  <span class="message-image">
    <img
      class="message-image__image"
      :src="imagePath"
      alt="chat-image"
    >

    <v-image-preview :image="imagePath" />
  </span>
</template>

<script setup lang="ts">
import type { TProps } from './v-message-image.types';
import VImagePreview from "~/components/kit/v-image-preview/v-image-preview.vue";

const { filesPath } = useAppConfig();

const props = defineProps<TProps>();

const imagePath = computed<string>(() => {
  return `${filesPath}${props.imagePath}`
})
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

  &__image {
    width: auto;
    height: 250px;

    object-fit: contain;
  }
}
</style>
