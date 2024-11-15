type TProps = {
	image: File
}

type TEmits = {
	(event: 'remove-file', fileName: string): void,
	(event: 'change-file', fileName: string): void,
}

export type {
	TProps,
	TEmits
}
