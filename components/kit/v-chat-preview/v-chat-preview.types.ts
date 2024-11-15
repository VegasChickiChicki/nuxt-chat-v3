import type { TUser } from "~/stores/user/user.types";

type TProps = {
	chatId: string,
	chatName: string,
	chatOwner: Omit<TUser, 'token'>,
	chatUsers: Omit<TUser, 'token'>[],
}

export type {
	TProps
}
