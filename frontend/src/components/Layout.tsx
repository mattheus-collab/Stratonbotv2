import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Bot, Users, Download, Settings, LogOut, Wallet } from 'lucide-react';
import clsx from 'clsx';

const Layout: React.FC = () => {
    const { signOut, user } = useAuth();
    const location = useLocation();

    const userNavItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Meus Bots', path: '/bots', icon: Bot },
        { name: 'Financeiro', path: '/finance', icon: Wallet },
        { name: 'Meus Saques', path: '/withdrawals', icon: Download },
        { name: 'Perfil', path: '/profile', icon: Users },
    ];

    const adminNavItems = user?.role === 'ADMIN' ? [
        { name: 'Usuários', path: '/users', icon: Users },
        { name: 'Aprovar Saques', path: '/admin/withdrawals', icon: Download },
        { name: 'Configurações', path: '/settings', icon: Settings }
    ] : [];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <Bot className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">StratonBot</h1>
                            <p className="text-xs text-gray-500">
                                {user?.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-3 py-4 flex-1 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Menu
                    </p>
                    <nav className="space-y-1">
                        {userNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {adminNavItems.length > 0 && (
                        <>
                            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">
                                Administração
                            </p>
                            <nav className="space-y-1">
                                {adminNavItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={clsx(
                                                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            )}
                                        >
                                            <Icon size={20} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </>
                    )}
                </div>

                <div className="mt-auto p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || 'Stratonpay adm'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors w-full text-sm"
                    >
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
