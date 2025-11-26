import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Wallet, TrendingUp, Download, Receipt, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface Transaction {
    id: string;
    amount: number;
    fee: number;
    netAmount: number;
    type: string;
    status: string;
    createdAt: string;
}

interface PixKey {
    id: string;
    keyType: string;
    keyValue: string;
}

const Finance: React.FC = () => {
    const [balance, setBalance] = useState(0);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalWithdrawn, setTotalWithdrawn] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pixKeys, setPixKeys] = useState<PixKey[]>([]);

    // Modals
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [showPixModal, setShowPixModal] = useState(false);

    // Withdrawal form
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedPixKey, setSelectedPixKey] = useState('');

    // PIX form
    const [newPixKeyType, setNewPixKeyType] = useState('CPF');
    const [newPixKeyValue, setNewPixKeyValue] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const balanceRes = await api.get('/finance/balance');
            setBalance(balanceRes.data.dados.balance);

            const transactionsRes = await api.get('/finance/transactions');
            const txs = transactionsRes.data.dados;
            setTransactions(txs);

            const received = txs
                .filter((t: Transaction) => t.type === 'CREDIT' && t.status === 'COMPLETED')
                .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
            setTotalReceived(received);

            const withdrawalsRes = await api.get('/finance/withdrawals');
            const withdrawn = withdrawalsRes.data.dados
                .filter((w: any) => w.status === 'APPROVED' || w.status === 'PAID')
                .reduce((sum: number, w: any) => sum + w.amount, 0);
            setTotalWithdrawn(withdrawn);

            const pixKeysRes = await api.get('/finance/pix-keys');
            setPixKeys(pixKeysRes.data.dados);
            if (pixKeysRes.data.dados.length > 0) {
                setSelectedPixKey(pixKeysRes.data.dados[0].keyValue);
            }
        } catch (error) {
            console.error('Error fetching finance data', error);
        }
    };

    const handleWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPixKey) {
            toast.error('Selecione uma chave PIX');
            return;
        }
        try {
            await api.post('/finance/withdrawals', {
                amount: parseFloat(withdrawAmount),
                pixKey: selectedPixKey,
            });
            toast.success('Solicitação de saque enviada!');
            setWithdrawAmount('');
            setShowWithdrawalModal(false);
            fetchData();
        } catch (error: any) {
            // Error handled by api interceptor
            console.error('Erro ao solicitar saque:', error);
        }
    };

    const handleAddPixKey = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/pix-keys', {
                keyType: newPixKeyType,
                keyValue: newPixKeyValue,
            });
            toast.success('Chave PIX adicionada!');
            setNewPixKeyValue('');
            setShowPixModal(false);
            fetchData();
        } catch (error) {
            // Error handled by api interceptor
            console.error('Erro ao adicionar chave PIX:', error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
                    <p className="text-gray-600 mt-1">Gerencie suas finanças e transações</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowPixModal(true)}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors font-medium border border-gray-300"
                    >
                        <span>Configurar PIX</span>
                    </button>
                    <button
                        onClick={() => setShowWithdrawalModal(true)}
                        className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                    >
                        <Download size={18} />
                        <span>Solicitar Saque</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Saldo Disponível</span>
                        <Wallet className="text-gray-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">R$ {balance.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Disponível para saque</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Total Recebido</span>
                        <TrendingUp className="text-gray-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">R$ {totalReceived.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Vendas confirmadas</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Total Sacado</span>
                        <Download className="text-gray-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">R$ {totalWithdrawn.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Saques aprovados</p>
                </div>
            </div>

            {/* Transactions History */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Receipt className="mr-2 text-gray-600" size={20} />
                        Histórico de Transações
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Todas as suas transações financeiras</p>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <Receipt className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Nenhuma transação ainda
                        </h3>
                        <p className="text-gray-600">Suas transações aparecerão aqui</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Taxa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Líquido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'CREDIT'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {tx.type === 'CREDIT' ? 'Crédito' : 'Débito'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            R$ {tx.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            R$ {tx.fee.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            R$ {tx.netAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tx.status === 'FAILED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {tx.status === 'COMPLETED'
                                                    ? 'Concluído'
                                                    : tx.status === 'FAILED'
                                                        ? 'Falhou'
                                                        : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Solicitar Saque</h2>
                            <button
                                onClick={() => setShowWithdrawalModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleWithdrawal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valor do Saque
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chave PIX
                                </label>
                                <select
                                    value={selectedPixKey}
                                    onChange={(e) => setSelectedPixKey(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                    required
                                >
                                    {pixKeys.map((key) => (
                                        <option key={key.id} value={key.keyValue}>
                                            {key.keyType}: {key.keyValue}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                Solicitar Saque
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PIX Modal */}
            {showPixModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Configurar PIX</h2>
                            <button
                                onClick={() => setShowPixModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPixKey} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Chave
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chave PIX
                                </label>
                                <input
                                    type="text"
                                    value={newPixKeyValue}
                                    onChange={(e) => setNewPixKeyValue(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Digite sua chave PIX"
                                    required
                                />
                            </div>
                            {pixKeys.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                        Chaves Cadastradas
                                    </h3>
                                    <div className="space-y-1">
                                        {pixKeys.map((key) => (
                                            <p key={key.id} className="text-sm text-gray-600">
                                                {key.keyType}: {key.keyValue}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                Adicionar Chave PIX
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
