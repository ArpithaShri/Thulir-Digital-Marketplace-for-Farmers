import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import DisputesList from './trust/DisputesList';

export default function AdminDashboard({ userData }) {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalListings: 0,
        openDisputes: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const usersSnap = await getDocs(collection(db, 'users'));
            const listingsSnap = await getDocs(collection(db, 'listings'));
            const disputesSnap = await getDocs(query(collection(db, 'disputes'), where('status', '==', 'OPEN')));

            setStats({
                totalUsers: usersSnap.size,
                totalListings: listingsSnap.size,
                openDisputes: disputesSnap.size
            });
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-portal animate-slide-up">
            <div className="portal-header" style={{ marginBottom: '40px' }}>
                <div className="portal-title">
                    <h2>{t('admin_portal')}</h2>
                    <p>{t('system_overview_msg')}</p>
                </div>
            </div>

            <div className="stats-banner" style={{ marginBottom: '40px' }}>
                <div className="stat-pill glass-card">
                    <div className="pill-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>👥</div>
                    <div className="pill-text">
                        <span className="pill-label">{t('total_users')}</span>
                        <span className="pill-value">{stats.totalUsers}</span>
                    </div>
                </div>
                <div className="stat-pill glass-card">
                    <div className="pill-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>📦</div>
                    <div className="pill-text">
                        <span className="pill-label">{t('active_listings')}</span>
                        <span className="pill-value">{stats.totalListings}</span>
                    </div>
                </div>
                <div className="stat-pill glass-card">
                    <div className="pill-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>⚠️</div>
                    <div className="pill-text">
                        <span className="pill-label">{t('open_disputes')}</span>
                        <span className="pill-value">{stats.openDisputes}</span>
                    </div>
                </div>
            </div>

            <div className="admin-main-layout glass-card" style={{ padding: '32px' }}>
                <DisputesList isAdmin={true} />
            </div>
        </div>
    );
}
