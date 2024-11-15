import type { TMessage, TMessageStatus }  from "~/stores/chats/chats.types";

type TProps = Omit<TMessage, 'id' | 'statuses' | 'images'> & {
	chatId: string,
	messageId: string,
	messageStatuses: TMessageStatus[],
	messageImages: string[]
	tag?: string
}

export type {
	TProps
}
