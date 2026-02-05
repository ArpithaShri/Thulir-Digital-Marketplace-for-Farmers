import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import DemandPostingForm from './DemandPostingForm';

export default function BuyerDashboard({ userData }) {
    const { t } = useTranslation();
    const [listings, setListings] = useState([]);
    const [showDemandForm, setShowDemandForm] = useState(false);

    // UI Local state for inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [locTerm, setLocTerm] = useState('');
    const [gradeTerm, setGradeTerm] = useState('');

    // Active filter state (applied only on button click)
    const [activeFilters, setActiveFilters] = useState({
        crop: '',
        location: '',
        grade: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const applySearch = () => {
        setActiveFilters({
            crop: searchTerm,
            location: locTerm,
            grade: gradeTerm
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLocTerm('');
        setGradeTerm('');
        setActiveFilters({ crop: '', location: '', grade: '' });
    };

    const filteredListings = listings.filter(item => {
        const matchesCrop = item.cropType.toLowerCase().includes(activeFilters.crop.toLowerCase());
        const matchesLocation = item.location ? item.location.toLowerCase().includes(activeFilters.location.toLowerCase()) : true;
        const matchesGrade = activeFilters.grade ? item.grade === activeFilters.grade : true;
        const isAvailable = item.status === 'available';
        return matchesCrop && matchesLocation && matchesGrade && isAvailable;
    });

    return (
        <div className="buyer-portal">
            <div className="portal-header">
                <div className="portal-title">
                    <h2 style={{ fontSize: '2rem' }}>{t('buyer_portal')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Connected as: <strong>{t(userData.entityType || 'buyer')}</strong>
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowDemandForm(!showDemandForm)} style={{ width: 'auto', padding: '12px 24px' }}>
                    {showDemandForm ? '← Back to Market' : `➕ ${t('post_demand')}`}
                </button>
            </div>

            {showDemandForm ? (
                <div className="animate-slide-down">
                    <DemandPostingForm userData={userData} onComplete={() => setShowDemandForm(false)} />
                </div>
            ) : (
                <div className="marketplace-container">
                    {/* Professional Search & Filter Bar */}
                    <div className="filter-bar glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: '16px', alignItems: 'flex-end' }}>
                        <div className="filter-group">
                            <label>🔍 {t('search_placeholder')}</label>
                            <input
                                type="text"
                                placeholder="Search crops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>📍 {t('location_label')}</label>
                            <input
                                type="text"
                                placeholder="State or District"
                                value={locTerm}
                                onChange={(e) => setLocTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>💎 {t('quality')}</label>
                            <select value={gradeTerm} onChange={(e) => setGradeTerm(e.target.value)}>
                                <option value="">{t('all_crops')}</option>
                                <option value="grade_a">{t('grade_a')}</option>
                                <option value="grade_b">{t('grade_b')}</option>
                                <option value="grade_c">{t('grade_c')}</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={applySearch} style={{ width: 'auto', padding: '14px 24px', borderRadius: '16px' }}>
                            Search
                        </button>
                        <button className="btn btn-secondary" onClick={clearFilters} style={{ width: 'auto', padding: '14px', borderRadius: '16px' }}>
                            🔄
                        </button>
                    </div>

                    <div className="listings-section glass-card" style={{ marginTop: '32px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'Outfit' }}>🌾 {t('view_supply')}</h3>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Showing {filteredListings.length} farmer offers
                            </span>
                        </div>

                        {filteredListings.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No matching produce found. Try adjusting your search filters.</p>
                            </div>
                        ) : (
                            <div className="marketplace-grid">
                                {filteredListings.map(item => (
                                    <div key={item.id} className="market-card">
                                        <div className="market-card-header">
                                            <span className="crop-tag">{item.cropType}</span>
                                            <span className={`grade-tag ${item.grade}`}>{t(item.grade).split(' ')[0]}</span>
                                        </div>
                                        <div className="market-card-body">
                                            <div className="quantity-info">
                                                <strong>{item.quantity}</strong>
                                                <span>available</span>
                                            </div>
                                            <div className="price-info">
                                                <span className="price-label">Rate Offer</span>
                                                <span className="price-value">{item.expectedPrice}</span>
                                            </div>
                                        </div>
                                        <div className="market-card-footer">
                                            <div className="farmer-info">
                                                <div className="avatar-micro">{item.farmerName.charAt(0)}</div>
                                                <div className="farmer-details">
                                                    <span className="name">{item.farmerName}</span>
                                                    <span className="loc">📍 {item.location || 'Rural India'}</span>
                                                </div>
                                            </div>
                                            <button className="btn-buy-mini">Contact Farmer</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
