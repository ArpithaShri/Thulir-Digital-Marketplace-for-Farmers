import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import SMSDemo from './SMSDemo';

export default function Dashboard({ user }) {
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
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
            <header className="dashboard-header glass-card">
                <div className="brand">
                    <span className="logo-icon">🌿</span>
                    <h1 className="logo-text">Thulir</h1>
                </div>

                <div className="user-nav">
                    <div className="user-profile-mini">
                        <div className="avatar-mini">
                            {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details-mini">
                            <span className="user-name">{userData.name}</span>
                            <span className="user-role">{t(userData.role)}</span>
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
                    {userData.role === 'farmer' ? (
                        <FarmerDashboard userData={userData} />
                    ) : (
                        <BuyerDashboard userData={userData} />
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
                        <div className="insight-card glass-card">
                            <p style={{ fontSize: '0.85rem' }}>Top demand in your region: <strong>Tomatoes</strong></p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
