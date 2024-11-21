<template>
  <div class="virtualization-container" ref="virtualizationContainer" @scroll="handleScrollTop">
    <div class="virtualization-container__content" ref="virtualizationContainerContent">
      <v-virtualization-list :total-height="totalHeight">
        <slot
          :items-to-show="itemsToShow"
          :remove-virtualization-item="removeVirtualizationItem"
          :resize-observer="resizeObserver"
        />
      </v-virtualization-list>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: string }">
import type { TProps, TSlots, TExpose, TItemToShow } from './v-virtualization-container.types';
import type { TVirtualizationItem } from "./v-virtualization-container.types";
import type { AListNode } from "~/utils/linkedList/linkedList.types";

import { DEFAULT_POSSIBLE_HEIGHT, SCROLL_OFFSET } from '~/stores/virtualization/virtualization.constants';
import { VirtualizationList } from './v-virtualization-container.utils'

import VVirtualizationList from "~/components/kit/v-virtualization-list/v-virtualization-list.vue";

const props = defineProps<TProps<T>>();
const slots = defineSlots<TSlots<T>>();

const virtualizationContainer = ref<HTMLDivElement | null>(null);
const virtualizationContainerContent = ref<HTMLDivElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const virtualizationList = new VirtualizationList();
const scrollTop = ref<number>(0);
const scrollOrientation = ref<null | 'top' | 'bottom'>(null);
const itemsToShow = ref<TItemToShow<T>[]>([]);
const totalHeight = ref<number>(props.items.length * DEFAULT_POSSIBLE_HEIGHT);

const clientHeight = computed<number>(() => {
  return virtualizationContainer.value?.clientHeight || 0
});

const scrollChat = (position: number): void => {
  if (virtualizationContainer.value) {
    virtualizationContainer.value.scrollTop = position;
  }
};
const scrollDown = (): void => {
  if (virtualizationContainerContent.value) {
    scrollChat(totalHeight.value - clientHeight.value);
  }
};
const handleScrollTop = (scroll: Event): void => {
  const target = scroll.target as HTMLElement;

  scrollTop.value < target.scrollTop ? scrollOrientation.value = 'bottom' : scrollOrientation.value = 'top';

  scrollTop.value = target.scrollTop;
};
const initVirtualizationItem = (id: string, position: number): AListNode<TVirtualizationItem & { id: string }> => {
  virtualizationList.add({
    id: id,
    height: DEFAULT_POSSIBLE_HEIGHT,
    position: position
  });

  return virtualizationList.find(id) as AListNode<TVirtualizationItem & { id: string }>;
};
const initVirtualizationItems = (): void => {
  let position: number = 0;

  props.items.forEach((item: T) => {
    initVirtualizationItem(item.id, position)

    position += DEFAULT_POSSIBLE_HEIGHT;
  });
};
const removeVirtualizationItem = (id: string): void => {
  if (virtualizationList.find(id)) {
    const prevItem = virtualizationList.find(id)?.prev || null;

    virtualizationList.remove(id);

    if (prevItem) {
      virtualizationList.updatePositionsFromId(prevItem.id, clientHeight.value);
      totalHeight.value = virtualizationList.totalHeight;
    }
  }
};
const handleResizeObserver = (entries: ResizeObserverEntry[]): void => {
  for (const entry of entries) {
    const virtualizationItem: AListNode<TVirtualizationItem> | null = virtualizationList.find(entry.target.$id);

    if (virtualizationItem && virtualizationItem?.item.height !== entry.contentRect.height) {
      const heightDiffirence: number = virtualizationItem.item.height - entry.contentRect.height;

      virtualizationItem.item.height = entry.contentRect.height;

      virtualizationList.updatePositionsFromId(entry.target.$id);

      totalHeight.value = virtualizationList.totalHeight;

      if (scrollOrientation.value === 'top') {
        scrollChat(scrollTop.value - heightDiffirence);
      }
    }
  }
};
const initResizeObserver = (): void => {
  if (!resizeObserver.value) {
    resizeObserver.value = new ResizeObserver(handleResizeObserver);
  }
};

const updateVisibleItems = (): void => {
  const result: TItemToShow<T>[] = [];
  let accumulatedHeight: number = 0;
  let visibleHeight: number = 0;
  let startIndex: number = virtualizationList.findByScrollTop(scrollTop.value - SCROLL_OFFSET)?.index || 0;

  for (let i = startIndex; i < props.items.length; i++) {
    if (visibleHeight >= clientHeight.value + SCROLL_OFFSET) {
      break;
    }

    result.push({
      originalItem: props.items[i],
      virtualizationItem: virtualizationList.find(props.items[i].id)?.item || initVirtualizationItem(props.items[i].id, i === 0 ? 0 : virtualizationList.find(props.items[i - 1].id)?.item.position).item
    });

    if ((virtualizationList.find(props.items[i].id)?.item.position || 0) > scrollTop.value) {
      visibleHeight += (virtualizationList.find(props.items[i].id)?.item.height || DEFAULT_POSSIBLE_HEIGHT);
    }
  }

  itemsToShow.value = result;
};
const updateVirtualizationItemHeight = (id: string, height: number): void => {
  const virtualizationItem: AListNode<TVirtualizationItem & { id: string }> | null = virtualizationList.find(id) || null;

  if (virtualizationItem && (virtualizationItem.item.height !== height)) {
    virtualizationItem.item.height = height;

    totalHeight.value = virtualizationList.totalHeight;
  }
};

watch(() => scrollTop.value, (scroll: number) => {
  updateVisibleItems();
  virtualizationList.updatePositionsFromScrollTop(scroll, clientHeight.value);
});
watch(() => props.items, updateVisibleItems, {
  deep: true
});

onMounted(() => {
  initResizeObserver();
  initVirtualizationItems();
  updateVisibleItems();
});

defineExpose<TExpose>({
  scrollDown
})
</script>

<style lang="scss">
@import 'vue-resize/dist/vue-resize.css';

.virtualization-container {
  width: 100%;
  height: 100%;

  overflow-y: auto;
  position: relative;

  &__content {
    width: 100%;
  }
}
</style>
