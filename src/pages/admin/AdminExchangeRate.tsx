import React, { useState, useEffect } from 'react';
import { getExchangeRate, saveExchangeRate, type ExchangeRate } from '../../utils/storage';

export default function AdminExchangeRate() {
    const [rate, setRate] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const currentRate = getExchangeRate();
        setRate(currentRate.krwToMnt);
        setLastUpdated(currentRate.lastUpdated);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const newRateData: ExchangeRate = {
                krwToMnt: rate,
                lastUpdated: new Date().toISOString()
            };
            saveExchangeRate(newRateData);
            setLastUpdated(newRateData.lastUpdated);
            setMessage({ type: 'success', text: 'Ханш амжилттай шинэчлэгдлээ! Бүх машины үнэ автоматаар шинэчлэгдсэн.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Хадгалахад алдаа гарлаа.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Ханшны тохиргоо</h1>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <form onSubmit={handleSave}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Солонгос вон (KRW) &rarr; Монгол төгрөг (MNT)
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">1 KRW =</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full pl-20 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-bold"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">MNT</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Энэ ханшийг өөрчилснөөр бүх машины "Монголд очих үнэ" автоматаар шинэчлэгдэнэ.
                        </p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-400">
                            Сүүлд шинэчилсэн: {new Date(lastUpdated).toLocaleString()}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Example Calculation Card */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Жишээ бодолт:</h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                    <div className="flex justify-between">
                        <span>10,000,000 KRW машин</span>
                        <span className="font-bold">&rarr; {(10000000 * rate / 1000000).toFixed(1)} сая ₮</span>
                    </div>
                    <div className="flex justify-between">
                        <span>25,000,000 KRW машин</span>
                        <span className="font-bold">&rarr; {(25000000 * rate / 1000000).toFixed(1)} сая ₮</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
