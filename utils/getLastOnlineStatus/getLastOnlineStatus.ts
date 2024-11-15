const getLastOnlineStatus = (lastOnlineDate: string): string => {
	const lastOnline: Date = new Date(lastOnlineDate);
	const now: Date = new Date();

	const diffInSeconds: number = Math.floor((now.getTime() - lastOnline.getTime()) / 1000);
	const diffInMinutes: number = Math.floor(diffInSeconds / 60);
	const diffInHours: number = Math.floor(diffInMinutes / 60);
	const diffInDays: number = Math.floor(diffInHours / 24);

	if (diffInSeconds < 60) {
		return 'Online recently';
	}

	if (diffInMinutes < 60) {
		return `Online ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
	}

	if (diffInHours < 24) {
		return `Online ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
	}

	if (diffInDays === 1) {
		return 'Online yesterday';
	}

	if (diffInDays < 7) {
		return `Online ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
	}

	return 'Online a long time ago';
};

export {
	getLastOnlineStatus
}
