import axios from "axios";
import { useAuthStore } from "~/stores/auth/auth";
import { makeApiConfig } from './index.constants'

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();
	const { authToken } = storeToRefs(authStore);
	const api = axios.create(makeApiConfig());
	const clearAuthToken = (): void => {
		useCookie('authToken').value = null
	}

	api.interceptors.request.use((config) => {
		if (authToken.value) {
			config.headers['Authorization'] = `Bearer ${authToken.value}`;
		}

		return config;
	}, (error) => {
		return Promise.reject(error)
	});

	api.interceptors.response.use((response) => response, async (error) => {
		if (error.response && error.response.status === 401) {
			clearAuthToken();

			navigateTo('/login')
		}

		return Promise.reject(error)
	});

	return {
		provide: {
			api
		}
	}
})
