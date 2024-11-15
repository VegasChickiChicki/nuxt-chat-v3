import type { AxiosResponse, AxiosError} from "axios";
import type { TApiError } from "~/types/api";
import type { TMessage, TChat, TChatMessagesResponse, TChatsListResponse } from './chats.types'
import type { TUser } from "~/stores/user/user.types";

import { defineStore } from "pinia";
import { useUserStore } from "~/stores/user/user";

export const useChatsStore = defineStore('chatsStore', () => {
	const nuxtApp = useNuxtApp()
	const userStore = useUserStore()
	const { user } = storeToRefs(userStore)

	const chats = ref<TChat[]>([])
	const foundedChats = ref<TChat[]>([])

	const chatSetMessages = (chatId: string, messages: TMessage[]): void => {
		const chat: TChat | null = chats.value.find((chat: TChat) => chat.id === chatId) || null

		if (chat) {
			chat.messages = messages
		}
	};
	const chatAddMessage = (chatId: string, message: TMessage): void => {
		const chat: TChat | null = chats.value.find((chat: TChat) => chat.id === chatId) || null

		if (chat) {
			chat.messages.push(message)
		}
	};
	const chatDeleteMessage = (chatId: string, messageId: string): void => {
		const chat: TChat | null = chats.value.find((chat: TChat) => chat.id === chatId) || null

		if (chat) {
			chat.messages = chat.messages.filter((message: TMessage) => message.id !== messageId) || null
		}
	}
	const chatUpdateMessage = (chatId: string, message: TMessage): void => {
		const chat: TChat | null = chats.value.find((chat: TChat) => chat.id === chatId) || null;
		const updatingMessageIndex: number | null = chat?.messages.findIndex((currentMessage: TMessage) => currentMessage.id === message.id) || null;

		if (chat && updatingMessageIndex !== null) {
			chat.messages[updatingMessageIndex] = message
		}
	}
	const chatUpdateUserOnlineStatus = (chatId: string, userData: Omit<TUser, 'token'>): void => {
		const chat: TChat | null = chats.value.find((chat: TChat) => chat.id === chatId) || null
		const user: Omit<TUser, 'token'> | null = chat?.users.find((user: Omit<TUser, 'token'>) => {
			return user.id === userData.id
		}) || null

		if (chat && user) {
			user.isOnline = userData.isOnline
		}
	};
	const chatAddUser = (chatId: string, userData: Omit<TUser, 'token'>): void => {
		const chat = chats.value.find((chat: TChat) => chat.id === chatId) || null;

		if (chat !== null) {
			chat.users.push(userData)
		}
	};
	const chatRemoveUser = (chatId: string, userData: Omit<TUser, 'token'>): void => {
		const chat = chats.value.find((chat: TChat) => chat.id === chatId) || null;

		if (chat !== null) {
			chat.users = chat.users.filter((user: Omit<TUser, 'token'>) => {
				return user.id !== userData.id;
			})
		}
	};

	const getMessagesList = async (chatId: string): Promise<TMessage[] | null> => {
		return await nuxtApp.$api.get<TChatMessagesResponse>(`/chat/${chatId}/messages/`).then((response: AxiosResponse<TChatMessagesResponse>) => {
			if (response.data){
				chatSetMessages(chatId, response.data)
			}

			return response.data
		});
	};
	const messageUpdateStatus = async (chatId: string, messageId: string, statusType: string): Promise<void> => {
		await nuxtApp.$api.put<TMessage>(`/chat/${chatId}/messages/${messageId}`, {
			statusType
		}).then((response: AxiosResponse<TMessage>) => {
			const chat = chats.value.find((chat: TChat) => chat.id === chatId) || null
			const message = chat?.messages.find((message: TMessage) => message.id === messageId) || null

			if (message) {
				message.statuses = response.data.statuses
			}
		}).catch((error: AxiosError) => {
			console.log('error: ', error)
		});
	};
	const messageDelete = async (chatId: string, messageId: string): Promise<void> => {
		await nuxtApp.$api.delete(`/chat/${chatId}/messages/${messageId}`).then(() => {
			const chat = chats.value.find((chat: TChat) => chat.id === chatId) || null

			if (chat) {
				chat.messages = chat?.messages.filter((message: TMessage) => message.id !== messageId) || []
			}
		}).catch((error: AxiosError) => {
			console.log('error: ', error)
		});
	};
	const messageCreate = async (chatId: string, messageData: string, messageImages: File[]): Promise<void> => {
		const formData: FormData = new FormData();

		formData.append('messageData', messageData);

		messageImages.forEach((image: File) => {
			formData.append('images', image);
		})

		await nuxtApp.$api.post(`/chat/${chatId}/messages/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).catch((error: AxiosError) => {
			console.log('error: ', error)
		});
	};
	const getChatsList = async (): Promise<TChat[] | void> => {
		return await nuxtApp.$api.get<TChatsListResponse>('/chat/list').then((response: AxiosResponse<TChatsListResponse>) => {
			if (response.data){
				chats.value = response.data
			}

			return chats.value
		});
	};
	const createChat = async (chatName: string): Promise<void> => {
		await nuxtApp.$api.post('chat/create', {
			data: {
				chat: {
					name: chatName,
				},
				user: {
					name: user.value?.login,
				}
			}
		}).then((response: AxiosResponse<TChat>) => {
			chats.value.unshift(response.data)

			navigateTo(`/chat/${response.data.name}`)
		}).catch((error: AxiosError<TApiError[]>) => {
			return Promise.reject(error.response?.data);
		})
	};
	const removeChat = async (chatId: string): Promise<void> => {
		await nuxtApp.$api.delete(`chat/delete/${chatId}`).then(() => {
			chats.value = chats.value.filter((chat: TChat) => {
				return chat.id !== chatId
			})
		}).catch((error: AxiosError<TApiError[]>) => {
			return Promise.reject(error.response?.data);
		})
	};
	const leaveChat = async (chatId: string): Promise<void> => {
		await nuxtApp.$api.post(`chat/leave/${chatId}`).then(() => {
			chats.value = chats.value.filter((chat: TChat) => {
				return chat.id !== chatId
			});
		}).catch((error: AxiosError<TApiError[]>) => {
			return Promise.reject(error.response?.data);
		})
	};
	const searchChat = async (chatName: string): Promise<void> => {
		return await nuxtApp.$api.get<TChat[]>('chat/find', {
			params: {
				chat: {
					name: chatName,
				}
			}
		}).then((response: AxiosResponse<TChat[]>) => {
			foundedChats.value = response.data
		}).catch((error: AxiosError<TApiError[]>) => {
			return Promise.reject(error.response?.data)
		})
	};
	const joinChat = async (chatId: string): Promise<TChat | void> => {
		return await nuxtApp.$api.post<TChat>(`chat/join/${chatId}`, {
			data: {
				userId: user.value?.id
			}
		}).then((response: AxiosResponse<TChat>) => {
			chats.value.unshift(response.data)

			return response.data;
		}).catch((error: AxiosError<TApiError>) => {
			console.log('Cannot join in chat, error details: ', error)

			return Promise.reject(error)
		});
	};

	return {
		chats,
		foundedChats,
		chatAddMessage,
		chatDeleteMessage,
		chatUpdateMessage,
		chatUpdateUserOnlineStatus,
		chatAddUser,
		chatRemoveUser,
		getMessagesList,
		messageUpdateStatus,
		messageDelete,
		messageCreate,
		getChatsList,
		createChat,
		removeChat,
		leaveChat,
		searchChat,
		joinChat
	}
})
