import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Download, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface Withdrawal {
    id: string;
    amount: number;
    pixKey: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

const AdminWithdrawals: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            const response = await api.get('/admin/withdrawals');
            setWithdrawals(response.data.dados);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            toast.error('Erro ao carregar saques');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/admin/withdrawals/${id}`, { status: 'APPROVED' });
            toast.success('Saque aprovado!');
            fetchWithdrawals();
        } catch (error) {
            toast.error('Erro ao aprovar saque');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await api.patch(`/admin/withdrawals/${id}`, { status: 'REJECTED' });
            toast.success('Saque recusado!');
            fetchWithdrawals();
        } catch (error) {
            toast.error('Erro ao recusar saque');
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-600">Carregando saques...</p>
            </div>
        );
    }

    const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING');
    const processedWithdrawals = withdrawals.filter((w) => w.status !== 'PENDING');

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Aprovação de Saques</h1>
                <p className="text-gray-600 mt-1">Gerencie solicitações de saque</p>
            </div>

            {/* Pending Withdrawals */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pendentes</h2>
                {pendingWithdrawals.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Download className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-gray-600">Nenhum saque pendente</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingWithdrawals.map((withdrawal) => (
                            <div
                                key={withdrawal.id}
                                className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {withdrawal.user.name}
                                        </h3>
                                        <span className="text-2xl font-bold text-gray-900">
                                            R$ {withdrawal.amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Email</p>
                                            <p className="text-gray-900">{withdrawal.user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Chave PIX</p>
                                            <p className="text-gray-900 font-mono">{withdrawal.pixKey}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Data</p>
                                            <p className="text-gray-900">
                                                {new Date(withdrawal.createdAt).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-6">
                                    <button
                                        onClick={() => handleApprove(withdrawal.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors"
                                        title="Aprovar"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(withdrawal.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors"
                                        title="Recusar"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Processed Withdrawals */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Processados</h2>
                {processedWithdrawals.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">Nenhum saque processado</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Usuário
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Chave PIX
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedWithdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {withdrawal.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            R$ {withdrawal.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {withdrawal.pixKey}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${withdrawal.status === 'APPROVED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {withdrawal.status === 'APPROVED' ? 'Aprovado' : 'Recusado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(withdrawal.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWithdrawals;
