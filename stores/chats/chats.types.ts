import type { TUser } from "~/stores/user/user.types";

type TMessageStatus = {
	id: string,
	type: string,
	users: Omit<TUser, 'token'>[]
}

type TMessage = {
	id: string,
	text: string,
	date: string,
	author: Omit<TUser, 'token'>,
	statuses: TMessageStatus[],
	images: string[]
}

type TChat = {
	id: string,
	name: string,
	owner: Omit<TUser, 'token'>,
	users: Omit<TUser, 'token'>[]
	messages: TMessage[]
}

type TChatMessagesResponse = TMessage[]

type TChatsListResponse = TChat[]

export type {
	TMessageStatus,
	TMessage,
	TChat,
	TChatMessagesResponse,
	TChatsListResponse
}
