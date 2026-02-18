export async function onRequestGet(context) {
    const { env } = context;
    const db = env.DB;

    // 1. Total Products
    const productsResult = await db.prepare(
        "SELECT COUNT(*) as count FROM products WHERE status != 'deleted'"
    ).first();
    const totalProducts = productsResult.count;

    // 2. New Orders (Pending)
    const ordersResult = await db.prepare(
        "SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'"
    ).first();
    const newOrders = ordersResult.count;

    // 3. Revenue (Completed orders * Product Price)
    // Note: Product price is text like '54.5 сая ₮', we need to parse it or use priceKRW if available.
    // For now, let's just count completed orders as a proxy or use a simple sum if possible.
    // A better way for now might be to just sum priceKRW of completed orders if we stored it, 
    // but reservations join products might be needed.

    // Let's try to get a rough revenue estimate from priceKRW of sold products
    // Assuming 'sold' status in products table means revenue.
    const revenueResult = await db.prepare(
        "SELECT SUM(priceKRW) as total FROM products WHERE status = 'sold'"
    ).first();
    const totalKRW = revenueResult.total || 0;

    // Convert to million KRW for display or just keep as is. 
    // The user screenshot shows "₮45.2M". Let's assume we want to show it in Tugrugs.
    // We need an exchange rate. 
    const exchangeRateResult = await db.prepare(
        "SELECT value FROM settings WHERE key = 'exchange_rate'"
    ).first();
    const exchangeRate = parseFloat(exchangeRateResult?.value || '2.5');

    // Calculate approx revenue in Million MNT
    // totalKRW is in Won. 1 KRW = exchangeRate MNT (approx, usually 1 KRW ~ 2.5 MNT)
    // If totalKRW is 10,000,000 KRW -> 25,000,000 MNT = 25M MNT.
    const revenueMNT = (totalKRW * exchangeRate);

    // Format: "45.2M ₮"
    const revenueFormatted = (revenueMNT / 1000000).toFixed(1) + 'M ₮';


    // 4. Total Visits (Mock for now, or use users count)
    const usersResult = await db.prepare(
        "SELECT COUNT(*) as count FROM users"
    ).first();
    const totalVisits = usersResult.count; // Using user count as a proxy for "visits/users"


    return new Response(JSON.stringify({
        totalProducts,
        newOrders,
        revenue: revenueFormatted,
        totalVisits
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
