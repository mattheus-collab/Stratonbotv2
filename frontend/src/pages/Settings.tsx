import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
    const [salesFeePercent, setSalesFeePercent] = useState<number>(5.0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/admin/config');
            setSalesFeePercent(response.data.dados.salesFeePercent);
        } catch (error) {
            console.error('Error fetching config:', error);
            toast.error('Erro ao carregar configurações');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/admin/config', { salesFeePercent });
            toast.success('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving config:', error);
            toast.error('Erro ao salvar configurações');
        } finally {
            setLoading(false);
        }
    };

    const calculateExample = () => {
        const withdrawalAmount = 100;
        const fee = (withdrawalAmount * salesFeePercent) / 100;
        const netAmount = withdrawalAmount - fee;
        return { fee, netAmount };
    };

    const example = calculateExample();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
                <p className="text-gray-600 mt-1">Gerencie as configurações gerais da plataforma</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
                <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <SettingsIcon className="text-gray-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            Taxas do Sistema
                        </h2>
                        <p className="text-sm text-gray-600">
                            Configure as taxas aplicadas sobre vendas
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="fee"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Taxa de Venda (%)
                        </label>
                        <input
                            id="fee"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={salesFeePercent}
                            onChange={(e) => setSalesFeePercent(parseFloat(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Porcentagem descontada de cada venda confirmada
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Exemplo de Cálculo
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Com uma taxa de {salesFeePercent.toFixed(2)}%, uma venda de R$ 100,00 terá:
                        </p>
                        <ul className="space-y-1 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Taxa cobrada:</span>
                                <span className="font-medium text-gray-900">
                                    R$ {example.fee.toFixed(2)}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Valor creditado ao player:</span>
                                <span className="font-medium text-gray-900">
                                    R$ {example.netAmount.toFixed(2)}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
