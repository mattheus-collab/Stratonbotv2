import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bots from './pages/Bots';
import Finance from './pages/Finance';
import AdminDashboard from './pages/AdminDashboard';
import Withdrawals from './pages/Withdrawals';
import Settings from './pages/Settings';
import BotForm from './pages/BotForm';
import Profile from './pages/Profile';
import Users from './pages/Users';
import AdminWithdrawals from './pages/AdminWithdrawals';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/bots" element={<Bots />} />
                            <Route path="/bots/new" element={<BotForm />} />
                            <Route path="/bots/:id" element={<BotForm />} />
                            <Route path="/finance" element={<Finance />} />
                            <Route path="/withdrawals" element={<Withdrawals />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute adminOnly />}>
                        <Route element={<Layout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
                <ToastContainer theme="dark" />
            </AuthProvider>
        </Router>
    );
}

export default App;
