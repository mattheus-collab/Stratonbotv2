import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Shield, Check, X, Users, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>({});
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data.dados);

            const withdrawalsRes = await api.get('/admin/withdrawals');
            setWithdrawals(withdrawalsRes.data.dados);
        } catch (error) {
            console.error('Erro ao buscar dados do admin', error);
        }
    };

    const handleProcessWithdrawal = async (id: string, approved: boolean) => {
        try {
            await api.put(`/admin/withdrawals/${id}`, { approved });
            toast.success(`Saque ${approved ? 'aprovado' : 'rejeitado'}`);
            fetchData();
        } catch (error) {
            toast.error('Falha ao processar saque');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center text-gray-900">
                <Shield className="mr-3 text-red-500" /> Painel Administrativo
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 mb-2 text-sm font-medium uppercase">Total de Usuários</h3>
                    <p className="text-3xl font-bold flex items-center text-gray-900">
                        <Users className="mr-2 text-indigo-500" size={24} /> {stats.totalUsers || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 mb-2 text-sm font-medium uppercase">Total de Bots</h3>
                    <p className="text-3xl font-bold flex items-center text-gray-900">
                        <Activity className="mr-2 text-green-500" size={24} /> {stats.totalBots || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 mb-2 text-sm font-medium uppercase">Transações</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 mb-2 text-sm font-medium uppercase">Volume Total</h3>
                    <p className="text-3xl font-bold text-green-600">R$ {(stats.totalVolume || 0).toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Solicitações de Saque</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-3">Usuário</th>
                                <th className="px-6 py-3">Valor</th>
                                <th className="px-6 py-3">Chave PIX</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum saque pendente</td>
                                </tr>
                            ) : (
                                withdrawals.map((w: any) => (
                                    <tr key={w.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{w.user.name}</p>
                                                <p className="text-xs text-gray-500">{w.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">R$ {w.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{w.pixKey}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                w.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {w.status === 'APPROVED' ? 'Aprovado' : w.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {w.status === 'PENDING' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleProcessWithdrawal(w.id, true)}
                                                        className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                        title="Aprovar"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleProcessWithdrawal(w.id, false)}
                                                        className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                        title="Rejeitar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
