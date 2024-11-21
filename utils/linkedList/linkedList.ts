import { AListNode, ALinkedList } from './linkedList.types';

class ListNode<T extends  { id: string }> extends AListNode<T> {
	constructor(item: T & { id: string }, index: number) {
		super(item, index);
	}
}

class LinkedList<T extends { id: string }> extends ALinkedList<T> {
	add(item: T): void {
		const node: AListNode<T> = new ListNode(item, 0);

		if (!this.head) {
			this.head = this.tail = node;
		} else {
			this.tail!.next = node;
			node.prev = this.tail;
			this.tail = node;

			node.index = node.prev!.index + 1
		}

		this.map.set(item.id, node);
	}

	remove(id: string): void {
		const node: AListNode<T> | undefined = this.map.get(id);

		if (!node) {
			return;
		}

		if (node.prev) {
			node.prev.next = node.next;
		} else {
			this.head = node.next;
		}

		if (node.next) {
			node.next.prev = node.prev;
		} else {
			this.tail = node.prev;
		}

		this.map.delete(id);
	}

	find(id: string): AListNode<T> | null {
		const node: AListNode<T> | null = this.map.get(id) || null;

		return node;
	}
}

export {
	ListNode,
	LinkedList
}
