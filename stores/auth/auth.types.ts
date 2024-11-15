type TRegisterUser = {
	login: string,
	email: string,
	password: string
}

type TLoginUser = {
	login: string,
	password: string
}

type TRegisterValidationError = {
	errorText: string,
	errorType: 'email' | 'login' | 'password'
}

type TLoginValidationError = {
	errorText: string,
	errorType: 'login' | 'password'
}

export type {
	TRegisterUser,
	TLoginUser,
	TRegisterValidationError,
	TLoginValidationError
}
