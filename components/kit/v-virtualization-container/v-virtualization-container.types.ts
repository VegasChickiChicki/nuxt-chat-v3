import type { UnwrapRefSimple } from "@vue/reactivity";

import { ALinkedList } from "~/utils/linkedList/linkedList.types";

type TVirtualizationItem = {
	height: number,
	position: number
};

type TItemToShow<T> = {
	originalItem: T,
	virtualizationItem: TVirtualizationItem
};

type TProps<T> = {
	items: T[],
};

type TEmits = {
	(event: 'scroll', scroll: number): void
}

type TSlots<T> = {
	default(args: {
		itemsToShow: UnwrapRefSimple<TItemToShow<T>[]>,
		removeVirtualizationItem: (id: string) => void,
		resizeObserver: ResizeObserver | null,
	}): void
};

type TExpose = {
	scrollDown: () => void
}

abstract class AVirtualizationList<T extends { id: string }> extends ALinkedList<T> {
	abstract findByScrollTop(scrollTop: number): T;
	abstract updatePositionsFromId(id: string): void;
	abstract updatePositionsFromScrollTop(scrollTop: number): void;

	abstract get totalHeight(): number;
}

export type {
	TItemToShow,
	TVirtualizationItem,
	TProps,
	TEmits,
	TSlots,
	TExpose
}

export {
	AVirtualizationList
}
