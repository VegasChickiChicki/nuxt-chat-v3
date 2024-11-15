import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth/auth';
import { useUserStore } from '@/stores/user/user'



export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	const userStore = useUserStore();
	const { authState, authToken } = storeToRefs(authStore);

	if (!authState.value && authToken.value !== undefined && authToken.value !== null) {
		await userStore.getUser().then(() => {
			authStore.setAuthState(true)
		}).catch(() => {
			authStore.setAuthState(false)
		})
	}

	if (!authState.value && to.path !== '/login') {
		return navigateTo('/login');
	}
});
