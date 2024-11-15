type TProps = {
	name: string,
	title?: string,
	type?: string,
	helperText?: string,
	modelValue?: string,
	disabled?: boolean,
	placeholder?: string,
	autocomplete?: 'off' | 'on'
}

type TEmits = {
	(event: 'update:model-value', value: string): void,
	(event: 'blur-input'): void,
}

export type {
	TProps,
	TEmits
}
