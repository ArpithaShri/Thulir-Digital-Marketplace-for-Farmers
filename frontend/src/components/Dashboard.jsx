import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { getUserData } from '../services/userService';
import { useTranslation } from 'react-i18next';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import SMSDemo from './SMSDemo';
import PriceIntelligence from './PriceIntelligence';
import VerificationBadge from './trust/VerificationBadge';
import DisputesList from './trust/DisputesList';

export default function Dashboard({ user }) {
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('main'); // 'main' or 'disputes'

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData(user.uid);
                if (data) {
                    setUserData(data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading your space...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="loading-screen">
                <p>Profile not found. Try logging in again.</p>
                <button className="btn btn-primary" onClick={() => auth.signOut()} style={{ maxWidth: '200px', marginTop: '16px' }}>
                    {t('logout')}
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-app">
            {/* Top Navigation Bar */}
            <header className="dashboard-header glass-card animate-slide-down">
                <div className="brand">
                    <div className="logo-icon-wrapper">
                        <span className="logo-icon">🌿</span>
                    </div>
                    <div className="logo-name">
                        <h1 className="logo-text">Thulir</h1>
                        <span className="tagline">{t('rural_india')}</span>
                    </div>
                </div>

                <div className="main-nav">
                    <button
                        className={`nav-link ${view === 'main' ? 'active' : ''}`}
                        onClick={() => setView('main')}
                    >
                        <span>🏠</span> {t('home')}
                    </button>
                    <button
                        className={`nav-link ${view === 'disputes' ? 'active' : ''}`}
                        onClick={() => setView('disputes')}
                    >
                        <span>🛡️</span> {t('report_issue')}
                    </button>
                </div>

                <div className="user-nav">
                    <div className="user-profile-mini">
                        <div className="avatar-mini">
                            {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details-mini">
                            <div className="user-name-wrapper">
                                <span className="user-name">{userData.name}</span>
                                <VerificationBadge verified={userData.verified !== false} size="sm" />
                            </div>
                            <span className="user-role">{t(userData.role)} • {userData.location}</span>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={() => auth.signOut()}>
                        {t('logout')}
                    </button>
                </div>
            </header>

            <main className="dashboard-layout">
                {/* Main Content Area */}
                <div className="dashboard-content-area">
                    {view === 'main' ? (
                        userData.role === 'farmer' ? (
                            <FarmerDashboard userData={userData} />
                        ) : (
                            <BuyerDashboard userData={userData} />
                        )
                    ) : (
                        <div className="animate-fade-in">
                            <DisputesList isAdmin={true} /> {/* isAdmin={true} for demo convenience */}
                        </div>
                    )}
                </div>

                {/* Sidebar for Decision Support Tools */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-section">
                        <h4 className="section-title">Decision Tools</h4>
                        <SMSDemo />
                    </div>

                    <div className="sidebar-section">
                        <h4 className="section-title">Market Insight</h4>
                        <PriceIntelligence />
                    </div>
                </aside>
            </main>
        </div>
    );
}
