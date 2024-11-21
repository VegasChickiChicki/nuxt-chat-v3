<template>
  <div class="virtualization-list">
    <div class="virtualization-list__content" :style="spacerStyles">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TProps, TSlots } from './v-virtualization-list.types';

const props = defineProps<TProps>();
const slots = defineSlots<TSlots>();

const spacerStyles = computed<Record<string, string>>(() => {
  return {
    height: `${props.totalHeight}px`
  }
});
</script>

<style lang="scss">
.virtualization-list {
  width: 100%;
  height: 100%;

  position: relative;

  &__content {
    width: 100%;
  }
}
</style>
