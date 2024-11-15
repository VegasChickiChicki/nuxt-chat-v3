import type { AxiosResponse, AxiosError } from "axios";
import type { TUser } from "~/stores/user/user.types";
import type {
	TRegisterUser,
	TLoginUser,
	TRegisterValidationError,
	TLoginValidationError
} from './auth.types'

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
	const nuxtApp = useNuxtApp()

	const authState = ref<boolean>(false)
	const loginState = ref<boolean>(true)

	const setAuthState = (state: boolean): void => {
		authState.value = state
	}
	const toggleLoginState = () => {
		loginState.value = !loginState.value
	}
	const registerUser = async (user: TRegisterUser): Promise<TUser> => {
		return await nuxtApp.$api.post('user/register', {
			data: user
		}).then((response: AxiosResponse<TUser>) => {
			return response.data;
		}).catch((errors: AxiosError<TRegisterValidationError[]>) => {
			let errorsList: TRegisterValidationError[] = []

			if (errors.response?.data?.length) {
				errorsList = errors.response?.data
			}

			return Promise.reject(errorsList)
		});
	}
	const loginUser = async (user: TLoginUser): Promise<TUser> => {
		return await nuxtApp.$api.post('user/auth', user).then((response: AxiosResponse<TUser>) => {
			return response.data;
		}).catch((errors: AxiosError<TLoginValidationError[]>) => {
			let errorsList: TLoginValidationError[] = []

			if (errors.response?.data?.length) {
				errorsList = errors.response?.data
			}

			return Promise.reject(errorsList)
		});
	}
	const logoutUser = async (): Promise<void> => {
		return await nuxtApp.$api.post('user/logout');
	}

	const authToken = computed<string | null>(() => useCookie('authToken').value || null)

	return {
		authState,
		loginState,
		authToken,
		setAuthState,
		toggleLoginState,
		registerUser,
		loginUser,
		logoutUser
	}
})
