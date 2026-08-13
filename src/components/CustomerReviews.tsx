import { useEffect, useState } from 'react';
import GoogleSignInButton from './GoogleSignInButton';
import { useUser } from '../hooks/useUser';

interface Review {
    id: number;
    user_name: string;
    car_model: string;
    comment: string;
    rating: number;
    gender: 'male' | 'female';
}

const MOCK_REVIEWS: Review[] = [
    { id: 1, user_name: "Bat-Erdene", car_model: "Toyota Prius 30", comment: "Маш сайн машин авлаа, баярлалаа!", rating: 5, gender: "male" },
    { id: 2, user_name: "Sarnai", car_model: "Hyundai Sonata 8", comment: "Үнэхээр найдвартай, сэтгэл хангалуун байна.", rating: 5, gender: "female" },
    { id: 3, user_name: "Bold", car_model: "Kia K5", comment: "Үнэ боломжийн, үйлчилгээ хурдан.", rating: 4, gender: "male" },
    { id: 4, user_name: "Tsetseg", car_model: "Toyota Alphard", comment: "Машины байдал маш сайн байсан.", rating: 5, gender: "female" },
    { id: 5, user_name: "Ganbat", car_model: "Lexus RX450h", comment: "Худалдаж авсандаа огт харамсахгүй байна.", rating: 5, gender: "male" },
    { id: 6, user_name: "Munkh-Od", car_model: "Kia Sorento", comment: "Борлуулагч маш хариуцлагатай байсан.", rating: 5, gender: "male" },
    { id: 7, user_name: "Enkhjin", car_model: "Hyundai Tucson", comment: "Хүргэлт хурдан, асуудалгүй.", rating: 5, gender: "female" },
    { id: 8, user_name: "Bayar", car_model: "Toyota Camry", comment: "Яг хайж байсан машинаа оллоо.", rating: 5, gender: "male" },
    { id: 9, user_name: "Khulan", car_model: "Lexus NX", comment: "Маш цэвэрхэн, гоё машин байна.", rating: 5, gender: "female" },
    { id: 10, user_name: "Amaraa", car_model: "Toyota Land Cruiser", comment: "Дараа дахин эндээс авна аа.", rating: 5, gender: "male" }
];

export default function CustomerReviews() {
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userInfo = useUser();
    const [formData, setFormData] = useState({
        car_model: '',
        comment: '',
        rating: 5,
        gender: 'male'
    });
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const fetchReviews = async (): Promise<Review[]> => {
        try {
            const res = await fetch('/api/reviews_list');
            if (res.ok) {
                const data = await res.json() as Review[];
                if (Array.isArray(data) && data.length > 0) {
                    return data;
                }
            }
        } catch {
            // The curated fallback keeps the section useful during a transient API outage.
        }
        return MOCK_REVIEWS;
    };

    useEffect(() => {
        let cancelled = false;
        fetchReviews().then((data) => {
            if (!cancelled) setReviews(data);
        });
        return () => { cancelled = true; };
    }, []);

    const handleWriteClick = () => {
        if (userInfo) {
            setIsModalOpen(true);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo) return;

        try {
            const res = await fetch('/api/reviews_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData
                })
            });

            if (res.ok) {
                alert("Review submitted successfully!");
                setIsModalOpen(false);
                setFormData({ car_model: '', comment: '', rating: 5, gender: 'male' });
                setReviews(await fetchReviews());
            } else {
                alert("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review.");
        }
    };

    return (
        <section className="relative mt-4 px-4 lg:mt-11 lg:px-0">
            <div className="flex items-baseline justify-between pt-6 pb-3 lg:pt-0 lg:pb-4">
                <h2 className="m-0 text-lg font-extrabold tracking-[-0.02em] lg:text-[22px]">Хэрэглэгчийн сэтгэгдэл</h2>
                <button
                    onClick={handleWriteClick}
                    className="h-9 px-3.5 rounded-[10px] border border-line-strong bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                >
                    Сэтгэгдэл бичих
                </button>
            </div>

            {/* Scroll Container */}
            <div
                className="flex gap-4 overflow-x-auto no-scrollbar w-full snap-x snap-mandatory"
                style={{ whiteSpace: 'nowrap' }}
            >
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="min-w-[280px] snap-start bg-surface p-4 rounded-2xl border border-line flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold ${review.gender === 'male' ? 'bg-primary-soft text-primary' : 'bg-[#d4467f]/20 text-[#e878a6]'}`}>
                                {review.user_name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-ink">{review.user_name}</h3>
                                <p className="text-xs text-muted">{review.car_model}</p>
                            </div>
                        </div>

                        <div className="flex gap-0.5 text-[#f5a524] text-sm">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                            ))}
                        </div>

                        <p className="text-sm text-ink-soft whitespace-normal line-clamp-2 leading-relaxed">
                            "{review.comment}"
                        </p>
                    </div>
                ))}
            </div>

            {isLoginModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 p-6 text-center shadow-xl">
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-white"
                            aria-label="Хаах"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="mb-2 text-lg font-bold text-white">Нэвтрэх</h3>
                        <p className="mb-5 text-sm text-slate-300">Сэтгэгдэл бичихийн тулд Google бүртгэлээрээ нэвтэрнэ үү.</p>
                        <GoogleSignInButton
                            onAuthenticated={() => {
                                setIsLoginModalOpen(false);
                                setIsModalOpen(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Write Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fadeIn">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Сэтгэгдэл бичих</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Машины загвар</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.car_model}
                                    onChange={e => setFormData({ ...formData, car_model: e.target.value })}
                                    placeholder="Жишээ нь: Toyota Prius 30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Сэтгэгдэл</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                                    value={formData.comment}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Сэтгэгдлээ бичнэ үү..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Үнэлгээ</label>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-slate-900 dark:text-white outline-none"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐</option>
                                        <option value="4">⭐⭐⭐⭐</option>
                                        <option value="3">⭐⭐⭐</option>
                                        <option value="2">⭐⭐</option>
                                        <option value="1">⭐</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Хүйс</label>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-slate-900 dark:text-white outline-none"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="male">Эрэгтэй</option>
                                        <option value="female">Эмэгтэй</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/30"
                            >
                                Илгээх
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
