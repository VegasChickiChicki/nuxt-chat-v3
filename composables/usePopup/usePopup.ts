const usePopup = () => {
	const popupState = ref<boolean>(false);

	const setPopupState = (state: boolean) => {
		popupState.value = state;
	}

	return {
		popupState,
		setPopupState,
	}
}

export {
	usePopup
}
