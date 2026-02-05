import React from 'react';

export default function FarmerDashboard({ userData }) {
    return (
        <div className="dashboard-content">
            <header className="nav">
                <h2>Farmer Portal</h2>
                <span>Harvest Season 2026</span>
            </header>

            <div className="grid">
                <div className="stat-card glass-card">
                    <div className="stat-label">Active Listings</div>
                    <div className="stat-value">12</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-label">Recent Sales</div>
                    <div className="stat-value">₹45,200</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-label">Market Reach</div>
                    <div className="stat-value">Top 10%</div>
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px' }}>Manage Your Crops</h3>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No active listings yet. Start selling your fresh produce today!
                </div>
            </div>
        </div>
    );
}
