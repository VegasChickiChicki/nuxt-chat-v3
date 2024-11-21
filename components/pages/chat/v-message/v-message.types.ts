import type { TMessage, TMessageStatus }  from "~/stores/chats/chats.types";

type TProps = Omit<TMessage, 'id' | 'statuses' | 'images'> & {
	chatId: string,
	messageId: string,
	messageStatuses: TMessageStatus[],
	messageImages: string[]
	tag?: string
}

type TEmits = {
	(event: 'remove-message', messageId: string): void
}

export type {
	TProps,
	TEmits
}
