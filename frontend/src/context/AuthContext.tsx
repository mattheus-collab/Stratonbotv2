import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    balance?: number;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    logout: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadStorageData = async () => {
            const storedToken = localStorage.getItem('@StratonBot:token');
            const storedUser = localStorage.getItem('@StratonBot:user');

            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                setSigned(true);
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const login = async (data: LoginData) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data.dados;

            localStorage.setItem('@StratonBot:token', token);
            localStorage.setItem('@StratonBot:user', JSON.stringify(user));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            setSigned(true);
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('@StratonBot:token');
        localStorage.removeItem('@StratonBot:user');
        setUser(null);
        setSigned(false);
        toast.info('Logout realizado com sucesso');
        navigate('/login');
    };

    const signOut = () => {
        localStorage.removeItem('@StratonBot:token');
        localStorage.removeItem('@StratonBot:user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ signed, user, loading, login, logout, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
