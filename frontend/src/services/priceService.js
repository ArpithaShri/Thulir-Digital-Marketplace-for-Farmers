const BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:5000';

export const getPriceHistory = async (crop) => {
    try {
        const response = await fetch(`${BASE_URL}/price-history?crop=${crop}`);
        if (!response.ok) throw new Error('Failed to fetch price history');
        const data = await response.json();
        console.log(`[API Success] Price history for ${crop} loaded.`);
        return data;
    } catch (err) {
        console.error(`[API Failure] Price history Error: ${err.message}`);
        throw err;
    }
};

export const getPricePrediction = async (crop) => {
    try {
        const response = await fetch(`${BASE_URL}/price-predict?crop=${crop}`);
        if (!response.ok) throw new Error('Failed to fetch price prediction');
        const data = await response.json();
        console.log(`[API Success] Price prediction for ${crop} loaded.`);
        return data;
    } catch (err) {
        console.error(`[API Failure] Price prediction Error: ${err.message}`);
        throw err;
    }
};
