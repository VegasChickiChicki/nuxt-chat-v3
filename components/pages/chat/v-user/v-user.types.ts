import type { TUser } from "~/stores/user/user.types";

type TProps = {
	user: Omit<TUser, 'token'>,
	role: string,
	tag?: string,
	showStatus?: boolean,
	showLastOnline?: boolean
}

export type {
	TProps
}
