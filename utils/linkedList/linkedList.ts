import { AListNode, ALinkedList } from './linkedList.types';

class ListNode<T extends  { id: string }> extends AListNode<T> {
	constructor(item: T & { id: string }) {
		super(item);
	}
}

class LinkedList<T extends { id: string }> extends ALinkedList<T & { id: string }> {
	add(item: T & { id: string }): void {
		const node: AListNode<T & { id: string }> = new ListNode(item);

		if (!this.head) {
			this.head = this.tail = node;
		} else {
			this.tail!.next = node;
			node.prev = this.tail;
			this.tail = node;
		}

		this.map.set(item.id, node);
	}

	remove(id: string): void {
		const node: AListNode<T & { id: string }> | undefined = this.map.get(id);

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

	find(id: string): AListNode<T & { id: string }> | null {
		const node: AListNode<T & { id: string }> | null = this.map.get(id) || null;

		return node;
	}
}

export {
	ListNode,
	LinkedList
}
