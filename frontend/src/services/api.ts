cimport axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@StratonBot:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.mensagem || 'Ocorreu um erro inesperado';

        if (error.response?.status === 401) {
            localStorage.removeItem('@StratonBot:token');
            localStorage.removeItem('@StratonBot:user');
            window.location.href = '/login';
            toast.error('Sessão expirada. Faça login novamente.');
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
