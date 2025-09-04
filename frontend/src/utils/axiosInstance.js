import axios from 'axios';
import router from '@/router';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3000/api',
	withCredentials: true
});

axiosInstance.interceptors.response.use(
	res => res,
	error => {
		if (error.response.status === 401 || error.response.status === 403) {
			localStorage.removeItem('auth');
			router.replace({ path: '/' });
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;