import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { subscribeToAllListings } from '../services/listingService';
import { placeBid } from '../services/auctionService';
import { useTranslation } from 'react-i18next';
import DemandPostingForm from './DemandPostingForm';
import VerificationBadge from './trust/VerificationBadge';
import DisputeForm from './trust/DisputeForm';
import SMSDemo from './SMSDemo';
import PriceIntelligence from './PriceIntelligence';
import { MOCK_LISTINGS } from '../data/mockData';

export default function BuyerDashboard({ userData }) {
    const { t } = useTranslation();
    const [listings, setListings] = useState([]);
    const [showDemandForm, setShowDemandForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const [bidInputs, setBidInputs] = useState({}); // { listingId: amount }
    const [disputeItem, setDisputeItem] = useState(null); // Item being reported

    useEffect(() => {
        setLoading(true);
        try {
            const unsubscribe = subscribeToAllListings((data) => {
                if (data && data.length > 0) {
                    setListings(data);
                } else {
                    console.log("No live listings found, using demo data.");
                    setListings(MOCK_LISTINGS);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (err) {
            console.error("Firestore connection failed, using fallback:", err);
            setListings(MOCK_LISTINGS);
            setLoading(false);
        }
    }, []);

    const handleBid = async (listingId, currentHighest, bidValue) => {
        const amount = parseFloat(bidValue);
        if (isNaN(amount) || amount <= currentHighest) {
            alert(`Bid must be higher than ₹${currentHighest}`);
            return;
        }

        try {
            await placeBid(listingId, auth.currentUser.uid, userData.name, amount);
            alert("Bid placed successfully!");
            setBidInputs({ ...bidInputs, [listingId]: '' });
        } catch (err) {
            console.error("Bidding error:", err);
            alert("Failed to place bid.");
        }
    };

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
        <div className="buyer-portal animate-slide-up">
            <div className="portal-header">
                <div className="portal-title">
                    <h2>{t('buyer_portal')}</h2>
                    <p>
                        {t('connected_as')} <strong>{t(userData.entityType || 'buyer')}</strong>
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowDemandForm(!showDemandForm)} style={{ height: 'auto', padding: '16px 32px' }}>
                    {showDemandForm ? t('close') : t('post_demand')}
                </button>
            </div>

            {showDemandForm ? (
                <div className="animate-slide-down">
                    <DemandPostingForm userData={userData} onComplete={() => setShowDemandForm(false)} />
                </div>
            ) : disputeItem ? (
                <div className="animate-fade-in" style={{ padding: '40px 0' }}>
                    <DisputeForm
                        listingId={disputeItem.id}
                        reportedAgainstId={disputeItem.farmerId}
                        reportedAgainstName={disputeItem.farmerName}
                        onClose={() => setDisputeItem(null)}
                    />
                </div>
            ) : (
                <div className="marketplace-container">
                    {/* Professional Search & Filter Bar */}
                    <div className="filter-bar glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto auto', gap: '20px', alignItems: 'flex-end', padding: '32px', marginBottom: '40px' }}>
                        <div className="filter-group">
                            <label>{t('search_placeholder')}</label>
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>{t('location_label')}</label>
                            <input
                                type="text"
                                placeholder={t('state_district')}
                                value={locTerm}
                                onChange={(e) => setLocTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>{t('quality')}</label>
                            <select value={gradeTerm} onChange={(e) => setGradeTerm(e.target.value)}>
                                <option value="">{t('all_crops')}</option>
                                <option value="grade_a">{t('grade_a')}</option>
                                <option value="grade_b">{t('grade_b')}</option>
                                <option value="grade_c">{t('grade_c')}</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={applySearch} style={{ height: '52px', padding: '0 32px' }}>
                            {t('search_btn')}
                        </button>
                        <button className="btn btn-secondary" onClick={clearFilters} style={{ height: '52px', padding: '0 20px' }}>
                            Reset
                        </button>
                    </div>

                    {/* Decision Tools & Market Insight - For Consistency */}
                    <div className="portal-strategy-row animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '40px' }}>
                        <SMSDemo />
                        <PriceIntelligence />
                    </div>

                    <div className="listings-section glass-card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'Outfit' }}>{t('view_supply')}</h3>
                            <span className="status-badge" style={{ background: 'var(--panel)', padding: '6px 16px', borderRadius: '50px', color: 'var(--text-muted)' }}>
                                {t('showing')} {filteredListings.length} {t('offers')}
                            </span>
                        </div>

                        {filteredListings.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>{t('no_matching')} {t('adjust_filters')}</p>
                            </div>
                        ) : (
                            <div className="marketplace-grid">
                                {filteredListings.map(item => (
                                    <div key={item.id} className="market-card">
                                        <div className="market-card-header">
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span className="crop-tag">{item.cropType}</span>
                                                {item.auctionActive && <span className="urgent-badge" style={{ background: '#fef3c7', color: '#d97706' }}>{t('live')}</span>}
                                            </div>
                                            <span className={`grade-tag ${item.grade}`}>{t(item.grade).split(' ')[0]}</span>
                                        </div>
                                        <div className="market-card-body">
                                            <div className="quantity-info">
                                                <strong>{item.quantity}</strong>
                                                <span>{t('available')}</span>
                                            </div>
                                            <div className="price-info">
                                                <span className="price-label">{item.auctionActive ? t('current_bid') : t('rate_offer')}</span>
                                                <span className="price-value">₹{item.auctionActive ? item.highestBid : item.expectedPrice}</span>
                                            </div>
                                        </div>
                                        <div className="market-card-footer" style={{ flexDirection: item.auctionActive ? 'column' : 'row', gap: '12px', alignItems: 'stretch' }}>
                                            {item.auctionActive ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="number"
                                                        placeholder={`${t('min')} ₹${(item.highestBid || 0) + 1}`}
                                                        value={bidInputs[item.id] || ''}
                                                        onChange={(e) => setBidInputs({ ...bidInputs, [item.id]: e.target.value })}
                                                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                                                    />
                                                    <button
                                                        className="btn-buy-mini"
                                                        style={{ background: 'var(--secondary)', color: 'white', borderColor: 'var(--secondary)' }}
                                                        onClick={() => handleBid(item.id, item.highestBid, bidInputs[item.id])}
                                                    >
                                                        {t('place_bid')}
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="farmer-info">
                                                        <div className="avatar-micro">{item.farmerName.charAt(0)}</div>
                                                        <div className="farmer-details">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span className="name">{item.farmerName}</span>
                                                                <VerificationBadge verified={item.farmerVerified !== false} size="sm" />
                                                            </div>
                                                            <span className="loc">{item.location || t('rural_india')}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn-buy-mini">{t('contact')}</button>
                                                        <button
                                                            className="btn-buy-mini"
                                                            style={{ background: 'transparent', color: '#ef4444', borderColor: '#ef4444' }}
                                                            onClick={() => setDisputeItem(item)}
                                                        >
                                                            Report
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}
