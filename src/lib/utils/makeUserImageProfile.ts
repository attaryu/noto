export function makeUserImageProfile(fullname: string) {
	const baseUrl = 'https://ui-avatars.com/api';

	const searchParam = new URLSearchParams();

	searchParam.append('name', fullname);
	searchParam.append('background', 'random');
	searchParam.append('color', 'random');

	return `${baseUrl}/?${searchParam.toString()}`;
}
