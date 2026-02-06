const BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:5000';

export const getPriceHistory = async (crop) => {
    try {
        const response = await fetch(`${BASE_URL}/price-history?crop=${crop}`);
        if (!response.ok) throw new Error('Failed to fetch price history');
        return await response.json();
    } catch (err) {
        console.error("Price History Error:", err);
        throw err;
    }
};

export const getPricePrediction = async (crop) => {
    try {
        const response = await fetch(`${BASE_URL}/price-predict?crop=${crop}`);
        if (!response.ok) throw new Error('Failed to fetch price prediction');
        return await response.json();
    } catch (err) {
        console.error("Price Prediction Error:", err);
        throw err;
    }
};
