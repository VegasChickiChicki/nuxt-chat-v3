type TEmits = {
	(event: 'send-message', message: string): void,
	(event: 'focus-input'): void,
	(event: 'blur-input'): void,
	(event: 'upload-files', files: FileList): void
}

export type {
	TEmits
}
