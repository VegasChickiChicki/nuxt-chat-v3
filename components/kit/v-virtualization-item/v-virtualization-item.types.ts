type TProps = {
	position: number,
	id: string,
	resizeObserver: ResizeObserver | null
}

type TSlots = {
	default(): void
}

export type {
	TProps,
	TSlots
}
