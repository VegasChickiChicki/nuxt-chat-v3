import type { AxiosError, AxiosResponse } from "axios";
import type { TUser, TUpdateUserRequest } from './user.types'

import { defineStore } from "pinia";
import { callWithNuxt } from "#app";

export const useUserStore = defineStore('userStore', () => {
	const nuxtApp = useNuxtApp()

	const user = ref<TUser | null>(null)

	const setUser = (userData: TUser | null) => {
		user.value = userData

		callWithNuxt(nuxtApp, () => {
			useCookie('authToken').value = userData?.token || null
		})
	};
	const getUser = async (): Promise<void> => {
		await nuxtApp.$api.get<TUser>('/user').then((response: AxiosResponse<TUser>) => {
			setUser(response.data)
		}).catch((error: AxiosError) => {
			return Promise.reject(error)
		});
	};
	const updateUser = async (userData: TUpdateUserRequest): Promise<void> => {
		const formData = new FormData();

		if (userData?.userImage) {
			formData.append('userImage', userData.userImage);
		}

		await nuxtApp.$api.put<TUser>('/user', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then((response: AxiosResponse<TUser>) => {
			setUser(response.data)
		}).catch((error: AxiosError) => {
			return Promise.reject(error)
		});
	}

	return {
		user,
		setUser,
		getUser,
		updateUser
	}
})
