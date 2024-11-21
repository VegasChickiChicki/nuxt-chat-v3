abstract class AListNode<T extends { id: string }> {
	item: T;
	id: string;
	index: number;
	next: AListNode<T> | null = null;
	prev: AListNode<T> | null = null;

	protected constructor(item: T, index = 0) {
		this.item = item;
		this.id = item.id
		this.index = index;
	}
}

abstract class ALinkedList<T extends { id: string }> {
	protected map: Map<string, AListNode<T>>;

	head: AListNode<T> | null = null;
	tail: AListNode<T> | null = null;

	constructor() {
		this.map = new Map();
	}

	abstract add(item: T & { id: string }): void;
	abstract remove(id: string): void;
	abstract find(id: string): AListNode<T> | null;
}

export {
	AListNode,
	ALinkedList
}
