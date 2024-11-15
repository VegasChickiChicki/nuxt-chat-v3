import type { TUser } from "~/stores/user/user.types";

type TProps = {
	user: Omit<TUser, 'token'>
}

export type {
	TProps
}
