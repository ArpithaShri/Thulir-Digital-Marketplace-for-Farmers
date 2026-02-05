import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';

export default function Dashboard({ user }) {
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
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {/* Shared Profile View */}
            <div className="profile-card glass-card">
                <div className="avatar">
                    {userData.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>{userData.name}</h2>
                        {userData.verified && (
                            <span className="verified-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Verified
                            </span>
                        )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} • {userData.location}
                    </p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => auth.signOut()}
                    style={{ marginLeft: 'auto', width: 'auto', padding: '8px 16px', fontSize: '0.875rem', background: 'transparent', border: '1px solid var(--border)' }}
                >
                    Logout
                </button>
            </div>

            {userData.role === 'farmer' ? (
                <FarmerDashboard userData={userData} />
            ) : (
                <BuyerDashboard userData={userData} />
            )}
        </div>
    );
}
