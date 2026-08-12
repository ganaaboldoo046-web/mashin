import type { Product } from './storage';

const FUEL_LABELS: Record<string, string> = {
    Petrol: 'Бензин',
    Diesel: 'Дизель',
    Hybrid: 'Хайбрид',
    Electric: 'Цахилгаан',
    Gas: 'Газ',
};

export const fuelLabel = (fuel?: string) => (fuel ? FUEL_LABELS[fuel] || fuel : '');

export const STATUS_LABELS: Record<Product['status'], string> = {
    active: 'Бэлэн',
    sold: 'Зарагдсан',
    pending: 'Хүлээгдэж буй',
    discounted: 'Хямдарсан',
};

/** "2017 · 15,000км · Бензин" — the one-line summary used on every card. */
export const carMeta = (product: Product) =>
    [product.year, product.mileage, fuelLabel(product.fuel)].filter(Boolean).join(' · ');

export const formatKRW = (value?: number) =>
    typeof value === 'number' ? `₩${value.toLocaleString('en-US')}` : '';
