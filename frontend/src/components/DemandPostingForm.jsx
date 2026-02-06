import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
            await addDoc(collection(db, 'demands'), {
                buyerId: auth.currentUser.uid,
                buyerName: userData.name,
                buyerVerified: userData.verified !== false,
                location: userData.location,
                cropType: crop,
                quantity: quantity,
                urgency: urgency,
                targetPrice: targetPrice,
                status: 'open',
                createdAt: serverTimestamp()
            });
            setCrop('');
            setQuantity('');
            setTargetPrice('');
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Demand posting error:", err);
            alert("Failed to post demand.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="demand-form-container glass-card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📢</span> {t('post_demand')}
            </h3>
            <form onSubmit={handleSubmit} className="listing-form">
                <div className="form-grid">
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
                        <label>Urgency</label>
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
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                    {loading ? t('entering') : t('submit_listing')}
                </button>
            </form>
        </div>
    );
}
