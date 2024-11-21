import type { TVirtualizationList, TVirtualizationItem } from "./virtualization.types";

import { defineStore } from "pinia";
import { DEFAULT_POSSIBLE_HEIGHT } from "./virtualization.constants";

export const useVirtualizationStore = defineStore('virtualizationStore', () => {
	const virtualizationItems = ref<TVirtualizationList>(new Map());
	const scrollTop = ref<number>(0);

	const addVirtualizationItem = <T extends { id: string }>(item: T): void => {
		const lastVirtualizationItemPosition: number = [...virtualizationItems.value.entries()].at(-1)?.[1]?.position || 0;
		const newVirtualizationItemPosition: number = lastVirtualizationItemPosition + DEFAULT_POSSIBLE_HEIGHT;

		virtualizationItems.value.set(item.id, {
			height: DEFAULT_POSSIBLE_HEIGHT,
			position: newVirtualizationItemPosition
		});
	};
	const updateVirtualizationItemsPositions = (): void => {
		let position: number = 0;

		Array.from(virtualizationItems.value).forEach(([virtualizationItemKey, virtualizationItem]: [string, TVirtualizationItem]) => {
			console.log('update block positions', {
				height: virtualizationItem.height,
				position: position
			});

			virtualizationItems.value.set(virtualizationItemKey, {
				height: virtualizationItem.height,
				position: position
			});

			position += virtualizationItem.height;
		})
	};
	const updateVirtualizationItemHeight = (height: number, id: string): void => {
		if (virtualizationItems.value.has(id)) {
			const block: TVirtualizationItem | null = virtualizationItems.value.get(id) || null;

			if (block !== null && block.height !== height) {
				console.log('virtualization item height', {
					height: height,
					position: block.position
				});

				virtualizationItems.value.set(id, {
					height: height,
					position: block.position
				});
			}
		}
	};

	return {
		virtualizationItems,
		scrollTop,
		addVirtualizationItem,
		updateVirtualizationItemHeight,
		updateVirtualizationItemsPositions
	}
});
