import React, { useState } from 'react';
import { auth } from '../firebase';
import { createDemand } from '../services/demandService';
import { useTranslation } from 'react-i18next';

export default function DemandPostingForm({ userData, onComplete }) {
    const { t } = useTranslation();
    const [crop, setCrop] = useState('');
    const [quantity, setQuantity] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [targetPrice, setTargetPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createDemand({
                buyerId: auth.currentUser.uid,
                buyerName: userData.name,
                buyerVerified: userData.verified !== false,
                location: userData.location,
                cropType: crop,
                quantity: quantity,
                urgency: urgency,
                targetPrice: targetPrice
            });
            setCrop('');
            setQuantity('');
            setTargetPrice('');
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Demand posting error:", err);
            alert("Failed to post demand. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="demand-form-container glass-card animate-slide-down" style={{ padding: '40px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '14px' }}>📢</div>
                    {t('post_demand')}
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="listing-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                        <label>{t('crop_type')}</label>
                        <input
                            type="text"
                            placeholder="e.g. Wheat"
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('quantity')}</label>
                        <input
                            type="text"
                            placeholder="e.g. 5 Tons"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('urgency_label')}</label>
                        <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                            <option value="normal">{t('normal')}</option>
                            <option value="urgent">{t('urgent')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expected_price')}</label>
                        <input
                            type="text"
                            placeholder="e.g. ₹35,000/ton"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ height: '56px', marginTop: '16px' }}>
                    {loading ? t('entering') : t('submit_listing')}
                </button>
            </form>
        </div>
    );
}
