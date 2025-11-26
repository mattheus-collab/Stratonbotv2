import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Download } from 'lucide-react';

interface Withdrawal {
    id: string;
    amount: number;
    status: string;
    pixKey: string;
    createdAt: string;
}

const Withdrawals: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            const response = await api.get('/finance/withdrawals');
            setWithdrawals(response.data.dados);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Saques</h1>
                <p className="text-gray-600 mt-1">Gerencie as solicitações de saque</p>
            </div>

            {withdrawals.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <Download className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum saque solicitado
                    </h3>
                    <p className="text-gray-600">
                        As solicitações de saque aparecerão aqui
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chave PIX
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(withdrawal.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        R$ {withdrawal.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {withdrawal.pixKey}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${withdrawal.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : withdrawal.status === 'APPROVED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {withdrawal.status === 'PENDING'
                                                ? 'Pendente'
                                                : withdrawal.status === 'APPROVED'
                                                    ? 'Aprovado'
                                                    : 'Rejeitado'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
