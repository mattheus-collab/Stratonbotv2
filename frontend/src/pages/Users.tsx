import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users as UsersIcon } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
    id: string;
    name: string;
    email: string;
    pixKeys?: Array<{ keyValue: string }>;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.dados);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <p className="text-gray-600">Carregando usuários...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                <p className="text-gray-600 mt-1">Lista de usuários da plataforma</p>
            </div>

            {users.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <UsersIcon className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum usuário encontrado
                    </h3>
                    <p className="text-gray-600">Os usuários aparecerão aqui</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-semibold text-sm">
                                        {user.name?.substring(0, 2).toUpperCase() || 'US'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </p>
                                    <p className="text-sm text-gray-900 truncate">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Chave PIX
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {user.pixKeys && user.pixKeys.length > 0
                                            ? user.pixKeys[0].keyValue
                                            : 'Não cadastrada'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;
