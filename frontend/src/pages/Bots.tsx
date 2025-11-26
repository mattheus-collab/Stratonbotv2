import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bot as BotIcon, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Bot {
    id: string;
    name: string;
    apiKey: string;
    config: any;
    createdAt: string;
}

const Bots: React.FC = () => {
    const [bots, setBots] = useState<Bot[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBots();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await api.get('/bots');
            setBots(response.data.dados);
        } catch (error) {
            toast.error('Falha ao carregar bots');
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meus Bots</h1>
                    <p className="text-gray-600 mt-1">Gerencie seus bots de vendas</p>
                </div>
                <button
                    onClick={() => navigate('/bots/new')}
                    className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    <span>Criar Novo Bot</span>
                </button>
            </div>

            {bots.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <BotIcon className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum bot criado
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Crie seu primeiro bot para começar a automatizar suas vendas
                    </p>
                    <button
                        onClick={() => navigate('/bots/new')}
                        className="inline-flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Plus size={20} />
                        <span>Criar Meu Primeiro Bot</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map((bot) => (
                        <div
                            key={bot.id}
                            onClick={() => navigate(`/bots/${bot.id}`)}
                            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BotIcon className="text-gray-600" size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {bot.name || 'Bot sem nome'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Criado em {new Date(bot.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                    {bot.config?.status || 'Configurando'}
                                </span>
                                <span className="text-xs font-medium text-blue-600">
                                    Ver detalhes →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bots;
