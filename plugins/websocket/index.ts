import { SOCKET_ADDRESS } from './index.constants'
import { io } from "socket.io-client";
import { useAuthStore } from "~/stores/auth/auth";

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();
	const socket = io(SOCKET_ADDRESS, {
		extraHeaders: {
			Authorization: `Bearer ${authStore.authToken}`
		}
	});

	return {
		provide: {
			socket
		}
	}
})
