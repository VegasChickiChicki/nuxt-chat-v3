<template>
  <div class="virtualization-item" :style="virtualizationItemStyles" ref="virtualizationItem">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { TProps, TSlots } from './v-virtualization-item.types';

const props = defineProps<TProps>();
const slots = defineSlots<TSlots>();

const virtualizationItem = ref<HTMLDivElement | null>(null);

const virtualizationItemStyles = computed<Record<string, string>>(() => {
  return {
    transform: ` translateY(${props.position || 0}px)`
  }
});

onMounted(() => {
  if (virtualizationItem.value && props.resizeObserver) {
    virtualizationItem.value.$id = props.id;

    props.resizeObserver.observe(virtualizationItem.value);
  }
});
onBeforeUnmount(() => {
  if (virtualizationItem.value && props.resizeObserver) {
    props.resizeObserver.unobserve(virtualizationItem.value);
  }
});
</script>

<style lang="scss">
.virtualization-item {
  width: 100%;
  height: auto;

  will-change: transform;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
