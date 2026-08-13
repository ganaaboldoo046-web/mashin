import type { Product } from './storage';
import { fuelLabel } from './format';

export type FilterGroupKey = 'years' | 'miles' | 'prices' | 'fuels';

interface FilterOption {
    id: string;
    label: string;
    matches: (product: Product) => boolean;
}

export interface FilterGroup {
    key: FilterGroupKey;
    title: string;
    shortTitle: string;
    options: FilterOption[];
}

export const productYear = (product: Product) => Number(product.year.match(/(?:19|20)\d{2}/)?.[0] || 0);
export const productMileage = (product: Product) => Number(product.mileage.replace(/[^0-9]/g, '')) || 0;
export const productPriceMnt = (product: Product) => {
    const numeric = Number.parseFloat(product.price.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) return 0;
    return product.price.toLowerCase().includes('сая') ? numeric * 1_000_000 : numeric;
};

export const FILTER_GROUPS: FilterGroup[] = [
    {
        key: 'years',
        title: 'Үйлдвэрлэсэн он',
        shortTitle: 'Он',
        options: [
            { id: 'year-2020-plus', label: '2020 ба шинэ', matches: (product) => productYear(product) >= 2020 },
            { id: 'year-2015-2019', label: '2015–2019', matches: (product) => productYear(product) >= 2015 && productYear(product) <= 2019 },
            { id: 'year-before-2015', label: '2014 ба хуучин', matches: (product) => productYear(product) > 0 && productYear(product) < 2015 },
        ],
    },
    {
        key: 'miles',
        title: 'Гүйлт',
        shortTitle: 'Гүйлт',
        options: [
            { id: 'km-under-50000', label: '50,000 км хүртэл', matches: (product) => productMileage(product) < 50_000 },
            { id: 'km-50000-99999', label: '50,000–99,999 км', matches: (product) => productMileage(product) >= 50_000 && productMileage(product) < 100_000 },
            { id: 'km-100000-plus', label: '100,000 км-ээс дээш', matches: (product) => productMileage(product) >= 100_000 },
        ],
    },
    {
        key: 'prices',
        title: 'Үнэ',
        shortTitle: 'Үнэ',
        options: [
            { id: 'price-under-30m', label: '30 сая ₮ хүртэл', matches: (product) => productPriceMnt(product) < 30_000_000 },
            { id: 'price-30m-59999999', label: '30–59.9 сая ₮', matches: (product) => productPriceMnt(product) >= 30_000_000 && productPriceMnt(product) < 60_000_000 },
            { id: 'price-60m-plus', label: '60 сая ₮-өөс дээш', matches: (product) => productPriceMnt(product) >= 60_000_000 },
        ],
    },
    {
        key: 'fuels',
        title: 'Түлш',
        shortTitle: 'Түлш',
        options: ['Бензин', 'Дизель', 'Хайбрид', 'Цахилгаан', 'Газ'].map((label) => ({
            id: `fuel-${label}`,
            label,
            matches: (product: Product) => fuelLabel(product.fuel).toLocaleLowerCase('mn') === label.toLocaleLowerCase('mn'),
        })),
    },
];

export const filterOptionLabel = (groupKey: FilterGroupKey, optionId: string) =>
    FILTER_GROUPS.find((group) => group.key === groupKey)?.options.find((option) => option.id === optionId)?.label || optionId;

export const matchesFilter = (groupKey: FilterGroupKey, optionId: string, product: Product) =>
    FILTER_GROUPS.find((group) => group.key === groupKey)?.options.find((option) => option.id === optionId)?.matches(product) ?? true;
