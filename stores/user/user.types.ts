type TUser = {
	id: string,
	login: string,
	email: string,
	token: string,
	isOnline: boolean,
	image: string,
	lastOnlineDate: string,
	description: string
}

type TUpdateUserRequest = {
	userImage?: File
}

export type {
	TUser,
	TUpdateUserRequest
}
