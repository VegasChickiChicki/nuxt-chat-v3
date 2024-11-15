type TProps = {
	title: string
}

type TEmits = {
	(event: 'close-popup'): void
}

type TSlots = {
	default(): void
}

export type {
	TProps,
	TEmits,
	TSlots
}
