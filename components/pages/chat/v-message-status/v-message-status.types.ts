type TProps = {
	statusActive: boolean,
	statusType: string,
	statusCount: number
}

type TEmits = {
	(event: 'handle-click', statusType: string): void,
}

export type {
	TProps,
	TEmits
}
