import React from 'react';

export default function BuyerDashboard({ userData }) {
    return (
        <div className="dashboard-content">
            <header className="nav">
                <h2>Buyer Marketplace</h2>
                <span>Fresh from local farms</span>
            </header>

            <div className="grid">
                <div className="stat-card glass-card">
                    <div className="stat-label">Pending Orders</div>
                    <div className="stat-value">3</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-label">Total Spent</div>
                    <div className="stat-value">₹12,850</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-label">Trusted Farms</div>
                    <div className="stat-value">8</div>
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px' }}>Available Produce</h3>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Browsing farms near {userData.location}...
                </div>
            </div>
        </div>
    );
}
