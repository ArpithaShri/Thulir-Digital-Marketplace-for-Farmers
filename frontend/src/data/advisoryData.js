export const SCHEMES = [
    {
        schemeId: 'pm_kisan_suraksha',
        schemeName: 'PM-Kisan Suraksha (Crop Insurance)',
        eligibleCrops: ['Rice', 'Wheat', 'Maize', 'Soybean'],
        eligibleStates: ['Tamil Nadu', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Coimbatore'],
        description: 'Covers crop failure due to natural calamities. Premium subsidized by 90% for small farmers.'
    },
    {
        schemeId: 'shc_subsidy',
        schemeName: 'Soil Health Card Subsidy',
        eligibleCrops: ['Any'],
        eligibleStates: ['Any'],
        description: 'Get 50% discount on organic fertilizers and soil testing services at government labs.'
    },
    {
        schemeId: 'tractor_grant',
        schemeName: 'SMAM Tractor Grant',
        eligibleCrops: ['Any'],
        eligibleStates: ['Tamil Nadu', 'Karnataka', 'Maharashtra'],
        description: 'Up to 40% subsidy for purchasing new tractors and farm machinery.'
    },
    {
        schemeId: 'horticulture_mission',
        schemeName: 'NHM Horticulture Grant',
        eligibleCrops: ['Tomato', 'Onion', 'Mango', 'Chilli'],
        eligibleStates: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
        description: 'Special funding for cold storage and warehouse construction.'
    }
];

export const ADVISORY_MESSAGES = [
    {
        messageId: 'price_up',
        crop: 'Rice',
        messageText: 'Market prices for Rice are trending up. Consider holding your stock for another 7-10 days for better returns.'
    },
    {
        messageId: 'demand_high',
        crop: 'Tomato',
        messageText: 'High demand detected in nearby urban centers. Instant liquidation recommended for current harvest.'
    },
    {
        messageId: 'weather_warning',
        crop: 'Any',
        messageText: 'Unseasonal rain predicted next week. Ensure proper storage covers for your stored inventory.'
    },
    {
        messageId: 'quality_tip',
        crop: 'Wheat',
        messageText: 'Standardize your packaging to Grade A norms to attract higher institutional buyers.'
    }
];
