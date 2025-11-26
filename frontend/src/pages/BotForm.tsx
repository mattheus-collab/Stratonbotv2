import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Bot as BotIcon, Save, ArrowLeft } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    value: number;
}

const BotForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        botToken: '',
        status: 'Em Teste',
        welcomeMessage: 'Olá! Bem-vindo ao nosso bot de vendas...',
        welcomePhoto: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    // Product management
    const [products, setProducts] = useState<Product[]>([]);
    const [newProductTitle, setNewProductTitle] = useState('');
    const [newProductValue, setNewProductValue] = useState('');

    useEffect(() => {
        if (id) {
            fetchBot();
        }
    }, [id]);

    const fetchBot = async () => {
        try {
            const response = await api.get(`/bots/${id}`);
            const bot = response.data.dados;
            setFormData({
                name: bot.name || '',
                botToken: bot.apiKey || '',
                status: bot.config?.status || 'Em Teste',
                welcomeMessage: bot.config?.welcomeMessage || 'Olá! Bem-vindo ao nosso bot de vendas...',
                welcomePhoto: bot.config?.welcomePhoto || '',
            });
            if (bot.config?.welcomePhoto) {
                setPhotoPreview(bot.config.welcomePhoto);
            }
            if (bot.config?.products) {
                setProducts(bot.config.products);
            }
        } catch (error) {
            toast.error('Erro ao carregar bot');
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = () => {
        if (!newProductTitle.trim() || !newProductValue) {
            toast.error('Preencha título e valor do produto');
            return;
        }

        const value = parseFloat(newProductValue);
        if (isNaN(value) || value <= 0) {
            toast.error('Valor inválido');
            return;
        }

        const newProduct: Product = {
            id: Date.now().toString(),
            title: newProductTitle.trim(),
            value: value
        };

        setProducts([...products, newProduct]);
        setNewProductTitle('');
        setNewProductValue('');
        toast.success('Produto adicionado!');
    };

    const handleRemoveProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Produto removido!');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, you would upload the photo to a storage service
            // For now, we'll use the preview as the welcomePhoto
            const payload = {
                name: formData.name,
                apiKey: formData.botToken,
                config: {
                    welcomePhoto: photoPreview || formData.welcomePhoto,
                    status: formData.status,
                    welcomeMessage: formData.welcomeMessage,
                    products: products,
                },
            };

            if (id) {
                await api.put(`/bots/${id}`, payload);
                toast.success('Bot atualizado com sucesso!');
            } else {
                await api.post('/bots', payload);
                toast.success('Bot criado com sucesso!');
            }
            navigate('/bots');
        } catch (error) {
            toast.error('Erro ao salvar bot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <button
                onClick={() => navigate('/bots')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                <span>Voltar</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {id ? 'Configurações Gerais' : 'Criar Novo Bot'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Bot
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Bot de Vendas Premium"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto de Boas-vindas
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor="photo-upload"
                                        className="cursor-pointer bg-white px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium text-gray-700"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>Escolher Imagem</span>
                                    </label>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Imagem que será exibida na mensagem de boas-vindas
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Token do BotFather
                                </label>
                                <input
                                    type="text"
                                    value={formData.botToken}
                                    onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                                    placeholder="123456789:ABCdefGHIjkLMNopqrsTUVwxyz"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Token fornecido pelo @BotFather do Telegram
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                    <option value="Em Teste">Em Teste</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensagem de Boas-vindas
                                </label>
                                <textarea
                                    value={formData.welcomeMessage}
                                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                    rows={4}
                                    placeholder="Olá! Bem-vindo ao nosso bot de vendas..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Mensagem enviada quando o cliente inicia contato
                                </p>
                            </div>

                            {/* Products Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Produtos / Opções de Valores
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Configure os produtos que aparecerão como botões no Telegram
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Título do Produto
                                        </label>
                                        <input
                                            type="text"
                                            value={newProductTitle}
                                            onChange={(e) => setNewProductTitle(e.target.value)}
                                            placeholder="Ex: Produto Premium"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor (R$)
                                        </label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={newProductValue}
                                                onChange={(e) => setNewProductValue(e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddProduct}
                                                className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition-colors font-medium whitespace-nowrap"
                                            >
                                                Adicionar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {products.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Produtos Cadastrados:</p>
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.title}</p>
                                                    <p className="text-sm text-gray-600">R$ {product.value.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                <Save size={18} />
                                <span>{loading ? 'Salvando...' : id ? 'Salvar Alterações' : 'Criar Bot'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <BotIcon size={20} className="text-gray-600" />
                            <h3 className="font-semibold text-gray-900">Preview do Bot</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Veja como seu bot aparecerá no Telegram
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="Bot preview"
                                    className="w-16 h-16 rounded-full mb-3 object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                                    <BotIcon size={32} className="text-gray-400" />
                                </div>
                            )}
                            <p className="font-medium text-gray-900 mb-1">
                                {formData.name || 'Nome do Bot'}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">• offline</p>
                            {formData.welcomeMessage && (
                                <div className="bg-white rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                                    {formData.welcomeMessage}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Adicione uma mensagem de boas-vindas
                            </p>
                            <p className="text-xs text-gray-500 text-center">para ver o preview</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-gray-900">{formData.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotForm;
