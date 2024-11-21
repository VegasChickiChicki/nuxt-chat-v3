import type { TVirtualizationItem } from "~/stores/virtualization/virtualization.types";
import type { AListNode } from "~/utils/linkedList/linkedList.types";

import { AVirtualizationList } from './v-virtualization-container.types'
import { LinkedList } from "~/utils/linkedList/linkedList";

class VirtualizationList extends LinkedList<TVirtualizationItem & { id: string }> implements AVirtualizationList<TVirtualizationItem & { id: string }> {
	findByScrollTop(scrollTop: number): AListNode<TVirtualizationItem & { id: string }> | null {
		const array = Array.from(this.map.values());

		let left = 0;
		let right = array.length - 1;

		let operationsCount: number = 0;

		while (left <= right) {
			const mid: number = Math.floor((left + right) / 2);
			const item: TVirtualizationItem & { id: string } = array[mid];

			operationsCount++;

			if (item.item.position <= scrollTop && scrollTop < item.item.position + item.item.height) {
				return item;
			} else if (scrollTop < item.item.position) {
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}

		return null;
	}

	updatePositionsFromId(id: string, clientHeight: number): void {
		const startNode: AListNode<TVirtualizationItem & { id: string }> | null = this.find(id);

		if (!startNode) {
			return;
		}

		let position: number = startNode.item.position;
		let current: AListNode<TVirtualizationItem & { id: string }> | null = startNode;
		let count: number = 10;
		let accumulatedHeight: number = 0;

		while (current && count > 0) {
			if (current.prev) {
				position = current.prev.item.position + current.prev.item.height;
			}

			current.item.position = position;

			position += current.item.height;
			current = current.next;

			accumulatedHeight += current?.item.height || 0;

			if (accumulatedHeight >= clientHeight) {
				count--;
			}
		}
	}

	updatePositionsFromScrollTop(scrollTop: number, clientHeight: number): void {
		const startNode: AListNode<TVirtualizationItem & { id: string }> | null = this.findByScrollTop(scrollTop);

		if (startNode) {
			this.updatePositionsFromId(startNode.id, clientHeight);
		}
	}

	get totalHeight(): number {
		if (!this.tail) {
			return 0;
		}

		return this.tail.item.position + this.tail.item.height;
	}
}

export {
	VirtualizationList
}
