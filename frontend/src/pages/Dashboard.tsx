import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, Bot, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [balance, setBalance] = useState(0);
    const [botsCount, setBotsCount] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const balanceRes = await api.get('/finance/balance');
                setBalance(balanceRes.data.dados.balance);

                const botsRes = await api.get('/bots');
                setBotsCount(botsRes.data.dados.length);

                const transRes = await api.get('/finance/transactions');
                setTransactions(transRes.data.dados.slice(0, 5)); // Últimas 5 transações
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Saldo Total</h3>
                        <DollarSign className="text-green-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">R$ {balance.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Bots Ativos</h3>
                        <Bot className="text-blue-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{botsCount}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Total de Vendas</h3>
                        <Activity className="text-purple-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Transações Recentes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Nenhuma transação encontrada
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{t.type}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                                            R$ {t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(t.createdAt).toLocaleDateString('pt-BR')}
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

export default Dashboard;
