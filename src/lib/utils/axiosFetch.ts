import { PUBLIC_API_VERSION } from '$env/static/public';

import axios from 'axios';

export const axiosFetch = axios.create({
	baseURL: `/api/v${PUBLIC_API_VERSION}`,
	withCredentials: true,
});
