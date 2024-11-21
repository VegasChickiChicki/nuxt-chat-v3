<template>
  <div class="user-avatar">
    <span class="user-avatar__default" v-if="props.userImage === undefined">
      {{ userDefaultAvatar }}
    </span>

    <img class="user-avatar__image" :src="props.userImage" alt="user-avatar" v-else>

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { TProps, TSlots } from './v-user-avatar.types';

const props = defineProps<TProps>();
const slots = defineSlots<TSlots>();

const userDefaultAvatar = computed<string>(() => {
  return props.userLogin.split('')[0]
});
</script>

<style lang="scss">
.user-avatar {
  height: 100%;
  width: auto;

  padding: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid $main-color--light;
  position: relative;

  &__default {
    font-size: 1em;
    line-height: 1;
    font-weight: 700;
    color: $main-color--text;
  }

  &__image {
    width: 100%;
    height: 100%;

    object-fit: cover;

    border-radius: 50%;
  }
}
</style>
