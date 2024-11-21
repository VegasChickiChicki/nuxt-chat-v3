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
	abstract findByScrollTop(scrollTop: number): T & { id: string };
	abstract updatePositionsFromId(id: string, clientHeight: number): void;
	abstract updatePositionsFromScrollTop(scrollTop: number, clientHeight: number): void;

	abstract get totalHeight(): number;
}

export type {
	TItemToShow,
	TVirtualizationItem,
	TProps,
	TSlots,
	TExpose
}

export {
	AVirtualizationList
}
