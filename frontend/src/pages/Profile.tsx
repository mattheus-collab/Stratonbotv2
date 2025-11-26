import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Key } from 'lucide-react';
import { toast } from 'react-toastify';

interface PixKey {
    id: string;
    keyType: string;
    keyValue: string;
    createdAt: string;
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
    const [newPixKeyType, setNewPixKeyType] = useState('CPF');
    const [newPixKeyValue, setNewPixKeyValue] = useState('');

    useEffect(() => {
        fetchPixKeys();
    }, []);

    const fetchPixKeys = async () => {
        try {
            const response = await api.get('/finance/pix-keys');
            setPixKeys(response.data.dados);
        } catch (error) {
            console.error('Error fetching PIX keys:', error);
        }
    };

    const handleAddPixKey = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/pix-keys', {
                keyType: newPixKeyType,
                keyValue: newPixKeyValue,
            });
            toast.success('Chave PIX adicionada com sucesso!');
            setNewPixKeyValue('');
            fetchPixKeys();
        } catch (error) {
            toast.error('Erro ao adicionar chave PIX');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
                <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
            </div>

            <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Informações da Conta
                            </h2>
                            <p className="text-sm text-gray-600">Suas informações básicas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome
                            </label>
                            <p className="text-gray-900 font-medium">{user?.name || 'Mattheus Santos'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900 font-medium">{user?.email || 'mattheussla@gmail.com'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Função
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user?.role === 'ADMIN' ? 'Admin' : 'Player'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Conta criada em
                            </label>
                            <p className="text-gray-900 font-medium">24 de novembro de 2025</p>
                        </div>
                    </div>
                </div>

                {/* PIX Configuration */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Key className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Configurações PIX
                            </h2>
                            <p className="text-sm text-gray-600">
                                Configure sua chave PIX para receber saques
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleAddPixKey} className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Chave PIX
                                </label>
                                <select
                                    value={newPixKeyType}
                                    onChange={(e) => setNewPixKeyType(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                >
                                    <option value="CPF">CPF</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="PHONE">Telefone</option>
                                    <option value="RANDOM">Chave Aleatória</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chave PIX
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newPixKeyValue}
                                        onChange={(e) => setNewPixKeyValue(e.target.value)}
                                        placeholder="Digite sua chave PIX"
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {pixKeys.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Chaves PIX Cadastradas
                            </h3>
                            <div className="space-y-2">
                                {pixKeys.map((key) => (
                                    <div
                                        key={key.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {key.keyType}
                                            </p>
                                            <p className="text-sm text-gray-600 font-mono">
                                                {key.keyValue}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            Adicionada em{' '}
                                            {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
