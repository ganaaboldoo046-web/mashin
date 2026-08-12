import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import BottomNav from '../components/BottomNav';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function Saved() {
    const [savedProducts, setSavedProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);

    useEffect(() => {
        const loadSaved = async () => {
            const allProducts = await getProducts();
            const ids = getSavedIds();
            setSavedIds(ids);
            setSavedProducts(allProducts.filter((p) => ids.includes(p.id)));
        };

        loadSaved();
        window.addEventListener('storageSaved', loadSaved);
        return () => window.removeEventListener('storageSaved', loadSaved);
    }, []);

    return (
        <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
            <Header />
            <TopTicker />

            <main className="px-4 pt-4 pb-6 lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-8 lg:pb-20">
                <h1 className="hidden lg:block m-0 mb-1.5 text-[30px] font-extrabold tracking-[-0.03em]">Хадгалсан зар</h1>
                <p className="hidden lg:block m-0 mb-7 text-[14.5px] text-muted">
                    {savedProducts.length} зар хадгалсан байна.
                </p>

                {savedProducts.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-3 lg:hidden">
                            {savedProducts.map((product) => (
                                <CarCard key={product.id} product={product} variant="row" savedIds={savedIds} />
                            ))}
                        </div>
                        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
                            {savedProducts.map((product) => (
                                <CarCard key={product.id} product={product} savedIds={savedIds} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-surface border border-line rounded-2xl px-5 py-16 text-center">
                        <div className="text-[26px] text-[#cbd2dc]">♡</div>
                        <div className="mt-3 text-[15px] font-extrabold">Хадгалсан зар байхгүй</div>
                        <div className="mt-1.5 text-[13px] text-muted">Таалагдсан машиныг ♡ дарж хадгална уу.</div>
                        <Link
                            to="/search"
                            className="mt-[18px] inline-flex items-center h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold hover:text-white"
                        >
                            Машин үзэх
                        </Link>
                    </div>
                )}
            </main>

            <div className="hidden lg:block">
                <Footer />
            </div>
            <BottomNav />
        </div>
    );
}
