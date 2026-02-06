import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import CropListingForm from './CropListingForm';
import VerificationBadge from './trust/VerificationBadge';
import DisputeForm from './trust/DisputeForm';

export default function FarmerDashboard({ userData }) {
    const { t } = useTranslation();
    const [listings, setListings] = useState([]);
    const [demands, setDemands] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'demands'
    const [disputeItem, setDisputeItem] = useState(null); // Item being reported

    useEffect(() => {
        if (!auth.currentUser) return;

        // Fetch My Listings
        const qList = query(
            collection(db, 'listings'),
            where('farmerId', '==', auth.currentUser.uid)
        );
        const unsubList = onSnapshot(qList, (snap) => {
            setListings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch Global Buyer Demands
        const qDemands = query(collection(db, 'demands'), orderBy('createdAt', 'desc'));
        const unsubDemands = onSnapshot(qDemands, (snap) => {
            setDemands(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubList(); unsubDemands(); };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Remove this listing?")) {
            await deleteDoc(doc(db, 'listings', id));
        }
    };

    const toggleStatus = async (item) => {
        const newStatus = item.status === 'available' ? 'sold' : 'available';
        await updateDoc(doc(db, 'listings', item.id), { status: newStatus });
    };

    const closeAuction = async (id) => {
        if (window.confirm("Stop bidding and close this auction?")) {
            await updateDoc(doc(db, 'listings', id), { auctionActive: false });
        }
    };

    return (
        <div className="farmer-portal">
            <div className="portal-header">
                <div className="portal-title">
                    <h2 style={{ fontSize: '2rem' }}>{t('farmer')} Portal</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage harvest and track market needs</p>
                </div>
                <div className="header-actions">
                    <div className="tab-switcher glass-card">
                        <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 My Inventory</button>
                        <button className={activeTab === 'demands' ? 'active' : ''} onClick={() => setActiveTab('demands')}>📢 Buyer Demands</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ width: 'auto', padding: '12px 24px' }}>
                        {showForm ? '← Close' : `➕ ${t('post_crop')}`}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-banner">
                <div className="stat-pill glass-card">
                    <span className="pill-icon">💰</span>
                    <div className="pill-text">
                        <span className="pill-label">Total Earnings</span>
                        <span className="pill-value">₹45,200</span>
                    </div>
                </div>
                <div className="stat-pill glass-card">
                    <span className="pill-icon">📦</span>
                    <div className="pill-text">
                        <span className="pill-label">Active Listings</span>
                        <span className="pill-value">{listings.length}</span>
                    </div>
                </div>
                <div className="stat-pill glass-card">
                    <span className="pill-icon">🔥</span>
                    <div className="pill-text">
                        <span className="pill-label">Open Demands</span>
                        <span className="pill-value">{demands.length}</span>
                    </div>
                </div>
            </div>

            <div className="portal-body">
                {showForm && (
                    <div className="form-section animate-slide-down" style={{ marginBottom: '40px' }}>
                        <CropListingForm userData={userData} onComplete={() => setShowForm(false)} />
                    </div>
                )}

                {disputeItem && (
                    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
                        <DisputeForm
                            listingId={disputeItem.id}
                            reportedAgainstId={disputeItem.buyerId}
                            reportedAgainstName={disputeItem.buyerName}
                            onClose={() => setDisputeItem(null)}
                        />
                    </div>
                )}

                {activeTab === 'inventory' ? (
                    <div className="listings-section glass-card">
                        <div className="card-header">
                            <h3 style={{ fontFamily: 'Outfit' }}>📜 {t('my_listings')}</h3>
                        </div>
                        {listings.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}><p>{t('no_listings')}</p></div>
                        ) : (
                            <div className="listings-list">
                                {listings.map(item => (
                                    <div key={item.id} className="listing-row">
                                        <div className="item-info">
                                            <h4>{item.cropType}</h4>
                                            <p>{item.quantity} • {t(item.grade)} • 📍 {item.location || 'Unknown'}</p>
                                        </div>
                                        <div className="item-meta">
                                            <div className="item-price">
                                                <strong>{item.expectedPrice}</strong>
                                                {item.auctionActive && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '700' }}>
                                                        Top Bid: ₹{item.highestBid}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`status-badge ${item.status}`}>{t(item.status)}</span>
                                        </div>
                                        <div className="item-actions">
                                            {item.auctionActive && (
                                                <button onClick={() => closeAuction(item.id)} className="btn-icon" title="Close Auction">🔨</button>
                                            )}
                                            <button onClick={() => toggleStatus(item)} className="btn-icon">
                                                {item.status === 'available' ? '✅' : '🔄'}
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn-icon delete">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="demands-section glass-card">
                        <div className="card-header">
                            <h3 style={{ fontFamily: 'Outfit' }}>📢 {t('view_demand')}</h3>
                        </div>
                        {demands.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}><p>{t('no_demands')}</p></div>
                        ) : (
                            <div className="listings-list">
                                {demands.map(item => (
                                    <div key={item.id} className="listing-row demand-row">
                                        <div className="item-info">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <h4>{item.cropType}</h4>
                                                {item.urgency === 'urgent' && <span className="urgent-badge">URGENT</span>}
                                            </div>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                                {item.quantity} • Needed by
                                                <strong>{item.buyerName}</strong>
                                                <VerificationBadge verified={item.buyerVerified !== false} size="sm" />
                                                ({t(item.entityType || 'buyer')})
                                            </p>
                                        </div>
                                        <div className="item-meta">
                                            <div className="item-price"><strong>Target: {item.targetPrice}</strong></div>
                                            <span className="location-tag">📍 {item.location}</span>
                                        </div>
                                        <div className="item-actions">
                                            <button className="btn-buy-mini" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>Offer</button>
                                            <button
                                                className="btn-icon"
                                                style={{ color: '#ef4444' }}
                                                onClick={() => setDisputeItem(item)}
                                                title="Report Issue"
                                            >
                                                🚩
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
