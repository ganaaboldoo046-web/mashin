import { useEffect, useState, useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

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
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null); // Google User Info
    const [formData, setFormData] = useState({
        car_model: '',
        comment: '',
        rating: 5,
        gender: 'male'
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Reviews
    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews_list');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setReviews(data);
                } else {
                    setReviews(MOCK_REVIEWS);
                }
            } else {
                setReviews(MOCK_REVIEWS);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews(MOCK_REVIEWS);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Auto Scroll Animation
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let scrollAmount = 0;
        const speed = 0.5;

        const step = () => {
            scrollAmount += speed;
            if (scrollContainer) {
                if (scrollAmount >= scrollContainer.scrollWidth / 2) {
                    scrollAmount = 0;
                }
                scrollContainer.scrollLeft = scrollAmount;
            }
            animationId = requestAnimationFrame(step);
        };

        animationId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationId);
    }, [reviews]); // Restart animation when reviews change

    // Google Login Logic
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userData = await res.json();
                setUserInfo(userData);
                setIsModalOpen(true); // Open modal after login
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                alert("로그인 정보를 가져오는데 실패했습니다.");
            }
        },
        onError: () => {
            console.error("Login Failed");
            alert("로그인에 실패했습니다.");
        }
    });

    const handleWriteClick = () => {
        if (userInfo) {
            setIsModalOpen(true);
        } else {
            login();
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
                    user_id: userInfo.sub, // Google unique ID
                    user_name: userInfo.name,
                    ...formData
                })
            });

            if (res.ok) {
                alert("Review submitted successfully!");
                setIsModalOpen(false);
                setFormData({ car_model: '', comment: '', rating: 5, gender: 'male' });
                fetchReviews(); // Refresh list
            } else {
                alert("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review.");
        }
    };

    return (
        <section className="mt-8 px-4 relative">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Хэрэглэгчийн сэтгэгдэл</h2>
                <button
                    onClick={handleWriteClick}
                    className="text-sm bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Сэтгэгдэл бичих
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-hidden w-full"
                style={{ whiteSpace: 'nowrap' }}
            >
                {/* Double the list to create seamless loop. Use mock if reviews empty */}
                {[...reviews, ...reviews].map((review, index) => (
                    <div
                        key={`${review.id}-${index}`}
                        className="min-w-[280px] bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${review.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                <span className="material-symbols-outlined text-2xl">
                                    {review.gender === 'male' ? 'face' : 'face_3'}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{review.user_name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{review.car_model}</p>
                            </div>
                        </div>

                        <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-sm filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {i < review.rating ? 'star' : 'star_border'}
                                </span>
                            ))}
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-normal line-clamp-2 leading-relaxed">
                            "{review.comment}"
                        </p>
                    </div>
                ))}
            </div>

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
