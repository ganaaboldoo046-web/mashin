import { useEffect, useState } from 'react';
import { getExchangeRate } from '../utils/storage';

/** 서버 환율을 읽어오고, 실패하면 로컬에 저장된 값으로 되돌아간다. */
export function useExchangeRate() {
    const [rate, setRate] = useState<number>(() => getExchangeRate().krwToMnt);

    useEffect(() => {
        let alive = true;
        fetch('/api/exchange_rate')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (alive && data && typeof data.rate === 'number') setRate(data.rate);
            })
            .catch(() => undefined);
        return () => {
            alive = false;
        };
    }, []);

    return rate;
}
