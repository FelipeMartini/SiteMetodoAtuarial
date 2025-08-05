import jwtDecode, { JwtPayload } from 'jwt-decode';

export const isTokenValid = (accessToken: string) => {
	if (accessToken) {
		try {
			const decoded = jwtDecode<JwtPayload>(accessToken);
			const currentTime = Date.now() / 1000;
			return decoded.exp > currentTime;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	return false;
};
