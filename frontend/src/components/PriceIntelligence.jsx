import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function PriceIntelligence() {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState('Rice');
    const [history, setHistory] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const crops = ['Rice', 'Wheat', 'Tomato'];

    useEffect(() => {
        fetchInsights();
    }, [selectedCrop]);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            // Fetch history
            const histRes = await fetch(`http://localhost:5000/price-history?crop=${selectedCrop}`);
            const histData = await histRes.json();
            setHistory(histData);

            // Fetch prediction
            const predRes = await fetch(`http://localhost:5000/price-predict?crop=${selectedCrop}`);
            const predData = await predRes.json();
            setPrediction(predData);
        } catch (err) {
            console.error("Failed to fetch price intelligence:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="price-intelligence-card glass-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📈</span> {t('market_trends')}
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
            ) : (
                <div className="intelligence-content">
                    {/* Prediction Panel */}
                    <div className="prediction-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div className="pred-item glass-card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(45, 90, 39, 0.05)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Next Month Projection</span>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', margin: '8px 0' }}>
                                ₹{prediction?.predicted_price}
                            </div>
                            <span className={`trend-badge ${prediction?.trend.toLowerCase()}`}>
                                {prediction?.trend === 'Upward' ? '↗️ Increasing' : '↘️ Decreasing'}
                            </span>
                        </div>
                        <div className="pred-item glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span className={`demand-indicator ${prediction?.demand_level.toLowerCase()}`}></span>
                                <strong style={{ fontSize: '0.9rem' }}>{prediction?.demand_level} Demand</strong>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
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
