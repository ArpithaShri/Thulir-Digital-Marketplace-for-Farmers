export const MOCK_LISTINGS = [
    {
        id: 'mock-lst-1',
        cropType: 'Basmati Rice',
        quantity: '500 kg',
        grade: 'grade_a',
        location: 'Karnal, Haryana',
        expectedPrice: '₹85/kg',
        status: 'available',
        farmerId: 'farmer-123',
        farmerName: 'Rajesh Kumar',
        farmerVerified: true,
        createdAt: new Date().toISOString(),
        auctionActive: true,
        highestBid: 82,
        highestBidder: 'GrainCorp Ind'
    },
    {
        id: 'mock-lst-2',
        cropType: 'Sona Masuri',
        quantity: '1200 kg',
        grade: 'grade_b',
        location: 'Raichur, Karnataka',
        expectedPrice: '₹52/kg',
        status: 'available',
        farmerId: 'farmer-123',
        farmerName: 'Rajesh Kumar',
        farmerVerified: true,
        createdAt: new Date().toISOString(),
        auctionActive: false
    }
];

export const MOCK_DEMANDS = [
    {
        id: 'mock-dem-1',
        cropType: 'Wheat',
        quantity: '2 Tons',
        urgency: 'urgent',
        buyerName: 'BigBasket Logistics',
        buyerVerified: true,
        entityType: 'buyer',
        targetPrice: '₹28/kg',
        location: 'Indore, MP',
        createdAt: new Date().toISOString(),
        status: 'open'
    },
    {
        id: 'mock-dem-2',
        cropType: 'Tomato',
        quantity: '300 kg',
        urgency: 'normal',
        buyerName: 'FreshToHome',
        buyerVerified: true,
        entityType: 'buyer',
        targetPrice: '₹40/kg',
        location: 'Kolar, Karnataka',
        createdAt: new Date().toISOString(),
        status: 'open'
    }
];

export const MOCK_PRICE_HISTORY = [
    { date: '2025-03', crop: 'Rice', price: 4200 },
    { date: '2025-04', crop: 'Rice', price: 4350 },
    { date: '2025-05', crop: 'Rice', price: 4100 },
    { date: '2025-06', crop: 'Rice', price: 4400 },
    { date: '2025-07', crop: 'Rice', price: 4600 },
    { date: '2025-08', crop: 'Rice', price: 4550 },
    { date: '2025-09', crop: 'Rice', price: 4700 },
    { date: '2025-10', crop: 'Rice', price: 4850 },
    { date: '2025-11', crop: 'Rice', price: 4900 },
    { date: '2025-12', crop: 'Rice', price: 5100 },
    { date: '2026-01', crop: 'Rice', price: 5050 },
    { date: '2026-02', crop: 'Rice', price: 5200 }
];

export const MOCK_PRICE_PREDICTION = {
    crop: 'Rice',
    predicted_price: 5350.25,
    trend: 'Upward',
    demand_level: 'High',
    explanation: 'Based on 12 months of historical data, we observed an upward trend. The linear regression model projects the price based on consistent market momentum and seasonal demand spikes.'
};
