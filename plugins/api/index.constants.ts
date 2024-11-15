import type { CreateAxiosDefaults } from "axios";

const makeApiConfig = (): CreateAxiosDefaults => {
	const { apiPath } = useAppConfig()

	return {
		baseURL: apiPath,
		headers: {
			'Content-Type': 'application/json',
		}
	}
}

export {
	makeApiConfig
}
