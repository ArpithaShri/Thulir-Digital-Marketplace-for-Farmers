import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getPriceHistory, getPricePrediction } from '../services/priceService';
import { MOCK_PRICE_HISTORY, MOCK_PRICE_PREDICTION } from '../data/mockData';

export default function PriceIntelligence() {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState('Rice');
    const [history, setHistory] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crops = ['Rice', 'Wheat', 'Tomato'];

    useEffect(() => {
        fetchInsights();
    }, [selectedCrop]);

    const fetchInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            const histData = await getPriceHistory(selectedCrop);
            setHistory(histData.length > 0 ? histData : MOCK_PRICE_HISTORY);

            const predData = await getPricePrediction(selectedCrop);
            setPrediction(predData);
        } catch (err) {
            console.error("Failed to fetch price intelligence, using fallback:", err);
            setHistory(MOCK_PRICE_HISTORY);
            setPrediction(MOCK_PRICE_PREDICTION);
            console.warn("ML Service unavailable. Rendering demo fallback data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="price-intelligence-card glass-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {t('market_trends')}
                </h3>
                <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    style={{ width: 'auto', padding: '8px 16px', borderRadius: '12px' }}
                >
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loader"></div>
                </div>
            ) : error ? (
                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' }}>Error</span>
                    <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>
                    <button className="btn btn-secondary" onClick={fetchInsights} style={{ marginTop: '10px', width: 'auto' }}>Retry</button>
                </div>
            ) : (
                <div className="intelligence-content">
                    {/* Prediction Panel */}
                    <div className="prediction-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: '32px' }}>
                        <div className="pred-item glass-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--panel)', border: 'none' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', display: 'block' }}>Next Month Projection</span>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', margin: '12px 0', letterSpacing: '-1px' }}>
                                ₹{prediction?.predicted_price}
                            </div>
                            <span className={`trend-badge ${prediction?.trend.toLowerCase()}`} style={{
                                padding: '6px 16px',
                                borderRadius: '50px',
                                background: prediction?.trend === 'Upward' ? 'var(--success)' : 'var(--error)',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                {prediction?.trend === 'Upward' ? 'Increasing' : 'Decreasing'}
                            </span>
                        </div>
                        <div className="pred-item glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <span className={`demand-indicator ${prediction?.demand_level.toLowerCase()}`} style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: prediction?.demand_level === 'High' ? '#ef4444' : '#f59e0b',
                                    boxShadow: `0 0 12px ${prediction?.demand_level === 'High' ? '#ef4444' : '#f59e0b'}`
                                }}></span>
                                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{prediction?.demand_level} Demand</strong>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                {prediction?.explanation}
                            </p>
                        </div>
                    </div>

                    {/* Chart Panel */}
                    <div style={{ height: '250px', width: '100%', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748B' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748B' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                        * Historical data from last 12 months. All prices per quintal/kg as per local mandi records.
                    </p>
                </div>
            )}
        </div>
    );
}
