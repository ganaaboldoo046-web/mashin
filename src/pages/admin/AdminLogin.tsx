import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple mock authentication
        // In a real app, this would verify with a backend
        if (email === 'admin@somang.com' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            // Navigate to admin dashboard
            navigate('/admin');
        } else {
            setError('Имэйл эсвэл нууц үг буруу байна.'); // Invalid email or password
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Somang Admin</h1>
                    <p className="text-slate-500 dark:text-slate-400">Нэвтрэх хэсэг</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Имэйл
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            placeholder="admin@somang.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Нууц үг
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
                    >
                        Нэвтрэх
                    </button>
                </form>
            </div>
        </div>
    );
}
