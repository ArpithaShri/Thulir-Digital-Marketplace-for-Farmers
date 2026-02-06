import React, { useState } from 'react';
import { auth } from '../firebase';
import { createListing } from '../services/listingService';
import { useTranslation } from 'react-i18next';

export default function CropListingForm({ userData, onComplete }) {
    const { t } = useTranslation();
    const [crop, setCrop] = useState('');
    const [quantity, setQuantity] = useState('');
    const [grade, setGrade] = useState('grade_a');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState(userData?.location || '');
    const [isAuction, setIsAuction] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

        try {
            await createListing({
                farmerId: auth.currentUser.uid,
                farmerName: userData?.name || 'Farmer',
                farmerVerified: userData?.verified !== false,
                cropType: crop,
                quantity: quantity,
                grade: grade,
                expectedPrice: price,
                basePrice: numericPrice || 0,
                highestBid: numericPrice || 0,
                auctionActive: isAuction,
                location: location
            });
            setCrop('');
            setQuantity('');
            setPrice('');
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Listing error:", err);
            alert("Failed to list crop. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crop-form-container glass-card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🌱</span> {t('post_crop')}
            </h3>
            <form onSubmit={handleSubmit} className="listing-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>{t('crop_type')}</label>
                        <input
                            type="text"
                            placeholder="e.g. Basmati Rice"
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('quantity')}</label>
                        <input
                            type="text"
                            placeholder="e.g. 500kg"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('quality')}</label>
                        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                            <option value="grade_a">{t('grade_a')}</option>
                            <option value="grade_b">{t('grade_b')}</option>
                            <option value="grade_c">{t('grade_c')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expected_price')}</label>
                        <input
                            type="text"
                            placeholder="e.g. ₹40/kg"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="auctionToggle"
                        checked={isAuction}
                        onChange={(e) => setIsAuction(e.target.checked)}
                        style={{ width: '20px', height: '20px' }}
                    />
                    <label htmlFor="auctionToggle" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>
                        {t('auction_mode')}
                    </label>
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>{t('location_label')}</label>
                    <input
                        type="text"
                        placeholder="e.g. Coimbatore, Tamil Nadu"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                    {loading ? t('entering') : t('submit_listing')}
                </button>
            </form>
        </div>
    );
}
