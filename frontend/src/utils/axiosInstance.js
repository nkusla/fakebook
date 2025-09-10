import axios from 'axios';
import router from '@/router';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3000/api',
	withCredentials: true
});

axiosInstance.interceptors.response.use(
	res => res,
	error => {
		if (error.response.status === 401) {
			redirectToLogin();
		} else if (error.response.status === 403) {
			if (error.response?.data?.suspendType === 'LOGIN_BAN' || error.response?.data?.suspendType === 'PERMANENT_BAN') {
				redirectToLogin();
			}
		}

		return Promise.reject(error);
	}
);

function redirectToLogin() {
	localStorage.removeItem('auth');
	router.replace({ path: '/' });
}


export default axiosInstance;